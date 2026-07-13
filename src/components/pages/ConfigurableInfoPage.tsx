"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowRight, HelpCircle, Loader } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import type { DefaultInfoPage, InfoPageBlock } from "@/lib/default-info-pages";

type CmsPage = {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  content: InfoPageBlock[];
};

function DynIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (Icons as Record<string, any>)[name];
  if (!Icon) return <HelpCircle className={className} />;
  return <Icon className={className} />;
}

function sectionTone(backgroundColor?: string) {
  if (backgroundColor === "slate-900" || backgroundColor === "neutral") return "bg-slate-950 text-white";
  if (backgroundColor === "white") return "bg-white text-slate-950";
  return "bg-[#fff8ed] text-slate-950";
}

export default function ConfigurableInfoPage({ fallback }: { fallback: DefaultInfoPage }) {
  const [page, setPage] = useState<CmsPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/pages/slug/${fallback.cmsSlug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.content) setPage(data);
      })
      .catch(() => {
        if (!cancelled) setPage(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fallback.cmsSlug]);

  const title = page?.title || fallback.title;
  const blocks = page?.content?.length ? page.content : fallback.blocks;

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center bg-[#fbfaf7]">
        <Loader className="animate-spin text-orange-500" size={34} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-slate-950">
      {blocks.map((block, index) => {
        const data = (block.data || {}) as any;

        if (block.type === "hero") {
          return (
            <section key={block.id || index} className="border-b border-orange-100 bg-[#fff3df] px-5 pb-12 pt-16 sm:px-8 lg:px-16">
              <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
                <div>
                  <p className="inline-flex border-l-4 border-orange-500 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-700">
                    {data.label || title}
                  </p>
                  <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-[-0.055em] text-slate-950 sm:text-5xl lg:text-6xl">
                    {data.title || title}
                  </h1>
                  {data.subtitle && (
                    <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-slate-700 sm:text-lg">
                      {data.subtitle}
                    </p>
                  )}
                  {data.ctaText && (
                    <Link
                      href={data.ctaLink || "#"}
                      className="mt-7 inline-flex items-center gap-2 bg-orange-600 px-6 py-4 text-xs font-black uppercase tracking-wider text-white transition hover:bg-slate-950"
                    >
                      {data.ctaText}
                      <ArrowRight size={15} />
                    </Link>
                  )}
                </div>

                {data.backgroundImage && (
                  <div className="relative min-h-[280px] overflow-hidden border border-orange-200 bg-white shadow-[12px_12px_0_rgba(234,88,12,0.12)]">
                    <img
                      src={data.backgroundImage}
                      alt={data.title || title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </section>
          );
        }

        if (block.type === "text") {
          return (
            <section key={block.id || index} className={`border-b border-orange-100 px-5 py-14 sm:px-8 lg:px-16 ${sectionTone(data.backgroundColor)}`}>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`prose prose-orange max-w-5xl prose-headings:font-black prose-headings:tracking-[-0.04em] prose-p:leading-8 ${
                  data.backgroundColor === "slate-900" || data.backgroundColor === "neutral" ? "prose-invert text-slate-200" : "text-slate-800"
                }`}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content || "") }}
              />
            </section>
          );
        }

        if (block.type === "features") {
          return (
            <section key={block.id || index} className="border-b border-orange-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
              <div className="mb-10 grid gap-4 lg:grid-cols-[0.6fr_1.4fr] lg:items-end">
                <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
                  {data.title}
                </h2>
                {data.subtitle && <p className="text-sm font-semibold leading-7 text-slate-500">{data.subtitle}</p>}
              </div>
              <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-3">
                {(data.items || []).map((item: any, itemIndex: number) => (
                  <div key={`${item.title}-${itemIndex}`} className="border border-orange-100 bg-[#fffaf3] p-7 transition hover:border-orange-300 hover:bg-white">
                    <DynIcon name={item.icon || "Check"} className="h-8 w-8 text-orange-600" />
                    <h3 className="mt-6 text-xl font-black tracking-[-0.03em] text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm font-medium leading-7 text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (block.type === "split") {
          const imageLeft = data.imagePosition === "left";
          return (
            <section key={block.id || index} className="border-b border-orange-100 bg-[#fff8ed] px-5 py-14 sm:px-8 lg:px-16">
              <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                {data.imageUrl && (
                  <div className={`relative aspect-[4/3] overflow-hidden border border-orange-200 bg-white ${imageLeft ? "lg:order-1" : "lg:order-2"}`}>
                    <img src={data.imageUrl} alt={data.title} className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                )}
                <div className={imageLeft ? "lg:order-2" : "lg:order-1"}>
                  <p className="mb-4 inline-flex border-l-4 border-orange-500 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-700">
                    Nội dung
                  </p>
                  <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl">
                    {data.title}
                  </h2>
                  <p className="mt-5 text-base font-semibold leading-8 text-slate-600">{data.description}</p>
                  {data.ctaText && (
                    <Link href={data.ctaLink || "#"} className="mt-7 inline-flex items-center gap-2 bg-slate-950 px-6 py-4 text-xs font-black uppercase tracking-wider text-white transition hover:bg-orange-600">
                      {data.ctaText}
                      <ArrowRight size={15} />
                    </Link>
                  )}
                </div>
              </div>
            </section>
          );
        }

        return null;
      })}
    </main>
  );
}
