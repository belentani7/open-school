/* ===================================================================
   TUTOR — modo privado por defecto, modelo opcional.

   Las preguntas se orientan en el navegador. Solo con consentimiento
   explícito se envían al endpoint POST /api/tutor, servido por Ollama
   según la configuración de la instalación. Si no está disponible,
   se usa el enrutador determinista del catálogo.
   =================================================================== */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Glass } from "../components/Glass";
import { ROUTES, TOTALS } from "../lib/catalog";
import { buildTutorMessages } from "../lib/tutorConsent";

type Msg = {
  id: number;
  from: "tutor" | "tu";
  text: string;
  routes?: string[];
  /** True only for messages sent while the person had opted into Ollama. */
  modelConsent?: boolean;
};

const SUGGESTIONS = [
  "¿Por dónde empiezo si no sé nada?",
  "Quiero algo que funcione sin internet",
  "¿Qué ruta da certificado?",
  "¿Guardáis mis datos?",
];

/** Enrutador de intencion por palabras clave. Determinista y auditable. */
export function answer(input: string): { text: string; routes?: string[] } {
  const q = input.toLowerCase();

  if (/dato|privacidad|registr|rastre|cookie/.test(q)) {
    return {
      text: "Por defecto, el progreso se queda en este dispositivo y la orientación se responde en el navegador. Si activas Ollama, solo se envían las preguntas escritas en ese modo y el historial generado con él; las preguntas del modo privado no se comparten. El texto se procesa en el backend de esta instalación. No incluyas datos sensibles; el audio nunca se envía.",
    };
  }

  if (/offline|sin internet|sin conexi|sin datos|descarg/.test(q)) {
    const offline = ROUTES.filter((r) => r.offline);
    return {
      text: `${offline.length} de las ${TOTALS.routes} rutas se descargan y siguen funcionando sin conexión: ${offline
        .map((r) => r.title)
        .join(", ")}.`,
      routes: offline.map((r) => r.id),
    };
  }

  if (/certific|titul|diploma|acredit/.test(q)) {
    const cert = ROUTES.filter((r) => r.certified);
    return {
      text: `El catálogo contempla certificación futura en ${cert.length} rutas: ${cert
        .map((r) => r.title)
        .join(", ")}. Open School todavía no emite ni verifica certificados. Puedes estudiar y guardar progreso local sin presentar ese avance como un título oficial.`,
      routes: cert.map((r) => r.id),
    };
  }

  if (/salud|m[eé]dic|diagn[oó]s|tratamiento|s[ií]ntoma/.test(q)) {
    return {
      text: "Puedo ayudarte a encontrar aprendizaje general sobre fuentes fiables, privacidad y preparación de preguntas en la Plaza Educativa, apartado Salud y orientación segura. No interpreto síntomas, no diagnostico ni recomiendo tratamientos. Para decisiones individuales consulta a profesionales sanitarios; si se trata de una emergencia, usa los servicios de emergencia de tu localidad.",
    };
  }

  if (/empez|principiante|cero|nuevo|basic|no s[eé]/.test(q)) {
    const easy = ROUTES.filter((r) => r.level === "A1");
    return {
      text: `Para empezar de cero, las rutas de nivel A1 no dan nada por sabido: ${easy
        .map((r) => r.title)
        .join(
          " y ",
        )}. Si acabas de llegar a España, Manos Abiertas es la más urgente; Lingua Aberta es la más útil a medio plazo.`,
      routes: easy.map((r) => r.id),
    };
  }

  if (/segur|privac|hack|ciber|proteg/.test(q)) {
    return {
      text: "Secure-T cubre seguridad digital aplicada a situaciones reales: dispositivos compartidos, documentación, banca y fronteras. Son 69 módulos y funciona sin conexión.",
      routes: ["secure-t"],
    };
  }

  if (/idioma|lengua|hablar|español|catal|portug/.test(q)) {
    return {
      text: "Lingua Aberta trabaja la fonética contrastiva entre portugués, español y catalán. El reconocimiento de voz corre en tu navegador: el audio no se sube a ningún sitio.",
      routes: ["lingua-aberta"],
    };
  }

  // Fallback: decir la verdad en lugar de improvisar.
  return {
    text: "No tengo un modelo de lenguaje conectado en este despliegue, así que no puedo improvisar una respuesta. Lo que sí puedo hacer es orientarte por el catálogo: pregúntame por nivel, idioma, certificados o funcionamiento sin conexión.",
  };
}

/** Llama al tutor IA del backend; null si no está disponible. */
async function askTutor(history: Msg[]): Promise<string | null> {
  try {
    const res = await fetch("/api/tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: buildTutorMessages(history),
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { reply?: string };
    return typeof data.reply === "string" && data.reply.trim()
      ? data.reply
      : null;
  } catch {
    return null;
  }
}

export function Chat() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 0,
      from: "tutor",
      text: "Te oriento por el catálogo. Por defecto, la pregunta se responde en este dispositivo; el modelo de la instalación es opcional.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [useLocalModel, setUseLocalModel] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs]);

  const send = async (text: string) => {
    const clean = text.trim();
    if (!clean || busy) return;

    const mine: Msg = {
      id: nextId.current++,
      from: "tu",
      text: clean,
      modelConsent: useLocalModel,
    };
    const history = [...msgs, mine];
    setMsgs(history);
    setDraft("");
    setBusy(true);

    let reply: { text: string; routes?: string[] };
    const ai = useLocalModel ? await askTutor(history) : null;
    reply = ai !== null ? { text: ai } : answer(clean);

    setMsgs((m) => [
      ...m,
      {
        id: nextId.current++,
        from: "tutor",
        ...reply,
        modelConsent: ai !== null,
      },
    ]);
    setBusy(false);
  };

  return (
    <div
      className="bay shell stack stack--lg"
      style={{ paddingTop: "clamp(7rem, 16vh, 11rem)" }}
    >
      <header className="stack stack--sm">
        <p className="t-label">Tutor</p>
        <h1 className="t-display" style={{ maxWidth: "13ch" }}>
          Pregunta lo que sea
        </h1>
        <p className="t-lede">
          Orientación por catálogo, sin enviar tus preguntas por defecto. El
          modelo Ollama de esta instalación es opcional.
        </p>
        <p className="t-body">¿Prefieres estudiar con ejercicios? <Link href="/plaza">Ir a la Plaza Educativa: 20 unidades evaluables</Link>.</p>
        <label
          className="row"
          style={{
            alignItems: "flex-start",
            gap: "0.7rem",
            maxWidth: "60ch",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={useLocalModel}
            onChange={(event) => setUseLocalModel(event.target.checked)}
            style={{
              width: "1.2rem",
              height: "1.2rem",
              marginTop: "0.15rem",
              flex: "0 0 auto",
            }}
          />
          <span style={{ lineHeight: 1.5 }}>
            <strong>
              Enviar preguntas al modelo Ollama de esta instalación
            </strong>
            <span style={{ display: "block", opacity: 0.78 }}>
              Desactivado por defecto. Solo se envían al backend las preguntas
              escritas en este modo y las respuestas del modelo; las escritas en
              modo privado no se comparten. No incluyas datos sensibles.
            </span>
          </span>
        </label>
      </header>

      <Glass refract style={{ padding: "clamp(1.2rem, 3vw, 2rem)" }}>
        <div className="stack">
          <div
            className="chat__log"
            role="log"
            aria-live="polite"
            aria-label="Conversación con el tutor"
          >
            {msgs.map((m) => (
              <div key={m.id} className={`chat__row chat__row--${m.from}`}>
                <div className={`chat__bubble chat__bubble--${m.from}`}>
                  <p className="t-label" style={{ marginBottom: "0.4rem" }}>
                    {m.from === "tutor" ? "Tutor" : "Tú"}
                  </p>
                  <p style={{ margin: 0, lineHeight: 1.6 }}>{m.text}</p>

                  {m.routes && m.routes.length > 0 && (
                    <div
                      className="row"
                      style={{ gap: "0.4rem", marginTop: "0.85rem" }}
                    >
                      {m.routes.map((rid) => {
                        const r = ROUTES.find((x) => x.id === rid);
                        return r ? (
                          <Link
                            key={rid}
                            href={`/courses/${rid}`}
                            className="chip chip--edge"
                          >
                            {r.title} →
                          </Link>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="row" style={{ gap: "0.4rem" }}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                className="chip"
                onClick={() => send(s)}
                style={{ cursor: "pointer" }}
              >
                {s}
              </button>
            ))}
          </div>

          <form
            className="row"
            style={{ gap: "0.6rem", flexWrap: "nowrap" }}
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
          >
            <label htmlFor="draft" className="sr-only">
              Escribe tu pregunta
            </label>
            <input
              id="draft"
              className="field"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Escribe tu pregunta…"
              autoComplete="off"
            />
            <button
              type="submit"
              className="btn btn--light"
              disabled={busy || !draft.trim()}
            >
              {busy ? "…" : "Enviar"}
            </button>
          </form>
        </div>
      </Glass>
    </div>
  );
}
