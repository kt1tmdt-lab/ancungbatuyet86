import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Headphones,
  Inbox,
  MessagesSquare,
  SearchCheck,
  Send,
  UserCheck,
} from "lucide-react";

const journey = [
  {
    icon: Send,
    title: "Gửi phản ánh",
    text: "Liên hệ qua hotline, email, fanpage hoặc biểu mẫu trên website.",
  },
  {
    icon: Inbox,
    title: "Ghi nhận",
    text: "Nội dung, thời gian, thông tin liên hệ và bằng chứng được tập hợp.",
  },
  {
    icon: SearchCheck,
    title: "Xác minh",
    text: "Bộ phận phụ trách kiểm tra và phối hợp với đơn vị liên quan.",
  },
  {
    icon: UserCheck,
    title: "Phản hồi",
    text: "Hướng xử lý được trao đổi qua kênh liên hệ khách hàng đã cung cấp.",
  },
];

export default function ComplaintReceptionPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-between px-5 py-10 sm:px-8 lg:min-h-[680px] lg:px-12 lg:py-16">
            <Link
              href="/chat-luong#bao-ve-khach-hang"
              className="inline-flex w-fit items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-slate-600 hover:text-orange-700"
            >
              <ArrowLeft size={15} /> Quyền lợi khách hàng
            </Link>
            <div className="py-16">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-orange-600 text-white">
                <Headphones size={30} />
              </span>
              <h1 className="mt-8 max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.07em] sm:text-7xl">
                Trung tâm tiếp nhận
                <span className="block text-orange-600">phản ánh & khiếu nại</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
                Mọi phản ánh liên quan đến sản phẩm được tiếp nhận qua kênh
                chính thức để chuyển đúng bộ phận xử lý.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
              <MessagesSquare size={19} className="text-orange-600" />
              Một đầu mối rõ ràng cho từng phản ánh.
            </div>
          </div>

          <div className="relative flex min-h-[440px] items-center overflow-hidden bg-[#fff3df] px-5 py-14 sm:px-10 lg:min-h-full lg:px-16">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-200/60" />
            <div className="relative w-full space-y-4">
              <div className="mr-auto max-w-md rounded-[28px_28px_28px_4px] bg-white p-6 shadow-[0_20px_60px_rgba(72,38,12,0.1)] sm:p-8">
                <p className="text-xs font-black uppercase tracking-[0.17em] text-orange-600">
                  Khách hàng
                </p>
                <p className="mt-3 text-lg font-black leading-7">
                  Tôi cần gửi phản ánh về một sản phẩm.
                </p>
              </div>
              <div className="ml-auto max-w-md rounded-[28px_28px_4px_28px] bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] sm:p-8">
                <p className="text-xs font-black uppercase tracking-[0.17em] text-orange-300">
                  Bộ phận hỗ trợ
                </p>
                <p className="mt-3 text-lg font-black leading-7">
                  Hãy gửi thông tin và bằng chứng liên quan để được tiếp nhận
                  đúng bộ phận.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[0.55fr_1.45fr] lg:items-end">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-600">
              Hành trình xử lý
            </p>
            <h2 className="text-3xl font-black tracking-[-0.05em] sm:text-5xl">
              Phản ánh đi qua bốn trạng thái rõ ràng
            </h2>
          </div>

          <div className="relative mt-14 grid gap-5 lg:grid-cols-4">
            <span className="absolute left-0 right-0 top-8 hidden h-px bg-slate-300 lg:block" />
            {journey.map((item, index) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="relative">
                  <span className="relative z-10 grid h-16 w-16 place-items-center rounded-full border-8 border-[#f7f8fa] bg-slate-950 text-white">
                    <Icon size={22} />
                  </span>
                  <div className="mt-5 border-t-4 border-orange-600 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                    <p className="font-mono text-xs font-black text-orange-600">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-4 text-xl font-black">{item.title}</h3>
                    <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                      {item.text}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-300">
              Trước khi gửi
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] sm:text-5xl">
              Chuẩn bị đủ để phản ánh được xử lý nhanh hơn
            </h2>
          </div>
          <div className="grid gap-px bg-white/15 sm:grid-cols-2">
            {[
              "Thông tin liên hệ",
              "Mô tả sự việc",
              "Thông tin sản phẩm",
              "Hình ảnh liên quan",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 bg-slate-950 p-5">
                <span className="h-2 w-2 rounded-full bg-orange-400" />
                <span className="text-sm font-bold text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="max-w-3xl text-3xl font-black tracking-[-0.05em] sm:text-4xl">
            Sẵn sàng gửi phản ánh tới bộ phận hỗ trợ?
          </h2>
          <Link
            href="/lien-he"
            className="inline-flex w-fit items-center gap-3 rounded-full bg-orange-600 px-7 py-4 text-xs font-black uppercase tracking-[0.13em] text-white hover:bg-slate-950"
          >
            Mở biểu mẫu liên hệ <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
