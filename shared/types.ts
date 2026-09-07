// Shared types between client and server

export type Role = 
  | 'estudiante' 
  | 'docente' 
  | 'mentor' 
  | 'admin-institucional' 
  | 'admin-tecnico' 
  | 'creador-contenido' 
  | 'moderador' 
  | 'psicologo' 
  | 'familia' 
  | 'aliado' 
  | 'investigador';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: Role;
  ageRange?: 'menor-14' | '15-17' | '18+';
  language: string;
  institutionId?: string;
  createdAt: Date;
}

export interface LearningRoute {
  id: string;
  title: string;
  description: string;
  targetAudience: string[];
  durationHours: number;
  initialLevel: 'basico' | 'intermedio' | 'avanzado';
  category: string; // e.g., "Programación", "Ciencias", "Oficios"
  skills: string[];
  prerequisites: string[]; // routeIds
  modules: Module[];
}

export interface Module {
  id: string;
  routeId: string;
  title: string;
  orderNumber: number;
  estimatedHours: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  type: 'video' | 'lectura' | 'ejercicio' | 'proyecto' | 'simulacion';
  title: string;
  contentUrl?: string;
  contentType?: string;
  transcriptText?: string;
  durationSeconds: number;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface AssessmentQuestion {
  id: string;
  assessmentId: string;
  questionText: string;
  options: string[];
  correctAnswer: number; // index of correct option
  points: number;
}

export interface StudentProgress {
  studentId: string;
  lessonId: string;
  status: 'pending' | 'in_progress' | 'completed';
  score?: number;
  attempts: number;
  lastAccessed: Date;
}

export interface Certificate {
  id: string;
  studentId: string;
  routeId: string;
  code: string;
  issueDate: Date;
  expiresAt?: Date;
  verificationUrl: string;
  qrHash: string;
  competencies: string[];
}
