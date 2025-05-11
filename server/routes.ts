import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertProgressSchema } from "@shared/schema";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "brightcorelabs-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production", maxAge: 86400000 }, // 24 hours
      store: new SessionStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
    })
  );

  // Configure passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Authentication middleware
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // API Routes
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid input data", errors: validatedData.error.errors });
      }
      
      const { username, email, password, avatar } = validatedData.data;
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        avatar
      });
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error: (error as Error).message });
    }
  });
  
  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    // Remove password from response
    const { password: _, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully" });
    });
  });
  
  app.get("/api/auth/me", isAuthenticated, (req, res) => {
    // Remove password from response
    const { password: _, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });
  
  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories", error: (error as Error).message });
    }
  });
  
  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Error fetching category", error: (error as Error).message });
    }
  });
  
  // Tutorials routes
  app.get("/api/tutorials", async (req, res) => {
    try {
      const tutorials = await storage.getTutorials();
      res.json(tutorials);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tutorials", error: (error as Error).message });
    }
  });
  
  app.get("/api/categories/:slug/tutorials", async (req, res) => {
    try {
      const tutorials = await storage.getTutorialsByCategorySlug(req.params.slug);
      res.json(tutorials);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tutorials", error: (error as Error).message });
    }
  });
  
  app.get("/api/tutorials/:slug", async (req, res) => {
    try {
      const tutorial = await storage.getTutorialBySlug(req.params.slug);
      if (!tutorial) {
        return res.status(404).json({ message: "Tutorial not found" });
      }
      
      // Get code examples for this tutorial
      const codeExamples = await storage.getCodeExamplesByTutorialId(tutorial.id);
      
      res.json({ tutorial, codeExamples });
    } catch (error) {
      res.status(500).json({ message: "Error fetching tutorial", error: (error as Error).message });
    }
  });
  
  // Progress routes
  app.get("/api/progress", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const progress = await storage.getProgressByUserId(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Error fetching progress", error: (error as Error).message });
    }
  });
  
  app.post("/api/progress", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      
      const validatedData = insertProgressSchema.safeParse({
        ...req.body,
        userId
      });
      
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid input data", errors: validatedData.error.errors });
      }
      
      const progress = await storage.createOrUpdateProgress(validatedData.data);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Error updating progress", error: (error as Error).message });
    }
  });
  
  // Function examples routes
  app.get("/api/languages/:language/functions", async (req, res) => {
    try {
      const { language } = req.params;
      const category = req.query.category as string | undefined;
      
      let functionExamples;
      if (category) {
        functionExamples = await storage.getFunctionExamplesByLanguageAndCategory(language, category);
      } else {
        functionExamples = await storage.getFunctionExamplesByLanguage(language);
      }
      
      res.json(functionExamples);
    } catch (error) {
      res.status(500).json({ message: "Error fetching function examples", error: (error as Error).message });
    }
  });
  
  app.get("/api/languages/:language/functions/:name", async (req, res) => {
    try {
      const { language, name } = req.params;
      
      const functionExample = await storage.getFunctionExampleByNameAndLanguage(name, language);
      if (!functionExample) {
        return res.status(404).json({ message: "Function example not found" });
      }
      
      res.json(functionExample);
    } catch (error) {
      res.status(500).json({ message: "Error fetching function example", error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
