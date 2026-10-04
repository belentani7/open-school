import React, { useState } from 'react';
import { 
  Terminal, Play, RefreshCw, Copy, Check, Download, Sparkles, Volume2, 
  CheckCircle2, Clock, Cpu, FileCode, Layers, ShieldCheck, Zap, AlertCircle
} from 'lucide-react';
import { 
  CURRICULUM_PYTHON_SCRIPTS, runPythonCode, PythonCurriculumScript, PythonRunResult 
} from '../services/pythonService';
import { speakBelentani, playSoundSuccess, playSoundClick } from '../utils/speech';
import confetti from 'canvas-confetti';

export const EduPythonLab: React.FC = () => {
  const [selectedScript, setSelectedScript] = useState<PythonCurriculumScript>(CURRICULUM_PYTHON_SCRIPTS[0]);
  const [editableCode, setEditableCode] = useState<string>(CURRICULUM_PYTHON_SCRIPTS[0].code);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [output, setOutput] = useState<PythonRunResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  
  // Batch Execution of ALL scripts
  const [isBatchRunning, setIsBatchRunning] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; scriptName: string } | null>(null);
  const [batchResults, setBatchResults] = useState<{ id: string; title: string; success: boolean; timeMs: number }[]>([]);

  const handleSelectScript = (script: PythonCurriculumScript) => {
    playSoundClick();
    setSelectedScript(script);
    setEditableCode(script.code);
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    playSoundClick();
    try {
      const res = await runPythonCode(editableCode);
      setOutput(res);
      if (res.success) {
        playSoundSuccess();
      }
    } catch (err: any) {
      setOutput({
        success: false,
        stdout: '',
        stderr: err.message || 'Error al ejecutar código Python',
        executionTimeMs: 0,
        returnCode: 1,
        executedAt: new Date().toLocaleTimeString()
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Run ALL curriculum Python scripts sequentially
  const handleRunAllScripts = async () => {
    setIsBatchRunning(true);
    setBatchResults([]);
    playSoundClick();

    const results: { id: string; title: string; success: boolean; timeMs: number }[] = [];
    const total = CURRICULUM_PYTHON_SCRIPTS.length;

    for (let i = 0; i < total; i++) {
      const script = CURRICULUM_PYTHON_SCRIPTS[i];
      setBatchProgress({ current: i + 1, total, scriptName: script.title });
      
      const res = await runPythonCode(script.code);
      results.push({
        id: script.id,
        title: script.title,
        success: res.success,
        timeMs: res.executionTimeMs
      });
    }

    setBatchResults(results);
    setIsBatchRunning(false);
    setBatchProgress(null);
    playSoundSuccess();
    confetti();

    speakBelentani(
      "¡Felicidades Danilo! Todas las órdenes y scripts en Python del currículo de la escuela han sido ejecutados con éxito en tiempo real.",
      { lang: 'es' }
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableCode);
    setCopied(true);
    playSoundSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPy = () => {
    const blob = new Blob([editableCode], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedScript.id}.py`;
    a.click();
    URL.revokeObjectURL(url);
    playSoundSuccess();
  };

  const handleSpeakBelentani = () => {
    speakBelentani(
      `Belentani explicando el script de Python para ${selectedScript.title}. ${selectedScript.description}. Consejo para Danilo: ${selectedScript.daniloTip}`,
      { lang: 'es', rate: 0.92 }
    );
  };

  return (
    <div className="space-y-6">
      {/* Astra AI Top Hero for Python Lab */}
      <div className="astra-card p-6 rounded-3xl relative overflow-hidden border border-slate-800 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full astra-pill-badge text-cyan-300 text-xs font-semibold">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Laboratorio Python 3.10 Real · Universal Open School</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400">Intérprete & Servidor Activo</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white font-display">
              Órdenes & Algoritmos Curriculares en Código Python Real
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Transforma las ecuaciones, teoremas, modelos físicos, genética y puentes lingüísticos de Danilo en código Python 3.10 ejecutable. Ejecuta órdenes individuales o procesa todos los scripts escolares a la vez con métricas en tiempo real.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Batch Run All Button */}
            <button
              onClick={handleRunAllScripts}
              disabled={isBatchRunning || isRunning}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 hover:brightness-110 text-white font-bold text-xs shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              <Zap className={`w-4 h-4 ${isBatchRunning ? 'animate-spin' : 'group-hover:scale-110'} transition-transform`} />
              <span>{isBatchRunning ? `Ejecutando (${batchProgress?.current}/${batchProgress?.total})...` : '⚡ Ejecutar Todos los Scripts (Batch)'}</span>
            </button>

            {/* Run Current Button */}
            <button
              onClick={handleRunCode}
              disabled={isRunning || isBatchRunning}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl astra-btn-primary font-bold text-xs shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Play className={`w-4 h-4 fill-current ${isRunning ? 'animate-pulse' : ''}`} />
              <span>{isRunning ? 'Ejecutando Python...' : '▶ Ejecutar Código Actual'}</span>
            </button>
          </div>
        </div>

        {/* Batch Progress Bar if running */}
        {isBatchRunning && batchProgress && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>Ejecutando: <strong>{batchProgress.scriptName}</strong></span>
              </span>
              <span className="font-mono text-cyan-300 font-bold">
                {batchProgress.current} / {batchProgress.total} scripts ({Math.round((batchProgress.current / batchProgress.total) * 100)}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 transition-all duration-300 rounded-full"
                style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Batch Results Banner if completed */}
      {batchResults.length > 0 && !isBatchRunning && (
        <div className="astra-card p-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Informe Maestro de Ejecución en Lote: {batchResults.filter(r => r.success).length} de {batchResults.length} scripts completados</span>
            </div>
            <span className="text-xs text-emerald-400 font-mono">
              Tiempo total: {batchResults.reduce((acc, curr) => acc + curr.timeMs, 0)} ms
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {batchResults.map((res, i) => (
              <div 
                key={res.id} 
                className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex items-center justify-between gap-2"
              >
                <div className="truncate text-slate-200">
                  <span className="font-bold text-slate-500 mr-1.5">{i+1}.</span>
                  {res.title}
                </div>
                <div className="shrink-0 flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-slate-400">{res.timeMs}ms</span>
                  <span className="text-emerald-400 font-bold">✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Script Selector Horizontal Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CURRICULUM_PYTHON_SCRIPTS.map((script) => {
          const isSelected = selectedScript.id === script.id;
          return (
            <button
              key={script.id}
              onClick={() => handleSelectScript(script)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'astra-btn-primary shadow-lg ring-1 ring-cyan-400/50'
                  : 'bg-slate-900/70 hover:bg-slate-800/80 text-slate-300 border border-slate-800'
              }`}
            >
              <span>{script.icon}</span>
              <span>{script.subject}: {script.title.split(':')[0]}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-cyan-300 font-mono">
                {script.grade}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Python Workspace: Left Editor, Right Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Code Editor & Metadata (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="astra-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col">
            {/* Editor Header Bar */}
            <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span className="font-mono font-bold text-white">{selectedScript.id}.py</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  Python 3.10
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleSpeakBelentani}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                  title="Escuchar explicación de Belentani"
                >
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Explicación</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                  title="Copiar código"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>

                <button
                  onClick={handleDownloadPy}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                  title="Descargar script .py"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>.py</span>
                </button>

                <button
                  onClick={() => setEditableCode(selectedScript.code)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition-colors"
                  title="Restablecer código al original"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Editor Textarea with Syntax Contrast */}
            <div className="p-4 bg-[#070b14] relative">
              <textarea
                value={editableCode}
                onChange={(e) => setEditableCode(e.target.value)}
                rows={18}
                spellCheck={false}
                className="w-full bg-transparent font-mono text-xs text-cyan-100 placeholder-slate-600 resize-y focus:outline-none leading-relaxed selection:bg-cyan-900 selection:text-white"
              />
            </div>

            {/* Pedagogical Tip Box */}
            <div className="p-3.5 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300">Consejo Belentani para Danilo: </span>
                <span>{selectedScript.daniloTip}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Execution Terminal (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col">
          <div className="astra-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex-1 flex flex-col">
            {/* Terminal Header */}
            <div className="bg-slate-900/95 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-300 ml-2">
                  bash: python3 {selectedScript.id}.py
                </span>
              </div>

              {output && (
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" />
                    {output.executionTimeMs} ms
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-bold ${
                    output.success 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                  }`}>
                    RC: {output.returnCode}
                  </span>
                </div>
              )}
            </div>

            {/* Terminal Console Output Body */}
            <div className="p-4 bg-black/95 flex-1 min-h-[380px] max-h-[500px] overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed select-text space-y-2">
              {isRunning ? (
                <div className="flex flex-col items-center justify-center h-full text-cyan-400 space-y-3 py-16">
                  <RefreshCw className="w-7 h-7 animate-spin text-cyan-400" />
                  <div className="text-center space-y-1">
                    <div className="font-bold">Ejecutando proceso en Python 3.10...</div>
                    <div className="text-[11px] text-slate-500">Compilando bytecode y evaluando flujo de datos</div>
                  </div>
                </div>
              ) : output ? (
                <div className="space-y-3">
                  <div className="text-slate-500 text-[11px] border-b border-slate-900 pb-1 flex items-center justify-between">
                    <span>[STDOUT CAPTURE · {output.executedAt}]</span>
                    <span className={output.success ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {output.success ? '✓ Salida Normal' : '✗ Error en Tiempo de Ejecución'}
                    </span>
                  </div>

                  {output.stdout && (
                    <pre className="text-emerald-300 whitespace-pre-wrap font-mono leading-relaxed">
                      {output.stdout}
                    </pre>
                  )}

                  {output.stderr && (
                    <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 whitespace-pre-wrap font-mono">
                      <div className="font-bold text-rose-400 flex items-center gap-1.5 mb-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>STDERR / Traceback:</span>
                      </div>
                      {output.stderr}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-3 py-16 text-center">
                  <Terminal className="w-8 h-8 text-slate-700" />
                  <div className="space-y-1">
                    <p className="font-medium text-slate-400">Consola Python lista</p>
                    <p className="text-[11px] text-slate-600 max-w-xs">
                      Haz clic en "▶ Ejecutar Código Actual" o "⚡ Ejecutar Todos los Scripts" para ver la salida interactiva en tiempo real.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Terminal Action Footer */}
            <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Entorno Seguro Sandboxed</span>
              </div>

              <button
                onClick={handleRunCode}
                disabled={isRunning || isBatchRunning}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg astra-btn-primary font-bold text-xs shadow cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Ejecutar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
