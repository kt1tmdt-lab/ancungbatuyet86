import { Fragment, type ReactNode } from "react";
import type { BilingualLegalDocument, LegalBlock, LegalDocument } from "@/lib/legal-documents";

// Địa chỉ web (không lấy dấu câu ở cuối câu) hoặc email
const LINK_PATTERN =
  /(https?:\/\/[^\s]+?(?=[.,;:)]?(?:\s|$))|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;

/** Biến địa chỉ web và email trong văn bản thành link, không đổi chữ. */
function withEmailLinks(text: string): ReactNode {
  const parts = text.split(LINK_PATTERN);
  if (parts.length === 1) return text;

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <a
        key={index}
        href={part.startsWith("http") ? part : `mailto:${part}`}
        className="font-semibold text-orange-700 underline decoration-orange-300 underline-offset-2 [overflow-wrap:anywhere] hover:text-orange-800"
      >
        {part}
      </a>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") {
    return <p className="whitespace-pre-line">{withEmailLinks(block)}</p>;
  }

  return (
    <ul className="list-disc space-y-2 pl-6 marker:text-orange-600">
      {block.list.map((item, index) => (
        <li key={index}>{withEmailLinks(item)}</li>
      ))}
    </ul>
  );
}

function LanguageSection({
  id,
  lang,
  label,
  document,
}: {
  id: string;
  lang: "en" | "vi";
  label: string;
  document: LegalDocument;
}) {
  return (
    <section id={id} lang={lang} className="scroll-mt-24 lg:scroll-mt-28">
      <h2 className="border-b-2 border-orange-600 pb-3 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
        {label}
      </h2>

      {document.title && (
        <p className="mt-6 text-xl font-extrabold leading-snug text-slate-950 sm:text-2xl">
          {document.title}
        </p>
      )}

      {document.intro?.map((line, index) => (
        <p key={index} className="mt-2 text-sm font-semibold text-slate-500">
          {withEmailLinks(line)}
        </p>
      ))}

      {document.sections.length === 0 ? (
        <p className="mt-6 text-slate-500">Nội dung đang được cập nhật.</p>
      ) : (
        <div className="mt-8 space-y-9">
          {document.sections.map((section, index) => (
            <div key={index}>
              {section.heading && (
                <h3 className="mb-3 text-lg font-extrabold leading-snug text-slate-950 sm:text-xl">
                  {section.heading}
                </h3>
              )}
              <div className="space-y-4">
                {section.blocks.map((block, blockIndex) => (
                  <Block key={blockIndex} block={block} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function LegalDocumentPage({
  title,
  subtitle,
  content,
}: {
  title: string;
  subtitle: string;
  content: BilingualLegalDocument;
}) {
  return (
    <main className="min-h-screen bg-[#fff9ef] text-slate-950">
      <section className="bg-orange-600 text-white">
        <div className="mx-auto max-w-[800px] px-5 py-14 sm:px-8 sm:py-20">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-100">
            Chính sách
          </p>
          <h1 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.06em] sm:text-6xl">
            {title}
          </h1>
          <p className="mt-4 text-lg font-semibold text-orange-50 sm:text-xl">{subtitle}</p>

          <nav aria-label="Chọn ngôn ngữ" className="mt-9 flex flex-wrap gap-3">
            <a
              href="#english"
              className="inline-flex min-h-11 items-center rounded-full bg-white px-6 text-sm font-black text-orange-700 shadow-sm transition hover:bg-orange-50"
            >
              English
            </a>
            <a
              href="#tieng-viet"
              className="inline-flex min-h-11 items-center rounded-full border border-white/70 px-6 text-sm font-black text-white transition hover:bg-white hover:text-orange-700"
            >
              Tiếng Việt
            </a>
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-[800px] space-y-16 px-5 py-14 text-base leading-[1.8] text-slate-700 sm:px-8 sm:py-20 sm:text-[17px]">
        <LanguageSection id="english" lang="en" label="English" document={content.en} />
        <LanguageSection id="tieng-viet" lang="vi" label="Tiếng Việt" document={content.vi} />
      </div>
    </main>
  );
}
