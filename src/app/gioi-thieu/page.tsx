"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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

  // Dynamic config resolution with fallbacks matching User Request exactly
  const heroTagline = marketingTextValue(
    homeTexts,
    "about_hero_label",
    "Hồ sơ thương hiệu"
  );
  const heroTitle = marketingTextValue(
    homeTexts,
    "about_hero_title",
    "Ăn Cùng Bà Tuyết: Thương hiệu Việt, vì người Việt"
  );
  const heroDesc = marketingTextValue(
    homeTexts,
    "about_hero_description",
    "Thương hiệu đồ ăn vặt Việt Nam sản xuất tại nhà máy đạt tiêu chuẩn An toàn Vệ sinh thực phẩm & ISO 22000:2018, phân phối toàn quốc qua hệ thống bán lẻ và thương mại điện tử."
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
      icon: <ShieldCheck className="text-emerald-500 h-8 w-8" />,
      title: "An toàn",
      desc: "Sản phẩm phải đạt chuẩn từ nguyên liệu đến thành phẩm, không thỏa hiệp để đổi lấy giá rẻ, sức khoẻ khách hàng là quan trọng nhất và không có ngoại lệ.",
    },
    {
      icon: <Eye className="text-blue-500 h-8 w-8" />,
      title: "Minh bạch",
      desc: "Nguồn gốc nguyên liệu, quy trình sản xuất, chứng nhận chất lượng, tất cả phải được công khai để khách hàng có thể tự kiểm chứng.",
    },
    {
      icon: <Award className="text-orange-500 h-8 w-8" />,
      title: "Trách nhiệm",
      desc: "Khi có vấn đề, Ăn Cùng Bà Tuyết luôn sẵn sàng nhận trách nhiệm và không né tránh. Sản phẩm được bảo hiểm trách nhiệm PVI là 1 phần trong những nỗ lực này.",
    },
    {
      icon: <Zap className="text-amber-500 h-8 w-8" />,
      title: "Quyết liệt",
      desc: "Để có thể phát triển và mang lại nhiều giá trị hơn cho khách hàng, chúng tôi luôn quyết liệt làm tốt hơn mỗi ngày để phục vụ được khách hàng tốt và tốt hơn nữa.",
    },
    {
      icon: <Heart className="text-rose-500 h-8 w-8" />,
      title: "Người Việt làm chủ",
      desc: "Ăn Cùng Bà Tuyết ngay từ khi thành lập đến nay luôn là doanh nghiệp do người Việt sáng lập, vận hành và sở hữu, với khát vọng đưa đồ ăn vặt Việt Nam lên bản đồ thế giới.",
    },
  ];

  return (
    <main className="bg-[#FAF7F2] text-slate-900 overflow-hidden font-sans">
      {/* SECTION 0: HERO */}
      <section className="relative py-16 lg:py-24 border-b border-orange-100/50 bg-white">
        <div className="absolute inset-0 bg-radial-gradient from-orange-50/40 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-center">
            
            {/* Left Content Area */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200/60 shadow-sm">
                <Sparkles className="h-4 w-4 text-orange-600 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-orange-700">
                  {heroTagline}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1]">
                {heroTitle}
              </h1>
              
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl font-medium">
                {heroDesc}
              </p>
              
              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/san-pham"
                  className="acbt-btn acbt-btn--primary acbt-btn--lg shadow-lg"
                >
                  <span>Xem sản phẩm</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/chat-luong"
                  className="acbt-btn acbt-btn--secondary acbt-btn--lg"
                >
                  <span>Xem chất lượng & quy trình</span>
                </Link>
              </div>
            </div>

            {/* Right Stats Area */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { val: stat1Value, label: stat1Label, color: "from-orange-50 to-orange-100/30" },
                { val: stat2Value, label: stat2Label, color: "from-amber-50 to-amber-100/30" },
                { val: stat3Value, label: stat3Label, color: "from-orange-50 to-amber-50" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${item.color} border border-orange-200/50 shadow-sm flex flex-col justify-center items-center lg:items-start transition duration-300 hover:-translate-y-1 hover:shadow-md`}
                >
                  <span className="text-3xl lg:text-4xl font-black text-orange-600 tracking-tight">
                    {item.val}
                  </span>
                  <span className="mt-1 text-xs font-black uppercase tracking-wider text-slate-500 text-center lg:text-left">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 1: CÂU CHUYỆN THƯƠNG HIỆU */}
      <section id="about-history" className="py-16 lg:py-24 bg-[#FAF7F2]">
        <div id="about-community" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="max-w-3xl mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-snug">
              Từ người nông dân Thái Nguyên đến thương hiệu đồ ăn vặt Việt Nam
            </h2>
            <div className="h-1 w-20 bg-orange-600 mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-start">
            
            {/* Story Paragraphs & Bullets */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-6 text-slate-800 text-base leading-relaxed font-semibold">
                {BRAND_STORY_PARAGRAPHS.map((paragraph, index) => (
                  <p
                    key={index}
                    className={
                      index === 0
                        ? "text-lg sm:text-xl font-bold text-slate-950 border-l-4 border-orange-600 pl-4 py-1 bg-white p-3 rounded-r-lg shadow-sm"
                        : ""
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Bullet list below paragraph */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {storyBullets.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-4 rounded-xl bg-white border border-orange-100 shadow-sm items-start"
                  >
                    <div className="p-2 rounded-lg bg-orange-50 shrink-0">
                      {bullet.icon}
                    </div>
                    <p className="text-sm font-bold text-slate-800 leading-snug">
                      {bullet.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sticky Video/Embed Area */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="relative rounded-3xl overflow-hidden bg-slate-950 border-8 border-white shadow-xl aspect-video w-full group">
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
                    <Video className="h-16 w-16 text-orange-500 mb-4 animate-bounce" />
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
            </div>

          </div>
        </div>
      </section>

      <section id="about-trust" className="py-16 lg:py-24 bg-[#F6EFE5] text-slate-900 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-orange-200/35 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

        <div id="about-values" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Title */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-orange-600">
              Định hướng & Triết lý
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mt-3 tracking-tight text-slate-950">
              Chúng tôi tin vào điều gì
            </h2>
            <div className="h-1 w-20 bg-orange-600 mx-auto mt-4 rounded-full" />
          </div>

          {/* Pillars: Mission, Vision, Business Philosophy */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            
            {/* Sứ mệnh */}
            <div className="p-8 rounded-3xl bg-white border border-orange-100 hover:border-orange-500/30 hover:shadow-md transition duration-300 shadow-sm">
              <span className="inline-block px-3 py-1 rounded bg-orange-50 border border-orange-200/50 text-orange-700 text-xs font-black uppercase tracking-widest mb-6">
                Sứ mệnh
              </span>
              <h3 className="text-xl sm:text-2xl font-black mb-4 tracking-tight text-slate-950 leading-tight">
                "Để người Việt Nam tự hào về đồ ăn vặt của chính mình"
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-semibold">
                Đồ ăn vặt Việt Nam từ lâu chịu nhiều định kiến: về chất lượng, về nguồn gốc, về sự thiếu vắng những thương hiệu nội địa thật sự đứng sau sản phẩm. Ăn Cùng Bà Tuyết ra đời và phát triển với mong muốn thay đổi điều đó: xây dựng một thương hiệu đồ ăn vặt mà người Việt có thể yên tâm chọn, tự hào giới thiệu, và biết rõ ai đang chịu trách nhiệm.
              </p>
            </div>

            {/* Tầm nhìn */}
            <div className="p-8 rounded-3xl bg-white border border-orange-100 hover:border-orange-500/30 hover:shadow-md transition duration-300 shadow-sm">
              <span className="inline-block px-3 py-1 rounded bg-blue-50 border border-blue-200/50 text-blue-700 text-xs font-black uppercase tracking-widest mb-6">
                Tầm nhìn
              </span>
              <h3 className="text-xl sm:text-2xl font-black mb-4 tracking-tight text-slate-950 leading-tight">
                Vươn tầm quốc tế & khẳng định chất lượng Việt
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-semibold">
                Ăn Cùng Bà Tuyết khao khát trở thành một thương hiệu đồ ăn vặt được tin yêu và ủng hộ tại Việt Nam, xa hơn nữa là đưa đồ ăn vặt Việt Nam ra thị trường quốc tế.
              </p>
            </div>

            {/* Triết lý kinh doanh */}
            <div className="p-8 rounded-3xl bg-white border border-orange-100 hover:border-orange-500/30 hover:shadow-md transition duration-300 shadow-sm">
              <span className="inline-block px-3 py-1 rounded bg-amber-50 border border-amber-200/50 text-amber-700 text-xs font-black uppercase tracking-widest mb-6">
                Triết lý kinh doanh
              </span>
              <h3 className="text-xl sm:text-2xl font-black mb-4 tracking-tight text-slate-950 leading-tight">
                "Làm thật và làm khác biệt"
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-semibold">
                Ăn Cùng Bà Tuyết không chọn cách làm đồ ăn vặt giống những gì thị trường đã có. Nguyên liệu nhập khẩu từ châu Âu khi phần lớn ngành hàng dùng nguồn nguyên liệu không rõ xuất xứ. Đầu tư và gánh chịu rất nhiều rủi ro khi xây dựng nhà máy hàng chục tỷ đồng thay vì đi thuê nhà máy gia công để tiết kiệm chi phí. Mua bảo hiểm trách nhiệm sản phẩm cho từng gói hàng vài nghìn đồng chỉ với mong muốn được bảo vệ và đồng hành với khách hàng được nhiều hơn. Mỗi quyết định đều đắt hơn, chậm hơn, rủi ro hơn nhưng chúng tôi vẫn chọn chỉ cần nó có thể mang đến nhiều lợi ích hơn cho khách hàng.
              </p>
            </div>

          </div>

          {/* Value cards - 5 cards horizontal layout on large screens */}
          <div className="mb-20">
            <h3 className="text-2xl font-black tracking-tight text-slate-950 text-center mb-10">
              Giá trị cốt lõi
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {coreValues.map((val, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-orange-100/50 flex flex-col items-center text-center hover:border-orange-500/30 hover:shadow-md transition duration-300 shadow-sm"
                >
                  <div className="mb-4">{val.icon}</div>
                  <h4 className="text-lg font-black tracking-tight mb-2 text-slate-950">
                    {val.title}
                  </h4>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Slogan - large typography */}
          <div className="border-t border-orange-200/50 pt-16 text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600 mb-2">
              Slogan
            </p>
            <h3 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent italic select-none">
              "Ăn vặt thì phải ăn cùng Bà Tuyết"
            </h3>
          </div>

        </div>
      </section>

      {/* SECTION 4: CTA CUỐI TRANG */}
      <section className="py-16 lg:py-20 border-t border-orange-100 bg-[#FFFBF5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-snug">
            Tìm hiểu thêm về chất lượng và quy trình sản xuất hoặc liên hệ với chúng tôi
          </h2>
          
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <Link
              href="/chat-luong"
              className="acbt-btn acbt-btn--primary acbt-btn--xl shadow-md min-w-[200px]"
            >
              <span>Xem trang Chất lượng</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/san-pham"
              className="acbt-btn acbt-btn--secondary acbt-btn--xl min-w-[200px]"
            >
              <span>Xem sản phẩm</span>
            </Link>
            <Link
              href="/lien-he"
              className="acbt-btn acbt-btn--outline acbt-btn--xl min-w-[200px]"
            >
              <span>Liên hệ với chúng tôi</span>
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
