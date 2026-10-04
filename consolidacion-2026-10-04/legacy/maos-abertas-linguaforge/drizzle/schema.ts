import {
  boolean,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const learningProfiles = mysqlTable(
  "learningProfiles",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    uiLocale: varchar("uiLocale", { length: 20 }).default("es").notNull(),
    nativeLanguageCode: varchar("nativeLanguageCode", { length: 12 }).default("es").notNull(),
    targetLanguageCode: varchar("targetLanguageCode", { length: 12 }).default("en").notNull(),
    learningGoal: varchar("learningGoal", { length: 32 }).default("everyday").notNull(),
    companionGoal: varchar("companionGoal", { length: 32 }),
    competencySnapshot: text("competencySnapshot"),
    currentLevel: mysqlEnum("currentLevel", ["A1", "A2", "B1", "B2", "C1", "C2"]).default("A1").notNull(),
    recommendedLevel: mysqlEnum("recommendedLevel", ["A1", "A2", "B1", "B2", "C1", "C2"]),
    xp: int("xp").default(0).notNull(),
    lessonsCompleted: int("lessonsCompleted").default(0).notNull(),
    streakDays: int("streakDays").default(0).notNull(),
    diagnosticCompleted: boolean("diagnosticCompleted").default(false).notNull(),
    lastStudyAt: timestamp("lastStudyAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({ userProfileUnique: uniqueIndex("learningProfilesUserUnique").on(table.userId) }),
);

export const lessonCompletions = mysqlTable(
  "lessonCompletions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    lessonId: varchar("lessonId", { length: 120 }).notNull(),
    score: int("score").default(0).notNull(),
    completedAt: timestamp("completedAt").defaultNow().notNull(),
  },
  (table) => ({
    userLessonUnique: uniqueIndex("lessonCompletionsUserLessonUnique").on(table.userId, table.lessonId),
    userCompletedIndex: index("lessonCompletionsUserCompletedIdx").on(table.userId, table.completedAt),
  }),
);

export const tutorRequests = mysqlTable(
  "tutorRequests",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    targetLanguageCode: varchar("targetLanguageCode", { length: 12 }).notNull(),
    level: varchar("level", { length: 2 }).notNull(),
    goal: varchar("goal", { length: 32 }).notNull(),
    task: varchar("task", { length: 20 }).notNull(),
    promptLength: int("promptLength").notNull(),
    model: varchar("model", { length: 100 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({ userCreatedIndex: index("tutorRequestsUserCreatedIdx").on(table.userId, table.createdAt) }),
);

export const voiceAttempts = mysqlTable(
  "voiceAttempts",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    lessonId: varchar("lessonId", { length: 120 }).notNull(),
    languageCode: varchar("languageCode", { length: 12 }).notNull(),
    storageKey: text("storageKey").notNull(),
    transcript: text("transcript"),
    comparison: text("comparison"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({ userVoiceIndex: index("voiceAttemptsUserCreatedIdx").on(table.userId, table.createdAt) }),
);

export const projectSubmissions = mysqlTable(
  "projectSubmissions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    projectId: varchar("projectId", { length: 120 }).notNull(),
    artifact: text("artifact"),
    reflection: text("reflection"),
    status: mysqlEnum("status", ["draft", "completed"]).default("draft").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({ userProjectUnique: uniqueIndex("projectSubmissionsUserProjectUnique").on(table.userId, table.projectId), userProjectUpdatedIndex: index("projectSubmissionsUserProjectUpdatedIdx").on(table.userId, table.updatedAt) }),
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type LearningProfile = typeof learningProfiles.$inferSelect;
export type ProjectSubmission = typeof projectSubmissions.$inferSelect;
