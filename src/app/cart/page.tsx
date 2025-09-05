"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag,
  Shield,
  Truck,
  RefreshCw
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getGSTDetails,
    getTotalGST,
    getGrandTotal,
    getItemsCount
  } = useCartStore();

  const gstDetails = getGSTDetails();
  const subtotal = getSubtotal();
  const totalGST = getTotalGST();
  const grandTotal = getGrandTotal();
  const shippingCharges = subtotal > 999 ? 0 : 50;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any spiritual items to your cart yet.
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/products" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <p className="text-muted-foreground">
          {getItemsCount()} {getItemsCount() === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-3xl">📿</div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-semibold mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="font-bold">₹{item.price}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{item.originalPrice}
                        </span>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {item.gstRate}% GST
                      </Badge>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Qty:</span>
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 py-1 text-center min-w-8 text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-bold">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Clear Cart Button */}
          <div className="text-right">
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-bold">Order Summary</h3>
              
              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CGST ({gstDetails.cgst.rate}%)</span>
                    <span>₹{gstDetails.cgst.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>SGST ({gstDetails.sgst.rate}%)</span>
                    <span>₹{gstDetails.sgst.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>IGST ({gstDetails.igst.rate}%)</span>
                    <span>₹{gstDetails.igst.amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className={shippingCharges === 0 ? "text-green-600" : ""}>
                    {shippingCharges === 0 ? "FREE" : `₹${shippingCharges.toFixed(2)}`}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Free Shipping Notice */}
              {subtotal < 999 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    Add ₹{(999 - subtotal).toFixed(2)} more to get FREE shipping!
                  </p>
                </div>
              )}

              {/* Checkout Button */}
              <Link href="/checkout">
                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Proceed to Checkout
                </Button>
              </Link>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <Shield className="h-5 w-5 text-primary mx-auto mb-1" />
                  <span className="text-xs">Secure</span>
                </div>
                <div className="text-center">
                  <Truck className="h-5 w-5 text-primary mx-auto mb-1" />
                  <span className="text-xs">Fast Delivery</span>
                </div>
                <div className="text-center">
                  <RefreshCw className="h-5 w-5 text-primary mx-auto mb-1" />
                  <span className="text-xs">Easy Returns</span>
                </div>
              </div>

              {/* GST Info */}
              <div className="bg-muted rounded-lg p-3">
                <h4 className="font-medium text-sm mb-2">GST Information</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• GST calculated as per Indian tax regulations</p>
                  <p>• CGST + SGST applicable for same-state orders</p>
                  <p>• IGST applicable for inter-state orders</p>
                  <p>• GST rates vary by product category</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Continue Shopping */}
      <div className="mt-8 text-center">
        <Link href="/products">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}