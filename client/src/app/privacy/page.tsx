import type { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Learn how TextForge Studio protects your privacy. We collect minimal data and never use your documents to train AI models.",
    openGraph: {
        title: "Privacy Policy | TextForge Studio",
        description: "Our commitment to protecting your privacy and data security.",
        type: "website",
    },
};

export default function PrivacyPage() {
    return <PrivacyClient />;
}
