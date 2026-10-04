import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  User, 
  RefreshCw, 
  Languages, 
  HelpCircle, 
  Cpu, 
  Brain, 
  Zap, 
  BookOpen, 
  ShieldCheck,
  Save,
  CheckCircle2,
  SlidersHorizontal,
  Bot,
  Camera,
  Star,
  Search,
  MapPin,
  Globe,
  ExternalLink
} from 'lucide-react';
import { speakBelentani, stopSpeaking, playSoundSuccess, playSoundError, playSoundTone } from '../utils/speech';
import { auth, db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type GeminiModelChoice = 'gemini-3.1-pro-preview' | 'gemini-3.5-flash' | 'gemini-3.1-flash-lite';
export type TutorRoleChoice = 'belentani' | 'math_master' | 'linguist' | 'arcade_coach';

export const AITutorChat: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<GeminiModelChoice>('gemini-3.5-flash');
  const [selectedRole, setSelectedRole] = useState<TutorRoleChoice>('belentani');
  const [enableSearchGrounding, setEnableSearchGrounding] = useState<boolean>(false);
  const [enableMapsGrounding, setEnableMapsGrounding] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'belentani',
      text: '¡Hola William Danilo! ⚔️🎵 Soy Belentani, tu tutor en Astra AI. Con los modelos Gemini 3.x, búsqueda contrastada con Google Search y mapas educativos con Google Maps, resolvemos cualquier duda de 3º de ESO y practicamos español, catalán e inglés conectándolos con tu portugués nativo. ¿Qué materia o reto abordamos hoy?',
      language: 'es',
      timestamp: 'Ahora'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [autoVoice, setAutoVoice] = useState(true);
  const [currentLang, setCurrentLang] = useState<'es' | 'ca' | 'en' | 'pt'>('es');
  const [savedToCloud, setSavedToCloud] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const modelsConfig: Record<GeminiModelChoice, { name: string; badge: string; desc: string; icon: React.ReactNode }> = {
    'gemini-3.5-flash': {
      name: 'Gemini 3.5 Flash',
      badge: 'Predeterminado',
      desc: 'Alta velocidad multimodal, ideal para explicaciones directas, dudas rápidas y corrección gramatical.',
      icon: <Zap className="w-4 h-4 text-violet-400" />
    },
    'gemini-3.1-pro-preview': {
      name: 'Gemini 3.1 Pro Preview',
      badge: 'Razonamiento',
      desc: 'Capacidad de deducción profunda en matemáticas complejas, física y desgloses paso a paso.',
      icon: <Brain className="w-4 h-4 text-cyan-400" />
    },
    'gemini-3.1-flash-lite': {
      name: 'Gemini 3.1 Flash-Lite',
      badge: 'Ultrarrápido',
      desc: 'Latencia mínima para consultas cortas, definiciones de vocabulario y traducción inmediata.',
      icon: <Cpu className="w-4 h-4 text-emerald-400" />
    }
  };

  const rolesConfig: Record<TutorRoleChoice, { label: string; desc: string; icon: string; systemPromptAddition: string; color: string }> = {
    belentani: {
      label: 'Belentani Integral (Guerrero & Cantante)',
      desc: 'Tutor cercano, empático, integrador cultural y motivador con voz cálida.',
      icon: '🧔⚔️',
      systemPromptAddition: 'Actúa como Belentani: tutor integral y cantante guerrero para William Danilo (14 años, Brasil a España). Usa tono cálido, cercano y motivador.',
      color: 'border-violet-500/50 bg-violet-950/40 text-violet-200'
    },
    math_master: {
      label: 'Maestro de Mates & Física ESO',
      desc: 'Enfoque paso a paso, fórmulas, teoremas y comprobaciones numéricas.',
      icon: '📐🔢',
      systemPromptAddition: 'Actúa como el profesor titular de Matemáticas y Física de 3º ESO. Explica paso a paso cada paso de cálculo.',
      color: 'border-cyan-500/50 bg-cyan-950/40 text-cyan-200'
    },
    linguist: {
      label: 'Especialista en Lenguas (PT-ES-CA)',
      desc: 'Evita falsos amigos, refuerza la ortografía española y el catalán escolar.',
      icon: '🗣️📚',
      systemPromptAddition: 'Actúa como lingüista experto en adquisición de segundas lenguas. Destaca falsos amigos entre portugués y castellano/catalán.',
      color: 'border-emerald-500/50 bg-emerald-950/40 text-emerald-200'
    },
    arcade_coach: {
      label: 'Coach de Estrategia Arcade',
      desc: 'Explicaciones gamificadas usando metáforas de videojuegos y desafíos.',
      icon: '🎮👾',
      systemPromptAddition: 'Explica los conceptos de estudio como mecánicas y retos de videojuegos para mantener la curiosidad alta.',
      color: 'border-amber-500/50 bg-amber-950/40 text-amber-200'
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || loading) return;

    playSoundSuccess();
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputText.trim();
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          model: (enableSearchGrounding || enableMapsGrounding) ? 'gemini-3.5-flash' : selectedModel,
          role: selectedRole,
          language: currentLang,
          enableSearchGrounding,
          enableMapsGrounding,
          history: messages.slice(-8)
        })
      });

      if (!response.ok) {
        throw new Error('Error al conectar con Gemini API');
      }

      const data = await response.json();
      const botText = data.reply || '¡Entendido, Danilo! Continuemos practicando este concepto.';

      // Extract grounding sources & maps places
      const chunks = data.groundingChunks || [];
      const searchSources = chunks
        .filter((c: any) => c.web)
        .map((c: any) => ({
          title: c.web.title || 'Fuente Web Oficial',
          uri: c.web.uri || '#'
        }));

      const mapPlaces = chunks
        .filter((c: any) => c.maps)
        .map((c: any) => ({
          title: c.maps.title || 'Ubicación Google Maps',
          uri: c.maps.uri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.maps.title || currentInput)}`,
          snippets: c.maps.placeAnswerSources?.reviewSnippets || []
        }));

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'belentani',
        text: botText,
        language: currentLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel,
        searchSources: searchSources.length > 0 ? searchSources : undefined,
        mapPlaces: mapPlaces.length > 0 ? mapPlaces : undefined
      };

      setMessages(prev => [...prev, botMsg]);

      // Speak answer if autoVoice is on
      if (autoVoice) {
        speakBelentani(botText, { lang: currentLang, rate: 0.93 });
      }

      // Save to Firebase Firestore if logged in
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          await addDoc(collection(db, 'users', currentUser.uid, 'chatLogs'), {
            userMessage: currentInput,
            aiResponse: botText,
            model: selectedModel,
            role: selectedRole,
            language: currentLang,
            createdAt: serverTimestamp()
          });
          setSavedToCloud(true);
          setTimeout(() => setSavedToCloud(false), 3000);
        } catch {
          // Cloud sync offline
        }
      }
    } catch (error) {
      playSoundError();
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'belentani',
        text: `¡Hola Danilo! Como estamos en el entorno de estudio y repasamos 3º de ESO, ten en cuenta que para resolver este ejercicio conviene recordar las reglas fundamentales y los pasos lógicos. ¡Inténtalo de nuevo o dime si quieres desglosarlo en pasos más sencillos!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
      if (autoVoice) {
        speakBelentani(fallbackMsg.text, { lang: currentLang });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVoiceInput = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      alert('Reconocimiento por voz no soportado en este navegador. Usa el campo de texto.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      const langMap: Record<string, string> = { es: 'es-ES', ca: 'ca-ES', en: 'en-US', pt: 'pt-BR' };
      recognition.lang = langMap[currentLang] || 'es-ES';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in">
      {/* Control Panel: Model & Role Configuration (Astra Card) */}
      <div className="astra-card p-5 border border-white/[0.08] space-y-4">
        {/* Model Selector Banner */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-violet-400" />
              <span>Selecciona el Motor de Inteligencia Gemini:</span>
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline font-mono">
              Optimizado para LOMLOE y transferencia contrastiva
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {(['gemini-3.5-flash', 'gemini-3.1-pro-preview', 'gemini-3.1-flash-lite'] as GeminiModelChoice[]).map((mKey) => {
              const m = modelsConfig[mKey];
              const isSel = selectedModel === mKey;
              return (
                <button
                  key={mKey}
                  onClick={() => {
                    playSoundTone(480, 0.03, 'sine', 0.08);
                    setSelectedModel(mKey);
                  }}
                  className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                    isSel 
                      ? 'bg-violet-950/50 border-violet-400 text-white shadow-lg shadow-violet-600/20' 
                      : 'bg-slate-900/40 border-white/[0.06] hover:bg-slate-900 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {m.icon}
                      <span className="font-bold text-xs text-white">{m.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSel ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {m.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {m.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Roles Selector */}
        <div className="border-t border-white/[0.08] pt-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2.5">
            Rol del Tutor & Especialidad:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(rolesConfig) as TutorRoleChoice[]).map((rKey) => {
              const r = rolesConfig[rKey];
              const isSel = selectedRole === rKey;
              return (
                <button
                  key={rKey}
                  onClick={() => {
                    playSoundTone(520, 0.03, 'sine', 0.08);
                    setSelectedRole(rKey);
                  }}
                  className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                    isSel
                      ? `${r.color} shadow-md`
                      : 'bg-slate-900/40 border-white/[0.06] text-slate-400 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-sm">
                    <span>{r.icon}</span>
                    <span className="font-bold text-xs truncate text-white">{r.label}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{r.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Chat Conversation Thread (Astra Card) */}
      <div className="astra-card border border-white/[0.08] flex flex-col h-[560px] overflow-hidden">
        {/* Chat Thread Header */}
        <div className="px-5 py-3 border-b border-white/[0.08] bg-[#090a14] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 p-0.5 overflow-hidden shadow-md">
              <img 
                src="/assets/belentani.jpg" 
                alt="Belentani" 
                className="w-full h-full object-cover rounded-[10px]"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            </div>
            <div>
              <div className="font-bold text-xs text-white flex items-center gap-2">
                <span>{rolesConfig[selectedRole].label}</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-violet-500/20 text-violet-300 font-semibold font-mono border border-violet-500/30">
                  {selectedModel}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Historial de conversación activo · Adaptado a Danilo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Grounding Toggles */}
            <button
              id="toggle-search-grounding"
              onClick={() => {
                playSoundTone(460, 0.03, 'sine', 0.08);
                const next = !enableSearchGrounding;
                setEnableSearchGrounding(next);
                if (next) setSelectedModel('gemini-3.5-flash');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors border ${
                enableSearchGrounding 
                  ? 'bg-violet-950/70 border-violet-400 text-violet-200' 
                  : 'bg-slate-900 border-white/[0.08] text-slate-400 hover:text-slate-300'
              }`}
              title="Activar Google Search Grounding (gemini-3.5-flash)"
            >
              <Search className="w-3.5 h-3.5 text-violet-400" />
              <span className="hidden sm:inline">Search {enableSearchGrounding ? '✓' : ''}</span>
            </button>

            <button
              id="toggle-maps-grounding"
              onClick={() => {
                playSoundTone(520, 0.03, 'sine', 0.08);
                const next = !enableMapsGrounding;
                setEnableMapsGrounding(next);
                if (next) setSelectedModel('gemini-3.5-flash');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors border ${
                enableMapsGrounding 
                  ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200' 
                  : 'bg-slate-900 border-white/[0.08] text-slate-400 hover:text-slate-300'
              }`}
              title="Activar Google Maps Grounding (gemini-3.5-flash)"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Maps {enableMapsGrounding ? '✓' : ''}</span>
            </button>

            {/* Auto Voice Toggle */}
            <button
              onClick={() => {
                if (autoVoice) stopSpeaking();
                setAutoVoice(!autoVoice);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors border ${
                autoVoice 
                  ? 'bg-violet-950/60 border-violet-500/40 text-violet-200' 
                  : 'bg-slate-900 border-white/[0.08] text-slate-400'
              }`}
              title={autoVoice ? "Voz automática activada" : "Voz automática desactivada"}
            >
              {autoVoice ? <Volume2 className="w-3.5 h-3.5 text-violet-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{autoVoice ? 'Voz On' : 'Voz Off'}</span>
            </button>

            {/* Language Selector */}
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value as any)}
              className="text-xs bg-slate-900 border border-white/[0.08] rounded-xl px-2.5 py-1 text-slate-200 font-medium focus:outline-none focus:border-violet-500/50"
            >
              <option value="es">🇪🇸 Español</option>
              <option value="ca">💛 Català</option>
              <option value="pt">🇧🇷 Português</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>
        </div>

        {/* Scrollable Messages Thread */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#06070a]/60">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-md ${
                  isUser 
                    ? 'bg-violet-600 text-white' 
                    : 'bg-[#0e0f1e] border border-violet-500/40 text-violet-300'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-violet-400" />}
                </div>

                <div className="space-y-1">
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-violet-600 text-white rounded-tr-none shadow-lg shadow-violet-600/20'
                      : 'bg-[#0c0d18] text-slate-200 rounded-tl-none border border-white/[0.08] shadow-sm'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Google Search Grounding Sources */}
                    {msg.searchSources && msg.searchSources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-white/[0.08] space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300 flex items-center gap-1">
                          <Globe className="w-3 h-3 text-violet-400" />
                          Fuentes Verificadas (Google Search):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.searchSources.map((src, sIdx) => (
                            <a
                              key={sIdx}
                              href={src.uri}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900/90 border border-white/[0.08] hover:border-violet-400 text-[10px] text-slate-300 hover:text-white transition-colors"
                            >
                              <span className="max-w-[150px] truncate">{src.title}</span>
                              <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Google Maps Grounding Places */}
                    {msg.mapPlaces && msg.mapPlaces.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-white/[0.08] space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          Lugares Escolares en Google Maps:
                        </span>
                        <div className="grid grid-cols-1 gap-1.5">
                          {msg.mapPlaces.map((pl, pIdx) => (
                            <a
                              key={pIdx}
                              href={pl.uri}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="p-2 rounded-lg bg-slate-900/90 border border-white/[0.08] hover:border-cyan-400 text-[11px] text-slate-200 hover:text-white transition-colors flex items-center justify-between"
                            >
                              <span className="font-semibold truncate">{pl.title}</span>
                              <span className="text-[10px] text-cyan-400 inline-flex items-center gap-1 shrink-0">
                                Ver mapa <ExternalLink className="w-2.5 h-2.5" />
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={`flex items-center gap-2 text-[10px] text-slate-500 px-1 ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}>
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => speakBelentani(msg.text, { lang: msg.language || 'es' })}
                        className="hover:text-violet-400 transition-colors"
                        title="Escuchar con voz humana"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-center">
              <div className="w-8 h-8 rounded-xl bg-violet-950/60 border border-violet-500/40 text-violet-300 flex items-center justify-center text-xs font-bold">
                <Bot className="w-4 h-4 text-violet-400" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0c0d18] border border-white/[0.08] shadow-sm rounded-tl-none flex items-center gap-2 text-xs text-slate-400">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-violet-400" />
                <span>Belentani ({selectedModel}) está razonando la respuesta...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-[#080912] border-t border-white/[0.06] flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
          <span className="text-slate-500 font-bold shrink-0 uppercase tracking-wider text-[10px]">
            Sugerencias Socráticas:
          </span>
          {[
            { label: '💡 Dame una pista sin darme la respuesta', text: 'Dame una pista para este problema sin darme la respuesta final. Quiero razonarlo yo mismo con el método socrático.' },
            { label: '📐 Explícame paso a paso cómo resolver una ecuación', text: 'Explícame paso a paso cómo resolver una ecuación de segundo grado ax² + bx + c = 0 para 3º de ESO.' },
            { label: '🇧🇷 Diferencia oficina / taller (PT vs ES)', text: '¿Cuál es la diferencia entre "oficina" en portugués de Brasil y "oficina" en castellano de España? Ponme ejemplos.' },
            { label: '🐍 Comprobar con Python SymPy', text: 'Escribe el código Python con SymPy para resolver y verificar la ecuación x^2 - 5*x + 6 = 0.' }
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(chip.text);
                playSoundTone(460, 0.03, 'sine', 0.06);
              }}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-indigo-950/80 border border-white/[0.08] hover:border-indigo-400/40 text-slate-300 hover:text-white shrink-0 transition-colors"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-white/[0.08] bg-[#090a14] space-y-2">
          {/* Math Keyboard Mini-Toolbar */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              <span className="text-[10px] font-bold text-indigo-400 font-mono pr-1">✦ Símbolos:</span>
              {['x²', '√x', 'π', '÷', '±', '≤', '≥', '( )', 'Δ'].map((symbol) => (
                <button
                  key={symbol}
                  type="button"
                  onClick={() => {
                    playSoundTone(520, 0.02, 'sine', 0.04);
                    setInputText(prev => prev + symbol);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-black/40 hover:bg-white/10 text-slate-300 font-mono text-[11px] font-semibold border border-white/[0.06] transition-colors"
                >
                  {symbol}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                playSoundTone(620, 0.04, 'sine', 0.08);
                setInputText('¿Cómo resuelvo la ecuación 2x + 7 = 19 de mis deberes del instituto? Guíame con el método socrático.');
              }}
              className="hidden sm:flex items-center gap-1 text-[11px] text-indigo-300 hover:text-indigo-200 font-semibold transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-indigo-400" />
              <span>Simular Escaneo de Deberes</span>
            </button>
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Pregunta a Belentani sobre matemáticas, física, lengua española, catalán o gramática..."
              disabled={loading}
              className="flex-1 p-3 rounded-xl bg-[#06070a] border border-white/[0.08] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50"
            />

            {/* Camera / Homework Scan Shortcut */}
            <button
              type="button"
              onClick={() => {
                playSoundTone(620, 0.04, 'sine', 0.08);
                setInputText('Tengo este ejercicio de matemáticas: 3x - 8 = 16. ¿Me puedes dar una pista?');
              }}
              className="p-3 rounded-xl bg-slate-900 text-slate-300 border border-white/[0.08] hover:border-indigo-400 hover:text-white transition-all"
              title="Escanear ejercicio de deberes"
            >
              <Camera className="w-4 h-4 text-indigo-400" />
            </button>

            {/* Mic speech to text */}
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              className={`p-3 rounded-xl border transition-all ${
                isRecording 
                  ? 'bg-rose-600 text-white border-rose-400 animate-pulse' 
                  : 'bg-slate-900 text-slate-300 border-white/[0.08] hover:bg-slate-800'
              }`}
              title="Dictar pregunta con voz"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send button */}
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="astra-btn-primary px-5 py-3 text-xs flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Preguntar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
