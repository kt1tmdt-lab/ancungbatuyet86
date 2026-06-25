"use client";

import { motion } from "framer-motion";
import { Users, Heart, MessageSquare, HandHelping, ArrowRight, Quote } from "lucide-react";
import Link from "next/link";

const communityActivities = [
  {
    icon: Heart,
    title: "Hoạt động Thiện nguyện",
    description: "Ăn Cùng Bà Tuyết thường xuyên tổ chức các chương trình quyên góp, trao quà vùng cao, hỗ trợ trẻ em nghèo hiếu học và đồng bào gặp hoàn cảnh khó khăn.",
    color: "bg-red-50 text-red-600 border-red-150"
  },
  {
    icon: Users,
    title: "Đồng hành cùng đối tác Việt",
    description: "Hợp tác chặt chẽ cùng các nhà xưởng, hợp tác xã nông sản tại địa phương để tạo việc làm bền vững cho người lao động vùng trung du và miền núi.",
    color: "bg-blue-50 text-blue-600 border-blue-150"
  },
  {
    icon: MessageSquare,
    title: "Gắn kết qua Livestream",
    description: "Các phiên phát sóng trực tiếp không chỉ giới thiệu đồ ăn sạch, mà còn là không gian chia sẻ câu chuyện ẩm thực vui vẻ, mang tiếng cười đến mọi gia đình.",
    color: "bg-orange-50 text-orange-600 border-orange-150"
  },
  {
    icon: HandHelping,
    title: "Tử tế từ những việc nhỏ nhất",
    description: "Lắng nghe góp ý của từng khách hàng, cam kết giải quyết khiếu nại chất lượng nhanh chóng và thỏa đáng để bảo vệ quyền lợi người tiêu dùng.",
    color: "bg-green-50 text-green-600 border-green-150"
  }
];

export default function CommunityPage() {
  return (
    <main className="bg-[#fbf7ef] py-16 px-5 sm:px-8 lg:px-14 xl:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 border border-orange-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-orange-700 shadow-sm mb-4">
            <Heart size={14} className="text-red-500 fill-red-500" />
            Trách nhiệm xã hội
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-[-0.04em]">
            Ăn Cùng Bà Tuyết vì Cộng Đồng
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-650 max-w-2xl mx-auto leading-relaxed">
            Chúng tôi tin rằng giá trị lớn nhất của thương hiệu nằm ở niềm vui mang lại cho khách hàng và sự sẻ chia đối với xã hội.
          </p>
        </div>

        {/* Core Values Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16 animate-fade-in">
          {communityActivities.map((act, index) => {
            const Icon = act.icon;
            return (
              <motion.div
                key={act.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="bg-white border border-orange-100 p-6 sm:p-8 hover:border-orange-300 hover:shadow-[0_12px_40px_rgba(15,23,42,0.04)] transition-all duration-300 flex gap-5 items-start"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${act.color}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950 tracking-[-0.03em]">
                    {act.title}
                  </h3>
                  <p className="mt-2 text-sm leading-[1.625] text-slate-600 font-medium">
                    {act.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Big Quote / Statement Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-slate-950 text-white p-8 sm:p-12 relative overflow-hidden shadow-xl"
        >
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <Quote size={200} className="translate-x-12 translate-y-12" />
          </div>

          <div className="max-w-3xl relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-400">
              Cam kết từ thương hiệu
            </p>
            <h3 className="text-2xl sm:text-3xl font-black mt-3 leading-tight tracking-[-0.03em]">
              &ldquo;Mỗi gói sản phẩm trao đi là một lời cam kết về độ sạch, chất lượng ổn định và sự tôn trọng đối với bữa ăn nhẹ của người Việt.&rdquo;
            </h3>
            <div className="mt-8 flex gap-4 sm:flex-row flex-col">
              <Link
                href="/san-pham"
                className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3.5 text-xs font-black uppercase tracking-wider transition-colors"
              >
                Ghé thăm cửa hàng <ArrowRight size={14} />
              </Link>
              <Link
                href="/lien-he"
                className="inline-flex items-center justify-center gap-2 border border-white/25 hover:border-white text-white px-6 py-3.5 text-xs font-black uppercase tracking-wider transition-colors"
              >
                Liên hệ hợp tác
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
