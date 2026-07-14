"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  Factory,
  FileCheck2,
  FileSearch,
  Headphones,
  PackageCheck,
  ShieldCheck,
  Snowflake,
  Truck,
  Wheat,
  X,
} from "lucide-react";
import type { QualityPageConfig } from "@/lib/quality-config";

type ModalContent = {
  eyebrow?: string;
  title: string;
  desc: string;
  image?: string;
  bullets?: string[];
};

const proofPillars = [
  {
    no: "01",
    title: "Nguồn nguyên liệu",
    desc: "Xuất xứ, C/O, kiểm dịch và điều kiện lưu kho phải có hồ sơ đi kèm.",
    href: "#nguon-nguyen-lieu",
    icon: Wheat,
  },
  {
    no: "02",
    title: "Nhà máy & quy trình",
    desc: "NMV Food, Thái Nguyên. Quy trình 6 bước có kiểm soát, không nói quá.",
    href: "#nha-may",
    icon: Factory,
  },
  {
    no: "03",
    title: "Hồ sơ pháp lý",
    desc: "ISO, HACCP, ATTP, phiếu kiểm nghiệm — trình bày rõ ràng để khách hàng dễ kiểm tra.",
    href: "#ho-so-phap-ly",
    icon: FileSearch,
  },
  {
    no: "04",
    title: "Trách nhiệm sản phẩm",
    desc: "PVI là bảo hiểm trách nhiệm sản phẩm, không phải chứng nhận chất lượng.",
    href: "#pvi",
    icon: ShieldCheck,
  },
];

const defaultSourceFacts = [
  {
    icon: Wheat,
    title: "Ba Lan, Hungary",
    desc: "Nguồn nguyên liệu được trình bày theo hồ sơ xuất xứ và kiểm dịch.",
  },
  {
    icon: FileCheck2,
    title: "C/O & kiểm dịch",
    desc: "Thông tin xuất xứ và kiểm dịch là cơ sở để kiểm tra nguồn nguyên liệu.",
  },
  {
    icon: Snowflake,
    title: "Kho lạnh",
    desc: "Lưu kho lạnh theo quy chuẩn vận hành để giữ chất lượng ổn định.",
  },
];

const defaultCertificates = [
  {
    icon: BadgeCheck,
    title: "ISO 22000:2018",
    desc: "Chứng nhận ISO 22000:2018 cấp cho NMV Food trong hệ thống quản lý an toàn thực phẩm.",
    image: "/bento/bento-factory.png",
    bullets: ["Gắn với hệ thống quản lý an toàn thực phẩm.", "Thể hiện năng lực vận hành của nhà máy.", "Là một trong các cơ sở để đối tác đánh giá."],
  },
  {
    icon: ClipboardCheck,
    title: "HACCP",
    desc: "Chương trình đào tạo và kiểm soát theo nguyên tắc HACCP tại NMV Food.",
    image: "/bento/bento-insurance.png",
    bullets: ["Tập trung vào các điểm kiểm soát quan trọng.", "Giúp quy trình sản xuất được vận hành có nguyên tắc.", "Phù hợp với cách trình bày thông tin thận trọng."],
  },
  {
    icon: FileCheck2,
    title: "Giấy phép ATTP",
    desc: "Giấy đủ điều kiện an toàn thực phẩm cho hoạt động sản xuất, kinh doanh liên quan.",
    image: "/bento/bento-ingredients.png",
    bullets: ["Là hồ sơ pháp lý quan trọng trong ngành thực phẩm.", "Giúp người xem hiểu rõ hơn về nền tảng vận hành.", "Được trình bày theo hướng rõ ràng, dễ kiểm tra."],
  },
  {
    icon: FileSearch,
    title: "Phiếu kiểm nghiệm",
    desc: "Kiểm nghiệm định kỳ là cơ sở theo dõi chất lượng sản phẩm theo từng giai đoạn.",
    image: "/bento/bento-tiktok.png",
    bullets: ["Giúp theo dõi chất lượng theo thời gian.", "Là tài liệu hỗ trợ đối tác và khách hàng kiểm tra.", "Được trình bày thận trọng, không thay thế cho mọi lô sản xuất."],
  },
];

const galleryImages = [
  {
    src: "/bento/bento-ingredients.png",
    label: "Nguồn nguyên liệu",
    desc: "Khu vực này dùng để show ảnh container, C/O, kiểm dịch, kho lạnh hoặc ảnh minh họa nguồn nguyên liệu.",
  },
  {
    src: "/bento/bento-factory.png",
    label: "Không gian nhà máy",
    desc: "Ảnh nhà máy, dây chuyền, khu đóng gói và khu kiểm soát chất lượng.",
  },
  {
    src: "/hero/chan-ga-plate.png",
    label: "Sản phẩm thực tế",
    desc: "Ảnh sản phẩm thật để nối bằng chứng sản xuất với trải nghiệm người mua.",
  },
  {
    src: "/bento/bento-insurance.png",
    label: "Hồ sơ & bảo hiểm",
    desc: "Khu vực để show giấy tờ pháp lý, chứng nhận và thông tin PVI.",
  },
  {
    src: "/bento/bento-tiktok.png",
    label: "Đóng gói & phân phối",
    desc: "Ảnh vận hành, đóng gói, kênh bán chính thức và hậu cần.",
  },
];

function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={`inline-flex items-center gap-2 border-l-4 border-orange-600 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] ${dark ? "bg-white/10 text-orange-200" : "bg-orange-50 text-orange-700"}`}>
      {children}
    </p>
  );
}

function EvidenceFrame({ title, desc, tone = "light" }: { title: string; desc: string; tone?: "light" | "dark" }) {
  return (
    <div className={`group relative overflow-hidden border p-5 ${tone === "dark" ? "border-white/15 bg-white/8" : "border-orange-200 bg-white"}`}>
      <div className="absolute right-0 top-0 h-14 w-14 translate-x-7 -translate-y-7 rotate-45 bg-orange-500/20 transition group-hover:bg-orange-500/35" />
      <FileSearch className={`h-8 w-8 ${tone === "dark" ? "text-orange-300" : "text-orange-600"}`} />
      <h3 className={`mt-5 text-lg font-black tracking-[-0.04em] ${tone === "dark" ? "text-white" : "text-slate-950"}`}>{title}</h3>
      <p className={`mt-2 text-sm font-semibold leading-7 ${tone === "dark" ? "text-white/65" : "text-slate-600"}`}>{desc}</p>
    </div>
  );
}

const unsafePublicWords = [
  "admin",
  "cần bổ sung",
  "cáº§n bá»• sung",
  "scan",
  "pdf",
  "file public",
  "popup",
  "lightbox",
  "cấu hình",
  "cáº¥u hÃ¬nh",
  "mặc định",
  "máº·c Ä‘á»‹nh",
  "chưa thay",
  "chÆ°a thay",
  "upload",
];

function cleanPublicText(value: string | undefined, fallback: string) {
  const text = (value || "").trim();
  if (!text) return fallback;
  const lower = text.toLowerCase();
  return unsafePublicWords.some((word) => lower.includes(word.toLowerCase())) ? fallback : text;
}

function cleanPublicList(items: string[] | undefined) {
  return (items || [])
    .map((item) => cleanPublicText(item, ""))
    .filter(Boolean);
}

export default function QualityProofPage({ config }: { config: QualityPageConfig }) {
  const [modal, setModal] = useState<ModalContent | null>(null);
  const heroSubtitle = cleanPublicText(
    config.hero.subtitle,
    "Nguyên liệu, nhà máy, chứng nhận, bảo hiểm và chính sách khách hàng được trình bày rõ ràng để người xem có cơ sở kiểm tra."
  );
  const sourceDescription = cleanPublicText(
    config.source.description,
    "Nguồn nguyên liệu được trình bày theo hướng minh bạch: xuất xứ, điều kiện bảo quản và hồ sơ kiểm tra đi kèm."
  );
  const factoryDescription = cleanPublicText(
    config.factory.description,
    "Nhà máy, quy trình và các điểm kiểm soát được trình bày theo hướng rõ ràng, thận trọng và dễ kiểm chứng."
  );
  const documentsSubtitle = cleanPublicText(
    config.documents.subtitle,
    "Các hồ sơ pháp lý, kiểm nghiệm và chứng nhận được trình bày để khách hàng, đối tác có thêm cơ sở đánh giá."
  );
  const pviDescription = cleanPublicText(
    config.pvi.description,
    "Bảo hiểm trách nhiệm sản phẩm thể hiện cam kết đồng hành và bảo vệ quyền lợi người tiêu dùng theo phạm vi hợp đồng."
  );
  const sourceFacts = config.source.facts.map((item, index) => ({
    icon: defaultSourceFacts[index]?.icon ?? FileCheck2,
    title: item.title,
    desc: cleanPublicText(item.description, defaultSourceFacts[index]?.desc || "Thông tin được trình bày rõ ràng để người xem có cơ sở kiểm tra."),
  }));
  const certificates = config.documents.items.map((item, index) => ({
    ...(defaultCertificates[index] ?? defaultCertificates[0]),
    title: item.title,
    desc: cleanPublicText(item.description, defaultCertificates[index]?.desc || "Hồ sơ được trình bày để khách hàng và đối tác có thêm cơ sở đánh giá."),
    image: item.imageUrl || defaultCertificates[index]?.image,
  }));
  const visiblePolicyItems = config.policy.items.map((item) => [
    item.title,
    cleanPublicText(item.description, "Thông tin chính sách được trình bày rõ ràng để khách hàng dễ theo dõi."),
  ] as [string, string]);
  const faqItems = config.faq.items.map((item) => ({
    ...item,
    description: cleanPublicText(item.description, "Thông tin được trình bày theo hướng rõ ràng, thận trọng và dễ kiểm tra."),
  }));
  const heroImage = config.hero.imageUrl;
  const sourceImage = config.source.imageUrl;
  const factoryImage = config.factory.imageUrl;
  const gallery = [
    { ...galleryImages[0], src: sourceImage },
    { ...galleryImages[1], src: factoryImage },
    ...config.factory.gallery.slice(0, 3).map((item) => ({
      src: item.imageUrl || "/bento/bento-tiktok.png",
      label: item.title,
      desc: item.description,
    })),
  ];

  return (
    <main className="min-h-screen bg-[#fff8ed] text-slate-950">
      <section className="relative overflow-hidden border-b border-orange-100 bg-[#fff3df] px-5 py-20 sm:px-8 lg:px-16">
        <div className="absolute inset-0 bg-[linear-gradient(112deg,#fff3df_0%,#fff3df_50%,#ffffff_50%,#ffffff_100%)]" />
        <div className="absolute -right-32 top-16 h-[460px] w-[460px] rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute left-0 top-0 h-full w-2 bg-orange-600" />

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <Eyebrow>{config.hero.eyebrow}</Eyebrow>
            <h1 className="mt-7 max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.075em] sm:text-6xl lg:text-7xl">
              {config.hero.title}
            </h1>
            <p className="mt-7 max-w-3xl text-base font-semibold leading-8 text-slate-700 sm:text-lg">
              {heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={config.hero.ctaLink} className="inline-flex items-center gap-2 bg-orange-600 px-6 py-4 text-xs font-black uppercase tracking-wider text-white transition hover:bg-slate-950">
                {config.hero.ctaText} <ArrowRight size={15} />
              </Link>
              <Link href={config.hero.secondaryCtaLink} className="inline-flex items-center gap-2 border border-slate-950 bg-white px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-950 transition hover:bg-slate-950 hover:text-white">
                {config.hero.secondaryCtaText} <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                setModal({
                  eyebrow: "Ảnh minh họa",
                  title: "Nhà máy, hồ sơ và quy trình phải nhìn thấy được",
                  desc: "Hình ảnh giúp người xem nhìn rõ hơn về nhà máy, hồ sơ và quy trình vận hành.",
                  image: heroImage,
                  bullets: ["Ưu tiên ảnh NMV Food.", "Không dùng ảnh nền tối quá lâu dài.", "Ảnh cần tự co theo khung, không méo."],
                })
              }
              className="group border border-orange-200 bg-white p-4 text-left shadow-[16px_16px_0_rgba(234,88,12,0.12)] sm:col-span-2"
            >
              <div className="relative min-h-[300px] overflow-hidden bg-slate-950">
                <img src={heroImage} alt="Nhà máy sản xuất" className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/40 to-orange-500/30" />
                <div className="absolute bottom-0 left-0 max-w-lg p-7 text-white">
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-orange-200">NMV Food · Thái Nguyên</p>
                  <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">Nhà máy, hồ sơ và quy trình phải nhìn thấy được</h2>
                </div>
                <span className="absolute right-4 top-4 bg-white px-4 py-2 text-xs font-black uppercase text-orange-700">Bấm xem</span>
              </div>
            </button>
            <EvidenceFrame title="Hồ sơ nhập khẩu" desc="Thông tin xuất xứ và kiểm dịch là cơ sở kiểm tra nguồn nguyên liệu." />
            <EvidenceFrame title="Phiếu kiểm nghiệm" desc="Kiểm nghiệm định kỳ giúp theo dõi chất lượng theo từng giai đoạn." />
          </div>
        </div>
      </section>

      <section className="grid border-b border-orange-100 bg-white lg:grid-cols-4">
        {proofPillars.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.title} href={item.href} className="group border-b border-orange-100 p-7 transition hover:bg-orange-50 lg:border-b-0 lg:border-r">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-orange-600">{item.no}</span>
                <Icon className="h-6 w-6 text-orange-600 transition group-hover:scale-110" />
              </div>
              <h2 className="mt-5 text-xl font-black tracking-[-0.04em]">{item.title}</h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{item.desc}</p>
            </Link>
          );
        })}
      </section>

      <section className="sticky top-0 z-30 hidden border-b border-orange-100 bg-white/90 px-5 py-3 backdrop-blur lg:block">
        <nav className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          {[
            ["Nguồn nguyên liệu", "#nguon-nguyen-lieu"],
            ["Nhà máy", "#nha-may"],
            ["Hồ sơ", "#ho-so-phap-ly"],
            ["PVI", "#pvi"],
            ["Chính sách", "#chinh-sach"],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="border border-transparent px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700">
              {label}
            </Link>
          ))}
        </nav>
      </section>

      <section className="border-b border-orange-100 bg-slate-950 px-5 py-16 text-white sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-300">Một trang — đủ bằng chứng</p>
              <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.055em] sm:text-5xl">
                Không tách nhỏ nữa. Tất cả hồ sơ chất lượng nằm trên cùng một hành trình.
              </h2>
            </div>
            <p className="text-base font-semibold leading-8 text-white/68">
              Người xem kéo một lần là thấy nguồn nguyên liệu, nhà máy, chứng nhận, PVI và chính sách khách hàng.
              Hình ảnh và hồ sơ được gom theo từng cụm để người xem dễ đọc, dễ kiểm tra và không bị khô như bảng giấy tờ.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-5">
            {gallery.map((item, index) => (
              <button
                key={item.label}
                type="button"
                onClick={() =>
                  setModal({
                    eyebrow: "Thư viện bằng chứng",
                    title: item.label,
                    desc: item.desc,
                    image: item.src,
                    bullets: ["Hình ảnh được tự co theo khung.", "Ưu tiên hình ảnh rõ nguồn gốc.", "Tránh dùng ảnh minh họa chung chung khi có ảnh thật."],
                  })
                }
                className={`group relative overflow-hidden border border-white/15 bg-white/5 text-left ${index === 1 ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <div className={index === 1 ? "aspect-[4/3] h-full" : "aspect-[4/5]"}>
                  <img src={item.src} alt={item.label} className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
                <p className="absolute bottom-4 left-4 right-4 text-sm font-black uppercase tracking-[0.14em] text-white">{item.label}</p>
                <span className="absolute right-3 top-3 bg-orange-600 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-white opacity-0 transition group-hover:opacity-100">Xem lớn</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="nguon-nguyen-lieu" className="border-b border-orange-100 bg-[#fffaf3] px-5 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <div>
            <Eyebrow>01 · Minh bạch nguồn nguyên liệu</Eyebrow>
            <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-0.055em] sm:text-6xl">
              {config.source.title}
            </h2>
            <p className="mt-6 text-base font-semibold leading-8 text-slate-700">
              {sourceDescription}
            </p>
          </div>

          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              {sourceFacts.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    type="button"
                    key={item.title}
                    onClick={() =>
                      setModal({
                        eyebrow: "Nguồn nguyên liệu",
                        title: item.title,
                        desc: item.desc,
                        image: sourceImage,
                        bullets: ["Thông tin nên đi cùng hồ sơ xuất xứ tương ứng.", "Ưu tiên dữ liệu rõ nguồn gốc.", "Không dùng các tuyên bố tuyệt đối khi chưa có cơ sở kiểm tra."],
                      })
                    }
                    className="border border-orange-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(234,88,12,0.12)]"
                  >
                    <Icon className="h-8 w-8 text-orange-600" />
                    <h3 className="mt-5 text-lg font-black tracking-[-0.04em]">{item.title}</h3>
                    <p className="mt-2 text-sm font-semibold leading-7 text-slate-600">{item.desc}</p>
                  </button>
                );
              })}
            </div>
            <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
              <button
                type="button"
                onClick={() =>
                  setModal({
                    eyebrow: "Ảnh nguồn nguyên liệu",
                    title: "Container, kho lạnh, C/O",
                    desc: "Khu vực này nên thay bằng ảnh thật: container nhập khẩu, giấy C/O, phiếu kiểm dịch hoặc kho lạnh.",
                    image: sourceImage,
                    bullets: ["Nên dùng hình ảnh thật về nguồn nguyên liệu và kho lạnh.", "Các thông tin nhạy cảm cần được xử lý phù hợp trước khi công bố.", "Hình ảnh tự co theo khung để không bị méo."],
                  })
                }
                className="relative min-h-[260px] overflow-hidden border border-orange-200 bg-white text-left"
              >
                <img src={sourceImage} alt="Nguyên liệu" className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                <p className="absolute bottom-5 left-5 max-w-sm text-lg font-black text-white">Nguồn nguyên liệu, kho lạnh và hồ sơ xuất xứ cần được trình bày rõ ràng.</p>
              </button>
              <EvidenceFrame title="Video truy xuất" desc="Embed video truy xuất nguồn nguyên liệu từ Ba Lan khi xác nhận link." />
            </div>
          </div>
        </div>
      </section>

      <section id="nha-may" className="border-b border-orange-100 bg-white px-5 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <Eyebrow>02 · Nhà máy & quy trình</Eyebrow>
              <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-0.055em] sm:text-6xl">
                {config.factory.title}
              </h2>
            </div>
            <p className="text-base font-semibold leading-8 text-slate-700">
              {factoryDescription}
            </p>
          </div>

          <div className="mt-10 grid border border-orange-200 md:grid-cols-3">
            {[
              ["3.300m²", "Diện tích nhà máy"],
              ["ISO 22000:2018", "NMV Food"],
              ["HACCP", "Chương trình đào tạo"],
            ].map(([value, label]) => (
              <div key={label} className="border-b border-orange-100 bg-[#fffaf3] p-7 md:border-b-0 md:border-r">
                <p className="text-3xl font-black text-orange-600">{value}</p>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="grid grid-cols-2 gap-3">
              {[factoryImage, "/bento/bento-tiktok.png", "/hero/chan-ga-plate.png", "/bento/bento-insurance.png"].map((src, idx) => (
                <button
                  type="button"
                  key={src}
                  onClick={() =>
                    setModal({
                      eyebrow: "Gallery nhà máy",
                      title: `Ảnh nhà máy #${idx + 1}`,
                      desc: "Hình ảnh nhà máy giúp người xem hiểu rõ hơn về không gian sản xuất, kho, QC và đóng gói.",
                      image: src,
                      bullets: ["Ảnh được crop bằng object-cover.", "Nên dùng ảnh dây chuyền, kho, QC, đóng gói.", "Ưu tiên ảnh NMV Food."],
                    })
                  }
                  className="relative min-h-[190px] overflow-hidden border border-orange-200 bg-orange-50"
                >
                  <img src={src} alt={`Nhà máy ${idx + 1}`} className="absolute inset-0 h-full w-full object-cover transition duration-500 hover:scale-105" />
                </button>
              ))}
            </div>

            <div>
              <h3 className="text-2xl font-black tracking-[-0.04em]">Quy trình 6 bước có kiểm soát</h3>
              <div className="mt-6">
                {config.factory.steps.map((step, index) => (
                  <div key={step.id} className="grid grid-cols-[70px_1fr] border-x border-t border-orange-200 last:border-b">
                    <div className="flex items-center justify-center bg-slate-950 text-sm font-black text-white">{String(index + 1).padStart(2, "0")}</div>
                    <div className="bg-white p-5">
                      <p className="text-xl font-black tracking-[-0.04em]">{step.title}</p>
                      <p className="mt-1 text-sm font-semibold leading-7 text-slate-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ho-so-phap-ly" className="border-b border-orange-100 bg-[#fffaf3] px-5 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <Eyebrow>03 · Hồ sơ pháp lý & chứng nhận</Eyebrow>
          <div className="mt-6 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <h2 className="text-4xl font-black leading-tight tracking-[-0.055em] sm:text-6xl">
              {config.documents.title}
            </h2>
            <p className="text-base font-semibold leading-8 text-slate-700">
              {documentsSubtitle}
            </p>
          </div>
          <div className="mt-10 grid gap-0 md:grid-cols-2 xl:grid-cols-4">
            {certificates.map((cert) => {
              const Icon = cert.icon;
              return (
                <article key={cert.title} className="group relative border border-orange-200 bg-white p-7 transition hover:z-20 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(234,88,12,0.12)]">
                  {cert.image ? (
                    <div className="pointer-events-none absolute left-1/2 top-3 z-30 hidden w-80 -translate-x-1/2 -translate-y-full border border-orange-200 bg-white p-3 opacity-0 shadow-[0_24px_80px_rgba(15,23,42,0.22)] transition duration-200 group-hover:opacity-100 lg:block">
                      <div className="aspect-[4/3] overflow-hidden bg-orange-50">
                        <img src={cert.image} alt={cert.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="absolute bottom-[-9px] left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-orange-200 bg-white" />
                    </div>
                  ) : null}
                  <Icon className="h-9 w-9 text-orange-600" />
                  <h3 className="mt-6 text-xl font-black tracking-[-0.04em]">{cert.title}</h3>
                  <p className="mt-3 min-h-[110px] text-sm font-semibold leading-7 text-slate-600">{cert.desc}</p>
                  <button
                    type="button"
                    onClick={() =>
                      setModal({
                        eyebrow: "Hồ sơ pháp lý",
                        title: cert.title,
                        desc: cert.desc,
                        image: cert.image,
                        bullets: cert.bullets,
                      })
                    }
                    className="mt-5 inline-flex items-center gap-2 border border-orange-200 px-4 py-3 text-xs font-black uppercase tracking-wider text-orange-700 transition hover:bg-orange-600 hover:text-white"
                  >
                    Xem chi tiết <ArrowRight size={14} />
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pvi" className="grid border-b border-orange-100 bg-slate-950 text-white lg:grid-cols-[0.95fr_1.05fr]">
        <div className="px-5 py-20 sm:px-8 lg:px-16">
          <Eyebrow dark>04 · Bảo hiểm trách nhiệm sản phẩm</Eyebrow>
          <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-0.055em] sm:text-6xl">
            {config.pvi.title}
          </h2>
          <p className="mt-6 text-base font-semibold leading-8 text-white/72">
            {pviDescription}
          </p>
          <button
            type="button"
            onClick={() =>
              setModal({
                eyebrow: "PVI",
                title: "Bảo hiểm trách nhiệm sản phẩm",
                desc: "Đây là cam kết trách nhiệm theo phạm vi hợp đồng, không phải chứng nhận chất lượng sản phẩm.",
                image: config.pvi.imageUrl,
                bullets: ["Thể hiện trách nhiệm của thương hiệu với người tiêu dùng.", "Không sử dụng như chứng nhận chất lượng sản phẩm.", "Thông tin chi tiết áp dụng theo phạm vi hợp đồng bảo hiểm."],
              })
            }
            className="mt-8 inline-flex items-center gap-2 bg-orange-600 px-6 py-4 text-xs font-black uppercase tracking-wider text-white transition hover:bg-white hover:text-slate-950"
          >
            Mở ghi chú PVI <ArrowRight size={15} />
          </button>
        </div>
        <div className="border-t border-white/10 p-5 lg:border-l lg:border-t-0 lg:p-10">
          <div className="group relative min-h-[360px] overflow-hidden border border-white/15 bg-white/5">
            {config.pvi.imageUrl ? (
              <img src={config.pvi.imageUrl} alt="Bảo hiểm trách nhiệm sản phẩm PVI" className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105" />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <ShieldCheck className="h-12 w-12 text-orange-400" />
              <p className="mt-4 text-5xl font-black tracking-[-0.08em] text-white">PVI</p>
              <p className="mt-3 max-w-md text-sm font-bold leading-7 text-white/70">
                Bảo hiểm trách nhiệm sản phẩm thể hiện cam kết đồng hành và bảo vệ quyền lợi người tiêu dùng theo phạm vi hợp đồng.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="chinh-sach" className="border-b border-orange-100 bg-white px-5 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <Eyebrow>05 · Quyền lợi khách hàng</Eyebrow>
          <h2 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[-0.055em] sm:text-6xl">
            {config.policy.title}
          </h2>
          <div className="mt-10 grid gap-3 lg:grid-cols-5">
            {visiblePolicyItems.map(([title, desc], index) => (
              <details key={title} className="group border border-orange-200 bg-[#fffaf3] p-5 open:bg-white">
                <summary className="cursor-pointer list-none">
                  <span className="block text-xs font-black text-orange-600">{String(index + 1).padStart(2, "0")}</span>
                  <span className="mt-3 block text-lg font-black tracking-[-0.03em]">{title}</span>
                </summary>
                <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">{desc}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-orange-100 bg-[#fffaf3] px-5 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>FAQ nhanh</Eyebrow>
            <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-0.055em] sm:text-5xl">
              {config.faq.title}
            </h2>
          </div>
          <div className="space-y-3">
            {faqItems.map((item) => (
              <details key={item.id} className="group border border-orange-200 bg-white p-6">
                <summary className="cursor-pointer list-none text-xl font-black tracking-[-0.04em] text-slate-950">
                  {item.title}
                </summary>
                <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">{item.description}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-orange-600 px-5 py-14 text-white sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-100">Bước tiếp theo</p>
            <h2 className="mt-4 max-w-4xl text-3xl font-black tracking-[-0.045em] sm:text-5xl">
              Có hồ sơ rồi, hãy xem sản phẩm và nơi mua chính thức.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/san-pham" className="inline-flex items-center gap-2 bg-white px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-950 hover:bg-slate-950 hover:text-white">
              <PackageCheck size={16} /> Xem sản phẩm
            </Link>
            <Link href="/diem-ban" className="inline-flex items-center gap-2 border border-white/40 px-6 py-4 text-xs font-black uppercase tracking-wider text-white hover:bg-white hover:text-slate-950">
              <Truck size={16} /> Tìm điểm bán
            </Link>
            <Link href="/lien-he" className="inline-flex items-center gap-2 border border-white/40 px-6 py-4 text-xs font-black uppercase tracking-wider text-white hover:bg-white hover:text-slate-950">
              <Headphones size={16} /> Liên hệ hỗ trợ
            </Link>
          </div>
        </div>
      </section>

      {modal ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <button type="button" aria-label="Đóng" onClick={() => setModal(null)} className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm" />
          <article className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto border border-orange-200 bg-[#fffaf3] shadow-[0_30px_100px_rgba(15,23,42,0.35)]">
            <button
              type="button"
              onClick={() => setModal(null)}
              className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center bg-slate-950 text-white transition hover:bg-orange-600"
              aria-label="Đóng"
            >
              <X size={20} />
            </button>
            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[360px] bg-slate-950">
                {modal.image ? (
                  <img src={modal.image} alt={modal.title} className="absolute inset-0 h-full w-full object-cover" />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <p className="absolute bottom-5 left-5 right-16 text-sm font-black uppercase tracking-[0.18em] text-white">{modal.eyebrow ?? "Chi tiết"}</p>
              </div>
              <div className="p-8 lg:p-10">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-700">{modal.eyebrow ?? "Chi tiết hồ sơ"}</p>
                <h3 className="mt-4 text-4xl font-black leading-tight tracking-[-0.055em] text-slate-950">{modal.title}</h3>
                <p className="mt-5 text-base font-semibold leading-8 text-slate-700">
                  {cleanPublicText(modal.desc, "Thông tin được trình bày rõ ràng để người xem có cơ sở kiểm tra.")}
                </p>
                {cleanPublicList(modal.bullets).length ? (
                  <ul className="mt-7 space-y-3">
                    {cleanPublicList(modal.bullets).map((item) => (
                      <li key={item} className="flex gap-3 border border-orange-200 bg-white p-4 text-sm font-bold leading-6 text-slate-700">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </article>
        </div>
      ) : null}
    </main>
  );
}
