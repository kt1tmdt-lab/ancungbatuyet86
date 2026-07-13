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
