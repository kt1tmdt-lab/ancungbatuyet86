import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cẩm nang KOL — ACBT × Food Fest",
  description: "Cẩm nang KOL/KOC — Ăn Cùng Bà Tuyết tại TikTok Food Fest 2026",
  alternates: {
    canonical: "https://acbt.vn/tiktok-food-fest",
  },
  openGraph: {
    title: "Cẩm nang KOL — ACBT × Food Fest",
    description: "Cẩm nang KOL/KOC — Ăn Cùng Bà Tuyết tại TikTok Food Fest 2026",
    url: "https://acbt.vn/tiktok-food-fest",
    siteName: "Ăn Cùng Bà Tuyết",
    images: [
      {
        url: "https://acbt.vn/tiktok-food-fest/images/event-intro.png",
        width: 1200,
        height: 630,
        alt: "TikTok Food Fest 2026 — Ăn Cùng Bà Tuyết",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export default function TikTokFoodFestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
