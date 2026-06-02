"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Search, Calendar, User, BookOpen } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  coverImageUrl: string | null;
  status: string;
  author: { name: string; email: string };
  category?: { name: string; slug: string } | null;
  createdAt: string;
  viewCount: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" });
}

function getReadTime(content: string | null) {
  if (!content) return "2 phút";
  const words = content.trim().split(/\s+/).length;
  const time = Math.ceil(words / 200); // 200 words per minute average
  return `${time} phút`;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategorySlug, searchQuery]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("status", "PUBLISHED");
      if (selectedCategorySlug && selectedCategorySlug !== "all") {
        params.append("categorySlug", selectedCategorySlug);
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const res = await fetch(`/api/posts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };

  // The latest published post is the Featured Post
  const featured = posts.length > 0 ? posts[0] : null;
  const listPosts = posts.length > 1 ? posts.slice(1) : [];

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Page Header */}
      <section className="pt-24 pb-12 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="inline-block bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Tin tức & Góc chia sẻ
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Ăn Cùng Bà Tuyết Blog
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Cập nhật các thông báo mới nhất, hậu trường thú vị tại xưởng sản xuất, và các công thức biến tấu món ăn vặt độc đáo từ Ăn Cùng Bà Tuyết.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="py-6 bg-white border-b border-slate-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategorySlug("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategorySlug === "all"
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/10"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategorySlug(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategorySlug === cat.slug
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/10"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Tìm bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-250 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-800"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Clock className="animate-spin text-orange-500" size={36} />
            <p className="text-sm font-semibold text-slate-500">Đang tải bài viết...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-slate-500 space-y-3">
            <BookOpen size={48} className="mx-auto text-slate-300" />
            <p className="text-lg font-bold text-slate-700">Không tìm thấy bài viết nào</p>
            <p className="text-sm text-slate-400">Hãy thử nhập từ khóa khác hoặc chọn chuyên mục khác.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Post Render */}
            {featured && !searchQuery && selectedCategorySlug === "all" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  href={`/tin-tuc/${featured.slug}`}
                  className="group block rounded-3xl overflow-hidden bg-white hover:shadow-xl border border-slate-100/80 transition-all duration-300"
                >
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="aspect-video md:aspect-auto bg-slate-800 relative min-h-[300px] overflow-hidden">
                      {featured.coverImageUrl ? (
                        <img
                          src={featured.coverImageUrl}
                          alt={featured.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white font-extrabold text-6xl">
                          BT
                        </div>
                      )}
                      <span className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                        Nổi bật
                      </span>
                    </div>
                    <div className="p-8 sm:p-12 flex flex-col justify-center space-y-4">
                      {featured.category && (
                        <span className="bg-orange-500/10 text-orange-600 text-xs font-bold px-3 py-1 rounded-full w-fit">
                          {featured.category.name}
                        </span>
                      )}
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight group-hover:text-orange-500 transition-colors">
                        {featured.title}
                      </h2>
                      <p className="text-slate-500 text-sm sm:text-base leading-relaxed line-clamp-3">
                        {featured.excerpt}
                      </p>
                      <div className="flex items-center gap-6 pt-4 border-t border-slate-50 text-xs text-slate-400 font-semibold">
                        <span className="flex items-center gap-1.5"><User size={14} /> {featured.author.name}</span>
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatDate(featured.createdAt)}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} /> {getReadTime(featured.content)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Grid Posts */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* If we are searching or filtering, show all posts in grid, otherwise list rest */}
              {(searchQuery || selectedCategorySlug !== "all" ? posts : listPosts).map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link
                    href={`/tin-tuc/${post.slug}`}
                    className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden hover:shadow-lg border border-slate-100/80 transition-all duration-300"
                  >
                    <div className="aspect-video bg-slate-800 overflow-hidden relative">
                      {post.coverImageUrl ? (
                        <img
                          src={post.coverImageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-200 font-extrabold text-3xl">
                          BÀ TUYẾT
                        </div>
                      )}
                      {post.category && (
                        <span className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-sm text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider">
                          {post.category.name}
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-orange-500 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-[11px] text-slate-400 font-semibold">
                        <span className="flex items-center gap-1"><User size={12} /> {post.author.name}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {getReadTime(post.content)}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-4 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Đăng ký nhận tin từ Bà Tuyết</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Nhận thông báo tin tức nóng hổi, khuyến mãi đặc biệt và bí quyết chế biến món ăn ngon nhất.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 pt-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email của bạn"
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
            <button className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs shadow-md shadow-orange-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-1">
              <span>Đăng ký</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
