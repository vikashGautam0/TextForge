import express from "express";
import crypto from "crypto";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { razorpay, RAZOR_PLANS } from "../lib/razorpay.js";
import { supabase } from "../index.js";

const router = express.Router();

router.post("/order", ClerkExpressRequireAuth() as any, async (req: any, res) => {
    try {
        const userId = req.auth.userId;
        const { plan } = req.body;

        if (!plan || !RAZOR_PLANS[plan as keyof typeof RAZOR_PLANS]) {
            return res.status(400).json({ error: "Invalid plan" });
        }

        const selectedPlan = RAZOR_PLANS[plan as keyof typeof RAZOR_PLANS];

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
        res.json(order);
    } catch (error: any) {
        console.error("[RAZORPAY_ORDER_ERROR]", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

router.post("/webhook", express.text({ type: "application/json" }), async (req, res) => {
    try {
        const signature = req.headers["x-razorpay-signature"] as string;
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!secret) {
            console.error("RAZORPAY_WEBHOOK_SECRET is not defined");
            return res.status(500).send("Webhook secret missing");
        }

        if (!signature) {
            return res.status(400).send("Signature missing");
        }

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(req.body)
            .digest("hex");

        if (signature !== expectedSignature) {
            console.error("Invalid signature");
            return res.status(401).send("Invalid signature");
        }

        const body = JSON.parse(req.body);

        if (body.event === "payment.captured") {
            const payment = body.payload.payment.entity;
            const userId = payment.notes?.clerkUserId;
            const planType = payment.notes?.planType;

            if (userId) {
                await supabase.from("subscriptions").upsert({
                    user_id: userId,
                    status: "active",
                    plan_type: planType || "creator",
                    pdf_usage_count: 0,
                    last_reset_date: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });
            }
        }

        res.status(200).send("OK");
    } catch (error: any) {
        console.error("[RAZORPAY_WEBHOOK_ERROR]", error);
        res.status(400).send("Error");
    }
});

export default router;
