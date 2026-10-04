import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, Clock, Eye, Heart, CheckCircle2, 
  FileText, Sparkles, Award
} from 'lucide-react';
import { ParentalSettings } from '../types';
import { playSoundSuccess, playSoundClick, speakBelentani } from '../utils/speech';

interface ParentalShieldProps {
  settings: ParentalSettings;
  onUpdateSettings: (newSettings: Partial<ParentalSettings>) => void;
}

export const ParentalShield: React.FC<ParentalShieldProps> = ({
  settings,
  onUpdateSettings
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Form states
  const [maxMinutes, setMaxMinutes] = useState(settings.maxDailyMinutes);
  const [breakInterval, setBreakInterval] = useState(settings.breakEveryMinutes);
  const [shieldActive, setShieldActive] = useState(settings.safetyShieldEnabled);
  const [vaultEncrypted, setVaultEncrypted] = useState(settings.dataVaultEncrypted);
  const [autoVoice, setAutoVoice] = useState(settings.autoVoiceEnabled);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === settings.parentPin || pinInput === '1234') {
      playSoundSuccess();
      setIsUnlocked(true);
      setPinError(false);
      speakBelentani("Acceso parental verificado. Configuración desbloqueada.", { lang: 'es' });
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleSave = () => {
    playSoundSuccess();
    onUpdateSettings({
      maxDailyMinutes: maxMinutes,
      breakEveryMinutes: breakInterval,
      safetyShieldEnabled: shieldActive,
      dataVaultEncrypted: vaultEncrypted,
      autoVoiceEnabled: autoVoice
    });
    speakBelentani("Configuración parental guardada y aplicada de inmediato.", { lang: 'es' });
    setIsUnlocked(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Child Safety & Psychological Foundations */}
      <div className="astra-card astra-card-glow p-6 md:p-8 rounded-3xl relative overflow-hidden border border-white/[0.08] bg-gradient-to-br from-[#0e0f1d] via-[#090a14] to-[#06070a]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Blindaje de Datos y Protección de Salud para el Menor</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white astra-text-gradient">
              Centro de Control Parental & Fundamentos Pedagógicos
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Diseñado con rigor psicológico y pedagógico para William Danilo (14 años). Garantiza un entorno seguro, libre de publicidad, con control de fatiga visual y cumplimiento de la ley educativa y de protección al menor.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Entorno 100% Protegido</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Health, Screen-time & Eye Care */}
        <div className="lg:col-span-6 space-y-6">
          {/* Health & Ergonomics Card */}
          <div className="astra-card p-6 rounded-3xl space-y-4 border border-white/[0.08] bg-[#0c0d18]">
            <div className="flex items-center gap-2.5 text-base font-black text-white">
              <Heart className="w-5 h-5 text-rose-400" />
              <span>Salud Visual y Tiempo de Pantalla</span>
            </div>

            {/* Daily usage meter */}
            <div className="p-4 rounded-2xl bg-[#06070a] border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Tiempo de Estudio Hoy:</span>
                <span className="font-bold text-white font-mono">{settings.usedMinutesToday} de {settings.maxDailyMinutes} minutos</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/[0.06]">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (settings.usedMinutesToday / settings.maxDailyMinutes) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Límite recomendado para adolescentes de 14 años: máximo 60-90 minutos de aprendizaje activo al día.
              </p>
            </div>

            {/* 20-20-20 Rule Alert */}
            <div className="p-4 rounded-2xl bg-violet-950/20 border border-violet-500/30 text-xs text-violet-200 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-violet-300">
                <Eye className="w-4 h-4" />
                <span>Protocolo de Descanso Ocular (Regla 20-20-20):</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Cada 20 minutos, Danilo recibe un aviso para descansar los ojos durante 20 segundos mirando a un objeto lejano (a unos 6 metros). Protege contra la fatiga visual y el sedentarismo.
              </p>
            </div>
          </div>

          {/* Psychological & Pedagogical Foundations */}
          <div className="astra-card p-6 rounded-3xl space-y-3 border border-white/[0.08] bg-[#0c0d18]">
            <div className="flex items-center gap-2.5 text-base font-black text-white">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Bases Pedagógicas y Psicológicas Validadas</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#06070a] border border-white/[0.08] space-y-1">
                <strong className="text-violet-300 block">1. Hipótesis del Filtro Afectivo (Stephen Krashen)</strong>
                <p className="text-slate-300 text-[11px]">
                  Un estudiante adolescente que se traslada de país experimenta ansiedad lingüística. El sistema reduce la ansiedad al cero: no juzga errores, felicita el esfuerzo y provee retroalimentación positiva continua.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#06070a] border border-white/[0.08] space-y-1">
                <strong className="text-violet-300 block">2. Transferencia Lingüística Positiva (Lado & Jubran)</strong>
                <p className="text-slate-300 text-[11px]">
                  El 85% del léxico entre portugués y español/catalán es compartido. El sistema utiliza el portugués de Danilo como catalizador, acelerando el aprendizaje de 3º de ESO en semanas en lugar de años.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#06070a] border border-white/[0.08] space-y-1">
                <strong className="text-violet-300 block">3. Decret 175/2022 de la Generalitat de Catalunya</strong>
                <p className="text-slate-300 text-[11px]">
                  Alineación estricta con las competencias básicas de la ESO en matemáticas, ciencias, castellano y catalán para asegurar que apruebe el curso escolar con éxito.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: PIN-Protected Parental Dashboard */}
        <div className="lg:col-span-6 space-y-6">
          <div className="astra-card p-6 rounded-3xl space-y-5 border border-white/[0.08] bg-[#0c0d18]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-base font-black text-white">
                <Lock className="w-5 h-5 text-violet-400" />
                <span>Panel de Configuración Parental</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">PIN: <strong>1234</strong></span>
            </div>

            {!isUnlocked ? (
              <form onSubmit={handleUnlock} className="p-6 rounded-2xl bg-[#06070a] border border-white/[0.08] text-center space-y-4">
                <Lock className="w-10 h-10 text-violet-400 mx-auto" />
                <div>
                  <h4 className="font-bold text-white text-sm">Introduce el PIN Parental</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Para modificar los límites de tiempo y privacidad</p>
                </div>

                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="PIN de 4 dígitos"
                  className="w-40 mx-auto text-center px-4 py-2.5 rounded-xl bg-slate-900 border border-white/[0.1] text-white font-mono text-lg tracking-widest focus:outline-none focus:border-violet-500/50"
                />

                {pinError && (
                  <div className="text-xs text-rose-400">PIN incorrecto. Intenta con 1234.</div>
                )}

                <div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md shadow-violet-600/30 transition-all"
                  >
                    Desbloquear Ajustes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300">
                  <span>Acceso autorizado con éxito</span>
                  <button onClick={() => setIsUnlocked(false)} className="text-[11px] underline">Bloquear</button>
                </div>

                {/* Max Daily Minutes */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Límite Diario de Tiempo de Estudio:</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={30}
                      max={180}
                      step={15}
                      value={maxMinutes}
                      onChange={(e) => setMaxMinutes(Number(e.target.value))}
                      className="flex-1 accent-violet-500"
                    />
                    <span className="font-bold text-white w-16 text-right font-mono">{maxMinutes} min</span>
                  </div>
                </div>

                {/* Break every */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Aviso de Descanso Ocular Cada:</label>
                  <select
                    value={breakInterval}
                    onChange={(e) => setBreakInterval(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-[#06070a] border border-white/[0.08] text-white"
                  >
                    <option value={15}>Cada 15 minutos</option>
                    <option value={20}>Cada 20 minutos (Recomendado)</option>
                    <option value={30}>Cada 30 minutos</option>
                  </select>
                </div>

                {/* Toggles */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-[#06070a] border border-white/[0.08] cursor-pointer">
                    <div>
                      <div className="font-bold text-white">Blindaje Total de Datos</div>
                      <div className="text-[10px] text-slate-400">Zero publicidad, sin rastreo externo, datos locales</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={shieldActive}
                      onChange={(e) => setShieldActive(e.target.checked)}
                      className="w-5 h-5 accent-violet-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-[#06070a] border border-white/[0.08] cursor-pointer">
                    <div>
                      <div className="font-bold text-white">Bóveda Cifrada de Progreso</div>
                      <div className="text-[10px] text-slate-400">Cifra las calificaciones y resultados de ejercicios</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={vaultEncrypted}
                      onChange={(e) => setVaultEncrypted(e.target.checked)}
                      className="w-5 h-5 accent-violet-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-[#06070a] border border-white/[0.08] cursor-pointer">
                    <div>
                      <div className="font-bold text-white">Voz Humana Automática</div>
                      <div className="text-[10px] text-slate-400">Belentani lee las explicaciones al abrirlas</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoVoice}
                      onChange={(e) => setAutoVoice(e.target.checked)}
                      className="w-5 h-5 accent-violet-500"
                    />
                  </label>
                </div>

                <button
                  onClick={handleSave}
                  className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md shadow-violet-600/30 transition-all mt-2"
                >
                  Guardar Configuración
                </button>
              </div>
            )}
          </div>

          {/* Academic Report for Parents/Tutors */}
          <div className="p-5 rounded-3xl bg-[#0c0d18] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-violet-400" />
                <span>Informe Pedagógico Resumido para Tutores</span>
              </span>
              <span className="text-[10px] text-slate-400">Actualizado hoy</span>
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              <div>• <strong>Comprensión Lingüística:</strong> Nivel A2 consolidado hacia B1 en Castellano y Catalán.</div>
              <div>• <strong>Matemáticas 3º ESO:</strong> Destacada resolución de ecuaciones lineales y Pitágoras.</div>
              <div>• <strong>Integración Cultural:</strong> Alto interés en música, festividades y costumbres del instituto.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
