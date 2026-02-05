# 💎 TextForge Studio — Professional AI PDF SaaS

TextForge is a high-performance **AI-Driven PDF Generation Platform** designed for professional researchers, developers, and business teams. It combines the power of **Mistral AI** for intelligent content transformation with a robust, white-label PDF engine.

## 🚀 Live Features

### **✨ AI Studio (Content Transformation)**
Go beyond simple formatting. TextForge features specialized AI tasks:
*   🪄 **Format Structure**: Converts raw text into semantic, print-ready HTML.
*   📝 **Summarize**: Condenses long documents into data-dense executive summaries.
*   🚀 **Expand Content**: Inflates brief ideas into detailed, professional sections.
*   ✨ **Refine Tone**: Polishes writing for an authoritative, executive-level feel.

### **📄 Professional PDF Engine**
*   **Multi-Template System**: Choose from Academic, Professional, Simple, or Code-heavy (Ray.so style) themes.
*   **Tag-Aware Parsing**: Handles complex HTML structures without breaking layouts.
*   **Smart Pagination**: Automatic page overflow handling with intelligent splitting.
*   **White-Labeling**: Paid users can choose custom Typefaces (Helvetica, Serif, Mono) and Brand Accent Colors.

### **🇮🇳 Secure Payments (Razorpay)**
Optimized for the Indian market with native support for:
*   **UPI** (GPay, PhonePe, Paytm)
*   **Credit/Debit Cards**
*   **Netbanking**
*   **Automated Webhooks**: Instant subscription upgrades via secure backend verification.

### **🔐 SaaS Infrastructure**
*   **Authentication**: Secure user management via **Clerk**.
*   **Database**: Real-time state and usage tracking using **Supabase (PostgreSQL)**.
*   **Rate Limiting**: DDoS protection and API gating via **Upstash Redis**.

---

## 💎 Monetization & Tiers

| Feature | **Free** | **Starter (₹2,500/mo)** | **Team (₹6,500/mo)** |
| :--- | :--- | :--- | :--- |
| **PDF Exports** | 5 total | 50 / month | 500 / month |
| **AI Studio Uses** | 5 / month | Unlimited | Unlimited |
| **PDF Length** | Max 3 Pages | Unlimited | Unlimited |
| **Branding** | Watermarked | Clean / White-label | Clean / White-label |
| **Customization** | Standard | Fonts & Colors | Priority Support |

---

## 🛠️ Tech Stack

*   **Frontend**: Next.js 15 (App Router), Tailwind CSS, Lucide React.
*   **AI Model**: Mistral AI (`mistral-small-latest`).
*   **PDF Core**: `pdf-lib` (Custom canvas-based engine).
*   **Backend**: Next.js Serverless Functions.
*   **Storage/DB**: Supabase.
*   **Payments**: Razorpay SDK.
*   **Rate Limiting**: `@upstash/ratelimit`.

---

## ⚙️ Environment Variables

Create a `.env.local` file with the following:

```env
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Mistral AI
MISTRAL_API_KEY=

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
RAZORPAY_STARTER_PLAN_ID=
RAZORPAY_TEAM_PLAN_ID=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## 📖 Database Schema (Supabase)

The system relies on two primary tables:
1.  **`subscriptions`**: Tracks `plan_type`, `ai_usage_count`, and period end dates.
2.  **`pdf_history`**: Maintains document metadata and creation timestamps.

---

## 🚀 Getting Started

1.  **Install dependencies**: `npm install`
2.  **Setup Database**: Run the `SUPABASE_SETUP.sql` in your Supabase SQL Editor.
3.  **Run Dev Server**: `npm run dev`
4.  **Production**: Deploy to Vercel/Railway.

---

**Developed with ❤️ for Professionals.**
