import React, { useState } from 'react';
import { EduWord } from './EduWord';
import { EduExcel } from './EduExcel';
import { EduSlides } from './EduSlides';
import { FileText, Table, Presentation, Sparkles } from 'lucide-react';
import { playSoundSuccess, playSoundTone } from '../utils/speech';

export const EduOfficeSuite: React.FC = () => {
  const [activeApp, setActiveApp] = useState<'word' | 'excel' | 'slides'>('word');

  const handleSwitchApp = (app: 'word' | 'excel' | 'slides') => {
    playSoundTone(520, 0.04, 'sine', 0.1);
    setActiveApp(app);
  };

  return (
    <div className="space-y-4">
      {/* Astra AI Top Navigation Bar for Office Suite */}
      <div className="astra-card p-3 border border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-950/50 border border-violet-500/30 text-violet-300 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>EduOffice Pack · Danilo 3º ESO</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSwitchApp('word')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeApp === 'word'
                  ? 'bg-violet-600/30 border-violet-400 text-white shadow-lg shadow-violet-600/20'
                  : 'bg-slate-900/50 border-white/[0.06] text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-violet-400" />
              <span>EduWord (Redactor & Tutor PT-ES)</span>
            </button>

            <button
              onClick={() => handleSwitchApp('excel')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeApp === 'excel'
                  ? 'bg-emerald-600/30 border-emerald-400 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-slate-900/50 border-white/[0.06] text-slate-400 hover:text-white'
              }`}
            >
              <Table className="w-4 h-4 text-emerald-400" />
              <span>EduExcel & Google Sheets (Hojas & Notas LOMLOE)</span>
            </button>

            <button
              onClick={() => handleSwitchApp('slides')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeApp === 'slides'
                  ? 'bg-amber-600/30 border-amber-400 text-white shadow-lg shadow-amber-600/20'
                  : 'bg-slate-900/50 border-white/[0.06] text-slate-400 hover:text-white'
              }`}
            >
              <Presentation className="w-4 h-4 text-amber-400" />
              <span>EduSlides (Presentaciones Orales)</span>
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono hidden md:block">
          Auto-guardado en almacenamiento seguro local
        </div>
      </div>

      {/* Embedded Active Application with A4 / Canvas Height */}
      <div className="min-h-[720px]">
        {activeApp === 'word' && <EduWord />}
        {activeApp === 'excel' && <EduExcel />}
        {activeApp === 'slides' && <EduSlides />}
      </div>
    </div>
  );
};
