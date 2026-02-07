import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const razorpayKeyId = process.env.RAZORPAY_KEY_ID || "";
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "";

export const razorpay = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
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
