import { Switch, Route } from "wouter";
import { queryClient, apiRequest } from "./lib/queryClient";
import { QueryClientProvider, useQuery, useMutation } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useState, useCallback } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Products from "@/pages/products";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartSheet } from "@/components/cart-sheet";
import { ProductDetailDialog } from "@/components/product-detail-dialog";
import { useAuth } from "@/hooks/use-auth";
import type { Product, CartItem } from "@shared/schema";

function AppContent() {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productDialogOpen, setProductDialogOpen] = useState(false);

  const { data: cartItems = [], refetch: refetchCart } = useQuery<(CartItem & { product: Product })[]>({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      return apiRequest("POST", "/api/cart", { productId, quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "تمت الإضافة",
        description: "تم إضافة المنتج إلى السلة",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في إضافة المنتج",
        variant: "destructive",
      });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      return apiRequest("PATCH", `/api/cart/${itemId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      return apiRequest("DELETE", `/api/cart/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "تم الحذف",
        description: "تم حذف المنتج من السلة",
      });
    },
  });

  const handleAddToCart = useCallback((product: Product, quantity: number = 1) => {
    if (!isAuthenticated) {
      toast({
        title: "يرجى تسجيل الدخول",
        description: "سجل الدخول لإضافة منتجات إلى السلة",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }
    addToCartMutation.mutate({ productId: product.id, quantity });
  }, [isAuthenticated, addToCartMutation, toast]);

  const handleViewDetails = useCallback((product: Product) => {
    setSelectedProduct(product);
    setProductDialogOpen(true);
  }, []);

  const handleCheckout = useCallback(() => {
    toast({
      title: "شكراً لك!",
      description: "تم استلام طلبك بنجاح",
    });
    setCartOpen(false);
  }, [toast]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
      
      <main className="flex-1">
        <Switch>
          <Route path="/">
            <Home onAddToCart={handleAddToCart} onViewDetails={handleViewDetails} />
          </Route>
          <Route path="/products">
            <Products onAddToCart={handleAddToCart} onViewDetails={handleViewDetails} />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>

      <Footer />

      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={cartItems}
        onUpdateQuantity={(itemId, quantity) => 
          updateQuantityMutation.mutate({ itemId, quantity })
        }
        onRemoveItem={(itemId) => removeItemMutation.mutate(itemId)}
        onCheckout={handleCheckout}
        isUpdating={updateQuantityMutation.isPending || removeItemMutation.isPending}
      />

      <ProductDetailDialog
        product={selectedProduct}
        open={productDialogOpen}
        onOpenChange={setProductDialogOpen}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
