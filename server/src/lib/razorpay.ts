import Razorpay from "razorpay";
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpayKeySecret) {
    if (process.env.NODE_ENV === 'production') {
        console.error("FATAL ERROR: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing in environment variables.");
    } else {
        console.warn("⚠️ Razorpay credentials missing. Checkout will fail.");
    }
}

export const razorpay = new Razorpay({
    key_id: razorpayKeyId || "rzp_test_placeholder",
    key_secret: razorpayKeySecret || "placeholder_secret",
});

export const RAZOR_PLANS = {
    creator: {
        planId: process.env.RAZORPAY_CREATOR_PLAN_ID || "plan_creator_id",
        name: "Creator",
        amount: 14900,
        limit: 999999,
    },
    pro: {
        planId: process.env.RAZORPAY_PRO_PLAN_ID || "plan_pro_id",
        name: "Pro Editor",
        amount: 39900,
        limit: 999999,
    },
    business: {
        planId: process.env.RAZORPAY_BUSINESS_PLAN_ID || "plan_business_id",
        name: "Business",
        amount: 119900,
        limit: 999999,
    },
    lifetime: {
        planId: process.env.RAZORPAY_LIFETIME_PLAN_ID || "plan_lifetime_id",
        name: "Lifetime",
        amount: 199900,
        limit: 999999,
    }
};
