"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
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
} from "lucide-react";

const orange = "text-orange-600";

const proofPillars = [
  {
    no: "01",
    title: "Nguồn nguyên liệu",
    desc: "Thông tin xuất xứ, C/O, kiểm dịch và điều kiện lưu kho cần được công khai bằng hồ sơ.",
    href: "#nguon-nguyen-lieu",
    icon: Wheat,
  },
  {
    no: "02",
    title: "Nhà máy & quy trình",
    desc: "NMV Food, Thái Nguyên. Quy trình 6 bước có kiểm soát, không dùng ngôn ngữ tuyệt đối.",
    href: "#nha-may",
    icon: Factory,
  },
  {
    no: "03",
    title: "Hồ sơ pháp lý",
    desc: "ISO 22000:2018, HACCP, ATTP, phiếu kiểm nghiệm — mỗi claim cần file xem được.",
    href: "#ho-so-phap-ly",
    icon: FileSearch,
  },
  {
    no: "04",
    title: "Trách nhiệm sản phẩm",
    desc: "Bảo hiểm trách nhiệm sản phẩm PVI là cam kết trách nhiệm, không phải chứng nhận chất lượng.",
    href: "#pvi",
    icon: ShieldCheck,
  },
];

const sourceFacts = [
  { icon: Wheat, title: "Ba Lan, Hungary", desc: "Nguồn nhập khẩu châu Âu. [cần bổ sung hồ sơ lô hàng public]" },
  { icon: FileCheck2, title: "C/O & kiểm dịch", desc: "Mỗi claim nguồn gốc cần đi kèm C/O, kiểm dịch. [cần bổ sung ảnh scan]" },
  { icon: Snowflake, title: "Kho lạnh", desc: "Lưu kho lạnh theo quy chuẩn vận hành. [cần bổ sung ảnh/video kho]" },
];

const processSteps = [
  ["01", "Nguyên liệu", "Tiếp nhận nguyên liệu theo hồ sơ lô hàng, điều kiện bảo quản và kiểm tra đầu vào."],
  ["02", "Sơ chế", "Sơ chế theo khu vực riêng, giảm lẫn chéo và giữ tính ổn định giữa các lô."],
  ["03", "Chế biến", "Tẩm ướp/chế biến theo công thức và thông số nội bộ được kiểm soát."],
  ["04", "QC", "Kiểm tra cảm quan, quy cách, bao bì và các điểm kiểm soát chất lượng."],
  ["05", "Đóng gói", "Đóng gói, tem nhãn, thông tin NSX/HSD và nhận diện sản phẩm."],
  ["06", "Giao hàng", "Lưu kho, phân phối tới sàn TMĐT/điểm bán/kênh chính thức."],
];

const certificates = [
  { icon: BadgeCheck, title: "ISO 22000:2018", desc: "Ghi rõ: cấp cho NMV Food. [cần bổ sung scan chứng nhận]" },
  { icon: ClipboardCheck, title: "HACCP", desc: "Chương trình đào tạo, NMV Food. [cần bổ sung hồ sơ]" },
  { icon: FileCheck2, title: "Giấy phép ATTP", desc: "Giấy đủ điều kiện an toàn thực phẩm. [cần bổ sung ảnh/PDF]" },
  { icon: FileSearch, title: "Phiếu kiểm nghiệm", desc: "VNTEST — kiểm nghiệm định kỳ hàng tháng (NMV Food). [cần bổ sung phiếu mới nhất]" },
];

const policyItems = [
  ["Quyền được thông tin", "Sản phẩm cần ghi rõ thành phần, NSX, HSD và thông tin nhận diện."],
  ["Quyền đổi trả", "Có quy trình đổi trả khi sản phẩm lỗi theo chính sách CSKH. [cần bổ sung điều kiện]"],
  ["Quyền khiếu nại", "Có kênh tiếp nhận và thời gian xử lý phản hồi. [cần bổ sung SLA]"],
  ["Bảo hiểm sản phẩm", "Sản phẩm được bảo hiểm trách nhiệm sản phẩm bởi PVI theo phạm vi hợp đồng."],
  ["Kênh hỗ trợ", "Hotline, email và thời gian làm việc. [cần bổ sung thông tin chính thức]"],
];

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
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
      <FileSearch className={`h-8 w-8 ${tone === "dark" ? "text-orange-300" : orange}`} />
      <h3 className={`mt-5 text-lg font-black tracking-[-0.04em] ${tone === "dark" ? "text-white" : "text-slate-950"}`}>{title}</h3>
      <p className={`mt-2 text-sm font-semibold leading-7 ${tone === "dark" ? "text-white/65" : "text-slate-600"}`}>{desc}</p>
    </div>
  );
}

export default function QualityProofPage() {
  return (
    <main className="min-h-screen bg-[#fff8ed] text-slate-950">
      <section className="relative overflow-hidden border-b border-orange-100 bg-[#fff3df] px-5 py-20 sm:px-8 lg:px-16">
        <div className="absolute inset-0 bg-[linear-gradient(112deg,#fff3df_0%,#fff3df_50%,#ffffff_50%,#ffffff_100%)]" />
        <div className="absolute -right-32 top-16 h-[460px] w-[460px] rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute left-0 top-0 h-full w-2 bg-orange-600" />

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <Eyebrow>Chất lượng kiểm chứng</Eyebrow>
            <h1 className="mt-7 max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.075em] sm:text-6xl lg:text-7xl">
              Năng lực sản xuất rõ ràng trước khi nói về bán hàng
            </h1>
            <p className="mt-7 max-w-3xl text-base font-semibold leading-8 text-slate-700 sm:text-lg">
              Nguyên liệu, nhà máy, chứng nhận và bảo hiểm — mọi thứ cần có hồ sơ đi kèm.
              Chỗ nào chưa có file công khai sẽ ghi rõ <span className="font-black text-orange-700">[cần bổ sung]</span>, không tự tuyên bố thay bằng chứng.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#ho-so-phap-ly" className="inline-flex items-center gap-2 bg-orange-600 px-6 py-4 text-xs font-black uppercase tracking-wider text-white transition hover:bg-slate-950">
                Xem hồ sơ pháp lý <ArrowRight size={15} />
              </Link>
              <Link href="/san-pham" className="inline-flex items-center gap-2 border border-slate-950 bg-white px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-950 transition hover:bg-slate-950 hover:text-white">
                Xem sản phẩm <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 border border-orange-200 bg-white p-4 shadow-[16px_16px_0_rgba(234,88,12,0.12)]">
              <div className="relative min-h-[300px] overflow-hidden bg-slate-950">
                <img src="/bento/bento-factory.png" alt="Nhà máy sản xuất" className="absolute inset-0 h-full w-full object-cover opacity-75" />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/40 to-orange-500/30" />
                <div className="absolute bottom-0 left-0 max-w-lg p-7 text-white">
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-orange-200">NMV Food · Thái Nguyên</p>
                  <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">Nhà máy, hồ sơ và quy trình phải nhìn thấy được</h2>
                </div>
              </div>
            </div>
            <EvidenceFrame title="C/O nhập khẩu" desc="Ảnh scan hồ sơ nhập khẩu nguyên liệu. [cần bổ sung]" />
            <EvidenceFrame title="Phiếu kiểm nghiệm" desc="VNTEST định kỳ hàng tháng. [cần bổ sung bản mới nhất]" />
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

      <section id="nguon-nguyen-lieu" className="border-b border-orange-100 bg-[#fffaf3] px-5 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <div>
            <Eyebrow>01 · Minh bạch nguồn nguyên liệu</Eyebrow>
            <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-0.055em] sm:text-6xl">
              Nguyên liệu nhập khẩu từ châu Âu — có truy xuất
            </h2>
            <p className="mt-6 text-base font-semibold leading-8 text-slate-700">
              Nguyên liệu chính như chân gà được định hướng công khai theo hồ sơ nhập khẩu từ Ba Lan, Hungary và các nước châu Âu khác.
              Khi công bố claim này, cần đi kèm C/O, phiếu kiểm dịch và hồ sơ lô hàng tương ứng.
            </p>
          </div>

          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              {sourceFacts.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="border border-orange-200 bg-white p-5 shadow-sm">
                    <Icon className="h-8 w-8 text-orange-600" />
                    <h3 className="mt-5 text-lg font-black tracking-[-0.04em]">{item.title}</h3>
                    <p className="mt-2 text-sm font-semibold leading-7 text-slate-600">{item.desc}</p>
                  </div>
                );
              })}
            </div>
            <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
              <div className="relative min-h-[260px] overflow-hidden border border-orange-200 bg-white">
                <img src="/bento/bento-ingredients.png" alt="Nguyên liệu" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                <p className="absolute bottom-5 left-5 max-w-sm text-lg font-black text-white">Ảnh container, kho lạnh, C/O nên đặt vào đây khi có file public.</p>
              </div>
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
                Nhà máy sản xuất NMV Food — Thái Nguyên
              </h2>
            </div>
            <p className="text-base font-semibold leading-8 text-slate-700">
              Ghi đúng chủ thể: <span className="font-black">NMV Food đạt chứng nhận ISO 22000:2018</span>. Không ghi thành ACBT nếu hồ sơ không thể hiện như vậy.
              Không dùng “an toàn tuyệt đối”, “vô trùng”; dùng “quy trình 6 bước có kiểm soát”.
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
              {["/bento/bento-factory.png", "/bento/bento-tiktok.png", "/hero/chan-ga-plate.png", "/bento/bento-insurance.png"].map((src, idx) => (
                <div key={src} className="relative min-h-[190px] overflow-hidden border border-orange-200 bg-orange-50">
                  <img src={src} alt={`Nhà máy ${idx + 1}`} className="absolute inset-0 h-full w-full object-cover transition duration-500 hover:scale-105" />
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-2xl font-black tracking-[-0.04em]">Quy trình 6 bước có kiểm soát</h3>
              <div className="mt-6">
                {processSteps.map(([no, title, desc]) => (
                  <div key={no} className="grid grid-cols-[70px_1fr] border-x border-t border-orange-200 last:border-b">
                    <div className="flex items-center justify-center bg-slate-950 text-sm font-black text-white">{no}</div>
                    <div className="bg-white p-5">
                      <p className="text-xl font-black tracking-[-0.04em]">{title}</p>
                      <p className="mt-1 text-sm font-semibold leading-7 text-slate-600">{desc}</p>
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
              Bằng chứng phải mở ra xem được
            </h2>
            <p className="text-base font-semibold leading-8 text-slate-700">
              Mỗi chứng nhận nên có ảnh scan hoặc PDF đi kèm. Card nào chưa có file công khai sẽ giữ nhãn [cần bổ sung], tránh biến hồ sơ thành lời quảng cáo.
            </p>
          </div>
          <div className="mt-10 grid gap-0 md:grid-cols-2 xl:grid-cols-4">
            {certificates.map((cert) => {
              const Icon = cert.icon;
              return (
                <article key={cert.title} className="group border border-orange-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(234,88,12,0.12)]">
                  <Icon className="h-9 w-9 text-orange-600" />
                  <h3 className="mt-6 text-xl font-black tracking-[-0.04em]">{cert.title}</h3>
                  <p className="mt-3 min-h-[110px] text-sm font-semibold leading-7 text-slate-600">{cert.desc}</p>
                  <button className="mt-5 inline-flex cursor-not-allowed items-center gap-2 border border-orange-200 px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">
                    Xem chi tiết
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
            PVI là cam kết trách nhiệm, không phải “bảo chứng chất lượng”
          </h2>
          <p className="mt-6 text-base font-semibold leading-8 text-white/72">
            ACBT mua bảo hiểm trách nhiệm sản phẩm từ PVI. Nếu sản phẩm gây thiệt hại cho người tiêu dùng theo phạm vi hợp đồng,
            có đơn vị bảo hiểm tham gia trách nhiệm bồi thường. Không trình bày như PVI xác nhận chất lượng sản phẩm.
          </p>
        </div>
        <div className="border-t border-white/10 p-5 lg:border-l lg:border-t-0 lg:p-10">
          <div className="grid h-full place-items-center border border-white/15 bg-white/5 p-8">
            <ShieldCheck className="h-20 w-20 text-orange-400" />
            <p className="mt-6 text-7xl font-black tracking-[-0.08em]">PVI</p>
            <p className="mt-4 max-w-md text-center text-sm font-bold leading-7 text-white/60">
              [cần xác nhận] Pháp nhân trên hợp đồng, phạm vi bảo hiểm và scan hợp đồng được phép public.
            </p>
          </div>
        </div>
      </section>

      <section id="chinh-sach" className="border-b border-orange-100 bg-white px-5 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <Eyebrow>05 · Quyền lợi khách hàng</Eyebrow>
          <h2 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[-0.055em] sm:text-6xl">
            Khách hàng cần biết mình được bảo vệ thế nào
          </h2>
          <div className="mt-10 grid gap-3 lg:grid-cols-5">
            {policyItems.map(([title, desc], index) => (
              <details key={title} className="group border border-orange-200 bg-[#fffaf3] p-5 open:bg-white">
                <summary className="cursor-pointer list-none">
                  <span className="block text-xs font-black text-orange-600">{String(index + 1).padStart(2, "0")}</span>
                  <span className="mt-3 block text-lg font-black tracking-[-0.03em]">{title}</span>
                </summary>
                <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">{desc}</p>
              </details>
            ))}
          </div>
          <Link href="/chat-luong/chinh-sach-bao-ve-quyen-loi-khach-hang" className="mt-8 inline-flex items-center gap-2 border border-slate-950 px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-950 transition hover:bg-slate-950 hover:text-white">
            Xem chính sách đầy đủ <ArrowRight size={15} />
          </Link>
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
    </main>
  );
}
