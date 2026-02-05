"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminPanel() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPdfs: 0,
        activeSubscriptions: 0,
        revenue: "₹0"
    });

    useEffect(() => {
        async function fetchAdminStats() {
            const { count: userCount } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true });
            const { count: pdfCount } = await supabase.from('pdf_history').select('*', { count: 'exact', head: true });
            const { count: activeSubs } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true }).neq('plan_type', 'starter');

            setStats({
                totalUsers: userCount || 0,
                totalPdfs: pdfCount || 0,
                activeSubscriptions: activeSubs || 0,
                revenue: `₹${(activeSubs || 0) * 149}` // Mock calculation based on lowest tier
            });
        }
        fetchAdminStats();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <aside className="fixed inset-y-0 left-0 w-64 border-r bg-white p-6 hidden md:block">
                <h2 className="text-xl font-bold text-slate-900 mb-8">TextForge Admin</h2>
                <nav className="space-y-1">
                    <button className="flex w-full items-center gap-3 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white">Dashboard</button>
                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Users</button>
                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Generation Logs</button>
                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Billing</button>
                </nav>
            </aside>

            <main className="md:ml-64 p-8">
                <header className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">System Overview</h1>
                    <Link href="/dashboard" className="text-sm font-bold text-slate-600 hover:text-slate-900">Go to Studio →</Link>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Users</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalUsers}</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">PDFs Generated</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalPdfs}</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Active Pro Users</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">{stats.activeSubscriptions}</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-emerald-600">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Revenue</p>
                        <p className="mt-2 text-3xl font-bold">{stats.revenue}</p>
                    </div>
                </div>

                <div className="mt-12 overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 font-bold text-slate-900 uppercase tracking-widest text-[10px]">Recent Generators</th>
                                <th className="px-6 py-4 font-bold text-slate-900 uppercase tracking-widest text-[10px]">Template</th>
                                <th className="px-6 py-4 font-bold text-slate-900 uppercase tracking-widest text-[10px]">Status</th>
                                <th className="px-6 py-4 font-bold text-slate-900 uppercase tracking-widest text-[10px]">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition">
                                    <td className="px-6 py-4 text-slate-600 font-medium">user_93847{i}</td>
                                    <td className="px-6 py-4 uppercase text-[10px] font-bold text-slate-400">academic</td>
                                    <td className="px-6 py-4">
                                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-600">SUCCESS</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 text-xs">{i}m ago</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
