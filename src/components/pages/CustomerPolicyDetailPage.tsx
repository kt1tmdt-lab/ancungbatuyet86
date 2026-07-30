import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  MessageSquareText,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

type DetailItem = {
  title: string;
  description: string;
};

export function CustomerPolicyDetailPage({
  label,
  title,
  intro,
  icon: Icon,
  items,
  note,
}: {
  label: string;
  title: string;
  intro: string;
  icon: LucideIcon;
  items: DetailItem[];
  note?: string;
}) {
  return (
    <main className="min-h-screen bg-[#f8f3ea] text-slate-950">
      <div className="border-b border-orange-100 bg-white px-5 py-4 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <Link
            href="/chat-luong#bao-ve-khach-hang"
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-slate-600 transition hover:text-orange-700"
          >
            <ArrowLeft size={15} /> Chất lượng & quyền lợi khách hàng
          </Link>
          <span className="hidden text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 sm:block">
            Thông tin công khai
          </span>
        </div>
      </div>

      <section className="relative overflow-hidden border-b border-orange-200 bg-[#fff5e5] px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
        <div className="pointer-events-none absolute -right-28 -top-36 h-[440px] w-[440px] rounded-full border border-orange-300/50" />
        <div className="pointer-events-none absolute -bottom-56 right-[18%] h-[480px] w-[480px] rounded-full bg-orange-200/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-3 border-l-4 border-orange-600 bg-white px-4 py-3">
              <FileCheck2 size={17} className="text-orange-600" />
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-orange-700">
                {label}
              </span>
            </div>
            <h1 className="mt-8 max-w-5xl text-[2.8rem] font-black leading-[0.92] tracking-[-0.07em] sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="mt-7 max-w-3xl text-base font-semibold leading-8 text-slate-700 sm:text-lg">
              {intro}
            </p>
          </div>

          <aside className="relative overflow-hidden bg-slate-950 p-7 text-white sm:p-9">
            <span className="pointer-events-none absolute -right-4 -top-10 text-[150px] font-black leading-none text-white/[0.04]">
              A
            </span>
            <div className="relative">
              <div className="grid h-16 w-16 place-items-center bg-orange-600">
                <Icon size={31} strokeWidth={1.8} />
              </div>
              <p className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-orange-300">
                Phạm vi nội dung
              </p>
              <p className="mt-3 text-xl font-black leading-tight">
                Thông tin hướng dẫn dành cho khách hàng và đối tác.
              </p>
              <div className="mt-7 border-t border-white/15 pt-5 text-sm font-semibold leading-7 text-slate-300">
                Nội dung được trình bày theo từng mục để dễ tra cứu và chuẩn bị
                thông tin trước khi liên hệ.
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-20">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border-t-4 border-orange-600 bg-white p-6 shadow-[0_18px_55px_rgba(67,42,18,0.06)]">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">
                Nội dung trang
              </p>
              <nav className="mt-5 divide-y divide-slate-100">
                {items.map((item, index) => (
                  <a
                    key={item.title}
                    href={`#muc-${index + 1}`}
                    className="grid grid-cols-[28px_1fr] gap-3 py-4 text-sm font-black leading-5 text-slate-700 transition hover:text-orange-700"
                  >
                    <span className="font-mono text-xs text-orange-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>

            <div className="mt-4 border border-orange-200 bg-[#fff5e5] p-6">
              <ShieldCheck size={24} className="text-orange-600" />
              <p className="mt-4 text-sm font-semibold leading-7 text-slate-700">
                Nếu trường hợp của bạn chưa được nêu tại đây, hãy gửi thông tin
                qua kênh liên hệ chính thức để được tiếp nhận.
              </p>
            </div>
          </aside>

          <div>
            <div className="border-b border-slate-300 pb-7">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600">
                Nội dung cần biết
              </p>
              <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight tracking-[-0.05em] sm:text-5xl">
                Rõ từng nội dung, dễ thực hiện khi cần hỗ trợ
              </h2>
            </div>

            <ol className="relative mt-10">
              <span className="absolute bottom-8 left-6 top-8 w-px bg-orange-200 sm:left-9" />
              {items.map((item, index) => (
                <li
                  id={`muc-${index + 1}`}
                  key={item.title}
                  className="relative grid scroll-mt-32 grid-cols-[52px_minmax(0,1fr)] gap-5 pb-8 last:pb-0 sm:grid-cols-[76px_minmax(0,1fr)] sm:gap-8 sm:pb-10"
                >
                  <span className="relative z-10 grid h-12 w-12 place-items-center border-4 border-[#f8f3ea] bg-orange-600 font-mono text-xs font-black text-white sm:h-16 sm:w-16 sm:text-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <article className="border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(67,42,18,0.05)] sm:p-9">
                    <h3 className="text-xl font-black leading-tight tracking-[-0.035em] sm:text-3xl">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-sm font-semibold leading-7 text-slate-600 sm:text-base sm:leading-8">
                      {item.description}
                    </p>
                  </article>
                </li>
              ))}
            </ol>

            {note ? (
              <div className="mt-10 grid gap-5 border-l-4 border-orange-600 bg-[#fff5e5] p-6 sm:grid-cols-[42px_1fr] sm:p-8">
                <ClipboardCheck size={30} className="text-orange-600" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-700">
                    Lưu ý quan trọng
                  </p>
                  <p className="mt-3 text-sm font-semibold leading-7 text-slate-700 sm:text-base">
                    {note}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="border-y border-orange-200 bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600">
                Quy trình tiếp nhận
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] sm:text-4xl">
                Ba bước để thông tin đến đúng bộ phận
              </h2>
            </div>
            <div className="grid gap-px bg-orange-100 sm:grid-cols-3">
              {[
                {
                  icon: MessageSquareText,
                  title: "Gửi thông tin",
                  text: "Mô tả rõ trường hợp và cung cấp tài liệu liên quan.",
                },
                {
                  icon: ClipboardCheck,
                  title: "Tiếp nhận",
                  text: "Thông tin được ghi nhận và chuyển đến bộ phận phụ trách.",
                },
                {
                  icon: CheckCircle2,
                  title: "Phản hồi",
                  text: "Kết quả được trao đổi qua kênh liên hệ đã cung cấp.",
                },
              ].map((step) => {
                const StepIcon = step.icon;
                return (
                  <article key={step.title} className="bg-[#fffaf3] p-6">
                    <StepIcon size={24} className="text-orange-600" />
                    <h3 className="mt-5 text-lg font-black">{step.title}</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                      {step.text}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-14 text-white sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-300">
              Cần trao đổi thêm?
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight tracking-[-0.05em] sm:text-5xl">
              Gửi thông tin qua kênh hỗ trợ chính thức
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/lien-he"
              className="inline-flex items-center gap-3 bg-orange-600 px-6 py-4 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-slate-950"
            >
              Liên hệ hỗ trợ <ArrowRight size={15} />
            </Link>
            <Link
              href="/chat-luong"
              className="inline-flex items-center gap-3 border border-white/30 px-6 py-4 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:border-orange-400 hover:text-orange-300"
            >
              Trang Chất lượng <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
