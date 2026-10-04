import AsyncStorage from "@react-native-async-storage/async-storage";
import type { JsonValue, UserProgress, UserStats } from "@/shared/types";

/**
 * Sync queue for offline-first architecture
 */
interface SyncQueueItem {
  id: string;
  type: "progress" | "stats" | "profile";
  payload: JsonValue;
  timestamp: number;
  retries: number;
  blocked?: boolean;
}

const SYNC_QUEUE_KEY = "sync_queue";
const LAST_SYNC_KEY = "last_sync_time";
const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes

type SyncHandler = (item: SyncQueueItem) => Promise<void>;
let syncHandler: SyncHandler | null = null;
const MAX_AUTOMATIC_RETRIES = 3;

export function toSyncPayload(value: unknown): JsonValue {
  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(toSyncPayload);
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, toSyncPayload(entry)]),
    );
  }
  return String(value);
}

type BackendSyncClient = {
  sync: {
    push: {
      mutate: (input: {
        actions: Array<{
          id: string;
          type: SyncQueueItem["type"];
          payload: JsonValue;
          timestamp: Date;
        }>;
      }) => Promise<unknown>;
    };
  };
};

export function configureBackendSyncHandler(client: BackendSyncClient): void {
  configureSyncHandler(async (item) => {
    await client.sync.push.mutate({
      actions: [
        {
          id: item.id,
          type: item.type,
          payload: item.payload,
          timestamp: new Date(item.timestamp),
        },
      ],
    });
  });
}

/** Configure the real backend operation before processing the queue. */
export function configureSyncHandler(handler: SyncHandler | null): void {
  syncHandler = handler;
}

/**
 * Add item to sync queue
 */
export async function addToSyncQueue(
  type: SyncQueueItem["type"],
  payload: JsonValue,
): Promise<void> {
  try {
    const queue = await getSyncQueue();
    const item: SyncQueueItem = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      type,
      payload,
      timestamp: Date.now(),
      retries: 0,
      blocked: false,
    };

    queue.push(item);
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    console.log(`Added to sync queue: ${type}`);
  } catch (error) {
    console.error("Failed to add to sync queue:", error);
  }
}

/**
 * Get all items in sync queue
 */
export async function getSyncQueue(): Promise<SyncQueueItem[]> {
  try {
    const queue = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    const parsed = queue ? JSON.parse(queue) : [];
    return Array.isArray(parsed)
      ? parsed.map((item) => ({ ...item, blocked: item.blocked === true }))
      : [];
  } catch (error) {
    console.error("Failed to get sync queue:", error);
    return [];
  }
}

/**
 * Remove item from sync queue
 */
export async function removeFromSyncQueue(itemId: string): Promise<void> {
  try {
    const queue = await getSyncQueue();
    const filtered = queue.filter((item) => item.id !== itemId);
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to remove from sync queue:", error);
  }
}

/**
 * Process the queue only when a real backend handler is configured.
 * Without a handler, items remain queued so offline data is never discarded.
 */
export async function processSyncQueue(): Promise<boolean> {
  try {
    const queue = await getSyncQueue();

    if (queue.length === 0) {
      await AsyncStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
      return true;
    }

    if (!syncHandler) {
      console.warn("Sync handler is not configured; retaining queued items");
      return false;
    }

    const pending = queue.filter((queued) => !queued.blocked);
    if (pending.length === 0) {
      console.warn("All queued sync actions are blocked; explicit retry required");
      return false;
    }

    let allSucceeded = queue.every((queued) => !queued.blocked);
    for (const item of pending) {
      try {
        await syncHandler(item);
        await removeFromSyncQueue(item.id);
      } catch (error) {
        allSucceeded = false;
        item.retries += 1;
        item.blocked = item.retries >= MAX_AUTOMATIC_RETRIES;
        const remaining = (await getSyncQueue()).map((queued) =>
          queued.id === item.id ? item : queued,
        );
        await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(remaining));
        console.warn(`Sync retry ${item.retries}/3 for ${item.id}`, error);
      }
    }

    if (allSucceeded) {
      await AsyncStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
    }
    return allSucceeded;
  } catch (error) {
    console.error("Failed to process sync queue:", error);
    return false;
  }
}

/** Reset blocked actions after the user explicitly requests another retry. */
export async function retryBlockedSyncActions(): Promise<void> {
  const queue = await getSyncQueue();
  await AsyncStorage.setItem(
    SYNC_QUEUE_KEY,
    JSON.stringify(queue.map((item) => ({ ...item, blocked: false, retries: 0 }))),
  );
}

/**
 * Get time since last sync
 */
export async function getTimeSinceLastSync(): Promise<number> {
  try {
    const lastSync = await AsyncStorage.getItem(LAST_SYNC_KEY);
    if (!lastSync) return Infinity;
    return Date.now() - parseInt(lastSync);
  } catch (error) {
    console.error("Failed to get last sync time:", error);
    return Infinity;
  }
}

/**
 * Check if sync is needed
 */
export async function isSyncNeeded(): Promise<boolean> {
  const timeSinceSync = await getTimeSinceLastSync();
  return timeSinceSync > SYNC_INTERVAL;
}

/**
 * Update streak at midnight
 */
export async function updateStreakAtMidnight(userId: string): Promise<void> {
  try {
    const userKey = "user_profile";
    const userJson = await AsyncStorage.getItem(userKey);

    if (!userJson) return;

    const user = JSON.parse(userJson);
    const lastActivity = new Date(user.stats.lastActivityDate);
    const today = new Date();

    // Check if last activity was yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isYesterday =
      lastActivity.getDate() === yesterday.getDate() &&
      lastActivity.getMonth() === yesterday.getMonth() &&
      lastActivity.getFullYear() === yesterday.getFullYear();

    if (isYesterday) {
      // Increment streak
      user.stats.currentStreak++;
      if (user.stats.currentStreak > user.stats.longestStreak) {
        user.stats.longestStreak = user.stats.currentStreak;
      }
    } else if (lastActivity.getDate() !== today.getDate()) {
      // Reset streak if no activity today or yesterday
      user.stats.currentStreak = 0;
    }

    await AsyncStorage.setItem(userKey, JSON.stringify(user));
    console.log(`Streak updated: ${user.stats.currentStreak}`);
  } catch (error) {
    console.error("Failed to update streak:", error);
  }
}

/**
 * Start background sync service
 */
export function startBackgroundSync(): ReturnType<typeof setInterval> {
  // Process sync queue immediately
  void processSyncQueue();

  // This interval is foreground-only; use registerBackgroundSyncTask for OS-managed work.
  return setInterval(() => {
    void processSyncQueue();
  }, SYNC_INTERVAL);
}

/**
 * Stop background sync service
 */
export function stopBackgroundSync(intervalId: ReturnType<typeof setInterval>): void {
  clearInterval(intervalId);
  console.log("Background sync stopped");
}
