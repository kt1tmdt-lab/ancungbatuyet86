"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Building2,
  CheckCircle2,
  Factory,
  FileText,
  Handshake,
  Heart,
  MapPin,
  PackageCheck,
  Quote,
  ShieldCheck,
  Sparkles,
  Target,
  Truck,
  Users,
  X,
} from "lucide-react";
import {
  DEFAULT_MARKETING_CONFIG,
  normalizeMarketingConfig,
  type HistoryMilestoneItem,
  type HomeTextItem,
  type PageAssetItem,
} from "@/lib/marketing-config";

const BRAND_ORANGE = "text-orange-600";

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
  if (!MOJIBAKE_MARKERS.some((marker) => value.includes(marker))) return value;

  try {
    const bytes = new Uint8Array([...value].map((char) => {
      const code = char.charCodeAt(0);
      if (code <= 0xff) return code;
      return CP1252_REVERSE[code] ?? code;
    }));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return value;
  }
}

function toYouTubeEmbedUrl(url: string) {
  if (!url) return "";
  if (url.includes("/embed/")) return url;

  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|watch\?.+&v=|shorts\/))([^#&?]+)/);
  return match?.[1] ? `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0` : url;
}

function SectionLabel({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={`inline-flex border-l-4 border-orange-600 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] ${dark ? "bg-white/10 text-orange-200" : "bg-orange-50 text-orange-700"}`}>
      {children}
    </p>
  );
}

function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "dark";
}) {
  const classes = {
    primary: "bg-orange-600 text-white hover:bg-slate-950 focus-visible:outline-orange-700",
    secondary: "border border-slate-200 bg-white text-slate-950 hover:border-orange-400 hover:text-orange-700 focus-visible:outline-orange-700",
    dark: "bg-slate-950 text-white hover:bg-orange-600 focus-visible:outline-white",
  }[variant];

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-3 px-6 py-4 text-xs font-black uppercase tracking-wider transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${classes}`}
    >
      {children}
      <ArrowRight size={16} />
    </Link>
  );
}

function PlaceholderValue({ children = "Cần cập nhật" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex w-fit border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-orange-700">
      {children}
    </span>
  );
}

function AssetImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return <img src={src} alt={alt} className={`h-full w-full object-cover ${className}`} />;
}

function marketingTextValue(items: HomeTextItem[], key: string, fallback: string) {
  const value = items.find((item) => item.key === key)?.value;
  return repairMojibakeText(value && value.trim() ? value : fallback);
}

const brandStats = [
  {
    value: "Cần cập nhật",
    label: "Doanh thu thương mại điện tử năm 2025.",
  },
  {
    value: "Cần cập nhật",
    label: "Sản phẩm đã bán ra trên các kênh phân phối.",
  },
  {
    value: "Cần cập nhật",
    label: "Người theo dõi trên các nền tảng mạng xã hội.",
  },
];

const storyHighlights = [
  {
    icon: Sparkles,
    title: "Nguồn nguyên liệu được lựa chọn",
    desc: "Một số nguyên liệu chính được nhập khẩu từ châu Âu theo tiêu chuẩn của doanh nghiệp.",
  },
  {
    icon: Factory,
    title: "Sản xuất theo quy trình",
    desc: "Sản phẩm được tổ chức sản xuất tại nhà máy của NMV Food.",
  },
  {
    icon: Truck,
    title: "Phân phối trên toàn quốc",
    desc: "Có mặt trên các nền tảng thương mại điện tử và hệ thống điểm bán.",
  },
  {
    icon: ShieldCheck,
    title: "Bảo hiểm trách nhiệm sản phẩm PVI",
    desc: "Thể hiện trách nhiệm của doanh nghiệp đối với sản phẩm đưa ra thị trường.",
  },
];

const DEFAULT_FULL_BRAND_STORY = `Tôi cũng có một nỗi sợ.

Một nỗi sợ giống như rất nhiều người tiêu dùng khác: sợ chân gà không rõ nguồn gốc. Sợ những sản phẩm bị gắn với cái tên “chân gà Trung Quốc”.

Tôi là một người mẹ, cũng là một người bà. Làm sao tôi có thể để con cháu mình ăn những sản phẩm mà không biết chúng đến từ đâu, được sản xuất như thế nào và có thực sự bảo đảm an toàn hay không?

Bởi sức khỏe của các con, các cháu hôm nay cũng chính là tương lai của chúng sau này.

Nhưng nỗi ám ảnh mang tên “chân gà Trung Quốc” đã ăn sâu vào suy nghĩ của nhiều người. Đến mức dù tôi có làm thật, nói thật và công khai mọi thứ, vẫn có người không tin.

Người ta nghi ngờ. Người ta chỉ trích. Người ta để lại những bình luận cay nghiệt và lan truyền những tin đồn không có căn cứ về Chân Gà Bà Tuyết.

Sức ép từ dư luận, chỉ có thể diễn tả bằng hai chữ: Khủng khiếp.

Có những ngày tôi ngồi đọc từng bình luận ác ý, từng lời phủ nhận mọi công sức mà mình đã bỏ ra. Tôi thấy mệt mỏi. Tôi thấy tủi thân. Và dường như tôi già đi sau mỗi đêm mất ngủ.

Tôi biết con đường mình lựa chọn chưa bao giờ là dễ dàng. Làm tốt vẫn có thể bị nói. Làm đúng vẫn có thể bị nghi ngờ.

Có những lúc tôi không thể chịu đựng thêm được nữa. Tôi đã từng muốn nói: “Hay là mình dừng lại thôi.”

Nhưng rồi tôi lại tự hỏi: Nếu ai cũng sợ hãi và bỏ cuộc, vậy ai sẽ là người đứng lên để xóa bỏ nỗi sợ ấy?

Chính vì vậy, tôi quyết định tiếp tục.

Tôi tin rằng nơi này sẽ tạo ra những sản phẩm có nguồn gốc rõ ràng, quy trình sản xuất minh bạch và chất lượng được kiểm soát nghiêm túc.

Tôi tin rằng nơi này không chỉ tạo ra những gói chân gà ngon, mà còn tạo thêm công ăn việc làm ổn định cho bà con tại Thái Nguyên.

Tôi tin rằng nơi này sẽ đóng góp một phần nhỏ bé vào hành trình xây dựng và phát triển quê hương. Và tôi tin rằng nơi này sẽ từng bước đưa Thái Nguyên lên bản đồ ăn vặt Việt Nam.

Tôi không mong mọi người tin tôi chỉ bằng những lời tôi nói.

Tôi mong mọi người hãy nhìn vào những gì chúng tôi đang làm. Hãy nhìn vào nhà máy. Hãy nhìn vào nguyên liệu. Hãy nhìn vào quy trình sản xuất. Và hãy nhìn vào từng sản phẩm được làm ra mỗi ngày.

Hãy để tôi và những con người tại đây từng bước xóa đi nỗi sợ mang tên: “Chân gà Trung Quốc.”

Để khi cầm trên tay một gói Chân Gà Bà Tuyết, mọi người không chỉ cảm nhận được vị ngon, mà còn cảm nhận được sự minh bạch, trách nhiệm và niềm tự hào của một sản phẩm được làm nên tại Thái Nguyên.

CHÂN GÀ BÀ TUYẾT
Ngon phải rõ nguồn gốc – Ăn phải thật an tâm.`;

const businessInfo = [
  ["Tên thương hiệu", "Ăn Cùng Bà Tuyết"],
  ["Tên viết tắt", "ACBT"],
  ["Pháp nhân sản xuất", "NMV Food"],
  ["Người sáng lập", "Đỗ Thị Tuyết"],
  ["Năm hình thành thương hiệu", "Cần xác nhận"],
  ["Trụ sở/Văn phòng", "Xuân Phương, Hà Nội"],
  ["Nhà máy sản xuất", "Nhà máy NMV Food tại Thái Nguyên"],
  ["Địa chỉ chi tiết nhà máy", "Cần xác nhận"],
  ["Quy mô nhà máy", "3.300 m²"],
  ["Ngành hàng", "Đồ ăn vặt chế biến"],
  ["Kênh phân phối", "Hệ thống tạp hóa toàn quốc, TikTok Shop và Shopee"],
  ["Bảo hiểm sản phẩm", "Bảo hiểm trách nhiệm sản phẩm PVI"],
];

const missionCards = [
  {
    icon: Target,
    title: "Sứ mệnh",
    desc: "Mang đến những sản phẩm đồ ăn vặt có hương vị hấp dẫn, nguồn gốc rõ ràng và được tổ chức sản xuất theo quy trình, để người tiêu dùng có thêm những lựa chọn phù hợp cho các khoảnh khắc ăn uống thường ngày.",
  },
  {
    icon: BadgeCheck,
    title: "Tầm nhìn",
    desc: "Trở thành một thương hiệu đồ ăn vặt Việt Nam được người tiêu dùng nhớ đến bởi sự gần gũi, chất lượng ổn định và khả năng phân phối rộng khắp.",
  },
  {
    icon: Heart,
    title: "Giá trị cốt lõi",
    desc: "Chân thành trong giao tiếp. Trách nhiệm với sản phẩm. Minh bạch về nguồn gốc và quy trình. Luôn lắng nghe phản hồi của khách hàng. Không ngừng cải tiến sản phẩm và hoạt động sản xuất.",
  },
];

export default function AboutPage() {
  const [pageAssets, setPageAssets] = useState<PageAssetItem[]>(DEFAULT_MARKETING_CONFIG.pageAssets);
  const [homeTexts, setHomeTexts] = useState<HomeTextItem[]>(DEFAULT_MARKETING_CONFIG.homeTexts);
  const [historyMilestones, setHistoryMilestones] = useState<HistoryMilestoneItem[]>(DEFAULT_MARKETING_CONFIG.historyMilestones);
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  useEffect(() => {
    async function fetchMarketingConfig() {
      try {
        const res = await fetch("/api/settings/marketing", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const config = normalizeMarketingConfig(data?.data);
        setHomeTexts(config.homeTexts.map((item) => ({
          ...item,
          value: repairMojibakeText(item.value),
        })));
        setPageAssets(config.pageAssets.map((item) => ({
          ...item,
          label: repairMojibakeText(item.label),
        })));
        setHistoryMilestones(config.historyMilestones.map((item) => ({
          ...item,
          year: repairMojibakeText(item.year),
          title: repairMojibakeText(item.title),
          description: repairMojibakeText(item.description),
          detailContent: repairMojibakeText(item.detailContent),
        })));
      } catch (error) {
        console.error("Failed to fetch about page assets:", error);
      }
    }

    fetchMarketingConfig();
  }, []);

  const assetByKey = useMemo(() => pageAssets.reduce<Record<string, PageAssetItem>>((acc, item) => {
    if (item.key) acc[item.key] = item;
    return acc;
  }, {}), [pageAssets]);

  const heroImage = assetByKey.about_process_background?.imageUrl || "/bento/bento-factory.png";
  const teamImage = assetByKey.about_team_quote?.imageUrl || "/hero/ba-tuyet-character.png";
  const storyVideoUrl = toYouTubeEmbedUrl(assetByKey.about_video?.linkUrl || "");
  const storyEyebrow = marketingTextValue(homeTexts, "about_story_label", "Câu chuyện thương hiệu");
  const storyTitle = marketingTextValue(homeTexts, "about_story_title", "Tôi cũng có một nỗi sợ.");
  const storySubtitle = marketingTextValue(
    homeTexts,
    "about_story_subtitle",
    "Hành trình của Chân Gà Bà Tuyết bắt đầu từ nỗi sợ rất thật của một người mẹ, một người bà: sợ những sản phẩm không rõ nguồn gốc, và mong muốn làm ra thứ gì đó minh bạch hơn."
  );
  const storyFullText = marketingTextValue(homeTexts, "about_story_full", DEFAULT_FULL_BRAND_STORY);
  const storyParagraphs = storyFullText.split(/\n{2,}/).map((item) => item.trim()).filter(Boolean);
  const storyPreview = storyParagraphs.slice(0, 6);
  const storyChapters = [
    { number: "01", title: "Nỗi sợ", desc: "Sợ chân gà không rõ nguồn gốc, sợ cái tên “chân gà Trung Quốc” bám vào suy nghĩ người tiêu dùng." },
    { number: "02", title: "Áp lực", desc: "Làm thật, nói thật, công khai mọi thứ nhưng vẫn có nghi ngờ, chỉ trích và tin đồn." },
    { number: "03", title: "Quyết định", desc: "Không dừng lại. Trả lời bằng nhà máy, nguyên liệu, quy trình và sản phẩm mỗi ngày." },
    { number: "04", title: "Niềm tin", desc: "Đưa Thái Nguyên lên bản đồ ăn vặt Việt Nam bằng sự minh bạch và trách nhiệm." },
  ];
  const storyProofs = [
    { label: "Nhà máy", value: "Nhìn được" },
    { label: "Nguyên liệu", value: "Truy xuất được" },
    { label: "Quy trình", value: "Kiểm soát được" },
  ];
  const visibleMilestones = historyMilestones
    .filter((item) => item.enabled !== false)
    .sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));
  const businessSectionLabel = marketingTextValue(homeTexts, "about_business_label", "Thông tin doanh nghiệp");
  const businessSectionTitle = marketingTextValue(homeTexts, "about_business_title", "Thông tin thương hiệu và đơn vị sản xuất");
  const businessSectionDescription = marketingTextValue(
    homeTexts,
    "about_business_description",
    "Những thông tin cơ bản giúp khách hàng, đối tác và các đơn vị truyền thông có thể kiểm chứng rõ hơn về thương hiệu Ăn Cùng Bà Tuyết."
  );
  const businessInfoItems = Array.from({ length: 12 }, (_, index) => {
    const position = index + 1;
    const [fallbackLabel, fallbackValue] = businessInfo[index] || [`Dòng ${position}`, ""];
    return [
      marketingTextValue(homeTexts, `about_business_${position}_label`, fallbackLabel),
      marketingTextValue(homeTexts, `about_business_${position}_value`, fallbackValue),
    ] as const;
  }).filter(([label, value]) => label || value);
  const valuesSectionLabel = marketingTextValue(homeTexts, "about_values_label", "Định hướng thương hiệu");
  const valuesSectionTitle = marketingTextValue(homeTexts, "about_values_title", "Sứ mệnh, tầm nhìn và giá trị cốt lõi.");
  const valuesSectionDescription = marketingTextValue(
    homeTexts,
    "about_values_description",
    "Ăn Cùng Bà Tuyết được xây dựng trên nền tảng của sự chân thật: làm sạch, bán thật, phục vụ tử tế và phát triển bền vững."
  );
  const valueIcons = [Target, BadgeCheck, Heart, Users];
  const valueCards = valueIcons.map((icon, index) => {
    const fallback = missionCards[index];
    const position = index + 1;
    return {
      icon,
      title: marketingTextValue(homeTexts, `about_value_${position}_title`, fallback.title),
      desc: marketingTextValue(homeTexts, `about_value_${position}_description`, fallback.desc),
    };
  });

  return (
    <main className="bg-[#fbf7ef] text-slate-950 selection:bg-orange-500 selection:text-white">
      <section className="border-b border-orange-100 bg-[#f7efe3] px-5 py-20 sm:px-8 lg:px-14 xl:px-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <SectionLabel>Hồ sơ thương hiệu</SectionLabel>
            <h1 className="mt-7 max-w-5xl text-5xl font-black leading-[0.92] tracking-[-0.07em] text-slate-950 sm:text-6xl lg:text-7xl">
              Hồ sơ thương hiệu Ăn Cùng Bà Tuyết
            </h1>
          </div>

          <div>
            <p className="max-w-3xl text-base font-semibold leading-8 text-slate-700 sm:text-lg">
              Ăn Cùng Bà Tuyết là thương hiệu đồ ăn vặt Việt Nam được xây dựng từ những nội dung ẩm thực gần gũi, hướng đến các sản phẩm có nguồn gốc rõ ràng, được sản xuất theo quy trình và phân phối rộng rãi trên toàn quốc.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/san-pham">Xem sản phẩm</ButtonLink>
              <ButtonLink href="/chat-luong" variant="secondary">Xem chất lượng & quy trình</ButtonLink>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-7xl border border-orange-100 bg-white shadow-sm lg:grid-cols-3">
          {brandStats.map((stat) => (
            <div key={stat.label} className="border-b border-orange-100 p-7 lg:border-b-0 lg:border-r last:lg:border-r-0">
              <PlaceholderValue>{stat.value}</PlaceholderValue>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-orange-100 bg-white py-20">
        <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 bg-orange-100 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-[#fff4e2]" />
        <div className="relative grid w-full gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(470px,0.86fr)_minmax(760px,1.14fr)] lg:px-8 xl:px-10 2xl:px-14">
          <div className="grid gap-5 lg:self-start">
            <div className="relative min-h-[640px] overflow-hidden border border-orange-100 bg-slate-950 shadow-[18px_18px_0_rgba(234,88,12,0.10)]">
              {storyVideoUrl ? (
                <iframe
                  src={storyVideoUrl}
                  title="Video câu chuyện thương hiệu Ăn Cùng Bà Tuyết"
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <AssetImage src={teamImage} alt="Câu chuyện thương hiệu Chân Gà Bà Tuyết" className="scale-105 opacity-90" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
              <div className="absolute left-6 top-6 border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-white backdrop-blur">
                Câu chuyện thật
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-7 text-white sm:p-9">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-200">Chân Gà Bà Tuyết</p>
                <h2 className="mt-4 max-w-xl text-5xl font-black leading-[0.9] tracking-[-0.075em] sm:text-6xl">
                  {storyTitle}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsStoryOpen(true)}
                  className="mt-7 inline-flex items-center gap-3 bg-orange-600 px-6 py-4 text-xs font-black uppercase tracking-wider text-white transition hover:bg-white hover:text-slate-950"
                >
                  <BookOpen size={16} />
                  Đọc câu chuyện đầy đủ
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 border border-orange-100 bg-white">
              {storyProofs.map((item) => (
                <div key={item.label} className="border-r border-orange-100 p-4 last:border-r-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                  <p className="mt-2 text-sm font-black text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionLabel>{storyEyebrow}</SectionLabel>
              <p className="max-w-xl text-right text-sm font-bold leading-6 text-slate-500">
                Một hành trình được kể bằng nỗi sợ thật, quyết định thật và những việc đang làm mỗi ngày.
              </p>
            </div>
            <div className="mt-7 grid gap-6 2xl:grid-cols-[minmax(520px,1fr)_minmax(340px,0.52fr)] 2xl:items-start">
              <article className="relative border border-orange-100 bg-[#fffaf2] p-7 shadow-[14px_14px_0_rgba(15,23,42,0.05)] sm:p-10">
                <Quote className="absolute right-7 top-7 h-12 w-12 text-orange-200" />
                <p className="max-w-2xl text-2xl font-black leading-tight tracking-[-0.04em] text-slate-950 sm:text-3xl">
                  {storySubtitle}
                </p>

                <div className="mt-10 columns-1 gap-10 space-y-5 text-base font-semibold leading-8 text-slate-700 xl:columns-2 2xl:columns-1">
                  {storyPreview.map((paragraph, index) => (
                    <p
                      key={index}
                      className={
                        index === 0
                          ? "border-l-4 border-orange-600 bg-white px-5 py-4 text-3xl font-black leading-tight tracking-[-0.05em] text-slate-950"
                          : index === 3
                            ? "bg-orange-600 px-5 py-4 text-2xl font-black leading-tight tracking-[-0.04em] text-white"
                            : ""
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>

              <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-1">
                <div className="border border-orange-100 bg-slate-950 p-6 text-white">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-300">Cấu trúc câu chuyện</p>
                  <div className="mt-6 space-y-4">
                    {storyChapters.map((item) => (
                      <div key={item.number} className="grid grid-cols-[52px_1fr] gap-4 border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                        <div className="grid h-12 w-12 place-items-center bg-orange-600 text-sm font-black">{item.number}</div>
                        <div>
                          <h3 className="text-lg font-black tracking-[-0.03em]">{item.title}</h3>
                          <p className="mt-1 text-xs font-semibold leading-5 text-white/65">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsStoryOpen(true)}
                  className="group border border-orange-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-orange-500 hover:shadow-[0_24px_70px_rgba(234,88,12,0.16)] xl:min-h-full"
                >
                  <div className="flex items-center justify-between gap-5">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">Câu chuyện đầy đủ</p>
                      <p className="mt-2 text-2xl font-black tracking-[-0.045em] text-slate-950">Mở toàn bộ câu chuyện</p>
                    </div>
                    <span className="grid h-12 w-12 place-items-center bg-orange-600 text-white transition group-hover:bg-slate-950">
                      <ArrowRight size={18} />
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {storyHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="group border border-orange-100 bg-white p-6 transition hover:-translate-y-1 hover:border-orange-400 hover:bg-orange-600 hover:text-white hover:shadow-[0_20px_60px_rgba(234,88,12,0.16)]">
                    <div className="flex h-12 w-12 items-center justify-center border border-orange-100 bg-orange-50 text-orange-600 transition group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-white">
                      <Icon size={22} />
                    </div>
                    <h3 className="mt-6 text-lg font-black tracking-[-0.03em]">{item.title}</h3>
                    <p className="mt-3 text-sm font-semibold leading-7 text-slate-600 transition group-hover:text-white/78">{item.desc}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-orange-100 bg-[#f7efe3] px-5 py-20 sm:px-8 lg:px-14 xl:px-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <SectionLabel>{businessSectionLabel}</SectionLabel>
            <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-0.055em] sm:text-5xl">
              {businessSectionTitle}
            </h2>
            <p className="mt-6 text-base font-semibold leading-8 text-slate-700">
              {businessSectionDescription}
            </p>
          </div>

          <div className="border border-orange-100 bg-white">
            {businessInfoItems.map(([label, value]) => {
              const isPending = value.toLowerCase().includes("cần xác nhận");
              return (
                <div key={label} className="grid border-b border-orange-100 last:border-b-0 md:grid-cols-[0.42fr_0.58fr]">
                  <div className="bg-orange-50/70 p-4 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{label}</div>
                  <div className="p-4 text-sm font-bold leading-7 text-slate-800">
                    {isPending ? <PlaceholderValue>Cần xác nhận</PlaceholderValue> : value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-orange-100 bg-white px-5 py-20 sm:px-8 lg:px-14 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <SectionLabel>Hành trình phát triển</SectionLabel>
              <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-0.055em] sm:text-5xl">
                Hành trình phát triển của Ăn Cùng Bà Tuyết
              </h2>
            </div>
            <p className="text-base font-semibold leading-8 text-slate-700">
              Từ những nội dung ẩm thực gần gũi trên mạng xã hội, Ăn Cùng Bà Tuyết từng bước xây dựng cộng đồng, phát triển sản phẩm và chuẩn hóa hoạt động sản xuất.
            </p>
          </div>

          <div className="relative mt-14">
            <div className="absolute left-4 top-0 h-full border-l-2 border-dashed border-orange-300 lg:left-1/2 lg:-translate-x-1/2" />
            <div className="space-y-8">
              {visibleMilestones.length === 0 ? (
                <div className="border border-orange-100 bg-[#fbf7ef] p-8 text-sm font-bold text-slate-500">
                  Chưa có cột mốc nào đang hiển thị. Admin có thể thêm và bật hiển thị trong phần Lịch sử phát triển.
                </div>
              ) : null}
              {visibleMilestones.map((item, index) => {
                const isRight = index % 2 === 0;
                const hasMilestoneContent = Boolean(item.description || item.detailContent);
                const content = (
                  <div className={`overflow-hidden border border-orange-100 bg-[#fbf7ef] shadow-[12px_12px_0_rgba(234,88,12,0.08)] transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-[18px_18px_0_rgba(234,88,12,0.12)] ${isRight ? "lg:mr-16" : "lg:ml-16"}`}>
                    {item.imageUrl ? (
                      <div className="h-56 border-b border-orange-100 bg-orange-50">
                        <AssetImage src={item.imageUrl} alt={item.title || item.year || "Cột mốc phát triển"} />
                      </div>
                    ) : null}
                    <div className="p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className={`text-4xl font-black tracking-[-0.07em] ${BRAND_ORANGE}`}>{item.year || String(index + 1).padStart(2, "0")}</p>
                          <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                            {item.type === "achievement" ? "Thành tựu" : "Cột mốc"}
                          </p>
                        </div>
                        {!hasMilestoneContent ? <PlaceholderValue>Cần bổ sung</PlaceholderValue> : null}
                      </div>
                      <h3 className="mt-6 text-2xl font-black tracking-[-0.045em] text-slate-950">{item.title || "Cột mốc mới"}</h3>
                      {item.description ? (
                        <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{item.description}</p>
                      ) : null}
                      {item.detailContent ? (
                        <p className="mt-4 border-l-4 border-orange-300 bg-white/70 px-4 py-3 text-sm font-semibold leading-7 text-slate-700">{item.detailContent}</p>
                      ) : null}
                      {item.linkUrl ? (
                        <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-orange-700">
                          Xem thêm <ArrowRight size={14} />
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
                return (
                  <article key={item.id} className={`relative grid gap-5 pl-12 lg:grid-cols-2 lg:pl-0 ${isRight ? "" : "lg:[&>*:first-child]:col-start-2"}`}>
                    {item.linkUrl ? (
                      <Link href={item.linkUrl} className="block">
                        {content}
                      </Link>
                    ) : content}
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-orange-100 bg-[#f7efe3] px-5 py-20 sm:px-8 lg:px-14 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionLabel>{valuesSectionLabel}</SectionLabel>
          <h2 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[-0.055em] sm:text-5xl">
            {valuesSectionTitle}
          </h2>
          <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-slate-700">
            {valuesSectionDescription}
          </p>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {valueCards.slice(0, 3).map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="border border-orange-100 bg-white p-7">
                  <div className="flex h-12 w-12 items-center justify-center bg-orange-50 text-orange-600">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-7 text-2xl font-black tracking-[-0.045em]">{item.title}</h3>
                  <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">{item.desc}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-4 grid gap-4 border border-orange-100 bg-white lg:grid-cols-[0.85fr_1.15fr]">
            <div className="min-h-[280px] bg-orange-50">
              <AssetImage src={teamImage} alt="Đội ngũ hoặc hoạt động thực tế của Ăn Cùng Bà Tuyết" />
            </div>
            <div className="p-7 lg:p-10">
              <div className="flex h-12 w-12 items-center justify-center bg-orange-50 text-orange-600">
                <Users size={24} />
              </div>
              <h3 className="mt-7 text-3xl font-black tracking-[-0.05em]">{valueCards[3].title}</h3>
              <p className="mt-5 text-base font-semibold leading-8 text-slate-700">
                {valueCards[3].desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-16 text-white sm:px-8 lg:px-14 xl:px-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <SectionLabel dark>Tiếp tục khám phá</SectionLabel>
            <h2 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[-0.055em] sm:text-5xl">
              Tiếp tục khám phá cách sản phẩm được tạo ra
            </h2>
            <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-white/70">
              Tìm hiểu thêm về nguồn nguyên liệu, môi trường sản xuất và các bước kiểm soát được áp dụng trong quá trình tạo ra sản phẩm của Ăn Cùng Bà Tuyết.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/chat-luong" variant="primary">Xem chất lượng & quy trình</ButtonLink>
            <ButtonLink href="/san-pham" variant="secondary">Xem sản phẩm</ButtonLink>
          </div>
        </div>
      </section>

      {isStoryOpen ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5">
          <style>{`
            @keyframes storyFade { from { opacity: 0; } to { opacity: 1; } }
            @keyframes storyPop { from { opacity: 0; transform: translateY(24px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
            @keyframes storyGlow { 0%,100% { opacity: .45; transform: scale(1); } 50% { opacity: .9; transform: scale(1.08); } }
          `}</style>
          <button
            type="button"
            aria-label="Đóng câu chuyện thương hiệu"
            onClick={() => setIsStoryOpen(false)}
            className="absolute inset-0 animate-[storyFade_.18s_ease-out] bg-slate-950/82 backdrop-blur-md"
          />
          <div className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 animate-[storyGlow_4s_ease-in-out_infinite] bg-orange-600/35 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-10 h-96 w-96 animate-[storyGlow_5s_ease-in-out_infinite] bg-orange-300/25 blur-3xl" />
          <article className="relative max-h-[94vh] w-full max-w-[1380px] animate-[storyPop_.24s_ease-out] overflow-hidden border border-orange-300 bg-[#fff8ed] shadow-[0_36px_120px_rgba(0,0,0,0.55)]">
            <button
              type="button"
              onClick={() => setIsStoryOpen(false)}
              className="absolute right-4 top-4 z-30 grid h-12 w-12 place-items-center bg-slate-950 text-white shadow-xl transition hover:rotate-90 hover:bg-orange-600"
              aria-label="Đóng"
            >
              <X size={20} />
            </button>

            <div className="grid max-h-[94vh] overflow-y-auto lg:grid-cols-[0.36fr_0.64fr]">
              <aside className="relative overflow-hidden bg-slate-950 p-7 text-white lg:sticky lg:top-0 lg:min-h-[94vh] lg:p-9">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(234,88,12,.35),transparent_32%),radial-gradient(circle_at_90%_80%,rgba(251,146,60,.22),transparent_30%)]" />
                <div className="absolute -right-24 top-24 h-64 w-64 rounded-full border border-orange-400/30" />
                <div className="absolute -right-12 top-36 h-36 w-36 rounded-full bg-orange-600/25 blur-2xl" />

                <div className="relative">
                  <p className="inline-flex border border-orange-400/40 bg-orange-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-orange-200">
                    Câu chuyện thương hiệu
                  </p>
                  <h3 className="mt-6 text-5xl font-black leading-[0.88] tracking-[-0.075em] sm:text-6xl">
                    Câu chuyện của Bà Tuyết
                  </h3>
                  <p className="mt-5 max-w-md text-sm font-semibold leading-7 text-white/65">
                    Từ một nỗi sợ rất đời thường đến quyết định trả lời thị trường bằng minh bạch, nhà máy, nguyên liệu và từng sản phẩm thật.
                  </p>
                </div>

                <div className="relative mt-8 overflow-hidden border border-white/10 bg-white/5">
                  <div className="relative h-64">
                    <AssetImage src={teamImage} alt="Bà Tuyết trong câu chuyện thương hiệu" className="opacity-85" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-200">Chân Gà Bà Tuyết</p>
                      <p className="mt-2 text-2xl font-black leading-tight">Không chỉ nói hay. Phải làm thật.</p>
                    </div>
                  </div>
                </div>

                <div className="relative mt-7 space-y-3">
                  {storyChapters.map((item) => (
                    <div key={item.number} className="group grid grid-cols-[42px_1fr] gap-4 border border-white/10 bg-white/[0.04] p-3 transition hover:-translate-x-1 hover:border-orange-400/70 hover:bg-orange-600/15">
                      <div className="grid h-10 w-10 place-items-center bg-orange-600 text-xs font-black shadow-[0_0_28px_rgba(234,88,12,.45)]">
                        {item.number}
                      </div>
                      <div>
                        <p className="text-sm font-black">{item.title}</p>
                        <p className="mt-1 text-[11px] font-semibold leading-5 text-white/55 group-hover:text-white/80">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>

              <div className="relative bg-[#fff8ed] p-6 sm:p-10 lg:p-12">
                <div className="pointer-events-none absolute right-10 top-8 text-[120px] font-black leading-none tracking-[-0.08em] text-orange-100/80 sm:text-[170px]">
                  “
                </div>
                <div className="relative">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="border-l-4 border-orange-600 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-orange-700 shadow-sm">
                      Toàn bộ câu chuyện
                    </p>
                    {storyProofs.map((item) => (
                      <span key={item.label} className="border border-orange-100 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                        {item.label}: <span className="text-orange-700">{item.value}</span>
                      </span>
                    ))}
                  </div>

                  <h4 className="mt-6 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.075em] text-slate-950 sm:text-6xl">
                    {storyTitle}
                  </h4>

                  <div className="mt-8 grid gap-4 border-y border-orange-100 py-5 md:grid-cols-3">
                    {["Nỗi sợ không rõ nguồn gốc", "Sức ép từ dư luận", "Trả lời bằng việc làm thật"].map((item, index) => (
                      <div key={item} className="flex items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center bg-orange-600 text-xs font-black text-white">0{index + 1}</span>
                        <p className="text-sm font-black leading-5 text-slate-900">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative mt-9 space-y-5 text-base font-semibold leading-8 text-slate-700">
                  {storyParagraphs.map((paragraph, index) => {
                    const isEmphasis = paragraph.length < 90 || paragraph === paragraph.toUpperCase();
                    const isFinal = index >= storyParagraphs.length - 2;
                    return (
                      <div key={index} className="grid gap-4 md:grid-cols-[54px_1fr]">
                        <span className="hidden h-10 w-10 place-items-center border border-orange-200 bg-white text-[11px] font-black text-orange-700 md:grid">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <p
                          className={
                            isFinal
                              ? "bg-slate-950 px-6 py-5 text-xl font-black leading-tight tracking-[-0.03em] text-white shadow-[12px_12px_0_rgba(234,88,12,0.20)]"
                              : isEmphasis
                                ? "border-l-4 border-orange-500 bg-white px-5 py-4 text-2xl font-black leading-tight tracking-[-0.04em] text-slate-950 shadow-sm"
                                : "bg-white/60 px-5 py-4"
                          }
                        >
                          {paragraph}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="relative mt-10 border border-orange-200 bg-orange-600 p-6 text-white shadow-[16px_16px_0_rgba(15,23,42,0.10)]">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-100">Thông điệp chốt</p>
                  <p className="mt-3 text-3xl font-black leading-tight tracking-[-0.05em]">
                    Chân Gà Bà Tuyết — ngon phải rõ nguồn gốc, ăn phải thật an tâm.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      ) : null}
    </main>
  );
}
