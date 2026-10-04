import React, { useState, useEffect } from 'react';
import { 
  User, 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  Cloud, 
  CloudCheck, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Flame, 
  Coins, 
  GraduationCap 
} from 'lucide-react';
import { 
  auth, 
  signInWithGoogle, 
  signInAnonymouslyUser, 
  signOutUser, 
  getUserProfile, 
  UserProfile 
} from '../services/firebase';
import { playSoundSuccess, playSoundTone } from '../utils/speech';
import { User as FirebaseUser } from 'firebase/auth';

interface AuthUserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthUserProfileModal: React.FC<AuthUserProfileModalProps> = ({
  isOpen,
  onClose
}) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setStatusMessage('Iniciando sesión con Google...');
    try {
      const user = await signInWithGoogle();
      playSoundSuccess();
      setStatusMessage('¡Bienvenido, ' + (user.displayName || 'William Danilo') + '!');
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
    } catch (err: any) {
      console.error(err);
      setStatusMessage('Error en el inicio de sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setIsLoading(true);
    setStatusMessage('Iniciando sesión de invitado seguro...');
    try {
      const user = await signInAnonymouslyUser();
      playSoundSuccess();
      setStatusMessage('Sesión segura de Danilo activada en Firestore.');
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
    } catch (err) {
      console.error(err);
      setStatusMessage('Error al activar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    playSoundTone(440, 0.05, 'sine', 0.1);
    await signOutUser();
    setUserProfile(null);
    setStatusMessage('Has cerrado sesión.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-7 shadow-2xl border border-blue-200 relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 text-white flex items-center justify-center shadow-md">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Perfil de Alumno & Nube Firestore
            </h3>
            <p className="text-xs text-slate-500">
              Sincronización segura de progresos y creaciones
            </p>
          </div>
        </div>

        {/* User Card */}
        {currentUser ? (
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="Avatar" 
                  className="w-12 h-12 rounded-full border-2 border-blue-500 shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-base">
                  {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'WD'}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-slate-900 truncate">
                  {currentUser.displayName || userProfile?.displayName || 'William Danilo'}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {currentUser.email || 'Sesión Segura Danilo'}
                </div>
              </div>

              <div className="px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                <span>En Línea</span>
              </div>
            </div>

            {/* Academic Stats */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center">
              <div className="p-2 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Nivel Escolar</span>
                <span className="text-xs font-bold text-slate-800">
                  {userProfile?.grade || '3º ESO'}
                </span>
              </div>

              <div className="p-2 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Monedas</span>
                <span className="text-xs font-bold text-amber-600 flex items-center justify-center gap-1">
                  <Coins className="w-3.5 h-3.5 fill-amber-500" />
                  {userProfile?.coins ?? 1250}
                </span>
              </div>

              <div className="p-2 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Racha Días</span>
                <span className="text-xs font-bold text-rose-600 flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-rose-500" />
                  {userProfile?.streak ?? 12}
                </span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full py-2.5 rounded-xl bg-slate-200 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 leading-relaxed">
              Inicia sesión para guardar permanentemente en Firestore todas tus transcripciones de voz, creaciones de arte y música con Lyria, y los diálogos con el chatbot Gemini.
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continuar con Google</span>
            </button>

            <button
              onClick={handleAnonymousLogin}
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Acceso Rápido como William Danilo</span>
            </button>
          </div>
        )}

        {statusMessage && (
          <div className="text-center text-xs font-semibold text-blue-700">
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
};
