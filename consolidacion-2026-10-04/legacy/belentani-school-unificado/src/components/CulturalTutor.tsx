import React, { useState } from 'react';
import { CULTURAL_GUIDES, FALSE_FRIENDS } from '../data/curriculumData';
import { CulturalGuideItem, FalseFriendItem } from '../types';
import { 
  Sparkles, 
  Volume2, 
  ShieldAlert, 
  Heart, 
  Music, 
  Users, 
  Clock, 
  MessageCircle, 
  ArrowRight, 
  Compass,
  School,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Smile,
  Award,
  HelpCircle,
  ChevronRight,
  Calculator,
  Radio,
  Share2
} from 'lucide-react';
import { speakBelentani, playSoundSuccess, playSoundTone, playSoundError } from '../utils/speech';

type ArrivalSection = 'sos' | 'instituto' | 'jerga' | 'notas' | 'falsos_amigos' | 'tradiciones';

export const CulturalTutor: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ArrivalSection>('sos');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [activeGuide, setActiveGuide] = useState<CulturalGuideItem>(CULTURAL_GUIDES[0]);
  const [selectedFalseFriend, setSelectedFalseFriend] = useState<FalseFriendItem>(FALSE_FRIENDS[0]);
  const [searchWord, setSearchWord] = useState('');

  // Grades simulator state for 3º ESO
  const [grades, setGrades] = useState<Record<string, number>>({
    mates: 6.5,
    lengua: 6.0,
    catalan: 7.0,
    ciencias: 7.5,
    ingles: 8.0,
    geografia: 6.0
  });

  const handleSpeak = (text: string, lang: 'es' | 'ca' | 'pt' = 'es') => {
    playSoundTone(520, 0.04, 'sine', 0.1);
    speakBelentani(text, { lang, rate: 0.94 });
  };

  // SOS Class Phrases for newly arrived Danilo
  const sosPhrases = [
    {
      id: 'sos-1',
      title: 'Pedir que el profesor hable más despacio',
      es: 'Profe, acabo de llegar de Brasil a 3º de ESO. ¿Me lo puedes explicar un poco más despacio, por favor?',
      ca: 'Profe, acabo d\'arribar del Brasil a 3r d\'ESO. M\'ho pots explicar una mica més a poc a poc, si us plau?',
      pt: 'Professor, acabei de chegar do Brasil. Pode explicar um pouco mais devagar, por favor?',
      tag: 'Básico en clase',
      situation: 'Cuando el profesor explique rápido y sientas que te pierdes con la velocidad.'
    },
    {
      id: 'sos-2',
      title: 'Preguntar en qué página del libro están',
      es: '¿En qué página del libro estamos ahora mismo?',
      ca: 'A quina pàgina del llibre estem ara mateix?',
      pt: 'Em qual página do livro a gente tá agora?',
      tag: 'Orientación',
      situation: 'Si abres el libro y no sabes por qué tema o ejercicio van.'
    },
    {
      id: 'sos-3',
      title: 'Saber si entra en el examen o es solo ejercicio',
      es: '¿Esto lo tenemos que copiar en el cuaderno o entra en el examen?',
      ca: 'Això s\'ha de copiar a la llibreta o entra a l\'examen?',
      pt: 'A gente precisa copiar no caderno ou isso cai na prova?',
      tag: 'Exámenes',
      situation: 'Para priorizar apuntes y saber qué estudiar en casa.'
    },
    {
      id: 'sos-4',
      title: 'Pedir permiso para ir al baño / lavabo',
      es: '¿Puedo ir al lavabo / baño un momento, por favor?',
      ca: 'Puc anar al lavabo un moment, si us plau?',
      pt: 'Posso ir ao banheiro um minutinho, por favor?',
      tag: 'Permisos',
      situation: 'En España se suele decir "lavabo" o "baño". Levanta la mano con calma.'
    },
    {
      id: 'sos-5',
      title: 'Pedir prestada una goma o un bolígrafo (¡ojo con borracha!)',
      es: '¿Alguien me puede prestar un boli o la goma de borrar?',
      ca: 'Algú em pot deixar un bolígraf o la goma d\'esborrar?',
      pt: 'Alguém me empresta uma caneta ou borracha de apagar?',
      tag: 'Material',
      situation: '¡Importante! Recuerda pedir "goma de borrar", nunca digas solo "borracha".'
    },
    {
      id: 'sos-6',
      title: 'Duda sobre el significado de una palabra desconocida',
      es: 'No entiendo esta palabra. ¿Qué significa o cómo se dice en portugués?',
      ca: 'No entenc aquesta paraula. Què vol dir exactament?',
      pt: 'Não entendi essa palavra. O que significa?',
      tag: 'Vocabulario',
      situation: 'No te quedes con la duda; a los profes les encanta que preguntes vocabulario.'
    },
    {
      id: 'sos-7',
      title: 'Proponer hacer un trabajo en grupo con compañeros',
      es: '¿Puedo hacer el trabajo en grupo con vosotros? Me gustaría ayudar.',
      ca: 'Puc fer el treball en grup amb vosaltres? M\'agradaria ajudar.',
      pt: 'Posso fazer o trabalho em grupo com vocês? Quero ajudar.',
      tag: 'Socializar',
      situation: 'La mejor forma de hacer amigos en clase es colaborar en proyectos de equipo.'
    },
    {
      id: 'sos-8',
      title: 'Saber la fecha de entrega de los deberes',
      es: '¿Para qué día hay que entregar estos ejercicios / deberes?',
      ca: 'Per a quin dia hem d\'entregar aquests deures?',
      pt: 'Para qual dia tem que entregar essa tarefa de casa?',
      tag: 'Deberes',
      situation: 'Para apuntarlo en tu agenda o libreta escolar.'
    }
  ];

  // Youth Slang dictionary for 14-year-olds in Spain
  const youthSlang = [
    {
      word: 'Chaval / Chavalada',
      esMeaning: 'Chico, joven, compañero de clase o el grupo de amigos.',
      ptEquivalent: 'Garoto, moleque, galera, turma.',
      example: '¡Hombre, chaval, qué pasa! La chavalada va a jugar un partido.',
      audio: '¡Hombre, chaval! La chavalada va a jugar un partido de fútbol en el recreo.'
    },
    {
      word: 'Mola un huevo / Mola mazo',
      esMeaning: 'Es genial, es muy divertido o excelente.',
      ptEquivalent: 'Muito da hora, muito massa, irado.',
      example: 'Tu zapatilla mola un huevo. Esta clase de ciencias mola mazo.',
      audio: 'Tu juego mola un montón, está genial.'
    },
    {
      word: 'Flipar en colores',
      esMeaning: 'Quedarse muy sorprendido, alucinado o sin palabras.',
      ptEquivalent: 'Pirar, ficar de queixo caído, ficar chocado.',
      example: 'Cuando vi la nota del examen me quedé flipando en colores.',
      audio: 'Cuando vi el gol en el recreo me quedé flipando en colores.'
    },
    {
      word: 'Rayarse la cabeza',
      esMeaning: 'Preocuparse en exceso, darle vueltas a un problema innecesariamente.',
      ptEquivalent: 'Ficar noiado, pirar a cabeça, ficar martelando ideia.',
      example: 'No te rayes, tío, que el examen era fácil y lo vas a aprobar seguro.',
      audio: 'No te rayes, tío, que seguro que apruebas.'
    },
    {
      word: 'Liarla parda / Liarse',
      esMeaning: 'Cometer un error grande o confundirse de situación.',
      ptEquivalent: 'Fazer besteira, dar ruim, se enrolar todo.',
      example: 'Cuidado con la probeta en el laboratorio, ¡no la vayas a liar parda!',
      audio: 'Cuidado en el laboratorio de química, no la vayas a liar parda.'
    },
    {
      word: 'Tío / Tía',
      esMeaning: 'Forma informal y cercana de dirigirse a un amigo o compañero.',
      ptEquivalent: 'Mano, cara, véi, parceiro.',
      example: 'Oye, tío, ¿tienes los apuntes de lengua?',
      audio: 'Oye, tío, ¿me dejas los apuntes de la clase de ayer?'
    },
    {
      word: 'Empollar / Empollón',
      esMeaning: 'Estudiar con mucha dedicación. "Empollón" es quien saca siempre 10.',
      ptEquivalent: 'Estudar pesado, queimar neurônio / Nerd, CDF.',
      example: 'Esta tarde me toca empollar para el control de matemáticas.',
      audio: 'Esta tarde me quedo empollando para sacar un notable en física.'
    },
    {
      word: 'Estar empanado',
      esMeaning: 'Estar distraído, en las nubes o sin enterarse de lo que pasa.',
      ptEquivalent: 'Estar viajando na maionese, dormindo no ponto.',
      example: 'Danilo, ¡despierta que estás empanado! El profe ha preguntado a ti.',
      audio: '¡Despierta, que estás empanado! El profe te está preguntando.'
    },
    {
      word: 'Tener potra',
      esMeaning: 'Tener mucha suerte en algo sin haberlo planeado.',
      ptEquivalent: 'Ter sorte danada, estar cagado de sorte.',
      example: 'Menuda potra, ha entrado justo la pregunta que me leí en el pasillo.',
      audio: 'Menuda potra tuve, entró justo la fórmula que miré antes de entrar.'
    },
    {
      word: 'Hacer pellas / novillos',
      esMeaning: 'Faltar a clase sin permiso de los padres o profesores.',
      ptEquivalent: 'Matar aula, gazear, cabular aula.',
      example: '¡Nunca hagas pellas! En el instituto envían un aviso al móvil de tus padres de inmediato.',
      audio: 'Nunca hagas pellas, en el instituto envían una alerta inmediata a la familia.'
    }
  ];

  // Secondary School survival rules
  const schoolRules = [
    {
      title: 'El Horario Escolar (Jornada Continua)',
      icon: Clock,
      content: 'En la gran mayoría de institutos de España y Cataluña, el horario de 3º de ESO es continuo: de 8:00 de la mañana a 14:30 o 15:00 de la tarde. No hay clase por la tarde.',
      tip: 'Desayuna bien antes de salir de casa porque pasarás casi 3 horas hasta el primer recreo.'
    },
    {
      title: 'El Recreo ("El Patio" / "L\'esbarjo")',
      icon: Smile,
      content: 'Sobre las 11:00 o 11:30 suena el timbre del recreo (suele durar 30 minutos). Todos bajan al patio con su bocadillo ("bocata" en castellano / "entrepà" en catalán).',
      tip: 'Es el centro de la vida social: se arman pachangas de fútbol, baloncesto, o se charla sentado en las gradas. Llevar un balón o acercarse a pedir jugar es la forma más rápida de integrarse.'
    },
    {
      title: 'Cómo dirigirse a los Profesores (El Tuteo Respetuoso)',
      icon: Users,
      content: 'En España se suele llamar a los profesores por su nombre de pila ("Marta", "Carlos", "Javier") o simplemente "Profe". No se usa "Senhor/Senhora", y jamás se les llama "tío/tía". El trato es cercano pero siempre educado.',
      tip: 'Si tienes una duda, levanta la mano y di: "Profe, ¿puedes repetir el paso 2?" con naturalidad.'
    },
    {
      title: 'El Tutor o Tutora de 3º de ESO',
      icon: School,
      content: 'Cada clase tiene un "Profesor Tutor". Es tu persona de confianza en el centro educativo. Se reúne contigo para ver cómo te adaptas y habla con tu familia en las tutorías.',
      tip: 'Si algo te preocupa (el idioma, los compañeros o las notas), pídele hablar 5 minutos a solas.'
    },
    {
      title: 'Las Faltas de Asistencia y la App Escolar',
      icon: AlertTriangle,
      content: 'Cada hora de clase los profesores pasan lista con una tablet. Si llegas tarde o faltas, la aplicación del instituto (iEduca, TokApp, Alexia) envía una notificación inmediata al móvil de tus padres.',
      tip: 'Si estás enfermo, tus padres deben justificar la falta por la aplicación para que no te cuente como falta injustificada.'
    },
    {
      title: 'Las Taquillas del Instituto',
      icon: BookOpen,
      content: 'Muchos institutos ofrecen taquillas para que los alumnos de la ESO guarden los libros pesados y no carguen la mochila todos los días.',
      tip: 'Deja en la taquilla los libros de las asignaturas que no tengas deberes ese día.'
    }
  ];

  // LOMLOE grade scale evaluation
  const calculateLOMLOEStatus = () => {
    const subjects = Object.entries(grades);
    const failed = subjects.filter(([_, val]) => (val as number) < 5.0);
    const hasMathFailed = grades.mates < 5.0;
    const hasSpanishFailed = grades.lengua < 5.0;
    const bothCoreFailed = hasMathFailed && hasSpanishFailed;

    let passes = true;
    let message = '';
    let statusClass = '';

    if (failed.length === 0) {
      passes = true;
      message = '¡Excelente! Apruebas todas las materias y promocionas a 4º de ESO con honores.';
      statusClass = 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';
    } else if (failed.length <= 2 && !bothCoreFailed) {
      passes = true;
      message = `Promocionas a 4º de ESO según la LOMLOE (máximo 2 suspensas y no coinciden Lengua y Mates). Deberás recuperar las pendientes el próximo curso.`;
      statusClass = 'text-amber-400 border-amber-500/30 bg-amber-950/20';
    } else if (bothCoreFailed) {
      passes = false;
      message = `Alerta LOMLOE: No se puede promocionar si se suspenden simultáneamente Lengua Castellana y Matemáticas. Hay que ir a la recuperación trimestral de junio.`;
      statusClass = 'text-rose-400 border-rose-500/30 bg-rose-950/20';
    } else {
      passes = false;
      message = `Alerta LOMLOE: Tienes ${failed.length} materias con menos de 5. El máximo permitido para promocionar son 2 suspensas. ¡A estudiar con Belentani!`;
      statusClass = 'text-rose-400 border-rose-500/30 bg-rose-950/20';
    }

    return { passes, message, statusClass, failedCount: failed.length };
  };

  const lomloeStatus = calculateLOMLOEStatus();

  return (
    <div className="space-y-6">
      {/* Hero: Belentani Welcome & Immigrant Survival Hub (14 years old - 3º ESO) */}
      <div className="astra-card astra-card-glow p-6 sm:p-7 border border-white/[0.08] relative overflow-hidden bg-gradient-to-br from-[#0e0f1d] via-[#090a14] to-[#06070a]">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/40 text-violet-300 text-xs font-black tracking-wide uppercase">
                <Compass className="w-3.5 h-3.5 text-violet-400" />
                <span>CENTRO DE ATERRIZAJE EN ESPAÑA · 3º ESO</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold">
                <span>Danilo (14 años · Brasil 🇧🇷 ➔ España 🇪🇸 & Catalunya)</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              ¡Tranquilo Danilo, acabas de llegar y <span className="astra-text-glow">aquí no estás solo</span>!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Llegar de Brasil a España a los 14 años es un paso valiente. Aquí tienes tu guía completa para dominar tu instituto, hablar con profesores y amigos sin miedo, evitar falsos amigos y entender las notas de 1 a 10.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#06070a]/90 border border-white/[0.08] flex items-center gap-3.5 shrink-0 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 via-pink-600 to-amber-500 flex items-center justify-center text-2xl shadow-lg">
              🛡️
            </div>
            <div className="text-xs space-y-1">
              <div className="font-bold text-white">Voz de Acogida de Belentani</div>
              <div className="text-violet-300 text-[11px]">Audio de apoyo en tiempo real</div>
              <button
                onClick={() => handleSpeak(
                  "¡Hola William Danilo! Bienvenido a España. Sé que cambiar de país a los 14 años impresiona al principio, pero eres un guerrero. En esta plataforma tienes todo lo necesario: cómo funciona el instituto español, qué frases usar en clase para no pasar vergüenza, cómo son las notas de 1 a 10 y cómo hacer amigos en el recreo. ¡Vamos a por todas!",
                  'es'
                )}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Escuchar bienvenida de Belentani</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5 Primary Navigation Tabs for Arrival Experience */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-1 scrollbar-none border-t border-white/[0.06] mt-5">
          {[
            { id: 'sos' as ArrivalSection, label: '🚨 Botiquín SOS en el Aula', badge: 'Frases Inmediatas' },
            { id: 'instituto' as ArrivalSection, label: '🏫 Supervivencia 3º ESO', badge: 'Día a Día' },
            { id: 'jerga' as ArrivalSection, label: '🗣️ Jerga del Patio (14 Años)', badge: 'Chavales' },
            { id: 'notas' as ArrivalSection, label: '📊 Notas 1 a 10 & LOMLOE', badge: 'Simulador' },
            { id: 'falsos_amigos' as ArrivalSection, label: '🛡️ Radar Antivergüenza', badge: 'Trampas PT-ES' },
            { id: 'tradiciones' as ArrivalSection, label: '🌟 Cultura, Música & Fiestas', badge: 'Sant Jordi' }
          ].map((tab) => {
            const isSelected = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playSoundSuccess();
                  setActiveSection(tab.id);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-violet-600/30 border-violet-400 text-white shadow-lg shadow-violet-600/25'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 border-white/[0.06]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                  isSelected ? 'bg-violet-500/40 text-violet-100' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: SOS BOTIQUÍN EN CLASE */}
      {activeSection === 'sos' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold">
                🚨
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">Botiquín SOS: Frases para el Aula sin Vergüenza</h3>
                <p className="text-xs text-slate-300">
                  Pulsa el botón de audio para escuchar cómo se dice en Castellano y Catalán antes de hablar con tu profesor o compañeros.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {sosPhrases.map((phrase) => (
              <div
                key={phrase.id}
                className="p-4 rounded-2xl bg-[#0c0d18] border border-white/[0.08] hover:border-violet-500/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{phrase.title}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-950/60 text-violet-300 border border-violet-500/30">
                    {phrase.tag}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Castellano */}
                  <div className="p-2.5 rounded-xl bg-[#06070a] border border-white/[0.06] flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-violet-400 block">🇪🇸 Castellano:</span>
                      <span className="text-white font-medium">"{phrase.es}"</span>
                    </div>
                    <button
                      onClick={() => handleSpeak(phrase.es, 'es')}
                      className="p-1.5 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 text-violet-200 border border-violet-500/40 shrink-0"
                      title="Escuchar en español"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Catalán */}
                  <div className="p-2.5 rounded-xl bg-[#06070a] border border-white/[0.06] flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 block">🎗️ Català:</span>
                      <span className="text-amber-100 font-medium">"{phrase.ca}"</span>
                    </div>
                    <button
                      onClick={() => handleSpeak(phrase.ca, 'ca')}
                      className="p-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 shrink-0"
                      title="Escuchar en catalán"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Português de Brasil */}
                  <div className="text-[11px] text-slate-400 px-1">
                    <span className="text-emerald-400 font-semibold">🇧🇷 Em português: </span>
                    <span>"{phrase.pt}"</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.06] text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span className="text-violet-400 font-bold">💡 Cuándo usarla:</span>
                  <span>{phrase.situation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: INSTITUTO SURVIVAL GUIDE */}
      {activeSection === 'instituto' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 flex items-center gap-3">
            <School className="w-6 h-6 text-indigo-400 shrink-0" />
            <div>
              <h3 className="text-sm font-black text-white">Manual de Supervivencia: Cómo Funciona un Instituto de Secundaria en España</h3>
              <p className="text-xs text-slate-300">
                Las 6 reglas de oro que todo alumno recién llegado necesita saber sobre los horarios, el recreo, los profesores y las taquillas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schoolRules.map((rule, idx) => {
              const Icon = rule.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#0c0d18] border border-white/[0.08] space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-violet-950/60 border border-violet-500/40 text-violet-300 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-violet-400" />
                    </div>
                    <h4 className="text-sm font-black text-white">{rule.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{rule.content}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#06070a] border border-white/[0.06] text-xs space-y-1">
                    <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                      <span>💡 Consejo Práctico para Danilo:</span>
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{rule.tip}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: YOUTH SLANG DICTIONARY */}
      {activeSection === 'jerga' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-cyan-400 shrink-0" />
            <div>
              <h3 className="text-sm font-black text-white">El Código Secreto del Patio: Jerga Juvenil a los 14 Años en España</h3>
              <p className="text-xs text-slate-300">
                Las expresiones que escucharás en el recreo de los chicos y chicas de tu clase, con su equivalencia exacta en gírias brasileñas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {youthSlang.map((slang, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#0c0d18] border border-white/[0.08] hover:border-cyan-500/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-white tracking-wide">
                    "{slang.word}"
                  </span>
                  <button
                    onClick={() => handleSpeak(slang.audio, 'es')}
                    className="p-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-400/30 flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Escuchar</span>
                  </button>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#06070a] border border-white/[0.06] space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Qué significa en España:</span>
                    <p className="text-slate-200">{slang.esMeaning}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">🇧🇷 Como se diz no Brasil:</span>
                    <p className="text-emerald-200 font-semibold">{slang.ptEquivalent}</p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 italic pt-1 border-t border-white/[0.06]">
                  💬 Ejemplo: "{slang.example}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: LOMLOE GRADES & SIMULATOR */}
      {activeSection === 'notas' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center gap-3">
            <Award className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <h3 className="text-sm font-black text-white">Cómo Funcionan las Notas en España (Escala 1 al 10) y la Ley LOMLOE</h3>
              <p className="text-xs text-slate-300">
                En España la nota mínima para aprobar es un 5.0. Entiende la escala oficial y prueba el simulador interactivo de calificaciones.
              </p>
            </div>
          </div>

          {/* Grade Scales Table */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 space-y-1">
              <span className="text-xs font-black text-rose-300">1.0 a 4.9</span>
              <div className="text-sm font-black text-white">Insuficiente (IN)</div>
              <p className="text-[10px] text-rose-300/80">Suspenso ❌ (Reprovado)</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-1">
              <span className="text-xs font-black text-amber-300">5.0 a 5.9</span>
              <div className="text-sm font-black text-white">Suficiente (SU)</div>
              <p className="text-[10px] text-amber-300/80">Aprobado justo ⚠️</p>
            </div>
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-1">
              <span className="text-xs font-black text-cyan-300">6.0 a 6.9</span>
              <div className="text-sm font-black text-white">Bien (BI)</div>
              <p className="text-[10px] text-cyan-300/80">Aprobado solvente ✅</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/40 space-y-1">
              <span className="text-xs font-black text-blue-300">7.0 a 8.9</span>
              <div className="text-sm font-black text-white">Notable (NT)</div>
              <p className="text-[10px] text-blue-300/80">Gran calificación 🌟</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1 col-span-2 sm:col-span-1">
              <span className="text-xs font-black text-emerald-300">9.0 a 10.0</span>
              <div className="text-sm font-black text-white">Sobresaliente (SB)</div>
              <p className="text-[10px] text-emerald-300/80">Matrícula de Honor 🏆</p>
            </div>
          </div>

          {/* Interactive LOMLOE Simulator */}
          <div className="astra-card p-6 border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-violet-400" />
                <h4 className="text-sm font-black text-white">Simulador LOMLOE de Promoción para 3º de ESO</h4>
              </div>
              <span className="text-[11px] text-slate-400">Prueba cómo influyen tus notas</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { key: 'mates', label: 'Matemáticas 3º ESO', core: true },
                { key: 'lengua', label: 'Lengua Castellana', core: true },
                { key: 'catalan', label: 'Llengua Catalana', core: false },
                { key: 'ciencias', label: 'Biología y Geología', core: false },
                { key: 'ingles', label: 'Lengua Inglesa (B1)', core: false },
                { key: 'geografia', label: 'Geografía e Historia', core: false }
              ].map((subj) => (
                <div key={subj.key} className="p-3 rounded-xl bg-[#06070a] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{subj.label}</span>
                    <span className={`font-mono font-black ${
                      grades[subj.key] >= 5.0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {grades[subj.key].toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="10.0"
                    step="0.5"
                    value={grades[subj.key]}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setGrades(prev => ({ ...prev, [subj.key]: val }));
                    }}
                    className="w-full accent-violet-500 cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>1.0</span>
                    <span className="text-slate-400 font-semibold">
                      {subj.core ? 'Materia Troncal Clave' : 'Asignatura Ordinaria'}
                    </span>
                    <span>10.0</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Verdict Box */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${lomloeStatus.statusClass}`}>
              {lomloeStatus.passes ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs space-y-1">
                <div className="font-black text-white">
                  {lomloeStatus.passes ? 'Estado: PROMOCIÓN APROBADA A 4º ESO' : 'Estado: EN RIESGO DE REPETICIÓN'}
                </div>
                <p className="leading-relaxed text-slate-200">{lomloeStatus.message}</p>
                <div className="text-[11px] pt-1 text-slate-400">
                  Total de materias suspensas simuladas: <strong>{lomloeStatus.failedCount} de 6</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: FALSE FRIENDS RADAR */}
      {activeSection === 'falsos_amigos' && (
        <div className="astra-card p-6 border border-white/[0.08] space-y-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Escudo Antivergüenza de Lenguas</span>
              </div>
              <h3 className="text-xl font-black text-white mt-1">
                Radar de Falsos Amigos Críticos (PT ➔ ES ➔ CA)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Palabras que parecen inocentes en portugués pero que pueden provocar risas o malentendidos en España si las dices en el aula.
              </p>
            </div>

            <input
              type="text"
              placeholder="Buscar palabra en PT o ES..."
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#06070a] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 w-full md:w-64"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FALSE_FRIENDS.filter(ff =>
              ff.pt.toLowerCase().includes(searchWord.toLowerCase()) ||
              ff.correctEs.toLowerCase().includes(searchWord.toLowerCase()) ||
              ff.ca.toLowerCase().includes(searchWord.toLowerCase())
            ).map((ff, idx) => (
              <div
                key={idx}
                onClick={() => {
                  playSoundTone(520, 0.03, 'sine', 0.08);
                  setSelectedFalseFriend(ff);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  selectedFalseFriend.pt === ff.pt
                    ? 'bg-violet-950/40 border-violet-400 shadow-md'
                    : 'bg-slate-900/40 border-white/[0.08] hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white text-sm">🇧🇷 {ff.pt}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30">
                    Trampa: {ff.trap}
                  </span>
                </div>
                <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <span>✅ Correcto en ES:</span>
                  <span>{ff.correctEs}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-white/[0.06]">
                  <span>🎗️ Català: <strong className="text-slate-200">{ff.ca}</strong></span>
                  <span>🇬🇧 EN: <strong className="text-slate-200">{ff.en}</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Selected False Friend Deep Dive */}
          {selectedFalseFriend && (
            <div className="p-4 rounded-xl bg-[#06070a] border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1 text-xs">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>🇧🇷 "{selectedFalseFriend.pt}"</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-emerald-400">🇪🇸 "{selectedFalseFriend.correctEs}"</span>
                </div>
                <p className="text-slate-300">{selectedFalseFriend.example}</p>
                <p className="text-amber-300 text-[11px]">
                  ⚠️ <strong>Ojo con la trampa:</strong> {selectedFalseFriend.trapMeaning}
                </p>
              </div>

              <button
                onClick={() => handleSpeak(
                  `En portugués dices ${selectedFalseFriend.pt}, pero en el instituto en España se dice ${selectedFalseFriend.correctEs}. Recuerda que: ${selectedFalseFriend.trapMeaning}`,
                  'es'
                )}
                className="px-3.5 py-2 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 border border-violet-400/40"
              >
                <Volume2 className="w-4 h-4 text-violet-300" />
                <span>Pronunciar Dúo</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* SECTION 6: TRADITIONS & INTEGRATION */}
      {activeSection === 'tradiciones' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CULTURAL_GUIDES.map((guide) => (
              <div
                key={guide.id}
                onClick={() => {
                  playSoundTone(480, 0.03, 'sine', 0.08);
                  setActiveGuide(guide);
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 flex flex-col justify-between ${
                  activeGuide.id === guide.id
                    ? 'bg-[#0e0f1e] border-violet-500/60 shadow-lg shadow-violet-600/10'
                    : 'bg-[#0c0d18] border-white/[0.08] hover:border-white/20 hover:bg-slate-900/60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">
                      {guide.category === 'vida_diaria' ? '⏰' :
                       guide.category === 'lenguaje_instituto' ? '💬' :
                       guide.category === 'musica_baile' ? '🎸' :
                       guide.category === 'fiestas_tradiciones' ? '🌹' : '🤝'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase font-mono">
                      {guide.category.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base leading-snug">{guide.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{guide.description}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#06070a] border border-white/[0.06] space-y-1.5 text-xs">
                  <div className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                    <span>💡 Consejo Danilo:</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-2">
                    {guide.daniloTip}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {guide.tags.map(t => (
                      <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                  {guide.audioPhrase && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(guide.audioPhrase!, 'es');
                      }}
                      className="p-1.5 rounded-lg bg-violet-950/60 hover:bg-violet-900 text-violet-300 border border-violet-500/30"
                      title="Escuchar frase modelo"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Spotlight on Selected Cultural Guide */}
          {activeGuide && (
            <div className="astra-card p-6 border border-white/[0.08] space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div>
                  <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                    Detalle de Convivencia y Acogida
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">{activeGuide.title}</h3>
                </div>
                {activeGuide.audioPhrase && (
                  <button
                    onClick={() => handleSpeak(`${activeGuide.title}. ${activeGuide.spainHabit}. En Brasil: ${activeGuide.brazilComparison}. Consejo: ${activeGuide.daniloTip}`, 'es')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-600/30 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Escuchar Guía Completa</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.08] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-violet-300">
                    <span>🇪🇸 En España & Cataluña:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeGuide.spainHabit}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <span>🇧🇷 Paralelismo con Brasil:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeGuide.brazilComparison}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-violet-950/40 via-[#0c0d18] to-transparent border border-violet-500/30 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-white">Consejo Especial de Belentani para Danilo:</div>
                  <p className="text-slate-300 leading-relaxed">{activeGuide.daniloTip}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

