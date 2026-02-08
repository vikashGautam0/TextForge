"use client";

import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

const TEMPLATES = [
    // STARTER TIER - Free
    {
        id: "simple",
        name: "Minimal & Clean",
        description: "Ultra-minimal layout focused on readability and white space.",
        icon: "📄",
        tier: "Starter",
        features: ["Distraction-free", "Standard Typography", "Universal Spacing"]
    },
    {
        id: "academic",
        name: "Academic Thesis",
        description: "Formal serif typography for research papers and essays.",
        icon: "🎓",
        tier: "Starter",
        features: ["Times-style Fonts", "Structured Headings", "Classic Margins"]
    },
    {
        id: "letter",
        name: "Business Letter",
        description: "Classic personal or business letter format with formal structure.",
        icon: "✉️",
        tier: "Starter",
        features: ["Sender/Recipient Blocks", "Formal Sign-offs", "Classic Layout"]
    },

    // CREATOR TIER
    {
        id: "professional",
        name: "Executive Report",
        description: "Corporate-ready style with bold accents and clear hierarchy.",
        icon: "💼",
        tier: "Creator",
        features: ["Brand Accents", "Summary Blocks", "Portfolio Ready"]
    },
    {
        id: "modern",
        name: "Modern Portfolio",
        description: "Vibrant and punchy design for brochures and portfolios.",
        icon: "✨",
        tier: "Creator",
        features: ["Bold Colors", "Large Headings", "Dynamic Layouts"]
    },
    {
        id: "minimal",
        name: "Ultra Minimal",
        description: "Focus on white space and typography for premium feel.",
        icon: "⚪",
        tier: "Creator",
        features: ["Maximum Whitespace", "Clean Typography", "Elegant Spacing"]
    },
    {
        id: "invoice",
        name: "Professional Invoice",
        description: "Clean and structured design for billing and payments.",
        icon: "🧾",
        tier: "Creator",
        features: ["Table Layouts", "Totals Section", "Payment Terms"]
    },
    {
        id: "report",
        name: "Business Report",
        description: "Structured corporate report with sections and summaries.",
        icon: "📊",
        tier: "Creator",
        features: ["Table of Contents", "Section Headers", "Data Tables"]
    },

    // PRO TIER
    {
        id: "code",
        name: "Technical Docs",
        description: "Dark-themed monospaced layout for documentation and code.",
        icon: "💻",
        tier: "Pro",
        features: ["Monospace Fonts", "Syntax Highlighting", "Code Blocks"]
    },
    {
        id: "resume",
        name: "Classic Resume",
        description: "Professional layout for career documents and CVs.",
        icon: "👤",
        tier: "Pro",
        features: ["Skills Section", "Experience Timeline", "Contact Block"]
    },
    {
        id: "resume_modern",
        name: "Modern Resume",
        description: "Contemporary design with sidebar and high readability.",
        icon: "🤵",
        tier: "Pro",
        features: ["Sidebar Layout", "Modern Typography", "Visual Hierarchy"]
    },
    {
        id: "resume_executive",
        name: "Executive Resume",
        description: "Luxurious layout for senior roles and C-suite positions.",
        icon: "🕴️",
        tier: "Pro",
        features: ["Serif Elegance", "Gold Accents", "Authority Layout"]
    },
    {
        id: "contract",
        name: "Legal Contract",
        description: "Formal legal document layout with signature sections.",
        icon: "🖋️",
        tier: "Pro",
        features: ["Clause Formatting", "Signature Lines", "Legal Structure"]
    },
    {
        id: "proposal",
        name: "Business Proposal",
        description: "Compelling layout for client proposals and pitches.",
        icon: "📋",
        tier: "Pro",
        features: ["Executive Summary", "Scope & Pricing", "Call to Action"]
    },
    {
        id: "creative",
        name: "Creative Portfolio",
        description: "Artistic layout with unique color accents for designers.",
        icon: "🎨",
        tier: "Pro",
        features: ["Bold Colors", "Artistic Typography", "Visual Impact"]
    },
];

const TIER_COLORS: Record<string, string> = {
    Starter: "bg-slate-900",
    Creator: "bg-emerald-500",
    Pro: "bg-amber-500",
};

const TIER_DESCRIPTIONS: Record<string, string> = {
    Starter: "Free - 10 PDFs/month",
    Creator: "₹149/mo - Unlimited PDFs",
    Pro: "₹399/mo - All Features",
};

export default function TemplatesClient() {
    const starterTemplates = TEMPLATES.filter(t => t.tier === "Starter");
    const creatorTemplates = TEMPLATES.filter(t => t.tier === "Creator");
    const proTemplates = TEMPLATES.filter(t => t.tier === "Pro");

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* Header */}
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
                {/* Hero */}
                <div className="mb-16 text-center">
                    <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
                        15 Professional Templates
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Template Gallery</h1>
                    <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
                        Choose from our collection of professionally designed templates. Each one is optimized for print and digital distribution.
                    </p>
                </div>

                {/* Starter Templates */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                            Starter
                        </span>
                        <span className="text-sm text-slate-500">{TIER_DESCRIPTIONS.Starter}</span>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {starterTemplates.map((tpl) => (
                            <TemplateCard key={tpl.id} template={tpl} />
                        ))}
                    </div>
                </section>

                {/* Creator Templates */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                            Creator
                        </span>
                        <span className="text-sm text-slate-500">{TIER_DESCRIPTIONS.Creator}</span>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        {creatorTemplates.map((tpl) => (
                            <TemplateCard key={tpl.id} template={tpl} />
                        ))}
                    </div>
                </section>

                {/* Pro Templates */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                            Pro
                        </span>
                        <span className="text-sm text-slate-500">{TIER_DESCRIPTIONS.Pro}</span>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {proTemplates.map((tpl) => (
                            <TemplateCard key={tpl.id} template={tpl} />
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <div className="rounded-3xl bg-slate-900 p-12 text-center">
                    <h2 className="text-3xl font-bold text-white">Start creating with any template</h2>
                    <p className="mt-3 text-slate-400 max-w-xl mx-auto">
                        All templates work with our AI formatting. Just paste your content and let AI handle the styling.
                    </p>
                    <Link
                        href="/dashboard"
                        className="mt-8 inline-flex rounded-full bg-white px-8 py-4 text-sm font-bold text-slate-900 hover:bg-slate-100 transition shadow-xl"
                    >
                        Open Dashboard
                    </Link>
                </div>
            </main>
        </div>
    );
}

interface TemplateCardProps {
    template: typeof TEMPLATES[0];
}

function TemplateCard({ template }: TemplateCardProps) {
    return (
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300">
            <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{template.icon}</span>
                <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-white ${TIER_COLORS[template.tier]}`}>
                    {template.tier}
                </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition">{template.name}</h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">{template.description}</p>
            <ul className="mt-4 space-y-1">
                {template.features.map(f => (
                    <li key={f} className="flex items-center gap-1.5 text-[10px] font-medium text-slate-600">
                        <span className="text-emerald-500">✓</span> {f}
                    </li>
                ))}
            </ul>
            <Link
                href={`/dashboard?template=${template.id}`}
                className="mt-5 block w-full rounded-xl bg-slate-50 py-2.5 text-center text-xs font-bold text-slate-900 transition hover:bg-slate-900 hover:text-white"
            >
                Use Template
            </Link>
        </div>
    );
}
