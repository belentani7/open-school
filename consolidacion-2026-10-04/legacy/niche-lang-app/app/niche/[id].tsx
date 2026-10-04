import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useLessons } from "@/lib/contexts/lessons-context";
import { isNicheType, NICHES } from "@/constants/niches";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";

export default function NicheDetailScreen() {
  const router = useRouter();
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getLessonsByNiche, getLessonProgress } = useLessons();

  if (!id) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-lg text-muted">Nicho no encontrado</Text>
      </ScreenContainer>
    );
  }

  if (!isNicheType(id)) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-lg text-muted">Nicho no encontrado</Text>
      </ScreenContainer>
    );
  }

  const niche = NICHES[id];
  const lessons = getLessonsByNiche(id);

  const totalProgress = lessons.length > 0
    ? Math.round(lessons.reduce((sum, l) => sum + getLessonProgress(l.id), 0) / lessons.length)
    : 0;

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="bg-primary px-6 pt-6 pb-6 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.background} />
        </TouchableOpacity>
        <View className="flex-1 ml-4">
          <Text className="text-2xl font-bold text-background">{niche.name}</Text>
          <Text className="text-sm text-background opacity-80 mt-1">
            {lessons.length} lecciones
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6 gap-4">
          {/* Progress Card */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm font-semibold text-foreground">Progreso General</Text>
              <Text className="text-lg font-bold text-primary">{totalProgress}%</Text>
            </View>
            <View className="bg-border rounded-full h-2 overflow-hidden">
              <View
                className="bg-primary h-full"
                style={{ width: `${totalProgress}%` }}
              />
            </View>
          </View>

          {/* Lessons List */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-3">Lecciones</Text>
            <FlatList
              data={lessons}
              scrollEnabled={false}
              renderItem={({ item, index }) => {
                const progress = getLessonProgress(item.id);
                const isCompleted = item.status === "completed";
                const isLocked = item.status === "locked";

                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (!isLocked) {
                        router.push({
                          pathname: "/lesson/[id]",
                          params: { id: item.id },
                        });
                      }
                    }}
                    activeOpacity={isLocked ? 1 : 0.7}
                    className="mb-3"
                  >
                    <View
                      className={`rounded-xl p-4 border ${
                        isLocked
                          ? "bg-surface border-border opacity-50"
                          : "bg-surface border-border"
                      }`}
                    >
                      <View className="flex-row items-start justify-between">
                        <View className="flex-1">
                          <View className="flex-row items-center gap-2 mb-1">
                            <Text className="text-sm font-semibold text-muted">
                              Lección {index + 1}
                            </Text>
                            {isCompleted && (
                              <MaterialIcons name="check-circle" size={16} color={colors.success} />
                            )}
                            {isLocked && (
                              <MaterialIcons name="lock" size={16} color={colors.muted} />
                            )}
                          </View>
                          <Text className="text-base font-semibold text-foreground mb-2">
                            {item.title}
                          </Text>
                          <Text className="text-sm text-muted mb-2">
                            {item.description}
                          </Text>
                          <View className="flex-row items-center gap-2">
                            <MaterialIcons name="schedule" size={14} color={colors.muted} />
                            <Text className="text-xs text-muted">{item.duration} min</Text>
                          </View>
                        </View>

                        {!isLocked && (
                          <View className="ml-3 items-center">
                            <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
                              <Text className="text-xs font-bold text-background">
                                {progress}%
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>

                      {!isLocked && progress > 0 && (
                        <View className="mt-3 bg-border rounded-full h-1 overflow-hidden">
                          <View
                            className="bg-primary h-full"
                            style={{ width: `${progress}%` }}
                          />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
