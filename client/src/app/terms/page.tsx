import type { Metadata } from "next";
import TermsClient from "./TermsClient";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Read the terms of service for TextForge Studio. Understand your rights and responsibilities when using our AI-powered PDF generation service.",
    openGraph: {
        title: "Terms of Service | TextForge Studio",
        description: "Terms and conditions for using TextForge Studio.",
        type: "website",
    },
    alternates: {
        canonical: "/terms",
    },
};

export default function TermsPage() {
    return <TermsClient />;
}
