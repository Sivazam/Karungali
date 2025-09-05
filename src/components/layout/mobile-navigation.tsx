"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Grid3X3, 
  ShoppingCart, 
  User 
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Categories", href: "/categories", icon: Grid3X3 },
  { name: "Cart", href: "/cart", icon: ShoppingCart },
  { name: "Account", href: "/account", icon: User },
];

export function MobileNavigation() {
  const pathname = usePathname();
  const cartItemsCount = useCartStore((state) => state.getItemsCount());

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href} className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`relative h-12 w-12 flex flex-col items-center justify-center gap-1 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name === "Cart" && cartItemsCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {cartItemsCount}
                    </Badge>
                  )}
                  <span className="text-xs font-medium">{item.name}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}