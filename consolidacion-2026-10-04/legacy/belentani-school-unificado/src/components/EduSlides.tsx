import React, { useState } from 'react';
import { Presentation, Play, Volume2, ChevronLeft, ChevronRight, Sparkles, Plus, Trash2, Maximize2 } from 'lucide-react';
import { speakBelentani, playSoundSuccess, playSoundTone } from '../utils/speech';

interface SlideItem {
  id: string;
  title: string;
  bullets: string[];
  speakerNotes: string;
}

const DEFAULT_SLIDES: SlideItem[] = [
  {
    id: 'slide-1',
    title: 'Mi Presentación: De Brasil a España y Cataluña',
    bullets: [
      'Nombre: William Danilo (14 años).',
      'Origen: Brasil ➔ Nueva etapa en España.',
      'Idiomas: Portugués nativo, aprendiendo Español y Catalán.',
      'Objetivo del curso: Graduado en ESO con mención de honor.'
    ],
    speakerNotes: 'Comienza saludando con energía: "Hola a todos, hoy os presento mi recorrido y cómo me estoy adaptando al instituto".'
  },
  {
    id: 'slide-2',
    title: 'Puentes Lingüísticos: El Español y el Portugués',
    bullets: [
      'Más del 80% de vocabulario compartido entre ambas lenguas.',
      'Similitudes fonéticas: facilidad para la comprensión oral.',
      'Cuidado con los falsos amigos: "embarazada", "propina", "exquisito".',
      'El catalán añade una riqueza cultural adicional en el aula.'
    ],
    speakerNotes: 'Explica con una sonrisa algún falso amigo divertido para romper el hielo con los compañeros.'
  },
  {
    id: 'slide-3',
    title: 'Mis Materias Favoritas y Proyectos 2026',
    bullets: [
      'Matemáticas: Álgebra, funciones y resolución de problemas reales.',
      'Biología y Geología: La nutrición celular y la biodiversidad.',
      'Música: Ritmos brasileños y su conexión con la rumba catalana.',
      'Uso de tecnología para estudiar y preparar exámenes.'
    ],
    speakerNotes: 'Destaca que las matemáticas son un lenguaje universal que se entiende igual en Brasil que en España.'
  },
  {
    id: 'slide-4',
    title: 'Conclusión y Preguntas',
    bullets: [
      'Agradecimiento a los profesores y compañeros por la acogida.',
      'La diversidad de culturas enriquece a todo el grupo.',
      '¡Muchas gracias por vuestra atención!',
      '¿Alguna pregunta o duda?'
    ],
    speakerNotes: 'Termina diciendo: "Muchas gracias, ahora estoy a vuestra disposición si tenéis cualquier pregunta".'
  }
];

export const EduSlides: React.FC = () => {
  const [slides, setSlides] = useState<SlideItem[]>(DEFAULT_SLIDES);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleNextSlide = () => {
    playSoundTone(520, 0.03, 'sine', 0.08);
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrevSlide = () => {
    playSoundTone(480, 0.03, 'sine', 0.08);
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleSpeakSlide = () => {
    playSoundTone(520, 0.04, 'sine', 0.1);
    const textToSpeak = `${currentSlide.title}. ${currentSlide.bullets.join('. ')}`;
    speakBelentani(textToSpeak, { lang: 'es' });
  };

  return (
    <div className="flex flex-col h-full astra-card border border-white/[0.08] overflow-hidden text-slate-200">
      {/* Office Ribbon Header (Astra AI Dark Ribbon with Amber Accent) */}
      <div className="bg-[#090a14] border-b border-white/[0.08] px-4 py-2.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center font-bold text-sm shadow-md">
            <Presentation className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <span className="text-sm font-bold text-white">Exposicion_Oral_Danilo.pptx</span>
            <span className="text-[10px] ml-2 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
              EduSlides · Diapositivas ESO
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSpeakSlide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-xs font-semibold text-amber-200 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Escuchar Diapositiva</span>
          </button>

          <button
            onClick={() => {
              playSoundSuccess();
              setIsPresentationMode(!isPresentationMode);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/30 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isPresentationMode ? 'Salir Presentación' : 'Presentar Pantalla'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Left Slides Rail + Center Stage */}
      <div className="flex-1 flex flex-col md:flex-row bg-[#06070a]/80 overflow-hidden p-4 gap-4">
        {/* Thumbnails Sidebar */}
        <div className="w-full md:w-56 bg-[#0c0d18] rounded-xl shadow-md border border-white/[0.08] p-2.5 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto">
          {slides.map((s, idx) => (
            <div
              key={s.id}
              onClick={() => {
                playSoundTone(480, 0.02, 'sine', 0.05);
                setCurrentSlideIndex(idx);
              }}
              className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex-shrink-0 md:flex-shrink ${
                currentSlideIndex === idx
                  ? 'border-amber-400 bg-amber-950/40 shadow-md ring-1 ring-amber-400/50'
                  : 'border-white/[0.06] bg-slate-900/40 hover:bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                <span>Diapositiva {idx + 1}</span>
              </div>
              <div className="font-bold text-xs text-white truncate">{s.title}</div>
            </div>
          ))}
        </div>

        {/* Center Presentation Stage (16:9 Aspect Ratio) */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-3xl aspect-[16/9] bg-[#0c0d18] rounded-2xl shadow-xl border border-white/[0.08] p-8 flex flex-col justify-between relative overflow-hidden">
            {/* Slide decorative bar */}
            <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-violet-500 to-cyan-500 absolute top-0 left-0" />

            <div>
              <div className="text-[11px] font-bold text-amber-400 tracking-wider uppercase mb-1">
                Belentani School · 3º ESO Presentación
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight leading-snug">
                {currentSlide.title}
              </h2>
            </div>

            <div className="my-auto space-y-3 pl-2">
              {currentSlide.bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                  <p className="text-slate-200 text-sm md:text-base leading-relaxed font-medium">
                    {b}
                  </p>
                </div>
              ))}
            </div>

            {/* Slide Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.08] text-xs text-slate-500">
              <span>Alumno: <strong className="text-white">William Danilo</strong></span>
              <span>{currentSlideIndex + 1} / {slides.length}</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={handlePrevSlide}
              disabled={currentSlideIndex === 0}
              className="p-2 rounded-xl bg-slate-900 border border-white/[0.08] hover:bg-slate-800 disabled:opacity-30 transition-all text-slate-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-slate-400 font-mono">
              Diapositiva {currentSlideIndex + 1} de {slides.length}
            </span>
            <button
              onClick={handleNextSlide}
              disabled={currentSlideIndex === slides.length - 1}
              className="p-2 rounded-xl bg-slate-900 border border-white/[0.08] hover:bg-slate-800 disabled:opacity-30 transition-all text-slate-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Speaker Notes Drawer */}
        <div className="w-full md:w-72 bg-[#0c0d18] rounded-xl shadow-md border border-white/[0.08] p-4 flex flex-col gap-2">
          <div className="text-xs font-bold text-white flex items-center gap-1.5 pb-2 border-b border-white/[0.08]">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Notas para el Orador (Danilo)</span>
          </div>
          <div className="text-xs text-amber-200/90 leading-relaxed italic bg-amber-950/30 p-3 rounded-xl border border-amber-500/30">
            "{currentSlide.speakerNotes}"
          </div>
          <div className="text-[11px] text-slate-400 mt-auto pt-2 border-t border-white/[0.08]">
            💡 <em>Consejo de Belentani:</em> En las exposiciones orales en España se valora la claridad, no leer directamente la diapositiva y responder con amabilidad a las preguntas.
          </div>
        </div>
      </div>
    </div>
  );
};
