import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Radio, 
  Play, 
  ChevronRight, 
  X, 
  Volume2, 
  GraduationCap, 
  Headphones, 
  Calendar,
  Compass
} from 'lucide-react';
import { playSoundSuccess } from '../utils/speech';

interface WelcomeDaysBannerProps {
  onOpenTour: () => void;
}

export const WelcomeDaysBanner: React.FC<WelcomeDaysBannerProps> = ({ onOpenTour }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [dayNumber, setDayNumber] = useState(1);

  useEffect(() => {
    try {
      const now = Date.now();
      const firstSeenStr = localStorage.getItem('belentani_first_visit_timestamp');
      let firstSeen = firstSeenStr ? parseInt(firstSeenStr, 10) : null;

      if (!firstSeen || isNaN(firstSeen)) {
        firstSeen = now;
        localStorage.setItem('belentani_first_visit_timestamp', now.toString());
      }

      // Calculate days passed (1 to 7)
      const diffDays = Math.floor((now - firstSeen) / (1000 * 60 * 60 * 24)) + 1;
      setDayNumber(Math.min(Math.max(diffDays, 1), 7));

      // Check if user dismissed it today
      const dismissedToday = localStorage.getItem(`belentani_banner_dismissed_day_${diffDays}`);
      if (!dismissedToday && diffDays <= 7) {
        setIsVisible(true);
      } else if (diffDays <= 7) {
        setIsVisible(false);
      } else {
        setIsVisible(false);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem(`belentani_banner_dismissed_day_${dayNumber}`, 'true');
    } catch {
      // ignore
    }
    setIsVisible(false);
  };

  const handleLaunchTour = () => {
    playSoundSuccess();
    onOpenTour();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-3xl astra-card astra-card-glow border border-violet-500/40 p-5 sm:p-6 text-white shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        {/* Left Side: Avatar, Signal Beacon & Title */}
        <div className="flex items-start gap-4 max-w-3xl">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-violet-600 via-pink-500 to-amber-500 p-0.5 shadow-lg shadow-violet-500/25">
              <div className="w-full h-full rounded-2xl bg-[#06070a] flex items-center justify-center overflow-hidden">
                <img 
                  src="/assets/belentani.jpg" 
                  alt="Belentani" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-2xl">🧔</span>
              </div>
            </div>

            {/* Glowing signal beacon */}
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-80"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-violet-500 border-2 border-[#06070a]"></span>
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-violet-500/20 border border-violet-400/40 text-violet-300 text-xs font-black tracking-wide uppercase">
                <Radio className="w-3.5 h-3.5 text-violet-400" />
                <span>BIENVENIDA OFICIAL A BELENTANI ASTRA AI</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[11px] font-semibold">
                <Calendar className="w-3 h-3 text-cyan-400" />
                <span>Día {dayNumber} de 7 de Inducción</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-semibold">
                <span>● IA En Vivo Escuchando</span>
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
              ¡Hola William Danilo! Haz el <span className="astra-text-glow">Go-Around de Bienvenida</span> con la Voz Humana de Belentani
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              La Inteligencia Artificial está en vivo y lista para hablar contigo en tiempo real. 
              Descubre tu plan de 3º ESO, el laboratorio interactivo en Python con SymPy, los bancos de datos libres mundiales y la suite EduOffice.
            </p>
          </div>
        </div>

        {/* Right Side: CTA Button and Close */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto justify-end">
          <button
            onClick={handleLaunchTour}
            className="w-full sm:w-auto relative group flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 hover:brightness-110 text-white shadow-xl shadow-violet-600/30 border border-violet-400/50 animate-pulse hover:animate-none hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <Compass className="w-4 h-4 text-yellow-100 group-hover:rotate-45 transition-transform" />
            <span className="tracking-wide">INICIAR TOUR CON VOZ</span>
            <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleDismiss}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/[0.08] transition-colors text-xs font-semibold"
            title="Ocultar este aviso por hoy"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
