import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Upload, 
  FileAudio, 
  RefreshCw, 
  Copy, 
  Check, 
  Save, 
  Sparkles, 
  FileText, 
  Languages, 
  Clock, 
  Play, 
  Square,
  Share2,
  Bookmark
} from 'lucide-react';
import { auth, saveTranscriptionToFirestore, fetchTranscriptionsFromFirestore, SavedTranscription } from '../services/firebase';
import { playSoundSuccess, playSoundTone } from '../utils/speech';

export const AudioTranscriber: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<string | null>(null);
  const [audioTitle, setAudioTitle] = useState('Grabación de Clase / Repaso');
  const [copied, setCopied] = useState(false);
  const [savedCloudId, setSavedCloudId] = useState<string | null>(null);
  const [savedTranscriptions, setSavedTranscriptions] = useState<SavedTranscription[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  // Load saved transcriptions if logged in
  useEffect(() => {
    if (auth.currentUser) {
      fetchTranscriptionsFromFirestore(auth.currentUser.uid)
        .then(res => setSavedTranscriptions(res))
        .catch(err => console.warn(err));
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      setTranscriptionResult(null);
      setSavedCloudId(null);
      playSoundTone(659.25, 0.08, 'sine', 0.1);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone error:', err);
      alert('Por favor, concede permisos de micrófono en el navegador para transcribir.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
      playSoundSuccess();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioBlob(file);
    setAudioUrl(URL.createObjectURL(file));
    setAudioTitle(file.name.replace(/\.[^/.]+$/, ''));
    setTranscriptionResult(null);
    setSavedCloudId(null);
    playSoundSuccess();
  };

  const handleTranscribe = async () => {
    if (!audioBlob) return;
    setTranscribing(true);
    playSoundTone(523.25, 0.05, 'triangle', 0.08);

    try {
      // Convert Blob to Base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const mimeType = audioBlob.type || 'audio/webm';

        const res = await fetch('/api/gemini/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Data,
            mimeType,
            title: audioTitle
          })
        });

        const data = await res.json();
        const text = data.transcript || data.fallbackTranscript || 'Transcripción completada.';
        setTranscriptionResult(text);
        playSoundSuccess();

        // Auto-save to Firestore if user is authenticated
        if (auth.currentUser) {
          try {
            const docId = await saveTranscriptionToFirestore({
              userId: auth.currentUser.uid,
              audioTitle,
              transcript: text,
              duration: recordingSeconds
            });
            setSavedCloudId(docId);
            // Refresh list
            const updated = await fetchTranscriptionsFromFirestore(auth.currentUser.uid);
            setSavedTranscriptions(updated);
          } catch (dbErr) {
            console.warn("Firestore save note:", dbErr);
          }
        }
      };
    } catch (err) {
      console.error('Transcription error:', err);
      alert('Error procesando la transcripción.');
    } finally {
      setTranscribing(false);
    }
  };

  const handleCopyText = () => {
    if (!transcriptionResult) return;
    navigator.clipboard.writeText(transcriptionResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-blue-500/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Modelo: gemini-3.5-transcribe</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Transcriptor de Audio & Apuntes Orales
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Graba explicaciones de tus profesores, tus lecturas en voz alta o tus dudas en portugués, español y catalán. Gemini transcribe cada palabra fielmente y organiza tus apuntes en la nube Firestore.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recording & Upload Controls */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Mic className="w-4 h-4 text-blue-600" />
              <span>Grabar Audio con Micrófono</span>
            </h3>

            {/* Recorder Interface */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  isRecording 
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse ring-8 ring-rose-600/30' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                }`}
                title={isRecording ? "Detener grabación" : "Iniciar grabación"}
              >
                {isRecording ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-8 h-8" />}
              </button>

              <div>
                <div className="text-xl font-mono font-bold text-slate-800">
                  {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {isRecording ? 'Grabando audio de Danilo...' : 'Pulsa el micro para grabar'}
                </div>
              </div>
            </div>

            {/* File Upload Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-slate-400 text-[11px] font-semibold uppercase">o sube un archivo</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* File upload button */}
            <label className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 cursor-pointer text-xs font-semibold text-slate-700 transition-colors">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Subir MP3, WAV, WebM o M4A</span>
              <input 
                type="file" 
                accept="audio/*" 
                onChange={handleFileUpload}
                className="hidden" 
              />
            </label>

            {/* Audio Preview & Title */}
            {audioBlob && (
              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <FileAudio className="w-4 h-4 text-blue-600" />
                    Audio Preparado
                  </span>
                  <span className="text-[10px] text-blue-600 font-mono">
                    {(audioBlob.size / 1024).toFixed(1)} KB
                  </span>
                </div>

                <input
                  type="text"
                  value={audioTitle}
                  onChange={(e) => setAudioTitle(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium"
                  placeholder="Título de la grabación..."
                />

                {audioUrl && (
                  <audio controls src={audioUrl} className="w-full h-8" />
                )}

                <button
                  onClick={handleTranscribe}
                  disabled={transcribing}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                >
                  {transcribing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Transcribiendo con gemini-3.5-transcribe...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Iniciar Transcripción</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Transcription Output & Cloud Archive */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col min-h-[420px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Resultado de la Transcripción</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Transcripción textual literal generada por el modelo Gemini 3.5
                </p>
              </div>

              {transcriptionResult && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyText}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado' : 'Copiar'}</span>
                  </button>

                  {savedCloudId && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <Save className="w-3.5 h-3.5" />
                      <span>Guardado en Firestore</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Transcript Text Box */}
            <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-200 overflow-y-auto font-sans text-xs leading-relaxed text-slate-800">
              {transcriptionResult ? (
                <div className="whitespace-pre-wrap space-y-2">
                  <div className="p-2 bg-blue-100/60 rounded text-blue-900 font-bold text-xs mb-2">
                    📌 {audioTitle}
                  </div>
                  {transcriptionResult}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 p-8 text-center">
                  <FileText className="w-12 h-12 text-slate-300" />
                  <p className="font-semibold text-slate-600 text-sm">Aún no hay transcripción</p>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Graba tu voz o sube un archivo de audio en la columna izquierda y pulsa "Iniciar Transcripción".
                  </p>
                </div>
              )}
            </div>

            {/* Saved Transcriptions from Cloud History */}
            {savedTranscriptions.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Tus transcripciones guardadas en Firestore ({savedTranscriptions.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {savedTranscriptions.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => {
                        setAudioTitle(st.audioTitle);
                        setTranscriptionResult(st.transcript);
                        playSoundSuccess();
                      }}
                      className="p-2.5 rounded-lg text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 text-xs transition-colors group"
                    >
                      <div className="font-bold text-slate-800 group-hover:text-blue-700 truncate">
                        {st.audioTitle}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {st.transcript}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
