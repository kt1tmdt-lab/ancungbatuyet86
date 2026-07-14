import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, PackageCheck, Phone, SearchCheck, ShieldCheck, ShoppingBag, Store, Truck } from "lucide-react";
import prisma from "@/lib/prisma";

function typeLabel(type: string) {
  if (type === "chi-nhanh") return "Chi nhánh";
  if (type === "sieu-thi") return "Siêu thị";
  if (type === "online") return "Online";
  return "Đại lý";
}

export default async function SalesPointPage() {
  const [locations, onlineChannels] = await Promise.all([
    prisma.location.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.onlineChannel.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
  ]);
  const firstLocation = locations[0];
  const mapSrc = firstLocation
    ? `https://www.google.com/maps?q=${firstLocation.lat},${firstLocation.lng}&z=13&hl=vi&output=embed`
    : "";

  return (
    <main className="min-h-screen bg-[#fff8ed] text-slate-950">
      <section className="relative overflow-hidden border-b border-orange-100 bg-[#fff3df] px-5 py-20 sm:px-8 lg:px-16">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-white/55" />
        <div className="absolute -right-24 top-20 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="inline-flex border-l-4 border-orange-600 bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-orange-700">
              Điểm bán chính thức
            </p>
            <h1 className="mt-7 text-5xl font-black leading-[0.9] tracking-[-0.075em] sm:text-6xl lg:text-7xl">
              Mua đúng kênh, nhận đúng hàng Bà Tuyết.
            </h1>
            <p className="mt-7 max-w-3xl text-base font-semibold leading-8 text-slate-700 sm:text-lg">
              Tập trung toàn bộ điểm bán offline, kênh online chính thức và cách nhận diện hàng chính hãng trên cùng một trang.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#offline" className="inline-flex items-center gap-2 bg-orange-600 px-6 py-4 text-xs font-black uppercase tracking-wider text-white hover:bg-slate-950">
                Tìm điểm bán <ArrowRight size={15} />
              </Link>
              <Link href="#online" className="inline-flex items-center gap-2 border border-slate-950 bg-white px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-950 hover:bg-slate-950 hover:text-white">
                Kênh online <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              [String(locations.length), "Điểm bán offline", Store],
              [String(onlineChannels.length), "Kênh online", ShoppingBag],
              ["3", "Bước nhận diện", SearchCheck],
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
              <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-0.055em] sm:text-6xl">Hệ thống điểm bán offline</h2>
            </div>
            <p className="text-base font-semibold leading-8 text-slate-700">
              Danh sách cửa hàng, đại lý và khu vực phân phối đang được công bố để khách hàng dễ chọn đúng kênh mua.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="overflow-hidden border border-orange-200 bg-white shadow-[16px_16px_0_rgba(234,88,12,0.10)]">
              {mapSrc ? (
                <iframe
                  title="Bản đồ điểm bán Ăn Cùng Bà Tuyết"
                  src={mapSrc}
                  className="h-[420px] w-full border-0"
                  loading="lazy"
                />
              ) : (
                <div className="grid h-[420px] place-items-center bg-orange-50 p-8 text-center">
                  <div>
                    <MapPin className="mx-auto h-12 w-12 text-orange-600" />
                    <p className="mt-4 text-sm font-black uppercase tracking-[0.16em] text-slate-500">Chưa có tọa độ điểm bán</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">Khi có tọa độ điểm bán, bản đồ sẽ hiển thị tại đây.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="border border-orange-200 bg-white p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">Bản đồ</p>
              <h3 className="mt-3 text-3xl font-black tracking-[-0.05em] text-slate-950">Bản đồ điểm bán chính thức</h3>
              <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">
                Các điểm bán có tọa độ sẽ được hiển thị trên bản đồ để khách hàng dễ tra cứu vị trí, giờ mở cửa và thông tin liên hệ.
              </p>
              {firstLocation ? (
                <Link
                  href={`https://www.google.com/maps/search/?api=1&query=${firstLocation.lat},${firstLocation.lng}`}
                  target="_blank"
                  className="mt-6 inline-flex items-center gap-2 bg-orange-600 px-5 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-slate-950"
                >
                  Mở trên Google Maps <ArrowRight size={14} />
                </Link>
              ) : null}
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {locations.length ? locations.map((location) => (
              <article key={location.id} className="border border-orange-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-600">{typeLabel(location.type)}</p>
                    <h3 className="mt-3 text-xl font-black tracking-[-0.04em]">{location.name}</h3>
                  </div>
                  <MapPin className="h-7 w-7 text-orange-600" />
                </div>
                <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">{location.address}</p>
                <p className="mt-2 text-sm font-bold text-slate-500">{location.province}</p>
                <div className="mt-5 grid gap-2 text-sm font-bold text-slate-700">
                  <span className="inline-flex items-center gap-2"><Phone size={15} className="text-orange-600" /> {location.phone}</span>
                  <span>{location.hours}</span>
                </div>
              </article>
            )) : (
              <div className="border border-dashed border-orange-200 bg-white p-8 text-sm font-bold text-slate-500 md:col-span-2 xl:col-span-3">
                Hiện chưa có điểm bán offline nào được công bố.
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="online" className="scroll-mt-24 border-b border-orange-100 bg-white px-5 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="inline-flex border-l-4 border-orange-600 bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-orange-700">Online</p>
          <h2 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[-0.055em] sm:text-6xl">Kênh online chính thức</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {onlineChannels.length ? onlineChannels.map((channel) => (
              <Link key={channel.id} href={channel.url || "#"} target={channel.url ? "_blank" : undefined} className="group border border-orange-200 bg-[#fffaf3] p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_70px_rgba(234,88,12,0.12)]">
                <ShoppingBag className="h-8 w-8 text-orange-600" />
                <h3 className="mt-6 text-xl font-black tracking-[-0.04em]">{channel.name}</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{channel.description}</p>
                {channel.followers ? <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-orange-600">{channel.followers}</p> : null}
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-950">Mở kênh <ArrowRight size={14} /></span>
              </Link>
            )) : (
              <div className="border border-dashed border-orange-200 bg-[#fffaf3] p-8 text-sm font-bold text-slate-500 md:col-span-2 xl:col-span-4">
                Hiện chưa có kênh online chính thức nào được công bố.
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="authentic" className="scroll-mt-24 bg-slate-950 px-5 py-20 text-white sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="inline-flex border-l-4 border-orange-500 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-orange-200">Nhận diện</p>
            <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-0.055em] sm:text-6xl">Cách tránh mua nhầm hàng không rõ nguồn</h2>
            <p className="mt-6 text-base font-semibold leading-8 text-white/70">
              Phần này giúp khách kiểm tra trước khi đặt hàng: nguồn mua, bao bì, tem nhãn và kênh hỗ trợ.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["01", "Mua đúng kênh", "Ưu tiên điểm bán/kênh online được công bố trên website."],
              ["02", "Kiểm tra bao bì", "Bao bì, nhãn, tên sản phẩm và thông tin NSX/HSD phải rõ ràng."],
              ["03", "Giữ bằng chứng mua", "Lưu đơn hàng/hóa đơn để được hỗ trợ khi cần khiếu nại."],
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
            <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-100">Cần hỗ trợ?</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-5xl">Không chắc kênh mua có chính hãng?</h2>
          </div>
          <Link href="/lien-he" className="inline-flex w-fit items-center gap-2 bg-white px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-950 hover:bg-slate-950 hover:text-white">
            <Truck size={16} /> Liên hệ kiểm tra
          </Link>
        </div>
      </section>
    </main>
  );
}
