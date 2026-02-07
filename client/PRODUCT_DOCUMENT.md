# TextForge Product Requirements Document (PRD)

**Project Name:** TextForge  
**Tagline:** Convert Text Into Beautiful AI-Generated PDFs Instantly.  
**Category:** AI-powered PDF generation tool  
**Version:** 1.0.0

---

## 1. Overview
### Description
TextForge is a modern SaaS platform designed to bridge the gap between raw text drafting and professional document publishing. Using advanced AI, it automatically structures, styles, and formats plain text into high-quality, print-ready PDFs without the need for manual typesetting.

### Target Audience
*   **Students:** For quick formatting of essays, assignments, and study notes.
*   **Writers:** For converting drafts into professional manuscripts or blog-to-PDF exports.
*   **Developers:** For generating structured documentation or formatting code snippets into beautiful PDFs.
*   **Businesses:** For creating clean reports, whitepapers, and invoices with minimal effort.

### Core Problem Solved
Traditional document editors (Word, Google Docs) are bloated with features and require manual formatting that interrupts the creative flow. TextForge removes distractions, allowing users to focus on content while the AI handles the professional presentation.

---

## 2. Key Features
*   **Minimalist Text Editor:** A distraction-free markdown-supported editor for raw content entry.
*   **AI Formatting Engine:** Automatically identifies and styles headings, sub-headings, paragraphs, bullet lists, numbered lists, tables, and code blocks.
*   **Advanced Template System:**
    *   *Academic:* Classic serif typography for formal papers.
    *   *Minimal:* Ultra-clean, spacing-focused layout.
    *   *Professional:* Corporate-ready, bold and structured.
    *   *Code:* Dark-themed, syntax-highlighted layout for technical documents.
    *   *Modern:* Vibrant, accent-heavy layout for creative portfolios.
*   **Real-time PDF Preview:** Instant side-by-side rendering as the user types or formats.
*   **One-Click Export:** High-resolution PDF generation with optimized file sizes.
*   **PDF History & Cloud Sync (PRO):** A dedicated archive of previously generated documents.
*   **AI Rewrite/Clean:** One-click polishing to improve grammar, tone, and logical structure.
*   **Premium Aesthetics:** A white-label, modern UI built for speed and visual excellence.

---

## 3. System Workflow
1.  **Input:** User enters or pastes raw text into the TextForge Editor.
2.  **Structuring:** Mistral AI analyzes the text and converts it into structured HTML/Markdown.
3.  **Theming:** The system maps the structured content to the user-selected CSS template.
4.  **Rendering:** Next.js API routes utilize a PDF engine (pdf-lib) or Puppeteer to convert HTML/CSS into a high-fidelity PDF buffer.
5.  **Storage:** The document metadata and preview snippet are stored in Supabase.
6.  **Access:** Subscription tiers enforce limitations on exports and template access via Clerk roles.
7.  **Output:** User downloads the final PDF or saves it to their cloud history.

---

## 4. Subscription Plans
| Feature | Starter (Free) | Creator | Pro Editor | Business |
| :--- | :--- | :--- | :--- | :--- |
| **Price** | ₹0/mo | ₹149/mo | ₹399/mo | ₹1199/mo |
| **PDF Limit** | 10 / month | Unlimited | Unlimited | Unlimited |
| **Templates** | Basic (2) | 5 Premium | All 15+ | All + API |
| **Watermark** | Enabled | Removed | Custom Logo | Custom Logo |
| **AI Format** | ❌ No | ✅ Basic | ✅ Advanced | ✅ Advanced |
| **History** | 1 Hour | 24 Hours | Unlimited | Unlimited |
| **Support** | Community | Email | Priority | Dedicated |

*Note: A **Lifetime** plan is available for ₹1,999 (one-time).*

---

## 5. Dashboard Requirements
*   **Split-Screen Interface:** Content Editor (Left) and Live Preview (Right).
*   **Global Navigation:** Top bar containing the Template Selector, Font settings, and Account control.
*   **Action Center:** Floating or Sidebar buttons for "AI Format", "Clean Text", and "Download PDF".
*   **Contextual Stats:** Live word count, character count, and estimated reading time.
*   **History Access:** Quick-access panel to jump between recent drafts.
*   **Plan Badge:** Clear indicator of current subscription tier and remaining exports.

---

## 6. Admin Panel
*   **System Health:** Real-time monitoring of API response times and generative success rates.
*   **User Management:** Searchable list of users, their roles, and total PDFs generated.
*   **Analytics:** Charts for daily active users, global generation volume, and conversion rates.
*   **Billing Dashboard:** Overview of active subscriptions, revenue (Razorpay sync), and churn rates.
*   **Log Viewer:** API usage logs for debugging generation failures.

---

## 7. Non-Functional Requirements
*   **Performance:** Landing page LCP < 1.2s. PDF generation < 3s.
*   **SEO:** Server-side rendered pages for Landing, Pricing, and Documentation using Next.js Metadata API.
*   **Scalability:** Stateless API routes designed for high-concurrency during peak usage.
*   **Security:** JWT-based Clerk authentication; RLS (Row Level Security) on Supabase for data isolation.
*   **Reliability:** Robust error handling with user-friendly retry states for AI failures.

---

## 8. UI/UX Guidelines
*   **Aesthetic:** Clean, high-contrast, professional "SaaS-lite" design.
*   **Color Palette:** Primary White (#FFFFFF), Text (#0F172A), Accent (Slate/Indigo).
*   **Typography:** Modern sans-serif (Inter/Outfit) for UI; varied typography for templates.
*   **Interactions:** Micro-animations for button hovers, smooth transitions for preview updates.
*   **Accessibility:** WCAG 2.1 compliant color ratios and keyboard navigation support.

---

## 9. Deliverables (Required Pages)
1.  **Home Page:** Hero section, feature grids, and trust signals.
2.  **Pricing Page:** Comparison table for all 5 tiers.
3.  **Dashboard:** The core editing studio.
4.  **History Page:** A gallery view of past PDF exports.
5.  **Templates Gallery:** Preview of all available formatting styles.
6.  **Admin Panel:** Internal metrics and user controls.
7.  **API Docs:** Reference for Business-tier API users.
8.  **Auth Pages:** Customized Clerk login/sign-up flows.
9.  **Legal:** Terms of Service and Privacy Policy.

---

## 10. Tech Stack Summary
*   **Frontend:** Next.js (React), Vanilla CSS (Design Tokens).
*   **Backend:** Node.js API Routes (App Router).
*   **AI:** Mistral AI (Large Language Model integration).
*   **PDF Engine:** pdf-lib / Puppeteer.
*   **Database:** Supabase (PostgreSQL).
*   **Auth:** Clerk.
*   **Payments:** Razorpay.
