import { int, mysqlEnum, mysqlTable, text, timestamp, unique, varchar } from "drizzle-orm/mysql-core";

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

export const syncActions = mysqlTable(
  "sync_actions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    actionId: varchar("actionId", { length: 128 }).notNull(),
    actionType: mysqlEnum("actionType", ["progress", "stats", "profile"]).notNull(),
    payload: text("payload").notNull(),
    clientTimestamp: timestamp("clientTimestamp").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userActionUnique: unique("sync_actions_user_action_unique").on(table.userId, table.actionId),
  }),
);

export type SyncAction = typeof syncActions.$inferSelect;
export type InsertSyncAction = typeof syncActions.$inferInsert;
