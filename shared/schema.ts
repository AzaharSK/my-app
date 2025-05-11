import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  avatar: true
});

// Tutorial categories schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon")
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
  description: true,
  icon: true
});

// Tutorial schema
export const tutorials = pgTable("tutorials", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  categoryId: integer("category_id").notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertTutorialSchema = createInsertSchema(tutorials).pick({
  title: true,
  slug: true,
  content: true,
  categoryId: true,
  order: true
});

// Progress tracking schema
export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  tutorialId: integer("tutorial_id").notNull(),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertProgressSchema = createInsertSchema(progress).pick({
  userId: true,
  tutorialId: true,
  completed: true,
  completedAt: true
});

// Code examples schema
export const codeExamples = pgTable("code_examples", {
  id: serial("id").primaryKey(),
  tutorialId: integer("tutorial_id").notNull(),
  code: text("code").notNull(),
  output: text("output"),
  language: text("language").notNull(),
  title: text("title")
});

export const insertCodeExampleSchema = createInsertSchema(codeExamples).pick({
  tutorialId: true,
  code: true,
  output: true,
  language: true,
  title: true
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertTutorial = z.infer<typeof insertTutorialSchema>;
export type Tutorial = typeof tutorials.$inferSelect;

export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type Progress = typeof progress.$inferSelect;

export type InsertCodeExample = z.infer<typeof insertCodeExampleSchema>;
export type CodeExample = typeof codeExamples.$inferSelect;

// Function examples schema (for examples of each language function/feature)
export const functionExamples = pgTable("function_examples", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // Function or feature name
  description: text("description").notNull(),
  syntax: text("syntax"), // Syntax overview
  parameters: jsonb("parameters"), // Detailed parameter information
  returnType: text("return_type"), // What the function returns
  code: text("code").notNull(), // Example code
  output: text("output"), // Expected output
  language: text("language").notNull(), // Programming language
  category: text("category"), // Category (e.g., "String Functions", "Control Flow")
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFunctionExampleSchema = createInsertSchema(functionExamples).pick({
  name: true,
  description: true,
  syntax: true,
  parameters: true,
  returnType: true,
  code: true,
  output: true,
  language: true,
  category: true
});

export type InsertFunctionExample = z.infer<typeof insertFunctionExampleSchema>;
export type FunctionExample = typeof functionExamples.$inferSelect;
