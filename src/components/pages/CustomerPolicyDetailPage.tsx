import Link from "next/link";
import { ArrowLeft, ArrowRight, type LucideIcon } from "lucide-react";

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
    <main className="min-h-screen bg-[#fff9ef] text-slate-950">
      <section className="border-b border-orange-100 bg-[#fff3df] px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <Link href="/chat-luong#quyen-loi-khach-hang" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-orange-700 transition hover:text-slate-950">
            <ArrowLeft size={15} /> Quay lại trang Chất lượng
          </Link>
          <div className="mt-10 grid gap-7 lg:grid-cols-[1fr_180px] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">{label}</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.06em] sm:text-6xl">
                {title}
              </h1>
              <p className="mt-6 max-w-3xl text-base font-semibold leading-8 text-slate-700 sm:text-lg">
                {intro}
              </p>
            </div>
            <div className="grid h-28 w-28 place-items-center bg-orange-600 text-white sm:h-36 sm:w-36 lg:justify-self-end">
              <Icon size={42} strokeWidth={1.7} />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <article key={item.title} className="border border-orange-100 bg-white p-6 sm:p-8">
                <span className="block h-1 w-10 bg-orange-600" />
                <h2 className="mt-5 text-xl font-black leading-tight tracking-[-0.035em] sm:text-2xl">{item.title}</h2>
                <p className="mt-4 text-sm font-semibold leading-7 text-slate-600 sm:text-base">{item.description}</p>
              </article>
            ))}
          </div>
          {note ? <p className="mt-8 border-l-4 border-orange-600 bg-white px-5 py-4 text-sm font-semibold leading-7 text-slate-700">{note}</p> : null}
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/lien-he" className="inline-flex items-center gap-2 bg-orange-600 px-6 py-4 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-slate-950">
              Liên hệ hỗ trợ <ArrowRight size={15} />
            </Link>
            <Link href="/diem-ban" className="inline-flex items-center gap-2 border border-orange-200 bg-white px-6 py-4 text-xs font-black uppercase tracking-[0.12em] text-slate-800 transition hover:border-orange-500 hover:text-orange-700">
              Tìm điểm bán <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
