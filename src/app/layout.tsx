import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import MainLayoutWrapper from "@/components/layout/MainLayoutWrapper";
import { AuthProvider } from "@/lib/auth-context";
import AnalyticsTracker from "@/components/layout/AnalyticsTracker";
import { getSiteConfig } from "@/lib/site-config";
import { keywordsToArray } from "@/lib/site-config-defaults";

const mulish = Mulish({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-mulish",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();

  return {
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
      className={`scroll-smooth ${mulish.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className="min-h-screen flex flex-col font-sans bg-cream text-gray-900 antialiased"
        suppressHydrationWarning
      >
        <AuthProvider>
          <AnalyticsTracker />
          <MainLayoutWrapper initialConfig={config}>{children}</MainLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
