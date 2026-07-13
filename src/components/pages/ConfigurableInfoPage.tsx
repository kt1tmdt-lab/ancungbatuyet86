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
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(() => {});
  }, []);

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

        if (block.type === "products") {
          return (
            <section key={block.id || index} className="border-b border-orange-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
              <div className="max-w-5xl mx-auto space-y-10">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">{data.title}</h2>
                  {data.subtitle && (
                    <p className="text-sm font-semibold leading-7 text-slate-500">{data.subtitle}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {products
                    .filter(p => (data.productIds || []).includes(p.id))
                    .map(p => (
                      <div key={p.id} className="bg-[#fffbf5] border border-orange-100 overflow-hidden shadow-sm flex flex-col justify-between h-full group hover:shadow-md transition">
                        <div className="relative aspect-square overflow-hidden bg-slate-50">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                          <span className="absolute top-3 left-3 bg-orange-500 text-white text-[9px] font-black px-2.5 py-1 uppercase tracking-wider">
                            {p.categoryLabel || "Sản phẩm"}
                          </span>
                        </div>
                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            <h3 className="text-xs font-bold text-slate-900 group-hover:text-orange-500 transition line-clamp-1">{p.name}</h3>
                            <p className="text-xs font-black text-orange-500">{p.price}</p>
                          </div>
                          <Link href={`/san-pham/${p.slug}`} className="w-full text-center bg-slate-900 text-white text-[10px] font-bold py-2 block cursor-pointer transition hover:bg-orange-500">
                            Đặt Mua Ngay
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </section>
          );
        }

        if (block.type === "testimonials") {
          return (
            <section key={block.id || index} className="border-b border-orange-100 bg-[#fff8ed] px-5 py-16 sm:px-8 lg:px-16">
              <div className="max-w-5xl mx-auto space-y-12">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">{data.title}</h2>
                  {data.subtitle && (
                    <p className="text-sm font-semibold leading-7 text-slate-500">{data.subtitle}</p>
                  )}
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {(data.items || []).map((item: any, tIdx: number) => (
                    <div key={tIdx} className="bg-white border border-orange-100 p-6 shadow-sm hover:shadow transition relative flex flex-col justify-between rounded">
                      <div className="space-y-4">
                        <div className="flex gap-1 text-amber-500">
                          {Array.from({ length: item.rating || 5 }).map((_, i) => (
                            <Icons.Star key={i} size={14} fill="currentColor" />
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 italic leading-relaxed">"{item.review}"</p>
                      </div>
                      <div className="flex items-center gap-3 pt-6 border-t border-slate-50 mt-6">
                        {item.avatarUrl ? (
                          <img src={item.avatarUrl} alt={item.name} className="w-9 h-9 rounded-full object-cover border border-orange-150" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                            {item.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                          <p className="text-[10px] text-slate-400 font-semibold">{item.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (block.type === "gallery") {
          return (
            <section key={block.id || index} className="border-b border-orange-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
              <div className="max-w-5xl mx-auto space-y-10">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">{data.title}</h2>
                  {data.subtitle && (
                    <p className="text-sm font-semibold leading-7 text-slate-500">{data.subtitle}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(data.images || []).map((imgUrl: string, gIdx: number) => (
                    <div key={gIdx} className="relative aspect-square overflow-hidden border border-orange-100 bg-slate-50 shadow-sm hover:shadow transition group">
                      <img src={imgUrl} alt={`Gallery Image ${gIdx}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (block.type === "combos") {
          return (
            <section key={block.id || index} className="border-b border-orange-100 bg-[#fff8ed] px-5 py-16 sm:px-8 lg:px-16">
              <div className="max-w-5xl mx-auto space-y-12">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">{data.title}</h2>
                  {data.subtitle && (
                    <p className="text-sm font-semibold leading-7 text-slate-500">{data.subtitle}</p>
                  )}
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 justify-center">
                  {(data.items || []).map((combo: any, cIdx: number) => (
                    <div key={cIdx} className="bg-white border-2 border-orange-100 hover:border-orange-505 transition p-6 flex flex-col justify-between relative shadow-sm hover:shadow-lg rounded">
                      {combo.tag && (
                        <span className="absolute -top-3 right-4 bg-orange-600 text-white text-[9px] font-black px-2.5 py-1 uppercase tracking-wider rounded">
                          {combo.tag}
                        </span>
                      )}
                      <div className="space-y-4">
                        <h3 className="text-lg font-black text-slate-950">{combo.name}</h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-orange-600">{combo.price}</span>
                          {combo.originalPrice && (
                            <span className="text-xs text-slate-400 line-through font-semibold">{combo.originalPrice}</span>
                          )}
                        </div>
                        <ul className="space-y-2 pt-4 border-t border-slate-100">
                          {(combo.benefits || []).map((benefit: string, bIdx: number) => (
                            <li key={bIdx} className="flex items-start gap-2 text-xs text-slate-600 font-medium leading-relaxed">
                              <Icons.Check size={14} className="text-green-500 mt-0.5 shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Link href={combo.ctaLink || "#"} className="mt-8 text-center bg-slate-950 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider py-3 block transition rounded-sm">
                        Đặt Combo Ngay
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (block.type === "faq") {
          return (
            <section key={block.id || index} className="border-b border-orange-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
              <div className="max-w-3xl mx-auto space-y-10">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">{data.title}</h2>
                </div>
                <div className="space-y-4">
                  {(data.items || []).map((faqItem: any, fIdx: number) => (
                    <div key={fIdx} className="border border-orange-100 bg-[#fffbf5] rounded overflow-hidden">
                      <details className="group">
                        <summary className="flex items-center justify-between p-4 font-bold text-xs sm:text-sm text-slate-900 cursor-pointer select-none">
                          <span>{faqItem.question}</span>
                          <span className="transition group-open:rotate-180 text-orange-500">
                            <Icons.ChevronDown size={16} />
                          </span>
                        </summary>
                        <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-orange-100 bg-white">
                          {faqItem.answer}
                        </div>
                      </details>
                    </div>
                  ))}
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
