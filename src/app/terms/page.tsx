"use client";

import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6">
            <div className="mx-auto max-w-3xl rounded-[2.5rem] bg-white p-12 shadow-2xl shadow-slate-200/50">
                <Link href="/" className="text-sm font-bold text-slate-400 hover:text-slate-900 transition">← Back to Home</Link>
                <h1 className="mt-8 text-4xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
                <p className="mt-2 text-slate-400">Last updated: February 2026</p>

                <div className="mt-12 space-y-8 text-slate-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
                        <p className="mt-4">By accessing and using TextForge, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900">2. Description of Service</h2>
                        <p className="mt-4">TextForge provides an AI-powered document formatting and PDF generation service. The service is provided &quot;as is&quot; and we reserve the right to modify or discontinue features at any time.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900">3. User Accounts</h2>
                        <p className="mt-4">You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900">4. Subscription & Payments</h2>
                        <p className="mt-4">Payments are processed securely via Razorpay. Subscriptions automatically renew unless cancelled. No refunds will be provided for partial months of service.</p>
                    </section>
                </div>
            </div>
        </div >
    );
}
