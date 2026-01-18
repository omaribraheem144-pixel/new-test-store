import { useQuery } from "@tanstack/react-query";
import { Loader2, Package } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { LandingHero } from "@/components/landing-hero";
import { useAuth } from "@/hooks/use-auth";
import type { Product } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface HomeProps {
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export default function Home({ onAddToCart, onViewDetails }: HomeProps) {
  const { isAuthenticated } = useAuth();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const featuredProducts = products?.slice(0, 4) || [];

  return (
    <div className="min-h-screen">
      <LandingHero />

      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold">
              منتجات مميزة
            </h2>
            <p className="text-muted-foreground mt-1">
              اكتشف أحدث المنتجات لدينا
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline" data-testid="button-view-all">
              عرض الكل
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Package className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">لا توجد منتجات حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </section>

      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
            جاهز للتسوق؟
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            سجل الآن واحصل على أفضل العروض والخصومات الحصرية
          </p>
          {!isAuthenticated && (
            <Button size="lg" asChild data-testid="button-cta-login">
              <a href="/api/login">ابدأ التسوق الآن</a>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
