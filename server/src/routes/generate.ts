import express from "express";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const router = express.Router();

type GeneratePayload = {
    title?: string;
    prompt?: string;
    highlights?: string;
};

router.post("/", async (req, res) => {
    try {
        const body = req.body as GeneratePayload;
        const title = body.title?.trim() || "TextForge Brief";
        const prompt =
            body.prompt?.trim() ||
            "Summarize Q4 metrics and highlight pipeline risk for leadership.";
        const highlights =
            body.highlights?.trim() ||
            "Strong ARR growth, churn stabilizing, pipeline softness in enterprise.";

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([612, 792]);
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        page.drawRectangle({
            x: 40,
            y: height - 120,
            width: width - 80,
            height: 80,
            color: rgb(0.06, 0.1, 0.2),
        });

        page.drawText(title, {
            x: 60,
            y: height - 80,
            size: 20,
            font: fontBold,
            color: rgb(1, 1, 1),
        });

        page.drawText("AI-Generated PDF Preview", {
            x: 60,
            y: height - 105,
            size: 10,
            font,
            color: rgb(0.75, 0.8, 0.9),
        });

        const contentStart = height - 170;
        page.drawText("Prompt", {
            x: 60,
            y: contentStart,
            size: 12,
            font: fontBold,
            color: rgb(0.06, 0.1, 0.2),
        });
        page.drawText(prompt, {
            x: 60,
            y: contentStart - 18,
            size: 11,
            font,
            color: rgb(0.2, 0.25, 0.35),
            maxWidth: width - 120,
            lineHeight: 15,
        });

        page.drawText("Highlights", {
            x: 60,
            y: contentStart - 90,
            size: 12,
            font: fontBold,
            color: rgb(0.06, 0.1, 0.2),
        });
        page.drawText(highlights, {
            x: 60,
            y: contentStart - 108,
            size: 11,
            font,
            color: rgb(0.2, 0.25, 0.35),
            maxWidth: width - 120,
            lineHeight: 15,
        });

        page.drawRectangle({
            x: 60,
            y: 120,
            width: width - 120,
            height: 160,
            color: rgb(0.95, 0.96, 0.98),
            borderColor: rgb(0.85, 0.88, 0.92),
            borderWidth: 1,
        });
        page.drawText("Next steps", {
            x: 80,
            y: 250,
            size: 12,
            font: fontBold,
            color: rgb(0.06, 0.1, 0.2),
        });
        page.drawText(
            "1. Connect data sources\n2. Select a template\n3. Generate PDFs at scale",
            {
                x: 80,
                y: 230,
                size: 11,
                font,
                color: rgb(0.2, 0.25, 0.35),
                lineHeight: 16,
            },
        );

        const pdfBytes = await pdfDoc.save();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=textforge-demo.pdf');
        res.send(Buffer.from(pdfBytes));

    } catch (error: any) {
        console.error("Generate error:", error);
        res.status(400).json({ error: "Unable to generate PDF." });
    }
});

export default router;
