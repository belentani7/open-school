import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * SecureStore is used on native platforms. AsyncStorage is the documented
 * non-secure fallback for web, where SecureStore is unavailable.
 */
const SENSITIVE_KEYS = ["user_profile", "auth_token", "user_stats"];
const DATA_KEYS_TO_DELETE = new Set([
  "gdpr_consent",
  "audit_log",
  "sync_queue",
  "last_sync_time",
]);

type AuditEntry = {
  action: string;
  dataType: string;
  timestamp: string;
};

/** Store sensitive data with a platform-safe implementation. */
export async function storeSecurely(key: string, value: string): Promise<void> {
  try {
    if (SENSITIVE_KEYS.includes(key) && Platform.OS !== "web") {
      await SecureStore.setItemAsync(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  } catch (error) {
    console.error(`Failed to store securely: ${key}`, error);
    throw error;
  }
}

/** Retrieve sensitive data with a platform-safe implementation. */
export async function retrieveSecurely(key: string): Promise<string | null> {
  try {
    if (SENSITIVE_KEYS.includes(key) && Platform.OS !== "web") {
      return await SecureStore.getItemAsync(key);
    }
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(`Failed to retrieve securely: ${key}`, error);
    return null;
  }
}

/** Delete sensitive data with a platform-safe implementation. */
export async function deleteSecurely(key: string): Promise<void> {
  try {
    if (SENSITIVE_KEYS.includes(key) && Platform.OS !== "web") {
      await SecureStore.deleteItemAsync(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`Failed to delete securely: ${key}`, error);
    throw error;
  }
}

/** GDPR: Get all user data in a structured, serializable object. */
export async function getUserDataExport(): Promise<Record<string, unknown>> {
  try {
    const userData: Record<string, unknown> = {};
    const allKeys = await AsyncStorage.getAllKeys();

    for (const key of allKeys) {
      if (key.startsWith("user_") || key.startsWith("lesson_") || DATA_KEYS_TO_DELETE.has(key)) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          try {
            userData[key] = JSON.parse(value);
          } catch {
            userData[key] = value;
          }
        }
      }
    }

    const userProfile = await retrieveSecurely("user_profile");
    if (userProfile) userData.user_profile = JSON.parse(userProfile);

    const userStats = await retrieveSecurely("user_stats");
    if (userStats) userData.user_stats = JSON.parse(userStats);

    await logDataAccess("export_data", "user_data");
    return userData;
  } catch (error) {
    console.error("Failed to export user data:", error);
    return {};
  }
}

/** GDPR: Delete all locally stored user data, including consent and audit keys. */
export async function deleteAllUserData(): Promise<void> {
  try {
    await logDataAccess("delete_data", "all_user_data");
    const allKeys = await AsyncStorage.getAllKeys();

    for (const key of allKeys) {
      if (key.startsWith("user_") || key.startsWith("lesson_") || DATA_KEYS_TO_DELETE.has(key)) {
        await AsyncStorage.removeItem(key);
      }
    }

    for (const key of SENSITIVE_KEYS) {
      await deleteSecurely(key);
    }
  } catch (error) {
    console.error("Failed to delete all user data:", error);
    throw error;
  }
}

export async function getConsentStatus(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem("gdpr_consent")) === "true";
  } catch (error) {
    console.error("Failed to get consent status:", error);
    return false;
  }
}

export async function setConsentStatus(consent: boolean): Promise<void> {
  await AsyncStorage.setItem("gdpr_consent", consent.toString());
  await logDataAccess(consent ? "consent_granted" : "consent_revoked", "gdpr_consent");
}

export async function logDataAccess(
  action: string,
  dataType: string,
  timestamp: Date = new Date(),
): Promise<void> {
  try {
    const auditLog = await AsyncStorage.getItem("audit_log");
    const logs: AuditEntry[] = auditLog ? JSON.parse(auditLog) : [];
    logs.push({ action, dataType, timestamp: timestamp.toISOString() });
    await AsyncStorage.setItem("audit_log", JSON.stringify(logs.slice(-100)));
  } catch (error) {
    console.error("Failed to log data access:", error);
  }
}

export async function getAuditTrail(): Promise<AuditEntry[]> {
  try {
    const auditLog = await AsyncStorage.getItem("audit_log");
    return auditLog ? JSON.parse(auditLog) : [];
  } catch (error) {
    console.error("Failed to get audit trail:", error);
    return [];
  }
}

export async function checkPermissions(): Promise<{
  notifications: boolean;
  storage: boolean;
}> {
  try {
    const permission = Platform.OS === "web"
      ? { status: "denied" as const }
      : await Notifications.getPermissionsAsync();
    return {
      notifications: permission.status === "granted",
      storage: true,
    };
  } catch (error) {
    console.error("Failed to check permissions:", error);
    return { notifications: false, storage: false };
  }
}
