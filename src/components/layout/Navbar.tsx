"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button";

const DEFAULT_NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/quy-trinh", label: "Quy trình" },
  { href: "/he-thong-ban", label: "Hệ thống bán" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/lien-he", label: "Liên hệ" },
];

export default function Navbar({ initialLinks }: { initialLinks?: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const navLinks = Array.isArray(initialLinks) && initialLinks.length > 0 ? initialLinks : DEFAULT_NAV_LINKS;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 overflow-hidden rounded-full border border-slate-100 flex items-center justify-center bg-white shadow-sm">
              <img src="/logo-acbt.png" alt="Ăn Cùng Bà Tuyết Logo" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-neutral text-sm leading-tight">Ăn Cùng</p>              <p className="font-bold text-primary text-sm leading-tight">Bà Tuyết</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-none text-sm font-medium transition-colors ${isActive
                    ? "bg-primary-light text-primary-dark"
                    : "text-gray-600 hover:bg-primary-light hover:text-primary-dark"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              href="tel:0989852948"
              variant="primary"
              size="sm"
              className="hidden md:flex"
              leftIcon={<Phone size={14} />}
            >
              0989 852 948
            </Button>

            <button
              onClick={() => setOpen(!open)}
              className="acbt-icon-btn lg:hidden p-2 text-slate-700 hover:bg-primary-light hover:text-primary-dark"
              aria-label="Menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-none text-base font-medium transition-colors ${isActive ? "bg-primary-light text-primary-dark" : "text-gray-600 hover:bg-primary-light"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Button
              href="tel:0989852948"
              variant="primary"
              size="lg"
              className="mt-2 w-full"
              leftIcon={<Phone size={16} />}
            >
              0989 852 948
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

