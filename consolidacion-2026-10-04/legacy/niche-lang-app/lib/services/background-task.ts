import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";

import { createTRPCClient } from "@/lib/trpc";
import { configureBackendSyncHandler, processSyncQueue } from "@/lib/services/sync";

export const BACKGROUND_SYNC_TASK = "nichelang-background-sync";

/**
 * The task must be defined at module scope so Expo can invoke it after
 * the application process is recreated in the background.
 */
TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    configureBackendSyncHandler(createTRPCClient());
    const processed = await processSyncQueue();
    return processed
      ? BackgroundTask.BackgroundTaskResult.Success
      : BackgroundTask.BackgroundTaskResult.Failed;
  } catch (error) {
    console.error("Background sync task failed:", error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registerBackgroundSyncTask(): Promise<void> {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);
  if (!isRegistered) {
    await BackgroundTask.registerTaskAsync(BACKGROUND_SYNC_TASK, {
      minimumInterval: 15 * 60,
    });
  }
}

export async function unregisterBackgroundSyncTask(): Promise<void> {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);
  if (isRegistered) {
    await BackgroundTask.unregisterTaskAsync(BACKGROUND_SYNC_TASK);
  }
}

export async function isBackgroundSyncRegistered(): Promise<boolean> {
  return TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);
}

export async function getBackgroundTaskStatus(): Promise<BackgroundTask.BackgroundTaskStatus> {
  return BackgroundTask.getStatusAsync();
}
