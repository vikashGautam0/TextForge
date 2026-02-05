import Razorpay from "razorpay";

export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const RAZOR_PLANS = {
    starter: {
        planId: process.env.RAZORPAY_STARTER_PLAN_ID || "plan_placeholder_1",
        name: "Starter",
        amount: 250000, // Amount in paise (e.g., ₹2500)
        limit: 50,
    },
    team: {
        planId: process.env.RAZORPAY_TEAM_PLAN_ID || "plan_placeholder_2",
        name: "Team",
        amount: 650000, // ₹6500
        limit: 500,
    },
};
