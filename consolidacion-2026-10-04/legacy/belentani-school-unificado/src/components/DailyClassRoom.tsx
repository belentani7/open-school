import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Sparkles, 
  BookOpen, 
  Calculator, 
  Languages, 
  Atom, 
  Terminal, 
  Coffee, 
  ArrowRight, 
  ArrowLeft, 
  Award, 
  Search, 
  Check, 
  ChevronRight, 
  ExternalLink,
  Flame,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALL_365_CLASSES, DayClass365, DailyHourBlock } from '../data/classes365Days';
import { speakBelentani, stopSpeaking, playSoundSuccess, playSoundTone, playSoundError } from '../utils/speech';
import { NavigationTab } from '../types';
import { auth, saveClassProgressToFirestore, fetchClassProgressFromFirestore } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface DailyClassRoomProps {
  onUnlockToolsAndNavigate: (targetTab: NavigationTab) => void;
  isUnlockedGlobally: boolean;
  onSetGlobalUnlock: (unlocked: boolean) => void;
}

export const DailyClassRoom: React.FC<DailyClassRoomProps> = ({
  onUnlockToolsAndNavigate,
  isUnlockedGlobally,
  onSetGlobalUnlock
}) => {
  // Current active day (defaults to 1 or saved in localStorage)
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('belentani_active_day');
      return saved ? Math.min(Math.max(parseInt(saved, 10), 1), 365) : 1;
    } catch {
      return 1;
    }
  });

  // Track completed days in an array stored in localStorage
  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('belentani_completed_days');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Selected hour within the day (1, 2, 'break', 3, 4)
  const [activeHourTab, setActiveHourTab] = useState<1 | 2 | 'break' | 3 | 4>(1);

  // Voice dictation state
  const [isDictating, setIsDictating] = useState<boolean>(false);

  // Interactive task answers for current hour: record of [hour]: selectedOptionIndex
  const [taskAnswers, setTaskAnswers] = useState<Record<number, number>>({});
  const [taskFeedback, setTaskFeedback] = useState<Record<number, boolean>>({});

  // Daily Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Modal for browsing all 365 days
  const [showCalendarModal, setShowCalendarModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [trimesterFilter, setTrimesterFilter] = useState<number | 'all'>('all');

  const currentClass: DayClass365 = ALL_365_CLASSES[selectedDayNumber - 1] || ALL_365_CLASSES[0];
  const isCurrentDayCompleted = completedDays.includes(selectedDayNumber);

  // Save selected day in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('belentani_active_day', selectedDayNumber.toString());
    } catch {
      // Storage unavailable
    }
    // Stop speaking when switching days
    stopSpeaking();
    setIsDictating(false);
    setTaskAnswers({});
    setTaskFeedback({});
    setQuizAnswers({});
    setQuizSubmitted(false);
    setActiveHourTab(1);
  }, [selectedDayNumber]);

  // Synchronize completed days with Firebase Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const cloudProgress = await fetchClassProgressFromFirestore(user.uid);
          if (cloudProgress.completedDays.length > 0) {
            setCompletedDays(prev => {
              const merged = Array.from(new Set([...prev, ...cloudProgress.completedDays]));
              try {
                localStorage.setItem('belentani_completed_days', JSON.stringify(merged));
              } catch {}
              return merged;
            });
            onSetGlobalUnlock(true);
          }
        } catch (err) {
          console.warn("Firestore progress sync offline:", err);
        }
      }
    });
    return () => unsubscribe();
  }, [onSetGlobalUnlock]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  // Voice dictation of current hour
  const handleToggleDictation = () => {
    if (isDictating) {
      stopSpeaking();
      setIsDictating(false);
      return;
    }

    let textToSpeak = '';
    if (activeHourTab === 'break') {
      textToSpeak = `Momento de descanso y recreo escolar. ${currentClass.breakGuideline.rule202020} ${currentClass.breakGuideline.socialTip}`;
    } else {
      const hourBlock = currentClass.hours[activeHourTab - 1];
      textToSpeak = `Clase dictada de la Hora ${hourBlock.hourNumber}: ${hourBlock.subject}, ${hourBlock.title}. ${hourBlock.teacherScript}`;
    }

    playSoundTone(520, 0.05, 'sine', 0.1);
    setIsDictating(true);
    speakBelentani(textToSpeak, {
      lang: 'es',
      rate: 0.94,
      onEnd: () => setIsDictating(false)
    });
  };

  // Submit single hour task
  const handleSelectTaskOption = (hourIndex: number, optionIndex: number, correctIndex: number) => {
    setTaskAnswers(prev => ({ ...prev, [hourIndex]: optionIndex }));
    const isCorrect = optionIndex === correctIndex;
    setTaskFeedback(prev => ({ ...prev, [hourIndex]: isCorrect }));

    if (isCorrect) {
      playSoundSuccess();
    } else {
      playSoundError();
    }
  };

  // Submit daily 3-question quiz
  const handleAnswerQuizQuestion = (qIndex: number, optIndex: number) => {
    setQuizAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleEvaluateQuiz = () => {
    let score = 0;
    currentClass.dailyValidationQuiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        score++;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);

    if (score >= 2) {
      // Mark day as completed and unlock
      playSoundSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }

      if (!completedDays.includes(selectedDayNumber)) {
        const updated = [...completedDays, selectedDayNumber];
        setCompletedDays(updated);
        try {
          localStorage.setItem('belentani_completed_days', JSON.stringify(updated));
        } catch {
          // Storage unavailable
        }
      }

      // Persist to Firebase Firestore if authenticated
      const user = auth.currentUser;
      if (user) {
        saveClassProgressToFirestore(
          user.uid,
          selectedDayNumber,
          Math.round((score / 3) * 100),
          `Completado con éxito: ${currentClass.title}`
        ).catch(err => console.warn("Error guardando progreso en Firestore:", err));
      }

      onSetGlobalUnlock(true);
    } else {
      playSoundError();
    }
  };

  // Switch to next or previous day
  const handleNextDay = () => {
    if (selectedDayNumber < 365) {
      setSelectedDayNumber(selectedDayNumber + 1);
    }
  };

  const handlePrevDay = () => {
    if (selectedDayNumber > 1) {
      setSelectedDayNumber(selectedDayNumber - 1);
    }
  };

  // Filtered 365 days list for the modal
  const filteredDays = ALL_365_CLASSES.filter(d => {
    const matchesTrim = trimesterFilter === 'all' || d.trimester === trimesterFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || 
      d.title.toLowerCase().includes(query) ||
      d.dayNumber.toString().includes(query) ||
      d.hours.some(h => h.subject.toLowerCase().includes(query) || h.title.toLowerCase().includes(query));
    return matchesTrim && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in text-slate-100">
      {/* Top Banner: Central Daily School Notice */}
      <div className="astra-card astra-card-glow p-6 sm:p-7 border border-white/[0.08] relative overflow-hidden bg-gradient-to-br from-[#0c0d1b] via-[#090a16] to-[#05060b]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-black tracking-wide uppercase">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>365 DÍAS DE CLASE · 4 HORAS DIARIAS LECTIVAS</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-bold font-mono">
                {currentClass.trimesterLabel.split('·')[0]}
              </span>
              {isCurrentDayCompleted ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Día Aprobado (4h Acreditadas)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Clase de Hoy en Curso</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {currentClass.title}
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {currentClass.motto} Cada jornada escolar se imparte en 4 horas estructuradas: Matemáticas, Lenguas (Catalán/Castellano), Recreo de integración, Ciencias y Laboratorio Computacional.
            </p>
          </div>

          {/* Quick Day Switcher & Unlock status */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-3 shrink-0 w-full lg:w-auto">
            <div className="flex items-center gap-2 bg-[#080912] p-1.5 rounded-2xl border border-white/[0.08] w-full sm:w-auto justify-between">
              <button
                onClick={handlePrevDay}
                disabled={selectedDayNumber <= 1}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
                title="Día anterior"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowCalendarModal(true)}
                className="px-4 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-xs font-bold text-indigo-200 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Día {selectedDayNumber} de 365</span>
              </button>

              <button
                onClick={handleNextDay}
                disabled={selectedDayNumber >= 365}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
                title="Día siguiente"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setShowCalendarModal(true)}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
            >
              <span>Ver calendario escolar anual (365 clases)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Global Access Status Bar */}
        <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            {isUnlockedGlobally || isCurrentDayCompleted ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Unlock className="w-4 h-4 text-emerald-400" />
                <span>Acceso Abierto a Material Didáctico y Herramientas (Google Sheets, Python, EduOffice, EduTube)</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Primero realiza tu clase de 4 horas de hoy. Al validarla se abre el acceso total a las herramientas.</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isUnlockedGlobally && !isCurrentDayCompleted && (
              <button
                onClick={() => onSetGlobalUnlock(true)}
                className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                title="Modo consulta libre"
              >
                Consultar herramientas de apoyo sin esperar
              </button>
            )}
            <span className="text-slate-400">Progreso Anual: <strong className="text-white">{completedDays.length} / 365</strong> días</span>
          </div>
        </div>
      </div>

      {/* Main Classroom Layout: Left Schedule & Voice Dictation, Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 4 Hours Schedule Tabs + Dictation Controller */}
        <div className="lg:col-span-4 space-y-4">
          <div className="astra-card p-5 border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wide">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Horario Lectivo de Hoy (4h)</span>
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">08:30 - 12:20</span>
            </div>

            {/* Voice Dictation Main Button */}
            <button
              onClick={handleToggleDictation}
              className={`w-full py-3 px-4 rounded-2xl flex items-center justify-center gap-2.5 font-bold text-xs shadow-lg transition-all cursor-pointer ${
                isDictating 
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse' 
                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isDictating ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pausar Dictado de Belentani</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>▶ Dictar Hora {activeHourTab === 'break' ? 'de Recreo' : activeHourTab} por Voz</span>
                </>
              )}
            </button>

            {/* 4-Hours Blocks List */}
            <div className="space-y-2 pt-2">
              {currentClass.hours.map((h) => {
                const isActive = activeHourTab === h.hourNumber;
                const isAnswered = taskAnswers[h.hourNumber] !== undefined;

                return (
                  <button
                    key={h.hourNumber}
                    onClick={() => {
                      setActiveHourTab(h.hourNumber);
                      stopSpeaking();
                      setIsDictating(false);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive 
                        ? 'bg-indigo-600/20 border-indigo-500/50 shadow-md ring-1 ring-indigo-500/30' 
                        : 'bg-slate-900/50 hover:bg-slate-900 border-white/[0.06] text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isActive ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        H{h.hourNumber}
                      </div>
                      <div className="truncate">
                        <div className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                          {h.subject}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {h.timeRange.split('(')[0]} · {h.title}
                        </div>
                      </div>
                    </div>

                    {isAnswered && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}

              {/* Break block */}
              <button
                onClick={() => {
                  setActiveHourTab('break');
                  stopSpeaking();
                  setIsDictating(false);
                }}
                className={`w-full p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  activeHourTab === 'break'
                    ? 'bg-amber-600/20 border-amber-500/50 text-white'
                    : 'bg-slate-900/40 hover:bg-slate-900 border-white/[0.04] text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Coffee className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs font-semibold">10:15 - 10:35 · Recreo & Descanso 20-20-20</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">20 min</span>
              </button>
            </div>
          </div>

          {/* Quick Link to Support Tools once unlocked */}
          {(isUnlockedGlobally || isCurrentDayCompleted) && (
            <div className="astra-card p-5 border border-emerald-500/30 bg-emerald-950/20 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wide">
                <Unlock className="w-4 h-4" />
                <span>Materiales Desbloqueados</span>
              </div>
              <p className="text-xs text-slate-300">
                Puedes acceder al conjunto de herramientas didácticas de apoyo para ampliar o practicar:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onUnlockToolsAndNavigate('herramientas')}
                  className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Google Sheets</span>
                </button>
                <button
                  onClick={() => onUnlockToolsAndNavigate('curso')}
                  className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span>Módulos 8 Pasos</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Active Hour Lesson Content & Interactive Task */}
        <div className="lg:col-span-8 space-y-6">
          {activeHourTab === 'break' ? (
            /* Break View */
            <div className="astra-card p-6 sm:p-8 border border-amber-500/30 bg-[#0c0e18] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Coffee className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Recreo Escolar & Salud Ocular (20-20-20)</h3>
                  <p className="text-xs text-slate-400">10:15 - 10:35 · 20 minutos de pausa pedagógica</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/[0.08] space-y-3">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Regla 20-20-20 para William Danilo</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {currentClass.breakGuideline.rule202020}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wide flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Consejo para el Patio del Instituto en España</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {currentClass.breakGuideline.socialTip}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setActiveHourTab(3)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Continuar a la Hora 3 (Ciencias)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Active Hour Lesson View */
            (() => {
              const hourIndex = activeHourTab - 1;
              const h = currentClass.hours[hourIndex];
              const isTaskAnswered = taskAnswers[h.hourNumber] !== undefined;
              const isTaskCorrect = taskFeedback[h.hourNumber] === true;

              return (
                <div className="space-y-6">
                  {/* Lesson Script Card */}
                  <div className="astra-card p-6 sm:p-7 border border-white/[0.08] space-y-5 bg-[#090a16]">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded-lg border border-indigo-500/30">
                            Hora {h.hourNumber} · {h.timeRange}
                          </span>
                          <span className="text-xs font-bold text-slate-300">
                            {h.subject}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-white mt-1">
                          {h.title}
                        </h3>
                      </div>

                      <button
                        onClick={handleToggleDictation}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/[0.08] text-xs font-bold text-indigo-300 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{isDictating ? 'Silenciar' : 'Escuchar Dictado'}</span>
                      </button>
                    </div>

                    {/* Teacher Dictated Speech Box */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#06070c] border border-white/[0.06] space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wide">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Explicación del Profesor (Dictado LOMLOE)</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                        {h.teacherScript}
                      </p>
                    </div>

                    {/* Bridge or Formula Resource */}
                    {h.bridgePtEsCa && (
                      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-3">
                        <div className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-2">
                          <Languages className="w-4 h-4" />
                          <span>Puente Lingüístico Romance: Português ➔ Castellano ➔ Català</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/[0.06]">
                            <span className="text-[10px] text-slate-500 block uppercase font-mono">🇧🇷 Português</span>
                            <strong className="text-white text-xs">{h.bridgePtEsCa.pt}</strong>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/[0.06]">
                            <span className="text-[10px] text-slate-500 block uppercase font-mono">🇪🇸 Castellano</span>
                            <strong className="text-indigo-300 text-xs">{h.bridgePtEsCa.es}</strong>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/[0.06]">
                            <span className="text-[10px] text-slate-500 block uppercase font-mono">🎗️ Català</span>
                            <strong className="text-amber-300 text-xs">{h.bridgePtEsCa.ca}</strong>
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 italic">
                          💡 {h.bridgePtEsCa.tip}
                        </p>
                      </div>
                    )}

                    {h.resourceCodeOrFormula && !h.bridgePtEsCa && (
                      <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/[0.08] space-y-2 font-mono text-xs">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Fórmula / Código de Verificación en Clase:
                        </span>
                        <div className="p-3 rounded-xl bg-[#05060a] text-emerald-300 border border-white/[0.06] overflow-x-auto whitespace-pre">
                          {h.resourceCodeOrFormula}
                        </div>
                      </div>
                    )}

                    {/* Interactive Task for the Hour */}
                    <div className="pt-3 border-t border-white/[0.06] space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                          <span>Ejercicio Práctico de la Hora {h.hourNumber}</span>
                        </h4>
                        {isTaskAnswered && (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                            isTaskCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                          }`}>
                            {isTaskCorrect ? '¡Correcto!' : 'Revisa la explicación'}
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-200 font-medium">
                        {h.interactiveTask.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {h.interactiveTask.options.map((opt, optIdx) => {
                          const isSelected = taskAnswers[h.hourNumber] === optIdx;
                          const isOptionCorrect = optIdx === h.interactiveTask.correctIndex;

                          let btnClasses = "p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ";
                          if (!isTaskAnswered) {
                            btnClasses += "bg-slate-900/60 hover:bg-slate-800/80 border-white/[0.08] text-slate-300";
                          } else if (isOptionCorrect) {
                            btnClasses += "bg-emerald-950/60 border-emerald-500/50 text-emerald-200 font-bold";
                          } else if (isSelected && !isOptionCorrect) {
                            btnClasses += "bg-rose-950/60 border-rose-500/50 text-rose-300";
                          } else {
                            btnClasses += "bg-slate-900/30 border-white/[0.04] text-slate-500 opacity-60";
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={isTaskAnswered}
                              onClick={() => handleSelectTaskOption(h.hourNumber, optIdx, h.interactiveTask.correctIndex)}
                              className={btnClasses}
                            >
                              <div className="flex items-start gap-2">
                                <span className="font-mono text-[10px] text-slate-500 mt-0.5">
                                  {String.fromCharCode(65 + optIdx)})
                                </span>
                                <span>{opt}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {isTaskAnswered && (
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/[0.06] text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-indigo-400 font-bold">Explicación:</span>
                          <span>{h.interactiveTask.explanation}</span>
                        </div>
                      )}
                    </div>

                    {/* Step to Next Hour */}
                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        Paso {h.hourNumber} de 4 horas lectivas
                      </span>

                      {h.hourNumber < 4 ? (
                        <button
                          onClick={() => {
                            if (h.hourNumber === 2) {
                              setActiveHourTab('break');
                            } else {
                              setActiveHourTab((h.hourNumber + 1) as 1 | 2 | 3 | 4);
                            }
                            stopSpeaking();
                            setIsDictating(false);
                          }}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <span>{h.hourNumber === 2 ? 'Ir al Recreo' : `Avanzar a Hora ${h.hourNumber + 1}`}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const quizEl = document.getElementById('daily-quiz-section');
                            if (quizEl) quizEl.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <span>Validar Clase Completa de Hoy</span>
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Daily Validation Quiz Section (The 3-Questions Assessment) */}
                  <div id="daily-quiz-section" className="astra-card p-6 sm:p-7 border border-indigo-500/30 bg-[#0a0c18] space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                      <div>
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-indigo-400" />
                          <span>Mini-Examen de Cierre: Día {currentClass.dayNumber}</span>
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-white mt-1">
                          Comprobación de Asistencia & Comprensión (4 Horas)
                        </h3>
                      </div>

                      {quizSubmitted && (
                        <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                          quizScore >= 2 
                            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
                            : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                        }`}>
                          <span>Nota del Día: {quizScore} / 3</span>
                          {quizScore >= 2 ? <span>(Apto · Horas Acreditadas)</span> : <span>(Reintenta)</span>}
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-300">
                      Responde a estas 3 preguntas sobre las materias cursadas hoy. Al acertar al menos 2, se valida el día completo y se desbloquea el acceso ilimitado a todo el material didáctico y herramientas.
                    </p>

                    <div className="space-y-4">
                      {currentClass.dailyValidationQuiz.map((q, qIdx) => {
                        const answeredOpt = quizAnswers[qIdx];
                        return (
                          <div key={qIdx} className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.06] space-y-3">
                            <div className="flex items-start gap-2">
                              <span className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {qIdx + 1}
                              </span>
                              <span className="text-xs sm:text-sm font-semibold text-white">
                                {q.question}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7">
                              {q.options.map((opt, optIdx) => {
                                const isSelected = answeredOpt === optIdx;
                                const isCorrect = optIdx === q.correctIndex;

                                let btnClass = "p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ";
                                if (!quizSubmitted) {
                                  btnClass += isSelected 
                                    ? "bg-indigo-600/30 border-indigo-400 text-white font-bold" 
                                    : "bg-slate-900/80 hover:bg-slate-800 border-white/[0.06] text-slate-300";
                                } else {
                                  if (isCorrect) {
                                    btnClass += "bg-emerald-950/60 border-emerald-500/50 text-emerald-200 font-bold";
                                  } else if (isSelected) {
                                    btnClass += "bg-rose-950/60 border-rose-500/50 text-rose-300";
                                  } else {
                                    btnClass += "bg-slate-900/30 border-white/[0.04] text-slate-500 opacity-60";
                                  }
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    disabled={quizSubmitted}
                                    onClick={() => handleAnswerQuizQuestion(qIdx, optIdx)}
                                    className={btnClass}
                                  >
                                    <span>{opt}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {quizSubmitted && (
                              <div className="pl-7 text-[11px] text-slate-400">
                                {q.explanation}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Quiz Action & Unlock Button */}
                    <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
                      {!quizSubmitted ? (
                        <button
                          onClick={handleEvaluateQuiz}
                          disabled={Object.keys(quizAnswers).length < 3}
                          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          <span>Entregar Comprobación y Validar 4 Horas</span>
                        </button>
                      ) : quizScore >= 2 ? (
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-between">
                          <div className="text-xs text-emerald-300 font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>¡Enhorabuena Danilo! Has acreditado la clase de hoy con éxito.</span>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => onUnlockToolsAndNavigate('herramientas')}
                              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
                            >
                              <Unlock className="w-4 h-4" />
                              <span>Acceder a Material Didáctico y Herramientas</span>
                            </button>
                            {selectedDayNumber < 365 && (
                              <button
                                onClick={handleNextDay}
                                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <span>Día Siguiente ({selectedDayNumber + 1})</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setQuizSubmitted(false);
                              setQuizAnswers({});
                            }}
                            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer"
                          >
                            Reintentar Examen
                          </button>
                          <span className="text-xs text-rose-300">Necesitas al menos 2 aciertos para validar el día.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      </div>

      {/* Modal: Full 365 Days Annual Calendar & Subject Explorer */}
      {showCalendarModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="astra-card w-full max-w-4xl max-h-[90vh] border border-white/[0.1] flex flex-col overflow-hidden shadow-2xl bg-[#080914]">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between gap-3 bg-[#0a0b18]">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  <span>Calendario Anual: 365 Clases de 4 Horas (3º ESO)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Plan curricular anual LOMLOE. Selecciona cualquier día para ver su temario, dictado y actividades.
                </p>
              </div>

              <button
                onClick={() => setShowCalendarModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Filter bar */}
            <div className="p-4 border-b border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-[#06070e]">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar tema, materia o día..."
                  className="w-full bg-[#0d0e1b] border border-white/[0.08] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                <button
                  onClick={() => setTrimesterFilter('all')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    trimesterFilter === 'all' 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  Todos (365)
                </button>
                <button
                  onClick={() => setTrimesterFilter(1)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    trimesterFilter === 1 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  1er Trimestre (1-90)
                </button>
                <button
                  onClick={() => setTrimesterFilter(2)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    trimesterFilter === 2 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  2º Trimestre (91-180)
                </button>
                <button
                  onClick={() => setTrimesterFilter(3)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    trimesterFilter === 3 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  3er Trimestre (181-270)
                </button>
                <button
                  onClick={() => setTrimesterFilter(4)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    trimesterFilter === 4 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  4º Refuerzo (271-365)
                </button>
              </div>
            </div>

            {/* Days Grid */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {filteredDays.map((d) => {
                  const isCurrent = d.dayNumber === selectedDayNumber;
                  const isCompleted = completedDays.includes(d.dayNumber);

                  return (
                    <button
                      key={d.dayNumber}
                      onClick={() => {
                        setSelectedDayNumber(d.dayNumber);
                        setShowCalendarModal(false);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isCurrent 
                          ? 'bg-indigo-600/30 border-indigo-400 ring-1 ring-indigo-400 text-white' 
                          : 'bg-[#0b0d1a] hover:bg-slate-900 border-white/[0.06] text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                          isCompleted 
                            ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300' 
                            : isCurrent
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {d.dayNumber}
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-white truncate">
                            {d.title}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {d.dateSimulation} · Sem. {d.week}
                          </div>
                        </div>
                      </div>

                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {filteredDays.length === 0 && (
                <div className="py-12 text-center text-xs text-slate-400">
                  No se encontraron días con ese criterio de búsqueda.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400 bg-[#0a0b18]">
              <span>Mostrando {filteredDays.length} de 365 días lectivos</span>
              <button
                onClick={() => setShowCalendarModal(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/[0.08] text-white font-semibold transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
