import type { Metadata } from "next";
import LegalDocumentPage from "@/components/pages/LegalDocumentPage";
import privacyPolicy from "@/content/legal/privacy-policy";

// Trang công khai cho kiểm duyệt (TikTok...) truy cập, luôn dựng sẵn thành HTML tĩnh.
export const dynamic = "force-static";

const TITLE = "Privacy Policy | Ăn Cùng Bà Tuyết";
const DESCRIPTION =
  "Privacy Policy of Ăn Cùng Bà Tuyết – how we collect, use and protect your personal information. Chính sách bảo mật của Ăn Cùng Bà Tuyết.";
const URL = "https://acbt.vn/privacy-policy";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: "Ăn Cùng Bà Tuyết",
    images: [{ url: "https://acbt.vn/logo-acbt.png", width: 1080, height: 1080, alt: "Logo Ăn Cùng Bà Tuyết" }],
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return <LegalDocumentPage title="Privacy Policy" subtitle="Chính sách bảo mật" content={privacyPolicy} />;
}
