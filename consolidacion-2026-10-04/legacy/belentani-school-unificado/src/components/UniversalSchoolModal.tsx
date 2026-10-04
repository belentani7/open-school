import React, { useState, useEffect } from 'react';
import { 
  Globe, Sparkles, User, GraduationCap, CheckCircle2, 
  Database, Cloud, BookOpen, Layers, Award, Shield, Save, X 
} from 'lucide-react';
import { syncStudentProfile, StudentProfileData } from '../services/schoolFirestore';
import { playSoundSuccess } from '../utils/speech';

interface UniversalSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudent: StudentProfileData;
  onUpdateStudent: (student: StudentProfileData) => void;
}

export const UniversalSchoolModal: React.FC<UniversalSchoolModalProps> = ({
  isOpen,
  onClose,
  currentStudent,
  onUpdateStudent
}) => {
  const [name, setName] = useState(currentStudent.displayName);
  const [grade, setGrade] = useState(currentStudent.selectedGrade);
  const [nativeLang, setNativeLang] = useState(currentStudent.nativeLanguage);
  const [country, setCountry] = useState(currentStudent.country || 'España / Brasil');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setName(currentStudent.displayName);
    setGrade(currentStudent.selectedGrade);
    setNativeLang(currentStudent.nativeLanguage);
    setCountry(currentStudent.country || 'España / Brasil');
  }, [currentStudent]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    const updated: StudentProfileData = {
      ...currentStudent,
      displayName: name,
      selectedGrade: grade,
      nativeLanguage: nativeLang,
      country
    };

    await syncStudentProfile(updated);
    onUpdateStudent(updated);
    playSoundSuccess();
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const presetProfiles = [
    {
      label: '⭐ William Danilo (Estudiante Estrella)',
      name: 'William Danilo',
      grade: '3eso',
      nativeLang: 'pt',
      country: 'Brasil 🇧🇷 ➔ España & Catalunya 🇪🇸',
      note: 'Perfil adaptado con puentes lingüísticos PT-ES-CA'
    },
    {
      label: '🌍 Estudiante Universal ESO (España)',
      name: 'Estudiante Abierto',
      grade: '3eso',
      nativeLang: 'es',
      country: 'España 🇪🇸',
      note: 'Plan de estudios general de Secundaria Obligatoria'
    },
    {
      label: '🎓 Itinerario Bachillerato / PAU Universidad',
      name: 'Estudiante Bachillerato',
      grade: '2bach',
      nativeLang: 'es',
      country: 'Global / Internacional',
      note: 'Preparación intensiva para exámenes de acceso universitario'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="astra-card max-w-2xl w-full rounded-2xl p-6 border border-slate-800 shadow-2xl relative space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full astra-pill-badge text-cyan-300 text-xs">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>La Mayor Escuela Abierta del Mundo · Belentani Universal</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight font-display flex items-center gap-2">
            <span>Configuración de Estudiante Global</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono">
              Cloud SQL / Firestore Active
            </span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Belentani School está diseñada tanto para acompañar a <strong>William Danilo</strong> en su adaptación de Brasil a España, como para ser una <strong>plataforma de educación abierta universal</strong> accesible para cualquier estudiante del mundo.
          </p>
        </div>

        {/* Preset switchers */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Perfiles Rápidos Predefinidos:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {presetProfiles.map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  setName(p.name);
                  setGrade(p.grade);
                  setNativeLang(p.nativeLang);
                  setCountry(p.country);
                  playSoundSuccess();
                }}
                className="p-3 rounded-xl border border-slate-800 hover:border-cyan-500/40 bg-slate-900/60 hover:bg-slate-800/80 text-left transition-all space-y-1 group"
              >
                <div className="text-xs font-bold text-white group-hover:text-cyan-300">{p.label}</div>
                <div className="text-[10px] text-slate-400 leading-snug">{p.note}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Customization Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Nombre del Estudiante:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
              placeholder="Nombre del estudiante..."
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Nivel Curricular / Grado:</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="1eso">1º ESO (12-13 años) - Fundamentos</option>
              <option value="2eso">2º ESO (13-14 años) - Consolidación</option>
              <option value="3eso">3º ESO (14 años) - ⭐ Nivel Actual</option>
              <option value="4eso">4º ESO (15-16 años) - Graduado ESO</option>
              <option value="1bach">1º Bachillerato (16-17 años) - Preparación</option>
              <option value="2bach">2º Bach / PAU (17-18 años) - Acceso Universidad</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Idioma Materno de Apoyo:</label>
            <select
              value={nativeLang}
              onChange={(e) => setNativeLang(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="pt">Português do Brasil 🇧🇷 (Puentes de transferencia)</option>
              <option value="es">Castellano / Español 🇪🇸</option>
              <option value="ca">Català / Valencià 🏛️</option>
              <option value="en">English 🇬🇧</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Ubicación / País:</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
              placeholder="País o región..."
            />
          </div>
        </div>

        {/* Database Status Cloud Box */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="font-bold text-slate-200">Cloud Persistence Activa</span>
              <span className="text-slate-500 text-[11px] block">
                Región europe-west2 · Proyecto gen-lang-client-0691970412
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Sincronizado</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cerrar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl astra-btn-primary font-bold text-xs shadow-lg"
          >
            {isSaving ? (
              <span>Sincronizando con la Nube...</span>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>¡Perfil Guardado!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar y Aplicar al Aula</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
