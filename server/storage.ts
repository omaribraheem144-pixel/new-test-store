import { products, cartItems, type Product, type InsertProduct, type CartItem, type InsertCartItem } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  getCartItems(userId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, userId: string, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: string, userId: string): Promise<boolean>;
  clearCart(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(products.createdAt);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async getCartItems(userId: string): Promise<(CartItem & { product: Product })[]> {
    const items = await db.select().from(cartItems).where(eq(cartItems.userId, userId));
    const result: (CartItem & { product: Product })[] = [];
    
    for (const item of items) {
      const product = await this.getProduct(item.productId);
      if (product) {
        result.push({ ...item, product });
      }
    }
    
    return result;
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const existingItems = await db.select()
      .from(cartItems)
      .where(and(eq(cartItems.userId, item.userId), eq(cartItems.productId, item.productId)));
    
    if (existingItems.length > 0) {
      const existing = existingItems[0];
      const [updated] = await db.update(cartItems)
        .set({ quantity: existing.quantity + item.quantity })
        .where(eq(cartItems.id, existing.id))
        .returning();
      return updated;
    }
    
    const [newItem] = await db.insert(cartItems).values(item).returning();
    return newItem;
  }

  async updateCartItem(id: string, userId: string, quantity: number): Promise<CartItem | undefined> {
    const [updated] = await db.update(cartItems)
      .set({ quantity })
      .where(and(eq(cartItems.id, id), eq(cartItems.userId, userId)))
      .returning();
    return updated;
  }

  async removeCartItem(id: string, userId: string): Promise<boolean> {
    const result = await db.delete(cartItems)
      .where(and(eq(cartItems.id, id), eq(cartItems.userId, userId)))
      .returning();
    return result.length > 0;
  }

  async clearCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }
}

export const storage = new DatabaseStorage();
