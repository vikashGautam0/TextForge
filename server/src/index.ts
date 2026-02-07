import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { createClient } from "@supabase/supabase-js";
import { Mistral } from "@mistralai/mistralai";
import pdfRoutes from "./routes/pdf.js";
import aiRoutes from "./routes/ai.js";
import razorpayRoutes from "./routes/razorpay.js";
import subscriptionRoutes from "./routes/subscription.js";
import generateRoutes from "./routes/generate.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Mistral Init
export const mistral = new Mistral({
    apiKey: process.env.MISTRAL_API_KEY!,
});

app.use(cors());
app.use(express.json({ limit: "50mb" })); // Increased limit for base64 images
app.use(morgan("dev"));

// Health Check
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// Routes
// We use the middleware for routes that require auth
app.use("/pdf", pdfRoutes);
app.use("/ai", aiRoutes);
app.use("/razorpay", razorpayRoutes);
app.use("/subscription", subscriptionRoutes);
app.use("/generate", generateRoutes);

app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
});
