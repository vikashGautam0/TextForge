"use client";

import Link from "next/link";

export default function ApiDocsPage() {
    return (
        <div className="min-h-screen bg-white">
            <nav className="border-b bg-white px-6 py-4">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-slate-900">TextForge Docs</Link>
                    <Link href="/dashboard" className="text-sm font-bold text-slate-600">Studio Dashboard</Link>
                </div>
            </nav>

            <main className="mx-auto max-w-4xl px-6 py-16">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">API Documentation</h1>
                <p className="mt-4 text-xl text-slate-500">Automate your document generation workflow with the TextForge API.</p>

                <div className="mt-12 rounded-3xl bg-amber-50 p-6 border border-amber-100">
                    <h2 className="text-lg font-bold text-amber-900">Business Tier Required</h2>
                    <p className="mt-2 text-sm text-amber-800">The TextForge API is currently exclusive to our Business plan users. Please upgrade your account to generate your API keys.</p>
                </div>

                <section className="mt-16 space-y-12">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Endpoint: Generate PDF</h2>
                        <p className="mt-2 text-slate-600">Send content to generate a high-quality PDF buffer.</p>
                        <div className="mt-6 overflow-hidden rounded-2xl bg-slate-900 p-6 text-sm font-mono text-white shadow-2xl">
                            <p className="text-emerald-400">POST {process.env.NEXT_PUBLIC_BACKEND_URL || "https://api.textforge.studio"}/pdf</p>
                            <div className="mt-4 space-y-2">
                                <p className="text-slate-500">{"// Headers"}</p>
                                <p>Authorization: Bearer YOUR_API_KEY</p>
                                <p>Content-Type: application/json</p>
                            </div>
                            <div className="mt-6 space-y-2">
                                <p className="text-slate-500">{"// Body"}</p>
                                <pre>{`{
  "content": "# Hello World\\nThis is my API generated PDF.",
  "title": "API document",
  "template": "professional",
  "fontFamily": "helvetica"
}`}</pre>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Response</h2>
                        <p className="mt-2 text-slate-600">The API returns a binary stream with the MIME type <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-sm">application/pdf</code>.</p>
                    </div>

                    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-8">
                        <h2 className="text-xl font-bold text-slate-900">Rate Limits</h2>
                        <ul className="mt-4 space-y-4 text-sm text-slate-600">
                            <li className="flex items-start gap-3">
                                <span className="font-bold text-slate-900">Creator/Pro:</span>
                                <span>No direct API access. Please use the dashboard to generate documents.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="font-bold text-slate-900">Business:</span>
                                <span>5,000 requests per month. Custom limits available upon request.</span>
                            </li>
                        </ul>
                    </div>
                </section>
            </main>

            <footer className="mt-20 border-t py-12 text-center text-sm text-slate-400">
                &copy; 2026 TextForge Studio. All rights reserved.
            </footer>
        </div>
    );
}
