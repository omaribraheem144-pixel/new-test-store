import { Minus, Plus, Trash2, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import type { Product, CartItem } from "@shared/schema";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: (CartItem & { product: Product })[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  isUpdating?: boolean;
}

export function CartSheet({
  open,
  onOpenChange,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  isUpdating,
}: CartSheetProps) {
  const { isAuthenticated } = useAuth();
  
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg" data-testid="cart-sheet">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            سلة التسوق
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-6">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">السلة فارغة</h3>
              <p className="text-muted-foreground text-sm mt-1">
                لم تضف أي منتجات بعد
              </p>
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-continue-shopping">
              تصفح المنتجات
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 rounded-lg bg-muted/50"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <div className="h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-primary font-semibold mt-1">
                        ${item.product.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
                          disabled={isUpdating || item.quantity <= 1}
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium" data-testid={`text-quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={isUpdating}
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem(item.id)}
                      disabled={isUpdating}
                      data-testid={`button-remove-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">المجموع الفرعي</span>
                <span className="font-semibold text-lg" data-testid="text-subtotal">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold">المجموع</span>
                <span className="font-bold text-xl text-primary" data-testid="text-total">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              {isAuthenticated ? (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={onCheckout}
                  disabled={isUpdating}
                  data-testid="button-checkout"
                >
                  إتمام الشراء
                </Button>
              ) : (
                <Button
                  className="w-full"
                  size="lg"
                  asChild
                  data-testid="button-login-to-checkout"
                >
                  <a href="/api/login">سجل الدخول لإتمام الشراء</a>
                </Button>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
