"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Shield, Award, FileCheck, Droplets, Thermometer, Package, Truck, Sprout, Search, FlaskConical } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

const processSteps = [
  {
    step: 1,
    title: "Nguồn nguyên liệu",
    subtitle: "Chọn lọc từ trang trại",
    description: "Nguyên liệu được tuyển chọn từ các nhà cung cấp đạt chuẩn tại Việt Nam. Mỗi lô nguyên liệu đều có giấy chứng nhận nguồn gốc xuất xứ rõ ràng.",
    metrics: [
      { value: "100%", label: "Nguyên liệu Việt Nam" },
      { value: "15+", label: "Nhà cung cấp đạt chuẩn" },
    ],
    icon: Sprout,
    color: "from-green-500/10 to-green-600/5",
    iconColor: "text-green-600",
  },
  {
    step: 2,
    title: "Sơ chế & Kiểm tra",
    subtitle: "3 vòng kiểm định",
    description: "Mỗi lô nguyên liệu đều trải qua 3 vòng kiểm tra trước khi đưa vào dây chuyền sản xuất. Loại bỏ 100% nguyên liệu không đạt tiêu chuẩn.",
    metrics: [
      { value: "3 vòng", label: "Kiểm tra đầu vào" },
      { value: "0", label: "Chất tẩy rửa hóa học" },
    ],
    icon: Search,
    color: "from-blue-500/10 to-blue-600/5",
    iconColor: "text-blue-600",
  },
  {
    step: 3,
    title: "Chế biến",
    subtitle: "Công nghệ & tâm huyết",
    description: "Kết hợp giữa công thức gia truyền và công nghệ hiện đại. Nhiệt độ và thời gian chế biến được kiểm soát chính xác cho từng loại sản phẩm.",
    metrics: [
      { value: "±1°C", label: "Sai số nhiệt độ" },
      { value: "100%", label: "Tự động hóa" },
    ],
    icon: Thermometer,
    color: "from-orange-500/10 to-orange-600/5",
    iconColor: "text-orange-600",
  },
  {
    step: 4,
    title: "Kiểm tra chất lượng",
    subtitle: "QC từng lô sản phẩm",
    description: "Đội ngũ QC kiểm tra từng lô sản phẩm trước khi đóng gói. Mỗi lô đều được lưu mẫu đối chứng trong 12 tháng — sẵn sàng truy xuất bất kỳ lúc nào.",
    metrics: [
      { value: "100%", label: "Lô được kiểm tra" },
      { value: "12 tháng", label: "Lưu mẫu đối chứng" },
    ],
    icon: FlaskConical,
    color: "from-purple-500/10 to-purple-600/5",
    iconColor: "text-purple-600",
    highlight: true,
  },
  {
    step: 5,
    title: "Đóng gói",
    subtitle: "An toàn & minh bạch",
    description: "Bao bì đạt chuẩn an toàn thực phẩm, in rõ ngày sản xuất, hạn sử dụng, thành phần và mã QR truy xuất nguồn gốc.",
    metrics: [
      { value: "QR code", label: "Truy xuất nguồn gốc" },
      { value: "Đạt chuẩn", label: "Bao bì ATTP" },
    ],
    icon: Package,
    color: "from-teal-500/10 to-teal-600/5",
    iconColor: "text-teal-600",
  },
  {
    step: 6,
    title: "Giao đến tay bạn",
    subtitle: "Nhanh chóng & tận tâm",
    description: "Hợp tác với các đơn vị vận chuyển uy tín hàng đầu. Sản phẩm được bảo quản đúng điều kiện trong suốt quá trình vận chuyển.",
    metrics: [
      { value: "24h", label: "Giao nội thành" },
      { value: "48h", label: "Giao liên tỉnh" },
    ],
    icon: Truck,
    color: "from-red-500/10 to-red-600/5",
    iconColor: "text-red-600",
  },
];

const certifications = [
  { icon: FileCheck, title: "Giấy phép ATTP", description: "Đạt chuẩn An toàn Thực phẩm do cơ quan chức năng cấp" },
  { icon: Shield, title: "Bảo hiểm PVI", description: "Bảo hiểm trách nhiệm sản phẩm cho người tiêu dùng" },
  { icon: Award, title: "Kiểm nghiệm định kỳ", description: "Sản phẩm được kiểm nghiệm bởi phòng thí nghiệm độc lập" },
  { icon: Droplets, title: "Không chất bảo quản", description: "Cam kết 0% chất bảo quản và phẩm màu nhân tạo" },
];

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center bg-neutral overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-secondary blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-primary blur-3xl" />
      </div>
      <motion.div style={{ opacity, y }} className="text-center relative z-10 px-4">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-primary-light text-sm font-semibold uppercase tracking-widest mb-6">
          Quy trình sản xuất
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-5xl sm:text-6xl lg:text-8xl font-extrabold text-white leading-[1.05]">
          Từ cánh đồng
          <br />
          <span className="text-primary-light">đến tay bạn.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-gray-400 text-lg mt-6 max-w-xl mx-auto">
          6 bước. Không tắt. Không dối. Mỗi sản phẩm đều đi qua hành trình mà chúng tôi tự hào giới thiệu.
        </motion.p>
      </motion.div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-white/50" />
        </motion.div>
      </div>
    </section>
  );
}

function ProcessStepsSection() {
  return (
    <section className="py-0">
      {processSteps.map((step, i) => (
        <div key={step.step} className={`py-24 ${i % 2 === 0 ? "bg-white" : "bg-cream"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className={`grid lg:grid-cols-2 gap-16 items-center ${i % 2 !== 0 ? "lg:direction-rtl" : ""}`}>
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className={i % 2 !== 0 ? "lg:order-2" : ""}
              >
                <div className={`w-full aspect-[4/3] rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center relative overflow-hidden ${step.highlight ? "ring-2 ring-primary/20" : ""}`}>
                  <step.icon className={`${step.iconColor} opacity-20`} size={180} />
                  {step.highlight && (
                    <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                      TRỌNG TÂM
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className={i % 2 !== 0 ? "lg:order-1" : ""}
              >
                <span className="text-6xl font-extrabold text-gray-100">0{step.step}</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-neutral -mt-4">{step.title}</h2>
                <p className="text-primary font-semibold mt-1">{step.subtitle}</p>
                <p className="text-gray-500 mt-4 text-lg leading-relaxed">{step.description}</p>
                <div className="flex gap-8 mt-8">
                  {step.metrics.map((m) => (
                    <div key={m.label}>
                      <p className="text-2xl font-extrabold text-neutral">{m.value}</p>
                      <p className="text-sm text-gray-400 mt-0.5">{m.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function FactorySection() {
  return (
    <section className="py-24 bg-neutral text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader label="Nhà máy" title="3.300m² — Tiêu chuẩn mới" description="Nhà máy sản xuất hiện đại tại Thái Nguyên, được xây dựng với tiêu chuẩn an toàn thực phẩm cao nhất" light />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {[
            { value: "3.300m²", label: "Diện tích nhà máy" },
            { value: "200+", label: "Nhân viên" },
            { value: "50 tấn", label: "Công suất/tháng" },
            { value: "2026", label: "Khánh thành" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <p className="text-3xl font-extrabold text-primary-light">{stat.value}</p>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 grid sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-video rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Ảnh nhà máy {i}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CertificationSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader label="Chứng nhận" title="Cam kết chất lượng" description="Mỗi sản phẩm đều được bảo chứng bởi các tiêu chuẩn và tổ chức uy tín" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-cream text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <cert.icon className="text-secondary" size={28} />
              </div>
              <h3 className="font-bold text-neutral text-lg">{cert.title}</h3>
              <p className="text-gray-500 text-sm mt-2">{cert.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProcessPage() {
  return (
    <>
      <HeroSection />
      <ProcessStepsSection />
      <FactorySection />
      <CertificationSection />
    </>
  );
}
