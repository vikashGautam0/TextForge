import Link from "next/link";
import Image from "next/image";
import { HeaderWrapper, PricingSection, ScrollReveal } from "./HomeClientComponents";

const templateShowcase = [
  {
    id: "professional",
    name: "Executive Report",
    description: "Bold headers, clean typography, and corporate-ready layouts.",
    color: "bg-slate-900",
    textColor: "text-white",
    elements: (
      <div className="space-y-3">
        <div className="h-6 w-full rounded bg-white/20" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-12 rounded bg-white/10 flex items-center justify-center text-white/60 text-[8px]">Data</div>
          <div className="h-12 rounded bg-white/10 flex items-center justify-center text-white/60 text-[8px]">Charts</div>
          <div className="h-12 rounded bg-white/10 flex items-center justify-center text-white/60 text-[8px]">KPIs</div>
        </div>
        <div className="h-16 w-full rounded bg-white/5 p-2 text-white/40 text-[7px] leading-relaxed">
          Executive summary with key metrics...
        </div>
      </div>
    ),
  },
  {
    id: "invoice",
    name: "Professional Invoice",
    description: "Clean billing layout with tables and payment terms.",
    color: "bg-white",
    textColor: "text-slate-900",
    border: true,
    elements: (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="h-3 w-20 rounded bg-slate-200" />
          <div className="text-[8px] text-emerald-600 font-bold">PAID</div>
        </div>
        <div className="h-px bg-slate-200" />
        <div className="space-y-1">
          <div className="flex justify-between text-[7px] text-slate-500">
            <span>Web Development</span>
            <span>₹45,000</span>
          </div>
          <div className="flex justify-between text-[7px] text-slate-500">
            <span>UI/UX Design</span>
            <span>₹25,000</span>
          </div>
        </div>
        <div className="h-px bg-slate-200" />
        <div className="flex justify-between text-[9px] font-bold text-slate-900">
          <span>Total</span>
          <span>₹70,000</span>
        </div>
      </div>
    ),
  },
  {
    id: "resume_modern",
    name: "Modern Resume",
    description: "Contemporary CV with sidebar and clean typography.",
    color: "bg-[#f8fafc]",
    textColor: "text-slate-900",
    elements: (
      <div className="flex gap-2 h-full">
        <div className="w-1/3 bg-slate-200 rounded p-2 space-y-2">
          <div className="w-8 h-8 rounded-full bg-slate-300 mx-auto" />
          <div className="h-1.5 w-full rounded bg-slate-300" />
          <div className="h-1 w-3/4 rounded bg-slate-300" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-slate-300" />
          <div className="h-1.5 w-full rounded bg-slate-200" />
          <div className="h-1.5 w-full rounded bg-slate-200" />
          <div className="h-1.5 w-2/3 rounded bg-slate-200" />
        </div>
      </div>
    ),
  },
  {
    id: "code",
    name: "Technical Docs",
    description: "Dark terminal style with syntax highlighting for developers.",
    color: "bg-[#0a0d26]",
    textColor: "text-white",
    elements: (
      <div className="space-y-3">
        <div className="rounded-lg bg-[#0d0f14] p-3 shadow-2xl">
          <div className="mb-2 flex gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#ffbd2e]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#27c93f]" />
          </div>
          <div className="space-y-1.5">
            <div className="text-[7px] text-pink-400">GET /api/users</div>
            <div className="text-[7px] text-cyan-400">POST /api/docs</div>
            <div className="text-[7px] text-emerald-400">Authorization: Bearer</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "proposal",
    name: "Business Proposal",
    description: "Compelling pitch layout with gradient headers.",
    color: "bg-gradient-to-br from-indigo-600 to-purple-600",
    textColor: "text-white",
    elements: (
      <div className="space-y-3">
        <div className="h-5 w-2/3 rounded bg-white/20" />
        <div className="h-2 w-full rounded bg-white/10" />
        <div className="h-2 w-4/5 rounded bg-white/10" />
        <div className="mt-4 flex gap-2">
          <div className="flex-1 rounded bg-white/10 p-2 text-center text-[7px] text-white/70">Timeline</div>
          <div className="flex-1 rounded bg-amber-400/30 p-2 text-center text-[7px] text-amber-200 font-bold">ROI 250%</div>
        </div>
      </div>
    ),
  },
  {
    id: "academic",
    name: "Academic Thesis",
    description: "Serif fonts, structured sections, and formal citations.",
    color: "bg-[#fdfcf5]",
    textColor: "text-slate-900",
    elements: (
      <div className="space-y-3">
        <div className="mx-auto h-4 w-1/2 rounded bg-slate-200 text-center" />
        <div className="h-2 w-full rounded bg-slate-100" />
        <div className="h-2 w-full rounded bg-slate-100" />
        <div className="h-20 w-full rounded border border-slate-100 bg-white shadow-sm p-2 text-[6px] text-slate-400 leading-relaxed">
          Abstract: This paper examines...
        </div>
        <div className="h-2 w-3/4 rounded bg-slate-100" />
      </div>
    ),
  },
];

const features = [
  {
    title: "Prompt-to-PDF in seconds",
    detail:
      "Describe what you need, choose a template, and export a PDF that looks designed.",
  },
  {
    title: "Brand controls built in",
    detail:
      "Lock in fonts, colors, and logos so every output matches your visual identity.",
  },
  {
    title: "Structured data support",
    detail:
      "Map JSON or spreadsheet fields into layouts without manual formatting.",
  },
];

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "TextForge Studio",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "127"
  },
  "description": "Create professional PDFs instantly with TextForge Studio. Free AI-powered PDF generator with 15+ templates. Convert text to PDF, images to PDF, create resumes, invoices, reports & more.",
  "featureList": [
    "AI-powered PDF generation",
    "15+ professional templates",
    "Resume builder with multiple styles",
    "Image to PDF converter",
    "Text to PDF conversion",
    "Invoice generator",
    "Report creator",
    "Contract templates",
    "Custom branding options",
    "Unlimited exports"
  ],
  "screenshot": "/logo.png",
  "author": {
    "@type": "Organization",
    "name": "TextForge Studio"
  }
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is TextForge Studio really free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Our Starter plan is completely free and includes 10 PDF exports per month with basic templates. Upgrade to unlock unlimited exports, premium templates, and AI formatting features."
      }
    },
    {
      "@type": "Question",
      "name": "What types of PDFs can I create?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Create resumes, invoices, reports, academic papers, technical documentation, contracts, letters, and more with 15+ professional templates. Convert text to PDF or images to PDF instantly."
      }
    },
    {
      "@type": "Question",
      "name": "How does the AI formatting work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our AI analyzes your content and automatically formats it according to your chosen template. It handles headings, spacing, typography, and layout to create professional-looking documents instantly."
      }
    },
    {
      "@type": "Question",
      "name": "Can I customize the templates?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely! Customize fonts, colors, add your logo, and adjust layouts. Pro and Business plans offer advanced branding options to match your company's visual identity perfectly."
      }
    },
    {
      "@type": "Question",
      "name": "Is my data secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! All documents are processed securely, and we never store your content without permission. Your privacy and data security are our top priorities."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use this for commercial projects?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! All paid plans include commercial usage rights. Create client proposals, business reports, invoices, and any professional documents for your business or clients."
      }
    }
  ]
};

const faqItems = [
  {
    question: "Is TextForge Studio really free?",
    answer: "Yes! Our Starter plan is completely free and includes 10 PDF exports per month with basic templates. Upgrade to unlock unlimited exports, premium templates, and AI formatting features.",
  },
  {
    question: "What types of PDFs can I create?",
    answer: "Create resumes, invoices, reports, academic papers, technical documentation, contracts, letters, and more with 15+ professional templates. Convert text to PDF or images to PDF instantly.",
  },
  {
    question: "How does the AI formatting work?",
    answer: "Our AI analyzes your content and automatically formats it according to your chosen template. It handles headings, spacing, typography, and layout to create professional-looking documents instantly.",
  },
  {
    question: "Can I customize the templates?",
    answer: "Absolutely! Customize fonts, colors, add your logo, and adjust layouts. Pro and Business plans offer advanced branding options to match your company's visual identity perfectly.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes! All documents are processed securely, and we never store your content without permission. Your privacy and data security are our top priorities.",
  },
  {
    question: "Can I use this for commercial projects?",
    answer: "Yes! All paid plans include commercial usage rights. Create client proposals, business reports, invoices, and any professional documents for your business or clients.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      {/* Scroll animation init (lightweight client component) */}
      <ScrollReveal />

      <HeaderWrapper>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white border border-slate-100 transition-transform group-hover:scale-110 shadow-sm">
            <Image
              src="/logo.png"
              alt="TextFroge Logo"
              fill
              className="object-contain p-1.5"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-none">TextFroge</p>
            <p className="text-[8px] uppercase tracking-[0.2em] text-slate-400 font-bold">Studio</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 text-[13px] font-semibold text-slate-500 md:flex">
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#templates" className="hover:text-slate-900 transition-colors">Templates</a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
        </nav>
      </HeaderWrapper>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-24 pt-16">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center gap-8 lg:py-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Beta Now Public
          </div>
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-slate-900 md:text-7xl">
            From Thought to PDF, <span className="text-slate-400 font-medium">Instantly.</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-slate-500">
            TextFroge Studio transforms your ideas into professionally branded documents.
            No manual formatting. No design skills required. Just pure AI efficiency.
          </p>
          <div className="flex flex-col w-full gap-4 sm:flex-row sm:justify-center mt-4">
            <Link
              href="/dashboard"
              className="rounded-full bg-slate-900 px-10 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-slate-700 shadow-xl shadow-slate-200"
            >
              Start Generating for Free
            </Link>
            <a
              href="#pricing"
              className="rounded-full border border-slate-200 bg-white px-10 py-4 text-sm font-bold uppercase tracking-widest text-slate-700 transition hover:bg-slate-50"
            >
              View Pricing
            </a>
          </div>
          <div className="mt-8 flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span>40+ Teams Joined</span>
            <div className="h-1 w-1 rounded-full bg-slate-200" />
            <span>99.9% Uptime</span>
          </div>
        </section>

        {/* Features Section - Fixed: h3 → h2 for proper heading order */}
        <section id="features" className="grid gap-12 md:grid-cols-3" aria-label="Features">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-4"
            >
              <div className="h-1 w-12 bg-slate-900 rounded-full" />
              <h2 className="text-xl font-bold text-slate-900">
                {feature.title}
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">
                {feature.detail}
              </p>
            </div>
          ))}
        </section>

        {/* Templates Section */}
        <section id="templates" className="space-y-12 py-12">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Template Gallery
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Every document, designed to perfection.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Pick from our collection of expert-designed templates. Each one is
              fully responsive and keeps your brand consistent across every export.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templateShowcase.map((tpl) => (
              <div
                key={tpl.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:shadow-2xl hover:shadow-slate-200"
              >
                <div className={`p-6 ${tpl.color} relative overflow-hidden h-52 flex flex-col justify-center`}>
                  {/* Decorative background flair */}
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
                  <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-white/5 blur-3xl" />
                  {tpl.elements}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold text-slate-900">{tpl.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {tpl.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      AI Ready
                    </span>
                    <Link
                      href={`/dashboard?template=${tpl.id}`}
                      className="text-xs font-bold text-slate-900 hover:underline"
                      aria-label={`Use the ${tpl.name} template`}
                    >
                      Use Template →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Templates Button */}
          <div className="text-center mt-12">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-8 py-4 text-sm font-bold text-slate-900 transition hover:bg-slate-900 hover:text-white"
            >
              View All 15 Templates
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section className="grid gap-6 md:grid-cols-3" aria-label="How it works">
          {[
            {
              title: "1. Upload inputs",
              detail: "Drop in data, copy, or a spreadsheet.",
            },
            {
              title: "2. Describe the output",
              detail: "Add a prompt, tone, and layout preferences.",
            },
            {
              title: "3. Export fast",
              detail: "Download a PDF or send to clients instantly.",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border border-slate-200 bg-white/80 p-6"
            >
              <h3 className="text-base font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{step.detail}</p>
            </div>
          ))}
        </section>

        {/* Pricing — client component with checkout logic */}
        <PricingSection />

        {/* FAQ Section */}
        <section className="space-y-8 py-12" aria-label="Frequently Asked Questions">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="mt-2 text-slate-600">Everything you need to know about TextForge Studio</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {faqItems.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-bold text-slate-900">{faq.question}</h3>
                <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-3xl border border-slate-200 bg-white/80 p-8 text-center shadow-sm">
          <h2 className="text-3xl font-semibold text-slate-900">
            Ready to ship your next PDF in minutes?
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Invite your team, upload your assets, and generate consistent PDFs
            instantly.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Launch the generator
          </Link>
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-slate-100 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="relative h-6 w-6 overflow-hidden rounded bg-white border border-slate-100 shadow-sm">
                <Image
                  src="/logo.png"
                  alt="TextFroge Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <p className="text-sm font-bold text-slate-900 uppercase tracking-widest leading-none mt-1">TextFroge</p>
            </div>
            <div className="flex gap-8 text-xs font-semibold text-slate-500">
              <a href="#templates" className="hover:text-slate-900 transition font-bold" aria-label="Browse template gallery">Templates</a>
              <Link href="/api-docs" className="hover:text-slate-900 transition font-bold">API Docs</Link>
              <Link href="/terms" className="hover:text-slate-900 transition">Terms</Link>
              <Link href="/privacy" className="hover:text-slate-900 transition">Privacy</Link>
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">&copy; 2026 Studio Inc.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
