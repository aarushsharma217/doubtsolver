import { 
  users, 
  doubts,
  type User, 
  type UpsertUser,
  type Doubt,
  type InsertDoubt,
  type UpdateDoubt
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserSubscription(userId: string, subscription: string): Promise<void>;
  incrementUserDoubtCount(userId: string): Promise<void>;
  
  // Doubt operations
  createDoubt(doubt: InsertDoubt & { userId: string }): Promise<Doubt>;
  getDoubt(id: string): Promise<Doubt | undefined>;
  getUserDoubts(userId: string): Promise<Doubt[]>;
  getBookmarkedDoubts(userId: string): Promise<Doubt[]>;
  updateDoubt(id: string, updates: UpdateDoubt): Promise<Doubt | undefined>;
  updateDoubtSolution(id: string, solution: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserSubscription(userId: string, subscription: string): Promise<void> {
    await db
      .update(users)
      .set({ subscription, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async incrementUserDoubtCount(userId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const user = await this.getUser(userId);
    
    if (user?.lastDoubtDate !== today) {
      // Reset count for new day
      await db
        .update(users)
        .set({ 
          doubtsUsedToday: 1, 
          lastDoubtDate: today,
          updatedAt: new Date() 
        })
        .where(eq(users.id, userId));
    } else {
      // Increment count for same day
      await db
        .update(users)
        .set({ 
          doubtsUsedToday: (user.doubtsUsedToday || 0) + 1,
          updatedAt: new Date() 
        })
        .where(eq(users.id, userId));
    }
  }

  // Doubt operations
  async createDoubt(doubt: InsertDoubt & { userId: string }): Promise<Doubt> {
    const [newDoubt] = await db
      .insert(doubts)
      .values(doubt)
      .returning();
    return newDoubt;
  }

  async getDoubt(id: string): Promise<Doubt | undefined> {
    const [doubt] = await db.select().from(doubts).where(eq(doubts.id, id));
    return doubt;
  }

  async getUserDoubts(userId: string): Promise<Doubt[]> {
    return await db
      .select()
      .from(doubts)
      .where(eq(doubts.userId, userId))
      .orderBy(desc(doubts.createdAt));
  }

  async getBookmarkedDoubts(userId: string): Promise<Doubt[]> {
    return await db
      .select()
      .from(doubts)
      .where(and(eq(doubts.userId, userId), eq(doubts.isBookmarked, true)))
      .orderBy(desc(doubts.createdAt));
  }

  async updateDoubt(id: string, updates: UpdateDoubt): Promise<Doubt | undefined> {
    const [updatedDoubt] = await db
      .update(doubts)
      .set(updates)
      .where(eq(doubts.id, id))
      .returning();
    return updatedDoubt;
  }

  async updateDoubtSolution(id: string, solution: string): Promise<void> {
    await db
      .update(doubts)
      .set({ solution })
      .where(eq(doubts.id, id));
  }
}

export const storage = new DatabaseStorage();