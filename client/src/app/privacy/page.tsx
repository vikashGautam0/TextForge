"use client";

import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6">
            <div className="mx-auto max-w-3xl rounded-[2.5rem] bg-white p-12 shadow-2xl shadow-slate-200/50">
                <Link href="/" className="text-sm font-bold text-slate-400 hover:text-slate-900 transition">← Back to Home</Link>
                <h1 className="mt-8 text-4xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
                <p className="mt-2 text-slate-400">Last updated: February 2026</p>

                <div className="mt-12 space-y-8 text-slate-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-slate-900">1. Data Collection</h2>
                        <p className="mt-4">We collect minimal personal data required for service provision, including your email address and authentication details provided by Clerk.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900">2. Document Content</h2>
                        <p className="mt-4">Text entered into TextForge is processed by AI models (Mistral AI) for formatting purposes. We do not use your document content to train our internal models.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900">3. Cookies</h2>
                        <p className="mt-4">We use essential cookies to maintain your login session. No tracking or third-party advertising cookies are used.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900">4. Third Parties</h2>
                        <p className="mt-4">We share data only with service providers essential to our operations: Clerk (Auth), Supabase (Storage), Razorpay (Payments), and Mistral AI (Processing).</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
