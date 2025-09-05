"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Sparkles,
  Shield,
  Truck,
  Award,
  Minus,
  Plus
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { HeroCarousel } from "@/components/ui/carousel/hero-carousel";

// Hero slides data
const heroSlides = [
  {
    id: "1",
    title: "Authentic",
    subtitle: "Karungali Mala",
    description: "Discover our premium collection of traditional 108-bead Karungali mala, crafted from sacred ebony wood for your spiritual journey.",
    ctaText: "Explore Karungali Mala",
    ctaLink: "/category/karungali-mala",
    imageUrl: "/api/placeholder/1920/1080",
    backgroundColor: "linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)",
    textColor: "#FFFFFF"
  },
  {
    id: "2",
    title: "Sacred",
    subtitle: "Rudraksha Collection",
    description: "Experience the divine energy of authentic Rudraksha beads, sourced directly from the Himalayan regions for maximum spiritual potency.",
    ctaText: "Shop Rudraksha",
    ctaLink: "/category/rudraksha",
    imageUrl: "/api/placeholder/1920/1080",
    backgroundColor: "linear-gradient(135deg, #B87333 0%, #8B4513 100%)",
    textColor: "#FFFFFF"
  }
];

// Sample product data
const featuredProducts = [
  {
    id: "1",
    name: "Premium Karungali Mala - 108 Beads",
    price: 2999,
    originalPrice: 3999,
    image: "/api/placeholder/300/300",
    category: "Karungali Mala",
    gstRate: 5,
    rating: 4.8,
    reviews: 124,
    inStock: true,
    certification: ["ISO Certified", "Authentic Wood"],
    description: "Traditional 108-bead Karungali mala made from sacred ebony wood"
  },
  {
    id: "2",
    name: "Rudraksha Mala - 5 Mukhi",
    price: 1899,
    originalPrice: 2499,
    image: "/api/placeholder/300/300",
    category: "Rudraksha Products",
    gstRate: 12,
    rating: 4.9,
    reviews: 89,
    inStock: true,
    certification: ["Lab Certified", "Original Nepal"],
    description: "Sacred 5-faced Rudraksha mala for meditation and spiritual growth"
  },
  {
    id: "3",
    name: "Spiritual Incense Sticks Set",
    price: 599,
    originalPrice: 799,
    image: "/api/placeholder/300/300",
    category: "Spiritual Items",
    gstRate: 12,
    rating: 4.7,
    reviews: 256,
    inStock: true,
    certification: ["Natural Ingredients", "Handmade"],
    description: "Premium quality incense sticks made from natural herbs and resins"
  },
  {
    id: "4",
    name: "Certified Karungali Bracelet",
    price: 1299,
    originalPrice: 1799,
    image: "/api/placeholder/300/300",
    category: "Karungali Mala",
    gstRate: 5,
    rating: 4.6,
    reviews: 67,
    inStock: true,
    certification: ["Authenticity Guaranteed", "Traditional Design"],
    description: "Elegant Karungali wood bracelet for daily spiritual protection"
  }
];

const categories = [
  { name: "Karungali Mala", icon: "📿", href: "/category/karungali-mala", count: 45 },
  { name: "Rudraksha", icon: "🕉️", href: "/category/rudraksha", count: 32 },
  { name: "Spiritual Items", icon: "🪔", href: "/category/spiritual-items", count: 78 },
  { name: "Meditation", icon: "🧘", href: "/category/meditation", count: 23 },
  { name: "Yoga Accessories", icon: "🙏", href: "/category/yoga", count: 19 },
  { name: "Books & Scripts", icon: "📚", href: "/category/books", count: 56 }
];

export default function Home() {
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const handleAddToCart = (product: any) => {
    const cartItem = items.find(item => item.productId === product.id);
    if (cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity + 1);
    } else {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        quantity: 1,
        category: product.category,
        gstRate: product.gstRate
      });
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Carousel */}
      <HeroCarousel slides={heroSlides} autoPlayInterval={6000} />

      {/* Features Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold">100% Authentic</h3>
              <p className="text-sm text-muted-foreground">All products are certified and guaranteed authentic</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">Free shipping on orders above ₹999</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold">Certified Products</h3>
              <p className="text-sm text-muted-foreground">Lab tested and certified spiritual items</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">Dedicated customer support team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Numbers Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join our growing community of spiritual seekers who have found peace and enlightenment through our authentic products
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10K+</div>
              <div className="text-lg font-medium mb-1">Happy Customers</div>
              <div className="text-sm text-muted-foreground">Across India</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-lg font-medium mb-1">Products</div>
              <div className="text-sm text-muted-foreground">Spiritual Items</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">100%</div>
              <div className="text-lg font-medium mb-1">Authentic</div>
              <div className="text-sm text-muted-foreground">Guaranteed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">4.9★</div>
              <div className="text-lg font-medium mb-1">Customer Rating</div>
              <div className="text-sm text-muted-foreground">Based on Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-3xl font-bold">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse range of spiritual products organized by category
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link key={category.name} href={category.href}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border hover:border-primary">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} Products</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular spiritual items loved by thousands of customers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const cartItem = items.find(item => item.productId === product.id);
              const currentCartQuantity = cartItem ? cartItem.quantity : 0;
              
              return (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <div className="aspect-square bg-muted flex items-center justify-center">
                      <div className="text-6xl">📿</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    {product.originalPrice && (
                      <Badge className="absolute top-2 left-2 bg-destructive">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {currentCartQuantity > 0 ? (
                        <div className="flex items-center gap-1 flex-1">
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (currentCartQuantity === 1) {
                                // Remove from cart when quantity is 1 and decrement is clicked
                                updateQuantity(cartItem!.id, 0);
                              } else {
                                updateQuantity(cartItem!.id, currentCartQuantity - 1);
                              }
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-xs font-medium min-w-[20px] text-center">
                            {currentCartQuantity}
                          </span>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(cartItem!.id, Math.min(99, currentCartQuantity + 1))}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          className="flex-1 bg-primary hover:bg-primary/90"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      )}
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/product/${product.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/products">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-2xl font-bold">Why Choose Us?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold">Quality Assurance</h3>
                <p className="text-sm text-muted-foreground">
                  Every product is thoroughly tested and certified for quality and authenticity
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Truck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Quick and secure delivery across India with real-time tracking
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold">Customer Satisfaction</h3>
                <p className="text-sm text-muted-foreground">
                  30-day return policy and dedicated customer support
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}