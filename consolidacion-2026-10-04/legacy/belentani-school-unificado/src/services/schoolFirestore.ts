import { 
  collection, doc, setDoc, getDoc, getDocs, updateDoc, 
  serverTimestamp, query, where, orderBy, limit 
} from 'firebase/firestore';
import { db } from '../services/firebase';

export interface StudentProfileData {
  uid: string;
  displayName: string;
  email?: string;
  selectedGrade: string; // e.g., '1eso', '2eso', '3eso', '4eso', '1bach', '2bach'
  nativeLanguage: string; // 'pt' | 'es' | 'ca' | 'en'
  targetLanguages: string;
  totalMinutesStudied: number;
  country?: string;
}

export interface SavedSolutionData {
  id?: string;
  studentId: string;
  problemQuery: string;
  subject: string;
  steps: string[];
  ruleBox: string;
  createdAt?: any;
}

export interface ProgressRecord {
  courseYear: string;
  moduleId: string;
  completed: boolean;
  score?: number;
  lastStudiedAt?: any;
}

/**
 * Saves or updates student profile in Firestore
 */
export async function syncStudentProfile(profile: StudentProfileData): Promise<void> {
  try {
    const studentRef = doc(db, 'students', profile.uid);
    await setDoc(studentRef, {
      ...profile,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.warn('[Firestore] Profile sync offline/deferred:', error);
  }
}

/**
 * Loads student profile from Firestore
 */
export async function getStudentProfile(uid: string): Promise<StudentProfileData | null> {
  try {
    const studentRef = doc(db, 'students', uid);
    const snap = await getDoc(studentRef);
    if (snap.exists()) {
      return snap.data() as StudentProfileData;
    }
  } catch (error) {
    console.warn('[Firestore] Profile fetch error:', error);
  }
  return null;
}

/**
 * Records progress for a course/module
 */
export async function recordModuleProgress(
  studentId: string, 
  courseYear: string, 
  moduleId: string, 
  score?: number
): Promise<void> {
  try {
    const progressRef = doc(db, 'students', studentId, 'progress', `${courseYear}_${moduleId}`);
    await setDoc(progressRef, {
      studentId,
      courseYear,
      moduleId,
      completed: true,
      score: score ?? 100,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.warn('[Firestore] Progress record error:', error);
  }
}

/**
 * Saves an Astra AI solver solution
 */
export async function saveSolverSolution(
  studentId: string,
  problemQuery: string,
  subject: string,
  steps: string[],
  ruleBox: string
): Promise<void> {
  try {
    const solutionId = `sol_${Date.now()}`;
    const solRef = doc(db, 'students', studentId, 'solutions', solutionId);
    await setDoc(solRef, {
      studentId,
      problemQuery,
      subject,
      steps: JSON.stringify(steps),
      ruleBox,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.warn('[Firestore] Save solution error:', error);
  }
}
