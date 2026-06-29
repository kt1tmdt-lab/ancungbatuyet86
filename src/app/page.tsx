"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Factory,
  TrendingUp,
  Users,
  Play,
  ShoppingBag,
  Star,
  Newspaper,
  Leaf,
  Truck,
  Clock3,
  BadgeCheck,
  PackageCheck,
  ClipboardCheck,
  Store,
  HeartHandshake,
  Wheat,
  Award,
  type LucideIcon,
} from "lucide-react";
import {
  DEFAULT_SITE_CONFIG,
  normalizeSiteConfig,
  type SiteConfigData,
} from "@/lib/site-config-defaults";
import {
  DEFAULT_MARKETING_CONFIG,
  normalizeMarketingConfig,
  type HomeTextItem,
  type MarketingConfigData,
  type PageAssetItem,
} from "@/lib/marketing-config";

type Product = {
  id?: string | number;
  slug?: string;
  name?: string;
  image?: string;
  heroImage?: string | null;
  category?: string;
  categoryLabel?: string;
  tagline?: string;
  priceRange?: string;
  price?: string;
  purchaseUrl?: string;
  shortDescription?: string | null;
};

type HeroProduct = Product & {
  orbitImage?: string;
  purchaseUrl?: string;
  proof?: string;
  facts?: string[];
  stats?: { label: string; value: string }[];
};

type PostItem = {
  id?: string;
  slug?: string;
  title?: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  createdAt?: string;
  category?: { name?: string; slug?: string } | null;
};

type NewsEvidenceItem = {
  icon: LucideIcon;
  name?: string;
  title: string;
  desc: string;
  image?: string;
  href: string;
  label?: string;
};

type HeroBannerConfig = SiteConfigData["heroBanner"];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const HERO_CHARACTER_IMAGE = "/hero/ba-tuyet-character.png";
const FEATURED_PRODUCT_PRIORITY = [
  "chan-ga-khong-lo",
  "chan-ga-rut-xuong",
  "chan-ga",
  "tam-cay",
  "snack-banh-trang",
  "banh-trang",
  "dui-ga",
  "dui-ga-pho-mai",
];

const showcaseHeroProductsFallback: HeroProduct[] = [
  {
    slug: "chan-ga",
    category: "chan-ga",
    name: "Chân Gà Rút Xương Vị Cay Tê",
    tagline: "Giòn sần sật, vị cay tê đậm đà chuẩn vị ăn vặt Bà Tuyết.",
    price: "15.000đ",
    priceRange: "15.000đ - 180.000đ",
    image: "/uploads/1780482157869-chan-ga-rut-xuong-moi-png.png",
    orbitImage: "/uploads/1780482157869-chan-ga-rut-xuong-moi-png.png",
    purchaseUrl: "https://shopee.vn/an-vat-ba-tuyet-tam-cay",
    proof: "Hồ sơ sản phẩm, thông tin bao bì và quy trình kiểm soát chất lượng.",
    stats: [{ label: "Đơn đã bán", value: "5.000.000+" }],
    facts: ["Sản phẩm chủ lực", "Đóng gói tiện lợi", "Có hồ sơ kiểm soát"],
  },
  {
    slug: "tam-cay",
    category: "tam-cay",
    name: "Tăm Cay Bà Tuyết",
    tagline: "Snack tăm cay giòn ngon, cay nồng khơi lại hương vị tuổi thơ.",
    price: "10.000đ",
    priceRange: "10.000đ - 99.000đ",
    image: "/uploads/1780481867397-bimbim-tam-cay-10k.png",
    orbitImage: "/uploads/1780481867397-bimbim-tam-cay-10k.png",
    purchaseUrl: "https://shopee.vn/an-vat-ba-tuyet-tam-cay",
    proof: "Hồ sơ sản phẩm, hình ảnh bao bì và thông tin bán hàng.",
    stats: [{ label: "Đơn đã bán", value: "4.000.000+" }],
    facts: ["Vị cay đặc trưng", "Bao bì dễ nhận diện", "Dễ bán theo combo"],
  },
  {
    slug: "banh-trang",
    category: "banh-trang",
    name: "Snack Bánh Tráng Vị Sa Tế Bò",
    tagline: "Giòn tan rôm rốp đậm đà vị sa tế bò nướng.",
    price: "15.000đ",
    priceRange: "15.000đ - 79.000đ",
    image: "/uploads/1780482043582-snack-banh-trang-vi-sa-te-bo.png",
    orbitImage: "/uploads/1780482043582-snack-banh-trang-vi-sa-te-bo.png",
    purchaseUrl: "https://shopee.vn/an-vat-ba-tuyet-tam-cay",
    proof: "Thông tin bao bì, hồ sơ sản phẩm và quy cách đóng gói.",
    stats: [{ label: "Đơn đã bán", value: "2.500.000+" }],
    facts: ["Giòn tan", "Sa tế bò", "Đóng gói sạch"],
  },
  {
    slug: "dui-ga-pho-mai",
    category: "dui-ga",
    name: "Snack Đùi Gà Phô Mai Đóng Hũ",
    tagline: "Đùi gà giòn phồng thơm ngậy vị bột phô mai lắc.",
    price: "39.000đ",
    priceRange: "39.000đ - 75.000đ",
    image: "/uploads/1780482013661-dui-ga-pho-mai-700g.png",
    orbitImage: "/uploads/1780482013661-dui-ga-pho-mai-700g.png",
    purchaseUrl: "https://shopee.vn/an-vat-ba-tuyet-tam-cay",
    proof: "Thông tin in trên bao bì và hồ sơ sản phẩm.",
    stats: [{ label: "Đơn đã bán", value: "900.000+" }],
    facts: ["Vị phô mai", "Đóng hũ", "Dễ bảo quản"],
  },
];

function SectionTitle({
  label,
  title,
  description,
  align = "left",
}: {
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"
      }
    >
      <p className="mb-4 inline-flex border-l-4 border-orange-500 bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-700">
        {label}
      </p>
      <h2 className="text-4xl font-black leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

function InfoStrip({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-orange-100 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)] ${className}`}
    >
      {children}
    </div>
  );
}

function CurtainAction({
  href,
  children,
  icon,
  variant = "orange",
  className = "",
}: {
  href: string;
  children?: ReactNode;
  icon?: ReactNode;
  variant?: "orange" | "dark" | "white";
  className?: string;
}) {
  const isExternal = href.startsWith("http");
  const baseClass = `group/button relative isolate inline-flex overflow-hidden items-center justify-center gap-3 rounded-full border px-8 py-4 text-sm font-black shadow-sm outline-none transition-all duration-300 hover:-translate-y-1 focus-visible:-translate-y-1 ${className}`;
  const variantClass =
    variant === "dark"
      ? "border-slate-950 bg-slate-950 text-white hover:border-orange-600"
      : variant === "white"
        ? "border-orange-200 bg-white text-slate-950 hover:border-orange-600"
        : "border-orange-600 bg-orange-600 text-white hover:border-orange-700";
  const curtainClass =
    variant === "white" || variant === "dark"
      ? "bg-orange-600"
      : "bg-slate-950";
  const textClass =
    variant === "white"
      ? "relative z-10 inline-flex items-center gap-3 transition-colors duration-300 group-hover/button:text-white group-focus-visible/button:text-white"
      : "relative z-10 inline-flex items-center gap-3 text-white";

  const content = (
    <>
      <span
        className={`absolute inset-0 z-0 translate-y-full ${curtainClass} transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/button:translate-y-0 group-focus-visible/button:translate-y-0`}
      />
      <span className={textClass}>
        {children}
        {icon}
      </span>
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} ${variantClass}`}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={`${baseClass} ${variantClass}`}>
      {content}
    </Link>
  );
}

function getProductKey(product?: HeroProduct | Product) {
  return String(product?.slug || product?.id || product?.name || "");
}

function getProductImage(product?: Product | HeroProduct) {
  return product?.image || product?.heroImage || "";
}

function getFeaturedProductRank(product: Product | HeroProduct) {
  const candidates = [product.slug, product.category, product.categoryLabel, product.name]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  const rank = FEATURED_PRODUCT_PRIORITY.findIndex((key) =>
    candidates.some((value) => value.includes(key)),
  );

  return rank === -1 ? FEATURED_PRODUCT_PRIORITY.length : rank;
}

function sortFeaturedProducts<T extends Product | HeroProduct>(items: T[]) {
  return [...items].sort((a, b) => getFeaturedProductRank(a) - getFeaturedProductRank(b));
}

function toHeroProduct(product: HeroProduct): HeroProduct {
  const image = getProductImage(product);

  return {
    ...product,
    image,
    orbitImage:
      product.orbitImage || product.heroImage || product.image || image,
    tagline:
      product.tagline ||
      "Đồ ăn vặt Việt Nam đóng gói chỉn chu, hương vị đặc trưng, dễ ăn mọi lúc.",
    proof:
      product.proof ||
      "Thông tin in trên bao bì và hồ sơ sản phẩm có thể kiểm chứng.",
    facts:
      product.facts && product.facts.length > 0
        ? product.facts
        : ["Nguyên liệu chọn lọc", "Đóng gói sạch sẽ", "Giao toàn quốc"],
  };
}

async function fetchHomeProducts() {
  const featuredResponse = await fetch("/api/products?featured=true");
  const featuredData = await featuredResponse.json();

  if (Array.isArray(featuredData) && featuredData.length > 0) {
    return featuredData as HeroProduct[];
  }

  const allResponse = await fetch("/api/products");
  const allData = await allResponse.json();

  return Array.isArray(allData) ? (allData as HeroProduct[]) : [];
}

async function fetchHomePosts() {
  const response = await fetch("/api/posts");
  const data = await response.json();

  return Array.isArray(data) ? (data as PostItem[]) : [];
}

async function fetchHomeSiteConfig(): Promise<HeroBannerConfig> {
  const response = await fetch("/api/settings");
  const data = await response.json();

  return normalizeSiteConfig(data?.data).heroBanner;
}

async function fetchHomeMarketingConfig(): Promise<MarketingConfigData> {
  const response = await fetch("/api/settings/marketing", { cache: "no-store" });
  const data = await response.json();

  return normalizeMarketingConfig(data?.data);
}

function useHomeMarketingConfig() {
  const [config, setConfig] = useState<MarketingConfigData>(DEFAULT_MARKETING_CONFIG);

  useEffect(() => {
    fetchHomeMarketingConfig()
      .then(setConfig)
      .catch((error) => {
        console.error("Failed to load configurable home marketing data", error);
        setConfig(DEFAULT_MARKETING_CONFIG);
      });
  }, []);

  return config;
}

function homeTextValue(items: HomeTextItem[], key: string, fallback: string) {
  return items.find((item) => item.key === key)?.value || fallback;
}

function homeSectionEnabled(
  sections: MarketingConfigData["homeSections"],
  key: MarketingConfigData["homeSections"][number]["key"],
) {
  return sections.find((item) => item.key === key)?.enabled !== false;
}

function buildNewsEvidenceItems(posts: PostItem[]) {
  const icons = [BadgeCheck, ClipboardCheck, Store, Truck];

  return posts.slice(0, 4).map(
    (post, index): NewsEvidenceItem => ({
      icon: icons[index] || BadgeCheck,
      title: post.title || "Tin tức mới nhất",
      desc:
        post.excerpt ||
        "Cập nhật thông tin mới nhất từ thương hiệu Ăn Cùng Bà Tuyết.",
      image: post.coverImageUrl || undefined,
      href: post.slug ? `/tin-tuc/${post.slug}` : "/tin-tuc",
      label: post.category?.name || "Tin tức",
    }),
  );
}
// ==========================================
// 1. HERO SECTION - BRAND STORY STYLE
// ==========================================
function HeroSection() {
  const [products, setProducts] = useState<HeroProduct[]>(
    showcaseHeroProductsFallback,
  );
  const [activeProduct, setActiveProduct] = useState<HeroProduct>(
    showcaseHeroProductsFallback[0],
  );
  const [heroBanner, setHeroBanner] = useState<HeroBannerConfig>(
    DEFAULT_SITE_CONFIG.heroBanner,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeSiteConfig()
      .then(setHeroBanner)
      .catch((err) => {
        console.error("Failed to load site config from DB", err);
        setHeroBanner(DEFAULT_SITE_CONFIG.heroBanner);
      });

    fetchHomeProducts()
      .then((data) => {
        if (data.length > 0) {
          const dbProducts = data.map(toHeroProduct);
          const withImages = dbProducts.filter((product) =>
            getProductImage(product),
          );
          const nextProducts = sortFeaturedProducts(withImages.length > 0 ? withImages : dbProducts);
          setProducts(nextProducts);
          setActiveProduct(nextProducts[0]);
          setLoading(false);
          return;
        }

        setProducts(showcaseHeroProductsFallback);
        setActiveProduct(showcaseHeroProductsFallback[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load hero products from DB", err);
        setProducts(showcaseHeroProductsFallback);
        setActiveProduct(showcaseHeroProductsFallback[0]);
        setLoading(false);
      });
  }, []);

  const displayProducts = useMemo(() => products.slice(0, 5), [products]);
  const activeImage =
    activeProduct?.orbitImage || getProductImage(activeProduct);
  const activeStat = activeProduct?.stats?.[0];
  const brandName = "Ăn Cùng Bà Tuyết";
  const heroTitle = heroBanner.title || DEFAULT_SITE_CONFIG.heroBanner.title;

  return (
    <section className="relative overflow-hidden bg-[#fff3df] text-slate-950">
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#ea580c_0%,#f97316_45%,#166534_100%)]" />
      <div className="absolute inset-y-0 right-0 hidden w-[40%] bg-green-50/55 lg:block" />
      <div className="absolute left-[-12%] top-[-20%] h-96 w-96 rounded-full bg-red-200/25 blur-3xl" />
      <div className="absolute bottom-[-18%] right-[-10%] h-96 w-96 rounded-full bg-red-300/20 blur-3xl" />
      <div className="absolute right-[8%] top-[16%] hidden h-80 w-80 rounded-full border border-red-300/50 xl:block" />

      <div className="relative mx-auto grid min-h-[calc(100vh-72px)] w-full max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:px-10 lg:py-20 xl:gap-20 xl:py-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-20 pt-2 lg:pr-4 xl:pr-8"
        >
          <motion.div
            variants={fadeUp}
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-orange-200 bg-white/80 px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-orange-700 shadow-[0_18px_50px_rgba(234,88,12,0.10)] backdrop-blur-sm"
          >
            <Leaf size={14} />
            {loading ? "Đang tải sản phẩm" : "Thương hiệu Việt, làm chỉn chu cho bữa ăn vặt Việt"}
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="max-w-3xl text-5xl font-black leading-[0.98] tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-[4.2rem] xl:text-[5.25rem]"
          >
            {heroTitle.includes(brandName) ? (
              <>
                {heroTitle.replace(brandName, "").trim()}{" "}
                <span className="font-black text-orange-700">{brandName}</span>
              </>
            ) : (
              heroTitle
            )}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-xl text-base font-semibold leading-8 text-slate-700 sm:text-lg xl:max-w-2xl"
          >
            {heroBanner.subtitle}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <CurtainAction
              href={heroBanner.ctaLink}
              icon={<ArrowRight size={18} />}
              variant="orange"
              className="shadow-[0_20px_45px_rgba(234,88,12,0.25)]"
            >
              {heroBanner.ctaText}
            </CurtainAction>

            <CurtainAction
              href="/gioi-thieu"
              icon={<ShoppingBag size={17} />}
              variant="white"
              className="shadow-[0_14px_36px_rgba(15,23,42,0.08)]"
            >
              Giới thiệu
            </CurtainAction>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-14 grid max-w-xl overflow-hidden rounded-[1.5rem] border border-orange-100 bg-white/90 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:grid-cols-3 xl:max-w-2xl"
          >
            {[
              { label: "Không gian sản xuất", value: "Rõ ràng", icon: Factory },
              { label: "Bảo hiểm trách nhiệm sản phẩm", value: "PVI", icon: ShieldCheck },
              { label: "Sản phẩm được phân phối", value: "Toàn quốc", icon: Truck },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="border-b border-orange-100 p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-yellow-300">
                    <Icon size={20} strokeWidth={1.8} />
                  </div>
                  <p className="text-2xl font-black tracking-[-0.04em] text-slate-950">
                    {item.value}
                  </p>
                  <p className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="relative z-10 min-h-[700px] overflow-visible sm:min-h-[740px] lg:min-h-[780px] xl:min-h-[840px]"
        >
          <div className="absolute left-1/2 top-[8%] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-red-600 shadow-[0_35px_80px_rgba(185,28,28,0.20)] sm:h-[430px] sm:w-[430px] lg:top-[9%] xl:h-[520px] xl:w-[520px]">
            <Star className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 fill-yellow-300 text-yellow-300 opacity-80 xl:h-32 xl:w-32" />
          </div>
          <div className="absolute right-6 top-[18%] hidden h-48 w-48 rounded-full border border-red-300/60 bg-red-100/30 xl:block" />

          <div className="absolute left-0 top-[27%] z-30 hidden max-w-[220px] rounded-none bg-white/92 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur xl:block">
            <p className="mt-3 text-lg font-black leading-6 text-slate-950">
              Ngon từng miếng, sạch từ quy trình.
            </p>
          </div>

          <div className="absolute right-0 top-[14%] z-30 rounded-[1.35rem] border border-green-200 bg-green-50 px-5 py-4 text-center shadow-[0_24px_60px_rgba(22,101,52,0.12)] sm:right-4 xl:right-2 xl:px-6 xl:py-5">
            <p className="text-2xl font-black tracking-[-0.05em] text-green-700 xl:text-3xl">
              {activeStat?.value || "4.000.000+"}
            </p>
            <p className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-green-700">
              {activeStat?.label || "Đơn đã bán"}
            </p>
          </div>

          <img
            src={HERO_CHARACTER_IMAGE}
            alt="Nhân vật Bà Tuyết"
            className="absolute left-1/2 top-[8%] z-20 h-[350px] w-auto -translate-x-1/2 object-contain drop-shadow-[0_30px_50px_rgba(15,23,42,0.20)] sm:h-[420px] lg:top-[8%] xl:top-[7%] xl:h-[500px]"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={getProductKey(activeProduct)}
              initial={{ opacity: 0, y: 26, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="absolute bottom-32 left-1/2 z-30 w-[min(100%,440px)] -translate-x-1/2 rounded-[1.7rem] bg-white/94 p-5 shadow-[0_28px_80px_rgba(15,23,42,0.14)] backdrop-blur sm:bottom-36 sm:w-[min(100%,500px)] xl:bottom-40 xl:w-[min(92vw,530px)]"
            >
              <div className="grid gap-4 sm:grid-cols-[125px_1fr] sm:items-center xl:grid-cols-[145px_1fr]">
                <div className="rounded-[1.2rem] bg-orange-50 p-4">
                  {activeImage ? (
                    <img
                      src={activeImage}
                      alt={activeProduct?.name || "Sản phẩm"}
                      className="h-24 w-full object-contain xl:h-28"
                    />
                  ) : (
                    <div className="flex h-28 items-center justify-center text-2xl font-black text-orange-500">
                      BT
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-700">
                    Sản phẩm đại diện
                  </p>
                  <h3 className="mt-2 line-clamp-2 text-xl font-black leading-tight tracking-[-0.04em] text-slate-950 xl:text-2xl">
                    {activeProduct?.name}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                    {activeProduct?.tagline}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-3 left-1/2 z-40 flex w-full -translate-x-1/2 gap-2 overflow-x-auto rounded-[1.4rem] bg-white/95 p-3 shadow-[0_28px_80px_rgba(15,23,42,0.16)] backdrop-blur sm:bottom-4 xl:w-[min(94vw,680px)]">
            {displayProducts.map((product) => {
              const isActive =
                getProductKey(activeProduct) === getProductKey(product);
              const image = product.orbitImage || getProductImage(product);
              return (
                <button
                  key={getProductKey(product)}
                  type="button"
                  onMouseEnter={() => setActiveProduct(product)}
                  onFocus={() => setActiveProduct(product)}
                  onClick={() => setActiveProduct(product)}
                  className={`min-w-[118px] rounded-[1rem] border p-2 text-left transition-all ${isActive ? "border-orange-600 bg-orange-600 text-white shadow-[0_14px_30px_rgba(234,88,12,0.24)]" : "border-orange-100 bg-white text-slate-950 hover:border-orange-300"}`}
                >
                  <div className="mb-2 h-12 rounded-xl bg-white/80 p-1">
                    {image ? (
                      <img
                        src={image}
                        alt={product.name || "Sản phẩm"}
                        className="h-full w-full object-contain"
                      />
                    ) : null}
                  </div>
                  <p className="line-clamp-2 text-[10px] font-black leading-4">
                    {product.name}
                  </p>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// 2. CAPABILITY / STATS SECTION
// ==========================================
function StatsSection() {
  const [statsData, setStatsData] = useState<SiteConfigData["stats"]>(DEFAULT_SITE_CONFIG.stats);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const data = await response.json();
          setStatsData(normalizeSiteConfig(data?.data).stats);
        }
      } catch (err) {
        console.error("Failed to load stats from DB", err);
      }
    };
    loadStats();
  }, []);

  const stats: {
    value: string;
    label: string;
    desc: string;
    icon: LucideIcon;
  }[] = [
      {
        value: statsData.followers.value,
        label: statsData.followers.label,
        desc: statsData.followers.desc,
        icon: Users,
      },
      {
        value: statsData.orders.value,
        label: statsData.orders.label,
        desc: statsData.orders.desc,
        icon: TrendingUp,
      },
      {
        value: statsData.area.value,
        label: statsData.area.label,
        desc: statsData.area.desc,
        icon: Factory,
      },
      {
        value: statsData.insurance.value,
        label: statsData.insurance.label,
        desc: statsData.insurance.desc,
        icon: ShieldCheck,
      },
    ];

  return (
    <section className="bg-white px-0 py-0">
      <div className="w-full">
        <div className="flex flex-col gap-4 border-b border-orange-100 px-5 py-10 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-16">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">
              Năng lực thương hiệu
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-slate-950">
              Những con số tiêu biểu
            </h2>
          </div>
          <p className="max-w-xl text-xl font-black leading-relaxed text-orange-600 md:text-2xl">
            &ldquo;Ngon từng miếng, sạch từ quy trình&rdquo;
          </p>
        </div>

        <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.08 }}
                className="border-r border-b border-orange-100 bg-[#fffaf3] p-7 transition-all duration-300 hover:border-orange-300 lg:p-9"
              >
                <Icon size={30} className="text-orange-600" strokeWidth={1.8} />
                <p className="mt-8 text-4xl font-black tracking-[-0.05em] text-slate-950">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-black uppercase tracking-[0.14em] text-slate-800">
                  {stat.label}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {stat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 3. TRUST SECTION
// ==========================================
function TrustSection() {
  const { homeTexts } = useHomeMarketingConfig();
  const trustItems: { title: string; desc: string; icon: LucideIcon }[] = [
    {
      title: homeTextValue(homeTexts, "trust_item_1_title", "Kiểm soát đầu vào"),
      desc: homeTextValue(homeTexts, "trust_item_1_description", "Nguyên liệu được chọn lọc theo nguồn rõ ràng và kiểm tra trước khi đưa vào sản xuất."),
      icon: Wheat,
    },
    {
      title: homeTextValue(homeTexts, "trust_item_2_title", "Quy trình sản xuất rõ ràng"),
      desc: homeTextValue(homeTexts, "trust_item_2_description", "Các công đoạn được sắp xếp rõ ràng để giữ chất lượng ổn định giữa từng lô sản phẩm."),
      icon: ClipboardCheck,
    },
    {
      title: homeTextValue(homeTexts, "trust_item_3_title", "Đóng gói và tem nhãn"),
      desc: homeTextValue(homeTexts, "trust_item_3_description", "Bao bì thể hiện thông tin sản phẩm, thương hiệu và quy cách sử dụng."),
      icon: PackageCheck,
    },
    {
      title: homeTextValue(homeTexts, "trust_item_4_title", "Bảo chứng niềm tin"),
      desc: homeTextValue(homeTexts, "trust_item_4_description", "Bảo hiểm, giấy chứng nhận và hồ sơ liên quan giúp khách hàng có thêm cơ sở kiểm chứng."),
      icon: Award,
    },
  ];

  return (
    <section className="bg-[#fff8ed] py-0">
      <div className="w-full px-5 sm:px-8 lg:px-16">
        <SectionTitle
          label={homeTextValue(homeTexts, "trust_section_label", "Sứ mệnh")}
          title={homeTextValue(homeTexts, "trust_section_title", "Thay đổi định kiến về ăn vặt")}
          description={homeTextValue(homeTexts, "trust_section_description", "Ăn vặt ngon hơn khi khách hàng biết rõ nguyên liệu, quy trình và bằng chứng phía sau sản phẩm.")}
          align="center"
        />

        <div className="mt-10 grid gap-0 md:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.08 }}
                className="border-r border-b border-orange-100 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.05)] lg:p-9"
              >
                <div className="mb-7 flex h-14 w-14 items-center justify-center border border-orange-200 bg-orange-50 text-orange-700">
                  <Icon size={27} strokeWidth={1.8} />
                </div>
                <h3 className="text-xl font-black tracking-[-0.03em] text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 4. FEATURED PRODUCTS
// ==========================================
function ProductCard({ product, index }: { product: Product; index: number }) {
  const href = `/san-pham/${product.slug || product.id || ""}`;
  const image = getProductImage(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      className="h-full"
    >
      <Link
        href={href}
        className="group block h-full overflow-hidden border-r border-b border-orange-100 bg-white shadow-sm outline-none transition-all duration-300 hover:border-orange-300 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] focus-visible:border-orange-400"
      >
        <div className="relative overflow-hidden bg-[#fff8ed] p-5 lg:p-7">
          <div className="relative aspect-[4/3] overflow-hidden bg-white p-5 lg:p-7">
            {image ? (
              <img
                src={image}
                alt={product.name || "Sản phẩm"}
                className="relative z-10 h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="relative z-10 flex h-full items-center justify-center text-3xl font-black text-orange-500">
                BT
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 z-20 flex translate-y-full items-end bg-orange-600/95 p-6 text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0">
              <div className="translate-y-5 opacity-0 transition-all delay-100 duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em]">
                  Xem sản phẩm
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
                <p className="mt-3 line-clamp-3 text-sm font-semibold leading-6 text-orange-50">
                  {product.tagline ||
                    "Xem chi tiết sản phẩm, giá bán và kênh mua hàng chính hãng."}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute left-5 top-5 z-30 flex gap-2">
            <span className="bg-orange-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-sm">
              {product.categoryLabel || "Ăn vặt"}
            </span>
            <span className="bg-green-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-sm">
              Có sẵn
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-3 flex items-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={15} fill="currentColor" />
            ))}
          </div>

          <h3 className="line-clamp-1 text-xl font-black tracking-[-0.03em] text-slate-950 transition-colors group-hover:text-orange-600">
            {product.name || "Sản phẩm nổi bật"}
          </h3>

          <p className="mt-2 line-clamp-2 min-h-[48px] text-sm leading-6 text-slate-600">
            {product.tagline ||
              "Món ăn vặt đóng gói chỉn chu, vị ngon rõ ràng và phù hợp bán lẻ toàn quốc."}
          </p>

          <div className="mt-5 flex items-center justify-between border-t border-orange-100 pt-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                Giá từ
              </p>
              <p className="text-lg font-black text-slate-950">
                Xem chi tiết sản phẩm
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center bg-slate-950 text-white transition-all duration-300 group-hover:bg-orange-600">
              <ArrowRight size={18} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function FeaturedProducts() {
  const { homeTexts } = useHomeMarketingConfig();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeProducts()
      .then((data) => {
        setFeaturedProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed", err);
        setLoading(false);
      });
  }, []);

  const displayProducts = useMemo(() => {
    const fromDb = sortFeaturedProducts(featuredProducts.filter(
      (p) => p.category !== "khac" && getProductImage(p),
    ));
    return fromDb.length > 0 ? fromDb : showcaseHeroProductsFallback;
  }, [featuredProducts]);

  const loopProducts = useMemo(() => {
    let repeated = [...displayProducts];
    if (repeated.length > 0) {
      while (repeated.length < 10) {
        repeated = [...repeated, ...displayProducts];
      }
    }
    return repeated;
  }, [displayProducts]);

  return (
    <section className="relative overflow-hidden bg-white py-12">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); }
        }
        .marquee-container:hover .marquee-track-animation {
          animation-play-state: paused;
        }
      `,
        }}
      />

      <div className="w-full px-5 sm:px-8 lg:px-16">
        <div className="flex flex-col gap-6 border-b border-orange-100 px-5 pb-8 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-16">
          <SectionTitle
            label={homeTextValue(homeTexts, "products_section_label", "Sản phẩm chủ lực")}
            title={homeTextValue(homeTexts, "products_section_title", "Sản phẩm nổi bật")}
            description={homeTextValue(homeTexts, "products_section_description", "Giới thiệu nhanh các dòng sản phẩm chính để khách hàng bấm xem chi tiết ở từng trang riêng.")}
          />

          <CurtainAction
            href="/san-pham"
            icon={<ArrowRight size={16} />}
            variant="white"
            className="w-fit rounded-none px-5 py-3 text-orange-700"
          >
            Xem tất cả sản phẩm
          </CurtainAction>
        </div>

        <div className="relative mt-10 w-full overflow-hidden marquee-container">
          <AnimatePresence mode="wait">
            {loading && displayProducts.length === 0 ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-6 w-full"
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[520px] w-[350px] shrink-0 animate-pulse border border-orange-100 bg-[#fff8ed]"
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="products"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex"
              >
                <div
                  className="flex gap-6 marquee-track-animation"
                  style={{
                    animation: "marqueeScroll 35s linear infinite",
                    width: "max-content",
                  }}
                >
                  {/* First set of items */}
                  {loopProducts.map((product, i) => (
                    <div
                      key={`set1-${product.id || product.slug || ""}-${i}`}
                      className="w-[310px] sm:w-[350px] shrink-0 h-full"
                    >
                      <ProductCard product={product} index={i} />
                    </div>
                  ))}

                  {/* Second duplicate set of items for seamless looping */}
                  {loopProducts.map((product, i) => (
                    <div
                      key={`set2-${product.id || product.slug || ""}-${i}`}
                      className="w-[310px] sm:w-[350px] shrink-0 h-full"
                    >
                      <ProductCard product={product} index={i} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUsFromDb() {
  const { homeTexts } = useHomeMarketingConfig();
  const [items, setItems] = useState<NewsEvidenceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomePosts()
      .then((posts) => {
        setItems(buildNewsEvidenceItems(posts));
      })
      .catch((error) => {
        console.error("Failed to load news evidence section from DB", error);
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white py-0">
      <div className="w-full px-5 sm:px-8 lg:px-16">
        <SectionTitle
          label={homeTextValue(homeTexts, "news_section_label", "Tin tức & bằng chứng")}
          title={homeTextValue(homeTexts, "news_section_title", "Từ sản phẩm thật đến hệ thống phân phối thật")}
          description={homeTextValue(homeTexts, "news_section_description", "Không phải hiệu ứng nào cũng tạo ra giá trị. Khách hàng cần thấy những thứ thật, có bằng chứng, có câu chuyện cụ thể.")}
        />

        <div className="mt-10 grid gap-0 md:grid-cols-2">
          {loading &&
            items.length === 0 &&
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="grid min-h-[320px] animate-pulse overflow-hidden border-r border-b border-orange-100 bg-[#fffaf3] lg:grid-cols-[0.95fr_1.05fr]"
              >
                <div className="bg-orange-50" />
                <div className="p-7">
                  <div className="h-9 w-9 bg-orange-100" />
                  <div className="mt-16 h-6 w-2/3 bg-orange-100" />
                  <div className="mt-4 h-4 w-full bg-orange-100" />
                  <div className="mt-3 h-4 w-4/5 bg-orange-100" />
                </div>
              </div>
            ))}

          {!loading && items.length === 0 && (
            <div className="col-span-full border border-orange-100 bg-[#fffaf3] p-8 text-center">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-700">
                Chưa có tin tức CMS
              </p>
              <p className="mt-3 text-slate-600">
                Hãy xuất bản bài viết trong CMS để section này tự hiển thị tin
                tức thật.
              </p>
            </div>
          )}

          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={item.href}
                  className="group/news relative grid h-full overflow-hidden border-r border-b border-orange-100 bg-[#fffaf3] shadow-sm outline-none transition-all hover:border-orange-300 hover:bg-white focus-visible:border-orange-400 lg:grid-cols-[0.95fr_1.05fr]"
                >
                  <div className="relative min-h-[260px] bg-slate-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/news:scale-[1.035] group-focus-visible/news:scale-[1.035]"
                      />
                    ) : (
                      <div className="flex h-full min-h-[260px] items-center justify-center bg-orange-50 text-4xl font-black text-orange-500">
                        NEWS
                      </div>
                    )}
                  </div>
                  <div className="relative z-10 flex flex-col justify-between p-7">
                    <Icon
                      size={34}
                      className="text-orange-600 transition-colors duration-300 group-hover/news:text-orange-700"
                      strokeWidth={1.8}
                    />
                    <div className="mt-10">
                      {item.label && (
                        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-orange-700">
                          {item.label}
                        </p>
                      )}
                      <h3 className="text-2xl font-black tracking-[-0.04em] text-slate-950">
                        {item.title}
                      </h3>
                      <p className="mt-3 leading-7 text-slate-600">
                        {item.desc}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-orange-700">
                        Đọc bài viết
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover/news:translate-x-1"
                        />
                      </span>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute inset-0 z-30 flex translate-y-full items-end bg-orange-600/96 p-7 text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/news:translate-y-0 group-focus-visible/news:translate-y-0">
                    <div className="translate-y-6 opacity-0 transition-all delay-100 duration-500 group-hover/news:translate-y-0 group-hover/news:opacity-100 group-focus-visible/news:translate-y-0 group-focus-visible/news:opacity-100">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-100">
                        {item.label || "Tin tức"}
                      </p>
                      <h3 className="mt-3 max-w-xl text-2xl font-black tracking-[-0.04em] text-white">
                        {item.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 max-w-xl text-sm font-semibold leading-7 text-orange-50">
                        {item.desc}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-orange-700">
                        Đọc bài viết
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MarketingAssetsSection() {
  const [config, setConfig] = useState<MarketingConfigData>(
    DEFAULT_MARKETING_CONFIG,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeMarketingConfig()
      .then(setConfig)
      .catch((error) => {
        console.error("Failed to load marketing assets from DB", error);
        setConfig(DEFAULT_MARKETING_CONFIG);
      })
      .finally(() => setLoading(false));
  }, []);

  const hasContent =
    config.press.length > 0 ||
    config.feedback.length > 0 ||
    config.videos.length > 0;

  if (!loading && !hasContent) return null;

  return (
    <section id="factory-proof" className="scroll-mt-24 bg-[#fff8ed] py-0">
      <div className="w-full px-5 py-14 sm:px-8 lg:px-16 lg:py-20">
        <SectionTitle
          label="Niềm tin từ khách hàng"
          title="Khách hàng và đối tác nói gì về chúng tôi"
          description="Giấy chứng nhận, bảo hiểm, phản hồi khách hàng, quy trình sản xuất và truyền thông được gom lại để người xem có thêm cơ sở kiểm chứng."
        />

        {loading ? (
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-44 animate-pulse border border-orange-100 bg-white"
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <div className="border border-orange-100 bg-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <Newspaper className="text-orange-600" size={22} />
                <h3 className="text-lg font-black text-slate-950">Báo chí</h3>
              </div>
              <div className="space-y-4">
                {config.press.slice(0, 3).map((item) => (
                  <a
                    key={item.id}
                    href={item.link || "#"}
                    target={item.link ? "_blank" : undefined}
                    rel={item.link ? "noopener noreferrer" : undefined}
                    className="block border-l-4 border-orange-500 bg-orange-50 p-4 transition hover:bg-orange-100"
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-700">
                      {item.sourceName || "Báo chí"} · {item.publishDate || "Mới"}
                    </p>
                    <p className="mt-2 text-sm font-bold leading-6 text-slate-900">
                      {item.title || "Bài viết truyền thông"}
                    </p>
                  </a>
                ))}
                {config.press.length === 0 && (
                  <p className="text-sm text-slate-500">Chưa có bài báo nào.</p>
                )}
              </div>
            </div>

            <div className="border border-orange-100 bg-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <Star className="text-orange-600" size={22} />
                <h3 className="text-lg font-black text-slate-950">Khách hàng</h3>
              </div>
              <div className="space-y-4">
                {config.feedback.slice(0, 3).map((item) => (
                  <div key={item.id} className="bg-[#fff8ed] p-4">
                    <div className="text-sm font-black text-orange-600">
                      {"★".repeat(item.rating)}
                    </div>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                      “{item.comment || "Sản phẩm rất ngon và chỉn chu."}”
                    </p>
                    <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      {item.customerName || "Khách hàng"} · {item.roleOrLocation || "Việt Nam"}
                    </p>
                  </div>
                ))}
                {config.feedback.length === 0 && (
                  <p className="text-sm text-slate-500">Chưa có đánh giá nào.</p>
                )}
              </div>
            </div>

            <div className="border border-orange-100 bg-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <Play className="text-orange-600" size={22} />
                <h3 className="text-lg font-black text-slate-950">Video</h3>
              </div>
              <div className="space-y-4">
                {config.videos.slice(0, 3).map((item) => (
                  <a
                    key={item.id}
                    href={item.url || "#"}
                    target={item.url ? "_blank" : undefined}
                    rel={item.url ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4 bg-slate-950 p-4 text-white transition hover:bg-orange-600"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-950">
                      <Play size={18} />
                    </span>
                    <span>
                      <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-orange-100">
                        {item.platform === "youtube" ? "YouTube" : "TikTok"}
                      </span>
                      <span className="mt-1 block text-sm font-bold">
                        {item.title || item.videoId || "Video truyền thông"}
                      </span>
                    </span>
                  </a>
                ))}
                {config.videos.length === 0 && (
                  <p className="text-sm text-slate-500">Chưa có video nào.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function TrustEvidenceSections() {
  const [config, setConfig] = useState<MarketingConfigData>(DEFAULT_MARKETING_CONFIG);

  useEffect(() => {
    fetchHomeMarketingConfig()
      .then(setConfig)
      .catch((error) => {
        console.error("Failed to load trust sections from DB", error);
        setConfig(DEFAULT_MARKETING_CONFIG);
      });
  }, []);

  const priorityKeys = [
    "food_safety_certificate",
    "pvi_insurance",
    "production_process",
    "brand_story",
  ];
  const enabledItems = config.trustSections.filter((item) => item.enabled);
  const items = priorityKeys
    .map((key) => enabledItems.find((item) => item.key === key))
    .filter((item): item is (typeof enabledItems)[number] => Boolean(item))
    .concat(enabledItems.filter((item) => !priorityKeys.includes(item.key)))
    .slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section id="uy-tin" className="scroll-mt-24 border-y border-orange-100 bg-[#fffaf3]">
      <div className="px-5 py-12 sm:px-8 lg:px-16">
        <div className="mb-7 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-700">
              <ShieldCheck size={14} />
              Bằng chứng thương hiệu
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-950">
              Những bằng chứng giúp khách hàng yên tâm lựa chọn Ăn Cùng Bà Tuyết
            </h2>
          </div>
          <Link
            href="/gioi-thieu#ho-so-uy-tin"
            className="inline-flex w-fit items-center gap-2 border border-orange-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-orange-700 transition hover:border-orange-500 hover:bg-orange-600 hover:text-white"
          >
            Xem hồ sơ đầy đủ
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item, index) => {
            return (
              <article
                key={item.id}
                className="group grid h-full grid-cols-[92px_1fr] overflow-hidden border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
              >
                <div className="relative h-full min-h-[132px] overflow-hidden bg-slate-100">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-orange-50 text-orange-500">
                      <ShieldCheck size={28} />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-600">
                    Bằng chứng 0{index + 1}
                  </p>
                  <h3 className="mt-2 line-clamp-2 text-base font-black leading-tight tracking-[-0.02em] text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-slate-500">
                    {item.description}
                  </p>
                  {item.linkUrl && (
                    <Link
                      href={item.linkUrl}
                      className="mt-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-orange-700 transition hover:text-orange-900 hover:underline"
                    >
                      Chi tiết
                      <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 5. FACTORY PROOF SECTION
// ==========================================
function FactoryProofSection() {
  const { homeTexts, pageAssets } = useHomeMarketingConfig();
  const [activeProofIndex, setActiveProofIndex] = useState(0);
  const fallbackProofs = [
    {
      title: "Nguyên liệu đầu vào",
      text: "Nguyên liệu được chọn lọc theo nguồn rõ ràng, ghi nhận thông tin và kiểm tra trước khi đưa vào sản xuất.",
      icon: Wheat,
    },
    {
      title: "Quy trình sản xuất",
      text: "Khu sơ chế, chế biến và đóng gói được trình bày bằng hình ảnh thực tế để khách hàng hiểu cách sản phẩm được làm ra.",
      icon: Factory,
    },
    {
      title: "Đóng gói - tem nhãn",
      text: "Bao bì, tem nhãn và thông tin sản phẩm được chuẩn hóa để dễ nhận diện, dễ bảo quản và phù hợp phân phối toàn quốc.",
      icon: PackageCheck,
    },
    {
      title: "Bảo chứng niềm tin",
      text: "Bảo hiểm PVI, giấy chứng nhận và hồ sơ liên quan giúp khách hàng có cơ sở kiểm chứng trước khi lựa chọn.",
      icon: ShieldCheck,
    },
    {
      title: "Báo chí / truyền thông",
      text: "Các nội dung báo chí và truyền thông được gom lại để kể câu chuyện thương hiệu bằng nguồn tham chiếu rõ ràng.",
      icon: Newspaper,
    },
  ];
  const assetByKey = pageAssets.reduce<Record<string, PageAssetItem>>((acc, item) => {
    if (item.key) acc[item.key] = item;
    return acc;
  }, {});
  const imageAsset = assetByKey.home_factory_proof_image;
  const proofImageFallbacks = [
    "/hero/chan-ga-plate.png",
    "/bento/bento-factory.png",
    "/hero/chan-ga-poster.png",
    "/bento/bento-insurance.png",
    "/bento/bento-tiktok.png",
  ];
  const proofs = fallbackProofs.map((proof, index) => {
    const asset = assetByKey[`home_factory_proof_${index + 1}`];
    const title = homeTextValue(homeTexts, `factory_proof_${index + 1}_title`, proof.title);
    return {
      ...proof,
      title,
      text: asset?.label || proof.text,
      imageUrl: asset?.imageUrl || proofImageFallbacks[index] || imageAsset?.imageUrl || "/bento/bento-factory.png",
      linkUrl: asset?.linkUrl || "",
    };
  });
  const activeProof = proofs[activeProofIndex] || proofs[0];
  const activeProofImage = activeProof.imageUrl || imageAsset?.imageUrl || "/bento/bento-factory.png";
  const activeProofLink = activeProof.linkUrl || imageAsset?.linkUrl || "";

  const imageNode = (
    <img
      src={activeProofImage}
      alt={activeProof.title || imageAsset?.label || "Bằng chứng thương hiệu Ăn Cùng Bà Tuyết"}
      className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
    />
  );

  return (
    <section className="bg-[#fff8ed] py-0">
      <div className="grid w-full gap-0 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="h-full border-y border-r border-orange-200 bg-white p-0 shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
        >
          <div className="relative min-h-[560px] overflow-hidden bg-slate-100 lg:min-h-[680px]">
            {activeProofLink ? (
              <a
                href={activeProofLink}
                target={activeProofLink.startsWith("http") ? "_blank" : undefined}
                rel={activeProofLink.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {imageNode}
              </a>
            ) : (
              imageNode
            )}
            <div className="absolute inset-x-0 bottom-0 bg-white/92 p-6 backdrop-blur-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">
                {activeProof.title}
              </p>
              <h3 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950">
                {activeProof.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {activeProof.text}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="p-5 sm:p-8 lg:p-16"
        >
          <SectionTitle
            label={homeTextValue(homeTexts, "factory_section_label", "Bằng chứng thương hiệu")}
            title={homeTextValue(homeTexts, "factory_section_title", "Năng lực sản xuất rõ ràng trước khi nói về bán hàng")}
            description={homeTextValue(homeTexts, "factory_section_description", "Những bằng chứng giúp khách hàng yên tâm lựa chọn Ăn Cùng Bà Tuyết.")}
          />

          <div className="mt-8 grid gap-2">
              {proofs.map((proof, index) => {
                const Icon = proof.icon;
                const isActive = activeProofIndex === index;
                return (
                  <button
                    key={`${proof.title}-${index}`}
                    type="button"
                    onClick={() => setActiveProofIndex(index)}
                    className={`flex items-center gap-4 border p-4 text-left transition ${
                      isActive
                        ? "border-orange-600 bg-orange-600 text-white shadow-[0_16px_35px_rgba(234,88,12,0.18)]"
                        : "border-orange-100 bg-white text-slate-800 hover:border-orange-300"
                    }`}
                  >
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${isActive ? "bg-white text-orange-600" : "bg-orange-50 text-orange-600"}`}>
                      <Icon size={20} />
                    </span>
                    <span>
                      <span className="block text-[10px] font-black uppercase tracking-[0.16em] opacity-75">
                        Mục 0{index + 1}
                      </span>
                      <span className="mt-1 block text-sm font-black">{proof.title}</span>
                    </span>
                  </button>
                );
              })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// 7. PROCESS SECTION
// ==========================================
function ProcessSection() {
  const { homeTexts, homeSections } = useHomeMarketingConfig();
  if (!homeSectionEnabled(homeSections, "process")) return null;

  const steps = [
    {
      title: homeTextValue(homeTexts, "process_step_1_title", "Chọn nguyên liệu"),
      desc: homeTextValue(homeTexts, "process_step_1_description", "Ưu tiên nguồn rõ ràng, kiểm tra đầu vào trước khi sản xuất."),
      icon: Leaf,
    },
    {
      title: homeTextValue(homeTexts, "process_step_2_title", "Sơ chế và sản xuất"),
      desc: homeTextValue(homeTexts, "process_step_2_description", "Kiểm soát từng công đoạn để giữ chất lượng ổn định giữa các lô hàng."),
      icon: Factory,
    },
    {
      title: homeTextValue(homeTexts, "process_step_3_title", "Đóng gói và tem nhãn"),
      desc: homeTextValue(homeTexts, "process_step_3_description", "Bao bì rõ thông tin, dễ vận chuyển, dễ trưng bày và phù hợp bán online."),
      icon: PackageCheck,
    },
    {
      title: homeTextValue(homeTexts, "process_step_4_title", "Giao hàng toàn quốc"),
      desc: homeTextValue(homeTexts, "process_step_4_description", "Kết nối sàn thương mại điện tử để khách đặt hàng nhanh và thuận tiện."),
      icon: Truck,
    },
  ];

  return (
    <section className="bg-[#fff8ed] py-0">
      <div className="w-full px-5 sm:px-8 lg:px-16">
        <div className="grid gap-0 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch">
          <div className="border-r border-orange-100 bg-[#fffaf3] p-5 sm:p-8 lg:sticky lg:top-28 lg:min-h-[520px] lg:p-16">
            <p className="mb-4 inline-flex items-center gap-2 border-l-4 border-orange-500 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-700">
              <Clock3 size={14} />
              {homeTextValue(homeTexts, "process_label", "Quy trình sản xuất")}
            </p>

            <h2 className="text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-5xl">
              {homeTextValue(homeTexts, "process_title", "Từ nguyên liệu đến sản phẩm đóng gói")}
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              {homeTextValue(homeTexts, "process_description", "Bố cục quy trình giúp người xem hiểu đây là doanh nghiệp sản xuất thực phẩm, không chỉ là shop bán hàng hoặc landing page quảng cáo.")}
            </p>
          </div>

          <div className="grid gap-0">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: i * 0.08 }}
                  className="grid gap-5 border-b border-orange-100 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:grid-cols-[auto_1fr] lg:p-8"
                >
                  <div className="flex h-16 w-16 items-center justify-center bg-orange-600 text-white">
                    <Icon size={28} />
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">
                      Bước 0{i + 1}
                    </p>
                    <h3 className="mt-1 text-2xl font-black tracking-[-0.04em] text-slate-950">
                      {step.title}
                    </h3>
                    <p className="mt-2 leading-7 text-slate-600">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 8. BRAND STORY
// ==========================================
function BrandStory() {
  const { homeTexts, homeSections } = useHomeMarketingConfig();
  if (!homeSectionEnabled(homeSections, "brand_story")) return null;

  const milestones = [
    {
      year: homeTextValue(homeTexts, "brand_story_milestone_1_year", "2022"),
      event: homeTextValue(homeTexts, "brand_story_milestone_1_event", "Bắt đầu từ đam mê ẩm thực và các nội dung gần gũi với cộng đồng."),
    },
    {
      year: homeTextValue(homeTexts, "brand_story_milestone_2_year", "2023"),
      event: homeTextValue(homeTexts, "brand_story_milestone_2_event", "Phát triển thương hiệu Ăn Cùng Bà Tuyết với định hướng đồ ăn vặt sạch."),
    },
    {
      year: homeTextValue(homeTexts, "brand_story_milestone_3_year", "2024"),
      event: homeTextValue(homeTexts, "brand_story_milestone_3_event", "Mở rộng trên TikTok Shop, xây dựng cộng đồng khách hàng trung thành."),
    },
    {
      year: homeTextValue(homeTexts, "brand_story_milestone_4_year", "2025"),
      event: homeTextValue(homeTexts, "brand_story_milestone_4_event", "Đẩy mạnh nhà máy, quy trình và tiêu chuẩn hóa sản phẩm."),
    },
  ];

  return (
    <section id="brand-story" className="bg-white py-0">
      <div className="grid w-full gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
        <div className="border-r border-orange-100 bg-[#fffaf3] p-5 sm:p-8 lg:sticky lg:top-28 lg:h-fit lg:min-h-[520px] lg:p-16">
          <span className="mb-5 inline-flex items-center gap-2 border-l-4 border-orange-500 bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-700">
            <BadgeCheck size={14} />
            {homeTextValue(homeTexts, "brand_story_label", "Câu chuyện thương hiệu")}
          </span>

          <h2 className="text-4xl font-black leading-tight tracking-[-0.05em] text-slate-950 sm:text-5xl">
            {homeTextValue(homeTexts, "brand_story_title", "Từ món ăn quen thuộc đến thương hiệu có quy trình")}
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            {homeTextValue(homeTexts, "brand_story_description", "Từ một căn bếp nhỏ với công thức gia truyền, Ăn Cùng Bà Tuyết đã phát triển thành thương hiệu ăn vặt có xưởng sản xuất riêng, quy trình kiểm soát chất lượng rõ ràng và hàng triệu khách hàng tin dùng.")}
          </p>

          <div className="mt-8">
            <CurtainAction
              href="/gioi-thieu"
              icon={<ArrowRight size={17} />}
              variant="white"
              className="rounded-none px-6 py-3"
            >
              {homeTextValue(homeTexts, "brand_story_cta", "Đọc toàn bộ câu chuyện")}
            </CurtainAction>
          </div>
        </div>

        <div className="grid gap-0">
          {milestones.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: 22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-90px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="grid border-b border-orange-100 bg-white p-7 transition-all hover:border-orange-300 sm:grid-cols-[140px_1fr] sm:items-center lg:p-9"
            >
              <p className="text-5xl font-black tracking-[-0.08em] text-orange-600">
                {item.year}
              </p>
              <p className="mt-4 text-base font-semibold leading-8 text-slate-700 sm:mt-0">
                {item.event}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 9. CTA SECTION
// ==========================================
function CTASection() {
  return (
    <section className="bg-[#fff8ed] px-0 py-0">
      <div className="grid w-full overflow-hidden border-y border-orange-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[1fr_0.9fr]">
        <div className="p-5 sm:p-8 lg:p-16">
          <p className="mb-5 inline-flex items-center gap-2 bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-700">
            <HeartHandshake size={14} />
            Mua sản phẩm chính hãng
          </p>

          <h2 className="text-4xl font-black leading-tight tracking-[-0.05em] text-slate-950 sm:text-6xl">
            Đặt hàng qua kênh phân phối chính thức
          </h2>

          <p className="mt-6 max-w-xl text-base font-medium leading-8 text-slate-600 sm:text-lg">
            Sản phẩm đóng gói chỉn chu, có thông tin rõ ràng và giao hàng toàn
            quốc qua các nền tảng quen thuộc.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <CurtainAction
              href="https://tiktok.com/@batuyethanhvi"
              icon={<Play size={15} className="fill-white" />}
              variant="dark"
              className="rounded-none px-8 py-5"
            >
              Mua qua TikTok Shop
            </CurtainAction>

            <CurtainAction
              href="https://shopee.vn/an-vat-ba-tuyet-tam-cay"
              icon={<ArrowRight size={18} />}
              variant="orange"
              className="rounded-none px-8 py-5"
            >
              Đặt hàng Shopee
            </CurtainAction>
          </div>
        </div>

        <div className="relative min-h-[420px] bg-[#f7ead8] p-8 lg:min-h-[520px]">
          <div className="absolute left-0 top-0 h-full w-8 bg-orange-600" />
          <img
            src="/hero/chan-ga-plate.png"
            alt="Sản phẩm Bà Tuyết"
            className="absolute bottom-12 left-1/2 h-64 w-auto -translate-x-1/2 object-contain drop-shadow-[0_30px_45px_rgba(15,23,42,0.22)]"
          />
          <div className="absolute bottom-0 right-0 bg-white p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">
              Ăn Cùng Bà Tuyết
            </p>
            <p className="mt-1 text-sm font-bold text-slate-700">
              Sản phẩm ăn vặt đóng gói
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// MAIN EXPORT
// ==========================================
export default function HomePage() {
  return (
    <main className="antialiased selection:bg-orange-500 selection:text-white">
      <HeroSection />
      <StatsSection />
      <TrustSection />
      <FeaturedProducts />
      <FactoryProofSection />
      <WhyChooseUsFromDb />
      <MarketingAssetsSection />
      <TrustEvidenceSections />
      <ProcessSection />
      <BrandStory />
      <CTASection />
    </main>
  );
}
