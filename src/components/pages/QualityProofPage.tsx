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

const proofBullets = [
  { icon: Wheat, title: "Nhập khẩu từ Ba Lan, Hungary", note: "[cần bổ sung hồ sơ lô hàng public]" },
  { icon: FileCheck2, title: "Có C/O và phiếu kiểm dịch", note: "[cần bổ sung ảnh scan]" },
  { icon: Snowflake, title: "Lưu kho lạnh theo quy chuẩn", note: "[cần bổ sung ảnh kho lạnh]" },
];

const processSteps = [
  "Nguyên liệu",
  "Sơ chế",
  "Chế biến",
  "QC",
  "Đóng gói",
  "Giao hàng",
];

const certificates = [
  {
    icon: BadgeCheck,
    title: "ISO 22000:2018",
    desc: "Cấp cho NMV Food. [cần bổ sung scan chứng nhận]",
  },
  {
    icon: ClipboardCheck,
    title: "HACCP",
    desc: "Chương trình đào tạo, NMV Food. [cần bổ sung hồ sơ]",
  },
  {
    icon: FileCheck2,
    title: "Giấy phép ATTP",
    desc: "Giấy đủ điều kiện ATTP. [cần bổ sung ảnh/PDF]",
  },
  {
    icon: FileSearch,
    title: "Phiếu kiểm nghiệm",
    desc: "VNTEST — kiểm nghiệm định kỳ hàng tháng (NMV Food). [cần bổ sung phiếu mới nhất]",
  },
];

const policyItems = [
  {
    title: "Quyền được thông tin",
    desc: "Mọi sản phẩm cần ghi rõ thành phần, NSX, HSD và thông tin nhận diện.",
  },
  {
    title: "Quyền đổi trả",
    desc: "Có quy trình đổi trả khi sản phẩm lỗi theo chính sách CSKH. [cần bổ sung điều kiện chi tiết]",
  },
  {
    title: "Quyền khiếu nại",
    desc: "Có kênh tiếp nhận và thời gian xử lý phản hồi. [cần bổ sung SLA cụ thể]",
  },
  {
    title: "Bảo hiểm sản phẩm",
    desc: "Sản phẩm được bảo hiểm trách nhiệm sản phẩm bởi PVI theo phạm vi hợp đồng. [cần xác nhận pháp nhân]",
  },
  {
    title: "Kênh hỗ trợ",
    desc: "Hotline, email và thời gian làm việc. [cần bổ sung thông tin chính thức]",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex border-l-4 border-orange-500 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-orange-700">
      {children}
    </p>
  );
}

function PlaceholderImage({ label }: { label: string }) {
  return (
    <div className="flex aspect-[4/3] min-h-[220px] items-center justify-center border border-dashed border-orange-300 bg-[#fff8ed] p-6 text-center">
      <div>
        <FileSearch className="mx-auto h-9 w-9 text-orange-500" />
        <p className="mt-4 text-sm font-black uppercase tracking-[0.14em] text-slate-950">{label}</p>
        <p className="mt-2 text-xs font-semibold text-slate-500">[cần bổ sung ảnh/hồ sơ public]</p>
      </div>
    </div>
  );
}

export default function QualityProofPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf7] text-slate-950">
      <section className="border-b border-orange-100 bg-[#fff3df] px-5 py-16 sm:px-8 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <SectionLabel>Chất lượng</SectionLabel>
            <h1 className="mt-6 max-w-5xl text-4xl font-black leading-[0.96] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
              Chất lượng kiểm chứng được
            </h1>
            <p className="mt-6 max-w-3xl text-base font-semibold leading-8 text-slate-700 sm:text-lg">
              Nguyên liệu, nhà máy, chứng nhận và bảo hiểm — mọi thứ đều có hồ sơ.
              Các thông tin chưa có file công khai sẽ được ghi rõ là [cần bổ sung].
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#ho-so-phap-ly"
                className="inline-flex items-center gap-2 bg-orange-600 px-6 py-4 text-xs font-black uppercase tracking-wider text-white transition hover:bg-slate-950"
              >
                Xem hồ sơ pháp lý
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/san-pham"
                className="inline-flex items-center gap-2 border border-slate-950 bg-white px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-950 transition hover:bg-slate-950 hover:text-white"
              >
                Xem sản phẩm
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="border border-orange-200 bg-white p-5 shadow-[14px_14px_0_rgba(234,88,12,0.14)]">
            <div className="grid grid-cols-2 gap-3">
              <PlaceholderImage label="C/O nhập khẩu" />
              <PlaceholderImage label="Phiếu kiểm dịch" />
              <PlaceholderImage label="Nhà máy NMV Food" />
              <PlaceholderImage label="Phiếu kiểm nghiệm" />
            </div>
          </div>
        </div>
      </section>

      <section id="nguon-nguyen-lieu" className="border-b border-orange-100 bg-white px-5 py-16 sm:px-8 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionLabel>01 · Nguồn nguyên liệu</SectionLabel>
            <h2 className="mt-5 text-3xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">
              Nguyên liệu nhập khẩu từ châu Âu — có truy xuất
            </h2>
            <p className="mt-5 text-base font-semibold leading-8 text-slate-650">
              Nguyên liệu chính như chân gà được định hướng công khai theo hồ sơ nhập khẩu từ Ba Lan,
              Hungary và các nước châu Âu khác. Khi công bố claim này, cần đi kèm C/O, phiếu kiểm dịch
              và hồ sơ lô hàng tương ứng.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="border border-slate-200 bg-[#fff8ed] p-4">
              <div className="flex aspect-video items-center justify-center border border-dashed border-orange-300 bg-white text-center">
                <div>
                  <FileSearch className="mx-auto h-10 w-10 text-orange-500" />
                  <p className="mt-4 text-sm font-black uppercase tracking-[0.14em] text-slate-950">
                    Video truy xuất nguồn nguyên liệu từ Ba Lan
                  </p>
                  <p className="mt-2 text-xs font-semibold text-slate-500">[cần xác nhận link video để embed]</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {proofBullets.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="border border-orange-100 bg-[#fffaf3] p-5">
                    <Icon className="h-7 w-7 text-orange-600" />
                    <h3 className="mt-4 text-base font-black tracking-[-0.03em]">{item.title}</h3>
                    <p className="mt-2 text-xs font-bold leading-6 text-slate-500">{item.note}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="nha-may" className="border-b border-orange-100 bg-[#fff8ed] px-5 py-16 sm:px-8 lg:px-16">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <SectionLabel>02 · Nhà máy & quy trình</SectionLabel>
            <h2 className="mt-5 text-3xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">
              Nhà máy sản xuất NMV Food — Thái Nguyên
            </h2>
          </div>
          <p className="text-base font-semibold leading-8 text-slate-650">
            Nội dung public nên ưu tiên hình ảnh/video tại NMV Food. NMV Food đạt chứng nhận ISO 22000:2018;
            không diễn đạt thành chứng nhận cấp cho ACBT nếu hồ sơ không thể hiện như vậy.
          </p>
        </div>

        <div className="grid border border-orange-200 bg-white md:grid-cols-3">
          <div className="border-b border-orange-100 p-6 md:border-b-0 md:border-r">
            <p className="text-3xl font-black text-orange-600">3.300m²</p>
            <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">Diện tích nhà máy</p>
          </div>
          <div className="border-b border-orange-100 p-6 md:border-b-0 md:border-r">
            <p className="text-3xl font-black text-orange-600">ISO 22000:2018</p>
            <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">NMV Food</p>
          </div>
          <div className="p-6">
            <p className="text-3xl font-black text-orange-600">HACCP</p>
            <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">Chương trình đào tạo</p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-start">
          <div className="grid grid-cols-2 gap-3">
            <PlaceholderImage label="Dây chuyền" />
            <PlaceholderImage label="Kho lạnh" />
            <PlaceholderImage label="Đóng gói" />
            <PlaceholderImage label="QC" />
          </div>

          <div>
            <h3 className="text-2xl font-black tracking-[-0.04em]">Quy trình 6 bước có kiểm soát</h3>
            <div className="mt-5 grid gap-0">
              {processSteps.map((step, index) => (
                <div key={step} className="grid grid-cols-[56px_1fr] border border-orange-100 bg-white">
                  <div className="flex items-center justify-center border-r border-orange-100 bg-slate-950 text-xs font-black text-white">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="p-4">
                    <p className="text-lg font-black tracking-[-0.03em]">{step}</p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-550">
                      Mô tả bước đang chờ hồ sơ/ảnh/video xác nhận. [cần bổ sung]
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="ho-so-phap-ly" className="border-b border-orange-100 bg-white px-5 py-16 sm:px-8 lg:px-16">
        <div className="mb-10 max-w-4xl">
          <SectionLabel>03 · Hồ sơ pháp lý & chứng nhận</SectionLabel>
          <h2 className="mt-5 text-3xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">
            Bằng chứng phải mở ra xem được
          </h2>
          <p className="mt-5 text-base font-semibold leading-8 text-slate-650">
            Mỗi chứng nhận nên có ảnh scan hoặc PDF đi kèm. Card nào chưa có file công khai sẽ giữ nhãn [cần bổ sung].
          </p>
        </div>

        <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-4">
          {certificates.map((cert) => {
            const Icon = cert.icon;
            return (
              <article key={cert.title} className="border border-orange-100 bg-[#fffaf3] p-7 transition hover:bg-white">
                <Icon className="h-9 w-9 text-orange-600" />
                <h3 className="mt-6 text-xl font-black tracking-[-0.03em]">{cert.title}</h3>
                <p className="mt-3 min-h-[84px] text-sm font-semibold leading-7 text-slate-600">{cert.desc}</p>
                <button className="mt-5 inline-flex cursor-not-allowed items-center gap-2 border border-slate-300 px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">
                  Xem chi tiết
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section id="pvi" className="border-b border-orange-100 bg-[#fff8ed] px-5 py-16 sm:px-8 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionLabel>04 · Trách nhiệm sản phẩm</SectionLabel>
            <h2 className="mt-5 text-3xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">
              Bảo hiểm trách nhiệm sản phẩm — PVI
            </h2>
            <p className="mt-5 text-base font-semibold leading-8 text-slate-650">
              ACBT mua bảo hiểm trách nhiệm sản phẩm từ PVI, nghĩa là nếu sản phẩm gây thiệt hại cho người tiêu dùng
              theo phạm vi hợp đồng, có đơn vị bảo hiểm tham gia trách nhiệm bồi thường. Đây là cam kết trách nhiệm,
              không phải chứng nhận chất lượng và không được trình bày như PVI xác nhận chất lượng sản phẩm.
            </p>
            <p className="mt-4 border-l-4 border-orange-500 bg-white p-4 text-sm font-black leading-7 text-slate-700">
              [cần xác nhận] Pháp nhân trên hợp đồng PVI là ACBT hay NMV Food, phạm vi bảo hiểm cụ thể và bản scan được phép public.
            </p>
          </div>
          <div className="border border-orange-200 bg-white p-6 shadow-[12px_12px_0_rgba(234,88,12,0.12)]">
            <div className="flex aspect-[4/3] items-center justify-center bg-[#fff8ed] text-center">
              <div>
                <ShieldCheck className="mx-auto h-14 w-14 text-orange-600" />
                <p className="mt-5 text-3xl font-black tracking-[-0.05em]">PVI</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Logo + scan hợp đồng nếu được phép public
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="chinh-sach" className="border-b border-orange-100 bg-white px-5 py-16 sm:px-8 lg:px-16">
        <div className="mb-10 max-w-4xl">
          <SectionLabel>05 · Quyền lợi khách hàng</SectionLabel>
          <h2 className="mt-5 text-3xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">
            Chính sách bảo vệ quyền lợi khách hàng
          </h2>
          <p className="mt-5 text-base font-semibold leading-8 text-slate-650">
            Tóm tắt các điểm chính từ chính sách CSKH. Bản đầy đủ nên dẫn sang trang hoặc PDF riêng khi đã chốt nội dung 11 điều.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-5">
          {policyItems.map((item, index) => (
            <details key={item.title} className="group border border-orange-100 bg-[#fffaf3] p-5 open:bg-white">
              <summary className="cursor-pointer list-none">
                <span className="block text-xs font-black text-orange-600">{String(index + 1).padStart(2, "0")}</span>
                <span className="mt-3 block text-lg font-black tracking-[-0.03em]">{item.title}</span>
              </summary>
              <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">{item.desc}</p>
            </details>
          ))}
        </div>

        <Link
          href="/chat-luong/chinh-sach-bao-ve-quyen-loi-khach-hang"
          className="mt-8 inline-flex items-center gap-2 border border-slate-950 px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-950 transition hover:bg-slate-950 hover:text-white"
        >
          Xem chính sách đầy đủ
          <ArrowRight size={15} />
        </Link>
      </section>

      <section className="bg-slate-950 px-5 py-14 text-white sm:px-8 lg:px-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-400">Bước tiếp theo</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] sm:text-5xl">
              Có hồ sơ rồi, hãy xem sản phẩm và nơi mua chính thức.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/san-pham" className="inline-flex items-center gap-2 bg-orange-600 px-6 py-4 text-xs font-black uppercase tracking-wider text-white hover:bg-orange-500">
              <PackageCheck size={16} />
              Xem sản phẩm
            </Link>
            <Link href="/diem-ban" className="inline-flex items-center gap-2 border border-white/30 px-6 py-4 text-xs font-black uppercase tracking-wider text-white hover:bg-white hover:text-slate-950">
              <Truck size={16} />
              Tìm điểm bán gần nhất
            </Link>
            <Link href="/lien-he" className="inline-flex items-center gap-2 border border-white/30 px-6 py-4 text-xs font-black uppercase tracking-wider text-white hover:bg-white hover:text-slate-950">
              <Headphones size={16} />
              Liên hệ hỗ trợ
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
