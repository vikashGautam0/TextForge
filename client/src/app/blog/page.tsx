import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Blog | PDF Tips, Templates & Productivity",
    description: "Expert tips on creating professional PDFs, resume writing, document design, and productivity. Learn how to create stunning documents with TextForge Studio.",
    keywords: ["PDF tips", "resume tips", "document design", "productivity tips", "PDF tutorials", "template guides"],
    openGraph: {
        title: "Blog | TextForge Studio",
        description: "Expert tips on PDF creation, document design, and productivity.",
        type: "website",
    },
    alternates: {
        canonical: "/blog",
    },
};

const BLOG_POSTS = [
    {
        slug: "how-to-create-professional-resume-2026",
        title: "How to Create a Professional Resume in 2026",
        excerpt: "Learn the latest resume trends and create a stunning CV that stands out to recruiters and ATS systems.",
        category: "Resume Tips",
        readTime: "5 min read",
        date: "Feb 8, 2026",
        image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80"
    },
    {
        slug: "best-pdf-templates-for-business",
        title: "10 Best PDF Templates for Business Documents",
        excerpt: "Discover the most professional templates for invoices, proposals, contracts, and reports.",
        category: "Templates",
        readTime: "4 min read",
        date: "Feb 5, 2026",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80"
    },
    {
        slug: "ai-document-formatting-guide",
        title: "AI Document Formatting: Complete Guide",
        excerpt: "How AI is revolutionizing document creation and formatting for professionals worldwide.",
        category: "AI & Tech",
        readTime: "6 min read",
        date: "Feb 1, 2026",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80"
    },
];

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* Header */}
            <nav className="border-b border-slate-200/50 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-white border border-slate-100 shadow-sm">
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
                        <Link href="/templates" className="text-xs font-bold text-slate-400 hover:text-slate-900 transition uppercase tracking-widest">Templates</Link>
                        <Link href="/dashboard" className="rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700 transition">
                            Try Free
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-6xl px-6 py-16">
                {/* Hero */}
                <div className="text-center mb-16">
                    <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
                        Blog
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                        Tips, Templates & Insights
                    </h1>
                    <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
                        Expert advice on creating professional documents, productivity tips, and the latest in AI-powered document creation.
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {BLOG_POSTS.map((post) => (
                        <article key={post.slug} className="group rounded-3xl border border-slate-200 bg-white overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition">
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition duration-500 group-hover:scale-110"
                                    unoptimized
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-700 shadow-sm">
                                        {post.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
                                    <span>{post.date}</span>
                                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                                    <span>{post.readTime}</span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 group-hover:text-slate-700 transition">
                                    {post.title}
                                </h2>
                                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                                    {post.excerpt}
                                </p>
                                <div className="mt-6 pt-4 border-t border-slate-100">
                                    <span className="text-sm font-bold text-slate-900 group-hover:underline">
                                        Read article →
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-20 rounded-3xl bg-slate-900 p-12 text-center">
                    <h2 className="text-3xl font-bold text-white">
                        Ready to create stunning PDFs?
                    </h2>
                    <p className="mt-3 text-slate-400 max-w-xl mx-auto">
                        Join thousands of professionals using TextForge Studio to create beautiful documents in seconds.
                    </p>
                    <Link
                        href="/dashboard"
                        className="mt-8 inline-flex rounded-full bg-white px-8 py-4 text-sm font-bold text-slate-900 hover:bg-slate-100 transition shadow-xl"
                    >
                        Start Creating for Free
                    </Link>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="border-t border-slate-100 py-8">
                <div className="mx-auto max-w-6xl px-6 flex items-center justify-between text-xs text-slate-400">
                    <span>© 2026 TextForge Studio</span>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-slate-900 transition">Privacy</Link>
                        <Link href="/terms" className="hover:text-slate-900 transition">Terms</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
