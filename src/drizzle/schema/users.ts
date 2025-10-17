import { pgTable, varchar, pgEnum } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";

export const userRoleEnum = pgEnum("user_role", [
  "ADMIN",
  "DOCTOR",
  "PATIENT",
  "RECEPTIONIST",
]);

export const users = pgTable("users", {
  id: id,
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: userRoleEnum("role").notNull(),
  createdAt: createdAt,
  updatedAt: updatedAt,
});

// TypeScript type for the user
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
