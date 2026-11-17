/** Kiểu dữ liệu cho các trang văn bản pháp lý song ngữ (/privacy-policy, /terms). */

export type LegalBlock = string | { list: string[] };

export type LegalSection = {
  /** Tiêu đề mục, hiển thị in đậm. Bỏ trống nếu đoạn không có tiêu đề. */
  heading?: string;
  /** Mỗi phần tử là một đoạn văn, hoặc { list: [...] } cho danh sách gạch đầu dòng. */
  blocks: LegalBlock[];
};

export type LegalDocument = {
  /** Tên văn bản ở đầu mỗi bản ngôn ngữ, ví dụ "Privacy Policy – ACBT Data Hub and acbt.vn". */
  title?: string;
  /** Dòng phụ dưới tiêu đề ngôn ngữ, ví dụ "Last updated: ...". Giữ đúng như văn bản gốc. */
  intro?: string[];
  sections: LegalSection[];
};

export type BilingualLegalDocument = {
  en: LegalDocument;
  vi: LegalDocument;
};

export const CONTACT_EMAIL = "gdtruyenthong@acbt.vn";

/** Link pháp lý luôn có trong mục "Chính sách" ở footer, kể cả khi admin tự cấu hình danh sách. */
export const REQUIRED_POLICY_LINKS = [
  { href: "/privacy-policy", label: "Chính sách bảo mật" },
  { href: "/terms", label: "Điều khoản sử dụng" },
];
