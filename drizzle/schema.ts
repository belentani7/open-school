import { pgTable, serial, varchar, text, timestamp, integer, boolean, jsonb, pgEnum, primaryKey } from 'drizzle-orm/pg-core';

// ============= ENUMS COMPARTIDOS CON secure-t =============
export const role = pgEnum("role", ["STUDENT", "FACULTY", "MENTOR", "EXAMINER", "LAB_INSTRUCTOR", "ADMIN", "AI_AGENT", "SYSTEM"]);

// ============= TABLAS ALINEADAS CON secure-t =============

// Users table - alineada con secure-t (con roles extensibles)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }), // null if using OAuth only
  name: varchar("name", { length: 100 }).notNull(),
  avatarUrl: text("avatar_url"),
  // Roles extensibles compatibles con secure-t
  role: role("role").default("STUDENT").notNull(),
  ageRange: varchar("age_range", { enum: ["menor-14", "15-17", "18+"] }),
  language: varchar("language", { length: 10 }).notNull().default("es"),
  institutionId: varchar("institution_id"),
  // Campos adicionales de secure-t
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

// Learning routes (courses) - compatibles con secure-t programs/courses
export const learningRoutes = pgTable("learning_routes", {
  id: varchar("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  targetAudience: jsonb("target_audience").default([]),
  durationHours: integer("duration_hours").notNull().default(40),
  initialLevel: varchar("initial_level", { enum: ["basico", "intermedio", "avanzado"] }).notNull().default("basico"),
  category: varchar("category", { length: 100 }).notNull(),
  skills: jsonb("skills").default([]),
  prerequisites: jsonb("prerequisites").default([]),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// Modules within routes
export const modules = pgTable("modules", {
  id: varchar("id").primaryKey().defaultRandom(),
  routeId: varchar("route_id").references(() => learningRoutes.id).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  orderNumber: integer("order_number").notNull(),
  estimatedHours: integer("estimated_hours").notNull().default(8),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// Lessons within modules
export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey().defaultRandom(),
  moduleId: varchar("module_id").references(() => modules.id).notNull(),
  type: varchar("type", { enum: ["video", "lectura", "ejercicio", "proyecto", "simulacion"] }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  contentUrl: text("content_url"),
  contentType: varchar("content_type", { length: 50 }),
  transcriptText: text("transcriptText"),
  durationSeconds: integer("duration_seconds").notNull().default(300),
  difficultyLevel: varchar("difficulty_level", { enum: ["easy", "medium", "hard"] }).notNull().default("easy"),
  tags: jsonb("tags").default([]),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// Student progress tracking - compatible con secure-t studentCompetencies
export const studentProgress = pgTable("student_progress", {
  studentId: varchar("student_id").references(() => users.id).notNull(),
  lessonId: varchar("lesson_id").references(() => lessons.id).notNull(),
  status: varchar("status", { enum: ["pending", "in_progress", "completed"] }).notNull().default("pending"),
  score: integer("score"),
  attempts: integer("attempts").notNull().default(0),
  lastAccessed: timestamp("last_accessed").notNull().defaultNow(),
  // Campos adicionales para compatibilidad con secure-t
  mastery: real("mastery").default(0).notNull(),
  confidence: real("confidence").default(0).notNull(),
  evidenceCount: integer("evidence_count").default(0).notNull(),
}, t => [
  primaryKey({ columns: [t.studentId, t.lessonId] })
]);

// Certificates with verification code - compatibles con secure-t certificates
export const certificates = pgTable("certificates", {
  id: varchar("id").primaryKey().defaultRandom(),
  studentId: varchar("student_id").references(() => users.id).notNull(),
  routeId: varchar("route_id").references(() => learningRoutes.id).notNull(),
  code: varchar("code", { length: 12 }).notNull().unique(),
  issueDate: timestamp("issue_date").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
  qrHash: varchar("qr_hash", { length: 64 }).notNull(),
  competencies: jsonb("competencies").default([]),
  createdById: varchar("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// ============= TABLAS ADICIONALES PARA GOBERNANZA IA (secure-t) =============

// AI Audit Events - compatibles con secure-t ai_audit_events
export const aiAuditEvents = pgTable("ai_audit_events", {
  id: varchar("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id),
  agentId: varchar("agent_id", { length: 80 }),
  action: varchar("action", { length: 120 }).notNull(),
  tool: varchar("tool", { length: 120 }),
  authorization: varchar("authorization", { length: 40 }).notNull(),
  inputMetadata: jsonb("input_metadata").default({}).notNull(),
  outputMetadata: jsonb("output_metadata").default({}).notNull(),
  result: varchar("result", { length: 40 }).notNull(),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow()
});

// Student Competencies - para tracking de maestría compatible con secure-t
export const studentCompetencies = pgTable("student_competencies", {
  studentId: varchar("student_id").references(() => users.id).notNull(),
  competencyId: varchar("competency_id").notNull(),
  mastery: real("mastery").default(0).notNull(),
  confidence: real("confidence").default(0).notNull(),
  evidenceCount: integer("evidence_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, t => primaryKey({ columns: [t.studentId, t.competencyId] }));

// ============= VIEWS Y RELACIONES Útiles =============

// View: Student full progress with competencies
export const studentFullProgress = pgTable("student_full_progress", {
  studentId: varchar("student_id").references(() => users.id).notNull(),
  totalLessons: integer("total_lessons", { mode: "number" }),
  completedLessons: integer("completed_lessons", { mode: "number" }),
  overallProgress: real("overall_progress", { mode: "number" }).default(0),
  currentCompetencyMastery: real("current_competency_mastery", { mode: "number" }).default(0),
  lastActivity: timestamp("last_activity").notNull().defaultNow()
}, t => []);