"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader,
  PackageCheck,
  Sparkles,
} from "lucide-react";
import {
  DEFAULT_MARKETING_CONFIG,
  normalizeMarketingConfig,
  type HomeTextItem,
  type PageAssetItem,
} from "@/lib/marketing-config";

type Product = {
  id: string | number;
  slug?: string;
  name?: string;
  image?: string;
  heroImage?: string | null;
  category?: string;
  categoryLabel?: string;
  tagline?: string;
  description?: string;
  shortDescription?: string | null;
  featured?: boolean;
  sortOrder?: number;
};

const CATEGORY_LABELS: Record<string, string> = {
  "chan-ga": "Chân gà",
  "tam-cay": "Tăm cay",
  snack: "Snack",
  "banh-trang": "Bánh tráng",
  khac: "Sản phẩm khác",
};

const SHOWCASE_PRODUCTS_ASSET_KEY = "products_landing_showcase_products";

function parseProductIds(value: string) {
  if (!value.trim() || value.trim().toLowerCase() === "none") return [];

  return Array.from(
    new Set(
      value
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean),
    ),
  );
}

const PRODUCT_THEMES = [
  {
    section: "bg-[#fff4df]",
    orb: "bg-orange-600",
    accent: "text-orange-600",
    soft: "bg-orange-50",
  },
  {
    section: "bg-[#f5efe5]",
    orb: "bg-amber-500",
    accent: "text-orange-600",
    soft: "bg-white/70",
  },
  {
    section: "bg-[#fffaf3]",
    orb: "bg-orange-400",
    accent: "text-orange-600",
    soft: "bg-orange-50",
  },
  {
    section: "bg-[#f6eee3]",
    orb: "bg-yellow-500",
    accent: "text-orange-700",
    soft: "bg-white/70",
  },
];

function productKey(product: Product) {
  return String(product.id || product.slug || product.name || "product");
}

function productHref(product: Product) {
  return `/san-pham/${product.slug || product.id}`;
}

function productImage(product: Product) {
  return product.heroImage || product.image || "";
}

function productDescription(product: Product) {
  return (
    product.shortDescription ||
    product.description ||
    "Dòng sản phẩm được phát triển với thông tin rõ ràng, quy cách đóng gói chỉn chu và hương vị phù hợp với người tiêu dùng Việt."
  );
}

function pageText(items: HomeTextItem[], key: string, fallback: string) {
  const value = items.find((item) => item.key === key)?.value?.trim();
  return value || fallback;
}

function ProductChapter({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const theme = PRODUCT_THEMES[index % PRODUCT_THEMES.length];
  const imageOnRight = index % 2 === 0;
  const image = productImage(product);
  const detailHref = productHref(product);

  return (
    <motion.section
      id={`product-${productKey(product)}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.55 }}
      className={`relative scroll-mt-36 overflow-hidden border-b border-orange-100 ${theme.section}`}
    >
      <span className="pointer-events-none absolute inset-x-0 bottom-0 hidden select-none whitespace-nowrap text-center text-[8vw] font-black uppercase leading-none tracking-[-0.07em] text-slate-950/[0.025] lg:block">
        {product.name}
      </span>
      <div className="relative mx-auto grid min-h-[78vh] max-w-[1600px] items-center lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: imageOnRight ? 34 : -34, scale: 0.97 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className={`relative order-1 flex min-h-[390px] items-center justify-center overflow-hidden px-5 py-12 sm:min-h-[560px] sm:px-10 lg:min-h-[78vh] lg:py-16 ${
            imageOnRight ? "lg:order-2" : "lg:order-1"
          }`}
        >
          <div
            className={`absolute left-1/2 top-1/2 h-[min(76vw,360px)] w-[min(76vw,360px)] -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_40px_100px_rgba(15,23,42,0.16)] sm:h-[460px] sm:w-[460px] xl:h-[560px] xl:w-[560px] ${theme.orb}`}
          />
          <div className="absolute left-1/2 top-1/2 h-[min(88vw,410px)] w-[min(88vw,410px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50 sm:h-[520px] sm:w-[520px] xl:h-[630px] xl:w-[630px]" />
          <div className="absolute left-[12%] top-[14%] h-20 w-20 rounded-full border border-white/50 sm:h-28 sm:w-28" />
          <div className="absolute bottom-[12%] right-[10%] h-28 w-28 rounded-full border border-orange-300/50 sm:h-40 sm:w-40" />

          {image ? (
            <motion.img
              src={image}
              alt={product.name || "Sản phẩm Ăn Cùng Bà Tuyết"}
              initial={{ opacity: 0, y: 30, rotate: imageOnRight ? 2 : -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 h-[310px] w-[88%] object-contain drop-shadow-[0_35px_45px_rgba(15,23,42,0.25)] sm:h-[460px] xl:h-[570px]"
            />
          ) : (
            <div className="relative z-10 grid h-64 w-64 place-items-center rounded-full bg-white/90 text-5xl font-black text-orange-600">
              BT
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: imageOnRight ? -34 : 34 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className={`order-2 px-5 pb-14 pt-4 sm:px-10 sm:pb-20 lg:px-16 lg:py-20 xl:px-24 ${
            imageOnRight ? "lg:order-1" : "lg:order-2"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className={`text-xs font-black uppercase tracking-[0.2em] ${theme.accent}`}>
              {product.categoryLabel || CATEGORY_LABELS[product.category || ""] || "Sản phẩm chủ lực"}
            </span>
            <span className="h-px w-12 bg-current text-orange-300" />
          </div>

          <h2 className="mt-5 max-w-2xl text-[2.35rem] font-black leading-[0.96] tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl xl:text-7xl">
            {product.name || "Sản phẩm Ăn Cùng Bà Tuyết"}
          </h2>

          {product.tagline && (
            <p className={`mt-5 text-xl font-black leading-tight sm:text-2xl ${theme.accent}`}>
              {product.tagline}
            </p>
          )}

          <p className="mt-6 max-w-xl text-[0.9375rem] font-semibold leading-7 text-slate-700 sm:text-base sm:leading-8">
            {productDescription(product)}
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-black text-slate-700 ${theme.soft}`}>
              <Sparkles size={15} className={theme.accent} />
              Dấu ấn hương vị
            </span>
            <span className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-black text-slate-700 ${theme.soft}`}>
              <PackageCheck size={15} className={theme.accent} />
              Thiết kế nhận diện
            </span>
            <span className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-black text-slate-700 ${theme.soft}`}>
              <Check size={15} className={theme.accent} />
              Câu chuyện riêng
            </span>
          </div>

          <div className="mt-8">
            <Link
              href={detailHref}
              className="inline-flex h-13 items-center justify-center gap-3 bg-orange-600 px-6 text-xs font-black uppercase tracking-[0.13em] text-white transition hover:bg-orange-700"
            >
              Xem câu chuyện sản phẩm
              <ArrowRight size={17} />
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pageTexts, setPageTexts] = useState<HomeTextItem[]>(
    DEFAULT_MARKETING_CONFIG.homeTexts,
  );
  const [pageAssets, setPageAssets] = useState<PageAssetItem[]>(
    DEFAULT_MARKETING_CONFIG.pageAssets,
  );
  const [heroIndex, setHeroIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => {
        if (!response.ok) throw new Error("Products request failed");
        return response.json();
      })
      .then((data) => {
        const items = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
        setProducts(items);
      })
      .catch((error) => {
        console.error("Failed to load products", error);
        setProducts([]);
      })
      .finally(() => setLoading(false));

    fetch("/api/settings/marketing", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Marketing settings request failed");
        return response.json();
      })
      .then((data) => {
        const config = normalizeMarketingConfig(data?.data);
        setPageTexts(config.homeTexts);
        setPageAssets(config.pageAssets);
      })
      .catch((error) => {
        console.error("Failed to load product landing content", error);
      });
  }, []);

  const automaticCoreProducts = useMemo(() => {
    const sorted = [...products]
      .filter((product) => product.category !== "khac")
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    const featured = sorted.filter((product) => product.featured);

    if (featured.length > 0) return featured.slice(0, 8);

    const firstByCategory = new Map<string, Product>();
    sorted.forEach((product) => {
      const key = product.category || "other";
      if (!firstByCategory.has(key)) firstByCategory.set(key, product);
    });
    return Array.from(firstByCategory.values()).slice(0, 6);
  }, [products]);

  const showcaseSelection = useMemo(() => {
    const listAsset = pageAssets.find(
      (item) => item.key === SHOWCASE_PRODUCTS_ASSET_KEY,
    );
    const storedValue = listAsset?.linkUrl?.trim() || "";

    return {
      configured: Boolean(storedValue),
      ids: parseProductIds(storedValue),
    };
  }, [pageAssets]);

  const coreProducts = useMemo(() => {
    if (!showcaseSelection.configured) return automaticCoreProducts;

    return showcaseSelection.ids
      .map((id) =>
        products.find((product) => String(product.id) === String(id)),
      )
      .filter((product): product is Product => Boolean(product));
  }, [automaticCoreProducts, products, showcaseSelection]);

  const scrollToProducts = () => {
    document.getElementById("product-showcase")?.scrollIntoView({ behavior: "smooth" });
  };

  const heroProductIds = (() => {
    const listAsset = pageAssets.find(
      (item) => item.key === "products_landing_hero_products",
    );
    const savedIds = (listAsset?.linkUrl || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (savedIds.length > 0) return Array.from(new Set(savedIds));

    return pageAssets
      .filter((item) => /^products_landing_hero_image_[1-3]$/.test(item.key))
      .sort((a, b) => a.key.localeCompare(b.key))
      .map((item) =>
        item.linkUrl.startsWith("product:")
          ? item.linkUrl.slice("product:".length)
          : "",
      )
      .filter(Boolean);
  })();

  const heroProducts = heroProductIds
    .map((id) => products.find((product) => String(product.id) === id))
    .filter((product): product is Product => Boolean(product));

  useEffect(() => {
    if (heroProducts.length <= 3) return;

    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroProducts.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [heroProducts.length]);

  const visibleHeroIndex =
    heroProducts.length > 0 ? heroIndex % heroProducts.length : 0;

  const heroVisuals =
    heroProducts.length > 0
      ? Array.from({ length: Math.min(3, heroProducts.length) }, (_, slot) => {
          const product =
            heroProducts[(visibleHeroIndex + slot) % heroProducts.length];
          return {
            key: `${productKey(product)}-${visibleHeroIndex}-${slot}`,
            slot,
            image: productImage(product),
            alt: product.name || `Ảnh sản phẩm hero ${slot + 1}`,
          };
        }).filter((item) => Boolean(item.image))
      : [0, 1, 2]
          .map((index) => {
            const product = coreProducts[index];
            const configuredAsset = pageAssets.find(
              (item) => item.key === `products_landing_hero_image_${index + 1}`,
            );
            return {
              key: `manual-hero-${index}`,
              slot: index,
              image:
                configuredAsset?.imageUrl?.trim() ||
                (product ? productImage(product) : ""),
              alt: product?.name || `Ảnh sản phẩm hero ${index + 1}`,
            };
          })
          .filter((item) => Boolean(item.image));

  return (
    <main className="min-h-screen overflow-x-clip bg-[#fff4df] text-slate-950">
      <section className="relative overflow-hidden border-b border-orange-100 bg-[#fff4df] text-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_42%,rgba(251,146,60,0.38),transparent_25%),linear-gradient(120deg,#fffaf3_0%,#fff4df_52%,#ffedd5_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-orange-500 via-yellow-300 to-green-600" />
        <span className="absolute -left-4 bottom-[-0.12em] select-none text-[10rem] font-black leading-none tracking-[-0.1em] text-orange-950/[0.035] sm:text-[18rem] lg:text-[27rem]">
          TASTE
        </span>

        <div className="relative mx-auto grid min-h-[82vh] max-w-[1600px] items-center lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, x: -34 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 px-5 pb-14 pt-4 sm:px-8 sm:pb-20 lg:order-1 lg:px-16 lg:py-24 xl:px-24"
          >
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-orange-700">
              <Sparkles size={15} />
              {pageText(pageTexts, "products_landing_eyebrow", "Signature collection")}
            </div>
            <h1 className="mt-6 max-w-4xl text-[2.8rem] font-black leading-[0.87] tracking-[-0.075em] sm:text-6xl lg:text-7xl xl:text-8xl">
              {pageText(pageTexts, "products_landing_title_line_1", "Mỗi vị ngon,")}
              <span className="block text-orange-500">
                {pageText(pageTexts, "products_landing_title_line_2", "một cá tính.")}
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-base font-semibold leading-8 text-slate-700 sm:text-lg">
              {pageText(
                pageTexts,
                "products_landing_description",
                "Một showroom vị giác dành cho những sản phẩm đại diện của Ăn Cùng Bà Tuyết — nơi từng dòng sản phẩm được kể như một màn ra mắt riêng.",
              )}
            </p>
            <button
              type="button"
              onClick={scrollToProducts}
              className="mt-8 inline-flex items-center gap-3 border border-orange-600 bg-orange-600 px-6 py-4 text-xs font-black uppercase tracking-[0.15em] text-white transition hover:border-orange-700 hover:bg-orange-700"
            >
              {pageText(pageTexts, "products_landing_cta", "Bắt đầu khám phá")}
              <ArrowDown size={17} />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 38, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative order-1 min-h-[430px] overflow-hidden sm:min-h-[560px] lg:order-2 lg:min-h-[82vh]"
          >
            <div className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500 shadow-[0_45px_120px_rgba(234,88,12,0.2)] sm:h-[460px] sm:w-[460px] xl:h-[560px] xl:w-[560px]" />
            <div className="absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-400/30 sm:h-[540px] sm:w-[540px] xl:h-[650px] xl:w-[650px]" />
            <div className="absolute left-[9%] top-[16%] text-[10px] font-black uppercase tracking-[0.22em] text-orange-700">
              {pageText(pageTexts, "products_landing_visual_label", "ACBT / Core lineup")}
            </div>
            {heroVisuals.map(({ key, slot, image, alt }) => {
              const positions = [
                "left-1/2 top-[48%] z-30 h-[300px] -translate-x-1/2 -translate-y-1/2 sm:h-[430px] xl:h-[540px]",
                "left-[15%] top-[58%] z-20 h-[180px] -translate-y-1/2 -rotate-6 opacity-85 sm:h-[260px] xl:h-[320px]",
                "right-[7%] top-[55%] z-10 h-[165px] -translate-y-1/2 rotate-6 opacity-75 sm:h-[240px] xl:h-[300px]",
              ];
              return (
                <motion.img
                  key={key}
                  src={image}
                  alt={alt}
                  initial={{ opacity: 0, y: 35, rotate: slot === 1 ? -10 : slot === 2 ? 10 : 0 }}
                  animate={{ opacity: slot === 0 ? 1 : slot === 1 ? 0.85 : 0.75, y: 0 }}
                  transition={{ duration: 0.75, delay: 0.22 + slot * 0.12 }}
                  className={`absolute w-auto object-contain drop-shadow-[0_35px_45px_rgba(0,0,0,0.35)] ${positions[slot]}`}
                />
              );
            })}
            {heroProducts.length > 3 && (
              <div className="absolute bottom-5 right-5 z-40 flex items-center gap-2 sm:bottom-8 sm:right-8">
                <button
                  type="button"
                  onClick={() =>
                    setHeroIndex(
                      (current) =>
                        (current - 1 + heroProducts.length) % heroProducts.length,
                    )
                  }
                  className="grid h-11 w-11 place-items-center rounded-full border border-orange-200 bg-white/95 text-slate-950 shadow-lg transition hover:border-orange-500 hover:bg-orange-600 hover:text-white"
                  aria-label="Xem sản phẩm hero trước"
                >
                  <ChevronLeft size={19} />
                </button>
                <span className="min-w-14 rounded-full border border-orange-200 bg-white/95 px-3 py-2 text-center text-[10px] font-black tracking-wider text-orange-700 shadow-lg">
                  {visibleHeroIndex + 1}/{heroProducts.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setHeroIndex(
                      (current) => (current + 1) % heroProducts.length,
                    )
                  }
                  className="grid h-11 w-11 place-items-center rounded-full border border-orange-200 bg-white/95 text-slate-950 shadow-lg transition hover:border-orange-500 hover:bg-orange-600 hover:text-white"
                  aria-label="Xem sản phẩm hero tiếp theo"
                >
                  <ChevronRight size={19} />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <div id="product-showcase" className="scroll-mt-16">
        {loading ? (
          <section className="grid min-h-[60vh] place-items-center bg-[#fff4df]">
            <div className="text-center">
              <Loader className="mx-auto animate-spin text-orange-600" size={38} />
              <p className="mt-4 text-sm font-black uppercase tracking-[0.14em] text-slate-500">
                Đang tải bộ sưu tập
              </p>
            </div>
          </section>
        ) : coreProducts.length === 0 ? (
          <section className="grid min-h-[55vh] place-items-center bg-white px-5 text-center">
            <div>
              <AlertCircle className="mx-auto text-orange-400" size={46} />
              <h2 className="mt-5 text-2xl font-black">Chưa có sản phẩm chủ lực</h2>
            </div>
          </section>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {coreProducts.map((product, index) => (
              <ProductChapter key={productKey(product)} product={product} index={index} />
            ))}
          </motion.div>
        )}
      </div>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 border border-orange-100 bg-[#fff8ed] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-14">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">
              {pageText(pageTexts, "products_landing_closing_label", "Câu chuyện phía sau")}
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight tracking-[-0.05em] sm:text-5xl">
              {pageText(
                pageTexts,
                "products_landing_closing_title",
                "Mỗi sản phẩm bắt đầu từ một lựa chọn và một niềm tin",
              )}
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/gioi-thieu"
              className="inline-flex h-13 items-center justify-center gap-3 bg-orange-600 px-6 text-xs font-black uppercase tracking-wider text-white transition hover:bg-orange-700"
            >
              {pageText(pageTexts, "products_landing_closing_primary", "Câu chuyện thương hiệu")}
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/chat-luong"
              className="inline-flex h-13 items-center justify-center gap-3 border border-slate-300 bg-white px-6 text-xs font-black uppercase tracking-wider text-slate-950 transition hover:border-orange-500 hover:text-orange-700"
            >
              {pageText(pageTexts, "products_landing_closing_secondary", "Hành trình chất lượng")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
