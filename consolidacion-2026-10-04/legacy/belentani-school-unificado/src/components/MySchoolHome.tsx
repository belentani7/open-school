import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Zap, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  Volume2, 
  Compass, 
  CheckCircle2, 
  Calendar, 
  Award,
  Play,
  Languages,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { speakBelentani, playSoundSuccess, playSoundTone } from '../utils/speech';
import { NavigationTab } from '../types';

interface MySchoolHomeProps {
  onNavigate: (tab: NavigationTab) => void;
  studyMinutes: number;
}

export const MySchoolHome: React.FC<MySchoolHomeProps> = ({ onNavigate, studyMinutes }) => {
  const handleSpeakWelcome = () => {
    playSoundTone(520, 0.05, 'sine', 0.1);
    speakBelentani(
      "¡Hola William Danilo! Bienvenido a tu escuela digital continua. Hoy tienes tres misiones preparadas para 3º de la ESO: Matemáticas, Catalán y Ciencias. En lugar de cambiar de aplicación en aplicación, cada clase es un módulo continuo con teoría, audio en vivo, laboratorio visual y práctica. ¡Vamos a por ello, guerrero!",
      { lang: 'es' }
    );
  };

  const dailyMissions = [
    {
      id: 'm-mates',
      subject: 'Matemáticas 3º ESO',
      topic: 'Ecuaciones de 2º Grado',
      detail: 'Fórmula general, discriminante y balanza de equivalencia.',
      duration: '20 min',
      icon: '📐',
      color: 'from-violet-600 to-indigo-600',
      border: 'border-violet-500/30',
      progress: 72,
      actionLabel: 'Continuar Módulo',
      targetTab: 'curso' as NavigationTab
    },
    {
      id: 'm-catala',
      subject: 'Llengua Catalana 3º ESO',
      topic: 'L\'Institut i l\'Esbarjo',
      detail: 'Vocabulario para el recreo, pedir la palabra y puente PT-ES-CA.',
      duration: '15 min',
      icon: '🎗️',
      color: 'from-amber-600 to-orange-600',
      border: 'border-amber-500/30',
      progress: 45,
      actionLabel: 'Entrar a la Lección',
      targetTab: 'curso' as NavigationTab
    },
    {
      id: 'm-ciencias',
      subject: 'Biología y Geología',
      topic: 'La Célula Eucariota',
      detail: 'Orgánulos celulares y los 4 aparatos de nutrición humana.',
      duration: '20 min',
      icon: '🧬',
      color: 'from-emerald-600 to-teal-600',
      border: 'border-emerald-500/30',
      progress: 20,
      actionLabel: 'Iniciar Práctica',
      targetTab: 'curso' as NavigationTab
    }
  ];

  const inductionDays = [
    { day: 1, title: 'Conoce tu Escuela', desc: 'Recorrido por el aula continua y las materias de 3º ESO.', current: true },
    { day: 2, title: 'Pedir Ayuda al Profe', desc: 'Frases seguras en castellano y catalán sin pasar vergüenza.', current: false },
    { day: 3, title: 'El Código del Recreo', desc: 'Cómo hablar con tus compañeros y jerga juvenil de 14 años.', current: false },
    { day: 4, title: 'El Horario Continuo', desc: 'Gestión del tiempo de 8:00 a 14:30 y las notas de 1 a 10.', current: false },
    { day: 5, title: 'Conversación Real', desc: 'Práctica guiada en vivo con tu tutor Belentani.', current: false }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Hero: Belentani School OS Desk */}
      <div className="astra-card astra-card-glow p-6 sm:p-8 border border-white/[0.08] relative overflow-hidden bg-gradient-to-br from-[#0d0e1d] via-[#090a16] to-[#05060a]">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/40 text-violet-300 text-xs font-black tracking-wide uppercase">
                <Compass className="w-3.5 h-3.5 text-violet-400" />
                <span>BELENTANI SCHOOL OS · ESCRITORIO PRINCIPAL</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <span>William Danilo · 14 años (3º ESO)</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              ¡Hola William! Tienes <span className="astra-text-glow">3 misiones preparadas</span> para hoy.
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              En lugar de navegar entre muchas aplicaciones dispersas, tus clases son <strong className="text-white">módulos continuos</strong>: 
              entras, descubres el concepto, hablas con tu tutor en vivo, manipulas la balanza visual y compruebas con Python en un solo lugar.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => {
                  playSoundSuccess();
                  onNavigate('claseDelDia');
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>📅 Clase Dictada de Hoy (365 Días · 4h)</span>
              </button>

              <button
                onClick={() => {
                  playSoundSuccess();
                  onNavigate('curso');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-white/[0.08] font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Módulos 8 Pasos (3º ESO)</span>
              </button>

              <button
                onClick={() => {
                  playSoundSuccess();
                  onNavigate('live');
                }}
                className="px-4 py-2.5 rounded-xl bg-[#0e0f22] hover:bg-[#151736] text-violet-200 border border-violet-500/40 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>🎙️ Conversación en Vivo con Belentani</span>
              </button>

              <button
                onClick={handleSpeakWelcome}
                className="px-3 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/[0.08] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Escuchar audio de bienvenida"
              >
                <Volume2 className="w-3.5 h-3.5 text-violet-400" />
                <span>Audio Belentani</span>
              </button>
            </div>
          </div>

          {/* Quick Progress & Status Card */}
          <div className="w-full lg:w-80 p-5 rounded-2xl bg-[#070810]/80 border border-white/[0.08] space-y-4 shrink-0 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-white/[0.06]">
              <span className="font-bold text-slate-300">Tu Estado Académico</span>
              <span className="px-2 py-0.5 rounded-full bg-violet-950/80 text-violet-300 text-[10px] font-bold border border-violet-500/30">
                Curso: 3º ESO
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/[0.04] space-y-1">
                <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-bold">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  <span>14 Días</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">Racha de Estudio</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/[0.04] space-y-1">
                <div className="flex items-center justify-center gap-1 text-cyan-400 text-xs font-bold">
                  <Zap className="w-3.5 h-3.5 fill-cyan-400" />
                  <span>2,840 XP</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">Nivel 3º ESO</div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Tiempo de estudio hoy:</span>
                <span className="font-bold text-white">{studyMinutes} min / 60 min</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (studyMinutes / 60) * 100)}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Entorno protegido</span>
              </span>
              <span>Descanso c/ 20 min</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Misiones de Hoy (Continuous closed modules) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <h2 className="text-base sm:text-lg font-black text-white">Misiones Diarias Recomendadas</h2>
            <span className="text-xs text-slate-400 hidden sm:inline">· Módulos cerrados de aprendizaje</span>
          </div>
          <button
            onClick={() => onNavigate('curso')}
            className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Ver plan curricular completo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dailyMissions.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-2xl bg-[#0c0d18] border border-white/[0.08] hover:border-violet-500/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-2xl p-2 rounded-xl bg-slate-900 border border-white/[0.06]">{m.icon}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-white/[0.06]">
                    <Clock className="w-3 h-3 text-violet-400" />
                    <span>{m.duration}</span>
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-violet-400 block">
                    {m.subject}
                  </span>
                  <h3 className="text-base font-black text-white group-hover:text-violet-200 transition-colors">
                    {m.topic}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {m.detail}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-white/[0.06]">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Progreso del módulo:</span>
                    <span className="font-mono font-bold text-white">{m.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-violet-500 rounded-full transition-all"
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    playSoundSuccess();
                    onNavigate(m.targetTab);
                  }}
                  className="w-full py-2.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/40 text-violet-200 border border-violet-500/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer group-hover:border-violet-400"
                >
                  <span>{m.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-violet-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Induction & Cultural Landing Banner (7 Days to master the Spanish secondary school) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#090a14] border border-white/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
              🌟
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">
                Ruta de Acompañamiento: Tus Primeros 7 Días en el Instituto
              </h3>
              <p className="text-xs text-slate-300">
                Paso a paso para adaptarte a la escuela española y al catalán con tu mentor Belentani.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('cultura')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Ver Guía SOS de Aterrizaje</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {inductionDays.map((step) => (
            <div
              key={step.day}
              className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                step.current
                  ? 'bg-violet-950/40 border-violet-400 text-white shadow-md'
                  : 'bg-slate-900/40 border-white/[0.06] text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase ${step.current ? 'text-violet-300' : 'text-slate-500'}`}>
                  Día {step.day}
                </span>
                {step.current && (
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                )}
              </div>
              <div className="font-bold text-slate-200 text-xs">{step.title}</div>
              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Language Bridge Scaffolding Note */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-[#0c0d18] to-slate-900/40 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs">
          <Languages className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-black text-white block">Puente Lingüístico Dinámico: El Portugués es tu ventaja</span>
            <p className="text-slate-300">
              No tienes que ocultar tu lengua materna: Belentani te explica el andamiaje <strong className="text-emerald-300">Português ➔ Castellano ➔ Català</strong> para que cada concepto sea cristalino.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('live')}
          className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 font-bold text-xs whitespace-nowrap cursor-pointer transition-colors shrink-0"
        >
          Probar en Conversación Live
        </button>
      </div>
    </div>
  );
};
