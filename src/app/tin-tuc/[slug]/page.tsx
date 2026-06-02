import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User, Eye, Tag } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

function formatDate(dateStr: Date | string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getReadTime(content: string | null) {
  if (!content) return "2 phút";
  const words = content.trim().split(/\s+/).length;
  const time = Math.ceil(words / 200);
  return `${time} phút`;
}

// 1. Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post || post.status !== "PUBLISHED") {
    return {
      title: "Bài viết không tìm thấy",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const seoTitle = post.seoTitle || `${post.title} | Ăn Cùng Bà Tuyết`;
  const seoDescription = post.seoDescription || post.excerpt || "";

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: siteUrl ? `${siteUrl}/tin-tuc/${post.slug}` : undefined,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      images: post.coverImageUrl ? [{ url: post.coverImageUrl, alt: post.title }] : [],
    },
  };
}

// 2. Server Component Implementation
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  let post;
  try {
    // Try to increment views and fetch post
    post = await prisma.post.update({
      where: { slug },
      data: {
        viewCount: {
          increment: 1,
        },
      },
      include: {
        author: { select: { name: true } },
        category: true,
        tags: { include: { tag: true } },
      },
    });
  } catch (error) {
    // Fallback if increment fails or update fails
    post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { name: true } },
        category: true,
        tags: { include: { tag: true } },
      },
    });
  }

  // Restrict display: only allow public access to PUBLISHED articles
  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  // 3. Fetch Related Posts (Up to 3, same category, excluding self)
  let relatedPosts: any[] = [];
  if (post.categoryId) {
    relatedPosts = await prisma.post.findMany({
      where: {
        categoryId: post.categoryId,
        status: "PUBLISHED",
        NOT: { id: post.id },
      },
      include: {
        author: { select: { name: true } },
        category: true,
      },
      take: 3,
      orderBy: { createdAt: "desc" },
    });
  }

  // 4. JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://ancungbatuyet.vn/tin-tuc/${post.slug}`
    },
    "headline": post.title,
    "description": post.seoDescription || post.excerpt || "",
    "image": post.coverImageUrl || "",
    "author": {
      "@type": "Person",
      "name": post.author.name
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ăn Cùng Bà Tuyết",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ancungbatuyet.vn/logo.png"
      }
    },
    "datePublished": post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    "dateModified": post.updatedAt.toISOString()
  };

  return (
    <>
      {/* Insert JSON-LD into document */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="bg-[#F8FAFC] min-h-screen pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back button */}
          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-500 text-xs sm:text-sm font-bold mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Tất cả bài viết</span>
          </Link>

          {/* Article Header Container */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-sm space-y-6">
            <div className="space-y-4">
              {post.category && (
                <span className="inline-block bg-orange-500/10 text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {post.category.name}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
                {post.title}
              </h1>

              {/* Author & Info bar */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-4 border-t border-slate-50 text-xs text-slate-400 font-semibold">
                <span className="flex items-center gap-1.5"><User size={14} className="text-slate-400" /> {post.author.name}</span>
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-400" /> {formatDate(post.publishedAt || post.createdAt)}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /> {getReadTime(post.content)}</span>
                <span className="flex items-center gap-1.5"><Eye size={14} className="text-slate-400" /> {post.viewCount} lượt xem</span>
              </div>
            </div>

            {/* Cover Image */}
            {post.coverImageUrl && (
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative">
                <img
                  src={post.coverImageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Content Body */}
            <div className="pt-4">
              {post.excerpt && (
                <p className="text-base sm:text-lg font-semibold text-slate-600 leading-relaxed border-l-4 border-orange-500 pl-4 mb-8">
                  {post.excerpt}
                </p>
              )}

              <div 
                className="prose prose-orange max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: post.content || "" }}
              />
            </div>

            {/* Tag List */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-2 items-center">
                <span className="text-xs font-bold text-slate-400 inline-flex items-center gap-1">
                  <Tag size={13} /> Thẻ:
                </span>
                {post.tags.map((pt: any) => (
                  <span
                    key={pt.tag.id}
                    className="bg-slate-100 text-slate-600 hover:text-orange-500 text-xs px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer"
                  >
                    #{pt.tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Related Posts Section */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 space-y-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Bài viết liên quan
              </h2>
              <div className="grid sm:grid-cols-3 gap-6">
                {relatedPosts.map((rPost) => (
                  <Link
                    key={rPost.id}
                    href={`/tin-tuc/${rPost.slug}`}
                    className="group flex flex-col bg-white rounded-2xl p-5 border border-slate-150 shadow-sm hover:shadow-md transition-all duration-300 h-full"
                  >
                    <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-2">
                      {rPost.category?.name || "Tin tức"}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-orange-500 transition-colors flex-1">
                      {rPost.title}
                    </h3>
                    <div className="mt-4 pt-3 border-t border-slate-50 text-[10px] text-slate-400 font-semibold">
                      {formatDate(rPost.publishedAt || rPost.createdAt)}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
