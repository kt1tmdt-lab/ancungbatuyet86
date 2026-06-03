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

type Product = {
  id?: string | number;
  slug?: string;
  name?: string;
  image?: string;
  category?: string;
  categoryLabel?: string;
  tagline?: string;
  priceRange?: string;
  price?: string;
};

type HeroProduct = Product & {
  orbitImage?: string;
  purchaseUrl?: string;
  proof?: string;
  facts?: string[];
  stats?: { label: string; value: string }[];
};

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

const showcaseHeroProductsFallback: HeroProduct[] = [
  {
    slug: "chan-ga-rut-xuong",
    category: "chan-ga",
    name: "Chân Gà Rút Xương",
    tagline: "Giòn sần sật, vị cay đậm, đóng gói tiện lợi cho khách ăn vặt.",
    price: "89.000đ",
    priceRange: "45.000đ - 189.000đ",
    image: "/hero/chan-ga-plate.png",
    orbitImage: "/hero/chan-ga-plate.png",
    purchaseUrl: "https://shopee.vn/nmtvlog99",
    proof: "Hồ sơ sản phẩm, thông tin bao bì và quy trình kiểm soát chất lượng.",
    stats: [{ label: "Đơn đã bán", value: "2.000.000+" }],
    facts: ["Sản phẩm chủ lực", "Đóng gói tiện lợi", "Có hồ sơ kiểm soát"],
  },
  {
    slug: "chan-ga-ba-tuyet",
    category: "chan-ga",
    name: "Chân Gà Bà Tuyết",
    tagline: "Dòng sản phẩm nhận diện thương hiệu, phù hợp bán lẻ và combo.",
    price: "Liên hệ",
    priceRange: "Theo combo",
    image: "/hero/chan-ga-poster.png",
    orbitImage: "/hero/chan-ga-poster.png",
    purchaseUrl: "https://shopee.vn/nmtvlog99",
    proof: "Minh chứng bằng bao bì, hình ảnh sản phẩm và nội dung truyền thông.",
    stats: [{ label: "Sản phẩm", value: "Nổi bật" }],
    facts: ["Bao bì rõ thương hiệu", "Dễ trưng bày", "Phù hợp bán lẻ"],
  },
  {
    slug: "dui-ga-pho-mai",
    category: "dui-ga",
    name: "Đùi Gà Phô Mai",
    tagline: "Vị béo thơm, màu sắc bắt mắt, đóng hũ gọn và dễ vận chuyển.",
    price: "Liên hệ",
    priceRange: "Theo hũ",
    image: "/hero/dui-ga-pho-mai.png",
    orbitImage: "/hero/dui-ga-pho-mai.png",
    purchaseUrl: "https://shopee.vn/nmtvlog99",
    proof: "Thông tin in trên bao bì và hồ sơ sản phẩm.",
    stats: [{ label: "Dạng", value: "Hũ tiện lợi" }],
    facts: ["Vị phô mai", "Đóng hũ", "Dễ bảo quản"],
  },
  {
    slug: "tam-cay",
    category: "tam-cay",
    name: "Tăm Cay Bà Tuyết",
    tagline: "Vị cay mạnh, bao bì nổi bật, phù hợp nhóm khách trẻ thích ăn vặt.",
    price: "35.000đ",
    priceRange: "15.000đ - 99.000đ",
    image: "/hero/tam-cay-pack.png",
    orbitImage: "/hero/tam-cay-pack.png",
    purchaseUrl: "https://shopee.vn/nmtvlog99",
    proof: "Hồ sơ sản phẩm, hình ảnh bao bì và thông tin bán hàng.",
    stats: [{ label: "Đơn đã bán", value: "1.500.000+" }],
    facts: ["Vị cay đặc trưng", "Bao bì dễ nhận diện", "Dễ bán theo combo"],
  },
  {
    slug: "banh-trang-rong-bien",
    category: "banh-trang",
    name: "Snack Bánh Tráng Vị Rong Biển",
    tagline: "Giòn thơm, vị rong biển dễ ăn, bao bì sáng và sạch.",
    price: "29.000đ",
    priceRange: "12.000đ - 79.000đ",
    image: "/hero/banh-trang-rong-bien.png",
    orbitImage: "/hero/banh-trang-rong-bien.png",
    purchaseUrl: "https://shopee.vn/nmtvlog99",
    proof: "Thông tin bao bì, hồ sơ sản phẩm và quy cách đóng gói.",
    stats: [{ label: "Đơn đã bán", value: "800.000+" }],
    facts: ["Vị rong biển", "Giòn thơm", "Đóng gói sạch"],
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
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
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

function InfoStrip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`border border-orange-100 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)] ${className}`}>
      {children}
    </div>
  );
}

function getProductKey(product?: HeroProduct | Product) {
  return String(product?.slug || product?.id || product?.name || "");
}

function mergeFeaturedProducts(data: HeroProduct[]) {
  return showcaseHeroProductsFallback.map((fallback) => {
    const matched = data.find((p) => {
      const bySlug = p.slug && p.slug === fallback.slug;
      const byCategory = p.category && p.category === fallback.category;
      const byName =
        p.name &&
        fallback.name &&
        p.name.toLowerCase().includes(fallback.name.toLowerCase());

      return bySlug || byCategory || byName;
    });

    return {
      ...fallback,
      ...(matched || {}),
      image: fallback.image,
      orbitImage: fallback.orbitImage,
      tagline: matched?.tagline || fallback.tagline,
      price: matched?.price || fallback.price,
      priceRange: matched?.priceRange || fallback.priceRange,
      purchaseUrl: matched?.purchaseUrl || fallback.purchaseUrl,
      proof: matched?.proof || fallback.proof,
      facts: matched?.facts || fallback.facts,
    };
  });
}

// ==========================================
// 1. HERO SECTION - FOOD COMPANY STYLE
// ==========================================
function HeroSection() {
  const [products, setProducts] = useState<HeroProduct[]>(showcaseHeroProductsFallback);
  const [activeProduct, setActiveProduct] = useState<HeroProduct>(showcaseHeroProductsFallback[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?featured=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mergedProducts = mergeFeaturedProducts(data);
          setProducts(mergedProducts);
          setActiveProduct(mergedProducts[0]);
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

  const activeFacts = Array.isArray(activeProduct?.facts)
    ? activeProduct.facts
    : ["Có hồ sơ sản phẩm", "Nguồn gốc rõ ràng", "Đóng gói chỉn chu"];

  const activeStat = activeProduct?.stats?.[0];

  return (
    <section className="relative overflow-hidden bg-[#fff8ed] pt-14 text-slate-950 sm:pt-16 lg:pt-18">
      <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#ea580c_0%,#f97316_45%,#16a34a_100%)]" />
      <div className="absolute left-0 top-28 hidden h-40 w-32 bg-orange-200/45 lg:block" />
      <div className="absolute right-0 bottom-24 hidden h-56 w-40 bg-green-100 lg:block" />

      <div className="relative z-10 grid min-h-0 w-full grid-cols-1 items-stretch gap-0 pb-0 lg:grid-cols-[0.82fr_1.18fr]">
        <motion.div variants={stagger} initial="hidden" animate="show" className="px-5 py-8 sm:px-8 sm:py-9 lg:flex lg:flex-col lg:justify-center lg:px-14 lg:py-10 xl:px-20">
          <motion.div variants={fadeUp} className="mb-4 inline-flex items-center gap-3 border border-orange-200 bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-orange-700 shadow-sm">
            <Factory size={16} />
            Công ty thực phẩm ăn vặt Việt Nam
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl font-black leading-[1.02] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[4.8rem]">
            Sản xuất đồ ăn vặt sạch,
            <span className="block text-orange-600">chuẩn vị Bà Tuyết</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-5 max-w-2xl text-base font-medium leading-8 text-slate-600 sm:text-lg">
            Ăn Cùng Bà Tuyết tập trung vào sản phẩm ăn vặt đóng gói, quy trình kiểm soát rõ ràng, hình ảnh thương hiệu gần gũi và hệ thống phân phối qua TikTok Shop, Shopee.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              { label: "Nhà máy", value: "3.300m²", icon: Factory },
              { label: "Bảo chứng", value: "PVI", icon: ShieldCheck },
              { label: "Phân phối", value: "Toàn quốc", icon: Truck },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <InfoStrip key={item.label}>
                  <Icon size={24} className="text-orange-600" strokeWidth={1.8} />
                  <p className="mt-4 text-2xl font-black tracking-[-0.04em] text-slate-950">{item.value}</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
                </InfoStrip>
              );
            })}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Link href="/san-pham" className="inline-flex items-center justify-center gap-3 bg-orange-600 px-8 py-4 text-sm font-black text-white shadow-[0_14px_32px_rgba(234,88,12,0.24)] transition-all hover:-translate-y-1 hover:bg-orange-700">
              Xem danh mục sản phẩm
              <ArrowRight size={18} />
            </Link>

            <a href={activeProduct?.purchaseUrl || "https://shopee.vn/nmtvlog99"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 border border-orange-200 bg-white px-8 py-4 text-sm font-black text-orange-700 shadow-sm transition-all hover:-translate-y-1 hover:border-orange-400">
              Mua sản phẩm đang chọn
              <ShoppingBag size={17} />
            </a>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="relative min-h-full">
          <div className="h-full border-y border-l border-orange-200 bg-white p-0 shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
            <div className="grid h-full gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative min-h-[390px] overflow-hidden bg-[#f7ead8] p-6 sm:min-h-[430px] lg:min-h-[560px]">
                <div className="absolute left-0 top-0 h-full w-6 bg-orange-600" />
                <div className="absolute bottom-0 right-0 h-40 w-48 bg-green-100" />
                <div className="absolute left-10 top-5 border border-orange-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-orange-700">
                  Hình ảnh thương hiệu
                </div>
                <img src={HERO_CHARACTER_IMAGE} alt="Nhân vật Bà Tuyết" className="absolute bottom-0 left-1/2 z-10 h-[350px] w-auto -translate-x-1/2 object-contain drop-shadow-[0_28px_40px_rgba(15,23,42,0.22)] sm:h-[400px] lg:h-[455px]" />
              </div>

              <div className="flex min-h-[390px] flex-col justify-between border-y border-l border-orange-100 bg-[#fffaf3] p-5 sm:min-h-[430px] lg:min-h-[560px] lg:p-6">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">
                        {loading ? "Đang lấy dữ liệu" : "Sản phẩm tiêu biểu"}
                      </p>
                      <h3 className="mt-3 text-3xl font-black leading-tight tracking-[-0.04em] text-slate-950">
                        {activeProduct?.name}
                      </h3>
                    </div>

                    {activeStat && (
                      <div className="border border-green-200 bg-green-50 px-3 py-2 text-right">
                        <p className="text-lg font-black text-green-700">{activeStat.value}</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-green-700">{activeStat.label}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-center border border-orange-100 bg-white p-4">
                    <img src={activeProduct?.orbitImage || activeProduct?.image} alt={activeProduct?.name || "Sản phẩm"} className="h-44 w-full object-contain sm:h-52" />
                  </div>

                  <p className="mt-4 text-sm leading-7 text-slate-600">{activeProduct?.tagline}</p>

                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {activeFacts.slice(0, 3).map((fact) => (
                      <div key={fact} className="border border-orange-100 bg-white px-3 py-2 text-[11px] font-bold leading-5 text-slate-700">
                        {fact}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 border-t border-orange-100 pt-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Giá tham khảo</p>
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-2xl font-black text-orange-700">{activeProduct?.priceRange || activeProduct?.price || "Liên hệ"}</p>
                    <Link href={activeProduct?.slug ? `/san-pham/${activeProduct.slug}` : "/san-pham"} className="inline-flex items-center justify-center gap-2 bg-slate-950 px-5 py-3 text-xs font-black text-white transition hover:bg-orange-700">
                      Xem chi tiết
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-0 border-t border-orange-100 sm:grid-cols-5">
              {displayProducts.map((product) => {
                const isActive = getProductKey(activeProduct) === getProductKey(product);
                return (
                  <button key={getProductKey(product)} type="button" onMouseEnter={() => setActiveProduct(product)} onFocus={() => setActiveProduct(product)} onClick={() => setActiveProduct(product)} className={`border-x border-b p-3 text-left transition-all ${isActive ? "border-orange-500 bg-orange-50" : "border-orange-100 bg-white hover:border-orange-300"}`}>
                    <div className="mb-2 h-16 bg-[#fff8ed] p-2">
                      <img src={product.orbitImage || product.image} alt={product.name || "Sản phẩm"} className="h-full w-full object-contain" />
                    </div>
                    <p className="line-clamp-2 text-xs font-black leading-5 text-slate-900">{product.name}</p>
                  </button>
                );
              })}
            </div>
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
  const stats: {
    value: string;
    label: string;
    desc: string;
    icon: LucideIcon;
  }[] = [
      {
        value: "3.2M+",
        label: "Followers TikTok",
        desc: "Cộng đồng người dùng theo dõi nội dung ăn vặt của thương hiệu.",
        icon: Users,
      },
      {
        value: "6.2M+",
        label: "Đơn thành công",
        desc: "Số liệu bán hàng dùng làm minh chứng năng lực phân phối.",
        icon: TrendingUp,
      },
      {
        value: "3.300m²",
        label: "Khu sản xuất",
        desc: "Không gian phục vụ sản xuất, đóng gói và kiểm soát chất lượng.",
        icon: Factory,
      },
      {
        value: "PVI",
        label: "Bảo hiểm sản phẩm",
        desc: "Tăng mức độ an tâm cho khách hàng khi sử dụng sản phẩm.",
        icon: ShieldCheck,
      },
    ];

  return (
    <section className="bg-white px-0 py-0">
      <div className="w-full">
        <div className="flex flex-col gap-4 border-b border-orange-100 px-5 py-10 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-16">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">Năng lực thương hiệu</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-slate-950">Con số dùng để chứng minh, không nói suông</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            Phần số liệu nên được đối chiếu với hồ sơ nội bộ, kênh bán hàng hoặc tài liệu pháp lý trước khi đưa lên website chính thức.
          </p>
        </div>

        <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ delay: i * 0.08 }} className="border-r border-b border-orange-100 bg-[#fffaf3] p-7 transition-all duration-300 hover:border-orange-300 lg:p-9">
                <Icon size={30} className="text-orange-600" strokeWidth={1.8} />
                <p className="mt-8 text-4xl font-black tracking-[-0.05em] text-slate-950">{stat.value}</p>
                <p className="mt-2 text-sm font-black uppercase tracking-[0.14em] text-slate-800">{stat.label}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{stat.desc}</p>
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
  const trustItems: { title: string; desc: string; icon: LucideIcon }[] = [
    {
      title: "Kiểm soát đầu vào",
      desc: "Nguyên liệu được chọn lọc, ghi nhận thông tin và kiểm tra trước khi sản xuất.",
      icon: Wheat,
    },
    {
      title: "Quy trình sản xuất rõ ràng",
      desc: "Các công đoạn được chuẩn hóa để giữ độ ổn định giữa từng lô sản phẩm.",
      icon: ClipboardCheck,
    },
    {
      title: "Đóng gói và tem nhãn",
      desc: "Bao bì thể hiện thông tin sản phẩm, thương hiệu và quy cách sử dụng.",
      icon: PackageCheck,
    },
    {
      title: "Bảo chứng niềm tin",
      desc: "Kết hợp bảo hiểm sản phẩm và hồ sơ chứng minh để khách hàng an tâm hơn.",
      icon: Award,
    },
  ];

  return (
    <section className="bg-[#fff8ed] py-0">
      <div className="w-full px-5 sm:px-8 lg:px-16">
        <SectionTitle label="Niềm tin thực phẩm" title="Website công ty thực phẩm cần nhìn thấy quy trình, không chỉ nhìn thấy hiệu ứng" description="Phần này thay cho các mảng glow, orbit và card tối. Người xem sẽ hiểu thương hiệu có nhà máy, quy trình và sản phẩm thật." align="center" />

        <div className="mt-10 grid gap-0 md:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.title} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ delay: i * 0.08 }} className="border-r border-b border-orange-100 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.05)] lg:p-9">
                <div className="mb-7 flex h-14 w-14 items-center justify-center border border-orange-200 bg-orange-50 text-orange-700">
                  <Icon size={27} strokeWidth={1.8} />
                </div>
                <h3 className="text-xl font-black tracking-[-0.03em] text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.desc}</p>
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

  return (
    <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: 0.55, delay: index * 0.08 }} className="h-full">
      <Link href={href} className="group block h-full border-r border-b border-orange-100 bg-white shadow-sm transition-all duration-300 hover:border-orange-300 hover:shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <div className="relative bg-[#fff8ed] p-5 lg:p-7">
          <div className="aspect-[4/3] bg-white p-5 lg:p-7">
            <img src={product.image || "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=900&auto=format&fit=crop&q=85"} alt={product.name || "Sản phẩm"} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
          </div>

          <div className="absolute left-5 top-5 flex gap-2">
            <span className="bg-orange-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white">{product.categoryLabel || "Ăn vặt"}</span>
            <span className="bg-green-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white">Có sẵn</span>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-3 flex items-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={15} fill="currentColor" />
            ))}
          </div>

          <h3 className="line-clamp-1 text-xl font-black tracking-[-0.03em] text-slate-950 transition-colors group-hover:text-orange-600">{product.name || "Sản phẩm nổi bật"}</h3>

          <p className="mt-2 line-clamp-2 min-h-[48px] text-sm leading-6 text-slate-600">{product.tagline || "Món ăn vặt đóng gói chỉn chu, vị ngon rõ ràng và phù hợp bán lẻ toàn quốc."}</p>

          <div className="mt-5 flex items-center justify-between border-t border-orange-100 pt-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Giá từ</p>
              <p className="text-lg font-black text-slate-950">{product.priceRange || product.price || "Liên hệ"}</p>
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
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?featured=true")
      .then((res) => res.json())
      .then((data) => {
        setFeaturedProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed", err);
        setLoading(false);
      });
  }, []);

  const displayProducts = useMemo(() => {
    const fromDb = featuredProducts.filter((p) => p.category !== "khac").slice(0, 3);
    return fromDb.length > 0 ? fromDb : showcaseHeroProductsFallback.slice(0, 3);
  }, [featuredProducts]);

  return (
    <section className="relative overflow-hidden bg-white py-0">
      <div className="w-full px-5 sm:px-8 lg:px-16">
        <div className="flex flex-col gap-6 border-b border-orange-100 px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-16">
          <SectionTitle label="Danh mục bán chạy" title="Sản phẩm ăn vặt đóng gói" description="Tập trung vào hình ảnh sản phẩm thật, thông tin giá và danh mục rõ ràng để nhìn giống thương hiệu thực phẩm hơn." />

          <Link href="/san-pham" className="inline-flex w-fit items-center gap-2 border border-orange-200 bg-white px-5 py-3 text-sm font-black text-orange-700 shadow-sm transition-all hover:-translate-y-1 hover:border-orange-400">
            Xem tất cả sản phẩm
            <ArrowRight size={16} />
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {loading && featuredProducts.length === 0 ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-0 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[520px] animate-pulse border-r border-b border-orange-100 bg-[#fff8ed]" />
              ))}
            </motion.div>
          ) : (
            <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-0 md:grid-cols-3">
              {displayProducts.map((product, i) => (
                <ProductCard key={product.id || product.slug || i} product={product} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ==========================================
// 5. FACTORY PROOF SECTION
// ==========================================
function FactoryProofSection() {
  const proofs = [
    "Khu sản xuất và đóng gói được trình bày rõ ràng bằng hình ảnh thực tế.",
    "Thông tin bảo hiểm, tiêu chuẩn và hồ sơ sản phẩm có vị trí riêng để tạo niềm tin.",
    "Nội dung tập trung vào an toàn, ổn định chất lượng và phân phối toàn quốc.",
    "Bố cục vuông, sáng, nhiều khoảng trắng, giảm hiệu ứng như web công nghệ.",
  ];

  return (
    <section className="bg-[#fff8ed] py-0">
      <div className="grid w-full gap-0 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
        <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} className="h-full border-y border-r border-orange-200 bg-white p-0 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="relative min-h-[560px] overflow-hidden bg-slate-100 lg:min-h-[680px]">
            <img src="/bento/bento-factory.png" alt="Nhà máy sản xuất Bà Tuyết" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-white/92 p-6 backdrop-blur-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">Nhà máy / khu sản xuất</p>
              <h3 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950">Không gian sản xuất 3.300m²</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">Đưa hình ảnh nhà máy thật vào đây sẽ làm website giống công ty thực phẩm hơn rất nhiều so với nền tối và hiệu ứng glow.</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} className="p-5 sm:p-8 lg:p-16">
          <SectionTitle label="Bằng chứng thương hiệu" title="Nói về năng lực sản xuất trước, rồi mới nói về bán hàng" description="Khách vào website công ty thực phẩm cần thấy nơi sản xuất, quy trình, chứng nhận và cách đóng gói. Các yếu tố viral nên để sau." />

          <div className="mt-8 grid gap-0">
            {proofs.map((proof, index) => (
              <div key={proof} className="flex gap-4 border-x border-b border-orange-100 bg-white p-5 lg:p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-orange-600 text-sm font-black text-white">{index + 1}</div>
                <p className="leading-7 text-slate-600">{proof}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// 6. WHY CHOOSE US - NON TECH GRID
// ==========================================
function WhyChooseUs() {
  const items: {
    icon: LucideIcon;
    title: string;
    desc: string;
    image: string;
  }[] = [
      {
        icon: Factory,
        title: "Sản xuất có quy trình",
        desc: "Từ nguyên liệu, sơ chế, chế biến đến đóng gói đều cần có nội dung thể hiện rõ trên website.",
        image: "/bento/bento-factory.png",
      },
      {
        icon: ShieldCheck,
        title: "Bảo hiểm PVI",
        desc: "Đây là điểm tạo niềm tin, nên đặt ở khu vực uy tín thay vì chỉ là một con số nhỏ.",
        image: "https://i1-kinhdoanh.vnecdn.net/2026/01/16/image001-1768540826-4943-1768546422.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=j8zJ3SO1pwM6HuyS29eXNA",
      },
      {
        icon: Leaf,
        title: "Nguyên liệu rõ ràng",
        desc: "Hình ảnh nguyên liệu, bàn sơ chế và đóng gói giúp website ra chất thực phẩm hơn.",
        image: "https://i1-giadinh.vnecdn.net/2024/09/18/image005-2758-1726648418.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=N26-G4ejmoopy5vA3-J2pw",
      },
      {
        icon: Store,
        title: "Phân phối đa kênh",
        desc: "TikTok Shop, Shopee và các kênh bán hàng nên được trình bày như hệ thống phân phối.",
        image: "/bento/bento-tiktok.png",
      },
    ];

  return (
    <section className="bg-white py-0">
      <div className="w-full px-5 sm:px-8 lg:px-16">
        <SectionTitle label="Lý do chọn chúng tôi" title="Từ sản phẩm thật đến hệ thống phân phối thật" description="Không dùng bento tối kiểu startup nữa. Phần này chuyển sang dạng hồ sơ năng lực công ty thực phẩm: ảnh thật, thông tin rõ, ít hiệu ứng." align="center" />

        <div className="mt-10 grid gap-0 md:grid-cols-2">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ delay: i * 0.08 }} className="grid overflow-hidden border-r border-b border-orange-100 bg-[#fffaf3] shadow-sm transition-all hover:border-orange-300 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="relative min-h-[260px] bg-slate-100">
                  <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="flex flex-col justify-between p-7">
                  <Icon size={34} className="text-orange-600" strokeWidth={1.8} />
                  <div className="mt-10">
                    <h3 className="text-2xl font-black tracking-[-0.04em] text-slate-950">{item.title}</h3>
                    <p className="mt-3 leading-7 text-slate-600">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 7. PROCESS SECTION
// ==========================================
function ProcessSection() {
  const steps = [
    {
      title: "Chọn nguyên liệu",
      desc: "Ưu tiên nguồn rõ ràng, kiểm tra đầu vào trước khi sản xuất.",
      icon: Leaf,
    },
    {
      title: "Sơ chế và sản xuất",
      desc: "Kiểm soát từng công đoạn để giữ chất lượng ổn định giữa các lô hàng.",
      icon: Factory,
    },
    {
      title: "Đóng gói và tem nhãn",
      desc: "Bao bì rõ thông tin, dễ vận chuyển, dễ trưng bày và phù hợp bán online.",
      icon: PackageCheck,
    },
    {
      title: "Giao hàng toàn quốc",
      desc: "Kết nối sàn thương mại điện tử để khách đặt hàng nhanh và thuận tiện.",
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
              Quy trình sản xuất
            </p>

            <h2 className="text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-5xl">Từ nguyên liệu đến sản phẩm đóng gói</h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">Bố cục quy trình giúp người xem hiểu đây là doanh nghiệp sản xuất thực phẩm, không chỉ là shop bán hàng hoặc landing page quảng cáo.</p>
          </div>

          <div className="grid gap-0">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.title} initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ delay: i * 0.08 }} className="grid gap-5 border-b border-orange-100 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:grid-cols-[auto_1fr] lg:p-8">
                  <div className="flex h-16 w-16 items-center justify-center bg-orange-600 text-white">
                    <Icon size={28} />
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">Bước 0{i + 1}</p>
                    <h3 className="mt-1 text-2xl font-black tracking-[-0.04em] text-slate-950">{step.title}</h3>
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
  const milestones = [
    {
      year: "2022",
      event: "Bắt đầu từ đam mê ẩm thực và các nội dung gần gũi với cộng đồng.",
    },
    {
      year: "2023",
      event: "Phát triển thương hiệu Ăn Cùng Bà Tuyết với định hướng đồ ăn vặt sạch.",
    },
    {
      year: "2024",
      event: "Mở rộng trên TikTok Shop, xây dựng cộng đồng khách hàng trung thành.",
    },
    {
      year: "2025",
      event: "Đẩy mạnh nhà máy, quy trình và tiêu chuẩn hóa sản phẩm.",
    },
  ];

  return (
    <section id="brand-story" className="bg-white py-0">
      <div className="grid w-full gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-r border-orange-100 bg-[#fffaf3] p-5 sm:p-8 lg:sticky lg:top-28 lg:h-fit lg:min-h-[520px] lg:p-16">
          <span className="mb-5 inline-flex items-center gap-2 border-l-4 border-orange-500 bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-700">
            <BadgeCheck size={14} />
            Câu chuyện thương hiệu
          </span>

          <h2 className="text-4xl font-black leading-tight tracking-[-0.05em] text-slate-950 sm:text-5xl">Từ món ăn quen thuộc đến thương hiệu có quy trình</h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">Câu chuyện thương hiệu nên đi cùng hình ảnh sản phẩm thật, nhà máy thật và các mốc phát triển rõ ràng để tạo cảm giác doanh nghiệp thực phẩm lâu dài.</p>

          <Link href="/gioi-thieu" className="mt-8 inline-flex items-center gap-3 border-b-2 border-orange-600 pb-1 text-sm font-black text-slate-950 transition-colors hover:text-orange-700">
            Đọc toàn bộ câu chuyện
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="grid gap-0">
          {milestones.map((item, i) => (
            <motion.div key={item.year} initial={{ opacity: 0, x: 22 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-90px" }} transition={{ duration: 0.5, delay: i * 0.08 }} className="grid border-b border-orange-100 bg-white p-7 transition-all hover:border-orange-300 sm:grid-cols-[140px_1fr] sm:items-center lg:p-9">
              <p className="text-5xl font-black tracking-[-0.08em] text-orange-600">{item.year}</p>
              <p className="mt-4 text-base font-semibold leading-8 text-slate-700 sm:mt-0">{item.event}</p>
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

          <h2 className="text-4xl font-black leading-tight tracking-[-0.05em] text-slate-950 sm:text-6xl">Đặt hàng qua kênh phân phối chính thức</h2>

          <p className="mt-6 max-w-xl text-base font-medium leading-8 text-slate-600 sm:text-lg">Sản phẩm đóng gói chỉn chu, có thông tin rõ ràng và giao hàng toàn quốc qua các nền tảng quen thuộc.</p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href="https://tiktok.com/@batuyethanhvi" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-slate-950 px-8 py-5 text-sm font-black text-white transition-all hover:-translate-y-1 hover:bg-orange-700">
              Mua qua TikTok Shop
              <Play size={15} className="fill-white" />
            </a>

            <a href="https://shopee.vn/nmtvlog99" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 border border-orange-200 bg-orange-600 px-8 py-5 text-sm font-black text-white transition-all hover:-translate-y-1 hover:bg-orange-700">
              Đặt hàng Shopee
              <ArrowRight size={18} />
            </a>
          </div>
        </div>

        <div className="relative min-h-[420px] bg-[#f7ead8] p-8 lg:min-h-[520px]">
          <div className="absolute left-0 top-0 h-full w-8 bg-orange-600" />
          <img src="/hero/chan-ga-plate.png" alt="Sản phẩm Bà Tuyết" className="absolute bottom-12 left-1/2 h-64 w-auto -translate-x-1/2 object-contain drop-shadow-[0_30px_45px_rgba(15,23,42,0.22)]" />
          <div className="absolute bottom-0 right-0 bg-white p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">Ăn Cùng Bà Tuyết</p>
            <p className="mt-1 text-sm font-bold text-slate-700">Sản phẩm ăn vặt đóng gói</p>
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
      <WhyChooseUs />
      <ProcessSection />
      <BrandStory />
      <CTASection />
    </main>
  );
}
