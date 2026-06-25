"use client";

import Link from "next/link";
import Script from "next/script";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Globe2, Loader2, Menu, Phone, Search, X, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { DEFAULT_SITE_CONFIG, type SiteConfigData } from "@/lib/site-config-defaults";

const DEFAULT_NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/quy-trinh", label: "Quy trình" },
  { href: "/he-thong-ban", label: "Hệ thống bán" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/lien-he", label: "Liên hệ" },
];

type SearchResult = {
  title: string;
  description: string;
  href: string;
  type: "page" | "product" | "post" | "location" | "channel";
};

const RESULT_TYPE_LABEL: Record<SearchResult["type"], string> = {
  page: "Trang",
  product: "Sản phẩm",
  post: "Tin tức",
  location: "Điểm bán",
  channel: "Kênh bán",
};

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

function setTranslateCookie(language: "vi" | "en") {
  const value = language === "vi" ? "" : "/vi/en";
  const maxAge = language === "vi" ? "Max-Age=0" : "Max-Age=31536000";

  document.cookie = `googtrans=${value}; Path=/; ${maxAge}`;
  document.cookie = `googtrans=${value}; Domain=${window.location.hostname}; Path=/; ${maxAge}`;
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
}: {
  initialLinks?: { href: string; label: string }[];
  initialContact?: SiteConfigData["footerContact"];
}) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("acbt-language");
    if (savedLanguage === "en" || savedLanguage === "vi") {
      setLanguage(savedLanguage);
    }
  }, []);
  const navLinks = Array.isArray(initialLinks) && initialLinks.length > 0 ? initialLinks : DEFAULT_NAV_LINKS;
  const phone = initialContact?.phone || DEFAULT_SITE_CONFIG.footerContact.phone;
  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;
  const trimmedSearchQuery = useMemo(() => searchQuery.trim(), [searchQuery]);

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

  function handleLanguageChange(nextLanguage: "vi" | "en") {
    if (nextLanguage === language) return;

    window.localStorage.setItem("acbt-language", nextLanguage);
    setLanguage(nextLanguage);
    setTranslateCookie(nextLanguage);
    window.location.reload();
  }

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
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 overflow-hidden rounded-full border border-slate-100 flex items-center justify-center bg-white shadow-sm">
              <img src="/logo-acbt.png" alt="Ăn Cùng Bà Tuyết Logo" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-neutral text-sm leading-tight">Ăn Cùng</p>
              <p className="font-bold text-primary text-sm leading-tight">Bà Tuyết</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.href === "/gioi-thieu") {
                const isAboutActive = pathname.startsWith("/gioi-thieu");
                return (
                  <div key={link.href} className="relative group py-2">
                    <Link
                      href={link.href}
                      className={`flex items-center gap-1 px-3 py-2 rounded-none text-sm font-medium transition-colors ${
                        isAboutActive
                          ? "bg-primary-light text-primary-dark font-semibold"
                          : "text-gray-600 hover:bg-primary-light hover:text-primary-dark"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
                    </Link>
                    <div className="absolute top-full left-0 w-48 bg-white border border-gray-100 shadow-xl py-1 hidden group-hover:block z-50 animate-fade-in">
                      <Link
                        href="/gioi-thieu"
                        className="block px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                      >
                        Giới thiệu chung
                      </Link>
                      <Link
                        href="/gioi-thieu/lich-su"
                        className="block px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                      >
                        Lịch sử phát triển
                      </Link>
                      <Link
                        href="/gioi-thieu/thanh-tuu"
                        className="block px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                      >
                        Thành tựu & Uy tín
                      </Link>
                      <Link
                        href="/gioi-thieu/cong-dong"
                        className="block px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                      >
                        Cộng đồng
                      </Link>
                    </div>
                  </div>
                );
              }

              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
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

            <div className="hidden sm:flex items-center border border-orange-100 bg-white">
              <button
                type="button"
                onClick={() => handleLanguageChange("vi")}
                className={`px-2.5 py-2 text-xs font-black transition-colors ${
                  language === "vi" ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-orange-50"
                }`}
                aria-pressed={language === "vi"}
              >
                VI
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange("en")}
                className={`px-2.5 py-2 text-xs font-black transition-colors ${
                  language === "en" ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-orange-50"
                }`}
                aria-pressed={language === "en"}
              >
                EN
              </button>
            </div>

            <Button
              href={phoneHref}
              variant="primary"
              size="sm"
              className="hidden md:flex"
              leftIcon={<Phone size={14} />}
            >
              {phone}
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
              if (link.href === "/gioi-thieu") {
                const isAboutActive = pathname.startsWith("/gioi-thieu");
                return (
                  <div key={link.href} className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                      className={`flex items-center justify-between px-4 py-3 rounded-none text-base font-medium transition-colors text-left ${
                        isAboutActive ? "bg-primary-light text-primary-dark font-semibold" : "text-gray-600 hover:bg-primary-light"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown size={18} className={`transition-transform duration-200 ${mobileAboutOpen ? "rotate-180 text-primary-dark" : "text-gray-500"}`} />
                    </button>
                    {mobileAboutOpen && (
                      <div className="bg-orange-50/30 flex flex-col pl-4 border-l-2 border-orange-200">
                        <Link
                          href="/gioi-thieu"
                          onClick={() => setOpen(false)}
                          className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-orange-700"
                        >
                          Giới thiệu chung
                        </Link>
                        <Link
                          href="/gioi-thieu/lich-su"
                          onClick={() => setOpen(false)}
                          className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-orange-700"
                        >
                          Lịch sử phát triển
                        </Link>
                        <Link
                          href="/gioi-thieu/thanh-tuu"
                          onClick={() => setOpen(false)}
                          className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-orange-700"
                        >
                          Thành tựu & Uy tín
                        </Link>
                        <Link
                          href="/gioi-thieu/cong-dong"
                          onClick={() => setOpen(false)}
                          className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-orange-700"
                        >
                          Cộng đồng
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
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
            <div className="mt-2 grid grid-cols-2 border border-orange-100">
              <button
                type="button"
                onClick={() => handleLanguageChange("vi")}
                className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-black ${
                  language === "vi" ? "bg-orange-600 text-white" : "bg-white text-slate-700"
                }`}
              >
                <Globe2 size={16} />
                VI
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange("en")}
                className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-black ${
                  language === "en" ? "bg-orange-600 text-white" : "bg-white text-slate-700"
                }`}
              >
                <Globe2 size={16} />
                EN
              </button>
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
