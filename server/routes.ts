import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { solveDoubt, simplifyExplanation } from "./openai";
import { insertDoubtSchema, updateDoubtSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Doubt routes
  app.post('/api/doubts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check daily limit for free users (skip limit check for admins)
      const isAdmin = user.email && (user.email.includes('admin') || user.email === 'aarush.sharma2108@gmail.com'); // Admin check
      const today = new Date().toISOString().split('T')[0];
      let doubtsUsedToday = user.doubtsUsedToday || 0;
      
      // Reset count if it's a new day
      if (user.lastDoubtDate !== today) {
        doubtsUsedToday = 0;
      }

      if (!isAdmin && user.subscription === 'free' && doubtsUsedToday >= 5) {
        return res.status(403).json({ 
          message: "Daily limit of 5 doubts reached. Upgrade to Pro for unlimited doubts." 
        });
      }

      const validation = insertDoubtSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid input", 
          errors: validation.error.errors 
        });
      }

      const { question, subject } = validation.data;

      // Create doubt entry
      const doubt = await storage.createDoubt({
        ...validation.data,
        userId
      });

      // Increment user's daily doubt count
      await storage.incrementUserDoubtCount(userId);

      // Solve the doubt using AI
      try {
        const solution = await solveDoubt(question, subject);
        const solutionText = JSON.stringify(solution);
        
        // Update doubt with solution
        const updatedDoubt = await storage.updateDoubtSolution(doubt.id, solutionText);
        
        res.json({ 
          doubt: updatedDoubt,
          solution,
          doubtsRemaining: isAdmin ? null : (user.subscription === 'free' ? Math.max(0, 4 - doubtsUsedToday) : null)
        });
      } catch (aiError) {
        console.error("AI solving error:", aiError);
        res.json({ 
          doubt,
          error: "Failed to generate AI solution. Please try again.",
          doubtsRemaining: isAdmin ? null : (user.subscription === 'free' ? Math.max(0, 4 - doubtsUsedToday) : null)
        });
      }
    } catch (error) {
      console.error("Error creating doubt:", error);
      res.status(500).json({ message: "Failed to create doubt" });
    }
  });

  app.get('/api/doubts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const doubts = await storage.getUserDoubts(userId);
      
      // Parse solutions for each doubt
      const doubtsWithSolutions = doubts.map(doubt => ({
        ...doubt,
        solution: doubt.solution ? JSON.parse(doubt.solution) : null
      }));
      
      res.json(doubtsWithSolutions);
    } catch (error) {
      console.error("Error fetching doubts:", error);
      res.status(500).json({ message: "Failed to fetch doubts" });
    }
  });

  app.get('/api/doubts/bookmarked', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const doubts = await storage.getBookmarkedDoubts(userId);
      
      const doubtsWithSolutions = doubts.map(doubt => ({
        ...doubt,
        solution: doubt.solution ? JSON.parse(doubt.solution) : null
      }));
      
      res.json(doubtsWithSolutions);
    } catch (error) {
      console.error("Error fetching bookmarked doubts:", error);
      res.status(500).json({ message: "Failed to fetch bookmarked doubts" });
    }
  });

  app.patch('/api/doubts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const validation = updateDoubtSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid input", 
          errors: validation.error.errors 
        });
      }

      const updatedDoubt = await storage.updateDoubt(id, validation.data);
      
      if (!updatedDoubt) {
        return res.status(404).json({ message: "Doubt not found" });
      }

      res.json(updatedDoubt);
    } catch (error) {
      console.error("Error updating doubt:", error);
      res.status(500).json({ message: "Failed to update doubt" });
    }
  });

  app.post('/api/doubts/:id/simplify', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const doubt = await storage.getDoubt(id);
      
      if (!doubt || !doubt.solution) {
        return res.status(404).json({ message: "Doubt or solution not found" });
      }

      const originalSolution = JSON.parse(doubt.solution);
      const simplifiedExplanation = await simplifyExplanation(
        JSON.stringify(originalSolution),
        doubt.subject
      );

      res.json({ simplifiedExplanation });
    } catch (error) {
      console.error("Error simplifying explanation:", error);
      res.status(500).json({ message: "Failed to simplify explanation" });
    }
  });

  // User subscription routes
  app.patch('/api/user/subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { subscription } = req.body;
      
      if (!['free', 'pro', 'premium'].includes(subscription)) {
        return res.status(400).json({ message: "Invalid subscription type" });
      }

      const updatedUser = await storage.updateUserSubscription(userId, subscription);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating subscription:", error);
      res.status(500).json({ message: "Failed to update subscription" });
    }
  });

  // Get user stats
  app.get('/api/user/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const doubts = await storage.getUserDoubts(userId);
      const bookmarkedDoubts = await storage.getBookmarkedDoubts(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const today = new Date().toISOString().split('T')[0];
      let doubtsUsedToday = user.doubtsUsedToday || 0;
      
      // Reset count if it's a new day
      if (user.lastDoubtDate !== today) {
        doubtsUsedToday = 0;
      }

      const isAdmin = user.email && (user.email.includes('admin') || user.email === 'aarush.sharma2108@gmail.com');
      const stats = {
        totalDoubts: doubts.length,
        bookmarkedDoubts: bookmarkedDoubts.length,
        doubtsUsedToday,
        doubtsRemaining: isAdmin ? null : (user.subscription === 'free' ? Math.max(0, 5 - doubtsUsedToday) : null),
        subscription: isAdmin ? 'admin' : user.subscription
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
