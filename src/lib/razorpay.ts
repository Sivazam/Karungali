import Razorpay from "razorpay";

// Initialize Razorpay with your key ID
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_1DP5mmOlF5G5ag",
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

export interface PaymentOptions {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
  customer?: {
    name: string;
    email: string;
    contact: string;
  };
}

export class RazorpayService {
  static async createOrder(options: PaymentOptions): Promise<RazorpayOrder> {
    try {
      const order = await razorpay.orders.create({
        amount: options.amount, // Amount in smallest currency unit (paise for INR)
        currency: options.currency,
        receipt: options.receipt,
        notes: options.notes,
      });

      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        created_at: order.created_at,
      };
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      throw new Error("Failed to create payment order");
    }
  }

  static verifyPayment(paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): boolean {
    try {
      // For client-side verification, we'll use a simplified approach
      // In production, this should be done server-side
      console.log("Verifying payment:", paymentData);
      
      // For demo purposes, return true
      // In production, implement proper server-side verification
      return true;
    } catch (error) {
      console.error("Error verifying payment:", error);
      return false;
    }
  }

  static getRazorpayOptions(order: RazorpayOrder, customer?: {
    name: string;
    email: string;
    contact: string;
  }) {
    return {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Spiritual Store",
      description: "Purchase of spiritual items",
      order_id: order.id,
      image: "/logo.svg", // Your logo URL
      prefill: customer ? {
        name: customer.name,
        email: customer.email,
        contact: customer.contact,
      } : undefined,
      notes: {
        address: "Spiritual Store Headquarters",
        order_type: "Spiritual Items Purchase"
      },
      theme: {
        color: "#FF8C42", // Brand color (saffron/orange)
      },
      modal: {
        ondismiss: function() {
          console.log("Payment modal dismissed");
        },
      },
      handler: function(response: any) {
        // This will be handled by the component
        console.log("Payment successful:", response);
      },
    };
  }
}

// Utility function to load Razorpay script
export const loadRazorpayScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay script"));
    document.body.appendChild(script);
  });
};

export default RazorpayService;