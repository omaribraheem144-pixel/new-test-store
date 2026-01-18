import { Store, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Store className="h-6 w-6 text-primary" />
              <span className="font-serif text-xl font-semibold">متجرنا</span>
            </div>
            <p className="text-sm text-muted-foreground">
              متجرك المفضل للتسوق عبر الإنترنت. منتجات عالية الجودة وخدمة متميزة.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">
                  <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    الرئيسية
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    المنتجات
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">خدمة العملاء</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>سياسة الإرجاع</li>
              <li>الشحن والتوصيل</li>
              <li>الأسئلة الشائعة</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">تواصل معنا</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                support@store.com
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                +1 234 567 890
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                المملكة العربية السعودية
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 متجرنا. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
