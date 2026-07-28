"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Leaf,
  Loader,
  PackageCheck,
  Sparkles,
} from "lucide-react";

type ProductVariant = {
  name?: string;
  weight?: string;
  spiceLevel?: number;
  image?: string;
};

type ProductStep = {
  step?: number;
  title?: string;
  description?: string;
};

type ProductSpec = {
  label?: string;
  value?: string;
};

type Product = {
  id: string | number;
  slug: string;
  name: string;
  image?: string;
  heroImage?: string | null;
  category?: string;
  categoryLabel?: string;
  tagline?: string;
  description?: string;
  shortDescription?: string | null;
  story?: string;
  ingredients?: string[];
  specs?: ProductSpec[];
  variants?: ProductVariant[];
  processSteps?: ProductStep[];
  featured?: boolean;
  sortOrder?: number;
};

type ShowcaseTheme = {
  page: string;
  surface: string;
  soft: string;
  accent: string;
  accentText: string;
  ring: string;
  glow: string;
};

const SHOWCASE_THEMES: ShowcaseTheme[] = [
  {
    page: "bg-[#fffaf1]",
    surface: "bg-[#fff1d9]",
    soft: "bg-[#fff7e9]",
    accent: "bg-[#ef4b00]",
    accentText: "text-[#d94200]",
    ring: "border-[#f6bc83]",
    glow: "bg-[#ffbd73]",
  },
  {
    page: "bg-[#fffdf5]",
    surface: "bg-[#fff0dc]",
    soft: "bg-[#fff8ec]",
    accent: "bg-[#f06a12]",
    accentText: "text-[#d65300]",
    ring: "border-[#f2c179]",
    glow: "bg-[#ffd47c]",
  },
  {
    page: "bg-[#fff8f2]",
    surface: "bg-[#ffe9de]",
    soft: "bg-[#fff4ed]",
    accent: "bg-[#e94f2f]",
    accentText: "text-[#cf3d20]",
    ring: "border-[#f2b49e]",
    glow: "bg-[#ff9c73]",
  },
  {
    page: "bg-[#fffbee]",
    surface: "bg-[#f8efd0]",
    soft: "bg-[#fff8dc]",
    accent: "bg-[#dc6d0a]",
    accentText: "text-[#bd5700]",
    ring: "border-[#e8c271]",
    glow: "bg-[#efc85f]",
  },
];

function safeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function productImage(product: Product | null) {
  return product?.image || product?.heroImage || "";
}

function themeIndex(product: Product | null) {
  const source = `${product?.slug || ""}-${product?.category || ""}`;
  return [...source].reduce((total, character) => total + character.charCodeAt(0), 0) % SHOWCASE_THEMES.length;
}

function Reveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  delay?: number;
}) {
  const initial =
    direction === "left"
      ? { opacity: 0, x: -34 }
      : direction === "right"
        ? { opacity: 0, x: 34 }
        : { opacity: 0, y: 28 };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ProductArtwork({
  product,
  theme,
  compact = false,
}: {
  product: Product;
  theme: ShowcaseTheme;
  compact?: boolean;
}) {
  const image = productImage(product);

  return (
    <div
      className={`relative isolate flex items-center justify-center overflow-hidden ${
        compact ? "min-h-[300px] sm:min-h-[440px]" : "min-h-[390px] sm:min-h-[540px] lg:min-h-[calc(100svh-126px)]"
      }`}
    >
      <div
        className={`absolute left-1/2 top-1/2 aspect-square w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full ${theme.accent}`}
      />
      <div
        className={`absolute left-1/2 top-1/2 aspect-square w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full border ${theme.ring}`}
      />
      <div className={`absolute left-[7%] top-[12%] h-20 w-20 rounded-full opacity-30 blur-2xl sm:h-36 sm:w-36 ${theme.glow}`} />
      <div className="absolute right-[5%] top-[16%] h-16 w-16 rounded-full border border-white/60 sm:h-24 sm:w-24" />
      <div className="absolute bottom-[9%] left-[10%] h-24 w-24 rounded-full border border-orange-300/50 sm:h-36 sm:w-36" />
      <span className="absolute right-4 top-5 text-[9px] font-black uppercase tracking-[0.25em] text-slate-900/45 sm:right-8">
        Ăn Cùng Bà Tuyết
      </span>

      {image ? (
        <motion.img
          src={image}
          alt={product.name}
          initial={{ opacity: 0, y: 34, rotate: 2, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className={`relative z-10 w-[82%] object-contain drop-shadow-[0_32px_34px_rgba(90,42,7,0.24)] ${
            compact ? "h-[260px] sm:h-[390px]" : "h-[340px] sm:h-[500px] lg:h-[580px]"
          }`}
        />
      ) : (
        <div className="relative z-10 grid h-56 w-56 place-items-center rounded-full bg-white/90 text-5xl font-black text-orange-600">
          ACBT
        </div>
      )}
    </div>
  );
}

export default function ProductShowcaseLanding() {
  const params = useParams();
  const slug = String(params?.slug || "");
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const controller = new AbortController();

    async function loadShowcase() {
      setLoading(true);
      setError(false);

      try {
        const [productResponse, productsResponse] = await Promise.all([
          fetch(`/api/products/slug/${encodeURIComponent(slug)}`, { signal: controller.signal }),
          fetch("/api/products", { signal: controller.signal }),
        ]);

        if (!productResponse.ok) throw new Error("Product not found");

        const productData = (await productResponse.json()) as Product;
        const productsData = productsResponse.ok ? await productsResponse.json() : [];
        const products = Array.isArray(productsData)
          ? productsData
          : Array.isArray(productsData?.data)
            ? productsData.data
            : [];

        setProduct(productData);
        setAllProducts(products);
      } catch (loadError) {
        if (loadError instanceof Error && loadError.name === "AbortError") return;
        setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadShowcase();
    return () => controller.abort();
  }, [slug]);

  const relatedProducts = useMemo(
    () =>
      [...allProducts]
        .filter((item) => item.slug && item.slug !== product?.slug)
        .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || (a.sortOrder || 0) - (b.sortOrder || 0))
        .slice(0, 3),
    [allProducts, product?.slug],
  );

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fffaf1] pt-16 lg:pt-[72px]">
        <div className="text-center">
          <Loader className="mx-auto animate-spin text-orange-600" size={38} />
          <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            Đang mở câu chuyện sản phẩm
          </p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fffaf1] px-5 pt-16 lg:pt-[72px]">
        <div className="max-w-lg text-center">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-600">Không tìm thấy showcase</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-slate-950">
            Sản phẩm này chưa có câu chuyện riêng.
          </h1>
          <Link
            href="/san-pham"
            className="mt-8 inline-flex items-center gap-3 bg-orange-600 px-6 py-4 text-xs font-black uppercase tracking-[0.12em] text-white"
          >
            <ArrowLeft size={16} />
            Về trang sản phẩm
          </Link>
        </div>
      </main>
    );
  }

  const theme = SHOWCASE_THEMES[themeIndex(product)];
  const ingredients = safeArray<string>(product.ingredients).filter(Boolean);
  const specs = safeArray<ProductSpec>(product.specs).filter((item) => item.label && item.value);
  const variants = safeArray<ProductVariant>(product.variants).filter((item) => item.name);
  const processSteps = safeArray<ProductStep>(product.processSteps).filter((item) => item.title);
  const summary =
    product.shortDescription ||
    product.description ||
    "Một sản phẩm mang cá tính riêng trong bộ sưu tập đồ ăn vặt Việt của Ăn Cùng Bà Tuyết.";
  const story = product.story || product.description || summary;
  const hasSecondaryImage = Boolean(product.heroImage && product.image && product.heroImage !== product.image);

  return (
    <main className={`min-h-screen overflow-hidden pt-16 text-slate-950 lg:pt-[72px] ${theme.page}`}>
      <nav className="sticky top-16 z-30 border-y border-orange-100/80 bg-white/90 backdrop-blur-xl lg:top-[72px]">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 [scrollbar-width:none] sm:px-6 lg:px-8">
          {[
            ["#cau-chuyen", "Câu chuyện"],
            ["#huong-vi", "Hương vị"],
            ["#quy-trinh", "Quy trình"],
            ["#ho-so", "Hồ sơ"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="shrink-0 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500 transition hover:bg-orange-50 hover:text-orange-700"
            >
              {label}
            </a>
          ))}
          <Link
            href="/san-pham"
            className="ml-auto hidden shrink-0 items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-orange-700 sm:inline-flex"
          >
            Tất cả sản phẩm
            <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      <section className={`relative border-b border-orange-100 ${theme.surface}`}>
        <span className="pointer-events-none absolute inset-x-0 bottom-0 hidden whitespace-nowrap text-center text-[10vw] font-black uppercase leading-[0.72] tracking-[-0.08em] text-slate-950/[0.035] lg:block">
          {product.name}
        </span>
        <div className="relative mx-auto grid max-w-[1600px] lg:grid-cols-2">
          <Reveal direction="right" className="order-1 lg:order-2">
            <ProductArtwork product={product} theme={theme} />
          </Reveal>

          <Reveal
            direction="left"
            delay={0.08}
            className="order-2 flex items-center px-5 pb-14 pt-3 sm:px-10 sm:pb-20 lg:order-1 lg:min-h-[calc(100svh-126px)] lg:px-16 lg:py-20 xl:px-24"
          >
            <div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-black uppercase tracking-[0.24em] ${theme.accentText}`}>
                  Signature showcase
                </span>
                <span className={`h-px w-12 ${theme.accent}`} />
                <span className="text-[10px] font-black tracking-[0.18em] text-slate-400">
                  {product.categoryLabel || product.category || "ACBT"}
                </span>
              </div>

              <h1 className="mt-6 max-w-3xl text-[2.8rem] font-black leading-[0.9] tracking-[-0.065em] text-slate-950 sm:text-6xl lg:text-7xl xl:text-[5.4rem]">
                {product.name}
              </h1>

              {product.tagline && (
                <p className={`mt-6 max-w-xl text-xl font-black leading-tight sm:text-2xl ${theme.accentText}`}>
                  {product.tagline}
                </p>
              )}

              <p className="mt-6 max-w-xl text-[0.9375rem] font-semibold leading-7 text-slate-600 sm:text-base sm:leading-8">
                {summary}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#cau-chuyen"
                  className={`inline-flex h-13 items-center justify-center gap-3 px-6 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 ${theme.accent}`}
                >
                  Khám phá câu chuyện
                  <ArrowDown size={17} />
                </a>
                <Link
                  href="/san-pham"
                  className="inline-flex h-13 items-center justify-center gap-3 border border-orange-200 bg-white/80 px-6 text-xs font-black uppercase tracking-[0.12em] text-slate-700 transition hover:border-orange-400 hover:text-orange-700"
                >
                  Bộ sưu tập
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="cau-chuyen" className="scroll-mt-32 border-b border-orange-100 px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <Reveal direction="left" className="order-1">
            <div className={`relative overflow-hidden border border-orange-100 p-4 sm:p-7 ${theme.soft}`}>
              {hasSecondaryImage ? (
                <div className="relative aspect-[4/3] overflow-hidden bg-white">
                  <img
                    src={product.heroImage || ""}
                    alt={`${product.name} - câu chuyện sản phẩm`}
                    className="h-full w-full object-contain p-5 sm:p-10"
                  />
                </div>
              ) : (
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className={`absolute -right-[12%] -top-[20%] h-[75%] w-[75%] rounded-full opacity-80 ${theme.glow}`} />
                  <div className={`absolute -bottom-[28%] -left-[12%] h-[80%] w-[80%] rounded-full ${theme.accent}`} />
                  <span className="absolute bottom-6 left-6 max-w-[80%] text-4xl font-black leading-[0.9] tracking-[-0.06em] text-white sm:bottom-10 sm:left-10 sm:text-6xl">
                    Một vị riêng.
                    <br />
                    Một câu chuyện.
                  </span>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal direction="right" className="order-2">
            <p className={`text-[10px] font-black uppercase tracking-[0.24em] ${theme.accentText}`}>01 · Câu chuyện</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl">
              Không chỉ là một món ăn vặt.
            </h2>
            <p className="mt-7 whitespace-pre-line text-base font-medium leading-8 text-slate-600 sm:text-lg sm:leading-9">
              {story}
            </p>
          </Reveal>
        </div>
      </section>

      {ingredients.length > 0 && (
        <section id="huong-vi" className={`scroll-mt-32 border-b border-orange-100 px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-28 ${theme.soft}`}>
          <div className="mx-auto max-w-7xl">
            <Reveal className="max-w-3xl">
              <p className={`text-[10px] font-black uppercase tracking-[0.24em] ${theme.accentText}`}>02 · Hương vị</p>
              <h2 className="mt-4 text-3xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl">
                Cá tính bắt đầu từ những thành phần rõ ràng.
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
              {ingredients.map((ingredient, index) => (
                <Reveal key={`${ingredient}-${index}`} delay={Math.min(index * 0.05, 0.25)}>
                  <div className="group flex min-h-28 items-center gap-4 border border-orange-100 bg-white/85 p-5 transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_18px_38px_rgba(166,73,12,0.08)] sm:p-6">
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-white ${theme.accent}`}>
                      <Leaf size={19} />
                    </span>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Thành phần {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-1 text-sm font-black leading-5 text-slate-900 sm:text-base">
                        {ingredient}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {processSteps.length > 0 && (
        <section id="quy-trinh" className="scroll-mt-32 border-b border-orange-100 px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <Reveal className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
              <div>
                <p className={`text-[10px] font-black uppercase tracking-[0.24em] ${theme.accentText}`}>03 · Quy trình</p>
                <h2 className="mt-4 text-3xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl">
                  Mỗi bước đều góp vào trải nghiệm cuối cùng.
                </h2>
              </div>
              <p className="max-w-2xl text-sm font-semibold leading-7 text-slate-600 lg:justify-self-end">
                Hành trình của sản phẩm được kể theo đúng các công đoạn đang lưu trong hồ sơ sản phẩm.
              </p>
            </Reveal>

            <div className="relative mt-10 grid gap-3 lg:mt-16 lg:grid-cols-3">
              {processSteps.map((step, index) => (
                <Reveal key={`${step.title}-${index}`} delay={Math.min(index * 0.06, 0.3)}>
                  <article className="group relative min-h-48 overflow-hidden border border-orange-100 bg-white p-5 transition duration-300 hover:border-orange-300 sm:p-7">
                    <span className="pointer-events-none absolute -bottom-5 right-1 text-8xl font-black leading-none text-orange-950/[0.045]">
                      {String(step.step || index + 1).padStart(2, "0")}
                    </span>
                    <div className="relative flex items-start gap-4 lg:block">
                      <span className={`grid h-10 w-10 shrink-0 place-items-center text-xs font-black text-white ${theme.accent}`}>
                        {String(step.step || index + 1).padStart(2, "0")}
                      </span>
                      <div className="lg:mt-7">
                        <h3 className="text-lg font-black tracking-[-0.03em] text-slate-950">{step.title}</h3>
                        {step.description && (
                          <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{step.description}</p>
                        )}
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {(specs.length > 0 || variants.length > 0) && (
        <section id="ho-so" className={`scroll-mt-32 border-b border-orange-100 px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-28 ${theme.surface}`}>
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-20">
            {specs.length > 0 && (
              <Reveal direction="left">
                <p className={`text-[10px] font-black uppercase tracking-[0.24em] ${theme.accentText}`}>04 · Hồ sơ</p>
                <h2 className="mt-4 text-3xl font-black leading-none tracking-[-0.055em] sm:text-5xl">
                  Thông tin sản phẩm.
                </h2>
                <div className="mt-8 border-t border-slate-900/15">
                  {specs.map((spec, index) => (
                    <div
                      key={`${spec.label}-${index}`}
                      className="grid grid-cols-[0.8fr_1.2fr] gap-4 border-b border-slate-900/15 py-4 text-sm sm:grid-cols-[180px_1fr] sm:py-5"
                    >
                      <span className="font-black text-slate-950">{spec.label}</span>
                      <span className="font-semibold leading-6 text-slate-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}

            {variants.length > 0 && (
              <Reveal direction="right">
                <div className="flex items-center gap-3">
                  <Sparkles size={18} className={theme.accentText} />
                  <p className={`text-[10px] font-black uppercase tracking-[0.24em] ${theme.accentText}`}>
                    Các sắc thái cùng dòng
                  </p>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {variants.map((variant, index) => (
                    <div
                      key={`${variant.name}-${index}`}
                      className="flex min-h-28 items-start gap-4 border border-orange-100 bg-white/85 p-5"
                    >
                      {variant.image ? (
                        <img src={variant.image} alt={variant.name || ""} className="h-14 w-14 shrink-0 object-contain" />
                      ) : (
                        <span className={`grid h-11 w-11 shrink-0 place-items-center text-white ${theme.accent}`}>
                          <PackageCheck size={19} />
                        </span>
                      )}
                      <div>
                        <p className="font-black leading-5 text-slate-950">{variant.name}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {variant.weight && (
                            <span className="bg-orange-50 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-orange-700">
                              {variant.weight}
                            </span>
                          )}
                          {typeof variant.spiceLevel === "number" && variant.spiceLevel > 0 && (
                            <span className="bg-orange-50 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-orange-700">
                              Cay {variant.spiceLevel}/5
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal className="flex items-end justify-between gap-6">
            <div>
              <p className={`text-[10px] font-black uppercase tracking-[0.24em] ${theme.accentText}`}>Tiếp tục khám phá</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] sm:text-5xl">Những câu chuyện khác.</h2>
            </div>
            <Link
              href="/san-pham"
              className="hidden items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-orange-700 sm:inline-flex"
            >
              Xem tất cả
              <ArrowRight size={16} />
            </Link>
          </Reveal>

          {relatedProducts.length > 0 ? (
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
              {relatedProducts.map((item, index) => {
                const relatedTheme = SHOWCASE_THEMES[themeIndex(item)];
                return (
                  <Reveal key={item.id || item.slug} delay={index * 0.06}>
                    <Link
                      href={`/san-pham/${item.slug}`}
                      className="group block overflow-hidden border border-orange-100 bg-white transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_22px_48px_rgba(110,52,8,0.10)]"
                    >
                      <div className={`relative aspect-[4/3] overflow-hidden ${relatedTheme.surface}`}>
                        <div className={`absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full ${relatedTheme.accent}`} />
                        <img
                          src={productImage(item)}
                          alt={item.name}
                          className="relative z-10 h-full w-full object-contain p-7 transition duration-500 group-hover:scale-105 sm:p-9"
                        />
                      </div>
                      <div className="flex items-start justify-between gap-5 p-5 sm:p-6">
                        <div>
                          <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${relatedTheme.accentText}`}>
                            {item.categoryLabel || item.category || "Sản phẩm"}
                          </span>
                          <h3 className="mt-2 text-xl font-black leading-6 tracking-[-0.035em]">{item.name}</h3>
                        </div>
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-orange-200 text-orange-700 transition group-hover:bg-orange-600 group-hover:text-white">
                          <ChevronRight size={18} />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-start gap-5 border border-orange-100 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className={`grid h-11 w-11 place-items-center text-white ${theme.accent}`}>
                  <Check size={19} />
                </span>
                <p className="font-bold text-slate-700">Khám phá toàn bộ bộ sưu tập sản phẩm chủ lực.</p>
              </div>
              <Link href="/san-pham" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-700">
                Mở bộ sưu tập
                <ArrowRight size={16} />
              </Link>
            </div>
          )}

          <Link
            href="/san-pham"
            className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-orange-700 sm:hidden"
          >
            <ArrowLeft size={15} />
            Trở về bộ sưu tập
          </Link>
        </div>
      </section>
    </main>
  );
}
