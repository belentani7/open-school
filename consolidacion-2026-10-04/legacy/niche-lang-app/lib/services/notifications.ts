import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * Initialize notifications handler
 */
export async function initializeNotifications(): Promise<boolean> {
  if (Platform.OS === "web") return false;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#0A7EA4",
    });
  }

  const { status: currentStatus } = await Notifications.getPermissionsAsync();
  const { status } = currentStatus === "granted"
    ? { status: currentStatus }
    : await Notifications.requestPermissionsAsync();

  if (status !== "granted") {
    console.warn("Notification permissions not granted");
    return false;
  }
  return true;
}

/**
 * Schedule daily reminder notification
 */
export async function scheduleDailyReminder(hour: number = 9, minute: number = 0) {
  try {
    if (Platform.OS === "web") return;

    // Cancel existing reminders
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule new reminder
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "¡Hora de aprender! 📚",
        body: "Completa tu lección diaria y mantén tu racha",
        data: { type: "daily_reminder" },
        sound: "default",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });

    console.log(`Daily reminder scheduled for ${hour}:${minute}`);
  } catch (error) {
    console.error("Failed to schedule reminder:", error);
  }
}

/**
 * Schedule streak warning notification (if no activity in 24h)
 */
export async function scheduleStreakWarning(delayHours: number = 24) {
  try {
    if (Platform.OS === "web") return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "¡No pierdas tu racha! 🔥",
        body: "Estudia hoy para mantener tu racha activa",
        data: { type: "streak_warning" },
        sound: "default",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: delayHours * 3600,
      },
    });

    console.log(`Streak warning scheduled for ${delayHours} hours from now`);
  } catch (error) {
    console.error("Failed to schedule streak warning:", error);
  }
}

/**
 * Send achievement unlocked notification
 */
export async function sendAchievementNotification(
  achievementName: string,
  icon: string
) {
  try {
    if (Platform.OS === "web") return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `¡Logro desbloqueado! ${icon}`,
        body: `Felicidades, ganaste: ${achievementName}`,
        data: { type: "achievement_unlocked" },
        sound: "default",
      },
      trigger: null, // Send immediately
    });

    console.log(`Achievement notification sent: ${achievementName}`);
  } catch (error) {
    console.error("Failed to send achievement notification:", error);
  }
}

/**
 * Send lesson available notification
 */
export async function sendLessonAvailableNotification(
  lessonTitle: string,
  nicheIcon: string
) {
  try {
    if (Platform.OS === "web") return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Nueva lección disponible ${nicheIcon}`,
        body: lessonTitle,
        data: { type: "lesson_available" },
        sound: "default",
      },
      trigger: null, // Send immediately
    });

    console.log(`Lesson notification sent: ${lessonTitle}`);
  } catch (error) {
    console.error("Failed to send lesson notification:", error);
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("All notifications cancelled");
  } catch (error) {
    console.error("Failed to cancel notifications:", error);
  }
}
