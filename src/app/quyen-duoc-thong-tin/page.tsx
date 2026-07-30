import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  FileSearch,
  ScanSearch,
  Tag,
  RefreshCw,
  BadgeCheck,
} from "lucide-react";

const disclosures = [
  {
    icon: Tag,
    title: "Thông tin trên bao bì",
    description:
      "Sản phẩm cần thể hiện thành phần, ngày sản xuất, hạn sử dụng, hướng dẫn bảo quản và thông tin của đơn vị chịu trách nhiệm.",
  },
  {
    icon: FileSearch,
    title: "Nguồn tham khảo",
    description:
      "Thông tin về chất lượng, quy trình và hồ sơ được công bố theo tài liệu hiện có trên website hoặc kênh chính thức.",
  },
  {
    icon: ScanSearch,
    title: "Kênh xác minh",
    description:
      "Khi cần làm rõ, khách hàng có thể gửi câu hỏi qua các kênh liên hệ chính thức của thương hiệu.",
  },
  {
    icon: RefreshCw,
    title: "Cập nhật minh bạch",
    description:
      "Nội dung công bố được rà soát và cập nhật khi có thay đổi liên quan đến sản phẩm hoặc chính sách.",
  },
];

export default function RightToInformationPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-y-0 right-0 hidden w-[34%] bg-orange-600 lg:block" />
        <div className="relative mx-auto grid min-h-[680px] max-w-7xl lg:grid-cols-[1fr_0.52fr]">
          <div className="flex flex-col justify-between px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
            <Link
              href="/chat-luong#bao-ve-khach-hang"
              className="inline-flex w-fit items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-slate-600 hover:text-orange-700"
            >
              <ArrowLeft size={15} /> Quyền lợi khách hàng
            </Link>
            <div className="py-16 lg:py-24">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-600">
                Hồ sơ công khai · 01
              </p>
              <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.9] tracking-[-0.075em] sm:text-7xl lg:text-[92px]">
                Quyền được
                <span className="block text-orange-600">thông tin rõ ràng</span>
              </h1>
              <p className="mt-8 max-w-2xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
                Khách hàng cần có đủ thông tin để lựa chọn, sử dụng và phản hồi
                về sản phẩm một cách chủ động.
              </p>
            </div>
            <div className="flex items-center gap-3 border-t border-slate-200 pt-6 text-xs font-bold text-slate-500">
              <BadgeCheck size={18} className="text-orange-600" />
              Thông tin được trình bày theo từng nhóm để dễ kiểm tra.
            </div>
          </div>

          <div className="relative flex min-h-80 items-center justify-center overflow-hidden bg-orange-600 px-8 py-14 text-white lg:min-h-full">
            <span className="absolute -right-12 top-0 text-[260px] font-black leading-none text-white/[0.08]">
              i
            </span>
            <div className="relative">
              <FileSearch size={72} strokeWidth={1.25} />
              <p className="mt-8 max-w-xs text-2xl font-black leading-tight">
                Biết rõ trước khi lựa chọn.
              </p>
              <span className="mt-8 block h-px w-24 bg-white/50" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 border-b border-slate-300 pb-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-600">
              Bốn nhóm thông tin
            </p>
            <h2 className="text-3xl font-black leading-tight tracking-[-0.05em] sm:text-5xl">
              Những nội dung khách hàng có thể chủ động kiểm tra
            </h2>
          </div>

          <div className="divide-y divide-slate-200">
            {disclosures.map((item, index) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="grid gap-5 py-9 sm:grid-cols-[80px_0.7fr_1.3fr] sm:items-start sm:gap-8 sm:py-12"
                >
                  <span className="font-mono text-sm font-black text-orange-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-start gap-4">
                    <Icon size={24} className="shrink-0 text-orange-600" />
                    <h3 className="text-xl font-black leading-tight sm:text-2xl">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm font-semibold leading-7 text-slate-600 sm:text-base sm:leading-8">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#fff3df] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="max-w-3xl text-3xl font-black tracking-[-0.05em] sm:text-4xl">
            Cần xác minh một thông tin cụ thể?
          </h2>
          <Link
            href="/lien-he"
            className="inline-flex w-fit items-center gap-3 bg-slate-950 px-6 py-4 text-xs font-black uppercase tracking-[0.13em] text-white hover:bg-orange-600"
          >
            Gửi câu hỏi <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
