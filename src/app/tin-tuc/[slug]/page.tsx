import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Eye, Tag, User } from "lucide-react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { normalizeContentAssetUrls } from "@/lib/content-assets";

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
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const time = Math.max(1, Math.ceil(words / 200));
  return `${time} phút`;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) {
    return {
      title: "Bài viết không tìm thấy",
    };
  }

  let isPreview = false;
  if (post.status !== "PUBLISHED") {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("auth_token")?.value;
      if (token) {
        const payload = verifyToken(token);
        if (payload && (payload.role === "ADMIN" || payload.role === "EDITOR" || post.authorId === payload.id)) {
          isPreview = true;
        }
      }
    } catch (e) {
      // Ignore
    }

    if (!isPreview) {
      return {
        title: "Bài viết không tìm thấy",
      };
    }
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

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true } },
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (!post) {
    notFound();
  }

  let isPreview = false;
  if (post.status !== "PUBLISHED") {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("auth_token")?.value;
      if (token) {
        const payload = verifyToken(token);
        if (payload && (payload.role === "ADMIN" || payload.role === "EDITOR" || post.authorId === payload.id)) {
          isPreview = true;
        }
      }
    } catch (e) {
      // Ignore
    }

    if (!isPreview) {
      notFound();
    }
  }

  if (!isPreview) {
    await prisma.post
      .update({
        where: { id: post.id },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      })
      .catch(() => null);
  }

  const currentViewCount = post.viewCount + (isPreview ? 0 : 1);
  const postContent = normalizeContentAssetUrls(post.content);

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

  const authorName = post.author?.name || "Ăn Cùng Bà Tuyết";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://ancungbatuyet.vn/tin-tuc/${post.slug}`,
    },
    headline: post.title,
    description: post.seoDescription || post.excerpt || "",
    image: post.coverImageUrl || "",
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Ăn Cùng Bà Tuyết",
      logo: {
        "@type": "ImageObject",
        url: "https://ancungbatuyet.vn/logo.png",
      },
    },
    datePublished: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {isPreview && (
        <div className="sticky top-16 z-40 bg-amber-400 border-b border-amber-750 px-6 py-2.5 text-center text-xs font-black uppercase tracking-wider text-slate-950 shadow-md">
          PREVIEW MODE — Bạn đang xem trước bài viết ở trạng thái [{post.status}] vì đã đăng nhập quyền quản trị.
        </div>
      )}

      <article className="min-h-screen bg-[#fbfaf7] pb-20 pt-24 text-slate-950">
        <header className="border-b border-orange-100 bg-[#fff7ed] px-4 py-8 sm:px-6 lg:px-10">
          <Link
            href="/tin-tuc"
            className="mb-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-orange-600 transition hover:text-orange-700"
          >
            <ArrowLeft size={15} />
            Tất cả bài viết
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              {post.category && (
                <span className="mb-4 inline-flex bg-orange-500 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                  {post.category.name}
                </span>
              )}
              <h1 className="max-w-5xl text-4xl font-black leading-tight tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="mt-5 max-w-3xl border-l-4 border-orange-500 pl-5 text-lg font-bold leading-8 text-slate-700">
                  {post.excerpt}
                </p>
              )}
            </div>

            <div className="grid gap-2 border border-orange-100 bg-white p-5 text-xs font-bold text-slate-500 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <span className="flex items-center gap-2">
                <User size={15} className="text-orange-500" />
                {authorName}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={15} className="text-orange-500" />
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={15} className="text-orange-500" />
                {getReadTime(postContent)} đọc
              </span>
              <span className="flex items-center gap-2">
                <Eye size={15} className="text-orange-500" />
                {currentViewCount} lượt xem
              </span>
            </div>
          </div>
        </header>

        {post.coverImageUrl && (
          <section className="border-b border-orange-100 bg-white px-4 py-6 sm:px-6 lg:px-10">
            <div className="aspect-[16/7] min-h-[280px] w-full overflow-hidden border border-orange-100 bg-orange-50">
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          </section>
        )}

        <section className="grid gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(280px,0.22fr)] lg:px-10">
          <div className="border border-orange-100 bg-white p-6 sm:p-8 lg:p-10">
            <div
              className="prose prose-orange max-w-none prose-headings:font-black prose-headings:tracking-[-0.03em] prose-p:leading-8 prose-img:border prose-img:border-orange-100 prose-a:font-bold prose-a:text-orange-600 text-slate-800"
              dangerouslySetInnerHTML={{ __html: postContent }}
            />

            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-orange-100 pt-6">
                <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-slate-400">
                  <Tag size={13} />
                  Thẻ
                </span>
                {post.tags.map((pt: any) => (
                  <span
                    key={pt.tag.id}
                    className="bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700"
                  >
                    #{pt.tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:h-fit">
            <div className="border border-orange-100 bg-white p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
                Truyền thông thương hiệu
              </p>
              <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
                Nội dung tin tức nên dùng để kể câu chuyện sản phẩm, nhà máy, quy trình và hoạt động thương hiệu một cách có bằng chứng.
              </p>
              <Link
                href="/gioi-thieu"
                className="mt-5 inline-flex items-center gap-2 bg-orange-500 px-4 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-orange-600"
              >
                Về thương hiệu
              </Link>
            </div>

            {relatedPosts.length > 0 && (
              <div className="border border-orange-100 bg-white p-5">
                <h2 className="text-lg font-black tracking-[-0.03em] text-slate-950">
                  Bài viết liên quan
                </h2>
                <div className="mt-5 space-y-4">
                  {relatedPosts.map((rPost) => (
                    <Link
                      key={rPost.id}
                      href={`/tin-tuc/${rPost.slug}`}
                      className="group block border-b border-orange-100 pb-4 last:border-b-0 last:pb-0"
                    >
                      {rPost.category && (
                        <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">
                          {rPost.category.name}
                        </span>
                      )}
                      <h3 className="mt-2 line-clamp-2 text-sm font-black leading-6 text-slate-950 transition group-hover:text-orange-600">
                        {rPost.title}
                      </h3>
                      <p className="mt-2 text-[11px] font-semibold text-slate-400">
                        {formatDate(rPost.publishedAt || rPost.createdAt)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </section>
      </article>
    </>
  );
}
