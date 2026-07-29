import Link from "next/link";
import { ArrowRight, BadgeCheck, SearchCheck, ShieldCheck, ShoppingBag, Store, Truck } from "lucide-react";
import prisma from "@/lib/prisma";
import DistributionPointExplorer from "@/components/pages/DistributionPointExplorer";
import { loadDistributionData } from "@/lib/distribution-data";
import {
  normalizeMarketingConfig,
  type HomeTextItem,
} from "@/lib/marketing-config";

// This page reads live distribution data and must not require a database
// connection while the production bundle is being compiled.
export const dynamic = "force-dynamic";

function textValue(items: HomeTextItem[], key: string, fallback: string) {
  const value = items.find((item) => item.key === key)?.value?.trim();
  return value || fallback;
}

export default async function SalesPointPage() {
  const [onlineChannelsResult, distributionResult, marketingResult] = await Promise.allSettled([
    prisma.onlineChannel.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    loadDistributionData(),
    prisma.siteConfig.findUnique({ where: { id: "marketing_assets" } }),
  ]);
  const onlineChannels = onlineChannelsResult.status === "fulfilled" ? onlineChannelsResult.value : [];
  const distributionCount =
    distributionResult.status === "fulfilled" ? distributionResult.value.count : 0;
  const marketingConfig = normalizeMarketingConfig(
    marketingResult.status === "fulfilled" ? marketingResult.value?.data : undefined,
  );
  const pageText = (key: string, fallback: string) =>
    textValue(marketingConfig.homeTexts, key, fallback);

  return (
    <main className="min-h-screen bg-[#fff8ed] text-slate-950">
      <section className="relative overflow-hidden border-b border-orange-100 bg-[#fff3df] px-5 py-20 sm:px-8 lg:px-16">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-white/55" />
        <div className="absolute -right-24 top-20 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="inline-flex border-l-4 border-orange-600 bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-orange-700">
              {pageText("sales_hero_label", "Điểm bán chính thức")}
            </p>
            <h1 className="mt-7 text-5xl font-black leading-[0.9] tracking-[-0.075em] sm:text-6xl lg:text-7xl">
              {pageText("sales_hero_title", "Mua đúng kênh, nhận đúng hàng Bà Tuyết.")}
            </h1>
            <p className="mt-7 max-w-3xl text-base font-semibold leading-8 text-slate-700 sm:text-lg">
              {pageText("sales_hero_description", "Tập trung toàn bộ điểm bán offline, kênh online chính thức và cách nhận diện hàng chính hãng trên cùng một trang.")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#offline" className="inline-flex items-center gap-2 bg-orange-600 px-6 py-4 text-xs font-black uppercase tracking-wider text-white hover:bg-slate-950">
                {pageText("sales_hero_offline_button", "Tìm điểm bán")} <ArrowRight size={15} />
              </Link>
              <Link href="#online" className="inline-flex items-center gap-2 border border-slate-950 bg-white px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-950 hover:bg-slate-950 hover:text-white">
                {pageText("sales_hero_online_button", "Kênh online")} <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              [new Intl.NumberFormat("vi-VN").format(distributionCount), pageText("sales_metric_offline_label", "Điểm phân phối"), Store],
              [String(onlineChannels.length), pageText("sales_metric_online_label", "Kênh online"), ShoppingBag],
              ["3", pageText("sales_metric_guide_label", "Bước nhận diện"), SearchCheck],
            ].map(([value, label, Icon]) => (
              <div key={label as string} className="border border-orange-200 bg-white p-6 shadow-[12px_12px_0_rgba(234,88,12,0.10)]">
                <Icon className="h-8 w-8 text-orange-600" />
                <p className="mt-7 text-5xl font-black tracking-[-0.08em] text-slate-950">{value as string}</p>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">{label as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid border-b border-orange-100 bg-white lg:grid-cols-3">
        {[
          ["offline", "Hệ thống điểm bán offline", "Cửa hàng, đại lý và khu vực phân phối", Store],
          ["online", "Kênh online chính thức", "Sàn TMĐT và kênh bán công bố", ShoppingBag],
          ["authentic", "Nhận diện hàng chính hãng", "Tem nhãn, bao bì và nguồn mua", BadgeCheck],
        ].map(([href, title, desc, Icon]) => (
          <Link key={href as string} href={`#${href}`} className="group border-b border-orange-100 p-7 transition hover:bg-orange-50 lg:border-b-0 lg:border-r">
            <Icon className="h-7 w-7 text-orange-600 transition group-hover:scale-110" />
            <h2 className="mt-5 text-xl font-black tracking-[-0.04em]">{title as string}</h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{desc as string}</p>
          </Link>
        ))}
      </section>

      <section id="offline" className="scroll-mt-24 border-b border-orange-100 bg-[#fffaf3] px-5 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="inline-flex border-l-4 border-orange-600 bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-orange-700">Offline</p>
              <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-0.055em] sm:text-6xl">
                {pageText("sales_offline_title", "Hệ thống điểm bán offline")}
              </h2>
            </div>
            <p className="text-base font-semibold leading-8 text-slate-700">
              {pageText("sales_offline_description", "Danh sách cửa hàng, đại lý và khu vực phân phối đang được công bố để khách hàng dễ chọn đúng kênh mua.")}
            </p>
          </div>

          <div className="mt-10">
            <DistributionPointExplorer />
          </div>
        </div>
      </section>

      <section id="online" className="scroll-mt-24 border-b border-orange-100 bg-white px-5 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="inline-flex border-l-4 border-orange-600 bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-orange-700">Online</p>
          <h2 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[-0.055em] sm:text-6xl">
            {pageText("sales_online_title", "Kênh online chính thức")}
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {onlineChannels.length ? onlineChannels.map((channel) => (
              <Link key={channel.id} href={channel.url || "#"} target={channel.url ? "_blank" : undefined} className="group border border-orange-200 bg-[#fffaf3] p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_70px_rgba(234,88,12,0.12)]">
                <ShoppingBag className="h-8 w-8 text-orange-600" />
                <h3 className="mt-6 text-xl font-black tracking-[-0.04em]">{channel.name}</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{channel.description}</p>
                {channel.followers ? <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-orange-600">{channel.followers}</p> : null}
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-950">
                  {pageText("sales_online_open_label", "Mở kênh")} <ArrowRight size={14} />
                </span>
              </Link>
            )) : (
              <div className="border border-dashed border-orange-200 bg-[#fffaf3] p-8 text-sm font-bold text-slate-500 md:col-span-2 xl:col-span-4">
                {pageText("sales_online_empty", "Hiện chưa có kênh online chính thức nào được công bố.")}
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="authentic" className="scroll-mt-24 bg-slate-950 px-5 py-20 text-white sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="inline-flex border-l-4 border-orange-500 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-orange-200">
              {pageText("sales_auth_label", "Nhận diện")}
            </p>
            <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-0.055em] sm:text-6xl">
              {pageText("sales_auth_title", "Cách tránh mua nhầm hàng không rõ nguồn")}
            </h2>
            <p className="mt-6 text-base font-semibold leading-8 text-white/70">
              {pageText("sales_auth_description", "Phần này giúp khách kiểm tra trước khi đặt hàng: nguồn mua, bao bì, tem nhãn và kênh hỗ trợ.")}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["01", pageText("sales_auth_step_1_title", "Mua đúng kênh"), pageText("sales_auth_step_1_description", "Ưu tiên điểm bán/kênh online được công bố trên website.")],
              ["02", pageText("sales_auth_step_2_title", "Kiểm tra bao bì"), pageText("sales_auth_step_2_description", "Bao bì, nhãn, tên sản phẩm và thông tin NSX/HSD phải rõ ràng.")],
              ["03", pageText("sales_auth_step_3_title", "Giữ bằng chứng mua"), pageText("sales_auth_step_3_description", "Lưu đơn hàng/hóa đơn để được hỗ trợ khi cần khiếu nại.")],
            ].map(([no, title, desc]) => (
              <article key={no} className="border border-white/15 bg-white/5 p-6">
                <p className="text-sm font-black text-orange-300">{no}</p>
                <ShieldCheck className="mt-8 h-8 w-8 text-orange-300" />
                <h3 className="mt-5 text-xl font-black tracking-[-0.04em]">{title}</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-white/65">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-orange-600 px-5 py-14 text-white sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-100">
              {pageText("sales_cta_label", "Cần hỗ trợ?")}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-5xl">
              {pageText("sales_cta_title", "Không chắc kênh mua có chính hãng?")}
            </h2>
          </div>
          <Link href={pageText("sales_cta_link", "/lien-he")} className="inline-flex w-fit items-center gap-2 bg-white px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-950 hover:bg-slate-950 hover:text-white">
            <Truck size={16} /> {pageText("sales_cta_text", "Liên hệ kiểm tra")}
          </Link>
        </div>
      </section>
    </main>
  );
}
