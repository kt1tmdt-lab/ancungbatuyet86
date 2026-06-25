"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ABOUT_TABS = [
  { href: "/gioi-thieu", label: "Giới thiệu chung" },
  { href: "/gioi-thieu/lich-su", label: "Lịch sử phát triển" },
  { href: "/gioi-thieu/thanh-tuu", label: "Thành tựu & Uy tín" },
  { href: "/gioi-thieu/cong-dong", label: "Cộng đồng" },
];

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-[#fbf7ef] min-h-screen text-slate-950">
      {/* Sub-navigation Tabs */}
      <div className="sticky top-16 lg:top-18 bg-[#fbf7ef]/90 backdrop-blur-md border-b border-orange-100 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto gap-2 sm:gap-6 py-3.5 justify-center no-scrollbar">
            {ABOUT_TABS.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`px-4 py-2 text-xs sm:text-sm font-black uppercase tracking-wider transition-all whitespace-nowrap border-b-2 ${
                    isActive
                      ? "border-orange-600 text-orange-600"
                      : "border-transparent text-slate-500 hover:text-orange-600"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Page Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
