import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-01-27.acacia" as any, // Using latest stable
    typescript: true,
});

export const PLANS = {
    starter: {
        priceId: process.env.STRIPE_STARTER_PRICE_ID || "price_starter_placeholder",
        name: "Starter",
        limit: 50,
    },
    team: {
        priceId: process.env.STRIPE_TEAM_PRICE_ID || "price_team_placeholder",
        name: "Team",
        limit: 500,
    },
};
