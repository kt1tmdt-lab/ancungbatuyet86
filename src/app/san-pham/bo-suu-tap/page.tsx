"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader, AlertCircle } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

export default function CollectionPage() {
  const [otherProducts, setOtherProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?category=khac")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOtherProducts(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch collection products", err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-24 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Link href="/san-pham" className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-500 text-xs sm:text-sm font-bold mb-8 transition-colors">
          <ArrowLeft size={16} /> 
          <span>Tất cả sản phẩm</span>
        </Link>
        <SectionHeader 
          label="Bộ sưu tập" 
          title="Thế giới ăn vặt khác" 
          description="Khám phá các món ăn vặt đa dạng cực hấp dẫn từ Bà Tuyết được giới thiệu chính hãng." 
        />
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader className="animate-spin text-orange-500" size={36} />
            <p className="text-xs font-semibold text-slate-400">Đang tải bộ sưu tập...</p>
          </div>
        ) : otherProducts.length === 0 ? (
          <div className="text-center py-20 text-slate-400 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <AlertCircle size={40} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-600">Chưa có sản phẩm nào trong bộ sưu tập</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {otherProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white rounded-3xl p-5 border border-slate-100 hover:border-slate-200 text-center hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <Link href={`/san-pham/${product.slug}`} className="block">
                    <div className="aspect-square w-full rounded-2xl overflow-hidden mb-4 border border-slate-50 relative bg-slate-50">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 line-clamp-1">{product.name}</h3>
                  </Link>
                  <p className="text-slate-500 text-xs mt-1 line-clamp-2">{product.tagline}</p>
                </div>
                <Link
                  href={`/san-pham/${product.slug}`}
                  className="mt-4 inline-flex w-full items-center justify-center gap-1 bg-slate-950 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-orange-600"
                >
                  <span>Xem hồ sơ sản phẩm</span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
