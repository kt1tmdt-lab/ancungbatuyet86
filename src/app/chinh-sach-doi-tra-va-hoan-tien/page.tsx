import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Box,
  Camera,
  ClipboardList,
  PackageCheck,
  SearchCheck,
  Undo2,
} from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Chuẩn bị thông tin",
    text: "Chụp rõ sản phẩm, bao bì, hạn sử dụng và lưu lại thông tin nơi mua.",
  },
  {
    icon: ClipboardList,
    title: "Gửi yêu cầu",
    text: "Mô tả tình trạng và gửi các thông tin liên quan qua kênh hỗ trợ.",
  },
  {
    icon: SearchCheck,
    title: "Xác minh",
    text: "Bộ phận phụ trách kiểm tra dữ liệu và trao đổi thêm khi cần.",
  },
  {
    icon: PackageCheck,
    title: "Phản hồi phương án",
    text: "Phương án đổi sản phẩm hoặc hoàn tiền được thông báo sau khi xác minh.",
  },
];

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen bg-[#fff9ef] text-slate-950">
      <section className="relative overflow-hidden bg-orange-600 text-white">
        <div className="pointer-events-none absolute -right-16 -top-28 h-[520px] w-[520px] rounded-full border border-white/20" />
        <div className="mx-auto grid min-h-[650px] max-w-7xl lg:grid-cols-[0.78fr_1.22fr]">
          <div className="flex items-center justify-center border-b border-white/15 px-5 py-16 lg:border-b-0 lg:border-r">
            <div className="relative grid h-64 w-64 place-items-center rounded-full border border-white/30 sm:h-80 sm:w-80">
              <span className="absolute inset-8 rounded-full border border-white/20" />
              <Undo2 size={100} strokeWidth={1.1} />
            </div>
          </div>
          <div className="flex flex-col justify-between px-5 py-10 sm:px-8 lg:px-14 lg:py-16">
            <Link
              href="/chat-luong#bao-ve-khach-hang"
              className="inline-flex w-fit items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-orange-50 hover:text-white"
            >
              <ArrowLeft size={15} /> Quyền lợi khách hàng
            </Link>
            <div className="py-14">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-100">
                Hướng dẫn xử lý
              </p>
              <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.9] tracking-[-0.075em] sm:text-7xl lg:text-8xl">
                Đổi trả &
                <span className="block text-orange-100">hoàn tiền</span>
              </h1>
              <p className="mt-8 max-w-2xl text-base font-semibold leading-8 text-orange-50 sm:text-lg">
                Khi sản phẩm gặp lỗi thuộc phạm vi hỗ trợ, khách hàng có thể gửi
                thông tin để được tiếp nhận và hướng dẫn xử lý.
              </p>
            </div>
            <div className="flex gap-3">
              <Box size={20} />
              <p className="max-w-xl text-sm font-semibold leading-6 text-orange-50">
                Hãy giữ lại sản phẩm, bao bì và thông tin đơn hàng cho đến khi
                quá trình xác minh hoàn tất.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-600">
              Quy trình thực hiện
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] sm:text-5xl">
              Bốn bước từ phản ánh đến phương án xử lý
            </h2>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.title}
                  className="relative min-h-72 border border-orange-200 bg-white p-6 sm:p-8"
                >
                  <span className="absolute right-5 top-4 font-mono text-5xl font-black text-orange-100">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Icon size={30} className="relative text-orange-600" />
                  <h3 className="mt-16 text-xl font-black leading-tight">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">
                    {step.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-orange-200 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div className="border-l-4 border-orange-600 pl-6 sm:pl-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">
              Trường hợp tiếp nhận
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.045em]">
              Sản phẩm cần được kiểm tra
            </h2>
            <p className="mt-5 text-base font-semibold leading-8 text-slate-600">
              Sản phẩm có dấu hiệu lỗi do sản xuất, đóng gói hoặc hư hại trong
              quá trình vận chuyển nên được phản ánh sớm để có đủ cơ sở xác
              minh.
            </p>
          </div>
          <div className="bg-[#fff3df] p-7 sm:p-9">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">
              Thông tin cần gửi
            </p>
            <ul className="mt-6 grid gap-3 text-sm font-bold text-slate-700 sm:grid-cols-2">
              {[
                "Ảnh sản phẩm và bao bì",
                "Hạn sử dụng",
                "Nơi mua sản phẩm",
                "Mô tả tình trạng",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 bg-white px-4 py-3">
                  <span className="h-2 w-2 bg-orange-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 bg-slate-950 p-7 text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="max-w-2xl text-3xl font-black tracking-[-0.05em]">
            Gửi thông tin để bắt đầu quá trình tiếp nhận
          </h2>
          <Link
            href="/lien-he"
            className="inline-flex w-fit items-center gap-3 bg-orange-600 px-6 py-4 text-xs font-black uppercase tracking-[0.13em] text-white hover:bg-white hover:text-slate-950"
          >
            Gửi yêu cầu hỗ trợ <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
