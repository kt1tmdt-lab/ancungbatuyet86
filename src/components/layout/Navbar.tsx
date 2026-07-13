"use client";

import Link from "next/link";
import Script from "next/script";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Menu, Phone, Search, X, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { DEFAULT_SITE_CONFIG, REQUIRED_NAV_LINKS, type SiteConfigData } from "@/lib/site-config-defaults";

const DEFAULT_NAV_LINKS = REQUIRED_NAV_LINKS;
const HEADER_NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/chat-luong", label: "Chất lượng" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/diem-ban", label: "Điểm bán" },
  { href: "/hop-tac", label: "Hợp tác" },
  { href: "/lien-he", label: "Liên hệ" },
];
export const LEGACY_NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/chat-luong", label: "Chất lượng" },
  { href: "/diem-ban", label: "Điểm bán" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/hop-tac", label: "Hợp tác" },
  { href: "/lien-he", label: "Liên hệ" },
];

type SearchResult = {
  title: string;
  description: string;
  href: string;
  type: "page" | "product" | "post" | "location" | "channel";
};

type HeaderProduct = {
  id: string;
  name: string;
  slug: string;
  category?: string | null;
  categoryLabel?: string | null;
  tagline?: string | null;
};

const RESULT_TYPE_LABEL: Record<SearchResult["type"], string> = {
  page: "Trang",
  product: "Sản phẩm",
  post: "Tin tức",
  location: "Điểm bán",
  channel: "Kênh bán",
};

const PRODUCT_MENU_LINKS = [
  { href: "/san-pham/chan-ga-rut-xuong", label: "Chân gà rút xương", note: "Dòng chủ lực" },
  { href: "/san-pham/chan-ga-khong-lo", label: "Chân gà khổng lồ", note: "Sản phẩm nổi bật" },
  { href: "/san-pham/tam-cay", label: "Tăm cay", note: "Dòng bán chạy" },
  { href: "/san-pham/snack-banh-trang", label: "Snack / Bánh tráng", note: "Đóng gói tiện lợi" },
];

type NavLinkItem = { href: string; label: string };

type HeaderSubmenu = {
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  overviewHref?: string;
  links: Array<{ href: string; label: string; note?: string }>;
};

function normalizeMenuText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function menuIdentity(link: NavLinkItem) {
  return normalizeMenuText(`${link.label} ${link.href}`);
}

function getHeaderSubmenu(
  link: NavLinkItem,
  productMenuLinks: SiteConfigData["productMenuLinks"],
): HeaderSubmenu | null {
  const identity = menuIdentity(link);

  if (link.href === "/gioi-thieu") {
    return null;
  }

  if (link.href === "/chat-luong") return null;

  if (link.href === "/diem-ban") {
    return {
      eyebrow: "Điểm bán",
      title: "Kênh phân phối",
      description: "Nơi mua chính thức và cách nhận diện hàng chính hãng.",
      accent: "04",
      overviewHref: "/diem-ban",
      links: [
        { href: "/diem-ban/he-thong-diem-ban-offline", label: "Hệ thống điểm bán offline", note: "Cửa hàng, đại lý và khu vực phân phối" },
        { href: "/diem-ban/kenh-online-chinh-thuc", label: "Kênh online chính thức", note: "Sàn TMĐT và kênh bán công bố" },
        { href: "/diem-ban/nhan-dien-hang-chinh-hang", label: "Nhận diện hàng chính hãng", note: "Tem nhãn, bao bì và nguồn mua" },
      ],
    };
  }

  if (link.href === "/hop-tac") {
    return {
      eyebrow: "Hợp tác",
      title: "Kết nối đối tác",
      description: "Thông tin dành cho đại lý, nhà phân phối và đối tác truyền thông.",
      accent: "05",
      overviewHref: "/hop-tac",
      links: [
        { href: "/hop-tac/dai-ly-nha-phan-phoi", label: "Trở thành Đại lý/Nhà phân phối", note: "Gửi thông tin hợp tác kinh doanh" },
        { href: "/hop-tac/truyen-thong", label: "Hợp tác truyền thông", note: "PR, báo chí, KOL/KOC và cộng đồng" },
      ],
    };
  }

  if (link.href === "/san-pham") {
    return {
      eyebrow: "Sản phẩm",
      title: "Danh mục sản phẩm",
      description: "Các dòng sản phẩm chính đang được giới thiệu trên website.",
      accent: "03",
      overviewHref: "/san-pham",
      links: [
        ...(productMenuLinks.length
          ? productMenuLinks.map((item) => ({ href: item.href, label: item.label, note: item.note }))
          : [
              { href: "/san-pham/chan-ga-rut-xuong", label: "Chân gà Bà Tuyết", note: "Dòng sản phẩm chủ lực" },
              { href: "/san-pham/tam-cay", label: "Tăm cay Bà Tuyết", note: "Dòng snack cay" },
              { href: "/san-pham/snack-banh-trang", label: "Snack Bánh tráng", note: "Đóng gói tiện lợi" },
            ]),
        { href: "/san-pham/bo-suu-tap", label: "Sản phẩm khác", note: "Các dòng bổ sung" },
      ],
    };
  }

  if (link.href === "/gioi-thieu" || identity.includes("gioi thieu")) {
    return null;
  }

  if (link.href === "/chat-luong" || identity.includes("chat luong")) return null;

  if (link.href === "/san-pham" || identity.includes("san pham")) {
    return {
      eyebrow: "Danh mục",
      title: "Sản phẩm",
      description: "Các dòng sản phẩm đại diện đang được giới thiệu trên website.",
      accent: "03",
      links: [
        ...(productMenuLinks.length
          ? productMenuLinks.map((item) => ({ href: item.href, label: item.label, note: item.note }))
          : PRODUCT_MENU_LINKS),
        { href: "/san-pham/bo-suu-tap", label: "Sản phẩm khác", note: "Các dòng bổ sung" },
      ],
    };
  }

  if (link.href === "/diem-ban" || identity.includes("diem ban")) {
    return {
      eyebrow: "Điểm bán",
      title: "Hệ thống phân phối",
      description: "Nơi khách hàng nhận diện kênh chính thức và tìm thông tin phân phối.",
      accent: "04",
      overviewHref: "/diem-ban",
      links: [
        { href: "/diem-ban/he-thong-diem-ban-offline", label: "Hệ thống điểm bán offline", note: "Điểm bán và khu vực phân phối" },
        { href: "/diem-ban/kenh-online-chinh-thuc", label: "Kênh online chính thức", note: "Các kênh thương mại điện tử" },
        { href: "/diem-ban/nhan-dien-hang-chinh-hang", label: "Nhận diện hàng chính hãng", note: "Dấu hiệu và thông tin cần kiểm tra" },
      ],
    };
  }

  if (identity.includes("hop tac")) {
    return {
      eyebrow: "Kết nối",
      title: "Hợp tác",
      description: "Thông tin dành cho đại lý, nhà phân phối, truyền thông và khách hàng cần hỗ trợ.",
      accent: "05",
      overviewHref: "/hop-tac",
      links: [
        { href: "/hop-tac/dai-ly-nha-phan-phoi", label: "Trở thành Đại lý/Nhà phân phối", note: "Gửi thông tin hợp tác kinh doanh" },
        { href: "/hop-tac/truyen-thong", label: "Hợp tác truyền thông", note: "Liên hệ PR, báo chí và cộng đồng" },
        { href: "/lien-he", label: "Liên hệ hỗ trợ khách hàng", note: "Gửi phản hồi hoặc yêu cầu hỗ trợ" },
      ],
    };
  }

  return null;
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement?: new (
          options: Record<string, unknown>,
          elementId: string,
        ) => void;
      };
    };
  }
}

function mergeRequiredNavLinks(links: { href: string; label: string }[] | undefined) {
  if (!Array.isArray(links) || links.length === 0) return DEFAULT_NAV_LINKS;

  const configuredLinks = links.filter((item) => item.href && item.label);
  const configuredHrefs = new Set(configuredLinks.map((item) => item.href));
  const missingRequiredLinks = DEFAULT_NAV_LINKS.filter((item) => !configuredHrefs.has(item.href));

  return [...configuredLinks, ...missingRequiredLinks];
}

type LanguageCode = "vi" | "en";

const LANGUAGE_OPTIONS: { code: LanguageCode; label: string; shortLabel: string }[] = [
  { code: "vi", label: "Vietnamese", shortLabel: "VN" },
  { code: "en", label: "English", shortLabel: "EN" },
];

function VnFlag({ className = "w-4 h-3" }: { className?: string }) {
  return (
    <span className={`${className} inline-flex overflow-hidden border border-slate-200 shadow-sm`}>
      <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <rect width="30" height="20" fill="#da251d"/>
      <polygon points="15,4 16.17,7.62 20,7.62 16.9,9.88 18.07,13.5 15,11.25 11.93,13.5 13.1,9.88 10,7.62 13.83,7.62" fill="#ffff00"/>
      </svg>
    </span>
  );
}

function EnFlag({ className = "w-4 h-3" }: { className?: string }) {
  return (
    <span className={`${className} inline-flex overflow-hidden border border-slate-200 shadow-sm`}>
      <svg viewBox="0 0 50 30" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <rect width="50" height="30" fill="#012169"/>
      <path d="M0,0 L50,30 M50,0 L0,30" stroke="#fff" stroke-width="6"/>
      <path d="M0,0 L50,30 M50,0 L0,30" stroke="#c8102e" stroke-width="2"/>
      <path d="M25,0 v30 M0,15 h50" stroke="#fff" stroke-width="10"/>
      <path d="M25,0 v30 M0,15 h50" stroke="#c8102e" stroke-width="6"/>
      </svg>
    </span>
  );
}

function LanguageFlag({ code, className }: { code: LanguageCode; className?: string }) {
  if (code === "en") return <EnFlag className={className} />;
  return <VnFlag className={className} />;
}

function setTranslateCookie(language: LanguageCode) {
  const value = `/vi/${language}`;
  const maxAge = "Max-Age=31536000";

  document.cookie = `googtrans=${value}; Path=/; ${maxAge}`;

  const host = window.location.hostname;
  document.cookie = `googtrans=${value}; Domain=${host}; Path=/; ${maxAge}`;

  if (host.includes(".")) {
    document.cookie = `googtrans=${value}; Domain=.${host}; Path=/; ${maxAge}`;
    const parts = host.split(".");
    if (parts.length > 2) {
      const baseDomain = "." + parts.slice(-2).join(".");
      document.cookie = `googtrans=${value}; Domain=${baseDomain}; Path=/; ${maxAge}`;
    }
  }

  // Double down on vi: attempt to delete the cookie too just in case
  if (language === "vi") {
    const expire = "Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0";
    document.cookie = `googtrans=; Path=/; ${expire}`;
    document.cookie = `googtrans=; Domain=${host}; Path=/; ${expire}`;
    if (host.includes(".")) {
      document.cookie = `googtrans=; Domain=.${host}; Path=/; ${expire}`;
      const parts = host.split(".");
      if (parts.length > 2) {
        const baseDomain = "." + parts.slice(-2).join(".");
        document.cookie = `googtrans=; Domain=${baseDomain}; Path=/; ${expire}`;
      }
    }
  }
}

function SearchDialog({
  open,
  query,
  results,
  loading,
  error,
  onClose,
  onQueryChange,
  onSubmit,
}: {
  open: boolean;
  query: string;
  results: SearchResult[];
  loading: boolean;
  error: string;
  onClose: () => void;
  onQueryChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(focusTimer);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  const showEmpty = query.trim().length >= 2 && !loading && !error && results.length === 0;

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/45 px-4 py-5 backdrop-blur-sm sm:py-10">
      <div className="mx-auto max-w-2xl overflow-hidden bg-white shadow-2xl">
        <form onSubmit={onSubmit} className="flex items-center gap-3 border-b border-orange-100 p-4">
          <Search size={20} className="shrink-0 text-orange-600" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Tìm sản phẩm, tin tức, điểm bán..."
            className="min-w-0 flex-1 bg-transparent text-base font-semibold text-slate-900 outline-none placeholder:text-slate-400"
          />
          {loading && <Loader2 size={18} className="animate-spin text-orange-600" />}
          <button
            type="button"
            onClick={onClose}
            className="acbt-icon-btn p-2 text-slate-500 hover:bg-orange-50 hover:text-orange-700"
            aria-label="Đóng tìm kiếm"
          >
            <X size={20} />
          </button>
        </form>

        <div className="max-h-[70vh] overflow-y-auto p-3">
          {query.trim().length < 2 && (
            <div className="px-4 py-8 text-sm font-medium text-slate-500">
              Nhập ít nhất 2 ký tự để tìm trên toàn website.
            </div>
          )}

          {error && (
            <div className="bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {showEmpty && (
            <div className="px-4 py-8 text-sm font-medium text-slate-500">
              Không tìm thấy kết quả phù hợp.
            </div>
          )}

          {results.length > 0 && (
            <div className="grid gap-2">
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.href}-${result.title}`}
                  href={result.href}
                  onClick={onClose}
                  className="group block border border-transparent p-4 transition hover:border-orange-200 hover:bg-orange-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-950 group-hover:text-orange-700">
                        {result.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-slate-500">
                        {result.description}
                      </p>
                    </div>
                    <span className="shrink-0 bg-slate-100 px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500 group-hover:bg-white group-hover:text-orange-700">
                      {RESULT_TYPE_LABEL[result.type]}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Navbar({
  initialLinks,
  initialContact,
  initialProductMenuLinks,
}: {
  initialLinks?: { href: string; label: string }[];
  initialContact?: SiteConfigData["footerContact"];
  initialProductMenuLinks?: SiteConfigData["productMenuLinks"];
}) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [language, setLanguage] = useState<LanguageCode>("vi");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);
  const [currentProductMenuLinks, setCurrentProductMenuLinks] = useState<SiteConfigData["productMenuLinks"]>([]);
  const [productMenuLoaded, setProductMenuLoaded] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedLanguage = window.localStorage.getItem("acbt-language");
      if (savedLanguage === "en" || savedLanguage === "vi") {
        setLanguage(savedLanguage);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);
  const navLinks = HEADER_NAV_LINKS;
  const productMenuLinks = currentProductMenuLinks.length
    ? currentProductMenuLinks
    : productMenuLoaded
      ? []
    : initialProductMenuLinks?.length
      ? initialProductMenuLinks
      : PRODUCT_MENU_LINKS;
  const phone = initialContact?.phone || DEFAULT_SITE_CONFIG.footerContact.phone;
  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;
  const trimmedSearchQuery = useMemo(() => searchQuery.trim(), [searchQuery]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/products", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Products request failed");
        return response.json() as Promise<HeaderProduct[] | { data?: HeaderProduct[] }>;
      })
      .then((data) => {
        const products = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
            ? data.data
            : [];
        const productsByHref = new Map(products.map((product) => [`/san-pham/${product.slug}`, product]));
        const selectedProducts = initialProductMenuLinks?.length
          ? initialProductMenuLinks
              .map((item) => {
                const product = productsByHref.get(item.href);
                return product
                  ? {
                      href: `/san-pham/${product.slug}`,
                      label: product.name,
                      note: item.note || product.categoryLabel || product.category || product.tagline || "Sản phẩm hiện tại",
                    }
                  : null;
              })
              .filter((item): item is SiteConfigData["productMenuLinks"][number] => Boolean(item))
          : [];
        const fallbackProducts = products.slice(0, 4).map((product) => ({
          href: `/san-pham/${product.slug}`,
          label: product.name,
          note: product.categoryLabel || product.category || product.tagline || "Sản phẩm hiện tại",
        }));

        setCurrentProductMenuLinks(
          selectedProducts.length ? selectedProducts : fallbackProducts,
        );
        setProductMenuLoaded(true);
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        console.error("Failed to load header products", error);
        setProductMenuLoaded(true);
      });

    return () => controller.abort();
  }, [initialProductMenuLinks]);

  useEffect(() => {
    if (!searchOpen || trimmedSearchQuery.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setSearchLoading(true);
      setSearchError("");

      fetch(`/api/search?q=${encodeURIComponent(trimmedSearchQuery)}`, {
        signal: controller.signal,
      })
        .then((response) => {
          if (!response.ok) throw new Error("Search request failed");
          return response.json() as Promise<{ results?: SearchResult[] }>;
        })
        .then((data) => {
          setSearchResults(Array.isArray(data.results) ? data.results : []);
        })
        .catch((error) => {
          if (error.name === "AbortError") return;
          console.error("Search failed", error);
          setSearchError("Không thể tìm kiếm lúc này. Vui lòng thử lại sau.");
        })
        .finally(() => {
          if (!controller.signal.aborted) setSearchLoading(false);
        });
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [searchOpen, trimmedSearchQuery]);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const firstResult = searchResults[0];
    if (!firstResult) return;

    setSearchOpen(false);
    router.push(firstResult.href);
  }

  function handleLanguageChange(nextLanguage: LanguageCode) {
    if (nextLanguage === language) return;

    window.localStorage.setItem("acbt-language", nextLanguage);
    setLanguage(nextLanguage);
    setLanguageOpen(false);
    setTranslateCookie(nextLanguage);
    window.location.reload();
  }

  const currentLanguage = LANGUAGE_OPTIONS.find((item) => item.code === language) || LANGUAGE_OPTIONS[0];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <Script id="google-translate-init" strategy="afterInteractive">
        {`
          window.googleTranslateElementInit = function () {
            new window.google.translate.TranslateElement({
              pageLanguage: 'vi',
              includedLanguages: 'vi,en',
              autoDisplay: false
            }, 'google_translate_element');
          };
        `}
      </Script>
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <div id="google_translate_element" className="acbt-translate-widget" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <Link href="/" className="flex min-w-[176px] shrink-0 flex-nowrap items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-visible sm:h-14 sm:w-14">
              <img src="/logo-acbt.png" alt="Ăn Cùng Bà Tuyết Logo" className="h-full w-full object-contain" />
            </div>
            <span className="shrink-0 whitespace-nowrap text-sm font-black leading-tight text-primary sm:text-base">
              Ăn Cùng Bà Tuyết
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const submenu = getHeaderSubmenu(link, productMenuLinks);
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

              if (submenu) {
                const overviewHref = submenu.overviewHref || link.href;
                return (
                  <div key={link.href} className="relative group py-2">
                    <Link
                      href={overviewHref}
                      className={`flex items-center gap-1 px-3 py-2 rounded-none text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary-light text-primary-dark font-semibold"
                          : "text-gray-600 hover:bg-primary-light hover:text-primary-dark"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
                    </Link>
                    <div className="absolute left-1/2 top-full z-50 hidden w-[min(90vw,430px)] -translate-x-1/2 pt-3 group-hover:block">
                      <div className="overflow-hidden border border-orange-100 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.14)]">
                        <div className="grid">
                          <div className="relative border-b border-orange-100 bg-[#fffaf3] px-5 py-4 text-slate-950">
                            <div className="absolute inset-x-0 top-0 h-0.5 bg-orange-500" />
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-600">
                              {submenu.eyebrow}
                            </p>
                            <p className="absolute right-4 top-4 border border-orange-200 bg-white px-2 py-1 text-[10px] font-black tracking-[-0.02em] text-orange-600">
                              {submenu.accent}
                            </p>
                            <p className="mt-2 pr-16 text-base font-black leading-5">
                              {submenu.title}
                            </p>
                            <p className="mt-1.5 pr-10 text-xs font-semibold leading-5 text-slate-500">
                              {submenu.description}
                            </p>
                          </div>
                          <div className="grid gap-1 bg-white p-2.5">
                            <Link
                              href={overviewHref}
                              className="group/item flex items-center justify-between border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-black text-orange-700 transition hover:border-orange-300 hover:bg-orange-100"
                            >
                              <span>Xem tổng quan</span>
                              <span className="transition group-hover/item:translate-x-1">→</span>
                            </Link>
                            {submenu.links.map((item) => (
                              <Link
                                key={`${link.href}-${item.href}-${item.label}`}
                                href={item.href}
                                className="group/item block border border-transparent px-4 py-3 transition hover:border-orange-100 hover:bg-[#fffaf3]"
                              >
                                <span className="flex items-center justify-between gap-4 text-sm font-black text-slate-900 group-hover/item:text-orange-700">
                                  {item.label}
                                  <span className="text-orange-500 opacity-0 transition group-hover/item:translate-x-1 group-hover/item:opacity-100">→</span>
                                </span>
                                {item.note && (
                                  <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">
                                    {item.note}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-none text-sm font-medium transition-colors ${
                    isActive
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
            <button
              type="button"
              onClick={() => {
                setSearchOpen(true);
                setOpen(false);
              }}
              className="acbt-icon-btn p-2 text-slate-700 hover:bg-primary-light hover:text-primary-dark"
              aria-label="Tìm kiếm"
              title="Tìm kiếm"
            >
              <Search size={20} />
            </button>

            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setLanguageOpen((value) => !value)}
                className="flex h-9 items-center gap-1.5 border border-transparent bg-white px-2 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                aria-expanded={languageOpen}
                aria-label="Chọn ngôn ngữ"
              >
                <LanguageFlag code={currentLanguage.code} />
                <span>{currentLanguage.shortLabel}</span>
                <ChevronDown size={13} className={`transition-transform ${languageOpen ? "rotate-180" : ""}`} />
              </button>

              {languageOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-24 border border-slate-200 bg-white py-1 shadow-[0_12px_30px_rgba(15,23,42,0.16)]">
                  {LANGUAGE_OPTIONS.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => handleLanguageChange(item.code)}
                      className={`flex w-full items-center gap-2 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide transition ${
                        language === item.code
                          ? "bg-orange-50 text-orange-700"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <LanguageFlag code={item.code} />
                      <span>{item.shortLabel}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setOpen(!open)}
              className="acbt-icon-btn p-2 text-slate-700 hover:bg-primary-light hover:text-primary-dark lg:hidden"
              aria-label="Menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="bg-white border-t border-gray-100 shadow-lg lg:hidden">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const submenu = getHeaderSubmenu(link, productMenuLinks);
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

              if (submenu) {
                const isSubmenuOpen = mobileSubmenuOpen === link.href;
                const overviewHref = submenu.overviewHref || link.href;
                return (
                  <div key={link.href} className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => setMobileSubmenuOpen(isSubmenuOpen ? null : link.href)}
                      className={`flex items-center justify-between px-4 py-3 rounded-none text-base font-medium transition-colors text-left ${
                        isActive ? "bg-primary-light text-primary-dark font-semibold" : "text-gray-600 hover:bg-primary-light"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown size={18} className={`transition-transform duration-200 ${isSubmenuOpen ? "rotate-180 text-primary-dark" : "text-gray-500"}`} />
                    </button>
                    {isSubmenuOpen && (
                      <div className="border-l-2 border-orange-300 bg-orange-50/40 p-3">
                        <div className="mb-2 border border-orange-100 bg-white p-3">
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-700">{submenu.eyebrow}</p>
                          <p className="mt-1 text-sm font-black text-slate-950">{submenu.title}</p>
                          <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{submenu.description}</p>
                        </div>
                        <Link
                          href={overviewHref}
                          onClick={() => setOpen(false)}
                          className="mb-1 flex items-center justify-between border border-orange-100 bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-orange-700"
                        >
                          Xem tổng quan
                          <span>→</span>
                        </Link>
                        {submenu.links.map((item) => (
                          <Link
                            key={`${link.href}-${item.href}-${item.label}`}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="block border border-transparent px-4 py-3 text-sm font-bold text-gray-700 hover:border-orange-100 hover:bg-white hover:text-orange-700"
                          >
                            <span className="block">{item.label}</span>
                            {item.note && <span className="mt-1 block text-xs font-semibold text-slate-500">{item.note}</span>}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-none text-base font-medium transition-colors ${
                    isActive ? "bg-primary-light text-primary-dark" : "text-gray-600 hover:bg-primary-light"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Button
              href={phoneHref}
              variant="primary"
              size="lg"
              className="mt-2 w-full"
              leftIcon={<Phone size={16} />}
            >
              {phone}
            </Button>
            <div className="mt-3 grid grid-cols-2 border border-slate-200 bg-white p-1">
              {LANGUAGE_OPTIONS.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleLanguageChange(item.code)}
                  className={`flex items-center justify-center gap-2 px-3 py-3 text-sm font-black uppercase tracking-[0.12em] transition ${
                    language === item.code
                      ? "bg-slate-950 text-white"
                      : "text-slate-500 hover:bg-orange-50 hover:text-orange-700"
                  }`}
                >
                  <LanguageFlag code={item.code} className="h-3 w-4" />
                  {item.shortLabel}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}

      <SearchDialog
        open={searchOpen}
        query={searchQuery}
        results={searchResults}
        loading={searchLoading}
        error={searchError}
        onClose={() => setSearchOpen(false)}
        onQueryChange={(value) => {
          setSearchQuery(value);
          if (value.trim().length < 2) {
            setSearchResults([]);
            setSearchError("");
            setSearchLoading(false);
          }
        }}
        onSubmit={handleSearchSubmit}
      />
    </header>
  );
}
