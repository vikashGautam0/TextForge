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
    creator: {
        planId: process.env.RAZORPAY_CREATOR_PLAN_ID || "plan_creator_id",
        name: "Creator",
        amount: 14900, // ₹149 in paise
        limit: 999999, // Unlimited
    },
    pro: {
        planId: process.env.RAZORPAY_PRO_PLAN_ID || "plan_pro_id",
        name: "Pro Editor",
        amount: 39900, // ₹399 in paise
        limit: 999999,
    },
    business: {
        planId: process.env.RAZORPAY_BUSINESS_PLAN_ID || "plan_business_id",
        name: "Business",
        amount: 119900, // ₹1199 in paise
        limit: 999999,
    },
    lifetime: {
        planId: process.env.RAZORPAY_LIFETIME_PLAN_ID || "plan_lifetime_id",
        name: "Lifetime",
        amount: 199900, // ₹1,999 one-time
        limit: 999999,
    }
};
