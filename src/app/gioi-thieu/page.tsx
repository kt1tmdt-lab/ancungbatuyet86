"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import CurtainHover from "@/components/shared/CurtainHover";
import {
  DEFAULT_MARKETING_CONFIG,
  normalizeMarketingConfig,
  type PageAssetItem,
  type TrustSectionItem,
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
  ExternalLink,
  BarChart3,
  ShoppingBag,
  MousePointerClick,
  TrendingUp,
  PackageCheck,
  Leaf,
  Truck,
  BadgeCheck,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

const sources = {
  dantri2026: "/tin-tuc/top-1-tiktok-shop-an-vat",
  dantri2025: "/tin-tuc/hanh-trinh-ky-dieu-cua-an-cung-ba-tuyet",
  znewsFactory: "/tin-tuc/khanh-thanh-nha-may-3300m2",
  tiktokCase: "/tin-tuc/top-1-tiktok-shop-an-vat",
};

const ABOUT_PROCESS_ASSET_KEYS = [
  "about_process_ingredient",
  "about_process_factory",
  "about_process_packaging",
  "about_process_distribution",
];

function toYouTubeEmbedUrl(url: string) {
  if (!url) return "";
  if (url.includes("/embed/")) return url;

  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|watch\?.+&v=|shorts\/))([^#&?]+)/);
  return match?.[1] ? `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0` : url;
}


type SourceItem = {
  sourceName: string;
  sourceUrl: string;
};

type DBPost = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  category?: { name: string } | null;
  createdAt: string;
};

type IconBlock = {
  icon: LucideIcon;
  title: string;
  text: string;
};

type TimelineItem = SourceItem & {
  year: string;
  title: string;
  description: string;
};

const heroStats: Array<SourceItem & { value: string; label: string }> = [
  {
    value: "228,6 tỷ",
    label: "doanh thu năm 2025",
    sourceName: "Bản tin ACBT",
    sourceUrl: sources.dantri2026,
  },
  {
    value: "1,9M+",
    label: "sản phẩm bán ra năm 2025",
    sourceName: "Bản tin ACBT",
    sourceUrl: sources.dantri2026,
  },
  {
    value: "97%+",
    label: "doanh số từ TikTok Shop",
    sourceName: "Bản tin ACBT",
    sourceUrl: sources.dantri2026,
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

const processSteps: Array<IconBlock & { image?: string; slug?: string }> = [
  {
    icon: Leaf,
    title: "Chọn nguyên liệu",
    text: "Ưu tiên nguồn đầu vào rõ ràng, phù hợp tiêu chuẩn chế biến và kiểm soát chất lượng trước khi đưa vào sản xuất.",
    slug: "hau-truong-san-xuat-chan-ga",
  },
  {
    icon: Factory,
    title: "Sản xuất tại xưởng",
    text: "Quy trình được tổ chức theo từng khu vực để giữ độ ổn định, hạn chế rủi ro và đảm bảo năng suất.",
    slug: "khanh-thanh-nha-may-3300m2",
  },
  {
    icon: PackageCheck,
    title: "Đóng gói chỉn chu",
    text: "Bao bì được chuẩn hóa để sản phẩm dễ vận chuyển, dễ nhận diện và giữ được trải nghiệm tốt khi đến tay khách.",
    slug: "hanh-trinh-ky-dieu-cua-an-cung-ba-tuyet",
  },
  {
    icon: Truck,
    title: "Phân phối toàn quốc",
    text: "Kết nối các sàn thương mại điện tử và hệ thống vận chuyển để khách hàng đặt mua thuận tiện hơn.",
    slug: "top-1-tiktok-shop-an-vat",
  },
];

const highlights: Array<SourceItem & IconBlock> = [
  {
    icon: Trophy,
    title: "Dẫn đầu ngành hàng online",
    text: "Ăn Cùng Bà Tuyết dẫn đầu ngành hàng đồ ăn vặt trên các nền tảng thương mại điện tử lớn nhờ sản phẩm chất lượng.",
    sourceName: "Bản tin ACBT",
    sourceUrl: sources.dantri2026,
  },
  {
    icon: Factory,
    title: "Mở rộng sản xuất",
    text: "Khánh thành nhà máy sản xuất hiện đại quy mô 3.300m² tại Thái Nguyên giúp nâng cao năng suất.",
    sourceName: "Bản tin ACBT",
    sourceUrl: sources.znewsFactory,
  },
  {
    icon: ShieldCheck,
    title: "Tăng trưởng thương mại điện tử",
    text: "Các chương trình tối ưu hóa vận hành và phân phối giúp nâng cao doanh số và trải nghiệm khách hàng.",
    sourceName: "Bản tin ACBT",
    sourceUrl: sources.tiktokCase,
  },
];


const timeline: TimelineItem[] = [
  {
    year: "10/2023",
    title: "Triển khai bán hàng đa kênh",
    description:
      "Ăn Cùng Bà Tuyết đẩy mạnh chiến lược bán hàng đa kênh, tối ưu hóa công tác tiếp cận và quảng cáo mua sắm trực tuyến.",
    sourceName: "Bản tin ACBT",
    sourceUrl: sources.tiktokCase,
  },
  {
    year: "18/06/2025",
    title: "Cột mốc tăng trưởng ấn tượng",
    description:
      "Ghi nhận mức doanh thu bán hàng đạt 96 tỷ đồng trong nửa đầu năm với hàng trăm ngàn sản phẩm được phân phối thành công.",
    sourceName: "Bản tin ACBT",
    sourceUrl: sources.dantri2025,
  },
  {
    year: "06/2025",
    title: "Khánh thành nhà máy 3.300m²",
    description:
      "Đưa vào vận hành nhà máy sản xuất khép kín hiện đại 2 tầng rộng 3.300m² tại Thái Nguyên đạt chuẩn an toàn thực phẩm.",
    sourceName: "Bản tin ACBT",
    sourceUrl: sources.znewsFactory,
  },
  {
    year: "2025",
    title: "Tổng doanh thu năm đạt 228,6 tỷ",
    description:
      "Kết thúc năm 2025 đầy đột phá với tổng doanh thu đạt 228,6 tỷ đồng cùng hơn 1,9 triệu đơn hàng được hoàn tất.",
    sourceName: "Bản tin ACBT",
    sourceUrl: sources.dantri2026,
  },
];

function SourceLink({
  name,
  url,
  dark = false,
}: {
  name: string;
  url: string;
  dark?: boolean;
}) {
  const isExternal = url.startsWith("http");

  return (
    <Link
      href={url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className={`inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.12em] underline underline-offset-4 transition-colors ${
        dark
          ? "text-amber-200 hover:text-white"
          : "text-orange-700 hover:text-orange-900"
      }`}
    >
      Xem bài viết: {name}
      {isExternal ? <ExternalLink size={12} /> : <ArrowRight size={12} />}
    </Link>
  );
}

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
        Chưa có ảnh từ CMS
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
  item: IconBlock & { image?: string; slug?: string; linkUrl?: string };
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
            {item.slug && (
              <div className="mt-3 flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-orange-700 transition-colors group-hover:text-orange-900 group-hover:underline">
                Xem bài viết quy trình <ArrowRight size={11} className="transition-transform group-hover:translate-x-1" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );

    const itemHref = item.linkUrl || (item.slug ? `/tin-tuc/${item.slug}` : "");

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

function ProofCard({
  item,
  index,
}: {
  item: SourceItem & IconBlock;
  index: number;
}) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="relative overflow-hidden border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
    >
      <div className="absolute left-0 top-0 h-1 w-full bg-orange-500" />
      <div className="mb-7 flex h-14 w-14 items-center justify-center bg-slate-950 text-white">
        <Icon size={28} strokeWidth={1.8} />
      </div>
      <h3 className="text-2xl font-black tracking-[-0.04em] text-slate-950">
        {item.title}
      </h3>
      <p className="mt-4 min-h-[112px] leading-7 text-slate-600">{item.text}</p>
      <div className="mt-6 border-t border-slate-100 pt-5">
        <SourceLink name={item.sourceName} url={item.sourceUrl} />
      </div>
    </motion.div>
  );
}

function DBPostCard({
  post,
  index,
}: {
  post: DBPost;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="group relative flex flex-col justify-between overflow-hidden border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_24px_70px_rgba(15,23,42,0.08)] h-full"
    >
      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-orange-50 border-b border-slate-100">
          <CurtainHover
            overlayMode="partial"
            overlayContent={
              <span className="flex items-center gap-1">
                Đọc tiếp <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </span>
            }
            className="w-full h-full"
          >
            {post.coverImageUrl ? (
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-orange-100 text-3xl font-black text-orange-500">
                ACBT
              </div>
            )}
          </CurtainHover>
          {post.category && (
            <span className="absolute bottom-3 left-3 bg-orange-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white z-30">
              {post.category.name}
            </span>
          )}
        </div>

        <div className="p-6">
          <h3 className="line-clamp-2 text-xl font-black leading-snug tracking-[-0.03em] text-slate-950 transition-colors group-hover:text-orange-600">
            {post.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
            {post.excerpt || "Xem chi tiết bài viết đăng trên hệ thống tin tức Ăn Cùng Bà Tuyết."}
          </p>
        </div>
      </div>

      <div className="p-6 pt-0">
        <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">
            {new Date(post.createdAt).toLocaleDateString("vi-VN", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}
          </span>
          <Link
            href={`/tin-tuc/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-orange-600 group-hover:text-orange-700 group-hover:underline"
          >
            Đọc bài viết
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function AboutPage() {
  const [dbPosts, setDbPosts] = useState<DBPost[]>([]);
  const [pageAssets, setPageAssets] = useState<PageAssetItem[]>([]);
  const [trustSections, setTrustSections] = useState<TrustSectionItem[]>(
    DEFAULT_MARKETING_CONFIG.trustSections,
  );
  const [activeTrustKey, setActiveTrustKey] = useState("");
  const postImagesBySlug = dbPosts.reduce<Record<string, string>>((acc, post) => {
    if (post.slug && post.coverImageUrl) acc[post.slug] = post.coverImageUrl;
    return acc;
  }, {});
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    async function fetchDbPosts() {
      try {
        const res = await fetch("/api/posts?status=PUBLISHED");
        if (res.ok) {
          const data = await res.json();
          setDbPosts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to fetch posts for About page:", error);
      } finally {
        setLoadingPosts(false);
      }
    }
    fetchDbPosts();
  }, []);

  useEffect(() => {
    async function fetchPageAssets() {
      try {
        const res = await fetch("/api/settings/marketing");
        if (!res.ok) return;
        const data = await res.json();
        const marketingConfig = normalizeMarketingConfig(data?.data);
        setPageAssets(marketingConfig.pageAssets);
        setTrustSections(marketingConfig.trustSections);
      } catch (error) {
        console.error("Failed to fetch configurable page assets:", error);
      }
    }

    fetchPageAssets();
  }, []);

  const displayPosts = dbPosts.slice(0, 3);
  const assetByKey = pageAssets.reduce<Record<string, PageAssetItem>>((acc, item) => {
    if (item.key) acc[item.key] = item;
    return acc;
  }, {});
  const processDisplaySteps = processSteps.map((item, index) => ({
    ...item,
    image: assetByKey[ABOUT_PROCESS_ASSET_KEYS[index]]?.imageUrl || (item.slug ? postImagesBySlug[item.slug] : undefined),
    linkUrl: assetByKey[ABOUT_PROCESS_ASSET_KEYS[index]]?.linkUrl || (item.slug ? `/tin-tuc/${item.slug}` : undefined),
  }));
  const configuredGalleryImages = Array.from({ length: 6 })
    .map((_, index) => assetByKey[`about_gallery_${index + 1}`])
    .filter((asset): asset is PageAssetItem => Boolean(asset?.imageUrl))
    .map((asset) => ({
      src: asset.imageUrl,
      label: asset.label || asset.key,
      linkUrl: asset.linkUrl,
    }));
  const fallbackGalleryImages = dbPosts
    .filter((post) => post.coverImageUrl)
    .slice(0, 6)
    .map((post) => ({ src: post.coverImageUrl as string, label: post.title, linkUrl: `/tin-tuc/${post.slug}` }));
  const galleryImages = (configuredGalleryImages.length > 0 ? configuredGalleryImages : fallbackGalleryImages).slice(0, 4);
  const factoryImage = assetByKey.about_process_background?.imageUrl || postImagesBySlug["khanh-thanh-nha-may-3300m2"] || galleryImages[0]?.src;
  const teamImage = assetByKey.about_team_quote?.imageUrl || galleryImages[galleryImages.length - 1]?.src;
  const teamLink = assetByKey.about_team_quote?.linkUrl;
  const aboutVideoUrl = toYouTubeEmbedUrl(assetByKey.about_video?.linkUrl || "https://www.youtube.com/embed/NbWkmT79i5s?autoplay=0&rel=0");
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
      label: "Hành trình & ghi nhận",
      title: "Những dấu mốc tạo nên niềm tin",
      icon: Trophy,
      keys: ["company_history", "achievements"],
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

  return (
    <main className="bg-[#fffaf6] text-slate-950 antialiased selection:bg-orange-500 selection:text-white">
      <section className="px-5 pb-16 pt-24 sm:px-8 lg:pb-24 lg:pt-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="mb-5 inline-flex bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-orange-700">
              Ăn Cùng Bà Tuyết
            </p>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-7xl">
              Đồ ăn vặt Việt, làm chỉn chu và bán minh bạch.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Thương hiệu phát triển từ sản phẩm dễ ăn, nội dung gần gũi và sức mua thật trên các kênh thương mại điện tử.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/san-pham"
                className="inline-flex items-center justify-center gap-3 bg-orange-600 px-7 py-4 text-sm font-black text-white transition hover:bg-orange-700"
              >
                Xem sản phẩm
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/quy-trinh"
                className="inline-flex items-center justify-center gap-3 bg-white px-7 py-4 text-sm font-black text-slate-950 shadow-sm ring-1 ring-slate-200 transition hover:text-orange-700 hover:ring-orange-200"
              >
                Quy trình sản xuất
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="relative"
          >
            <div className="overflow-hidden bg-white shadow-[0_30px_90px_rgba(15,23,42,0.12)]">
              <div className="relative aspect-[4/3] bg-orange-50">
                <img
                  src={factoryImage || galleryImages[0]?.src || "/hero/chan-ga-plate.png"}
                  alt="Không gian sản xuất và sản phẩm Ăn Cùng Bà Tuyết"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-100">
                    Hồ sơ thương hiệu
                  </p>
                  <p className="mt-2 max-w-md text-2xl font-black leading-tight">
                    Sản phẩm, xưởng và số liệu được trình bày rõ ràng.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mx-auto mt-10 grid max-w-7xl gap-4 md:grid-cols-3">
          {heroStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-6 shadow-sm ring-1 ring-orange-100"
            >
              <p className="text-5xl font-black tracking-[-0.07em] text-slate-950">
                {stat.value}
              </p>
              <p className="mt-3 text-sm font-black uppercase tracking-[0.14em] text-slate-600">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-700">
                Nền tảng vận hành
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.05em] text-slate-950 sm:text-5xl">
                Quy trình rõ, hồ sơ rõ, câu chuyện rõ.
              </h2>
            </div>
            <p className="max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
              Trang giới thiệu tập trung vào các điểm khách hàng cần biết: sản xuất thế nào, thương hiệu có gì để tin, và định hướng phát triển ra sao.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {processDisplaySteps.map((item, index) => {
              const Icon = item.icon;
              const card = (
                <article className="flex h-full min-h-[260px] flex-col justify-between bg-[#fffaf3] p-6 ring-1 ring-orange-100">
                  <div>
                    <div className="mb-5 flex h-12 w-12 items-center justify-center bg-white text-orange-600 shadow-sm">
                      <Icon size={23} />
                    </div>
                    <h3 className="text-xl font-black tracking-[-0.03em] text-slate-950">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {item.text}
                    </p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-orange-700">
                    Chi tiết <ArrowRight size={13} />
                  </span>
                </article>
              );
              const href = item.linkUrl || (item.slug ? `/tin-tuc/${item.slug}` : "");

              return href ? (
                <Link key={item.title} href={href} className="block h-full">
                  {card}
                </Link>
              ) : (
                <div key={item.title}>{card}</div>
              );
            })}
          </div>
        </div>
      </section>

      {trustGroups.length > 0 && (
        <section id="ho-so-uy-tin" className="px-5 py-20 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.42fr_0.58fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-700">
                Hồ sơ uy tín
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.05em] text-slate-950 sm:text-5xl">
                Các bằng chứng chính được gom lại để dễ kiểm tra.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                Chọn từng mục để xem phần chi tiết. Nội dung này có thể chỉnh trong CMS Marketing.
              </p>
            </div>

            <div className="overflow-hidden bg-white shadow-sm ring-1 ring-orange-100">
              <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                <div className="divide-y divide-orange-100">
                  {trustGroups.map((group) => {
                    const Icon = group.icon;

                    return (
                      <div key={group.label} className="p-4">
                        <div className="mb-3 flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center bg-orange-50 text-orange-600">
                            <Icon size={18} />
                          </div>
                          <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-orange-700">
                              {group.label}
                            </p>
                            <p className="text-sm font-black text-slate-950">{group.title}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {group.items.map((item) => {
                            const isActive = activeTrustItem?.key === item.key;

                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => setActiveTrustKey(item.key)}
                                className={`w-full px-4 py-3 text-left text-sm font-bold transition ${
                                  isActive ? "bg-orange-600 text-white" : "bg-[#fffaf3] text-slate-800 hover:bg-orange-50"
                                }`}
                              >
                                {item.title}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {activeTrustItem && (
                  <article className="bg-slate-950 text-white">
                    <div className="relative aspect-[16/10] bg-slate-900">
                      {activeTrustItem.imageUrl ? (
                        <img
                          src={activeTrustItem.imageUrl}
                          alt=""
                          className="h-full w-full object-cover opacity-80"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-orange-300">
                          <BadgeCheck size={44} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    </div>
                    <div className="p-6 sm:p-8">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-300">
                        Chi tiết
                      </p>
                      <h3 className="mt-3 text-3xl font-black leading-tight tracking-[-0.04em]">
                        {activeTrustItem.detailTitle || activeTrustItem.title}
                      </h3>
                      <p className="mt-5 text-sm font-semibold leading-7 text-white/76">
                        {activeTrustItem.description}
                      </p>
                      <div className="mt-6 space-y-3 border-t border-white/10 pt-6 text-sm leading-7 text-white/66">
                        {(activeTrustItem.detailContent || "Nội dung chi tiết sẽ được cập nhật trong CMS Marketing.")
                          .split(/\n+/)
                          .filter(Boolean)
                          .map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                      </div>
                    </div>
                  </article>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="bg-white px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-700">
                Định hướng
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.05em] text-slate-950 sm:text-5xl">
                Đi đường dài bằng chất lượng ổn định.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {values.map((item) => {
                const Icon = item.icon;

                return (
                  <article key={item.title} className="min-h-[220px] bg-[#fffaf3] p-6 ring-1 ring-orange-100">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center bg-white text-orange-600 shadow-sm">
                      <Icon size={23} />
                    </div>
                    <h3 className="text-xl font-black tracking-[-0.03em] text-slate-950">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="about-gallery" className="px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-700">
                Hình ảnh
              </p>
              <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-[-0.05em] text-slate-950 sm:text-5xl">
                Sản phẩm, xưởng và con người.
              </h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {galleryImages.length > 0 ? (
              galleryImages.map((image, index) => (
                <motion.div
                  key={image.src}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={index === 0 ? "md:col-span-2 md:row-span-2" : ""}
                >
                  <BrandImage
                    src={image.src}
                    label={image.label}
                    linkUrl={image.linkUrl}
                    ratio={index === 0 ? "aspect-[4/3]" : "aspect-[4/3]"}
                    muted={index > 1}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full bg-orange-50 px-6 py-12 text-center text-sm font-bold text-slate-600">
                Chưa có ảnh thương hiệu trong CMS.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-700">
                Tin tức
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.05em] text-slate-950 sm:text-5xl">
                Dấu mốc mới của thương hiệu.
              </h2>
            </div>
            <Link
              href="/tin-tuc"
              className="inline-flex w-fit items-center gap-3 bg-orange-600 px-6 py-4 text-sm font-black text-white transition hover:bg-orange-700"
            >
              Xem tất cả
              <ArrowRight size={18} />
            </Link>
          </div>

          {loadingPosts ? (
            <div className="grid gap-5 md:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-[360px] animate-pulse bg-slate-50" />
              ))}
            </div>
          ) : displayPosts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-3">
              {displayPosts.map((post, index) => (
                <DBPostCard key={post.id || post.slug} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="bg-orange-50 px-6 py-12 text-center">
              <p className="text-sm font-bold text-slate-600">
                Chưa có bài viết đã xuất bản trong database.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-20 text-white sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-300">
              Khám phá tiếp
            </p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-[-0.05em] sm:text-6xl">
              Xem sản phẩm và quy trình phía sau.
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Link
              href="/san-pham"
              className="inline-flex items-center justify-between gap-8 bg-orange-600 px-7 py-4 text-sm font-black text-white transition hover:bg-orange-700"
            >
              Xem sản phẩm
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/quy-trinh"
              className="inline-flex items-center justify-between gap-8 bg-white px-7 py-4 text-sm font-black text-slate-950 transition hover:bg-orange-50"
            >
              Xem quy trình
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
