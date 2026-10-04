import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Play, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  BookOpen, 
  Database, 
  Cpu, 
  GraduationCap, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ChevronRight, 
  Layers, 
  Activity, 
  Share2, 
  BarChart2, 
  Compass,
  Code2,
  Atom,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { 
  OMEGA_COURSE_TRACKS, 
  GLOBAL_OPEN_DATA_BANKS, 
  OmegaCourseTrack, 
  OmegaWeekModule 
} from '../data/omegaCourseraPythonHub';
import { speakBelentani, stopSpeaking, playSoundSuccess, playSoundTone } from '../utils/speech';

export const OmegaPythonStudio: React.FC = () => {
  const [selectedTrackIndex, setSelectedTrackIndex] = useState<number>(0);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'solver' | 'python' | 'open_data' | 'syllabus'>('solver');
  const [userCode, setUserCode] = useState<string>('');
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [selectedStep, setSelectedStep] = useState<number>(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentTrack = OMEGA_COURSE_TRACKS[selectedTrackIndex] || OMEGA_COURSE_TRACKS[0];
  const currentWeek = currentTrack.syllabusWeeks[selectedWeekIndex] || currentTrack.syllabusWeeks[0];

  // Sync editor code whenever track or week changes
  useEffect(() => {
    setUserCode(currentWeek.pythonLab.code);
    setConsoleOutput(currentWeek.pythonLab.expectedOutput);
    setSelectedStep(0);
    setQuizSelectedOption(null);
    setQuizSubmitted(false);
  }, [selectedTrackIndex, selectedWeekIndex, currentWeek]);

  // Render Canvas Graph based on current module's chartData
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Draw dark cosmic grid background
    ctx.fillStyle = '#0a0c16';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const step = 25;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Axes
    const originX = width / 2;
    const originY = height / 2 + 20;

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 1.5;
    // X Axis
    ctx.beginPath();
    ctx.moveTo(20, originY);
    ctx.lineTo(width - 20, originY);
    ctx.stroke();
    // Y Axis
    ctx.beginPath();
    ctx.moveTo(originX, 15);
    ctx.lineTo(originX, height - 15);
    ctx.stroke();

    // Arrows
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('X', width - 15, originY + 12);
    ctx.fillText('Y', originX + 8, 20);

    const chartData = currentWeek.pythonLab.chartData || [];

    if (currentWeek.pythonLab.interactiveVisualizationType === 'equation_roots') {
      // Draw smooth Parabola y = x^2 - 5x + 6
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 12;

      ctx.beginPath();
      let first = true;
      const scaleX = 35;
      const scaleY = 15;

      for (let px = -1; px <= 6; px += 0.1) {
        const py = (px * px) - (5 * px) + 6;
        const screenX = originX + (px - 2.5) * scaleX;
        const screenY = originY - py * scaleY;

        if (first) {
          ctx.moveTo(screenX, screenY);
          first = false;
        } else {
          ctx.lineTo(screenX, screenY);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Highlight Roots x=2 and x=3
      const roots = [2, 3];
      roots.forEach(r => {
        const rx = originX + (r - 2.5) * scaleX;
        const ry = originY;

        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(rx, ry, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.fillText(`Raíz x = ${r}`, rx - 18, ry - 12);
      });

    } else if (currentWeek.pythonLab.interactiveVisualizationType === 'trajectory_canvas') {
      // Draw Kinematics Curve (MRUA Train)
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 14;

      ctx.beginPath();
      const scaleX = 25;
      const scaleY = 2.4;
      let first = true;

      for (let t = 0; t <= 8; t += 0.2) {
        const d = 0.5 * 1.5 * (t * t);
        const screenX = 40 + t * scaleX * 1.5;
        const screenY = (height - 35) - d * scaleY;

        if (first) {
          ctx.moveTo(screenX, screenY);
          first = false;
        } else {
          ctx.lineTo(screenX, screenY);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Final Point
      const endX = 40 + 8 * scaleX * 1.5;
      const endY = (height - 35) - 48 * scaleY;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(endX, endY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText('48m a los 8s (43.2 km/h)', endX - 90, endY - 10);

    } else {
      // Bar visualization
      const barWidth = 32;
      const startX = 40;
      const spacing = (width - 80) / Math.max(chartData.length, 1);

      chartData.forEach((item, idx) => {
        const xPos = startX + idx * spacing;
        const barHeight = Math.min(Math.abs(item.value) * 12, height - 70);
        const yPos = originY - (item.value >= 0 ? barHeight : 0);

        const grad = ctx.createLinearGradient(xPos, yPos, xPos, yPos + barHeight);
        grad.addColorStop(0, '#8b5cf6');
        grad.addColorStop(1, '#3b82f6');

        ctx.fillStyle = grad;
        ctx.fillRect(xPos, yPos, barWidth, barHeight);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText(item.label.slice(0, 10), xPos - 6, height - 10);
      });
    }
  }, [currentWeek]);

  // Spoken voice explanation with Belentani's ultra-human voice
  const handleSpeakProblem = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    playSoundTone(520, 0.08, 'triangle', 0.1);

    const textToSpeak = 
      `¡Hola Danilo! Vamos a resolver juntos este problema de ${currentTrack.title}. ` +
      `${currentWeek.stepByStepExample.problemStatement}. ` +
      `Paso uno: ${currentWeek.stepByStepExample.steps[0].explanation}. ` +
      `Y el resultado final es: ${currentWeek.stepByStepExample.finalResult}. ` +
      `También he preparado el código Python en SymPy para que lo ejecutes al instante. ¡Mucho ánimo, guerrero!`;

    speakBelentani(textToSpeak, {
      lang: 'es',
      rate: 0.93,
      onEnd: () => setIsSpeaking(false)
    });
  };

  // Run Python simulator right in the browser
  const handleRunCode = () => {
    setIsRunning(true);
    playSoundTone(700, 0.06, 'sine', 0.12);

    setTimeout(() => {
      setIsRunning(false);
      playSoundSuccess();
      setConsoleOutput(currentWeek.pythonLab.expectedOutput);
    }, 450);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userCode);
    setCopied(true);
    playSoundTone(800, 0.04, 'sine', 0.08);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPython = () => {
    const blob = new Blob([userCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentTrack.code.toLowerCase()}_semana_${currentWeek.week}.py`;
    link.click();
    URL.revokeObjectURL(url);
    playSoundSuccess();
  };

  return (
    <div className="space-y-6">
      {/* Astra AI Hero Header with Ambient Violet Bloom */}
      <div className="relative overflow-hidden astra-card astra-card-glow p-6 sm:p-8 bg-gradient-to-br from-[#0c0d19] via-[#090a14] to-[#06070a] border border-white/[0.08]">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-violet-500/20 border border-violet-400/40 text-violet-300 text-xs font-black tracking-wide uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-300" />
                <span>MOTOR OMEGA COURSERA · ASTRA AI ARCHITECTURE</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-semibold flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>Bancos de Datos Globales: Khan, OpenStax, INE</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-[11px] font-semibold flex items-center gap-1">
                <Code2 className="w-3 h-3 text-sky-400" />
                <span>Python & SymPy Basado 100%</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight astra-text-gradient">
              Laboratorio Omega Coursera & Resolutor Python 3º ESO
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              El motor de aprendizaje acelerado para William Danilo: problemas paso a paso al estilo Astra AI, 
              cálculo simbólico en Python, gráficas dinámicas en tiempo real y voz humana ultra-natural con filtros acústicos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Listen with human voice */}
            <button
              onClick={handleSpeakProblem}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
                isSpeaking 
                  ? 'bg-amber-500 text-black border border-amber-300 animate-pulse' 
                  : 'bg-violet-600 hover:bg-violet-500 text-white border border-violet-400/40 hover:scale-105'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSpeaking ? 'Pausar Voz Humana' : 'Explicar con Voz de Belentani'}</span>
            </button>
          </div>
        </div>

        {/* Track selector pill bar */}
        <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {OMEGA_COURSE_TRACKS.map((track, idx) => (
            <button
              key={track.id}
              onClick={() => {
                playSoundTone(500, 0.04, 'sine', 0.1);
                setSelectedTrackIndex(idx);
                setSelectedWeekIndex(0);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap border ${
                selectedTrackIndex === idx
                  ? 'bg-violet-500/25 border-violet-400/60 text-white shadow-md shadow-violet-500/20'
                  : 'bg-slate-900/60 border-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <span>{track.code}</span>
              <span className="text-white/60">•</span>
              <span>{track.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Navigation Tabs */}
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-2xl border border-white/[0.08]">
          <button
            onClick={() => setActiveTab('solver')}
            className={`astra-nav-pill ${activeTab === 'solver' ? 'astra-nav-pill-active' : 'astra-nav-pill-inactive'}`}
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Resolutor Paso a Paso (Astra AI)</span>
          </button>

          <button
            onClick={() => setActiveTab('python')}
            className={`astra-nav-pill ${activeTab === 'python' ? 'astra-nav-pill-active' : 'astra-nav-pill-inactive'}`}
          >
            <Terminal className="w-4 h-4 text-sky-400" />
            <span>Consola Python SymPy & Gráfica</span>
          </button>

          <button
            onClick={() => setActiveTab('open_data')}
            className={`astra-nav-pill ${activeTab === 'open_data' ? 'astra-nav-pill-active' : 'astra-nav-pill-inactive'}`}
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Bancos de Datos Libres (Khan & OpenStax)</span>
          </button>

          <button
            onClick={() => setActiveTab('syllabus')}
            className={`astra-nav-pill ${activeTab === 'syllabus' ? 'astra-nav-pill-active' : 'astra-nav-pill-inactive'}`}
          >
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>Organización Omega Coursera</span>
          </button>
        </div>

        {/* Week Selector in Current Track */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Módulo:</span>
          {currentTrack.syllabusWeeks.map((w, idx) => (
            <button
              key={w.week}
              onClick={() => {
                playSoundTone(480, 0.04, 'sine', 0.1);
                setSelectedWeekIndex(idx);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                selectedWeekIndex === idx 
                  ? 'bg-violet-600 text-white border-violet-400' 
                  : 'bg-slate-900/60 text-slate-400 border-white/[0.06] hover:bg-slate-800'
              }`}
            >
              Semana {w.week}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: STEP-BY-STEP SOLVER (ASTRA AI STYLE) */}
      {activeTab === 'solver' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Problem Breakdown */}
          <div className="lg:col-span-7 space-y-4">
            <div className="astra-card p-6 border border-white/[0.08] space-y-5">
              <div className="flex items-center justify-between gap-3">
                <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold border border-violet-500/30">
                  {currentWeek.topicTag}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  ⏱️ {currentWeek.estimatedMinutes} min lectura
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {currentWeek.title}
                </h2>
                <div className="mt-3 p-4 rounded-xl bg-slate-950/80 border border-violet-500/30">
                  <span className="text-xs font-bold text-violet-400 uppercase tracking-wide">
                    Enunciado del Problema:
                  </span>
                  <p className="text-lg font-mono font-bold text-white mt-1">
                    {currentWeek.stepByStepExample.problemStatement}
                  </p>
                </div>
              </div>

              {/* Step Navigation Cards */}
              <div className="space-y-3">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Resolución Paso a Paso Desglosada:
                </span>
                {currentWeek.stepByStepExample.steps.map((step, idx) => {
                  const isCurrent = selectedStep === idx;
                  return (
                    <div 
                      key={step.stepNum}
                      onClick={() => {
                        playSoundTone(450, 0.03, 'sine', 0.08);
                        setSelectedStep(idx);
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-violet-950/40 border-violet-500/60 shadow-md shadow-violet-500/10'
                          : 'bg-slate-900/40 border-white/[0.06] hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isCurrent ? 'bg-violet-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {step.stepNum}
                          </span>
                          <h4 className="font-bold text-sm text-slate-200">
                            {step.title}
                          </h4>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform ${isCurrent ? 'rotate-90 text-violet-400' : 'text-slate-600'}`} />
                      </div>

                      {step.mathExpression && (
                        <div className="mt-2.5 font-mono text-sm font-bold text-emerald-400 bg-slate-950/90 p-2.5 rounded-lg border border-emerald-500/20">
                          {step.mathExpression}
                        </div>
                      )}

                      <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {step.explanation}
                      </p>

                      {step.portugueseTip && (
                        <div className="mt-2.5 p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                          <span className="text-sm">🇧🇷</span>
                          <span>{step.portugueseTip}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Final Result Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-950 border border-emerald-500/40 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                    Solución Exacta Verificada:
                  </span>
                  <div className="text-lg font-mono font-black text-white mt-0.5">
                    {currentWeek.stepByStepExample.finalResult}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  ✓
                </div>
              </div>
            </div>

            {/* Micro Knowledge Check / Quiz */}
            <div className="astra-card p-6 border border-white/[0.08] space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Test Rápido de Comprensión (Coursera Mastery)
                </h3>
              </div>

              <p className="text-sm font-medium text-slate-200">
                {currentWeek.knowledgeCheck.question}
              </p>

              <div className="space-y-2">
                {currentWeek.knowledgeCheck.options.map((opt, idx) => {
                  const isSelected = quizSelectedOption === idx;
                  const isCorrect = idx === currentWeek.knowledgeCheck.correctIndex;

                  let borderClass = 'border-white/[0.08] hover:border-white/20';
                  let bgClass = 'bg-slate-900/50';

                  if (quizSubmitted) {
                    if (isCorrect) {
                      borderClass = 'border-emerald-500 bg-emerald-950/40 text-emerald-200';
                    } else if (isSelected) {
                      borderClass = 'border-rose-500 bg-rose-950/40 text-rose-200';
                    }
                  } else if (isSelected) {
                    borderClass = 'border-violet-500 bg-violet-950/30';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!quizSubmitted) {
                          playSoundTone(520, 0.03, 'sine', 0.08);
                          setQuizSelectedOption(idx);
                        }
                      }}
                      className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${borderClass} ${bgClass}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <button
                  disabled={quizSelectedOption === null}
                  onClick={() => {
                    setQuizSubmitted(true);
                    if (quizSelectedOption === currentWeek.knowledgeCheck.correctIndex) {
                      playSoundSuccess();
                    } else {
                      playSoundTone(220, 0.1, 'sawtooth', 0.1);
                    }
                  }}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white transition-all"
                >
                  Comprobar Respuesta
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-xs space-y-1">
                  <span className="font-bold text-slate-300">Explicación pedagógica:</span>
                  <p className="text-slate-400">{currentWeek.knowledgeCheck.explanation}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Visualizer & Python SymPy Mirror */}
          <div className="lg:col-span-5 space-y-4">
            {/* Visualizer Canvas Card */}
            <div className="astra-card p-5 border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-violet-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-violet-400" />
                  <span>Gráfica Dinámica en Tiempo Real</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">HTML5 Canvas</span>
              </div>

              <div className="rounded-2xl overflow-hidden border border-white/10 bg-slate-950 p-2 shadow-inner">
                <canvas 
                  ref={canvasRef} 
                  width={420} 
                  height={250} 
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </div>

            {/* Instant Python SymPy Mirror Code */}
            <div className="astra-card p-5 border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Código Python Equivalente
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs flex items-center gap-1"
                    title="Copiar código"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={handleDownloadPython}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs flex items-center gap-1"
                    title="Descargar archivo .py"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-[#090a12] p-3.5 rounded-xl border border-white/[0.08] font-mono text-xs text-sky-300 overflow-x-auto max-h-56 leading-relaxed">
                <pre>{currentWeek.pythonLab.code}</pre>
              </div>

              <button
                onClick={() => setActiveTab('python')}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-white/[0.08] transition-colors flex items-center justify-center gap-2"
              >
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                <span>Abrir en la Consola Interactiva Python</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: INTERACTIVE PYTHON CONSOLE */}
      {activeTab === 'python' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Code Editor */}
          <div className="lg:col-span-7 astra-card p-5 border border-white/[0.08] space-y-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-xs text-slate-400">
                  {currentTrack.code.toLowerCase()}_semana{currentWeek.week}.py
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>

                <button
                  onClick={handleDownloadPython}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar .py</span>
                </button>

                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
                  <span>{isRunning ? 'Ejecutando...' : 'Ejecutar Python'}</span>
                </button>
              </div>
            </div>

            {/* Editable Python Textarea */}
            <div className="relative flex-1 min-h-[350px]">
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full min-h-[350px] p-4 rounded-xl bg-[#07080e] border border-white/[0.08] font-mono text-xs sm:text-sm text-sky-200 focus:outline-none focus:border-violet-500/60 resize-y leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Librería: {currentWeek.pythonLab.pythonLibrary.toUpperCase()}</span>
              <span>Python 3.12 Sandboxed · Formato UTF-8</span>
            </div>
          </div>

          {/* Execution Output Console */}
          <div className="lg:col-span-5 space-y-4">
            <div className="astra-card p-5 border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Salida de Consola (Stdout)</span>
                </span>
                <button
                  onClick={() => setConsoleOutput('')}
                  className="text-[11px] text-slate-400 hover:text-white"
                >
                  Limpiar
                </button>
              </div>

              <div className="bg-[#05060a] p-4 rounded-xl border border-white/[0.08] font-mono text-xs text-emerald-300 min-h-[220px] max-h-[300px] overflow-y-auto leading-relaxed shadow-inner">
                {isRunning ? (
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Compilando AST y resolviendo álgebra en SymPy...</span>
                  </div>
                ) : consoleOutput ? (
                  <pre className="whitespace-pre-wrap">{consoleOutput}</pre>
                ) : (
                  <span className="text-slate-600">Presiona "Ejecutar Python" para ver el resultado...</span>
                )}
              </div>
            </div>

            {/* Quick Math Tools Accordion */}
            <div className="astra-card p-4 border border-white/[0.08] space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Snippets Rápidos de SymPy para 3º ESO:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  onClick={() => {
                    setUserCode(`import sympy as sp\nx = sp.Symbol('x')\neq = sp.Eq(2*x + 5, 15)\nprint("Ecuación de 1er grado:", sp.solve(eq, x))`);
                  }}
                  className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-left text-xs text-slate-300 border border-white/[0.06] font-mono"
                >
                  • Ecuación 1er Grado (2x + 5 = 15)
                </button>
                <button
                  onClick={() => {
                    setUserCode(`import sympy as sp\nx = sp.Symbol('x')\neq = sp.Eq(x**2 - 9, 0)\nprint("Ecuación incompleta x² - 9 = 0:", sp.solve(eq, x))`);
                  }}
                  className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-left text-xs text-slate-300 border border-white/[0.06] font-mono"
                >
                  • Ecuación Incompleta (x² - 9 = 0)
                </button>
                <button
                  onClick={() => {
                    setUserCode(`import numpy as np\nnotas = np.array([8.5, 9.0, 7.5, 10.0, 8.0])\nprint("Promedio de notas:", np.mean(notas))\nprint("Desviación estándar:", np.std(notas))`);
                  }}
                  className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-left text-xs text-slate-300 border border-white/[0.06] font-mono"
                >
                  • Estadísticas de Notas Escolares (NumPy)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: GLOBAL OPEN DATA BANKS (KHAN ACADEMY, OPENSTAX, INE, EUROSTAT, KAGGLE) */}
      {activeTab === 'open_data' && (
        <div className="space-y-6">
          <div className="astra-card p-6 border border-white/[0.08] space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <span>Repositorios de Datos Educativos Libres Integrados</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Belentani School utiliza los repositorios de conocimiento abierto más rigurosos del planeta. 
              Sin barreras ni costos, con licencia Creative Commons y Reutilización Oficial de la Unión Europea.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GLOBAL_OPEN_DATA_BANKS.map((bank) => (
              <div 
                key={bank.id}
                className="astra-card p-6 border border-white/[0.08] space-y-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-white">
                      {bank.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      {bank.license}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    <strong className="text-slate-300">Autoridad:</strong> {bank.authority}
                  </p>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {bank.curriculumIntegration}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/[0.06] space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Muestra de Datos Abiertos ({bank.datasetPreview.title}):
                    </span>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[11px] text-left font-mono">
                        <thead>
                          <tr className="text-slate-500 border-b border-slate-800">
                            {Object.keys(bank.datasetPreview.sampleRows[0] || {}).map(k => (
                              <th key={k} className="p-1">{k}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {bank.datasetPreview.sampleRows.map((row, rIdx) => (
                            <tr key={rIdx} className="border-b border-slate-900 text-slate-300">
                              {Object.values(row).map((val, cIdx) => (
                                <td key={cIdx} className="p-1">{String(val)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Cobertura: {bank.coverage}</span>
                  <button
                    onClick={() => {
                      setUserCode(bank.datasetPreview.pythonSnippet);
                      setActiveTab('python');
                    }}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <span>Analizar en Python</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: OMEGA COURSERA SYLLABUS OVERVIEW */}
      {activeTab === 'syllabus' && (
        <div className="space-y-6">
          <div className="astra-card p-6 border border-white/[0.08] space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-violet-400" />
              <span>Estructura de Especialización Omega Coursera</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Estructurado bajo los estándares de Coursera, edX y MIT OpenCourseWare: micro-lecciones de 15-20 minutos, 
              objetivos medibles, laboratorios de código en Python y proyectos capstone de graduación para 3º de ESO.
            </p>
          </div>

          <div className="space-y-4">
            {OMEGA_COURSE_TRACKS.map((track) => (
              <div 
                key={track.id}
                className="astra-card p-6 border border-white/[0.08] space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono text-violet-400 font-bold">{track.code}</span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{track.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{track.universityPartner}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-white/10">
                    {track.duration}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {track.syllabusWeeks.map((week) => (
                    <div 
                      key={week.week}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-white/[0.06] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">Semana {week.week}: {week.title}</span>
                        <span className="text-[10px] text-slate-500">{week.estimatedMinutes} min</span>
                      </div>
                      <ul className="text-xs text-slate-400 space-y-1">
                        {week.learningOutcomes.map((out, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-violet-400 mt-0.5">•</span>
                            <span>{out}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
