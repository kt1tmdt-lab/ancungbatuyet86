"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DEFAULT_MARKETING_CONFIG,
  normalizeMarketingConfig,
  type TrustSectionItem,
} from "@/lib/marketing-config";
import { Calendar, Award, History, ArrowRight } from "lucide-react";
import Link from "next/link";

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
    <main className="bg-[#fbf7ef] py-16 px-5 sm:px-8 lg:px-14 xl:px-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 border border-orange-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-orange-700 shadow-sm mb-4">
            <History size={14} className="text-orange-600" />
            Hành trình thời gian
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-[-0.04em]">
            Lịch sử & Các cột mốc phát triển
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-650 max-w-2xl mx-auto leading-relaxed">
            Những dấu mốc đáng nhớ đánh dấu sự lớn mạnh của Ăn Cùng Bà Tuyết từ những ngày đầu khởi nghiệp.
          </p>
        </div>

        {historyItems.length === 0 ? (
          <div className="border border-dashed border-orange-200 bg-orange-50/40 p-8 text-center text-sm font-bold text-slate-600">
            Chưa có thông tin lịch sử thương hiệu.
          </div>
        ) : (
          <div className="relative border-l-2 border-orange-200 ml-4 md:ml-32 space-y-12">
            {historyItems.map((item, index) => (
              <motion.div
                key={item.id || item.key}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="relative pl-8 md:pl-12"
              >
                {/* Timeline node */}
                <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center border-4 border-[#fbf7ef] shadow-md">
                  {item.key === "achievements" ? <Award size={14} /> : <Calendar size={14} />}
                </div>

                {/* Date/Category marker on the left for large screens */}
                <div className="hidden md:block absolute right-full top-2 mr-10 text-right w-24">
                  <span className="text-xs font-black uppercase tracking-wider text-orange-700">
                    {item.key === "achievements" ? "Thành tựu" : "Cột mốc"}
                  </span>
                </div>

                {/* Timeline Card */}
                <div className="bg-white border border-orange-100 p-6 sm:p-8 hover:border-orange-300 hover:shadow-[0_12px_40px_rgba(15,23,42,0.04)] transition-all duration-300">
                  <div className="grid md:grid-cols-[1fr_200px] gap-6 items-start">
                    <div className="min-w-0">
                      <h3 className="text-xl font-black text-slate-950 tracking-[-0.03em] flex items-center gap-2">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600 font-medium">
                        {item.description}
                      </p>

                      {item.detailContent && (
                        <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs sm:text-sm leading-7 text-slate-500">
                          {item.detailContent.split(/\n+/).map((p, idx) => (
                            <p key={idx}>{p}</p>
                          ))}
                        </div>
                      )}

                      {item.linkUrl && item.linkUrl !== "/gioi-thieu" && (
                        <Link
                          href={item.linkUrl}
                          className="mt-5 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-orange-700 hover:text-orange-900 transition-colors"
                        >
                          Tìm hiểu thêm <ArrowRight size={13} />
                        </Link>
                      )}
                    </div>

                    {item.imageUrl && (
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-orange-50 border border-orange-100 shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
