import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

type PDFGeneratePayload = {
    content: string;
    title?: string;
    template?: "simple" | "academic" | "professional" | "code";
    author?: string;
    fontFamily?: string;
    accentColor?: string;
    featureImage?: string; // Base64 string
};

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        console.log("PDF Generation Request - User ID:", userId);
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Check user plan and usage
        let { data: sub } = await supabase
            .from("subscriptions")
            .select("plan_type, pdf_usage_count, last_reset_date")
            .eq("user_id", userId)
            .single();

        let plan = sub?.plan_type || "starter";
        let usageCount = sub?.pdf_usage_count || 0;
        let lastReset = sub?.last_reset_date ? new Date(sub.last_reset_date) : new Date();

        // Monthly Reset Logic
        const now = new Date();
        if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
            usageCount = 0;
            lastReset = now; // Update the variable for the final upsert
            await supabase
                .from("subscriptions")
                .update({ pdf_usage_count: 0, last_reset_date: now.toISOString() })
                .eq("user_id", userId);
        }

        // Limit Checks
        if ((plan === "starter" || plan === "free") && usageCount >= 10) {
            return NextResponse.json({
                error: "Monthly limit reached (10/10 PDFs). Upgrade to Creator for unlimited exports."
            }, { status: 403 });
        }

        const body = (await request.json()) as PDFGeneratePayload;
        let {
            content,
            title = "Document",
            template = "simple",
            fontFamily = "helvetica",
            accentColor = "#000000",
            featureImage,
        } = body;

        // Enforce template restrictions
        // starter: simple or academic
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

        // Helper to sanitize text for WinAnsi encoding (StandarFonts restriction)
        const sanitizeText = (text: string): string => {
            if (!text) return "";
            return text
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // Remove accents
                .replace(/[\u0110\u0111]/g, "d") // Simple d/D fixes
                .replace(/[^\x00-\x7F\xA0-\xFF]/g, " "); // Replace remaining non-WinAnsi with space
        };

        const sanitizedContent = sanitizeText(content);
        const sanitizedTitle = sanitizeText(title);

        if ((!sanitizedContent || sanitizedContent.trim().length === 0) && !featureImage) {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            );
        }

        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();

        // Dynamic Font Selection for Paid Users
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
        const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
        const fontMono = await pdfDoc.embedFont(StandardFonts.Courier);

        // Constants for layout
        const PAGE_WIDTH = 612; // Letter size
        const PAGE_HEIGHT = 792;
        const MARGIN = 50;
        const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

        // Template definitions
        const themes = {
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
            }
        };

        const theme = { ...(themes[template] || themes.simple) };
        if (plan !== "starter" && plan !== "free" && accentColor) {
            const customRgb = hexToRgb(accentColor);
            theme.accent = rgb(customRgb.r, customRgb.g, customRgb.b);
        }

        let currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        let y = PAGE_HEIGHT - MARGIN;

        // Helper to draw background/structure for each page
        const drawPageDecoration = (page: any, isFirstPage: boolean = false) => {
            if (template === "code") {
                // Background - Ray.so "Midnight" Deep Indigo
                page.drawRectangle({
                    x: 0,
                    y: 0,
                    width: PAGE_WIDTH,
                    height: PAGE_HEIGHT,
                    color: rgb(0.04, 0.05, 0.15),
                });

                // Window Shadow (Multi-layered for softness)
                // Window Shadows (Soft multi-pass shadow effect)
                const winX = 50;
                const winY = 60;
                const winW = PAGE_WIDTH - 100;
                const winH = PAGE_HEIGHT - 120;

                page.drawRectangle({
                    x: winX + 5, y: winY - 8,
                    width: winW, height: winH,
                    color: rgb(0, 0, 0), opacity: 0.3
                });

                // Main Code Window (Matching Ray.so Dark)
                page.drawRectangle({
                    x: winX,
                    y: winY,
                    width: winW,
                    height: winH,
                    color: rgb(0.05, 0.06, 0.08),
                });

                // Window Controls
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
                // Draw Header for other templates (only on first page)
                const headTheme = theme as any;
                if (headTheme.headerBg) {
                    page.drawRectangle({
                        x: 0,
                        y: PAGE_HEIGHT - 100,
                        width: PAGE_WIDTH,
                        height: 100,
                        color: headTheme.headerBg,
                    });
                }

                if (plan !== "starter" && plan !== "free") {
                    page.drawText(sanitizedTitle, {
                        x: MARGIN,
                        y: PAGE_HEIGHT - 60,
                        size: 24,
                        font: fontBold,
                        color: headTheme.headerText || theme.primary,
                    });
                }

                page.drawText(`${template.toUpperCase()}`, {
                    x: MARGIN,
                    y: PAGE_HEIGHT - 85,
                    size: 10,
                    font: font,
                    color: headTheme.headerText ? rgb(0.8, 0.8, 1) : theme.secondary,
                });

                return PAGE_HEIGHT - 130;
            }
            return PAGE_HEIGHT - MARGIN;
        };

        y = drawPageDecoration(currentPage, true);

        // Embed Feature Image if present
        if (featureImage) {
            console.log("PDF Engine: Processing feature image...");
            try {
                // Remove data URL prefix if present
                const base64Data = featureImage.replace(/^data:image\/\w+;base64,/, "");
                const imageBytes = new Uint8Array(Buffer.from(base64Data, 'base64'));

                let image;
                // Basic detection based on standard data URL format
                if (featureImage.toLowerCase().startsWith("data:image/png")) {
                    console.log("PDF Engine: Detected PNG format");
                    image = await pdfDoc.embedPng(imageBytes);
                } else if (featureImage.toLowerCase().startsWith("data:image/jpeg") || featureImage.toLowerCase().startsWith("data:image/jpg")) {
                    console.log("PDF Engine: Detected JPEG format");
                    image = await pdfDoc.embedJpg(imageBytes);
                } else {
                    console.log("PDF Engine: Unknown prefix, attempting auto-detect...");
                    // Start of logic to attempt png then jpg if no prefix found or other format
                    try {
                        image = await pdfDoc.embedPng(imageBytes);
                    } catch {
                        image = await pdfDoc.embedJpg(imageBytes);
                    }
                }

                if (image) {
                    console.log("PDF Engine: Image embedded successfully, drawing...");
                    // Scale image to fit within margins
                    const maxImageHeight = 250;
                    const maxImageWidth = CONTENT_WIDTH; // Use the full content width
                    const imageDims = image.scaleToFit(maxImageWidth, maxImageHeight);

                    // Center the image
                    const xOffset = MARGIN + (CONTENT_WIDTH - imageDims.width) / 2;

                    currentPage.drawImage(image, {
                        x: xOffset,
                        y: y - imageDims.height - 20, // Add some padding below header
                        width: imageDims.width,
                        height: imageDims.height,
                    });

                    y -= (imageDims.height + 40); // Update Y position for text
                } else {
                    console.warn("PDF Engine: Image processing completed but no image object created");
                }

            } catch (e) {
                console.error("PDF Engine: Failed to embed feature image", e);
                // Continue without image if it fails
            }
        }

        // Helper for text wrapping & pagination with basic syntax highlighting
        const drawWrappedText = (text: string, options: {
            size: number,
            font: any,
            color: any,
            lineHeight?: number,
            indent?: number
        }) => {
            const { size, font, color, lineHeight = size * 1.6, indent = 0 } = options;
            const xPos = template === "code" ? 90 + indent : MARGIN + indent;
            const currentContentWidth = template === "code" ? PAGE_WIDTH - 180 : CONTENT_WIDTH - indent;

            // Handle potential Markdown code block artifacts
            let cleanText = text;
            if (template === "code") {
                cleanText = text.replace(/^```[a-z]*$/gm, '').replace(/^```$/gm, '');
            }

            const rawLines = cleanText.split('\n');

            for (const lineText of rawLines) {
                if (!lineText.trim() && template !== "code") continue;

                // Handle Horizontal Wrapping
                let linesToDraw: string[] = [];
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
                    // Basic wrapping for other templates (by words)
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
                    // Sub-indent for wrapped parts of the same code line
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

        // Parse and draw content bits - Improved Tag-Aware Processor
        // Split by newlines and then by common HTML tags to handle multi-tag lines
        const htmlTagsRegex = /(<h1.*?>.*?<\/h1>|<h2.*?>.*?<\/h2>|<h3.*?>.*?<\/h3>|<li.*?>.*?<\/li>|<p.*?>.*?<\/p>|<div.*?>.*?<\/div>)/gi;

        const processContent = (rawText: string) => {
            // First, split by newlines as a baseline
            const lines = rawText.split('\n');

            for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine) {
                    if (template !== "code") y -= 12;
                    continue;
                }

                // If it's a code template, just draw the whole line raw
                if (template === "code") {
                    if (/^```[a-z]*$/i.test(trimmedLine)) continue;
                    drawWrappedText(line, { size: 10.5, font: fontMono, color: rgb(0.9, 0.9, 0.95) });
                    continue;
                }

                // Check if this line contains HTML tags
                const tagMatches = trimmedLine.match(htmlTagsRegex);

                if (tagMatches && tagMatches.length > 0) {
                    // This line has tags, process each one
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
                    // Treat as normal text or Markdown
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
                        // Strip any rogue single tags just in case
                        const cleanText = trimmed.replace(/<[^>]*>/g, '');
                        if (cleanText) {
                            drawWrappedText(cleanText, { size: 11, font: font, color: theme.primary });
                            y -= 6;
                        }
                    }
                }

                // Check for page break
                if (y < MARGIN + 40) {
                    currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
                    y = drawPageDecoration(currentPage, false);
                }
            }
        };

        processContent(sanitizedContent);

        // Add page numbers to all pages (except code template if preferred, but keeping for utility)
        const pages = pdfDoc.getPages();
        pages.forEach((page, idx) => {
            // Add watermark for free users
            // Add watermark for free users
            if (plan === "starter" || plan === "free") {
                page.drawText("TextForge Starter", {
                    x: 20,
                    y: 20,
                    size: 8,
                    font: font,
                    color: rgb(0.6, 0.6, 0.6),
                    opacity: 0.6,
                });
            }

            page.drawText(`Page ${idx + 1} of ${pages.length}`, {
                x: PAGE_WIDTH / 2 - 30,
                y: 25,
                size: 9,
                font: font,
                color: template === "code" ? rgb(0.5, 0.4, 0.6) : theme.secondary,
            });
        });

        // Increment usage count (using upsert to handle new users)
        await supabase
            .from("subscriptions")
            .upsert({
                user_id: userId,
                pdf_usage_count: usageCount + 1,
                plan_type: plan,
                last_reset_date: lastReset.toISOString()
            }, { onConflict: 'user_id' });

        // Generate and Return PDF
        const pdfBytes = await pdfDoc.save();

        return new NextResponse(Buffer.from(pdfBytes), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${sanitizedTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf"`,
                "Cache-Control": "no-store",
            },
        });
    } catch (error: any) {
        console.error("PDF generation error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate PDF" },
            { status: 500 }
        );
    }
}
