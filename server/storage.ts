import {
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  tutorials, type Tutorial, type InsertTutorial,
  progress, type Progress, type InsertProgress,
  codeExamples, type CodeExample, type InsertCodeExample,
  functionExamples, type FunctionExample, type InsertFunctionExample
} from "@shared/schema";

export interface IStorage {
  // User related methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category related methods
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Tutorial related methods
  getTutorials(): Promise<Tutorial[]>;
  getTutorialsByCategoryId(categoryId: number): Promise<Tutorial[]>;
  getTutorialsByCategorySlug(slug: string): Promise<Tutorial[]>;
  getTutorialBySlug(slug: string): Promise<Tutorial | undefined>;
  createTutorial(tutorial: InsertTutorial): Promise<Tutorial>;
  
  // Progress tracking methods
  getProgressByUserId(userId: number): Promise<Progress[]>;
  getProgressByUserAndTutorial(userId: number, tutorialId: number): Promise<Progress | undefined>;
  createOrUpdateProgress(progress: InsertProgress): Promise<Progress>;
  
  // Code examples methods
  getCodeExamplesByTutorialId(tutorialId: number): Promise<CodeExample[]>;
  createCodeExample(codeExample: InsertCodeExample): Promise<CodeExample>;
  
  // Function examples methods
  getFunctionExamplesByLanguage(language: string): Promise<FunctionExample[]>;
  getFunctionExamplesByLanguageAndCategory(language: string, category: string): Promise<FunctionExample[]>;
  getFunctionExampleByNameAndLanguage(name: string, language: string): Promise<FunctionExample | undefined>;
  createFunctionExample(functionExample: InsertFunctionExample): Promise<FunctionExample>;
}

import { db } from './db';
import { eq, and } from 'drizzle-orm';

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const timestamp = new Date();
    const [user] = await db.insert(users)
      .values({...insertUser, createdAt: timestamp})
      .returning();
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  // Tutorial methods
  async getTutorials(): Promise<Tutorial[]> {
    return db.select().from(tutorials);
  }

  async getTutorialsByCategoryId(categoryId: number): Promise<Tutorial[]> {
    return db.select()
      .from(tutorials)
      .where(eq(tutorials.categoryId, categoryId))
      .orderBy(tutorials.order);
  }

  async getTutorialsByCategorySlug(slug: string): Promise<Tutorial[]> {
    const category = await this.getCategoryBySlug(slug);
    if (!category) return [];
    return this.getTutorialsByCategoryId(category.id);
  }

  async getTutorialBySlug(slug: string): Promise<Tutorial | undefined> {
    const [tutorial] = await db.select()
      .from(tutorials)
      .where(eq(tutorials.slug, slug));
    return tutorial;
  }

  async createTutorial(insertTutorial: InsertTutorial): Promise<Tutorial> {
    const timestamp = new Date();
    const [tutorial] = await db.insert(tutorials)
      .values({...insertTutorial, createdAt: timestamp})
      .returning();
    return tutorial;
  }

  // Progress methods
  async getProgressByUserId(userId: number): Promise<Progress[]> {
    return db.select()
      .from(progress)
      .where(eq(progress.userId, userId));
  }

  async getProgressByUserAndTutorial(userId: number, tutorialId: number): Promise<Progress | undefined> {
    const [userProgress] = await db.select()
      .from(progress)
      .where(and(
        eq(progress.userId, userId),
        eq(progress.tutorialId, tutorialId)
      ));
    return userProgress;
  }

  async createOrUpdateProgress(insertProgress: InsertProgress): Promise<Progress> {
    // Check if progress already exists
    const existingProgress = await this.getProgressByUserAndTutorial(
      insertProgress.userId,
      insertProgress.tutorialId
    );

    if (existingProgress) {
      // Update existing progress
      const [updatedProgress] = await db.update(progress)
        .set({
          completed: insertProgress.completed,
          completedAt: insertProgress.completed ? new Date() : null
        })
        .where(eq(progress.id, existingProgress.id))
        .returning();
      
      return updatedProgress;
    } else {
      // Create new progress
      const timestamp = new Date();
      const [newProgress] = await db.insert(progress)
        .values({
          ...insertProgress,
          completedAt: insertProgress.completed ? timestamp : null,
          createdAt: timestamp
        })
        .returning();
      
      return newProgress;
    }
  }

  // Code example methods
  async getCodeExamplesByTutorialId(tutorialId: number): Promise<CodeExample[]> {
    return db.select()
      .from(codeExamples)
      .where(eq(codeExamples.tutorialId, tutorialId));
  }

  async createCodeExample(insertCodeExample: InsertCodeExample): Promise<CodeExample> {
    const [codeExample] = await db.insert(codeExamples)
      .values(insertCodeExample)
      .returning();
    return codeExample;
  }
  
  // Function examples methods
  async getFunctionExamplesByLanguage(language: string): Promise<FunctionExample[]> {
    return db.select()
      .from(functionExamples)
      .where(eq(functionExamples.language, language));
  }
  
  async getFunctionExamplesByLanguageAndCategory(language: string, category: string): Promise<FunctionExample[]> {
    return db.select()
      .from(functionExamples)
      .where(and(
        eq(functionExamples.language, language),
        eq(functionExamples.category, category)
      ));
  }
  
  async getFunctionExampleByNameAndLanguage(name: string, language: string): Promise<FunctionExample | undefined> {
    const [functionExample] = await db.select()
      .from(functionExamples)
      .where(and(
        eq(functionExamples.name, name),
        eq(functionExamples.language, language)
      ));
    return functionExample;
  }
  
  async createFunctionExample(insertFunctionExample: InsertFunctionExample): Promise<FunctionExample> {
    const timestamp = new Date();
    const [functionExample] = await db.insert(functionExamples)
      .values({...insertFunctionExample, createdAt: timestamp})
      .returning();
    return functionExample;
  }
  
  // Initialize the database with demo data if needed
  async initializeDatabase() {
    // Check if categories exist, if not create demo data
    const existingCategories = await this.getCategories();
    
    if (existingCategories.length === 0) {
      console.log("Initializing database with demo data...");
      
      // Create categories
      const cppCategory = await this.createCategory({
        name: "C++",
        slug: "cpp",
        description: "Learn C++ programming with tutorials and examples",
        icon: "code"
      });

      const pythonCategory = await this.createCategory({
        name: "Python",
        slug: "python",
        description: "Learn Python programming with tutorials and examples",
        icon: "python"
      });

      const jsCategory = await this.createCategory({
        name: "JavaScript",
        slug: "javascript",
        description: "Learn JavaScript programming with tutorials and examples",
        icon: "js"
      });

      // Create C++ tutorials
      const cppTutorial = await this.createTutorial({
        title: "C++ Tutorial",
        slug: "cpp-tutorial",
        content: "C++ is a popular programming language. C++ is used to create computer programs, and is one of the most used language in game development. C++ was developed as an extension of C, and both languages have almost the same syntax.",
        categoryId: cppCategory.id,
        order: 1
      });

      const cppSyntax = await this.createTutorial({
        title: "C++ Syntax",
        slug: "cpp-syntax",
        content: "Let's break up the following code to understand it better: int main() { cout << \"Hello World!\"; return 0; }",
        categoryId: cppCategory.id,
        order: 2
      });

      const cppVariables = await this.createTutorial({
        title: "C++ Variables",
        slug: "cpp-variables",
        content: "Variables are containers for storing data values. In C++, there are different types of variables (defined with different keywords), for example: int - stores integers (whole numbers), double - stores floating point numbers, string - stores text, char - stores single characters, bool - stores values with two states: true or false",
        categoryId: cppCategory.id,
        order: 3
      });

      // Create code examples
      await this.createCodeExample({
        tutorialId: cppTutorial.id,
        code: `#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello World!";\n  return 0;\n}`,
        output: "Hello World!",
        language: "cpp",
        title: "Example"
      });

      await this.createCodeExample({
        tutorialId: cppSyntax.id,
        code: `#include <iostream>\nusing namespace std;\n\nint main() {\n  // This is a comment\n  cout << "Hello World!";\n  return 0;\n}`,
        output: "Hello World!",
        language: "cpp",
        title: "Example with Comments"
      });

      await this.createCodeExample({
        tutorialId: cppVariables.id,
        code: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int myNum = 15;  // Integer\n  cout << myNum;\n  return 0;\n}`,
        output: "15",
        language: "cpp",
        title: "Integer Variable"
      });
      
      // Create function examples for C++
      await this.createFunctionExample({
        name: "cout",
        description: "The cout object is used together with the << operator to display output.",
        syntax: "cout << output;",
        parameters: { "output": "The value to be displayed (can be a string, variable, etc.)" },
        returnType: null,
        code: `#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello World!";\n  cout << "\\nI am learning C++";\n  return 0;\n}`,
        output: "Hello World!\nI am learning C++",
        language: "cpp",
        category: "Input/Output"
      });

      await this.createFunctionExample({
        name: "cin",
        description: "The cin object is used together with the >> operator to read input from the user.",
        syntax: "cin >> variable;",
        parameters: { "variable": "The variable where the user input will be stored" },
        returnType: null,
        code: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int x;\n  cout << "Type a number: ";\n  cin >> x;\n  cout << "Your number is: " << x;\n  return 0;\n}`,
        output: "Type a number: 42\nYour number is: 42",
        language: "cpp",
        category: "Input/Output"
      });

      await this.createFunctionExample({
        name: "for_loop",
        description: "The for loop executes a block of code as long as a specified condition is true.",
        syntax: "for (initialization; condition; increment/decrement) { code_block }",
        parameters: {
          "initialization": "Initialize a counter variable",
          "condition": "Evaluated before each loop iteration",
          "increment/decrement": "Updates the counter after each iteration"
        },
        returnType: null,
        code: `#include <iostream>\nusing namespace std;\n\nint main() {\n  for (int i = 0; i < 5; i++) {\n    cout << i << "\\n";\n  }\n  return 0;\n}`,
        output: "0\n1\n2\n3\n4",
        language: "cpp",
        category: "Control Flow"
      });

      await this.createFunctionExample({
        name: "while_loop",
        description: "The while loop executes a block of code as long as a specified condition is true.",
        syntax: "while (condition) { code_block }",
        parameters: {
          "condition": "Evaluated before each loop iteration"
        },
        returnType: null,
        code: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int i = 0;\n  while (i < 5) {\n    cout << i << "\\n";\n    i++;\n  }\n  return 0;\n}`,
        output: "0\n1\n2\n3\n4",
        language: "cpp",
        category: "Control Flow"
      });
      
      console.log("Demo data created successfully!");
    }
  }
}

// Initialize the database storage
export const storage = new DatabaseStorage();
