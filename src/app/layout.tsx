import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const font = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
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
    <html lang="vi" className={`${font.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col font-sans bg-cream text-gray-900 antialiased">
        <Navbar />
        <main className="flex-1 pt-16 lg:pt-18">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
