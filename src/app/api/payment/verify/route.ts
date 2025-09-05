import { NextRequest, NextResponse } from "next/server";
import RazorpayService from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment details" },
        { status: 400 }
      );
    }

    // Verify the payment signature
    const isValid = RazorpayService.verifyPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save the payment details to your database
    // 2. Update the order status
    // 3. Send confirmation email
    // 4. Initiate shipping process

    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}