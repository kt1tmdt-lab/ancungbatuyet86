"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DEFAULT_MARKETING_CONFIG,
  normalizeMarketingConfig,
  type TrustSectionItem,
} from "@/lib/marketing-config";
import { Calendar, Award, History, ArrowRight, Compass } from "lucide-react";
import Link from "next/link";

// Helper function to extract a 4-digit year from the title
function extractYear(title: string): string | null {
  const match = title.match(/\b(19\d\d|20\d\d)\b/);
  return match ? match[0] : null;
}

// Helper to get clean title without the year string to avoid repetition
function getCleanTitle(title: string, year: string | null): string {
  if (!year) return title;
  // Match patterns like "Năm 2023:", "2023 -", "2023:" or just "2023"
  const regex = new RegExp(`\\b(Năm\\s+)?${year}\\b\\s*[:\\-–—]?\\s*`, "i");
  const cleaned = title.replace(regex, "").trim();
  // Capitalize first letter of cleaned title
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export default function HistoryPage() {
  const [trustSections, setTrustSections] = useState<TrustSectionItem[]>(
    DEFAULT_MARKETING_CONFIG.trustSections,
  );

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/settings/marketing");
        if (!res.ok) return;
        const data = await res.json();
        const marketingConfig = normalizeMarketingConfig(data?.data);
        setTrustSections(marketingConfig.trustSections);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    }
    fetchHistory();
  }, []);

  const historyItems = trustSections.filter(
    (item) => item.enabled && ["company_history", "achievements"].includes(item.key)
  );

  return (
    <main className="bg-[#fbf7ef] py-16 px-4 sm:px-6 lg:px-8 min-h-screen relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-amber-50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center gap-1.5 border border-orange-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-orange-700 shadow-sm rounded-full mb-4">
            <History size={13} className="text-orange-600 animate-spin-slow" />
            Hành trình thời gian
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-[-0.04em]">
            Lịch sử & Cột mốc
          </h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto my-6 rounded-full" />
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Từ một căn bếp nhỏ đong đầy tâm huyết đến thương hiệu ăn vặt quốc dân. Nhìn lại những dấu mốc kiến tạo nên Ăn Cùng Bà Tuyết hôm nay.
          </p>
        </div>

        {historyItems.length === 0 ? (
          <div className="border border-dashed border-orange-200 bg-white p-12 text-center text-sm font-bold text-slate-500 rounded-2xl shadow-sm">
            Chưa có thông tin lịch sử thương hiệu được cấu hình.
          </div>
        ) : (
          <div className="relative">
            {/* Center Line for Desktop / Left Line for Mobile */}
            <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-[3px] bg-gradient-to-b from-orange-500 via-amber-400 to-orange-600 -translate-x-1/2 rounded-full" />

            <div className="space-y-16">
              {historyItems.map((item, index) => {
                const year = extractYear(item.title);
                const cleanTitle = getCleanTitle(item.title, year);
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={item.id || item.key}
                    className={`relative flex flex-col md:flex-row items-start md:items-stretch ${
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-8 w-6 h-6 rounded-full bg-white border-[5px] border-orange-600 z-20 shadow-md flex items-center justify-center">
                      <span className="absolute w-2 h-2 rounded-full bg-orange-600 animate-ping opacity-75" />
                    </div>

                    {/* Left space for Alternating Layout */}
                    <div className="hidden md:block w-1/2" />

                    {/* Card Content Container */}
                    <div className="w-full md:w-[calc(50%-2.5rem)] pl-12 md:pl-0 relative">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="bg-white border border-orange-100/60 rounded-3xl p-6 sm:p-8 shadow-[0_10px_35px_rgba(15,23,42,0.02)] hover:shadow-[0_20px_50px_rgba(234,88,12,0.08)] hover:border-orange-200 transition-all duration-350 flex flex-col justify-between h-full group"
                      >
                        {/* Card Header */}
                        <div className="relative">
                          {/* Year Watermark / Big badge */}
                          {year ? (
                            <div className="absolute -right-4 -top-8 text-6xl sm:text-7xl font-black text-orange-500/5 select-none tracking-tighter group-hover:text-orange-500/10 transition-colors font-sans">
                              {year}
                            </div>
                          ) : (
                            <div className="absolute -right-4 -top-8 text-6xl sm:text-7xl font-black text-orange-500/5 select-none group-hover:text-orange-500/10 transition-colors">
                              {item.key === "achievements" ? "🏆" : "📍"}
                            </div>
                          )}

                          <div className="flex items-center gap-2 mb-3">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                              item.key === "achievements" 
                                ? "bg-amber-50 text-amber-700 border border-amber-100" 
                                : "bg-orange-50 text-orange-700 border border-orange-100"
                            }`}>
                              {item.key === "achievements" ? <Award size={12} /> : <Compass size={12} />}
                              {item.key === "achievements" ? "Thành tựu" : "Cột mốc"}
                            </span>
                            {year && (
                              <span className="text-sm font-black text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full">
                                {year}
                              </span>
                            )}
                          </div>

                          <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-[-0.03em] leading-tight mb-4 pr-12">
                            {cleanTitle}
                          </h3>

                          <p className="text-sm sm:text-base leading-relaxed text-slate-600 font-medium">
                            {item.description}
                          </p>

                          {item.detailContent && (
                            <div className="mt-5 pt-5 border-t border-slate-100 space-y-2.5 text-xs sm:text-sm leading-relaxed text-slate-500 font-medium">
                              {item.detailContent.split(/\n+/).filter(Boolean).map((p, idx) => (
                                <p key={idx} className="relative pl-3 before:absolute before:left-0 before:top-[8px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange-400">
                                  {p}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Image / Link Footer */}
                        <div className="mt-6 space-y-4">
                          {item.imageUrl && (
                            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-orange-50 border border-orange-100/40">
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent pointer-events-none" />
                            </div>
                          )}

                          {item.linkUrl && item.linkUrl !== "/gioi-thieu" && (
                            <div className="pt-2">
                              <Link
                                href={item.linkUrl}
                                className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-orange-600 hover:text-orange-700 transition-colors group/link"
                              >
                                Xem tài liệu liên quan 
                                <ArrowRight size={13} className="group-hover/link:translate-x-1 transition-transform" />
                              </Link>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
