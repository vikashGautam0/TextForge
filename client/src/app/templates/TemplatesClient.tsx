"use client";

import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";

// Template showcase data with preview content
const TEMPLATES = [
    {
        id: "simple",
        name: "Minimal & Clean",
        description: "Ultra-minimal layout focused on readability and white space.",
        icon: "📄",
        tier: "Starter",
        sampleTitle: "Meeting Notes",
        sampleContent: `Key Discussion Points

• Project timeline confirmed for Q2 launch
• Budget approved for marketing campaign
• New team member onboarding next week

Action Items

1. Review design mockups by Friday
2. Schedule client presentation
3. Prepare quarterly report`,
        previewStyle: {
            background: "#ffffff",
            fontFamily: "system-ui, sans-serif",
            titleColor: "#0f172a",
            textColor: "#334155",
            accentColor: "#e2e8f0",
        },
    },
    {
        id: "academic",
        name: "Academic Thesis",
        description: "Formal serif typography for research papers.",
        icon: "🎓",
        tier: "Starter",
        sampleTitle: "The Impact of AI on Education",
        sampleContent: `Abstract

This paper examines the transformative effects of artificial intelligence on modern educational practices and student outcomes.

Introduction

The integration of AI in education represents a paradigm shift in how knowledge is delivered and assessed...`,
        previewStyle: {
            background: "#fffef8",
            fontFamily: "Georgia, serif",
            titleColor: "#0f172a",
            textColor: "#1e293b",
            accentColor: "#cbd5e1",
        },
    },
    {
        id: "letter",
        name: "Business Letter",
        description: "Classic letter format with formal structure.",
        icon: "✉️",
        tier: "Starter",
        sampleTitle: "RE: Partnership Proposal",
        sampleContent: `Dear Mr. Johnson,

Thank you for your interest in establishing a partnership with our organization. We have reviewed your proposal with great interest.

We would be pleased to schedule a meeting to discuss the terms further.

Sincerely,
Alexandra Chen
CEO, TechVentures Inc.`,
        previewStyle: {
            background: "#ffffff",
            fontFamily: "Times New Roman, serif",
            titleColor: "#000000",
            textColor: "#1a1a1a",
            accentColor: "#d1d5db",
        },
    },
    {
        id: "professional",
        name: "Executive Report",
        description: "Corporate style with bold accents.",
        icon: "💼",
        tier: "Creator",
        sampleTitle: "Q4 Performance Review",
        sampleContent: `Executive Summary

Revenue increased 23% year-over-year, exceeding projections by $2.4M.

Key Highlights
• Customer acquisition up 45%
• Market share increased to 18%
• New product launch successful`,
        previewStyle: {
            background: "#f8fafc",
            fontFamily: "Inter, sans-serif",
            titleColor: "#ffffff",
            titleBg: "#0f172a",
            textColor: "#334155",
            accentColor: "#f59e0b",
        },
    },
    {
        id: "modern",
        name: "Modern Portfolio",
        description: "Vibrant design for portfolios and brochures.",
        icon: "✨",
        tier: "Creator",
        sampleTitle: "Creative Works 2026",
        sampleContent: `Featured Projects

Brand Identity Design
Complete visual overhaul for Fortune 500 client.

Web Experience
Award-winning e-commerce platform redesign.

Motion Graphics
Promotional video with 10M+ views.`,
        previewStyle: {
            background: "#ffffff",
            fontFamily: "Outfit, sans-serif",
            titleColor: "#4f46e5",
            textColor: "#475569",
            accentColor: "#4f46e5",
        },
    },
    {
        id: "minimal",
        name: "Ultra Minimal",
        description: "Focus on white space and typography.",
        icon: "⚪",
        tier: "Creator",
        sampleTitle: "DESIGN PHILOSOPHY",
        sampleContent: `Less is more. Every element serves a purpose.

We believe in the power of restraint. Our approach eliminates the unnecessary, leaving only what truly matters.

Clarity through simplicity.`,
        previewStyle: {
            background: "#ffffff",
            fontFamily: "Inter, sans-serif",
            titleColor: "#000000",
            textColor: "#374151",
            accentColor: "#e5e7eb",
        },
    },
    {
        id: "invoice",
        name: "Professional Invoice",
        description: "Clean billing layout with tables.",
        icon: "🧾",
        tier: "Creator",
        sampleTitle: "Invoice #2026-0042",
        sampleContent: `Bill To: Acme Corporation
Date: February 8, 2026
Due: March 8, 2026

Services Rendered
• Web Development        ₹45,000
• UI/UX Design           ₹25,000
• Consultation           ₹10,000

Total Due: ₹80,000`,
        previewStyle: {
            background: "#ffffff",
            fontFamily: "Helvetica, sans-serif",
            titleColor: "#1a1a1a",
            textColor: "#333333",
            accentColor: "#10b981",
        },
    },
    {
        id: "report",
        name: "Business Report",
        description: "Structured corporate report layout.",
        icon: "📊",
        tier: "Creator",
        sampleTitle: "Market Analysis Report",
        sampleContent: `1. Overview

The market has shown significant growth in the technology sector, with AI and cloud services leading the charge.

2. Key Findings

• 34% increase in digital adoption
• Emerging markets showing promise
• Sustainability becoming priority`,
        previewStyle: {
            background: "#ffffff",
            fontFamily: "Arial, sans-serif",
            titleColor: "#2c5282",
            textColor: "#333333",
            accentColor: "#2c5282",
        },
    },
    {
        id: "code",
        name: "Technical Docs",
        description: "Dark theme for code documentation.",
        icon: "💻",
        tier: "Pro",
        sampleTitle: "API Reference v2.0",
        sampleContent: `Authentication

All requests require an API key in the header:

Authorization: Bearer YOUR_API_KEY

Endpoints

GET /api/users
POST /api/documents
DELETE /api/sessions/:id`,
        previewStyle: {
            background: "#0f172a",
            fontFamily: "Consolas, monospace",
            titleColor: "#f8fafc",
            textColor: "#e2e8f0",
            accentColor: "#22d3ee",
        },
    },
    {
        id: "resume",
        name: "Classic Resume",
        description: "Professional CV layout.",
        icon: "👤",
        tier: "Pro",
        sampleTitle: "Priya Sharma",
        sampleContent: `Senior Software Engineer

Experience
Tech Corp (2022-Present)
Led development of microservices architecture

Skills
• React, Node.js, Python
• AWS, Docker, Kubernetes
• Team Leadership`,
        previewStyle: {
            background: "#ffffff",
            fontFamily: "Calibri, sans-serif",
            titleColor: "#1a202c",
            textColor: "#2d3748",
            accentColor: "#e2e8f0",
        },
    },
    {
        id: "resume_modern",
        name: "Modern Resume",
        description: "Contemporary CV with sidebar.",
        icon: "🤵",
        tier: "Pro",
        sampleTitle: "Alex Rodriguez",
        sampleContent: `Product Designer

About
Creative professional with 8+ years of experience crafting user-centric digital experiences.

Expertise
• User Research
• Prototyping
• Design Systems`,
        previewStyle: {
            background: "#f8fafc",
            fontFamily: "Inter, sans-serif",
            titleColor: "#0f172a",
            textColor: "#475569",
            accentColor: "#4f46e5",
        },
    },
    {
        id: "resume_executive",
        name: "Executive Resume",
        description: "Luxury layout for senior roles.",
        icon: "🕴️",
        tier: "Pro",
        sampleTitle: "Richard Montgomery",
        sampleContent: `Chief Executive Officer

Career Highlights

Fortune 500 turnaround specialist with proven track record of delivering 40%+ revenue growth.

Board Memberships
• Global Tech Alliance
• Innovation Council`,
        previewStyle: {
            background: "#fffef8",
            fontFamily: "Garamond, serif",
            titleColor: "#1a365d",
            textColor: "#1a202c",
            accentColor: "#744210",
        },
    },
    {
        id: "contract",
        name: "Legal Contract",
        description: "Formal agreement layout.",
        icon: "🖋️",
        tier: "Pro",
        sampleTitle: "SERVICE AGREEMENT",
        sampleContent: `This Agreement is entered into as of February 8, 2026.

TERMS AND CONDITIONS

1. SERVICES: Provider agrees to deliver consulting services as outlined in Exhibit A.

2. COMPENSATION: Client shall pay Provider according to the fee schedule.

_________________
Signature`,
        previewStyle: {
            background: "#ffffff",
            fontFamily: "Garamond, serif",
            titleColor: "#000000",
            textColor: "#1a1a1a",
            accentColor: "#9ca3af",
        },
    },
    {
        id: "proposal",
        name: "Business Proposal",
        description: "Compelling pitch layout.",
        icon: "📋",
        tier: "Pro",
        sampleTitle: "Digital Transformation",
        sampleContent: `Your Path to Innovation

We propose a comprehensive digital strategy to modernize your operations and drive growth.

Investment: ₹5,00,000
Timeline: 3 months
ROI: 250% projected`,
        previewStyle: {
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            fontFamily: "Inter, sans-serif",
            titleColor: "#ffffff",
            textColor: "rgba(255,255,255,0.9)",
            accentColor: "#fbbf24",
        },
    },
    {
        id: "creative",
        name: "Creative Portfolio",
        description: "Artistic layout for designers.",
        icon: "🎨",
        tier: "Pro",
        sampleTitle: "Visual Stories",
        sampleContent: `Art Direction & Design

Each project is a canvas for expression. We blend aesthetics with purpose.

Selected Works
• Brand Campaign - Luxe Fashion
• Editorial Design - Vogue India
• Exhibition - Mumbai Art Week`,
        previewStyle: {
            background: "#fffcf0",
            fontFamily: "Montserrat, sans-serif",
            titleColor: "#e53e3e",
            textColor: "#1a202c",
            accentColor: "#feb2b2",
        },
    },
];

const TIER_COLORS: Record<string, string> = {
    Starter: "bg-slate-900",
    Creator: "bg-emerald-500",
    Pro: "bg-amber-500",
};

export default function TemplatesClient() {
    const [selectedTemplate, setSelectedTemplate] = useState<typeof TEMPLATES[0] | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>("all");

    const filteredTemplates = activeFilter === "all"
        ? TEMPLATES
        : TEMPLATES.filter(t => t.tier === activeFilter);

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
                <div className="mb-12 text-center">
                    <span className="inline-block rounded-full bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white mb-4">
                        15 Professional Templates
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Template Showcase</h1>
                    <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
                        Click on any template to see a full preview. Each template is optimized for professional documents.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex justify-center gap-2 mb-12">
                    {["all", "Starter", "Creator", "Pro"].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition ${activeFilter === filter
                                ? "bg-slate-900 text-white"
                                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                                }`}
                        >
                            {filter === "all" ? "All Templates" : filter}
                        </button>
                    ))}
                </div>

                {/* Template Grid with Previews */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredTemplates.map((template) => (
                        <div
                            key={template.id}
                            onClick={() => setSelectedTemplate(template)}
                            className="group cursor-pointer"
                        >
                            {/* Preview Card */}
                            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition hover:shadow-2xl hover:shadow-slate-200/50 hover:border-slate-300">
                                {/* Mini Preview */}
                                <div
                                    className="h-48 p-4 overflow-hidden relative"
                                    style={{
                                        background: template.previewStyle.background,
                                        fontFamily: template.previewStyle.fontFamily,
                                    }}
                                >
                                    {/* Title Preview */}
                                    <div
                                        className="text-sm font-bold mb-2 truncate"
                                        style={{
                                            color: template.previewStyle.titleColor,
                                            backgroundColor: template.previewStyle.titleBg || "transparent",
                                            padding: template.previewStyle.titleBg ? "0.5rem" : "0",
                                            borderRadius: template.previewStyle.titleBg ? "0.25rem" : "0",
                                        }}
                                    >
                                        {template.sampleTitle}
                                    </div>
                                    {/* Content Preview */}
                                    <div
                                        className="text-[9px] leading-relaxed whitespace-pre-line opacity-80"
                                        style={{ color: template.previewStyle.textColor }}
                                    >
                                        {template.sampleContent.substring(0, 200)}...
                                    </div>
                                    {/* Fade overlay */}
                                    <div
                                        className="absolute bottom-0 left-0 right-0 h-16"
                                        style={{
                                            background: `linear-gradient(transparent, ${template.previewStyle.background.includes("gradient") ? "#4f46e5" : template.previewStyle.background})`,
                                        }}
                                    />
                                </div>

                                {/* Info Section */}
                                <div className="p-5 bg-white border-t border-slate-100">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{template.icon}</span>
                                            <h3 className="font-bold text-slate-900">{template.name}</h3>
                                        </div>
                                        <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-white ${TIER_COLORS[template.tier]}`}>
                                            {template.tier}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-4">{template.description}</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedTemplate(template);
                                            }}
                                            className="flex-1 rounded-xl bg-slate-100 py-2.5 text-center text-xs font-bold text-slate-700 transition hover:bg-slate-200"
                                        >
                                            Preview
                                        </button>
                                        <Link
                                            href={`/dashboard?template=${template.id}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex-1 rounded-xl bg-slate-900 py-2.5 text-center text-xs font-bold text-white transition hover:bg-slate-700"
                                        >
                                            Use Template
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-20 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white blur-3xl" />
                        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-amber-300 blur-3xl" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white">Start Creating Beautiful PDFs</h2>
                        <p className="mt-3 text-slate-400 max-w-xl mx-auto">
                            All templates work with our AI formatting. Just paste your content and let AI handle the styling.
                        </p>
                        <Link
                            href="/dashboard"
                            className="mt-8 inline-flex rounded-full bg-white px-8 py-4 text-sm font-bold text-slate-900 hover:bg-slate-100 transition shadow-xl"
                        >
                            Open Dashboard →
                        </Link>
                    </div>
                </div>
            </main>

            {/* Full Preview Modal */}
            {selectedTemplate && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8"
                    onClick={() => setSelectedTemplate(null)}
                >
                    <div
                        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{selectedTemplate.icon}</span>
                                <div>
                                    <h3 className="font-bold text-slate-900">{selectedTemplate.name}</h3>
                                    <p className="text-xs text-slate-500">{selectedTemplate.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white ${TIER_COLORS[selectedTemplate.tier]}`}>
                                    {selectedTemplate.tier}
                                </span>
                                <button
                                    onClick={() => setSelectedTemplate(null)}
                                    className="p-2 rounded-full hover:bg-slate-100 transition"
                                >
                                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Full Preview */}
                        <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-180px)]">
                            <div
                                className="rounded-2xl shadow-xl overflow-hidden min-h-[500px]"
                                style={{
                                    background: selectedTemplate.previewStyle.background,
                                    fontFamily: selectedTemplate.previewStyle.fontFamily,
                                }}
                            >
                                <div className="p-8 md:p-12">
                                    {/* Document Title */}
                                    <h1
                                        className="text-2xl md:text-3xl font-bold mb-6"
                                        style={{
                                            color: selectedTemplate.previewStyle.titleColor,
                                            backgroundColor: selectedTemplate.previewStyle.titleBg || "transparent",
                                            padding: selectedTemplate.previewStyle.titleBg ? "1rem" : "0",
                                            borderRadius: selectedTemplate.previewStyle.titleBg ? "0.5rem" : "0",
                                        }}
                                    >
                                        {selectedTemplate.sampleTitle}
                                    </h1>

                                    {/* Accent Line */}
                                    {!selectedTemplate.previewStyle.titleBg && (
                                        <div
                                            className="h-1 w-16 mb-8 rounded-full"
                                            style={{ backgroundColor: selectedTemplate.previewStyle.accentColor }}
                                        />
                                    )}

                                    {/* Document Content */}
                                    <div
                                        className="text-base leading-relaxed whitespace-pre-line"
                                        style={{ color: selectedTemplate.previewStyle.textColor }}
                                    >
                                        {selectedTemplate.sampleContent}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
                            <p className="text-xs text-slate-500">
                                This is a preview. Your content will be formatted using this template style.
                            </p>
                            <Link
                                href={`/dashboard?template=${selectedTemplate.id}`}
                                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-700 transition"
                            >
                                Use This Template
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
