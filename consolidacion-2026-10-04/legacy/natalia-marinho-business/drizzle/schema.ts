import { int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

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

export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  language: mysqlEnum("language", ["ES", "PT"]).default("ES").notNull(),
  source: varchar("source", { length: 120 }).default("website").notNull(),
  status: mysqlEnum("status", ["active", "unsubscribed"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const bookingRequests = mysqlTable("bookingRequests", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  message: text("message"),
  service: varchar("service", { length: 160 }).default("Experiencia privada").notNull(),
  preferredDate: varchar("preferredDate", { length: 32 }),
  preferredTime: varchar("preferredTime", { length: 32 }),
  status: mysqlEnum("status", ["new", "contacted", "confirmed", "closed"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  bookingSlotUnique: uniqueIndex("booking_slot_unique").on(table.preferredDate, table.preferredTime),
}));

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
export type BookingRequest = typeof bookingRequests.$inferSelect;
export type InsertBookingRequest = typeof bookingRequests.$inferInsert;

export const collaborationRequests = mysqlTable("collaborationRequests", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  organization: varchar("organization", { length: 180 }),
  city: varchar("city", { length: 100 }).default("Barcelona").notNull(),
  proposalType: varchar("proposalType", { length: 120 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "reviewing", "contacted", "closed"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CollaborationRequest = typeof collaborationRequests.$inferSelect;
export type InsertCollaborationRequest = typeof collaborationRequests.$inferInsert;