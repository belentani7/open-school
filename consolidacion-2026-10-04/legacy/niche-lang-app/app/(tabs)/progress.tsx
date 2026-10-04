import { ScrollView, Text, View, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useUser } from "@/lib/contexts/user-context";
import { useLessons } from "@/lib/contexts/lessons-context";
import { NICHES } from "@/constants/niches";

export default function ProgressScreen() {
  const { user } = useUser();
  const { lessons } = useLessons();

  const stats = user?.stats || {
    userId: "",
    totalWordsLearned: 0,
    totalLessonsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalMinutesSpent: 0,
    lastActivityDate: new Date(),
  };

  // Calculate overall progress
  const allLessons = Object.values(lessons).flat();
  const completedLessons = allLessons.filter((l) => l.status === "completed").length;
  const totalLessons = allLessons.length;
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Get achievements
  const achievements = [
    {
      id: "first-day",
      name: "Primer Día",
      icon: "🎯",
      unlocked: stats.totalLessonsCompleted > 0,
      description: "Completaste tu primera lección",
    },
    {
      id: "streak-7",
      name: "Racha de 7 Días",
      icon: "🔥",
      unlocked: stats.currentStreak >= 7,
      description: "Estudiaste 7 días seguidos",
    },
    {
      id: "words-100",
      name: "100 Palabras",
      icon: "📚",
      unlocked: stats.totalWordsLearned >= 100,
      description: "Aprendiste 100 palabras",
    },
    {
      id: "lessons-10",
      name: "10 Lecciones",
      icon: "⭐",
      unlocked: stats.totalLessonsCompleted >= 10,
      description: "Completaste 10 lecciones",
    },
  ];

  // Progress by niche
  const progressByNiche = (user?.subscribedNiches || []).map((nicheId) => {
    const niche = NICHES[nicheId];
    const nicheLessons = lessons[nicheId] || [];
    const completed = nicheLessons.filter((l) => l.status === "completed").length;
    const total = nicheLessons.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { niche, completed, total, percentage };
  });

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="bg-primary px-6 pt-6 pb-6">
        <Text className="text-2xl font-bold text-background">Mi Progreso</Text>
        <Text className="text-sm text-background opacity-80 mt-1">
          Sigue tu avance en el aprendizaje
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6 gap-6">
          {/* Overall Stats */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-3">Estadísticas Generales</Text>
            <View className="grid grid-cols-2 gap-3">
              <View className="bg-surface rounded-2xl p-4 border border-border">
                <Text className="text-3xl font-bold text-primary mb-1">
                  {stats.totalLessonsCompleted}
                </Text>
                <Text className="text-xs text-muted">Lecciones completadas</Text>
              </View>
              <View className="bg-surface rounded-2xl p-4 border border-border">
                <Text className="text-3xl font-bold text-primary mb-1">
                  {stats.totalWordsLearned}
                </Text>
                <Text className="text-xs text-muted">Palabras aprendidas</Text>
              </View>
              <View className="bg-surface rounded-2xl p-4 border border-border">
                <Text className="text-3xl font-bold text-secondary mb-1">
                  {stats.currentStreak}
                </Text>
                <Text className="text-xs text-muted">Racha actual 🔥</Text>
              </View>
              <View className="bg-surface rounded-2xl p-4 border border-border">
                <Text className="text-3xl font-bold text-primary mb-1">
                  {stats.totalMinutesSpent}
                </Text>
                <Text className="text-xs text-muted">Minutos estudiados</Text>
              </View>
            </View>
          </View>

          {/* Overall Progress */}
          <View>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-semibold text-foreground">Progreso General</Text>
              <Text className="text-lg font-bold text-primary">{overallProgress}%</Text>
            </View>
            <View className="bg-border rounded-full h-3 overflow-hidden">
              <View
                className="bg-primary h-full"
                style={{ width: `${overallProgress}%` }}
              />
            </View>
          </View>

          {/* Progress by Niche */}
          {progressByNiche.length > 0 && (
            <View>
              <Text className="text-lg font-semibold text-foreground mb-3">Progreso por Nicho</Text>
              <FlatList
                data={progressByNiche}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View className="bg-surface rounded-xl p-4 border border-border mb-3">
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-2xl">{item.niche.icon}</Text>
                        <View>
                          <Text className="text-sm font-semibold text-foreground">
                            {item.niche.name}
                          </Text>
                          <Text className="text-xs text-muted">
                            {item.completed}/{item.total} lecciones
                          </Text>
                        </View>
                      </View>
                      <Text className="text-lg font-bold text-primary">{item.percentage}%</Text>
                    </View>
                    <View className="bg-border rounded-full h-2 overflow-hidden">
                      <View
                        className="bg-primary h-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.niche.id}
              />
            </View>
          )}

          {/* Achievements */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-3">Logros</Text>
            <FlatList
              data={achievements}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 12 }}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View
                  className={`flex-1 mr-2 rounded-2xl p-4 border items-center justify-center h-32 ${
                    item.unlocked
                      ? "bg-primary border-primary"
                      : "bg-surface border-border opacity-50"
                  }`}
                >
                  <Text className="text-4xl mb-2">{item.icon}</Text>
                  <Text
                    className={`text-xs font-semibold text-center ${
                      item.unlocked ? "text-background" : "text-foreground"
                    }`}
                  >
                    {item.name}
                  </Text>
                  <Text
                    className={`text-xs text-center mt-1 ${
                      item.unlocked ? "text-background opacity-80" : "text-muted"
                    }`}
                  >
                    {item.description}
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
