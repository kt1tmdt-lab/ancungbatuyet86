import Link from "next/link";
import { MessageCircle, Phone, Mail, MapPin, Clock, ShoppingBag, Music2 } from "lucide-react";

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
}

const DEFAULT_FOOTER_EXPLORE = [
  { href: "/quy-trinh", label: "Quy trình sản xuất" },
  { href: "/he-thong-ban", label: "Hệ thống điểm bán" },
  { href: "/gioi-thieu", label: "Về chúng tôi" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/lien-he", label: "Liên hệ" },
];

const DEFAULT_FOOTER_PRODUCTS = [
  { href: "/san-pham/chan-ga-rut-xuong", label: "Chân gà rút xương" },
  { href: "/san-pham/chan-ga-khong-lo", label: "Chân gà khổng lồ" },
  { href: "/san-pham/tam-cay", label: "Tăm cay" },
  { href: "/san-pham/snack-banh-trang", label: "Snack" },
  { href: "/san-pham/banh-trang", label: "Bánh tráng" },
  { href: "/san-pham/bo-suu-tap", label: "Sản phẩm khác" },
];

export default function Footer({
  initialLinks,
  initialContact,
}: {
  initialLinks?: { products?: FooterLink[]; explore?: FooterLink[] };
  initialContact?: FooterContact;
}) {
  const productLinks = initialLinks?.products || DEFAULT_FOOTER_PRODUCTS;
  const exploreLinks = initialLinks?.explore || DEFAULT_FOOTER_EXPLORE;

  const contact = {
    phone: initialContact?.phone || "0989 852 948",
    email: initialContact?.email || "cskh@ancungbatuyet.vn",
    address: initialContact?.address || "Xuân Phương, Hà Nội",
    workingHours: initialContact?.workingHours || "T2 - T7: 8:00 - 17:00",
    shopeeUrl: initialContact?.shopeeUrl || "https://shopee.vn/an-vat-ba-tuyet-tam-cay",
    tiktokUrl: initialContact?.tiktokUrl || "https://tiktok.com/@batuyethanhvi",
    facebookUrl: initialContact?.facebookUrl || "https://facebook.com/ancungbatuyet",
  };

  return (
    <footer className="bg-neutral text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="mb-4 flex flex-nowrap items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-visible bg-white">
                <img src="/logo-acbt.png" alt="Ăn Cùng Bà Tuyết Logo" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0">
                <p className="shrink-0 whitespace-nowrap text-base font-black leading-tight text-primary-light">Ăn Cùng Bà Tuyết</p>
              </div>
            </div>
            <p className="text-gray-300 text-base font-black leading-relaxed">
              Ăn vặt thì phải Ăn Cùng Bà Tuyết
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">Sản phẩm</h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">Khám phá</h3>
            <ul className="space-y-2">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone size={16} className="text-primary-light mt-0.5 shrink-0" />
                <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="text-gray-400 hover:text-white text-sm">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="text-primary-light mt-0.5 shrink-0" />
                <a href={`mailto:${contact.email}`} className="text-gray-400 hover:text-white text-sm">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-primary-light mt-0.5 shrink-0" />
                <span className="text-gray-400 text-sm">{contact.address}</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={16} className="text-primary-light mt-0.5 shrink-0" />
                <span className="text-gray-400 text-sm">{contact.workingHours}</span>
              </li>
            </ul>

            <div className="flex gap-3 mt-6">
              {[
                { label: "TikTok", url: contact.tiktokUrl, icon: Music2 },
                { label: "Facebook", url: contact.facebookUrl, icon: MessageCircle },
                { label: "Shopee", url: contact.shopeeUrl, icon: ShoppingBag },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-none bg-white/10 flex items-center justify-center text-xs font-bold hover:bg-primary transition-colors"
                  aria-label={s.label}
                  title={s.label}
                >
                  <s.icon size={17} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm">© 2026 Ăn Cùng Bà Tuyết. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
