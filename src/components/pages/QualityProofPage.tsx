"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Box,
  FileCheck2,
  FileSearch,
  Headphones,
  PackageCheck,
  SearchCheck,
  ShieldCheck,
  Snowflake,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type {
  QualityPageConfig,
  QualitySimpleItem,
} from "@/lib/quality-config";

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
  if (!/[ÃƒÃ„Ã†]|Ã¡Âº|Ã¡Â»|Ã¢â‚¬|ï¿½/.test(value)) return value;
  try {
    const bytes = new Uint8Array(
      [...value].map((character) => {
        const code = character.charCodeAt(0);
        if (code <= 0xff) return code;
        return CP1252_REVERSE[code] ?? code;
      }),
    );
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return value;
  }
}

function copy(value: string | undefined, fallback = "") {
  return repairText(value || "").trim() || fallback;
}

function optionalCopy(value: string | undefined) {
  const normalized = copy(value);
  if (
    !normalized ||
    /\[\s*cần\s+(xác nhận|bổ sung|cập nhật)[^\]]*\]/i.test(normalized)
  ) {
    return "";
  }
  return normalized;
}

function qualityImage(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
}

function ImageBox({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

function Reveal({
  children,
  className = "",
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
}) {
  const initial =
    direction === "left"
      ? { opacity: 0, x: -28 }
      : direction === "right"
        ? { opacity: 0, x: 28 }
        : { opacity: 0, y: 24 };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const sourceIcons = [FileCheck2, BadgeCheck, Snowflake, SearchCheck];
const policyIcons = [FileSearch, PackageCheck, Headphones, ShieldCheck];
const policyLinks = [
  "/quyen-duoc-thong-tin",
  "/chinh-sach-doi-tra-va-hoan-tien",
  "/tiep-nhan-phan-anh-khieu-nai",
  "/bao-hiem-trach-nhiem-san-pham",
];
const placeholderEvidenceImages = new Set([
  "/bento/bento-factory.png",
  "/bento/bento-insurance.png",
  "/bento/bento-ingredients.png",
  "/bento/bento-tiktok.png",
  "/hero/chan-ga-plate.png",
]);

function isPublishedDocument(item: QualitySimpleItem) {
  const image = item.imageUrl?.trim() || "";
  return Boolean(image && !placeholderEvidenceImages.has(image));
}

export default function QualityProofPage({
  config,
}: {
  config: QualityPageConfig;
}) {
  const [activeDocument, setActiveDocument] =
    useState<QualitySimpleItem | null>(null);
  const [documentZoomed, setDocumentZoomed] = useState(false);

  useEffect(() => {
    if (!activeDocument) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveDocument(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeDocument]);

  const heroImage = qualityImage(
    config.hero.imageUrl,
    "/bento/bento-factory.png",
  );
  const sourceImage = qualityImage(
    config.source.imageUrl,
    "/bento/bento-ingredients.png",
  );
  const factoryImage = qualityImage(
    config.factory.imageUrl,
    "/bento/bento-factory.png",
  );
  const pviImage = qualityImage(
    config.pvi.imageUrl,
    "/bento/bento-insurance.png",
  );
  const publishedDocuments = config.documents.items.filter(
    isPublishedDocument,
  );
  const pviDetails = [
    ["Pháp nhân được bảo hiểm", optionalCopy(config.pvi.insuredEntity)],
    ["Phạm vi bảo hiểm", optionalCopy(config.pvi.coverageScope)],
    ["Thời hạn hợp đồng", optionalCopy(config.pvi.coveragePeriod)],
    ["Hồ sơ đính kèm", optionalCopy(config.pvi.documentLabel)],
  ].filter((item): item is [string, string] => Boolean(item[1]));

  return (
    <main className="min-h-screen overflow-x-clip bg-[#fff9ef] text-slate-950 selection:bg-orange-500 selection:text-white">
      <section className="overflow-hidden border-b border-orange-100 bg-[#fff5e5]">
        <div className="h-[60svh] min-h-96 overflow-hidden bg-orange-100 lg:h-[calc(100svh-5rem)] lg:min-h-[620px]">
          <ImageBox
            src={heroImage}
            alt="Nhà máy và quy trình chất lượng Ăn Cùng Bà Tuyết"
            className="object-cover"
          />
        </div>
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <Reveal direction="up" className="max-w-4xl">
            <h1 className="max-w-3xl text-[2.45rem] font-black leading-[0.98] tracking-[-0.06em] sm:text-5xl lg:text-6xl">
              {copy(config.hero.title)}
            </h1>
            <p className="mt-6 max-w-2xl text-[0.95rem] font-semibold leading-7 text-slate-700 sm:text-lg sm:leading-8">
              {copy(config.hero.subtitle)}
            </p>
            <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
              {publishedDocuments.length > 0 && (
                <Link
                  href={copy(config.hero.ctaLink, "#ho-so-phap-ly")}
                  className="inline-flex items-center justify-center gap-3 bg-orange-600 px-6 py-4 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-slate-950"
                >
                  {copy(config.hero.ctaText)}
                  <ArrowRight size={16} />
                </Link>
              )}
              <Link
                href={copy(config.hero.secondaryCtaLink, "/diem-ban")}
                className="inline-flex items-center justify-center gap-3 border border-orange-200 bg-white px-6 py-4 text-xs font-black uppercase tracking-[0.1em] text-slate-950 transition hover:border-orange-500 hover:text-orange-700"
              >
                {copy(config.hero.secondaryCtaText)}
                <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id="nguon-nguyen-lieu"
        className="scroll-mt-24 border-b border-orange-100 bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-9 lg:grid-cols-2 lg:items-center lg:gap-16">
            <Reveal
              direction="left"
              className="order-1 overflow-hidden border border-orange-100 bg-[#fff8ed] p-2"
            >
              <div className="aspect-[4/3] overflow-hidden sm:aspect-[16/11]">
                <ImageBox
                  src={sourceImage}
                  alt="Nguồn nguyên liệu chân gà nhập khẩu từ châu Âu"
                />
              </div>
            </Reveal>
            <Reveal direction="right" className="order-2">
              <h2 className="text-[2rem] font-black leading-[1.05] tracking-[-0.05em] sm:text-4xl lg:text-5xl">
                {copy(config.source.title)}
              </h2>
              <p className="mt-6 text-[0.95rem] font-semibold leading-7 text-slate-700 sm:text-base sm:leading-8">
                {copy(config.source.description)}
              </p>
              <p className="mt-4 text-[0.95rem] font-semibold leading-7 text-slate-700 sm:text-base sm:leading-8">
                {copy(config.source.secondaryDescription)}
              </p>
            </Reveal>
          </div>

          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {config.source.facts.map((fact, index) => {
              const Icon = sourceIcons[index % sourceIcons.length];
              return (
                <Reveal key={fact.id} className="h-full">
                  <article className="h-full border border-orange-100 bg-[#fff9ef] p-5 transition hover:-translate-y-1 hover:border-orange-300 sm:p-6">
                    <Icon size={24} className="text-orange-600" />
                    <h3 className="mt-5 text-lg font-black tracking-[-0.035em]">
                      {copy(fact.title)}
                    </h3>
                    <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                      {copy(fact.description)}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="nha-may-quy-trinh"
        className="scroll-mt-24 border-b border-orange-100 bg-[#fff5e5] px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-9 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
            <Reveal
              direction="right"
              className="order-1 overflow-hidden border border-orange-100 bg-white p-2 lg:order-2"
            >
              <div className="aspect-[4/3] overflow-hidden sm:aspect-[16/11]">
                <ImageBox
                  src={factoryImage}
                  alt="Nhà máy sản xuất tại KCN Sông Công II, Thái Nguyên"
                />
              </div>
            </Reveal>
            <Reveal direction="left" className="order-2 lg:order-1">
              <h2 className="text-[2rem] font-black leading-[1.05] tracking-[-0.05em] sm:text-4xl lg:text-5xl">
                {copy(config.factory.title)}
              </h2>
              <p className="mt-6 text-[0.95rem] font-semibold leading-7 text-slate-700 sm:text-base sm:leading-8">
                {copy(config.factory.description)}
              </p>
            </Reveal>
          </div>

          <div className="mt-9 grid border border-orange-100 bg-white sm:grid-cols-3 lg:mt-12">
            {config.factory.stats.map((stat) => (
              <div
                key={stat.id}
                className="border-b border-orange-100 p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:p-6 sm:last:border-r-0"
              >
                <p className="text-2xl font-black tracking-[-0.05em] text-orange-600 sm:text-3xl">
                  {copy(stat.title)}
                </p>
                <p className="mt-2 text-xs font-black uppercase leading-5 tracking-[0.09em] text-slate-500">
                  {copy(stat.description)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-2">
            {config.factory.steps.map((step, index) => (
              <Reveal key={step.id} className="h-full">
                <article className="grid h-full grid-cols-[42px_minmax(0,1fr)] gap-4 border border-orange-100 bg-white p-5 sm:grid-cols-[52px_minmax(0,1fr)] sm:p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-orange-600 text-sm font-black text-white sm:h-12 sm:w-12">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg font-black leading-tight tracking-[-0.035em] sm:text-xl">
                      {copy(step.title)}
                    </h3>
                    <p className="mt-3 text-sm font-semibold leading-6 text-slate-600 sm:leading-7">
                      {copy(step.description)}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {publishedDocuments.length > 0 && (
      <section
        id="ho-so-phap-ly"
        className="scroll-mt-24 border-b border-orange-100 bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal className="max-w-3xl">
            <h2 className="text-[2rem] font-black leading-[1.05] tracking-[-0.05em] sm:text-4xl lg:text-5xl">
              {copy(config.documents.title)}
            </h2>
          </Reveal>

            <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
              {publishedDocuments.map((document) => (
                <Reveal key={document.id} className="h-full">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDocument(document);
                      setDocumentZoomed(false);
                    }}
                    className="group flex h-full min-h-64 w-full flex-col border border-orange-100 bg-[#fff9ef] p-5 text-left transition hover:-translate-y-1 hover:border-orange-400 sm:p-6"
                  >
                    <FileSearch size={25} className="text-orange-600" />
                    <h3 className="mt-6 text-lg font-black tracking-[-0.035em]">
                      {copy(document.title)}
                    </h3>
                    <p className="mt-3 flex-1 text-sm font-semibold leading-6 text-slate-600">
                      {copy(document.description)}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.1em] text-orange-700">
                      Xem bản scan <ArrowRight size={15} />
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>
        </div>
      </section>
      )}

      <section
        id="bao-hiem-san-pham"
        className="scroll-mt-24 border-b border-orange-100 bg-[#fff5e5] px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal
            direction="left"
            className="order-1 overflow-hidden border border-orange-100 bg-white p-2"
          >
            <div className="aspect-[4/3] overflow-hidden sm:aspect-[16/11]">
              <ImageBox
                src={pviImage}
                alt="Bảo hiểm trách nhiệm sản phẩm PVI"
              />
            </div>
          </Reveal>
          <Reveal direction="right" className="order-2">
            <h2 className="text-[2rem] font-black leading-[1.05] tracking-[-0.05em] sm:text-4xl lg:text-5xl">
              {copy(config.pvi.title)}
            </h2>
            <p className="mt-6 text-[0.95rem] font-semibold leading-7 text-slate-700 sm:text-base sm:leading-8">
              {copy(config.pvi.description)}
            </p>
            <div className="mt-6 border-l-4 border-orange-600 bg-white p-5">
              <p className="text-sm font-semibold leading-7 text-slate-700">
                {copy(config.pvi.note)}
              </p>
            </div>
            {pviDetails.length > 0 && (
              <dl className="mt-6 divide-y divide-orange-100 border-y border-orange-100">
                {pviDetails.map(([label, value]) => (
                  <div
                    key={label}
                    className="grid gap-1 py-3 text-sm sm:grid-cols-[170px_1fr]"
                  >
                    <dt className="font-black text-slate-950">{label}</dt>
                    <dd className="font-semibold text-slate-600">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Reveal>
        </div>
      </section>

      <section
        id="bao-ve-khach-hang"
        className="scroll-mt-24 bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal className="max-w-3xl">
            <h2 className="text-[2rem] font-black leading-[1.05] tracking-[-0.05em] sm:text-4xl lg:text-5xl">
              {copy(config.policy.title)}
            </h2>
          </Reveal>

          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {config.policy.items.map((item, index) => {
              const Icon: ComponentType<{ size?: number; className?: string }> =
                policyIcons[index % policyIcons.length];
              const content = (
                <>
                  <Icon size={25} className="text-orange-600" />
                  <h3 className="mt-6 text-lg font-black tracking-[-0.035em]">
                    {copy(item.title)}
                  </h3>
                  <p className="mt-3 flex-1 text-sm font-semibold leading-6 text-slate-600">
                    {copy(item.description)}
                  </p>
                  {policyLinks[index] && (
                    <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.1em] text-orange-700">
                      Xem chi tiết <ArrowRight size={15} />
                    </span>
                  )}
                </>
              );
              const className =
                "flex h-full min-h-64 flex-col border border-orange-100 bg-[#fff9ef] p-5 transition hover:-translate-y-1 hover:border-orange-400 sm:p-6";

              return (
                <Reveal key={item.id} className="h-full">
                  {policyLinks[index] ? (
                    <Link href={policyLinks[index]} className={className}>
                      {content}
                    </Link>
                  ) : (
                    <article className={className}>{content}</article>
                  )}
                </Reveal>
              );
            })}
          </div>

          <Reveal className="mt-6 border border-orange-200 bg-orange-600 p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-100">
                {copy(config.policy.supportTitle)}
              </p>
              <p className="mt-3 text-base font-black leading-7">
                {copy(config.policy.supportDetails)}
              </p>
            </div>
            <Link
              href="/lien-he"
              className="mt-5 inline-flex shrink-0 items-center gap-3 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.1em] text-slate-950 transition hover:bg-slate-950 hover:text-white sm:mt-0"
            >
              Liên hệ hỗ trợ <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-orange-100 bg-[#fff5e5] px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Reveal className="mx-auto max-w-5xl text-center">
          <Box size={28} className="mx-auto text-orange-600" />
          <h2 className="mx-auto mt-5 max-w-3xl text-[2rem] font-black leading-[1.05] tracking-[-0.05em] sm:text-4xl lg:text-5xl">
            {copy(config.closing.title)}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[0.95rem] font-semibold leading-7 text-slate-700 sm:text-base sm:leading-8">
            {copy(config.closing.description)}
          </p>
          <div className="mt-7 grid gap-3 sm:flex sm:justify-center">
            <Link
              href={copy(config.closing.primaryLink, "/diem-ban")}
              className="inline-flex items-center justify-center gap-3 bg-orange-600 px-6 py-4 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-slate-950"
            >
              {copy(config.closing.primaryText)}
              <ArrowRight size={16} />
            </Link>
            <Link
              href={copy(config.closing.secondaryLink, "/san-pham")}
              className="inline-flex items-center justify-center gap-3 border border-orange-200 bg-white px-6 py-4 text-xs font-black uppercase tracking-[0.1em] text-slate-950 transition hover:border-orange-500 hover:text-orange-700"
            >
              {copy(config.closing.secondaryText)}
              <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </section>

      {activeDocument && activeDocument.imageUrl && (
        <div
          className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Bản scan ${copy(activeDocument.title)}`}
        >
          <div className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3 sm:px-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-orange-600">
                  Hồ sơ kiểm chứng
                </p>
                <h3 className="mt-1 font-black text-slate-950">
                  {copy(activeDocument.title)}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDocumentZoomed((current) => !current)}
                  className="grid h-10 w-10 place-items-center border border-slate-200 text-slate-600 transition hover:border-orange-400 hover:text-orange-600"
                  aria-label={documentZoomed ? "Thu nhỏ" : "Phóng to"}
                >
                  {documentZoomed ? (
                    <ZoomOut size={18} />
                  ) : (
                    <ZoomIn size={18} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDocument(null)}
                  className="grid h-10 w-10 place-items-center border border-slate-200 text-slate-600 transition hover:border-red-300 hover:text-red-600"
                  aria-label="Đóng hồ sơ"
                >
                  <X size={19} />
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-auto bg-slate-100 p-4 text-center">
              <img
                src={activeDocument.imageUrl}
                alt={`Bản scan ${copy(activeDocument.title)}`}
                className={`mx-auto bg-white object-contain shadow-lg transition ${
                  documentZoomed
                    ? "max-w-none"
                    : "max-h-[72vh] max-w-full"
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
