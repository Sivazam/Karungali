"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard,
  Shield,
  Truck,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useAuth } from "@/hooks/use-auth";
import { razorpayService, PaymentDetails } from "@/lib/razorpay";

interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
}

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Goa"
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    items,
    getSubtotal,
    getGSTDetails,
    getTotalGST,
    getGrandTotal,
    clearCart
  } = useCartStore();

  const [step, setStep] = useState<"address" | "payment" | "confirmation">("address");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.displayName || "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: user?.phoneNumber || "",
    email: user?.email || ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const subtotal = getSubtotal();
  const gstDetails = getGSTDetails();
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
            Add some spiritual items to your cart to proceed with checkout.
          </p>
          <Button onClick={() => router.push("/products")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city ||
        !shippingAddress.state || !shippingAddress.pincode || !shippingAddress.phone) {
      alert("Please fill in all required fields");
      return;
    }
    setStep("payment");
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus("processing");

    try {
      const receipt = `order_${Date.now()}`;
      
      await razorpayService.initializePayment(
        grandTotal,
        receipt,
        {
          name: shippingAddress.fullName,
          email: shippingAddress.email,
          contact: shippingAddress.phone,
        },
        (paymentDetails: PaymentDetails) => {
          // Payment successful
          setPaymentStatus("success");
          setOrderDetails({
            id: receipt,
            items: items,
            shippingAddress,
            paymentDetails,
            total: grandTotal,
            estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
          });
          clearCart();
          setStep("confirmation");
        },
        (error: any) => {
          // Payment failed
          setPaymentStatus("error");
          console.error("Payment failed:", error);
        }
      );
    } catch (error) {
      setPaymentStatus("error");
      console.error("Payment initialization failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Checkout</h1>
        <div className="flex items-center gap-2 mt-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === "address" ? "bg-primary text-primary-foreground" : "bg-green-500 text-white"
          }`}>
            {step === "address" ? "1" : <CheckCircle className="h-4 w-4" />}
          </div>
          <div className="flex-1 h-1 bg-border"></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === "payment" ? "bg-primary text-primary-foreground" : 
            step === "confirmation" ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
          }`}>
            {step === "payment" ? "2" : step === "confirmation" ? <CheckCircle className="h-4 w-4" /> : "2"}
          </div>
          <div className="flex-1 h-1 bg-border"></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === "confirmation" ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
          }`}>
            {step === "confirmation" ? <CheckCircle className="h-4 w-4" /> : "3"}
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Shipping Address</span>
          <span>Payment</span>
          <span>Confirmation</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {step === "address" && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress(prev => ({
                          ...prev,
                          fullName: e.target.value
                        }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress(prev => ({
                          ...prev,
                          phone: e.target.value
                        }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress(prev => ({
                        ...prev,
                        email: e.target.value
                      }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                      id="street"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress(prev => ({
                        ...prev,
                        street: e.target.value
                      }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress(prev => ({
                          ...prev,
                          city: e.target.value
                        }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <select
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress(prev => ({
                          ...prev,
                          state: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        required
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code *</Label>
                      <Input
                        id="pincode"
                        type="text"
                        value={shippingAddress.pincode}
                        onChange={(e) => setShippingAddress(prev => ({
                          ...prev,
                          pincode: e.target.value.replace(/\D/g, '')
                        }))}
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    Continue to Payment
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {step === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Options */}
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 border-primary bg-primary/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">Razorpay Secure Payment</div>
                          <div className="text-sm text-muted-foreground">
                            Pay via UPI, Credit Card, Debit Card, Net Banking
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-primary">Recommended</Badge>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-border"></div>
                      <div>
                        <div className="font-medium">Cash on Delivery</div>
                        <div className="text-sm text-muted-foreground">
                          Pay when you receive your order
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Security */}
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Your payment information is encrypted and secure. We use Razorpay's 
                    industry-leading security measures to protect your data.
                  </AlertDescription>
                </Alert>

                {/* Order Summary */}
                <div className="space-y-3">
                  <h4 className="font-medium">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.name} × {item.quantity}</span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total Amount</span>
                    <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Status */}
                {paymentStatus === "processing" && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Processing your payment... Please do not close this window.
                    </AlertDescription>
                  </Alert>
                )}

                {paymentStatus === "error" && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Payment failed. Please try again or choose a different payment method.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep("address")}
                    disabled={isProcessing}
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : `Pay ₹${grandTotal.toFixed(2)}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === "confirmation" && orderDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Order Confirmed!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-xl font-semibold mb-2">Thank you for your order!</h3>
                  <p className="text-muted-foreground">
                    Your order has been placed successfully. We'll send you a confirmation email shortly.
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-3">Order Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Order ID:</span>
                      <span className="font-mono">{orderDetails.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment ID:</span>
                      <span className="font-mono">{orderDetails.paymentDetails.paymentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-medium">₹{orderDetails.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Delivery:</span>
                      <span>{orderDetails.estimatedDelivery.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-medium mb-3">Shipping Address</h4>
                    <div className="text-sm space-y-1">
                      <div>{orderDetails.shippingAddress.fullName}</div>
                      <div>{orderDetails.shippingAddress.street}</div>
                      <div>
                        {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.pincode}
                      </div>
                      <div>📞 {orderDetails.shippingAddress.phone}</div>
                      <div>✉️ {orderDetails.shippingAddress.email}</div>
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-medium mb-3">Order Items</h4>
                    <div className="text-sm space-y-1">
                      {orderDetails.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between">
                          <span>{item.name} × {item.quantity}</span>
                          <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => router.push("/products")}>
                    Continue Shopping
                  </Button>
                  <Button className="flex-1" onClick={() => router.push("/account/orders")}>
                    Track Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-bold">Order Summary</h3>
              
              {/* Order Items */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                      <div className="text-xl">📿</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{item.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Qty: {item.quantity} × ₹{item.price}
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

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

              {/* Trust Indicators */}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}