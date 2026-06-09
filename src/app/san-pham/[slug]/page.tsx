"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  Factory,
  Loader,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Star,
  Leaf,
  Truck,
  BadgeCheck,
} from "lucide-react";

type Product = {
  id: string;
  slug: string;
  name: string;
  image: string;
  heroImage?: string;
  category: string;
  categoryLabel: string;
  tagline: string;
  description: string;
  price: string;
  priceRange?: string;
  purchaseUrl?: string;
  ingredients?: string[];
  specs?: { label: string; value: string }[];
  variants?: { name: string; weight?: string; price: string; spiceLevel?: number; image?: string }[];
  stats?: { label: string; value: string }[];
  processSteps?: { step: number; title: string; description: string }[];
  story?: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/products/slug/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
        // Fetch related products
        fetch("/api/products")
          .then((r) => r.json())
          .then((all) => {
            const related = (Array.isArray(all) ? all : [])
              .filter((p: Product) => p.slug !== slug && p.category === data.category)
              .slice(0, 4);
            setRelatedProducts(related);
          });
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-[#fbfaf7]">
        <Loader className="animate-spin text-orange-500" size={42} />
        <p className="mt-4 text-sm font-semibold text-slate-500">Đang tải sản phẩm...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-[#fbfaf7] px-4">
        <div className="text-center">
          <p className="text-6xl font-black text-orange-500">404</p>
          <h1 className="mt-4 text-2xl font-black text-slate-950">Không tìm thấy sản phẩm</h1>
          <p className="mt-3 text-sm text-slate-500">Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Link
            href="/san-pham"
            className="mt-8 inline-flex items-center gap-2 bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            <ArrowLeft size={16} />
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </main>
    );
  }

  const stats = Array.isArray(product.stats) ? product.stats : [];
  const ingredients = Array.isArray(product.ingredients) ? product.ingredients : [];
  const specs = Array.isArray(product.specs) ? product.specs : [];
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const processSteps = Array.isArray(product.processSteps) ? product.processSteps : [];

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-slate-950">
      {/* Breadcrumb */}
      <div className="border-b border-orange-100 bg-[#fff7ed] px-4 pt-24 pb-4 sm:px-6 lg:px-10">
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/" className="transition hover:text-orange-600">Trang chủ</Link>
          <ChevronRight size={12} />
          <Link href="/san-pham" className="transition hover:text-orange-600">Sản phẩm</Link>
          <ChevronRight size={12} />
          <span className="text-orange-600">{product.name}</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="border-b border-orange-100 bg-[#fff7ed] px-4 pb-14 pt-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative overflow-hidden border border-orange-100 bg-white p-6 shadow-[0_20px_60px_rgba(249,115,22,0.08)] sm:p-10">
                <div className="absolute left-4 top-4 z-10 bg-orange-500 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-md">
                  {product.categoryLabel || product.category}
                </div>
                <img
                  src={product.image || product.heroImage}
                  alt={product.name}
                  className="mx-auto max-h-[420px] w-full object-contain transition duration-700 hover:scale-105"
                />
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              <span className="mb-3 inline-flex items-center gap-2 bg-orange-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-orange-600">
                <Award size={12} />
                {product.categoryLabel}
              </span>

              <h1 className="mt-3 text-3xl font-black leading-tight tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>

              {product.tagline && (
                <p className="mt-4 text-lg font-bold leading-8 text-orange-600">
                  {product.tagline}
                </p>
              )}

              {product.description && (
                <p className="mt-5 text-sm font-medium leading-7 text-slate-600 sm:text-base">
                  {product.description}
                </p>
              )}

              {/* Stats */}
              {stats.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {stats.map((s, i) => (
                    <div key={i} className="border border-orange-100 bg-white p-4">
                      <p className="text-xl font-black text-orange-600">{s.value}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Price & CTA */}
              <div className="mt-8 flex flex-col gap-4 border-t border-orange-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Giá từ</p>
                  <p className="mt-1 text-3xl font-black text-slate-950">
                    {product.priceRange || product.price || "Liên hệ"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.purchaseUrl && (
                    <a
                      href={product.purchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-orange-500 px-7 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-lg"
                    >
                      <ShoppingBag size={18} />
                      Mua ngay
                      <ArrowRight size={16} />
                    </a>
                  )}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
                  <CheckCircle2 size={14} /> 100% Chính hãng
                </span>
                <span className="inline-flex items-center gap-1.5 border border-orange-100 bg-orange-50 px-3 py-2 text-xs font-bold text-orange-700">
                  <PackageCheck size={14} /> Đóng gói chuẩn
                </span>
                <span className="inline-flex items-center gap-1.5 border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
                  <Truck size={14} /> Giao toàn quốc
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Details Tabs */}
      <section className="px-4 py-14 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.4fr]">
            {/* Left Column - Details */}
            <div className="space-y-10">

              {/* Ingredients */}
              {ingredients.length > 0 && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center bg-green-500 text-white">
                      <Leaf size={20} />
                    </div>
                    <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950">Thành phần</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {ingredients.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 border border-orange-100 bg-white p-4 transition hover:border-orange-300">
                        <CheckCircle2 size={16} className="shrink-0 text-green-500" />
                        <span className="text-sm font-semibold text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Specs */}
              {specs.length > 0 && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center bg-blue-500 text-white">
                      <BadgeCheck size={20} />
                    </div>
                    <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950">Thông số sản phẩm</h2>
                  </div>
                  <div className="overflow-hidden border border-orange-100 bg-white">
                    {specs.map((item, i) => (
                      <div
                        key={i}
                        className={`grid grid-cols-[160px_1fr] ${i % 2 === 0 ? "bg-white" : "bg-orange-50/50"}`}
                      >
                        <div className="border-b border-r border-orange-100 px-5 py-3.5 text-xs font-black uppercase tracking-wider text-slate-500">
                          {item.label}
                        </div>
                        <div className="border-b border-orange-100 px-5 py-3.5 text-sm font-semibold text-slate-800">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Variants */}
              {variants.length > 0 && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center bg-orange-500 text-white">
                      <PackageCheck size={20} />
                    </div>
                    <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950">Phân loại sản phẩm</h2>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {variants.map((v, i) => (
                      <div key={i} className="group flex items-center gap-4 border border-orange-100 bg-white p-4 transition hover:border-orange-300 hover:shadow-md">
                        {v.image ? (
                          <img src={v.image} alt={v.name} className="h-16 w-16 shrink-0 object-contain" />
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-orange-50 text-xs font-black text-orange-500">
                            {v.weight || "VỊ"}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-black text-slate-950 group-hover:text-orange-600">
                            {v.name} {v.weight ? `(${v.weight})` : ""}
                          </p>
                          <p className="mt-1 text-lg font-black text-orange-600">{v.price}</p>
                          {v.spiceLevel !== undefined && v.spiceLevel > 0 && (
                            <p className="text-[10px] text-orange-600 font-bold mt-1">Độ cay: {"🔥".repeat(v.spiceLevel)}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Process Steps */}
              {processSteps.length > 0 && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center bg-slate-800 text-white">
                      <Factory size={20} />
                    </div>
                    <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950">Quy trình sản xuất</h2>
                  </div>
                  <div className="space-y-4">
                    {processSteps.map((s, i) => (
                      <div key={i} className="flex gap-5 border border-orange-100 bg-white p-5 transition hover:border-orange-300">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-orange-500 text-sm font-black text-white">
                          {s.step || (i + 1)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-950">{s.title}</p>
                          <p className="mt-1 text-sm font-medium leading-6 text-slate-500">{s.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Story */}
              {product.story && product.story.length > 5 && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center bg-amber-500 text-white">
                      <Star size={20} />
                    </div>
                    <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950">Câu chuyện sản phẩm</h2>
                  </div>
                  <div className="border border-orange-100 bg-white p-6 sm:p-8">
                    <p className="text-sm font-medium leading-7 text-slate-600 whitespace-pre-line">
                      {product.story}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              {/* Quick Buy Card */}
              <div className="border border-orange-200 bg-[#fff7ed] p-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600 mb-4">Mua sản phẩm</p>
                <img
                  src={product.image}
                  alt={product.name}
                  className="mx-auto mb-4 h-40 w-auto object-contain"
                />
                <h3 className="text-lg font-black text-slate-950">{product.name}</h3>
                <p className="mt-2 text-2xl font-black text-orange-600">{product.priceRange || product.price}</p>

                {product.purchaseUrl ? (
                  <a
                    href={product.purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex w-full items-center justify-center gap-2 bg-orange-500 py-4 text-sm font-black text-white transition hover:bg-orange-600"
                  >
                    <ShoppingBag size={18} />
                    Đặt mua ngay
                  </a>
                ) : (
                  <Link
                    href="/lien-he"
                    className="mt-4 flex w-full items-center justify-center gap-2 bg-slate-950 py-4 text-sm font-black text-white transition hover:bg-slate-800"
                  >
                    Liên hệ đặt hàng
                  </Link>
                )}
              </div>

              {/* Safety Badges */}
              <div className="space-y-3">
                {[
                  { icon: ShieldCheck, title: "An toàn thực phẩm", desc: "Đạt tiêu chuẩn VSATTP", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                  { icon: Factory, title: "Nhà máy đạt chuẩn", desc: "Quy trình khép kín, sạch", color: "text-blue-600 bg-blue-50 border-blue-100" },
                  { icon: Truck, title: "Giao hàng toàn quốc", desc: "Ship COD, nhanh 1-3 ngày", color: "text-orange-600 bg-orange-50 border-orange-100" },
                ].map((badge, i) => (
                  <div key={i} className={`flex items-start gap-3 border p-4 ${badge.color}`}>
                    <badge.icon size={20} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-black">{badge.title}</p>
                      <p className="mt-0.5 text-[11px] font-medium opacity-75">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-orange-100 bg-white px-4 py-14 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">Cùng danh mục</p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-950 sm:text-3xl">Sản phẩm liên quan</h2>
              </div>
              <Link
                href="/san-pham"
                className="hidden items-center gap-2 text-sm font-bold text-orange-600 transition hover:text-orange-700 sm:inline-flex"
              >
                Xem tất cả <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((rp, i) => (
                <motion.div
                  key={rp.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                >
                  <Link
                    href={`/san-pham/${rp.slug}`}
                    className="group block h-full border border-orange-100 bg-[#fffaf3] p-3 transition hover:border-orange-300 hover:bg-white hover:shadow-md"
                  >
                    <div className="aspect-square overflow-hidden border border-orange-100 bg-white">
                      <img
                        src={rp.image}
                        alt={rp.name}
                        className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="pt-4">
                      <p className="line-clamp-2 text-sm font-black leading-5 text-slate-950 group-hover:text-orange-600">
                        {rp.name}
                      </p>
                      <p className="mt-2 text-xs font-black text-orange-600">
                        {rp.priceRange || rp.price || "Liên hệ"}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to products */}
      <section className="border-t border-orange-100 bg-[#fbfaf7] px-4 py-10 text-center sm:px-6">
        <Link
          href="/san-pham"
          className="inline-flex items-center gap-2 border border-orange-200 bg-white px-8 py-4 text-sm font-black text-slate-700 transition hover:border-orange-400 hover:text-orange-600"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách sản phẩm
        </Link>
      </section>
    </main>
  );
}
