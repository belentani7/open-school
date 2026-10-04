import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Calculator, 
  Save, 
  Download, 
  Sparkles, 
  Check, 
  RefreshCw, 
  ExternalLink, 
  Plus, 
  FolderOpen, 
  LogIn, 
  LogOut, 
  AlertCircle, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock,
  Copy
} from 'lucide-react';
import { playSoundSuccess, playSoundTone, playSoundError } from '../utils/speech';
import { 
  signInWithGoogleWorkspace, 
  signOutWorkspace, 
  getWorkspaceAccessToken, 
  listGoogleSpreadsheets, 
  getSpreadsheetDetails, 
  getSpreadsheetValues, 
  createGoogleSpreadsheet, 
  updateSpreadsheetValues,
  initWorkspaceAuth,
  DriveSpreadsheetFile
} from '../services/googleSheets';
import { auth } from '../services/firebase';

interface SpreadsheetPreset {
  id: string;
  name: string;
  description: string;
  grid: Record<string, string>;
}

const EXCEL_PRESETS: SpreadsheetPreset[] = [
  {
    id: 'calificaciones-eso',
    name: 'Control de Notas: 3º de ESO (Ponderación LOMLOE)',
    description: 'Cálculo de medias ponderadas para matemáticas, lengua y ciencias',
    grid: {
      'A1': 'Asignatura', 'B1': 'Examen 1 (40%)', 'C1': 'Examen 2 (40%)', 'D1': 'Trabajo (20%)', 'E1': 'Nota Final',
      'A2': 'Matemáticas', 'B2': '8.5', 'C2': '9.0', 'D2': '9.5', 'E2': '=PROMEDIO(B2:D2)',
      'A3': 'Lengua Castellana', 'B3': '7.5', 'C3': '8.0', 'D3': '9.0', 'E3': '=PROMEDIO(B3:D3)',
      'A4': 'Llengua Catalana', 'B4': '7.0', 'C4': '8.5', 'D4': '9.0', 'E4': '=PROMEDIO(B4:D4)',
      'A5': 'Física y Química', 'B5': '9.0', 'C5': '8.5', 'D5': '10.0', 'E5': '=PROMEDIO(B5:D5)',
      'A6': 'Biología y Geología', 'B6': '8.0', 'C6': '8.5', 'D6': '9.0', 'E6': '=PROMEDIO(B6:D6)',
      'A7': 'Media General', 'B7': '=PROMEDIO(B2:B6)', 'C7': '=PROMEDIO(C2:C6)', 'D7': '=PROMEDIO(D2:D6)', 'E7': '=PROMEDIO(E2:E6)'
    }
  },
  {
    id: 'frecuencias-estadistica',
    name: 'Estadística 3º ESO: Tabla de Frecuencias',
    description: 'Frecuencia absoluta (fi), relativa (hi) y porcentajes (%)',
    grid: {
      'A1': 'Intervalo (Horas de Estudio)', 'B1': 'Frec. Absoluta (fi)', 'C1': 'Frec. Relativa (hi)', 'D1': 'Frec. Acumulada (Fi)', 'E1': 'Porcentaje (%)',
      'A2': '[0 - 2 horas]', 'B2': '4', 'C2': '0.16', 'D2': '4', 'E2': '16%',
      'A3': '[2 - 4 horas]', 'B3': '10', 'C3': '0.40', 'D3': '14', 'E3': '40%',
      'A4': '[4 - 6 horas]', 'B4': '8', 'C4': '0.32', 'D4': '22', 'E4': '32%',
      'A5': '[6 - 8 horas]', 'B5': '3', 'C5': '0.12', 'D5': '25', 'E5': '12%',
      'A6': 'Suma Total', 'B6': '=SUMA(B2:B5)', 'C6': '=SUMA(C2:C5)', 'D6': '25', 'E6': '100%'
    }
  },
  {
    id: 'presupuesto-escolar',
    name: 'Presupuesto: Material Escolar & Libros',
    description: 'Control de gastos para el curso en Barcelona',
    grid: {
      'A1': 'Artículo', 'B1': 'Cantidad', 'C1': 'Precio Unitario (€)', 'D1': 'Total (€)', 'E1': 'Prioridad',
      'A2': 'Calculadora Casio fx-991', 'B2': '1', 'C2': '19.90', 'D2': '19.90', 'E2': 'Alta',
      'A3': 'Cuadernos A4 Cuadriculados', 'B3': '5', 'C3': '2.20', 'D3': '11.00', 'E3': 'Alta',
      'A4': 'Juego de Regla y Compás', 'B4': '1', 'C4': '6.50', 'D4': '6.50', 'E4': 'Media',
      'A5': 'Diccionario Castellano-Catalán', 'B5': '1', 'C5': '14.50', 'D5': '14.50', 'E5': 'Alta',
      'A6': 'Total Inversión', 'B6': '=SUMA(B2:B5)', 'C6': '-', 'D6': '=SUMA(D2:D5)', 'E6': 'Presupuestado'
    }
  }
];

const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const ROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const EduExcel: React.FC = () => {
  const [activePreset, setActivePreset] = useState<SpreadsheetPreset>(EXCEL_PRESETS[0]);
  const [cells, setCells] = useState<Record<string, string>>(EXCEL_PRESETS[0].grid);
  const [selectedCell, setSelectedCell] = useState<string>('A1');
  const [formulaInput, setFormulaInput] = useState<string>(EXCEL_PRESETS[0].grid['A1'] || '');
  
  // Google Sheets integration state
  const [user, setUser] = useState<any>(auth.currentUser);
  const [accessToken, setAccessToken] = useState<string | null>(getWorkspaceAccessToken());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [activeSpreadsheetId, setActiveSpreadsheetId] = useState<string | null>(null);
  const [activeSpreadsheetUrl, setActiveSpreadsheetUrl] = useState<string | null>(null);
  const [activeSpreadsheetTitle, setActiveSpreadsheetTitle] = useState<string | null>(null);
  
  // Modal state for browsing Google Drive spreadsheets
  const [showDriveModal, setShowDriveModal] = useState<boolean>(false);
  const [driveSheets, setDriveSheets] = useState<DriveSpreadsheetFile[]>([]);
  const [loadingDriveSheets, setLoadingDriveSheets] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  useEffect(() => {
    // Listen for auth state
    const unsubscribe = initWorkspaceAuth(
      (authUser, token) => {
        setUser(authUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Simple Formula Evaluation Engine
  const evaluateCellValue = (rawVal: string | undefined): string => {
    if (!rawVal) return '';
    if (!rawVal.startsWith('=')) return rawVal;

    try {
      const expr = rawVal.substring(1).trim().toUpperCase();

      // Handle =SUMA(B2:B5) or =SUM(B2:B5)
      const sumMatch = expr.match(/^(SUMA|SUM)\(([A-G])(\d+):([A-G])(\d+)\)$/);
      if (sumMatch) {
        const colStart = sumMatch[2];
        const rowStart = parseInt(sumMatch[3], 10);
        const colEnd = sumMatch[4];
        const rowEnd = parseInt(sumMatch[5], 10);

        let sum = 0;
        for (let r = rowStart; r <= rowEnd; r++) {
          const cellKey = `${colStart}${r}`;
          const num = parseFloat(cells[cellKey] || '0');
          if (!isNaN(num)) sum += num;
        }
        return sum.toFixed(2).replace(/\.00$/, '');
      }

      // Handle =PROMEDIO(B2:B5) or =AVERAGE(B2:B5)
      const avgMatch = expr.match(/^(PROMEDIO|AVERAGE)\(([A-G])(\d+):([A-G])(\d+)\)$/);
      if (avgMatch) {
        const colStart = avgMatch[2];
        const rowStart = parseInt(avgMatch[3], 10);
        const colEnd = avgMatch[4];
        const rowEnd = parseInt(avgMatch[5], 10);

        let sum = 0;
        let count = 0;
        for (let r = rowStart; r <= rowEnd; r++) {
          const cellKey = `${colStart}${r}`;
          const num = parseFloat(cells[cellKey] || '0');
          if (!isNaN(num)) {
            sum += num;
            count++;
          }
        }
        return count > 0 ? (sum / count).toFixed(2).replace(/\.00$/, '') : '0';
      }

      // Handle basic arithmetic like =A2+B2 or =C2*1.21
      const replaced = expr.replace(/([A-G]\d+)/g, (match) => {
        const v = parseFloat(cells[match] || '0');
        return isNaN(v) ? '0' : v.toString();
      });

      // Safe arithmetic evaluator
      if (/^[0-9+\-*/().\s]+$/.test(replaced)) {
        // eslint-disable-next-line no-eval
        const result = Function(`'use strict'; return (${replaced})`)();
        if (typeof result === 'number' && !isNaN(result)) {
          return Number.isInteger(result) ? result.toString() : result.toFixed(2);
        }
      }

      return rawVal;
    } catch {
      return '#¡VALOR!';
    }
  };

  const handleCellSelect = (cellId: string) => {
    playSoundTone(480, 0.02, 'sine', 0.05);
    setSelectedCell(cellId);
    setFormulaInput(cells[cellId] || '');
  };

  const handleCellChange = (cellId: string, val: string) => {
    setCells(prev => ({ ...prev, [cellId]: val }));
  };

  const handleFormulaChange = (val: string) => {
    setFormulaInput(val);
    setCells(prev => ({ ...prev, [selectedCell]: val }));
  };

  const handleLoadPreset = (preset: SpreadsheetPreset) => {
    playSoundSuccess();
    setActivePreset(preset);
    setCells(preset.grid);
    setSelectedCell('A1');
    setFormulaInput(preset.grid['A1'] || '');
    setActiveSpreadsheetId(null);
    setActiveSpreadsheetUrl(null);
    setActiveSpreadsheetTitle(null);
    setStatusMessage(`Plantilla "${preset.name}" cargada.`);
  };

  // Google OAuth Login
  const handleGoogleLogin = async () => {
    try {
      setIsSyncing(true);
      setStatusMessage("Conectando con Google Drive & Google Sheets...");
      const res = await signInWithGoogleWorkspace();
      setUser(res.user);
      setAccessToken(res.accessToken);
      playSoundSuccess();
      setStatusMessage(`¡Conectado como ${res.user.displayName || res.user.email}!`);
    } catch (err: any) {
      console.error(err);
      playSoundError();
      setStatusMessage(`Error de conexión: ${err.message || 'Verifica permisos de popup'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleGoogleLogout = async () => {
    await signOutWorkspace();
    setUser(null);
    setAccessToken(null);
    setActiveSpreadsheetId(null);
    setActiveSpreadsheetUrl(null);
    setStatusMessage("Sesión de Google cerrada.");
  };

  // Open Drive Spreadsheets Modal
  const handleOpenDriveModal = async () => {
    if (!accessToken) {
      await handleGoogleLogin();
      return;
    }
    setShowDriveModal(true);
    setLoadingDriveSheets(true);
    try {
      const sheets = await listGoogleSpreadsheets();
      setDriveSheets(sheets);
    } catch (err: any) {
      console.error(err);
      setStatusMessage(`Error al buscar hojas: ${err.message}`);
    } finally {
      setLoadingDriveSheets(false);
    }
  };

  // Load a remote Google Sheet into the local EduExcel grid
  const handleSelectRemoteSheet = async (sheet: DriveSpreadsheetFile) => {
    try {
      setIsSyncing(true);
      setStatusMessage(`Cargando "${sheet.name}" desde Google Sheets...`);
      const details = await getSpreadsheetDetails(sheet.id);
      const firstTab = details.sheets[0]?.title || 'Hoja 1';
      const rows = await getSpreadsheetValues(sheet.id, firstTab, 'A1:G10');

      const newGrid: Record<string, string> = {};
      rows.forEach((row, rIdx) => {
        row.forEach((cellVal, cIdx) => {
          if (cIdx < COLS.length && rIdx < ROWS.length) {
            const cellKey = `${COLS[cIdx]}${ROWS[rIdx]}`;
            newGrid[cellKey] = cellVal;
          }
        });
      });

      setCells(newGrid);
      setActiveSpreadsheetId(sheet.id);
      setActiveSpreadsheetUrl(sheet.webViewLink || details.spreadsheetUrl);
      setActiveSpreadsheetTitle(sheet.name);
      setShowDriveModal(false);
      playSoundSuccess();
      setStatusMessage(`Hoja "${sheet.name}" cargada con éxito.`);
    } catch (err: any) {
      console.error(err);
      playSoundError();
      setStatusMessage(`Error al abrir hoja: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Create a brand new Google Spreadsheet with current grid
  const handleCreateNewGoogleSheet = async () => {
    if (!accessToken) {
      await handleGoogleLogin();
      return;
    }

    try {
      setIsSyncing(true);
      setStatusMessage("Creando nueva hoja en tu Google Drive...");

      // Convert grid to 2D array
      const gridValues: string[][] = [];
      ROWS.forEach(r => {
        const rowVals: string[] = [];
        COLS.forEach(c => {
          const key = `${c}${r}`;
          rowVals.push(cells[key] || '');
        });
        gridValues.push(rowVals);
      });

      const title = `Belentani ESO - ${activePreset.name} (${new Date().toLocaleDateString('es-ES')})`;
      const result = await createGoogleSpreadsheet(title, 'Hoja 1', gridValues);

      setActiveSpreadsheetId(result.spreadsheetId);
      setActiveSpreadsheetUrl(result.spreadsheetUrl);
      setActiveSpreadsheetTitle(title);
      playSoundSuccess();
      setStatusMessage(`¡Hoja creada con éxito en tu Google Drive!`);
    } catch (err: any) {
      console.error(err);
      playSoundError();
      setStatusMessage(`Error al crear en Google Sheets: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Sync current edits back to the remote Google Sheet
  const handleSyncToGoogleSheet = async () => {
    if (!activeSpreadsheetId) {
      await handleCreateNewGoogleSheet();
      return;
    }

    try {
      setIsSyncing(true);
      setStatusMessage("Guardando cambios en Google Sheets...");

      const gridValues: string[][] = [];
      ROWS.forEach(r => {
        const rowVals: string[] = [];
        COLS.forEach(c => {
          const key = `${c}${r}`;
          rowVals.push(cells[key] || '');
        });
        gridValues.push(rowVals);
      });

      await updateSpreadsheetValues(activeSpreadsheetId, 'A1:G10', gridValues);
      playSoundSuccess();
      setStatusMessage("¡Cambios guardados en Google Sheets!");
    } catch (err: any) {
      console.error(err);
      playSoundError();
      setStatusMessage(`Error al guardar: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    let csv = '';
    ROWS.forEach(r => {
      const row = COLS.map(c => `"${(cells[`${c}${r}`] || '').replace(/"/g, '""')}"`);
      csv += row.join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activePreset.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    playSoundSuccess();
    setStatusMessage("Archivo CSV descargado.");
  };

  return (
    <div className="flex flex-col h-full astra-card border border-white/[0.08] overflow-hidden text-slate-200">
      {/* Ribbon Header: Google Sheets & Presets Bar */}
      <div className="bg-[#090a14] border-b border-white/[0.08] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center font-bold text-sm shadow-md">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                {activeSpreadsheetTitle || activePreset.name}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                Google Sheets & EduExcel
              </span>
            </div>
            {activeSpreadsheetUrl && (
              <a 
                href={activeSpreadsheetUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition-colors"
              >
                <span>Abrir en Google Sheets</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Google Workspace Connection Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {user ? (
            <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-xl text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-200 font-medium truncate max-w-[140px]">
                {user.displayName || user.email}
              </span>
              <button
                onClick={handleGoogleLogout}
                title="Cerrar sesión de Google"
                className="p-1 hover:text-red-400 transition-colors text-slate-400"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Conectar Google Sheets</span>
            </button>
          )}

          {/* Drive Actions */}
          <button
            onClick={handleOpenDriveModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] text-slate-200 text-xs font-semibold transition-all cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Mis Hojas de Drive</span>
          </button>

          <button
            onClick={handleSyncToGoogleSheet}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 text-xs font-bold transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{activeSpreadsheetId ? 'Guardar en Sheets' : 'Crear en Google Sheets'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            title="Descargar CSV"
            className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] text-slate-300 text-xs"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="bg-[#07080e] border-b border-white/[0.06] px-4 py-2 flex items-center justify-between gap-3 text-xs overflow-x-auto">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-slate-400 font-medium">Plantillas de 3º ESO:</span>
          {EXCEL_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleLoadPreset(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                activePreset.id === p.id 
                  ? 'bg-emerald-600/30 border-emerald-400 text-white shadow-md' 
                  : 'bg-slate-900/60 hover:bg-slate-800 border-white/[0.06] text-slate-400'
              }`}
            >
              {p.name.split(':')[0]}
            </button>
          ))}
        </div>

        {statusMessage && (
          <div className="text-[11px] text-emerald-300 flex items-center gap-1.5 truncate">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Formula Bar with Function Helper */}
      <div className="bg-[#07080e] border-b border-white/[0.08] px-4 py-2 flex items-center gap-3 text-xs">
        <div className="font-mono font-bold text-emerald-300 bg-[#0c0d18] px-3 py-1 rounded-lg border border-white/[0.08] w-16 text-center shadow-inner">
          {selectedCell}
        </div>
        <div className="flex items-center gap-1 text-slate-400 font-serif italic text-sm">
          fx:
        </div>
        <input
          type="text"
          value={formulaInput}
          onChange={(e) => handleFormulaChange(e.target.value)}
          placeholder="Escribe un valor o fórmula (ej: =PROMEDIO(B2:D2), =SUMA(B2:B6), =B2*1.21)"
          className="flex-1 bg-[#06070a] border border-white/[0.08] rounded-lg px-3 py-1 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/50 shadow-inner"
        />
      </div>

      {/* Spreadsheet Grid */}
      <div className="flex-1 overflow-auto bg-[#06070a]/80 p-4">
        <div className="inline-block min-w-full border border-white/[0.08] rounded-xl bg-[#0c0d18] shadow-sm overflow-hidden">
          <table className="min-w-full border-collapse text-xs">
            <thead>
              <tr className="bg-[#090a14] border-b border-white/[0.08] text-slate-300">
                <th className="w-10 p-2.5 text-center border-r border-white/[0.08] font-mono text-[10px] bg-[#07080e] text-slate-500">#</th>
                {COLS.map((col) => (
                  <th key={col} className="p-2.5 text-center border-r border-white/[0.08] font-mono text-xs font-bold w-40 text-slate-300">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row} className="border-b border-white/[0.06] hover:bg-slate-900/40">
                  <td className="p-2 text-center font-mono text-[10px] text-slate-500 border-r border-white/[0.08] bg-[#07080e] font-bold select-none">
                    {row}
                  </td>
                  {COLS.map((col) => {
                    const cellId = `${col}${row}`;
                    const isSelected = selectedCell === cellId;
                    const rawVal = cells[cellId] || '';
                    const displayVal = evaluateCellValue(rawVal);
                    const isFormula = rawVal.startsWith('=');
                    const isHeaderRow = row === 1;

                    return (
                      <td
                        key={cellId}
                        onClick={() => handleCellSelect(cellId)}
                        className={`p-1 border-r border-white/[0.06] transition-colors ${
                          isSelected ? 'bg-emerald-950/40 ring-1 ring-emerald-400 z-10' : ''
                        }`}
                      >
                        <div className="relative">
                          <input
                            type="text"
                            value={isSelected ? rawVal : displayVal}
                            onChange={(e) => handleCellChange(cellId, e.target.value)}
                            className={`w-full bg-transparent border-0 focus:outline-none px-2 py-1 text-xs ${
                              isHeaderRow 
                                ? 'font-bold text-white bg-slate-900/40' 
                                : isFormula
                                ? 'text-emerald-300 font-mono font-medium'
                                : 'text-slate-200'
                            }`}
                          />
                          {isFormula && !isSelected && (
                            <span 
                              className="absolute top-0 right-1 text-[8px] text-emerald-500 font-mono select-none"
                              title={`Fórmula: ${rawVal}`}
                            >
                              fx
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pedagogical Note for Danilo */}
        <div className="mt-4 p-3.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-emerald-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <strong className="text-white">Conexión Real con Google Sheets:</strong> Puedes vincular tus hojas oficiales del instituto, calcular medias de notas LOMLOE y guardar directamente en tu Google Drive personal.
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-300">
            <span>Fórmulas automáticas: =SUMA(), =PROMEDIO()</span>
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="bg-[#090a14] border-t border-white/[0.08] px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
        <div>
          {activeSpreadsheetId ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              Sincronizado con Google Sheets ID: {activeSpreadsheetId.substring(0, 12)}...
            </span>
          ) : (
            <span>Modo Local · Guarda en Google Sheets cuando quieras</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span>Celda: <strong className="text-white font-mono">{selectedCell}</strong></span>
          <span className="text-emerald-400">● Motor Matemático: Activo</span>
        </div>
      </div>

      {/* Google Drive Spreadsheets Picker Modal */}
      {showDriveModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="astra-card w-full max-w-2xl border border-white/[0.1] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Tus Hojas de Google Drive</h3>
                  <p className="text-xs text-slate-400">Selecciona cualquier hoja de cálculo para abrirla y editarla en EduExcel</p>
                </div>
              </div>
              <button
                onClick={() => setShowDriveModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                ✕
              </button>
            </div>

            {loadingDriveSheets ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                <span className="text-xs">Consultando tus hojas en Google Drive...</span>
              </div>
            ) : driveSheets.length === 0 ? (
              <div className="py-10 text-center space-y-3">
                <p className="text-xs text-slate-400">No se encontraron hojas de cálculo en tu Google Drive o aún no has creado ninguna.</p>
                <button
                  onClick={() => {
                    setShowDriveModal(false);
                    handleCreateNewGoogleSheet();
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Crear primera hoja de cálculo en Drive
                </button>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {driveSheets.map((sheet) => (
                  <div
                    key={sheet.id}
                    className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.06] hover:border-emerald-500/40 flex items-center justify-between gap-3 transition-colors group"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <FileSpreadsheet className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div className="truncate">
                        <div className="font-bold text-xs text-white truncate">{sheet.name}</div>
                        {sheet.modifiedTime && (
                          <div className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>Modificado: {new Date(sheet.modifiedTime).toLocaleDateString('es-ES')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {sheet.webViewLink && (
                        <a
                          href={sheet.webViewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                          title="Abrir en Google Sheets oficial"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => handleSelectRemoteSheet(sheet)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        Abrir aquí
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
              <span className="text-slate-400">Total hojas encontradas: {driveSheets.length}</span>
              <button
                onClick={handleOpenDriveModal}
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Actualizar lista</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
