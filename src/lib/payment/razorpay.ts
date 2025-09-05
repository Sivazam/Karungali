import Razorpay from "razorpay";
import { useCartStore } from "@/store/cart-store";

interface PaymentRequest {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

interface PaymentResponse {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}

interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export class RazorpayService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "",
    });
  }

  // Create order
  async createOrder(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      const options = {
        amount: paymentRequest.amount * 100, // Convert to paise
        currency: paymentRequest.currency,
        receipt: paymentRequest.receipt,
        notes: paymentRequest.notes || {},
      };

      const order = await this.razorpay.orders.create(options);
      
      return {
        orderId: order.id,
        amount: order.amount / 100, // Convert back to rupees
        currency: order.currency,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
      };
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      throw new Error("Failed to create payment order");
    }
  }

  // Verify payment signature
  async verifyPayment(paymentVerification: PaymentVerification): Promise<boolean> {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentVerification;
      
      // Generate signature for verification
      const crypto = await import('crypto');
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || "")
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      return generatedSignature === razorpay_signature;
    } catch (error) {
      console.error("Error verifying payment:", error);
      return false;
    }
  }

  // Get payment details
  async getPaymentDetails(paymentId: string) {
    try {
      const payment = await this.razorpay.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      console.error("Error fetching payment details:", error);
      throw new Error("Failed to fetch payment details");
    }
  }

  // Initialize Razorpay checkout
  initializeCheckout(options: {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    theme?: {
      color: string;
    };
    handler: (response: any) => void;
    modal?: {
      ondismiss: () => void;
    };
  }) {
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
    return rzp;
  }
}

// Export singleton instance
export const razorpayService = new RazorpayService();

// Utility function to load Razorpay script
export function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay script'));
    document.body.appendChild(script);
  });
}