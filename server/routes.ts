import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { z } from "zod";

const addToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().default(1),
});

const updateCartSchema = z.object({
  quantity: z.number().int().positive(),
});

const sampleProducts = [
  {
    name: "سماعات لاسلكية",
    description: "سماعات بلوتوث عالية الجودة مع إلغاء الضوضاء وبطارية تدوم 24 ساعة",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    category: "إلكترونيات",
    stock: 50,
  },
  {
    name: "ساعة ذكية",
    description: "ساعة ذكية أنيقة مع متتبع لياقة بدنية ومقاومة للماء",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    category: "إلكترونيات",
    stock: 30,
  },
  {
    name: "حقيبة ظهر",
    description: "حقيبة ظهر عصرية ومريحة مع جيوب متعددة للكمبيوتر المحمول",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
    category: "أزياء",
    stock: 100,
  },
  {
    name: "نظارات شمسية",
    description: "نظارات شمسية أنيقة مع حماية من الأشعة فوق البنفسجية",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80",
    category: "أزياء",
    stock: 75,
  },
  {
    name: "كاميرا احترافية",
    description: "كاميرا رقمية عالية الدقة مثالية للتصوير الاحترافي",
    price: 899.99,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
    category: "إلكترونيات",
    stock: 20,
  },
  {
    name: "حذاء رياضي",
    description: "حذاء رياضي مريح للجري والتمارين اليومية",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    category: "رياضة",
    stock: 60,
  },
  {
    name: "زجاجة مياه",
    description: "زجاجة مياه عازلة للحرارة تحافظ على برودة المشروبات لـ 24 ساعة",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80",
    category: "رياضة",
    stock: 150,
  },
  {
    name: "سماعة رأس للألعاب",
    description: "سماعة رأس للألعاب مع ميكروفون وإضاءة RGB",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=400&q=80",
    category: "إلكترونيات",
    stock: 40,
  },
];

async function seedProducts() {
  const existingProducts = await storage.getProducts();
  if (existingProducts.length === 0) {
    for (const product of sampleProducts) {
      await storage.createProduct(product);
    }
    console.log("Seeded sample products");
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/cart", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const items = await storage.getCartItems(userId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const parsed = addToCartSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid request data", errors: parsed.error.flatten() });
      }
      
      const { productId, quantity } = parsed.data;
      
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const item = await storage.addToCart({
        userId,
        productId,
        quantity,
      });
      
      res.json(item);
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.patch("/api/cart/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const parsed = updateCartSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid quantity", errors: parsed.error.flatten() });
      }

      const { quantity } = parsed.data;
      const item = await storage.updateCartItem(req.params.id, userId, quantity);
      if (!item) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(item);
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(500).json({ message: "Failed to update cart" });
    }
  });

  app.delete("/api/cart/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const success = await storage.removeCartItem(req.params.id, userId);
      
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  await seedProducts();

  return httpServer;
}
