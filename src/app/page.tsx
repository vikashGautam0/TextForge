"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const templateShowcase = [
  {
    id: "professional",
    name: "Professional",
    description: "Bold headers, clean typography, and serious business layouts.",
    color: "bg-slate-900",
    textColor: "text-white",
    dots: ["#ff5f57", "#ffbd2e", "#27c93f"],
    elements: (
      <div className="space-y-3">
        <div className="h-6 w-full rounded bg-slate-800" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-12 rounded bg-slate-800/50" />
          <div className="h-12 rounded bg-slate-800/50" />
          <div className="h-12 rounded bg-slate-800/50" />
        </div>
        <div className="h-16 w-full rounded bg-slate-800/30" />
      </div>
    ),
  },
  {
    id: "academic",
    name: "Academic",
    description: "Serif fonts, multi-column precision, and elegant footers.",
    color: "bg-[#fdfcf5]",
    textColor: "text-slate-900",
    dots: ["#d1d1cf", "#d1d1cf", "#d1d1cf"],
    elements: (
      <div className="space-y-3">
        <div className="mx-auto h-4 w-1/2 rounded bg-slate-200" />
        <div className="h-2 w-full rounded bg-slate-100" />
        <div className="h-2 w-full rounded bg-slate-100" />
        <div className="h-20 w-full rounded border border-slate-100 bg-white shadow-sm" />
        <div className="h-2 w-3/4 rounded bg-slate-100" />
      </div>
    ),
  },
  {
    id: "code",
    name: "Developer",
    description: "Ray.so style terminal windows with syntax highlighting.",
    color: "bg-[#0a0d26]",
    textColor: "text-white",
    dots: ["#ff5f57", "#ffbd2e", "#27c93f"],
    elements: (
      <div className="space-y-3">
        <div className="rounded-lg bg-[#0d0f14] p-3 shadow-2xl">
          <div className="mb-2 flex gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#ffbd2e]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#27c93f]" />
          </div>
          <div className="space-y-1.5">
            <div className="h-1 w-2/3 rounded bg-pink-500/40" />
            <div className="h-1 w-1/2 rounded bg-cyan-400/40" />
            <div className="h-1 w-3/4 rounded bg-emerald-400/40" />
          </div>
        </div>
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

export default function Home() {
  const handleCheckout = async (plan: string) => {
    try {
      const response = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const order = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "TextForge Studio",
        description: `Upgrade to ${plan} plan`,
        order_id: order.id,
        handler: function (response: any) {
          // Success! Redirect to dashboard with success param
          window.location.href = "/dashboard?success=true";
        },
        theme: {
          color: "#0f172a",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Razorpay checkout failed:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white font-bold">
            TF
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 leading-tight">TextForge</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Studio</p>
          </div>
        </div>
        <nav className="hidden items-center gap-8 text-slate-500 font-medium md:flex">
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#templates" className="hover:text-slate-900 transition-colors">Templates</a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
        </nav>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-slate-600 hover:text-slate-900 font-semibold transition-colors">
                Sign In
              </button>
            </SignInButton>
            <Link
              className="rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-slate-700 shadow-lg shadow-slate-200"
              href="/sign-up"
            >
              Get Started
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-900 transition hover:bg-slate-50"
              href="/dashboard"
            >
              Go to Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-24 pt-12">
        <section className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-6">
            <p className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
              Launching Beta
              <span className="rounded-full bg-amber-300 px-2 py-0.5 text-[10px] text-slate-900">
                Early Access
              </span>
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
              Generate client-ready PDFs from a single prompt.
            </h1>
            <p className="text-lg leading-relaxed text-slate-600">
              TextForge turns prompts, templates, and data into branded PDFs in
              minutes. No layout work, no manual formatting, just export-ready
              documents.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="rounded-full bg-slate-900 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Start generating
              </Link>
              <a
                href="#pricing"
                className="rounded-full border border-slate-200 px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
              >
                View pricing
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500">
              <span>Trusted by 40+ early teams</span>
              <span>Avg. export time: 18 seconds</span>
              <span>99.9% uptime</span>
            </div>
          </div>

          <div className="relative group animate-float">
            {/* Pulsing "AI Active" Floating Badge */}
            <div className="absolute -left-4 -top-4 z-20 flex items-center gap-2 rounded-2xl bg-white p-3 shadow-2xl shadow-blue-500/20">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 animate-pulse">
                <span className="text-sm">🪄</span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">AI Engine</p>
                <p className="text-xs font-bold text-slate-900">Formatting...</p>
              </div>
            </div>

            {/* Main Preview Card */}
            <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/90 p-6 shadow-2xl shadow-slate-200/60 backdrop-blur-md">
              {/* Scanning Line Effect */}
              <div className="animate-scan" />

              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  Live Preview
                </p>
                <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-tight text-emerald-700">
                  Export ready
                </span>
              </div>

              <div className="mt-8 space-y-5">
                {/* Header Skeleton */}
                <div className="h-4 w-2/3 rounded-full bg-slate-100 animate-pulse" />

                {/* Visual Chart Mockup */}
                <div className="relative h-24 rounded-3xl bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 border border-slate-50">
                  <div className="flex h-full items-end gap-1.5">
                    {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-lg bg-slate-900 animate-grow-bar"
                        style={{
                          height: `${h}%`,
                          opacity: 0.1 + (i * 0.15),
                          animationDelay: `${i * 100}ms`
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Field Mockups */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 rounded-2xl border border-slate-50 bg-slate-50/50 p-3">
                    <div className="h-1.5 w-1/2 rounded-full bg-slate-200" />
                    <div className="h-3 w-3/4 rounded-full bg-slate-300/50 animate-pulse" />
                  </div>
                  <div className="space-y-2 rounded-2xl border border-slate-50 bg-slate-50/50 p-3">
                    <div className="h-1.5 w-1/2 rounded-full bg-slate-200" />
                    <div className="h-3 w-full rounded-full bg-slate-300/50 animate-pulse" />
                  </div>
                </div>

                {/* Brand / Metadata Block (Ray.so Style) */}
                <div className="rounded-3xl bg-[#0d1117] p-5 text-white shadow-xl transition-transform duration-500 hover:scale-[1.02]">
                  <div className="flex h-full flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Document Meta</p>
                      {/* Mini Avatar Group */}
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-5 w-5 rounded-full border-2 border-[#0d1117] bg-slate-900 overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Brand: Atlas Labs</p>
                      <p className="text-[11px] text-slate-400">
                        Tone: crisp, executive, data-forward
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Context</p>
                  <p className="mt-1 text-xs text-slate-500 italic">
                    “Summarize Q4 metrics and highlight pipeline risk.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {feature.detail}
              </p>
            </div>
          ))}
        </section>

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

          <div className="grid gap-8 lg:grid-cols-3">
            {templateShowcase.map((tpl) => (
              <div
                key={tpl.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:shadow-2xl hover:shadow-slate-200"
              >
                <div className={`p-8 ${tpl.color} relative overflow-hidden h-64 flex flex-col justify-center`}>
                  {/* Decorative background flair */}
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
                  <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-white/5 blur-3xl" />

                  {tpl.elements}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-bold text-slate-900">{tpl.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {tpl.description}
                  </p>
                  <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Fully Optimized
                    </span>
                    <Link
                      href="/dashboard"
                      className="text-sm font-bold text-slate-900 hover:underline"
                    >
                      Try template →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
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

        <section id="pricing" className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-6">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Starter
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">₹2,500</p>
            <p className="mt-1 text-sm text-slate-600">Per owner / month</p>
            <p className="mt-4 text-sm text-slate-600">
              50 PDFs, 4 templates, basic branding.
            </p>
            <button
              onClick={() => handleCheckout('starter')}
              className="mt-6 inline-flex w-full justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
            >
              Start trial
            </button>
          </div>
          <div className="rounded-2xl border border-slate-900 bg-slate-900 p-6 text-white shadow-xl">
            <p className="text-xs font-semibold uppercase text-amber-300">
              Team
            </p>
            <p className="mt-3 text-3xl font-semibold">₹6,500</p>
            <p className="mt-1 text-sm text-slate-200">
              Per owner / month
            </p>
            <p className="mt-4 text-sm text-slate-200">
              500 PDFs, unlimited templates, brand kits.
            </p>
            <button
              onClick={() => handleCheckout('team')}
              className="mt-6 inline-flex w-full justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Get started
            </button>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-6">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Enterprise
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">Custom</p>
            <p className="mt-1 text-sm text-slate-600">Annual contract</p>
            <p className="mt-4 text-sm text-slate-600">
              Dedicated support, SSO, SLAs, audit logs.
            </p>
            <a
              href="mailto:founders@textforge.com"
              className="mt-6 inline-flex w-full justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
            >
              Contact sales
            </a>
          </div>
        </section>

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
      </main>
    </div>
  );
}
