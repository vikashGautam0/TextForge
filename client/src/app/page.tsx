"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { fetchFromBackend } from "@/lib/api";


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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-scroll', 'in');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
      section.setAttribute('data-scroll', 'out');
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const { getToken } = useAuth();

  const handleCheckout = async (plan: string) => {
    try {
      const response = await fetchFromBackend("/razorpay/order", {
        method: "POST",
        body: JSON.stringify({ plan }),
      }, getToken);

      const order = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "TextForge Studio",
        description: `Upgrade to ${plan} plan`,
        order_id: order.id,
        handler: function () {
          // Success! Redirect to dashboard with success param
          window.location.href = "/dashboard?success=true";
        },
        theme: {
          color: "#0f172a",
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Razorpay checkout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white border border-slate-100 transition-transform group-hover:scale-110 shadow-sm">
              <Image
                src="/logo.png"
                alt="TextForge Logo"
                fill
                className="object-contain p-1.5"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-none">TextForge</p>
              <p className="text-[8px] uppercase tracking-[0.2em] text-slate-400 font-bold">Studio</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 text-[13px] font-semibold text-slate-500 md:flex">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#templates" className="hover:text-slate-900 transition-colors">Templates</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 md:flex">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-[13px] font-bold text-slate-600 hover:text-slate-900 transition-colors mr-2">
                    Sign In
                  </button>
                </SignInButton>
                <Link
                  className="rounded-full bg-slate-900 px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-white transition hover:bg-slate-700 shadow-sm"
                  href="/sign-up"
                >
                  Join Now
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  className="rounded-full border border-slate-200 bg-white px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-slate-900 transition hover:bg-slate-50"
                  href="/dashboard"
                >
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 shadow-lg md:hidden"
            >
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-[72px] z-[60] bg-white border-t border-slate-100 p-6 animate-in slide-in-from-top-4 duration-300 md:hidden shadow-2xl h-[calc(100vh-72px)] overflow-y-auto">
            <nav className="flex flex-col gap-8 text-xl font-black text-slate-900">
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between">
                Features <span>→</span>
              </a>
              <a href="#templates" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between">
                Templates <span>→</span>
              </a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between">
                Pricing <span>→</span>
              </a>
              <hr className="border-slate-100" />
              <div className="flex flex-col gap-4 mt-auto">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="rounded-2xl border border-slate-200 py-4 text-center font-bold text-slate-600">
                      Sign In
                    </button>
                  </SignInButton>
                  <Link href="/sign-up" className="rounded-2xl bg-indigo-600 py-4 text-center font-bold text-white shadow-lg shadow-indigo-100">
                    Get Started Free
                  </Link>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard" className="rounded-2xl bg-slate-900 py-4 text-center font-bold text-white">
                    Dashboard
                  </Link>
                  <div className="flex items-center justify-center gap-3 py-2 bg-slate-50 rounded-xl p-4">
                    <UserButton afterSignOutUrl="/" showName />
                  </div>
                </SignedIn>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-24 pt-16">
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
            TextForge Studio transforms your ideas into professionally branded documents.
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

        <section id="features" className="grid gap-12 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-4"
            >
              <div className="h-1 w-12 bg-slate-900 rounded-full" />
              <h3 className="text-xl font-bold text-slate-900">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-500">
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

        <section id="pricing" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Starter Plan */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white/70 p-4 transition hover:shadow-lg">
            <div className="flex-1">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Starter</p>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">₹0</span>
                <span className="text-[10px] text-slate-500">/mo</span>
              </p>
              <ul className="mt-4 space-y-2 text-[10px] text-slate-600">
                <li className="flex gap-2">✅ <span>10 PDFs / mo</span></li>
                <li className="flex gap-2">✅ <span>Basic layout</span></li>
                <li className="flex gap-2 font-medium text-amber-600">⚠️ Watermark</li>
              </ul>
            </div>
            <Link
              href="/dashboard"
              className="mt-6 inline-flex w-full justify-center rounded-lg bg-slate-900 px-3 py-2 text-[10px] font-bold text-white transition hover:bg-slate-700"
            >
              Get Started
            </Link>
          </div>

          {/* Creator Plan */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-lg">
            <div className="flex-1">
              <p className="text-[9px] font-bold uppercase tracking-widest text-blue-600">Creator</p>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">₹149</span>
                <span className="text-[10px] text-slate-500">/mo</span>
              </p>
              <ul className="mt-4 space-y-2 text-[10px] text-slate-600">
                <li className="flex gap-2">✅ <span>Unlimited PDFs</span></li>
                <li className="flex gap-2">✅ <span>5 templates</span></li>
                <li className="flex gap-2">✅ <span>No watermark</span></li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout('creator')}
              className="mt-6 inline-flex w-full justify-center rounded-lg border border-slate-900 px-3 py-1.5 text-[10px] font-bold text-slate-900 transition hover:bg-slate-900 hover:text-white"
            >
              Go Creator
            </button>
          </div>

          {/* Pro Plan */}
          <div className="relative flex flex-col rounded-2xl border-2 border-slate-900 bg-slate-900 p-4 text-white shadow-xl transition hover:scale-[1.02]">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-amber-300 px-2 py-0.5 text-[8px] font-bold uppercase tracking-tight text-slate-900 whitespace-nowrap">
              Best Value
            </div>
            <div className="flex-1">
              <p className="text-[9px] font-bold uppercase tracking-widest text-amber-300">Pro Editor</p>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">₹399</span>
                <span className="text-[10px] text-slate-400">/mo</span>
              </p>
              <ul className="mt-4 space-y-2 text-[10px] text-slate-300">
                <li className="flex gap-2">✅ <span>Everything Creator</span></li>
                <li className="flex gap-2">✅ <span>15+ templates</span></li>
                <li className="flex gap-2">✅ <span>Custom branding</span></li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout('pro')}
              className="mt-6 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-[10px] font-bold text-slate-900 transition hover:bg-slate-100"
            >
              Upgrade to Pro
            </button>
          </div>

          {/* Business Plan */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white/70 p-4 transition hover:shadow-lg">
            <div className="flex-1">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Business</p>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">₹1199</span>
                <span className="text-[10px] text-slate-500">/mo</span>
              </p>
              <ul className="mt-4 space-y-2 text-[10px] text-slate-600">
                <li className="flex gap-2">✅ <span>API access</span></li>
                <li className="flex gap-2">✅ <span>5 Team seats</span></li>
                <li className="flex gap-2">✅ <span>Priority SLA</span></li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout('business')}
              className="mt-6 inline-flex w-full justify-center rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-semibold text-slate-700 hover:border-slate-300 transition"
            >
              Contact Team
            </button>
          </div>

          {/* Lifetime Plan */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-white p-4 transition hover:shadow-lg">
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-600">Lifetime</p>
                <span className="rounded bg-indigo-100 px-1 py-0.5 text-[7px] font-bold text-indigo-700 uppercase">Legacy</span>
              </div>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">₹1,999</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">Once</span>
              </p>
              <ul className="mt-4 space-y-2 text-[10px] text-slate-600">
                <li className="flex gap-2">✅ <span>Forever Access</span></li>
                <li className="flex gap-2">✅ <span>All basic updates</span></li>
                <li className="flex gap-2">✅ <span>No monthly fee</span></li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout('lifetime')}
              className="mt-6 inline-flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-2 text-[10px] font-bold text-white transition hover:bg-indigo-700 shadow-md shadow-indigo-100"
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
              <div className="relative h-6 w-6 overflow-hidden rounded bg-white border border-slate-100 shadow-sm">
                <Image
                  src="/logo.png"
                  alt="TextForge Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <p className="text-sm font-bold text-slate-900 uppercase tracking-widest leading-none mt-1">TextForge</p>
            </div>
            <div className="flex gap-8 text-xs font-semibold text-slate-500">
              <a href="#templates" className="hover:text-slate-900 transition font-bold">Templates</a>
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
