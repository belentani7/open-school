import { beforeEach, describe, expect, it, vi } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addToSyncQueue,
  configureBackendSyncHandler,
  configureSyncHandler,
  retryBlockedSyncActions,
  toSyncPayload,
  getSyncQueue,
  processSyncQueue,
  updateStreakAtMidnight,
} from "../lib/services/sync";

const memory = new Map<string, string>();

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(async (key: string) => memory.get(key) ?? null),
    setItem: vi.fn(async (key: string, value: string) => {
      memory.set(key, value);
    }),
    removeItem: vi.fn(async (key: string) => {
      memory.delete(key);
    }),
    getAllKeys: vi.fn(async () => [...memory.keys()]),
  },
}));

describe("Audit regressions", () => {
  beforeEach(async () => {
    memory.clear();
    configureSyncHandler(null);
    vi.clearAllMocks();
  });

  it("retains queued data when no backend sync handler is configured", async () => {
    await addToSyncQueue("progress", { lessonId: "log-1" });

    const processed = await processSyncQueue();
    const queue = await getSyncQueue();

    expect(processed).toBe(false);
    expect(queue).toHaveLength(1);
    expect(queue[0].payload).toEqual({ lessonId: "log-1" });
  });

  it("removes queued data only after a configured handler succeeds", async () => {
    await addToSyncQueue("progress", { lessonId: "log-1" });
    const handler = vi.fn(async () => undefined);
    configureSyncHandler(handler);

    const processed = await processSyncQueue();
    const queue = await getSyncQueue();

    expect(processed).toBe(true);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(queue).toHaveLength(0);
  });

  it("pushes queued actions through the injected backend client", async () => {
    const mutate = vi.fn(async () => undefined);
    configureBackendSyncHandler({ sync: { push: { mutate } } });
    await addToSyncQueue("stats", { totalLessonsCompleted: 1 });

    await processSyncQueue();

    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        actions: [expect.objectContaining({ type: "stats" })],
      }),
    );
  });

  it("blocks repeated backend failures and requires explicit retry", async () => {
    const handler = vi.fn(async () => {
      throw new Error("temporary backend failure");
    });
    configureSyncHandler(handler);
    await addToSyncQueue("progress", { lessonId: "lesson-1", completed: true });

    expect(await processSyncQueue()).toBe(false);
    expect(await processSyncQueue()).toBe(false);
    expect(await processSyncQueue()).toBe(false);
    expect(await processSyncQueue()).toBe(false);
    expect((await getSyncQueue())[0]?.blocked).toBe(true);
    expect(handler).toHaveBeenCalledTimes(3);

    await retryBlockedSyncActions();
    expect((await getSyncQueue())[0]?.blocked).toBe(false);
  });

  it("serializes dates and nested values into JSON-safe payloads", () => {
    const payload = toSyncPayload({ completedAt: new Date("2026-01-02T03:04:05.000Z"), count: 2 });
    expect(payload).toEqual({ completedAt: "2026-01-02T03:04:05.000Z", count: 2 });
  });

  it("uses the canonical user_profile key when updating a streak", async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    await AsyncStorage.setItem(
      "user_profile",
      JSON.stringify({
        id: "user-1",
        stats: {
          currentStreak: 1,
          longestStreak: 1,
          lastActivityDate: yesterday.toISOString(),
        },
      }),
    );

    await updateStreakAtMidnight("user-1");
    const stored = await AsyncStorage.getItem("user_profile");
    const user = JSON.parse(stored ?? "{}");

    expect(user.stats.currentStreak).toBe(2);
    expect(user.stats.longestStreak).toBe(2);
  });
});
