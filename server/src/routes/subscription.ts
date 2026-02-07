import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { supabase } from "../index.js";

const router = express.Router();

router.get("/", ClerkExpressRequireAuth() as any, async (req: any, res) => {
    try {
        const userId = req.auth.userId;

        if (!userId) {
            return res.status(401).send("Unauthorized");
        }

        const { data: subscription, error } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (error && error.code !== "PGRST116") {
            console.error("Error fetching subscription:", error);
            return res.status(500).json({ error: "Database error" });
        }

        res.json(subscription || { plan_type: "starter", status: "none", pdf_usage_count: 0 });
    } catch (error: any) {
        console.error("[SUBSCRIPTION_GET_ERROR]", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
