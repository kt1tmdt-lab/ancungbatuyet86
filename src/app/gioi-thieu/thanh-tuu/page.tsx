"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DEFAULT_MARKETING_CONFIG,
  normalizeMarketingConfig,
  type TrustSectionItem,
} from "@/lib/marketing-config";
import { ShieldCheck, Factory, Award, ArrowRight, X, Sparkles, BookOpen, ShieldAlert } from "lucide-react";
import Link from "next/link";

const DOCUMENT_IMAGE_KEYS = new Set(["food_safety_certificate", "pvi_insurance"]);
const FEATURED_TRUST_KEYS = new Set([
  "food_safety_certificate",
  "pvi_insurance",
  "production_process",
  "brand_story",
]);

function isDocumentImage(item: TrustSectionItem) {
  return DOCUMENT_IMAGE_KEYS.has(item.key);
}

export default function AchievementsPage() {
  const [trustSections, setTrustSections] = useState<TrustSectionItem[]>(
    DEFAULT_MARKETING_CONFIG.trustSections,
  );
  const [selectedItem, setSelectedItem] = useState<TrustSectionItem | null>(null);

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const res = await fetch("/api/settings/marketing", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const marketingConfig = normalizeMarketingConfig(data?.data);
        setTrustSections(marketingConfig.trustSections);
      } catch (error) {
        console.error("Failed to fetch achievements:", error);
      }
    }
    fetchAchievements();
  }, []);

  const enabledTrustSections = trustSections.filter((item) => item.enabled);
  const trustByKey = enabledTrustSections.reduce<Record<string, TrustSectionItem>>((acc, item) => {
    acc[item.key] = item;
    return acc;
  }, {});

  const customTrustItems = enabledTrustSections.filter((item) => !FEATURED_TRUST_KEYS.has(item.key));

  // Group achievements data
  const trustGroups = [
    {
      label: "Pháp lý & Bảo vệ khách hàng",
      title: "Minh bạch pháp lý - An tâm thưởng thức",
      icon: ShieldCheck,
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
      keys: ["food_safety_certificate", "pvi_insurance"],
    },
    {
      label: "Năng lực sản xuất & Thương hiệu",
      title: "Quy chuẩn sạch từ xưởng chế biến đến bàn ăn",
      icon: Factory,
      badgeColor: "bg-orange-50 text-orange-700 border-orange-100",
      keys: ["production_process", "brand_story"],
    },
  ]
    .map((group) => ({
      ...group,
      items: group.keys.map((key) => trustByKey[key]).filter((item): item is TrustSectionItem => Boolean(item)),
    }))
    .filter((group) => group.items.length > 0)
    .concat(
      customTrustItems.length > 0
        ? [
            {
              label: "Giải thưởng & nội dung khác",
              title: "Các thành tựu, hoạt động và bằng chứng do admin bổ sung",
              icon: Award,
              badgeColor: "bg-amber-50 text-amber-700 border-amber-100",
              keys: [],
              items: customTrustItems,
            },
          ]
        : [],
    );

  return (
    <main className="bg-[#fbf7ef] py-16 px-4 sm:px-6 lg:px-8 min-h-screen relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center gap-1.5 border border-orange-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-orange-700 mb-4">
            <Award size={13} className="text-orange-600" />
            Hồ sơ năng lực
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-[-0.04em]">
            Thành tựu & Uy tín
          </h2>
          <div className="h-1.5 w-24 bg-orange-600 mx-auto my-6" />
          <p className="text-base sm:text-lg text-slate-650 max-w-2xl mx-auto leading-relaxed font-medium">
            Sự phát triển bền vững song hành cùng chất lượng kiểm định khắt khe và trách nhiệm tuyệt đối đối với sức khỏe người tiêu dùng.
          </p>
        </div>

        {trustGroups.length === 0 ? (
          <div className="border border-dashed border-orange-200 bg-white p-12 text-center text-sm font-bold text-slate-500">
            Chưa có thông tin hồ sơ uy tín được cấu hình.
          </div>
        ) : (
          <div className="space-y-16">
            {trustGroups.map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.label} className="space-y-6">
                  {/* Group Title Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-orange-100/80">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center bg-orange-600 text-white">
                        <Icon size={20} />
                      </div>
                      <div>
                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-black uppercase tracking-wider border ${group.badgeColor}`}>
                          {group.label}
                        </span>
                        <h3 className="text-lg sm:text-xl font-black text-slate-950 tracking-[-0.03em] mt-0.5">
                          {group.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Bento-like Grid */}
                  <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    {group.items.map((item) => (
                      <motion.div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-white border border-orange-100 overflow-hidden hover:border-orange-300 transition-colors duration-200 flex flex-col justify-between cursor-pointer group h-full min-h-[300px]"
                      >
                        {/* Image Header with Zoom effect */}
                        <div className="relative h-48 sm:h-56 w-full bg-orange-50 overflow-hidden shrink-0">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className={`w-full h-full transition-transform duration-500 ${
                                isDocumentImage(item)
                                  ? "object-contain bg-white p-5"
                                  : "object-cover group-hover:scale-105"
                              }`}
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-orange-50 text-orange-400">
                              <Sparkles size={28} className="animate-pulse" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-slate-950/0 to-transparent pointer-events-none" />
                          <span className="absolute bottom-4 right-4 bg-slate-950/70 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 border border-white/10 group-hover:bg-orange-600 group-hover:border-orange-500 transition-colors">
                            Xem chứng thực
                          </span>
                        </div>

                        {/* Card Info */}
                        <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="text-lg sm:text-xl font-black text-slate-950 tracking-[-0.03em] leading-snug group-hover:text-orange-600 transition-colors">
                              {item.title}
                            </h4>
                            <p className="mt-3 text-sm leading-relaxed text-slate-600 font-medium line-clamp-3">
                              {item.description}
                            </p>
                          </div>

                          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-1 text-xs font-black uppercase tracking-wider text-orange-600 group-hover:text-orange-700 transition-colors">
                            Chi tiết chứng thực <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modern Detailed Modal Overlay */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Dark Blurred Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white text-slate-950 w-full max-w-4xl overflow-hidden shadow-2xl relative border border-orange-100 flex flex-col md:grid md:grid-cols-[1.1fr_1.3fr] h-auto max-h-[85vh] md:max-h-[80vh] z-10"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="absolute right-4 top-4 bg-white/90 backdrop-blur-md text-slate-950 p-2 border border-slate-200 hover:bg-orange-600 hover:text-white hover:border-orange-500 transition-colors z-20"
                aria-label="Đóng"
              >
                <X size={18} />
              </button>

              {/* Left Column: Image Area */}
              <div className="relative bg-slate-50 border-b md:border-b-0 md:border-r border-orange-100 overflow-hidden min-h-[220px] md:min-h-0 flex items-stretch">
                {selectedItem.imageUrl ? (
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    className={`w-full h-full ${
                      isDocumentImage(selectedItem)
                        ? "object-contain bg-white p-4"
                        : "object-cover"
                    }`}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-orange-400 p-8 min-h-[240px]">
                    <ShieldAlert size={48} className="stroke-[1.5] mb-2" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Hình ảnh chứng từ</span>
                  </div>
                )}
              </div>

              {/* Right Column: Text & Content Area (scrollable) */}
              <div className="p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[80vh]">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 border border-orange-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                      <BookOpen size={10} /> Document
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-[-0.04em] leading-tight">
                    {selectedItem.detailTitle || selectedItem.title}
                  </h3>

                  <p className="mt-4 text-base font-semibold leading-relaxed text-orange-700 bg-orange-50/50 p-4 border border-orange-100/50">
                    {selectedItem.description}
                  </p>

                  <div className="mt-6 space-y-4 border-t border-slate-100 pt-6 text-sm leading-relaxed text-slate-650 font-medium">
                    {(selectedItem.detailContent || "Thông tin chi tiết về hồ sơ này đang được cập nhật. Vui lòng liên hệ trực tiếp với chúng tôi để được cung cấp đầy đủ.")
                      .split(/\n+/)
                      .filter(Boolean)
                      .map((paragraph, index) => (
                        <p key={index} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange-500">
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </div>

                {selectedItem.linkUrl && selectedItem.linkUrl !== "/gioi-thieu" && (
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <Link
                      href={selectedItem.linkUrl}
                      onClick={() => setSelectedItem(null)}
                      className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-750 text-white w-full sm:w-auto px-6 py-3.5 text-xs font-black uppercase tracking-widest transition-colors"
                    >
                      Tài liệu / Trang liên quan
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
