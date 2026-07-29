"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ChevronDown } from "lucide-react";
import { DEFAULT_SITE_CONFIG, type SiteConfigData } from "@/lib/site-config-defaults";

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
  initialBrand,
}: {
  initialLinks?: SiteConfigData["footerLinks"];
  initialContact?: SiteConfigData["footerContact"];
  initialBrand?: SiteConfigData["brand"];
}) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const brand = initialBrand || DEFAULT_SITE_CONFIG.brand;
  const contact = initialContact || DEFAULT_SITE_CONFIG.footerContact;
  const supportLinks = initialLinks?.support || DEFAULT_SITE_CONFIG.footerLinks.support;
  const policyLinks = initialLinks?.policies || DEFAULT_SITE_CONFIG.footerLinks.policies;
  const legalRows = [
    { label: "Đơn vị chủ quản", value: contact.legalName },
    { label: "Mã số thuế", value: contact.taxCode },
    { label: "Địa chỉ đăng ký", value: contact.registeredAddress },
  ].filter((row) => row.value.trim());
  const socialLinks = [
    { label: "TikTok", url: contact.tiktokUrl, icon: TikTokIcon },
    { label: "Facebook", url: contact.facebookUrl, icon: FacebookIcon },
    { label: "Instagram", url: contact.instagramUrl, icon: InstagramIcon },
  ].filter((item) => item.url.trim());

  return (
    <footer className="bg-[#fbfaf7] text-slate-900 border-t border-orange-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* CỘT 1 — THƯƠNG HIỆU */}
          <div className="lg:col-span-4 md:col-span-1 col-span-12 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-white p-1 rounded border border-orange-100 shadow-sm">
                <img src={brand.logoUrl} alt={brand.logoAlt} className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-base font-bold leading-tight text-slate-950">{brand.name}</p>
                <p className="text-xs text-slate-500 mt-1">{brand.tagline}</p>
              </div>
            </div>
            
            {legalRows.length > 0 && (
              <div className="space-y-2 text-xs leading-relaxed text-slate-600">
                {legalRows.map((row) => (
                  <p key={row.label}>
                    <span className="font-semibold text-slate-800">{row.label}:</span> {row.value}
                  </p>
                ))}
              </div>
            )}
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
                {supportLinks.map((link) => (
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
                {policyLinks.map((link) => (
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
              {socialLinks.map((s) => (
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

            {contact.boCongThuongUrl && contact.boCongThuongImageUrl && (
              <div className="pt-1">
                <a
                  href={contact.boCongThuongUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block group focus:outline-none"
                  aria-label="Đã thông báo Bộ Công Thương"
                >
                  <img
                    src={contact.boCongThuongImageUrl}
                    alt="Đã thông báo Bộ Công Thương"
                    className="h-10 w-auto object-contain"
                  />
                </a>
              </div>
            )}

          </div>

        </div>

        {/* THANH CUỐI FOOTER */}
        <div className="border-t border-orange-100 mt-10 pt-6 text-center">
          <p className="text-slate-500 text-xs font-medium">
            {contact.copyrightText}
          </p>
        </div>

      </div>
    </footer>
  );
}
