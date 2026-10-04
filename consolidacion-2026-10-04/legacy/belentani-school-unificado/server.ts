import express from "express";
import http from "http";
import path from "path";
import fs from "fs";
import os from "os";
import { execFile } from "child_process";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Modality, type LiveServerMessage } from "@google/genai";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
// Bind loopback by default; set HOST=0.0.0.0 explicitly to expose on the LAN.
const HOST = process.env.HOST || "127.0.0.1";

// Bounded payload limit for base64 audio/image uploads (was 50mb).
const BODY_LIMIT = process.env.BODY_LIMIT || "15mb";
app.use(express.json({ limit: BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: BODY_LIMIT }));

// Baseline security headers (no external deps).
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "microphone=(self), camera=(), geolocation=(self)");
  next();
});

// Minimal in-memory rate limiter for API routes (per client IP, no external deps).
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = Number(process.env.RATE_MAX) || 120;
const rateBuckets = new Map<string, { count: number; reset: number }>();
app.use("/api", (req, res, next) => {
  const key = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const bucket = rateBuckets.get(key);
  if (!bucket || now > bucket.reset) {
    rateBuckets.set(key, { count: 1, reset: now + RATE_WINDOW_MS });
  } else if (bucket.count >= RATE_MAX) {
    res.status(429).json({ error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." });
    return;
  } else {
    bucket.count++;
  }
  next();
});

// Lazy-initialized Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!genAIClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      genAIClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return genAIClient;
}

// Python execution isolation settings. The child process must NOT inherit secrets.
const PYTHON_BIN = process.env.PYTHON_BIN || (process.platform === "win32" ? "python" : "python3");
const PYTHON_ENV: NodeJS.ProcessEnv = {
  PATH: process.env.PATH,
  SystemRoot: process.env.SystemRoot,
  TEMP: process.env.TEMP,
  TMP: process.env.TMP,
  LANG: process.env.LANG,
  PYTHONIOENCODING: "utf-8",
};
const MAX_PARALLEL_PYTHON = Number(process.env.MAX_PARALLEL_PYTHON) || 4;
let runningPython = 0;

// System prompts for specialized roles
const ROLES_PROMPTS: Record<string, string> = {
  belentani: `Eres Belentani, el guerrero, cantante y tutor de Belentani School.
Tienes melena castaña rizada, barba completa y vistes armadura carmesí con brillo de luz líquida.
Tu alumno es William Danilo, brasileño de 14 años en 3º de ESO en Cataluña/España.
Misiones:
1. Acogida cultural y empatía profunda: explícale las costumbres españolas y catalanas, música (rumba, samba, flamenco), vida en el instituto.
2. Método contrastivo Portugués -> Español -> Catalán: detecta y corrige falsos amigos con calidez.
3. Motivación épica: combina estudio con energía arcade y musical.
4. Tono: Cercano, enérgico, juvenil y protector.`,

  math_master: `Eres el Catedrático de Matemáticas y Lógica de Belentani School.
Especialista en el currículo LOMLOE de 3º y 4º de ESO:
1. Álgebra: resolución paso a paso de ecuaciones de 1º y 2º grado, sistemas de ecuaciones, monomios y polinomios.
2. Geometría: Teorema de Pitágoras, áreas y volúmenes, trigonometría básica.
3. Metodología: Explica con claridad cristalina paso a paso, usando la analogía de la balanza para despejar incógnitas.`,

  linguist: `Eres el Filólogo y Especialista en Lenguas Románicas de Belentani School.
Misión: Guiar la transición lingüística del portugués brasileño nativo hacia el español y el catalán, además de inglés ESO.
1. Falsos amigos prioritarios (Portugués vs Español): 'embaraçada', 'oficina', 'esquisito', 'propina', 'vassoura', 'sobrenome'.
2. Català para la ESO: normas de apostrofació (l'institut, d'acord), pronoms febles básicos y fonética.
3. Inglés: vocabulario de 3º ESO y estructuras gramaticales.`,

  arcade_coach: `Eres el Entrenador de Competición y Estrategia Arcade de Belentani School.
Misión: Conectar el aprendizaje y la concentración con los 500 minijuegos clásicos (Pong, Breakout, Snake, Space Invaders, etc.).
1. Enseña algoritmos, patrones de movimiento, optimización de puntuación y reflejos.
2. Fomenta el juego limpio, la deportividad y la superación de marcas.`
};

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY 
  });
});

// Python 3.10 Real Execution Endpoint (sandboxed to a temp file, timeout + destructive-pattern guard)
app.post("/api/python/execute", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || typeof code !== "string") {
      res.status(400).json({ success: false, error: "Código Python requerido", stdout: "" });
      return;
    }

    // Safety checks against destructive system calls. This is a basic guard, not a real
    // sandbox — do not expose this endpoint on a public/untrusted deployment without a
    // proper container/sandbox (e.g. nsjail, gVisor, a disposable container per request).
    const forbiddenPatterns = [
      /rm\s+-rf/,
      /shutil\.rmtree/,
      /os\.system\(['"]rm/,
      /subprocess\.call\(['"]rm/,
      /open\(['"]\/etc/,
      /shutdown/i
    ];

    for (const pattern of forbiddenPatterns) {
      if (pattern.test(code)) {
        res.status(403).json({
          success: false,
          error: "Operación no permitida por razones de seguridad escolar",
          stdout: "❌ [BLINDAJE ESCOLAR] Ejecución cancelada: comando potencialmente peligroso bloqueado."
        });
        return;
      }
    }

    if (runningPython >= MAX_PARALLEL_PYTHON) {
      res.status(429).json({ success: false, error: "Demasiadas ejecuciones simultáneas. Intenta de nuevo.", stdout: "" });
      return;
    }

    const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "belentani_py_"));
    const tmpFile = path.join(tmpDir, "main.py");
    const startTime = Date.now();

    await fs.promises.writeFile(tmpFile, code, { encoding: "utf-8", flag: "wx" });
    runningPython++;

    execFile(PYTHON_BIN, [tmpFile], {
      timeout: 8000,
      maxBuffer: 2 * 1024 * 1024,
      cwd: tmpDir,
      env: PYTHON_ENV
    }, async (error, stdout, stderr) => {
      runningPython--;
      const executionTimeMs = Date.now() - startTime;
      try {
        await fs.promises.unlink(tmpFile);
        await fs.promises.rmdir(tmpDir);
      } catch (_) {}

      if (error && (error as any).killed) {
        res.json({
          success: false,
          stdout: stdout || "",
          stderr: "⚠️ Tiempo límite excedido (Timeout 8s). Revisa si existe un bucle 'while' o 'for' infinito.",
          executionTimeMs,
          returnCode: -1
        });
        return;
      }

      res.json({
        success: !error,
        stdout: stdout || (error ? "" : ">>> Proceso ejecutado con éxito sin salida en consola."),
        stderr: stderr || (error ? error.message : ""),
        executionTimeMs,
        returnCode: error ? ((error as any).code || 1) : 0
      });
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message, stdout: "" });
  }
});

// 1. Gemini Chat Endpoint (Multi-turn, role-based, multi-model with Search and Maps Grounding)
// Supports: gemini-3.1-pro-preview (complex tasks), gemini-3.5-flash (general), gemini-3.1-flash-lite (fast)
app.post(["/api/chat", "/api/gemini/chat"], async (req, res) => {
  try {
    const { 
      message, 
      history = [], 
      model = "gemini-3.5-flash", 
      role = "belentani",
      language = "es",
      enableSearchGrounding = false,
      enableMapsGrounding = false,
      userLocation = { latitude: 41.3879, longitude: 2.16992 } // Barcelona default
    } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Mensaje requerido" });
      return;
    }

    const ai = getGeminiClient();
    const systemPrompt = ROLES_PROMPTS[role] || ROLES_PROMPTS.belentani;

    if (!ai) {
      // High-quality fallback for seamless preview
      const fallbackReplies: Record<string, string> = {
        belentani: `¡Hola Danilo! ⚔️🎵 Soy Belentani. Sobre "${message}": recuerda que en 3º de ESO tu lengua materna te da una ventaja enorme, pero cuidado con falsos amigos como 'esquisito' (en español significa delicioso/refinado, no raro). ¡Ánimo con el estudio!`,
        math_master: `Paso a paso para "${message}": Recuerda que para resolver una ecuación, todo lo que suma pasa al otro miembro restando, y lo que multiplica pasa dividiendo. ¡Mantén equilibrada la balanza! ⚖️📐`,
        linguist: `Análisis lingüístico de "${message}": En portugués decimos 'sobrenome', pero en castellano es 'apellido' y en català 'cognom'. ¡Excelente deducción comparativa! 📖🗣️`,
        arcade_coach: `Estrategia de juego para "${message}": Anticipa la trayectoria de la bola o nave con 2 pasos de margen. ¡La concentración matemática mejora tus reflejos arcade! 🕹️⚡`
      };

      res.json({
        reply: fallbackReplies[role] || fallbackReplies.belentani,
        simulated: true,
        modelUsed: model,
        groundingChunks: []
      });
      return;
    }

    // Configure tools if grounding is requested
    const tools: any[] = [];
    let toolConfig: any = undefined;

    if (enableSearchGrounding) {
      tools.push({ googleSearch: {} });
    }
    if (enableMapsGrounding) {
      tools.push({ googleMaps: {} });
      toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: userLocation?.latitude || 41.3879,
            longitude: userLocation?.longitude || 2.16992
          }
        }
      };
    }

    // Prepare contents array for multi-turn dialogue
    const formattedContents: any[] = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-10)) {
        formattedContents.push({
          role: item.sender === "user" ? "user" : "model",
          parts: [{ text: item.text }]
        });
      }
    }
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: model || "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        topP: 0.95,
        ...(tools.length > 0 ? { tools } : {}),
        ...(toolConfig ? { toolConfig } : {})
      }
    });

    const reply = response.text || "¡Mensaje recibido con éxito!";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    res.json({ reply, simulated: false, modelUsed: model, groundingChunks });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ 
      error: "Error al procesar la respuesta con el tutor IA",
      message: error?.message || "Error desconocido",
      fallbackReply: "¡Tranquilo Danilo! He tenido una interferencia en la señal estelar, pero la perseverancia es el superpoder del guerrero."
    });
  }
});

// 1.1 Dedicated Search Grounding Endpoint (model: gemini-3.5-flash with googleSearch tool)
app.post("/api/gemini/grounded-search", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== "string") {
      res.status(400).json({ error: "Query de búsqueda requerida" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.json({
        answer: `Información de investigación sobre "${query}": En el currículo de 3º de ESO en Cataluña y España (LOMLOE), las materias fundamentales comprenden Matemáticas (álgebra y funciones), Biología y Geología, Física y Química, Lengua Castellana, Llengua Catalana e Inglés.`,
        sources: [
          { title: "Departament d'Educació de Catalunya", uri: "https://educacio.gencat.cat" },
          { title: "Ministerio de Educación y Formación Profesional", uri: "https://www.educacionfpydeportes.gob.es" }
        ],
        simulated: true,
        modelUsed: "gemini-3.5-flash"
      });
      return;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "Eres el Asistente de Investigación y Validación LOMLOE de Belentani School. Responde con datos actualizados, objetivos y contrastados, adaptados a un estudiante de 14 años en 3º de ESO en España."
      }
    });

    const answer = response.text || "No se obtuvieron resultados.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract clean web sources
    const sources = chunks
      .filter((c: any) => c.web)
      .map((c: any) => ({
        title: c.web.title || "Fuente Web",
        uri: c.web.uri || "#"
      }));

    res.json({
      answer,
      sources,
      groundingChunks: chunks,
      simulated: false,
      modelUsed: "gemini-3.5-flash"
    });
  } catch (error: any) {
    console.error("Grounded search error:", error);
    res.status(500).json({
      error: "Error en búsqueda conectada con Google Search",
      message: error?.message
    });
  }
});

// 1.2 Dedicated Google Maps Grounding Endpoint (model: gemini-3.5-flash with googleMaps tool)
app.post("/api/gemini/grounded-maps", async (req, res) => {
  try {
    const { query, latitude = 41.3879, longitude = 2.16992 } = req.body;
    if (!query || typeof query !== "string") {
      res.status(400).json({ error: "Query de ubicación requerida" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.json({
        answer: `Puntos de interés escolar y cultural cerca de Barcelona para "${query}": Biblioteca Pública Jaume Fuster, CosmoCaixa Barcelona (Museo de la Ciencia) y centros educativos de secundaria.`,
        places: [
          { title: "CosmoCaixa Barcelona", uri: "https://maps.google.com/?cid=12345" },
          { title: "Biblioteca Jaume Fuster", uri: "https://maps.google.com/?cid=67890" }
        ],
        simulated: true,
        modelUsed: "gemini-3.5-flash"
      });
      return;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: query,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: Number(latitude),
              longitude: Number(longitude)
            }
          }
        }
      }
    });

    const answer = response.text || "No se obtuvieron ubicaciones en Google Maps.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Extract places and URLs from maps grounding chunks
    const places = chunks
      .filter((c: any) => c.maps)
      .map((c: any) => ({
        title: c.maps.title || "Ubicación en Google Maps",
        uri: c.maps.uri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
        snippets: c.maps.placeAnswerSources?.reviewSnippets || []
      }));

    res.json({
      answer,
      places,
      groundingChunks: chunks,
      simulated: false,
      modelUsed: "gemini-3.5-flash"
    });
  } catch (error: any) {
    console.error("Grounded maps error:", error);
    res.status(500).json({
      error: "Error en mapas conectados con Google Maps",
      message: error?.message
    });
  }
});

// 2. Audio Transcription Endpoint (model: gemini-3.5-transcribe)
app.post("/api/gemini/transcribe", async (req, res) => {
  try {
    const { audioBase64, mimeType = "audio/webm", title = "Grabación de Voz" } = req.body;

    if (!audioBase64) {
      res.status(400).json({ error: "audioBase64 es requerido" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.json({
        transcript: "Transcripción de prueba: 'Profesor Belentani, hoy he practicado las ecuaciones de segundo grado y el vocabulario de falsos amigos entre portugués y catalán.'",
        summary: "Resumen de audio: Repaso diario de álgebra y lengua de 3º ESO.",
        simulated: true,
        modelUsed: "gemini-3.5-transcribe"
      });
      return;
    }

    const audioPart = {
      inlineData: {
        mimeType,
        data: audioBase64
      }
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-transcribe",
      contents: {
        parts: [
          audioPart,
          { text: "Transcribe this audio verbatim in its original spoken language (Spanish, Portuguese, Catalan, or English). If there are false friends or academic concepts, briefly add a note at the end." }
        ]
      }
    });

    const transcript = response.text || "Audio procesado sin texto detectable.";
    res.json({ transcript, simulated: false, modelUsed: "gemini-3.5-transcribe", title });
  } catch (error: any) {
    console.error("Transcription error:", error);
    res.status(500).json({ 
      error: "Error transcribiendo audio", 
      message: error?.message,
      fallbackTranscript: "No se ha podido procesar el archivo de audio con el modelo de transcripción."
    });
  }
});

// 3. Create & Edit Images Endpoint (model: gemini-3.1-flash-image-preview)
app.post("/api/gemini/generate-image", async (req, res) => {
  try {
    const { prompt, base64InputImage, mimeType = "image/png", aspectRatio = "1:1", mode = "create" } = req.body;

    if (!prompt) {
      res.status(400).json({ error: "Prompt de imagen requerido" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Return high-quality educational illustration fallback
      res.json({
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
        prompt,
        description: `Ilustración conceptual generada para: "${prompt}".`,
        simulated: true,
        modelUsed: "gemini-3.1-flash-image-preview"
      });
      return;
    }

    let contentsParts: any[] = [];
    if (mode === "edit" && base64InputImage) {
      contentsParts = [
        {
          inlineData: {
            data: base64InputImage,
            mimeType: mimeType || "image/png"
          }
        },
        { text: prompt }
      ];
    } else {
      contentsParts = [{ text: prompt }];
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: { parts: contentsParts },
      config: {
        imageConfig: {
          aspectRatio: (aspectRatio as any) || "1:1",
        }
      }
    });

    let imageUrl = "";
    let captionText = "";

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const base64Data = part.inlineData.data;
          const mime = part.inlineData.mimeType || "image/png";
          imageUrl = `data:${mime};base64,${base64Data}`;
        } else if (part.text) {
          captionText += part.text;
        }
      }
    }

    if (!imageUrl) {
      // If the model returned only text description
      imageUrl = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80";
    }

    res.json({
      imageUrl,
      caption: captionText || prompt,
      simulated: false,
      modelUsed: "gemini-3.1-flash-image-preview"
    });
  } catch (error: any) {
    console.error("Image generation error:", error);
    res.status(500).json({ 
      error: "Error generando imagen con Gemini", 
      message: error?.message,
      fallbackUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80"
    });
  }
});

// 4. Music Generation Endpoint (lyria-3-clip-preview & lyria-3-pro-preview)
app.post("/api/gemini/generate-music", async (req, res) => {
  try {
    const { prompt, modelType = "clip", base64ImageData, mimeType = "image/jpeg" } = req.body;

    if (!prompt) {
      res.status(400).json({ error: "Prompt musical requerido" });
      return;
    }

    const modelName = modelType === "pro" ? "lyria-3-pro-preview" : "lyria-3-clip-preview";
    const ai = getGeminiClient();

    if (!ai) {
      res.json({
        simulated: true,
        modelUsed: modelName,
        lyrics: `[Estribillo - Belentani School]\nDanilo en 3º de ESO con fuerza y compás,\nEl álgebra y el catalán pronto vencerás.\n¡Espada de luz, ritmo en el corazón,\nBelentani te guía en cada lección!`,
        message: "Generación musical simulada. Configura GEMINI_API_KEY para síntesis con Lyria.",
        demoAudio: true
      });
      return;
    }

    let contentsPayload: any;
    if (base64ImageData) {
      contentsPayload = {
        parts: [
          { text: prompt },
          { inlineData: { data: base64ImageData, mimeType } }
        ]
      };
    } else {
      contentsPayload = prompt;
    }

    const response = await ai.models.generateContentStream({
      model: modelName,
      contents: contentsPayload,
    });

    let audioBase64 = "";
    let lyrics = "";
    let detectedMimeType = "audio/wav";

    for await (const chunk of response) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            detectedMimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    res.json({
      audioBase64,
      mimeType: detectedMimeType,
      lyrics: lyrics || `Pista instrumental: ${prompt}`,
      modelUsed: modelName,
      simulated: false
    });
  } catch (error: any) {
    console.error("Music generation error:", error);
    res.status(500).json({ 
      error: "Error generando música con Lyria", 
      message: error?.message,
      fallbackLyrics: "Tema musical de Belentani: Coraje, amistad y estudio."
    });
  }
});

// Setup Live API WebSocket server
function setupLiveWebSocket(server: http.Server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    try {
      const pathname = new URL(request.url || "", `http://${request.headers.host}`).pathname;
      if (pathname !== "/api/live-ws") {
        socket.destroy();
        return;
      }
      // Same-origin only: blocks Cross-Site WebSocket Hijacking.
      const origin = request.headers.origin;
      if (origin) {
        let originHost = "";
        try {
          originHost = new URL(origin).host;
        } catch {
          originHost = "";
        }
        if (originHost !== request.headers.host) {
          socket.destroy();
          return;
        }
      }
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    } catch {
      socket.destroy();
    }
  });

  wss.on("connection", async (clientWs: WebSocket) => {
    console.log("Cliente conectado a WebSocket de Live API");
    const ai = getGeminiClient();

    if (!ai) {
      clientWs.send(JSON.stringify({ 
        type: "status", 
        text: "Modo voz en vivo activado con síntesis de audio local (Configura GEMINI_API_KEY para Live API directo)." 
      }));
      clientWs.close();
      return;
    }

    try {
      const session = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Zephyr" }
            }
          },
          systemInstruction: ROLES_PROMPTS.belentani
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ audio }));
            }
            if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
          onclose: () => {
            console.log("Sesión Gemini Live cerrada por el servidor.");
          }
        }
      });

      clientWs.on("message", (raw) => {
        try {
          const data = JSON.parse(raw.toString());
          if (data.audio) {
            session.sendRealtimeInput({
              audio: { data: data.audio, mimeType: "audio/pcm;rate=16000" }
            });
          }
        } catch (e) {
          console.error("Error transmitiendo PCM al modelo:", e);
        }
      });

      clientWs.on("close", () => {
        try {
          session.close();
        } catch (e) {}
      });
    } catch (err: any) {
      console.error("Error al conectar con gemini-3.1-flash-live-preview:", err);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({ error: "No se pudo iniciar la sesión de voz en vivo: " + err.message }));
      }
    }
  });
}

// Start server with Vite middleware in dev or static files in prod
async function startServer() {
  const server = http.createServer(app);

  setupLiveWebSocket(server);

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, HOST, () => {
    console.log(`Belentani School full-stack server running on http://${HOST}:${PORT}`);
  });
}

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

startServer().catch((err) => {
  console.error("Fatal error starting server:", err);
  process.exit(1);
});
