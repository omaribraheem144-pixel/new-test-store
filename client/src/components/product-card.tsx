import { ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  return (
    <Card
      className="group overflow-visible cursor-pointer hover-elevate active-elevate-2"
      onClick={() => onViewDetails(product)}
      data-testid={`card-product-${product.id}`}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-md">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className="absolute top-2 right-2" variant="secondary">
          {product.category}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1" data-testid={`text-product-name-${product.id}`}>
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
          ${product.price.toFixed(2)}
        </span>
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          data-testid={`button-add-to-cart-${product.id}`}
        >
          <Plus className="h-4 w-4 mr-1" />
          أضف للسلة
        </Button>
      </CardFooter>
    </Card>
  );
}
