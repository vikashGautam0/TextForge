import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get("x-razorpay-signature");
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!secret) {
            console.error("RAZORPAY_WEBHOOK_SECRET is not defined");
            return new NextResponse("Webhook secret missing", { status: 500 });
        }

        if (!signature) {
            return new NextResponse("Signature missing", { status: 400 });
        }

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(rawBody)
            .digest("hex");

        if (signature !== expectedSignature) {
            console.error("Invalid signature");
            return new NextResponse("Invalid signature", { status: 401 });
        }

        const body = JSON.parse(rawBody);

        // Process the event if it's payment.captured
        if (body.event === "payment.captured") {
            const payment = body.payload.payment.entity;
            const userId = payment.notes?.clerkUserId;
            const planType = payment.notes?.planType;

            if (userId) {
                await supabase.from("subscriptions").upsert({
                    user_id: userId,
                    status: "active",
                    plan_type: planType || "creator",
                    pdf_usage_count: 0, // Reset count on upgrade
                    last_reset_date: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });
            }
        }

        return new NextResponse("OK", { status: 200 });
    } catch (error: any) {
        console.error("[RAZORPAY_WEBHOOK_ERROR]", error);
        return new NextResponse("Error", { status: 400 });
    }
}
