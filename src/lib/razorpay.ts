import Razorpay from "razorpay";

const razorpayKeyId = process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder";
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret";

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn("⚠️ Razorpay credentials missing. Using placeholders for build stability.");
}

export const razorpay = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
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
