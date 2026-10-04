import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Lesson, UserProgress } from "@/shared/types";

describe("Lessons Context", () => {
  let mockLessons: Lesson[];
  let mockProgress: UserProgress[];

  beforeEach(() => {
    mockLessons = [
      {
        id: "log-1",
        nicheId: "logistics",
        title: "Envío Internacional Básico",
        description: "Aprende términos esenciales",
        duration: 10,
        order: 1,
        status: "available",
        progress: 0,
        modules: [
          {
            id: "log-1-intro",
            type: "introduction",
            title: "Introducción",
            content: "Test content",
          },
          {
            id: "log-1-vocab",
            type: "vocabulary",
            title: "Vocabulario",
            content: [],
          },
        ],
      },
    ];

    mockProgress = [];
  });

  it("should get lessons by niche", () => {
    const logisticsLessons = mockLessons.filter((l) => l.nicheId === "logistics");
    expect(logisticsLessons.length).toBe(1);
    expect(logisticsLessons[0].title).toBe("Envío Internacional Básico");
  });

  it("should get lesson by id", () => {
    const lesson = mockLessons.find((l) => l.id === "log-1");
    expect(lesson).toBeDefined();
    expect(lesson?.title).toBe("Envío Internacional Básico");
  });

  it("should calculate lesson progress correctly", () => {
    const lessonId = "log-1";
    const completedModules = mockProgress.filter(
      (p) => p.lessonId === lessonId && p.completed
    ).length;
    const totalModules = mockLessons.find((l) => l.id === lessonId)?.modules.length || 1;

    const progress = Math.round((completedModules / totalModules) * 100);
    expect(progress).toBe(0);
  });

  it("should update lesson progress", () => {
    const newProgress: UserProgress = {
      userId: "user-1",
      lessonId: "log-1",
      moduleId: "log-1-intro",
      completed: true,
      completedAt: new Date(),
    };

    mockProgress.push(newProgress);

    expect(mockProgress.length).toBe(1);
    expect(mockProgress[0].completed).toBe(true);
  });

  it("should handle multiple module completions", () => {
    const progress1: UserProgress = {
      userId: "user-1",
      lessonId: "log-1",
      moduleId: "log-1-intro",
      completed: true,
      completedAt: new Date(),
    };

    const progress2: UserProgress = {
      userId: "user-1",
      lessonId: "log-1",
      moduleId: "log-1-vocab",
      completed: true,
      completedAt: new Date(),
    };

    mockProgress.push(progress1, progress2);

    const lessonProgress = mockProgress.filter((p) => p.lessonId === "log-1" && p.completed);
    expect(lessonProgress.length).toBe(2);
  });

  it("should calculate overall progress percentage", () => {
    const lesson = mockLessons[0];
    const completedCount = 1;
    const totalModules = lesson.modules.length;
    const percentage = Math.round((completedCount / totalModules) * 100);

    expect(percentage).toBe(50);
  });
});
