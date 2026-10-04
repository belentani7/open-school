import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useUser } from "@/lib/contexts/user-context";
import { NICHE_LIST } from "@/constants/niches";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import type { NicheType } from "@/shared/types";

export default function NichesScreen() {
  const router = useRouter();
  const colors = useColors();
  const { user, addNiche, removeNiche } = useUser();

  const subscribedNiches = user?.subscribedNiches || [];

  const toggleNiche = async (nicheId: NicheType) => {
    if (subscribedNiches.includes(nicheId)) {
      await removeNiche(nicheId);
    } else {
      await addNiche(nicheId);
    }
  };

  return (
    <ScreenContainer className="p-0">
      <View className="bg-primary px-6 pt-6 pb-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.background} />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-background flex-1 text-center">
          Mis Nichos
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6">
          <Text className="text-sm text-muted mb-4">
            Selecciona los nichos profesionales en los que quieres aprender
          </Text>

          <FlatList
            data={NICHE_LIST}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 12 }}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const isSelected = subscribedNiches.includes(item.id);

              return (
                <TouchableOpacity
                  onPress={() => toggleNiche(item.id)}
                  activeOpacity={0.7}
                  className="flex-1 mr-2"
                >
                  <View
                    className={`rounded-2xl p-4 border-2 items-center justify-center h-40 ${
                      isSelected
                        ? "bg-primary border-primary"
                        : "bg-surface border-border"
                    }`}
                  >
                    <Text className="text-5xl mb-2">{item.icon}</Text>
                    <Text
                      className={`text-sm font-semibold text-center ${
                        isSelected ? "text-background" : "text-foreground"
                      }`}
                    >
                      {item.name}
                    </Text>
                    <Text
                      className={`text-xs mt-1 text-center ${
                        isSelected ? "text-background opacity-80" : "text-muted"
                      }`}
                    >
                      {item.lessonsCount} lecciones
                    </Text>

                    {isSelected && (
                      <View className="absolute top-2 right-2 bg-background rounded-full p-1">
                        <MaterialIcons name="check" size={16} color={colors.primary} />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.id}
          />

          {subscribedNiches.length > 0 && (
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              className="mt-6"
            >
              <View className="bg-primary rounded-xl py-4 items-center">
                <Text className="text-background font-semibold text-base">
                  Continuar ({subscribedNiches.length} seleccionado{subscribedNiches.length !== 1 ? "s" : ""})
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
