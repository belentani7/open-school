import React, { useState } from 'react';
import { Play, Volume2, ShieldCheck, CheckCircle, Sparkles, BookOpen, Clock, Award } from 'lucide-react';
import { EDUTUBE_VIDEOS } from '../data/curriculumData';
import { EduTubeVideo } from '../types';
import { speakBelentani, playSoundSuccess, playSoundTone } from '../utils/speech';

export const EduTube: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<EduTubeVideo>(EDUTUBE_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);

  const handleSelectVideo = (video: EduTubeVideo) => {
    playSoundTone(480, 0.02, 'sine', 0.05);
    setSelectedVideo(video);
    setIsPlaying(false);
  };

  const handleStartLesson = () => {
    playSoundSuccess();
    setIsPlaying(true);
    speakBelentani(`Lección educativa: ${selectedVideo.title}. ${selectedVideo.description}`, { lang: 'es' });
  };

  const handleMarkComplete = () => {
    playSoundSuccess();
    if (!completedVideos.includes(selectedVideo.id)) {
      setCompletedVideos([...completedVideos, selectedVideo.id]);
    }
  };

  return (
    <div className="flex flex-col h-full astra-card border border-white/[0.08] overflow-hidden text-slate-200">
      {/* Header bar (Astra AI Cosmic EduTube) */}
      <div className="bg-[#090a14] border-b border-white/[0.08] px-4 py-2.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center font-black shadow-md">
            <Play className="w-4 h-4 fill-red-400 ml-0.5" />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-white">EduTube Aula Segura</span>
            <span className="text-[10px] ml-2 px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
              100% Sin Anuncios · Verificado ESO
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Entorno Protegido para Menor</span>
          </div>
        </div>
      </div>

      {/* Main View: Player on left, playlist on right */}
      <div className="flex-1 flex flex-col lg:flex-row bg-[#06070a]/80 overflow-hidden p-4 gap-4">
        {/* Interactive Lesson Player */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
          {/* Simulated Video Stage (Deep obsidian cosmic visual) */}
          <div className="w-full aspect-[16/9] bg-[#0c0d18] rounded-2xl shadow-xl border border-white/[0.08] relative overflow-hidden flex flex-col justify-between p-6 text-white">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-bold shadow-md shadow-violet-600/30">
                {selectedVideo.badge}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {selectedVideo.duration}
              </span>
            </div>

            <div className="text-center my-auto space-y-3">
              <div 
                className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-red-600 text-white flex items-center justify-center mx-auto shadow-xl hover:scale-105 transition-transform cursor-pointer border border-white/20"
                onClick={handleStartLesson}
              >
                <Play className="w-7 h-7 fill-white ml-1" />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white max-w-lg mx-auto">
                {selectedVideo.title}
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto line-clamp-2">
                {selectedVideo.description}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/[0.08] pt-3">
              <span>Curso: <strong className="text-white">{selectedVideo.course}</strong></span>
              <span>Asignatura: <strong className="text-white">{selectedVideo.subject}</strong></span>
            </div>
          </div>

          {/* Lesson Notes & Key Takeaways Card */}
          <div className="bg-[#0c0d18] rounded-2xl shadow border border-white/[0.08] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Idea Clave para el Cuaderno de Danilo:</span>
              </div>
              <button
                onClick={handleMarkComplete}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  completedVideos.includes(selectedVideo.id)
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-white/[0.08]'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{completedVideos.includes(selectedVideo.id) ? 'Lección Completada' : 'Marcar como Vista'}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-violet-950/30 border border-violet-500/30 text-violet-200 text-xs leading-relaxed font-medium">
              "{selectedVideo.keyTakeaway}"
            </div>

            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span>💡 Las explicaciones didácticas de EduTube están alineadas con la normativa oficial LOMLOE y los contenidos evaluables de la ESO.</span>
            </div>
          </div>
        </div>

        {/* Video Playlist Sidebar */}
        <div className="w-full lg:w-96 bg-[#0c0d18] rounded-2xl shadow border border-white/[0.08] p-4 flex flex-col gap-3 overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <span className="font-bold text-sm text-white">Lecciones del Curso ESO</span>
            <span className="text-xs text-slate-400 font-mono">{completedVideos.length}/{EDUTUBE_VIDEOS.length} vistas</span>
          </div>

          <div className="space-y-2.5">
            {EDUTUBE_VIDEOS.map((v) => {
              const isSelected = selectedVideo.id === v.id;
              const isDone = completedVideos.includes(v.id);

              return (
                <div
                  key={v.id}
                  onClick={() => handleSelectVideo(v)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? 'border-violet-400 bg-violet-950/40 shadow-md ring-1 ring-violet-400/30'
                      : 'border-white/[0.06] bg-slate-900/40 hover:bg-slate-900 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold uppercase tracking-wider text-violet-400">{v.subject}</span>
                    <span className="flex items-center gap-1 font-mono text-slate-400">
                      {isDone && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                      {v.duration}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-white leading-snug">{v.title}</div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
