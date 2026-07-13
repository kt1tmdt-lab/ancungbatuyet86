"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowRight, FileSearch, HelpCircle, Loader } from "lucide-react";
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

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function BrandStoryPosterPage({
  title,
  blocks,
  fallbackBlocks,
  products,
}: {
  title: string;
  blocks: InfoPageBlock[];
  fallbackBlocks: InfoPageBlock[];
  products: any[];
}) {
  const findBlock = (type: InfoPageBlock["type"]) =>
    blocks.find((block) => block.type === type) || fallbackBlocks.find((block) => block.type === type);
  const heroData = (findBlock("hero")?.data || {}) as any;
  const splitData = (findBlock("split")?.data || {}) as any;
  const featuresData = (findBlock("features")?.data || {}) as any;
  const textData = (findBlock("text")?.data || {}) as any;
  const storyImage = splitData.imageUrl || heroData.backgroundImage || "/hero/ba-tuyet-character.png";
  const featureItems = Array.isArray(featuresData.items) ? featuresData.items : [];
  const safeStoryHtml = DOMPurify.sanitize(textData.content || "");

  const excludedIds = ["brand-story-origin", "brand-story-principles", "brand-story-text"];
  const remainingBlocks = blocks.filter(
    (block) => block.type !== "hero" && !excludedIds.includes(block.id)
  );

  return (
    <main className="min-h-screen bg-[#fffaf0] text-slate-950">
      <section className="relative w-full overflow-hidden border-b border-orange-200 bg-[#fffaf0]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(251,146,60,0.08),transparent_32%),linear-gradient(135deg,#fffaf0_0%,#fff7e9_52%,#fffdf8_100%)]" />
        <div className="absolute -right-10 -top-8 select-none text-[180px] font-black leading-none text-orange-100/40">BT</div>
        <div className="absolute bottom-0 left-0 h-1.5 w-full bg-orange-600" />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="px-5 py-12 sm:px-8 lg:px-14 lg:py-20">
            <p className="mb-4 w-fit border-b border-orange-300 pb-2 text-[11px] font-black uppercase tracking-[0.26em] text-orange-600">
              {heroData.label || "Câu chuyện thương hiệu"}
            </p>
            <h1 className="text-5xl font-black uppercase leading-[0.86] tracking-[-0.06em] text-orange-900 sm:text-6xl lg:text-7xl">
              Câu chuyện
              <span className="block">thương hiệu</span>
            </h1>
            <div className="mt-5 border-l-4 border-orange-600 pl-4">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-orange-700">Chân Gà Bà Tuyết</p>
              <p className="mt-2 max-w-xl text-sm font-semibold leading-7 text-slate-700">
                {heroData.subtitle || splitData.description || "Ngon phải rõ nguồn gốc, ăn phải thật an tâm."}
              </p>
            </div>

            <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_190px] lg:items-start">
              <div
                className="max-w-none text-[15px] leading-8 text-slate-800 [&_blockquote]:my-6 [&_blockquote]:-rotate-1 [&_blockquote]:border-l-4 [&_blockquote]:border-orange-600 [&_blockquote]:bg-orange-50 [&_blockquote]:p-5 [&_blockquote]:text-2xl [&_blockquote]:font-black [&_blockquote]:leading-tight [&_blockquote]:text-orange-800 [&_h2]:mb-4 [&_h2]:text-3xl [&_h2]:font-black [&_h2]:tracking-[-0.04em] [&_h2]:text-orange-900 [&_h3]:mt-8 [&_h3]:border-t [&_h3]:border-orange-200 [&_h3]:pt-5 [&_h3]:text-2xl [&_h3]:font-black [&_h3]:leading-tight [&_h3]:text-orange-800 [&_p]:mb-4 [&_p]:text-slate-800 [&_strong]:font-black [&_strong]:text-orange-800 [&_p:first-of-type::first-letter]:text-5xl [&_p:first-of-type::first-letter]:font-black [&_p:first-of-type::first-letter]:text-orange-600 [&_p:first-of-type::first-letter]:float-left [&_p:first-of-type::first-letter]:mr-2 [&_p:first-of-type::first-letter]:leading-none"
                dangerouslySetInnerHTML={{ __html: safeStoryHtml }}
              />

              <aside className="hidden space-y-3 lg:block">
                {["“Khủng khiếp.”", "“Làm tốt vẫn có thể bị nói. Làm đúng vẫn có thể bị nghi ngờ.”", "“Nếu ai cũng sợ hãi và bỏ cuộc, vậy ai sẽ là người đứng lên?”"].map((quote, idx) => (
                  <div key={quote} className={`${idx % 2 ? "rotate-1 bg-[#fff3df]" : "-rotate-2 bg-white/85"} border border-orange-200 p-4 shadow-sm`}>
                    <p className="text-lg font-black leading-tight text-orange-800">{quote}</p>
                  </div>
                ))}
              </aside>
            </div>
          </div>

          <div className="relative border-t border-orange-200 bg-orange-50/20 p-6 lg:border-l lg:border-t-0 lg:p-12">
            <div className="sticky top-24 space-y-6">
              <div className="relative overflow-hidden border border-orange-200 bg-white shadow-[0_24px_60px_rgba(234,88,12,0.18)]">
                <div className="aspect-[4/5] bg-orange-100">
                  <img src={storyImage} alt={title} className="h-full w-full object-cover object-top" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-orange-950/75 to-transparent p-5 text-white">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-orange-100">Ăn Cùng Bà Tuyết</p>
                  <p className="mt-1 text-2xl font-black leading-tight">Ngon phải rõ nguồn gốc</p>
                </div>
              </div>

              <div className="grid gap-3">
                {(featureItems.length ? featureItems : [
                  { icon: "Heart", title: "Nỗi sợ rất thật", description: "Sợ chân gà không rõ nguồn gốc." },
                  { icon: "Factory", title: "Trả lời bằng việc làm", description: "Nhà máy, nguyên liệu, quy trình và sản phẩm mỗi ngày." },
                  { icon: "MapPin", title: "Tự hào Thái Nguyên", description: "Một sản phẩm được làm nên từ trách nhiệm." },
                ]).map((item: any, idx: number) => (
                  <div key={`${item.title}-${idx}`} className="grid grid-cols-[42px_1fr] gap-3 border border-orange-200 bg-white/90 p-4">
                    <div className="flex h-10 w-10 items-center justify-center bg-orange-600 text-white">
                      <DynIcon name={item.icon || "CheckCircle2"} className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-orange-900">{item.title}</h3>
                      <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border border-orange-300 bg-orange-600 p-5 text-white">
                <p className="text-3xl font-black uppercase leading-none tracking-[-0.04em]">Chân Gà Bà Tuyết</p>
                <p className="mt-2 text-sm font-black italic text-orange-50">Ngon phải rõ nguồn gốc – Ăn phải thật an tâm</p>
              </div>

              {/* Official Social Media Channels Widget */}
              <div className="border border-orange-200 bg-white p-5 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-orange-955 text-slate-900 flex items-center gap-1.5 border-b border-orange-100 pb-2">
                  <Icons.Flame size={14} className="text-orange-500 animate-pulse" />
                  Kênh truyền thông chính thức
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      name: "TikTok Shop",
                      handle: "@ancungbatuyet",
                      stat: "3.2M+ followers",
                      subStat: "80M+ likes",
                      icon: <Icons.Smartphone size={15} className="text-orange-600" />,
                      pillColor: "bg-orange-50 text-orange-755 text-orange-700 border-orange-100"
                    },
                    {
                      name: "YouTube Channel",
                      handle: "Ăn Cùng Bà Tuyết",
                      stat: "1.2M+ subs",
                      subStat: "Hành trình ẩm thực",
                      icon: <Icons.Play size={15} className="text-red-600" />,
                      pillColor: "bg-red-50 text-red-755 text-red-700 border-red-100"
                    },
                    {
                      name: "Facebook Page",
                      handle: "Ăn Cùng Bà Tuyết",
                      stat: "600k+ followers",
                      subStat: "Cộng đồng ẩm thực",
                      icon: <Icons.Users size={15} className="text-blue-600" />,
                      pillColor: "bg-blue-50 text-blue-755 text-blue-700 border-blue-100"
                    }
                  ].map((chan) => (
                    <div key={chan.name} className="flex items-start justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-orange-300 hover:bg-white transition duration-200">
                      <div className="flex gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                          {chan.icon}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{chan.name}</p>
                          <p className="text-xs font-black text-slate-800 line-clamp-1">{chan.handle}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-full ${chan.pillColor}`}>
                          {chan.stat}
                        </span>
                        <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{chan.subStat}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quality & Trust Seals Widget */}
              <div className="border border-orange-200 bg-[#fffdfa] p-5 space-y-3.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-orange-955 text-slate-900 flex items-center gap-1.5 border-b border-orange-100 pb-2">
                  <Icons.ShieldCheck size={14} className="text-green-600" />
                  Bảo chứng uy tín & Chất lượng
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { title: "Chứng nhận ISO 22000", desc: "Hệ thống quản lý an toàn thực phẩm đạt chuẩn quốc tế.", icon: <Icons.Award className="text-amber-500" size={16} /> },
                    { title: "Bảo hiểm sản phẩm PVI", desc: "Cam kết bảo vệ sức khỏe người tiêu dùng lên tới 10 tỷ VNĐ.", icon: <Icons.ShieldCheck className="text-blue-500" size={16} /> },
                    { title: "Nguyên liệu sạch Việt Nam", desc: "100% nông sản rõ nguồn gốc từ các trang trại VietGAP.", icon: <Icons.CheckCircle2 className="text-green-500" size={16} /> }
                  ].map((seal) => (
                    <div key={seal.title} className="flex gap-3">
                      <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                        {seal.icon}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 leading-none">{seal.title}</p>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5">{seal.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {remainingBlocks.length > 0 && (
        <div className="mt-16 pb-24 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {remainingBlocks.map((block, index) => {
            const data = (block.data || {}) as any;

            if (block.type === "products") {
              return (
                <section key={block.id || index} className="border border-orange-200 bg-white p-8 sm:p-10 shadow-[0_24px_70px_rgba(234,88,12,0.06)] rounded-3xl">
                  <div className="space-y-10">
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
                          <div key={p.id} className="bg-[#fffbf5] border border-orange-100 overflow-hidden shadow-sm flex flex-col justify-between h-full group hover:shadow-md transition rounded-2xl">
                            <div className="relative aspect-square overflow-hidden bg-slate-50">
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                              <span className="absolute top-3 left-3 bg-orange-500 text-white text-[9px] font-black px-2.5 py-1 uppercase tracking-wider rounded">
                                {p.categoryLabel || "Sản phẩm"}
                              </span>
                            </div>
                            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                              <div className="space-y-1">
                                <h3 className="text-xs font-bold text-slate-900 group-hover:text-orange-500 transition line-clamp-1">{p.name}</h3>
                                <p className="text-xs font-black text-orange-500">{p.price}</p>
                              </div>
                              <Link href={`/san-pham/${p.slug}`} className="w-full text-center bg-slate-900 text-white text-[10px] font-bold py-2 block cursor-pointer transition hover:bg-orange-500 rounded-xl">
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
                <section key={block.id || index} className="border border-orange-200 bg-[#fff8ed] p-8 sm:p-10 shadow-[0_24px_70px_rgba(234,88,12,0.06)] rounded-3xl">
                  <div className="space-y-12">
                    <div className="text-center space-y-2">
                      <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">{data.title}</h2>
                      {data.subtitle && (
                        <p className="text-sm font-semibold leading-7 text-slate-500">{data.subtitle}</p>
                      )}
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {(data.items || []).map((item: any, tIdx: number) => (
                        <div key={tIdx} className="bg-white border border-orange-100 p-6 shadow-sm hover:shadow transition relative flex flex-col justify-between rounded-2xl">
                          <div className="space-y-4">
                            <div className="flex gap-1 text-amber-500">
                              {Array.from({ length: item.rating || 5 }).map((_, i) => (
                                <Icons.Star key={i} size={14} fill="currentColor" />
                              ))}
                            </div>
                            <p className="text-xs text-slate-650 italic leading-relaxed">"{item.review}"</p>
                          </div>
                          <div className="flex items-center gap-3 pt-6 border-t border-slate-55 border-slate-100 mt-6">
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
                <section key={block.id || index} className="border border-orange-200 bg-white p-8 sm:p-10 shadow-[0_24px_70px_rgba(234,88,12,0.06)] rounded-3xl">
                  <div className="space-y-10">
                    <div className="text-center space-y-2">
                      <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">{data.title}</h2>
                      {data.subtitle && (
                        <p className="text-sm font-semibold leading-7 text-slate-500">{data.subtitle}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {(data.images || []).map((imgUrl: string, gIdx: number) => (
                        <div key={gIdx} className="relative aspect-square overflow-hidden border border-orange-100 bg-slate-50 shadow-sm hover:shadow transition group rounded-2xl">
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
                <section key={block.id || index} className="border border-orange-200 bg-[#fff8ed] p-8 sm:p-10 shadow-[0_24px_70px_rgba(234,88,12,0.06)] rounded-3xl">
                  <div className="space-y-12">
                    <div className="text-center space-y-2">
                      <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">{data.title}</h2>
                      {data.subtitle && (
                        <p className="text-sm font-semibold leading-7 text-slate-500">{data.subtitle}</p>
                      )}
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 justify-center">
                      {(data.items || []).map((combo: any, cIdx: number) => (
                        <div key={cIdx} className="bg-white border-2 border-orange-100 hover:border-orange-505 transition p-6 flex flex-col justify-between relative shadow-sm hover:shadow-lg rounded-2xl">
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
                                <li key={bIdx} className="flex items-start gap-2 text-xs text-slate-650 text-slate-600 font-medium leading-relaxed">
                                  <Icons.Check size={14} className="text-green-500 mt-0.5 shrink-0" />
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <Link href={combo.ctaLink || "#"} className="mt-8 text-center bg-slate-950 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider py-3 block transition rounded-xl">
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
                <section key={block.id || index} className="border border-orange-200 bg-white p-8 sm:p-10 shadow-[0_24px_70px_rgba(234,88,12,0.06)] rounded-3xl">
                  <div className="space-y-10">
                    <div className="text-center space-y-2">
                      <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">{data.title}</h2>
                    </div>
                    <div className="space-y-4">
                      {(data.items || []).map((faqItem: any, fIdx: number) => (
                        <div key={fIdx} className="border border-orange-100 bg-[#fffbf5] rounded-xl overflow-hidden">
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
        </div>
      )}
    </main>
  );
}

function QualityDetailPage({
  title,
  routePath,
  blocks,
  fallbackBlocks,
}: {
  title: string;
  routePath: string;
  blocks: InfoPageBlock[];
  fallbackBlocks: InfoPageBlock[];
}) {
  const findBlock = (type: InfoPageBlock["type"]) =>
    blocks.find((block) => block.type === type) || fallbackBlocks.find((block) => block.type === type);
  const heroData = (findBlock("hero")?.data || {}) as any;
  const splitData = (findBlock("split")?.data || {}) as any;
  const featuresData = (findBlock("features")?.data || {}) as any;
  const textData = (findBlock("text")?.data || {}) as any;
  const featureItems = Array.isArray(featuresData.items) ? featuresData.items : [];
  const imageUrl = splitData.imageUrl || heroData.backgroundImage || "/bento/bento-factory.png";
  const safeTextHtml = DOMPurify.sanitize(textData.content || "");
  const isSource = routePath.includes("minh-bach");
  const isProcess = routePath.includes("nha-may");
  const isLegal = routePath.includes("ho-so");
  const isPvi = routePath.includes("pvi");
  const isPolicy = routePath.includes("chinh-sach");

  const navItems = [
    ["Tổng quan", "/chat-luong"],
    ["Nguồn nguyên liệu", "/chat-luong/minh-bach-nguon-nguyen-lieu"],
    ["Nhà máy & Quy trình", "/chat-luong/nha-may-quy-trinh-san-xuat"],
    ["Hồ sơ pháp lý", "/chat-luong/ho-so-phap-ly-chung-nhan"],
    ["PVI", "/chat-luong/bao-hiem-trach-nhiem-san-pham-pvi"],
    ["Chính sách khách hàng", "/chat-luong/chinh-sach-bao-ve-quyen-loi-khach-hang"],
  ];

  const vibe = isSource
    ? {
        label: "Trace the origin",
        quote: "Không chống lại nỗi sợ bằng lời nói. Chống lại bằng dấu vết.",
        imageA: "/bento/bento-ingredients.png",
        imageB: "/hero/chan-ga-plate.png",
        stats: [["EU", "Nguồn nhập khẩu"], ["C/O", "Hồ sơ xuất xứ"], ["Cold", "Chuỗi bảo quản"]],
        dark: false,
      }
    : isProcess
      ? {
          label: "Inside the factory",
          quote: "Một sản phẩm đáng tin phải có nơi sản xuất đáng nhìn.",
          imageA: "/bento/bento-factory.png",
          imageB: "/bento/bento-tiktok.png",
          stats: [["3.300m²", "Không gian"], ["6 bước", "Quy trình"], ["ISO", "NMV Food"]],
          dark: true,
        }
      : isLegal
        ? {
            label: "Open the proof",
            quote: "Giấy tờ không để trang trí. Giấy tờ là thứ khách hàng có quyền xem.",
            imageA: "/bento/bento-insurance.png",
            imageB: "/bento/bento-factory.png",
            stats: [["ISO", "Chứng nhận"], ["ATTP", "Điều kiện"], ["VNTEST", "Kiểm nghiệm"]],
            dark: false,
          }
        : isPvi
          ? {
              label: "Responsibility layer",
              quote: "Bảo hiểm không thay chất lượng. Bảo hiểm cho thấy trách nhiệm sau bán.",
              imageA: "/bento/bento-insurance.png",
              imageB: "/hero/ba-tuyet-character.png",
              stats: [["PVI", "Bảo hiểm"], ["Scope", "Phạm vi"], ["Claim", "Quy trình"]],
              dark: true,
            }
          : {
              label: "Customer protection",
              quote: "Niềm tin không kết thúc ở lúc bán hàng. Nó bắt đầu khi khách cần được bảo vệ.",
              imageA: "/hero/ba-tuyet-character.png",
              imageB: "/hero/chan-ga-poster.png",
              stats: [["CSKH", "Tiếp nhận"], ["SLA", "Thời gian"], ["PVI", "Bảo hiểm"]],
              dark: false,
            };

  const extra = routePath.includes("minh-bach")
    ? {
        label: "Bộ hồ sơ nguồn nguyên liệu",
        checklist: ["C/O theo từng lô hàng", "Phiếu kiểm dịch nhập khẩu", "Ảnh container/kho lạnh", "Mã lô và ngày nhập", "Video truy xuất nguồn nguyên liệu"],
        questions: [
          ["Có phải chân gà Trung Quốc không?", "Trang này cần trả lời bằng hồ sơ xuất xứ, không trả lời bằng lời khẳng định chung chung."],
          ["Nguồn Ba Lan/Hungary chứng minh bằng gì?", "Bằng C/O, phiếu kiểm dịch và hồ sơ lô hàng có thể đối chiếu."],
          ["Có cần công khai hết giấy tờ không?", "Nên công bố phần phù hợp, đồng thời bảo vệ các thông tin nhạy cảm."],
        ],
        compliance: "Chỉ ghi nguồn nhập khẩu khi có hồ sơ đi kèm. Không dùng cụm “100% châu Âu” nếu chưa có đủ hồ sơ cho mọi lô hàng.",
      }
    : routePath.includes("nha-may")
      ? {
          label: "Bộ hồ sơ nhà máy",
          checklist: ["Ảnh dây chuyền thật", "Ảnh khu sơ chế", "Ảnh khu đóng gói", "Sơ đồ quy trình 6 bước", "Chứng nhận ISO 22000:2018 cấp cho NMV Food"],
          questions: [
            ["ACBT hay NMV Food được cấp ISO?", "Thông tin cần ghi đúng: NMV Food đạt chứng nhận ISO 22000:2018."],
            ["Quy trình có an toàn tuyệt đối không?", "Không dùng “an toàn tuyệt đối”. Dùng “quy trình 6 bước có kiểm soát”."],
            ["Ảnh nhà máy nên dùng ảnh nào?", "Ưu tiên ảnh/video quay tại NMV Food và có thể xác minh."],
          ],
          compliance: "Không dùng từ “vô trùng”, “an toàn tuyệt đối”, “kiểm soát nghiêm ngặt” nếu không có cơ sở pháp lý rõ.",
        }
      : routePath.includes("ho-so")
        ? {
            label: "Bộ hồ sơ pháp lý",
            checklist: ["ISO 22000:2018", "HACCP", "Giấy đủ điều kiện ATTP", "Phiếu kiểm nghiệm VNTEST", "Ngày cấp và đơn vị cấp"],
            questions: [
              ["Khách xem giấy tờ ở đâu?", "Mỗi hồ sơ nên có phần xem chi tiết rõ ràng, dễ đối chiếu."],
              ["Có được ghi ACBT đạt ISO không?", "Chỉ ghi như vậy nếu giấy chứng nhận cấp cho đúng pháp nhân ACBT."],
              ["Phiếu kiểm nghiệm cần mới không?", "Nên dùng phiếu mới nhất và ghi rõ ngày kiểm nghiệm."],
            ],
            compliance: "Mỗi chứng nhận phải ghi đúng chủ thể được cấp. Hồ sơ nhà máy không tự động trở thành hồ sơ của thương hiệu nếu pháp nhân khác.",
          }
        : routePath.includes("pvi")
          ? {
              label: "Bộ hồ sơ PVI",
              checklist: ["Logo PVI", "Thông tin hợp đồng phù hợp để công bố", "Pháp nhân đứng tên hợp đồng", "Phạm vi bảo hiểm", "Thời hạn hiệu lực"],
              questions: [
                ["PVI có chứng nhận chất lượng sản phẩm không?", "Không. PVI là bảo hiểm trách nhiệm sản phẩm, không phải chứng nhận chất lượng."],
                ["Có được gọi là bảo chứng không?", "Không nên. Dùng “bảo hiểm trách nhiệm sản phẩm”."],
                ["Khách được bảo vệ thế nào?", "Theo phạm vi hợp đồng bảo hiểm và quy trình xử lý khiếu nại."],
              ],
              compliance: "Không frame PVI như đơn vị xác nhận chất lượng. Đây là cam kết trách nhiệm, không phải tem chất lượng.",
            }
          : {
              label: "Bộ chính sách khách hàng",
              checklist: ["Quyền được thông tin", "Điều kiện đổi trả", "Kênh khiếu nại", "Thời gian xử lý", "Hotline/email hỗ trợ"],
              questions: [
                ["Khi sản phẩm lỗi thì làm gì?", "Giữ sản phẩm, bao bì, hóa đơn/ảnh đơn hàng và gửi về kênh CSKH."],
                ["Bao lâu xử lý khiếu nại?", "Cần bổ sung SLA chính thức từ bộ phận CSKH."],
                ["Bảo hiểm PVI liên quan thế nào?", "Chỉ áp dụng theo phạm vi hợp đồng bảo hiểm trách nhiệm sản phẩm."],
              ],
              compliance: "Chính sách phải dễ hiểu, nhưng không hứa quá phạm vi vận hành hoặc phạm vi bảo hiểm.",
            };

  return (
    <main className="min-h-screen bg-[#fff8ed] text-slate-950">
      <section className="relative overflow-hidden border-b border-orange-100 bg-[#fff3df] px-5 py-20 sm:px-8 lg:px-16">
        <div className="absolute inset-0 bg-[linear-gradient(112deg,#fff3df_0%,#fff3df_52%,#ffffff_52%,#ffffff_100%)]" />
        <div className="absolute -right-28 top-16 h-[420px] w-[420px] rounded-full bg-orange-500/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
          <div>
            <p className="inline-flex border-l-4 border-orange-600 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-orange-700">
              {heroData.label || "Chất lượng"}
            </p>
            <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.075em] sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="mt-6 max-w-3xl text-base font-semibold leading-8 text-slate-700">
              {heroData.subtitle || splitData.description || "Mọi thông tin chất lượng cần được trình bày bằng hồ sơ, hình ảnh và dữ liệu có thể kiểm chứng."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/chat-luong/ho-so-phap-ly-chung-nhan" className="inline-flex items-center gap-2 bg-orange-600 px-6 py-4 text-xs font-black uppercase tracking-wider text-white transition hover:bg-slate-950">
                Xem hồ sơ <ArrowRight size={15} />
              </Link>
              <Link href="/san-pham" className="inline-flex items-center gap-2 border border-slate-950 bg-white px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-950 transition hover:bg-slate-950 hover:text-white">
                Xem sản phẩm <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="border border-orange-200 bg-white p-4 shadow-[16px_16px_0_rgba(234,88,12,0.12)]">
            <div className="relative min-h-[420px] overflow-hidden bg-slate-950">
              <img src={imageUrl} alt={title} className="absolute inset-0 h-full w-full object-cover opacity-85" />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/35 to-orange-500/20" />
              <div className="absolute bottom-0 left-0 max-w-xl p-7 text-white">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-orange-200">Hồ sơ kiểm chứng</p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">{splitData.title || title}</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav className="sticky top-[76px] z-20 border-b border-orange-100 bg-white/95 px-5 backdrop-blur sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto py-3">
          {navItems.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`shrink-0 border px-4 py-2 text-[11px] font-black uppercase tracking-wider transition ${
                href === routePath ? "border-orange-600 bg-orange-600 text-white" : "border-orange-100 bg-orange-50 text-orange-800 hover:border-orange-400"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <section className={`${vibe.dark ? "bg-slate-950 text-white" : "bg-white text-slate-950"} border-b border-orange-100 px-5 py-16 sm:px-8 lg:px-16`}>
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-6 md:grid-cols-[0.85fr_1.15fr]">
            <div className="relative min-h-[420px] overflow-hidden border border-orange-200 bg-orange-50">
              <img src={vibe.imageA} alt={title} className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-orange-200">{vibe.label}</p>
                <h2 className="mt-3 max-w-sm text-4xl font-black leading-none tracking-[-0.06em]">{title}</h2>
              </div>
            </div>

            <div className="grid gap-6">
              <div className={`${vibe.dark ? "border-white/15 bg-white/8" : "border-orange-200 bg-[#fff8ed]"} border p-8`}>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-orange-500">Brand proof</p>
                <blockquote className="mt-5 text-4xl font-black leading-tight tracking-[-0.055em] sm:text-5xl">
                  “{vibe.quote}”
                </blockquote>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {vibe.stats.map(([value, label]) => (
                  <div key={value} className={`${vibe.dark ? "border-white/15 bg-white/8" : "border-orange-200 bg-white"} border p-5`}>
                    <p className="text-2xl font-black tracking-[-0.06em] text-orange-600">{value}</p>
                    <p className={`${vibe.dark ? "text-white/55" : "text-slate-500"} mt-2 text-[10px] font-black uppercase tracking-[0.18em]`}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="relative min-h-[260px] overflow-hidden border border-orange-200 bg-orange-50">
              <img src={vibe.imageB} alt={`${title} minh họa`} className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105" />
            </div>
            <div className={`${vibe.dark ? "border-white/15 bg-white/8 text-white/72" : "border-orange-200 bg-white text-slate-650"} border p-6 text-sm font-semibold leading-8`}>
              <p>
                Trang này không chỉ để “có thông tin”, mà để người xem cảm thấy mọi thứ đang được đặt lên bàn: nhìn được, kiểm được, hỏi được và bổ sung được khi thiếu hồ sơ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {isSource && (
        <section className="border-b border-orange-100 bg-white px-5 py-16 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-600">Traceability map</p>
                <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.055em] sm:text-5xl">
                  Một lô nguyên liệu phải đi qua đủ dấu vết trước khi thành sản phẩm
                </h2>
                <p className="mt-5 text-base font-semibold leading-8 text-slate-650">
                  Trang nguyên liệu nên nhìn như bản đồ truy xuất: xuất xứ, vận chuyển, kiểm dịch, kho lạnh và ngày đưa vào sản xuất.
                </p>
              </div>
              <div className="grid gap-3">
                {["Nước xuất khẩu", "C/O", "Kiểm dịch", "Kho lạnh", "Mã lô sản xuất"].map((step, index) => (
                  <div key={step} className="grid grid-cols-[70px_1fr_auto] items-center border border-orange-200 bg-[#fff8ed]">
                    <div className="flex h-full min-h-[72px] items-center justify-center bg-orange-600 text-sm font-black text-white">{String(index + 1).padStart(2, "0")}</div>
                    <div className="p-4">
                      <p className="text-lg font-black text-slate-950">{step}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-600">Hồ sơ đối chiếu giúp người xem kiểm tra rõ từng bước.</p>
                    </div>
                    <ArrowRight className="mr-5 hidden text-orange-500 md:block" size={18} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {isProcess && (
        <section className="border-b border-orange-100 bg-slate-950 px-5 py-16 text-white sm:px-8 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-300">Factory control board</p>
                <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.055em] sm:text-5xl">
                  Trang nhà máy phải giống một bảng điều khiển sản xuất
                </h2>
                <p className="mt-5 text-base font-semibold leading-8 text-white/70">
                  Không kể lể chung chung. Mỗi bước cần có ảnh, khu vực phụ trách, điểm kiểm soát và hồ sơ tương ứng.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {["Đầu vào", "Sơ chế", "Chế biến", "QC", "Đóng gói", "Lưu kho"].map((cell, index) => (
                  <div key={cell} className="border border-white/15 bg-white/8 p-5">
                    <p className="text-xs font-black text-orange-300">STEP {String(index + 1).padStart(2, "0")}</p>
                    <h3 className="mt-8 text-2xl font-black tracking-[-0.05em]">{cell}</h3>
                    <p className="mt-2 text-xs font-semibold leading-5 text-white/55">Ảnh thật + tiêu chí kiểm soát</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {isLegal && (
        <section className="border-b border-orange-100 bg-[#f8fafc] px-5 py-16 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-600">Document vault</p>
                <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.055em] sm:text-5xl">Kho hồ sơ mở ra xem được</h2>
              </div>
              <p className="max-w-xl text-sm font-semibold leading-7 text-slate-600">Mỗi giấy tờ nên có chủ thể cấp, ngày cấp, phạm vi áp dụng và phần xem chi tiết rõ ràng.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {["ISO 22000:2018", "HACCP", "Giấy phép ATTP", "Phiếu kiểm nghiệm"].map((doc) => (
                <div key={doc} className="relative min-h-[210px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="absolute right-4 top-4 h-12 w-16 border border-orange-200 bg-orange-50" />
                  <FileSearch className="h-8 w-8 text-orange-600" />
                  <h3 className="mt-10 text-xl font-black tracking-[-0.04em]">{doc}</h3>
                  <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">Thông tin hồ sơ cần rõ chủ thể cấp, ngày cấp và phạm vi áp dụng.</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {isPvi && (
        <section className="border-b border-orange-100 bg-[#1b120c] px-5 py-16 text-white sm:px-8 lg:px-16">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-300">Insurance statement</p>
              <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.055em] sm:text-5xl">
                PVI phải được trình bày như hợp đồng trách nhiệm, không phải tem chất lượng
              </h2>
            </div>
            <div className="grid gap-3">
              {[
                ["Đúng", "Bảo hiểm trách nhiệm sản phẩm"],
                ["Sai", "Bảo chứng chất lượng / PVI xác nhận chất lượng"],
                ["Cần có", "Pháp nhân, phạm vi, thời hạn và thông tin được phép công bố"],
              ].map(([label, desc]) => (
                <div key={label} className="grid grid-cols-[110px_1fr] border border-white/15 bg-white/8">
                  <div className="bg-orange-600 p-5 text-sm font-black uppercase">{label}</div>
                  <div className="p-5 text-base font-bold text-white/82">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {isPolicy && (
        <section className="border-b border-orange-100 bg-white px-5 py-16 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-600">Customer care flow</p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-[-0.055em] sm:text-5xl">
              Chính sách phải là một luồng xử lý, không phải vài dòng cam kết
            </h2>
            <div className="mt-10 grid gap-0 lg:grid-cols-5">
              {["Tiếp nhận", "Xác minh", "Phân loại", "Xử lý", "Phản hồi"].map((step, index) => (
                <div key={step} className="border border-orange-200 bg-[#fff8ed] p-6">
                  <p className="text-xs font-black text-orange-600">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-8 text-2xl font-black tracking-[-0.05em]">{step}</h3>
                  <p className="mt-2 text-sm font-semibold leading-7 text-slate-600">Nêu rõ người phụ trách, thời gian xử lý và thông tin khách cần cung cấp.</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-b border-orange-100 bg-white px-5 py-18 sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="space-y-5">
            <p className="border-l-4 border-orange-600 bg-orange-50 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-orange-700">
              {isLegal ? "Tài liệu cần mở được" : isPvi ? "Viết đúng về PVI" : isProcess ? "Quy trình có kiểm soát" : "Điểm cần kiểm chứng"}
            </p>
            <div className="border border-orange-200 bg-[#fffaf3] p-6">
              <h2 className="text-3xl font-black tracking-[-0.055em] text-slate-950">{splitData.title || title}</h2>
              <p className="mt-4 text-sm font-semibold leading-7 text-slate-650">{splitData.description || heroData.subtitle}</p>
              {splitData.ctaText && (
                <Link href={splitData.ctaLink || "/chat-luong"} className="mt-6 inline-flex items-center gap-2 bg-slate-950 px-5 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-orange-600">
                  {splitData.ctaText} <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </aside>

          <div>
            <div className={isProcess ? "grid gap-0" : "grid gap-4 md:grid-cols-2"}>
              {featureItems.map((item: any, index: number) => {
                const isStep = isProcess || /^\s*\d+[.)]/.test(item.title || "");
                return (
                  <article
                    key={`${item.title}-${index}`}
                    className={`${isStep ? "grid grid-cols-[72px_1fr] border-x border-t border-orange-200 last:border-b" : "border border-orange-200 bg-[#fffaf3] p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_60px_rgba(234,88,12,0.1)]"}`}
                  >
                    {isStep ? (
                      <>
                        <div className="flex items-center justify-center bg-slate-950 text-sm font-black text-white">{String(index + 1).padStart(2, "0")}</div>
                        <div className="bg-white p-5">
                          <h3 className="text-xl font-black tracking-[-0.04em]">{item.title?.replace(/^\s*\d+[.)]\s*/, "")}</h3>
                          <p className="mt-1 text-sm font-semibold leading-7 text-slate-600">{item.description}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex h-11 w-11 items-center justify-center bg-orange-600 text-white">
                          <DynIcon name={item.icon || "FileSearch"} className="h-5 w-5" />
                        </div>
                        <h3 className="mt-5 text-xl font-black tracking-[-0.04em]">{item.title}</h3>
                        <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{item.description}</p>
                      </>
                    )}
                  </article>
                );
              })}
            </div>

            {safeTextHtml && (
              <div
                className="mt-8 border-l-4 border-orange-600 bg-[#fffaf3] p-7 text-sm font-semibold leading-8 text-slate-700 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:tracking-[-0.04em] [&_h2]:text-slate-950 [&_p]:mb-3 [&_strong]:text-orange-700"
                dangerouslySetInnerHTML={{ __html: safeTextHtml }}
              />
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-orange-100 bg-[#fff8ed] px-5 py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="inline-flex border-l-4 border-orange-600 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-orange-700">
                Thông tin bổ sung
              </p>
              <h2 className="mt-5 text-4xl font-black leading-tight tracking-[-0.055em] sm:text-5xl">
                {extra.label}
              </h2>
            </div>
            <p className="text-base font-semibold leading-8 text-slate-700">
              Phần này dùng để biến trang từ “một đoạn giới thiệu” thành một hồ sơ thật: có danh sách tài liệu cần chuẩn bị, câu hỏi khách hay thắc mắc và nguyên tắc viết copy để không nói quá.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="border border-orange-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black tracking-[-0.04em]">Checklist tài liệu cần có</h3>
              <div className="mt-5 space-y-3">
                {extra.checklist.map((item, index) => (
                  <div key={item} className="grid grid-cols-[40px_1fr] items-center gap-3 border border-orange-100 bg-orange-50/70 p-3">
                    <span className="flex h-9 w-9 items-center justify-center bg-orange-600 text-xs font-black text-white">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm font-black text-slate-850">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5">
              <div className="grid gap-3 md:grid-cols-3">
                {extra.questions.map(([question, answer]) => (
                  <article key={question} className="border border-orange-200 bg-white p-5">
                    <h3 className="text-base font-black leading-tight text-slate-950">{question}</h3>
                    <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{answer}</p>
                  </article>
                ))}
              </div>

              <div className="border-l-4 border-orange-600 bg-slate-950 p-6 text-white">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-300">Nguyên tắc compliance</p>
                <p className="mt-3 text-base font-bold leading-8 text-white/82">{extra.compliance}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-12 text-white sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <h2 className="max-w-3xl text-3xl font-black tracking-[-0.05em]">Muốn kiểm chứng tiếp? Xem sản phẩm hoặc quay lại trang Chất lượng tổng.</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/chat-luong" className="inline-flex items-center gap-2 bg-orange-600 px-6 py-4 text-xs font-black uppercase tracking-wider text-white hover:bg-orange-500">
              Tổng quan chất lượng <ArrowRight size={15} />
            </Link>
            <Link href="/san-pham" className="inline-flex items-center gap-2 border border-white/30 px-6 py-4 text-xs font-black uppercase tracking-wider text-white hover:bg-white hover:text-slate-950">
              Xem sản phẩm <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ConfigurableInfoPage({ fallback }: { fallback: DefaultInfoPage }) {
  const [page, setPage] = useState<CmsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);

  // Form states for partnership contact submission
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formType, setFormType] = useState("Hợp tác Đại lý / NPP");
  const [formContent, setFormContent] = useState("");

  // Specific partnership fields
  const [formProvince, setFormProvince] = useState("");
  const [formChannel, setFormChannel] = useState("Cửa hàng tạp hóa");
  const [formMediaChannel, setFormMediaChannel] = useState("TikTok");
  const [formMediaLink, setFormMediaLink] = useState("");
  const [formFollowers, setFormFollowers] = useState("");
  const [formSubject, setFormSubject] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Initialize and sync formType based on current route
  useEffect(() => {
    if (fallback.routePath === "/hop-tac/dai-ly-nha-phan-phoi") {
      setFormType("Hợp tác Đại lý / NPP");
    } else if (fallback.routePath === "/hop-tac/truyen-thong") {
      setFormType("Hợp tác truyền thông / KOL / KOC");
    }
  }, [fallback.routePath]);

  const handlePartnershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      let contentText = "";
      if (formType === "Hợp tác Đại lý / NPP") {
        contentText = 
          `ĐĂNG KÝ HỢP TÁC ĐẠI LÝ / NHÀ PHÂN PHỐI\n` +
          `-------------------------------\n` +
          `- Địa bàn hoạt động (Tỉnh/Thành): ${formProvince}\n` +
          `- Kênh phân phối hiện tại: ${formChannel}\n` +
          `- Nội dung đề xuất: ${formContent}`;
      } else if (formType === "Hợp tác truyền thông / KOL / KOC") {
        contentText = 
          `ĐĂNG KÝ HỢP TÁC TRUYỀN THÔNG / KOL / KOC\n` +
          `-------------------------------\n` +
          `- Kênh truyền thông chính: ${formMediaChannel}\n` +
          `- Link kênh của bạn: ${formMediaLink}\n` +
          `- Số lượng follower/độc giả: ${formFollowers}\n` +
          `- Nội dung đề xuất: ${formContent}`;
      } else {
        contentText = 
          `ĐĂNG KÝ LIÊN HỆ HỢP TÁC KHÁC\n` +
          `-------------------------------\n` +
          `- Tiêu đề đề xuất: ${formSubject}\n` +
          `- Nội dung chi tiết: ${formContent}`;
      }

      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          phone: formPhone,
          email: formEmail || null,
          content: contentText,
          source: formType,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gửi thông tin thất bại");
      }

      setSubmitSuccess(true);
      setFormName("");
      setFormPhone("");
      setFormEmail("");
      setFormProvince("");
      setFormMediaLink("");
      setFormFollowers("");
      setFormSubject("");
      setFormContent("");
    } catch (err: any) {
      setSubmitError(err.message || "Đã xảy ra lỗi khi gửi. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

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

  if (fallback.routePath === "/gioi-thieu/cau-chuyen-thuong-hieu") {
    return <BrandStoryPosterPage title={title} blocks={blocks} fallbackBlocks={fallback.blocks} products={products} />;
  }

  if (fallback.routePath.startsWith("/chat-luong/")) {
    return <QualityDetailPage title={title} routePath={fallback.routePath} blocks={blocks} fallbackBlocks={fallback.blocks} />;
  }

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-slate-950">
      {blocks.map((block, index) => {
        const data = (block.data || {}) as any;

        if (block.type === "hero") {
          return (
            <section key={block.id || index} className="relative overflow-hidden bg-[#fff4df] px-5 py-20 sm:px-8 lg:px-16">
              <div className="absolute inset-0 bg-[linear-gradient(115deg,#fff4df_0%,#fff4df_54%,#ffffff_54%,#ffffff_100%)]" />
              <div className="absolute -left-24 bottom-0 h-72 w-72 bg-orange-200/30 blur-3xl" />
              <div className="absolute -right-28 top-10 h-96 w-96 border border-orange-200/70" />
              <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
                <div className="relative z-10">
                  <p className="inline-flex bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-700 shadow-sm">
                    {data.label || title}
                  </p>
                  <h1 className="mt-7 max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.08em] text-slate-950 sm:text-6xl lg:text-7xl">
                    {data.title || title}
                  </h1>
                  {data.subtitle && (
                    <p className="mt-7 max-w-3xl text-base font-semibold leading-8 text-slate-700 sm:text-lg">
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
                  <div className="relative min-h-[430px] overflow-hidden bg-white shadow-[0_30px_80px_rgba(15,23,42,0.16)]">
                    <div className="absolute left-5 top-5 z-10 bg-slate-950 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                      Trang nội dung
                    </div>
                    <div className="absolute bottom-6 left-6 z-10 max-w-xs bg-white/90 p-5 backdrop-blur">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-600">ACBT</p>
                      <p className="mt-1 text-lg font-black leading-tight text-slate-950">Nội dung được cập nhật theo từng giai đoạn</p>
                    </div>
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
            <section key={block.id || index} className={`border-b border-orange-100 px-5 py-16 sm:px-8 lg:px-16 ${sectionTone(data.backgroundColor)}`}>
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-14 bg-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">Ghi chú / hồ sơ</span>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`prose prose-orange max-w-5xl border-l-4 border-orange-500 bg-white/70 p-7 shadow-sm prose-headings:font-black prose-headings:tracking-[-0.04em] prose-p:leading-8 ${
                  data.backgroundColor === "slate-900" || data.backgroundColor === "neutral" ? "prose-invert text-slate-200" : "text-slate-800"
                }`}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content || "") }}
              />
            </section>
          );
        }

        if (block.type === "features") {
          const items = data.items || [];
          const titleIdentity = normalizeText(`${data.title || ""} ${data.subtitle || ""}`);
          const isProcess = titleIdentity.includes("quy trinh") || items.some((item: any) => /^\s*\d+[.)]/.test(item.title || ""));
          const featureGridClass = items.length === 4
            ? "md:grid-cols-2 xl:grid-cols-4"
            : items.length > 4
              ? "md:grid-cols-2 xl:grid-cols-3"
              : "md:grid-cols-2 lg:grid-cols-3";

          if (isProcess) {
            return (
              <section key={block.id || index} className="relative overflow-hidden bg-slate-950 px-5 py-24 text-white sm:px-8 lg:px-16">
                <div className="absolute inset-y-0 right-0 w-1/3 bg-orange-600/10" />
                <div className="relative mx-auto max-w-7xl">
                  <div className="mb-12 grid gap-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
                    <div>
                      <p className="mb-4 inline-flex border-l-4 border-orange-500 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-300">
                        Sơ đồ quy trình
                      </p>
                      <h2 className="text-4xl font-black leading-tight tracking-[-0.05em] text-white sm:text-5xl">
                        {data.title}
                      </h2>
                    </div>
                    {data.subtitle && <p className="max-w-3xl text-sm font-semibold leading-7 text-slate-300">{data.subtitle}</p>}
                  </div>

                  <div className="relative grid gap-5 lg:grid-cols-6">
                    <div className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-orange-500/0 via-orange-400/60 to-orange-500/0 lg:block" />
                    {items.map((item: any, itemIndex: number) => (
                      <div key={`${item.title}-${itemIndex}`} className={`relative bg-white/[0.06] p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.10] ${itemIndex % 2 ? "lg:mt-12" : ""}`}>
                        <div className="mb-6 flex h-14 w-14 items-center justify-center bg-orange-600 text-sm font-black text-white shadow-[8px_8px_0_rgba(255,255,255,0.10)]">
                          {String(itemIndex + 1).padStart(2, "0")}
                        </div>
                        <DynIcon name={item.icon || "Check"} className="mb-4 h-7 w-7 text-orange-300" />
                        <h3 className="text-lg font-black leading-tight tracking-[-0.03em] text-white">{item.title.replace(/^\s*\d+[.)]\s*/, "")}</h3>
                        <p className="mt-3 text-sm font-medium leading-7 text-slate-300">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          return (
            <section key={block.id || index} className={`px-5 py-20 sm:px-8 lg:px-16 ${index % 2 === 0 ? "bg-white" : "bg-[#fff8ed]"}`}>
              <div className="mx-auto max-w-7xl">
              <div className="mb-12 grid gap-5 lg:grid-cols-[0.55fr_1.45fr] lg:items-end">
                <div>
                  <p className="mb-3 inline-flex border-l-4 border-orange-500 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-orange-700">
                    {String(index + 1).padStart(2, "0")} · Nội dung chính
                  </p>
                  <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
                    {data.title}
                  </h2>
                </div>
                {data.subtitle && <p className="text-sm font-semibold leading-7 text-slate-500">{data.subtitle}</p>}
              </div>
              <div className={`grid auto-rows-fr gap-4 ${featureGridClass}`}>
                {items.map((item: any, itemIndex: number) => (
                  <div key={`${item.title}-${itemIndex}`} className={`group relative overflow-hidden bg-white p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] ${itemIndex === 0 && items.length >= 4 ? "md:col-span-2 xl:row-span-2 xl:p-10" : ""}`}>
                    <div className="absolute inset-x-0 top-0 h-1 bg-orange-500 opacity-0 transition group-hover:opacity-100" />
                    <span className="absolute right-4 top-4 text-4xl font-black tracking-[-0.08em] text-orange-100 transition group-hover:text-orange-200">
                      {String(itemIndex + 1).padStart(2, "0")}
                    </span>
                    <div className="flex h-12 w-12 items-center justify-center bg-orange-50 text-orange-600 transition group-hover:bg-orange-600 group-hover:text-white">
                      <DynIcon name={item.icon || "Check"} className="h-7 w-7" />
                    </div>
                    <h3 className={`${itemIndex === 0 && items.length >= 4 ? "text-2xl sm:text-3xl" : "text-xl"} mt-6 font-black tracking-[-0.04em] text-slate-950`}>{item.title}</h3>
                    <p className="mt-3 text-sm font-medium leading-7 text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
              </div>
            </section>
          );
        }

        if (block.type === "split") {
          const imageLeft = data.imagePosition === "left";
          return (
            <section key={block.id || index} className={`relative overflow-hidden px-5 py-24 sm:px-8 lg:px-16 ${index % 2 === 0 ? "bg-[#fff8ed]" : "bg-white"}`}>
              <div className="absolute left-0 top-0 h-full w-24 bg-orange-50/70" />
              <div className="relative mx-auto grid max-w-7xl gap-0 lg:grid-cols-2 lg:items-center">
                {data.imageUrl && (
                  <div className={`relative aspect-[4/3] min-h-[360px] overflow-hidden bg-white shadow-[0_28px_70px_rgba(15,23,42,0.14)] ${imageLeft ? "lg:order-1" : "lg:order-2"}`}>
                    <div className="absolute left-4 top-4 z-10 bg-orange-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white">
                      Hồ sơ / hình ảnh
                    </div>
                    <div className="absolute bottom-0 right-0 z-10 bg-white/90 px-5 py-3 text-right backdrop-blur">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-600">ACBT</p>
                      <p className="text-sm font-black text-slate-950">Minh bạch thông tin</p>
                    </div>
                    <img src={data.imageUrl} alt={data.title} className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                )}
                <div className={`relative z-10 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:p-10 lg:-ml-10 ${imageLeft ? "lg:order-2" : "lg:order-1 lg:-mr-10 lg:ml-0"}`}>
                  <div className="absolute right-6 top-6 text-6xl font-black tracking-[-0.08em] text-orange-100">
                    {String(index + 1).padStart(2, "0")}
                  </div>
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

      {/* CASE 1: PARTNERSHIP OVERVIEW PAGE */}
      {fallback.routePath === "/hop-tac" && (
        <>
          {/* Why partner with us grid */}
          <section className="bg-gradient-to-b from-white to-[#fffaf3] border-t border-orange-100 px-5 py-20 sm:px-8 lg:px-16">
            <div className="max-w-5xl mx-auto space-y-16">
              <div className="text-center space-y-4">
                <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-orange-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
                  Đồng hành cùng thương hiệu
                </span>
                <h2 className="text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-5xl leading-none">
                  Vì sao nên chọn Ăn Cùng Bà Tuyết?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
                  Chúng tôi mang đến giải pháp phân phối tối ưu và sức ảnh hưởng truyền thông mạnh mẽ giúp đối tác bứt phá vượt trội.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    num: "01",
                    icon: <Icons.Flame size={20} />,
                    title: "Sức hút truyền thông",
                    desc: "Thương hiệu phủ sóng cực lớn với hàng chục triệu người theo dõi đa kênh, tạo sức mua tự nhiên khổng lồ."
                  },
                  {
                    num: "02",
                    icon: <Icons.Award size={20} />,
                    title: "Chất lượng ISO 22000",
                    desc: "Hệ thống nhà máy hiện đại, công thức độc quyền thơm ngon chuẩn vị, đảm bảo vệ sinh ATTP tuyệt đối."
                  },
                  {
                    num: "03",
                    icon: <Icons.Percent size={20} />,
                    title: "Chiết khấu vượt trội",
                    desc: "Chính sách giá sỉ linh hoạt, cơ chế hỗ trợ thưởng đại lý hấp dẫn giúp tối ưu hóa biên lợi nhuận kinh doanh."
                  },
                  {
                    num: "04",
                    icon: <Icons.ShieldCheck size={20} />,
                    title: "Hỗ trợ 24/7",
                    desc: "Cung cấp đầy đủ kho tài liệu ảnh, video chuyên nghiệp, tư vấn chiến lược tiếp cận thị trường hiệu quả."
                  }
                ].map((item, keyIdx) => (
                  <div
                    key={keyIdx}
                    className="relative overflow-hidden group bg-white border border-slate-100 p-8 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 rounded-2xl transform hover:-translate-y-1"
                  >
                    <div className="absolute -right-4 -bottom-6 text-[110px] font-black text-slate-50/70 select-none group-hover:text-orange-50/50 transition duration-300">
                      {item.num}
                    </div>
                    <div className="space-y-5 relative z-10">
                      <div className="w-11 h-11 bg-orange-50 text-orange-600 flex items-center justify-center rounded-xl group-hover:bg-orange-500 group-hover:text-white transition duration-300 group-hover:rotate-6">
                        {item.icon}
                      </div>
                      <h3 className="text-base font-black text-slate-950">{item.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium font-sans">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Interactive Portal Choice */}
          <section className="bg-white border-t border-orange-50 px-5 py-16 sm:px-8 lg:px-16">
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Chọn hình thức hợp tác phù hợp</h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">Nhấp chọn một trong hai định hướng dưới đây để xem chính sách chi tiết và đăng ký nhanh chóng.</p>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {/* Distributor Portal Card */}
                <div className="bg-[#fffcf8] border border-orange-100 p-8 sm:p-10 rounded-3xl space-y-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 flex items-center justify-center rounded-2xl">
                      <Icons.Store size={22} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-950">Đại lý & Nhà phân phối</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium font-sans">Đồng hành đưa các dòng sản phẩm ăn vặt Bà Tuyết có nguồn gốc minh bạch, đạt tiêu chuẩn ISO 22000 đến hàng triệu bàn ăn Việt.</p>
                    <ul className="space-y-2.5 pt-2">
                      {["Chiết khấu hấp dẫn lên tới 35%", "Hỗ trợ đầy đủ hình ảnh, video marketing", "Chính sách độc quyền khu vực rõ ràng"].map((text, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <Icons.CheckCircle2 className="text-green-600" size={14} />
                          {text}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a href="/hop-tac/dai-ly-nha-phan-phoi" className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition shadow-md shadow-orange-500/10">
                    Xem chính sách & Đăng ký
                    <Icons.ArrowRight size={14} />
                  </a>
                </div>

                {/* Media/KOL Portal Card */}
                <div className="bg-slate-950 text-white p-8 sm:p-10 rounded-3xl space-y-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-slate-900 border border-slate-800 text-orange-400 flex items-center justify-center rounded-2xl">
                      <Icons.Globe size={22} />
                    </div>
                    <h3 className="text-2xl font-black">Hợp tác Truyền thông & KOC</h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium font-sans">Sáng tạo nội dung bùng nổ mạng xã hội, nhận mẫu sản phẩm ăn thử miễn phí hàng tháng và chính sách hoa hồng bứt phá.</p>
                    <ul className="space-y-2.5 pt-2">
                      {["Nhận mẫu thử sản phẩm mới hoàn toàn miễn phí", "Hỗ trợ chia sẻ, đẩy view chéo đa nền tảng", "Thu nhập hoa hồng tiếp thị liên kết (Affiliate)"].map((text, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-slate-200 font-medium">
                          <Icons.Sparkles className="text-orange-400" size={14} />
                          {text}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a href="/hop-tac/truyen-thong" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-950 font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition">
                    Liên hệ KOL / KOC hợp tác
                    <Icons.ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Simple general inquiry form */}
          <section className="bg-[#fff8ed] border-t border-orange-100 px-5 py-20 sm:px-8 lg:px-16">
            <div className="max-w-xl mx-auto space-y-8">
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-black text-slate-950 tracking-tight sm:text-3xl font-sans">Ý kiến & Đề xuất hợp tác khác</h2>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Bạn có ý tưởng hợp tác khác ngoài đại lý hay truyền thông? Hãy gửi thông điệp ngắn cho chúng tôi.</p>
              </div>

              <form onSubmit={handlePartnershipSubmit} className="bg-white border border-orange-100 p-8 sm:p-10 shadow-xl shadow-orange-500/5 space-y-5 rounded-3xl">
                
                {/* Basic Name field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Họ và tên *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Icons.User size={14} />
                    </div>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-xl transition duration-200"
                    />
                  </div>
                </div>

                {/* Phone & Email Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Số điện thoại *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Icons.Phone size={14} />
                      </div>
                      <input
                        type="tel"
                        required
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="Ví dụ: 0912345678"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-xl transition duration-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Địa chỉ Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Icons.Mail size={14} />
                      </div>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="Ví dụ: name@gmail.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-xl transition duration-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Tiêu đề liên hệ hợp tác *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Icons.FileText size={14} />
                    </div>
                    <input
                      type="text"
                      required
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      placeholder="Ví dụ: Thuê gian hàng hội chợ, Hợp tác xuất khẩu..."
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-xl transition duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Nội dung chi tiết *</label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
                      <Icons.MessageSquare size={14} />
                    </div>
                    <textarea
                      required
                      rows={4}
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      placeholder="Nhập nội dung chi tiết bạn muốn gửi tới Ăn Cùng Bà Tuyết..."
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-xl transition duration-200 leading-relaxed font-sans"
                    />
                  </div>
                </div>

                {submitError && (
                  <p className="text-xs text-red-500 font-semibold">{submitError}</p>
                )}

                {submitSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-4 text-xs rounded-xl font-medium animate-bounce">
                    🎉 Gửi liên hệ thành công! Chúng tôi đã nhận được thông tin và sẽ phản hồi bạn.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black uppercase tracking-wider text-xs py-3.5 transition flex items-center justify-center gap-2 rounded-xl disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Icons.Loader className="animate-spin" size={14} />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      Gửi Đề Xuất
                      <Icons.ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>
        </>
      )}

      {/* CASE 2: DISTRIBUTOR REGISTRATION PAGE */}
      {fallback.routePath === "/hop-tac/dai-ly-nha-phan-phoi" && (
        <>
          {/* Policy Header Stats Block */}
          <section className="bg-gradient-to-b from-white to-[#fffbf6] border-t border-orange-100 px-5 py-20 sm:px-8 lg:px-16">
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <span className="inline-flex items-center bg-orange-50 text-orange-850 text-orange-850 text-orange-850 text-orange-800 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-orange-200">
                  ⚡ CHÍNH SÁCH ĐẠI LÝ CHÍNH THỨC
                </span>
                <h2 className="text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-5xl leading-tight">
                  Cùng Bà Tuyết phát triển hệ thống phân phối
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
                  Chúng tôi mang đến sản phẩm chất lượng, nguồn gốc minh bạch cùng các chính sách đồng hành hấp dẫn nhất trên thị trường.
                </p>
              </div>

              <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
                {[
                  { label: "Tỷ suất lợi nhuận", value: "30%+" },
                  { label: "Xử lý đơn hàng", value: "24 Giờ" },
                  { label: "Chứng nhận tiêu chuẩn", value: "ISO 22000" },
                  { label: "Hỗ trợ vận chuyển", value: "Toàn Quốc" }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white border border-slate-100 p-6 rounded-2xl text-center shadow-sm">
                    <p className="text-3xl sm:text-4xl font-black text-orange-600">{stat.value}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Professional Corporate Two-Column Layout */}
          <section className="bg-white border-t border-slate-100 px-5 py-20 sm:px-8 lg:px-16">
            <div className="max-w-5xl mx-auto">
              <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
                
                {/* Left Side: Policy & Benefits Grid */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-slate-950">Quyền lợi đặc quyền của nhà phân phối</h3>
                  <div className="space-y-4">
                    {[
                      { title: "Pháp lý rõ ràng", desc: "Cung cấp đầy đủ hóa đơn đỏ VAT, giấy chứng nhận công bố chất lượng vệ sinh ATTP.", icon: <Icons.FileText size={18} /> },
                      { title: "Hỗ trợ truyền thông", desc: "Độc quyền sử dụng hình ảnh, video của Bà Tuyết phục vụ mục đích bán hàng trực quan.", icon: <Icons.Sparkles size={18} /> },
                      { title: "Bảo hộ khu vực", desc: "Chính sách phân phối độc quyền theo vùng địa lý, tránh tối đa tình trạng cạnh tranh nội bộ.", icon: <Icons.ShieldCheck size={18} /> },
                      { title: "Đổi trả linh hoạt", desc: "Hỗ trợ đổi mới hoặc hoàn tiền cho toàn bộ các đơn hàng gặp lỗi sản xuất trong 7 ngày.", icon: <Icons.RefreshCw size={18} /> },
                      { title: "Hỗ trợ kỹ năng", desc: "Tư vấn thiết lập điểm bán, trưng bày và cách vận hành quy trình bán sỉ, bán lẻ tối ưu.", icon: <Icons.HelpCircle size={18} /> }
                    ].map((benefit, idx) => (
                      <div key={idx} className="flex gap-4 p-5 bg-[#fffcf8] border border-orange-100/50 rounded-2xl hover:border-orange-500 transition duration-200">
                        <div className="w-9 h-9 bg-orange-100/80 text-orange-600 flex items-center justify-center rounded-xl shrink-0">
                          {benefit.icon}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-black text-slate-950">{benefit.title}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-medium font-sans">{benefit.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: Professional Distributor Registration Form (Grey-Bordered Card) */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-950">Mẫu Đăng Ký Đại Lý</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">Vui lòng hoàn thành mẫu bên dưới. Chúng tôi sẽ thẩm định thông tin khu vực và phản hồi sớm nhất.</p>
                  </div>

                  <form onSubmit={handlePartnershipSubmit} className="bg-[#fafafa] border border-slate-200 p-8 sm:p-10 shadow-sm space-y-5 rounded-3xl">
                    
                    {/* Basic Name field */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Họ và tên *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Icons.User size={14} />
                        </div>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="Ví dụ: Nguyễn Văn A"
                          className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-xl transition duration-200"
                        />
                      </div>
                    </div>

                    {/* Phone & Email Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Số điện thoại *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Icons.Phone size={14} />
                          </div>
                          <input
                            type="tel"
                            required
                            value={formPhone}
                            onChange={(e) => setFormPhone(e.target.value)}
                            placeholder="Ví dụ: 0912345678"
                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-xl transition duration-200"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Địa chỉ Email</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Icons.Mail size={14} />
                          </div>
                          <input
                            type="email"
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            placeholder="Ví dụ: partner@gmail.com"
                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-xl transition duration-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Specific Distributor Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Tỉnh / Thành phố hoạt động *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Icons.MapPin size={14} />
                          </div>
                          <input
                            type="text"
                            required
                            value={formProvince}
                            onChange={(e) => setFormProvince(e.target.value)}
                            placeholder="Ví dụ: Hà Nội, Hải Phòng..."
                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-xl transition duration-200"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Kênh phân phối hiện tại *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Icons.Store size={14} />
                          </div>
                          <select
                            value={formChannel}
                            onChange={(e) => setFormChannel(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-xl transition duration-200"
                          >
                            <option value="Cửa hàng tạp hóa">Cửa hàng tạp hóa</option>
                            <option value="Siêu thị / Mini mart">Siêu thị / Mini mart</option>
                            <option value="Bán lẻ online">Bán lẻ online</option>
                            <option value="Quán ăn / Căng tin">Quán ăn / Căng tin</option>
                            <option value="Kênh phân phối khác">Kênh phân phối khác</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Common Content Textarea */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Nội dung đề xuất hợp tác *</label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
                          <Icons.MessageSquare size={14} />
                        </div>
                        <textarea
                          required
                          rows={4}
                          value={formContent}
                          onChange={(e) => setFormContent(e.target.value)}
                          placeholder="Mô tả ngắn gọn về quy mô kinh doanh của bạn, địa điểm bán hàng hoặc dòng sản phẩm Bà Tuyết bạn quan tâm..."
                          className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-xl transition duration-200 leading-relaxed font-sans"
                        />
                      </div>
                    </div>

                    {submitError && (
                      <p className="text-xs text-red-500 font-semibold">{submitError}</p>
                    )}

                    {submitSuccess && (
                      <div className="bg-green-50 border border-green-200 text-green-700 p-4 text-xs rounded-xl font-medium animate-bounce">
                        🎉 Gửi thông tin hợp tác thành công! Chúng tôi đã nhận được yêu cầu và sẽ liên hệ lại với bạn sớm nhất.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black uppercase tracking-wider text-xs py-3.5 transition flex items-center justify-center gap-2 rounded-xl disabled:opacity-50 shadow-md shadow-orange-500/10"
                    >
                      {submitting ? (
                        <>
                          <Icons.Loader className="animate-spin" size={14} />
                          Đang gửi thông tin...
                        </>
                      ) : (
                        <>
                          Gửi Đăng Ký Đại Lý
                          <Icons.ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </form>
                </div>

              </div>
            </div>
          </section>
        </>
      )}

      {/* CASE 3: MEDIA & KOL PARTNERSHIP PAGE */}
      {fallback.routePath === "/hop-tac/truyen-thong" && (
        <>
          {/* Creator Neon Header Banner */}
          <section className="bg-slate-950 text-white px-5 py-24 sm:px-8 lg:px-16 relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-orange-500/20">
                ⭐ CREATOR CAMP & PARTNERSHIP
              </span>
              <h2 className="text-4xl sm:text-6xl font-black tracking-[-0.05em] leading-none">
                Sáng tạo nội dung<br />Bùng nổ cùng Bà Tuyết
              </h2>
              <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-sans">
                Bạn sở hữu kênh TikTok, YouTube, hay Reels? Đồng hành cùng thương hiệu ẩm thực ăn vặt phủ sóng mạng xã hội để tạo nội dung triệu view và chia sẻ hoa hồng bứt phá.
              </p>
              
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {["#AnCungBaTuyet", "#KOCBaTuyet", "#AnVatTrieuView", "#FoodReviewer"].map((tag, idx) => (
                  <span key={idx} className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Dynamic Creator Two-Column Layout */}
          <section className="bg-gradient-to-b from-[#fffbf8] to-white px-5 py-20 sm:px-8 lg:px-16 border-t border-slate-100">
            <div className="max-w-5xl mx-auto">
              <div className="grid gap-12 lg:grid-cols-[1.1fr_1.2fr]">
                
                {/* Left Side: Creative KOC Steps Timeline */}
                <div className="space-y-8">
                  <h3 className="text-2xl font-black text-slate-950">Quy trình kết nối cực đơn giản</h3>
                  
                  <div className="relative border-l-2 border-orange-200 pl-6 ml-4 space-y-8">
                    {[
                      { step: "Bước 1", title: "Đăng ký nhanh chóng", desc: "Gửi link kênh social và đề xuất ý tưởng của bạn qua form đăng ký bên cạnh." },
                      { step: "Bước 2", title: "Nhận sản phẩm mẫu", desc: "Đội ngũ truyền thông Bà Tuyết gửi trọn bộ sản phẩm ăn vặt hot nhất hoàn toàn miễn phí tới tận nhà bạn." },
                      { step: "Bước 3", title: "Sáng tạo Video", desc: "Thực hiện video ăn thử, review hoặc kết hợp ẩm thực theo phong cách tự nhiên, độc đáo của riêng bạn." },
                      { step: "Bước 4", title: "Đãi ngộ & Hoa hồng", desc: "Hưởng hoa hồng affiliate, thưởng chiến dịch lên xu hướng và cơ hội hợp tác làm gương mặt đại diện thương hiệu." }
                    ].map((stepItem, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full bg-orange-500 border-4 border-white shadow-sm" />
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2 py-0.5 rounded border border-orange-100">{stepItem.step}</span>
                          <h4 className="text-base font-black text-slate-950 pt-1">{stepItem.title}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-medium font-sans">{stepItem.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: Glowing Glassmorphic KOL Registration Card */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-950">Mẫu Đăng Ký KOL/KOC</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">Nhập thông tin kênh và kết nối với bộ phận truyền thông của Ăn Cùng Bà Tuyết ngay.</p>
                  </div>

                  <form onSubmit={handlePartnershipSubmit} className="bg-white border border-orange-200 p-8 sm:p-10 shadow-2xl shadow-orange-500/5 space-y-5 rounded-3xl relative">
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-3xl" />

                    {/* Basic Name field */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Họ và tên / Kênh thương hiệu *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Icons.User size={14} />
                        </div>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="Ví dụ: KOC Nguyễn Văn A hoặc @username"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-xl transition duration-200"
                        />
                      </div>
                    </div>

                    {/* Phone & Email Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Số điện thoại *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Icons.Phone size={14} />
                          </div>
                          <input
                            type="tel"
                            required
                            value={formPhone}
                            onChange={(e) => setFormPhone(e.target.value)}
                            placeholder="Ví dụ: 0912345678"
                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-xl transition duration-200"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Địa chỉ Email *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Icons.Mail size={14} />
                          </div>
                          <input
                            type="email"
                            required
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            placeholder="Ví dụ: channel@gmail.com"
                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-xl transition duration-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* KOL/KOC Specific Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Kênh truyền thông chính *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Icons.Globe size={14} />
                          </div>
                          <select
                            value={formMediaChannel}
                            onChange={(e) => setFormMediaChannel(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-xl transition duration-200"
                          >
                            <option value="TikTok">TikTok</option>
                            <option value="Facebook / Reels">Facebook / Reels</option>
                            <option value="YouTube">YouTube</option>
                            <option value="Báo chí / PR">Báo chí / PR</option>
                            <option value="Kênh khác">Kênh khác</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Số lượng follower / độc giả</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Icons.Users size={14} />
                          </div>
                          <input
                            type="text"
                            value={formFollowers}
                            onChange={(e) => setFormFollowers(e.target.value)}
                            placeholder="Ví dụ: 100k follower"
                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-xl transition duration-200"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Link kênh của bạn *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Icons.Link size={14} />
                        </div>
                        <input
                          type="text"
                          required
                          value={formMediaLink}
                          onChange={(e) => setFormMediaLink(e.target.value)}
                          placeholder="Ví dụ: tiktok.com/@username hoặc youtube.com/c/tenkenh"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-xl transition duration-200"
                        />
                      </div>
                    </div>

                    {/* Common Content Textarea */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Nội dung ý tưởng review *</label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
                          <Icons.MessageSquare size={14} />
                        </div>
                        <textarea
                          required
                          rows={4}
                          value={formContent}
                          onChange={(e) => setFormContent(e.target.value)}
                          placeholder="Chi tiết về chiến dịch truyền thông bạn đề xuất hoặc hình thức cộng tác mong muốn..."
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-xl transition duration-200 leading-relaxed font-sans"
                        />
                      </div>
                    </div>

                    {submitError && (
                      <p className="text-xs text-red-500 font-semibold">{submitError}</p>
                    )}

                    {submitSuccess && (
                      <div className="bg-green-50 border border-green-200 text-green-700 p-4 text-xs rounded-xl font-medium animate-bounce">
                        🎉 Gửi thông tin hợp tác thành công! Chúng tôi đã nhận được yêu cầu và sẽ liên hệ lại với bạn sớm nhất.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black uppercase tracking-wider text-xs py-3.5 transition flex items-center justify-center gap-2 rounded-xl disabled:opacity-50 shadow-md shadow-orange-500/10"
                    >
                      {submitting ? (
                        <>
                          <Icons.Loader className="animate-spin" size={14} />
                          Đang gửi thông tin...
                        </>
                      ) : (
                        <>
                          Gửi Đăng Ký KOL / KOC
                          <Icons.ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </form>
                </div>

              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
