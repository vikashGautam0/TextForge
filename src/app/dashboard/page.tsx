"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Editor from "@/components/Editor";
import TemplatePicker, { type TemplateType } from "@/components/TemplatePicker";
import { supabase } from "@/lib/supabase";
import { UserButton, useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading Studio...</div>}>
      <DashboardPageContent />
    </Suspense>
  );
}

function DashboardPageContent() {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Untitled Document");
  const [template, setTemplate] = useState<TemplateType>("simple");
  const [formattedHTML, setFormattedHTML] = useState("");
  const [isFormatting, setIsFormatting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  interface Subscription {
    plan_type: 'free' | 'starter' | 'creator' | 'pro' | 'business' | 'lifetime';
    status: string;
    pdf_usage_count: number;
  }
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [exportCount, setExportCount] = useState(0);
  const [fontFamily, setFontFamily] = useState("helvetica");

  const [accentColor, setAccentColor] = useState("#0f172a");
  const [featureImage, setFeatureImage] = useState<string | null>(null);

  const searchParams = useSearchParams();

  // Handle URL params (Success/Cancel from Payment)
  useEffect(() => {
    if (searchParams.get("success")) {
      setSuccess("Payment successful! Your premium features are now active.");
      fetchSubscription();
      // Clear URL params after a few seconds
      setTimeout(() => setSuccess(""), 5000);
    }
  }, [searchParams]);

  // Load draft and subscription on mount
  useEffect(() => {
    const draft = localStorage.getItem("draft-content");
    if (draft) setContent(draft);

    fetchSubscription();
    fetchExportCount();
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const res = await fetch("/api/subscription");
      const data = await res.json();
      setSubscription(data);
    } catch (err) {
      console.error("Failed to fetch subscription", err);
    }
  };

  const fetchExportCount = async () => {
    if (!user?.id) return;
    try {
      const { count } = await supabase
        .from("pdf_history")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      setExportCount(count || 0);
    } catch (err) {
      console.error("Failed to fetch export count", err);
    }
  };

  // Update PDF Preview when content or template changes
  useEffect(() => {
    const generatePreview = async () => {
      const contentToUse = formattedHTML || content;
      if (!contentToUse.trim() && !featureImage) return;

      setIsPreviewLoading(true);
      try {
        const response = await fetch("/api/pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: contentToUse,
            title,
            template,
            fontFamily,
            accentColor,
            featureImage,
          }),
        });

        if (featureImage) {
          console.log("Dashboard: Sending feature image to PDF engine. Base64 length:", featureImage.length);
        }

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);

          // Revoke old URL to prevent memory leaks
          if (pdfUrl) window.URL.revokeObjectURL(pdfUrl);
          setPdfUrl(url);
          setError(""); // Clear error on success
        } else {
          const errorData = await response.json();
          console.error("Preview API error:", errorData.error);
          setError(`Preview Error: ${errorData.error}`);
        }
      } catch (err) {
        console.error("Preview generation fatal error", err);
        setError("Failed to connect to PDF engine");
      } finally {
        setIsPreviewLoading(false);
      }
    };

    const timer = setTimeout(generatePreview, 1000); // 1s debounce
    return () => clearTimeout(timer);
  }, [content, formattedHTML, template, title, fontFamily, accentColor, featureImage, pdfUrl]);

  // AI Format Handler
  const handleAIFormat = async (task: "format" | "summarize" | "expand" | "refine" = "format") => {
    if (!content.trim()) {
      setError("Please enter some content first");
      return;
    }

    setIsFormatting(true);
    setError("");

    try {
      const response = await fetch("/api/ai-format", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: content,
          template,
          tone: "professional",
          task,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "AI formatting failed");
      }

      const data = await response.json();
      setFormattedHTML(data.formattedHTML);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to format content");
    } finally {
      setIsFormatting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Dashboard: Image selected:", file.name, file.size, file.type);
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Image size too large (max 5MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadstart = () => console.log("Dashboard: Reading image file...");
      reader.onloadend = () => {
        console.log("Dashboard: Image read complete. Updating state.");
        setFeatureImage(reader.result as string);
        setSuccess("Image uploaded successfully! Generating updated preview...");
        setTimeout(() => setSuccess(""), 3000);
      };
      reader.onerror = () => {
        console.error("Dashboard: FileReader error");
        setError("Failed to read image file");
      };
      reader.readAsDataURL(file);
    }
  };

  // PDF Generation Handler
  const handleGeneratePDF = async () => {
    const contentToUse = formattedHTML || content;

    // Plan-based Limits
    const planLimits: Record<string, number> = {
      free: 10,
      starter: 10,
      creator: 999999,
      pro: 999999,
      business: 999999,
      lifetime: 999999,
    };
    const currentPlan = subscription?.plan_type || "starter";
    const currentLimit = planLimits[currentPlan];

    if (exportCount >= currentLimit) {
      setError(`You've reached the monthly limit for the ${currentPlan === "starter" ? "Starter" : currentPlan} plan (${currentLimit} exports). Please upgrade to continue.`);
      return;
    }

    if (!contentToUse.trim() && !featureImage) {
      setError("Please add content before generating PDF");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: contentToUse,
          title,
          template,
          includeHeaderFooter: true,
          fontFamily,

          accentColor,
          featureImage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "PDF generation failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Prevent memory leak

      // Save to History (localStorage)
      const historyItem = {
        id: crypto.randomUUID(),
        title: title || "Untitled Document",
        template: template,
        date: new Date().toISOString(),
        contentPreview: contentToUse.substring(0, 100),
        charCount: contentToUse.length
      };

      const existingHistory = JSON.parse(localStorage.getItem("pdf-history") || "[]");
      localStorage.setItem("pdf-history", JSON.stringify([historyItem, ...existingHistory]));

      // Save to Supabase (Cloud Sync)
      if (user?.id) {
        supabase.from('pdf_history').insert([{
          user_id: user.id,
          title: historyItem.title,
          template: historyItem.template,
          content_preview: historyItem.contentPreview,
          char_count: historyItem.charCount,
        }]).then(({ error }) => {
          if (error) console.error("Cloud sync failed:", error);
          fetchExportCount(); // Refresh count
        });
      }

      // Success feedback
      setError("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="flex h-screen overflow-hidden">
        {/* Sleek App Sidebar */}
        <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white p-6 lg:flex">
          <div className="mb-8 flex items-center gap-3">
            <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white transition hover:bg-slate-700">
              TF
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Studio</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">Version 1.2.0</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-8">
            {/* Project Settings */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Project Engine</p>
              <div className="space-y-2">
                <button className="flex w-full items-center gap-3 rounded-xl bg-slate-50 p-3 text-left text-sm font-medium text-slate-900 ring-1 ring-slate-200 transition hover:bg-white">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 text-[10px] text-white">1</span>
                  Configuration
                </button>
                <Link href="/dashboard/history" className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white border border-slate-200 text-xs">📜</span>
                  History
                </Link>
              </div>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Resources</p>
              <div className="space-y-2">
                <Link href="/templates" className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white border border-slate-200 text-xs">🎨</span>
                  Templates
                </Link>
                <Link href="/api-docs" className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white border border-slate-200 text-xs">🔌</span>
                  API Docs
                </Link>
              </div>
            </div>

            {/* Account & Billing */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Account & Billing</p>
              <div className="space-y-2">
                {(subscription?.plan_type && subscription?.plan_type !== 'starter' && subscription?.plan_type !== 'free') ? (
                  <Link
                    href="/user-profile"
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 text-[10px] text-white">👤</span>
                    Account Settings
                  </Link>
                ) : (
                  <Link href="/#pricing" className="flex w-full items-center gap-3 rounded-xl bg-amber-50 p-3 text-left text-sm font-semibold text-amber-700 ring-1 ring-amber-100 transition hover:bg-amber-100">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500 text-[10px] text-white">⭐</span>
                    Upgrade Plan
                  </Link>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">AI Studio Actions</p>
              <div className="grid gap-2">
                {[
                  { label: "Format Structure", task: "format", icon: "🪄" },
                  { label: "Summarize", task: "summarize", icon: "📝" },
                  { label: "Expand Content", task: "expand", icon: "🚀" },
                  { label: "Refine Tone", task: "refine", icon: "✨" },
                ].map((action) => (
                  <button
                    key={action.task}
                    onClick={() => handleAIFormat(action.task as "format" | "summarize" | "expand" | "refine")}
                    disabled={isFormatting || !content.trim() || ["free", "starter"].includes(subscription?.plan_type || "starter")}
                    className="group flex items-center justify-between rounded-xl px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
                  >
                    <span>{action.icon} {action.label}</span>
                    {["free", "starter"].includes(subscription?.plan_type || "starter") ? (
                      <span className="text-[10px] text-amber-500 font-bold">PRO</span>
                    ) : (
                      <span className="opacity-0 transition group-hover:opacity-100 text-[10px]">✨</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats Block */}
            <div className="mt-auto space-y-4 rounded-3xl bg-slate-50 p-5 shadow-inner">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Stats</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Words</span>
                  <span className="font-bold text-slate-900">{content.split(/\s+/).filter(Boolean).length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Read Time</span>
                  <span className="font-bold text-slate-900">{Math.ceil(content.split(/\s+/).filter(Boolean).length / 200)}m</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-200">
                  <div className="h-full w-1/3 rounded-full bg-slate-900" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Scroll Area */}
        <main className="flex-1 overflow-y-auto px-8 py-10">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
            {/* Header / Nav */}
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-bold uppercase tracking-tight text-slate-400">Current Draft</h2>
                <div className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="text-sm font-semibold text-slate-900">{title}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full bg-slate-100 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                  <span className="text-slate-900">
                    {(() => {
                      const plan = subscription?.plan_type || "starter";
                      if (plan === "starter" || plan === "free") return Math.max(0, 10 - exportCount);
                      return "∞";
                    })()}
                  </span> {subscription?.plan_type === "starter" || subscription?.plan_type === "free" ? "Exports Remaining" : "Unlimited Exports"}
                </div>
                {subscription?.plan_type && !["free", "starter"].includes(subscription.plan_type) && (
                  <div className="rounded-full bg-amber-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-tight text-amber-600">
                    Premium: {subscription.plan_type.toUpperCase()}
                  </div>
                )}
                <UserButton afterSignOutUrl="/" />
              </div>
            </header>
            {/* Success Message */}
            {success && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-xs font-semibold text-emerald-600 animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2">
                  <span className="text-sm">✅</span>
                  {success}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-xs font-semibold text-red-600 animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2">
                  <span className="text-sm">⚠️</span>
                  {error}
                </div>
              </div>
            )}

            {/* Document Title */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Document title..."
                className="w-full text-2xl font-semibold text-slate-900 outline-none placeholder-slate-400"
              />
            </div>

            {/* Template Picker */}
            <TemplatePicker selected={template} onSelect={setTemplate} />

            {/* Brand Kit (Pro) */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white">🎨</span>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">Brand Identity</h3>
                </div>
                {(subscription?.plan_type === 'free' || subscription?.plan_type === 'starter') && (
                  <Link href="/#pricing" className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold text-amber-600 transition hover:bg-amber-200">
                    ✨ UNLOCK BRAND KIT
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Font Selection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Typography</label>
                    <span className="text-[10px] text-slate-400">Standard Fonts</span>
                  </div>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    disabled={subscription?.plan_type === 'free' || subscription?.plan_type === 'starter'}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none ring-slate-900 transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <option value="helvetica">Inter / Helvetica</option>
                    <option value="times-roman">Georgia / Times</option>
                    <option value="courier">JetBrains / Courier</option>
                  </select>
                </div>

                {/* Color Selection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Accent Color</label>
                    <span className="text-[10px] text-slate-400">Universal Palette</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-slate-200">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        disabled={subscription?.plan_type === 'free' || subscription?.plan_type === 'starter'}
                        className="absolute -inset-2 h-[150%] w-[150%] cursor-pointer border-none bg-transparent disabled:cursor-not-allowed"
                      />
                    </div>
                    <input
                      type="text"
                      value={accentColor.toUpperCase()}
                      onChange={(e) => setAccentColor(e.target.value)}
                      disabled={subscription?.plan_type === 'free' || subscription?.plan_type === 'starter'}
                      placeholder="#000000"
                      className="flex-1 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-mono font-bold text-slate-900 outline-none ring-slate-900 transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-40"
                    />
                  </div>
                </div>
              </div>

              {/* Feature Image Selection */}

            </div>

            {/* Main Content Area */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Left: Editor */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">
                    ✍️ Content Editor
                  </h2>
                  <button
                    onClick={() => handleAIFormat("format")}
                    disabled={isFormatting || !content.trim() || ["free", "starter"].includes(subscription?.plan_type || "starter")}
                    className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isFormatting ? (
                      <>
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
                        Formatting...
                      </>
                    ) : (
                      <>
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
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        {["free", "starter"].includes(subscription?.plan_type || "starter") ? "AI Format (PRO)" : "AI Format"}
                      </>
                    )}
                  </button>
                </div>
                <Editor
                  value={content}
                  onChange={setContent}
                  placeholder="Start writing your content here... 

Use # for headings
Use - for bullet lists
Use 1. for numbered lists

Example:
# Main Heading
This is a paragraph with some important information.

## Subheading
- First point
- Second point
- Third point"
                />

                {/* Feature Image Selection (Moved here) */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Feature Image</label>
                    <span className="text-[10px] text-slate-400">JPG / PNG (Max 5MB)</span>
                  </div>

                  <div className="flex items-center gap-4">
                    {featureImage && (
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200">
                        <img src={featureImage} alt="Preview" className="h-full w-full object-cover" />
                        <button
                          onClick={() => setFeatureImage(null)}
                          className="absolute top-0 right-0 bg-slate-900/50 text-white p-0.5 rounded-bl-md hover:bg-red-500/80 transition"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    )}

                    <label className="cursor-pointer flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-white hover:border-slate-300 transition dashed-border w-full justify-center">
                      <input type="file" accept="image/png, image/jpeg" onChange={handleImageUpload} className="hidden" />
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {featureImage ? "Change Image" : "Upload Image"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right: Preview */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">
                    👁️ Live Preview
                  </h2>
                  <button
                    onClick={handleGeneratePDF}
                    disabled={isGenerating || (!content.trim() && !formattedHTML && !featureImage)}
                    className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
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
                        Generating...
                      </>
                    ) : (
                      <>
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
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                          />
                        </svg>
                        Download PDF
                      </>
                    )}
                  </button>
                </div>
                {/* Premium Preview Section */}
                <div className="flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/50">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                      Live Preview
                    </h2>
                    <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-tight text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Export ready
                    </div>
                  </div>

                  {/* Skeleton / Preview Container */}
                  <div className="relative mb-6 min-h-[450px] space-y-4 rounded-3xl border border-slate-100 bg-slate-50/50 p-6 overflow-hidden">
                    {isPreviewLoading || !pdfUrl ? (
                      <div className="space-y-4 animate-in fade-in duration-500">
                        <div className="h-4 w-2/3 rounded-full bg-slate-200/60" />
                        <div className="h-32 w-full rounded-2xl bg-gradient-to-br from-slate-100/40 via-white to-slate-200/40" />
                        <div className="grid grid-cols-2 gap-3">
                          <div className="h-20 rounded-2xl bg-slate-100/60" />
                          <div className="h-20 rounded-2xl bg-slate-100/60" />
                        </div>
                        <div className="h-4 w-full rounded-full bg-slate-200/40" />
                        <div className="h-4 w-3/4 rounded-full bg-slate-200/40" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 h-full w-full">
                        <iframe
                          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                          className="h-full w-full"
                          title="PDF Preview"
                        />
                      </div>
                    )}
                  </div>

                  {/* Brand & Context Metadata Block */}
                  <div className="mb-6 rounded-[1.5rem] bg-[#0d1117] p-5 text-white shadow-lg">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                          Brand Identity
                        </p>
                        <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">Brand: TextForge Studio</p>
                        <p className="text-xs text-slate-400">
                          Tone: crisp, executive, data-forward
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Prompt Context Footer */}
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Active Prompt
                    </p>
                    <p className="text-xs leading-relaxed text-slate-500 italic">
                      &quot;{title || "Document generation"}&quot; with {template} aesthetic and structured layout optimization.
                    </p>
                  </div>

                  {/* Download Button Overlaid at bottom for quick access */}
                  <button
                    onClick={handleGeneratePDF}
                    disabled={isGenerating || (!content.trim() && !formattedHTML && !featureImage)}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-slate-800 disabled:opacity-50"
                  >
                    {isGenerating ? "Exporting High-Res PDF..." : "Download PDF →"}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Workflow Info */}
            <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white">
              <h3 className="text-lg font-semibold">🚀 How it works</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <div className="mb-2 text-2xl">1️⃣</div>
                  <h4 className="font-semibold text-amber-300">Write Content</h4>
                  <p className="mt-1 text-xs text-slate-300">
                    Type or paste your content in the editor
                  </p>
                </div>
                <div>
                  <div className="mb-2 text-2xl">2️⃣</div>
                  <h4 className="font-semibold text-amber-300">AI Format</h4>
                  <p className="mt-1 text-xs text-slate-300">
                    Let AI structure and format your content professionally
                  </p>
                </div>
                <div>
                  <div className="mb-2 text-2xl">3️⃣</div>
                  <h4 className="font-semibold text-amber-300">Generate PDF</h4>
                  <p className="mt-1 text-xs text-slate-300">
                    Download your polished, print-ready PDF
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
