import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

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
  { href: "/san-pham/chan-ga", label: "Chân Gà Rút Xương" },
  { href: "/san-pham/tam-cay", label: "Tăm Cay" },
  { href: "/san-pham/banh-trang", label: "Snack Bánh Tráng" },
  { href: "/san-pham/bo-suu-tap", label: "Sản Phẩm Khác" },
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
    email: initialContact?.email || "ancungbatuyet@gmail.com",
    address: initialContact?.address || "Thái Nguyên, Việt Nam",
    workingHours: initialContact?.workingHours || "T2 - T7: 8:00 - 17:00",
    shopeeUrl: initialContact?.shopeeUrl || "https://shopee.vn/nmtvlog99",
    tiktokUrl: initialContact?.tiktokUrl || "https://tiktok.com/@batuyethanhvi",
    facebookUrl: initialContact?.facebookUrl || "https://facebook.com/ancungbatuyet",
  };

  return (
    <footer className="bg-neutral text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 overflow-hidden rounded-full border border-slate-800 flex items-center justify-center bg-white shadow-sm">
                <img src="/logo-acbt.png" alt="Ăn Cùng Bà Tuyết Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-sm leading-tight">Ăn Cùng</p>
                <p className="font-bold text-primary-light text-sm leading-tight">Bà Tuyết</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Thương hiệu đồ ăn vặt sạch hàng đầu Việt Nam. Ăn vặt thì phải ăn cùng Bà Tuyết.
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
                { label: "TikTok", url: contact.tiktokUrl },
                { label: "Facebook", url: contact.facebookUrl },
                { label: "Shopee", url: contact.shopeeUrl },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-none bg-white/10 flex items-center justify-center text-xs font-bold hover:bg-primary transition-colors"
                >
                  {s.label[0]}
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
