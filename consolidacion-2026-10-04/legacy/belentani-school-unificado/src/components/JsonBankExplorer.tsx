import React, { useState } from 'react';
import { ACADEMIC_MODULES, CULTURAL_GUIDES, FALSE_FRIENDS, GAMES_CATALOG } from '../data/curriculumData';
import { Code, Download, Copy, Check, FileJson, Sparkles, Terminal, Play, Zap } from 'lucide-react';
import { playSoundSuccess } from '../utils/speech';
import { EduPythonLab } from './EduPythonLab';

export const JsonBankExplorer: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'python' | 'json'>('python');
  const [copied, setCopied] = useState(false);

  // Complete structured Knowledge Bank for Belentani School
  const completeKnowledgeBank = {
    institution: "Belentani Universal Open School & Accelerated Learning",
    framework: "MIARA (Módulo Integral de Acogida y Refuerzo Académico)",
    studentProfile: {
      name: "William Danilo",
      age: 14,
      origin: "Brasil",
      nativeLanguage: "pt-BR (Portugués Brasileño)",
      targetLanguages: ["es-ES (Español L2)", "ca-ES (Català L3)", "en-US (Inglés L4)"],
      currentGrade: "3º de ESO (Educación Secundaria Obligatoria)",
      horizonGrades: ["1º ESO", "2º ESO", "3º ESO", "4º ESO", "1º Bachillerato", "2º Bachillerato / CFGS"]
    },
    pedagogicalBases: {
      affectiveFilter: "Stephen Krashen (1982) - Entorno seguro con ansiedad cero",
      linguisticTransfer: "Análisis contrastivo positivo (Jubran 2018; Lado 1957)",
      curriculumStandard: "Decret 175/2022 (Generalitat de Catalunya) y LOMLOE",
      pythonLab: "Python 3.10 Runtime con ejecución local y remota"
    },
    academicCurriculum: ACADEMIC_MODULES,
    falseFriendsDatabase: FALSE_FRIENDS,
    culturalIntegrationGuide: CULTURAL_GUIDES,
    interactiveGamesCatalog: GAMES_CATALOG,
    phoneticShield: [
      { rule: "R inicial / RR", pt: "Suave /h/ (Rato)", es: "Vibrante fuerte /r/ (Ratón)" },
      { rule: "J / G (ante e, i)", pt: "Suave /ʒ/ (Gente)", es: "Fuerte /x/ (Jirafa, Gente)" },
      { rule: "Ç (C trencada en Catalán)", pt: "Igual que cedilha (Coração)", ca: "Sorda (Plaça)" },
      { rule: "Vocales finales", pt: "Cerradas o nasales (Leite -> leitch)", es: "Abiertas y claras (Leche)" }
    ]
  };

  const jsonString = JSON.stringify(completeKnowledgeBank, null, 2);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    playSoundSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'belentani_school_knowledge_bank.json';
    a.click();
    URL.revokeObjectURL(url);
    playSoundSuccess();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="astra-card p-6 rounded-3xl relative overflow-hidden border border-slate-800 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Laboratorio de Algoritmos & Banco Curricular</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white font-display">
              Laboratorio Python 3.10 & Banco de Datos JSON
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Ejecuta código Python real para resolver problemas de matemáticas, física, biología y procesamiento lingüístico, o exporta el banco de datos curricular en JSON estructurado.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveSection('python')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'python' 
                  ? 'astra-btn-primary shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Ejecutor Python 3.10</span>
            </button>
            <button
              onClick={() => setActiveSection('json')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'json' 
                  ? 'astra-btn-primary shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileJson className="w-4 h-4" />
              <span>Banco JSON ({jsonString.length} chars)</span>
            </button>
          </div>
        </div>
      </div>

      {activeSection === 'python' ? (
        // EMBEDDED PYTHON LAB
        <EduPythonLab />
      ) : (
        // JSON EXPLORER
        <div className="astra-card p-6 rounded-3xl space-y-4 border border-slate-800 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
              <Code className="w-4 h-4 text-cyan-400" />
              <span>belentani_school_knowledge_bank.json</span>
              <span className="text-[10px] text-slate-500 font-normal">
                ({(jsonString.length / 1024).toFixed(1)} KB)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(jsonString)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{copied ? 'Copiado' : 'Copiar JSON'}</span>
              </button>

              <button
                onClick={handleDownloadJson}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl astra-btn-primary text-white text-xs font-bold shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Archivo</span>
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-2xl bg-black/80 border border-slate-800 text-xs font-mono text-cyan-200/90 overflow-x-auto max-h-[520px] leading-relaxed select-all">
            {jsonString}
          </pre>
        </div>
      )}
    </div>
  );
};
