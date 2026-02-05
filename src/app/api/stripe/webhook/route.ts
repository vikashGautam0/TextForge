import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        ) as any;

        if (!session?.metadata?.clerkUserId) {
            return new NextResponse("User id is required", { status: 400 });
        }

        await supabase.from("subscriptions").upsert({
            user_id: session.metadata.clerkUserId,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: subscription.customer as string,
            stripe_price_id: subscription.items.data[0].price.id,
            stripe_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            status: subscription.status,
            plan_type: session.metadata.planType,
        });
    }

    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        ) as any;

        await supabase.from("subscriptions").update({
            stripe_price_id: subscription.items.data[0].price.id,
            stripe_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            status: subscription.status,
        }).eq("stripe_subscription_id", subscription.id);
    }

    return new NextResponse(null, { status: 200 });
}
