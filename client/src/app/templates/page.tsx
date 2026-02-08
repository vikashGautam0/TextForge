import type { Metadata } from "next";
import TemplatesClient from "./TemplatesClient";

export const metadata: Metadata = {
    title: "PDF Templates | Professional Document Templates",
    description: "Browse our collection of professional PDF templates. Create resumes, reports, invoices, academic papers, and technical documentation with beautifully designed templates.",
    keywords: ["PDF templates", "document templates", "resume templates", "invoice templates", "report templates", "professional templates"],
    openGraph: {
        title: "PDF Templates | TextForge Studio",
        description: "Browse 15+ professional PDF templates for resumes, reports, invoices and more.",
        type: "website",
    },
    alternates: {
        canonical: "/templates",
    },
};

export default function TemplatesPage() {
    return <TemplatesClient />;
}
