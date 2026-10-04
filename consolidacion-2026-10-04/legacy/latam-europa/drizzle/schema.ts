import { index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const sourceMonitoringJobs = mysqlTable(
  "sourceMonitoringJobs",
  {
    id: int("id").autoincrement().primaryKey(),
    monitorKey: varchar("monitorKey", { length: 64 }).notNull().unique(),
    scheduleCronTaskUid: varchar("scheduleCronTaskUid", { length: 65 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("source_monitoring_task_uid_idx").on(table.scheduleCronTaskUid)]
);

export const sourceChecks = mysqlTable(
  "sourceChecks",
  {
    id: int("id").autoincrement().primaryKey(),
    sourceSlug: varchar("sourceSlug", { length: 64 }).notNull(),
    runKey: varchar("runKey", { length: 100 }).notNull().unique(),
    checkedAt: timestamp("checkedAt").notNull(),
    status: mysqlEnum("status", ["verified", "failed"]).notNull(),
    statusCode: int("statusCode"),
    resolvedUrl: varchar("resolvedUrl", { length: 2048 }).notNull(),
    detail: text("detail"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("source_checks_slug_checked_idx").on(table.sourceSlug, table.checkedAt)]
);
