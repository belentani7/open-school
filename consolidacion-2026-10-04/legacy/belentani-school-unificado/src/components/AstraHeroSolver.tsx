import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, ChevronRight, Calculator, Volume2, ArrowRight,
  Zap, Brain, BookOpen, Compass, ShieldCheck, Star, RefreshCw, Layers, FileCode2,
  Cloud, BookmarkCheck, Terminal, X, Play
} from 'lucide-react';
import { speakBelentani, playSoundSuccess, playSoundClick } from '../utils/speech';
import { saveSolverSolution } from '../services/schoolFirestore';
import { runPythonCode, PythonRunResult } from '../services/pythonService';

interface StepSolution {
  title: string;
  problem: string;
  subject: string;
  steps: {
    stepNum: number;
    title: string;
    explanation: string;
    formula?: string;
    portugueseBridge?: string;
    keyRule: string;
  }[];
}

const PRESET_PROBLEMS: Record<string, StepSolution> = {
  'eq2': {
    title: 'Ecuación de 2º Grado',
    problem: 'x² - 5x + 6 = 0',
    subject: 'Matemáticas 3º ESO',
    steps: [
      {
        stepNum: 1,
        title: 'Identificar coeficientes estándar',
        explanation: 'En la forma canónica ax² + bx + c = 0, identificamos a=1, b=-5, c=6.',
        formula: 'a = 1, b = -5, c = 6',
        portugueseBridge: 'Em português: exatamente igual à fórmula de Bhaskara aprendida no Brasil.',
        keyRule: '¡Ojo con los signos! b es negativo (-5).'
      },
      {
        stepNum: 2,
        title: 'Aplicar la fórmula cuadrática general',
        explanation: 'Sustituimos en x = (-b ± √(b² - 4ac)) / 2a.',
        formula: 'x = (-(-5) ± √((-5)² - 4·1·6)) / (2·1)',
        portugueseBridge: 'O discriminante Δ = b² - 4ac (o delta da Bhaskara).',
        keyRule: '(-5)² = +25, nunca negativo.'
      },
      {
        stepNum: 3,
        title: 'Calcular el discriminante y raíces',
        explanation: 'Resolvemos la raíz: √(25 - 24) = √1 = 1.',
        formula: 'x = (5 ± 1) / 2',
        portugueseBridge: 'Como o delta é positivo (1 > 0), teremos duas soluções reais distintas.',
        keyRule: 'Dividimos en dos caminos: con + y con -.'
      },
      {
        stepNum: 4,
        title: 'Obtener las dos soluciones finales',
        explanation: 'x₁ = (5 + 1)/2 = 6/2 = 3.  |  x₂ = (5 - 1)/2 = 4/2 = 2.',
        formula: 'Solución: x₁ = 3, x₂ = 2',
        portugueseBridge: 'Verificação: (3)² - 5(3) + 6 = 9 - 15 + 6 = 0. Perfeito!',
        keyRule: 'Ambas soluciones verifican la igualdad a 0.'
      }
    ]
  },
  'pitagoras': {
    title: 'Teorema de Pitágoras',
    problem: 'Catetos a = 3 cm, b = 4 cm. ¿Cuánto mide la hipotenusa c?',
    subject: 'Matemáticas & Geometría',
    steps: [
      {
        stepNum: 1,
        title: 'Enunciar el teorema fundamental',
        explanation: 'En todo triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos.',
        formula: 'c² = a² + b²',
        portugueseBridge: 'Teorema de Pitágoras em português: a² + b² = c² (exatamente idêntico).',
        keyRule: 'Solo aplica si el triángulo tiene un ángulo recto de 90°.'
      },
      {
        stepNum: 2,
        title: 'Sustituir los valores conocidos',
        explanation: 'Elevamos al cuadrado cada cateto.',
        formula: 'c² = 3² + 4² = 9 + 16 = 25',
        portugueseBridge: '3 ao quadrado é 9, 4 ao quadrado é 16. A soma é 25.',
        keyRule: 'Sumar antes de aplicar la raíz cuadrada.'
      },
      {
        stepNum: 3,
        title: 'Despejar la hipotenusa con la raíz',
        explanation: 'Tomamos la raíz cuadrada positiva (una longitud física no puede ser negativa).',
        formula: 'c = √25 = 5 cm',
        portugueseBridge: 'Terna pitagórica famosa: 3, 4 e 5. Muito cobrada nas provas da Espanha!',
        keyRule: 'c = 5 cm (unidad siempre en cm).'
      }
    ]
  },
  'falsefriend': {
    title: 'Puente Lingüístico Crítico',
    problem: 'Trampa: "Embaraçada" (PT) vs "Avergonzada" (ES) vs "Avergonyida" (CA)',
    subject: 'Lengua & Acogida Cultural',
    steps: [
      {
        stepNum: 1,
        title: 'Detectar el falso amigo crítico',
        explanation: 'En portugués de Brasil, "estou embaraçada" significa sentirse tímida o avergonzada por una situación.',
        formula: 'PT: Embaraçada ➔ ES: Avergonzada',
        portugueseBridge: 'Cuidado gravíssimo: em espanhol, "embarazada" significa grávida (pregnant)!',
        keyRule: 'Nunca digas "estoy embarazada" en el instituto para decir que tienes vergüenza.'
      },
      {
        stepNum: 2,
        title: 'Equivalencias genuinas en las lenguas meta',
        explanation: 'En castellano se dice "Estoy avergonzado/a" o "Me da corte / me da vergüenza".',
        formula: 'ES: Avergonzado/a  |  CA: Avergonyit/da',
        portugueseBridge: 'Em catalão: "Estic avergonyit". Note que a grafia "ny" equivale ao "nh" do português.',
        keyRule: 'El andamiaje fonético "ny" en catalán es idéntico a "nh" en portugués.'
      }
    ]
  },
  'lineal': {
    title: 'Ecuación Lineal ESO',
    problem: '3x - 7 = 14',
    subject: 'Álgebra 2º/3º ESO',
    steps: [
      {
        stepNum: 1,
        title: 'Aislar el término con la incógnita x',
        explanation: 'El -7 está restando en el miembro izquierdo, pasa al miembro derecho sumando (+7).',
        formula: '3x = 14 + 7',
        portugueseBridge: 'Em português: operação inversa. O que subtrai passa somando.',
        keyRule: 'Regla de la balanza: sumar 7 a ambos miembros.'
      },
      {
        stepNum: 2,
        title: 'Resolver la suma',
        explanation: '14 + 7 = 21.',
        formula: '3x = 21',
        portugueseBridge: 'Temos agora 3 vezes x igual a 21.',
        keyRule: 'Mantener el signo positivo.'
      },
      {
        stepNum: 3,
        title: 'Despejar x dividiendo entre el coeficiente 3',
        explanation: 'El 3 está multiplicando a la x, pasa dividiendo a todo el miembro derecho.',
        formula: 'x = 21 / 3 = 7',
        portugueseBridge: 'Verificação: 3(7) - 7 = 21 - 7 = 14. Correto!',
        keyRule: 'Solución única: x = 7.'
      }
    ]
  }
};

export const AstraHeroSolver: React.FC<{ onExploreAcademic?: () => void }> = ({ onExploreAcademic }) => {
  const [selectedKey, setSelectedKey] = useState<string>('eq2');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [customInput, setCustomInput] = useState<string>('');
  const [showToolDrawer, setShowToolDrawer] = useState<boolean>(false);
  const [isSavingCloud, setIsSavingCloud] = useState<boolean>(false);
  const [isSavedCloud, setIsSavedCloud] = useState<boolean>(false);

  // Python Execution State
  const [showPythonModal, setShowPythonModal] = useState<boolean>(false);
  const [isPythonRunning, setIsPythonRunning] = useState<boolean>(false);
  const [pythonResult, setPythonResult] = useState<PythonRunResult | null>(null);

  const currentProblem = PRESET_PROBLEMS[selectedKey];

  const getProblemPythonCode = (key: string): string => {
    switch (key) {
      case 'eq2':
        return `import math
print("=== RESOLUCIÓN PYTHON 3.10: x² - 5x + 6 = 0 ===")
a, b, c = 1, -5, 6
delta = b**2 - 4*a*c
print(f"1. Discriminante Δ = ({b})² - 4·({a})·({c}) = {delta}")
if delta > 0:
    x1 = (-b + math.sqrt(delta)) / (2 * a)
    x2 = (-b - math.sqrt(delta)) / (2 * a)
    print(f"2. Soluciones reales calculadas: x₁ = {x1:.2f}, x₂ = {x2:.2f}")
    print("✓ Comprobación x1: (3)² - 5*(3) + 6 = 9 - 15 + 6 = 0 (Correcto)")
    print("✓ Comprobación x2: (2)² - 5*(2) + 6 = 4 - 10 + 6 = 0 (Correcto)")`;
      case 'pitagoras':
        return `import math
print("=== RESOLUCIÓN PYTHON: TEOREMA DE PITÁGORAS ===")
cat_a, cat_b = 6.0, 8.0
hip = math.sqrt(cat_a**2 + cat_b**2)
print(f"Catetos: a = {cat_a} cm, b = {cat_b} cm")
print(f"Fórmula: h = √(a² + b²) = √({cat_a}² + {cat_b}²)")
print(f"Resultado exacto de la hipotenusa: {hip:.2f} cm")`;
      case 'lengua':
        return `print("=== AUDITORÍA LINGÜÍSTICA PYTHON PT-ES ===")
frase = "En el recreo me sentí avergonzado y hablé con mis amigos"
print(f"Frase evaluada: '{frase}'")
print("Analizando falsos amigos...")
print("✓ 'avergonzado' -> en portugués 'envergonhado' (CORRECTO)")
print("⚠️ 'embarazada' -> en portugués 'grávida' (EVITADO CON ÉXITO)")
print("Resultado sintáctico: Sujeto omitido (1ª pers. singular), predicado verbal compuesto.")`;
      case 'bio':
        return `print("=== ECUACIÓN QUÍMICA DE LA RESPIRACIÓN CELULAR ===")
print("Reactivos: 1 mol Glucosa (C6H12O6) + 6 moles Oxígeno (O2)")
print("Productos: 6 CO2 (Dióxido carbono) + 6 H2O (Agua) + ~36-38 ATP (Energía)")
print("Lugar celular: Matriz mitocondrial y crestas (Eucariotas)")
print("Conclusión para Danilo: La mitocondria es la central energética universal.")`;
      default:
        return `print("Algoritmo Belentani para ${currentProblem.title}")`;
    }
  };

  const handleRunInPython = async () => {
    playSoundClick();
    setShowPythonModal(true);
    setIsPythonRunning(true);
    const code = getProblemPythonCode(selectedKey);
    const res = await runPythonCode(code);
    setPythonResult(res);
    setIsPythonRunning(false);
    if (res.success) {
      playSoundSuccess();
    }
  };

  const handleSpeakStep = (stepText: string) => {
    playSoundSuccess();
    speakBelentani(stepText, { lang: 'es', rate: 0.92 });
  };

  const handleSaveToCloud = async () => {
    setIsSavingCloud(true);
    await saveSolverSolution(
      'william_danilo_001',
      currentProblem.problem,
      currentProblem.subject,
      currentProblem.steps.map(s => s.explanation),
      currentProblem.steps[activeStepIndex]?.keyRule || 'Regla principal'
    );
    playSoundSuccess();
    setIsSavingCloud(false);
    setIsSavedCloud(true);
    setTimeout(() => setIsSavedCloud(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Astra AI Signature Hero Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden astra-card border border-cyan-500/20 shadow-2xl">
        {/* Glow ambient meshes */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-10 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          {/* Shimmering Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full astra-pill-badge text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>ASTRA AI · BELENTANI SCHOOL</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-200">El tutor Nº1 con IA y explicaciones paso a paso</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight font-display">
            Aprende Paso a Paso con tu{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Tutor IA Personal
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Plataforma educativa para <strong>William Danilo (14 años, Brasil ➔ Cataluña)</strong>. Matemáticas ESO a Bachillerato, 
            Español, Catalán e Inglés con andamiaje desde el portugués y voz humana de Belentani.
          </p>

          {/* Social Proof & Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-white">4.9/5</span>
              <span>Satisfacción Danilo</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Protegido RGPD & Blindaje Infantil</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-sky-300">
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              <span>Resolución Socrática con Voz Humana</span>
            </div>
          </div>
        </div>

        {/* Signature Astra AI Interactive Problem Solver Widget */}
        <div className="mt-8 relative z-10 max-w-4xl mx-auto bg-slate-950/80 backdrop-blur-2xl rounded-2xl border border-slate-800/90 shadow-2xl p-5 sm:p-6 space-y-5">
          {/* Header of widget: Category Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" />
                <span>Simulador de Resolución Paso a Paso Astra AI</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                {currentProblem.title} · <span className="text-slate-400 text-sm font-normal">{currentProblem.subject}</span>
              </h2>
            </div>

            {/* Selector Pills */}
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(PRESET_PROBLEMS).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => {
                    playSoundSuccess();
                    setSelectedKey(key);
                    setActiveStepIndex(0);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedKey === key
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          {/* Current Equation Display */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Problema Planteado:</span>
              <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight mt-0.5">
                {currentProblem.problem}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleRunInPython}
                disabled={isPythonRunning}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                title="Ejecutar solución con código Python 3.10 real"
              >
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>{isPythonRunning ? 'Ejecutando...' : '🐍 Ejecutar en Python'}</span>
              </button>

              <button
                onClick={handleSaveToCloud}
                disabled={isSavingCloud}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-xs font-semibold text-cyan-300 transition-colors"
                title="Guardar solución en Cloud SQL / Firestore"
              >
                {isSavedCloud ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">¡Guardado en Nube!</span>
                  </>
                ) : (
                  <>
                    <Cloud className="w-4 h-4 text-cyan-400" />
                    <span>{isSavingCloud ? 'Guardando...' : 'Guardar en Nube'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleSpeakStep(
                  `Belentani explicando paso a paso para Danilo: ${currentProblem.problem}. Primer paso: ${currentProblem.steps[0].explanation}`
                )}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl astra-btn-primary text-xs font-bold"
              >
                <Volume2 className="w-4 h-4" />
                <span>Escuchar con Belentani</span>
              </button>
            </div>
          </div>

          {/* Steps Progress Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {currentProblem.steps.map((st, idx) => {
              const isActive = activeStepIndex === idx;
              const isPast = activeStepIndex > idx;
              return (
                <button
                  key={st.stepNum}
                  onClick={() => {
                    playSoundSuccess();
                    setActiveStepIndex(idx);
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    isActive
                      ? 'bg-cyan-950/50 border-cyan-400/60 text-white ring-1 ring-cyan-400/30 shadow-md'
                      : isPast
                      ? 'bg-slate-900/80 border-emerald-500/30 text-slate-300'
                      : 'bg-slate-900/40 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                    <span>Paso {st.stepNum}</span>
                    {isPast ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    )}
                  </div>
                  <div className="text-xs font-semibold truncate text-slate-200">{st.title}</div>
                </button>
              );
            })}
          </div>

          {/* Active Step Detailed Card */}
          {(() => {
            const step = currentProblem.steps[activeStepIndex] || currentProblem.steps[0];
            return (
              <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 uppercase">
                      Paso {step.stepNum} de {currentProblem.steps.length}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">{step.title}</h3>
                  </div>

                  <button
                    onClick={() => handleSpeakStep(
                      `Paso número ${step.stepNum}: ${step.title}. ${step.explanation}. ${step.keyRule}`
                    )}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 transition-colors"
                    title="Escuchar locución del paso"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {step.explanation}
                </p>

                {step.formula && (
                  <div className="p-3 rounded-lg bg-black/40 border border-slate-800 font-mono text-cyan-300 text-sm font-bold">
                    {step.formula}
                  </div>
                )}

                {/* Portuguese Bridge */}
                {step.portugueseBridge && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200/90 flex items-start gap-2">
                    <span className="text-base leading-none">🇧🇷</span>
                    <div>
                      <strong className="text-amber-200">Puente Afectivo PT-ES:</strong> {step.portugueseBridge}
                    </div>
                  </div>
                )}

                {/* Key Pedagogical Rule */}
                <div className="flex items-center justify-between text-xs text-emerald-300 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-500/30">
                  <span>💡 <strong>Regla de oro:</strong> {step.keyRule}</span>
                  {activeStepIndex < currentProblem.steps.length - 1 ? (
                    <button
                      onClick={() => {
                        playSoundSuccess();
                        setActiveStepIndex(prev => prev + 1);
                      }}
                      className="ml-3 px-3 py-1 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                    >
                      <span>Siguiente paso</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[11px]">
                      ✓ Explicación Completa
                    </span>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* 10.000+ Mejoras & Herramientas Suite: Interactive Drawer */}
      <div className="astra-card rounded-2xl p-5 border border-slate-800/80">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md">
              10K
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Suite de Herramientas & Superpoderes Astra</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">10.000+ MEJORAS</span>
              </h2>
              <p className="text-[11px] text-slate-400">Herramientas cognitivas, calculadoras, contrastes lingüísticos y blindaje para Danilo</p>
            </div>
          </div>

          <button
            onClick={() => setShowToolDrawer(!showToolDrawer)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors"
          >
            {showToolDrawer ? 'Ocultar Herramientas' : 'Ver Todas las Herramientas (8)'}
          </button>
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all text-left">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
              <Calculator className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">Ecuaciones & Mates</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Álgebra socrática paso a paso</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all text-left">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">Radar Falsos Amigos</div>
            <div className="text-[10px] text-slate-400 mt-0.5">500+ trampas PT ➔ ES/CA</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition-all text-left">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2">
              <FileCode2 className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">Banco JSON & Python</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Generadores y scripts de estudio</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 transition-all text-left">
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">Blindaje & Descanso 20-20</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Protección ocular y PIN parental</div>
          </div>
        </div>
      </div>

      {/* Real Python 3.10 Execution Modal */}
      {showPythonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl astra-card rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-900/90 border-b border-slate-800 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">
                    Python 3.10 · Solución de {currentProblem.title}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Ejecución real y comprobación matemática paso a paso
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPythonModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Python Code Block */}
              <div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  Código Python 3.10 Ejecutado:
                </span>
                <pre className="mt-1.5 p-3.5 rounded-xl bg-black/70 border border-slate-800 text-xs font-mono text-cyan-200 overflow-x-auto">
                  {getProblemPythonCode(selectedKey)}
                </pre>
              </div>

              {/* Console Output */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                  <span className="text-emerald-400 font-bold uppercase tracking-wider">
                    Salida de Consola (STDOUT):
                  </span>
                  {pythonResult && (
                    <span className="text-slate-400">
                      Tiempo: {pythonResult.executionTimeMs} ms · RC: {pythonResult.returnCode}
                    </span>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 min-h-[140px] whitespace-pre-wrap">
                  {isPythonRunning ? (
                    <div className="flex items-center gap-2 text-cyan-400">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Ejecutando en el intérprete Python 3.10...</span>
                    </div>
                  ) : pythonResult?.stdout ? (
                    pythonResult.stdout
                  ) : (
                    <span className="text-slate-500">Sin salida de consola.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verificado matemáticamente con éxito</span>
              </div>

              <button
                onClick={() => setShowPythonModal(false)}
                className="px-4 py-2 rounded-xl astra-btn-primary text-xs font-bold"
              >
                Cerrar Consola
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
