"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Factory, Award, TrendingUp, ChevronRight } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { products } from "@/data/products";

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-neutral via-neutral to-neutral-light overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-primary/20 text-primary-light px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              Top 1 TikTok Shop — Ngành ăn vặt
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6">
              Ăn vặt thì phải
              <br />
              <span className="text-primary-light">ăn cùng Bà Tuyết</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-lg mb-8 leading-relaxed">
              Thương hiệu đồ ăn vặt sạch hàng đầu Việt Nam — Nguyên liệu thuần khiết,
              không chất bảo quản, được bảo hiểm bởi PVI.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/san-pham"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full text-base font-semibold transition-all hover:shadow-lg hover:shadow-primary/25"
              >
                Khám phá sản phẩm
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/quy-trinh"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full text-base font-semibold transition-all border border-white/20"
              >
                Xem quy trình
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl rotate-6" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark rounded-3xl flex items-center justify-center">
                <div className="text-center text-white">
                  <p className="text-8xl font-extrabold">BT</p>
                  <p className="text-lg font-medium mt-2 opacity-75">Ăn Cùng Bà Tuyết</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: "3.2M+", label: "Followers TikTok" },
    { value: "6.2M+", label: "Đơn hàng" },
    { value: "50+", label: "Sản phẩm" },
    { value: "3.300m²", label: "Nhà máy" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl sm:text-4xl font-extrabold text-primary">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          label="Sản phẩm"
          title="Sản phẩm chủ lực"
          description="Mỗi sản phẩm là một câu chuyện — từ nguyên liệu sạch đến tay bạn"
        />
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Link
                href={`/san-pham/${product.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center overflow-hidden">
                  <div className="w-3/4 h-3/4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <span className="text-4xl font-bold text-primary/30">{product.name.charAt(0)}</span>
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {product.categoryLabel}
                  </span>
                  <h3 className="text-xl font-bold text-neutral mt-1">{product.name}</h3>
                  <p className="text-gray-500 text-sm mt-2">{product.tagline}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm font-semibold text-gray-900">{product.priceRange}</span>
                    <span className="text-primary group-hover:translate-x-1 transition-transform">
                      <ChevronRight size={20} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/san-pham"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
          >
            Xem tất cả sản phẩm
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const pillars = [
    { icon: Shield, title: "Bảo hiểm PVI", description: "Thương hiệu đầu tiên mua bảo hiểm trách nhiệm sản phẩm cho khách hàng" },
    { icon: Factory, title: "Nhà máy 3.300m²", description: "Nhà máy đạt chuẩn, quy trình kiểm soát chất lượng nghiêm ngặt" },
    { icon: Award, title: "Nguyên liệu sạch", description: "100% nguyên liệu Việt Nam, không chất bảo quản, không phẩm màu nhân tạo" },
    { icon: TrendingUp, title: "Top 1 TikTok Shop", description: "Hơn 6.2 triệu đơn hàng — Thương hiệu ăn vặt được yêu thích nhất" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader label="Cam kết" title="Tại sao chọn Bà Tuyết?" description="Chúng tôi không chỉ bán đồ ăn vặt — chúng tôi cam kết về sức khỏe và chất lượng" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => (
            <motion.div key={pillar.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="text-center p-6 rounded-2xl bg-cream hover:bg-red-50/50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <pillar.icon className="text-primary" size={24} />
              </div>
              <h3 className="font-bold text-neutral text-lg">{pillar.title}</h3>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandStory() {
  return (
    <section className="py-20 bg-neutral text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="text-primary-light text-sm font-semibold uppercase tracking-wider">Câu chuyện</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 leading-tight">Từ hai bàn tay trắng<br />đến thương hiệu quốc dân</h2>
            <p className="text-gray-300 mt-6 leading-relaxed">
              Bắt đầu từ căn bếp nhỏ ở Thái Nguyên, Bà Tuyết đã biến đam mê làm đồ ăn vặt thành thương hiệu với hơn 228 tỷ đồng doanh thu. Hành trình ấy không chỉ là kinh doanh — đó là câu chuyện về sự kiên trì, chân thật và tình yêu với ẩm thực Việt.
            </p>
            <Link href="/gioi-thieu" className="inline-flex items-center gap-2 mt-8 text-primary-light hover:text-white font-semibold transition-colors">
              Đọc câu chuyện đầy đủ <ArrowRight size={18} />
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
            <div className="grid grid-cols-2 gap-4">
              {[
                { year: "2022", event: "Khởi đầu từ YouTube NMT Vlog" },
                { year: "2023", event: "Ra mắt thương hiệu ACBT" },
                { year: "2024", event: "Top 1 TikTok Shop ăn vặt" },
                { year: "2025", event: "228 tỷ doanh thu" },
              ].map((item, i) => (
                <div key={item.year} className={`p-5 rounded-2xl bg-white/5 backdrop-blur border border-white/10 ${i === 3 ? "bg-primary/20 border-primary/30" : ""}`}>
                  <p className="text-2xl font-extrabold text-primary-light">{item.year}</p>
                  <p className="text-sm text-gray-300 mt-1">{item.event}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl sm:text-4xl font-bold">Sẵn sàng thử chưa?</h2>
          <p className="text-white/80 mt-4 text-lg">Đặt hàng trên TikTok Shop, Shopee hoặc tìm cửa hàng gần bạn</p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a href="https://tiktok.com/@batuyethanhvi" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              TikTok Shop <ArrowRight size={18} />
            </a>
            <a href="https://shopee.vn/nmtvlog99" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white/20 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/30 transition-colors border border-white/30">Shopee</a>
            <Link href="/he-thong-ban" className="inline-flex items-center gap-2 bg-white/20 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/30 transition-colors border border-white/30">Tìm cửa hàng</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedProducts />
      <WhyChooseUs />
      <BrandStory />
      <CTASection />
    </>
  );
}
