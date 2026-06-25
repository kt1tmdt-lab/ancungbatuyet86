"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DEFAULT_MARKETING_CONFIG,
  normalizeMarketingConfig,
  type TrustSectionItem,
} from "@/lib/marketing-config";
import { ShieldCheck, Factory, BadgeCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AchievementsPage() {
  const [trustSections, setTrustSections] = useState<TrustSectionItem[]>(
    DEFAULT_MARKETING_CONFIG.trustSections,
  );
  const [activeTrustKey, setActiveTrustKey] = useState("");

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const res = await fetch("/api/settings/marketing");
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

  const trustGroups = [
    {
      label: "Pháp lý & bảo vệ khách hàng",
      title: "Minh bạch để khách hàng yên tâm",
      icon: ShieldCheck,
      keys: ["food_safety_certificate", "pvi_insurance"],
    },
    {
      label: "Vận hành sản xuất",
      title: "Quy trình rõ ràng từ bếp đến tay khách",
      icon: Factory,
      keys: ["production_process", "brand_story"],
    },
  ]
    .map((group) => ({
      ...group,
      items: group.keys.map((key) => trustByKey[key]).filter((item): item is TrustSectionItem => Boolean(item)),
    }))
    .filter((group) => group.items.length > 0);

  const allTrustItems = trustGroups.flatMap((group) => group.items);
  const activeTrustItem = allTrustItems.find((item) => item.key === activeTrustKey) || allTrustItems[0];

  useEffect(() => {
    if (activeTrustItem && !activeTrustKey) {
      setActiveTrustKey(activeTrustItem.key);
    }
  }, [activeTrustItem, activeTrustKey]);

  return (
    <main className="bg-[#fbf7ef] py-16 px-5 sm:px-8 lg:px-14 xl:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 border border-orange-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-orange-700 shadow-sm mb-4">
            <ShieldCheck size={14} className="text-orange-600" />
            Hồ sơ năng lực
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-[-0.04em]">
            Thành tựu & Uy tín Pháp lý
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-650 max-w-2xl mx-auto leading-relaxed">
            Các chứng nhận pháp lý, tiêu chuẩn vệ sinh an toàn thực phẩm và cam kết bảo hiểm trách nhiệm sản phẩm từ Ăn Cùng Bà Tuyết.
          </p>
        </div>

        {trustGroups.length === 0 ? (
          <div className="border border-dashed border-orange-200 bg-orange-50/40 p-8 text-center text-sm font-bold text-slate-600">
            Chưa có thông tin hồ sơ pháp lý.
          </div>
        ) : (
          <div className="grid lg:grid-cols-[0.45fr_0.55fr] border border-orange-100 bg-white shadow-md overflow-hidden animate-fade-in">
            {/* Left Column: List of items */}
            <div className="border-b border-orange-100 lg:border-b-0 lg:border-r">
              {trustGroups.map((group, groupIndex) => {
                const Icon = group.icon;

                return (
                  <div key={group.label} className="border-b border-orange-100 last:border-b-0">
                    <div className="flex items-start gap-4 bg-[#fffaf3] p-5 border-b border-orange-50">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-orange-600 text-white">
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-700">
                          {group.label}
                        </p>
                        <h3 className="mt-1 text-base font-black leading-tight tracking-[-0.03em] text-slate-950">
                          {group.title}
                        </h3>
                      </div>
                    </div>

                    <div className="divide-y divide-orange-100">
                      {group.items.map((item) => {
                        const isActive = activeTrustItem?.key === item.key;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveTrustKey(item.key)}
                            className={`grid w-full grid-cols-[72px_1fr_auto] items-center gap-4 p-4 text-left transition ${
                              isActive ? "bg-orange-50" : "bg-white hover:bg-orange-50/70"
                            }`}
                          >
                            <div className="relative h-16 overflow-hidden bg-orange-50">
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full items-center justify-center text-orange-500">
                                  <BadgeCheck size={24} />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-black leading-tight text-slate-950 truncate">
                                {item.title}
                              </h4>
                              <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-slate-500">
                                {item.description}
                              </p>
                            </div>
                            <span className={`text-xs font-black uppercase tracking-[0.14em] shrink-0 ${
                              isActive ? "text-orange-700" : "text-slate-300"
                            }`}>
                              Xem
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Active Item Detail */}
            {activeTrustItem ? (
              <motion.article
                key={activeTrustItem.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-slate-950 text-white flex flex-col h-full"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900 shrink-0">
                  {activeTrustItem.imageUrl ? (
                    <img
                      src={activeTrustItem.imageUrl}
                      alt=""
                      className="h-full w-full object-cover opacity-80"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-orange-300">
                      <BadgeCheck size={48} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-300">
                      Chi tiết chứng thực
                    </p>
                    <h3 className="mt-2 text-xl sm:text-2xl font-black leading-tight tracking-[-0.04em]">
                      {activeTrustItem.detailTitle || activeTrustItem.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-base font-semibold leading-8 text-white/90">
                      {activeTrustItem.description}
                    </p>
                    <div className="mt-6 space-y-4 border-t border-white/10 pt-6 text-sm leading-7 text-white/70">
                      {(activeTrustItem.detailContent || "Thông tin chi tiết về hồ sơ này đang được cập nhật. Vui lòng liên hệ trực tiếp với chúng tôi để được cung cấp đầy đủ.")
                        .split(/\n+/)
                        .filter(Boolean)
                        .map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                  </div>

                  {activeTrustItem.linkUrl && activeTrustItem.linkUrl !== "/gioi-thieu" && (
                    <div className="mt-8 pt-6 border-t border-white/10">
                      <Link
                        href={activeTrustItem.linkUrl}
                        className="inline-flex items-center gap-2 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-slate-950 transition hover:bg-orange-500 hover:text-white"
                      >
                        Tài liệu / Trang liên quan
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  )}
                </div>
              </motion.article>
            ) : (
              <div className="bg-slate-900 text-slate-400 p-8 flex items-center justify-center text-sm font-medium">
                Vui lòng chọn một mục ở danh sách bên trái để xem chi tiết.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
