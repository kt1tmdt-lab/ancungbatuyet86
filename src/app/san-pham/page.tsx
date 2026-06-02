"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Award, ShieldCheck, Factory, Loader, AlertCircle } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

export default function ProductsPage() {
  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const mainProducts = productsList.filter((p) => p.category !== "khac");
  const otherProductsList = productsList.filter((p) => p.category === "khac");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProductsList(data);
        } else {
          setProductsList([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Page Header */}
      <section className="pt-24 pb-12 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="inline-block bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Khám phá hương vị
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Sản phẩm Ăn Cùng Bà Tuyết
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Mỗi sản phẩm là một câu chuyện tâm huyết — tuyển chọn nguyên liệu tươi ngon nhất, kết hợp công nghệ chế biến khép kín an toàn đạt chứng nhận quốc tế.
            </p>
          </div>
        </div>
      </section>

      {/* Main Products List */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader className="animate-spin text-orange-500" size={36} />
            <p className="text-xs font-semibold text-slate-400">Đang tải danh sách sản phẩm...</p>
          </div>
        ) : mainProducts.length === 0 ? (
          <div className="text-center py-20 text-slate-400 space-y-2 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <AlertCircle size={40} className="mx-auto text-slate-350" />
            <p className="text-sm font-bold text-slate-650">Chưa có sản phẩm nào được thiết lập</p>
          </div>
        ) : (
          <div className="space-y-12">
            {mainProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div
                  className="group relative block rounded-3xl overflow-hidden border border-slate-100 hover:border-slate-200 bg-white hover:shadow-xl transition-all duration-500"
                >
                  <div className="grid md:grid-cols-12 gap-0 items-stretch">
                    {/* Text Details Column */}
                    <div className="p-8 sm:p-12 md:col-span-7 flex flex-col justify-center space-y-4">
                      <span className="bg-orange-500/10 text-orange-600 text-xs font-bold px-3 py-1 rounded-full w-fit uppercase tracking-wider">
                        {product.categoryLabel}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight group-hover:text-orange-500 transition-colors">
                        {product.name}
                      </h2>
                      <p className="text-lg text-orange-500 font-bold leading-none">{product.tagline}</p>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                        {product.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-50">
                        <span className="text-sm font-black text-slate-900">{product.priceRange || product.price}</span>
                        <div className="flex gap-2">
                          <Link
                            href={`/san-pham/${product.slug}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-600 transition-all bg-orange-50 px-4 py-2 rounded-xl"
                          >
                            <span>Xem chi tiết</span> 
                            <ChevronRight size={14} />
                          </Link>
                          {product.purchaseUrl && (
                            <a
                              href={product.purchaseUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 transition-all px-5 py-2 rounded-xl shadow-md shadow-orange-500/10"
                            >
                              <span>Mua ngay (Shopee/TikTok Shop)</span>
                              <ArrowRight size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Real Image Column */}
                    <div className="aspect-square md:aspect-auto md:col-span-5 relative overflow-hidden bg-slate-50 flex items-center justify-center p-8 border-t md:border-t-0 md:border-l border-slate-50">
                      <div className="w-full h-full max-h-[300px] rounded-2xl overflow-hidden shadow-md relative">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Accessories / Other Products List */}
      <section className="py-20 bg-white border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader 
            label="Thế giới ăn vặt" 
            title="Sản phẩm khác từ Bà Tuyết" 
            description="Đa dạng hương vị với chất lượng nguyên liệu đạt chuẩn an toàn vệ sinh thực phẩm." 
          />
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {otherProductsList.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-slate-50 hover:bg-white border border-slate-100 hover:border-slate-200 rounded-3xl p-4 text-center hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <Link href={`/san-pham/${product.slug}`} className="block">
                    <div className="aspect-square w-full rounded-2xl overflow-hidden mb-3 border border-slate-100 relative bg-white">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 line-clamp-1">{product.name}</h3>
                  </Link>
                </div>
                <div className="mt-2 space-y-2">
                  <p className="text-orange-500 font-extrabold text-xs sm:text-sm">{product.price}</p>
                  {product.purchaseUrl && (
                    <a
                      href={product.purchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-1 text-[10px] font-bold text-white bg-orange-500 hover:bg-orange-600 transition px-2.5 py-1.5 rounded-lg"
                    >
                      <span>Mua ngay</span>
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/san-pham/bo-suu-tap" 
              className="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow"
            >
              <span>Xem tất cả bộ sưu tập</span> 
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Product Comparison Section */}
      {!loading && mainProducts.length > 0 && (
        <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6">
          <h3 className="text-2xl font-black text-slate-900 text-center tracking-tight mb-8">So sánh sản phẩm chủ lực</h3>
          
          <div className="overflow-x-auto rounded-3xl border border-slate-150 shadow-sm bg-white">
            <table className="w-full text-sm text-slate-750">
              <thead>
                <tr className="border-b border-slate-150 bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-4 px-6 text-left">Tiêu chí</th>
                  {mainProducts.map((p) => (
                    <th key={p.id} className="py-4 px-6 text-center font-extrabold text-slate-900 text-xs sm:text-sm">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { label: "Giá bán từ", key: "price" },
                  { label: "Hương vị", values: mainProducts.map((p) => p.category === "chan-ga" ? "6 vị đa dạng" : p.category === "tam-cay" ? "6 vị đậm đà" : "4 vị giòn rụm") },
                  { label: "Loại cay nhất", values: mainProducts.map((p) => p.category === "chan-ga" ? "Vị cay siêu cấp ớt hiểm" : p.category === "tam-cay" ? "Vị tiêu đen thơm nồng" : "Vị muối ớt truyền thống") },
                  { label: "Chất bảo quản", values: mainProducts.map(() => "Hoàn toàn không") },
                  { label: "Bảo hiểm trách nhiệm PVI", values: mainProducts.map(() => "100% Bảo hiểm") },
                  { label: "Chứng nhận an toàn", values: mainProducts.map(() => "HACCP + ATTP") },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/30 transition">
                    <td className="py-4 px-6 font-bold text-slate-650 text-xs sm:text-sm">{row.label}</td>
                    {row.key === "price"
                      ? mainProducts.map((p) => (
                          <td key={p.id} className="py-4 px-6 text-center font-extrabold text-orange-500 text-xs sm:text-sm">{p.price}</td>
                        ))
                      : row.values?.map((v, vi) => (
                          <td key={vi} className="py-4 px-6 text-center text-slate-700 text-xs font-semibold">{v}</td>
                        ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
