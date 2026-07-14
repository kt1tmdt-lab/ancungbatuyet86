"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import CurtainHover from "@/components/shared/CurtainHover";
import {
  DEFAULT_MARKETING_CONFIG,
  normalizeMarketingConfig,
  type PageAssetItem,
  type HomeTextItem,
  type TrustSectionItem,
  type HistoryMilestoneItem,
  type CommunityActivityItem,
} from "@/lib/marketing-config";
import {
  ArrowRight,
  Heart,
  Eye,
  Target,
  Users,
  Trophy,
  Factory,
  ShieldCheck,
  Quote,
  PackageCheck,
  Leaf,
  Truck,
  BadgeCheck,
  CheckCircle2,
  Calendar,
  MessageSquare,
  HandHelping,
  type LucideIcon,
} from "lucide-react";

const ABOUT_PROCESS_ASSET_KEYS = [
  "about_process_ingredient",
  "about_process_factory",
  "about_process_packaging",
  "about_process_distribution",
];

const COMMUNITY_FALLBACK_IMAGES = [
  "/hero/ba-tuyet-character.png",
  "/bento/bento-factory.png",
  "/bento/bento-tiktok.png",
  "/hero/chan-ga-plate.png",
];

function toYouTubeEmbedUrl(url: string) {
  if (!url) return "";
  if (url.includes("/embed/")) return url;

  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|watch\?.+&v=|shorts\/))([^#&?]+)/);
  return match?.[1] ? `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0` : url;
}

const MOJIBAKE_MARKERS = ["Ã", "Â", "Ä", "Æ", "áº", "á»", "â€", "Å"];
const CP1252_REVERSE: Record<number, number> = {
  0x20ac: 0x80,
  0x201a: 0x82,
  0x0192: 0x83,
  0x201e: 0x84,
  0x2026: 0x85,
  0x2020: 0x86,
  0x2021: 0x87,
  0x02c6: 0x88,
  0x2030: 0x89,
  0x0160: 0x8a,
  0x2039: 0x8b,
  0x0152: 0x8c,
  0x017d: 0x8e,
  0x2018: 0x91,
  0x2019: 0x92,
  0x201c: 0x93,
  0x201d: 0x94,
  0x2022: 0x95,
  0x2013: 0x96,
  0x2014: 0x97,
  0x02dc: 0x98,
  0x2122: 0x99,
  0x0161: 0x9a,
  0x203a: 0x9b,
  0x0153: 0x9c,
  0x017e: 0x9e,
  0x0178: 0x9f,
};

function mojibakeScore(value: string) {
  return MOJIBAKE_MARKERS.reduce((score, marker) => score + (value.split(marker).length - 1), 0);
}

function repairMojibakeText(value: string) {
  if (!MOJIBAKE_MARKERS.some((marker) => value.includes(marker))) return value;

  try {
    const bytes = new Uint8Array([...value].map((char) => {
      const code = char.charCodeAt(0);
      if (code <= 0xff) return code;
      return CP1252_REVERSE[code] ?? code;
    }));
    const fixed = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return mojibakeScore(fixed) < mojibakeScore(value) ? fixed : value;
  } catch {
    return value;
  }
}

function repairMarketingItem<T extends Record<string, unknown>>(item: T): T {
  return Object.fromEntries(
    Object.entries(item).map(([key, value]) => [key, typeof value === "string" ? repairMojibakeText(value) : value])
  ) as T;
}

function marketingTextValue(items: HomeTextItem[], key: string, fallback: string) {
  const value = items.find((item) => item.key === key)?.value;
  return repairMojibakeText(value && value.trim() ? value : fallback);
}


type IconBlock = {
  icon: LucideIcon;
  title: string;
  text: string;
};

const heroStats: Array<{ value: string; label: string }> = [
  {
    value: "228,6 tỷ",
    label: "doanh thu năm 2025",
  },
  {
    value: "1,9M+",
    label: "sản phẩm bán ra năm 2025",
  },
  {
    value: "97%+",
    label: "doanh số từ TikTok Shop",
  },
];

const values: IconBlock[] = [
  {
    icon: Target,
    title: "Sứ mệnh",
    text: "Đưa đồ ăn vặt Việt Nam đến gần hơn với người tiêu dùng bằng sản phẩm rõ nguồn gốc, hương vị gần gũi và cách làm minh bạch.",
  },
  {
    icon: Eye,
    title: "Tầm nhìn",
    text: "Trở thành thương hiệu ăn vặt Việt được nhận diện bằng chất lượng ổn định, quy trình bài bản và niềm tin của khách hàng.",
  },
  {
    icon: Heart,
    title: "Giá trị cốt lõi",
    text: "Chân thật trong truyền thông, kỹ trong sản xuất, chỉn chu trong đóng gói và tử tế với từng khách hàng.",
  },
  {
    icon: Users,
    title: "Con người",
    text: "Đội ngũ sản xuất, kho vận, livestream và chăm sóc khách hàng cùng vận hành thương hiệu từ những công việc cụ thể mỗi ngày.",
  },
];

const processSteps: Array<IconBlock & { image?: string; linkUrl?: string }> = [
  {
    icon: Leaf,
    title: "Chọn nguyên liệu",
    text: "Ưu tiên nguồn đầu vào rõ ràng, phù hợp tiêu chuẩn chế biến và kiểm soát chất lượng trước khi đưa vào sản xuất.",
    linkUrl: "/chat-luong",
  },
  {
    icon: Factory,
    title: "Sản xuất tại xưởng",
    text: "Quy trình được tổ chức theo từng khu vực để giữ độ ổn định, hạn chế rủi ro và đảm bảo năng suất.",
    linkUrl: "/chat-luong",
  },
  {
    icon: PackageCheck,
    title: "Đóng gói chỉn chu",
    text: "Bao bì được chuẩn hóa để sản phẩm dễ vận chuyển, dễ nhận diện và giữ được trải nghiệm tốt khi đến tay khách.",
    linkUrl: "/chat-luong",
  },
  {
    icon: Truck,
    title: "Phân phối toàn quốc",
    text: "Kết nối các sàn thương mại điện tử và hệ thống vận chuyển để khách hàng đặt mua thuận tiện hơn.",
    linkUrl: "/diem-ban",
  },
];

function SectionIntro({
  label,
  title,
  description,
  light = false,
}: {
  label: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-4xl">
      <p
        className={`mb-4 inline-flex border px-4 py-2 text-xs font-black uppercase tracking-[0.22em] ${light
          ? "border-white/20 bg-white/10 text-amber-200"
          : "border-orange-200 bg-orange-50 text-orange-700"
          }`}
      >
        {label}
      </p>
      <h2
        className={`text-4xl font-black leading-tight tracking-[-0.05em] sm:text-5xl lg:text-6xl ${light ? "text-white" : "text-slate-950"
          }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 text-base leading-8 sm:text-lg ${light ? "text-white/75" : "text-slate-600"
            }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function BrandImage({
  src,
  label,
  linkUrl,
  className = "",
  ratio = "aspect-[4/3]",
  muted = false,
}: {
  src?: string;
  label: string;
  linkUrl?: string;
  className?: string;
  ratio?: string;
  muted?: boolean;
}) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center border border-dashed border-orange-200 bg-orange-50 px-6 text-center text-xs font-black uppercase tracking-[0.16em] text-orange-500 ${ratio} ${className}`}
      >
        Chưa có hình ảnh
      </div>
    );
  }

  const content = (
    <CurtainHover
      overlayMode="full"
      overlayContent={
        <span className="flex items-center gap-1">
          Xem thêm <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
        </span>
      }
      overlayClassName="bg-slate-950/85 backdrop-blur-[2px] text-white font-extrabold"
      className={`relative overflow-hidden bg-orange-50 ${ratio} ${className}`}
    >
      <img
        src={src}
        alt={linkUrl ? "" : label}
        className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.015] ${muted ? "saturate-[0.85]" : ""}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/20 bg-black/30 p-4 backdrop-blur-sm z-30 group-hover:opacity-0 transition-opacity duration-300">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-white">
          {label}
        </p>
      </div>
    </CurtainHover>
  );

  if (!linkUrl) return content;

  const isExternal = linkUrl.startsWith("http");
  return (
    <Link href={linkUrl} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noreferrer" : undefined}>
      {content}
    </Link>
  );
}

function ValueCard({
  item,
  index,
  className = "bg-white",
}: {
  item: IconBlock & { image?: string; linkUrl?: string };
  index: number;
  className?: string;
}) {
  const Icon = item.icon;

  if (item.image) {
    const cardContent = (
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.45, delay: index * 0.06 }}
        className={`group h-full border border-orange-100 flex flex-col justify-end transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_24px_70px_rgba(15,23,42,0.08)] overflow-hidden relative min-h-[340px] cursor-pointer ${className}`}
      >
        <CurtainHover
          overlayMode="partial"
          overlayContent={
            <span className="flex items-center gap-1">
              Xem chi tiết <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </span>
          }
          className="absolute inset-0 w-full h-full z-0"
        >
          <img
            src={item.image}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-750 group-hover:scale-[1.015]"
          />
        </CurtainHover>

        {/* Content wrapper - frosted glass panel under the text only */}
        <div className="p-4 relative z-10 w-full">
          <div className="bg-white/50 backdrop-blur-[3px] p-5 border border-white/30 shadow-md group-hover:bg-white/60 transition-all duration-300">
            <div className="mb-4 flex h-11 w-11 items-center justify-center border border-orange-100 bg-orange-50 text-orange-600 transition-colors group-hover:bg-orange-600 group-hover:text-white">
              <Icon size={22} strokeWidth={1.8} />
            </div>
            <h3 className="text-lg font-black tracking-[-0.04em] text-slate-950">
              {item.title}
            </h3>
            <p className="mt-2 text-xs leading-6 text-slate-900">{item.text}</p>
            {item.linkUrl && (
              <div className="mt-3 flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-orange-700 transition-colors group-hover:text-orange-900 group-hover:underline">
                Xem quy trình <ArrowRight size={11} className="transition-transform group-hover:translate-x-1" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );

    const itemHref = item.linkUrl || "";

    if (itemHref) {
      const isExternal = itemHref.startsWith("http");
      return (
        <Link href={itemHref} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noreferrer" : undefined} className="block h-full">
          {cardContent}
        </Link>
      );
    }

    return cardContent;
  }

  // Fallback / default layout without background image
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className={`group h-full border border-orange-100 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_24px_70px_rgba(15,23,42,0.08)] overflow-hidden relative min-h-[260px] ${className}`}
    >
      <CurtainHover
        overlayMode="partial"
        overlayContent={
          <span className="flex items-center gap-1">
            Xem chi tiết <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
          </span>
        }
        className="w-full h-full flex flex-col justify-between"
      >
        {/* Content wrapper */}
        <div className="p-7 relative z-20 flex flex-col h-full justify-between">
          <div>
            <div className="mb-6 flex h-14 w-14 items-center justify-center border border-orange-100 bg-orange-50 text-orange-600 transition-colors group-hover:bg-orange-600 group-hover:text-white">
              <Icon size={27} strokeWidth={1.8} />
            </div>
            <h3 className="text-xl font-black tracking-[-0.04em] text-slate-950">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-650">{item.text}</p>
          </div>
        </div>
      </CurtainHover>
    </motion.div>
  );
}

export default function AboutPage() {
  const [pageAssets, setPageAssets] = useState<PageAssetItem[]>([]);
  const [homeTexts, setHomeTexts] = useState<HomeTextItem[]>(DEFAULT_MARKETING_CONFIG.homeTexts);
  const [trustSections, setTrustSections] = useState<TrustSectionItem[]>(DEFAULT_MARKETING_CONFIG.trustSections);
  const [historyMilestones, setHistoryMilestones] = useState<HistoryMilestoneItem[]>(DEFAULT_MARKETING_CONFIG.historyMilestones);
  const [communityActivities, setCommunityActivities] = useState<CommunityActivityItem[]>(DEFAULT_MARKETING_CONFIG.communityActivities);

  useEffect(() => {
    async function fetchPageAssets() {
      try {
        const res = await fetch("/api/settings/marketing", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const marketingConfig = normalizeMarketingConfig(data?.data);
        setPageAssets(marketingConfig.pageAssets);
        setHomeTexts(marketingConfig.homeTexts.map(repairMarketingItem));
        setTrustSections(marketingConfig.trustSections.map(repairMarketingItem));
        setHistoryMilestones(marketingConfig.historyMilestones.map(repairMarketingItem));
        setCommunityActivities(marketingConfig.communityActivities.map(repairMarketingItem));
      } catch (error) {
        console.error("Failed to fetch configurable page assets:", error);
      }
    }

    fetchPageAssets();
  }, []);

  const assetByKey = pageAssets.reduce<Record<string, PageAssetItem>>((acc, item) => {
    if (item.key) acc[item.key] = item;
    return acc;
  }, {});
  const processDisplaySteps = processSteps.map((item, index) => ({
    ...item,
    title: marketingTextValue(homeTexts, `about_process_step_${index + 1}_title`, item.title),
    text: marketingTextValue(homeTexts, `about_process_step_${index + 1}_description`, item.text),
    image: assetByKey[ABOUT_PROCESS_ASSET_KEYS[index]]?.imageUrl || item.image,
    linkUrl: assetByKey[ABOUT_PROCESS_ASSET_KEYS[index]]?.linkUrl || item.linkUrl,
  }));
  const aboutValueItems = values.map((item, index) => ({
    ...item,
    title: marketingTextValue(homeTexts, `about_value_${index + 1}_title`, item.title),
    text: marketingTextValue(homeTexts, `about_value_${index + 1}_description`, item.text),
  }));
  const aboutProcessLabel = marketingTextValue(homeTexts, "about_process_label", "Quy trình vận hành");
  const aboutProcessTitle = marketingTextValue(homeTexts, "about_process_title", "Quy trình sản xuất bài bản & an toàn");
  const aboutProcessDescription = marketingTextValue(
    homeTexts,
    "about_process_description",
    "Từ nguyên liệu, xưởng sản xuất, đóng gói đến phân phối, mọi thông tin đều hướng tới sự minh bạch và dễ kiểm chứng."
  );
  const aboutValuesLabel = marketingTextValue(homeTexts, "about_values_label", "Định hướng thương hiệu");
  const aboutValuesTitle = marketingTextValue(homeTexts, "about_values_title", "Sứ mệnh, tầm nhìn và giá trị cốt lõi.");
  const aboutValuesDescription = marketingTextValue(
    homeTexts,
    "about_values_description",
    "Ăn Cùng Bà Tuyết được xây dựng trên nền tảng của sự chân thật: làm sạch, bán thật, phục vụ tử tế và phát triển bền vững."
  );
  const factoryImage = assetByKey.about_process_background?.imageUrl || "/bento/bento-factory.png";
  const teamImage = assetByKey.about_team_quote?.imageUrl || "/bento/bento-factory.png";
  const teamLink = assetByKey.about_team_quote?.linkUrl;
  const aboutVideoUrl = toYouTubeEmbedUrl(assetByKey.about_video?.linkUrl || "https://www.youtube.com/embed/NbWkmT79i5s?autoplay=0&rel=0");
  const visibleTrustSections = trustSections.filter((item) => item.enabled).slice(0, 6);
  const visibleHistoryMilestones = historyMilestones
    .filter((item) => item.enabled)
    .sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0))
    .slice(0, 6);
  const visibleCommunityActivities = communityActivities
    .filter((item) => item.enabled)
    .sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0))
    .slice(0, 4);

  return (
    <main className="bg-[#fbf7ef] text-slate-950 antialiased selection:bg-orange-500 selection:text-white">
      <section className="border-b border-orange-100 bg-[#f7efe3] px-5 pb-10 pt-24 sm:px-8 lg:px-14 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end"
        >
          <div>
            <div className="mb-5 inline-flex w-fit items-center gap-3 border border-orange-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-orange-700 shadow-sm">
              <BadgeCheck size={15} />
              Hồ sơ thương hiệu thực phẩm Việt
            </div>

            <h1 className="max-w-5xl text-4xl font-black leading-tight tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl">
              Ăn Cùng Bà Tuyết
              <span className="block text-orange-600">làm thật, bán thật.</span>
            </h1>
          </div>

          <div>
            <p className="max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
              Ăn Cùng Bà Tuyết là thương hiệu đồ ăn vặt Việt Nam phát triển từ
              nội dung gần gũi, sản phẩm dễ ăn và sức mua thật trên các nền tảng
              thương mại điện tử.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                "Sản xuất có quy trình",
                "Đóng gói chỉn chu",
                "Vận hành rõ ràng",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 border border-orange-100 bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm"
                >
                  <CheckCircle2 size={18} className="shrink-0 text-green-600" />
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/san-pham"
                className="inline-flex items-center justify-center gap-3 bg-orange-600 px-7 py-4 text-sm font-black text-white transition hover:bg-orange-700"
              >
                Xem sản phẩm
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/chat-luong"
                className="inline-flex items-center justify-center gap-3 border border-slate-200 bg-white px-7 py-4 text-sm font-black text-slate-950 transition hover:border-orange-300 hover:text-orange-700"
              >
                Xem quy trình sản xuất
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="border-b border-orange-100 bg-white">
        <div className="grid md:grid-cols-3">
          {heroStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="border-b border-orange-100 p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 sm:p-8 lg:p-10"
            >
              <p className="text-5xl font-black tracking-[-0.07em] text-slate-950 lg:text-6xl">
                {stat.value}
              </p>
              <p className="mt-3 text-sm font-black uppercase tracking-[0.16em] text-slate-600">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="about-video" className="scroll-mt-24 grid border-b border-orange-100 bg-[#fffaf2] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="px-5 py-20 sm:px-8 lg:px-14 xl:px-20">
          <SectionIntro
            label="Câu chuyện thương hiệu"
            title="Từ căn bếp nhỏ đến thương hiệu hàng triệu khách hàng tin dùng."
            description="Video giúp bạn nhìn thấy thật sự sản phẩm được làm ra như thế nào, bởi ai và với tinh thần gì."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              "Sản phẩm sạch, rõ nguồn gốc",
              "Sản xuất tại xưởng có kiểm soát",
              "Giao hàng toàn quốc qua sàn TMĐT",
              "Được bảo hiểm sản phẩm bởi PVI",
            ].map((item) => (
              <div
                key={item}
                className="border border-orange-100 bg-white p-5 text-sm font-bold text-slate-700"
              >
                <CheckCircle2 className="mb-3 text-green-600" size={20} />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative w-full min-h-[350px] sm:min-h-[450px] lg:min-h-[500px] bg-black lg:border-l lg:border-t-0 border-t border-orange-100 overflow-hidden">
          <iframe
            src={aboutVideoUrl}
            title="Hành trình thương hiệu Ăn Cùng Bà Tuyết"
            className="w-full h-full border-none absolute inset-0 z-10"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>

      <section id="about-process" className="scroll-mt-24 relative border-b border-orange-100 bg-white overflow-hidden">
        {/* Underlay background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={factoryImage}
            alt="Quy trình vận hành background"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f7efe3]/50 via-white/80 to-white/60" />
        </div>

        <div className="relative z-10 grid lg:grid-cols-[0.62fr_1.38fr]">
          <div className="border-b border-orange-100 bg-[#f7efe3]/70 backdrop-blur-md px-5 py-16 sm:px-8 lg:border-b-0 lg:border-r lg:px-14 xl:px-20">
            <SectionIntro
              label={aboutProcessLabel}
              title={aboutProcessTitle}
              description={aboutProcessDescription}
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 bg-white/20 backdrop-blur-sm">
            {processDisplaySteps.map((item, index) => (
              <div
                key={item.title}
                className="border-b border-orange-100 sm:border-r lg:border-b-0"
              >
                <ValueCard
                  item={item}
                  index={index}
                  className="bg-transparent"
                />
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="border-b border-orange-100 bg-[#f7efe3]">
        <div className="grid lg:grid-cols-[0.62fr_1.38fr]">
          <div className="border-b border-orange-100 px-5 py-16 sm:px-8 lg:border-b-0 lg:border-r lg:px-14 xl:px-20">
            <SectionIntro
              label={aboutValuesLabel}
              title={aboutValuesTitle}
              description={aboutValuesDescription}
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {aboutValueItems.map((item, index) => (
              <div
                key={item.title}
                className="border-b border-orange-100 sm:border-r lg:border-b-0"
              >
                <ValueCard item={item} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about-team" className="scroll-mt-24 grid border-b border-orange-100 bg-white lg:grid-cols-[0.8fr_1.2fr]">
        <div className="min-h-[280px] border-b border-orange-100 lg:min-h-[360px] lg:border-b-0 lg:border-r">
          <BrandImage
            src={teamImage}
            label="Đội ngũ Ăn Cùng Bà Tuyết"
            linkUrl={teamLink}
            ratio="aspect-auto"
            className="h-full"
            muted
          />
        </div>

        <div className="flex items-center px-5 py-16 sm:px-8 lg:px-14 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl"
          >
            <div className="mb-8 flex h-16 w-16 items-center justify-center bg-orange-600 text-white">
              <Quote size={30} />
            </div>
            <blockquote className="border-l-4 border-orange-500 pl-6 text-3xl font-black leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl">
              &ldquo;Một thương hiệu muốn đi xa không thể chỉ nói hay. Phải có sản
              phẩm thật, hình ảnh thật và bằng chứng thật.&rdquo;
            </blockquote>
            <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-slate-500">
              — Tinh thần Ăn Cùng Bà Tuyết
            </p>
          </motion.div>
        </div>
      </section>

      <section id="about-trust" className="scroll-mt-24 border-b border-orange-100 bg-[#fffaf2] px-5 py-20 sm:px-8 lg:px-14 xl:px-20">
        <SectionIntro
          label="Thông tin doanh nghiệp"
          title="Uy tín, chứng nhận và năng lực được gom ngay trong trang Giới thiệu."
          description="Các nội dung này lấy từ phần quản trị thương hiệu: chứng nhận, bảo hiểm, năng lực sản xuất và bằng chứng tạo niềm tin."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleTrustSections.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_24px_70px_rgba(234,88,12,0.10)]"
            >
              {item.imageUrl ? (
                <div className="mb-5 flex h-[260px] items-center justify-center overflow-hidden border border-orange-100 bg-[#fff7ea] p-4">
                  <img src={item.imageUrl} alt={item.title} className="max-h-full max-w-full object-contain transition duration-700 group-hover:scale-[1.03]" />
                </div>
              ) : (
                <div className="mb-5 flex h-[260px] items-center justify-center border border-orange-100 bg-orange-50 text-orange-600">
                  <ShieldCheck size={34} />
                </div>
              )}
              <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-600">Hồ sơ thương hiệu</p>
              <h3 className="mt-3 text-xl font-black tracking-[-0.04em] text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="about-history" className="scroll-mt-24 border-b border-orange-100 bg-white px-5 py-20 sm:px-8 lg:px-14 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            label="Hành trình phát triển"
            title="Bản đồ dấu mốc của Ăn Cùng Bà Tuyết."
            description="Các cột mốc được xếp như một hành trình đi xuống: mỗi điểm là một bước chuyển, một thành tựu hoặc một quyết định quan trọng."
          />

          <div className="relative mt-14">
            <div className="absolute left-6 top-0 h-full border-l-2 border-dashed border-orange-300 lg:left-1/2 lg:-translate-x-1/2" />

            <div className="space-y-10">
              {visibleHistoryMilestones.map((item, index) => {
                const isRight = index % 2 === 0;
                const year = item.year || item.title.match(/\b(20\d\d|19\d\d)\b/)?.[0] || String(index + 1).padStart(2, "0");
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06 }}
                    className={`relative grid gap-5 pl-16 lg:grid-cols-2 lg:pl-0 ${isRight ? "" : "lg:[&>*:first-child]:col-start-2"}`}
                  >
                    <div className={`relative border border-orange-200 bg-[#fffaf2] p-6 shadow-[14px_14px_0_rgba(234,88,12,0.08)] ${isRight ? "lg:mr-16" : "lg:ml-16"}`}>
                      <div className={`hidden lg:absolute lg:top-1/2 lg:block lg:h-px lg:w-16 lg:-translate-y-1/2 lg:bg-orange-300 ${isRight ? "lg:-right-16" : "lg:-left-16"}`} />
                      <p className="text-4xl font-black tracking-[-0.07em] text-orange-600">{year}</p>
                      <p className="mt-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                        {item.type === "achievement" ? "Thành tựu" : "Cột mốc"}
                      </p>
                      <h3 className="mt-5 text-2xl font-black tracking-[-0.045em] text-slate-950">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                    </div>

                    {index < visibleHistoryMilestones.length - 1 ? (
                      <div className="absolute left-[15px] top-[92px] z-10 flex h-8 w-8 items-center justify-center bg-white text-orange-600 lg:left-1/2 lg:-translate-x-1/2">
                        <ArrowRight className="rotate-90" size={22} />
                      </div>
                    ) : null}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="about-community" className="scroll-mt-24 border-b border-orange-100 bg-[#f7efe3] px-5 py-20 sm:px-8 lg:px-14 xl:px-20">
        <SectionIntro
          label="Cộng đồng"
          title="Hoạt động cộng đồng và khách hàng cũng nằm trong trang Giới thiệu."
          description="Các hoạt động này giúp trang giới thiệu không chỉ nói về công ty, mà còn cho thấy thương hiệu đang sống cùng khách hàng thế nào."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {visibleCommunityActivities.map((item, index) => {
            const Icon = item.iconKey === "users" ? Users : item.iconKey === "message" ? MessageSquare : item.iconKey === "hand" ? HandHelping : Heart;
            const imageUrl = item.imageUrl || COMMUNITY_FALLBACK_IMAGES[index % COMMUNITY_FALLBACK_IMAGES.length];
            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="border border-orange-100 bg-white p-6 shadow-sm"
              >
                <div className="relative mb-5 aspect-square overflow-hidden bg-orange-50">
                  <img src={imageUrl} alt={item.title} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
                  <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center bg-white/90 text-orange-600 shadow-sm">
                    <Icon size={22} />
                  </div>
                </div>
                <h3 className="text-lg font-black tracking-[-0.04em] text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="px-5 py-16 sm:px-8 lg:px-14 xl:px-20">
            <p className="mb-5 inline-flex border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-orange-200">
              Tiếp tục khám phá
            </p>
            <h2 className="max-w-5xl text-4xl font-black leading-tight tracking-[-0.05em] sm:text-6xl">
              Sản phẩm thật, quy trình rõ — mọi thứ đều có thể kiểm chứng.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              Khám phá danh sách sản phẩm đang bán chạy và toàn bộ quy trình từ
              chọn nguyên liệu đến giao hàng tận tay khách hàng.
            </p>
          </div>

          <div className="grid border-t border-white/10 lg:border-l lg:border-t-0">
            <Link
              href="/chat-luong"
              className="group flex items-center justify-between border-b border-white/10 bg-orange-600 p-8 text-lg font-black text-white transition hover:bg-orange-700"
            >
              Xem quy trình sản xuất
              <ArrowRight
                className="transition-transform group-hover:translate-x-1"
                size={22}
              />
            </Link>
            <Link
              href="/san-pham"
              className="group flex items-center justify-between bg-white p-8 text-lg font-black text-slate-950 transition hover:bg-orange-50"
            >
              Xem sản phẩm
              <ArrowRight
                className="transition-transform group-hover:translate-x-1"
                size={22}
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
