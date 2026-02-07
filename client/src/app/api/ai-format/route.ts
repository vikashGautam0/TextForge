import { NextResponse } from "next/server";
import { Mistral } from "@mistralai/mistralai";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

// Initialize Mistral AI client
const mistralKey = process.env.MISTRAL_API_KEY || "placeholder_mistral_key";

if (!process.env.MISTRAL_API_KEY) {
    console.warn("⚠️ Mistral API key missing. Using placeholder for build stability.");
}

const mistral = new Mistral({
    apiKey: mistralKey,
});

type FormatPayload = {
    text: string;
    template?: string;
    tone?: string;
    task?: "format" | "summarize" | "expand" | "refine";
};

type ContentChunk = {
    text?: string;
};


export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Check AI usage for free users
        const { data: sub } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", userId)
            .single();

        const plan = sub?.plan_type || "starter";
        const aiUsage = sub?.ai_usage_count || 0;

        // Allow 5 AI formats for free users
        if ((plan === "starter" || plan === "free") && aiUsage >= 5) {
            return NextResponse.json({
                error: "Monthly AI formatting limit reached (5/5). Upgrade to unlock unlimited AI Magic!"
            }, { status: 403 });
        }

        const body = (await req.json()) as FormatPayload;
        const { text, template = "professional", tone = "formal", task = "format" } = body;

        if (!text || text.trim().length === 0) {
            return NextResponse.json(
                { error: "Text content is required" },
                { status: 400 }
            );
        }

        if (!process.env.MISTRAL_API_KEY) {
            return NextResponse.json(
                { error: "Mistral API key not configured" },
                { status: 500 }
            );
        }

        const taskPrompts = {
            format: "Format the given text into well-structured HTML.",
            summarize: "Summarize the given text while maintaining a professional structure and key points. Return as HTML.",
            expand: "Expand upon the given ideas into a detailed, professional document structure. Return as HTML.",
            refine: "Refine the tone and clarity of the text to be more executive and polished. Return as HTML."
        };

        const systemMessage = `${taskPrompts[task]} Suitable for PDF generation.
          
Rules:
- Use semantic HTML tags (h1, h2, h3, p, ul, ol, li, blockquote, etc.)
- Identify and format headings appropriately
- Break long paragraphs into readable chunks
${plan === "pro" || plan === "business" ? "- Add advanced structure (bullets, tables, professional sections)\n- Optimize for premium print layout" : "- Basic structure and spacing"}
- Maintain the target template style: ${template}
- Tone: ${tone}
- Return ONLY the formatted HTML body content, no <html>, <head>, or <body> tags
- Make it professional and print-ready`;

        // Use Mistral for formatting
        const chatResponse = await mistral.chat.complete({
            model: "mistral-small-latest",
            messages: [
                {
                    role: "system",
                    content: systemMessage,
                },
                {
                    role: "user",
                    content: text,
                },
            ],
        });

        // Extract content from response - handle both string and ContentChunk array
        const messageContent = chatResponse.choices?.[0]?.message?.content as string | ContentChunk[] | undefined;
        let formattedHTML = "";

        if (typeof messageContent === "string") {
            formattedHTML = messageContent;
        } else if (Array.isArray(messageContent)) {
            // Handle ContentChunk array - extract text from chunks
            formattedHTML = messageContent
                .map((chunk) => chunk.text || "")
                .join("");
        }

        // Extract structure for metadata
        const headings: string[] = [];
        const paragraphs: string[] = [];

        const h1Matches = formattedHTML.match(/<h1[^>]*>(.*?)<\/h1>/gi);
        const h2Matches = formattedHTML.match(/<h2[^>]*>(.*?)<\/h2>/gi);
        const pMatches = formattedHTML.match(/<p[^>]*>(.*?)<\/p>/gi);

        if (h1Matches) {
            headings.push(...h1Matches.map((h) => h.replace(/<\/?h1[^>]*>/gi, "")));
        }
        if (h2Matches) {
            headings.push(...h2Matches.map((h) => h.replace(/<\/?h2[^>]*>/gi, "")));
        }
        if (pMatches) {
            paragraphs.push(
                ...pMatches.slice(0, 5).map((p) => p.replace(/<\/?p[^>]*>/gi, ""))
            );
        }

        // Increment AI usage count
        await supabase
            .from("subscriptions")
            .upsert({ user_id: userId, ai_usage_count: (sub?.ai_usage_count || 0) + 1 })
            .eq("user_id", userId);

        return NextResponse.json({
            success: true,
            formattedHTML,
            metadata: {
                headings,
                paragraphs: paragraphs.slice(0, 3),
                wordCount: text.split(/\s+/).length,
                template,
                tone,
                model: "mistral-small-latest",
            },
        });
    } catch (error: unknown) {
        console.error("AI formatting error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to format text" },
            { status: 500 }
        );
    }
}
