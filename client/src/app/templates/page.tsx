"use client";

import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";


const TEMPLATES = [
    {
        id: "simple",
        name: "Minimal & Clean",
        description: "Ultra-minimal layout focused on readability and white space.",
        previewImg: "https://images.unsplash.com/photo-1586717791821-3f44a563fc4c?w=400&auto=format&fit=crop&q=60",
        tier: "Starter",
        features: ["Distraction-free", "Standard Typography", "Universal Spacing"]
    },
    {
        id: "academic",
        name: "Academic Thesis",
        description: "Formal serif typography for research papers and essays.",
        previewImg: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&auto=format&fit=crop&q=60",
        tier: "Starter",
        features: ["Times-style Fonts", "Structured Headings", "Classic Margins"]
    },
    {
        id: "professional",
        name: "Executive Report",
        description: "Corporate-ready style with bold accents and clear hierarchy.",
        previewImg: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&auto=format&fit=crop&q=60",
        tier: "Creator",
        features: ["Brand Accents", "Summary Blocks", "Portfolio Ready"]
    },
    {
        id: "code",
        name: "Terminal / Technical",
        description: "Dark-themed monospaced layout for documentation and code snippets.",
        previewImg: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&auto=format&fit=crop&q=60",
        tier: "Pro",
        features: ["Monospace Fonts", "Dark Theme", "Syntax Highlighting"]
    }
];

export default function TemplatesPage() {
    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* Small Header */}
            <nav className="border-b border-slate-200/50 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative h-7 w-7 overflow-hidden rounded bg-white border border-slate-100 shadow-sm transition-transform group-hover:scale-110">
                            <Image
                                src="/logo.png"
                                alt="TextFroge Logo"
                                fill
                                className="object-contain p-1"
                            />
                        </div>
                        <span className="text-sm font-bold text-slate-900">TextFroge</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-xs font-bold text-slate-400 hover:text-slate-900 transition uppercase tracking-widest">Dashboard</Link>
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-6 py-16">
                <div className="mb-16 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900">Document Gallery</h1>
                    <p className="mt-4 text-slate-500 max-w-xl mx-auto">Select a foundation for your professionally crafted AI documents.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {TEMPLATES.map((tpl) => (
                        <div key={tpl.id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:shadow-2xl hover:shadow-slate-200/50">
                            <div className="relative h-48 overflow-hidden bg-slate-100">
                                <Image
                                    src={tpl.previewImg}
                                    alt={tpl.name}
                                    fill
                                    className="object-cover transition duration-500 group-hover:scale-110"
                                    unoptimized
                                />
                                <div className="absolute top-4 right-4">
                                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg ${tpl.tier === 'Starter' ? 'bg-slate-900' :
                                        tpl.tier === 'Creator' ? 'bg-emerald-500' : 'bg-amber-500'
                                        }`}>
                                        {tpl.tier}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-900">{tpl.name}</h3>
                                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{tpl.description}</p>
                                <ul className="mt-6 space-y-2">
                                    {tpl.features.map(f => (
                                        <li key={f} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                            <span className="text-emerald-500">✓</span> {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href={`/dashboard?template=${tpl.id}`}
                                    className="mt-8 block w-full rounded-2xl bg-slate-50 py-3 text-center text-sm font-bold text-slate-900 transition hover:bg-slate-900 hover:text-white"
                                >
                                    Use Template
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
