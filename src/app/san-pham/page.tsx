"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import CurtainHover from "@/components/shared/CurtainHover";
import Button from "@/components/ui/Button";
import {
  AlertCircle,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  Factory,
  Loader,
  PackageCheck,
  ShieldCheck,
  Star,
  type LucideIcon,
} from "lucide-react";

type Product = {
  id: string | number;
  slug?: string;
  name?: string;
  image?: string;
  category?: string;
  categoryLabel?: string;
  tagline?: string;
  description?: string;
  price?: string;
  priceRange?: string;
  purchaseUrl?: string;
  stats?: { label: string; value: string }[];
};

const categories = [
  { id: "all", label: "Dòng sản phẩm", note: "Tổng quan" },
  { id: "chan-ga", label: "Chân gà", note: "Chủ lực" },
  { id: "tam-cay", label: "Tăm cay", note: "Dòng sản phẩm" },
  { id: "snack", label: "Snack", note: "Đóng gói" },
  { id: "banh-trang", label: "Bánh tráng", note: "Dòng sản phẩm" },
  { id: "khac", label: "Sản phẩm khác", note: "Mở rộng" },
];

function StatPill({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) {
  return (
    <div className="border border-orange-100 bg-white p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center bg-orange-500 text-white">
        <Icon size={22} />
      </div>
      <p className="text-sm font-black uppercase tracking-wider text-slate-950">{title}</p>
      <p className="mt-2 text-xs font-medium leading-5 text-slate-500">{desc}</p>
    </div>
  );
}

export default function ProductsPage() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProductsList(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products", err);
        setProductsList([]);
        setLoading(false);
      });
  }, []);

  const mainProducts = useMemo(
    () => productsList.filter((p) => p.category !== "khac"),
    [productsList]
  );

  const otherProductsList = useMemo(
    () => productsList.filter((p) => p.category === "khac"),
    [productsList]
  );

  const displayedProducts = useMemo(() => {
    if (activeCategory === "all") return mainProducts;
    if (activeCategory === "khac") return otherProductsList;
    return mainProducts.filter((p) => p.category === activeCategory);
  }, [activeCategory, mainProducts, otherProductsList]);


  const getBadge = (product: Product) => {
    if (product.category === "chan-ga") return "Sản phẩm chủ lực";
    if (product.category === "tam-cay") return "Dòng sản phẩm nổi bật";
    if (product.category === "banh-trang" || product.category === "snack") return "Dòng sản phẩm đóng gói";
    return "Sản phẩm mở rộng";
  };

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-slate-950">
      <section className="border-b border-orange-100 bg-[#fff7ed] px-4 pb-10 pt-28 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-orange-600 transition hover:text-orange-700"
            >
              Ăn Cùng Bà Tuyết
              <ChevronRight size={14} />
            </Link>

            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-orange-600">
              Landing sản phẩm
            </p>
            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl">
              Các dòng sản phẩm chủ lực của Ăn Cùng Bà Tuyết
            </h1>
            <p className="mt-5 max-w-3xl text-base font-medium leading-8 text-slate-600">
              Trang này giới thiệu nhanh từng nhóm sản phẩm, quy cách đóng gói và điểm nổi bật. Thông tin chi tiết nằm trong landing riêng của từng sản phẩm.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatPill
              icon={ShieldCheck}
              title="An tâm"
              desc="Thông tin chất lượng, bảo hiểm và tiêu chuẩn được đặt cạnh sản phẩm."
            />
            <StatPill
              icon={Factory}
              title="Sản xuất"
              desc="Nhấn mạnh quy trình, nhà máy và khả năng cung ứng ổn định."
            />
            <StatPill
              icon={Award}
              title="Truyền thông"
              desc="Bố cục giống hồ sơ thương hiệu, không chỉ là catalog bán hàng."
            />
          </div>
        </div>
      </section>

      <section className="sticky top-16 z-30 border-b border-orange-100 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-10">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              variant={activeCategory === cat.id ? "primary" : "outline"}
              size="md"
              className="shrink-0 px-5 py-3 text-left"
            >
              <span className="block text-xs font-black uppercase tracking-wider">{cat.label}</span>
              <span
                className={`mt-1 block text-[10px] font-bold ${activeCategory === cat.id ? "text-white/80" : "text-slate-400"
                  }`}
              >
                {cat.note}
              </span>
            </Button>
          ))}
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-10">
        <div className="mb-6 flex flex-col gap-2 border-b border-orange-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
              Đang hiển thị
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-950 sm:text-3xl">
              {displayedProducts.length} dòng sản phẩm đang hiển thị
            </h2>
          </div>
          <p className="max-w-xl text-sm font-medium leading-6 text-slate-500">
            Ưu tiên ảnh thật, mô tả ngắn và đường dẫn sang trang giới thiệu riêng của từng sản phẩm.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center border border-orange-100 bg-white py-24">
            <Loader className="animate-spin text-orange-500" size={38} />
            <p className="mt-3 text-sm font-semibold text-slate-500">Đang tải danh sách sản phẩm...</p>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="border border-dashed border-orange-200 bg-white py-20 text-center text-slate-500">
            <AlertCircle size={46} className="mx-auto text-orange-300" />
            <p className="mt-3 text-sm font-bold text-slate-700">
              Chưa có sản phẩm nào trong mục này.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {displayedProducts.map((product, i) => {
                const badgeText = getBadge(product);

                return (
                  <motion.article
                    key={product.id || product.slug || i}
                    layout
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.35, delay: i * 0.03 }}
                    className="group border border-orange-100 bg-white transition hover:border-orange-300 hover:shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
                  >
                    <div className="grid lg:grid-cols-[320px_1fr] xl:grid-cols-[360px_1fr]">
                      <Link
                        href={`/san-pham/${product.slug || product.id}`}
                        className="relative min-h-[220px] overflow-hidden border-b border-orange-100 bg-orange-50 p-5 lg:min-h-[260px] lg:border-b-0 lg:border-r block"
                      >
                        <CurtainHover
                          overlayMode="partial"
                          overlayContent={
                            <span className="flex items-center gap-1">
                              Xem sản phẩm <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                            </span>
                          }
                          className="w-full h-full"
                        >
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name || "Sản phẩm"}
                              className="mx-auto h-full max-h-[220px] min-h-[180px] w-full object-contain transition duration-700 group-hover:scale-[1.015] lg:max-h-[240px]"
                            />
                          ) : (
                            <div className="flex h-full min-h-[220px] items-center justify-center bg-orange-100 text-4xl font-black text-orange-500">
                              BT
                            </div>
                          )}
                        </CurtainHover>
                        <div className="absolute left-5 top-5 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-orange-600 shadow-sm z-30">
                          {badgeText}
                        </div>
                      </Link>

                      <div className="flex flex-col justify-between p-5 sm:p-6 lg:p-8">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-orange-600">
                              {product.categoryLabel || "Ăn vặt"}
                            </span>
                            <span className="inline-flex items-center gap-1 bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-600">
                              <Star size={12} fill="currentColor" />
                              Hồ sơ sản phẩm
                            </span>
                            <span className="bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                              Phân phối chính thức
                            </span>
                          </div>

                          <h3 className="mt-4 text-2xl font-black leading-tight tracking-[-0.05em] text-slate-950 transition group-hover:text-orange-600 sm:text-3xl">
                            {product.name || "Sản phẩm Bà Tuyết"}
                          </h3>
                          {product.tagline && (
                            <p className="mt-3 max-w-3xl text-lg font-black leading-7 text-orange-600">
                              {product.tagline}
                            </p>
                          )}
                          {product.description && (
                            <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-slate-600 line-clamp-3">
                              {product.description}
                            </p>
                          )}

                          <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold text-slate-600">
                            <span className="inline-flex items-center gap-1 border border-emerald-100 bg-emerald-50 px-3 py-2 text-emerald-700">
                              <CheckCircle2 size={14} /> Chính hãng
                            </span>
                            <span className="inline-flex items-center gap-1 border border-orange-100 bg-orange-50 px-3 py-2 text-orange-700">
                              <PackageCheck size={14} /> Đóng gói rõ quy cách
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                              Hồ sơ sản phẩm
                            </p>
                            <p className="mt-1 text-2xl font-black text-slate-950">
                              Xem câu chuyện và quy cách
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <Button
                              href={`/san-pham/${product.slug || product.id}`}
                              variant="outline"
                              size="md"
                              className="px-6 py-3 text-xs uppercase tracking-wider"
                            >
                              Xem hồ sơ sản phẩm
                              <ChevronRight size={15} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </section>

      {activeCategory === "all" && otherProductsList.length > 0 && (
        <section className="border-t border-orange-100 bg-white px-4 py-14 sm:px-6 lg:px-10">
          <div className="mb-8 grid gap-4 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
                Mở rộng menu
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950">
                Sản phẩm ăn vặt khác
              </h2>
            </div>
            <p className="text-sm font-medium leading-7 text-slate-500">
              Các dòng phụ nên trình bày gọn như một catalog phụ, không cần hiệu ứng quá mạnh để tránh cảm giác thương mại điện tử thuần túy.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {otherProductsList.map((product, i) => (
              <motion.div
                key={product.id || product.slug || i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
              >
                <Link
                  href={`/san-pham/${product.slug || product.id}`}
                  className="group block h-full border border-orange-100 bg-[#fffaf3] p-3 transition hover:border-orange-300 hover:bg-white"
                >
                  <CurtainHover
                    overlayMode="partial"
                    overlayContent={
                      <span className="flex items-center gap-1">
                        Xem sản phẩm <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    }
                    className="aspect-square overflow-hidden border border-orange-100 bg-white"
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name || "Sản phẩm"}
                        className="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-[1.015]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-orange-50 text-xl font-black text-orange-500">
                        BT
                      </div>
                    )}
                  </CurtainHover>
                  <div className="pt-4">
                    <p className="line-clamp-2 text-sm font-black leading-5 text-slate-950 group-hover:text-orange-600">
                      {product.name}
                    </p>
                    <p className="mt-2 text-xs font-black text-orange-600">
                      Xem chi tiết
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
