"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { blogPosts, blogCategories } from "@/data/blog";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const featured = blogPosts.find((p) => p.featured);
  const filtered = blogPosts.filter((p) => {
    if (selectedCategory === "all") return !p.featured;
    return p.category === selectedCategory && !p.featured;
  });

  return (
    <>
      <section className="pt-20 pb-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader label="Blog" title="Tin tức & Câu chuyện" description="Cập nhật mới nhất từ Ăn Cùng Bà Tuyết — Thông báo, hậu trường, công thức sáng tạo" />
        </div>
      </section>

      {/* Featured post */}
      {featured && (
        <section className="pb-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Link href={`/tin-tuc/${featured.slug}`} className="group block rounded-3xl overflow-hidden bg-cream hover:shadow-xl transition-all">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="aspect-video md:aspect-auto bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center min-h-[300px]">
                    <span className="text-6xl font-bold text-secondary/20">BT</span>
                  </div>
                  <div className="p-8 sm:p-12 flex flex-col justify-center">
                    <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full w-fit">
                      {featured.categoryLabel}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-neutral mt-3 group-hover:text-primary transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-gray-500 mt-3 leading-relaxed">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 mt-6 text-sm text-gray-400">
                      <span>{formatDate(featured.date)}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {featured.readTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Category filter */}
      <section className="py-4 bg-white sticky top-16 lg:top-18 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {blogCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.value
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link href={`/tin-tuc/${post.slug}`} className="group block bg-cream rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-200">{post.categoryLabel.charAt(0)}</span>
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold text-primary">{post.categoryLabel}</span>
                    <h3 className="font-bold text-neutral mt-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-3 mt-4 text-xs text-gray-400">
                      <span>{formatDate(post.date)}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-cream">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral">Đăng ký nhận tin từ Bà Tuyết</h2>
            <p className="text-gray-500 mt-3">Nhận thông tin sản phẩm mới, ưu đãi đặc biệt và câu chuyện hậu trường</p>
            <div className="flex gap-3 mt-6 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-5 py-3 rounded-full bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button className="px-6 py-3 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary-dark transition-colors flex items-center gap-2">
                Đăng ký <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
