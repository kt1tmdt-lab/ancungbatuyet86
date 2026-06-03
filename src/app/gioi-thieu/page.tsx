"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
  dantri2026:
    "https://dantri.com.vn/kinh-doanh/an-cung-ba-tuyet-thu-gan-230-ty-dongnam-tren-tiktok-shop-shopee-20260316135047206.htm",
  dantri2025:
    "https://dantri.com.vn/kinh-doanh/an-cung-ba-tuyet-thu-gan-100-ty-dong-tren-tiktok-shop-shopee-sau-nua-nam-20250624123716173.htm",
  znewsFactory:
    "https://znews.vn/an-cung-ba-tuyet-khoe-can-canh-xuong-moi-3300-m2-sau-tin-giai-the-post1563244.html",
  tiktokCase:
    "https://ads.tiktok.com/business/vi/inspiration/an-cung-ba-tuyet",
};

const tempImages = {
  founder:
    "https://images.unsplash.com/photo-1484981138541-3d074aa97716?auto=format&fit=crop&w=1400&q=85",
  product:
    "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1400&q=85",
  factory:
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=85",
  packaging:
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=85",
  ecommerce:
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=85",
  team:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=85",
};

type SourceItem = {
  sourceName: string;
  sourceUrl: string;
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
    sourceName: "Dân trí / Metric",
    sourceUrl: sources.dantri2026,
  },
  {
    value: "1,9M+",
    label: "sản phẩm bán ra năm 2025",
    sourceName: "Dân trí / Metric",
    sourceUrl: sources.dantri2026,
  },
  {
    value: "97%+",
    label: "doanh số từ TikTok Shop",
    sourceName: "Dân trí / Metric",
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

const processSteps: IconBlock[] = [
  {
    icon: Leaf,
    title: "Chọn nguyên liệu",
    text: "Ưu tiên nguồn đầu vào rõ ràng, phù hợp tiêu chuẩn chế biến và kiểm soát chất lượng trước khi đưa vào sản xuất.",
  },
  {
    icon: Factory,
    title: "Sản xuất tại xưởng",
    text: "Quy trình được tổ chức theo từng khu vực để giữ độ ổn định, hạn chế rủi ro và đảm bảo năng suất.",
  },
  {
    icon: PackageCheck,
    title: "Đóng gói chỉn chu",
    text: "Bao bì được chuẩn hóa để sản phẩm dễ vận chuyển, dễ nhận diện và giữ được trải nghiệm tốt khi đến tay khách.",
  },
  {
    icon: Truck,
    title: "Phân phối toàn quốc",
    text: "Kết nối các sàn thương mại điện tử và hệ thống vận chuyển để khách hàng đặt mua thuận tiện hơn.",
  },
];

const highlights: Array<SourceItem & IconBlock> = [
  {
    icon: Trophy,
    title: "Dẫn đầu ngành hàng online",
    text: "Theo Dân trí dẫn dữ liệu Metric, thương hiệu đứng đầu ngành hàng đồ ăn vặt trên TikTok Shop và Shopee trong năm 2025.",
    sourceName: "Dân trí / Metric",
    sourceUrl: sources.dantri2026,
  },
  {
    icon: Factory,
    title: "Mở rộng sản xuất",
    text: "Znews ghi nhận xưởng mới có diện tích 3.300m², gồm 2 tầng, lớn hơn xưởng cũ 2.000m².",
    sourceName: "Znews",
    sourceUrl: sources.znewsFactory,
  },
  {
    icon: ShieldCheck,
    title: "Tăng trưởng nhờ thương mại điện tử",
    text: "TikTok for Business ghi nhận chiến dịch PSA giúp ROAS tăng 8,9 lần, GMV tăng 7 lần và hiển thị hơn 39 triệu lần.",
    sourceName: "TikTok for Business",
    sourceUrl: sources.tiktokCase,
  },
];

const gallery = [
  {
    src: tempImages.founder,
    label: "Người sáng lập / ảnh minh hoạ",
  },
  {
    src: tempImages.product,
    label: "Sản phẩm ăn vặt / ảnh minh hoạ",
  },
  {
    src: tempImages.factory,
    label: "Xưởng sản xuất / ảnh minh hoạ",
  },
  {
    src: tempImages.packaging,
    label: "Đóng gói & kho hàng / ảnh minh hoạ",
  },
  {
    src: tempImages.ecommerce,
    label: "Kênh bán hàng online / ảnh minh hoạ",
  },
  {
    src: tempImages.team,
    label: "Đội ngũ vận hành / ảnh minh hoạ",
  },
];

const timeline: TimelineItem[] = [
  {
    year: "10/2023",
    title: "Triển khai Product Shopping Ads",
    description:
      "TikTok for Business ghi nhận Ăn Cùng Bà Tuyết triển khai Product Shopping Ads để tăng GMV và tối ưu quảng cáo mua sắm.",
    sourceName: "TikTok for Business",
    sourceUrl: sources.tiktokCase,
  },
  {
    year: "18/06/2025",
    title: "Đạt 96 tỷ trong gần 6 tháng",
    description:
      "Theo Dân trí dẫn dữ liệu Metric, từ đầu năm đến 18/6/2025, thương hiệu đạt 96 tỷ đồng doanh thu với hơn 868.000 sản phẩm bán ra.",
    sourceName: "Dân trí / Metric",
    sourceUrl: sources.dantri2025,
  },
  {
    year: "06/2025",
    title: "Công bố xưởng mới 3.300m²",
    description:
      "Znews ghi nhận xưởng mới có diện tích 3.300m², 2 tầng; tầng 1 đã hoàn thành và đi vào hoạt động.",
    sourceName: "Znews",
    sourceUrl: sources.znewsFactory,
  },
  {
    year: "2025",
    title: "Doanh thu năm đạt 228,6 tỷ",
    description:
      "Theo Dân trí dẫn dữ liệu Metric, năm 2025 thương hiệu đạt khoảng 228,6 tỷ đồng doanh thu, hơn 1,9 triệu sản phẩm bán ra.",
    sourceName: "Dân trí / Metric",
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
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.12em] underline underline-offset-4 transition-colors ${dark
        ? "text-amber-200 hover:text-white"
        : "text-orange-700 hover:text-orange-900"
        }`}
    >
      Nguồn: {name}
      <ExternalLink size={12} />
    </a>
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
  className = "",
  ratio = "aspect-[4/3]",
  muted = false,
}: {
  src: string;
  label: string;
  className?: string;
  ratio?: string;
  muted?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-orange-50 ${ratio} ${className}`}>
      <img
        src={src}
        alt={label}
        className={`h-full w-full object-cover transition-transform duration-700 hover:scale-105 ${muted ? "saturate-[0.85]" : ""
          }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/20 bg-black/30 p-4 backdrop-blur-sm">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-white">
          {label}
        </p>
      </div>
    </div>
  );
}

function ValueCard({ item, index }: { item: IconBlock; index: number }) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="group h-full border border-orange-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
    >
      <div className="mb-6 flex h-14 w-14 items-center justify-center border border-orange-100 bg-orange-50 text-orange-600 transition-colors group-hover:bg-orange-600 group-hover:text-white">
        <Icon size={27} strokeWidth={1.8} />
      </div>
      <h3 className="text-2xl font-black tracking-[-0.04em] text-slate-950">
        {item.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
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

export default function AboutPage() {
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

      <section className="grid border-b border-orange-100 bg-[#fffaf2] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="px-5 py-20 sm:px-8 lg:px-14 xl:px-20">
          <SectionIntro
            label="Không chỉ là đồ ăn vặt"
            title="Một thương hiệu lớn lên từ sản phẩm, nội dung và niềm tin."
            description="Trang giới thiệu không nên chỉ nói hay. Phần này dùng hình ảnh, số liệu và nguồn dẫn rõ ràng để khách hàng có thể tự kiểm chứng thương hiệu."
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

        <div className="grid grid-cols-2 border-t border-orange-100 lg:border-l lg:border-t-0 lg:max-h-[620px] lg:overflow-hidden">
          <BrandImage
            src={tempImages.founder}
            label="Người sáng lập / ảnh minh hoạ"
            ratio="aspect-[3/4]"
            className="border-r border-b border-white/20"
          />
          <BrandImage
            src={tempImages.product}
            label="Sản phẩm bán chạy / ảnh minh hoạ"
            ratio="aspect-[3/4]"
            className="border-b border-white/20"
          />
          <BrandImage
            src={tempImages.factory}
            label="Xưởng sản xuất / ảnh minh hoạ"
            ratio="aspect-[3/4]"
            className="col-span-2"
            muted
          />
        </div>
      </section>

      <section className="border-b border-orange-100 bg-white">
        <div className="grid lg:grid-cols-[0.62fr_1.38fr]">
          <div className="border-b border-orange-100 bg-[#f7efe3] px-5 py-16 sm:px-8 lg:border-b-0 lg:border-r lg:px-14 xl:px-20">
            <SectionIntro
              label="Quy trình vận hành"
              title="Nhìn giống công ty thực phẩm phải có quy trình rõ."
              description="Bố cục này đặt trọng tâm vào nguyên liệu, xưởng, đóng gói và phân phối thay vì hiệu ứng trang trí."
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((item, index) => (
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
                  <p className="mt-3 min-h-[76px] text-sm leading-7 text-slate-600">
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

      <section className="border-b border-orange-100 bg-white">
        <div className="grid lg:grid-cols-[0.52fr_1.48fr]">
          <div className="border-b border-orange-100 px-5 py-16 sm:px-8 lg:border-b-0 lg:border-r lg:px-14 xl:px-20">
            <SectionIntro
              label="Hình ảnh thương hiệu"
              title="Cho khách hàng nhìn thấy sản phẩm, xưởng và đội ngũ."
              description="Khi có ảnh thật, chỉ cần thay URL trong biến tempImages. Ảnh càng thật thì trang càng bớt cảm giác công nghệ."
            />
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3">
            {gallery.map((image, index) => (
              <motion.div
                key={image.src}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-r border-white/20"
              >
                <BrandImage
                  src={image.src}
                  label={image.label}
                  ratio="aspect-[5/3]"
                  muted={index > 1}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-orange-100 bg-[#f7efe3]">
        <div className="grid lg:grid-cols-[0.62fr_1.38fr]">
          <div className="border-b border-orange-100 px-5 py-16 sm:px-8 lg:border-b-0 lg:border-r lg:px-14 xl:px-20">
            <SectionIntro
              label="Định hướng thương hiệu"
              title="Sứ mệnh, tầm nhìn và giá trị cốt lõi."
              description="Phần này giữ ngôn ngữ gần gũi nhưng vẫn có cảm giác của một doanh nghiệp sản xuất thực phẩm."
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
            label="Dấu ấn nổi bật"
            title="Có thành tích thì phải có nguồn."
            description="Mỗi điểm nổi bật đều đi kèm bài viết hoặc case study để tăng độ tin cậy."
          />
          <Link
            href="/san-pham"
            className="inline-flex w-fit items-center gap-3 border border-orange-200 bg-orange-50 px-6 py-4 text-sm font-black text-orange-700 transition hover:border-orange-500 hover:bg-orange-600 hover:text-white"
          >
            Xem sản phẩm
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item, index) => (
            <ProofCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </section>

      <section className="border-b border-orange-100 bg-[#fbf7ef]">
        <div className="grid lg:grid-cols-[0.46fr_1.54fr]">
          <div className="border-b border-orange-100 px-5 py-16 sm:px-8 lg:border-b-0 lg:border-r lg:px-14 xl:px-20">
            <SectionIntro
              label="Hành trình có đối chiếu"
              title="Mốc quan trọng, nguồn rõ ràng."
              description="Timeline được làm dạng hồ sơ doanh nghiệp, không dùng hiệu ứng kể chuyện quá màu mè."
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

      <section className="grid border-b border-orange-100 bg-white lg:grid-cols-[0.8fr_1.2fr]">
        <div className="min-h-[280px] border-b border-orange-100 lg:min-h-[360px] lg:border-b-0 lg:border-r">
          <BrandImage
            src={tempImages.team}
            label="Đội ngũ vận hành / ảnh minh hoạ"
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
