import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://textfroge.site'),
  title: {
    default: "TextForge Studio - Free AI PDF Generator | Resume, Image to PDF, Text to PDF",
    template: "%s | TextForge Studio"
  },
  description:
    "Create professional PDFs instantly with TextForge Studio. Free AI-powered PDF generator with 15+ templates. Convert text to PDF, images to PDF, create resumes, invoices, reports & more. Fast, free, and feature-rich PDF creation tool.",
  keywords: [
    "PDF generator",
    "free PDF creator",
    "AI PDF generator",
    "text to PDF",
    "image to PDF converter",
    "resume generator",
    "resume builder",
    "PDF templates",
    "professional PDF templates",
    "invoice generator",
    "report generator",
    "online PDF maker",
    "document creator",
    "PDF editor",
    "professional PDF",
    "business PDF",
    "business document templates",
    "academic PDF",
    "technical documentation",
    "contract generator",
    "letter template",
    "free resume templates",
    "modern resume builder",
    "executive resume template",
    "PDF converter online",
    "fast PDF generation",
    "branded PDF",
    "custom PDF",
    "TextForge",
    "TextFroge Studio"
  ],
  authors: [{ name: "TextForge Studio Team" }],
  creator: "TextForge Studio",
  publisher: "TextForge Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'TextForge Studio',
    title: 'TextForge Studio - Free AI PDF Generator with 15+ Templates',
    description: 'Create professional PDFs instantly. Free AI-powered generator for resumes, invoices, reports & more. Convert text to PDF, images to PDF. Fast, free, feature-rich.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'TextForge Studio - AI PDF Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TextForge Studio - Free AI PDF Generator',
    description: 'Create professional PDFs instantly with AI. 15+ templates for resumes, invoices, reports. Convert text & images to PDF. Free & fast.',
    images: ['/logo.png'],
    creator: '@textforge',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'FZ_Em2qxl9ZAjf_JBL6kKJfqAaz6NWiYFMvxbFe8mEE',
    // yandex: 'your-yandex-verification-code',
    other: {
      'msvalidate.01': 'AE2F4A7BBEFA489F42AAF59E2912D702',
    },
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TextForge Studio",
    "alternateName": "TextFroge",
    "url": process.env.NEXT_PUBLIC_APP_URL || "https://textfroge.site",
    "logo": `${process.env.NEXT_PUBLIC_APP_URL || "https://textfroge.site"}/logo.png`,
    "sameAs": [],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TextForge Studio",
    "url": process.env.NEXT_PUBLIC_APP_URL || "https://textfroge.site",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.NEXT_PUBLIC_APP_URL || "https://textfroge.site"}/templates?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          {children}
        </ClerkProvider>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </body>
    </html>
  );
}
