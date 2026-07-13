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
    desc: "ISO, HACCP, ATTP, phiếu kiểm nghiệm — bấm để mở popup xem hồ sơ.",
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

const sourceFacts = [
  {
    icon: Wheat,
    title: "Ba Lan, Hungary",
    desc: "Nguồn nhập khẩu châu Âu. [cần bổ sung hồ sơ lô hàng public]",
  },
  {
    icon: FileCheck2,
    title: "C/O & kiểm dịch",
    desc: "Claim nguồn gốc cần đi kèm C/O, kiểm dịch. [cần bổ sung ảnh scan]",
  },
  {
    icon: Snowflake,
    title: "Kho lạnh",
    desc: "Lưu kho lạnh theo quy chuẩn vận hành. [cần bổ sung ảnh/video kho]",
  },
];

const processSteps = [
  ["01", "Nguyên liệu", "Tiếp nhận nguyên liệu theo hồ sơ lô hàng, điều kiện bảo quản và kiểm tra đầu vào."],
  ["02", "Sơ chế", "Sơ chế theo khu vực riêng, giảm lẫn chéo và giữ tính ổn định giữa các lô."],
  ["03", "Chế biến", "Tẩm ướp/chế biến theo công thức và thông số nội bộ được kiểm soát."],
  ["04", "QC", "Kiểm tra cảm quan, quy cách, bao bì và các điểm kiểm soát chất lượng."],
  ["05", "Đóng gói", "Đóng gói, tem nhãn, thông tin NSX/HSD và nhận diện sản phẩm."],
  ["06", "Giao hàng", "Lưu kho, phân phối tới sàn TMĐT, điểm bán và kênh chính thức."],
];

const certificates = [
  {
    icon: BadgeCheck,
    title: "ISO 22000:2018",
    desc: "Ghi rõ: cấp cho NMV Food. [cần bổ sung scan chứng nhận]",
    image: "/bento/bento-factory.png",
    bullets: ["Không ghi thành ACBT nếu hồ sơ không thể hiện như vậy.", "Nên public ảnh/PDF đã che thông tin nhạy cảm.", "Dùng như bằng chứng hệ thống quản lý an toàn thực phẩm."],
  },
  {
    icon: ClipboardCheck,
    title: "HACCP",
    desc: "Chương trình đào tạo, NMV Food. [cần bổ sung hồ sơ]",
    image: "/bento/bento-insurance.png",
    bullets: ["Gắn với chương trình đào tạo/hồ sơ tương ứng.", "Không dùng từ “vô trùng” hoặc “an toàn tuyệt đối”.", "Nên có ảnh chứng nhận hoặc biên bản đào tạo."],
  },
  {
    icon: FileCheck2,
    title: "Giấy phép ATTP",
    desc: "Giấy đủ điều kiện an toàn thực phẩm. [cần bổ sung ảnh/PDF]",
    image: "/bento/bento-ingredients.png",
    bullets: ["Hiển thị tên pháp nhân đúng trên giấy.", "Có thể mở lightbox để xem bản scan.", "Cần che mã số/chi tiết nhạy cảm nếu cần."],
  },
  {
    icon: FileSearch,
    title: "Phiếu kiểm nghiệm",
    desc: "VNTEST — kiểm nghiệm định kỳ hàng tháng (NMV Food). [cần bổ sung phiếu mới nhất]",
    image: "/bento/bento-tiktok.png",
    bullets: ["Gắn ngày kiểm nghiệm gần nhất.", "Nói “kiểm nghiệm định kỳ”, không nói thay cho mọi lô.", "Cần cập nhật file mới khi có phiếu mới."],
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

const evidenceBoard = [
  {
    title: "Được nói",
    tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
    items: ["NMV Food đạt ISO 22000:2018 khi có hồ sơ kèm theo", "Quy trình 6 bước có kiểm soát", "Bảo hiểm trách nhiệm sản phẩm PVI"],
  },
  {
    title: "Cần bổ sung file",
    tone: "bg-orange-50 text-orange-700 border-orange-200",
    items: ["Scan C/O, kiểm dịch, phiếu kiểm nghiệm", "Ảnh/video kho lạnh và nhà máy thật", "Phạm vi hợp đồng PVI được phép public"],
  },
  {
    title: "Không nói quá",
    tone: "bg-rose-50 text-rose-700 border-rose-200",
    items: ["Không ghi “an toàn tuyệt đối”", "Không ghi “PVI bảo chứng chất lượng”", "Không tự nhận chứng nhận nếu giấy cấp cho pháp nhân khác"],
  },
];

const policyItems = [
  ["Quyền được thông tin", "Sản phẩm cần ghi rõ thành phần, NSX, HSD và thông tin nhận diện."],
  ["Quyền đổi trả", "Có quy trình đổi trả khi sản phẩm lỗi theo chính sách CSKH. [cần bổ sung điều kiện]"],
  ["Quyền khiếu nại", "Có kênh tiếp nhận và thời gian xử lý phản hồi. [cần bổ sung SLA]"],
  ["Bảo hiểm sản phẩm", "Sản phẩm được bảo hiểm trách nhiệm sản phẩm bởi PVI theo phạm vi hợp đồng."],
  ["Kênh hỗ trợ", "Hotline, email và thời gian làm việc. [cần bổ sung thông tin chính thức]"],
];

const faqItems = [
  ["ACBT có tự tuyên bố chất lượng không?", "Không nên. Trang này ưu tiên để bên thứ ba và hồ sơ nói thay: chứng nhận, kiểm nghiệm, bảo hiểm, giấy tờ nhập khẩu."],
  ["Nếu chưa có file chứng nhận thì sao?", "Giữ nhãn [cần bổ sung] ngay tại vị trí đó, để đội admin biết cần upload tài liệu thật trước khi truyền thông mạnh."],
  ["PVI có nghĩa là sản phẩm được chứng nhận chất lượng không?", "Không. PVI là bảo hiểm trách nhiệm sản phẩm, thể hiện trách nhiệm bồi thường theo phạm vi hợp đồng."],
  ["Trang này có thay /quy-trinh không?", "Có thể dùng như trang chất lượng tổng, còn /quy-trinh chỉ nên là một phần nhỏ trong section nhà máy."],
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

export default function QualityProofPage() {
  const [modal, setModal] = useState<ModalContent | null>(null);

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
            <button
              type="button"
              onClick={() =>
                setModal({
                  eyebrow: "Ảnh minh họa",
                  title: "Nhà máy, hồ sơ và quy trình phải nhìn thấy được",
                  desc: "Popup này dùng để xem ảnh lớn hoặc thay bằng ảnh nhà máy thật khi admin upload.",
                  image: "/bento/bento-factory.png",
                  bullets: ["Ưu tiên ảnh NMV Food.", "Không dùng ảnh nền tối quá lâu dài.", "Ảnh cần tự co theo khung, không méo."],
                })
              }
              className="group border border-orange-200 bg-white p-4 text-left shadow-[16px_16px_0_rgba(234,88,12,0.12)] sm:col-span-2"
            >
              <div className="relative min-h-[300px] overflow-hidden bg-slate-950">
                <img src="/bento/bento-factory.png" alt="Nhà máy sản xuất" className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/40 to-orange-500/30" />
                <div className="absolute bottom-0 left-0 max-w-lg p-7 text-white">
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-orange-200">NMV Food · Thái Nguyên</p>
                  <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">Nhà máy, hồ sơ và quy trình phải nhìn thấy được</h2>
                </div>
                <span className="absolute right-4 top-4 bg-white px-4 py-2 text-xs font-black uppercase text-orange-700">Bấm xem</span>
              </div>
            </button>
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
              Ảnh nào cần xem kỹ thì bấm mở popup, tránh layout khô như bảng giấy tờ.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-5">
            {galleryImages.map((item, index) => (
              <button
                key={item.label}
                type="button"
                onClick={() =>
                  setModal({
                    eyebrow: "Thư viện bằng chứng",
                    title: item.label,
                    desc: item.desc,
                    image: item.src,
                    bullets: ["Ảnh được tự co theo khung.", "Có thể thay bằng ảnh thật trong admin.", "Nên dùng ảnh rõ nguồn gốc, tránh ảnh minh họa chung chung."],
                  })
                }
                className={`group relative overflow-hidden border border-white/15 bg-white/5 text-left ${index === 1 ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <div className={index === 1 ? "aspect-[4/3] h-full" : "aspect-[4/5]"}>
                  <img src={item.src} alt={item.label} className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
                <p className="absolute bottom-4 left-4 right-4 text-sm font-black uppercase tracking-[0.14em] text-white">{item.label}</p>
                <span className="absolute right-3 top-3 bg-orange-600 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-white opacity-0 transition group-hover:opacity-100">Mở popup</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-orange-100 bg-white px-5 py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <Eyebrow>Bảng kiểm truyền thông</Eyebrow>
          <div className="mt-6 grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <h2 className="text-4xl font-black leading-tight tracking-[-0.055em] sm:text-5xl">
              Trang này không chỉ đẹp — nó còn khóa cách nói cho đúng.
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {evidenceBoard.map((board) => (
                <article key={board.title} className={`border p-5 ${board.tone}`}>
                  <h3 className="text-xl font-black tracking-[-0.04em]">{board.title}</h3>
                  <ul className="mt-5 space-y-3 text-sm font-bold leading-6">
                    {board.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
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
                  <button
                    type="button"
                    key={item.title}
                    onClick={() =>
                      setModal({
                        eyebrow: "Nguồn nguyên liệu",
                        title: item.title,
                        desc: item.desc,
                        image: "/bento/bento-ingredients.png",
                        bullets: ["Admin có thể thay bằng ảnh scan/hồ sơ thật.", "Nội dung này nên đi kèm ngày/lô hàng nếu public.", "Không nói tuyệt đối khi chưa có chứng từ."],
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
                    image: "/bento/bento-ingredients.png",
                    bullets: ["Có thể dùng nhiều ảnh qua thư viện admin.", "Nếu giấy tờ nhạy cảm, che thông tin trước khi public.", "Ảnh tự co theo khung để không bị méo."],
                  })
                }
                className="relative min-h-[260px] overflow-hidden border border-orange-200 bg-white text-left"
              >
                <img src="/bento/bento-ingredients.png" alt="Nguyên liệu" className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                <p className="absolute bottom-5 left-5 max-w-sm text-lg font-black text-white">Ảnh container, kho lạnh, C/O nên đặt vào đây khi có file public.</p>
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
                <button
                  type="button"
                  key={src}
                  onClick={() =>
                    setModal({
                      eyebrow: "Gallery nhà máy",
                      title: `Ảnh nhà máy #${idx + 1}`,
                      desc: "Bấm ảnh để mở lớn. Khi có ảnh thật từ nhà máy, admin thay vào vị trí này.",
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
            PVI là cam kết trách nhiệm, không phải “bảo chứng chất lượng”
          </h2>
          <p className="mt-6 text-base font-semibold leading-8 text-white/72">
            ACBT mua bảo hiểm trách nhiệm sản phẩm từ PVI. Nếu sản phẩm gây thiệt hại cho người tiêu dùng theo phạm vi hợp đồng,
            có đơn vị bảo hiểm tham gia trách nhiệm bồi thường. Không trình bày như PVI xác nhận chất lượng sản phẩm.
          </p>
          <button
            type="button"
            onClick={() =>
              setModal({
                eyebrow: "PVI",
                title: "Bảo hiểm trách nhiệm sản phẩm",
                desc: "Đây là cam kết trách nhiệm theo phạm vi hợp đồng, không phải chứng nhận chất lượng sản phẩm.",
                image: "/bento/bento-insurance.png",
                bullets: ["[cần xác nhận] Pháp nhân trên hợp đồng.", "[cần xác nhận] Phạm vi bảo hiểm cụ thể.", "[cần xác nhận] Scan hợp đồng được phép public."],
              })
            }
            className="mt-8 inline-flex items-center gap-2 bg-orange-600 px-6 py-4 text-xs font-black uppercase tracking-wider text-white transition hover:bg-white hover:text-slate-950"
          >
            Mở ghi chú PVI <ArrowRight size={15} />
          </button>
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
        </div>
      </section>

      <section className="border-b border-orange-100 bg-[#fffaf3] px-5 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>FAQ nhanh</Eyebrow>
            <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-0.055em] sm:text-5xl">
              Những câu dễ bị hỏi nhất phải trả lời gọn và chắc.
            </h2>
          </div>
          <div className="space-y-3">
            {faqItems.map(([question, answer]) => (
              <details key={question} className="group border border-orange-200 bg-white p-6">
                <summary className="cursor-pointer list-none text-xl font-black tracking-[-0.04em] text-slate-950">
                  {question}
                </summary>
                <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">{answer}</p>
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
          <button type="button" aria-label="Đóng popup" onClick={() => setModal(null)} className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm" />
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
                <p className="mt-5 text-base font-semibold leading-8 text-slate-700">{modal.desc}</p>
                {modal.bullets?.length ? (
                  <ul className="mt-7 space-y-3">
                    {modal.bullets.map((item) => (
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
