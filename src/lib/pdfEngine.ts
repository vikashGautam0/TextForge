import puppeteer, { Browser } from "puppeteer";

export interface PDFOptions {
    format?: "A4" | "Letter" | "Legal";
    margin?: {
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
    };
    displayHeaderFooter?: boolean;
    headerTemplate?: string;
    footerTemplate?: string;
    printBackground?: boolean;
}

/**
 * Generate PDF from HTML content using Puppeteer
 * Optimized for serverless environments
 */
export async function generatePDF(
    html: string,
    options: PDFOptions = {}
): Promise<Buffer> {
    let browser: Browser | null = null;

    try {
        // Launch browser with serverless-friendly settings
        browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-accelerated-2d-canvas",
                "--no-first-run",
                "--no-zygote",
                "--single-process",
                "--disable-gpu",
            ],
            // Timeout settings
            timeout: 30000,
        });

        const page = await browser.newPage();

        // Set viewport for consistent rendering
        await page.setViewport({
            width: 1200,
            height: 1600,
            deviceScaleFactor: 2,
        });

        // Set content with proper encoding
        await page.setContent(html, {
            waitUntil: "networkidle0",
            timeout: 30000,
        });

        // Default PDF options
        const pdfOptions = {
            format: options.format || ("A4" as const),
            margin: options.margin || {
                top: "20mm",
                right: "15mm",
                bottom: "20mm",
                left: "15mm",
            },
            printBackground: options.printBackground ?? true,
            displayHeaderFooter: options.displayHeaderFooter ?? false,
            headerTemplate: options.headerTemplate || "",
            footerTemplate: options.footerTemplate || "",
        };

        // Generate PDF
        const pdf = await page.pdf(pdfOptions);

        await browser.close();
        browser = null;

        return Buffer.from(pdf);
    } catch (error) {
        console.error("PDF generation error:", error);
        if (browser) {
            await browser.close().catch(console.error);
        }
        throw error;
    }
}

/**
 * Generate PDF with custom template styling
 */
export async function generateStyledPDF(
    content: string,
    templateCSS: string,
    title: string = "Document",
    options: PDFOptions = {}
): Promise<Buffer> {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      background: #ffffff;
    }
    
    ${templateCSS}
    
    @page {
      size: A4;
      margin: 0;
    }
    
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>
  `;

    return generatePDF(html, options);
}

/**
 * Generate PDF with header and footer
 */
export async function generatePDFWithHeaderFooter(
    content: string,
    templateCSS: string,
    title: string,
    author?: string,
    date?: string
): Promise<Buffer> {
    const headerTemplate = `
    <div style="font-size: 10px; color: #64748b; text-align: center; width: 100%; padding: 10px 0;">
      <span style="font-weight: 600;">${title}</span>
    </div>
  `;

    const footerTemplate = `
    <div style="font-size: 9px; color: #94a3b8; text-align: center; width: 100%; padding: 10px 0; border-top: 1px solid #e2e8f0;">
      <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      ${author ? `<span style="margin-left: 20px;">by ${author}</span>` : ""}
      ${date ? `<span style="margin-left: 20px;">${date}</span>` : ""}
    </div>
  `;

    return generateStyledPDF(content, templateCSS, title, {
        displayHeaderFooter: true,
        headerTemplate,
        footerTemplate,
        margin: {
            top: "40mm",
            right: "15mm",
            bottom: "30mm",
            left: "15mm",
        },
    });
}
