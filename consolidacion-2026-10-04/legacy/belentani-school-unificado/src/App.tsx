/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavigationTab, ParentalSettings } from './types';
import { Header } from './components/Header';
import { AcademicPlan } from './components/AcademicPlan';
import { CulturalTutor } from './components/CulturalTutor';
import { ArcadeCenter } from './components/ArcadeCenter';
import { AITutorChat } from './components/AITutorChat';
import { ParentalShield } from './components/ParentalShield';
import { JsonBankExplorer } from './components/JsonBankExplorer';
import { SuperpowerAuditoria } from './components/SuperpowerAuditoria';
import { EduOfficeSuite } from './components/EduOfficeSuite';
import { EduTube } from './components/EduTube';
import { VoiceStudioModal } from './components/VoiceStudioModal';
import { GeminiLiveVoice } from './components/GeminiLiveVoice';
import { AudioTranscriber } from './components/AudioTranscriber';
import { CreativeStudio } from './components/CreativeStudio';
import { AuthUserProfileModal } from './components/AuthUserProfileModal';
import { WelcomeTourModal } from './components/WelcomeTourModal';
import { WelcomeDaysBanner } from './components/WelcomeDaysBanner';
import { MySchoolHome } from './components/MySchoolHome';
import { SupportToolsHub } from './components/SupportToolsHub';
import { DailyClassRoom } from './components/DailyClassRoom';
import { AstraResearchHub } from './components/AstraResearchHub';
import { UniversalSchoolModal } from './components/UniversalSchoolModal';
import { StudentProfileData, getStudentProfile, syncStudentProfile } from './services/schoolFirestore';
import { playSoundSuccess } from './utils/speech';
import { Eye, ShieldCheck, Heart, Sparkles, Volume2, Monitor } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('claseDelDia');
  const [studyMinutes, setStudyMinutes] = useState<number>(14);
  const [showEyeBreakModal, setShowEyeBreakModal] = useState<boolean>(false);
  const [isVoiceStudioOpen, setIsVoiceStudioOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isWelcomeTourOpen, setIsWelcomeTourOpen] = useState<boolean>(false);
  const [isUniversalModalOpen, setIsUniversalModalOpen] = useState<boolean>(false);
  const [studentProfile, setStudentProfile] = useState<StudentProfileData>({
    uid: 'william_danilo_001',
    displayName: 'William Danilo',
    selectedGrade: '3eso',
    nativeLanguage: 'pt',
    targetLanguages: 'es,ca,en',
    totalMinutesStudied: 14,
    country: 'Brasil 🇧🇷 ➔ España & Catalunya 🇪🇸'
  });
  const [isToolsUnlocked, setIsToolsUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem('belentani_tools_unlocked') === 'true';
    } catch {
      return false;
    }
  });
  const [parentalSettings, setParentalSettings] = useState<ParentalSettings>({
    maxDailyMinutes: 60,
    usedMinutesToday: 14,
    breakEveryMinutes: 20,
    safetyShieldEnabled: true,
    dataVaultEncrypted: true,
    autoVoiceEnabled: true,
    parentPin: '1234',
    lastBreakTimestamp: 0
  });

  // Attempt initial sync of the student profile (grade, native/target languages) with Firestore
  useEffect(() => {
    async function loadCloudProfile() {
      try {
        const cloudData = await getStudentProfile(studentProfile.uid);
        if (cloudData) {
          setStudentProfile(cloudData);
        } else {
          await syncStudentProfile(studentProfile);
        }
      } catch (err) {
        console.log('[Firestore] Local-first mode active');
      }
    }
    loadCloudProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track study time and fire eye-break reminders
  useEffect(() => {
    const timer = setInterval(() => {
      setStudyMinutes(prev => {
        const updated = prev + 1;
        setParentalSettings(ps => ({ ...ps, usedMinutesToday: updated }));
        if (updated % parentalSettings.breakEveryMinutes === 0) {
          setShowEyeBreakModal(true);
        }
        return updated;
      });
    }, 60000); // every minute

    return () => clearInterval(timer);
  }, [parentalSettings.breakEveryMinutes]);

  // Check on initial load if user is new or in initial induction period
  useEffect(() => {
    try {
      const hasCompleted = localStorage.getItem('belentani_tour_completed');
      const hasAutoTriggeredSession = sessionStorage.getItem('belentani_tour_auto_session');
      if (!hasCompleted && !hasAutoTriggeredSession) {
        sessionStorage.setItem('belentani_tour_auto_session', 'true');
        const timer = setTimeout(() => {
          setIsWelcomeTourOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Storage unavailable fallback
    }
  }, []);

  const handleTabChange = (tab: NavigationTab) => {
    playSoundSuccess();
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen astra-grid-bg text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white font-sans">
      {/* Astra AI Cosmic Header */}
      <Header
        activeTab={currentTab}
        onSelectTab={handleTabChange}
        onOpenVoiceStudio={() => setIsVoiceStudioOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenWelcomeTour={() => setIsWelcomeTourOpen(true)}
        onOpenUniversalModal={() => setIsUniversalModalOpen(true)}
        studentName={studentProfile.displayName}
        studentGrade={
          studentProfile.selectedGrade === '1eso' ? '1º ESO' :
          studentProfile.selectedGrade === '2eso' ? '2º ESO' :
          studentProfile.selectedGrade === '3eso' ? '3º ESO' :
          studentProfile.selectedGrade === '4eso' ? '4º ESO' :
          studentProfile.selectedGrade === '1bach' ? '1º Bach' : '2º Bach / PAU'
        }
        minutesUsed={studyMinutes}
        maxMinutes={parentalSettings.maxDailyMinutes}
        safetyShieldActive={parentalSettings.safetyShieldEnabled}
        autoVoiceEnabled={parentalSettings.autoVoiceEnabled}
        isToolsUnlocked={isToolsUnlocked}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Welcome & Go-Around Days Banner (signalized during induction days) */}
        <WelcomeDaysBanner onOpenTour={() => setIsWelcomeTourOpen(true)} />

        {/* Eye Break Alert Modal (20-20-20 Rule) */}
        {showEyeBreakModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="astra-card p-6 max-w-md w-full rounded-2xl text-center space-y-4 shadow-2xl border border-violet-500/40 bg-[#0c0d18]">
              <div className="w-14 h-14 rounded-full bg-violet-950/80 text-violet-400 flex items-center justify-center mx-auto border border-violet-500/50">
                <Eye className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">¡Momento de Descanso Ocular, Danilo!</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Han pasado 20 minutos de estudio activo. Para proteger tu vista según la regla 20-20-20, mira a un punto lejano por la ventana durante 20 segundos y parpadea suavemente.
                </p>
              </div>
              <button
                onClick={() => setShowEyeBreakModal(false)}
                className="w-full py-2.5 rounded-xl bg-violet-600 text-white font-bold text-xs hover:bg-violet-500 shadow-lg shadow-violet-600/30 transition-colors"
              >
                He descansado la vista, ¡continuar!
              </button>
            </div>
          </div>
        )}

        {/* Belentani School OS: 365 Daily Classes (Primary Pillar on Entrance) */}
        {currentTab === 'claseDelDia' && (
          <DailyClassRoom
            onUnlockToolsAndNavigate={(targetTab) => {
              setIsToolsUnlocked(true);
              try {
                localStorage.setItem('belentani_tools_unlocked', 'true');
              } catch {}
              handleTabChange(targetTab);
            }}
            isUnlockedGlobally={isToolsUnlocked}
            onSetGlobalUnlock={(unlocked) => {
              setIsToolsUnlocked(unlocked);
              try {
                localStorage.setItem('belentani_tools_unlocked', unlocked ? 'true' : 'false');
              } catch {}
            }}
          />
        )}

        {/* Belentani School OS: Secondary Pillars */}
        {currentTab === 'escuela' && (
          <MySchoolHome onNavigate={handleTabChange} studyMinutes={studyMinutes} />
        )}

        {(currentTab === 'curso' || currentTab === 'academic') && <AcademicPlan />}

        {(currentTab === 'live' || currentTab === 'geminiLive') && <GeminiLiveVoice />}

        {(currentTab === 'cultura' || currentTab === 'cultural') && <CulturalTutor />}

        {currentTab === 'herramientas' && (
          <SupportToolsHub
            parentalSettings={parentalSettings}
            onUpdateParentalSettings={setParentalSettings}
          />
        )}

        {/* Deep-link & modal support for specific tools */}
        {currentTab === 'research' && <AstraResearchHub />}
        {currentTab === 'office' && <EduOfficeSuite />}
        {currentTab === 'edutube' && <EduTube />}
        {currentTab === 'arcade' && <ArcadeCenter />}
        {currentTab === 'chat' && <AITutorChat />}
        {currentTab === 'transcribe' && <AudioTranscriber />}
        {currentTab === 'creative' && <CreativeStudio />}
        {currentTab === 'parental' && (
          <ParentalShield
            settings={parentalSettings}
            onUpdateSettings={(partial) => setParentalSettings((prev) => ({ ...prev, ...partial }))}
          />
        )}
        {currentTab === 'jsonBank' && <JsonBankExplorer />}
        {currentTab === 'auditoria' && <SuperpowerAuditoria />}
      </main>

      {/* Voice Tuning Studio Modal */}
      <VoiceStudioModal
        isOpen={isVoiceStudioOpen}
        onClose={() => setIsVoiceStudioOpen(false)}
      />

      {/* Auth & Cloud Profile Modal */}
      <AuthUserProfileModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Universal Open School Modal: switch grade (1º ESO -> 2º Bach) & native/target languages */}
      <UniversalSchoolModal
        isOpen={isUniversalModalOpen}
        onClose={() => setIsUniversalModalOpen(false)}
        currentStudent={studentProfile}
        onUpdateStudent={(updated) => setStudentProfile(updated)}
      />

      {/* Belentani Welcome & Go-Around Tour Modal */}
      <WelcomeTourModal
        isOpen={isWelcomeTourOpen}
        onClose={() => setIsWelcomeTourOpen(false)}
        onNavigateToTab={handleTabChange}
      />

      {/* Astra AI Bottom Taskbar & Status Footer */}
      <footer className="w-full border-t border-white/[0.08] bg-[#07080f]/90 backdrop-blur-md py-3.5 px-4 sm:px-6 mt-auto text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Blindaje de Menor Activo</span>
            </div>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>Estudio hoy: <strong className="text-white">{studyMinutes} min</strong></span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Ecosistema Omega Coursera · SymPy & Python 3º ESO</span>
            <span>•</span>
            <span className="text-violet-400 font-bold">Belentani School © 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
