import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import {
  CEFR_LEVELS,
  CURRICULUM_LESSONS,
  LANGUAGE_CATALOG,
  LEARNING_GOALS,
  getLessons,
  recommendInstitutionalPath,
  type CompetencySignals,
  type LearningGoalId,
} from "../shared/institution";
import { LEARNING_PROJECTS } from "../shared/content";
import {
  completeLesson,
  countTutorRequestsToday,
  getCompletedLessonIds,
  getLearningProfile,
  getProjectSubmissions,
  recordTutorRequest,
  recordVoiceAttempt,
  saveProjectSubmission,
  updateLearningProfile,
} from "./db";
import { requestEducationalAi } from "./aiCore";
import { storageGetSignedUrl, storagePut } from "./storage";
import { transcribeAudio } from "./_core/voiceTranscription";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

const languageCode = z.string().trim().min(2).max(12);
const cefrCode = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]);
const goalId = z.enum(["everyday", "technology", "coding", "ai-literacy", "digital-citizenship", "professional-pathways"]);
const competencySignals = z.object({ communication: z.number().min(0).max(100), digital: z.number().min(0).max(100), creation: z.number().min(0).max(100), critical: z.number().min(0).max(100), pathway: z.number().min(0).max(100) });

function recommendationFor(score: number) {
  if (score >= 88) return "C1" as const;
  if (score >= 72) return "B2" as const;
  if (score >= 56) return "B1" as const;
  if (score >= 38) return "A2" as const;
  return "A1" as const;
}

function comparisonFor(transcript: string, expected: string) {
  const words = transcript.trim().split(/\s+/).filter(Boolean).length;
  if (!transcript.trim()) return "No se recibió una transcripción. Prueba otra vez o revisa los permisos del micrófono.";
  return `Tu respuesta tiene aproximadamente ${words} palabras. Compárala con el resultado esperado: ${expected} La herramienta transcribe el contenido; no certifica pronunciación ni nivel.`;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  institution: router({
    languages: publicProcedure.query(() => LANGUAGE_CATALOG),
    levels: publicProcedure.query(() => CEFR_LEVELS),
    goals: publicProcedure.query(() => LEARNING_GOALS),
    projects: publicProcedure.input(z.object({ goal: goalId.optional() }).optional()).query(({ input }) => LEARNING_PROJECTS.filter((project) => !input?.goal || project.goalId === input.goal)),
    lessons: publicProcedure.input(z.object({ goal: goalId.optional(), level: cefrCode.optional() }).optional())
      .query(({ input }) => CURRICULUM_LESSONS.filter((lesson) => (!input?.goal || lesson.goalId === input.goal) && (!input?.level || lesson.level === input.level))),
    lesson: publicProcedure.input(z.object({ id: z.string().min(3).max(120) })).query(({ input }) => {
      const lesson = CURRICULUM_LESSONS.find((item) => item.id === input.id);
      if (!lesson) throw new TRPCError({ code: "NOT_FOUND", message: "Lección no encontrada." });
      return lesson;
    }),
  }),
  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const [profile, completedLessonIds, projectSubmissions] = await Promise.all([getLearningProfile(ctx.user.id), getCompletedLessonIds(ctx.user.id), getProjectSubmissions(ctx.user.id)]);
      const nextLesson = getLessons(profile.learningGoal as LearningGoalId, profile.currentLevel as "A1" | "A2" | "B1" | "B2" | "C1" | "C2")
        .find((lesson) => !completedLessonIds.includes(lesson.id)) ?? CURRICULUM_LESSONS.find((lesson) => !completedLessonIds.includes(lesson.id));
      return { ...profile, completedLessonIds, projectSubmissions, nextLesson };
    }),
    update: protectedProcedure.input(z.object({
      uiLocale: languageCode.optional(), nativeLanguageCode: languageCode.optional(), targetLanguageCode: languageCode.optional(),
      learningGoal: goalId.optional(), companionGoal: goalId.optional(), competencySnapshot: z.string().max(4_000).optional(), currentLevel: cefrCode.optional(),
    })).mutation(({ ctx, input }) => updateLearningProfile(ctx.user.id, input)),
  }),
  diagnostic: router({
    complete: protectedProcedure.input(z.object({
      targetLanguageCode: languageCode,
      learningGoal: goalId,
      scores: z.object({ comprehension: z.number().min(0).max(100), expression: z.number().min(0).max(100), interaction: z.number().min(0).max(100) }),
      competencies: competencySignals.optional(),
    })).mutation(async ({ ctx, input }) => {
      const average = Math.round((input.scores.comprehension + input.scores.expression + input.scores.interaction) / 3);
      const recommendedLevel = recommendationFor(average);
      const competencies = (input.competencies ?? { communication: 50, digital: 50, creation: 50, critical: 50, pathway: 50 }) as CompetencySignals;
      const recommendation = recommendInstitutionalPath(competencies);
      const profile = await updateLearningProfile(ctx.user.id, { targetLanguageCode: input.targetLanguageCode, learningGoal: input.learningGoal, companionGoal: recommendation.companionGoal, competencySnapshot: JSON.stringify(competencies), currentLevel: recommendedLevel, recommendedLevel, diagnosticCompleted: true });
      return { recommendedLevel, average, recommendation, profile };
    }),
  }),
  learning: router({
    complete: protectedProcedure.input(z.object({ lessonId: z.string().min(3).max(120), score: z.number().min(0).max(100) }))
      .mutation(async ({ ctx, input }) => {
        const lesson = CURRICULUM_LESSONS.find((item) => item.id === input.lessonId);
        if (!lesson) throw new TRPCError({ code: "NOT_FOUND", message: "La lección indicada no existe." });
        return completeLesson(ctx.user.id, input.lessonId, input.score);
      }),
  }),
  projects: router({
    mine: protectedProcedure.query(({ ctx }) => getProjectSubmissions(ctx.user.id)),
    save: protectedProcedure.input(z.object({ projectId: z.string().min(3).max(120), artifact: z.string().trim().min(20).max(8_000), reflection: z.string().trim().min(12).max(4_000), status: z.enum(["draft", "completed"]) })).mutation(async ({ ctx, input }) => {
      if (!LEARNING_PROJECTS.some((project) => project.id === input.projectId)) throw new TRPCError({ code: "NOT_FOUND", message: "El desafío de proyecto no existe." });
      return saveProjectSubmission({ userId: ctx.user.id, ...input });
    }),
  }),
  tutor: router({
    respond: protectedProcedure.input(z.object({
      message: z.string().trim().min(4).max(1000),
      task: z.enum(["explain", "practice", "review"]),
    })).mutation(async ({ ctx, input }) => {
      const dailyLimit = 12;
      const usedToday = await countTutorRequestsToday(ctx.user.id);
      if (usedToday >= dailyLimit) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Has alcanzado el límite diario del tutor educativo." });
      const profile = await getLearningProfile(ctx.user.id);
      const response = await requestEducationalAi({
        supportLanguage: profile.nativeLanguageCode,
        targetLanguage: profile.targetLanguageCode,
        cefrLevel: profile.currentLevel,
        learningGoal: profile.learningGoal,
        task: input.task,
        message: input.message,
      });
      await recordTutorRequest({ userId: ctx.user.id, targetLanguageCode: profile.targetLanguageCode, level: profile.currentLevel, goal: profile.learningGoal, task: input.task, promptLength: input.message.length, model: response.model });
      return { answer: response.answer, mode: response.mode, remainingToday: Math.max(0, dailyLimit - usedToday - 1) };
    }),
  }),
  voice: router({
    transcribe: protectedProcedure.input(z.object({
      lessonId: z.string().min(3).max(120),
      mimeType: z.enum(["audio/webm", "audio/ogg", "audio/wav", "audio/mpeg", "audio/mp4"]),
      base64Audio: z.string().min(32).max(22_000_000),
    })).mutation(async ({ ctx, input }) => {
      const lesson = CURRICULUM_LESSONS.find((item) => item.id === input.lessonId);
      if (!lesson) throw new TRPCError({ code: "NOT_FOUND", message: "No encontramos la lección de esta práctica." });
      const audioBuffer = Buffer.from(input.base64Audio, "base64");
      if (!audioBuffer.length || audioBuffer.length > 16 * 1024 * 1024) throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "La grabación debe ocupar 16 MB o menos." });
      const extension = input.mimeType === "audio/wav" ? "wav" : input.mimeType === "audio/mpeg" ? "mp3" : input.mimeType === "audio/mp4" ? "m4a" : input.mimeType === "audio/ogg" ? "ogg" : "webm";
      const stored = await storagePut(`voice-practice/${ctx.user.id}/${lesson.id}.${extension}`, audioBuffer, input.mimeType);
      const audioUrl = await storageGetSignedUrl(stored.key);
      const profile = await getLearningProfile(ctx.user.id);
      const transcription = await transcribeAudio({ audioUrl, language: profile.targetLanguageCode, prompt: `Práctica oral educativa para la lección: ${lesson.title}.` });
      if ("error" in transcription) {
        throw new TRPCError({ code: "BAD_REQUEST", message: transcription.error, cause: transcription });
      }
      const transcript = transcription.text ?? "";
      const comparison = comparisonFor(transcript, lesson.expected);
      await recordVoiceAttempt({ userId: ctx.user.id, lessonId: lesson.id, languageCode: profile.targetLanguageCode, storageKey: stored.key, transcript, comparison });
      return { transcript, comparison, language: transcription.language ?? profile.targetLanguageCode };
    }),
  }),
});

export type AppRouter = typeof appRouter;
