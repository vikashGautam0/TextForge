<div align="center">

<img src="client/public/logo.png" alt="TextFroge Logo" width="80" />

# TextFroge Studio

### "From Thought to PDF, Instantly." ✨

[![Live](https://img.shields.io/badge/🌐_Live-textfroge.site-F97316?style=for-the-badge)](https://textfroge.site)
[![Version](https://img.shields.io/badge/version-1.2.0-3ECF8E?style=for-the-badge)](#)
[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](#)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](#)

An AI-powered SaaS platform that transforms your raw text into professionally branded PDF documents — with 15+ templates, real-time preview, and Mistral AI formatting.

</div>

---

## ✨ Features

- 🤖 **AI-Powered Formatting** — Mistral AI can format, summarize, expand, or refine your content
- 🎨 **15+ Professional Templates** — Resume, Invoice, Academic, Technical, Contract, Report & more
- ✍️ **Rich Text Editor** — Full WYSIWYG editing with TipTap (markdown, auto-save, word count)
- ⚡ **Live PDF Preview** — See your document update in real-time as you type
- 🎯 **Brand Controls** — Custom typography, accent colors, and feature image upload
- 🔒 **Authentication** — Secure sign in/sign up via Clerk
- 💳 **Subscription Billing** — 5 pricing tiers powered by Razorpay
- 📜 **PDF History** — All your generated documents saved and accessible
- 📱 **Responsive** — Mobile-first design, works on all devices
- 🔍 **SEO Optimized** — Structured data, sitemap, Open Graph, Twitter Cards

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, Tailwind CSS v4 |
| **Backend** | Express.js 5, TypeScript |
| **AI Engine** | Mistral AI (`mistral-small-latest`) |
| **Editor** | TipTap v3 + tiptap-markdown |
| **PDF Generation** | pdf-lib |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Clerk |
| **Payments** | Razorpay |
| **Deployment** | Vercel (client) + Render (server) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Accounts for: Supabase, Clerk, Mistral AI, Razorpay

### Installation

```bash
# Clone the repo
git clone https://github.com/vikashGautam0/TextForge.git
cd TextForge

# Install all dependencies (root + client + server)
npm run install:all

# Run both client and server concurrently
npm run dev
```

- Client runs at → `http://localhost:3000`
- Server runs at → `http://localhost:3001`

### Environment Variables

**Client** (`client/.env.local`):
```env
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_BACKEND_URL=
MISTRAL_API_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_WEBHOOK_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

**Server** (`server/.env`):
```env
CLERK_SECRET_KEY=
MISTRAL_API_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PORT=3001
```

---

## 📁 Project Structure

```
TextForge/
├── client/                  # Next.js 15 Frontend
│   └── src/
│       ├── app/             # Pages & routes
│       │   ├── dashboard/   # Main editor/studio
│       │   ├── templates/   # Template gallery
│       │   ├── admin/       # Admin panel
│       │   └── api-docs/    # API documentation
│       ├── components/      # RichTextEditor, TemplatePicker, Preview
│       └── lib/             # api.ts, supabase.ts, razorpay.ts
│
├── server/                  # Express.js 5 Backend
│   └── src/
│       ├── routes/
│       │   ├── pdf.ts       # PDF generation (14 templates)
│       │   ├── ai.ts        # Mistral AI formatting
│       │   ├── razorpay.ts  # Payments & webhooks
│       │   └── subscription.ts
│       └── lib/
│
└── package.json             # Monorepo root (concurrently)
```

---

## 💰 Pricing

| Plan | Price | PDFs/mo | AI Formats/mo | Templates |
|------|-------|---------|--------------|-----------|
| **Starter** | Free | 10 | 5 | Basic + watermark |
| **Creator** | ₹149/mo | Unlimited | 20 | 5 templates |
| **Pro Editor** | ₹399/mo | Unlimited | Unlimited | 15+ templates |
| **Business** | ₹1,199/mo | Unlimited | Unlimited | All + API access |
| **Lifetime** | ₹1,999 once | Unlimited | Unlimited | All forever |

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | No | Health check |
| `POST` | `/pdf` | Optional | Generate PDF |
| `POST` | `/ai/format` | Required | AI format text |
| `POST` | `/razorpay/order` | Required | Create payment order |
| `POST` | `/razorpay/verify` | Required | Verify payment |
| `GET` | `/subscription` | Optional | Get user subscription |

---

## 🚢 Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel (auto-deploy from GitHub) |
| Backend | Render |
| Database | Supabase |
| Auth | Clerk |
| Payments | Razorpay (live mode) |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Vikash Gautam**

[![GitHub](https://img.shields.io/badge/GitHub-vikashGautam0-181717?style=flat-square&logo=github)](https://github.com/vikashGautam0)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/vikas-gautam12/)

---

<div align="center">

If you found TextFroge useful, please consider giving it a ⭐ — it really helps!

**[Try it live → textfroge.site](https://textfroge.site)**

</div>
