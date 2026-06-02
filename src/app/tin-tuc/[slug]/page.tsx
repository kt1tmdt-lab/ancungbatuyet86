"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { blogPosts } from "@/data/blog";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral">Bài viết không tìm thấy</h1>
          <Link href="/tin-tuc" className="text-primary mt-4 inline-block">Quay lại tin tức</Link>
        </div>
      </div>
    );
  }

  return (
    <article className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link href="/tin-tuc" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary text-sm font-medium mb-8">
          <ArrowLeft size={16} /> Tất cả bài viết
        </Link>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
            {post.categoryLabel}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral mt-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
            <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(post.date)}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</span>
          </div>

          <div className="mt-8 aspect-video rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-200">{post.categoryLabel.charAt(0)}</span>
          </div>

          <div className="mt-10 prose prose-lg max-w-none">
            <p className="text-lg text-gray-600 leading-relaxed">{post.excerpt}</p>
            <p className="text-gray-500 leading-relaxed mt-4">
              Đây là trang prototype — nội dung chi tiết sẽ được thêm khi kết nối với hệ thống quản lý nội dung (CMS).
              Mỗi bài viết sẽ bao gồm nội dung rich text, hình ảnh, video embed, và các link liên quan.
            </p>
          </div>
        </motion.div>
      </div>
    </article>
  );
}
