import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Lesson, UserProgress } from "@/shared/types";
import type { NicheType } from "@/shared/types";
import { ALL_LESSONS_BY_NICHE } from "@/lib/data/lesson-templates";
import { useUser } from "@/lib/contexts/user-context";
import { addToSyncQueue } from "@/lib/services/sync";

interface LessonsContextType {
  lessons: Record<string, Lesson[]>;
  progress: UserProgress[];
  isLoading: boolean;
  getLessonsByNiche: (niche: NicheType) => Lesson[];
  getLessonById: (id: string) => Lesson | undefined;
  updateLessonProgress: (lessonId: string, moduleId: string, completed: boolean) => Promise<void>;
  completeLesson: (lessonId: string) => Promise<void>;
  getLessonProgress: (lessonId: string) => number;
}

const LessonsContext = createContext<LessonsContextType | undefined>(undefined);

type LessonsAction =
  | { type: "SET_LESSONS"; payload: Record<string, Lesson[]> }
  | { type: "SET_PROGRESS"; payload: UserProgress[] }
  | { type: "UPDATE_PROGRESS"; payload: UserProgress }
  | { type: "SET_LESSON_STATUS"; payload: { lessonId: string; status: Lesson["status"] } }
  | { type: "SET_LOADING"; payload: boolean };

interface LessonsState {
  lessons: Record<string, Lesson[]>;
  progress: UserProgress[];
  isLoading: boolean;
}

const initialState: LessonsState = {
  lessons: {},
  progress: [],
  isLoading: true,
};

function lessonsReducer(state: LessonsState, action: LessonsAction): LessonsState {
  switch (action.type) {
    case "SET_LESSONS":
      return { ...state, lessons: action.payload };
    case "SET_PROGRESS": {
      const lessons = Object.fromEntries(
        Object.entries(state.lessons).map(([nicheId, nicheLessons]) => [
          nicheId,
          nicheLessons.map((lesson) => {
            const completedModules = action.payload.filter(
              (item) => item.lessonId === lesson.id && item.completed,
            ).length;
            return completedModules >= lesson.modules.length
              ? { ...lesson, status: "completed" as const, progress: 100 }
              : lesson;
          }),
        ]),
      );
      return { ...state, progress: action.payload, lessons };
    }
    case "UPDATE_PROGRESS": {
      const exists = state.progress.some(
        (p) => p.lessonId === action.payload.lessonId && p.moduleId === action.payload.moduleId,
      );
      return {
        ...state,
        progress: exists
          ? state.progress.map((p) =>
              p.lessonId === action.payload.lessonId && p.moduleId === action.payload.moduleId
                ? action.payload
                : p,
            )
          : [...state.progress, action.payload],
      };
    }
    case "SET_LESSON_STATUS":
      return {
        ...state,
        lessons: Object.fromEntries(
          Object.entries(state.lessons).map(([nicheId, nicheLessons]) => [
            nicheId,
            nicheLessons.map((lesson) =>
              lesson.id === action.payload.lessonId
                ? { ...lesson, status: action.payload.status, progress: action.payload.status === "completed" ? 100 : lesson.progress }
                : lesson,
            ),
          ]),
        ),
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

// Use real lesson data from templates
const MOCK_LESSONS = ALL_LESSONS_BY_NICHE as Record<string, Lesson[]>;

export function LessonsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(lessonsReducer, initialState);
  const { user, updateStats } = useUser();

  // Load lessons and progress from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // The local catalog is the offline-first source of truth for lesson content.
        dispatch({ type: "SET_LESSONS", payload: MOCK_LESSONS });

        const storedProgress = await AsyncStorage.getItem("lesson_progress");
        if (storedProgress) {
          dispatch({ type: "SET_PROGRESS", payload: JSON.parse(storedProgress) });
        }
      } catch (error) {
        console.error("Failed to load lessons:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    loadData();
  }, []);

  const getLessonsByNiche = (niche: NicheType) => {
    return state.lessons[niche] || [];
  };

  const getLessonById = (id: string) => {
    for (const lessons of Object.values(state.lessons)) {
      const lesson = lessons.find((l) => l.id === id);
      if (lesson) return lesson;
    }
    return undefined;
  };

  const updateLessonProgress = async (lessonId: string, moduleId: string, completed: boolean) => {
    const progress: UserProgress = {
      userId: user?.id ?? "local-user",
      lessonId,
      moduleId,
      completed,
      completedAt: completed ? new Date() : undefined,
    };

    dispatch({ type: "UPDATE_PROGRESS", payload: progress });

    try {
      // Read the latest persisted value to avoid losing rapid consecutive updates.
      const storedProgress = await AsyncStorage.getItem("lesson_progress");
      const persistedProgress: UserProgress[] = storedProgress ? JSON.parse(storedProgress) : [];
      const allProgress = [
        ...persistedProgress.filter(
          (p) => !(p.lessonId === lessonId && p.moduleId === moduleId && p.userId === progress.userId),
        ),
        progress,
      ];
      await AsyncStorage.setItem("lesson_progress", JSON.stringify(allProgress));
      await addToSyncQueue("progress", {
        userId: progress.userId,
        lessonId: progress.lessonId,
        moduleId: progress.moduleId,
        completed: progress.completed,
        completedAt: progress.completedAt?.toISOString() ?? null,
      });
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  const completeLesson = async (lessonId: string) => {
    const lesson = getLessonById(lessonId);
    if (!lesson || lesson.status === "completed") return;

    dispatch({
      type: "SET_LESSON_STATUS",
      payload: { lessonId, status: "completed" },
    });

    if (user) {
      await updateStats({
        totalLessonsCompleted: user.stats.totalLessonsCompleted + 1,
        totalMinutesSpent: user.stats.totalMinutesSpent + lesson.duration,
        lastActivityDate: new Date(),
      });
    }
  };

  const getLessonProgress = (lessonId: string) => {
    const lesson = getLessonById(lessonId);
    if (!lesson) return 0;

    const completedModules = state.progress.filter(
      (p) => p.lessonId === lessonId && p.completed
    ).length;

    return Math.round((completedModules / lesson.modules.length) * 100);
  };

  return (
    <LessonsContext.Provider
      value={{
        lessons: state.lessons,
        progress: state.progress,
        isLoading: state.isLoading,
        getLessonsByNiche,
        getLessonById,
        updateLessonProgress,
        completeLesson,
        getLessonProgress,
      }}
    >
      {children}
    </LessonsContext.Provider>
  );
}

export function useLessons() {
  const context = useContext(LessonsContext);
  if (!context) {
    throw new Error("useLessons must be used within LessonsProvider");
  }
  return context;
}

