import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe, PLANS } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { plan } = await req.json();

        if (!plan || !PLANS[plan as keyof typeof PLANS]) {
            return new NextResponse("Invalid plan", { status: 400 });
        }

        const selectedPlan = PLANS[plan as keyof typeof PLANS];

        // Check if user already has a stripe customer id in our database
        const { data: subscription } = await supabase
            .from("subscriptions")
            .select("stripe_customer_id")
            .eq("user_id", userId)
            .single();

        let customerId = subscription?.stripe_customer_id;

        if (!customerId) {
            // Create a new stripe customer
            const customer = await stripe.customers.create({
                email: user.emailAddresses[0].emailAddress,
                metadata: {
                    clerkUserId: userId,
                },
            });
            customerId = customer.id;

            // Update our database with the new customer id
            await supabase.from("subscriptions").upsert({
                user_id: userId,
                stripe_customer_id: customerId,
                plan_type: "free",
            });
        }

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [
                {
                    price: selectedPlan.priceId,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
            metadata: {
                clerkUserId: userId,
                planType: plan,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("[STRIPE_CHECKOUT_ERROR]", error);
        return new NextResponse(error.message || "Internal Server Error", { status: 500 });
    }
}
