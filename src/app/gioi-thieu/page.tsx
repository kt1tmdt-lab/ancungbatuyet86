"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import CurtainHover from "@/components/shared/CurtainHover";
import { normalizeMarketingConfig, type PageAssetItem } from "@/lib/marketing-config";
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
        Chua co anh tu CMS
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
        alt={label}
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
        setPageAssets(normalizeMarketingConfig(data?.data).pageAssets);
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
  const galleryImages = configuredGalleryImages.length > 0 ? configuredGalleryImages : fallbackGalleryImages;
  const factoryImage = assetByKey.about_process_background?.imageUrl || postImagesBySlug["khanh-thanh-nha-may-3300m2"] || galleryImages[0]?.src;
  const teamImage = assetByKey.about_team_quote?.imageUrl || galleryImages[galleryImages.length - 1]?.src;
  const teamLink = assetByKey.about_team_quote?.linkUrl;
  const aboutVideoUrl = toYouTubeEmbedUrl(assetByKey.about_video?.linkUrl || "https://www.youtube.com/embed/NbWkmT79i5s?autoplay=0&rel=0");

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
                "Số liệu có nguồn",
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
                href="/quy-trinh"
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
              <div className="mt-5">
                <SourceLink name={stat.sourceName} url={stat.sourceUrl} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="about-video" className="scroll-mt-24 grid border-b border-orange-100 bg-[#fffaf2] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="px-5 py-20 sm:px-8 lg:px-14 xl:px-20">
          <SectionIntro
            label="Không chỉ là đồ ăn vặt"
            title="Một thương hiệu lớn lên từ sản phẩm, nội dung và niềm tin."
            description="Hình ảnh, số liệu và nguồn dẫn rõ ràng giúp khách hàng tự kiểm chứng hành trình phát triển của thương hiệu."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              "Sản phẩm có nhận diện rõ",
              "Bán hàng qua kênh chính thức",
              "Câu chuyện thương hiệu gần gũi",
              "Nội dung có dẫn nguồn kiểm chứng",
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
              label="Quy trình vận hành"
              title="Nhìn giống công ty thực phẩm phải có quy trình rõ."
              description="Từ nguyên liệu, xưởng sản xuất, đóng gói đến phân phối, mọi thông tin đều hướng tới sự minh bạch và dễ kiểm chứng."
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

      <section className="border-b border-orange-100 bg-[#fbf7ef]">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b border-orange-100 px-5 py-14 sm:px-8 lg:border-b-0 lg:border-r lg:px-14 xl:px-20">
            <SectionIntro
              label="Số liệu có nguồn"
              title="Không kể hay. Đưa bằng chứng."
              description="Các con số được trình bày như hồ sơ tăng trưởng của thương hiệu: doanh thu, sản phẩm bán ra, kênh bán hàng, xưởng sản xuất và hiệu quả quảng cáo."
            />

            <div className="mt-10 border border-orange-100 bg-white p-8 shadow-sm">
              <div className="mb-7 flex h-16 w-16 items-center justify-center bg-orange-600 text-white">
                <BarChart3 size={31} />
              </div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-700">
                Cột mốc doanh thu
              </p>
              <h3 className="mt-4 text-7xl font-black leading-none tracking-[-0.08em] text-slate-950 sm:text-8xl">
                228,6
                <span className="block text-4xl text-orange-600 sm:text-5xl">
                  tỷ đồng
                </span>
              </h3>
              <p className="mt-6 leading-8 text-slate-600">
                Doanh thu năm 2025 theo Dân trí dẫn dữ liệu Metric, tăng 304% so
                với năm trước.
              </p>
              <div className="mt-7 border-t border-slate-100 pt-5">
                <SourceLink name="Dân trí / Metric" url={sources.dantri2026} />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2">
            {[
              {
                icon: PackageCheck,
                value: "1,9M+",
                label: "sản phẩm bán ra năm 2025",
                note: "Sức mua thật được ghi nhận theo dữ liệu Dân trí dẫn từ Metric.",
                sourceName: "Dân trí / Metric",
                sourceUrl: sources.dantri2026,
              },
              {
                icon: ShoppingBag,
                value: "97%+",
                label: "doanh số từ TikTok Shop",
                note: "Kênh bán hàng chủ lực giúp thương hiệu tăng trưởng mạnh trên online.",
                sourceName: "Dân trí / Metric",
                sourceUrl: sources.dantri2026,
              },
              {
                icon: Factory,
                value: "3.300m²",
                label: "xưởng mới",
                note: "Znews ghi nhận xưởng mới có 2 tầng và diện tích lớn hơn xưởng cũ.",
                sourceName: "Znews",
                sourceUrl: sources.znewsFactory,
              },
              {
                icon: MousePointerClick,
                value: "39M+",
                label: "lượt hiển thị PSA",
                note: "Theo case study TikTok for Business về Product Shopping Ads.",
                sourceName: "TikTok for Business",
                sourceUrl: sources.tiktokCase,
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={`${item.value}-${item.label}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="border-b border-orange-100 bg-white p-7 transition-colors hover:bg-orange-50/60 sm:border-r"
                >
                  <div className="mb-8 flex items-center justify-between gap-5">
                    <div className="flex h-14 w-14 items-center justify-center bg-slate-950 text-white">
                      <Icon size={27} />
                    </div>
                    <span className="text-xs font-black text-slate-300">
                      0{index + 1}
                    </span>
                  </div>
                  <p className="text-5xl font-black tracking-[-0.07em] text-slate-950">
                    {item.value}
                  </p>
                  <h3 className="mt-2 text-lg font-black text-slate-900">
                    {item.label}
                  </h3>
                  <p className="mt-3 min-h-[76px] text-sm leading-7 text-slate-650">
                    {item.note}
                  </p>
                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <SourceLink name={item.sourceName} url={item.sourceUrl} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="grid border-t border-orange-100 bg-white lg:grid-cols-[0.85fr_1.15fr]">
          <div className="px-5 py-12 sm:px-8 lg:px-14 xl:px-20">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-700">
              Hiệu quả quảng cáo
            </p>
            <h3 className="mt-3 max-w-3xl text-3xl font-black leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Product Shopping Ads không chỉ tạo hiển thị, mà còn kéo tăng GMV.
            </h3>
            <div className="mt-6">
              <SourceLink name="TikTok for Business" url={sources.tiktokCase} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2">
            <div className="border-t border-orange-100 bg-[#f7efe3] p-8 lg:border-l lg:border-t-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-600">
                  ROAS
                </p>
                <TrendingUp className="text-orange-700" size={27} />
              </div>
              <p className="mt-5 text-6xl font-black tracking-[-0.07em] text-slate-950">
                8,9x
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Tăng theo case study TikTok for Business.
              </p>
            </div>

            <div className="border-t border-orange-100 bg-slate-950 p-8 text-white sm:border-l lg:border-t-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-white/70">
                  GMV
                </p>
                <TrendingUp className="text-orange-300" size={27} />
              </div>
              <p className="mt-5 text-6xl font-black tracking-[-0.07em]">7x</p>
              <p className="mt-3 text-sm leading-7 text-white/70">
                So với khoảng thời gian tương đương trước chiến dịch.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about-gallery" className="scroll-mt-24 border-b border-orange-100 bg-white">
        <div className="grid lg:grid-cols-[0.52fr_1.48fr]">
          <div className="border-b border-orange-100 px-5 py-16 sm:px-8 lg:border-b-0 lg:border-r lg:px-14 xl:px-20">
            <SectionIntro
              label="Hình ảnh thương hiệu"
              title="Cho khách hàng nhìn thấy sản phẩm, xưởng và đội ngũ."
              description="Hình ảnh thật về sản phẩm, xưởng và đội ngũ giúp khách hàng cảm nhận rõ hơn về quy mô và sự chỉn chu của thương hiệu."
            />
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3">
            {galleryImages.length > 0 ? (
              galleryImages.map((image, index) => (
                <motion.div
                  key={image.src}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-r border-white/20 overflow-hidden"
                >
                  <BrandImage
                    src={image.src}
                    label={image.label}
                    linkUrl={image.linkUrl}
                    ratio="aspect-[5/3]"
                    muted={index > 1}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full border border-dashed border-orange-200 bg-orange-50/40 px-6 py-12 text-center text-sm font-bold text-slate-600">
                Chua co anh thuong hieu trong CMS.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-orange-100 bg-[#f7efe3]">
        <div className="grid lg:grid-cols-[0.62fr_1.38fr]">
          <div className="border-b border-orange-100 px-5 py-16 sm:px-8 lg:border-b-0 lg:border-r lg:px-14 xl:px-20">
            <SectionIntro
              label="Định hướng thương hiệu"
              title="Sứ mệnh, tầm nhìn và giá trị cốt lõi."
              description="Câu chuyện được kể gần gũi nhưng vẫn thể hiện rõ nền tảng của một doanh nghiệp sản xuất thực phẩm."
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item, index) => (
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

      <section className="border-b border-orange-100 bg-white px-5 py-20 sm:px-8 lg:px-14 xl:px-20">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro
            label="Tin tức & Truyền thông"
            title="Dấu ấn & Câu chuyện nổi bật"
            description="Cập nhật các hoạt động mới nhất, câu chuyện hậu trường sản xuất và cột mốc nổi bật từ Ăn Cùng Bà Tuyết."
          />
          <Link
            href="/tin-tuc"
            className="inline-flex w-fit items-center gap-3 border border-orange-200 bg-orange-50 px-6 py-4 text-sm font-black text-orange-700 transition hover:border-orange-500 hover:bg-orange-600 hover:text-white"
          >
            Xem tất cả tin tức
            <ArrowRight size={18} />
          </Link>
        </div>

        {loadingPosts ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-[360px] animate-pulse border border-slate-200 bg-slate-50" />
            ))}
          </div>
        ) : displayPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {displayPosts.map((post, index) => (
              <DBPostCard key={post.id || post.slug} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-orange-200 bg-orange-50/40 px-6 py-12 text-center">
            <p className="text-sm font-bold text-slate-600">
              Chưa có bài viết đã xuất bản trong database.
            </p>
          </div>
        )}
      </section>

      <section className="border-b border-orange-100 bg-[#f7efe3]">
        <div className="grid lg:grid-cols-[0.46fr_1.54fr]">
          <div className="border-b border-orange-100 px-5 py-16 sm:px-8 lg:border-b-0 lg:border-r lg:px-14 xl:px-20">
            <SectionIntro
              label="Hành trình có đối chiếu"
              title="Mốc quan trọng, nguồn rõ ràng."
              description="Các mốc phát triển được trình bày rõ ràng để khách hàng theo dõi hành trình lớn lên của thương hiệu."
            />
          </div>

          <div>
            {timeline.map((item, index) => (
              <motion.div
                key={`${item.year}-${item.title}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="grid border-b border-orange-100 bg-white last:border-b-0 md:grid-cols-[220px_1fr]"
              >
                <div className="border-b border-orange-100 bg-orange-50 p-6 md:border-b-0 md:border-r">
                  <p className="text-4xl font-black tracking-[-0.06em] text-orange-700">
                    {item.year}
                  </p>
                </div>
                <div className="p-6 sm:p-8">
                  <h3 className="text-2xl font-black tracking-[-0.04em] text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-4xl leading-8 text-slate-600">
                    {item.description}
                  </p>
                  <div className="mt-5">
                    <SourceLink name={item.sourceName} url={item.sourceUrl} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="about-team" className="scroll-mt-24 grid border-b border-orange-100 bg-white lg:grid-cols-[0.8fr_1.2fr]">
        <div className="min-h-[280px] border-b border-orange-100 lg:min-h-[360px] lg:border-b-0 lg:border-r">
          <BrandImage
            src={teamImage}
            label="Đội ngũ vận hành / ảnh minh hoạ"
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

      <section className="bg-slate-950 text-white">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="px-5 py-16 sm:px-8 lg:px-14 xl:px-20">
            <p className="mb-5 inline-flex border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-orange-200">
              Tiếp tục khám phá
            </p>
            <h2 className="max-w-5xl text-4xl font-black leading-tight tracking-[-0.05em] sm:text-6xl">
              Xem sản phẩm và quy trình phía sau thương hiệu.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              Trang giới thiệu tạo niềm tin, còn trang sản phẩm và quy trình sản
              xuất giúp khách hàng hiểu rõ vì sao nên lựa chọn thương hiệu.
            </p>
          </div>

          <div className="grid border-t border-white/10 lg:border-l lg:border-t-0">
            <Link
              href="/quy-trinh"
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
