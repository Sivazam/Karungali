import { NextRequest, NextResponse } from "next/server";
import RazorpayService from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, customer } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // Generate a unique receipt ID
    const receipt = `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create Razorpay order
    const order = await RazorpayService.createOrder({
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt,
      notes: {
        customer_name: customer?.name || "",
        customer_email: customer?.email || "",
        customer_phone: customer?.contact || "",
      },
    });

    return NextResponse.json({
      success: true,
      order,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Payment order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}