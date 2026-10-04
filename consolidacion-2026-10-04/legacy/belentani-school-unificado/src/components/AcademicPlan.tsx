import React, { useState } from 'react';
import { ACADEMIC_MODULES } from '../data/curriculumData';
import { SubjectModule, TopicLesson, AcademicYear } from '../types';
import { 
  BookOpen, Calculator, GraduationCap, Globe2, Atom, Layers, 
  Volume2, CheckCircle2, XCircle, Sparkles, ChevronRight, HelpCircle, 
  SquareCode, TrendingUp, Trophy, Compass, FileText, Check, Code2, Terminal,
  Camera, Zap, Brain, ArrowRight, Star, RefreshCw, Upload, Eye, CheckCheck,
  Scale, Target, Award, Flame, Sliders, Play, RotateCcw, ChevronLeft,
  Gamepad2, Lightbulb, CheckCircle, Clock
} from 'lucide-react';
import { speakBelentani, playSoundSuccess, playSoundError, playSoundTone } from '../utils/speech';
import { AstraHeroSolver } from './AstraHeroSolver';
import { runPythonCode } from '../services/pythonService';
import { InteractiveCourseLab } from './InteractiveCourseLab';
import { SpaceInvadersGame, PongGame, SnakeGame } from './RetroArcadeEngines';
import confetti from 'canvas-confetti';

export type ModuleStage = 
  | '1_situacion'
  | '2_descubre'
  | '3_habla'
  | '4_manipula'
  | '5_practica'
  | '6_python'
  | '7_reto'
  | '8_examen';

export const AcademicPlan: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<AcademicYear>('3eso');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('mates-3eso');
  const [activeTopicIndex, setActiveTopicIndex] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<ModuleStage>('1_situacion');

  // Exercise & Exam state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, number>>({});
  
  // Interactive Python console state
  const [pythonCode, setPythonCode] = useState<string>(
    `import sympy as sp\n\n# Resolver ecuación de 2º grado: x^2 - 5x + 6 = 0\nx = sp.Symbol('x')\necuacion = sp.Eq(x**2 - 5*x + 6, 0)\nsoluciones = sp.solve(ecuacion, x)\n\nprint("Soluciones simbólicas exactas:", soluciones)\nprint("Verificación paso a paso:", [float(s) for s in soluciones])`
  );
  const [pythonOutput, setPythonOutput] = useState<string | null>(null);
  const [isExecutingPython, setIsExecutingPython] = useState<boolean>(false);

  // Quick tutor voice/chat state
  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorReply, setTutorReply] = useState<string | null>(null);
  const [isTutorThinking, setIsTutorThinking] = useState(false);

  // Challenge game score state
  const [challengeScore, setChallengeScore] = useState<number>(0);
  const [challengeCompleted, setChallengeCompleted] = useState<boolean>(false);

  // Filter modules
  const yearModules = ACADEMIC_MODULES.filter(m => m.year === selectedYear);
  const currentModule = ACADEMIC_MODULES.find(m => m.id === selectedModuleId) || yearModules[0] || ACADEMIC_MODULES[0];
  const activeTopic = currentModule.topics[activeTopicIndex] || currentModule.topics[0];

  const stagesList: { id: ModuleStage; label: string; icon: string; short: string }[] = [
    { id: '1_situacion', label: '1. Situación Real', icon: '🎬', short: 'Entrada' },
    { id: '2_descubre', label: '2. Descubre', icon: '🧠', short: 'Teoría' },
    { id: '3_habla', label: '3. Habla con Astra', icon: '🗣️', short: 'Tutor' },
    { id: '4_manipula', label: '4. Manipula', icon: '⚖️', short: 'Laboratorio' },
    { id: '5_practica', label: '5. Practica', icon: '✏️', short: 'Problemas' },
    { id: '6_python', label: '6. Python & SymPy', icon: '🐍', short: 'Comprueba' },
    { id: '7_reto', label: '7. Reto de Práctica', icon: '🎮', short: 'Minijuego 3 min' },
    { id: '8_examen', label: '8. Mini-Examen & Dominio', icon: '📝', short: 'Evaluación' }
  ];

  const currentStageIndex = stagesList.findIndex(s => s.id === currentStage);

  const goToNextStage = () => {
    if (currentStageIndex < stagesList.length - 1) {
      const next = stagesList[currentStageIndex + 1].id;
      setCurrentStage(next);
      playSoundSuccess();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevStage = () => {
    if (currentStageIndex > 0) {
      const prev = stagesList[currentStageIndex - 1].id;
      setCurrentStage(prev);
      playSoundTone(480, 0.04, 'sine', 0.08);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSpeak = (text: string, lang: 'es' | 'ca' | 'pt' = 'es') => {
    playSoundTone(520, 0.04, 'sine', 0.1);
    speakBelentani(text, { lang, rate: 0.94 });
  };

  const handleExecutePython = async () => {
    setIsExecutingPython(true);
    playSoundTone(440, 0.05, 'sine', 0.1);

    const result = await runPythonCode(pythonCode);

    setIsExecutingPython(false);
    if (result.success) {
      playSoundSuccess();
    } else {
      playSoundError();
    }

    setPythonOutput(
      `>>> Ejecutando Python 3.10 real (backend /api/python/execute)...\n` +
      (result.stdout || '') +
      (result.stderr ? `\n[stderr]\n${result.stderr}` : '') +
      `\n\nTiempo: ${result.executionTimeMs}ms · Código de salida: ${result.returnCode ?? 0}`
    );
  };

  const handleAskTutor = (customQuery?: string) => {
    const q = customQuery || tutorQuery;
    if (!q.trim()) return;
    setIsTutorThinking(true);
    playSoundTone(500, 0.05, 'sine', 0.1);

    fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Sobre el tema "${activeTopic.title}" en 3º de ESO: ${q}`,
        role: 'belentani',
        model: 'gemini-3.5-flash'
      })
    })
      .then(res => res.json())
      .then(data => {
        setIsTutorThinking(false);
        const reply = data.reply || data.fallbackReply || '¡Entendido, William! Sigue con el siguiente paso de la lección.';
        setTutorReply(reply);
        playSoundSuccess();
        speakBelentani(reply, { lang: 'es' });
      })
      .catch(() => {
        setIsTutorThinking(false);
        const local = `En ${activeTopic.title}, lo esencial es entender el concepto antes de memorizar la fórmula. ¡Fíjate en la balanza para equilibrar ambos lados!`;
        setTutorReply(local);
        speakBelentani(local, { lang: 'es' });
      });
  };

  const handleAnswerSelect = (exId: string, optIdx: number, correctIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [exId]: optIdx }));
    setShowExplanations(prev => ({ ...prev, [exId]: true }));
    if (optIdx === correctIdx) {
      playSoundSuccess();
    } else {
      playSoundError();
    }
  };

  const courseList: { id: AcademicYear; label: string; age: string; note: string }[] = [
    { id: '1eso', label: '1º ESO', age: '12-13 años', note: 'Fundamentos ESO' },
    { id: '2eso', label: '2º ESO', age: '13-14 años', note: 'Consolidación' },
    { id: '3eso', label: '3º ESO', age: '14 años', note: '⭐ Curso de Danilo' },
    { id: '4eso', label: '4º ESO', age: '15-16 años', note: 'Graduado ESO' },
    { id: '1bach', label: '1º Bachillerato', age: '16-17 años', note: 'Bachillerato' },
    { id: '2bach', label: '2º Bach / PAU', age: '17-18 años', note: 'Acceso Selectividad' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Astra AI Signature Hero Problem Solver (real, cámara + IA paso a paso) */}
      <AstraHeroSolver />

      {/* Course Bar & Year Selection */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#090a14] border border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[11px] font-black uppercase tracking-wide border border-violet-500/30">
              MI CURSO · ITINERARIO CONTINUO
            </span>
            <span className="text-xs text-slate-400">Currículo LOMLOE Adaptado</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1">
            Módulos Cerrados y Continuos de Aprendizaje
          </h2>
        </div>

        {/* Course Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {courseList.map((c) => {
            const isSelected = selectedYear === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedYear(c.id);
                  const firstMod = ACADEMIC_MODULES.find(m => m.year === c.id);
                  if (firstMod) setSelectedModuleId(firstMod.id);
                  setActiveTopicIndex(0);
                  setCurrentStage('1_situacion');
                  playSoundTone(480, 0.04, 'sine', 0.08);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30 border border-violet-400'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                <span>{c.label}</span>
                {c.id === '3eso' && (
                  <span className="ml-1 text-[10px] text-amber-300">★</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Module Selector within the Course */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {yearModules.map((m) => {
          const isSelected = selectedModuleId === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                setSelectedModuleId(m.id);
                setActiveTopicIndex(0);
                setCurrentStage('1_situacion');
                playSoundTone(520, 0.04, 'sine', 0.08);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-[#151733] border-violet-500/80 text-white shadow-lg shadow-violet-950/40'
                  : 'bg-[#080912] border-white/[0.06] text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{m.name.includes('Matemáticas') ? '📐' : m.name.includes('Lengua') ? '📖' : m.name.includes('Catalana') ? '🎗️' : m.name.includes('Ciencias') ? '🧬' : '🌍'}</span>
              <span>{m.name}</span>
            </button>
          );
        })}
      </div>

      {/* 8-Stage Stepper Bar for Continuous Closed Module */}
      <div className="p-4 rounded-2xl bg-[#0b0c17] border border-white/[0.08] space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="font-black text-white">{currentModule.name}</span>
            <span className="text-slate-500">•</span>
            <span className="text-violet-300 font-semibold">{activeTopic.title}</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            Etapa {currentStageIndex + 1} de {stagesList.length}: <strong className="text-white">{stagesList[currentStageIndex].label}</strong>
          </div>
        </div>

        {/* Stepper Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {stagesList.map((stage, idx) => {
            const isActive = currentStage === stage.id;
            const isCompleted = idx < currentStageIndex;

            return (
              <button
                key={stage.id}
                onClick={() => {
                  setCurrentStage(stage.id);
                  playSoundTone(480, 0.04, 'sine', 0.08);
                }}
                className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-violet-600 border-violet-400 text-white shadow-md shadow-violet-600/30 ring-2 ring-violet-500/40'
                    : isCompleted
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-900/50 border-white/[0.04] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{stage.icon}</span>
                  {isCompleted ? (
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <span className="text-[9px] opacity-70 font-mono">#{idx + 1}</span>
                  )}
                </div>
                <div className="text-[11px] font-bold truncate mt-1">
                  {stage.short}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 8 STAGES CONTENT VIEWPORT */}
      {/* ======================================================== */}
      <div className="astra-card p-6 sm:p-8 rounded-3xl border border-white/[0.08] bg-[#0a0b16] space-y-6">
        
        {/* ETAPA 1: SITUACIÓN REAL */}
        {currentStage === '1_situacion' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl">
                🎬
              </div>
              <div>
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider">Etapa 1 · Entrada</span>
                <h3 className="text-xl sm:text-2xl font-black text-white">Situación de la Vida Real</h3>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#121324] to-[#0d0e1b] border border-white/[0.08] space-y-4">
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                Imagina que en el recreo del instituto en 3º de ESO estás jugando con tus nuevos compañeros. 
                Alguien lanza un balón de baloncesto al aire y quieres saber en qué segundo alcanzará la canasta o tocará el suelo. 
                La física y las matemáticas no son abstracciones: la trayectoria del tiro sigue exactamente una <strong className="text-white font-bold">ecuación de segundo grado</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-white/[0.06] space-y-1">
                  <span className="text-xs font-bold text-violet-400">¿Por qué importa para William Danilo?</span>
                  <p className="text-xs text-slate-300">
                    Aprender matemáticas mediante analogías visuales reduce el esfuerzo de idioma y te da seguridad total en clase.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-white/[0.06] space-y-1">
                  <span className="text-xs font-bold text-emerald-400">Objetivo de este Módulo</span>
                  <p className="text-xs text-slate-300">
                    Despejar cualquier incógnita con soltura, equilibrar la balanza y comprobar el resultado con Python.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-white/[0.06]">
              <button
                onClick={goToNextStage}
                className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>Avanzar a: 🧠 2. Descubre (Teoría)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 2: DESCUBRE (TEORÍA SOCRÁTICA & PUENTE LINGÜÍSTICO) */}
        {currentStage === '2_descubre' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-2xl">
                  🧠
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-indigo-400 tracking-wider">Etapa 2 · Teoría Socrática</span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{activeTopic.title}</h3>
                </div>
              </div>

              <button
                onClick={() => handleSpeak(activeTopic.summary, 'es')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/[0.08] hover:border-violet-400 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-violet-400" />
                <span>Escuchar Explicación</span>
              </button>
            </div>

            {/* Topic Summary */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/[0.08] text-sm text-slate-200 leading-relaxed">
              {activeTopic.summary}
            </div>

            {/* Dynamic Language Bridges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTopic.portugueseBridge && (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-emerald-300 font-black text-xs">
                    <span>🇧🇷 Puente Português (Brasil)</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{activeTopic.portugueseBridge}</p>
                </div>
              )}

              {activeTopic.catalanBridge && (
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-amber-300 font-black text-xs">
                    <span>🇨🇦 Pont Lingüístic en Català</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{activeTopic.catalanBridge}</p>
                </div>
              )}
            </div>

            {/* Key Concepts Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Conceptos Clave Contrastivos
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeTopic.keyConcepts.map((c, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-white text-sm">{c.term}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{c.en}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-[11px] font-mono text-slate-400 pt-1 border-t border-white/[0.04]">
                      <div><span className="text-emerald-400">PT:</span> {c.pt}</div>
                      <div><span className="text-amber-400">ES:</span> {c.es}</div>
                      <div><span className="text-cyan-400">CA:</span> {c.ca}</div>
                    </div>
                    <p className="text-slate-300 text-xs pt-1">{c.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <button
                onClick={goToPrevStage}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Paso Anterior</span>
              </button>
              <button
                onClick={goToNextStage}
                className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
              >
                <span>Avanzar a: 🗣️ 3. Habla con Astra</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 3: HABLA CON ASTRA */}
        {currentStage === '3_habla' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-2xl">
                🗣️
              </div>
              <div>
                <span className="text-xs font-black uppercase text-rose-400 tracking-wider">Etapa 3 · Tutor en Vivo</span>
                <h3 className="text-xl sm:text-2xl font-black text-white">Pregunta Cualquier Duda a Astra</h3>
                <p className="text-xs text-slate-400">Conversación contextualizada sobre: "{activeTopic.title}"</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c0d1b] border border-white/[0.08] space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={tutorQuery}
                  onChange={(e) => setTutorQuery(e.target.value)}
                  placeholder="Escribe o pregunta por voz: ej. ¿Por qué el discriminante negativo no tiene solución real?"
                  onKeyDown={(e) => e.key === 'Enter' && handleAskTutor()}
                  className="flex-1 px-4 py-3 rounded-xl bg-black/50 border border-white/[0.1] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-violet-400"
                />
                <button
                  onClick={() => handleAskTutor()}
                  disabled={isTutorThinking}
                  className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
                >
                  {isTutorThinking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>Preguntar a Astra</span>
                </button>
              </div>

              {/* Quick Prompt Chips */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 text-[11px]">Preguntas sugeridas:</span>
                {[
                  "Explícamelo con la analogía de la balanza",
                  "¿Cómo se dice esto en portugués y en catalán?",
                  "Dame un ejemplo paso a paso"
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTutorQuery(chip);
                      handleAskTutor(chip);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/[0.06] text-[11px] transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Tutor Response Box */}
              {tutorReply && (
                <div className="p-4 rounded-xl bg-violet-950/40 border border-violet-500/40 text-xs text-slate-200 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between font-bold text-violet-300">
                    <span>Respuesta de Astra Belentani:</span>
                    <button
                      onClick={() => handleSpeak(tutorReply, 'es')}
                      className="text-[11px] text-violet-400 hover:text-violet-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Escuchar</span>
                    </button>
                  </div>
                  <p className="leading-relaxed">{tutorReply}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <button
                onClick={goToPrevStage}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Paso Anterior</span>
              </button>
              <button
                onClick={goToNextStage}
                className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
              >
                <span>Avanzar a: ⚖️ 4. Manipula (Laboratorio)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 4: MANIPULA (LABORATORIO INTERACTIVO EMBEBIDO) */}
        {currentStage === '4_manipula' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-2xl">
                ⚖️
              </div>
              <div>
                <span className="text-xs font-black uppercase text-cyan-400 tracking-wider">Etapa 4 · Laboratorio Visual</span>
                <h3 className="text-xl sm:text-2xl font-black text-white">Manipula y Experimenta</h3>
                <p className="text-xs text-slate-400">Manipulativo dinámico para fijar el concepto visualmente</p>
              </div>
            </div>

            {/* Embedded Course Lab Component */}
            <div className="border border-white/[0.08] rounded-2xl overflow-hidden bg-black/40 p-1">
              <InteractiveCourseLab 
                currentSubjectName={currentModule.name}
                activeTopicTitle={activeTopic.title}
                yearLabel={currentModule.yearLabel}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <button
                onClick={goToPrevStage}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Paso Anterior</span>
              </button>
              <button
                onClick={goToNextStage}
                className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
              >
                <span>Avanzar a: ✏️ 5. Practica (Problemas)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 5: PRACTICA (PROBLEMAS ADAPTATIVOS CON PISTAS SOCRÁTICAS) */}
        {currentStage === '5_practica' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-2xl">
                ✏️
              </div>
              <div>
                <span className="text-xs font-black uppercase text-violet-400 tracking-wider">Etapa 5 · Práctica Adaptativa</span>
                <h3 className="text-xl sm:text-2xl font-black text-white">Problemas Paso a Paso con Pistas</h3>
              </div>
            </div>

            <div className="space-y-4">
              {currentModule.exercises.slice(0, 3).map((ex, index) => {
                const userChoice = selectedAnswers[ex.id];
                const isCorrect = userChoice === ex.correctIndex;
                const hasAnswered = userChoice !== undefined;
                const hintLevel = revealedHints[ex.id] || 0;

                return (
                  <div
                    key={ex.id}
                    className="p-5 rounded-2xl bg-[#0b0c19] border border-white/[0.08] space-y-4"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-violet-400">Problema {index + 1} ({ex.difficulty})</span>
                      {hasAnswered && (
                        <span className={`font-black flex items-center gap-1 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          <span>{isCorrect ? '¡Correcto!' : 'Revisa el razonamiento'}</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-white">{ex.question}</h4>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {ex.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => handleAnswerSelect(ex.id, optIdx, ex.correctIndex)}
                          className={`p-3 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer ${
                            hasAnswered
                              ? optIdx === ex.correctIndex
                                ? 'bg-emerald-950/60 border-emerald-400 text-white font-bold'
                                : optIdx === userChoice
                                  ? 'bg-rose-950/60 border-rose-400 text-slate-300'
                                  : 'bg-black/30 border-white/[0.04] text-slate-500'
                              : 'bg-black/40 hover:bg-slate-900 border-white/[0.06] text-slate-200'
                          }`}
                        >
                          <span className="font-mono text-slate-400 mr-2">{String.fromCharCode(65 + optIdx)})</span>
                          <span>{opt}</span>
                        </button>
                      ))}
                    </div>

                    {/* Socratic Hints Ladder */}
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          setRevealedHints(prev => ({ ...prev, [ex.id]: Math.min(3, (prev[ex.id] || 0) + 1) }));
                          playSoundTone(500, 0.03, 'sine', 0.08);
                        }}
                        className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        <span>Ver Pista Socrática {hintLevel > 0 ? `(${hintLevel}/3)` : ''}</span>
                      </button>
                    </div>

                    {hintLevel > 0 && (
                      <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 space-y-1 animate-in fade-in">
                        <span className="font-bold block">Pista {hintLevel}:</span>
                        <p>{ex.portugueseTip || ex.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <button
                onClick={goToPrevStage}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Paso Anterior</span>
              </button>
              <button
                onClick={goToNextStage}
                className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
              >
                <span>Avanzar a: 🐍 6. Comprueba con Python</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 6: PYTHON & SYMPY (VERIFICACIÓN MATEMÁTICA) */}
        {currentStage === '6_python' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl">
                🐍
              </div>
              <div>
                <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">Etapa 6 · Comprobación Exacta</span>
                <h3 className="text-xl sm:text-2xl font-black text-white">Comprueba con Python & SymPy</h3>
                <p className="text-xs text-slate-400">Verificación simbólica exacta sin margen de error</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400">kernel: python-3.12 (sympy, numpy)</span>
                <button
                  onClick={handleExecutePython}
                  disabled={isExecutingPython}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  {isExecutingPython ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  <span>Ejecutar y Comprobar</span>
                </button>
              </div>

              <textarea
                value={pythonCode}
                onChange={(e) => setPythonCode(e.target.value)}
                rows={6}
                className="w-full p-4 rounded-xl bg-[#070810] border border-white/[0.1] font-mono text-xs text-emerald-300 focus:outline-none focus:border-emerald-500/60 leading-relaxed"
              />

              {pythonOutput && (
                <div className="p-4 rounded-xl bg-[#05060b] border border-emerald-500/30 space-y-1.5 animate-in fade-in">
                  <span className="font-mono text-[10px] uppercase font-bold text-emerald-400 block">Salida de la Consola SymPy:</span>
                  <pre className="font-mono text-xs text-slate-200 whitespace-pre-wrap">{pythonOutput}</pre>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <button
                onClick={goToPrevStage}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Paso Anterior</span>
              </button>
              <button
                onClick={goToNextStage}
                className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
              >
                <span>Avanzar a: 🎮 7. Reto de Práctica (3 min)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 7: RETO DE PRÁCTICA (MINIJUEGO CONTEXTUAL 3 MIN, +50 XP) */}
        {currentStage === '7_reto' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl">
                  🎮
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-amber-400 tracking-wider">Etapa 7 · Pausa Lúdica Pedagógica</span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">Reto de 3 Minutos: Reflejos & Concentración</h3>
                  <p className="text-xs text-slate-400">Recompensa pedagógica (+50 XP) para despejar la mente antes de la evaluación</p>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-xs flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Puntos conseguidos: {challengeScore} XP</span>
              </div>
            </div>

            {/* Embedded 3-minute challenge game */}
            <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/[0.06]">
                <span>Juego contextual: <strong>Disparo Matemático / Reflejos Arcade</strong></span>
                <span className="text-emerald-400 font-bold">Tiempo estimado: 3 minutos</span>
              </div>

              <div className="w-full flex justify-center">
                <SpaceInvadersGame 
                  game={{
                    id: 'space-invaders',
                    number: 7,
                    title: 'Space Invaders 1978',
                    category: 'Álgebra & Reflejos',
                    era: '1970s',
                    difficulty: 'Media',
                    rating: 4.8,
                    plays: 1200,
                    description: 'Destruye las naves respondiendo con rapidez antes de que toquen la base.',
                    controls: 'Usa el ratón o flechas para moverte y disparar.',
                    educationalSkill: 'Cálculo mental y reflejos',
                    color: '#8b5cf6'
                  }}
                  onScore={(pts) => {
                    setChallengeScore(prev => prev + pts);
                    if (pts > 20 && !challengeCompleted) {
                      setChallengeCompleted(true);
                      confetti({ particleCount: 40, spread: 60 });
                    }
                  }}
                />
              </div>

              {challengeCompleted && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center animate-in fade-in">
                  🎉 ¡Reto completado! Has ganado +50 XP y tu mente está lista para el mini-examen.
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <button
                onClick={goToPrevStage}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Paso Anterior</span>
              </button>
              <button
                onClick={goToNextStage}
                className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
              >
                <span>Avanzar a: 📝 8. Mini-Examen & Dominio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 8: MINI-EXAMEN & DOMINIO */}
        {currentStage === '8_examen' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-2xl">
                📝
              </div>
              <div>
                <span className="text-xs font-black uppercase text-purple-400 tracking-wider">Etapa 8 · Evaluación Formativa</span>
                <h3 className="text-xl sm:text-2xl font-black text-white">Mini-Examen y Certificación de Dominio</h3>
                <p className="text-xs text-slate-400">Comprueba lo aprendido para certificar la competencia Bloom</p>
              </div>
            </div>

            {/* Formula sheet & review */}
            <div className="p-5 rounded-2xl bg-[#0e0f22] border border-violet-500/30 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-violet-300">
                Ficha de Fórmulas y Objetivos del Módulo
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {currentModule.examReview.formulaSheet.map((f, i) => (
                  <li key={i} className="font-mono bg-black/40 p-2 rounded-lg border border-white/[0.04]">
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mock Exam Questions */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Preguntas de Evaluación Formativa
              </h4>
              <div className="space-y-3">
                {currentModule.examReview.mockQuestions.map((mq, i) => (
                  <div key={i} className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2 text-xs">
                    <span className="font-bold text-white block">Pregunta {i + 1}: {mq.q}</span>
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-white/[0.04] text-slate-300 leading-relaxed">
                      <strong className="text-emerald-400">Solución y Rúbrica:</strong> {mq.a}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mastery Certificate Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-950/60 via-purple-950/60 to-slate-950 border border-violet-500/40 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-violet-600/30 text-violet-300 flex items-center justify-center mx-auto border border-violet-400/50 text-2xl">
                🏆
              </div>
              <div>
                <h4 className="text-lg font-black text-white">¡Módulo Completado, William Danilo!</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                  Has recorrido las 8 etapas continuas de este módulo con éxito. Tu progreso se ha registrado en tu cuaderno de 3º de ESO.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    confetti({ particleCount: 100, spread: 80 });
                    playSoundSuccess();
                    setCurrentStage('1_situacion');
                    if (activeTopicIndex < currentModule.topics.length - 1) {
                      setActiveTopicIndex(prev => prev + 1);
                    }
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:brightness-110 text-white font-black text-xs shadow-xl shadow-violet-600/40 transition-all cursor-pointer"
                >
                  Siguiente Lección del Módulo
                </button>
              </div>
            </div>

            <div className="flex items-center justify-start pt-4 border-t border-white/[0.06]">
              <button
                onClick={goToPrevStage}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Paso Anterior</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
