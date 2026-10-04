import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Radio, 
  Mic, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Play, 
  CheckCircle2, 
  GraduationCap, 
  Briefcase, 
  Gamepad2, 
  Bot, 
  FileText, 
  Palette, 
  Cloud, 
  ShieldCheck, 
  Flame, 
  RotateCcw, 
  ArrowRight,
  Headphones,
  Check,
  Zap,
  Clock,
  Calendar
} from 'lucide-react';
import { speakBelentani, stopSpeaking, playSoundSuccess, playSoundTone } from '../utils/speech';
import { NavigationTab } from '../types';

export interface WelcomeTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: NavigationTab) => void;
}

interface TourStep {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  tabTarget?: NavigationTab;
  tabButtonText?: string;
  icon: React.ReactNode;
  accentGradient: string;
  glowColor: string;
  voiceSpeech: string;
  bullets: string[];
  highlightNote: string;
  illustrationType: 'intro' | 'academic' | 'office' | 'arcade' | 'chat' | 'live' | 'transcribe' | 'creative' | 'cloud';
}

export const WelcomeTourModal: React.FC<WelcomeTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const hasSpokenStepRef = useRef<{ [key: number]: boolean }>({});

  const tourSteps: TourStep[] = [
    {
      id: 'welcome_intro',
      badge: '¡BIENVENIDO GUERRERO! 🇧🇷 ➡️ 🇪🇸',
      title: '¡Hola William Danilo! Bienvenido a Belentani School',
      subtitle: 'Soy Belentani, tu tutor, cantante y compañero en este viaje escolar',
      icon: <Sparkles className="w-8 h-8 text-amber-300" />,
      accentGradient: 'from-amber-500 via-orange-500 to-rose-600',
      glowColor: 'shadow-amber-500/30',
      voiceSpeech: 
        "¡Bienvenido William Danilo! Soy Belentani. He diseñado esta escuela especialmente para ti, que tienes catorce años y vienes de Brasil para triunfar en España y Cataluña. " +
        "Aquí nunca estarás solo: toda la plataforma cuenta con inteligencia artificial en vivo que te escucha, te explica paso a paso y celebra cada uno de tus progresos. ¡Acompáñame en este recorrido!",
      bullets: [
        'Acompañamiento personalizado y empático adaptado a tus 14 años.',
        'Puente lingüístico y cultural: Portugués 🇧🇷, Castellano 🇪🇸 y Catalán.',
        'Metodología activa: teoría clara, ejercicios guiados y gamificación.',
        'Entorno seguro, protegido y con descanso ocular automático.'
      ],
      highlightNote: '💡 Consejo de Belentani: Puedes pulsar "Siguiente" o dejar que la voz te guíe paso a paso.',
      illustrationType: 'intro'
    },
    {
      id: 'daily_365_classes',
      badge: '365 DÍAS · 4 HORAS LECTIVAS AL DÍA',
      title: 'Tu Escuela Diaria: 365 Clases Organizadas',
      subtitle: '4 Horas lectivas diarias: Matemáticas, Lenguas (PT-ES-CA), Ciencias y Laboratorio',
      tabTarget: 'claseDelDia',
      tabButtonText: 'Entrar a la Clase de Hoy (365 Días)',
      icon: <Clock className="w-8 h-8 text-amber-300" />,
      accentGradient: 'from-amber-600 via-rose-600 to-indigo-700',
      glowColor: 'shadow-amber-500/30',
      voiceSpeech: 
        "¡Esta es la columna vertebral de Belentani School, Danilo! Los trescientos sesenta y cinco días del año organizados en bloques diarios de cuatro horas lectivas. " +
        "Cada jornada cursamos Matemáticas, Lenguas con puente contrastivo desde tu portugués nativo al español y catalán, un recreo para descanso ocular con la regla veinte-veinte-veinte, Ciencias y Laboratorio Tecnológico con Python y hojas de cálculo. " +
        "Yo mismo te dicto las explicaciones en audio, realizamos ejercicios guiados paso a paso y al superar el mini-examen del día desbloqueas tus herramientas favoritas.",
      bullets: [
        '365 Clases completas del año académico con calendario interactivo y buscador temático.',
        'Bloques de 4 horas diarias con descanso escolar de 20 minutos (regla ocular 20-20-20).',
        'Dictado en audio por Belentani con filtrado acústico armónico y transcripción simultánea.',
        'Mini-examen diario de 3 preguntas para validar asistencia y acreditar el progreso en la nube.'
      ],
      highlightNote: '⭐ Al validar la clase de cada día con al menos 2 aciertos, desbloqueas el acceso ilimitado a las herramientas.',
      illustrationType: 'intro'
    },
    {
      id: 'academic_plan',
      badge: 'CURRÍCULO OFICIAL ESO & BACHILLERATO',
      title: 'Tu Plan de Estudios Completo para 3º de ESO',
      subtitle: 'Todas las asignaturas troncales con teoría desglosada y ejercicios',
      tabTarget: 'academic',
      tabButtonText: 'Ver Plan de 3º ESO',
      icon: <GraduationCap className="w-8 h-8 text-blue-300" />,
      accentGradient: 'from-blue-600 via-indigo-600 to-sky-600',
      glowColor: 'shadow-blue-500/30',
      voiceSpeech: 
        "En el Plan Académico tienes todo el curso de tercero de la ESO organizado: Matemáticas Académicas, Lengua Castellana, Catalán, Biología, Física y Química, Geografía e Historia e Inglés. " +
        "Cada tema incluye explicaciones claras, glosarios bilingües y ejercicios resueltos paso a paso para que saques excelentes notas en el instituto.",
      bullets: [
        'Matemáticas Académicas: Álgebra, ecuaciones de 2º grado y funciones.',
        'Lengua y Literatura Castellana: Sintaxis, análisis morfológico y redacción.',
        'Llengua Catalana i Literatura: Gramática comunicativa y vocabulario contextual.',
        'Biología y Geología, Física y Química, Geografía e Historia e Inglés.'
      ],
      highlightNote: '📚 Puedes resolver dudas directamente en cada tema o pedirle a la IA que te ponga un examen de prueba.',
      illustrationType: 'academic'
    },
    {
      id: 'office_pack',
      badge: 'SUITE OFIMÁTICA INTEGRADA',
      title: 'EduOffice Pack: Word y Excel Escolar',
      subtitle: 'Redacta trabajos y calcula tablas directamente en tu navegador',
      tabTarget: 'office',
      tabButtonText: 'Abrir EduOffice',
      icon: <Briefcase className="w-8 h-8 text-emerald-300" />,
      accentGradient: 'from-emerald-600 via-teal-600 to-cyan-700',
      glowColor: 'shadow-emerald-500/30',
      voiceSpeech: 
        "En el EduOffice Pack tienes tus herramientas de ofimática listas para usar: EduWord para redactar tus ensayos, redacciones e informes de laboratorio, y EduSheets para crear hojas de cálculo con fórmulas matemáticas, promedios y gráficos. " +
        "Todo se guarda en tu cuenta y lo puedes imprimir o exportar para entregarle a tus profesores.",
      bullets: [
        'EduWord: Formato enriquecido, corrector ortográfico, fuentes y plantillas escolares.',
        'EduSheets: Celdas dinámicas, fórmulas automáticas (=SUMA, =PROMEDIO), gráficos y tablas.',
        'Exportación instantánea a PDF e impresión limpia.',
        'Compatibilidad total con tareas de clase sin necesidad de instalar programas externos.'
      ],
      highlightNote: '📄 ¡Ideal para hacer los deberes de lengua y las tablas de matemáticas en un solo lugar!',
      illustrationType: 'office'
    },
    {
      id: 'arcade_games',
      badge: 'MÁS DE 500 DESAFÍOS DE APRENDIZAJE',
      title: 'Arcade Belentani 8-Bit: Aprender Jugando',
      subtitle: 'Cálculo mental, lógica, algoritmos y torneos de conocimiento',
      tabTarget: 'arcade',
      tabButtonText: 'Explorar el Arcade',
      icon: <Gamepad2 className="w-8 h-8 text-purple-300" />,
      accentGradient: 'from-purple-600 via-fuchsia-600 to-pink-600',
      glowColor: 'shadow-purple-500/30',
      voiceSpeech: 
        "¡Y aquí llega la diversión con el Arcade Belentani! Tienes más de 500 juegos y retos de lógica matemática, cálculo de reflejos, duelos de vocabulario y carreras de algoritmos. " +
        "Mientras juegas acumulas puntos de experiencia, subes de nivel y entrenas tu agilidad mental. Además, el sistema cuida de ti con descansos de vista programados.",
      bullets: [
        'Desafíos de cálculo relámpago y agilidad con números enteros y fracciones.',
        'Ajedrez pedagógico, laberintos lógicos y patrones espaciales.',
        'Trivial de historia, geografía y vocabulario trilingüe.',
        'Sistema de medallas y puntuaciones para motivarte cada día.'
      ],
      highlightNote: '⭐ Ganar puntos desbloquea nuevos títulos de guerrero escolar para tu perfil.',
      illustrationType: 'arcade'
    },
    {
      id: 'chat_gemini',
      badge: 'MOTORES DE RAZONAMIENTO GEMINI 3.X',
      title: 'Chatbot Tutor con Modelos Gemini 3.x',
      subtitle: 'Elige el cerebro de IA según la dificultad de lo que estés estudiando',
      tabTarget: 'chat',
      tabButtonText: 'Entrar al Chatbot',
      icon: <Bot className="w-8 h-8 text-cyan-300" />,
      accentGradient: 'from-cyan-600 via-blue-600 to-indigo-700',
      glowColor: 'shadow-cyan-500/30',
      voiceSpeech: 
        "En el Chatbot cuentas con los modelos más avanzados de la familia Gemini tres. " +
        "Para problemas difíciles de matemáticas y deducciones profundas, activa Gemini 3.1 Pro. Para explicaciones generales y redacción fluida, usa Gemini 3.5 Flash. Y para dudas rápidas de vocabulario, Gemini 3.1 Flash Lite. " +
        "También puedes elegir si hablas con Belentani, con tu Profe de Mates o con el Entrenador de Lógica.",
      bullets: [
        'gemini-3.1-pro-preview: Razonamiento matemático avanzado y demostraciones.',
        'gemini-3.5-flash: Explicaciones conversacionales equilibradas y redacción.',
        'gemini-3.1-flash-lite: Respuestas ultrarrápidas y definiciones inmediatas.',
        '4 Roles pedagógicos: Belentani Líder, Profe de Mates, Filólogo y Entrenador Arcade.'
      ],
      highlightNote: '🧠 Puedes alternar entre modelos en cualquier momento según la dificultad de la tarea.',
      illustrationType: 'chat'
    },
    {
      id: 'live_voice_highlight',
      badge: '🔥 ¡EN VIVO ESCUCHANDO! · LIVE API',
      title: 'Voz en Vivo: ¡La IA te Escucha en Tiempo Real!',
      subtitle: 'Conversación oral bidireccional continua con gemini-3.1-flash-live-preview',
      tabTarget: 'geminiLive',
      tabButtonText: '¡Probar Voz en Vivo Ahora!',
      icon: <Radio className="w-8 h-8 text-rose-300 animate-pulse" />,
      accentGradient: 'from-rose-600 via-red-500 to-amber-600',
      glowColor: 'shadow-rose-500/40',
      voiceSpeech: 
        "¡Presta mucha atención a esto, Danilo! ¡Estamos en vivo escuchando! En la sección Voz en Vivo no tienes que escribir en el teclado: simplemente abres el micrófono y hablas conmigo como si fuera una videollamada real. " +
        "El modelo Gemini 3.1 Flash Live procesa tu voz al instante a dieciséis kilohercios y te responde de viva voz con baja latencia. Me puedes interrumpir cuando quieras, hacerme preguntas de tus deberes y practicar tu español o portugués hablando de tú a tú. ¡Pruébalo!",
      bullets: [
        'Micrófono en vivo con streaming WebSocket bidireccional en tiempo real.',
        'gemini-3.1-flash-live-preview: Captura PCM a 16 kHz y audio de salida a 24 kHz.',
        'Interrupciones naturales: puedes cortar a la IA cuando quieras como en una charla humana.',
        'Práctica oral de idiomas y resolución de deberes hablando en voz alta.'
      ],
      highlightNote: '🎙️ ¡La IA está en vivo escuchando en cualquier momento para ayudarte sin teclear!',
      illustrationType: 'live'
    },
    {
      id: 'audio_transcribe',
      badge: 'APUNTES ORALES INSTANTÁNEOS',
      title: 'Transcriptor de Audio de Clases y Lecciones',
      subtitle: 'Convierte tus grabaciones y explicaciones de voz en apuntes escritos',
      tabTarget: 'transcribe',
      tabButtonText: 'Ir al Transcriptor',
      icon: <FileText className="w-8 h-8 text-violet-300" />,
      accentGradient: 'from-violet-600 via-purple-600 to-indigo-700',
      glowColor: 'shadow-violet-500/30',
      voiceSpeech: 
        "Con el nuevo Transcriptor de Audio puedes grabar las explicaciones del colegio o dictar tus propios resúmenes. " +
        "El modelo Gemini 3.5 Transcribe escucha la grabación y la convierte automáticamente en texto limpio, separando párrafos y facilitándote apuntes perfectos listos para estudiar.",
      bullets: [
        'Grabación con micrófono en directo con temporizador y visualizador de onda.',
        'Carga de archivos de audio (.mp3, .wav, .m4a, .webm).',
        'Modelo gemini-3.5-transcribe con alta precisión en español, catalán y portugués.',
        'Copiado directo a EduWord y almacenamiento en la nube de Firestore.'
      ],
      highlightNote: '📝 Di tus ideas en voz alta y deja que la IA redacte tus apuntes de estudio.',
      illustrationType: 'transcribe'
    },
    {
      id: 'creative_studio',
      badge: 'IMÁGENES FLASH & MÚSICA LYRIA',
      title: 'Estudio Creativo: Arte e Ilustraciones Escolares',
      subtitle: 'Ilustra proyectos con Gemini Flash Image y genera música con Google Lyria',
      tabTarget: 'creative',
      tabButtonText: 'Abrir Estudio Creativo',
      icon: <Palette className="w-8 h-8 text-pink-300" />,
      accentGradient: 'from-pink-600 via-rose-600 to-orange-600',
      glowColor: 'shadow-pink-500/30',
      voiceSpeech: 
        "En el Estudio Creativo puedes dar vida a tus proyectos de clase. Con Gemini 3.1 Flash Image puedes generar imágenes y editar esquemas con diferentes proporciones. " +
        "Y con Google Lyria puedes crear clips musicales o canciones para tus presentaciones. ¡Aprender también es crear!",
      bullets: [
        'gemini-3.1-flash-image-preview: Generación y edición interactiva de imágenes.',
        'Selector de formato: 1:1 para iconos, 16:9 para diapositivas y 4:3 para libros.',
        'Composición musical con Lyria Clip (30s) y Lyria Pro para bandas sonoras.',
        'Descarga directa de imágenes y audios para tus trabajos escolares.'
      ],
      highlightNote: '🎨 ¡Crea la portada de tu trabajo de historia o una canción motivacional para estudiar!',
      illustrationType: 'creative'
    },
    {
      id: 'cloud_and_parental',
      badge: 'SINCRONIZACIÓN Y PROTECCIÓN',
      title: 'Tu Perfil en la Nube y Blindaje de Salud',
      subtitle: 'Progreso seguro con Firebase Firestore y descansos para la vista',
      tabTarget: 'academic',
      tabButtonText: '¡Comenzar a Estudiar con Belentani!',
      icon: <ShieldCheck className="w-8 h-8 text-emerald-300" />,
      accentGradient: 'from-emerald-600 via-blue-600 to-indigo-700',
      glowColor: 'shadow-emerald-500/30',
      voiceSpeech: 
        "Tus notas, transcripciones y creaciones se sincronizan de forma segura en la nube con Firestore. " +
        "Además, el Blindaje Infantil vigila que no te canses la vista con la regla 20-20-20. " +
        "¡Todo está listo, William Danilo! Tu futuro brillante comienza hoy. ¡Vamos a por todas!",
      bullets: [
        'Autenticación con Google o acceso de Invitado con respaldo en Firestore.',
        'Historial de transcripciones, apuntes y creaciones artísticas guardados.',
        'Control de tiempo saludable y recordatorios de descanso ocular cada 20 min.',
        'Asistencia constante de Belentani siempre que lo necesites.'
      ],
      highlightNote: '🛡️ Tu progreso está a salvo y puedes volver a ver este tour cuando quieras.',
      illustrationType: 'cloud'
    }
  ];

  const currentStep = tourSteps[currentStepIndex];

  // Speak speech when step changes
  useEffect(() => {
    if (!isOpen) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    // Auto speak if not muted and not already spoken for this step in this run
    if (!isVoiceMuted) {
      stopSpeaking();
      setIsSpeaking(true);
      playSoundTone(520, 0.08, 'triangle', 0.1);

      speakBelentani(currentStep.voiceSpeech, {
        lang: 'es',
        rate: 0.94,
        onEnd: () => setIsSpeaking(false)
      });
    }
  }, [currentStepIndex, isOpen, isVoiceMuted]);

  // Clean up when unmounting or closing
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  if (!isOpen) return null;

  const handleNext = () => {
    playSoundTone(660, 0.05, 'sine', 0.1);
    if (currentStepIndex < tourSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    playSoundTone(440, 0.05, 'sine', 0.1);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    stopSpeaking();
    playSoundSuccess();
    // Mark in localStorage that tour was completed
    localStorage.setItem('belentani_tour_completed', 'true');
    localStorage.setItem('belentani_tour_last_completed_at', Date.now().toString());
    onClose();
  };

  const handleRepeatVoice = () => {
    stopSpeaking();
    setIsSpeaking(true);
    speakBelentani(currentStep.voiceSpeech, {
      lang: 'es',
      rate: 0.94,
      onEnd: () => setIsSpeaking(false)
    });
  };

  const handleToggleMute = () => {
    if (!isVoiceMuted) {
      stopSpeaking();
      setIsSpeaking(false);
      setIsVoiceMuted(true);
    } else {
      setIsVoiceMuted(false);
      setIsSpeaking(true);
      speakBelentani(currentStep.voiceSpeech, {
        lang: 'es',
        rate: 0.94,
        onEnd: () => setIsSpeaking(false)
      });
    }
  };

  const handleJumpToSection = (tab?: NavigationTab) => {
    stopSpeaking();
    playSoundSuccess();
    onClose();
    if (tab) {
      onNavigateToTab(tab);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className={`bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col my-auto transition-all ${currentStep.glowColor}`}>
        
        {/* Top Header bar with Windows Aero styling & Steps Progress */}
        <div className="px-5 sm:px-8 py-4 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
                  {currentStep.badge}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
                  Paso {currentStepIndex + 1} de {tourSteps.length}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                Tour Guiado con Voz de Belentani
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Repeat voice button */}
            <button
              onClick={handleRepeatVoice}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                isSpeaking 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700'
              }`}
              title="Volver a escuchar la explicación de Belentani"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Repetir Voz</span>
            </button>

            {/* Mute/Unmute toggle */}
            <button
              onClick={handleToggleMute}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                isVoiceMuted 
                  ? 'bg-rose-950/40 text-rose-300 border-rose-800' 
                  : 'bg-blue-600/20 text-sky-300 border-blue-500/40'
              }`}
              title={isVoiceMuted ? 'Activar voz de Belentani' : 'Silenciar voz'}
            >
              {isVoiceMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
              <span className="hidden sm:inline">{isVoiceMuted ? 'Mudo' : 'Voz Activa'}</span>
            </button>

            {/* Close button */}
            <button
              onClick={handleComplete}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-slate-700"
              title="Cerrar tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Progress indicator bar */}
        <div className="w-full bg-slate-800 h-1.5 flex">
          {tourSteps.map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-1 transition-all duration-300 border-r border-slate-900 ${
                idx < currentStepIndex 
                  ? 'bg-emerald-500' 
                  : idx === currentStepIndex 
                  ? 'bg-amber-400' 
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Modal Main Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[68vh]">
          
          {/* Card hero highlight with gradient banner */}
          <div className={`p-5 sm:p-6 rounded-2xl bg-gradient-to-r ${currentStep.accentGradient} text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner flex-shrink-0">
                {currentStep.icon}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                  {currentStep.title}
                </h3>
                <p className="text-white/90 text-sm sm:text-base font-medium mt-1">
                  {currentStep.subtitle}
                </p>
              </div>
            </div>

            {/* Speaking Status Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-xs font-semibold flex-shrink-0">
              {isSpeaking ? (
                <>
                  <div className="flex items-center gap-0.5">
                    <span className="w-1 h-3 bg-amber-300 animate-bounce rounded-full" />
                    <span className="w-1 h-4 bg-amber-300 animate-bounce delay-75 rounded-full" />
                    <span className="w-1 h-2 bg-amber-300 animate-bounce delay-150 rounded-full" />
                  </div>
                  <span className="text-amber-200">Belentani hablando...</span>
                </>
              ) : isVoiceMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-300" />
                  <span className="text-rose-200">Voz en silencio</span>
                </>
              ) : (
                <>
                  <Headphones className="w-3.5 h-3.5 text-sky-300" />
                  <span className="text-sky-200">Audio listo</span>
                </>
              )}
            </div>
          </div>

          {/* Spoken Text Box (What Belentani is saying) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md">
              🧔
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-400">Belentani te dice:</span>
                <span className="text-[10px] text-slate-500">• Voz humana con acento natural</span>
              </div>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed italic">
                "{currentStep.voiceSpeech}"
              </p>
            </div>
          </div>

          {/* Key bullets of this module */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {currentStep.bullets.map((bullet, idx) => (
              <div 
                key={idx} 
                className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3 hover:bg-slate-800/90 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  {bullet}
                </span>
              </div>
            ))}
          </div>

          {/* Pro-tip note */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm flex items-center gap-2.5">
            <span>{currentStep.highlightNote}</span>
          </div>

          {/* Action to Jump Directly to this tab */}
          {currentStep.tabTarget && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-sky-200">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>¿Quieres probar esta herramienta ahora mismo sin esperar al final del tour?</span>
              </div>
              <button
                onClick={() => handleJumpToSection(currentStep.tabTarget)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105"
              >
                <span>{currentStep.tabButtonText || 'Ir a esta herramienta'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer Navigation Controls */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          
          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {tourSteps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => {
                  playSoundTone(500, 0.04, 'sine', 0.1);
                  setCurrentStepIndex(idx);
                }}
                className={`h-2.5 rounded-full transition-all ${
                  idx === currentStepIndex 
                    ? 'w-7 bg-amber-400 shadow-md shadow-amber-400/50' 
                    : 'w-2.5 bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Paso ${idx + 1}: ${step.title}`}
              />
            ))}
          </div>

          {/* Next / Previous / Finish Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                currentStepIndex === 0 
                  ? 'opacity-40 cursor-not-allowed text-slate-500 border-slate-800' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {currentStepIndex < tourSteps.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-white shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-transform hover:scale-105"
              >
                <span>Siguiente Paso</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="px-6 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-white shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-transform hover:scale-105"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>¡Finalizar Tour y Empezar!</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
