"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Share2,
  Shield,
  Truck,
  Award,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Trash2
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";

// Sample product data (in real app, this would come from API/database)
const productData: Record<string, any> = {
  "1": {
    id: "1",
    name: "Premium Karungali Mala - 108 Beads",
    price: 2999,
    originalPrice: 3999,
    images: ["/api/placeholder/500/500", "/api/placeholder/500/500", "/api/placeholder/500/500"],
    category: "Karungali Mala",
    subcategory: "Traditional Mala",
    gstRate: 5,
    rating: 4.8,
    reviews: 124,
    inStock: true,
    stockQuantity: 15,
    certification: ["ISO Certified", "Authentic Wood", "Traditional Craftsmanship"],
    tags: ["traditional", "meditation", "premium"],
    description: "Experience the divine energy of our Premium Karungali Mala, meticulously crafted with 108 sacred beads made from authentic ebony wood. This traditional mala has been used for centuries by spiritual seekers for meditation, prayer, and spiritual growth.",
    longDescription: "Our Premium Karungali Mala represents the pinnacle of traditional spiritual craftsmanship. Each bead is carefully selected and hand-polished to ensure the highest quality and spiritual potency. The 108-bead configuration follows ancient Vedic traditions, making it perfect for japa meditation, mantra chanting, and daily spiritual practices.\n\nThe Karungali wood (ebony) used in this mala is known for its protective properties and ability to enhance concentration during meditation. The natural dark hue of the wood symbolizes the absorption of negative energies and the cultivation of positive spiritual vibrations.\n\nFeatures:\n- 108 traditionally sized beads (8mm each)\n- Authentic Karungali (ebony) wood\n- Hand-knotted with durable cotton thread\n- Includes traditional guru bead and tassel\n- Comes with authenticity certificate\n- Protective pouch included",
    specifications: {
      "Material": "Pure Karungali (Ebony) Wood",
      "Bead Count": "108 + 1 Guru Bead",
      "Bead Size": "8mm diameter",
      "Length": "Approximately 36 inches",
      "Thread": "Durable Cotton Thread",
      "Tassel": "Traditional Cotton Tassel",
      "Origin": "South India",
      "Certification": "ISO Certified, Authenticity Guaranteed",
      "Care Instructions": "Keep away from water, clean with dry cloth"
    },
    benefits: [
      "Enhances meditation and concentration",
      "Provides spiritual protection",
      "Helps in stress relief and anxiety reduction",
      "Improves focus during spiritual practices",
      "Balances energy centers (chakras)",
      "Traditional tool for mantra chanting"
    ]
  },
  "2": {
    id: "2",
    name: "Rudraksha Mala - 5 Mukhi",
    price: 1899,
    originalPrice: 2499,
    images: ["/api/placeholder/500/500", "/api/placeholder/500/500"],
    category: "Rudraksha Products",
    subcategory: "Rudraksha Mala",
    gstRate: 12,
    rating: 4.9,
    reviews: 89,
    inStock: true,
    stockQuantity: 8,
    certification: ["Lab Certified", "Original Nepal", "X-ray Tested"],
    tags: ["rudraksha", "meditation", "spiritual"],
    description: "Sacred 5-faced Rudraksha mala for meditation and spiritual growth. Sourced directly from Nepal, each bead is lab-certified for authenticity.",
    longDescription: "Our 5 Mukhi Rudraksha Mala is a powerful spiritual tool that represents Lord Shiva himself. The five faces (mukhis) symbolize the five elements and are believed to bring peace, prosperity, and spiritual enlightenment to the wearer.\n\nEach Rudraksha bead in this mala is carefully selected from the Himalayan regions of Nepal, ensuring the highest quality and spiritual potency. The beads are X-ray tested and lab-certified to guarantee their authenticity and natural origin.",
    specifications: {
      "Material": "Original 5 Mukhi Rudraksha",
      "Bead Count": "108 + 1 Guru Bead",
      "Bead Size": "7-8mm diameter",
      "Length": "Approximately 32 inches",
      "Thread": "Durable Nylon Thread",
      "Origin": "Nepal (Himalayan Region)",
      "Certification": "Lab Certified, X-ray Tested",
      "Ruling Deity": "Lord Shiva",
      "Ruling Planet": "Jupiter"
    },
    benefits: [
      "Brings peace and tranquility",
      "Enhances spiritual growth",
      "Improves concentration and memory",
      "Helps in blood pressure regulation",
      "Provides protection from negative energies",
      "Aids in meditation practices"
    ]
  }
};

const reviews = [
  {
    id: 1,
    name: "Rajesh Kumar",
    rating: 5,
    date: "2024-01-15",
    comment: "Absolutely authentic and high-quality mala. The energy I feel during meditation is incredible. Highly recommended!",
    verified: true
  },
  {
    id: 2,
    name: "Priya Sharma",
    rating: 4,
    date: "2024-01-10",
    comment: "Good quality product and fast delivery. The mala has a nice weight and feel to it. Very satisfied with the purchase.",
    verified: true
  },
  {
    id: 3,
    name: "Amit Patel",
    rating: 5,
    date: "2024-01-05",
    comment: "This is my second purchase from this store. The authenticity certificate gives me confidence in the product quality.",
    verified: true
  }
];

// Featured products data for related products section
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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const productId = params.id as string;
  const product = productData[productId];

  // Check if product is already in cart and get current quantity
  const cartItem = items.find(item => item.productId === productId);
  const currentCartQuantity = cartItem ? cartItem.quantity : 0;

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
        <Button onClick={() => router.push("/products")}>
          Back to Products
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (cartItem) {
      // Update quantity if item already exists in cart
      updateQuantity(cartItem.id, currentCartQuantity + quantity);
    } else {
      // Add new item to cart
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        quantity: quantity,
        category: product.category,
        gstRate: product.gstRate
      });
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const discountPercentage = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary">Products</Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-8xl">📿</div>
            </div>
            
            {/* Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <Badge className="absolute top-4 left-4 bg-destructive">
                {discountPercentage}% OFF
              </Badge>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  className={`w-20 h-20 rounded-md border-2 flex-shrink-0 ${
                    selectedImageIndex === index ? "border-primary" : "border-border"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-2xl">📿</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-muted-foreground">{product.category}</p>
              </div>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ₹{product.originalPrice}
                </span>
              )}
              {discountPercentage > 0 && (
                <Badge variant="destructive">Save {discountPercentage}%</Badge>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.inStock ? (
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-sm font-medium">In Stock ({product.stockQuantity} available)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-sm font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-6">{product.description}</p>

            {/* Certification Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.certification.map((cert: string, index: number) => (
                <Badge key={index} variant="secondary">
                  <Shield className="w-3 h-3 mr-1" />
                  {cert}
                </Badge>
              ))}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (currentCartQuantity > 0) {
                        if (currentCartQuantity === 1) {
                          // Remove from cart when quantity is 1 and decrement is clicked
                          updateQuantity(cartItem!.id, 0);
                        } else {
                          updateQuantity(cartItem!.id, currentCartQuantity - 1);
                        }
                      } else {
                        setQuantity(Math.max(1, quantity - 1));
                      }
                    }}
                    disabled={currentCartQuantity === 0 && quantity <= 1}
                    className="h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 text-center font-medium min-w-[50px]">
                    {currentCartQuantity > 0 ? currentCartQuantity : quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (currentCartQuantity > 0) {
                        updateQuantity(cartItem!.id, Math.min(product.stockQuantity, currentCartQuantity + 1));
                      } else {
                        setQuantity(Math.min(product.stockQuantity, quantity + 1));
                      }
                    }}
                    disabled={currentCartQuantity > 0 ? currentCartQuantity >= product.stockQuantity : quantity >= product.stockQuantity}
                    className="h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {currentCartQuantity > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {product.stockQuantity - currentCartQuantity} left in stock
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                {currentCartQuantity > 0 ? (
                  <>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => updateQuantity(cartItem!.id, 0)}
                      className="flex-1"
                    >
                      <Trash2 className="mr-2 h-5 w-5" />
                      Remove from Cart
                    </Button>
                    <Button 
                      size="lg" 
                      className="bg-primary hover:bg-primary/90"
                      asChild
                    >
                      <Link href="/cart">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        View Cart
                      </Link>
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="lg" 
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                )}
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Shield className="h-6 w-6 text-primary mx-auto mb-1" />
                <span className="text-xs">Authentic</span>
              </div>
              <div className="text-center">
                <Truck className="h-6 w-6 text-primary mx-auto mb-1" />
                <span className="text-xs">Free Shipping</span>
              </div>
              <div className="text-center">
                <Award className="h-6 w-6 text-primary mx-auto mb-1" />
                <span className="text-xs">Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="prose prose-sm max-w-none">
                  {product.longDescription.split('\n\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4 text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="font-medium">{key}:</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="benefits" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {product.benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Review Summary */}
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold">{product.rating}</div>
                      <div className="flex items-center justify-center my-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {product.reviews} reviews
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-2">
                            <span className="text-sm w-3">{rating}</span>
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{ width: `${(rating / 5) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-4 border-t pt-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{review.name}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products Section */}
      <div className="mt-16">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-3xl font-bold">You May Also Like</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover more spiritual items that complement your journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts
            .filter(p => p.id !== productId) // Exclude current product
            .slice(0, 4) // Show max 4 related products
            .map((relatedProduct) => (
              <Card key={relatedProduct.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
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
                  {relatedProduct.originalPrice && (
                    <Badge className="absolute top-2 left-2 bg-destructive">
                      {Math.round((1 - relatedProduct.price / relatedProduct.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{relatedProduct.category}</p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{relatedProduct.rating}</span>
                    <span className="text-xs text-muted-foreground">({relatedProduct.reviews})</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">₹{relatedProduct.price}</span>
                      {relatedProduct.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{relatedProduct.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {(() => {
                      const relatedCartItem = items.find(item => item.productId === relatedProduct.id);
                      const relatedCartQuantity = relatedCartItem ? relatedCartItem.quantity : 0;
                      
                      return relatedCartQuantity > 0 ? (
                        <div className="flex items-center gap-1 flex-1">
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (relatedCartQuantity === 1) {
                                // Remove from cart when quantity is 1 and decrement is clicked
                                updateQuantity(relatedCartItem!.id, 0);
                              } else {
                                updateQuantity(relatedCartItem!.id, relatedCartQuantity - 1);
                              }
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-xs font-medium min-w-[20px] text-center">
                            {relatedCartQuantity}
                          </span>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(relatedCartItem!.id, Math.min(99, relatedCartQuantity + 1))}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          className="flex-1 bg-primary hover:bg-primary/90"
                          onClick={() => {
                            addItem({
                              productId: relatedProduct.id,
                              name: relatedProduct.name,
                              price: relatedProduct.price,
                              originalPrice: relatedProduct.originalPrice,
                              image: relatedProduct.image,
                              quantity: 1,
                              category: relatedProduct.category,
                              gstRate: relatedProduct.gstRate
                            });
                          }}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      );
                    })()}
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/product/${relatedProduct.id}`}>View</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}