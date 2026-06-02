"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { products, otherProducts } from "@/data/products";

export default function ProductsPage() {
  return (
    <>
      <section className="pt-20 pb-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            label="Khám phá"
            title="Sản phẩm của Bà Tuyết"
            description="Mỗi sản phẩm, một câu chuyện — được làm từ nguyên liệu sạch, với tâm huyết của người nông dân Việt Nam"
          />
        </div>
      </section>

      <section className="pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="space-y-8">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Link
                  href={`/san-pham/${product.slug}`}
                  className={`group relative block rounded-3xl overflow-hidden ${
                    i === 0 ? "bg-gradient-to-r from-red-50 to-red-100/50" :
                    i === 1 ? "bg-gradient-to-r from-orange-50 to-amber-100/50" :
                    "bg-gradient-to-r from-yellow-50 to-amber-50"
                  }`}
                >
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="p-8 sm:p-12 flex flex-col justify-center">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                        {product.categoryLabel}
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-bold text-neutral mt-2">
                        {product.name}
                      </h2>
                      <p className="text-xl text-gray-500 mt-2 font-medium">{product.tagline}</p>
                      <p className="text-gray-600 mt-4 leading-relaxed line-clamp-3">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-6 mt-6">
                        <span className="text-lg font-bold text-neutral">{product.priceRange}</span>
                        <span className="inline-flex items-center gap-1 text-primary font-semibold group-hover:gap-2 transition-all">
                          Khám phá <ChevronRight size={18} />
                        </span>
                      </div>
                    </div>
                    <div className="aspect-square md:aspect-auto flex items-center justify-center p-8">
                      <div className="w-64 h-64 rounded-3xl bg-white/60 backdrop-blur shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                        <span className="text-6xl font-extrabold text-primary/20">{product.name.charAt(0)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader label="Bộ sưu tập" title="Sản phẩm khác" description="Khám phá thế giới ăn vặt đa dạng từ Bà Tuyết" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {otherProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white rounded-2xl p-4 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-gray-300">{product.name.charAt(0)}</span>
                </div>
                <h3 className="font-semibold text-sm text-neutral">{product.name}</h3>
                <p className="text-primary font-bold text-sm mt-1">{product.price}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/san-pham/bo-suu-tap" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold">
              Xem tất cả <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h3 className="text-2xl font-bold text-neutral text-center mb-8">So sánh sản phẩm chủ lực</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 px-4 text-left text-gray-500 font-medium">Tiêu chí</th>
                  {products.map((p) => (
                    <th key={p.id} className="py-3 px-4 text-center font-bold text-neutral">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Giá từ", key: "price" },
                  { label: "Hương vị", values: ["6 vị", "6 vị", "4 vị"] },
                  { label: "Best seller", values: ["Vị cay", "Vị tiêu đen", "Vị muối ớt"] },
                  { label: "Chất bảo quản", values: ["Không", "Không", "Không"] },
                  { label: "Bảo hiểm PVI", values: ["✓", "✓", "✓"] },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-500 font-medium">{row.label}</td>
                    {row.key === "price"
                      ? products.map((p) => (
                          <td key={p.id} className="py-3 px-4 text-center font-semibold text-primary">{p.price}</td>
                        ))
                      : row.values?.map((v, vi) => (
                          <td key={vi} className="py-3 px-4 text-center text-gray-700">{v}</td>
                        ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
