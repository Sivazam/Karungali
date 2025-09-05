"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Package, 
  Truck, 
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Download,
  Share2
} from "lucide-react";
import Link from "next/link";

export default function OrderSuccessPage() {
  // Mock order data - in real app, this would come from API or context
  const orderData = {
    orderId: "SS-2024-" + Math.floor(Math.random() * 1000000),
    orderDate: new Date().toLocaleDateString(),
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    items: [
      {
        name: "Premium Karungali Mala - 108 Beads",
        quantity: 1,
        price: 2999,
        image: "/api/placeholder/100/100"
      }
    ],
    shippingAddress: {
      fullName: "Rajesh Kumar",
      address: "123, Spiritual Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      phone: "+91 98765 43210",
      email: "rajesh.kumar@email.com"
    },
    payment: {
      method: "Razorpay",
      transactionId: "pay_" + Math.random().toString(36).substr(2, 9),
      amount: 3148.99,
      status: "Paid"
    },
    summary: {
      subtotal: 2999,
      gst: 149.95,
      shipping: 0,
      total: 3148.99
    }
  };

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. We've received your order and will begin processing it right away.
        </p>
        <Badge className="mt-4 bg-green-100 text-green-800">
          Order #{orderData.orderId}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Timeline */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6">Order Status</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Order Confirmed</div>
                    <div className="text-sm text-muted-foreground">{orderData.orderDate}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Processing</div>
                    <div className="text-sm text-muted-foreground">Expected in 1-2 days</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-muted-foreground">Shipped</div>
                    <div className="text-sm text-muted-foreground">Expected in 3-5 days</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-muted-foreground">Delivered</div>
                    <div className="text-sm text-muted-foreground">Estimated by {orderData.estimatedDelivery}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 py-3 border-b last:border-b-0">
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                      <div className="text-2xl">📿</div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₹{item.price}</div>
                      <div className="text-sm text-muted-foreground">Total: ₹{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Delivery Address</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <div>{orderData.shippingAddress.fullName}</div>
                        <div>{orderData.shippingAddress.address}</div>
                        <div>{orderData.shippingAddress.city}, {orderData.shippingAddress.state} - {orderData.shippingAddress.pincode}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{orderData.shippingAddress.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{orderData.shippingAddress.email}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Payment Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method:</span>
                      <span>{orderData.payment.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction ID:</span>
                      <span className="font-mono text-xs">{orderData.payment.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {orderData.payment.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount Paid:</span>
                      <span className="font-medium">₹{orderData.payment.amount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Actions */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="sticky top-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{orderData.summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>GST</span>
                  <span>₹{orderData.summary.gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>
                    {orderData.summary.shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${orderData.summary.shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total Paid</span>
                    <span>₹{orderData.summary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="p-6 space-y-3">
              <Button className="w-full" size="lg">
                <Download className="mr-2 h-4 w-4" />
                Download Invoice
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="mr-2 h-4 w-4" />
                Share Order Details
              </Button>
              <Link href="/products">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Need Help */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Need Help?</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>support@spiritualstore.com</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Our customer support team is available Monday-Saturday, 9 AM to 6 PM.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}