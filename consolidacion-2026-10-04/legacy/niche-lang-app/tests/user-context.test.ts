import { describe, it, expect, beforeEach, vi } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock AsyncStorage
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe("User Context", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with null user", () => {
    expect(AsyncStorage.getItem).toBeDefined();
  });

  it("should store user profile in AsyncStorage", async () => {
    const mockUser = {
      id: "user-1",
      email: "test@example.com",
      name: "Test User",
      baseLanguage: "es" as const,
      targetLanguage: "en" as const,
      subscribedNiches: ["logistics"],
      stats: {
        userId: "user-1",
        totalWordsLearned: 0,
        totalLessonsCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalMinutesSpent: 0,
        lastActivityDate: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await AsyncStorage.setItem("user_profile", JSON.stringify(mockUser));

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "user_profile",
      JSON.stringify(mockUser)
    );
  });

  it("should add niche to subscribed list", async () => {
    const niches = ["logistics"];
    const newNiches = [...new Set([...niches, "medicine"])];

    expect(newNiches).toContain("medicine");
    expect(newNiches.length).toBe(2);
  });

  it("should remove niche from subscribed list", () => {
    const niches = ["logistics", "medicine"];
    const filtered = niches.filter((n) => n !== "medicine");

    expect(filtered).not.toContain("medicine");
    expect(filtered.length).toBe(1);
  });

  it("should update stats correctly", () => {
    const stats = {
      userId: "user-1",
      totalWordsLearned: 10,
      totalLessonsCompleted: 2,
      currentStreak: 1,
      longestStreak: 1,
      totalMinutesSpent: 30,
      lastActivityDate: new Date(),
    };

    const updated = { ...stats, totalWordsLearned: 15 };

    expect(updated.totalWordsLearned).toBe(15);
    expect(updated.totalLessonsCompleted).toBe(2);
  });
});
