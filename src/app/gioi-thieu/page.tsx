"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Factory,
  FileText,
  Handshake,
  Heart,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Target,
  Truck,
  Users,
} from "lucide-react";
import {
  DEFAULT_MARKETING_CONFIG,
  normalizeMarketingConfig,
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

const timeline = [
  {
    year: "2022",
    title: "Những nội dung đầu tiên",
    desc: "Hành trình bắt đầu từ niềm yêu thích ẩm thực và những nội dung đời thường được bà Tuyết chia sẻ trên mạng xã hội. Sự gần gũi và chân thành giúp hình ảnh “Bà Tuyết” từng bước nhận được sự quan tâm của cộng đồng.",
  },
  {
    year: "2023",
    title: "Hình thành thương hiệu ACBT",
    desc: "Ăn Cùng Bà Tuyết bắt đầu được phát triển theo định hướng một thương hiệu đồ ăn vặt riêng biệt. Từ việc sáng tạo nội dung, đội ngũ từng bước nghiên cứu sản phẩm, bao bì và phương thức đưa sản phẩm đến người tiêu dùng.",
  },
  {
    year: "2024",
    title: "Mở rộng trên thương mại điện tử",
    desc: "Thương hiệu đẩy mạnh hoạt động trên TikTok Shop, Shopee và các nền tảng mạng xã hội. Cộng đồng khách hàng tiếp tục được mở rộng, tạo nền tảng cho việc phát triển thêm sản phẩm và kênh phân phối.",
  },
  {
    year: "2025",
    title: "Chuẩn hóa hoạt động sản xuất",
    desc: "Nhà máy sản xuất quy mô 3.300 m² tại Thái Nguyên được đưa vào hoạt động cùng NMV Food. Đây là bước tiến quan trọng trong quá trình nâng cao năng lực sản xuất, quản lý quy trình và mở rộng khả năng cung ứng sản phẩm.",
  },
  {
    year: "2026",
    title: "Tiếp tục mở rộng",
    desc: "Cần xác nhận mốc phát triển và định hướng năm 2026.",
    pending: true,
  },
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

  useEffect(() => {
    async function fetchMarketingConfig() {
      try {
        const res = await fetch("/api/settings/marketing", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const config = normalizeMarketingConfig(data?.data);
        setPageAssets(config.pageAssets.map((item) => ({
          ...item,
          label: repairMojibakeText(item.label),
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

      <section className="border-b border-orange-100 bg-white px-5 py-20 sm:px-8 lg:px-14 xl:px-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.86fr]">
          <div>
            <SectionLabel>Câu chuyện thương hiệu</SectionLabel>
            <h2 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[-0.055em] sm:text-5xl">
              Từ căn bếp nhỏ đến một thương hiệu được nhiều người biết đến
            </h2>
            <div className="mt-8 space-y-5 text-base font-semibold leading-8 text-slate-700">
              <p>
                Ăn Cùng Bà Tuyết bắt đầu từ niềm yêu thích ẩm thực và mong muốn chia sẻ những món ăn gần gũi đến với mọi người của bà Đỗ Thị Tuyết. Từ những video đời thường trên mạng xã hội, hình ảnh “Bà Tuyết” dần nhận được sự yêu mến nhờ cách nói chuyện chân thành, mộc mạc và gần gũi.
              </p>
              <p>
                Khi cộng đồng ngày càng lớn, Ăn Cùng Bà Tuyết không chỉ dừng lại ở việc chia sẻ nội dung mà từng bước phát triển thành một thương hiệu đồ ăn vặt có định hướng rõ ràng. Các sản phẩm được nghiên cứu để vừa giữ được hương vị hấp dẫn, vừa đáp ứng yêu cầu về nguồn nguyên liệu, quy trình sản xuất và khả năng phân phối trên quy mô lớn.
              </p>
              <p>
                Hành trình đó tiếp tục được phát triển thông qua sự hợp tác với NMV Food, đơn vị trực tiếp tổ chức sản xuất tại nhà máy ở Thái Nguyên.
              </p>
            </div>
          </div>

          <div className="border border-orange-100 bg-[#fbf7ef] p-4">
            <div className="relative min-h-[340px] overflow-hidden bg-slate-950">
              {storyVideoUrl ? (
                <iframe
                  src={storyVideoUrl}
                  title="Video câu chuyện thương hiệu Ăn Cùng Bà Tuyết"
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="grid h-full min-h-[340px] place-items-center p-8 text-center">
                  <div>
                    <FileText className="mx-auto h-12 w-12 text-orange-300" />
                    <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-orange-200">
                      Video brand story
                    </p>
                    <p className="mt-3 text-2xl font-black leading-tight text-white">
                      Cần cập nhật link embed
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-4">
          {storyHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="border border-orange-100 bg-[#fbf7ef] p-6 transition hover:-translate-y-1 hover:border-orange-300 hover:bg-white hover:shadow-[0_20px_60px_rgba(234,88,12,0.10)]">
                <div className="flex h-12 w-12 items-center justify-center border border-orange-100 bg-white text-orange-600">
                  <Icon size={22} />
                </div>
                <h3 className="mt-6 text-lg font-black tracking-[-0.03em]">{item.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{item.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-b border-orange-100 bg-[#f7efe3] px-5 py-20 sm:px-8 lg:px-14 xl:px-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <SectionLabel>Thông tin doanh nghiệp</SectionLabel>
            <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-0.055em] sm:text-5xl">
              Thông tin thương hiệu và đơn vị sản xuất
            </h2>
            <p className="mt-6 text-base font-semibold leading-8 text-slate-700">
              Những thông tin cơ bản giúp khách hàng, đối tác và các đơn vị truyền thông có thể kiểm chứng rõ hơn về thương hiệu Ăn Cùng Bà Tuyết.
            </p>
          </div>

          <div className="border border-orange-100 bg-white">
            {businessInfo.map(([label, value]) => {
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
              {timeline.map((item, index) => {
                const isRight = index % 2 === 0;
                return (
                  <article key={item.year} className={`relative grid gap-5 pl-12 lg:grid-cols-2 lg:pl-0 ${isRight ? "" : "lg:[&>*:first-child]:col-start-2"}`}>
                    <div className={`border border-orange-100 bg-[#fbf7ef] p-6 shadow-[12px_12px_0_rgba(234,88,12,0.08)] ${isRight ? "lg:mr-16" : "lg:ml-16"}`}>
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className={`text-4xl font-black tracking-[-0.07em] ${BRAND_ORANGE}`}>{item.year}</p>
                          <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Cột mốc</p>
                        </div>
                        {item.pending ? <PlaceholderValue>Cần xác nhận</PlaceholderValue> : null}
                      </div>
                      <h3 className="mt-6 text-2xl font-black tracking-[-0.045em] text-slate-950">{item.title}</h3>
                      <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{item.desc}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-orange-100 bg-[#f7efe3] px-5 py-20 sm:px-8 lg:px-14 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionLabel>Sứ mệnh & giá trị</SectionLabel>
          <h2 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[-0.055em] sm:text-5xl">
            Sứ mệnh, tầm nhìn và giá trị cốt lõi
          </h2>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {missionCards.map((item) => {
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
              <h3 className="mt-7 text-3xl font-black tracking-[-0.05em]">Con người</h3>
              <p className="mt-5 text-base font-semibold leading-8 text-slate-700">
                Đằng sau mỗi sản phẩm là đội ngũ cùng làm việc từ khâu nghiên cứu, sản xuất, kiểm soát, đóng gói đến phân phối. Ăn Cùng Bà Tuyết coi con người là nền tảng để thương hiệu có thể phát triển ổn định và lâu dài.
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
    </main>
  );
}
