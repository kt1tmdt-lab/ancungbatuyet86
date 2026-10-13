import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import prisma from "@/lib/prisma";
import { normalizeMarketingConfig } from "@/lib/marketing-config";

type PressPageProps = { params: Promise<{ id: string }> };

async function getPressArticle(id: string) {
  const record = await prisma.siteConfig.findUnique({ where: { id: "marketing_assets" } });
  return normalizeMarketingConfig(record?.data).press.find((item) => item.id === id) || null;
}

export async function generateMetadata({ params }: PressPageProps): Promise<Metadata> {
  const article = await getPressArticle((await params).id);
  return { title: article ? `${article.title} | Trên báo chí` : "Bài báo | Ăn Cùng Bà Tuyết", description: article?.description || undefined };
}

export default async function PressArticlePage({ params }: PressPageProps) {
  const article = await getPressArticle((await params).id);
  if (!article || !/^https?:\/\//i.test(article.link)) notFound();

  return (
    <main className="min-h-screen bg-[#fffdfa] text-[#1d2b25]">
      <div className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8 sm:py-12">
        <Link href="/tin-tuc" className="inline-flex items-center gap-2 text-sm font-bold text-[#d95319] hover:underline"><ArrowLeft size={16} /> Về trang Tin tức</Link>
        <div className="mt-8 border-b border-[#e9dfd2] pb-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d95319]">Trên báo chí · {article.sourceName}</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">{article.title}</h1>
          {article.publishDate && <p className="mt-4 text-sm text-[#806f60]">Đăng ngày {new Date(`${article.publishDate}T00:00:00`).toLocaleDateString("vi-VN")}</p>}
          {article.description && <p className="mt-5 max-w-3xl text-base leading-7 text-[#526157]">{article.description}</p>}
          <a href={article.link} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 bg-[#df581d] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#bc4211]">Mở bài gốc trên {article.sourceName || "trang báo"} <ExternalLink size={16} /></a>
        </div>

        {article.imageUrl && <img src={article.imageUrl} alt={article.title} referrerPolicy="no-referrer" className="mt-8 block h-auto w-full object-contain" />}

        <section className="mt-10" aria-labelledby="embedded-article-heading">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 id="embedded-article-heading" className="text-xl font-black">Bài viết trên {article.sourceName || "trang báo"}</h2>
            <span className="text-xs text-[#806f60]">Khung bài gốc do trang báo cung cấp</span>
          </div>
          <div className="border border-[#e9dfd2] bg-white">
            <iframe
              src={article.link}
              title={`Bài báo gốc: ${article.title}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              className="h-[75vh] min-h-[600px] w-full"
            />
          </div>
          <p className="mt-4 text-sm leading-6 text-[#806f60]">Nếu trang báo không cho hiển thị trong khung, hãy dùng nút “Mở bài gốc” phía trên để đọc đầy đủ.</p>
        </section>
      </div>
    </main>
  );
}
