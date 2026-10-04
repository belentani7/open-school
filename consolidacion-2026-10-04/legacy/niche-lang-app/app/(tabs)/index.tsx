import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useUser } from "@/lib/contexts/user-context";
import { useLessons } from "@/lib/contexts/lessons-context";
import { NICHES } from "@/constants/niches";
import { useRouter } from "expo-router";
import type { NicheType } from "@/shared/types";

export default function HomeScreen() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const { getLessonsByNiche, getLessonProgress, isLoading: lessonsLoading } = useLessons();

  if (userLoading || lessonsLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-lg text-muted">Cargando...</Text>
      </ScreenContainer>
    );
  }

  const subscribedNiches = user?.subscribedNiches || [];
  const displayNiches = subscribedNiches.length > 0 
    ? subscribedNiches.map(id => NICHES[id])
    : [NICHES.logistics, NICHES.medicine];

  const getNextLesson = (nicheId: NicheType) => {
    const lessons = getLessonsByNiche(nicheId);
    return lessons.find((lesson) => getLessonProgress(lesson.id) < 100) ?? lessons[0];
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-primary px-6 pt-6 pb-8">
          <Text className="text-3xl font-bold text-background mb-2">
            ¡Hola, {user?.name || "Estudiante"}!
          </Text>
          <Text className="text-base text-background opacity-90">
            Aprende idiomas en tu profesión
          </Text>
        </View>

        <View className="px-6 py-6 gap-6">
          {/* Stats Card */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-2xl font-bold text-primary">
                  {user?.stats.currentStreak || 0}
                </Text>
                <Text className="text-xs text-muted mt-1">Racha 🔥</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-primary">
                  {user?.stats.totalWordsLearned || 0}
                </Text>
                <Text className="text-xs text-muted mt-1">Palabras</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-primary">
                  {user?.stats.totalLessonsCompleted || 0}
                </Text>
                <Text className="text-xs text-muted mt-1">Lecciones</Text>
              </View>
            </View>
          </View>

          {/* Featured Lesson */}
          {displayNiches.length > 0 && (
            <View>
              <Text className="text-lg font-semibold text-foreground mb-3">Lección del Día</Text>
              {getNextLesson(displayNiches[0].id) && (
                <TouchableOpacity
                  onPress={() =>
                      router.push({
                        pathname: "/lesson/[id]",
                        params: { id: getNextLesson(displayNiches[0].id)?.id ?? "" },
                      })
                  }
                  activeOpacity={0.7}
                >
                  <View className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 border border-border">
                    <Text className="text-sm text-background opacity-80 mb-2">
                      {displayNiches[0].name}
                    </Text>
                    <Text className="text-xl font-bold text-background mb-3">
                      {getNextLesson(displayNiches[0].id)?.title}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm text-background opacity-80">
                        ⏱️ {getNextLesson(displayNiches[0].id)?.duration} min
                      </Text>
                      <View className="bg-background rounded-full px-3 py-1">
                        <Text className="text-primary text-sm font-semibold">Comenzar</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* My Niches */}
          <View>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-semibold text-foreground">Mis Nichos</Text>
              <TouchableOpacity onPress={() => router.push("/niches")}>
                <Text className="text-primary text-sm font-semibold">Ver todos</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={displayNiches}
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              renderItem={({ item }) => {
                const lessons = getLessonsByNiche(item.id);
                const completed = lessons.filter((lesson) => getLessonProgress(lesson.id) === 100).length;
                const total = lessons.length;
                const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

                return (
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/niche/[id]",
                        params: { id: item.id },
                      })
                    }
                    activeOpacity={0.7}
                    className="mr-3 flex-1"
                  >
                    <View className="bg-surface rounded-xl p-4 border border-border">
                      <Text className="text-3xl mb-2">{item.icon}</Text>
                      <Text className="text-sm font-semibold text-foreground mb-1">
                        {item.name}
                      </Text>
                      <Text className="text-xs text-muted mb-3">
                        {completed}/{total} lecciones
                      </Text>
                      <View className="bg-border rounded-full h-1.5 overflow-hidden">
                        <View
                          className="bg-primary h-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item) => item.id}
            />
          </View>

          {/* CTA to add more niches */}
          {subscribedNiches.length === 0 && (
            <TouchableOpacity
              onPress={() => router.push("/niches")}
              activeOpacity={0.7}
            >
              <View className="bg-primary rounded-2xl p-6 items-center">
                <Text className="text-background text-lg font-semibold mb-2">
                  Selecciona tu primer nicho
                </Text>
                <Text className="text-background opacity-80 text-sm text-center">
                  Elige un área profesional para comenzar a aprender
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
