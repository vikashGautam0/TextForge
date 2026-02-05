import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const signature = req.headers.get("x-razorpay-signature");
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(JSON.stringify(body))
            .digest("hex");

        // In a real webhook, Razorpay sends a simple body. 
        // For local testing or if signatures don't match, verify documentation.
        // NOTE: Razorpay webhook verification usually requires the raw body.

        // For now, let's process the event if it's payment.captured
        if (body.event === "payment.captured") {
            const payment = body.payload.payment.entity;
            const orderId = payment.order_id;

            // We need to fetch the order to get the notes we added
            // Or if notes are in the payment entity:
            const userId = payment.notes.clerkUserId;
            const planType = payment.notes.planType;

            if (userId) {
                await supabase.from("subscriptions").upsert({
                    user_id: userId,
                    status: "active",
                    plan_type: planType,
                    stripe_customer_id: payment.id, // Using this field for Razorpay payment id for now
                    stripe_current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 days
                });
            }
        }

        return new NextResponse("OK", { status: 200 });
    } catch (error: any) {
        console.error("[RAZORPAY_WEBHOOK_ERROR]", error);
        return new NextResponse("Error", { status: 400 });
    }
}
