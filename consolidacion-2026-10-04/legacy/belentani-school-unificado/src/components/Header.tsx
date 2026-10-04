import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  User, 
  Heart, 
  Mic, 
  SlidersHorizontal, 
  Cloud, 
  Flame, 
  Zap, 
  CheckCircle2, 
  Code2, 
  Terminal, 
  Radio,
  GraduationCap
} from 'lucide-react';
import { speakBelentani, stopSpeaking, playSoundSuccess, playSoundTone } from '../utils/speech';
import { NavigationTab } from '../types';
import { auth } from '../services/firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface HeaderProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenVoiceStudio: () => void;
  onOpenAuthModal?: () => void;
  onOpenWelcomeTour?: () => void;
  onOpenUniversalModal?: () => void;
  studentName?: string;
  studentGrade?: string;
  minutesUsed?: number;
  maxMinutes?: number;
  safetyShieldActive?: boolean;
  autoVoiceEnabled?: boolean;
  isToolsUnlocked?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenVoiceStudio,
  onOpenAuthModal,
  onOpenWelcomeTour,
  onOpenUniversalModal,
  studentName = 'William Danilo',
  studentGrade = '3º ESO',
  minutesUsed = 14,
  maxMinutes = 60,
  safetyShieldActive = true,
  autoVoiceEnabled = true,
  isToolsUnlocked = false
}) => {
  const [isSpeakingWelcome, setIsSpeakingWelcome] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setCurrentUser(u);
    });
    return () => unsub();
  }, []);

  const handleVoiceGreeting = () => {
    if (isSpeakingWelcome) {
      stopSpeaking();
      setIsSpeakingWelcome(false);
      return;
    }

    setIsSpeakingWelcome(true);
    playSoundTone(520, 0.08, 'sine', 0.12);
    const greetingText = 
      "¡Hola William Danilo! Bienvenido a España y a Belentani School. " +
      "Acabas de llegar de Brasil a 3º de la ESO y hemos adaptado toda la plataforma para ti: " +
      "cada día tienes tu clase organizada y dictada en 4 horas con descansos y recreo. Al cursarla, accedes a todo el material didáctico y las herramientas. ¡Mucho ánimo, guerrero!";

    speakBelentani(greetingText, {
      lang: 'es',
      rate: 0.93,
      onEnd: () => setIsSpeakingWelcome(false)
    });
  };

  const navItems: { id: NavigationTab; label: string; icon: string; badge?: string }[] = [
    { id: 'claseDelDia', label: 'Clase de Hoy (365)', icon: '📅', badge: '4 Horas' },
    { id: 'herramientas', label: 'Material Didáctico y Herramientas', icon: '🧰', badge: isToolsUnlocked ? 'Desbloqueado' : 'Tras Clase' },
    { id: 'research', label: 'Investigación & Mapas', icon: '🌐', badge: 'Grounding' },
    { id: 'curso', label: 'Módulos 3º ESO', icon: '🎓', badge: '8 Pasos' },
    { id: 'live', label: 'Astra Live Voice', icon: '🎙️', badge: 'Escucha Real' },
    { id: 'cultura', label: 'Aterrizaje 3º ESO', icon: '🇪🇸', badge: '14 Años 🇧🇷' },
    { id: 'escuela', label: 'Mi Escuela', icon: '🏫', badge: 'Portal' }
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#06070a]/90 border-b border-white/[0.08] shadow-2xl text-slate-100">
      {/* Astra AI Top Glass Metric & Status Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-white/[0.06]">
        {/* Left Badges: Student info & Streaks */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="font-bold tracking-wide text-[11px]">ASTRA AI CORE · BELENTANI SCHOOL</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-300">
            <User className="w-3.5 h-3.5 text-violet-400" />
            <span className="font-bold text-white">{studentName}</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-semibold">14 años (Recién llegado 🇧🇷 ➔ 3º ESO España 🇪🇸 & Catalunya)</span>
          </div>

          {/* Gamified Study Streak (Astra Style) */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>14 Días de Racha</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold">
            <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            <span>2,840 XP · Nivel 3 ESO</span>
          </div>
        </div>

        {/* Right Controls: Welcome Tour Button, Cloud Sync, Human Voice */}
        <div className="flex items-center gap-2.5">
          {/* Signalized Blinking Button for Welcome Tour */}
          {onOpenWelcomeTour && (
            <button
              onClick={onOpenWelcomeTour}
              className="relative group flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 hover:brightness-110 text-white shadow-lg shadow-violet-600/30 border border-violet-400/50 animate-pulse hover:animate-none hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="¡Toca aquí para iniciar el Tour Interactivo con la voz humana de Belentani!"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span className="tracking-wide">¡BIENVENIDA & TOUR EN VIVO!</span>
              <span className="hidden xl:inline text-[9px] bg-black/40 px-1.5 py-0.2 rounded-full text-amber-200 uppercase font-mono">
                IA Escucha 🎙️
              </span>
            </button>
          )}

          {/* Universal Open School: switch grade (1º ESO -> 2º Bach) & languages */}
          {onOpenUniversalModal && (
            <button
              onClick={onOpenUniversalModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900 border border-white/[0.08] text-slate-300 hover:border-indigo-500/40 transition-all"
              title="Cambiar curso (1º ESO a 2º Bachillerato) e idiomas de acogida"
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">{studentGrade}</span>
            </button>
          )}

          {/* Cloud Auth Status */}
          <button
            onClick={onOpenAuthModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${
              currentUser 
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60' 
                : 'bg-slate-900 border-white/[0.08] text-slate-300 hover:border-violet-500/40'
            }`}
          >
            <Cloud className="w-3.5 h-3.5 text-sky-400" />
            <span>{currentUser ? (currentUser.displayName || 'Danilo · Sincronizado') : 'Nube Firestore'}</span>
          </button>

          {/* Time tracker */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-white/[0.08] text-slate-300 text-[11px]">
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
            <span>{minutesUsed} / {maxMinutes} min</span>
          </div>

          {/* Voice Tuning Studio */}
          <button
            onClick={onOpenVoiceStudio}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-950/60 hover:bg-violet-900/80 text-violet-200 border border-violet-500/30 transition-all shadow-sm"
            title="Ajustar tono acústico, filtros formantes y voz ultra-humana de Belentani"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-violet-400" />
            <span className="hidden md:inline">Voz Humana</span>
          </button>

          {/* Quick Voice Greeting Button */}
          <button
            onClick={handleVoiceGreeting}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm ${
              isSpeakingWelcome 
                ? 'bg-amber-500 text-black animate-pulse' 
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:brightness-110 shadow-md shadow-violet-600/20'
            }`}
            title="Escuchar saludo con la voz ultra-humana de Belentani para Danilo"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{isSpeakingWelcome ? 'Voz Hablando...' : 'Saludar'}</span>
          </button>

          {/* Mute button */}
          <button 
            onClick={() => {
              if (!soundMuted) stopSpeaking();
              setSoundMuted(!soundMuted);
            }}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title={soundMuted ? "Activar audio" : "Silenciar audio"}
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-violet-400" />}
          </button>
        </div>
      </div>

      {/* Main Brand & Bento Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleVoiceGreeting}>
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-indigo-400/40 shadow-lg shadow-indigo-600/20 p-0.5 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-800 flex items-center justify-center">
              <img 
                src="/assets/belentani.jpg" 
                alt="Belentani Guerrero y Cantante" 
                className="w-full h-full object-cover rounded-[10px] group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-indigo-500/10 pointer-events-none rounded-[10px]" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-indigo-500 rounded-full border-2 border-[#06070a] text-[8px] flex items-center justify-center text-white font-black">✦</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-black tracking-tight text-white flex items-center gap-1.5 font-display">
                  <span className="text-indigo-400">✦</span>
                  <span className="bg-gradient-to-r from-white via-indigo-100 to-slate-300 bg-clip-text text-transparent">
                    ASTRA AI
                  </span>
                  <span className="text-indigo-400 font-extrabold text-sm tracking-wide">
                    BELENTANI
                  </span>
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 font-mono shadow-sm">
                  {studentGrade}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span>Tutor con IA y Acompañamiento Integral</span>
                <span className="text-slate-600">•</span>
                <span className="text-indigo-300 font-semibold">William Danilo (14 años)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Floating Pill Navigation Tabs (Astra AI Style) */}
        <nav className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const isPython = item.id === 'jsonBank';
            const isLive = item.id === 'geminiLive';

            return (
              <button
                key={item.id}
                onClick={() => {
                  playSoundSuccess();
                  onSelectTab(item.id);
                }}
                className={`astra-nav-pill ${
                  isActive 
                    ? 'astra-nav-pill-active' 
                    : 'astra-nav-pill-inactive'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase ${
                    isActive 
                      ? 'bg-violet-400 text-black' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
