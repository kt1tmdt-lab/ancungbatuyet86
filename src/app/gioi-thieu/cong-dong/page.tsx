"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Heart, MessageSquare, HandHelping, ArrowRight, Quote } from "lucide-react";
import Link from "next/link";
import {
  DEFAULT_MARKETING_CONFIG,
  normalizeMarketingConfig,
  type CommunityActivityItem,
} from "@/lib/marketing-config";

const ICONS = {
  heart: Heart,
  users: Users,
  message: MessageSquare,
  hand: HandHelping,
};

const TONES = {
  red: "bg-red-50 text-red-600 border-red-150",
  blue: "bg-blue-50 text-blue-600 border-blue-150",
  orange: "bg-orange-50 text-orange-600 border-orange-150",
  green: "bg-green-50 text-green-600 border-green-150",
};

export default function CommunityPage() {
  const [communityActivities, setCommunityActivities] = useState<CommunityActivityItem[]>(
    DEFAULT_MARKETING_CONFIG.communityActivities,
  );

  useEffect(() => {
    let cancelled = false;

    fetch("/api/settings/marketing", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load marketing config"))))
      .then((data) => {
        if (!cancelled) {
          setCommunityActivities(normalizeMarketingConfig(data?.data).communityActivities);
        }
      })
      .catch((error) => {
        console.error("Failed to load community activities", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleActivities = communityActivities
    .filter((item) => item.enabled)
    .sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));

  return (
    <main className="bg-[#fbf7ef] py-16 px-5 sm:px-8 lg:px-14 xl:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 border border-orange-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-orange-700 shadow-sm mb-4">
            <Heart size={14} className="text-red-500 fill-red-500" />
            Trách nhiệm xã hội
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-[-0.04em]">
            Ăn Cùng Bà Tuyết vì Cộng Đồng
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-650 max-w-2xl mx-auto leading-relaxed">
            Chúng tôi tin rằng giá trị lớn nhất của thương hiệu nằm ở niềm vui mang lại cho khách hàng và sự sẻ chia đối với xã hội.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16 animate-fade-in">
          {visibleActivities.map((act, index) => {
            const Icon = ICONS[act.iconKey] || Heart;
            const content = (
              <>
                {act.imageUrl ? (
                  <div className="h-28 w-28 shrink-0 overflow-hidden border border-orange-100 bg-slate-50 max-sm:h-20 max-sm:w-20">
                    <img src={act.imageUrl} alt={act.title} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className={`w-12 h-12 flex items-center justify-center shrink-0 border ${TONES[act.tone] || TONES.orange}`}>
                    <Icon size={22} />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-black text-slate-950 tracking-[-0.03em]">
                    {act.title}
                  </h3>
                  <p className="mt-2 text-sm leading-[1.625] text-slate-600 font-medium">
                    {act.description}
                  </p>
                  {act.linkUrl ? (
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-orange-600">
                      Xem thêm <ArrowRight size={13} />
                    </span>
                  ) : null}
                </div>
              </>
            );

            return (
              <motion.div
                key={act.id || act.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.28, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white border border-orange-100 p-6 sm:p-8 hover:border-orange-300 transition-colors duration-200"
              >
                {act.linkUrl ? (
                  <Link href={act.linkUrl} className="flex gap-5 items-start">
                    {content}
                  </Link>
                ) : (
                  <div className="flex gap-5 items-start">
                    {content}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="bg-slate-950 text-white p-8 sm:p-12 relative overflow-hidden"
        >
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <Quote size={200} className="translate-x-12 translate-y-12" />
          </div>

          <div className="max-w-3xl relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-400">
              Cam kết từ thương hiệu
            </p>
            <h3 className="text-2xl sm:text-3xl font-black mt-3 leading-tight tracking-[-0.03em]">
              &ldquo;Mỗi gói sản phẩm trao đi là một lời cam kết về độ sạch, chất lượng ổn định và sự tôn trọng đối với bữa ăn nhẹ của người Việt.&rdquo;
            </h3>
            <div className="mt-8 flex gap-4 sm:flex-row flex-col">
              <Link
                href="/san-pham"
                className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3.5 text-xs font-black uppercase tracking-wider transition-colors"
              >
                Ghé thăm cửa hàng <ArrowRight size={14} />
              </Link>
              <Link
                href="/lien-he"
                className="inline-flex items-center justify-center gap-2 border border-white/25 hover:border-white text-white px-6 py-3.5 text-xs font-black uppercase tracking-wider transition-colors"
              >
                Liên hệ hợp tác
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
