import React, { useState, useEffect } from 'react';
import { 
  FileText, Bold, Italic, Underline, AlignLeft, AlignCenter, 
  List, Download, Printer, Sparkles, CheckCircle2, AlertCircle, Volume2
} from 'lucide-react';
import { speakBelentani, playSoundSuccess, playSoundTone } from '../utils/speech';

const WORD_TEMPLATES = [
  {
    id: 'redaccion-llegada',
    name: 'Redacción: Mi llegada de Brasil a España',
    content: `# Mi Experiencia: De Brasil a España y Cataluña
Autor: William Danilo | 3º de ESO | Curso 2026

Al principio, llegar a un nuevo país con 14 años parece un gran desafío. Sin embargo, poco a poco me he dado cuenta de que el portugués y el español comparten más del 80% de su vocabulario.

En el instituto, los compañeros y los profesores me han acogido con amabilidad. En el recreo ('pati'), la música y el fútbol nos ayudan a entendernos sin necesidad de muchas palabras.

Mi meta este curso es obtener el título de Graduado en ESO con buenas notas en matemáticas y ciencias, aprendiendo a la vez catalán y mejorando mi inglés.`
  },
  {
    id: 'informe-ciencias',
    name: 'Informe de Laboratorio: La Célula y la Nutrición',
    content: `# Práctica de Laboratorio: Observación de Células Eucariotas
Asignatura: Biología y Geología 3º ESO | Alumno: William Danilo

1. OBJETIVO:
Identificar las estructuras principales de la célula animal y su función en la respiración celular.

2. MATERIALES:
- Microscopio óptico.
- Muestra de tejido epitelial.
- Azul de metileno.

3. CONCLUSIÓN:
Hemos observado el núcleo donde se encuentra el ADN y las mitocondrias que proporcionan energía a la célula a partir de glucosa y oxígeno.`
  },
  {
    id: 'deures-catala',
    name: 'Deures de Llengua Catalana: Presentació',
    content: `# Presentació personal a la classe de Català
Alumne: William Danilo | Institut

Bon dia a tots! Em dic William Danilo, tinc 14 anys i fa pocs mesos que he arribat del Brasil a Catalunya.

M'agrada molt la música, cantar i tocar la guitarra. Trobo que el català té molts sons semblants al portuguès, com la 'ç' i les vocals obertes. Estic molt content d'estudiar aquí!`
  }
];

// Trilingual false friends dictionary detector
const SENSITIVE_WORDS: Record<string, { tip: string; correct: string }> = {
  embarazada: { tip: 'En español "embarazada" significa grávida. En portugués avergonzado es "avergonzado / con vergüenza".', correct: 'avergonzado' },
  exquisito: { tip: 'En español "exquisito" significa delicioso (comida muy rica). En portugués raro/extraño es "raro o extraño".', correct: 'delicioso / raro' },
  propina: { tip: 'En España "propina" es la gratificación al camarero (gorjeta). En portugués soborno se dice "soborno".', correct: 'propina / soborno' },
  pegar: { tip: 'En portugués pegar es coger o agarrar. En español "pegar" significa golpear o adherir con pegamento.', correct: 'coger / agarrar' },
  oficina: { tip: 'En español "oficina" es el lugar de trabajo administrativo (escritório). En portugués oficina es "taller".', correct: 'oficina / taller' },
  aula: { tip: 'En España "aula" es la sala de clase física. La sesión educativa se llama "clase".', correct: 'aula / clase' },
  borracha: { tip: 'En español "borracha" significa ebria (que ha bebido alcohol). La goma de borrar se dice "goma de borrar".', correct: 'goma de borrar' },
  vaso: { tip: 'En español "vaso" es el recipiente de cristal para beber agua. El florero/maceta es "jarrón / maceta".', correct: 'vaso / jarrón' },
  latir: { tip: 'En español el corazón late (batir). En portugués latir es ladrar (los perros ladran).', correct: 'latir el corazón / ladrar el perro' }
};

export const EduWord: React.FC = () => {
  const [content, setContent] = useState<string>(WORD_TEMPLATES[0].content);
  const [docTitle, setDocTitle] = useState<string>('Redaccion_Danilo_Llegada.docx');
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [activeAlerts, setActiveAlerts] = useState<{ word: string; tip: string }[]>([]);

  // Calculate live statistics
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  // Real-time language helper analysis
  useEffect(() => {
    const lower = content.toLowerCase();
    const detected: { word: string; tip: string }[] = [];

    Object.keys(SENSITIVE_WORDS).forEach((w) => {
      const regex = new RegExp(`\\b${w}\\b`, 'i');
      if (regex.test(lower)) {
        detected.push({
          word: w,
          tip: SENSITIVE_WORDS[w].tip
        });
      }
    });

    setActiveAlerts(detected);
  }, [content]);

  const handleDownloadTxt = () => {
    playSoundSuccess();
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = docTitle.replace('.docx', '.txt');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSpeakDocument = () => {
    playSoundTone(520, 0.04, 'sine', 0.1);
    speakBelentani(content.slice(0, 400), { lang: 'es' });
  };

  return (
    <div className="flex flex-col h-full astra-card border border-white/[0.08] overflow-hidden text-slate-200">
      {/* Office Ribbon Header (Astra AI Dark Cosmic Ribbon) */}
      <div className="bg-[#090a14] border-b border-white/[0.08] px-4 py-2.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-950/60 border border-violet-500/40 flex items-center justify-center font-bold text-sm shadow-md">
            <FileText className="w-4 h-4 text-violet-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="bg-transparent border-b border-transparent hover:border-violet-400 focus:border-violet-400 text-sm font-semibold text-white focus:outline-none px-1 rounded transition-colors"
              />
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
                EduWord · Danilo 3º ESO
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSpeakDocument}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-950/50 hover:bg-violet-900 border border-violet-500/30 text-xs font-medium text-violet-200 transition-colors"
            title="Leer documento con voz de Belentani"
          >
            <Volume2 className="w-3.5 h-3.5 text-violet-400" />
            <span className="hidden sm:inline">Leer en Voz Alta</span>
          </button>

          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-600/30 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Guardar .txt</span>
          </button>
        </div>
      </div>

      {/* Toolbar Ribbon */}
      <div className="bg-[#07080e] border-b border-white/[0.08] px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
        <div className="flex items-center gap-1 border-r border-white/[0.08] pr-3">
          <button
            onClick={() => setIsBold(!isBold)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isBold 
                ? 'bg-violet-950/60 border-violet-400 text-white' 
                : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
            title="Negrita"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsItalic(!isItalic)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isItalic 
                ? 'bg-violet-950/60 border-violet-400 text-white' 
                : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
            title="Cursiva"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 rounded-lg border border-transparent text-slate-400 hover:bg-slate-800 hover:text-white"
            title="Subrayado"
          >
            <Underline className="w-4 h-4" />
          </button>
        </div>

        {/* Templates quick selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">Plantillas:</span>
          {WORD_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => {
                playSoundSuccess();
                setContent(tpl.content);
                setDocTitle(`${tpl.name}.docx`);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900/60 hover:bg-violet-950/50 border border-white/[0.08] hover:border-violet-500/40 text-[11px] font-medium text-slate-300 hover:text-white transition-all"
            >
              {tpl.name.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Document Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#06070a]/80 p-4 gap-4">
        {/* The Writing Canvas (Obsidian dark canvas with crisp contrast) */}
        <div className="flex-1 max-w-4xl mx-auto bg-[#090a12] rounded-xl shadow-lg border border-white/[0.08] p-8 flex flex-col overflow-y-auto">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`w-full flex-1 bg-transparent border-0 resize-none focus:outline-none text-slate-100 leading-relaxed text-sm font-sans ${
              isBold ? 'font-bold' : ''
            } ${isItalic ? 'italic' : ''}`}
            placeholder="Comienza a redactar tus deberes o apuntes escolares aquí..."
            rows={18}
          />
        </div>

        {/* Sidebar: Trilingual Assistant for Danilo */}
        <div className="w-full md:w-80 bg-[#0c0d18] rounded-xl shadow-md border border-white/[0.08] p-4 flex flex-col gap-3 overflow-y-auto">
          <div className="flex items-center gap-2 pb-2 border-b border-white/[0.08] text-violet-300 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Asistente Trilingüe de Belentani</span>
          </div>

          <div className="text-[11px] text-slate-400 leading-relaxed">
            Escribe en español o catalán con total tranquilidad. Si detectamos una palabra en portugués o un falso amigo, Belentani te avisará aquí para ayudarte a pulir tu redacción.
          </div>

          {activeAlerts.length > 0 ? (
            <div className="space-y-2 mt-1">
              <div className="flex items-center gap-1 text-amber-300 font-bold text-xs">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>{activeAlerts.length} Sugerencia(s) detectada(s):</span>
              </div>
              {activeAlerts.map((alert, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs space-y-1">
                  <div className="font-bold text-amber-300 capitalize">
                    Palabra: <span className="underline">{alert.word}</span>
                  </div>
                  <p className="text-[11px] text-amber-200 leading-normal">{alert.tip}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>¡Ortografía y redacción sin interferencias! Todo se lee de forma fluida y natural.</span>
            </div>
          )}

          {/* Quick tips for school writing */}
          <div className="mt-auto pt-3 border-t border-white/[0.08] space-y-1.5 text-[11px] text-slate-400">
            <div className="font-semibold text-slate-300">Consejos de Examen ESO:</div>
            <div>• En español los signos de interrogación se abren al principio: <strong className="text-violet-300">¿...?</strong></div>
            <div>• Solo existe el acento agudo (´), nunca el circunflejo ni la crase.</div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-[#090a14] border-t border-white/[0.08] px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-4">
          <span>Página 1 de 1</span>
          <span>{wordCount} palabras</span>
          <span>{charCount} caracteres</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Corrector Activo: Español / Català / Português</span>
        </div>
      </div>
    </div>
  );
};
