"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ClipboardCheck,
  FileCheck2,
  FileSearch,
  Factory,
  Headphones,
  PackageCheck,
  SearchCheck,
  ShieldCheck,
  Snowflake,
  Truck,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { QualityPageConfig, QualitySimpleItem } from "@/lib/quality-config";

type EvidenceDocument = {
  id: string;
  title: string;
  entity: string;
  date: string;
  scope: string;
  description: string;
  imageUrl?: string;
  note?: string;
};

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

function repairText(value: string) {
  if (!/[ÃÄÆ]|áº|á»|â€|�/.test(value)) return value;
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

function text(value: string | undefined, fallback: string) {
  const fixed = repairText(value || "").trim();
  return fixed || fallback;
}

const bannedPublicPhrases = [
  "bảo chứng",
  "an toàn tuyệt đối",
  "vô trùng",
  "sạch 100%",
  "chất lượng số một",
  "tốt nhất thị trường",
  "PVI xác nhận chất lượng",
  "PVI bảo chứng",
];

function safeText(value: string | undefined, fallback: string) {
  const fixed = text(value, fallback);
  const lower = fixed.toLowerCase();
  return bannedPublicPhrases.some((phrase) => lower.includes(phrase.toLowerCase())) ? fallback : fixed;
}

function qualityImage(value: string | undefined, fallback: string) {
  return value && value.trim() ? value : fallback;
}

function Placeholder({ children = "[CẦN BỔ SUNG]" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex w-fit border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-orange-700">
      {children}
    </span>
  );
}

function ImageBox({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover ${className}`} />;
}

const sourceFacts = [
  {
    icon: FileSearch,
    title: "Nhập khẩu từ châu Âu theo hồ sơ từng lô",
    desc: "Nguồn nguyên liệu được thể hiện theo hồ sơ từng lô, bao gồm Ba Lan, Hungary và các quốc gia liên quan khi có tài liệu đối chiếu.",
  },
  {
    icon: FileCheck2,
    title: "Có hồ sơ xuất xứ và kiểm dịch",
    desc: "Chứng nhận xuất xứ, phiếu kiểm dịch và hồ sơ nhập khẩu được lưu trữ để phục vụ việc truy xuất.",
  },
  {
    icon: Snowflake,
    title: "Bảo quản trong hệ thống kho lạnh",
    desc: "Nguyên liệu được lưu trữ trong điều kiện nhiệt độ phù hợp theo quy trình của đơn vị sản xuất.",
  },
  {
    icon: SearchCheck,
    title: "Truy xuất theo lô",
    desc: "Thông tin nguồn nguyên liệu cần được đối chiếu với từng lô hàng và hồ sơ tương ứng.",
  },
];

const factoryStats = [
  ["3.300 m²", "Quy mô nhà máy"],
  ["ISO 22000:2018", "Chứng nhận được cấp cho NMV Food"],
  ["HACCP", "Chương trình đào tạo hoặc hồ sơ HACCP của NMV Food"],
];

const processSteps = [
  ["Tiếp nhận nguyên liệu", "Nguyên liệu được tiếp nhận cùng các thông tin và hồ sơ liên quan đến lô hàng. Tình trạng bao bì, điều kiện bảo quản và các tiêu chí đầu vào được kiểm tra theo quy trình của đơn vị sản xuất."],
  ["Sơ chế", "Nguyên liệu được đưa vào khu vực sơ chế và xử lý theo quy trình sản xuất tương ứng với từng sản phẩm. Các công đoạn cần được thực hiện trong khu vực và bằng thiết bị phù hợp."],
  ["Chế biến", "Nguyên liệu được chế biến theo công thức và thông số kỹ thuật đã được thiết lập cho từng dòng sản phẩm. Thời gian, nhiệt độ và các yếu tố liên quan được theo dõi trong quá trình thực hiện."],
  ["Kiểm soát chất lượng", "Sản phẩm được kiểm tra tại các điểm kiểm soát trong quá trình sản xuất. Những tiêu chí cụ thể chỉ được công bố khi có quy trình hoặc tài liệu nội bộ được phép công khai."],
  ["Đóng gói và ghi nhãn", "Sản phẩm được đóng gói, ghi nhãn và thể hiện các thông tin cần thiết như thành phần, ngày sản xuất, hạn sử dụng, hướng dẫn bảo quản và thông tin đơn vị chịu trách nhiệm."],
  ["Lưu kho và phân phối", "Sản phẩm hoàn thiện được lưu kho theo điều kiện phù hợp trước khi đưa đến các kênh phân phối và giao đến người tiêu dùng."],
];

const defaultDocuments: EvidenceDocument[] = [
  {
    id: "iso-22000",
    title: "ISO 22000:2018",
    entity: "Cấp cho NMV Food",
    date: "[CẦN BỔ SUNG]",
    scope: "Hệ thống quản lý an toàn thực phẩm theo phạm vi ghi trên chứng nhận.",
    description: "Chỉ hiển thị thông tin ISO khi có scan chứng nhận và phạm vi áp dụng rõ ràng.",
    note: "Không ghi chứng nhận này là cấp trực tiếp cho ACBT nếu hồ sơ đứng tên NMV Food.",
  },
  {
    id: "haccp",
    title: "HACCP",
    entity: "NMV Food",
    date: "[CẦN BỔ SUNG]",
    scope: "Loại hồ sơ HACCP cần xác nhận: chứng nhận, chương trình đào tạo hoặc hồ sơ nội bộ.",
    description: "Nếu hiện tại chỉ có chương trình đào tạo HACCP, cần ghi rõ bản chất tài liệu.",
    note: "Không rút gọn thành “NMV Food đạt HACCP” nếu giấy tờ hiện có không chứng minh điều đó.",
  },
  {
    id: "attp",
    title: "Giấy đủ điều kiện ATTP",
    entity: "Pháp nhân đứng tên: [CẦN XÁC NHẬN]",
    date: "[CẦN BỔ SUNG]",
    scope: "Phạm vi hoạt động và địa điểm áp dụng theo nội dung giấy phép.",
    description: "Cần bổ sung ảnh/PDF giấy phép được phép công khai.",
  },
  {
    id: "vntest",
    title: "Phiếu kiểm nghiệm",
    entity: "Đơn vị kiểm nghiệm: [CẦN XÁC NHẬN]",
    date: "[CẦN BỔ SUNG PHIẾU MỚI NHẤT]",
    scope: "Kết quả kiểm nghiệm gắn với đúng mẫu, sản phẩm và thời điểm kiểm nghiệm.",
    description: "Không dùng một phiếu kiểm nghiệm để suy diễn cho mọi sản phẩm hoặc mọi lô hàng.",
  },
];

const policyItems = [
  ["Quyền được cung cấp thông tin", "Khách hàng có quyền được tiếp cận các thông tin cơ bản của sản phẩm như tên sản phẩm, thành phần, khối lượng, ngày sản xuất, hạn sử dụng, hướng dẫn bảo quản và thông tin của đơn vị chịu trách nhiệm."],
  ["Quyền yêu cầu đổi trả", "Khách hàng có thể gửi yêu cầu hỗ trợ khi sản phẩm có dấu hiệu lỗi, hư hỏng, sai sản phẩm hoặc không đúng với thông tin đặt hàng. Điều kiện, thời hạn và hồ sơ đổi trả cần đối chiếu theo chính sách chính thức."],
  ["Quyền khiếu nại", "Khách hàng có thể gửi phản ánh hoặc khiếu nại qua các kênh tiếp nhận chính thức. Mỗi yêu cầu cần được ghi nhận, phân loại và phản hồi theo thời gian xử lý đã công bố."],
  ["Bảo hiểm trách nhiệm sản phẩm", "Một số sản phẩm hoặc phạm vi hoạt động có thể thuộc hợp đồng bảo hiểm trách nhiệm sản phẩm với PVI. Quyền lợi bảo hiểm được xem xét theo pháp nhân, sản phẩm, thời hạn và điều kiện cụ thể của hợp đồng."],
  ["Kênh hỗ trợ khách hàng", "Hotline, email, fanpage, thời gian làm việc và địa chỉ tiếp nhận văn bản cần được bổ sung sau khi doanh nghiệp xác nhận thông tin chính thức."],
];

export default function QualityProofPage({ config }: { config: QualityPageConfig }) {
  const [activeDoc, setActiveDoc] = useState<EvidenceDocument | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (!activeDoc) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveDoc(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeDoc]);

  const heroImage = qualityImage(config.hero.imageUrl, "/bento/bento-factory.png");
  const sourceImage = qualityImage(config.source.imageUrl, "/bento/bento-ingredients.png");
  const factoryImage = qualityImage(config.factory.imageUrl, "/bento/bento-factory.png");
  const pviImage = qualityImage(config.pvi.imageUrl, "/bento/bento-insurance.png");
  const heroTitle = safeText(config.hero.title, "Chất lượng kiểm chứng được");
  const heroSubtitle = safeText(
    config.hero.subtitle,
    "Nguyên liệu, nhà máy, chứng nhận, kiểm nghiệm và bảo hiểm trách nhiệm sản phẩm — các thông tin quan trọng đều cần được thể hiện bằng hồ sơ có thể kiểm chứng.",
  );
  const heroCtaText = safeText(config.hero.ctaText, "Xem hồ sơ pháp lý");
  const heroCtaLink = text(config.hero.ctaLink, "#ho-so-phap-ly");
  const heroSecondaryCtaText = safeText(config.hero.secondaryCtaText, "Xem sản phẩm");
  const heroSecondaryCtaLink = text(config.hero.secondaryCtaLink, "/san-pham");
  const sourceTitle = safeText(config.source.title, "Nguyên liệu nhập khẩu từ châu Âu — có hồ sơ truy xuất");
  const sourceDescription = safeText(
    config.source.description,
    "Nguyên liệu chính được sử dụng cho một số sản phẩm chân gà của Ăn Cùng Bà Tuyết được nhập khẩu từ Ba Lan, Hungary và các quốc gia châu Âu khác theo từng lô hàng thực tế. Hồ sơ liên quan có thể bao gồm chứng nhận xuất xứ, hồ sơ nhập khẩu, phiếu kiểm dịch và các tài liệu truy xuất đi kèm.",
  );
  const displayedSourceFacts = sourceFacts.map((item, index) => {
    const configured = config.source.facts[index];
    return {
      ...item,
      title: safeText(configured?.title, item.title),
      desc: safeText(configured?.description, item.desc),
    };
  });
  const factoryTitle = safeText(config.factory.title, "Nhà máy sản xuất NMV Food — Thái Nguyên");
  const factoryDescription = safeText(
    config.factory.description,
    "Các sản phẩm của Ăn Cùng Bà Tuyết được tổ chức sản xuất tại nhà máy của NMV Food ở Thái Nguyên. Nhà máy có quy mô khoảng 3.300 m² và được bố trí các khu vực phục vụ việc tiếp nhận nguyên liệu, sơ chế, chế biến, kiểm soát, đóng gói và lưu kho.",
  );
  const displayedProcessSteps = processSteps.map(([title, description], index) => {
    const configured = config.factory.steps[index];
    return [
      safeText(configured?.title, title),
      safeText(configured?.description, description),
    ] as const;
  });
  const documentsTitle = safeText(config.documents.title, "Hồ sơ pháp lý & chứng nhận");
  const pviTitle = safeText(config.pvi.title, "Bảo hiểm trách nhiệm sản phẩm — PVI");
  const pviDescription = safeText(
    config.pvi.description,
    "Ăn Cùng Bà Tuyết mua bảo hiểm trách nhiệm sản phẩm từ PVI. Nếu sản phẩm gây thiệt hại cho người tiêu dùng theo phạm vi hợp đồng, đơn vị bảo hiểm tham gia trách nhiệm bồi thường. Không trình bày như PVI xác nhận chất lượng sản phẩm.",
  );
  const policyTitle = safeText(config.policy.title, "Chính sách bảo vệ quyền lợi khách hàng");
  const displayedPolicyItems = policyItems.map(([title, description], index) => {
    const configured = config.policy.items[index];
    return [
      safeText(configured?.title, title),
      safeText(configured?.description, description),
    ] as const;
  });
  const gallery = useMemo(() => {
    const configured = config.factory.gallery.filter((item) => item.imageUrl);
    const fallback: QualitySimpleItem[] = [
      { id: "gallery-1", title: "Khu vực tiếp nhận nguyên liệu", description: "[CẦN BỔ SUNG ẢNH ĐÃ XÁC NHẬN]", imageUrl: sourceImage },
      { id: "gallery-2", title: "Không gian nhà máy", description: "Ảnh minh họa khu vực sản xuất đang dùng tạm.", imageUrl: factoryImage },
      { id: "gallery-3", title: "Khu vực đóng gói", description: "[CẦN BỔ SUNG ẢNH NMV FOOD]", imageUrl: "/bento/bento-tiktok.png" },
      { id: "gallery-4", title: "Hồ sơ liên quan", description: "[CẦN BỔ SUNG ẢNH/PDF ĐƯỢC PHÉP CÔNG KHAI]", imageUrl: "/bento/bento-insurance.png" },
    ];
    return (configured.length ? configured : fallback).slice(0, 6);
  }, [config.factory.gallery, factoryImage, sourceImage]);
  const documents = defaultDocuments.map((item, index) => {
    const configured = config.documents.items[index];
    return {
      ...item,
      title: safeText(configured?.title, item.title),
      description: safeText(configured?.description, item.description),
      imageUrl: configured?.imageUrl || item.imageUrl,
    };
  });

  return (
    <main className="min-h-screen overflow-x-clip bg-[#FAF7F2] font-sans text-slate-950 selection:bg-orange-500 selection:text-white">
      <section className="relative overflow-hidden border-b border-slate-200 bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(112deg,#ffffff_0%,#ffffff_52%,#fffaf2_52%,#fffaf2_100%)]" />
        <div className="absolute -right-28 top-10 h-96 w-96 rounded-full bg-orange-400/15 blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-12"
        >
          <div className="order-2 lg:order-1">
            <h1 className="max-w-5xl text-[1.85rem] font-black leading-[1.08] tracking-[-0.045em] sm:text-4xl lg:text-5xl">
              {heroTitle}
            </h1>
            <p className="mt-5 max-w-3xl text-[0.9375rem] font-semibold leading-7 text-slate-700 sm:mt-7 sm:text-lg sm:leading-8">
              {heroSubtitle}
            </p>
            <div className="mt-7 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
              <Link href={heroCtaLink} className="inline-flex items-center justify-center gap-3 bg-orange-600 px-6 py-4 text-xs font-black uppercase tracking-wider text-white transition hover:bg-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">
                {heroCtaText} <ArrowRight size={16} />
              </Link>
              <Link href={heroSecondaryCtaLink} className="inline-flex items-center justify-center gap-3 border border-slate-200 bg-white px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-950 transition hover:border-orange-400 hover:text-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">
                {heroSecondaryCtaText} <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="order-1 border border-slate-200 bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-4 lg:order-2">
            <div className="relative h-[280px] overflow-hidden bg-orange-50 sm:h-[420px]">
              <ImageBox src={heroImage} alt="Hình ảnh nhà máy hoặc hồ sơ kiểm chứng của Ăn Cùng Bà Tuyết" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/85 to-transparent p-6 text-white">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-200">Nguyên tắc trình bày</p>
                <p className="mt-2 text-2xl font-black leading-tight">Bên thứ ba và hồ sơ pháp lý nói thay cho thương hiệu.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="nguon-nguyen-lieu" className="scroll-mt-28 border-b border-slate-200 bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, x: -28, scale: 0.99 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65 }}
          className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10"
        >
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              {sourceTitle}
            </h2>
            <p className="mt-6 text-base font-semibold leading-8 text-slate-700">
              {sourceDescription}
            </p>
            <p className="mt-4 text-base font-semibold leading-8 text-slate-700">
              Các thông tin được công khai trên trang cần đối chiếu với hồ sơ của từng lô nguyên liệu. Không sử dụng tuyên bố chung cho toàn bộ sản phẩm nếu tài liệu hiện có chỉ áp dụng cho một số sản phẩm hoặc một số thời điểm nhất định.
            </p>
            <div className="mt-7 border border-l-4 border-slate-200 border-l-orange-600 bg-[#FAF7F2] p-4 sm:p-5">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-orange-700">Cách kiểm chứng nguồn gốc</p>
              <p className="mt-3 text-sm font-semibold leading-7 text-slate-700">
                Mỗi thông tin về xuất xứ cần được đối chiếu với hồ sơ của từng lô hàng: chứng nhận xuất xứ, phiếu kiểm dịch, hồ sơ nhập khẩu và điều kiện lưu kho tương ứng.
              </p>
            </div>
          </div>

          <div className="order-1 grid gap-4 lg:order-2">
            <div className="relative min-h-[280px] overflow-hidden border border-slate-200 bg-slate-950 sm:min-h-[360px]">
              <ImageBox src={sourceImage} alt="Hồ sơ hoặc hình ảnh minh họa nguồn nguyên liệu" className="opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-200">Video truy xuất nguồn nguyên liệu</p>
                <p className="mt-2 text-2xl font-black leading-tight">[CẦN CẬP NHẬT LINK EMBED]</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {displayedSourceFacts.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.article
                    key={item.title}
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: index * 0.07 }}
                    className="border border-slate-200 bg-[#FAF7F2] p-5 shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition hover:border-orange-300 hover:shadow-md"
                  >
                    <Icon className="h-7 w-7 text-orange-600" />
                    <h3 className="mt-4 text-lg font-black tracking-[-0.035em]">{item.title}</h3>
                    <p className="mt-2 text-sm font-semibold leading-7 text-slate-600">{item.desc}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>

      <section id="nha-may-quy-trinh" className="scroll-mt-28 border-b border-orange-200/40 bg-[#F6EFE5] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, x: 28, scale: 0.99 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-7xl"
        >
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                {factoryTitle}
              </h2>
              <p className="mt-6 text-base font-semibold leading-8 text-slate-700">
                {factoryDescription}
              </p>
              <p className="mt-4 text-base font-semibold leading-8 text-slate-700">
                NMV Food là đơn vị sản xuất và là pháp nhân đứng tên trên các chứng nhận, giấy phép hoặc hồ sơ chuyên môn tương ứng. Năm đưa nhà máy vào vận hành và địa chỉ chi tiết chỉ hiển thị sau khi doanh nghiệp xác nhận.
              </p>
              <div className="mt-6 grid gap-3 text-sm font-bold text-slate-700">
                <Placeholder>Năm đưa vào vận hành: [CẦN XÁC NHẬN]</Placeholder>
                <Placeholder>Địa chỉ nhà máy: [CẦN XÁC NHẬN]</Placeholder>
              </div>
            </div>

            <div className="order-1 grid gap-4 lg:order-2">
              <div className="grid border border-slate-200 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.02)] md:grid-cols-3">
                {factoryStats.map(([value, label]) => (
                  <div key={value} className="border-b border-orange-100 p-5 md:border-b-0 md:border-r last:md:border-r-0">
                    <p className="text-3xl font-black tracking-[-0.06em] text-orange-600">{value}</p>
                    <p className="mt-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
              <div className="h-72 overflow-hidden border border-orange-100 bg-white">
                <ImageBox src={factoryImage} alt="Hình ảnh nhà máy sản xuất NMV Food" />
              </div>
            </div>
          </div>

          <div className="mt-14">
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {displayedProcessSteps.map(([title, desc], index) => (
                <motion.article
                  key={title}
                  initial={{ opacity: 0, y: 28, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-70px" }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className="border border-slate-200 bg-white p-5 shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition hover:border-orange-300 hover:shadow-md sm:p-6"
                >
                  <p className="text-4xl font-black tracking-[-0.07em] text-orange-600">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-5 text-xl font-black tracking-[-0.04em]">{title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{desc}</p>
                </motion.article>
              ))}
            </div>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {gallery.map((item) => (
              <article key={item.id} className="group overflow-hidden border border-slate-200 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition hover:border-orange-300 hover:shadow-md">
                <div className="h-52 overflow-hidden bg-orange-50">
                  <ImageBox src={qualityImage(item.imageUrl, "/bento/bento-factory.png")} alt={text(item.title, "Ảnh nhà máy NMV Food")} className="transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <h3 className="font-black tracking-[-0.03em]">{text(item.title, "Gallery nhà máy")}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{text(item.description, "[GALLERY NHÀ MÁY NMV FOOD — CẦN BỔ SUNG ẢNH ĐÃ XÁC NHẬN]")}</p>
                </div>
              </article>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="ho-so-phap-ly" className="scroll-mt-28 border-b border-slate-200 bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, x: -28, scale: 0.99 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-7xl"
        >
          <div>
            <div>
              <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                {documentsTitle}
              </h2>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {documents.map((item, index) => (
              <motion.button
                key={item.id}
                type="button"
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                onClick={() => {
                  setActiveDoc(item);
                  setIsZoomed(false);
                }}
                className="group min-h-80 border border-slate-200 bg-[#FAF7F2] p-6 text-left shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition hover:border-orange-300 hover:bg-white hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                <FileSearch className="h-8 w-8 text-orange-600" />
                <h3 className="mt-6 text-xl font-black tracking-[-0.04em]">{item.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{item.description}</p>
                <div className="mt-6 space-y-2 text-xs font-bold text-slate-500">
                  <p>Pháp nhân: {item.entity}</p>
                  <p>Ngày cấp/kiểm nghiệm: {item.date}</p>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 border border-orange-200 bg-white px-4 py-3 text-xs font-black uppercase tracking-wide text-orange-700">
                  Xem chi tiết <ArrowRight size={14} />
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="bao-hiem-san-pham" className="scroll-mt-28 border-b border-orange-200/40 bg-[#F6EFE5] px-4 py-12 text-slate-950 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, x: 28, scale: 0.99 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center"
        >
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              {pviTitle}
            </h2>
            <p className="mt-6 text-base font-semibold leading-8 text-slate-700">
              {pviDescription}
            </p>
            <div className="mt-7 border border-l-4 border-orange-200 border-l-orange-600 bg-white p-5">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-orange-700">Lưu ý</p>
              <p className="mt-3 text-sm font-semibold leading-7 text-slate-700">
                Bảo hiểm trách nhiệm sản phẩm không thay thế chứng nhận chất lượng, phiếu kiểm nghiệm hoặc trách nhiệm trực tiếp của đơn vị sản xuất và kinh doanh.
              </p>
            </div>
          </div>

          <div className="order-1 border border-slate-200 bg-white p-4 shadow-[0_4px_15px_rgba(0,0,0,0.03)] lg:order-2">
            <div className="h-72 overflow-hidden bg-slate-100 sm:h-80">
              <ImageBox src={pviImage} alt="Hồ sơ bảo hiểm trách nhiệm sản phẩm PVI" />
            </div>
            <div className="grid gap-3 p-5 text-sm font-bold text-slate-700">
              <Placeholder>Pháp nhân được bảo hiểm: [CẦN XÁC NHẬN]</Placeholder>
              <Placeholder>Phạm vi bảo hiểm: [CẦN XÁC NHẬN]</Placeholder>
              <Placeholder>Thời hạn bảo hiểm: [CẦN XÁC NHẬN]</Placeholder>
              <Placeholder>Scan hợp đồng/giấy chứng nhận: [CẦN BỔ SUNG]</Placeholder>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="bao-ve-khach-hang" className="scroll-mt-28 border-b border-slate-200 bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, x: -28, scale: 0.99 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-7xl"
        >
          <div>
            <div>
              <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                {policyTitle}
              </h2>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {displayedPolicyItems.map(([title, desc], index) => {
              const icons = [FileCheck2, PackageCheck, Headphones, ShieldCheck, ClipboardCheck];
              const Icon = icons[index] || FileCheck2;
              return (
                <motion.article
                  key={title}
                  initial={{ opacity: 0, y: 26, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-70px" }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className="border border-slate-200 bg-[#FAF7F2] p-5 shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition hover:border-orange-300 hover:shadow-md sm:p-6"
                >
                  <Icon className="h-8 w-8 text-orange-600" />
                  <h3 className="mt-6 text-lg font-black tracking-[-0.03em]">{title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{desc}</p>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-8 grid gap-4 border border-slate-200 bg-[#FAF7F2] p-5 shadow-[0_4px_15px_rgba(0,0,0,0.02)] sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h3 className="text-2xl font-black tracking-[-0.04em]">Kênh hỗ trợ cần xác nhận</h3>
              <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                Hotline, email, fanpage chính thức, thời gian làm việc và địa chỉ tiếp nhận văn bản cần được bổ sung sau khi doanh nghiệp xác nhận.
              </p>
            </div>
            <Link href="#" className="inline-flex items-center justify-center gap-3 border border-orange-200 bg-orange-50 px-5 py-4 text-xs font-black uppercase tracking-wide text-orange-700 hover:bg-orange-600 hover:text-white">
              Xem chính sách đầy đủ <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="bg-[#FAF7F2] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 border border-slate-200 bg-white p-6 text-slate-950 shadow-[0_4px_15px_rgba(0,0,0,0.03)] sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
          <div>
            <h2 className="max-w-4xl text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Khám phá sản phẩm và điểm bán chính thức
            </h2>
            <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-slate-700">
              Xem danh mục sản phẩm của Ăn Cùng Bà Tuyết hoặc tìm các kênh phân phối phù hợp tại khu vực của bạn.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/san-pham" className="inline-flex items-center justify-center gap-3 bg-orange-600 px-6 py-4 text-xs font-black uppercase tracking-wider text-white transition hover:bg-slate-950">
              Xem sản phẩm <ArrowRight size={16} />
            </Link>
            <Link href="/diem-ban" className="inline-flex items-center justify-center gap-3 border border-slate-300 bg-white px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-950 transition hover:border-orange-400 hover:text-orange-700">
              Tìm điểm bán gần nhất <Truck size={16} />
            </Link>
          </div>
        </div>
      </section>

      {activeDoc ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Đóng hồ sơ"
            onClick={() => setActiveDoc(null)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          <article className="relative max-h-[92vh] w-full max-w-6xl overflow-hidden border border-orange-200 bg-[#fff8ed] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-orange-100 bg-white p-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">Chi tiết hồ sơ</p>
                <h3 className="mt-1 text-2xl font-black tracking-[-0.04em]">{activeDoc.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsZoomed((current) => !current)}
                  className="grid h-11 w-11 place-items-center border border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-orange-600"
                  aria-label={isZoomed ? "Thu nhỏ hồ sơ" : "Phóng to hồ sơ"}
                >
                  {isZoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDoc(null)}
                  className="grid h-11 w-11 place-items-center bg-slate-950 text-white hover:bg-orange-600"
                  aria-label="Đóng"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="grid max-h-[78vh] overflow-y-auto lg:grid-cols-[1.15fr_0.85fr]">
              <div className="bg-slate-100 p-4">
                {activeDoc.imageUrl ? (
                  <img
                    src={activeDoc.imageUrl}
                    alt={`Ảnh scan hoặc hình minh họa ${activeDoc.title}`}
                    className={`mx-auto bg-white object-contain transition ${isZoomed ? "max-h-none w-auto max-w-none" : "max-h-[72vh] w-full"}`}
                  />
                ) : (
                  <div className="grid min-h-[420px] place-items-center border border-dashed border-orange-200 bg-white p-10 text-center">
                    <div>
                      <FileSearch className="mx-auto h-12 w-12 text-orange-600" />
                      <p className="mt-5 text-xl font-black">[CẦN BỔ SUNG ẢNH/PDF]</p>
                      <p className="mt-2 max-w-md text-sm font-semibold leading-7 text-slate-500">
                        Khi có scan chứng nhận hoặc PDF được phép công khai, admin có thể cập nhật ảnh để người xem kiểm chứng.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-7">
                <p className="text-sm font-semibold leading-7 text-slate-700">{activeDoc.description}</p>
                <div className="mt-6 space-y-4">
                  {[
                    ["Pháp nhân/đơn vị đứng tên", activeDoc.entity],
                    ["Ngày cấp/ngày kiểm nghiệm", activeDoc.date],
                    ["Phạm vi áp dụng", activeDoc.scope],
                    ["Ghi chú", activeDoc.note || "Thông tin cần đối chiếu theo hồ sơ gốc."],
                  ].map(([label, value]) => (
                    <div key={label} className="border border-orange-100 bg-white p-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
                      <p className="mt-2 text-sm font-bold leading-7 text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>
      ) : null}
    </main>
  );
}
