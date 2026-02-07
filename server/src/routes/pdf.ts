import express from "express";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { supabase } from "../index.js";

const router = express.Router();

type PDFGeneratePayload = {
    content: string;
    title?: string;
    template?: "simple" | "academic" | "professional" | "code" | "modern" | "minimal" | "invoice" | "resume" | "resume_modern" | "resume_executive" | "creative" | "letter" | "report" | "contract";
    author?: string;
    fontFamily?: string;
    accentColor?: string;
    featureImage?: string; // Base64 string
};

router.post("/", ClerkExpressWithAuth() as any, async (req: any, res) => {
    try {
        const userId = req.auth?.userId;
        console.log("PDF Generation Request - User ID:", userId || "Anonymous");

        let plan = "starter";
        let usageCount = 0;
        let lastReset = new Date();

        if (userId) {
            // Check user plan and usage
            const { data: sub } = await supabase
                .from("subscriptions")
                .select("plan_type, pdf_usage_count, last_reset_date")
                .eq("user_id", userId)
                .single();

            plan = sub?.plan_type || "starter";
            usageCount = sub?.pdf_usage_count || 0;
            lastReset = sub?.last_reset_date ? new Date(sub.last_reset_date) : new Date();

            // Monthly Reset Logic
            const now = new Date();
            if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
                usageCount = 0;
                lastReset = now;
                await supabase
                    .from("subscriptions")
                    .update({ pdf_usage_count: 0, last_reset_date: now.toISOString() })
                    .eq("user_id", userId);
            }
        }

        const body = req.body as PDFGeneratePayload;
        const {
            content,
            title = "Document",
            template: requestedTemplate = "simple",
            fontFamily = "helvetica",
            accentColor = "#000000",
            featureImage,
        } = body;

        let template = requestedTemplate;

        // Enforce template restrictions
        if ((plan === "starter" || plan === "free") && template !== "simple" && template !== "academic") {
            template = "simple";
        }

        const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16) / 255,
                g: parseInt(result[2], 16) / 255,
                b: parseInt(result[3], 16) / 255
            } : { r: 0, g: 0, b: 0 };
        };

        const sanitizeText = (text: string): string => {
            if (!text) return "";
            return text
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[\u0110\u0111]/g, "d")
                .replace(/[^\x00-\x7F\xA0-\xFF]/g, " ");
        };

        const sanitizedContent = sanitizeText(content);
        const sanitizedTitle = sanitizeText(title);

        if ((!sanitizedContent || sanitizedContent.trim().length === 0) && !featureImage) {
            return res.status(400).json({ error: "Content is required" });
        }

        const pdfDoc = await PDFDocument.create();

        let selectedFont = StandardFonts.Helvetica;
        let selectedFontBold = StandardFonts.HelveticaBold;

        if (plan !== "starter" && plan !== "free") {
            if (fontFamily === "times-roman") {
                selectedFont = StandardFonts.TimesRoman;
                selectedFontBold = StandardFonts.TimesRomanBold;
            } else if (fontFamily === "courier") {
                selectedFont = StandardFonts.Courier;
                selectedFontBold = StandardFonts.CourierBold;
            }
        }

        const font = await pdfDoc.embedFont(selectedFont);
        const fontBold = await pdfDoc.embedFont(selectedFontBold);
        const fontMono = await pdfDoc.embedFont(StandardFonts.Courier);

        const PAGE_WIDTH = 595.28;
        const PAGE_HEIGHT = 841.89;
        const MARGIN = 50;
        const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

        type Theme = {
            primary: any;
            secondary: any;
            accent: any;
            bg: any;
            headerBg?: any;
            headerText?: any;
            font: PDFFont;
            titleFont: PDFFont;
        };

        const themes: Record<string, Theme> = {
            simple: {
                primary: rgb(0.1, 0.1, 0.1),
                secondary: rgb(0.4, 0.4, 0.4),
                accent: rgb(0, 0.4, 0.8),
                bg: rgb(1, 1, 1),
                headerBg: rgb(0.98, 0.98, 0.98),
                font: font,
                titleFont: fontBold
            },
            academic: {
                primary: rgb(0.05, 0.05, 0.1),
                secondary: rgb(0.3, 0.3, 0.3),
                accent: rgb(0.5, 0, 0),
                bg: rgb(1, 1, 1),
                headerBg: rgb(0.95, 0.95, 0.92),
                font: font,
                titleFont: fontBold
            },
            professional: {
                primary: rgb(0.06, 0.1, 0.2),
                secondary: rgb(0.3, 0.35, 0.45),
                accent: rgb(0.06, 0.1, 0.2),
                bg: rgb(1, 1, 1),
                headerBg: rgb(0.06, 0.1, 0.2),
                headerText: rgb(1, 1, 1),
                font: font,
                titleFont: fontBold
            },
            code: {
                primary: rgb(0.1, 0.12, 0.15),
                secondary: rgb(0.4, 0.45, 0.5),
                accent: rgb(0.3, 0.6, 0.9),
                bg: rgb(0.98, 0.99, 1),
                headerBg: rgb(0.1, 0.12, 0.15),
                headerText: rgb(0.9, 0.95, 1),
                font: fontMono,
                titleFont: fontMono
            },
            modern: {
                primary: rgb(0.1, 0.1, 0.2),
                secondary: rgb(0.3, 0.3, 0.5),
                accent: rgb(0.3, 0.3, 0.9),
                bg: rgb(1, 1, 1),
                headerBg: rgb(0.98, 0.98, 1),
                font: font,
                titleFont: fontBold
            },
            minimal: {
                primary: rgb(0, 0, 0),
                secondary: rgb(0.2, 0.2, 0.2),
                accent: rgb(0.1, 0.1, 0.1),
                bg: rgb(1, 1, 1),
                font: font,
                titleFont: fontBold
            },
            invoice: {
                primary: rgb(0.2, 0.2, 0.2),
                secondary: rgb(0.4, 0.4, 0.4),
                accent: rgb(0, 0.5, 0.5),
                bg: rgb(1, 1, 1),
                headerBg: rgb(0.97, 0.98, 0.98),
                font: font,
                titleFont: fontBold
            },
            resume: {
                primary: rgb(0.15, 0.2, 0.3),
                secondary: rgb(0.3, 0.4, 0.5),
                accent: rgb(0.1, 0.3, 0.6),
                bg: rgb(1, 1, 1),
                font: font,
                titleFont: fontBold
            },
            resume_modern: {
                primary: rgb(0.1, 0.1, 0.15),
                secondary: rgb(0.3, 0.4, 0.5),
                accent: rgb(0.3, 0.2, 0.9),
                bg: rgb(1, 1, 1),
                headerBg: rgb(0.97, 0.98, 1),
                font: font,
                titleFont: fontBold
            },
            resume_executive: {
                primary: rgb(0.1, 0.2, 0.35),
                secondary: rgb(0.4, 0.3, 0.1),
                accent: rgb(0.1, 0.2, 0.35),
                bg: rgb(1, 1, 1),
                font: font,
                titleFont: fontBold
            },
            creative: {
                primary: rgb(0.9, 0.2, 0.2),
                secondary: rgb(0.4, 0.4, 0.4),
                accent: rgb(0.9, 0.5, 0),
                bg: rgb(1, 0.99, 0.95),
                font: font,
                titleFont: fontBold
            },
            letter: {
                primary: rgb(0.1, 0.1, 0.1),
                secondary: rgb(0.3, 0.3, 0.3),
                accent: rgb(0.1, 0.1, 0.1),
                bg: rgb(1, 1, 1),
                font: font,
                titleFont: fontBold
            },
            report: {
                primary: rgb(0.15, 0.3, 0.5),
                secondary: rgb(0.3, 0.4, 0.5),
                accent: rgb(0.15, 0.3, 0.5),
                bg: rgb(1, 1, 1),
                font: font,
                titleFont: fontBold
            },
            contract: {
                primary: rgb(0, 0, 0),
                secondary: rgb(0.1, 0.1, 0.1),
                accent: rgb(0, 0, 0),
                bg: rgb(1, 1, 1),
                font: font,
                titleFont: fontBold
            }
        };

        const theme: Theme = themes[template] || themes.simple;
        if (plan !== "starter" && plan !== "free" && accentColor) {
            const customRgb = hexToRgb(accentColor);
            theme.accent = rgb(customRgb.r, customRgb.g, customRgb.b);
        }

        let currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        let y = PAGE_HEIGHT - MARGIN;

        const drawPageDecoration = (page: PDFPage, isFirstPage: boolean = false) => {
            if (template === "code") {
                page.drawRectangle({
                    x: 0,
                    y: 0,
                    width: PAGE_WIDTH,
                    height: PAGE_HEIGHT,
                    color: rgb(0.04, 0.05, 0.15),
                });
                const winX = 50;
                const winY = 60;
                const winW = PAGE_WIDTH - 100;
                const winH = PAGE_HEIGHT - 120;
                page.drawRectangle({
                    x: winX + 5, y: winY - 8,
                    width: winW, height: winH,
                    color: rgb(0, 0, 0), opacity: 0.3
                });
                page.drawRectangle({
                    x: winX,
                    y: winY,
                    width: winW,
                    height: winH,
                    color: rgb(0.05, 0.06, 0.08),
                });
                const dotY = winY + winH - 35;
                const dotXStart = winX + 25;
                const dotColors = [rgb(1, 0.38, 0.34), rgb(1, 0.74, 0.1), rgb(0.15, 0.79, 0.25)];
                dotColors.forEach((color, i) => {
                    page.drawCircle({
                        x: dotXStart + (i * 20),
                        y: dotY,
                        size: 5.5,
                        color: color,
                    });
                });
                if (!isFirstPage) {
                    const titleText = (sanitizedTitle || "Document") + " (cont.)";
                    page.drawText(titleText, {
                        x: PAGE_WIDTH / 2 - (fontBold.widthOfTextAtSize(titleText, 9) / 2),
                        y: dotY - 4,
                        size: 9,
                        font: fontBold,
                        color: rgb(0.35, 0.4, 0.5),
                    });
                }
                return dotY - 45;
            } else if (isFirstPage) {
                if (theme.headerBg) {
                    page.drawRectangle({
                        x: 0,
                        y: PAGE_HEIGHT - 100,
                        width: PAGE_WIDTH,
                        height: 100,
                        color: theme.headerBg,
                    });
                }
                if (plan !== "starter" && plan !== "free") {
                    page.drawText(sanitizedTitle, {
                        x: MARGIN,
                        y: PAGE_HEIGHT - 60,
                        size: 24,
                        font: fontBold,
                        color: theme.headerText || theme.primary,
                    });
                }
                return PAGE_HEIGHT - 100;
            }
            return PAGE_HEIGHT - MARGIN;
        };

        y = drawPageDecoration(currentPage, true);

        if (featureImage) {
            try {
                const base64Data = featureImage.replace(/^data:image\/\w+;base64,/, "");
                const imageBytes = new Uint8Array(Buffer.from(base64Data, 'base64'));
                let image;
                if (featureImage.toLowerCase().startsWith("data:image/png")) {
                    image = await pdfDoc.embedPng(imageBytes);
                } else if (featureImage.toLowerCase().startsWith("data:image/jpeg") || featureImage.toLowerCase().startsWith("data:image/jpg")) {
                    image = await pdfDoc.embedJpg(imageBytes);
                } else {
                    try {
                        image = await pdfDoc.embedPng(imageBytes);
                    } catch {
                        image = await pdfDoc.embedJpg(imageBytes);
                    }
                }
                if (image) {
                    const maxImageHeight = 250;
                    const maxImageWidth = CONTENT_WIDTH;
                    const imageDims = image.scaleToFit(maxImageWidth, maxImageHeight);
                    const xOffset = MARGIN + (CONTENT_WIDTH - imageDims.width) / 2;
                    currentPage.drawImage(image, {
                        x: xOffset,
                        y: y - imageDims.height - 20,
                        width: imageDims.width,
                        height: imageDims.height,
                    });
                    y -= (imageDims.height + 40);
                }
            } catch (e) {
                console.error("PDF Engine: Failed to embed feature image", e);
            }
        }

        const drawWrappedText = (text: string, options: {
            size: number,
            font: PDFFont,
            color: any,
            lineHeight?: number,
            indent?: number
        }) => {
            const { size, font, color, lineHeight = size * 1.6, indent = 0 } = options;
            const xPos = template === "code" ? 90 + indent : MARGIN + indent;
            const currentContentWidth = template === "code" ? PAGE_WIDTH - 180 : CONTENT_WIDTH - indent;
            let cleanText = text;
            if (template === "code") {
                cleanText = text.replace(/^```[a-z]*$/gm, '').replace(/^```$/gm, '');
            }
            const rawLines = cleanText.split('\n');
            for (const lineText of rawLines) {
                if (!lineText.trim() && template !== "code") continue;
                const linesToDraw: string[] = [];
                if (template === "code") {
                    const charWidth = font.widthOfTextAtSize(' ', size);
                    const maxChars = Math.floor(currentContentWidth / charWidth);
                    if (lineText.length > maxChars) {
                        for (let i = 0; i < lineText.length; i += maxChars) {
                            linesToDraw.push(lineText.substring(i, i + maxChars));
                        }
                    } else {
                        linesToDraw.push(lineText);
                    }
                } else {
                    const words = lineText.split(' ');
                    let currentLine = '';
                    for (const word of words) {
                        const testLine = currentLine + (currentLine ? ' ' : '') + word;
                        const width = font.widthOfTextAtSize(testLine, size);
                        if (width > currentContentWidth && currentLine) {
                            linesToDraw.push(currentLine);
                            currentLine = word;
                        } else {
                            currentLine = testLine;
                        }
                    }
                    if (currentLine) linesToDraw.push(currentLine);
                }
                for (let k = 0; k < linesToDraw.length; k++) {
                    const line = linesToDraw[k];
                    const currentIndent = (template === "code" && k > 0) ? 20 : 0;
                    const finalX = xPos + currentIndent;
                    if (y < MARGIN + 60) {
                        currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
                        y = drawPageDecoration(currentPage, false);
                    }
                    if (template === "code") {
                        const charWidth = font.widthOfTextAtSize(' ', size);
                        const words = line.split(/(\s+|\(|\)|\{|\}|\[|\]|\.|\"|\'|\=|\:|\!|\;|\<|\>|\/)/);
                        let currentX = finalX;
                        for (let i = 0; i < words.length; i++) {
                            const word = words[i];
                            if (!word) continue;
                            let wordColor = color;
                            const trimmedWord = word.trim();
                            if (/^(import|struct|var|let|func|class|return|if|else|guard|type|from|const|async|await|export|default|static|public|private|interface|enum)$/.test(trimmedWord)) {
                                wordColor = rgb(0.85, 0.45, 0.9);
                            } else if (/^(h1|h2|h3|p|ul|li|strong|div|span|section|footer|header|a|button|input|form|v-if|v-for)$/i.test(trimmedWord)) {
                                wordColor = rgb(0.3, 0.82, 0.95);
                            } else if (/^[A-Z][a-zA-Z0-9]*$/.test(trimmedWord)) {
                                wordColor = rgb(0.3, 0.82, 0.95);
                            } else if (words[i + 1] === "(") {
                                wordColor = rgb(0.9, 0.85, 0.4);
                            } else if (/^(\"|\').*(\"|\')$/.test(trimmedWord)) {
                                wordColor = rgb(0.45, 0.85, 0.45);
                            } else if (/^(\(|\)|\{|\}|\[|\]|\.|\=|\:|\!|\;|\,|\<|\>|\/)$/.test(trimmedWord)) {
                                wordColor = rgb(0.5, 0.55, 0.65);
                            }
                            currentPage.drawText(word, {
                                x: currentX,
                                y,
                                size,
                                font,
                                color: wordColor,
                            });
                            currentX += charWidth * word.length;
                        }
                    } else {
                        currentPage.drawText(line, { x: finalX, y, size, font, color });
                    }
                    y -= lineHeight;
                }
            }
        };

        const htmlTagsRegex = /(<h1.*?>.*?<\/h1>|<h2.*?>.*?<\/h2>|<h3.*?>.*?<\/h3>|<li.*?>.*?<\/li>|<p.*?>.*?<\/p>|<div.*?>.*?<\/div>)/gi;

        const processContent = (rawText: string) => {
            const lines = rawText.split('\n');
            for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine) {
                    if (template !== "code") y -= 12;
                    continue;
                }
                if (template === "code") {
                    if (/^```[a-z]*$/i.test(trimmedLine)) continue;
                    drawWrappedText(line, { size: 10.5, font: fontMono, color: rgb(0.9, 0.9, 0.95) });
                    continue;
                }
                const tagMatches = trimmedLine.match(htmlTagsRegex);
                if (tagMatches && tagMatches.length > 0) {
                    for (const tagBlock of tagMatches) {
                        const cleanTag = tagBlock.trim();
                        const text = cleanTag.replace(/<[^>]*>/g, '');
                        if (!text) continue;
                        if (/<h1.*?>/i.test(cleanTag)) {
                            y -= 10;
                            drawWrappedText(text, { size: 22, font: fontBold, color: theme.accent });
                            y -= 15;
                        } else if (/<h2.*?>/i.test(cleanTag)) {
                            y -= 8;
                            drawWrappedText(text, { size: 18, font: fontBold, color: theme.primary });
                            y -= 12;
                        } else if (/<h3.*?>/i.test(cleanTag)) {
                            y -= 5;
                            drawWrappedText(text, { size: 14, font: fontBold, color: theme.secondary });
                            y -= 8;
                        } else if (/<li.*?>/i.test(cleanTag)) {
                            drawWrappedText('• ' + text, { size: 11, font: font, color: theme.primary, indent: 15 });
                            y -= 2;
                        } else {
                            drawWrappedText(text, { size: 11, font: font, color: theme.primary });
                            y -= 6;
                        }
                    }
                } else {
                    const trimmed = trimmedLine;
                    if (trimmed.startsWith('# ')) {
                        y -= 10;
                        drawWrappedText(trimmed.substring(2), { size: 22, font: fontBold, color: theme.accent });
                        y -= 15;
                    } else if (trimmed.startsWith('## ')) {
                        y -= 8;
                        drawWrappedText(trimmed.substring(3), { size: 18, font: fontBold, color: theme.primary });
                        y -= 12;
                    } else if (trimmed.startsWith('### ')) {
                        drawWrappedText(trimmed.substring(4), { size: 14, font: fontBold, color: theme.secondary });
                        y -= 8;
                    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                        drawWrappedText('• ' + trimmed.substring(2), { size: 11, font: font, color: theme.primary, indent: 15 });
                    } else if (/^\d+\.\s/.test(trimmed)) {
                        drawWrappedText(trimmed, { size: 11, font: font, color: theme.primary, indent: 15 });
                    } else {
                        const cleanText = trimmed.replace(/<[^>]*>/g, '');
                        if (cleanText) {
                            drawWrappedText(cleanText, { size: 11, font: font, color: theme.primary });
                            y -= 6;
                        }
                    }
                }
                if (y < MARGIN + 40) {
                    currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
                    y = drawPageDecoration(currentPage, false);
                }
            }
        };

        processContent(sanitizedContent);

        const pages = pdfDoc.getPages();
        const logoUrl = "https://textfroge-studio.vercel.app";

        pages.forEach((page, idx) => {
            const footerY = 25;
            const logoText = "TextFroge Studio";
            const textWidth = fontBold.widthOfTextAtSize(logoText, 9);
            page.drawText(logoText, {
                x: MARGIN,
                y: footerY,
                size: 9,
                font: fontBold,
                color: rgb(0, 0, 0),
            });
            const link = pdfDoc.context.obj({
                Type: 'Annot',
                Subtype: 'Link',
                Rect: [MARGIN, footerY - 2, MARGIN + textWidth, footerY + 10],
                Border: [0, 0, 0],
                A: {
                    Type: 'Action',
                    S: 'URI',
                    URI: pdfDoc.context.obj(logoUrl),
                },
            });
            const linkRef = pdfDoc.context.register(link);
            const annots = page.node.get(pdfDoc.context.obj('Annots'));
            if (annots) {
                (annots as any).push(linkRef);
            } else {
                page.node.set(pdfDoc.context.obj('Annots'), pdfDoc.context.obj([linkRef]));
            }
            page.drawText(`Page ${idx + 1} of ${pages.length}`, {
                x: PAGE_WIDTH / 2 - 30,
                y: footerY,
                size: 8,
                font: font,
                color: rgb(0.5, 0.5, 0.5),
            });
        });

        if (userId) {
            await supabase
                .from("subscriptions")
                .upsert({
                    user_id: userId,
                    pdf_usage_count: usageCount + 1,
                    plan_type: plan,
                    last_reset_date: lastReset.toISOString()
                }, { onConflict: 'user_id' });
        }

        const pdfBytes = await pdfDoc.save();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${sanitizedTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf"`);
        res.send(Buffer.from(pdfBytes));

    } catch (error: any) {
        console.error("CRITICAL PDF ERROR:", {
            message: error.message,
            stack: error.stack,
            userId: req.auth?.userId
        });
        res.status(500).json({ error: error.message || "Failed to generate PDF" });
    }
});

export default router;
