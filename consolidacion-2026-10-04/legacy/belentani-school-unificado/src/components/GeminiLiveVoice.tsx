import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Radio, 
  ShieldCheck, 
  Heart, 
  RefreshCw, 
  PhoneCall, 
  PhoneOff, 
  Languages, 
  HelpCircle,
  Play,
  RotateCcw,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { float32ToPcm16Base64, base64PcmToAudioBuffer } from '../utils/pcmAudio';
import { speakBelentani, stopSpeaking, playSoundSuccess, playSoundTone, playSoundError } from '../utils/speech';

export const GeminiLiveVoice: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [liveInterimSpeech, setLiveInterimSpeech] = useState('');
  const [statusMessage, setStatusMessage] = useState('Pulsa "Activar Micrófono y Escucha en Vivo" para empezar.');
  const [micVolume, setMicVolume] = useState(0);
  const [selectedLanguageMode, setSelectedLanguageMode] = useState<'bridge' | 'es' | 'ca' | 'pt'>('bridge');

  const [transcriptLog, setTranscriptLog] = useState<{ 
    sender: 'danilo' | 'astra'; 
    text: string; 
    time: string;
    languageScaffold?: { pt: string; es: string; ca: string };
  }[]>([
    {
      sender: 'astra',
      text: '¡Hola William Danilo! ⚔️🎙️ Bienvenido a la conversación en vivo real de Belentani School. Habla normalmente por tu micrófono: no necesitas escribir nada. Te escucho en portugués, castellano o catalán.',
      time: 'Inicio',
      languageScaffold: {
        pt: 'Fale à vontade no seu ritmo. Estou ouvindo a sua voz.',
        es: 'Habla con tranquilidad a tu ritmo. Estoy escuchando tu voz.',
        ca: 'Parla tranquil·lament al teu ritme. Estic escoltant la teva veu.'
      }
    }
  ]);

  // Audio contexts and stream refs
  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const recognitionRef = useRef<any>(null);
  const isMutedRef = useRef(false);
  isMutedRef.current = isMuted;
  const isSpeakingRef = useRef(false);
  isSpeakingRef.current = isSpeaking;
  const isConnectedRef = useRef(false);
  isConnectedRef.current = isConnected;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endLiveSession();
    };
  }, []);

  // Initialize Native Browser Speech Recognition for fluid real-time transcription
  const initSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API not natively supported on this browser.');
      return null;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      // Multi-lingual recognition: Default to Spanish with high tolerance for Portuguese/Catalan
      recognition.lang = selectedLanguageMode === 'pt' ? 'pt-BR' : selectedLanguageMode === 'ca' ? 'ca-ES' : 'es-ES';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        if (isMutedRef.current) return;

        // If the AI is currently speaking and Danilo begins speaking, automatically INTERRUPT!
        if (isSpeakingRef.current) {
          handleInterrupt();
        }

        let interim = '';
        let finalPhrase = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalPhrase += transcriptPiece;
          } else {
            interim += transcriptPiece;
          }
        }

        setLiveInterimSpeech(interim);

        if (finalPhrase.trim().length > 1) {
          setLiveInterimSpeech('');
          handleUserSpokenMessage(finalPhrase.trim());
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.warn('SpeechRecognition notice:', event.error);
        }
      };

      recognition.onend = () => {
        // Automatically keep alive if session is active and not muted
        if (isConnectedRef.current && !isMutedRef.current) {
          try {
            recognition.start();
          } catch (e) {}
        } else {
          setIsListening(false);
        }
      };

      return recognition;
    } catch (e) {
      console.warn('Error starting speech recognition:', e);
      return null;
    }
  };

  const startLiveSession = async () => {
    setIsConnecting(true);
    setStatusMessage('Iniciando micrófono y conectando escucha en vivo...');
    playSoundTone(523.25, 0.08, 'sine', 0.1);

    try {
      // 1. Audio Contexts
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioCtx({ sampleRate: 16000 });
      const outputCtx = new AudioCtx({ sampleRate: 24000 });
      inputAudioCtxRef.current = inputCtx;
      outputAudioCtxRef.current = outputCtx;
      nextStartTimeRef.current = outputCtx.currentTime;

      // 2. Request user microphone
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      mediaStreamRef.current = stream;

      // 3. Audio Level Meter Visualizer
      const sourceNode = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(2048, 1, 1);
      scriptProcessorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (isMutedRef.current) {
          setMicVolume(0);
          return;
        }
        const inputData = e.inputBuffer.getChannelData(0);
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += Math.abs(inputData[i]);
        }
        const avg = sum / inputData.length;
        const volumeLevel = Math.min(100, Math.round(avg * 500));
        setMicVolume(volumeLevel);

        // Send to Live WebSocket if open
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && volumeLevel > 5) {
          const base64Audio = float32ToPcm16Base64(inputData);
          wsRef.current.send(JSON.stringify({ audio: base64Audio }));
        }
      };

      sourceNode.connect(processor);
      processor.connect(inputCtx.destination);

      // 4. Try Live WebSocket (gemini-3.1-flash-live-preview)
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live-ws`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        // WebSocket connected
      };

      // Recover from dropped/failed sockets instead of staying stuck "connected".
      ws.onclose = () => {
        if (wsRef.current === ws) {
          endLiveSession();
          setStatusMessage('● Conexión en vivo finalizada. Pulsa para reactivar.');
        }
      };

      ws.onerror = () => {
        if (wsRef.current === ws) {
          console.warn('Live WebSocket error; cerrando sesión.');
        }
      };

      ws.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.audio && outputCtx) {
            setIsSpeaking(true);
            const audioBuffer = base64PcmToAudioBuffer(outputCtx, msg.audio, 24000);
            const source = outputCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputCtx.destination);
            const now = outputCtx.currentTime;
            const startTime = Math.max(now, nextStartTimeRef.current);
            source.start(startTime);
            nextStartTimeRef.current = startTime + audioBuffer.duration;
            source.onended = () => {
              if (outputCtx.currentTime >= nextStartTimeRef.current - 0.05) {
                setIsSpeaking(false);
              }
            };
          }
          if (msg.interrupted) {
            handleInterrupt();
          }
        } catch (e) {}
      };

      // 5. Start browser Speech Recognition loop
      const rec = initSpeechRecognition();
      recognitionRef.current = rec;
      if (rec) {
        try {
          rec.start();
        } catch (e) {}
      }

      setIsConnected(true);
      setIsConnecting(false);
      setIsListening(true);
      setStatusMessage('● Micrófono activo · Escuchando... (Habla cuando quieras)');
      playSoundSuccess();

    } catch (err: any) {
      console.warn('Live session init fallback:', err);
      // Fallback: Still activate speech recognition and text-to-speech
      setIsConnected(true);
      setIsConnecting(false);
      setIsListening(true);
      setStatusMessage('● Micrófono activo · Escuchando... (Modo voz asistido)');
      const rec = initSpeechRecognition();
      recognitionRef.current = rec;
      if (rec) {
        try {
          rec.start();
        } catch (e) {}
      }
      playSoundSuccess();
    }
  };

  const endLiveSession = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close();
      outputAudioCtxRef.current = null;
    }
    stopSpeaking();
    setIsConnected(false);
    setIsConnecting(false);
    setIsListening(false);
    setIsSpeaking(false);
    setMicVolume(0);
    setLiveInterimSpeech('');
    setStatusMessage('Sesión finalizada. Pulsa para reactivar.');
  };

  // Immediate interruption: When Danilo speaks or clicks interrupt, cut audio immediately
  const handleInterrupt = () => {
    stopSpeaking();
    setIsSpeaking(false);
    playSoundTone(440, 0.04, 'triangle', 0.08);

    if (outputAudioCtxRef.current) {
      nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
    }
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ interrupted: true }));
    }
    setStatusMessage('● Te he escuchado. Habla, Danilo, te atiendo...');
  };

  // Dynamic Language Bridge Handler
  const handleUserSpokenMessage = (messageText: string) => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add user question to transcript
    setTranscriptLog(prev => [
      ...prev,
      { sender: 'danilo', text: messageText, time: timeString }
    ]);

    setStatusMessage(`Astra pensando respuesta a: "${messageText}"...`);

    // 2. Intelligent Language Bridge Prompt
    const bridgeSystemPrompt = 
      `Eres Astra, el tutor personal de Belentani School para William Danilo, un alumno de 14 años que ha llegado de Brasil a España/Catalunya en 3º de ESO.
       INSTRUCCIONES CLAVE:
       1. Si Danilo habla en portugués o pregunta por una duda de idioma o clase, dale una respuesta cercana y clara, usando el puente contrastivo:
          - Explica primero con empatía usando la raíz en Portugués si ayuda.
          - Muestra la forma habitual en Castellano (España).
          - Si aplica al entorno escolar de Cataluña, enseña la expresión en Català.
       2. Tono: Cálido, directo, sin frases condescendientes ni falsas alabanzas. Sé conciso y claro para que la respuesta hablada sea natural de escuchar.`;

    fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: messageText,
        model: 'gemini-3.5-flash',
        role: 'belentani',
        systemPrompt: bridgeSystemPrompt,
        history: transcriptLog.slice(-6).map(t => ({
          sender: t.sender === 'danilo' ? 'user' : 'model',
          text: t.text
        }))
      })
    })
      .then(res => res.json())
      .then(data => {
        const reply = data.reply || data.fallbackReply || generateLocalBridgeReply(messageText);
        
        // Generate scaffold if applicable
        const scaffold = extractLanguageScaffold(messageText, reply);

        setTranscriptLog(prev => [
          ...prev,
          { 
            sender: 'astra', 
            text: reply, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            languageScaffold: scaffold
          }
        ]);

        setStatusMessage('● Astra respondiendo por voz...');
        setIsSpeaking(true);

        // Speak reply using the natural audio engine
        speakBelentani(reply, {
          lang: selectedLanguageMode === 'pt' ? 'pt' : selectedLanguageMode === 'ca' ? 'ca' : 'es',
          rate: 0.94,
          onEnd: () => {
            setIsSpeaking(false);
            setStatusMessage('● Micrófono activo · Escuchando... (Habla cuando quieras)');
          }
        });
      })
      .catch(err => {
        console.warn(err);
        const localReply = generateLocalBridgeReply(messageText);
        setTranscriptLog(prev => [
          ...prev,
          { 
            sender: 'astra', 
            text: localReply, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          }
        ]);
        speakBelentani(localReply, {
          lang: 'es',
          onEnd: () => {
            setIsSpeaking(false);
            setStatusMessage('● Micrófono activo · Escuchando...');
          }
        });
      });
  };

  // Local fallback logic for instant responses on key common questions
  const generateLocalBridgeReply = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('haver de') || q.includes('haber de')) {
      return "Vale, Danilo. En catalán 'haver de' significa tener que u obligación. En portugués dices 'ter que' (ex: 'eu tenho que estudar'). En castellano dices 'tengo que estudiar', y en catalán dices 'he d'estudiar'. ¿Lo ves? No es difícil, es casi lo mismo.";
    }
    if (q.includes('esquisito') || q.includes('falso amigo')) {
      return "¡Cuidado con 'esquisito', Danilo! En Brasil 'esquisito' significa raro o extraño. Pero en España 'exquisito' significa delicioso o de altísima calidad. Si la comida del comedor está buena, ¡puedes decir que está exquisita!";
    }
    if (q.includes('recreo') || q.includes('patio') || q.includes('esbarjo')) {
      return "En el instituto en Cataluña al recreo le llaman 'el pati' o 'l'esbarjo'. Suele durar 30 minutos a media mañana. Es el mejor momento para charlar, jugar al fútbol o comerte el bocata.";
    }
    if (q.includes('ecuacion') || q.includes('equaç') || q.includes('segundo grado')) {
      return "Las ecuaciones de segundo grado tienen la forma a equis al cuadrado más b equis más c igual a cero. La clave es el discriminante delta: si b al cuadrado menos cuatro ac es positivo, tendrás dos soluciones reales distintas.";
    }
    return `Te entiendo perfectamente, Danilo. En 3º de ESO lo más importante es no quedarte con la duda: si el profesor va rápido, levantas la mano y dices '¿puede repetir ese paso, por favor?'. Te ayudaré con cada concepto paso a paso.`;
  };

  const extractLanguageScaffold = (query: string, reply: string) => {
    const q = query.toLowerCase();
    if (q.includes('haver de') || reply.includes('haver de')) {
      return {
        pt: 'Ter que / Dever (Ex: "Tenho que fazer a lição")',
        es: 'Tener que (Ex: "Tengo que hacer los deberes")',
        ca: 'Haver de (Ex: "He de fer els deures")'
      };
    }
    if (q.includes('esquisito') || reply.includes('exquisito')) {
      return {
        pt: 'Esquisito = Estranho, esquisito',
        es: 'Exquisito = Delicioso, refinado, excelente',
        ca: 'Exquisit = Molt bo, de gran qualitat'
      };
    }
    if (q.includes('oficina') || reply.includes('taller')) {
      return {
        pt: 'Oficina = Lugar onde consertam carros ou máquinas',
        es: 'Oficina = Despacho o lugar de trabajo administrativo (el taller es mecánico)',
        ca: 'Oficina = Despatx de treball administratiu'
      };
    }
    return undefined;
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Live Voice Stage Card */}
      <div className="rounded-3xl p-6 sm:p-8 text-white border border-rose-500/30 shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#120b18] via-[#0d0915] to-[#07070e]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            {/* Reactive Voice Orb / Avatar */}
            <div className="relative shrink-0">
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-gradient-to-br from-rose-600 via-red-600 to-amber-600 shadow-xl ${
                isSpeaking 
                  ? 'border-rose-400 scale-105 ring-8 ring-rose-500/30 animate-pulse' 
                  : isListening 
                    ? 'border-emerald-400 ring-4 ring-emerald-500/25' 
                    : 'border-white/20'
              }`}>
                <img 
                  src="/assets/belentani.jpg" 
                  alt="Belentani Tutor" 
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              </div>

              {/* Status Dot */}
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md bg-slate-900 border border-slate-700">
                <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-emerald-400 animate-ping' : isSpeaking ? 'bg-rose-400 animate-bounce' : 'bg-slate-500'}`} />
                <span className={isListening ? 'text-emerald-300' : isSpeaking ? 'text-rose-300' : 'text-slate-400'}>
                  {isSpeaking ? 'HABLANDO' : isListening ? 'ESCUCHANDO' : 'OFFLINE'}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-black border border-rose-500/30 uppercase tracking-wide">
                  🎙️ CONVERSACIÓN EN VIVO
                </span>
                <span className="text-xs text-slate-400">Escucha continua bidireccional</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                Habla normalmente con Astra. No necesitas escribir.
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                El micrófono permanece activo. Cuando hables en portugués, castellano o catalán, tu tutor te responderá directamente con locución fluida. Si quieres cortarle, simplemente habla o pulsa <em>Interrumpir</em>.
              </p>
            </div>
          </div>

          {/* Primary Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {!isConnected ? (
              <button
                onClick={startLiveSession}
                disabled={isConnecting}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:brightness-110 text-white font-black text-xs shadow-xl shadow-rose-900/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 border border-rose-400/30 cursor-pointer"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Conectando micrófono...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    <span>Activar Micrófono y Escucha en Vivo</span>
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {/* Mute Button */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isMuted 
                      ? 'bg-amber-600 text-white border-amber-400 ring-2 ring-amber-400/40' 
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                  title={isMuted ? "Reanudar micrófono" : "Pausar micrófono"}
                >
                  {isMuted ? <MicOff className="w-4 h-4 text-amber-200" /> : <Mic className="w-4 h-4 text-emerald-400" />}
                </button>

                {/* Immediate Interrupt Button */}
                {isSpeaking && (
                  <button
                    onClick={handleInterrupt}
                    className="px-4 py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 shadow-lg animate-pulse flex items-center gap-1.5 cursor-pointer"
                    title="Cortar la voz de Astra y hablar tú"
                  >
                    <span>⏹️ Interrumpir</span>
                  </button>
                )}

                {/* Disconnect Button */}
                <button
                  onClick={endLiveSession}
                  className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-rose-950/80 text-rose-300 border border-rose-700/40 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>Desactivar</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Audio Visualizer Bar & Real-time Interim Transcription */}
        <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-slate-400 flex items-center gap-1">
                <Radio className={`w-3.5 h-3.5 ${isListening ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                <span>Nivel Micrófono:</span>
              </span>
              <div className="flex-1 sm:w-44 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700 p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full transition-all duration-75"
                  style={{ width: `${isConnected && !isMuted ? Math.max(5, micVolume) : 0}%` }}
                />
              </div>
              <span className="text-slate-300 font-mono text-[11px] w-8">
                {isConnected && !isMuted ? `${micVolume}%` : '0%'}
              </span>
            </div>

            <div className="text-slate-200 font-semibold text-center sm:text-right text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{statusMessage}</span>
            </div>
          </div>

          {/* Real-time speech subtitle (what William is saying right now) */}
          {liveInterimSpeech && (
            <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/40 text-violet-200 text-xs flex items-center gap-2 animate-in fade-in">
              <span className="font-bold text-violet-400">Escuchando ahora:</span>
              <span className="italic">"{liveInterimSpeech}..."</span>
            </div>
          )}
        </div>
      </div>

      {/* Language Bridge Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#0b0c16] border border-white/[0.08]">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Languages className="w-4 h-4 text-violet-400" />
          <span className="font-bold">Modo de Conversación:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'bridge', label: '🇧🇷 ➔ 🇪🇸 ➔ 🇨🇦 Puente Lingüístico Completo' },
            { id: 'es', label: '🇪🇸 Castellano ESO' },
            { id: 'ca', label: '🇨🇦 Llengua Catalana' },
            { id: 'pt', label: '🇧🇷 Português Nativo' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedLanguageMode(mode.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedLanguageMode === mode.id
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/[0.04]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Danilo's Quick Starter Chips */}
      <div className="astra-card p-5 rounded-2xl border border-white/[0.08] space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Dudas frecuentes para probar por voz</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {[
            {
              title: "¿Qué significa 'haver de'?",
              subtitle: "Duda catalán vs portugués",
              prompt: "Belentani, no entiendo qué significa 'haver de' en catalán. ¿Cómo se dice en portugués y en castellano?"
            },
            {
              title: "Falsos amigos en clase",
              subtitle: "'Esquisito', 'Oficina', 'Propina'",
              prompt: "¿Cuáles son las palabras en portugués que en el instituto español significan algo totalmente diferente?"
            },
            {
              title: "Pedir ayuda al profesor",
              subtitle: "Frases respetuosas de clase",
              prompt: "Belentani, ¿cómo le digo al profesor de Mates que no he entendido las ecuaciones de segundo grado sin pasar vergüenza?"
            },
            {
              title: "Jerga de los 14 años",
              subtitle: "'Mola mazo', 'flipar', 'rayarse'",
              prompt: "¿Qué significan expresiones como 'mola mazo' y 'rayarse' que dicen mis compañeros en el recreo?"
            }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleUserSpokenMessage(item.prompt)}
              className="p-3 text-left rounded-xl bg-slate-900/50 hover:bg-violet-950/30 border border-white/[0.06] hover:border-violet-500/40 transition-all group cursor-pointer"
            >
              <div className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">
                {item.title}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                {item.subtitle}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Transcript Log with Scaffolding Cards */}
      <div className="astra-card p-5 rounded-2xl border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs">
          <h3 className="font-bold text-white flex items-center gap-2">
            <span>Registro de la Conversación en Vivo</span>
            <span className="text-slate-400 font-normal">({transcriptLog.length} turnos)</span>
          </h3>
          <button
            onClick={() => setTranscriptLog([])}
            className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            Limpiar registro
          </button>
        </div>

        <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
          {transcriptLog.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl text-xs space-y-2.5 transition-all ${
                item.sender === 'danilo'
                  ? 'bg-violet-950/30 border border-violet-500/30 ml-6 text-violet-100'
                  : 'bg-[#0a0b16] border border-white/[0.08] mr-6 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className={item.sender === 'danilo' ? 'text-violet-300' : 'text-rose-400'}>
                  {item.sender === 'danilo' ? '🎙️ Danilo (Tú)' : '🤖 Astra Belentani'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{item.time}</span>
              </div>

              <p className="text-xs leading-relaxed text-slate-200">{item.text}</p>

              {/* Language Bridge Scaffold box if available */}
              {item.languageScaffold && (
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/[0.06] space-y-1.5 text-[11px]">
                  <div className="font-black text-amber-400 flex items-center gap-1 text-[10px] uppercase tracking-wide">
                    <span>Puente Lingüístico Scaffolding</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <div className="p-1.5 rounded bg-black/40 border border-white/[0.04]">
                      <span className="text-emerald-400 font-bold block text-[10px]">🇧🇷 Português:</span>
                      <span className="text-slate-300">{item.languageScaffold.pt}</span>
                    </div>
                    <div className="p-1.5 rounded bg-black/40 border border-white/[0.04]">
                      <span className="text-amber-400 font-bold block text-[10px]">🇪🇸 Castellano:</span>
                      <span className="text-slate-300">{item.languageScaffold.es}</span>
                    </div>
                    <div className="p-1.5 rounded bg-black/40 border border-white/[0.04]">
                      <span className="text-cyan-400 font-bold block text-[10px]">🇨🇦 Català:</span>
                      <span className="text-slate-300">{item.languageScaffold.ca}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Speak again button for AI messages */}
              {item.sender === 'astra' && (
                <div className="pt-1 flex items-center justify-end">
                  <button
                    onClick={() => {
                      speakBelentani(item.text, { lang: 'es' });
                    }}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-violet-400" />
                    <span>Volver a escuchar</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
