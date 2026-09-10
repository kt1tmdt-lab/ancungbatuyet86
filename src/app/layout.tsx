import type { Metadata } from "next";
import "./globals.css";
import MainLayoutWrapper from "@/components/layout/MainLayoutWrapper";
import { AuthProvider } from "@/lib/auth-context";
import AnalyticsTracker from "@/components/layout/AnalyticsTracker";
import GoogleAnalytics from "@/components/layout/GoogleAnalytics";
import { getSiteConfig } from "@/lib/site-config";
import { keywordsToArray } from "@/lib/site-config-defaults";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://acbt.vn";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: config.seo.title,
      template: `%s | ${config.seo.title}`,
    },
    description: config.seo.description,
    keywords: keywordsToArray(config.seo.keywords),
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const config = await getSiteConfig();

  return (
    <html
      lang="vi"
      className="scroll-smooth"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className="min-h-screen flex flex-col font-sans bg-cream text-gray-900 antialiased"
        suppressHydrationWarning
      >
        <GoogleAnalytics
          measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-T551F0HFS0"}
        />
        <AuthProvider>
          <AnalyticsTracker />
          <MainLayoutWrapper initialConfig={config}>{children}</MainLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
