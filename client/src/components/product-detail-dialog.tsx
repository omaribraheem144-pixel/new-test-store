import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@shared/schema";

interface ProductDetailDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductDetailDialog({
  product,
  open,
  onOpenChange,
  onAddToCart,
}: ProductDetailDialogProps) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden" data-testid="product-detail-dialog">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative aspect-square md:aspect-auto md:h-full">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            <Badge className="absolute top-4 right-4" variant="secondary">
              {product.category}
            </Badge>
          </div>
          <div className="p-6 flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif" data-testid="text-detail-product-name">
                {product.name}
              </DialogTitle>
            </DialogHeader>
            
            <p className="text-muted-foreground mt-4 flex-1" data-testid="text-detail-description">
              {product.description}
            </p>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-primary" data-testid="text-detail-price">
                  ${product.price.toFixed(2)}
                </span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    data-testid="button-detail-decrease"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center text-lg font-semibold" data-testid="text-detail-quantity">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    data-testid="button-detail-increase"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleAddToCart}
                data-testid="button-detail-add-to-cart"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                أضف للسلة - ${(product.price * quantity).toFixed(2)}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
