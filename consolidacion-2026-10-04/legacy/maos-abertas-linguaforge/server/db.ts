import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  type InsertUser,
  lessonCompletions,
  learningProfiles,
  projectSubmissions,
  tutorRequests,
  users,
  voiceAttempts,
} from "../drizzle/schema";
import type { CefrCode, LearningGoalId } from "../shared/institution";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId, lastSignedIn: new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: new Date() };
  if (user.name !== undefined) { values.name = user.name; updateSet.name = user.name; }
  if (user.email !== undefined) { values.email = user.email; updateSet.email = user.email; }
  if (user.loginMethod !== undefined) { values.loginMethod = user.loginMethod; updateSet.loginMethod = user.loginMethod; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return rows[0];
}

const defaultProfile = {
  uiLocale: "es",
  nativeLanguageCode: "es",
  targetLanguageCode: "en",
  learningGoal: "everyday",
  companionGoal: null,
  competencySnapshot: null,
  currentLevel: "A1",
  recommendedLevel: null,
  xp: 0,
  lessonsCompleted: 0,
  streakDays: 0,
  diagnosticCompleted: false,
  lastStudyAt: null,
};

export async function getLearningProfile(userId: number) {
  const db = await getDb();
  if (!db) return { ...defaultProfile, id: 0, userId };
  const rows = await db.select().from(learningProfiles).where(eq(learningProfiles.userId, userId)).limit(1);
  if (rows[0]) return rows[0];
  await db.insert(learningProfiles).values({ userId });
  const created = await db.select().from(learningProfiles).where(eq(learningProfiles.userId, userId)).limit(1);
  return created[0] ?? { ...defaultProfile, id: 0, userId };
}

export async function updateLearningProfile(
  userId: number,
  input: Partial<{
    uiLocale: string;
    nativeLanguageCode: string;
    targetLanguageCode: string;
    learningGoal: LearningGoalId;
    companionGoal: LearningGoalId;
    competencySnapshot: string;
    currentLevel: CefrCode;
    recommendedLevel: CefrCode;
    diagnosticCompleted: boolean;
  }>,
) {
  const db = await getDb();
  if (!db) return { ...defaultProfile, id: 0, userId, ...input };
  await getLearningProfile(userId);
  await db.update(learningProfiles).set(input).where(eq(learningProfiles.userId, userId));
  return getLearningProfile(userId);
}

export async function getCompletedLessonIds(userId: number) {
  const db = await getDb();
  if (!db) return [] as string[];
  const rows = await db.select({ lessonId: lessonCompletions.lessonId }).from(lessonCompletions).where(eq(lessonCompletions.userId, userId));
  return rows.map((row) => row.lessonId);
}

export async function completeLesson(userId: number, lessonId: string, score: number) {
  const db = await getDb();
  if (!db) return { newlyCompleted: true, profile: await getLearningProfile(userId) };
  const existing = await db.select({ id: lessonCompletions.id }).from(lessonCompletions)
    .where(and(eq(lessonCompletions.userId, userId), eq(lessonCompletions.lessonId, lessonId))).limit(1);
  if (!existing[0]) {
    await db.insert(lessonCompletions).values({ userId, lessonId, score });
    const profile = await getLearningProfile(userId);
    await db.update(learningProfiles).set({
      xp: profile.xp + Math.max(10, Math.round(score / 2)),
      lessonsCompleted: profile.lessonsCompleted + 1,
      streakDays: Math.max(1, profile.streakDays),
      lastStudyAt: new Date(),
    }).where(eq(learningProfiles.userId, userId));
    return { newlyCompleted: true, profile: await getLearningProfile(userId) };
  }
  return { newlyCompleted: false, profile: await getLearningProfile(userId) };
}

export async function getProjectSubmissions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projectSubmissions).where(eq(projectSubmissions.userId, userId)).orderBy(desc(projectSubmissions.updatedAt));
}

export async function saveProjectSubmission(input: {
  userId: number;
  projectId: string;
  artifact: string;
  reflection: string;
  status: "draft" | "completed";
}) {
  const db = await getDb();
  if (!db) return { id: 0, ...input, createdAt: new Date(), updatedAt: new Date() };
  await db.insert(projectSubmissions).values(input).onDuplicateKeyUpdate({ set: { artifact: input.artifact, reflection: input.reflection, status: input.status } });
  const rows = await db.select().from(projectSubmissions).where(and(eq(projectSubmissions.userId, input.userId), eq(projectSubmissions.projectId, input.projectId))).limit(1);
  return rows[0];
}

export async function countTutorRequestsToday(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db.select().from(tutorRequests).where(eq(tutorRequests.userId, userId)).orderBy(desc(tutorRequests.createdAt));
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return rows.filter((request) => request.createdAt >= start).length;
}

export async function recordTutorRequest(input: {
  userId: number;
  targetLanguageCode: string;
  level: string;
  goal: string;
  task: string;
  promptLength: number;
  model: string;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(tutorRequests).values(input);
}

export async function recordVoiceAttempt(input: {
  userId: number;
  lessonId: string;
  languageCode: string;
  storageKey: string;
  transcript: string;
  comparison: string;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(voiceAttempts).values(input);
}
