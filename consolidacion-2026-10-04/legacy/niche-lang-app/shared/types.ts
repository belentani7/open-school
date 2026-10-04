/**
 * Shared types for NicheLang app
 */

// Language codes
export type LanguageCode = "es" | "en" | "fr" | "de" | "pt" | "zh" | "ja";

export type LanguageName = {
  [key in LanguageCode]: string;
};

// Niche types
export type NicheType =
  | "logistics"
  | "medicine"
  | "sales"
  | "tourism"
  | "construction"
  | "gastronomy"
  | "technology"
  | "finance";

export interface Niche {
  id: NicheType;
  name: string;
  icon: string;
  description: string;
  color: string;
  lessonsCount: number;
}

// JSON-safe values used by offline actions and module content.
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface VocabularyModuleItem {
  word: string;
  translation: string;
  pronunciation: string;
  example: string;
  exampleTranslation: string;
  audioUrl?: string;
}

export interface DialogueLine {
  speaker: string;
  text: string;
  lang: LanguageCode;
}

export interface DialogueContent {
  lines: DialogueLine[];
}

export interface ExerciseContent {
  type: ExerciseType;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

// Lesson types
export interface Lesson {
  id: string;
  nicheId: NicheType;
  title: string;
  description: string;
  duration: number; // in minutes
  order: number;
  status: "locked" | "available" | "completed" | "in_progress";
  progress: number; // 0-100
  modules: LessonModule[];
}

export type LessonModuleType =
  | "introduction"
  | "vocabulary"
  | "dialogue"
  | "exercise"
  | "summary";

export type LessonModule =
  | {
      id: string;
      type: "introduction" | "summary";
      title: string;
      content: string;
    }
  | {
      id: string;
      type: "vocabulary";
      title: string;
      content: VocabularyModuleItem[];
    }
  | {
      id: string;
      type: "dialogue";
      title: string;
      content: DialogueContent;
    }
  | {
      id: string;
      type: "exercise";
      title: string;
      content: ExerciseContent;
    };

// Vocabulary types
export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  example: string;
  exampleTranslation: string;
  audioUrl?: string;
  isFavorite: boolean;
  lessonId: string;
}

// Exercise types
export type ExerciseType =
  | "multiple_choice"
  | "fill_blank"
  | "matching"
  | "writing"
  | "listening";

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  moduleId: string;
}

// User progress types
export interface UserProgress {
  userId: string;
  lessonId: string;
  moduleId: string;
  completed: boolean;
  completedAt?: Date;
  score?: number;
}

export interface UserStats {
  userId: string;
  totalWordsLearned: number;
  totalLessonsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  totalMinutesSpent: number;
  lastActivityDate: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  baseLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  subscribedNiches: NicheType[];
  stats: UserStats;
  createdAt: Date;
  updatedAt: Date;
}

// Notification types
export interface NotificationPayload {
  type: "daily_reminder" | "streak_warning" | "achievement_unlocked" | "lesson_available";
  title: string;
  body: string;
  data?: Record<string, JsonValue>;
}

// Achievement/Badge types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  condition: "streak_7" | "words_100" | "lessons_10" | "first_day";
}

// Sync types
export interface SyncAction {
  id: string;
  type: "progress" | "stats" | "profile";
  payload: JsonValue;
  timestamp: Date;
  synced: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

