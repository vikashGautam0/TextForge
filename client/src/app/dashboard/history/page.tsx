"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useUser, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { fetchFromBackend } from "@/lib/api";


interface HistoryItem {
    id: string;
    title: string;
    template: string;
    date: string;
    contentPreview: string;
    charCount: number;
}

export default function HistoryPage() {
    const { user } = useUser();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


    const { getToken } = useAuth();

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user?.id) return;

            // Fetch Subscription for retention logic
            const subRes = await fetchFromBackend("/subscription", {}, getToken);
            const subData = await subRes.json();


            const plan = subData?.plan_type || "starter";
            const query = supabase
                .from('pdf_history')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            // Retention logic: Starter/Free only gets 24 hours
            if (plan === "starter" || plan === "free") {
                const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
                query.gt('created_at', twentyFourHoursAgo);
            }

            const { data, error } = await query;

            if (!error && data) {
                const mappedData: HistoryItem[] = data.map(item => ({
                    id: item.id,
                    title: item.title,
                    template: item.template,
                    date: item.created_at,
                    contentPreview: item.content_preview || "",
                    charCount: item.char_count || 0
                }));
                setHistory(mappedData);
            } else {
                // Fallback to localStorage + Filter by 24h
                const savedHistory = localStorage.getItem("pdf-history");
                if (savedHistory) {
                    const parsedHistory: HistoryItem[] = JSON.parse(savedHistory);
                    const filteredLocal = parsedHistory.filter(item =>
                        new Date(item.date).getTime() > Date.now() - 24 * 60 * 60 * 1000
                    );
                    setHistory(filteredLocal);
                    // Cleanup localStorage quietly
                    if (filteredLocal.length !== parsedHistory.length) {
                        localStorage.setItem("pdf-history", JSON.stringify(filteredLocal));
                    }
                }
            }
            setIsLoaded(true);
        };

        if (user?.id) fetchHistory();
    }, [user]);

    const deleteItem = async (id: string) => {
        const newHistory = history.filter(item => item.id !== id);
        setHistory(newHistory);
        localStorage.setItem("pdf-history", JSON.stringify(newHistory));

        // Also delete from Supabase
        await supabase.from('pdf_history').delete().eq('id', id).eq('user_id', user?.id);
    };

    const clearHistory = async () => {
        if (!user?.id) return;
        if (confirm("Are you sure you want to clear all history? This will also remove cloud backups.")) {
            setHistory([]);
            localStorage.removeItem("pdf-history");
            await supabase.from('pdf_history').delete().eq('user_id', user.id);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
            <div className="flex h-screen overflow-hidden relative">
                {/* Mobile Header */}
                <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 lg:hidden">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-slate-50"
                        >
                            <svg className="h-6 w-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-lg font-bold text-slate-900">History</h1>
                    </div>
                </header>

                {/* Mobile Sidebar Backdrop */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`
                    fixed inset-y-0 left-0 z-[60] flex w-72 flex-col border-r border-slate-200 bg-white p-6 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                `}>
                    <div className="mb-8 flex items-center gap-3">
                        <Link href="/dashboard" className="group relative h-10 w-10 overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm transition-transform hover:scale-105">
                            <Image
                                src="/logo.png"
                                alt="TextFroge Logo"
                                fill
                                className="object-contain p-1.5"
                            />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 leading-none">Studio</h1>
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">History Terminal</p>
                        </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-6">
                        <Link href="/dashboard" className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">
                            ← Back to Editor
                        </Link>

                        <div className="rounded-2xl bg-slate-900 p-5 text-white shadow-xl">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Stats</p>
                            <div className="mt-4 space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Recent Exports</span>
                                    <span className="font-bold">{history.length}</span>
                                </div>
                                <div className="h-1 w-full rounded-full bg-slate-800">
                                    <div className="h-full w-full rounded-full bg-emerald-500" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5">
                            <div className="flex items-center gap-2">
                                <span className="text-sm">⏳</span>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">Free Tier Limit</p>
                            </div>
                            <p className="mt-2 text-[11px] leading-relaxed text-amber-900/70">
                                History items are stored for <span className="font-bold">24 hours</span> and then cleared automatically. Upgrade to Pro for lifetime archives.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                clearHistory();
                                setIsSidebarOpen(false);
                            }}
                            className="mt-auto rounded-xl border border-red-100 bg-red-50/50 p-4 text-xs font-bold uppercase tracking-widest text-red-600 transition hover:bg-red-50"
                        >
                            Clear All History
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-20 lg:py-10">
                    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 sm:gap-8">
                        <header className="hidden sm:flex items-center justify-between">
                            <div>
                                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Archives</h2>
                                <h1 className="mt-1 text-3xl font-bold text-slate-900">Generation History</h1>
                            </div>
                        </header>

                        {!isLoaded ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-24 w-full animate-pulse rounded-3xl bg-slate-100" />
                                ))}
                            </div>
                        ) : history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white/50 p-20 text-center">
                                <div className="mb-4 text-4xl">📭</div>
                                <h3 className="text-lg font-bold text-slate-900">No history found</h3>
                                <p className="mt-2 text-sm text-slate-500">Your generated PDFs will appear here automatically.</p>
                                <Link href="/dashboard" className="mt-6 rounded-full bg-slate-900 px-6 py-2 text-sm font-bold text-white transition hover:bg-slate-800">
                                    Create your first PDF
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {history.map((item) => (
                                    <div
                                        key={item.id}
                                        className="group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 transition hover:shadow-xl hover:shadow-slate-200/50"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter ${item.template === 'code' ? 'bg-indigo-100 text-indigo-700' :
                                                        item.template === 'academic' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-slate-100 text-slate-700'
                                                        }`}>
                                                        {item.template}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-400">
                                                    Exported on {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => deleteItem(item.id)}
                                                className="rounded-lg p-2 text-slate-300 transition hover:bg-red-50 hover:text-red-500"
                                                title="Delete from history"
                                            >
                                                <TrashIcon />
                                            </button>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between gap-4">
                                            <p className="flex-1 truncate text-xs text-slate-500 italic">
                                                &quot;{item.contentPreview}...&quot;
                                            </p>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                                                    {item.charCount} Chars
                                                </span>
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() => {
                                                        localStorage.setItem("draft-content", item.contentPreview);
                                                    }}
                                                    className="rounded-full bg-slate-900 px-4 py-1.5 text-[10px] font-bold uppercase text-white transition hover:bg-slate-800"
                                                >
                                                    Reuse Content
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

function TrashIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
    );
}
