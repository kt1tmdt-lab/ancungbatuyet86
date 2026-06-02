"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, ExternalLink, ShieldCheck, Flame, Leaf, HelpCircle, Loader } from "lucide-react";

function SpiceLevel({ level }: { level: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Flame 
          key={i} 
          size={14} 
          className={i <= level ? "text-orange-500 fill-orange-500" : "text-slate-200"} 
        />
      ))}
    </span>
  );
}

export default function ProductDetailPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = use(paramsPromise);
  const slug = params.slug;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [otherProducts, setOtherProducts] = useState<any[]>([]);

  useEffect(() => {
    if (slug) {
      // Fetch product detail
      fetch(`/api/products/slug/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setProduct(data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load product", err);
          setLoading(false);
        });

      // Fetch other products
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setOtherProducts(data.filter((p: any) => p.slug !== slug));
          }
        })
        .catch((err) => console.error("Failed to load other products", err));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader className="animate-spin text-orange-500" size={40} />
        <p className="text-sm font-semibold text-slate-400 mt-2">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#F8FAFC] pt-24">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">Sản phẩm không tìm thấy</h1>
          <Link href="/san-pham" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold inline-block shadow">
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Hero - Split viewport */}
      <section className="relative min-h-[90vh] flex items-center bg-white border-b border-slate-100 py-16 sm:py-24 overflow-hidden">
        {/* Ambient Blur */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-orange-500 blur-3xl animate-pulse" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
          <Link 
            href="/san-pham" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-500 text-xs sm:text-sm font-bold mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> 
            <span>Tất cả sản phẩm</span>
          </Link>
          
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Details column */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 space-y-6"
            >
              <span className="bg-orange-500/10 text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {product.categoryLabel}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight">
                {product.name}
              </h1>
              <p className="text-xl sm:text-2xl text-orange-500 font-bold leading-snug">{product.tagline}</p>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-xl">{product.description}</p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                {product.purchaseUrl && (
                  <a 
                    href={product.purchaseUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-sm sm:text-base shadow-lg shadow-orange-500/15 hover:shadow-orange-500/25 transition-all hover:-translate-y-0.5"
                  >
                    <span>Đặt mua ngay</span> 
                    <ExternalLink size={16} />
                  </a>
                )}
                <a 
                  href="#specs" 
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-8 py-4 rounded-2xl font-bold text-sm sm:text-base transition-colors"
                >
                  <span>Thông số sản phẩm</span>
                </a>
              </div>
            </motion.div>

            {/* Right Image column */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.8, delay: 0.2 }} 
              className="lg:col-span-5 flex items-center justify-center"
            >
              <div className="w-full aspect-square max-w-[400px] rounded-3xl overflow-hidden border border-slate-100 shadow-2xl relative bg-slate-50">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Quote */}
      {product.story && (
        <section className="py-24 bg-[#F8FAFC]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.7 }} 
              className="text-center bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 shadow-sm"
            >
              <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-relaxed italic">
                "{product.story}"
              </p>
              <p className="text-orange-500 font-bold text-xs sm:text-sm mt-4 uppercase tracking-widest">— Trích lời Bà Tuyết</p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Ingredients */}
      {Array.isArray(product.ingredients) && product.ingredients.length > 0 && (
        <section className="py-20 bg-white border-t border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              
              {/* Left Image column - Agricultural spice ingredients */}
              <motion.div 
                initial={{ opacity: 0, x: -40 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6 }}
                className="lg:col-span-5"
              >
                <div className="w-full aspect-square rounded-3xl overflow-hidden border border-slate-100 shadow-lg relative bg-slate-50">
                  <img 
                    src="https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80" 
                    alt="Nguyên liệu gia vị sạch Bà Tuyết" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Right description */}
              <motion.div 
                initial={{ opacity: 0, x: 40 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6, delay: 0.2 }} 
                className="lg:col-span-7 space-y-4"
              >
                <span className="bg-orange-500/10 text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Nguyên liệu sạch
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tinh hoa nông sản Việt</h2>
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                  Chúng tôi cam kết sử dụng nguồn nguyên liệu sạch tự nhiên thu hoạch trực tiếp từ các nông trại Việt Nam đạt tiêu chuẩn VietGAP. Tẩm ướp tự nhiên, không sử dụng phẩm màu hóa chất độc hại hay chất bảo quản nhân tạo.
                </p>
                
                <ul className="grid sm:grid-cols-2 gap-4 pt-4">
                  {(product.ingredients as string[]).map((ingredient, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100/60"
                    >
                      <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-sm shadow-orange-500/10">
                        ✓
                      </div>
                      <span className="text-slate-800 text-xs sm:text-sm font-semibold">{ingredient}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Production Process steps */}
      {Array.isArray(product.processSteps) && product.processSteps.length > 0 && (
        <section className="py-20 bg-slate-900 text-white relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              className="text-center mb-16 space-y-2"
            >
              <span className="text-orange-400 text-xs font-bold uppercase tracking-wider">Hành trình khép kín</span>
              <h2 className="text-3xl font-extrabold tracking-tight">Quy trình sản xuất an toàn</h2>
            </motion.div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(product.processSteps as any[]).map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-slate-800/40 border border-slate-800 rounded-3xl p-6 hover:bg-slate-800/80 transition-colors duration-300 space-y-3"
                >
                  <span className="text-3xl font-black text-orange-400/20">0{step.step}</span>
                  <h3 className="text-base font-bold text-white">{step.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product statistics details */}
      {Array.isArray(product.stats) && product.stats.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {(product.stats as any[]).map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center space-y-1"
                >
                  <p className="text-3xl sm:text-4xl font-black tracking-tight">{stat.value}</p>
                  <p className="text-white/80 text-xs sm:text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Spicy / Flavors Variants */}
      {Array.isArray(product.variants) && product.variants.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              className="text-center mb-12 space-y-2"
            >
              <span className="text-orange-500 text-xs font-bold uppercase tracking-wider">Hương vị lựa chọn</span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Chọn vị ưa thích của bạn</h2>
            </motion.div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(product.variants as any[]).map((variant, i) => (
                <motion.div
                  key={`${variant.name}-${variant.weight}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-orange-50/20 hover:border-orange-200 transition-all duration-300"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">{variant.name}</h3>
                    <p className="text-xs text-slate-400 font-semibold">{variant.weight}</p>
                    {variant.spiceLevel !== undefined && (
                      <div className="pt-1 flex items-center gap-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Cấp độ cay:</span>
                        <SpiceLevel level={variant.spiceLevel} />
                      </div>
                    )}
                  </div>
                  <span className="text-base sm:text-lg font-black text-orange-500">{variant.price}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Specifications details */}
      {Array.isArray(product.specs) && product.specs.length > 0 && (
        <section id="specs" className="py-20 bg-[#F8FAFC] border-t border-slate-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              className="text-center mb-8"
            >
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Thông số chi tiết</h2>
            </motion.div>
            
            <div className="bg-white rounded-3xl border border-slate-150 overflow-hidden shadow-sm">
              {(product.specs as any[]).map((spec, i) => (
                <div 
                  key={spec.label} 
                  className={`flex items-center justify-between px-6 py-4 text-xs sm:text-sm ${
                    i < (product.specs as any[]).length - 1 ? "border-b border-slate-100" : ""
                  }`}
                >
                  <span className="text-slate-500 font-bold">{spec.label}</span>
                  <span className="font-extrabold text-slate-900 text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic CTAs and Trust badges */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Đặt mua ngay {product.name}</h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">Mức giá chỉ từ {product.price} — Vận chuyển hỏa tốc toàn quốc</p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <a 
                href="https://tiktok.com/@batuyethanhvi" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-md transition-all hover:-translate-y-0.5"
              >
                <span>TikTok Shop</span> 
                <ExternalLink size={16} />
              </a>
              {product.purchaseUrl && (
                <a 
                  href={product.purchaseUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 transition-all hover:-translate-y-0.5"
                >
                  <span>Shopee chính hãng</span> 
                  <ExternalLink size={16} />
                </a>
              )}
              <Link 
                href="/he-thong-ban" 
                className="inline-flex items-center gap-2 bg-slate-100 text-slate-850 px-8 py-4 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
              >
                <span>Tìm cửa hàng gần bạn</span> 
                <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-10 pt-8 border-t border-slate-100 text-xs text-slate-500 font-bold">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-orange-500" />
                <span>Bảo hiểm trách nhiệm PVI 100%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Leaf size={16} className="text-orange-500" />
                <span>Nguyên liệu 100% Việt Nam</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HelpCircle size={16} className="text-orange-500" />
                <span>Nhà máy đạt chuẩn HACCP</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Products list */}
      {otherProducts.length > 0 && (
        <section className="py-16 bg-[#F8FAFC] border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight text-center mb-8">
              Khám phá các sản phẩm khác
            </h3>
            
            <div className="grid sm:grid-cols-3 gap-6">
              {otherProducts.slice(0, 3).map((p) => (
                <Link 
                  key={p.id} 
                  href={`/san-pham/${p.slug}`} 
                  className="group flex items-center gap-4 bg-white rounded-2xl p-4 border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-50 bg-slate-50 relative">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm group-hover:text-orange-500 transition-colors truncate">
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-semibold truncate mt-0.5">{p.tagline}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
