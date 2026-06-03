"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Calendar, Clock, Search, User } from "lucide-react";

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
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getReadTime(content: string | null) {
  if (!content) return "2 phút";
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const time = Math.max(1, Math.ceil(words / 200));
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
        setCategories(Array.isArray(data) ? data : []);
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
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const res = await fetch(`/api/posts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch posts", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const featured = posts.length > 0 ? posts[0] : null;
  const listPosts = posts.length > 1 ? posts.slice(1) : [];
  const showFeatured = Boolean(featured && !searchQuery && selectedCategorySlug === "all");
  const gridPosts = showFeatured ? listPosts : posts;

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-slate-950">
      <section className="border-b border-orange-100 bg-[#fff7ed] px-4 pb-10 pt-28 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-600">
              Tin tức & truyền thông
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl">
              Câu chuyện sản phẩm, nhà máy và hoạt động thương hiệu.
            </h1>
          </div>
          <div className="border-l-4 border-orange-500 bg-white p-6">
            <p className="text-sm font-bold leading-7 text-slate-600 sm:text-base">
              Trang tin tức nên giống một chuyên trang truyền thông: có ảnh, chuyên mục, ngày đăng và nội dung rõ ràng để tăng niềm tin cho khách hàng, đại lý và đối tác.
            </p>
          </div>
        </div>
      </section>

      <section className="sticky top-16 z-30 border-b border-orange-100 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => setSelectedCategorySlug("all")}
              className={`shrink-0 border px-4 py-2 text-xs font-black uppercase tracking-wider transition ${selectedCategorySlug === "all"
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-orange-100 bg-[#fffaf3] text-slate-600 hover:border-orange-300"
                }`}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategorySlug(cat.slug)}
                className={`shrink-0 border px-4 py-2 text-xs font-black uppercase tracking-wider transition ${selectedCategorySlug === cat.slug
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-orange-100 bg-[#fffaf3] text-slate-600 hover:border-orange-300"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Tìm bài viết, sản phẩm, nhà máy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-orange-100 bg-[#fffaf3] py-3 pl-10 pr-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white"
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center border border-orange-100 bg-white py-24">
            <Clock className="animate-spin text-orange-500" size={36} />
            <p className="mt-3 text-sm font-semibold text-slate-500">Đang tải bài viết...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="border border-dashed border-orange-200 bg-white py-20 text-center text-slate-500">
            <BookOpen size={48} className="mx-auto text-orange-300" />
            <p className="mt-3 text-lg font-black text-slate-800">Không tìm thấy bài viết nào</p>
            <p className="mt-1 text-sm text-slate-500">Hãy thử từ khóa khác hoặc chọn chuyên mục khác.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {showFeatured && featured && (
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Link
                  href={`/tin-tuc/${featured.slug}`}
                  className="group block border border-orange-100 bg-white transition hover:border-orange-300 hover:shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
                >
                  <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="relative min-h-[360px] overflow-hidden border-b border-orange-100 bg-orange-50 lg:border-b-0 lg:border-r">
                      {featured.coverImageUrl ? (
                        <img
                          src={featured.coverImageUrl}
                          alt={featured.title}
                          className="h-full min-h-[360px] w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full min-h-[360px] items-center justify-center bg-orange-100 text-6xl font-black text-orange-500">
                          BT
                        </div>
                      )}
                      <span className="absolute left-5 top-5 bg-orange-500 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                        Bài nổi bật
                      </span>
                    </div>

                    <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                      {featured.category && (
                        <span className="mb-4 w-fit bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-orange-600">
                          {featured.category.name}
                        </span>
                      )}
                      <h2 className="text-3xl font-black leading-tight tracking-[-0.05em] text-slate-950 transition group-hover:text-orange-600 sm:text-4xl">
                        {featured.title}
                      </h2>
                      <p className="mt-4 line-clamp-3 text-sm font-medium leading-7 text-slate-600 sm:text-base">
                        {featured.excerpt}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-orange-100 pt-5 text-xs font-bold text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <User size={14} className="text-orange-500" />
                          {featured.author.name}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={14} className="text-orange-500" />
                          {formatDate(featured.createdAt)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={14} className="text-orange-500" />
                          {getReadTime(featured.content)}
                        </span>
                      </div>
                      <span className="mt-7 inline-flex w-fit items-center gap-2 bg-orange-500 px-5 py-3 text-xs font-black uppercase tracking-wider text-white">
                        Đọc bài viết
                        <ArrowRight size={15} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                >
                  <Link
                    href={`/tin-tuc/${post.slug}`}
                    className="group flex h-full flex-col border border-orange-100 bg-white transition hover:border-orange-300 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden border-b border-orange-100 bg-orange-50">
                      {post.coverImageUrl ? (
                        <img
                          src={post.coverImageUrl}
                          alt={post.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-orange-100 text-3xl font-black text-orange-500">
                          BÀ TUYẾT
                        </div>
                      )}
                      {post.category && (
                        <span className="absolute bottom-4 left-4 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-orange-600 shadow-sm">
                          {post.category.name}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <h3 className="line-clamp-2 text-xl font-black leading-tight tracking-[-0.03em] text-slate-950 transition group-hover:text-orange-600">
                          {post.title}
                        </h3>
                        <p className="mt-3 line-clamp-3 text-sm font-medium leading-6 text-slate-500">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="mt-6 border-t border-orange-100 pt-4">
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-bold text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <Calendar size={13} />
                            {formatDate(post.createdAt)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock size={13} />
                            {getReadTime(post.content)}
                          </span>
                        </div>
                        <span className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-600">
                          Xem thêm
                          <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
