"use client";

import { UserProfile } from "@clerk/nextjs";
import Link from "next/link";

export default function UserProfilePage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="mx-auto max-w-4xl px-6">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
                        <p className="mt-2 text-slate-600">Manage your profile, security, and preferences.</p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-900 transition hover:bg-slate-50"
                    >
                        ← Back to Studio
                    </Link>
                </div>

                <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50">
                    <UserProfile path="/user-profile" routing="path" />
                </div>
            </div>
        </div>
    );
}
