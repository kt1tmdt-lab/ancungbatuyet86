import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">BT</span>
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
              {[
                { href: "/san-pham/chan-ga", label: "Chân Gà Rút Xương" },
                { href: "/san-pham/tam-cay", label: "Tăm Cay" },
                { href: "/san-pham/banh-trang", label: "Snack Bánh Tráng" },
                { href: "/san-pham/bo-suu-tap", label: "Sản Phẩm Khác" },
              ].map((link) => (
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
              {[
                { href: "/quy-trinh", label: "Quy trình sản xuất" },
                { href: "/he-thong-ban", label: "Hệ thống điểm bán" },
                { href: "/gioi-thieu", label: "Về chúng tôi" },
                { href: "/tin-tuc", label: "Tin tức" },
                { href: "/lien-he", label: "Liên hệ" },
              ].map((link) => (
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
                <a href="tel:0989852948" className="text-gray-400 hover:text-white text-sm">0989 852 948</a>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="text-primary-light mt-0.5 shrink-0" />
                <a href="mailto:ancungbatuyet@gmail.com" className="text-gray-400 hover:text-white text-sm">
                  ancungbatuyet@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-primary-light mt-0.5 shrink-0" />
                <span className="text-gray-400 text-sm">Thái Nguyên, Việt Nam</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={16} className="text-primary-light mt-0.5 shrink-0" />
                <span className="text-gray-400 text-sm">T2 - T7: 8:00 - 17:00</span>
              </li>
            </ul>

            <div className="flex gap-3 mt-6">
              {[
                { label: "TikTok", url: "https://tiktok.com/@batuyethanhvi" },
                { label: "Facebook", url: "https://facebook.com/ancungbatuyet" },
                { label: "Shopee", url: "https://shopee.vn/nmtvlog99" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold hover:bg-primary transition-colors"
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
