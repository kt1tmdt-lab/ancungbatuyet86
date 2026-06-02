"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Eye, Target, Users } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

const timeline = [
  { year: "2022", title: "Khởi đầu", description: "Xuất phát từ kênh YouTube NMT Vlog, Bà Tuyết bắt đầu chia sẻ những video hài hước, mộc mạc về đời sống nông thôn tại Thái Nguyên." },
  { year: "2023", title: "Ra mắt thương hiệu", description: "Thương hiệu Ăn Cùng Bà Tuyết chính thức ra mắt, nhanh chóng lọt Top TikTok Shop ngành hàng ăn vặt." },
  { year: "2024", title: "Bùng nổ tăng trưởng", description: "Top 1 TikTok Shop ăn vặt. Mở rộng danh mục sản phẩm, liên tục cháy hàng. Hơn 6.2 triệu đơn hàng." },
  { year: "2025", title: "Kỷ lục doanh thu", description: "Đạt 228 tỷ đồng doanh thu (+304%). Xây dựng nhà máy mới. Mua bảo hiểm PVI cho người tiêu dùng." },
  { year: "2026", title: "Chuyên nghiệp hóa", description: "Khánh thành nhà máy 3.300m². Ra mắt MV cùng Tuấn Cry. Mở rộng kênh phân phối toàn quốc." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-[70vh] flex items-center bg-neutral text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-primary blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <span className="text-primary-light text-sm font-semibold uppercase tracking-wider">Câu chuyện của chúng tôi</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mt-4 leading-[1.1]">
              Đi lên từ
              <br />
              <span className="text-primary-light">hai bàn tay trắng.</span>
            </h1>
            <p className="text-gray-300 text-lg mt-6 leading-relaxed max-w-2xl">
              Từ người nông dân chân chất ở Thái Nguyên đến thương hiệu đồ ăn vặt hàng đầu Việt Nam với hơn 228 tỷ đồng doanh thu — hành trình của Bà Tuyết là câu chuyện về sự kiên trì, chân thật và tình yêu với ẩm thực Việt.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission/Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Target, title: "Sứ mệnh", text: "Thay đổi cái nhìn của mọi người về đồ ăn vặt — ăn vặt cũng có thể sạch, an toàn và tốt cho sức khỏe." },
              { icon: Eye, title: "Tầm nhìn", text: "Trở thành thương hiệu đồ ăn vặt Việt Nam mà người tiêu dùng tin tưởng nhất về chất lượng sản phẩm." },
              { icon: Heart, title: "Giá trị cốt lõi", text: "Chân thật — Chất lượng — Gia đình. Làm đồ ăn cho con cháu nhà mình ăn." },
              { icon: Users, title: "Con người", text: "Hơn 200 nhân viên, đội ngũ trẻ trung và nhiệt huyết, cùng chung khát khao nâng tầm ẩm thực Việt." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-primary" size={28} />
                </div>
                <h3 className="font-bold text-neutral text-lg">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <SectionHeader label="Hành trình" title="Từ 2022 đến nay" description="Một hành trình tăng trưởng thần tốc — từ nội dung giải trí đến thương hiệu quốc dân" />
          <div className="relative">
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gray-200 sm:-translate-x-px" />
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex items-start gap-6 mb-12 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}
              >
                <div className={`hidden sm:block sm:w-1/2 ${i % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}>
                  <p className="text-4xl font-extrabold text-primary/20">{item.year}</p>
                </div>
                <div className="absolute left-4 sm:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-cream -translate-x-1/2 mt-1.5 z-10" />
                <div className={`ml-10 sm:ml-0 sm:w-1/2 ${i % 2 === 0 ? "sm:pl-8" : "sm:pr-8"}`}>
                  <p className="text-sm font-bold text-primary sm:hidden">{item.year}</p>
                  <h3 className="text-xl font-bold text-neutral">{item.title}</h3>
                  <p className="text-gray-500 mt-2 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-24 bg-neutral text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8">
              <span className="text-4xl font-extrabold text-primary-light">BT</span>
            </div>
            <blockquote className="text-2xl sm:text-3xl font-bold leading-relaxed">
              &ldquo;Bận tâm gì mưa nắng, quyết tâm đi lên để mà ghi tên. Một thương hiệu đồ ăn với biết bao công sức của người nông dân.&rdquo;
            </blockquote>
            <p className="text-gray-400 mt-6 font-medium">— Bà Tuyết, Founder</p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-neutral">Khám phá thêm</h2>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/quy-trinh" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-dark transition-colors">
              Xem quy trình sản xuất <ArrowRight size={18} />
            </Link>
            <Link href="/san-pham" className="inline-flex items-center gap-2 bg-gray-100 text-neutral px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition-colors">
              Xem sản phẩm
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
