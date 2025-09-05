"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Heart, 
  Menu, 
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { AuthModal } from "@/components/auth/auth-modal";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const cartItemsCount = useCartStore((state) => state.getItemsCount());

  const categories = [
    { name: "Karungali Mala", href: "/category/karungali-mala" },
    { name: "Rudraksha", href: "/category/rudraksha" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="border-b bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="hidden md:flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>support@spiritualstore.com</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>Ship across India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">स</span>
            </div>
            <span className="font-bold text-xl text-foreground">Spiritual Store</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search spiritual items..."
                className="w-64 pl-10"
              />
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-2">
            {/* Search - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* User Account */}
            <Link href="/auth">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* Wishlist */}
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search spiritual items..."
                      className="pl-10"
                    />
                  </div>
                  <nav className="flex flex-col space-y-2">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="text-foreground hover:text-primary transition-colors font-medium py-2"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </nav>
                  <div className="border-t pt-4">
                    <AuthModal>
                      <Button variant="outline" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        My Account
                      </Button>
                    </AuthModal>
                    <Button variant="outline" className="w-full justify-start mt-2">
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Button>
                    <Button variant="outline" className="w-full justify-start mt-2">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      My Cart
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="pb-4 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search spiritual items..."
                className="pl-10"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}