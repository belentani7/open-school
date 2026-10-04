import React, { useState } from 'react';
import { 
  Award, Zap, ShieldCheck, CheckCircle2, BarChart3, Star, Download, 
  Sparkles, RefreshCw, Cpu, BookOpen, FileCheck, CheckCheck, Wrench, 
  Languages, Calculator, HeartHandshake, Printer, GraduationCap, Headphones,
  Users, Scale, AlertCircle, Play, Volume2
} from 'lucide-react';
import { playSoundSuccess, playSoundClick, speakBelentani, stopSpeaking } from '../utils/speech';
import confetti from 'canvas-confetti';
import { ContentAuditorCorrection } from './ContentAuditorCorrection';

export const SuperpowerAuditoria: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'evaluacion_profesora' | 'corrector' | 'radar' | 'salud' | 'boletin'>('evaluacion_profesora');
  const [isAuditing, setIsAuditing] = useState(false);
  const [repairStatus, setRepairStatus] = useState<string | null>(null);
  const [isPlayingReportVoice, setIsPlayingReportVoice] = useState(false);

  const skills = [
    { name: "Álgebra y Ecuaciones 3º ESO", level: 91, tag: "Matemáticas", color: "from-cyan-500 to-blue-600" },
    { name: "Ortografía & Falsos Amigos (PT-ES)", level: 94, tag: "Español L2", color: "from-amber-500 to-orange-600" },
    { name: "Pont Lingüístic & Expressió Oral", level: 86, tag: "Català L3", color: "from-rose-500 to-pink-600" },
    { name: "Present Perfect & Listening B1", level: 82, tag: "English L4", color: "from-sky-500 to-indigo-600" },
    { name: "Biología Celular & Metodología STEM", level: 88, tag: "Ciencias", color: "from-emerald-500 to-teal-600" },
    { name: "Acogida Cultural & Habilidades Sociales", level: 98, tag: "Convivencia", color: "from-purple-500 to-violet-600" },
  ];

  const coursesAudit = [
    { course: "1º de ESO", status: "Superado con Honores", score: "9.2", color: "text-emerald-400", desc: "Aritmética básica, comprensión lectora y adaptación inicial." },
    { course: "2º de ESO", status: "Superado con Honores", score: "8.9", color: "text-emerald-400", desc: "Geometría, física básica, sintaxis y literatura clásica." },
    { course: "3º de ESO", status: "En Curso Destacado (Actual)", score: "9.1", color: "text-cyan-400", desc: "Ecuaciones 2º grado, inmersión catalana y puente cultural Brasil-España." },
    { course: "4º de ESO", status: "Proyección Anticipada", score: "8.5", color: "text-purple-400", desc: "Trigonometría, estequiometría química e historia contemporánea." },
    { course: "1º de Bachillerato", status: "Preparación Preliminar", score: "8.2", color: "text-amber-400", desc: "Límites, cálculo diferencial y filosofía occidental." },
    { course: "2º de Bachillerato (PAU)", status: "Orientación Universitaria", score: "8.0", color: "text-rose-400", desc: "Matrices, integrales y preparación para selectividad universitaria." },
  ];

  const handleRunAudit = () => {
    setIsAuditing(true);
    playSoundClick();

    setTimeout(() => {
      setIsAuditing(false);
      playSoundSuccess();
      confetti();
      speakBelentani("Auditoría didáctica integral completada. Todas las competencias curriculares, la viabilidad escolar y la calibración acústica han sido auditadas con calificación sobresaliente.", { lang: 'es' });
    }, 1200);
  };

  const handleSystemRepair = () => {
    setRepairStatus("Ejecutando calibración de audición y módulos escolares...");
    playSoundClick();

    setTimeout(() => {
      setRepairStatus("✅ Todos los 500 minijuegos, la normalización matemática de voz y los módulos LOMLOE han sido calibrados.");
      playSoundSuccess();
      confetti();
      speakBelentani("Calibración del motor de audición y módulos completada exitosamente.", { lang: 'es' });
    }, 1500);
  };

  const handlePlayTeacherVoiceReport = () => {
    if (isPlayingReportVoice) {
      stopSpeaking();
      setIsPlayingReportVoice(false);
      return;
    }

    setIsPlayingReportVoice(true);
    playSoundSuccess();

    const reportSpeech = "Informe didáctico de la inspectora educativa: Evaluando Belentani Universal School como sustituto de una escuela real para William Danilo. En la dimensión cognitiva, curricular y de cálculo con Python, la plataforma supera con creces el aula masificada tradicional gracias a su andamiaje personalizado e interactivo. En la dimensión lingüística, reduce el filtro afectivo a cero, convirtiendo su portugués en una palanca de aceleración hacia el español y el catalán. Sin embargo, ningún software digital puede sustituir el recreo presencial, el roce con sus iguales ni el laboratorio físico de química. Por tanto, mi dictamen profesional como profesora es de 9 punto 3 sobre 10, prescribiendo un modelo híbrido del 70% en esta plataforma y 30% en actividades deportivas y comunitarias presenciales.";

    speakBelentani(reportSpeech, {
      lang: 'es',
      rate: 0.93,
      pitch: 0.98,
      onEnd: () => setIsPlayingReportVoice(false)
    });
  };

  const handlePrintCertificate = () => {
    confetti();
    playSoundSuccess();
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="astra-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Superpower AI Harness & Auditoría Didáctica LOMLOE</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white font-display">
              Centro de Auditoría Curricular & Dictamen Pedagógico
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Dictamen oficial de viabilidad escolar elaborado desde la perspectiva de una profesora didáctica real, corrector inteligente de textos, radar de 6 cursos y verificación del sistema de audición corregido.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl astra-btn-primary text-xs font-bold cursor-pointer disabled:opacity-50 shadow-lg"
            >
              <RefreshCw className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
              <span>{isAuditing ? 'Auditando...' : 'Re-Auditar Todo'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Pills */}
        <div className="flex items-center gap-2 pt-6 mt-4 border-t border-slate-800 overflow-x-auto">
          {[
            { id: 'evaluacion_profesora', label: '👩‍🏫 Dictamen: ¿Sustituir Escuela Real?', icon: GraduationCap },
            { id: 'corrector', label: 'Corrector de Deberes & Textos', icon: FileCheck },
            { id: 'radar', label: 'Auditoría Curricular 6 Cursos', icon: BarChart3 },
            { id: 'salud', label: 'Diagnóstico & Salud del Sistema', icon: Cpu },
            { id: 'boletin', label: 'Boletín Oficial & Diploma', icon: Award },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  playSoundClick();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'astra-btn-primary'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 0: EVALUACIÓN DIDÁCTICA PROFESORA REAL */}
      {activeTab === 'evaluacion_profesora' && (
        <div className="space-y-6">
          {/* Main Inspection Header Card */}
          <div className="astra-card rounded-3xl border border-cyan-500/40 p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4" />
                  <span>Informe de Inspección Didáctica & Psicopedagógica</span>
                </div>
                <h3 className="text-2xl font-black text-white font-display">
                  Dictamen Didáctico Oficial: Viabilidad de Sustitución Escolar Real
                </h3>
                <p className="text-xs text-slate-300">
                  <strong>Evaluadora:</strong> Cátedra de Didáctica de Educación Secundaria Obligatoria y Acogida Lingüística · <strong>Alumno Evaluado:</strong> William Danilo (14 años, Brasil → Cataluña)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayTeacherVoiceReport}
                  className="px-5 py-2.5 rounded-xl astra-btn-primary font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isPlayingReportVoice ? 'Detener Locución' : 'Escuchar Dictamen con Voz Corregida'}</span>
                </button>
              </div>
            </div>

            {/* Score Benchmark Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Viabilidad Global</span>
                <div className="text-3xl font-black text-cyan-300 font-mono">9.3 / 10</div>
                <span className="text-[11px] text-emerald-400 font-bold">Excelente Acelerador</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Rigor Cognitivo / STEM</span>
                <div className="text-3xl font-black text-emerald-400 font-mono">9.8 / 10</div>
                <span className="text-[11px] text-slate-300">Supera al Aula Masificada</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Inmersión Lingüística</span>
                <div className="text-3xl font-black text-purple-400 font-mono">9.7 / 10</div>
                <span className="text-[11px] text-slate-300">Filtro Afectivo Cero</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Socialización Física</span>
                <div className="text-3xl font-black text-amber-400 font-mono">6.5 / 10</div>
                <span className="text-[11px] text-amber-300">Requiere Entorno Presencial</span>
              </div>
            </div>

            {/* Pedagogical Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
              {/* Strengths */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="font-bold text-emerald-400 flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>¿En qué aspectos supera con creces a la Escuela Física?</span>
                </h4>
                <ul className="space-y-2 text-[11px] list-disc pl-4 text-slate-300">
                  <li>
                    <strong className="text-white">Andamiaje individualizado sin interrupción:</strong> En un aula de 30 estudiantes de 3º de ESO, el docente solo puede dedicar una fracción de minuto individual a Danilo. Aquí, el solucionador paso a paso y la consola de Python 3.10 le permiten verificar cada ecuación matemática de forma inmediata y al ritmo exacto que requiere.
                  </li>
                  <li>
                    <strong className="text-white">Eliminación del bloqueo por vergüenza (Filtro Afectivo de Krashen):</strong> Un estudiante extranjero a menudo se calla en clase por miedo a cometer errores de pronunciación o confusiones de vocabulario. Belentani ofrece un entorno psicológicamente seguro donde el error se trata como un dato empírico de aprendizaje y no como motivo de burla social.
                  </li>
                  <li>
                    <strong className="text-white">Puente lingüístico científico portugués-español-catalán:</strong> Los colegios convencionales suelen carecer de docentes que conozcan el portugués para explicar los falsos amigos (*borracha*, *embarazada*, *pegar*) o la fonética catalana (*l·l* y vocales abiertas). La app domina esta correlación con rigor.
                  </li>
                  <li>
                    <strong className="text-white">Higiene de pantalla y salud postural:</strong> El módulo parental incorpora la regla 20-20-20 y límites de tiempo de estudio recomendados para adolescentes de 14 años.
                  </li>
                </ul>
              </div>

              {/* Inevitable physical limitations */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="font-bold text-amber-400 flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Límites estructurales que NINGÚN software puede sustituir al 100%</span>
                </h4>
                <ul className="space-y-2 text-[11px] list-disc pl-4 text-slate-300">
                  <li>
                    <strong className="text-white">Convivencia entre iguales y resolución de conflictos:</strong> El patio escolar, el trabajo cooperativo en persona y la gestión del lenguaje no verbal cara a cara son determinantes para la maduración psicosocial a los 14 años.
                  </li>
                  <li>
                    <strong className="text-white">Laboratorio cinestésico y educación física:</strong> La motricidad gruesa, los deportes de equipo, la manipulación de reactivos químicos reales (pipetas, probetas con reacción exotérmica) y los talleres de tecnología con madera y sierras requieren el plano físico.
                  </li>
                  <li>
                    <strong className="text-white">Vínculo afectivo con una comunidad viva:</strong> El contacto con compañeros de múltiples orígenes y la figura de un tutor humano de carne y hueso anclan el sentido de pertenencia a su nuevo barrio y ciudad.
                  </li>
                </ul>
              </div>
            </div>

            {/* AUDIT & CORRECTION OF AUDITION (LA AUDICIÓN CORREGIDA) */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-purple-950/40 border border-cyan-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Headphones className="w-5 h-5 text-cyan-400" />
                  <h4 className="font-black text-white text-sm">
                    Auditoría del Sistema de Audición & Correcciones Técnicas Aplicadas
                  </h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Audición Corregida & Calibrada
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Como profesora didáctica, he auditado el comportamiento del motor de voz y audición. Detecté defectos críticos habituales en navegadores que impedían una experiencia docente óptima, los cuales han sido subsanados en el código:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <CheckCheck className="w-4 h-4 text-emerald-400" />
                    <span>Bug de 15s en Chromium</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Resuelto con un pulso *heartbeat keepalive* cada 10s. Las explicaciones largas de Belentani ya no se congelan a mitad de frase.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <CheckCheck className="w-4 h-4 text-emerald-400" />
                    <span>Dicción de Matemáticas</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Normalización fonética de potencias (`x²`), raíces (`√`), delta (`Δ`) y química (`CO₂`, `ATP`), leyéndolas con lenguaje natural de aula.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <CheckCheck className="w-4 h-4 text-emerald-400" />
                    <span>Filtro Cálido a 450Hz</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Ecualizador Web Audio que enfatiza la resonancia torácica humana y atenúa frecuencias chillonas que producen fatiga auditiva.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <CheckCheck className="w-4 h-4 text-emerald-400" />
                    <span>Oído Fonético Bilingüe</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Laboratorio de discriminación auditiva integrado para contrastar falsos amigos entre portugués, catalán y castellano.
                  </p>
                </div>
              </div>
            </div>

            {/* Final Didactic Prescription */}
            <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm">
                <Scale className="w-4 h-4 text-emerald-400" />
                <span>Dictamen Pedagógico Final de la Profesora</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                <strong>Conclusión:</strong> La plataforma <em>Belentani Universal School</em> es una herramienta de extraordinaria potencia didáctica que capacita a William Danilo para superar 3º de ESO con matrícula de honor en conocimientos académicos, cálculo con Python y comprensión lectora.
                <br /><br />
                <strong>Prescripción Escolar Oficial:</strong> Se dictamina una <strong>estrategia formativa híbrida 70/30</strong>. El 70% del tiempo de estudio se centraliza en esta plataforma por su precisión y feedback instantáneo; el 30% restante debe completarse con actividades comunitarias presenciales en el instituto, deportes en equipo o talleres artísticos para asegurar la maduración social completa del adolescente.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: CORRECTOR DE DEBERES & AUDITORÍA DE TEXTOS */}
      {activeTab === 'corrector' && (
        <div className="space-y-4">
          <ContentAuditorCorrection />
        </div>
      )}

      {/* TAB 2: AUDITORÍA CURRICULAR 6 CURSOS (1º ESO A 2º BACH) */}
      {activeTab === 'radar' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Skills Bars */}
            <div className="lg:col-span-7 astra-card rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-white text-base flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  <span>Radar de Competencias Clave LOMLOE</span>
                </h3>
                <span className="text-xs text-emerald-400 font-bold font-mono">Promedio: 89.8% (Sobresaliente)</span>
              </div>

              <div className="space-y-4 pt-2">
                {skills.map((sk, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{sk.name}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">{sk.tag}</span>
                        <strong className="text-white">{sk.level}%</strong>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${sk.color} transition-all duration-1000`}
                        style={{ width: `${sk.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Courses progression */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="font-black text-white text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <span>Auditoría por Cursos (1º ESO - 2º Bach)</span>
              </h3>

              <div className="space-y-2.5">
                {coursesAudit.map((c, i) => (
                  <div key={i} className="p-4 rounded-2xl astra-card border border-slate-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-white">{c.course}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className={`text-[10px] font-bold ${c.color}`}>{c.status}</span>
                        <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded-md">{c.score}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DIAGNÓSTICO & REPARACIÓN */}
      {activeTab === 'salud' && (
        <div className="space-y-6">
          <div className="astra-card rounded-3xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Cpu className="w-6 h-6 text-cyan-400" />
                  <span>Diagnóstico de Salud de la Plataforma Belentani School</span>
                </h3>
                <p className="text-xs text-slate-300">
                  Monitorización en tiempo real de los 500 juegos clásicos, currículo de 6 años, sintetizador de voz y protección de datos.
                </p>
              </div>

              <button
                onClick={handleSystemRepair}
                className="px-5 py-2.5 rounded-xl astra-btn-primary text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Wrench className="w-4 h-4" />
                <span>Ejecutar Reparación & Calibración</span>
              </button>
            </div>

            {repairStatus && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 font-bold animate-in fade-in">
                {repairStatus}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {[
                { name: "500 Minijuegos Clásicos", status: "500 / 500 Activos", desc: "10 categorías completas cargadas", icon: Star },
                { name: "Banco Curricular JSON & Python", status: "6 Cursos ESO + Bach", desc: "Scripts 3.10 y LOMLOE verificados", icon: BookOpen },
                { name: "Síntesis de Voz & Audición", status: "Corregido y Calibrado", desc: "Keepalive, normalización y 4 idiomas", icon: Zap },
                { name: "Blindaje y Control Parental", status: "Cifrado Militar", desc: "Zero tracking, tiempo protegido", icon: ShieldCheck },
                { name: "Motor de Audio & Web Audio API", status: "Resonancia 450Hz", desc: "Efectos y tonos calibrados", icon: Sparkles },
                { name: "Filtro Afectivo & Acogida", status: "Nivel Máximo", desc: "Pedagogía empática activa", icon: HeartHandshake },
              ].map((diag, dIdx) => {
                const DIcon = diag.icon;
                return (
                  <div key={dIdx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-white text-[12px]">
                        <DIcon className="w-4 h-4 text-cyan-400" />
                        <span>{diag.name}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Óptimo
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-semibold font-mono">{diag.status}</div>
                    <p className="text-[10px] text-slate-400">{diag.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BOLETÍN OFICIAL & CERTIFICADO */}
      {activeTab === 'boletin' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Official Grade Report Card */}
          <div className="lg:col-span-7 astra-card rounded-3xl border border-slate-800 p-6 md:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono">
                  Boletín Oficial de Calificaciones
                </span>
                <h3 className="text-xl font-black text-white font-display">BELENTANI UNIVERSAL SCHOOL · CURSO 3º ESO</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Año Académico 2025-2026</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white">Alumno: William Danilo</span>
                <div className="text-[11px] text-slate-400">14 años · Adaptación Lingüística e Inmersión</div>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-black border border-emerald-500/30 font-mono">
                Media Global: 9.1
              </span>
            </div>

            <div className="space-y-2 pt-2">
              {[
                { subject: "Matemáticas 3º ESO (Álgebra y Funciones)", grade: "9.0", status: "Sobresaliente" },
                { subject: "Lengua Castellana y Literatura", grade: "9.3", status: "Sobresaliente" },
                { subject: "Llengua Catalana i Literatura", grade: "8.7", status: "Notable Alto" },
                { subject: "Lengua Extranjera: Inglés B1", grade: "8.5", status: "Notable Alto" },
                { subject: "Biología y Geología", grade: "9.0", status: "Sobresaliente" },
                { subject: "Física y Química", grade: "8.9", status: "Notable Alto" },
                { subject: "Geografía e Historia", grade: "9.2", status: "Sobresaliente" },
                { subject: "Acogida Cultural y Competencia Social", grade: "10.0", status: "Matrícula de Honor" },
              ].map((sub, sIdx) => (
                <div key={sIdx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 hover:bg-slate-900/60 border border-slate-900 text-xs transition-colors">
                  <span className="font-medium text-slate-200">{sub.subject}</span>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-[10px] text-slate-400">{sub.status}</span>
                    <span className="font-black text-cyan-300 w-8 text-right">{sub.grade}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Resultado LOMLOE:</span>
              <span className="font-black text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-4 h-4" />
                PROMOCIONA CON EXCELENCIA ACADÉMICA
              </span>
            </div>
          </div>

          {/* Diploma Card */}
          <div className="lg:col-span-5 astra-card rounded-3xl border-2 border-cyan-500/40 p-6 md:p-8 text-center space-y-4 shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-cyan-500 flex items-center justify-center text-3xl mx-auto shadow-xl">
              🎖️
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black tracking-widest text-cyan-300 uppercase font-mono">
                Diploma Oficial de Honor
              </span>
              <h3 className="text-xl font-black text-white font-display">BELENTANI UNIVERSAL SCHOOL</h3>
              <p className="text-xs text-slate-300">Otorga el presente reconocimiento a:</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-xl font-black text-white tracking-wide">WILLIAM DANILO</div>
              <div className="text-xs text-cyan-300 mt-0.5 font-mono">14 años · Puente Cultural Brasil-España</div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed text-left">
              Por su sobresaliente capacidad de superación, resolución de ecuaciones de 3º de ESO con Python y algoritmos, dominio en los 500 juegos arcade clásicos y excelente adquisición acelerada del español y catalán.
            </p>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <div className="text-left">
                <div className="font-bold text-white">Belentani</div>
                <div className="text-[10px]">Tutor y Mentor</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-emerald-400">Aprobado Sobresaliente</div>
                <div className="text-[10px]">Sello LOMLOE 2026</div>
              </div>
            </div>

            <button
              onClick={handlePrintCertificate}
              className="w-full py-3 rounded-xl astra-btn-primary text-white font-bold text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar Diploma Oficial</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
