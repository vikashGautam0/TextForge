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
          <Link href="/templates" className="hover:text-slate-900 transition-colors">Templates</Link>
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

          {/* Premium Hero Image with Glassmorphism */}
          <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl transition hover:scale-[1.01] duration-500 group">
            <img
              src="https://plus.unsplash.com/premium_photo-1678566153919-86c4ba4216f1?w=800&auto=format&fit=crop&q=80"
              alt="Modern Document Design"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/40 p-4 backdrop-blur-xl border border-white/40 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Live Engine</p>
                  <p className="text-xs font-semibold text-slate-800">Processing Document Structure...</p>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
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

        <section id="pricing" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {/* Starter Plan */}
          <div className="flex flex-col rounded-3xl border border-slate-200 bg-white/70 p-6 transition hover:shadow-xl">
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Starter</p>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">₹0</span>
                <span className="text-sm text-slate-500">/mo</span>
              </p>
              <ul className="mt-6 space-y-3 text-xs text-slate-600">
                <li className="flex gap-2">✅ <span>10 PDFs / month</span></li>
                <li className="flex gap-2">✅ <span>Basic formatting</span></li>
                <li className="flex gap-2">✅ <span>1 basic template</span></li>
                <li className="flex gap-2 font-medium text-amber-600 italic">⚠️ Watermark enabled</li>
                <li className="flex gap-2 text-slate-400">❌ No AI formatting</li>
              </ul>
            </div>
            <Link
              href="/dashboard"
              className="mt-8 inline-flex w-full justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700"
            >
              Get Started
            </Link>
          </div>

          {/* Creator Plan */}
          <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-xl">
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Creator</p>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">₹149</span>
                <span className="text-sm text-slate-500">/mo</span>
              </p>
              <ul className="mt-6 space-y-3 text-xs text-slate-600">
                <li className="flex gap-2">✅ <span>Unlimited PDFs</span></li>
                <li className="flex gap-2">✅ <span>5 premium templates</span></li>
                <li className="flex gap-2">✅ <span>AI basic formatting</span></li>
                <li className="flex gap-2">✅ <span>No watermark</span></li>
                <li className="flex gap-2">✅ <span>History unlocked</span></li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout('creator')}
              className="mt-8 inline-flex w-full justify-center rounded-xl border-2 border-slate-900 px-4 py-2 text-sm font-bold text-slate-900 transition hover:bg-slate-900 hover:text-white"
            >
              Go Creator
            </button>
          </div>

          {/* Pro Plan */}
          <div className="relative flex flex-col rounded-3xl border-2 border-slate-900 bg-slate-900 p-6 text-white shadow-2xl transition hover:scale-[1.02]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-300 px-3 py-1 text-[10px] font-bold uppercase tracking-tight text-slate-900">
              Most Popular
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-300">Pro Editor</p>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">₹399</span>
                <span className="text-sm text-slate-400">/mo</span>
              </p>
              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                <li className="flex gap-2">✅ <span>Everything in Creator</span></li>
                <li className="flex gap-2">✅ <span>15+ Premium templates</span></li>
                <li className="flex gap-2">✅ <span>Advanced AI formatting</span></li>
                <li className="flex gap-2">✅ <span>Custom branding</span></li>
                <li className="flex gap-2">✅ <span>Priority Support</span></li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout('pro')}
              className="mt-8 inline-flex w-full justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
            >
              Upgrade to Pro
            </button>
          </div>

          {/* Business Plan */}
          <div className="flex flex-col rounded-3xl border border-slate-200 bg-white/70 p-6 transition hover:shadow-xl">
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Business</p>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">₹1199</span>
                <span className="text-sm text-slate-500">/mo</span>
              </p>
              <ul className="mt-6 space-y-3 text-xs text-slate-600">
                <li className="flex gap-2">✅ <span>Everything in Pro</span></li>
                <li className="flex gap-2">✅ <span>Team accounts (5)</span></li>
                <li className="flex gap-2">✅ <span>Unlimited API access</span></li>
                <li className="flex gap-2">✅ <span>Workflow automation</span></li>
                <li className="flex gap-2">✅ <span>SLA Support</span></li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout('business')}
              className="mt-8 inline-flex w-full justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300 transition"
            >
              Contact Team
            </button>
          </div>

          {/* Lifetime Plan */}
          <div className="flex flex-col rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-white p-6 transition hover:shadow-xl">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Lifetime</p>
                <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[8px] font-bold text-indigo-700">LIMITED</span>
              </div>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">₹1,999</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">One-time</span>
              </p>
              <ul className="mt-6 space-y-3 text-xs text-slate-600">
                <li className="flex gap-2">✅ <span>Creator Plan Forever</span></li>
                <li className="flex gap-2">✅ <span>No monthly renewal</span></li>
                <li className="flex gap-2">✅ <span>Future Basic templates</span></li>
                <li className="flex gap-2">✅ <span>Legacy Support</span></li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout('lifetime')}
              className="mt-8 inline-flex w-full justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 shadow-lg shadow-indigo-100"
            >
              Buy Lifetime
            </button>
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
        <footer className="mt-20 border-t border-slate-100 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-slate-900 text-[10px] font-bold text-white flex items-center justify-center">TF</div>
              <p className="text-sm font-bold text-slate-900 uppercase tracking-widest leading-none mt-1">TextForge</p>
            </div>
            <div className="flex gap-8 text-xs font-semibold text-slate-500">
              <Link href="/templates" className="hover:text-slate-900 transition font-bold">Templates</Link>
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
