import { ScrollView, Text, View, TouchableOpacity, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useLessons } from "@/lib/contexts/lessons-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import { useEffect, useState } from "react";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";

export default function LessonScreen() {
  const router = useRouter();
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getLessonById, updateLessonProgress, completeLesson } = useLessons();
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [exerciseSubmitted, setExerciseSubmitted] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setExerciseSubmitted(false);
  }, [currentModuleIndex]);

  if (!id) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-lg text-muted">Lección no encontrada</Text>
      </ScreenContainer>
    );
  }

  const lesson = getLessonById(id);

  if (!lesson) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-lg text-muted">Lección no encontrada</Text>
      </ScreenContainer>
    );
  }

  const currentModule = lesson.modules[currentModuleIndex];
  const isLastModule = currentModuleIndex === lesson.modules.length - 1;
  const isFirstModule = currentModuleIndex === 0;

  const handleNext = async () => {
    if (currentModule.type === "exercise" && !exerciseSubmitted) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    await updateLessonProgress(lesson.id, currentModule.id, true);

    if (!isLastModule) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }

    await completeLesson(lesson.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const handlePrevious = () => {
    if (!isFirstModule) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleAnswer = (answer: string) => {
    if (exerciseSubmitted || currentModule.type !== "exercise") return;
    setSelectedAnswer(answer);
    setExerciseSubmitted(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="bg-primary px-6 pt-6 pb-4 flex-row items-center justify-between">
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Cerrar lección"
            onPress={() => router.back()}
          >
          <MaterialIcons name="close" size={24} color={colors.background} />
        </TouchableOpacity>
        <View className="flex-1 mx-4">
          <Text className="text-sm text-background opacity-80">
            Módulo {currentModuleIndex + 1} de {lesson.modules.length}
          </Text>
          <View className="bg-background rounded-full h-1 mt-2 overflow-hidden">
            <View
              className="bg-secondary h-full"
              style={{
                width: `${((currentModuleIndex + 1) / lesson.modules.length) * 100}%`,
              }}
            />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6">
          {/* Module Title */}
          <Text className="text-2xl font-bold text-foreground mb-4">
            {currentModule.title}
          </Text>

          {/* Module Content */}
          <View className="bg-surface rounded-2xl p-6 border border-border mb-6">
            {currentModule.type === "introduction" && (
              <View>
                <Text className="text-base text-foreground leading-relaxed">
                  {currentModule.content}
                </Text>
              </View>
            )}

            {currentModule.type === "vocabulary" && (
              <View className="gap-4">
                {currentModule.content.map((item, idx) => (
                  <View
                    key={idx}
                    className="bg-background rounded-xl p-4 border border-border"
                  >
                    <View className="flex-row items-start justify-between mb-2">
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-foreground">
                          {item.word}
                        </Text>
                        <Text className="text-sm text-muted italic mt-1">
                          {item.pronunciation}
                        </Text>
                      </View>
                      <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel={`Escuchar pronunciación de ${item.word}`}
                        onPress={async () => {
                          const speaking = await Speech.isSpeakingAsync();
                          if (speaking) await Speech.stop();
                          Speech.speak(item.word, { language: "en-US", rate: 0.9 });
                        }}
                      >
                        <MaterialIcons name="volume-up" size={20} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                    <View className="border-t border-border pt-3 mt-3">
                      <Text className="text-sm text-muted mb-2">Traducción:</Text>
                      <Text className="text-base font-semibold text-foreground mb-3">
                        {item.translation}
                      </Text>
                      <Text className="text-xs text-muted mb-1">Ejemplo:</Text>
                      <Text className="text-sm text-foreground italic mb-2">
                        {item.example}
                      </Text>
                      <Text className="text-sm text-muted">
                        {item.exampleTranslation}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {currentModule.type === "dialogue" && (
              <View className="gap-3">
                {currentModule.content.lines.map((line, idx) => (
                  <View
                    key={idx}
                    className={`p-4 rounded-xl ${
                      line.speaker === "Customer"
                        ? "bg-primary"
                        : "bg-secondary"
                    }`}
                  >
                    <Text className="text-xs font-semibold text-background opacity-80 mb-1">
                      {line.speaker}
                    </Text>
                    <Text className="text-base text-background font-medium">
                      {line.text}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {currentModule.type === "exercise" && (
              <View>
                <Text className="text-base text-foreground mb-4">
                  {currentModule.content.question}
                </Text>
                <View className="gap-2">
                  {currentModule.content.options.map((option: string, idx: number) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrect = option === currentModule.content.correctAnswer;
                    const showCorrect = exerciseSubmitted && isCorrect;
                    const showIncorrect = exerciseSubmitted && isSelected && !isCorrect;

                    return (
                      <Pressable
                        key={idx}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: isSelected }}
                        accessibilityLabel={`Respuesta: ${option}`}
                        onPress={() => handleAnswer(option)}
                      >
                        {({ pressed }) => (
                          <View
                            className={`p-4 rounded-xl border-2 ${
                              showCorrect
                                ? "bg-success border-success"
                                : showIncorrect
                                  ? "bg-error border-error"
                                  : isSelected || pressed
                                    ? "bg-primary border-primary"
                                    : "bg-background border-border"
                            }`}
                          >
                            <Text
                              className={`text-base font-medium ${
                                showCorrect || showIncorrect || isSelected || pressed
                                  ? "text-background"
                                  : "text-foreground"
                              }`}
                            >
                              {option}
                            </Text>
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
                {exerciseSubmitted && (
                  <View className="mt-4 rounded-xl bg-background border border-border p-4">
                    <Text className="text-sm font-semibold text-foreground">
                      {selectedAnswer === currentModule.content.correctAnswer ? "¡Correcto!" : "Revisa la respuesta"}
                    </Text>
                    <Text className="text-sm text-muted mt-1">
                      {currentModule.content.explanation ?? "Puedes continuar para avanzar."}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {currentModule.type === "summary" && (
              <View>
                <Text className="text-base text-foreground mb-4">
                  ¡Excelente trabajo! Has completado esta lección.
                </Text>
                <View className="bg-success bg-opacity-10 rounded-xl p-4 border border-success">
                  <Text className="text-sm text-success font-semibold">
                    ✓ Lección completada
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View className="px-6 pb-6 gap-3 flex-row">
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Módulo anterior"
          onPress={handlePrevious}
          disabled={isFirstModule}
          activeOpacity={0.7}
          className="flex-1"
        >
          <View
            className={`py-3 rounded-xl items-center ${
              isFirstModule
                ? "bg-surface border border-border opacity-50"
                : "bg-surface border border-border"
            }`}
          >
            <Text className="text-foreground font-semibold">Anterior</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={isLastModule ? "Completar lección" : "Siguiente módulo"}
          onPress={handleNext}
          activeOpacity={0.7}
          className="flex-1"
        >
          <View className="bg-primary py-3 rounded-xl items-center">
            <Text className="text-background font-semibold">
              {isLastModule ? "Completar" : "Siguiente"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
