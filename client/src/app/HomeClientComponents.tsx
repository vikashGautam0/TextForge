"use client";

import { useState, useCallback, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { fetchFromBackend } from "@/lib/api";

// Dynamically load Razorpay script only when needed
function loadRazorpay(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(script);
  });
}

export function PricingSection() {
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);

  const handleCheckout = useCallback(async (plan: string) => {
    if (!isSignedIn) {
      setPendingPlan(plan);
      setShowSignInPrompt(true);
      return;
    }

    try {
      // Load Razorpay on demand
      await loadRazorpay();

      const response = await fetchFromBackend("/razorpay/order", {
        method: "POST",
        body: JSON.stringify({ plan }),
      }, getToken);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Order creation failed:", errorText);
        alert("Failed to create order. Please try again.");
        return;
      }

      const order = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "TextFroge Studio",
        description: `Upgrade to ${plan} plan`,
        order_id: order.id,
        handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          try {
            const verifyRes = await fetchFromBackend("/razorpay/verify", {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: plan,
              }),
            }, getToken);

            if (verifyRes.ok) {
              window.location.href = "/dashboard?success=true";
            } else {
              console.error("Payment verification failed");
              alert("Payment received but plan activation failed. Please contact support.");
              window.location.href = "/dashboard?success=true";
            }
          } catch (err) {
            console.error("Verification error:", err);
            window.location.href = "/dashboard?success=true";
          }
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
      alert("Payment failed. Please check your connection and try again.");
    }
  }, [isSignedIn, getToken]);

  return (
    <>
      {/* Sign In Prompt Modal */}
      {showSignInPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900">Sign in to continue</h3>
            <p className="mt-2 text-sm text-slate-600">
              You need to sign in before upgrading to the <span className="font-semibold capitalize">{pendingPlan}</span> plan.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowSignInPrompt(false);
                  setPendingPlan(null);
                }}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <SignInButton mode="modal" forceRedirectUrl={`/?checkout=${pendingPlan}`}>
                <button className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      )}

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
    </>
  );
}

export function HeaderAuthButtons() {
  return (
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
  );
}

export function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 top-[72px] z-[60] bg-white border-t border-slate-100 p-6 animate-in slide-in-from-top-4 duration-300 md:hidden shadow-2xl h-[calc(100vh-72px)] overflow-y-auto">
      <nav className="flex flex-col gap-8 text-xl font-black text-slate-900">
        <a href="#features" onClick={onClose} className="flex items-center justify-between">
          Features <span>→</span>
        </a>
        <a href="#templates" onClick={onClose} className="flex items-center justify-between">
          Templates <span>→</span>
        </a>
        <a href="#pricing" onClick={onClose} className="flex items-center justify-between">
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
  );
}

export function MobileMenuButton({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 shadow-lg md:hidden"
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
    >
      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {isOpen ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
        )}
      </svg>
    </button>
  );
}

export function HeaderWrapper({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {children}
        <div className="flex items-center gap-3">
          <HeaderAuthButtons />
          <MobileMenuButton isOpen={isMobileMenuOpen} onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        </div>
      </div>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
}

export function ScrollReveal() {
  useEffect(() => {
    const init = () => {
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
    };

    // Use requestIdleCallback to avoid blocking main thread
    if ('requestIdleCallback' in window) {
      const id = (window as any).requestIdleCallback(init);
      return () => (window as any).cancelIdleCallback(id);
    } else {
      const timer = setTimeout(init, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  return null;
}
