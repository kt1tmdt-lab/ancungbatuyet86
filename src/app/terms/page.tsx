import type { Metadata } from "next";
import LegalDocumentPage from "@/components/pages/LegalDocumentPage";
import terms from "@/content/legal/terms";

// Trang công khai cho kiểm duyệt (TikTok...) truy cập, luôn dựng sẵn thành HTML tĩnh.
export const dynamic = "force-static";

const TITLE = "Terms of Service | Ăn Cùng Bà Tuyết";
const DESCRIPTION =
  "Terms of Service for using the Ăn Cùng Bà Tuyết website and services. Điều khoản sử dụng website và dịch vụ của Ăn Cùng Bà Tuyết.";
const URL = "https://acbt.vn/terms";

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

export default function TermsPage() {
  return <LegalDocumentPage title="Terms of Service" subtitle="Điều khoản sử dụng" content={terms} />;
}
