import { pgTable, serial, varchar, text, timestamp, integer, boolean, jsonb, primaryKey } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: varchar('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }), // null if using OAuth only
  name: varchar('name', { length: 100 }).notNull(),
  avatarUrl: text('avatar_url'),
  role: varchar('role', { enum: ['estudiante', 'docente', 'mentor', 'admin-institucional', 'admin-tecnico', 'creador-contenido', 'moderador', 'psicologo', 'familia', 'aliado', 'investigador'] }).notNull().default('estudiante'),
  ageRange: varchar('age_range', { enum: ['menor-14', '15-17', '18+'] }),
  language: varchar('language', { length: 10 }).notNull().default('es'),
  institutionId: varchar('institution_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Learning routes (courses)
export const learningRoutes = pgTable('learning_routes', {
  id: varchar('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  targetAudience: jsonb('target_audience').default([]),
  durationHours: integer('duration_hours').notNull().default(40),
  initialLevel: varchar('initial_level', { enum: ['basico', 'intermedio', 'avanzado'] }).notNull().default('basico'),
  category: varchar('category', { length: 100 }).notNull(),
  skills: jsonb('skills').default([]),
  prerequisites: jsonb('prerequisites').default([]),
  createdBy: varchar('created_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

// Modules within routes
export const modules = pgTable('modules', {
  id: varchar('id').primaryKey().defaultRandom(),
  routeId: varchar('route_id').references(() => learningRoutes.id).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  orderNumber: integer('order_number').notNull(),
  estimatedHours: integer('estimated_hours').notNull().default(8),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

// Lessons within modules
export const lessons = pgTable('lessons', {
  id: varchar('id').primaryKey().defaultRandom(),
  moduleId: varchar('module_id').references(() => modules.id).notNull(),
  type: varchar('type', { enum: ['video', 'lectura', 'ejercicio', 'proyecto', 'simulacion'] }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  contentUrl: text('content_url'),
  contentType: varchar('content_type', { length: 50 }),
  transcriptText: text('transcript_text'),
  durationSeconds: integer('duration_seconds').notNull().default(300),
  difficultyLevel: varchar('difficulty_level', { enum: ['easy', 'medium', 'hard'] }).notNull().default('easy'),
  tags: jsonb('tags').default([]),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

// Student progress tracking
export const studentProgress = pgTable('student_progress', {
  studentId: varchar('student_id').references(() => users.id).notNull(),
  lessonId: varchar('lesson_id').references(() => lessons.id).notNull(),
  status: varchar('status', { enum: ['pending', 'in_progress', 'completed'] }).notNull().default('pending'),
  score: integer('score'),
  attempts: integer('attempts').notNull().default(0),
  lastAccessed: timestamp('last_accessed').notNull().defaultNow(),
}, t => [
  primaryKey({ columns: [t.studentId, t.lessonId] })
]);

// Certificates with verification code
export const certificates = pgTable('certificates', {
  id: varchar('id').primaryKey().defaultRandom(),
  studentId: varchar('student_id').references(() => users.id).notNull(),
  routeId: varchar('route_id').references(() => learningRoutes.id).notNull(),
  code: varchar('code', { length: 12 }).notNull().unique(),
  issueDate: timestamp('issue_date').notNull().defaultNow(),
  expiresAt: timestamp('expires_at'),
  qrHash: varchar('qr_hash', { length: 64 }).notNull(),
  competencies: jsonb('competencies').default([]),
  createdById: varchar('created_by_id').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow()
});
