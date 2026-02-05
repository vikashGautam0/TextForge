"use client";

import { useMemo } from "react";

interface PreviewProps {
    content: string;
    template?: "simple" | "academic" | "professional" | "code";
    className?: string;
}

export default function Preview({
    content,
    template = "simple",
    className = "",
}: PreviewProps) {
    // Convert text to HTML format
    const htmlContent = useMemo(() => {
        if (!content.trim()) {
            return '<p class="text-slate-400">Preview will appear here...</p>';
        }

        // Split by paragraphs
        const paragraphs = content.split("\n\n");

        return paragraphs
            .map((para) => {
                const trimmed = para.trim();
                if (!trimmed) return "";

                // Check for headings (lines starting with #)
                if (trimmed.startsWith("# ")) {
                    return `<h1 class="heading-1">${trimmed.substring(2)}</h1>`;
                }
                if (trimmed.startsWith("## ")) {
                    return `<h2 class="heading-2">${trimmed.substring(3)}</h2>`;
                }
                if (trimmed.startsWith("### ")) {
                    return `<h3 class="heading-3">${trimmed.substring(4)}</h3>`;
                }

                // Check for lists (lines starting with -)
                if (trimmed.includes("\n- ")) {
                    const items = trimmed
                        .split("\n- ")
                        .filter(Boolean)
                        .map((item) => `<li class="list-item">${item}</li>`)
                        .join("");
                    return `<ul class="list">${items}</ul>`;
                }

                // Check for numbered lists
                if (/^\d+\.\s/.test(trimmed)) {
                    const items = trimmed
                        .split(/\n\d+\.\s/)
                        .filter(Boolean)
                        .map((item) => `<li class="list-item">${item}</li>`)
                        .join("");
                    return `<ol class="list">${items}</ol>`;
                }

                // Regular paragraph
                return `<p class="paragraph">${trimmed}</p>`;
            })
            .join("");
    }, [content]);

    // Template-specific styles
    const templateStyles = {
        simple: {
            container: "bg-white",
            heading1: "text-3xl font-bold text-slate-900 mb-4",
            heading2: "text-2xl font-semibold text-slate-800 mb-3 mt-6",
            heading3: "text-xl font-medium text-slate-700 mb-2 mt-4",
            paragraph: "text-base text-slate-600 mb-4 leading-relaxed",
            list: "ml-6 mb-4 space-y-2",
            listItem: "text-slate-600",
        },
        academic: {
            container: "bg-white",
            heading1:
                "text-4xl font-serif font-bold text-slate-900 mb-6 border-b-2 border-slate-200 pb-3",
            heading2:
                "text-2xl font-serif font-semibold text-slate-800 mb-4 mt-8",
            heading3: "text-xl font-serif font-medium text-slate-700 mb-3 mt-6",
            paragraph: "text-base font-serif text-slate-700 mb-5 leading-loose text-justify",
            list: "ml-8 mb-5 space-y-2",
            listItem: "text-slate-700 font-serif",
        },
        professional: {
            container: "bg-gradient-to-br from-slate-50 to-white",
            heading1:
                "text-3xl font-bold text-slate-900 mb-4 bg-slate-900 text-white p-4 rounded-lg",
            heading2:
                "text-2xl font-semibold text-slate-900 mb-3 mt-6 border-l-4 border-slate-900 pl-4",
            heading3: "text-xl font-medium text-slate-800 mb-2 mt-4",
            paragraph: "text-base text-slate-600 mb-4 leading-relaxed",
            list: "ml-6 mb-4 space-y-2 border-l-2 border-slate-200 pl-4",
            listItem: "text-slate-600",
        },
        code: {
            container: "bg-slate-900",
            heading1: "text-2xl font-bold text-white mb-4",
            heading2: "text-xl font-semibold text-slate-200 mb-3 mt-6",
            heading3: "text-lg font-medium text-slate-300 mb-2 mt-4",
            paragraph: "text-base text-slate-300 mb-4 leading-relaxed font-mono",
            list: "ml-6 mb-4 space-y-2",
            listItem: "text-slate-300 font-mono",
        },
    };

    const styles = templateStyles[template];

    return (
        <div className={`overflow-hidden ${className}`}>
            {/* Preview Header */}
            <div className="flex items-center justify-between rounded-t-2xl border border-b-0 border-slate-200 bg-slate-900 px-4 py-3 text-xs text-white">
                <div className="flex items-center gap-2">
                    <svg
                        className="h-4 w-4 text-amber-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                    </svg>
                    <span className="font-semibold">Live Preview</span>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-slate-300">
                    {template.charAt(0).toUpperCase() + template.slice(1)} Template
                </span>
            </div>

            {/* Preview Content */}
            <div
                className={`min-h-[400px] rounded-b-2xl border border-slate-200 p-8 ${styles.container}`}
            >
                <style jsx>{`
          .heading-1 {
            @apply ${styles.heading1};
          }
          .heading-2 {
            @apply ${styles.heading2};
          }
          .heading-3 {
            @apply ${styles.heading3};
          }
          .paragraph {
            @apply ${styles.paragraph};
          }
          .list {
            @apply ${styles.list};
          }
          .list-item {
            @apply ${styles.listItem};
          }
        `}</style>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
        </div>
    );
}
