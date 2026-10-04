import {
  index,
  int,
  json,
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

export const studentProfiles = mysqlTable("student_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  preferredLocale: mysqlEnum("preferredLocale", ["es", "pt", "en"]).default("es").notNull(),
  bio: text("bio"),
  headline: varchar("headline", { length: 180 }),
  portfolioSlug: varchar("portfolioSlug", { length: 96 }).unique(),
  portfolioPublic: int("portfolioPublic").default(0).notNull(),
  onboardingComplete: int("onboardingComplete").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const academicPrograms = mysqlTable("academic_programs", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 32 }).notNull(),
  currentVersion: varchar("currentVersion", { length: 24 }).notNull(),
  internalCreditName: varchar("internalCreditName", { length: 80 }).default("Créditos Académicos Internos (CA)").notNull(),
  totalCredits: int("totalCredits").notNull(),
  active: int("active").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [uniqueIndex("academic_programs_code_unique").on(table.code)]);

export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  programId: int("programId").notNull().references(() => academicPrograms.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 24 }).notNull(),
  semester: int("semester").notNull(),
  credits: int("credits").notNull(),
  estimatedHours: int("estimatedHours").notNull(),
  masteryEntry: mysqlEnum("masteryEntry", ["A", "B", "C", "D", "E", "F"]).notNull(),
  masteryExit: mysqlEnum("masteryExit", ["A", "B", "C", "D", "E", "F"]).notNull(),
  track: mysqlEnum("track", ["foundation", "software", "ai", "cloud", "cybersecurity", "research", "creative"]).notNull(),
  academicStatus: mysqlEnum("academicStatus", ["draft", "published", "archived"]).default("published").notNull(),
  assessmentWeights: json("assessmentWeights").$type<Record<string, number>>().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  uniqueIndex("courses_program_code_unique").on(table.programId, table.code),
  index("courses_semester_idx").on(table.semester),
  index("courses_track_idx").on(table.track),
]);

export const courseTranslations = mysqlTable("course_translations", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull().references(() => courses.id, { onDelete: "cascade" }),
  locale: mysqlEnum("locale", ["es", "pt", "en"]).notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  summary: text("summary").notNull(),
  objectives: json("objectives").$type<string[]>().notNull(),
  competencies: json("competencies").$type<string[]>().notNull(),
  syllabus: json("syllabus").$type<string[]>().notNull(),
  exercises: json("exercises").$type<string[]>().notNull(),
  labBrief: text("labBrief").notNull(),
  projectBrief: text("projectBrief").notNull(),
  rubric: json("rubric").$type<Array<{ criterion: string; weight: number; description: string }>>().notNull(),
  aiUsePolicy: text("aiUsePolicy").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [uniqueIndex("course_translations_course_locale_unique").on(table.courseId, table.locale)]);

export const courseResources = mysqlTable("course_resources", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull().references(() => courses.id, { onDelete: "cascade" }),
  locale: mysqlEnum("locale", ["es", "pt", "en"]).notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  url: varchar("url", { length: 2048 }).notNull(),
  resourceType: mysqlEnum("resourceType", ["official_docs", "book", "university", "paper", "repository", "dataset", "lab", "video"]).notNull(),
  accessType: mysqlEnum("accessType", ["free", "open_source", "commercial"]).default("free").notNull(),
  license: varchar("license", { length: 160 }),
  note: text("note"),
  active: int("active").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [index("course_resources_course_idx").on(table.courseId)]);

export const coursePrerequisites = mysqlTable("course_prerequisites", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull().references(() => courses.id, { onDelete: "cascade" }),
  prerequisiteCourseId: int("prerequisiteCourseId").notNull().references(() => courses.id, { onDelete: "cascade" }),
  minimumGrade: int("minimumGrade").default(65).notNull(),
}, table => [
  uniqueIndex("course_prerequisites_unique").on(table.courseId, table.prerequisiteCourseId),
  index("course_prerequisites_course_idx").on(table.courseId),
]);

export const enrollments = mysqlTable("enrollments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseId: int("courseId").notNull().references(() => courses.id, { onDelete: "cascade" }),
  status: mysqlEnum("status", ["planned", "in_progress", "completed", "blocked", "withdrawn"]).default("planned").notNull(),
  progressPercent: int("progressPercent").default(0).notNull(),
  finalGrade: int("finalGrade"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  uniqueIndex("enrollments_user_course_unique").on(table.userId, table.courseId),
  index("enrollments_user_status_idx").on(table.userId, table.status),
]);

export const assessmentItems = mysqlTable("assessment_items", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull().references(() => courses.id, { onDelete: "cascade" }),
  assessmentType: mysqlEnum("assessmentType", ["quiz", "practice", "lab", "project", "research", "defense"]).notNull(),
  weight: int("weight").notNull(),
  maximumScore: int("maximumScore").default(100).notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  dueAt: timestamp("dueAt"),
  position: int("position").default(0).notNull(),
});

export const assessmentSubmissions = mysqlTable("assessment_submissions", {
  id: int("id").autoincrement().primaryKey(),
  assessmentItemId: int("assessmentItemId").notNull().references(() => assessmentItems.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  score: int("score"),
  feedback: text("feedback"),
  submittedAt: timestamp("submittedAt"),
  gradedAt: timestamp("gradedAt"),
  gradedByUserId: int("gradedByUserId").references(() => users.id, { onDelete: "set null" }),
}, table => [uniqueIndex("assessment_submissions_item_user_unique").on(table.assessmentItemId, table.userId)]);

export const competencies = mysqlTable("competencies", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 48 }).notNull(),
  domain: mysqlEnum("domain", ["software", "ai", "cloud", "cybersecurity", "research", "professional"]).notNull(),
  name: varchar("name", { length: 180 }).notNull(),
  description: text("description").notNull(),
}, table => [uniqueIndex("competencies_code_unique").on(table.code)]);

export const studentCompetencies = mysqlTable("student_competencies", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  competencyId: int("competencyId").notNull().references(() => competencies.id, { onDelete: "cascade" }),
  masteryLevel: mysqlEnum("masteryLevel", ["A", "B", "C", "D", "E", "F"]).notNull(),
  evidenceUrl: varchar("evidenceUrl", { length: 2048 }),
  verifiedAt: timestamp("verifiedAt"),
}, table => [uniqueIndex("student_competencies_user_competency_unique").on(table.userId, table.competencyId)]);

export const studentProjects = mysqlTable("student_projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseId: int("courseId").references(() => courses.id, { onDelete: "set null" }),
  title: varchar("title", { length: 220 }).notNull(),
  summary: text("summary").notNull(),
  repositoryUrl: varchar("repositoryUrl", { length: 2048 }),
  demoUrl: varchar("demoUrl", { length: 2048 }),
  coverFileKey: varchar("coverFileKey", { length: 512 }),
  visibility: mysqlEnum("visibility", ["private", "public"]).default("private").notNull(),
  technologies: json("technologies").$type<string[]>().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [index("student_projects_user_visibility_idx").on(table.userId, table.visibility)]);

export const fileReferences = mysqlTable("file_references", {
  id: int("id").autoincrement().primaryKey(),
  ownerUserId: int("ownerUserId").references(() => users.id, { onDelete: "set null" }),
  projectId: int("projectId").references(() => studentProjects.id, { onDelete: "cascade" }),
  storageKey: varchar("storageKey", { length: 512 }).notNull(),
  displayName: varchar("displayName", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 128 }).notNull(),
  sizeBytes: int("sizeBytes").notNull(),
  accessLevel: mysqlEnum("accessLevel", ["private", "course", "public"]).default("private").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [uniqueIndex("file_references_storage_key_unique").on(table.storageKey)]);

export const certificates = mysqlTable("certificates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  certificateType: mysqlEnum("certificateType", ["completion", "competency", "specialization", "professional_project", "research_project"]).notNull(),
  verificationCode: varchar("verificationCode", { length: 64 }).notNull(),
  programVersion: varchar("programVersion", { length: 24 }).notNull(),
  awardedCredits: int("awardedCredits").notNull(),
  competencySnapshot: json("competencySnapshot").$type<string[]>().notNull(),
  issuedAt: timestamp("issuedAt").defaultNow().notNull(),
  revokedAt: timestamp("revokedAt"),
}, table => [uniqueIndex("certificates_verification_code_unique").on(table.verificationCode)]);

export const curriculumChangeProposals = mysqlTable("curriculum_change_proposals", {
  id: int("id").autoincrement().primaryKey(),
  sourceUrl: varchar("sourceUrl", { length: 2048 }).notNull(),
  sourceType: mysqlEnum("sourceType", ["model", "framework", "vulnerability", "standard", "paper", "regulation"]).notNull(),
  proposedVersion: varchar("proposedVersion", { length: 24 }).notNull(),
  summary: text("summary").notNull(),
  impactAssessment: text("impactAssessment").notNull(),
  status: mysqlEnum("status", ["proposed", "under_review", "approved", "rejected", "superseded"]).default("proposed").notNull(),
  reviewedByUserId: int("reviewedByUserId").references(() => users.id, { onDelete: "set null" }),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [index("curriculum_change_proposals_status_idx").on(table.status)]);

/** Singleton configuration. A future platform-managed schedule is looked up only by task UID. */
export const curriculumReviewSettings = mysqlTable("curriculum_review_settings", {
  id: int("id").autoincrement().primaryKey(),
  scope: varchar("scope", { length: 32 }).notNull(),
  scheduleCronTaskUid: varchar("scheduleCronTaskUid", { length: 65 }),
  cronExpression: varchar("cronExpression", { length: 64 }).notNull(),
  enabled: int("enabled").default(0).notNull(),
  sourceUrls: json("sourceUrls").$type<string[]>().notNull(),
  lastRunAt: timestamp("lastRunAt"),
  lastOutcome: varchar("lastOutcome", { length: 48 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  uniqueIndex("curriculum_review_settings_scope_unique").on(table.scope),
  index("curriculum_review_settings_task_uid_idx").on(table.scheduleCronTaskUid),
]);

export const tutorMessages = mysqlTable("tutor_messages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseId: int("courseId").references(() => courses.id, { onDelete: "set null" }),
  role: mysqlEnum("role", ["student", "tutor"]).notNull(),
  content: text("content").notNull(),
  mode: mysqlEnum("mode", ["explain", "socratic", "hint", "practice", "interview", "defense"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [index("tutor_messages_user_created_idx").on(table.userId, table.createdAt)]);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
