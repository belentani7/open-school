import { ScrollView, Text, View, Switch, TouchableOpacity, Alert, Share, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useUser } from "@/lib/contexts/user-context";
import { useEffect, useState } from "react";
import { deleteAllUserData, getUserDataExport, getConsentStatus, setConsentStatus } from "@/lib/services/security";
import { cancelAllNotifications, initializeNotifications, scheduleDailyReminder } from "@/lib/services/notifications";
import { processSyncQueue, retryBlockedSyncActions } from "@/lib/services/sync";

export default function SettingsScreen() {
  const { user, logout } = useUser();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "synced" | "pending">("idle");

  useEffect(() => {
    let mounted = true;
    getConsentStatus().then((status) => {
      if (mounted) setConsentGiven(status);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleExportData = async () => {
    try {
      const data = await getUserDataExport();
      const serialized = JSON.stringify(data, null, 2);
      await Share.share({
        title: "Exportación de datos de NicheLang",
        message: Platform.OS === "web"
          ? `Copia de datos de NicheLang:\n\n${serialized}`
          : serialized,
      });
    } catch {
      Alert.alert("Error", "No se pudieron exportar los datos");
    }
  };

  const handleDeleteData = () => {
    Alert.alert(
      "Eliminar Todos los Datos",
      "¿Estás seguro? Esta acción no se puede deshacer. Se eliminarán todos tus datos, progreso y configuración.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAllUserData();
              Alert.alert("Éxito", "Todos tus datos han sido eliminados");
              logout();
            } catch {
              Alert.alert("Error", "No se pudieron eliminar los datos");
            }
          },
        },
      ]
    );
  };

  const handleRetrySync = async () => {
    setSyncStatus("syncing");
    await retryBlockedSyncActions();
    const synced = await processSyncQueue();
    setSyncStatus(synced ? "synced" : "pending");
  };

  const handleConsentChange = async (value: boolean) => {
    setConsentGiven(value);
    await setConsentStatus(value);
  };

  const handleNotificationsChange = async (value: boolean) => {
    if (!value) {
      await cancelAllNotifications();
      setNotificationsEnabled(false);
      return;
    }

    const granted = await initializeNotifications();
    if (!granted) {
      setNotificationsEnabled(false);
      Alert.alert("Permisos requeridos", "Activa los permisos de notificaciones para recibir recordatorios.");
      return;
    }

    await scheduleDailyReminder(9, 0);
    setNotificationsEnabled(true);
  };

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="bg-primary px-6 pt-6 pb-6">
        <Text className="text-2xl font-bold text-background">Configuración</Text>
        <Text className="text-sm text-background opacity-80 mt-1">
          Personaliza tu experiencia
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6 gap-6">
          {/* User Profile Section */}
          {user && (
            <View>
              <Text className="text-lg font-semibold text-foreground mb-3">Perfil</Text>
              <View className="bg-surface rounded-xl p-4 border border-border gap-3">
                <View>
                  <Text className="text-xs text-muted mb-1">Nombre</Text>
                  <Text className="text-sm font-medium text-foreground">{user.name}</Text>
                </View>
                <View>
                  <Text className="text-xs text-muted mb-1">Email</Text>
                  <Text className="text-sm font-medium text-foreground">{user.email}</Text>
                </View>
                <View>
                  <Text className="text-xs text-muted mb-1">Idioma Base</Text>
                  <Text className="text-sm font-medium text-foreground capitalize">
                    {user.baseLanguage === "es" ? "Español" : "English"}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Notifications Section */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-3">Notificaciones</Text>
            <View className="bg-surface rounded-xl p-4 border border-border gap-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-foreground">Recordatorios Diarios</Text>
                  <Text className="text-xs text-muted mt-1">
                    Recibe una notificación cada día a las 9:00 AM
                  </Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={handleNotificationsChange}
                  accessibilityRole="switch"
                  accessibilityLabel="Recordatorios diarios"
                  accessibilityHint="Activa o desactiva los recordatorios de estudio"
                  trackColor={{ false: "#767577", true: "#81C784" }}
                  thumbColor={notificationsEnabled ? "#4CAF50" : "#f4f3f4"}
                />
              </View>
            </View>
          </View>

          {/* Sync Section */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-3">Sincronización</Text>
            <View className="bg-surface rounded-xl p-4 border border-border gap-3">
              <Text className="text-sm text-muted">
                Tus cambios se guardan primero en el dispositivo y se reintentan cuando hay conexión.
              </Text>
              <TouchableOpacity
                onPress={handleRetrySync}
                disabled={syncStatus === "syncing"}
                accessibilityRole="button"
                accessibilityLabel="Reintentar sincronización"
                accessibilityHint="Envía las acciones locales pendientes al servidor"
                className="py-3 px-4 bg-primary rounded-lg items-center"
              >
                <Text className="text-sm font-semibold text-background">
                  {syncStatus === "syncing" ? "Sincronizando…" : "Reintentar sincronización"}
                </Text>
              </TouchableOpacity>
              {syncStatus !== "idle" && syncStatus !== "syncing" && (
                <Text className="text-xs text-muted text-center">
                  {syncStatus === "synced" ? "Sincronización completada." : "Quedan acciones pendientes; se conservarán para otro intento."}
                </Text>
              )}
            </View>
          </View>

          {/* Privacy & GDPR Section */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-3">Privacidad y Datos</Text>
            <View className="bg-surface rounded-xl p-4 border border-border gap-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-foreground">
                    Consentimiento de Datos
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    Permitir recopilar datos para mejorar la app
                  </Text>
                </View>
                <Switch
                  value={consentGiven}
                  onValueChange={handleConsentChange}
                  accessibilityRole="switch"
                  accessibilityLabel="Consentimiento de datos"
                  accessibilityHint="Permite o revoca la recopilación de datos no esenciales"
                  trackColor={{ false: "#767577", true: "#81C784" }}
                  thumbColor={consentGiven ? "#4CAF50" : "#f4f3f4"}
                />
              </View>

              <View className="border-t border-border pt-4">
                <TouchableOpacity
                  onPress={handleExportData}
                  className="py-3 px-4 bg-primary rounded-lg items-center"
                >
                  <Text className="text-sm font-semibold text-background">
                    📥 Exportar Mis Datos
                  </Text>
                </TouchableOpacity>
                <Text className="text-xs text-muted mt-2 text-center">
                  Descarga una copia de todos tus datos personales (GDPR)
                </Text>
              </View>

              <View>
                <TouchableOpacity
                  onPress={handleDeleteData}
                  className="py-3 px-4 bg-error rounded-lg items-center"
                >
                  <Text className="text-sm font-semibold text-background">
                    🗑️ Eliminar Todos los Datos
                  </Text>
                </TouchableOpacity>
                <Text className="text-xs text-muted mt-2 text-center">
                  Derecho al olvido - Esta acción no se puede deshacer
                </Text>
              </View>
            </View>
          </View>

          {/* App Info Section */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-3">Información</Text>
            <View className="bg-surface rounded-xl p-4 border border-border gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">Versión de la App</Text>
                <Text className="text-sm font-medium text-foreground">1.0.0</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">Plataforma</Text>
                <Text className="text-sm font-medium text-foreground">React Native</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">Última Actualización</Text>
                <Text className="text-sm font-medium text-foreground">Hoy</Text>
              </View>
            </View>
          </View>

          {/* Logout Section */}
          <View>
            <TouchableOpacity
              onPress={() => {
                Alert.alert("Cerrar Sesión", "¿Estás seguro de que deseas cerrar sesión?", [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Cerrar Sesión",
                    style: "destructive",
                    onPress: logout,
                  },
                ]);
              }}
              className="py-3 px-4 bg-error rounded-lg items-center"
            >
              <Text className="text-sm font-semibold text-background">Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>

          {/* Legal Section */}
          <View className="bg-surface rounded-xl p-4 border border-border">
            <Text className="text-xs text-muted text-center leading-relaxed">
              Al usar NicheLang, aceptas nuestros Términos de Servicio y Política de Privacidad.
              Cumplimos con GDPR y protegemos tus datos personales.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
