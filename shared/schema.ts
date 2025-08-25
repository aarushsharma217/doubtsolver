import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  subscription: varchar("subscription").default("free"), // free, pro, premium
  doubtsUsedToday: integer("doubts_used_today").default(0),
  lastDoubtDate: varchar("last_doubt_date"), // YYYY-MM-DD format
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const doubts = pgTable("doubts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  question: text("question").notNull(),
  subject: varchar("subject").notNull(), // Physics, Chemistry, Maths, Biology
  solution: text("solution"),
  isBookmarked: boolean("is_bookmarked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertDoubtSchema = createInsertSchema(doubts).pick({
  question: true,
  subject: true,
});

export const updateDoubtSchema = createInsertSchema(doubts).pick({
  isBookmarked: true,
}).partial();

export type InsertDoubt = z.infer<typeof insertDoubtSchema>;
export type UpdateDoubt = z.infer<typeof updateDoubtSchema>;
export type Doubt = typeof doubts.$inferSelect;
