"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Slider, 
  SliderRange 
} from "@/components/ui/slider";
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Filter,
  Grid,
  List,
  Search
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";

// Sample product data
const allProducts = [
  {
    id: "1",
    name: "Premium Karungali Mala - 108 Beads",
    price: 2999,
    originalPrice: 3999,
    image: "/api/placeholder/300/300",
    category: "Karungali Mala",
    subcategory: "Traditional Mala",
    gstRate: 5,
    rating: 4.8,
    reviews: 124,
    inStock: true,
    certification: ["ISO Certified", "Authentic Wood"],
    tags: ["traditional", "meditation", "premium"],
    description: "Traditional 108-bead Karungali mala made from sacred ebony wood"
  },
  {
    id: "2",
    name: "Rudraksha Mala - 5 Mukhi",
    price: 1899,
    originalPrice: 2499,
    image: "/api/placeholder/300/300",
    category: "Rudraksha Products",
    subcategory: "Rudraksha Mala",
    gstRate: 12,
    rating: 4.9,
    reviews: 89,
    inStock: true,
    certification: ["Lab Certified", "Original Nepal"],
    tags: ["rudraksha", "meditation", "spiritual"],
    description: "Sacred 5-faced Rudraksha mala for meditation and spiritual growth"
  },
  {
    id: "3",
    name: "Spiritual Incense Sticks Set",
    price: 599,
    originalPrice: 799,
    image: "/api/placeholder/300/300",
    category: "Spiritual Items",
    subcategory: "Incense",
    gstRate: 12,
    rating: 4.7,
    reviews: 256,
    inStock: true,
    certification: ["Natural Ingredients", "Handmade"],
    tags: ["incense", "aromatherapy", "natural"],
    description: "Premium quality incense sticks made from natural herbs and resins"
  },
  {
    id: "4",
    name: "Certified Karungali Bracelet",
    price: 1299,
    originalPrice: 1799,
    image: "/api/placeholder/300/300",
    category: "Karungali Mala",
    subcategory: "Bracelets",
    gstRate: 5,
    rating: 4.6,
    reviews: 67,
    inStock: true,
    certification: ["Authenticity Guaranteed", "Traditional Design"],
    tags: ["bracelet", "protection", "daily-wear"],
    description: "Elegant Karungali wood bracelet for daily spiritual protection"
  },
  {
    id: "5",
    name: "7 Mukhi Rudraksha",
    price: 3499,
    originalPrice: 4499,
    image: "/api/placeholder/300/300",
    category: "Rudraksha Products",
    subcategory: "Individual Beads",
    gstRate: 12,
    rating: 4.9,
    reviews: 45,
    inStock: true,
    certification: ["Lab Certified", "Original Nepal"],
    tags: ["rudraksha", "rare", "spiritual-growth"],
    description: "Powerful 7-faced Rudraksha bead for spiritual advancement"
  },
  {
    id: "6",
    name: "Meditation Cushion Set",
    price: 2499,
    originalPrice: null,
    image: "/api/placeholder/300/300",
    category: "Meditation",
    subcategory: "Meditation Accessories",
    gstRate: 12,
    rating: 4.5,
    reviews: 93,
    inStock: true,
    certification: ["Eco-friendly", "Organic Materials"],
    tags: ["meditation", "comfort", "eco-friendly"],
    description: "Comfortable meditation cushions made from organic materials"
  },
  {
    id: "7",
    name: "Spiritual Books Collection",
    price: 899,
    originalPrice: 1199,
    image: "/api/placeholder/300/300",
    category: "Books & Scripts",
    subcategory: "Spiritual Books",
    gstRate: 5,
    rating: 4.8,
    reviews: 178,
    inStock: true,
    certification: ["Authentic Content", "Best Seller"],
    tags: ["books", "knowledge", "spiritual-wisdom"],
    description: "Collection of ancient spiritual wisdom and modern insights"
  },
  {
    id: "8",
    name: "Yoga Mat Premium",
    price: 1899,
    originalPrice: 2499,
    image: "/api/placeholder/300/300",
    category: "Yoga Accessories",
    subcategory: "Yoga Mats",
    gstRate: 12,
    rating: 4.7,
    reviews: 134,
    inStock: true,
    certification: ["Non-slip", "Eco-friendly"],
    tags: ["yoga", "exercise", "eco-friendly"],
    description: "Premium non-slip yoga mat for your daily practice"
  }
];

const categories = [
  "All Categories",
  "Karungali Mala",
  "Rudraksha Products", 
  "Spiritual Items",
  "Meditation",
  "Yoga Accessories",
  "Books & Scripts"
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "newest", label: "Newest First" }
];

export default function ProductsPage() {
  const addItem = useCartStore((state) => state.addItem);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "All Categories" || product.category === selectedCategory;
      
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return b.id.localeCompare(a.id);
        default: // featured
          return (b.originalPrice ? b.originalPrice - b.price : 0) - (a.originalPrice ? a.originalPrice - a.price : 0);
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  const handleAddToCart = (product: any) => {
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
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Spiritual Products</h1>
        <p className="text-muted-foreground">
          Discover our collection of authentic spiritual items and meditation accessories
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Filters</h3>
                
                {/* Category Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Price Range</label>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={10000}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>

                {/* Certification Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Certification</label>
                  <div className="space-y-2">
                    {["ISO Certified", "Lab Certified", "Authenticity Guaranteed"].map((cert) => (
                      <label key={cert} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{cert}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search and Sort Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search spiritual items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-primary text-primary-foreground" : ""}
              >
                <Grid className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-primary text-primary-foreground" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredAndSortedProducts.length} of {allProducts.length} products
            </p>
          </div>

          {/* Products Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product) => (
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
                      <Button 
                        size="sm" 
                        className="flex-1 bg-primary hover:bg-primary/90"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/product/${product.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="text-4xl">📿</div>
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="secondary">{product.category}</Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{product.rating}</span>
                              <span className="text-sm text-muted-foreground">({product.reviews})</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xl">₹{product.price}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Heart className="h-4 w-4 mr-1" />
                              Wishlist
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-primary hover:bg-primary/90"
                              onClick={() => handleAddToCart(product)}
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Results */}
          {filteredAndSortedProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Categories");
                setPriceRange([0, 5000]);
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}