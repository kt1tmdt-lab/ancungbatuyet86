"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import {
  AlertCircle,
  ArrowRight,
  HelpCircle,
  Loader,
  ShoppingBag,
} from "lucide-react";

interface Block {
  id: string;
  type: "hero" | "text" | "features" | "split" | "products";
  data: any;
}

interface PageData {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  content: Block[];
}

interface Product {
  id: string;
  slug: string;
  name: string;
  price: string;
  image: string;
  categoryLabel: string;
  purchaseUrl: string;
  tagline?: string;
  priceRange?: string;
}

const DynIcon = ({ name, className }: { name: string; className?: string }) => {
  const Icon = (Icons as any)[name];
  if (!Icon) return <HelpCircle className={className} />;
  return <Icon className={className} />;
};

function sectionTone(backgroundColor?: string) {
  if (backgroundColor === "slate-900" || backgroundColor === "neutral") {
    return "bg-slate-950 text-white";
  }
  if (backgroundColor === "white") return "bg-white text-slate-950";
  return "bg-[#fbfaf7] text-slate-950";
}

export default function CustomDynamicPage({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>;
}) {
  const params = use(paramsPromise);
  const slug = params.slug;

  const { token } = useAuth();
  const [page, setPage] = useState<PageData | null>(null);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPageAndProducts();
  }, [slug, token]);

  const fetchPageAndProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const prodRes = await fetch("/api/products");
      if (prodRes.ok) {
        const prods = await prodRes.json();
        setProductsList(Array.isArray(prods) ? prods : []);
      }

      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const pageRes = await fetch(`/api/pages/slug/${slug}`, { headers });
      if (pageRes.ok) {
        const pageData = await pageRes.json();
        setPage(pageData);
      } else {
        const errorData = await pageRes.json().catch(() => ({}));
        setError(errorData.error || "Không thể tải trang này");
      }
    } catch (err) {
      console.error("Error loading dynamic page:", err);
      setError("Có lỗi kết nối hệ thống xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 bg-[#fbfaf7]">
        <Loader className="animate-spin text-orange-500" size={36} />
        <p className="text-sm font-semibold text-slate-500">Đang tải dữ liệu trang...</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="mx-auto max-w-md bg-[#fbfaf7] px-6 py-24 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500" />
        <h1 className="mt-4 text-2xl font-black text-slate-950">404 — Không tìm thấy trang</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          {error === "Trang chưa được xuất bản"
            ? "Trang này hiện đang ở trạng thái bản nháp và chưa được công bố rộng rãi."
            : "Đường dẫn này không hợp lệ hoặc trang đã được gỡ bỏ."}
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 bg-slate-950 px-6 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-orange-600"
        >
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-slate-950">
      {page.status === "DRAFT" && (
        <div className="border-b border-amber-700 bg-amber-400 px-6 py-2 text-center text-xs font-black uppercase tracking-wider text-slate-950">
          PREVIEW DRAFT — Bạn đang xem trước trang nháp vì đã đăng nhập quyền quản trị.
        </div>
      )}

      {(page.content || []).map((block, idx) => {
        const data = block.data || {};

        return (
          <div key={block.id || idx}>
            {block.type === "hero" && (
              <section className="border-b border-orange-100 bg-[#fff7ed] px-4 pb-10 pt-28 sm:px-6 lg:px-10">
                <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-600">
                      {data.label || page.title}
                    </p>
                    <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl">
                      {data.title || "Tiêu đề trang"}
                    </h1>
                    {data.subtitle && (
                      <p className="mt-5 max-w-3xl text-base font-medium leading-8 text-slate-600">
                        {data.subtitle}
                      </p>
                    )}
                    {data.ctaText && (
                      <Link
                        href={data.ctaLink || "#"}
                        className="mt-7 inline-flex items-center gap-2 bg-orange-500 px-6 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-orange-600"
                      >
                        {data.ctaText}
                        <ArrowRight size={15} />
                      </Link>
                    )}
                  </div>

                  <div className="min-h-[260px] overflow-hidden border border-orange-100 bg-white">
                    <img
                      src={data.backgroundImage || "/hero-bg-default.jpg"}
                      alt={data.title || page.title}
                      className="h-full min-h-[260px] w-full object-cover"
                    />
                  </div>
                </div>
              </section>
            )}

            {block.type === "text" && (
              <section className={`border-b border-orange-100 px-4 py-14 sm:px-6 lg:px-10 ${sectionTone(data.backgroundColor)}`}>
                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45 }}
                  className={`prose prose-orange max-w-5xl prose-headings:font-black prose-p:leading-8 ${data.backgroundColor === "slate-900" || data.backgroundColor === "neutral"
                      ? "prose-invert text-slate-200"
                      : "text-slate-800"
                    }`}
                  dangerouslySetInnerHTML={{ __html: data.content || "" }}
                />
              </section>
            )}

            {block.type === "features" && (
              <section className="border-b border-orange-100 bg-white px-4 py-14 sm:px-6 lg:px-10">
                <div className="mb-10 grid gap-4 lg:grid-cols-[0.55fr_1.45fr] lg:items-end">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
                      Điểm nổi bật
                    </p>
                    {data.title && (
                      <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
                        {data.title}
                      </h2>
                    )}
                  </div>
                  {data.subtitle && (
                    <p className="text-sm font-medium leading-7 text-slate-500">{data.subtitle}</p>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {(data.items || []).map((item: any, fIdx: number) => (
                    <motion.div
                      key={fIdx}
                      initial={{ opacity: 0, y: 22 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: fIdx * 0.05 }}
                      className="border border-orange-100 bg-[#fffaf3] p-6 transition hover:border-orange-300 hover:bg-white"
                    >
                      <div className="mb-5 flex h-12 w-12 items-center justify-center bg-orange-500 text-white">
                        <DynIcon name={item.icon || "Award"} className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-black tracking-[-0.03em] text-slate-950">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
                        {item.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {block.type === "split" && (
              <section className="border-b border-orange-100 bg-[#fbfaf7] px-4 py-14 sm:px-6 lg:px-10">
                <div className="grid gap-8 md:grid-cols-2 md:items-stretch">
                  <motion.div
                    initial={{ opacity: 0, x: data.imagePosition === "left" ? 24 : -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45 }}
                    className={`flex flex-col justify-center border border-orange-100 bg-white p-7 sm:p-10 ${data.imagePosition === "left" ? "md:order-2" : "md:order-1"
                      }`}
                  >
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
                      {data.label || "Nội dung"}
                    </p>
                    <h2 className="mt-3 text-3xl font-black leading-tight tracking-[-0.04em] text-slate-950 sm:text-4xl">
                      {data.title}
                    </h2>
                    <p className="mt-5 whitespace-pre-line text-sm font-medium leading-8 text-slate-600 sm:text-base">
                      {data.description}
                    </p>
                    {data.ctaText && (
                      <Link
                        href={data.ctaLink || "#"}
                        className="mt-7 inline-flex w-fit items-center gap-2 bg-slate-950 px-6 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-orange-600"
                      >
                        {data.ctaText}
                        <ArrowRight size={15} />
                      </Link>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: data.imagePosition === "left" ? -24 : 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45 }}
                    className={`min-h-[320px] overflow-hidden border border-orange-100 bg-orange-50 ${data.imagePosition === "left" ? "md:order-1" : "md:order-2"
                      }`}
                  >
                    <img
                      src={data.imageUrl || "/uploads/process-preview.jpg"}
                      alt={data.title || "Hình ảnh"}
                      className="h-full min-h-[320px] w-full object-cover"
                    />
                  </motion.div>
                </div>
              </section>
            )}

            {block.type === "products" && (
              <section className="border-b border-orange-100 bg-white px-4 py-14 sm:px-6 lg:px-10">
                <div className="mb-10 grid gap-4 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
                      Sản phẩm liên quan
                    </p>
                    <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
                      {data.title || "Sản phẩm nổi bật"}
                    </h2>
                  </div>
                  {data.subtitle && (
                    <p className="text-sm font-medium leading-7 text-slate-500">{data.subtitle}</p>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {(Array.isArray(data.productIds) && data.productIds.length > 0
                    ? productsList.filter((product) => data.productIds.includes(product.id))
                    : productsList.slice(0, 6)
                  ).map((product, pIdx) => (
                    <motion.div
                      key={product.id || pIdx}
                      initial={{ opacity: 0, y: 22 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: pIdx * 0.05 }}
                    >
                      <Link
                        href={`/san-pham/${product.slug}`}
                        className="group block h-full border border-orange-100 bg-[#fffaf3] transition hover:border-orange-300 hover:bg-white hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
                      >
                        <div className="aspect-[4/3] overflow-hidden border-b border-orange-100 bg-orange-50">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-5">
                          <span className="bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-orange-600">
                            {product.categoryLabel || "Ăn vặt"}
                          </span>
                          <h3 className="mt-4 line-clamp-2 text-xl font-black leading-tight tracking-[-0.03em] text-slate-950 group-hover:text-orange-600">
                            {product.name}
                          </h3>
                          {product.tagline && (
                            <p className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-slate-500">
                              {product.tagline}
                            </p>
                          )}
                          <div className="mt-5 flex items-center justify-between border-t border-orange-100 pt-4">
                            <span className="text-sm font-black text-orange-600">
                              {product.priceRange || product.price || "Liên hệ"}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-slate-500 group-hover:text-orange-600">
                              Xem
                              <ArrowRight size={13} />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {data.ctaText && (
                  <div className="mt-10 text-center">
                    <Link
                      href={data.ctaLink || "/san-pham"}
                      className="inline-flex items-center gap-2 bg-orange-500 px-7 py-4 text-xs font-black uppercase tracking-wider text-white transition hover:bg-orange-600"
                    >
                      <ShoppingBag size={16} />
                      {data.ctaText}
                    </Link>
                  </div>
                )}
              </section>
            )}
          </div>
        );
      })}
    </main>
  );
}
