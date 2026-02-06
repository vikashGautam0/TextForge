import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { razorpay, RAZOR_PLANS } from "@/lib/razorpay";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { plan } = await req.json();

        if (!plan || !RAZOR_PLANS[plan as keyof typeof RAZOR_PLANS]) {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
        }

        const selectedPlan = RAZOR_PLANS[plan as keyof typeof RAZOR_PLANS];

        // Create a subscription or order. For SAAS, subscriptions are better.
        // However, orders are easier to set up for a quick demo.
        // Let's create an 'order' first for immediate payment verification.

        const options = {
            amount: selectedPlan.amount,
            currency: "INR",
            receipt: `rcpt_${userId.slice(-10)}_${Date.now()}`,
            notes: {
                clerkUserId: userId,
                planType: plan,
            }
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json(order);
    } catch (error: unknown) {
        console.error("[RAZORPAY_ORDER_ERROR]", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
    }
}
