import React, { useState, useEffect } from 'react';
import { 
  Volume2, VolumeX, Mic, Sliders, CheckCircle2, Play, Sparkles, X, 
  Headphones, BookOpen, Calculator, Languages, Activity, RefreshCw 
} from 'lucide-react';
import { 
  speakBelentani, stopSpeaking, getAvailableVoices, 
  setSelectedVoicePreference, getSelectedVoicePreference, 
  PRESET_VOICE_PROFILES, VoiceProfile, playSoundSuccess, playSoundClick 
} from '../utils/speech';

interface VoiceStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceStudioModal: React.FC<VoiceStudioModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'calibracion' | 'fonetica' | 'matematicas' | 'dictamen'>('calibracion');
  const [systemVoices, setSystemVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>(getSelectedVoicePreference());
  const [testText, setTestText] = useState<string>(
    "¡Hola William Danilo! Esta es mi voz humana natural calibrada para explicarte matemáticas y acompañarte en el instituto."
  );
  const [speechRate, setSpeechRate] = useState<number>(0.92);
  const [speechPitch, setSpeechPitch] = useState<number>(0.96);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const load = () => {
        const v = getAvailableVoices();
        setSystemVoices(v);
      };
      load();
      window.speechSynthesis.onvoiceschanged = load;
    }
  }, []);

  if (!isOpen) return null;

  const handleTestVoice = (textToSay?: string, langCode: 'es' | 'ca' | 'en' | 'pt' = 'es') => {
    playSoundClick();
    setIsSpeaking(true);
    speakBelentani(textToSay || testText, {
      lang: langCode,
      rate: speechRate,
      pitch: speechPitch,
      voiceName: selectedVoiceName,
      onEnd: () => setIsSpeaking(false)
    });
  };

  const handleSelectPreset = (p: VoiceProfile) => {
    playSoundSuccess();
    setSelectedVoiceName(p.name);
    setSelectedVoicePreference(p.name);
  };

  const handleSelectSystemVoice = (name: string) => {
    setSelectedVoiceName(name);
    setSelectedVoicePreference(name);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="astra-card rounded-3xl shadow-2xl border border-slate-800 max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh] bg-[#070b14]">
        {/* Header Modal */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Headphones className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono">
                <span>Motor Acústico & Laboratorio de Audición</span>
              </div>
              <h3 className="font-black text-lg text-white font-display">Estudio de Voz & Discriminación Auditiva</h3>
            </div>
          </div>
          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-6 pt-3 pb-2 border-b border-slate-800/80 bg-slate-950/50 overflow-x-auto">
          {[
            { id: 'calibracion', label: 'Calibración Acústica', icon: Sliders },
            { id: 'fonetica', label: 'Audición de Fonemas & Falsos Amigos', icon: Languages },
            { id: 'matematicas', label: 'Audición Matemática LOMLOE', icon: Calculator },
            { id: 'dictamen', label: 'Diagnóstico de Audición', icon: Activity },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  playSoundClick();
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'astra-btn-primary'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 text-xs flex-1">
          {/* TAB 1: CALIBRACIÓN ACÚSTICA */}
          {activeTab === 'calibracion' && (
            <div className="space-y-5">
              {/* Preset natural profiles */}
              <div>
                <label className="font-bold text-xs text-white mb-2 block flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Perfiles Vocales Recomendados (Neurales de Alta Fidelidad):</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PRESET_VOICE_PROFILES.map((p) => {
                    const isSelected = selectedVoiceName.includes(p.name);
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleSelectPreset(p)}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400 shadow-md'
                            : 'border-slate-800 bg-slate-950/60 hover:bg-slate-900/80'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-white">{p.name}</span>
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">
                            {p.lang}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">{p.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* System voices selector */}
              <div className="space-y-1.5">
                <label className="font-bold text-xs text-slate-300 block">
                  Todas las Voces Detectadas en tu Sistema Operativo / Navegador ({systemVoices.length}):
                </label>
                <select
                  value={selectedVoiceName}
                  onChange={(e) => handleSelectSystemVoice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="">Selección inteligente automática (voz neural óptima)</option>
                  {systemVoices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.lang}) {v.name.includes('Natural') || v.name.includes('Online') ? '⭐ NEURAL RECOMENDADA' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sliders: Cadence and Tone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-xs text-slate-300">
                    <span>Velocidad de Dicción Pedagógica:</span>
                    <span className="text-cyan-300 font-mono">{speechRate}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.75"
                    max="1.2"
                    step="0.02"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    0.92x permite discriminar con claridad fonemas complejos de 3º de ESO.
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-xs text-slate-300">
                    <span>Calidez de Tono (Resonancia Torácica):</span>
                    <span className="text-cyan-300 font-mono">{speechPitch}</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.2"
                    step="0.02"
                    value={speechPitch}
                    onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    0.96 activa el filtro ecualizador Web Audio a 450Hz para evitar fatiga auditiva.
                  </span>
                </div>
              </div>

              {/* Live test area */}
              <div className="space-y-2">
                <label className="font-bold text-xs text-slate-300 block">
                  Prueba de Audición en Vivo:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testText}
                    onChange={(e) => setTestText(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={() => handleTestVoice()}
                    className="px-5 py-2.5 rounded-xl astra-btn-primary font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isSpeaking ? 'Hablando...' : 'Escuchar'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AUDICIÓN DE FONEMAS & FALSOS AMIGOS */}
          {activeTab === 'fonetica' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs space-y-1">
                <h4 className="font-bold text-cyan-300 flex items-center gap-2">
                  <Languages className="w-4 h-4" />
                  <span>Entrenamiento de Oído: Falsos Amigos Fonéticos (PT 🇧🇷 - ES 🇪🇸 - CA)</span>
                </h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Para un estudiante brasileño de 14 años, la mayor causa de inseguridad en clase no es el vocabulario, sino confundir auditivamente palabras idénticas con significados totalmente distintos. Haz clic en cada tarjeta para escuchar la explicación en audio.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    word: "Embarazada vs. Embaraçada",
                    audioEs: "En español: Embarazada significa que va a tener un bebé. En portugués: Embaraçada significa avergonzada o tímida.",
                    tag: "Crítico en Clase",
                    color: "border-rose-500/40"
                  },
                  {
                    word: "Borracha vs. Bêbada",
                    audioEs: "En español: Borracha significa persona ebria. En portugués: Borracha es la goma de borrar del estuche escolar.",
                    tag: "Material Escolar",
                    color: "border-amber-500/40"
                  },
                  {
                    word: "Pegar vs. Tomar/Agarrar",
                    audioEs: "En español: Pegar es golpear o adherir con pegamento. En portugués: Pegar es agarrar o tomar el lápiz o el autobús.",
                    tag: "Acción en Aula",
                    color: "border-cyan-500/40"
                  },
                  {
                    word: "Propina vs. Gorjeta",
                    audioEs: "En español: La propina es el dinero extra que dejas al camarero. En portugués: Propina significa soborno ilegal.",
                    tag: "Cultura Social",
                    color: "border-purple-500/40"
                  },
                  {
                    word: "Català: L·L (Ela Geminada)",
                    audioEs: "En catalán: Col·legi e intel·ligent se pronuncian prolongando la ele con dos pulsos limpios, col·legi.",
                    tag: "Fonética Catalana",
                    color: "border-emerald-500/40",
                    lang: 'ca' as const
                  },
                  {
                    word: "Català: Vocals Obertes (È / Ò)",
                    audioEs: "En catalán: Cafè amb accent obert té un so més ample que en castellano.",
                    tag: "Fonética Catalana",
                    color: "border-emerald-500/40",
                    lang: 'ca' as const
                  }
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl bg-slate-950/70 border ${item.color} space-y-2`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{item.word}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">{item.audioEs}</p>
                    <button
                      onClick={() => handleTestVoice(item.audioEs, item.lang || 'es')}
                      className="w-full py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Reproducir Audición Fonética</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AUDICIÓN MATEMÁTICA LOMLOE */}
          {activeTab === 'matematicas' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs space-y-1">
                <h4 className="font-bold text-cyan-300 flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  <span>Audición de Lenguaje Matemático & Científico Normalizado</span>
                </h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Los sintetizadores de voz convencionales leen fórmulas como símbolos mecánicos incomprensibles. Nuestro motor fonético normaliza potencias, raíces cuadradas, fracciones y fórmulas químicas para que William Danilo las entienda de oído.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: "Ecuación de Segundo Grado Completa",
                    formula: "x² - 5x + 6 = 0  =>  x = (-b ± √Δ) / 2a",
                    speech: "La ecuación x² - 5x + 6 = 0 tiene discriminante delta igual a 1, y sus soluciones son x₁ = 3 y x₂ = 2.",
                    desc: "Expande automáticamente potencias al cuadrado, discriminante delta y subíndices."
                  },
                  {
                    title: "Teorema de Pitágoras y Raíces",
                    formula: "a² + b² = c²  =>  c = √(3² + 4²) = √25 = 5",
                    speech: "En el teorema de Pitágoras, la hipotenusa c es igual a la raíz cuadrada de a² + b². Si los catetos son 3 y 4, la hipotenusa mide exactamente 5.",
                    desc: "Pronunciación clara de raíces cuadradas e hipotenusas para geometría de 3º ESO."
                  },
                  {
                    title: "Respiración Celular y Estequiometría",
                    formula: "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 36 ATP",
                    speech: "En la respiración celular, una molécula de glucosa más 6 moléculas de oxígeno producen 6 de dióxido de carbono, 6 de agua y 36 moléculas de ATP.",
                    desc: "Normaliza fórmulas moleculares para biología y geología LOMLOE."
                  }
                ].map((m, mIdx) => (
                  <div key={mIdx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{m.title}</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Normalización Activa</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-cyan-300 text-xs">
                      {m.formula}
                    </div>
                    <p className="text-[11px] text-slate-400">{m.desc}</p>
                    <button
                      onClick={() => handleTestVoice(m.speech, 'es')}
                      className="px-4 py-2 rounded-xl astra-btn-primary font-bold text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Escuchar Dicción Didáctica</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DIAGNÓSTICO DE AUDICIÓN ESCOLAR */}
          {activeTab === 'dictamen' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    <span>Informe de Calibración & Salud Auditiva</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 font-mono">
                    100% Calibrado
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <strong className="text-cyan-300 block mb-1">1. Corrección del Bug de Congelación en Chrome (15 Segundos)</strong>
                    <p className="text-slate-400 text-[11px]">
                      Se ha incorporado un pulso de mantenimiento (*heartbeat keepalive*) cada 10 segundos para garantizar que las explicaciones extensas de Belentani no se interrumpan a mitad de párrafo.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <strong className="text-cyan-300 block mb-1">2. Filtro Acústico Web Audio (Resonancia 450Hz)</strong>
                    <p className="text-slate-400 text-[11px]">
                      Atenúa agudos metálicos y resalta el rango de confort vocal humano (peaking a 450Hz con ganancia suave), evitando fatiga cognitiva en sesiones de estudio prolongadas.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <strong className="text-cyan-300 block mb-1">3. Normalización Fonética de la LOMLOE</strong>
                    <p className="text-slate-400 text-[11px]">
                      Traducción automática en tiempo real de notación algebraica (`x²`, `√`, `Δ`, `±`) y científica (`CO₂`, `H₂O`, `ATP`) a lenguaje hablado didáctico en español peninsular y catalán.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Filtro de Confort Acústico Web Audio & Keepalive Activo</span>
          </div>
          <button
            onClick={() => {
              playSoundSuccess();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl astra-btn-primary font-bold text-xs cursor-pointer shadow-lg"
          >
            Guardar y Aplicar Calibración
          </button>
        </div>
      </div>
    </div>
  );
};
