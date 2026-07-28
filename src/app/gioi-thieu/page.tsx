"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Globe,
  Factory,
  ShieldCheck,
  Store,
  Eye,
  Heart,
  Zap,
  Sparkles,
  Award,
  Video,
  ExternalLink,
  Target,
  Compass,
  Lightbulb,
} from "lucide-react";
import {
  DEFAULT_MARKETING_CONFIG,
  normalizeMarketingConfig,
  type HomeTextItem,
  type PageAssetItem,
} from "@/lib/marketing-config";

// Repair CP1252 to UTF-8 mojibake function if needed
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

const MOJIBAKE_MARKERS = ["Ã", "Â", "Ä", "Æ", "áº", "á»", "â€", "Å"];

function repairMojibakeText(value: string) {
  if (!value) return "";
  if (!MOJIBAKE_MARKERS.some((marker) => value.includes(marker))) return value;

  try {
    const bytes = new Uint8Array(
      [...value].map((char) => {
        const code = char.charCodeAt(0);
        if (code <= 0xff) return code;
        return CP1252_REVERSE[code] ?? code;
      })
    );
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return value;
  }
}

function toYouTubeEmbedUrl(url: string) {
  if (!url) return "";
  if (url.includes("/embed/")) return url;

  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|watch\?.+&v=|shorts\/))([^#&?]+)/
  );
  return match?.[1]
    ? `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0`
    : url;
}

function marketingTextValue(items: HomeTextItem[], key: string, fallback: string) {
  const value = items.find((item) => item.key === key)?.value;
  return repairMojibakeText(value && value.trim() ? value : fallback);
}

// Animation variants for minimal corporate transitions
const fapUp = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as any, // easeOutExpo
    },
  },
};

const fapLeft = {
  hidden: { opacity: 0, x: -35 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as any, // easeOutExpo
    },
  },
};

const fapRight = {
  hidden: { opacity: 0, x: 35 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as any, // easeOutExpo
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

function useCountUp(targetValueString: string, durationMs = 2000) {
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (!targetValueString) {
      setDisplayValue("0");
      return;
    }

    const match = targetValueString.match(/([0-9.,]+)/);
    if (!match) {
      setDisplayValue(targetValueString);
      return;
    }

    const numberPartString = match[1];
    const prefix = targetValueString.substring(0, match.index);
    const suffix = targetValueString.substring((match.index ?? 0) + numberPartString.length);

    let cleanNumberString = numberPartString;
    const hasComma = numberPartString.includes(",");
    const hasDot = numberPartString.includes(".");

    let isDecimalDot = false;
    let isDecimalComma = false;
    let decimalPlaces = 0;

    if (hasComma && hasDot) {
      if (numberPartString.indexOf(",") < numberPartString.indexOf(".")) {
        cleanNumberString = numberPartString.replace(/,/g, "");
        const decSplit = cleanNumberString.split(".");
        decimalPlaces = decSplit[1] ? decSplit[1].length : 0;
        isDecimalDot = true;
      } else {
        cleanNumberString = numberPartString.replace(/\./g, "").replace(",", ".");
        const decSplit = cleanNumberString.split(".");
        decimalPlaces = decSplit[1] ? decSplit[1].length : 0;
        isDecimalComma = true;
      }
    } else if (hasDot) {
      const parts = numberPartString.split(".");
      if (parts.length > 2 || parts[1].length === 3) {
        cleanNumberString = numberPartString.replace(/\./g, "");
      } else {
        cleanNumberString = numberPartString;
        decimalPlaces = parts[1] ? parts[1].length : 0;
        isDecimalDot = true;
      }
    } else if (hasComma) {
      const parts = numberPartString.split(",");
      if (parts.length > 2 || parts[1].length === 3) {
        cleanNumberString = numberPartString.replace(/,/g, "");
      } else {
        cleanNumberString = numberPartString.replace(",", ".");
        decimalPlaces = parts[1] ? parts[1].length : 0;
        isDecimalComma = true;
      }
    }

    const targetNumber = parseFloat(cleanNumberString);
    if (isNaN(targetNumber)) {
      setDisplayValue(targetValueString);
      return;
    }

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
      const easedProgress = progress * (2 - progress); // easeOutQuad
      const currentNumber = easedProgress * targetNumber;

      let formattedNumber = "";
      if (hasDot && !isDecimalDot) {
        formattedNumber = Math.floor(currentNumber)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      } else if (hasComma && !isDecimalComma) {
        formattedNumber = Math.floor(currentNumber)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else if (isDecimalDot) {
        formattedNumber = currentNumber.toFixed(decimalPlaces);
      } else if (isDecimalComma) {
        formattedNumber = currentNumber.toFixed(decimalPlaces).replace(".", ",");
      } else {
        formattedNumber = Math.floor(currentNumber).toString();
      }

      setDisplayValue(`${prefix}${formattedNumber}${suffix}`);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [targetValueString, durationMs]);

  return displayValue;
}

function Counter({ value, duration = 2000 }: { value: string; duration?: number }) {
  const animatedValue = useCountUp(value, duration);
  return <span>{animatedValue}</span>;
}

export default function AboutPage() {
  const [pageAssets, setPageAssets] = useState<PageAssetItem[]>(
    DEFAULT_MARKETING_CONFIG.pageAssets
  );
  const [homeTexts, setHomeTexts] = useState<HomeTextItem[]>(
    DEFAULT_MARKETING_CONFIG.homeTexts
  );

  useEffect(() => {
    async function fetchMarketingConfig() {
      try {
        const res = await fetch("/api/settings/marketing", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const config = normalizeMarketingConfig(data?.data);
        setHomeTexts(
          config.homeTexts.map((item) => ({
            ...item,
            value: repairMojibakeText(item.value),
          }))
        );
        setPageAssets(
          config.pageAssets.map((item) => ({
            ...item,
            label: repairMojibakeText(item.label),
          }))
        );
      } catch (error) {
        console.error("Failed to fetch about page marketing settings:", error);
      }
    }

    fetchMarketingConfig();
  }, []);

  const assetByKey = useMemo(
    () =>
      pageAssets.reduce<Record<string, PageAssetItem>>((acc, item) => {
        if (item.key) acc[item.key] = item;
        return acc;
      }, {}),
    [pageAssets]
  );

  // Dynamic config resolution with fallbacks
  const heroTagline = marketingTextValue(
    homeTexts,
    "about_hero_label",
    "Hồ sơ thương hiệu"
  );
  
  const stat1Value = marketingTextValue(homeTexts, "about_hero_stat_1_value", "15+ triệu");
  const stat1Label = marketingTextValue(homeTexts, "about_hero_stat_1_label", "đơn hàng");
  const stat2Value = marketingTextValue(homeTexts, "about_hero_stat_2_value", "50.000+");
  const stat2Label = marketingTextValue(homeTexts, "about_hero_stat_2_label", "điểm bán toàn quốc");
  const stat3Value = marketingTextValue(homeTexts, "about_hero_stat_3_value", "10 triệu+");
  const stat3Label = marketingTextValue(homeTexts, "about_hero_stat_3_label", "người theo dõi");

  const storyVideoUrl = toYouTubeEmbedUrl(
    assetByKey.about_video?.linkUrl || "https://www.youtube.com/embed/NbWkmT79i5s?autoplay=0&rel=0"
  );

  // Brand Story content constant
  const BRAND_STORY_PARAGRAPHS = [
    "Bà Tuyết Diamond - Đỗ Thị Tuyết - xuất phát điểm là một nông dân ở Thái Nguyên. Công việc hằng ngày của bà là làm ruộng và trồng chè. Gia đình từng gánh khoản nợ hàng trăm triệu đồng từ việc sửa nhà, chữa bệnh và chăn nuôi thất bại. Năm 2014, một tai nạn gãy chân khiến bà phải ở nhà suốt hai năm, mất đi cơ hội làm việc ổn định.",
    "Cuối năm 2020, con trai bà - Nguyễn Minh Trường - bắt đầu rủ mẹ cùng tham gia quay video đời thường. Bằng chiếc điện thoại cũ, những thước phim về cuộc sống gia đình mộc mạc, không tô vẽ, không dàn dựng đã chạm đến hàng triệu người xem. Năm 2022, khi TikTok bắt đầu phát triển mạnh tại Việt Nam, bà Tuyết cùng gia đình bắt đầu chia sẻ nội dung về đồ ăn vặt. Cộng đồng yêu mến không chỉ xem mà còn đặt hàng - và Ăn Cùng Bà Tuyết ra đời từ chính nhu cầu và sự ủng hộ đó.",
    "Trong quá trình phục vụ khách hàng, đội ngũ Ăn Cùng Bà Tuyết nhận ra một thực tế: người Việt Nam vẫn còn nhiều định kiến với đồ ăn vặt nội địa: về chất lượng, về nguồn gốc, về sự thiếu vắng những thương hiệu Việt thật sự đứng sau sản phẩm. Từ nhận thức đó, Ăn Cùng Bà Tuyết xác định sứ mệnh của mình: để người Việt Nam tự hào về đồ ăn vặt của chính mình, với sản phẩm do người Việt làm chủ, nguyên liệu rõ ràng, quy trình kiểm soát được.",
    "Đến nay, Ăn Cùng Bà Tuyết đã xây dựng những nhà máy sản xuất thực phẩm tại Hà Nội và Thái Nguyên, sử dụng những nguồn nguyên liệu chất lượng cao nhập khẩu từ châu Âu, sản phẩm được bảo hiểm trách nhiệm bởi PVI, và phân phối tại hàng nghìn điểm bán trên toàn quốc, từ tạp hóa gần trường học đến các sàn thương mại điện tử."
  ];

  const storyBullets = [
    {
      icon: <Globe className="text-orange-600 h-6 w-6" />,
      text: "Nguyên liệu chân gà chất lượng cao nhập khẩu từ Châu Âu",
    },
    {
      icon: <Factory className="text-orange-600 h-6 w-6" />,
      text: "Hai nhà máy sản xuất phục vụ hàng triệu khách hàng",
    },
    {
      icon: <ShieldCheck className="text-orange-600 h-6 w-6" />,
      text: "Bảo hiểm trách nhiệm sản phẩm khẳng định đồng hành bảo vệ quyền lợi khách hàng",
    },
    {
      icon: <Store className="text-orange-600 h-6 w-6" />,
      text: "Phân phối toàn quốc qua hệ thống bán lẻ và thương mại điện tử",
    },
  ];

  const coreValues = [
    {
      icon: <ShieldCheck className="h-6 w-6 stroke-[1.8]" />,
      title: "An toàn",
      desc: "Sản phẩm phải đạt chuẩn từ nguyên liệu đến thành phẩm, không thỏa hiệp để đổi lấy giá rẻ, sức khoẻ khách hàng là quan trọng nhất và không có ngoại lệ.",
    },
    {
      icon: <Eye className="h-6 w-6 stroke-[1.8]" />,
      title: "Minh bạch",
      desc: "Nguồn gốc nguyên liệu, quy trình sản xuất, chứng nhận chất lượng, tất cả phải được công khai để khách hàng có thể tự kiểm chứng.",
    },
    {
      icon: <Award className="h-6 w-6 stroke-[1.8]" />,
      title: "Trách nhiệm",
      desc: "Khi có vấn đề, Ăn Cùng Bà Tuyết luôn sẵn sàng nhận trách nhiệm và không né tránh. Sản phẩm được bảo hiểm trách nhiệm PVI là 1 phần trong những nỗ lực này.",
    },
    {
      icon: <Zap className="h-6 w-6 stroke-[1.8]" />,
      title: "Quyết liệt",
      desc: "Để có thể phát triển và mang lại nhiều giá trị hơn cho khách hàng, chúng tôi luôn quyết liệt làm tốt hơn mỗi ngày để phục vụ được khách hàng tốt và tốt hơn nữa.",
    },
    {
      icon: <Heart className="h-6 w-6 stroke-[1.8]" />,
      title: "Người Việt làm chủ",
      desc: "Ăn Cùng Bà Tuyết ngay từ khi thành lập đến nay luôn là doanh nghiệp do người Việt sáng lập, vận hành và sở hữu, với khát vọng đưa đồ ăn vặt Việt Nam lên bản đồ thế giới.",
    },
  ];

  return (
    <main className="min-w-0 overflow-x-clip bg-[#FAF7F2] font-sans text-slate-900">
      {/* SECTION 1: CÂU CHUYỆN THƯƠNG HIỆU */}
      <section id="about-history" className="border-b border-slate-200 bg-white py-10 sm:py-16 lg:py-24">
        <div id="about-community" className="mx-auto min-w-0 max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Eyebrow Label Tagline */}
          <motion.div 
            className="inline-flex items-center gap-2 px-3.5 py-1 bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm mb-6"
            initial="hidden"
            animate="visible"
            variants={fapUp}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{heroTagline}</span>
          </motion.div>

          {/* Section Header */}
          <motion.div 
            className="mb-8 max-w-3xl sm:mb-12 lg:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fapUp}
          >
            <h1 className="text-[1.75rem] sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-[1.15] break-words">
              Từ người nông dân Thái Nguyên đến thương hiệu đồ ăn vặt Việt Nam
            </h1>
            <div className="h-1.5 w-20 bg-orange-600 mt-4 rounded-sm" />
          </motion.div>

          <div className="mb-10 grid min-w-0 grid-cols-1 gap-8 sm:mb-16 lg:grid-cols-12 lg:items-start lg:gap-12">
            
            {/* Story Paragraphs */}
            <div className="lg:col-span-7 space-y-8">
              <motion.div 
                className="space-y-5 text-[0.9375rem] leading-relaxed text-slate-800 sm:space-y-6 sm:text-base font-semibold break-words"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={staggerContainer}
              >
                {BRAND_STORY_PARAGRAPHS.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    className={
                      index === 0
                        ? "border border-l-4 border-slate-200/80 border-l-orange-600 bg-[#FAF7F2] p-3.5 text-base font-bold text-slate-950 shadow-[0_2px_8px_rgba(0,0,0,0.01)] sm:p-4 sm:text-xl"
                        : ""
                    }
                    variants={fapUp}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </motion.div>
            </div>

            {/* Right Stats Area (From old Hero) */}
            <motion.div 
              className="lg:col-span-5 grid grid-cols-1 gap-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                { val: stat1Value, label: stat1Label },
                { val: stat2Value, label: stat2Label },
                { val: stat3Value, label: stat3Label },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex flex-col items-center justify-center border-y border-r border-l-4 border-slate-200/80 border-l-orange-600 bg-[#FAF7F2] p-4 shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition duration-300 hover:-translate-y-0.5 hover:border-orange-500/20 hover:shadow-md sm:p-6 lg:items-start"
                  variants={fapUp}
                >
                  <span className="text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight">
                    <Counter value={item.val} />
                  </span>
                  <span className="mt-1 text-xs font-black uppercase tracking-wider text-slate-500 text-center lg:text-left">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>

          </div>

          {/* Bullet cards - Full Width Grid */}
          <motion.div 
            className="mb-10 grid grid-cols-1 gap-4 sm:mb-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            {storyBullets.map((bullet, idx) => (
              <motion.div
                key={idx}
                className="flex min-w-0 flex-row items-start gap-3 border border-slate-200/80 bg-white p-4 shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition duration-300 hover:border-orange-500/20 sm:flex-col sm:gap-4 sm:p-5"
                variants={fapUp}
              >
                <div className="p-2 bg-orange-50 border border-orange-100 rounded-sm self-start">
                  {bullet.icon}
                </div>
                <p className="min-w-0 break-words text-sm font-bold leading-snug text-slate-800">
                  {bullet.text}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Centered Wide Video/Embed Area */}
          <motion.div 
            className="max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fapUp}
          >
            <div className="relative aspect-video w-full overflow-hidden border-2 border-[#0F172A] bg-slate-950 shadow-md sm:border-4">
              {storyVideoUrl ? (
                <iframe
                  src={storyVideoUrl}
                  title="Video câu chuyện thương hiệu Ăn Cùng Bà Tuyết"
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                  <Video className="h-16 w-16 text-orange-500 mb-4" />
                  <span className="text-sm font-black uppercase tracking-wider text-slate-300">
                    Chưa có video được tải lên
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
              <span>Xem quy trình nhà máy thực tế</span>
              <ExternalLink size={12} />
            </div>
          </motion.div>

        </div>
      </section>

      {/* SECTION 2: SỨ MỆNH - TẦM NHÌN - GIÁ TRỊ CỐT LÕI */}
      <section id="about-trust" className="relative overflow-hidden border-b border-orange-200/40 bg-[#F6EFE5] py-12 text-slate-900 sm:py-20 lg:py-24">
        <div id="about-values" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Title */}
          <motion.div 
            className="mx-auto mb-10 max-w-2xl text-center sm:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fapUp}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950">
              Chúng tôi tin vào điều gì
            </h2>
            <div className="h-1.5 w-20 bg-orange-600 mx-auto mt-4 rounded-sm" />
          </motion.div>

          <div className="mb-16 space-y-14 sm:mb-28 sm:space-y-24">
            {/* Sứ mệnh */}
            <motion.div 
              className="grid grid-cols-1 items-center gap-4 border-b border-orange-200/70 pb-10 lg:grid-cols-12 lg:gap-16 lg:border-0 lg:pb-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div className="lg:col-span-8 space-y-4" variants={fapLeft}>
                <span className="text-xs font-black uppercase tracking-wider text-orange-600">
                  Sứ mệnh
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                  "Để người Việt Nam tự hào về đồ ăn vặt của chính mình"
                </h3>
                <p className="text-base text-slate-700 leading-relaxed font-semibold">
                  Đồ ăn vặt Việt Nam từ lâu chịu nhiều định kiến: về chất lượng, về nguồn gốc, về sự thiếu vắng những thương hiệu nội địa thật sự đứng sau sản phẩm. Ăn Cùng Bà Tuyết ra đời và phát triển với mong muốn thay đổi điều đó: xây dựng một thương hiệu đồ ăn vặt mà người Việt có thể yên tâm chọn, tự hào giới thiệu, và biết rõ ai đang chịu trách nhiệm.
                </p>
              </motion.div>
              <motion.div className="order-first flex items-center justify-start lg:order-last lg:col-span-4 lg:justify-center" variants={fapRight}>
                <svg viewBox="0 0 200 200" className="h-16 w-16 text-orange-600 opacity-90 sm:h-20 sm:w-20 lg:h-48 lg:w-48" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="100" cy="100" r="80" strokeDasharray="4 4" className="text-orange-300" />
                  <circle cx="100" cy="100" r="50" className="text-orange-400" />
                  <circle cx="100" cy="100" r="20" className="text-orange-500/20" fill="currentColor" />
                  <line x1="100" y1="10" x2="100" y2="190" className="text-orange-300/50" />
                  <line x1="10" y1="100" x2="190" y2="100" className="text-orange-300/50" />
                  <circle cx="100" cy="50" r="4" fill="#ff7a1a" />
                  <circle cx="150" cy="100" r="4" fill="#ff7a1a" />
                  <circle cx="100" cy="150" r="4" fill="#ff7a1a" />
                  <circle cx="50" cy="100" r="4" fill="#ff7a1a" />
                  <circle cx="100" cy="100" r="6" fill="#ff7a1a" />
                </svg>
              </motion.div>
            </motion.div>

            {/* Tầm nhìn */}
            <motion.div 
              className="grid grid-cols-1 items-center gap-4 border-b border-orange-200/70 pb-10 lg:grid-cols-12 lg:gap-16 lg:border-0 lg:pb-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div className="order-first flex items-center justify-start lg:col-span-4 lg:justify-center" variants={fapLeft}>
                <svg viewBox="0 0 200 200" className="h-16 w-16 text-orange-600 opacity-90 sm:h-20 sm:w-20 lg:h-48 lg:w-48" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="100" cy="100" r="70" className="text-orange-400" />
                  <ellipse cx="100" cy="100" rx="40" ry="70" className="text-orange-300" />
                  <ellipse cx="100" cy="100" rx="15" ry="70" className="text-orange-200" />
                  <line x1="30" y1="100" x2="170" y2="100" className="text-orange-300" />
                  <line x1="40" y1="60" x2="160" y2="60" className="text-orange-200/60" strokeDasharray="3 3" />
                  <line x1="40" y1="140" x2="160" y2="140" className="text-orange-200/60" strokeDasharray="3 3" />
                  <path d="M140,50 L165,42 L157,67 Z" fill="#ff7a1a" />
                  <path d="M100,100 Q135,90 157,56" className="text-orange-500" strokeDasharray="4 4" />
                </svg>
              </motion.div>
              <motion.div className="lg:col-span-8 space-y-4" variants={fapRight}>
                <span className="text-xs font-black uppercase tracking-wider text-orange-600">
                  Tầm nhìn
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                  Vươn tầm quốc tế & khẳng định chất lượng Việt
                </h3>
                <p className="text-base text-slate-700 leading-relaxed font-semibold">
                  Ăn Cùng Bà Tuyết khao khát trở thành một thương hiệu đồ ăn vặt được tin yêu và ủng hộ tại Việt Nam, xa hơn nữa là đưa đồ ăn vặt Việt Nam ra thị trường quốc tế.
                </p>
              </motion.div>
            </motion.div>

            {/* Triết lý kinh doanh */}
            <motion.div 
              className="grid grid-cols-1 items-center gap-4 lg:grid-cols-12 lg:gap-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div className="lg:col-span-8 space-y-4" variants={fapLeft}>
                <span className="text-xs font-black uppercase tracking-wider text-orange-600">
                  Triết lý kinh doanh
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                  "Làm thật và làm khác biệt"
                </h3>
                <p className="text-base text-slate-700 leading-relaxed font-semibold">
                  Ăn Cùng Bà Tuyết không chọn cách làm đồ ăn vặt giống những gì thị trường đã có. Nguyên liệu nhập khẩu từ châu Âu khi phần lớn ngành hàng dùng nguồn nguyên liệu không rõ xuất xứ. Đầu tư và gánh chịu rất nhiều rủi ro khi xây dựng nhà máy hàng chục tỷ đồng thay vì đi thuê nhà máy gia công để tiết kiệm chi phí. Mua bảo hiểm trách nhiệm sản phẩm cho từng gói hàng vài nghìn đồng chỉ với mong muốn được bảo vệ và đồng hành với khách hàng được nhiều hơn. Mỗi quyết định đều đắt hơn, chậm hơn, rủi ro hơn nhưng chúng tôi vẫn chọn chỉ cần nó có thể mang đến nhiều lợi ích hơn cho khách hàng.
                </p>
              </motion.div>
              <motion.div className="order-first flex items-center justify-start lg:order-last lg:col-span-4 lg:justify-center" variants={fapRight}>
                <svg viewBox="0 0 200 200" className="h-16 w-16 text-orange-600 opacity-90 sm:h-20 sm:w-20 lg:h-48 lg:w-48" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M100,35 C70,35 55,55 55,85 C55,110 75,125 75,140 L75,155 L125,155 L125,140 C125,130 145,110 145,85 C145,55 130,35 100,35 Z" className="text-orange-500" />
                  <circle cx="100" cy="85" r="18" className="text-orange-400" strokeDasharray="4 2" />
                  <circle cx="100" cy="85" r="6" className="text-orange-600" fill="#ff7a1a" />
                  <line x1="80" y1="162" x2="120" y2="162" className="text-orange-400" strokeWidth="3" />
                  <line x1="85" y1="169" x2="115" y2="169" className="text-orange-500" strokeWidth="3" />
                  <line x1="100" y1="10" x2="100" y2="20" className="text-orange-600" />
                  <line x1="45" y1="40" x2="55" y2="50" className="text-orange-300" />
                  <line x1="155" y1="40" x2="145" y2="50" className="text-orange-300" />
                  <line x1="30" y1="85" x2="42" y2="85" className="text-orange-600" />
                  <line x1="170" y1="85" x2="158" y2="85" className="text-orange-600" />
                </svg>
              </motion.div>
            </motion.div>

          </div>

          {/* Value cards - 5 columns layout */}
          <div className="mb-16 sm:mb-24">
            <motion.h3 
              className="mb-8 text-center text-2xl font-black tracking-tight text-slate-950 sm:mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fapUp}
            >
              Giá trị cốt lõi
            </motion.h3>
            
            <motion.div 
              className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8 lg:grid-cols-5"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
            >
              {coreValues.map((val, idx) => (
                <motion.div
                  key={idx}
                  className="group relative flex min-w-0 flex-row items-start gap-4 border border-slate-200/60 bg-white p-4 shadow-[0_4px_15px_rgba(0,0,0,0.01)] transition-all duration-300 hover:-translate-y-2 hover:border-orange-500/30 hover:shadow-[0_12px_30px_rgba(255,122,26,0.04)] sm:flex-col sm:p-5 sm:pt-8"
                  variants={fapUp}
                >
                  {/* Subtle top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-orange-600/10 group-hover:bg-orange-600 transition-colors duration-300 rounded-t-md" />

                  {/* Icon Container with hover color transition */}
                  <div className="w-12 h-12 flex items-center justify-center rounded-md bg-orange-50/50 border border-orange-100/50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300 self-start">
                    {val.icon}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-black tracking-tight text-slate-950 group-hover:text-orange-600 transition-colors duration-300">
                      {val.title}
                    </h4>
                    <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Slogan - large typography */}
          <motion.div 
            className="border-t border-orange-200/60 pt-16 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fapUp}
          >
            <h3 className="break-words text-3xl font-black uppercase italic tracking-tight text-orange-600 select-none sm:text-5xl lg:text-7xl">
              "Ăn vặt thì phải ăn cùng Bà Tuyết"
            </h3>
          </motion.div>

        </div>
      </section>

      {/* SECTION 4: CTA CUỐI TRANG */}
      <section className="py-16 lg:py-20 bg-[#FAF7F2]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <motion.h2 
            className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-snug"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fapUp}
          >
            Tìm hiểu thêm về chất lượng và quy trình sản xuất hoặc liên hệ với chúng tôi
          </motion.h2>
          
          <motion.div 
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4 justify-center items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fapUp}
          >
            <Link
              href="/chat-luong"
              className="acbt-btn acbt-btn--primary acbt-btn--xl w-full sm:w-auto sm:min-w-[200px] rounded-md"
            >
              <span>Xem trang Chất lượng</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/san-pham"
              className="acbt-btn acbt-btn--secondary acbt-btn--xl w-full sm:w-auto sm:min-w-[200px] rounded-md"
            >
              <span>Xem sản phẩm</span>
            </Link>
            <Link
              href="/lien-he"
              className="acbt-btn acbt-btn--outline acbt-btn--xl w-full sm:w-auto sm:min-w-[200px] rounded-md"
            >
              <span>Liên hệ với chúng tôi</span>
            </Link>
          </motion.div>

        </div>
      </section>
    </main>
  );
}
