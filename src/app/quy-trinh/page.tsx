"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { normalizeMarketingConfig, type PageAssetItem } from "@/lib/marketing-config";
import {
  ArrowRight,
  Award,
  BarChart3,
  ClipboardCheck,
  ExternalLink,
  Factory,
  FileCheck,
  FlaskConical,
  Package,
  ScanLine,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Sprout,
  Thermometer,
  Truck,
} from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

const sources = {
  dantri2025: "/tin-tuc/hanh-trinh-ky-dieu-cua-an-cung-ba-tuyet",
  znewsFactory: "/tin-tuc/khanh-thanh-nha-may-3300m2",
  tiktokCase: "/tin-tuc/top-1-tiktok-shop-an-vat",
};


const processSteps = [
  {
    step: "01",
    imageKey: "farm",
    title: "Nguồn nguyên liệu",
    subtitle: "Bắt đầu từ đầu vào rõ ràng",
    description:
      "Nguyên liệu cần được chọn lọc, ghi nhận theo lô và lưu lại thông tin nhà cung cấp để dễ kiểm tra khi cần truy xuất.",
    icon: Sprout,
    tags: ["Nhà cung cấp", "Phiếu nhập", "Nguồn gốc"],
  },
  {
    step: "02",
    imageKey: "inspect",
    title: "Sơ chế & kiểm tra",
    subtitle: "Không đưa nguyên liệu lỗi vào sản xuất",
    description:
      "Trước khi chế biến, nguyên liệu cần được kiểm tra cảm quan, phân loại và loại bỏ những phần không đạt yêu cầu.",
    icon: Search,
    tags: ["Kiểm tra đầu vào", "Phân loại", "Ghi nhận lô"],
  },
  {
    step: "03",
    imageKey: "cooking",
    title: "Chế biến",
    subtitle: "Kiểm soát bằng quy trình",
    description:
      "Mỗi dòng sản phẩm có công thức, thời gian xử lý và điều kiện chế biến riêng để giữ hương vị ổn định giữa các lô.",
    icon: Thermometer,
    tags: ["Công thức", "Nhiệt độ", "Thời gian"],
  },
  {
    step: "04",
    imageKey: "qc",
    title: "QC chất lượng",
    subtitle: "Kiểm tra trước khi đóng gói",
    description:
      "Sản phẩm sau chế biến cần được kiểm tra lại về cảm quan, bao bì, hạn dùng và thông tin lô trước khi đưa sang đóng gói.",
    icon: FlaskConical,
    tags: ["QC", "Lưu mẫu", "Biên bản"],
    highlight: true,
  },
  {
    step: "05",
    imageKey: "packaging",
    title: "Đóng gói",
    subtitle: "Rõ nhãn, rõ lô, rõ hạn dùng",
    description:
      "Bao bì là điểm chạm quan trọng với khách hàng: cần thể hiện rõ ngày sản xuất, hạn sử dụng, thành phần và mã truy xuất nếu có.",
    icon: Package,
    tags: ["NSX / HSD", "Mã lô", "QR truy xuất"],
  },
  {
    step: "06",
    imageKey: "delivery",
    title: "Giao đến khách hàng",
    subtitle: "Đóng gói chắc, vận chuyển đúng cách",
    description:
      "Khâu vận chuyển cần đảm bảo sản phẩm không bị móp, rách, phồng gói hoặc ảnh hưởng chất lượng trong quá trình giao hàng.",
    icon: Truck,
    tags: ["Đóng thùng", "Vận chuyển", "Theo dõi đơn"],
  },
];

const proofStats = [
  {
    value: "3.300m²",
    label: "nhà máy mới",
    description: "Ăn Cùng Bà Tuyết đưa vào vận hành nhà máy sản xuất khép kín quy mô 3.300m² tại Thái Nguyên.",
    sourceName: "Bản tin ACBT",
    sourceUrl: sources.znewsFactory,
  },
  {
    value: "96 tỷ",
    label: "doanh thu gần 6 tháng",
    description:
      "Cột mốc tăng trưởng ấn tượng trong nửa đầu năm với tổng doanh thu đạt 96 tỷ đồng.",
    sourceName: "Bản tin ACBT",
    sourceUrl: sources.dantri2025,
  },
  {
    value: "868.000+",
    label: "sản phẩm bán ra",
    description:
      "Ghi nhận sức mua lớn của khách hàng đối với các sản phẩm chính hãng trong nửa đầu năm.",
    sourceName: "Bản tin ACBT",
    sourceUrl: sources.dantri2025,
  },
  {
    value: "39M+",
    label: "lượt hiển thị PSA",
    description: "Tối ưu hóa các chiến dịch quảng cáo mua sắm giúp đưa thương hiệu tiếp cận rộng rãi.",
    sourceName: "Bản tin ACBT",
    sourceUrl: sources.tiktokCase,
  },
];

const documents = [
  {
    icon: FileCheck,
    title: "Giấy phép / hồ sơ ATTP",
    description:
      "Hồ sơ an toàn thực phẩm giúp khách hàng và đối tác kiểm chứng tiêu chuẩn vận hành của thương hiệu.",
  },
  {
    icon: Shield,
    title: "Bảo hiểm / cam kết sản phẩm",
    description:
      "Các cam kết và bảo chứng sản phẩm được lưu trữ rõ ràng để tăng mức độ an tâm khi sử dụng.",
  },
  {
    icon: Award,
    title: "Phiếu kiểm nghiệm",
    description:
      "Kết quả kiểm nghiệm chất lượng sản phẩm định kỳ đảm bảo các chỉ số lý hóa, vi sinh an toàn tuyệt đối trước khi phân phối.",
  },
  {
    icon: ScanLine,
    title: "QR truy xuất",
    description:
      "Thông tin truy xuất giúp khách hàng kiểm tra nguồn gốc và lô sản xuất khi cần.",
  },
];

function SourceLink({
  name,
  url,
  dark = false,
}: {
  name: string;
  url: string;
  dark?: boolean;
}) {
  const isExternal = url.startsWith("http");

  return (
    <Link
      href={url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className={`inline-flex items-center gap-1 text-xs font-semibold underline underline-offset-4 ${dark
          ? "text-primary-light hover:text-white"
          : "text-primary hover:text-primary-dark"
        }`}
    >
      Xem bài viết: {name}
      {isExternal ? <ExternalLink size={12} /> : <ArrowRight size={12} />}
    </Link>
  );
}

function ImageBlock({
  src,
  label,
  linkUrl,
  className = "",
}: {
  src?: string;
  label: string;
  linkUrl?: string;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center border border-dashed border-orange-200 bg-cream px-6 text-center text-xs font-black uppercase tracking-[0.16em] text-primary ${className}`}
      >
        Chua co anh tu CMS
      </div>
    );
  }

  const content = (
    <div
      className={`relative overflow-hidden bg-cream ${className}`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
        style={{ backgroundImage: `url("${src}")` }}
      />
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute left-5 right-5 bottom-5">
        <p className="inline-flex bg-white/90 px-4 py-2 text-sm font-bold text-neutral backdrop-blur">
          {label}
        </p>
      </div>
    </div>
  );

  if (!linkUrl) return content;

  const isExternal = linkUrl.startsWith("http");
  return (
    <Link href={linkUrl} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noreferrer" : undefined}>
      {content}
    </Link>
  );
}

function HeroSection({ images, links }: { images: Record<string, string>; links: Record<string, string> }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.55], [0, -120]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center bg-neutral text-white overflow-hidden"
    >
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={images.factory ? { backgroundImage: `url("${images.factory}")` } : undefined}
        />
        <div className="absolute inset-0 bg-neutral/85" />
        <div className="absolute -top-40 -right-28 w-[620px] h-[620px] rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-0 -left-28 w-[460px] h-[460px] rounded-full bg-orange-400/20 blur-3xl" />
      </div>

      <motion.div
        style={{ opacity, y }}
        className="max-w-7xl mx-auto px-4 sm:px-6 py-24 relative z-10 w-full"
      >
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-4 py-2 text-primary-light text-sm font-semibold uppercase tracking-wider"
            >
              <Sparkles size={16} />
              Quy trình sản xuất

            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl sm:text-6xl lg:text-8xl font-extrabold mt-6 leading-[0.95]"
            >
              Từ đầu vào
              <br />
              đến từng gói
              <br />
              <span className="text-primary-light">gửi đi.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="text-gray-300 text-lg mt-7 max-w-2xl leading-relaxed"
            >
              Tổ hợp nhà máy sản xuất khép kín quy mô lớn, tuân thủ nghiêm ngặt các tiêu chuẩn quản lý chất lượng quốc tế ISO 22000 & HACCP, mang đến những sản phẩm đồ ăn vặt thơm ngon, an toàn tuyệt đối cho sức khỏe người tiêu dùng.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3 mt-9"
            >
              {["Tiêu chuẩn HACCP", "Công nghệ sấy lạnh", "Kiểm soát 6 bước nghiêm ngặt"].map(
                (item) => (
                  <span
                    key={item}
                    className="bg-white/10 border border-white/10 px-5 py-3 text-sm font-semibold backdrop-blur"
                  >
                    {item}
                  </span>
                )
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="relative hidden lg:block"
          >
            <div className="grid grid-cols-2 gap-4">
              <ImageBlock
                src={images.farm}
                linkUrl={links.farm}
                label="Nguyên liệu "
                className="aspect-[3/4] mt-12"
              />
              <div className="space-y-4">
                <ImageBlock
                  src={images.packaging}
                  linkUrl={links.packaging}
                  label="Đóng gói "
                  className="aspect-square"
                />
                <ImageBlock
                  src={images.qc}
                  linkUrl={links.qc}
                  label="QC "
                  className="aspect-square"
                />
              </div>
            </div>

            <div className="absolute -bottom-6 left-8 right-8 bg-white text-neutral p-5 shadow-2xl">
              <p className="text-sm text-gray-500">Cam kết chất lượng</p>
              <p className="text-xl font-extrabold">
                Tự động hóa hoàn toàn, đảm bảo vô trùng trong mọi công đoạn.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-white/30 flex justify-center pt-2"
        >
          <div className="w-1.5 h-3 bg-white/50" />
        </motion.div>
      </div>
    </section>
  );
}

function ProcessStepsSection({ images, links }: { images: Record<string, string>; links: Record<string, string> }) {
  return (
    <section id="process-steps" className="scroll-mt-24 py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          label="Quy trình khép kín"
          title="Hành trình sản xuất chuẩn công nghiệp"
          description="Hệ thống kiểm soát chất lượng từ khâu chọn lọc nguyên liệu thô tại trang trại đến sản phẩm hoàn thiện trao tay khách hàng."
        />

        <div className="mt-16 space-y-10">
          {processSteps.map((step, i) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className={`grid lg:grid-cols-12 gap-6 items-stretch ${i % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
              >
                <div className="lg:col-span-5">
                  <ImageBlock
                    src={images[step.imageKey]}
                    linkUrl={links[step.imageKey]}
                    label={step.title}
                    className="aspect-[4/3] h-full min-h-[320px]"
                  />
                </div>

                <div
                  className={`lg:col-span-7 p-8 sm:p-10 border relative overflow-hidden ${step.highlight
                    ? "bg-neutral text-white border-neutral"
                    : "bg-cream border-black/5 text-neutral"
                    }`}
                >
                  <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-primary/20 blur-3xl" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <p
                          className={`text-7xl sm:text-8xl font-extrabold leading-none ${step.highlight
                            ? "text-white/10"
                            : "text-primary/15"
                            }`}
                        >
                          {step.step}
                        </p>

                        <h2 className="text-3xl sm:text-4xl font-extrabold -mt-5">
                          {step.title}
                        </h2>

                        <p
                          className={`font-semibold mt-2 ${step.highlight
                            ? "text-primary-light"
                            : "text-primary"
                            }`}
                        >
                          {step.subtitle}
                        </p>
                      </div>

                      <div
                        className={`w-16 h-16 shrink-0 flex items-center justify-center ${step.highlight
                          ? "bg-primary/20"
                          : "bg-white shadow-sm"
                          }`}
                      >
                        <Icon
                          className={
                            step.highlight ? "text-primary-light" : "text-primary"
                          }
                          size={30}
                        />
                      </div>
                    </div>

                    <p
                      className={`text-lg leading-relaxed mt-6 max-w-2xl ${step.highlight ? "text-gray-300" : "text-gray-600"
                        }`}
                    >
                      {step.description}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-8">
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-4 py-2 text-sm font-bold ${step.highlight
                            ? "bg-white/10 text-white border border-white/10"
                            : "bg-white text-neutral border border-black/5"
                            }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div
                      className={`mt-8 p-5 ${step.highlight ? "bg-white/10" : "bg-white"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <ClipboardCheck
                          className={
                            step.highlight ? "text-primary-light" : "text-primary"
                          }
                          size={22}
                        />
                        <p className="font-bold">Hồ sơ kiểm soát</p>
                      </div>
                      <p
                        className={`text-sm leading-relaxed mt-2 ${step.highlight ? "text-gray-300" : "text-gray-500"
                          }`}
                      >
                        Hình ảnh ghi nhận thực tế tại nhà xưởng, hồ sơ lưu mẫu và phiếu kiểm tra kiểm soát chỉ số lý hóa, vi sinh của từng lô sản xuất.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FactorySection({ images, links }: { images: Record<string, string>; links: Record<string, string> }) {
  return (
    <section id="process-factory" className="scroll-mt-24 py-24 bg-neutral text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={images.factory ? { backgroundImage: `url("${images.factory}")` } : undefined}
        />
        <div className="absolute inset-0 bg-neutral/85" />
        <div className="absolute -right-40 -top-40 w-[560px] h-[560px] rounded-full bg-primary/25 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-4 py-2 text-primary-light text-sm font-semibold uppercase tracking-wider">
              <Factory size={16} />
              Nhà xưởng
            </span>

            <h2 className="text-4xl sm:text-6xl font-extrabold mt-5 leading-tight">
              Tổ hợp nhà máy
              <br />
              <span className="text-primary-light">quy mô và hiện đại.</span>
            </h2>

            <p className="text-gray-300 text-lg leading-relaxed mt-6">
              Ăn Cùng Bà Tuyết chính thức đưa vào hoạt động tổ hợp nhà máy sản xuất khép kín quy mô lớn hơn 3.300m² tại Thái Nguyên để nâng cao công suất và kiểm soát chất lượng đồ ăn vặt sạch đạt chứng nhận quốc tế HACCP.
            </p>

            <div className="mt-7">
              <SourceLink name="Bản tin ACBT" url={sources.znewsFactory} dark />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ImageBlock
              src={images.factory}
              linkUrl={links.factory}
              label="Xưởng sản xuất"
              className="aspect-[3/4] col-span-1"
            />

            <div className="space-y-4">
              <div className="bg-white text-neutral p-7">
                <p className="text-sm font-bold text-primary uppercase tracking-wider">
                  Diện tích xưởng
                </p>
                <p className="text-5xl font-extrabold mt-4">3.300m²</p>
                <p className="text-gray-500 text-sm mt-3">
                  Nhà máy đạt chứng nhận ISO 22000:2018.
                </p>
              </div>

              <ImageBlock
                src={images.packaging}
                linkUrl={links.packaging}
                label="Khu đóng gói"
                className="aspect-square"
              />
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {proofStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="bg-white/10 border border-white/10 p-6 backdrop-blur"
            >
              <p className="text-4xl font-extrabold text-primary-light">
                {stat.value}
              </p>
              <h3 className="font-bold mt-2">{stat.label}</h3>
              <p className="text-gray-300 text-sm leading-relaxed mt-3">
                {stat.description}
              </p>

              <div className="mt-6">
                <SourceLink
                  name={stat.sourceName}
                  url={stat.sourceUrl}
                  dark
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DocumentationSection({ images, links }: { images: Record<string, string>; links: Record<string, string> }) {
  return (
    <section id="process-documents" className="scroll-mt-24 py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
          <div>
            <SectionHeader
              label="Chứng thực chất lượng"
              title="Hồ sơ pháp lý đầy đủ và minh bạch"
              description="Hệ thống chứng nhận chất lượng, giấy phép đủ điều kiện vệ sinh an toàn thực phẩm và kết quả kiểm nghiệm định kỳ từ cơ quan chức năng."
            />

            <ImageBlock
              src={images.documents}
              linkUrl={links.documents}
              label="Hồ sơ"
              className="aspect-[16/10] mt-10"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {documents.map((doc, i) => {
              const Icon = doc.icon;

              return (
                <motion.div
                  key={doc.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="bg-white p-7 border border-black/5 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="w-14 h-14 bg-primary/10 flex items-center justify-center mb-5">
                    <Icon className="text-primary" size={27} />
                  </div>

                  <h3 className="text-xl font-extrabold text-neutral">
                    {doc.title}
                  </h3>

                  <p className="text-gray-500 text-sm leading-relaxed mt-3">
                    {doc.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className="w-20 h-20 bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="text-primary" size={34} />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral leading-tight">
            Bảo chứng từ sự tận tâm.
          </h2>

          <p className="text-gray-500 mt-5 leading-relaxed">
            Chúng tôi tự hào là đơn vị tiên phong chuẩn hóa quy trình sản xuất đồ ăn vặt tại Việt Nam, mang đến giá trị thực sự cho cộng đồng.
          </p>

          <div className="mt-9">
            <Link
              href="/san-pham"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
            >
              Xem sản phẩm
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function ProcessPage() {
  const [postImagesBySlug, setPostImagesBySlug] = useState<Record<string, string>>({});
  const [pageAssets, setPageAssets] = useState<PageAssetItem[]>([]);

  useEffect(() => {
    fetch("/api/posts?status=PUBLISHED")
      .then((res) => res.json())
      .then((data: { slug?: string | null; coverImageUrl?: string | null }[]) => {
        if (!Array.isArray(data)) return;
        setPostImagesBySlug(data.reduce<Record<string, string>>((acc, post) => {
          if (post.slug && post.coverImageUrl) acc[post.slug] = post.coverImageUrl;
          return acc;
        }, {}));
      })
      .catch((err) => {
        console.error("Failed to load process images from DB", err);
      });
  }, []);

  useEffect(() => {
    fetch("/api/settings/marketing")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setPageAssets(normalizeMarketingConfig(data?.data).pageAssets);
      })
      .catch((err) => {
        console.error("Failed to load configurable process assets", err);
      });
  }, []);

  const assetByKey = pageAssets.reduce<Record<string, PageAssetItem>>((acc, item) => {
    if (item.key) acc[item.key] = item;
    return acc;
  }, {});

  const images = {
    farm: assetByKey.process_farm?.imageUrl || postImagesBySlug["hau-truong-san-xuat-chan-ga"],
    inspect: assetByKey.process_inspect?.imageUrl || postImagesBySlug["hau-truong-san-xuat-chan-ga"],
    cooking: assetByKey.process_cooking?.imageUrl || postImagesBySlug["hanh-trinh-ky-dieu-cua-an-cung-ba-tuyet"],
    qc: assetByKey.process_qc?.imageUrl || postImagesBySlug["bao-hiem-pvi-cho-nguoi-tieu-dung"],
    packaging: assetByKey.process_packaging?.imageUrl || postImagesBySlug["hanh-trinh-ky-dieu-cua-an-cung-ba-tuyet"],
    delivery: assetByKey.process_delivery?.imageUrl || postImagesBySlug["top-1-tiktok-shop-an-vat"],
    factory: assetByKey.process_factory?.imageUrl || postImagesBySlug["khanh-thanh-nha-may-3300m2"],
    documents: assetByKey.process_documents?.imageUrl || postImagesBySlug["bao-hiem-pvi-cho-nguoi-tieu-dung"],
    ...postImagesBySlug,
  };
  const links = {
    farm: assetByKey.process_farm?.linkUrl || "",
    inspect: assetByKey.process_inspect?.linkUrl || "",
    cooking: assetByKey.process_cooking?.linkUrl || "",
    qc: assetByKey.process_qc?.linkUrl || "",
    packaging: assetByKey.process_packaging?.linkUrl || "",
    delivery: assetByKey.process_delivery?.linkUrl || "",
    factory: assetByKey.process_factory?.linkUrl || "",
    documents: assetByKey.process_documents?.linkUrl || "",
  };

  return (
    <>
      <HeroSection images={images} links={links} />
      <ProcessStepsSection images={images} links={links} />
      <FactorySection images={images} links={links} />
      <DocumentationSection images={images} links={links} />
      <CTASection />
    </>
  );
}
