"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ChevronDown } from "lucide-react";

interface FooterLink {
  href: string;
  label: string;
}

interface FooterContact {
  phone?: string;
  email?: string;
  address?: string;
  workingHours?: string;
  shopeeUrl?: string;
  tiktokUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  boCongThuongUrl?: string;
}

const SUPPORT_LINKS = [
  { href: "/trang/huong-dan-mua-hang", label: "Hướng dẫn mua hàng" },
  { href: "/trang/tra-cuu-don-hang", label: "Tra cứu đơn hàng" },
  { href: "/trang/chinh-sach-giao-hang", label: "Chính sách giao hàng" },
  { href: "/trang/chinh-sach-doi-tra-va-hoan-tien", label: "Chính sách đổi trả và hoàn tiền" },
  { href: "/trang/tiep-nhan-phan-anh-khieu-nai", label: "Tiếp nhận phản ánh, khiếu nại" },
];

const POLICY_LINKS = [
  { href: "/trang/chinh-sach-thanh-toan", label: "Chính sách thanh toán" },
  { href: "/trang/chinh-sach-kiem-hang", label: "Chính sách kiểm hàng" },
  { href: "/trang/chinh-sach-bao-mat-thong-tin", label: "Chính sách bảo mật thông tin" },
  { href: "/trang/dieu-khoan-su-dung", label: "Điều khoản sử dụng" },
  { href: "/gioi-thieu/thong-tin-doanh-nghiep", label: "Thông tin doanh nghiệp" },
];

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    aria-hidden="true"
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.2 2.29 2.01 3.75 2.37v3.83c-1.85-.05-3.66-.69-5.12-1.84h-.04v8.32C16.5 21.6 12.3 24.36 8 23.35c-3.54-.83-6.14-4.22-5.98-7.98.17-3.92 3.19-7.23 7.07-7.73 1.05-.14 2.12-.05 3.15.22v3.74c-1.12-.39-2.37-.36-3.48.11-1.61.68-2.67 2.45-2.52 4.21.17 1.94 1.83 3.53 3.78 3.5 2.14.03 3.86-1.74 3.86-3.88V0l.66.02z" />
  </svg>
);

const FacebookIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    aria-hidden="true"
  >
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
  </svg>
);

const InstagramIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function Footer({
  initialLinks,
  initialContact,
}: {
  initialLinks?: { products?: FooterLink[]; explore?: FooterLink[] };
  initialContact?: FooterContact;
}) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const contact = {
    phone: initialContact?.phone || "0989 852 948",
    email: initialContact?.email || "cskh@ancungbatuyet.vn",
    address: initialContact?.address || "Xuân Phương, Hà Nội",
    workingHours: initialContact?.workingHours || "Thứ 2 – Thứ 7, 08:00 – 17:00",
    tiktokUrl: initialContact?.tiktokUrl || "https://tiktok.com/@batuyethanhvi",
    facebookUrl: initialContact?.facebookUrl || "https://facebook.com/ancungbatuyet",
    instagramUrl: initialContact?.instagramUrl || "https://instagram.com/ancungbatuyet",
    boCongThuongUrl: initialContact?.boCongThuongUrl || "",
  };

  return (
    <footer className="bg-[#fbfaf7] text-slate-900 border-t border-orange-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* CỘT 1 — THƯƠNG HIỆU */}
          <div className="lg:col-span-4 md:col-span-1 col-span-12 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-white p-1 rounded border border-orange-100 shadow-sm">
                <img src="/logo-acbt.png" alt="Ăn Cùng Bà Tuyết Logo" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-base font-bold leading-tight text-slate-950">Ăn Cùng Bà Tuyết</p>
                <p className="text-xs text-slate-500 mt-1">Ăn vặt thì phải Ăn Cùng Bà Tuyết</p>
              </div>
            </div>
            
            <div className="space-y-2 text-xs leading-relaxed text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">Đơn vị chủ quản:</span> [TÊN PHÁP LÝ DOANH NGHIỆP]
              </p>
              <p>
                <span className="font-semibold text-slate-800">Mã số thuế:</span> [MÃ SỐ THUẾ]
              </p>
              <p>
                <span className="font-semibold text-slate-800">Địa chỉ đăng ký:</span> [ĐỊA CHỈ DOANH NGHIỆP]
              </p>
            </div>
          </div>

          {/* CỘT 2 — HỖ TRỢ KHÁCH HÀNG */}
          <div className="lg:col-span-3 md:col-span-1 col-span-12 border-b border-orange-100 md:border-b-0 pb-4 md:pb-0">
            <h3 className="hidden md:block font-bold text-xs uppercase tracking-wider text-slate-800 mb-4">
              Hỗ trợ khách hàng
            </h3>
            <button
              onClick={() => toggleSection("support")}
              className="md:hidden flex items-center justify-between w-full text-left font-bold text-xs uppercase tracking-wider text-slate-800 py-3 focus:outline-none"
              aria-expanded={openSection === "support"}
              aria-controls="footer-support-nav"
              style={{ minHeight: "44px" }}
            >
              <span>Hỗ trợ khách hàng</span>
              <ChevronDown
                size={16}
                className={`text-slate-500 transition-transform duration-200 ${
                  openSection === "support" ? "rotate-180" : ""
                }`}
              />
            </button>

            <nav id="footer-support-nav" className={`md:block ${openSection === "support" ? "block" : "hidden"}`}>
              <ul className="space-y-1 mt-2 md:mt-0">
                {SUPPORT_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 hover:text-[#FF7A1A] hover:translate-x-1 transition-all duration-200 py-2 md:py-1.5 flex items-center min-h-[44px] md:min-h-0"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* CỘT 3 — CHÍNH SÁCH */}
          <div className="lg:col-span-2 md:col-span-1 col-span-12 border-b border-orange-100 md:border-b-0 pb-4 md:pb-0">
            <h3 className="hidden md:block font-bold text-xs uppercase tracking-wider text-slate-800 mb-4">
              Chính sách
            </h3>
            <button
              onClick={() => toggleSection("policy")}
              className="md:hidden flex items-center justify-between w-full text-left font-bold text-xs uppercase tracking-wider text-slate-800 py-3 focus:outline-none"
              aria-expanded={openSection === "policy"}
              aria-controls="footer-policy-nav"
              style={{ minHeight: "44px" }}
            >
              <span>Chính sách</span>
              <ChevronDown
                size={16}
                className={`text-slate-500 transition-transform duration-200 ${
                  openSection === "policy" ? "rotate-180" : ""
                }`}
              />
            </button>

            <nav id="footer-policy-nav" className={`md:block ${openSection === "policy" ? "block" : "hidden"}`}>
              <ul className="space-y-1 mt-2 md:mt-0">
                {POLICY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 hover:text-[#FF7A1A] hover:translate-x-1 transition-all duration-200 py-2 md:py-1.5 flex items-center min-h-[44px] md:min-h-0"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* CỘT 4 — LIÊN HỆ */}
          <div className="lg:col-span-3 md:col-span-1 col-span-12 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              Liên hệ
            </h3>
            <address className="not-italic">
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <Phone size={16} className="text-[#FF7A1A] mt-0.5 shrink-0" aria-hidden="true" />
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                    className="hover:text-[#FF7A1A] transition-colors duration-200 py-1 flex items-center min-h-[44px] md:min-h-0"
                    aria-label={`Hotline: ${contact.phone}`}
                  >
                    {contact.phone}
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail size={16} className="text-[#FF7A1A] mt-0.5 shrink-0" aria-hidden="true" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:text-[#FF7A1A] transition-colors duration-200 py-1 flex items-center min-h-[44px] md:min-h-0"
                    aria-label={`Email: ${contact.email}`}
                  >
                    {contact.email}
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-[#FF7A1A] mt-0.5 shrink-0" aria-hidden="true" />
                  <span className="leading-tight">{contact.address}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock size={16} className="text-[#FF7A1A] mt-0.5 shrink-0" aria-hidden="true" />
                  <span className="leading-tight">{contact.workingHours}</span>
                </li>
              </ul>
            </address>

            {/* Mạng xã hội */}
            <div className="flex gap-2.5 pt-1">
              {[
                {
                  label: "TikTok",
                  url: contact.tiktokUrl,
                  icon: TikTokIcon,
                },
                {
                  label: "Facebook",
                  url: contact.facebookUrl,
                  icon: FacebookIcon,
                },
                {
                  label: "Instagram",
                  url: contact.instagramUrl,
                  icon: InstagramIcon,
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 md:w-10 md:h-10 rounded border border-orange-100 bg-[#fffaf3] text-slate-700 flex items-center justify-center transition-all duration-200 hover:bg-[#FF7A1A] hover:text-white hover:border-transparent shadow-sm"
                  aria-label={s.label}
                  title={s.label}
                >
                  <s.icon size={18} />
                </a>
              ))}
            </div>

            {/* BỘ CÔNG THƯƠNG LOGO PLACEHOLDER */}
            <div className="pt-1">
              {contact.boCongThuongUrl ? (
                <a
                  href={contact.boCongThuongUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block group focus:outline-none"
                  aria-label="Đã thông báo Bộ Công Thương"
                >
                  <img
                    src="/bo-cong-thuong.png"
                    alt="Đã thông báo Bộ Công Thương"
                    className="h-10 w-auto object-contain"
                  />
                </a>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#fffaf3] border border-dashed border-orange-200 text-slate-500 max-w-[200px] shadow-sm">
                  <svg className="w-4 h-4 shrink-0 opacity-60 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <div className="text-left leading-tight">
                    <span className="text-[8px] block uppercase font-bold text-slate-400">[Chờ xác thực]</span>
                    <span className="text-[9px] block font-black uppercase text-slate-500">Bộ Công Thương</span>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* THANH CUỐI FOOTER */}
        <div className="border-t border-orange-100 mt-10 pt-6 text-center">
          <p className="text-slate-500 text-xs font-medium">
            © 2026 Ăn Cùng Bà Tuyết. Bảo lưu mọi quyền.
          </p>
        </div>

      </div>
    </footer>
  );
}
