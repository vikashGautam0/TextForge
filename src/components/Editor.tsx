"use client";

import { useState, useEffect, useCallback } from "react";

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    onInsert?: (prefix: string, suffix: string) => void;
}

export default function Editor({
    value,
    onChange,
    placeholder = "Start typing your content...",
    className = "",
}: EditorProps) {
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [isSaved, setIsSaved] = useState(true);

    // Calculate word and character count
    useEffect(() => {
        const words = value.trim().split(/\s+/).filter(Boolean);
        setWordCount(words.length);
        setCharCount(value.length);
    }, [value]);

    // Auto-save functionality
    useEffect(() => {
        setIsSaved(false);
        const timer = setTimeout(() => {
            // Simulate auto-save (in real app, this would save to backend)
            localStorage.setItem("draft-content", value);
            setIsSaved(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, [value]);

    const handleInput = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            onChange(e.target.value);
        },
        [onChange]
    );

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            {/* Editor Header */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/50 px-4 py-2 text-xs">
                <div className="flex items-center gap-4">
                    <span className="text-slate-600">
                        <span className="font-semibold text-slate-900">{wordCount}</span>{" "}
                        words
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600">
                        <span className="font-semibold text-slate-900">{charCount}</span>{" "}
                        characters
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {isSaved ? (
                        <span className="flex items-center gap-2 text-emerald-600">
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            Saved
                        </span>
                    ) : (
                        <span className="flex items-center gap-2 text-amber-600">
                            <svg
                                className="h-4 w-4 animate-spin"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Saving...
                        </span>
                    )}
                </div>
            </div>

            {/* Text Editor */}
            <textarea
                value={value}
                onChange={handleInput}
                placeholder={placeholder}
                className="min-h-[700px] w-full rounded-2xl border border-slate-200 bg-white/80 px-6 py-4 text-base text-slate-900 placeholder-slate-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                style={{
                    resize: "vertical",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    lineHeight: "1.7",
                }}
            />

            {/* Editor Footer */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-900 px-4 py-3 text-xs text-white">
                <div className="flex items-center gap-4">
                    <span className="text-slate-300">
                        Reading time: ~{Math.ceil(wordCount / 200)} min
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-amber-300">
                        💡 Tip: Use clear headings for better structure
                    </span>
                </div>
            </div>
        </div>
    );
}
