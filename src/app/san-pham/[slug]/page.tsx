"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, ExternalLink, Shield, Leaf, Flame } from "lucide-react";
import { getProductBySlug, products } from "@/data/products";

function SpiceLevel({ level }: { level: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Flame key={i} size={14} className={i <= level ? "text-primary fill-primary" : "text-gray-200"} />
      ))}
    </span>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral">Sản phẩm không tìm thấy</h1>
          <Link href="/san-pham" className="text-primary mt-4 inline-block">Quay lại danh sách sản phẩm</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero - Full viewport */}
      <section className="min-h-screen flex items-center bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-primary blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative z-10 w-full">
          <Link href="/san-pham" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary text-sm font-medium mb-8 transition-colors">
            <ArrowLeft size={16} /> Tất cả sản phẩm
          </Link>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">{product.categoryLabel}</span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-neutral mt-3 leading-[1.05]">{product.name}</h1>
              <p className="text-xl sm:text-2xl text-gray-400 mt-4 font-medium">{product.tagline}</p>
              <p className="text-gray-500 mt-6 text-lg leading-relaxed max-w-lg">{product.description}</p>
              <div className="flex flex-wrap gap-4 mt-8">
                <a href="https://shopee.vn/nmtvlog99" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-semibold transition-colors">
                  Mua ngay <ExternalLink size={16} />
                </a>
                <a href="#specs" className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-neutral px-8 py-4 rounded-full font-semibold transition-colors">
                  Thông số
                </a>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex items-center justify-center">
              <div className="w-80 h-80 lg:w-[28rem] lg:h-[28rem] rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <div className="w-60 h-60 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <span className="text-7xl lg:text-9xl font-extrabold text-primary/20">{product.name.charAt(0)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center">
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral leading-relaxed">
              {product.story}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ingredients - Apple style */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="w-full aspect-square rounded-3xl bg-gradient-to-br from-secondary/10 to-secondary/5 flex items-center justify-center">
                <Leaf className="text-secondary/30" size={120} />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Nguyên liệu</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral mt-3">Thuần khiết từ nguồn</h2>
              <p className="text-gray-500 mt-4 text-lg leading-relaxed">
                Chúng tôi tuyển chọn từng nguyên liệu với tiêu chuẩn khắt khe nhất — bởi vì Bà Tuyết làm đồ ăn cho con cháu nhà mình ăn.
              </p>
              <ul className="mt-8 space-y-4">
                {product.ingredients.map((ingredient, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                      <span className="text-secondary text-sm font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">{ingredient}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-24 bg-neutral text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-primary-light text-sm font-semibold uppercase tracking-wider">Quy trình</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">Hành trình tạo nên sản phẩm</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.processSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <span className="text-4xl font-extrabold text-primary-light/30">0{step.step}</span>
                <h3 className="text-lg font-bold mt-2">{step.title}</h3>
                <p className="text-gray-400 mt-2 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {product.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl font-extrabold">{stat.value}</p>
                <p className="text-white/70 text-sm mt-1 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Variants */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Hương vị</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral mt-3">Chọn vị yêu thích</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.variants.map((variant, i) => (
              <motion.div
                key={`${variant.name}-${variant.weight}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-center justify-between p-5 rounded-2xl bg-cream hover:bg-red-50/50 transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-neutral">{variant.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{variant.weight}</p>
                  {variant.spiceLevel !== undefined && <SpiceLevel level={variant.spiceLevel} />}
                </div>
                <span className="text-lg font-bold text-primary">{variant.price}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specs */}
      <section id="specs" className="py-24 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral">Thông số kỹ thuật</h2>
          </motion.div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {product.specs.map((spec, i) => (
              <div key={spec.label} className={`flex items-center justify-between px-6 py-4 ${i < product.specs.length - 1 ? "border-b border-gray-100" : ""}`}>
                <span className="text-gray-500 font-medium">{spec.label}</span>
                <span className="font-semibold text-neutral text-right">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buy CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral">Mua {product.name}</h2>
            <p className="text-gray-500 mt-3 text-lg">Từ {product.price} — Giao hàng toàn quốc</p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <a href="https://tiktok.com/@batuyethanhvi" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-neutral text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors">
                TikTok Shop <ExternalLink size={16} />
              </a>
              <a href="https://shopee.vn/nmtvlog99" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-dark transition-colors">
                Shopee <ExternalLink size={16} />
              </a>
              <Link href="/he-thong-ban" className="inline-flex items-center gap-2 bg-gray-100 text-neutral px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition-colors">
                Tìm cửa hàng <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield size={16} className="text-secondary" /> Bảo hiểm PVI
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Leaf size={16} className="text-secondary" /> Không chất bảo quản
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Other products */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h3 className="text-xl font-bold text-neutral text-center mb-8">Sản phẩm khác</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {products.filter((p) => p.slug !== slug).map((p) => (
              <Link key={p.id} href={`/san-pham/${p.slug}`} className="group flex items-center gap-4 bg-white rounded-2xl p-4 hover:shadow-lg transition-shadow">
                <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  <span className="text-2xl font-bold text-gray-300">{p.name.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="font-bold text-neutral group-hover:text-primary transition-colors">{p.name}</h4>
                  <p className="text-sm text-gray-500">{p.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
