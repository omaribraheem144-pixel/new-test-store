import { ArrowRight, ShoppingBag, Truck, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export function LandingHero() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
      
      <section className="container mx-auto px-4 pt-16 pb-24 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight">
                تسوق بذكاء
                <span className="text-primary block mt-2">واكتشف أفضل المنتجات</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                اكتشف مجموعة واسعة من المنتجات عالية الجودة بأسعار تنافسية. توصيل سريع وخدمة عملاء متميزة.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="gap-2" data-testid="button-hero-shop">
                  تسوق الآن
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" asChild data-testid="button-hero-login">
                <a href="/api/login">
                  سجل الدخول
                </a>
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-primary/80 to-accent/80"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">+1000 عميل سعيد</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
            <div className="relative bg-gradient-to-br from-card to-muted rounded-2xl p-8 shadow-xl">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: ShoppingBag, label: "منتجات متنوعة", value: "500+" },
                  { icon: Truck, label: "توصيل سريع", value: "24 ساعة" },
                  { icon: Shield, label: "ضمان الجودة", value: "100%" },
                  { icon: Star, label: "تقييم العملاء", value: "4.9" },
                ].map((stat, i) => (
                  <Card key={i} className="hover-elevate">
                    <CardContent className="p-4 text-center">
                      <stat.icon className="h-8 w-8 mx-auto text-primary mb-2" />
                      <p className="font-bold text-xl">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-12">
          لماذا تختارنا؟
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: ShoppingBag,
              title: "منتجات أصلية",
              description: "جميع منتجاتنا أصلية 100% ومضمونة الجودة",
            },
            {
              icon: Truck,
              title: "شحن مجاني",
              description: "شحن مجاني لجميع الطلبات أكثر من 50 دولار",
            },
            {
              icon: Shield,
              title: "دفع آمن",
              description: "نظام دفع آمن ومشفر لحماية بياناتك",
            },
          ].map((feature, i) => (
            <Card key={i} className="text-center hover-elevate">
              <CardContent className="p-6">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
