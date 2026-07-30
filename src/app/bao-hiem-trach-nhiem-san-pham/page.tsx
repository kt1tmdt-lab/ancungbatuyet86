import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  FileCheck2,
  FileStack,
  Landmark,
  Scale,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

const dossier = [
  {
    icon: Landmark,
    title: "Vai trò của bảo hiểm",
    text: "Bảo hiểm hỗ trợ xử lý trách nhiệm khi sự việc thuộc phạm vi bảo hiểm, bên cạnh trách nhiệm trực tiếp của đơn vị sản xuất và kinh doanh.",
  },
  {
    icon: Scale,
    title: "Phạm vi áp dụng",
    text: "Việc xem xét phụ thuộc vào hồ sơ sự việc, điều khoản hợp đồng và kết quả xác minh của các bên liên quan.",
  },
  {
    icon: FileStack,
    title: "Hồ sơ cần thiết",
    text: "Thông tin sản phẩm, bằng chứng mua hàng và tài liệu liên quan giúp quá trình tiếp nhận đầy đủ hơn.",
  },
  {
    icon: UserRoundCheck,
    title: "Cách yêu cầu hỗ trợ",
    text: "Khi phát sinh vấn đề, khách hàng liên hệ thương hiệu trước để được tiếp nhận và hướng dẫn bước tiếp theo.",
  },
];

export default function ProductInsurancePage() {
  return (
    <main className="min-h-screen bg-[#fbf8f1] text-slate-950">
      <section className="relative overflow-hidden border-b border-orange-200 bg-[#fff7e9]">
        <div className="mx-auto grid min-h-[720px] max-w-7xl lg:grid-cols-[1fr_0.9fr]">
          <div className="flex flex-col justify-between px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
            <Link
              href="/chat-luong#bao-ve-khach-hang"
              className="inline-flex w-fit items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-slate-600 hover:text-orange-700"
            >
              <ArrowLeft size={15} /> Quyền lợi khách hàng
            </Link>
            <div className="py-16">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-600">
                Hồ sơ bảo vệ quyền lợi
              </p>
              <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.9] tracking-[-0.075em] sm:text-7xl lg:text-[86px]">
                Bảo hiểm trách nhiệm
                <span className="block text-orange-600">sản phẩm</span>
              </h1>
              <p className="mt-8 max-w-2xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
                Một lớp bảo vệ bổ sung cho người tiêu dùng trong phạm vi và điều
                kiện của hợp đồng bảo hiểm.
              </p>
            </div>
            <p className="max-w-2xl border-l-4 border-orange-600 pl-5 text-sm font-bold leading-7 text-slate-600">
              Bảo hiểm không thay thế chứng nhận chất lượng, kiểm nghiệm định kỳ
              hay trách nhiệm xử lý trực tiếp của thương hiệu.
            </p>
          </div>

          <div className="relative flex min-h-[480px] items-center justify-center overflow-hidden bg-white px-8 py-16 lg:min-h-full">
            <div className="absolute h-[520px] w-[520px] rounded-full border border-orange-200" />
            <div className="absolute h-[390px] w-[390px] rounded-full bg-orange-100" />
            <div className="relative flex h-64 w-56 flex-col items-center justify-center rounded-[110px_110px_72px_72px] border-8 border-white bg-orange-600 text-white shadow-[0_35px_90px_rgba(234,88,12,0.25)]">
              <ShieldCheck size={78} strokeWidth={1.25} />
              <span className="mt-5 text-[10px] font-black uppercase tracking-[0.2em]">
                Lớp bảo vệ bổ sung
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <FileCheck2 size={30} className="text-orange-600" />
              <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-orange-600">
                Cấu trúc hồ sơ
              </p>
            </div>
            <h2 className="text-3xl font-black tracking-[-0.05em] sm:text-5xl">
              Bốn nội dung cần hiểu đúng về bảo hiểm
            </h2>
          </div>

          <div className="mt-14 grid border-l border-t border-orange-200 md:grid-cols-2">
            {dossier.map((item, index) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="relative min-h-80 border-b border-r border-orange-200 bg-white p-7 sm:p-10"
                >
                  <span className="absolute right-6 top-5 font-mono text-xs font-black text-orange-500">
                    HỒ SƠ / {String(index + 1).padStart(2, "0")}
                  </span>
                  <Icon size={34} className="text-orange-600" />
                  <h3 className="mt-16 max-w-md text-2xl font-black leading-tight tracking-[-0.04em] sm:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-5 max-w-xl text-sm font-semibold leading-7 text-slate-600 sm:text-base">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-orange-600 px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-100">
              Khi phát sinh vấn đề
            </p>
            <h2 className="mt-4 max-w-4xl text-3xl font-black leading-tight tracking-[-0.05em] sm:text-5xl">
              Liên hệ thương hiệu trước để được ghi nhận và hướng dẫn hồ sơ
            </h2>
          </div>
          <div className="border border-white/30 p-7">
            <p className="text-sm font-semibold leading-7 text-orange-50">
              Chuẩn bị thông tin về sản phẩm, bằng chứng mua hàng và tài liệu
              liên quan để quá trình tiếp nhận có đủ cơ sở xác minh.
            </p>
            <Link
              href="/lien-he"
              className="mt-6 inline-flex items-center gap-3 bg-white px-6 py-4 text-xs font-black uppercase tracking-[0.13em] text-slate-950 hover:bg-slate-950 hover:text-white"
            >
              Liên hệ hỗ trợ <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
