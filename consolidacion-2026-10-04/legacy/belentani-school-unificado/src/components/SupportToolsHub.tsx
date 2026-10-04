import React, { useState } from 'react';
import { 
  FileText, 
  Table, 
  Presentation, 
  Terminal, 
  Tv, 
  Mic, 
  Palette, 
  ShieldCheck, 
  Gamepad2, 
  FolderOpen,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { EduOfficeSuite } from './EduOfficeSuite';
import { EduTube } from './EduTube';
import { AudioTranscriber } from './AudioTranscriber';
import { CreativeStudio } from './CreativeStudio';
import { ParentalShield } from './ParentalShield';
import { JsonBankExplorer } from './JsonBankExplorer';
import { ArcadeCenter } from './ArcadeCenter';
import { AstraResearchHub } from './AstraResearchHub';
import { ParentalSettings } from '../types';

interface SupportToolsHubProps {
  parentalSettings: ParentalSettings;
  onUpdateParentalSettings: (settings: ParentalSettings) => void;
}

type SupportToolId = 'office' | 'research' | 'python' | 'edutube' | 'transcribe' | 'creative' | 'parental' | 'arcade';

export const SupportToolsHub: React.FC<SupportToolsHubProps> = ({
  parentalSettings,
  onUpdateParentalSettings
}) => {
  const [activeTool, setActiveTool] = useState<SupportToolId>('office');

  const tools = [
    {
      id: 'office' as SupportToolId,
      name: 'EduOffice Pack & Google Sheets',
      desc: 'Procesador de textos, conexión con Google Sheets y presentaciones para clase.',
      icon: '💼',
      badge: 'Word · Google Sheets · Slides'
    },
    {
      id: 'research' as SupportToolId,
      name: 'Investigación & Mapas',
      desc: 'Búsqueda en tiempo real con Google Search y mapas de institutos y bibliotecas.',
      icon: '🌐',
      badge: 'Gemini Grounding'
    },
    {
      id: 'python' as SupportToolId,
      name: 'Omega Python & Open Data',
      desc: 'Cálculo simbólico con SymPy, datasets abiertos del INE, Eurostat y Khan.',
      icon: '🐍',
      badge: 'SymPy 3º ESO'
    },
    {
      id: 'edutube' as SupportToolId,
      name: 'EduTube Aula',
      desc: 'Vídeos educativos seleccionados y explicaciones audiovisuales sin distracciones.',
      icon: '📺',
      badge: 'Vídeos Seguros'
    },
    {
      id: 'transcribe' as SupportToolId,
      name: 'Transcriptor de Audio',
      desc: 'Dictado por voz, transcripción de apuntes del profesor y notas de clase.',
      icon: '📝',
      badge: 'Dictado y Repaso'
    },
    {
      id: 'creative' as SupportToolId,
      name: 'Taller Creativo & Musical',
      desc: 'Generación de diagramas, mapas conceptuales y música para estudiar.',
      icon: '🎨',
      badge: 'Creatividad'
    },
    {
      id: 'parental' as SupportToolId,
      name: 'Control & Salud Visual',
      desc: 'Regla 20-20-20, tiempo máximo de pantalla y blindaje de navegación.',
      icon: '🛡️',
      badge: 'Protección Menor'
    },
    {
      id: 'arcade' as SupportToolId,
      name: 'Arcade Belentani',
      desc: 'Biblioteca de minijuegos educativos clásicos como recompensa de concentración.',
      icon: '🎮',
      badge: '500+ Minijuegos'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Hub Card */}
      <div className="astra-card p-5 sm:p-6 rounded-2xl border border-white/[0.08] bg-gradient-to-r from-[#0c0d1a] via-[#090a14] to-[#06070c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[11px] font-black uppercase tracking-wider border border-violet-500/30">
              🧰 CAJA DE HERRAMIENTAS INTEGRADAS
            </span>
            <span className="text-xs text-slate-400">Capacidades de apoyo escolar</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Herramientas y Recursos de Estudio
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Todas las utilidades complementarias para tus tareas y proyectos de 3º de ESO en un solo lugar organizado, sin desviar tu atención de las clases.
          </p>
        </div>

        {/* Selected Tool Pill indicator */}
        <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/[0.06] text-xs text-slate-300 shrink-0">
          Herramienta activa: <strong className="text-violet-300">{tools.find(t => t.id === activeTool)?.name}</strong>
        </div>
      </div>

      {/* Horizontal Tool Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {tools.map((t) => {
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                isActive
                  ? 'bg-violet-950/50 border-violet-500/60 shadow-lg shadow-violet-950/30 text-white'
                  : 'bg-[#080912] hover:bg-slate-900/60 border-white/[0.06] text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{t.icon}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                )}
              </div>
              <div>
                <div className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                  {t.name}
                </div>
                <div className="text-[10px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                  {t.badge}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Embedded Tool Viewport */}
      <div className="transition-all">
        {activeTool === 'office' && <EduOfficeSuite />}
        {activeTool === 'research' && <AstraResearchHub />}
        {activeTool === 'python' && <JsonBankExplorer />}
        {activeTool === 'edutube' && <EduTube />}
        {activeTool === 'transcribe' && <AudioTranscriber />}
        {activeTool === 'creative' && <CreativeStudio />}
        {activeTool === 'parental' && (
          <ParentalShield
            settings={parentalSettings}
            onUpdateSettings={onUpdateParentalSettings}
          />
        )}
        {activeTool === 'arcade' && <ArcadeCenter />}
      </div>
    </div>
  );
};
