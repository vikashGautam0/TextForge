"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import Editor from "@/components/Editor";
import { type TemplateType } from "@/components/TemplatePicker";
import { supabase } from "@/lib/supabase";
import { UserButton, useUser, useAuth, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { fetchFromBackend } from "@/lib/api";

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
    ai_usage_count: number;
  }
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [exportCount, setExportCount] = useState(0);
  const [fontFamily, setFontFamily] = useState("helvetica");

  const [accentColor, setAccentColor] = useState("#0f172a");
  const [featureImage, setFeatureImage] = useState<string | null>(null);
  const [view, setView] = useState<'editor' | 'split' | 'preview'>('editor');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const searchParams = useSearchParams();

  const { getToken } = useAuth();

  const fetchSubscription = useCallback(async () => {
    try {
      const res = await fetchFromBackend("/subscription", {}, getToken);
      const data = await res.json();
      setSubscription(data);
    } catch (err) {
      console.error("Failed to fetch subscription", err);
    }
  }, [getToken]);

  // Handle URL params (Success/Cancel from Payment)
  useEffect(() => {
    if (searchParams.get("success")) {
      setSuccess("Payment successful! Your premium features are now active.");
      fetchSubscription();
      // Clear URL params after a few seconds
      setTimeout(() => setSuccess(""), 5000);
    }
  }, [searchParams, fetchSubscription]);

  // No changes here, just moving it down in the next block

  const fetchExportCount = useCallback(async () => {
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
  }, [user]);

  // Load draft and subscription on mount
  useEffect(() => {
    const draft = localStorage.getItem("draft-content");
    if (draft) setContent(draft);

    fetchSubscription();
    fetchExportCount();
  }, [user, fetchExportCount, fetchSubscription]);

  // Update PDF Preview when content or template changes
  useEffect(() => {
    const generatePreview = async () => {
      const contentToUse = formattedHTML || content;
      if (!contentToUse.trim() && !featureImage) return;

      setIsPreviewLoading(true);
      try {
        const response = await fetchFromBackend("/pdf", {
          method: "POST",
          body: JSON.stringify({
            content: contentToUse,
            title,
            template,
            fontFamily,
            accentColor,
            featureImage,
            _t: Date.now() // Cache busting
          }),
        }, getToken);

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);

          setPdfUrl(prevUrl => {
            if (prevUrl) window.URL.revokeObjectURL(prevUrl);
            return url;
          });
          setError("");
        } else {
          const errorData = await response.json();
          // Don't show technical preview errors directly, just log them
          console.warn("Live Preview Error:", errorData.error);
        }
      } catch (err) {
        console.error("Preview generation fatal error", err);
      } finally {
        setIsPreviewLoading(false);
      }
    };

    const timer = setTimeout(generatePreview, 1000); // 1s debounce
    return () => clearTimeout(timer);
  }, [content, formattedHTML, template, title, fontFamily, accentColor, featureImage, refreshTrigger]);

  // Error Mapping Utility
  const handleUserError = useCallback((err: unknown, fallback: string) => {
    const rawMessage = err instanceof Error ? err.message : String(err);
    console.error("Technical Error:", rawMessage);

    let friendlyMessage = fallback;

    if (rawMessage.includes("limit reached")) {
      friendlyMessage = "Monthly export limit reached. Upgrade to continue!";
    } else if (rawMessage.includes("Unauthorized")) {
      friendlyMessage = "Session expired. Please sign in again.";
    } else if (rawMessage.includes("Content is required")) {
      friendlyMessage = "Don't forget to add some content first!";
    } else if (rawMessage.includes("Failed to fetch") || rawMessage.includes("NetworkError")) {
      friendlyMessage = "Connection unstable. Live Engine is trying to reconnect...";
    } else if (rawMessage.includes("Unexpected token") || rawMessage.includes("parsing")) {
      friendlyMessage = "Engine hiccup. Trying to recover...";
    }

    setError(friendlyMessage);
    // Clear error automatically after 6s
    const timer = setTimeout(() => setError(""), 6000);
    return () => clearTimeout(timer);
  }, []);

  // AI Format Handler
  const handleAIFormat = async (task: "format" | "summarize" | "expand" | "refine" = "format") => {
    if (!user) {
      setError("Sign in to use AI Magic! ✨");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (!content.trim()) {
      setError("Add some text first so the AI can work its magic!");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setIsFormatting(true);
    setError("");

    try {
      const response = await fetchFromBackend("/ai/format", {
        method: "POST",
        body: JSON.stringify({
          text: content,
          template,
          tone: "professional",
          task,
        }),
      }, getToken);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "AI formatting failed");
      }

      const data = await response.json();
      setFormattedHTML(data.formattedHTML);
    } catch (err: unknown) {
      handleUserError(err, "AI Magic is resting. Try again in a moment.");
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

  const insertMarkdown = (prefix: string, suffix: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) {
      setContent(prev => prev + prefix + suffix);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selection = content.substring(start, end);
    const replacement = prefix + selection + suffix;
    const newContent = content.substring(0, start) + replacement + content.substring(end);

    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      setError(`Limit reached for ${currentPlan}. Upgrade to continue.`);
      return;
    }

    if (!contentToUse.trim() && !featureImage) {
      setError("Please add content first");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetchFromBackend("/pdf", {
        method: "POST",
        body: JSON.stringify({
          content: contentToUse,
          title,
          template,
          includeHeaderFooter: true,
          fontFamily,
          accentColor,
          featureImage,
        }),
      }, getToken);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Generation failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // Save to History (simplified log)
      if (user?.id) {
        supabase.from('pdf_history').insert([{
          user_id: user.id,
          title: title || "Untitled Document",
          template: template,
          char_count: contentToUse.length,
        }]).then(() => fetchExportCount());
      }
    } catch (err: unknown) {
      handleUserError(err, "Export failed. Please check your content and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#fafafa]">
      {/* Responsive Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 transform bg-white p-6 shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:flex lg:w-72 lg:translate-x-0 lg:flex-col lg:border-r lg:border-slate-200 lg:shadow-none
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="mb-8 flex items-center gap-3">
          <Link href="/" className="group relative h-10 w-10 overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm transition-transform hover:scale-105">
            <Image
              src="/logo.png"
              alt="TextFroge Logo"
              fill
              className="object-contain p-1.5"
            />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-none">Studio</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">Version 1.2.0</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto">
          {/* Project Settings */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Project Engine</p>
            <div className="space-y-0.5">
              <button onClick={() => setView('editor')} className={`flex w-full items-center gap-2.5 rounded-lg p-2 text-left text-[11px] font-medium transition ${view === 'editor' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}>
                <span>✍️</span> Editor
              </button>
              <button onClick={() => setView('split')} className={`flex w-full items-center gap-2.5 rounded-lg p-2 text-left text-[11px] font-medium transition ${view === 'split' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}>
                <span>🌓</span> Split View
              </button>
              <button onClick={() => setView('preview')} className={`flex w-full items-center gap-2.5 rounded-lg p-2 text-left text-[11px] font-medium transition ${view === 'preview' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}>
                <span>👁️</span> Preview
              </button>
              <SignedIn>
                <Link href="/dashboard/history" className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left text-[11px] font-medium text-slate-600 transition hover:bg-slate-50">
                  <span>📜</span> History
                </Link>
              </SignedIn>
            </div>
          </div>

          {/* Upgrade Section */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Premium Plan</p>
            <p className="mt-1 text-[10px] text-indigo-600/80 leading-relaxed">Get unlimited exports and branding features.</p>
            <Link href="/#pricing" className="mt-3 block w-full rounded-lg bg-indigo-600 py-2 text-center text-[10px] font-bold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700">
              Upgrade Now
            </Link>
          </div>

          {/* Brand Identity Settings */}
          <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Brand Identity</p>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Typography</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5 text-xs font-semibold outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="helvetica">Inter</option>
                  <option value="times-roman">Georgia</option>
                  <option value="courier">Mono</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Accent Color</label>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 shrink-0 overflow-hidden rounded-md border border-slate-200">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="h-full w-full cursor-pointer border-none bg-transparent"
                    />
                  </div>
                  <input
                    type="text"
                    value={accentColor.toUpperCase()}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-100 bg-slate-50 px-2 py-1 text-[10px] font-mono font-bold"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Feature Image</label>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-2 transition hover:border-slate-300">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <span className="text-[9px] font-bold text-slate-500">{featureImage ? "Change" : "Upload"}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Stats / AI Magic Credits */}
          <div className="mt-auto space-y-4 rounded-3xl bg-slate-50 p-5 shadow-inner">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {user ? "AI Format Credits" : "Guest Mode"}
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">
                {user ? (() => {
                  const plan = subscription?.plan_type || "starter";
                  const aiCount = subscription?.ai_usage_count || 0;
                  if (plan === "starter" || plan === "free") return `${Math.max(0, 5 - aiCount)} / 5 Left`;
                  return "∞ Unlimited";
                })() : "Members Only"}
              </span>
              <span className="text-slate-400 uppercase text-[9px] font-bold tracking-tighter">
                {user ? `Plan: ${subscription?.plan_type || 'Starter'}` : "Guest Mode"}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
              <div className={`h-full transition-all duration-500 ${user ? 'bg-indigo-600' : 'bg-indigo-500 animate-pulse'}`}
                style={{
                  width: user ? (() => {
                    const plan = subscription?.plan_type || "starter";
                    const aiCount = subscription?.ai_usage_count || 0;
                    if (plan === "starter" || plan === "free") return `${(aiCount / 5) * 100}%`;
                    return '100%';
                  })() : '100%'
                }}
              />
            </div>
            <p className="text-[9px] text-slate-400 italic mt-2">
              {user ? "PDF Exports are now Unlimited for all users! 🚀" : "Sign in to save history & use custom fonts."}
            </p>
          </div>

          {/* Conditional Ad for Free/Starter Users */}
          {(subscription?.plan_type === "free" || subscription?.plan_type === "starter" || !subscription) && (
            <div className="mt-4 overflow-hidden rounded-2xl border border-indigo-100 bg-indigo-600 p-4 transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[8px] font-bold text-white uppercase italic">Sponsor</span>
                <span className="text-[8px] text-indigo-100 font-medium">TextFroge Pro</span>
              </div>
              <p className="mt-2 text-[11px] font-bold text-white leading-tight">Unlock Unlimited AI Format & Premium Exports</p>
              <Link href="/#pricing" className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2 text-[10px] font-black text-indigo-600 shadow-xl transition active:scale-95">
                Go Premium 🚀
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main App Container */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Mockup Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-slate-50 lg:hidden"
            >
              <svg className="h-6 w-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-transparent text-sm font-bold text-slate-900 outline-none focus:ring-1 focus:ring-slate-100 rounded px-1 w-full truncate"
                />
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">Auto-saved moments ago</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setSuccess("Project link copied to clipboard!");
                setTimeout(() => setSuccess(""), 3000);
              }}
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition hover:bg-slate-100"
              title="Share Project"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <button
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              className="rounded-xl bg-indigo-600 px-4 sm:px-6 py-2 text-[10px] sm:text-xs font-bold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:opacity-50"
            >
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">Export</span>
            </button>
            <div className="scale-90 sm:scale-100 flex items-center">
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="rounded-lg bg-slate-900 px-3 py-1.5 text-[10px] font-bold text-white transition hover:bg-slate-800">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col overflow-hidden p-2 sm:p-4 lg:p-6">
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden rounded-2xl sm:rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
            {/* Toolbar */}
            <div className="flex h-14 items-center justify-between border-b border-slate-100 bg-white px-4 sm:px-6 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1 shrink-0">
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 sm:px-3 py-1.5">
                  <span className="text-xs">📄</span>
                  <select
                    value={template}
                    onChange={(e) => setTemplate(e.target.value as TemplateType)}
                    className="bg-transparent text-[10px] sm:text-[11px] font-bold text-slate-900 outline-none"
                  >
                    <option value="simple">Simple</option>
                    <option value="academic">Academic</option>
                    <option value="professional">Professional</option>
                    <option value="code">Technical</option>
                    <option value="modern">Modern</option>
                    <option value="minimal">Minimal</option>
                    <option value="invoice">Invoice</option>
                    <option value="resume">Resume (Classic)</option>
                    <option value="resume_modern">Resume (Modern)</option>
                    <option value="resume_executive">Resume (Executive)</option>
                    <option value="creative">Creative</option>
                    <option value="letter">Letter</option>
                    <option value="report">Report</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>

                <div className="mx-2 sm:mx-4 h-4 w-[1px] bg-slate-200" />

                <div className="flex items-center gap-3 sm:gap-4 text-slate-400">
                  <button onClick={() => insertMarkdown('**', '**')} className="hover:text-slate-900 transition"><span className="font-bold">B</span></button>
                  <button onClick={() => insertMarkdown('_', '_')} className="hover:text-slate-900 transition"><span className="italic">I</span></button>
                  <button onClick={() => insertMarkdown('<u>', '</u>')} className="hover:text-slate-900 transition underline">U</button>
                  <button onClick={() => insertMarkdown('[', '](url)')} className="hidden sm:block hover:text-slate-900 transition">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 015.656 0l4-4a4 4 0 115.656 5.656l-1.101 1.101" /></svg>
                  </button>
                  <button onClick={() => insertMarkdown('\n- ', '')} className="hover:text-slate-900 transition">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleAIFormat('format')}
                disabled={isFormatting}
                className="ml-4 flex items-center gap-2 rounded-full bg-slate-900 px-3 sm:px-4 py-1.5 text-[9px] sm:text-[10px] font-bold text-white transition hover:scale-105 active:scale-95 shrink-0"
              >
                <span className={isFormatting ? "animate-spin" : "animate-pulse"}>{isFormatting ? "⌛" : "✨"}</span>
                {isFormatting ? "AI Working..." : "AI Format"}
              </button>
            </div>

            {/* View Switcher Bar */}
            <div className="flex h-12 items-center justify-center border-b border-slate-100 bg-slate-50/30 px-4 sm:px-6">
              <div className="flex items-center rounded-lg bg-slate-100/50 p-1">
                <button
                  onClick={() => setView('editor')}
                  className={`rounded-md px-4 sm:px-6 py-1 text-[11px] font-bold transition ${view === 'editor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Editor
                </button>
                <button
                  onClick={() => setView('split')}
                  className={`hidden lg:block rounded-md px-6 py-1 text-[11px] font-bold transition ${view === 'split' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Split
                </button>
                <button
                  onClick={() => setView('preview')}
                  className={`rounded-md px-4 sm:px-6 py-1 text-[11px] font-bold transition ${view === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Preview
                </button>
              </div>
            </div>

            {/* Premium Notification Area */}
            {(error || success) && (
              <div className="fixed bottom-8 left-1/2 z-[100] w-[90%] max-w-sm -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className={`flex items-center justify-between rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${error
                  ? "border-red-100 bg-red-50/90 text-red-600"
                  : "border-emerald-100 bg-emerald-50/90 text-emerald-600"
                  }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{error ? "⚠️" : "✨"}</span>
                    <p className="text-xs font-bold leading-tight">{error || success}</p>
                  </div>
                  <button
                    onClick={() => { setError(""); setSuccess(""); }}
                    className="ml-4 rounded-full p-1 transition hover:bg-black/5"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden">
              <div className={`grid h-full gap-0 ${view === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
                {/* Editor View */}
                {(view === 'editor' || view === 'split') && (
                  <div className={`flex flex-col overflow-hidden border-r border-slate-100 ${view === 'split' ? '' : 'mx-auto w-full max-w-4xl'}`}>
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-12">
                      <Editor
                        value={content}
                        onChange={(val) => {
                          setContent(val);
                          if (formattedHTML) setFormattedHTML("");
                        }}
                        placeholder="Start writing your thoughts..."
                        className="h-full"
                      />
                    </div>
                  </div>
                )}

                {/* Preview View */}
                {(view === 'preview' || view === 'split') && (
                  <div className="flex flex-col overflow-hidden bg-slate-50/50">
                    {/* Preview Header with Refresh */}
                    <div className="flex items-center justify-between border-b border-slate-100 bg-white/50 px-4 sm:px-6 py-3 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Engine</h3>
                        {isPreviewLoading && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                      </div>
                      <button
                        onClick={() => {
                          setRefreshTrigger(prev => prev + 1);
                          fetchSubscription();
                          fetchExportCount();
                        }}
                        className="group flex items-center gap-2 rounded-lg px-2 sm:px-3 py-1 text-[10px] font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                      >
                        <svg className={`h-3 w-3 shrink-0 ${isPreviewLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="hidden sm:inline">Refresh Preview</span>
                        <span className="sm:hidden">Refresh</span>
                      </button>
                    </div>

                    {/* Conditional Preview Ad */}
                    {(subscription?.plan_type === "free" || subscription?.plan_type === "starter" || !subscription) && (
                      <div className="mx-6 mt-4 flex items-center justify-between rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 shadow-lg animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm">⭐</span>
                          <div className="flex flex-col">
                            <p className="text-[10px] font-bold text-white leading-none">Pro Tip: Unlock AI Formatting</p>
                            <p className="text-[8px] text-indigo-100 mt-1">Upgrade to the Business plan for unlimited AI magic.</p>
                          </div>
                        </div>
                        <Link href="/#pricing" className="rounded-lg bg-white/20 px-3 py-1 text-[9px] font-bold text-white backdrop-blur-sm transition hover:bg-white/30">
                          Upgrade
                        </Link>
                      </div>
                    )}

                    <div className="flex-1 p-2 sm:p-4 lg:p-10">
                      <div className="relative mx-auto h-full w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                        {!pdfUrl ? (
                          <div className="flex h-full flex-col items-center justify-center gap-4 bg-slate-50 p-12 text-center text-slate-400">
                            <div className="text-4xl">📄</div>
                            <p className="text-xs font-medium">Add some content to generate a preview...</p>
                          </div>
                        ) : (
                          <>
                            <iframe
                              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                              className={`h-full w-full transition-opacity duration-300 ${isPreviewLoading ? "opacity-40 grayscale" : "opacity-100"}`}
                              title="PDF Preview"
                            />
                            {isPreviewLoading && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px]">
                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-900/10 border-t-slate-900" />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
