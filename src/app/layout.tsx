import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import MainLayoutWrapper from "@/components/layout/MainLayoutWrapper";
import { AuthProvider } from "@/lib/auth-context";
import AnalyticsTracker from "@/components/layout/AnalyticsTracker";

const font = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ăn Cùng Bà Tuyết — Đồ ăn vặt sạch hàng đầu Việt Nam",
    template: "%s | Ăn Cùng Bà Tuyết",
  },
  description:
    "Thương hiệu đồ ăn vặt sạch hàng đầu Việt Nam. Chân gà rút xương, tăm cay, snack bánh tráng — nguyên liệu sạch, không chất bảo quản.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${font.variable} scroll-smooth`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans bg-cream text-gray-900 antialiased" suppressHydrationWarning>
        <AuthProvider>
          <AnalyticsTracker />
          <MainLayoutWrapper>{children}</MainLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
