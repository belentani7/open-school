import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  signInAnonymously,
  type User 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp,
  getDocFromServer
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore with specific database ID if configured
const configAny = firebaseConfig as any;
export const db = configAny.firestoreDatabaseId 
  ? getFirestore(app, configAny.firestoreDatabaseId)
  : getFirestore(app);

// Verify Firestore connectivity on initial load as mandated
async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase Firestore connected successfully to database:", configAny.firestoreDatabaseId || "default");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is offline, check connection/rules.", error);
    } else {
      // Normal if document doesn't exist yet
      console.log("Firestore initialized.");
    }
  }
}
testFirestoreConnection();

export interface StudentProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'student' | 'tutor' | 'parent';
  grade: string;
  coins: number;
  streak: number;
  lastLogin?: string;
}

export interface SavedCreation {
  id?: string;
  userId: string;
  type: 'image' | 'music';
  title: string;
  prompt: string;
  mediaUrl: string;
  model: string;
  createdAt?: any;
}

export interface SavedTranscription {
  id?: string;
  userId: string;
  audioTitle: string;
  transcript: string;
  duration?: number;
  createdAt?: any;
}

export type UserProfile = StudentProfile;

// Auth helpers
export const signInWithGoogle = signInWithGooglePrompt;
export async function signInAnonymouslyUser(): Promise<User> {
  const res = await signInAnonymously(auth);
  await initializeUserProfile(res.user, "William Danilo (Invitado)");
  return res.user;
}
export const signOutUser = logOut;

export async function signInWithGooglePrompt(): Promise<User> {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    // Initialize user profile in Firestore
    await initializeUserProfile(res.user);
    return res.user;
  } catch (err: any) {
    console.warn("Google popup signIn issue (e.g. popup blocked in iframe):", err);
    // Fallback to anonymous sign in so the user can still use Firebase in restricted iframes
    const anonRes = await signInAnonymously(auth);
    await initializeUserProfile(anonRes.user, "William Danilo (Invitado)");
    return anonRes.user;
  }
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

// User Profile management
export async function initializeUserProfile(user: User, fallbackName = "William Danilo"): Promise<void> {
  if (!user) return;
  const userDocRef = doc(db, "users", user.uid);
  try {
    const existing = await getDoc(userDocRef);
    if (!existing.exists()) {
      const initialProfile: StudentProfile = {
        uid: user.uid,
        email: user.email || "danilo.estudiante@belentanischool.edu",
        displayName: user.displayName || fallbackName,
        photoURL: user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        role: "student",
        grade: "3º de ESO",
        coins: 250,
        streak: 12,
        lastLogin: new Date().toISOString(),
      };
      await setDoc(userDocRef, initialProfile);
    }
  } catch (e) {
    console.error("Error initializing profile in Firestore:", e);
  }
}

export async function getUserProfile(uid: string): Promise<StudentProfile | null> {
  try {
    const userDocRef = doc(db, "users", uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as StudentProfile;
    }
  } catch (e) {
    console.warn("Error fetching profile from Firestore:", e);
  }
  return null;
}

export async function updateUserCoins(uid: string, addCoins: number): Promise<void> {
  try {
    const userDocRef = doc(db, "users", uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const curr = snap.data() as StudentProfile;
      await setDoc(userDocRef, { ...curr, coins: (curr.coins || 0) + addCoins }, { merge: true });
    }
  } catch (e) {
    console.warn("Error updating coins in Firestore:", e);
  }
}

// Save & fetch creations (Images & Lyria Music)
export async function saveCreationToFirestore(creation: Omit<SavedCreation, 'id' | 'createdAt'>): Promise<string> {
  try {
    const colRef = collection(db, "users", creation.userId, "creations");
    const docRef = await addDoc(colRef, {
      ...creation,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (e) {
    console.error("Error saving creation to Firestore:", e);
    throw e;
  }
}

export async function fetchCreationsFromFirestore(userId: string): Promise<SavedCreation[]> {
  try {
    const colRef = collection(db, "users", userId, "creations");
    const q = query(colRef, orderBy("createdAt", "desc"), limit(20));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as SavedCreation));
  } catch (e) {
    console.warn("Error fetching creations from Firestore:", e);
    return [];
  }
}

// Save & fetch audio transcriptions
export async function saveTranscriptionToFirestore(transcription: Omit<SavedTranscription, 'id' | 'createdAt'>): Promise<string> {
  try {
    const colRef = collection(db, "users", transcription.userId, "transcriptions");
    const docRef = await addDoc(colRef, {
      ...transcription,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (e) {
    console.error("Error saving transcription to Firestore:", e);
    throw e;
  }
}

export async function fetchTranscriptionsFromFirestore(userId: string): Promise<SavedTranscription[]> {
  try {
    const colRef = collection(db, "users", userId, "transcriptions");
    const q = query(colRef, orderBy("createdAt", "desc"), limit(20));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as SavedTranscription));
  } catch (e) {
    console.warn("Error fetching transcriptions from Firestore:", e);
    return [];
  }
}

// 365 Days Classroom Progress Persistence
export interface DayCompletionRecord {
  dayNumber: number;
  completedAt: any;
  score: number;
  notes?: string;
}

export async function saveClassProgressToFirestore(
  userId: string, 
  dayNumber: number, 
  score: number = 100, 
  notes?: string
): Promise<void> {
  try {
    const dayDocRef = doc(db, "users", userId, "completed_days", `day_${dayNumber}`);
    await setDoc(dayDocRef, {
      dayNumber,
      score,
      notes: notes || "",
      completedAt: serverTimestamp()
    });

    // Also update main user doc summary
    const userDocRef = doc(db, "users", userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      const currentCompleted = data.completedDaysCount || 0;
      await setDoc(userDocRef, {
        ...data,
        completedDaysCount: Math.max(currentCompleted, dayNumber),
        lastCompletedDay: dayNumber,
        streak: (data.streak || 0) + 1,
        coins: (data.coins || 250) + 50
      }, { merge: true });
    }
  } catch (e) {
    console.error("Error saving daily class progress to Firestore:", e);
  }
}

export async function fetchClassProgressFromFirestore(userId: string): Promise<{ completedDays: number[]; latestDay: number }> {
  try {
    const colRef = collection(db, "users", userId, "completed_days");
    const snap = await getDocs(colRef);
    const completedDays: number[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      if (typeof data.dayNumber === 'number') {
        completedDays.push(data.dayNumber);
      }
    });
    completedDays.sort((a, b) => a - b);
    const latestDay = completedDays.length > 0 ? Math.max(...completedDays) : 1;
    return { completedDays, latestDay };
  } catch (e) {
    console.warn("Error fetching daily class progress from Firestore:", e);
    return { completedDays: [], latestDay: 1 };
  }
}

