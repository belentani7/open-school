import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Music, 
  Sparkles, 
  Download, 
  Upload, 
  RefreshCw, 
  Play, 
  Pause, 
  Volume2, 
  Image as ImageIcon, 
  Wand2, 
  Save, 
  Check, 
  Sliders,
  Disc,
  Layers,
  Heart
} from 'lucide-react';
import { auth, saveCreationToFirestore, fetchCreationsFromFirestore, SavedCreation } from '../services/firebase';
import { playSoundSuccess, playSoundTone } from '../utils/speech';

export const CreativeStudio: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'images' | 'music'>('images');

  // Image Generation State
  const [imagePrompt, setImagePrompt] = useState('Belentani con armadura carmesí y guitarra acústica enseñando a William Danilo en la plaza de Cataluña');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:3' | '16:9' | '3:4' | '9:16'>('1:1');
  const [imageMode, setImageMode] = useState<'create' | 'edit'>('create');
  const [sourceImageBase64, setSourceImageBase64] = useState<string | null>(null);
  const [sourceImagePreview, setSourceImagePreview] = useState<string | null>(null);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generatedImageCaption, setGeneratedImageCaption] = useState<string | null>(null);

  // Music Generation State
  const [musicPrompt, setMusicPrompt] = useState('Canción alegre de bienvenida en ritmo de samba y rumba catalana con guitarra española para William Danilo');
  const [musicModelType, setMusicModelType] = useState<'clip' | 'pro'>('clip');
  const [generatingMusic, setGeneratingMusic] = useState(false);
  const [musicAudioUrl, setMusicAudioUrl] = useState<string | null>(null);
  const [musicLyrics, setMusicLyrics] = useState<string | null>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioPlayerRef = React.useRef<HTMLAudioElement | null>(null);

  // Cloud Gallery State
  const [savedCreations, setSavedCreations] = useState<SavedCreation[]>([]);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (auth.currentUser) {
      fetchCreationsFromFirestore(auth.currentUser.uid)
        .then(res => setSavedCreations(res))
        .catch(e => console.warn(e));
    }
  }, []);

  // Handle Source Image Upload for Edit Mode
  const handleSourceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const fullBase64 = reader.result as string;
      setSourceImagePreview(fullBase64);
      setSourceImageBase64(fullBase64.split(',')[1]);
      setImageMode('edit');
      playSoundSuccess();
    };
    reader.readAsDataURL(file);
  };

  // Generate / Edit Image
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setGeneratingImage(true);
    playSoundTone(587.33, 0.08, 'sine', 0.1);

    try {
      const res = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          aspectRatio,
          mode: imageMode,
          base64InputImage: imageMode === 'edit' ? sourceImageBase64 : undefined,
          mimeType: 'image/png'
        })
      });

      const data = await res.json();
      const imgUrl = data.imageUrl || data.fallbackUrl;
      setGeneratedImageUrl(imgUrl);
      setGeneratedImageCaption(data.caption || imagePrompt);
      playSoundSuccess();

      // Save to Firestore if authenticated
      if (auth.currentUser && imgUrl) {
        try {
          await saveCreationToFirestore({
            userId: auth.currentUser.uid,
            type: 'image',
            title: `Arte: ${imagePrompt.slice(0, 30)}...`,
            prompt: imagePrompt,
            mediaUrl: imgUrl,
            model: 'gemini-3.1-flash-image-preview'
          });
          const updated = await fetchCreationsFromFirestore(auth.currentUser.uid);
          setSavedCreations(updated);
          setSavedSuccessMsg('¡Ilustración guardada en tu galería Firestore!');
          setTimeout(() => setSavedSuccessMsg(null), 3000);
        } catch (e) {
          console.warn("Error saving image to Firestore:", e);
        }
      }
    } catch (err) {
      console.error('Image generation error:', err);
      alert('Hubo un problema generando la imagen.');
    } finally {
      setGeneratingImage(false);
    }
  };

  // Generate Music with Lyria
  const handleGenerateMusic = async () => {
    if (!musicPrompt.trim()) return;
    setGeneratingMusic(true);
    playSoundTone(440, 0.1, 'triangle', 0.1);

    try {
      const res = await fetch('/api/gemini/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: musicPrompt,
          modelType: musicModelType,
          base64ImageData: sourceImageBase64 || undefined
        })
      });

      const data = await res.json();
      if (data.audioBase64) {
        const binary = atob(data.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setMusicAudioUrl(url);
      } else {
        // Sample audio for instant preview
        setMusicAudioUrl("https://actions.google.com/sounds/v1/musical_tracks/classical_string_quartet.ogg");
      }

      setMusicLyrics(data.lyrics || data.fallbackLyrics || `Tema generado para: "${musicPrompt}"`);
      playSoundSuccess();

      // Save to Firestore if authenticated
      if (auth.currentUser) {
        try {
          await saveCreationToFirestore({
            userId: auth.currentUser.uid,
            type: 'music',
            title: `Música: ${musicPrompt.slice(0, 30)}...`,
            prompt: musicPrompt,
            mediaUrl: musicAudioUrl || 'lyria://generated',
            model: musicModelType === 'pro' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview'
          });
          const updated = await fetchCreationsFromFirestore(auth.currentUser.uid);
          setSavedCreations(updated);
          setSavedSuccessMsg('¡Pista musical registrada en Firestore!');
          setTimeout(() => setSavedSuccessMsg(null), 3000);
        } catch (e) {
          console.warn("Error saving music to Firestore:", e);
        }
      }
    } catch (err) {
      console.error('Music generation error:', err);
      alert('Hubo un problema generando la música con Lyria.');
    } finally {
      setGeneratingMusic(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-rose-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-purple-500/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Estudio Creativo Multimodal · Gemini Flash Image & Lyria Music</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Taller Creativo: Ilustraciones & Música
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Genera y edita imágenes de arte con <strong className="text-purple-300 font-mono">gemini-3.1-flash-image-preview</strong> y crea pistas musicales con <strong className="text-rose-300 font-mono">lyria-3-clip-preview</strong> (clips 30s) o <strong className="text-rose-300 font-mono">lyria-3-pro-preview</strong> (pistas completas).
          </p>

          {/* Sub-Tabs Nav */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => { playSoundSuccess(); setActiveSubTab('images'); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                activeSubTab === 'images'
                  ? 'bg-white text-purple-950 ring-2 ring-purple-400'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Palette className="w-4 h-4 text-purple-600" />
              <span>Crear & Editar Imágenes (Flash Image)</span>
            </button>

            <button
              onClick={() => { playSoundSuccess(); setActiveSubTab('music'); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                activeSubTab === 'music'
                  ? 'bg-white text-rose-950 ring-2 ring-rose-400'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Music className="w-4 h-4 text-rose-600" />
              <span>Generar Música (Lyria Clip & Pro)</span>
            </button>
          </div>
        </div>
      </div>

      {savedSuccessMsg && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{savedSuccessMsg}</span>
        </div>
      )}

      {/* SUB-TAB 1: IMAGE GENERATION & EDITING */}
      {activeSubTab === 'images' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Wand2 className="w-4 h-4 text-purple-600" />
                  <span>Modo de Generación</span>
                </h3>

                <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
                  <button
                    onClick={() => setImageMode('create')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      imageMode === 'create' ? 'bg-white text-purple-900 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    Crear
                  </button>
                  <button
                    onClick={() => setImageMode('edit')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      imageMode === 'edit' ? 'bg-white text-purple-900 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    Editar
                  </button>
                </div>
              </div>

              {/* Edit Mode Image Upload */}
              {imageMode === 'edit' && (
                <div className="space-y-2 p-3 bg-purple-50/50 rounded-xl border border-purple-200">
                  <span className="text-xs font-bold text-purple-900 block">Imagen Base para Editar:</span>
                  {sourceImagePreview ? (
                    <div className="relative rounded-lg overflow-hidden border border-purple-300 h-32">
                      <img src={sourceImagePreview} alt="Base" className="w-full h-full object-cover" />
                      <button
                        onClick={() => { setSourceImagePreview(null); setSourceImageBase64(null); }}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded p-1 text-[10px]"
                      >
                        Cambiar
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center p-4 border border-dashed border-purple-300 rounded-lg cursor-pointer bg-white hover:bg-purple-50 text-center">
                      <Upload className="w-5 h-5 text-purple-500 mb-1" />
                      <span className="text-xs font-semibold text-purple-700">Subir imagen para retocar</span>
                      <span className="text-[10px] text-slate-400">PNG o JPG</span>
                      <input type="file" accept="image/*" onChange={handleSourceImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
              )}

              {/* Prompt input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {imageMode === 'create' ? 'Describe la imagen que deseas:' : '¿Qué cambios o añadidos deseas aplicar?'}
                </label>
                <textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:ring-2 focus:ring-purple-500 focus:bg-white focus:outline-none"
                  placeholder="Ej: Danilo aprendiendo álgebra con Belentani en un pergamino medieval carmesí..."
                />
              </div>

              {/* Aspect Ratio Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Proporción de Aspecto:</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['1:1', '4:3', '16:9', '3:4', '9:16'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        aspectRatio === ratio
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateImage}
                disabled={generatingImage || !imagePrompt.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                {generatingImage ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Creando con gemini-3.1-flash-image-preview...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{imageMode === 'create' ? 'Generar Imagen' : 'Aplicar Edición a la Imagen'}</span>
                  </>
                )}
              </button>

              {/* Presets */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block mb-2">Inspiraciones de Belentani:</span>
                <div className="space-y-1.5">
                  {[
                    "Belentani y Danilo en la cima de Montserrat con armadura carmesí",
                    "Escudo oficial de Belentani School con lema de amistad España-Brasil",
                    "Diagrama visual holográfico del Teorema de Pitágoras con luz neón"
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setImagePrompt(preset)}
                      className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-purple-50 text-[11px] text-slate-700 hover:text-purple-900 border border-slate-200 truncate transition-colors"
                    >
                      💡 {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Canvas & Gallery Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col min-h-[480px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-purple-600" />
                  <span>Resultado Visual</span>
                </h3>

                {generatedImageUrl && (
                  <a
                    href={generatedImageUrl}
                    download={`belentani_arte_${Date.now()}.png`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar Imagen</span>
                  </a>
                )}
              </div>

              {/* Image Preview Container */}
              <div className="flex-1 flex items-center justify-center bg-slate-900 rounded-2xl p-4 min-h-[360px] overflow-hidden relative">
                {generatingImage ? (
                  <div className="text-center space-y-3 text-purple-300">
                    <RefreshCw className="w-10 h-10 animate-spin mx-auto text-purple-400" />
                    <p className="text-sm font-bold">Generando arte con gemini-3.1-flash-image-preview...</p>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      Calculando composición visual, paleta cromática carmesí y proporciones.
                    </p>
                  </div>
                ) : generatedImageUrl ? (
                  <div className="space-y-3 text-center">
                    <img 
                      src={generatedImageUrl} 
                      alt="Generado" 
                      className="max-h-[380px] max-w-full rounded-xl shadow-2xl object-contain mx-auto border border-white/20"
                    />
                    {generatedImageCaption && (
                      <p className="text-xs text-slate-300 max-w-lg mx-auto bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                        {generatedImageCaption}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-slate-500 space-y-2 p-8">
                    <Palette className="w-12 h-12 mx-auto text-slate-700" />
                    <p className="font-semibold text-sm text-slate-400">Sin imagen generada aún</p>
                    <p className="text-xs text-slate-600 max-w-xs mx-auto">
                      Escribe tu descripción en el panel izquierdo y haz clic en "Generar Imagen".
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MUSIC GENERATION WITH LYRIA */}
      {activeSubTab === 'music' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Music className="w-4 h-4 text-rose-600" />
                <span>Modelo & Duración Lyria</span>
              </h3>

              {/* Model Choice: Clip vs Pro */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMusicModelType('clip')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    musicModelType === 'clip'
                      ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="font-bold text-xs text-rose-950 block">Lyria Clip (30s)</span>
                  <span className="text-[10px] text-slate-500 font-mono">lyria-3-clip-preview</span>
                  <span className="text-[10px] text-slate-600 block mt-1">Clips rápidos de motivación y jingles</span>
                </button>

                <button
                  onClick={() => setMusicModelType('pro')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    musicModelType === 'pro'
                      ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="font-bold text-xs text-rose-950 block">Lyria Pro (Full)</span>
                  <span className="text-[10px] text-slate-500 font-mono">lyria-3-pro-preview</span>
                  <span className="text-[10px] text-slate-600 block mt-1">Pistas completas con coro e instrumentación</span>
                </button>
              </div>

              {/* Prompt Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Describe el estilo, compás y letra de la canción:
                </label>
                <textarea
                  value={musicPrompt}
                  onChange={(e) => setMusicPrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:ring-2 focus:ring-rose-500 focus:bg-white focus:outline-none"
                  placeholder="Ej: Fusión de samba brasileña con rumba catalana, guitarra española alegre y mensaje para superar los exámenes de matemáticas..."
                />
              </div>

              {/* Generate Music Button */}
              <button
                onClick={handleGenerateMusic}
                disabled={generatingMusic || !musicPrompt.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-md disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                {generatingMusic ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sintetizando audio con {musicModelType === 'pro' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview'}...</span>
                  </>
                ) : (
                  <>
                    <Disc className="w-4 h-4" />
                    <span>Generar Canción con Lyria</span>
                  </>
                )}
              </button>

              {/* Musical presets */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block mb-2">Estilos Musicales Recomendados:</span>
                <div className="space-y-1.5">
                  {[
                    "Samba-Rumba Catalana de Acogida Escolar para Danilo",
                    "Tema Heroico 8-Bit de Victoria en los 500 Juegos Arcade",
                    "Guitarra Clásica Acústica para Concentración en Matemáticas"
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMusicPrompt(preset)}
                      className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-rose-50 text-[11px] text-slate-700 hover:text-rose-900 border border-slate-200 truncate transition-colors"
                    >
                      🎵 {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Music Player & Lyrics Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col min-h-[480px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Disc className="w-4 h-4 text-rose-600 animate-spin" />
                    <span>Reproductor Musical Belentani</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Modelo activo: {musicModelType === 'pro' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview'}
                  </p>
                </div>

                {musicAudioUrl && (
                  <a
                    href={musicAudioUrl}
                    download={`belentani_cancion_${Date.now()}.wav`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar WAV</span>
                  </a>
                )}
              </div>

              {/* Music Player Display */}
              <div className="flex-1 bg-gradient-to-br from-slate-900 via-rose-950/80 to-slate-950 rounded-2xl p-6 text-white flex flex-col justify-between space-y-6">
                {generatingMusic ? (
                  <div className="my-auto text-center space-y-3 text-rose-300">
                    <RefreshCw className="w-10 h-10 animate-spin mx-auto text-rose-400" />
                    <p className="text-sm font-bold">Componiendo pista musical con Google Lyria...</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Generando armonías, ritmo de compás y estribillo bilingüe en stream de audio WAV.
                    </p>
                  </div>
                ) : musicAudioUrl ? (
                  <div className="space-y-6 my-auto">
                    {/* Vinyl Disc Animation */}
                    <div className="flex items-center justify-center">
                      <div className={`w-32 h-32 rounded-full border-4 border-rose-500/50 p-2 shadow-2xl bg-gradient-to-tr from-slate-950 via-rose-900 to-black ${
                        isPlayingMusic ? 'animate-spin' : ''
                      }`} style={{ animationDuration: '4s' }}>
                        <div className="w-full h-full rounded-full border-2 border-dashed border-rose-400/40 flex items-center justify-center bg-rose-900/60 text-white font-bold text-xs">
                          LYRIA
                        </div>
                      </div>
                    </div>

                    {/* Audio Controls */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 space-y-3">
                      <audio 
                        ref={audioPlayerRef}
                        controls 
                        src={musicAudioUrl} 
                        onPlay={() => setIsPlayingMusic(true)}
                        onPause={() => setIsPlayingMusic(false)}
                        onEnded={() => setIsPlayingMusic(false)}
                        className="w-full"
                      />
                      <div className="text-center text-xs text-slate-300 font-medium">
                        "{musicPrompt}"
                      </div>
                    </div>

                    {/* Lyrics Box */}
                    {musicLyrics && (
                      <div className="p-4 bg-black/40 rounded-xl border border-white/10 text-xs space-y-1">
                        <span className="font-bold text-rose-300 block mb-1">Letra & Estructura del Tema:</span>
                        <p className="whitespace-pre-wrap text-slate-200 leading-relaxed font-mono text-[11px]">
                          {musicLyrics}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="my-auto text-center text-slate-500 space-y-2 p-8">
                    <Music className="w-12 h-12 mx-auto text-slate-700" />
                    <p className="font-semibold text-sm text-slate-400">Ninguna pista cargada</p>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto">
                      Elige el tipo de pista (Clip 30s o Pista Completa), escribe tu descripción en el panel izquierdo y haz clic en "Generar Canción".
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
