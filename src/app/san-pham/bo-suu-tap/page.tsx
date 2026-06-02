"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { otherProducts } from "@/data/products";

export default function CollectionPage() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Link href="/san-pham" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary text-sm font-medium mb-8">
          <ArrowLeft size={16} /> Tất cả sản phẩm
        </Link>
        <SectionHeader label="Bộ sưu tập" title="Sản phẩm khác" description="Khám phá thế giới ăn vặt đa dạng từ Bà Tuyết" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {otherProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-cream rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-24 h-24 mx-auto rounded-2xl bg-white flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-gray-200">{product.name.charAt(0)}</span>
              </div>
              <h3 className="font-bold text-neutral">{product.name}</h3>
              <p className="text-primary font-bold mt-1">{product.price}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
