"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Factory,
  Award,
  TrendingUp,
  Sparkles,
  Users,
  Play,
  CheckCircle2,
  Flame,
  ShoppingBag,
  Star,
  Leaf,
  Truck,
  Clock3,
  BadgeCheck,
  PackageCheck,
  Quote,
  ChevronRight,
  Zap,
  type LucideIcon,
} from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

type Product = {
  id?: string | number;
  slug?: string;
  name?: string;
  image?: string;
  category?: string;
  categoryLabel?: string;
  tagline?: string;
  priceRange?: string;
  price?: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

function MagneticGlowCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [pos, setPos] = useState({ x: 50, y: 50 });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, rgba(249,115,22,0.22), transparent 32%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ==========================================
// 1. HERO SECTION - CINEMATIC PREMIUM
// ==========================================
const flagshipHeroProductsFallback = [
  {
    slug: "chan-ga",
    category: "chan-ga",
    name: "Chân Gà Rút Xương",
    tagline: "Giòn sần sật, đậm đà vị cay tê, sạch từ nguồn đạt chuẩn HACCP.",
    price: "89.000đ",
    priceRange: "45.000đ - 189.000đ",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80",
    purchaseUrl: "https://shopee.vn/an-vat-ba-tuyet-chan-ga",
    stats: [{ label: "Đơn đã bán", value: "2.000.000+" }]
  },
  {
    slug: "tam-cay",
    category: "tam-cay",
    name: "Tăm Cay Hạng Nhất",
    tagline: "Cay đã, cay sạch, chuẩn vị tuổi thơ Việt Nam. Càng ăn càng cuốn.",
    price: "35.000đ",
    priceRange: "15.000đ - 99.000đ",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=80",
    purchaseUrl: "https://shopee.vn/an-vat-ba-tuyet-tam-cay",
    stats: [{ label: "Đơn đã bán", value: "1.500.000+" }]
  },
  {
    slug: "banh-trang",
    category: "banh-trang",
    name: "Snack Bánh Tráng",
    tagline: "Giòn rụm từ gạo thuần Việt thơm lừng kết hợp hành phi thơm bùi.",
    price: "29.000đ",
    priceRange: "12.000đ - 79.000đ",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80",
    purchaseUrl: "https://shopee.vn/an-vat-ba-tuyet-banh-trang",
    stats: [{ label: "Đơn đã bán", value: "800.000+" }]
  }
];

type Particle = {
  id: number;
  x: string;
  y: string;
  size: number;
  delay: number;
  duration: number;
  emoji: string;
};

function HeroSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<any>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Tải sản phẩm từ database
  useEffect(() => {
    fetch("/api/products?featured=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Chỉ lấy các sản phẩm chính (bỏ qua 'khac')
          const flagships = data.filter((p: any) => p.category !== "khac").slice(0, 3);
          if (flagships.length > 0) {
            setProducts(flagships);
            setActiveTab(flagships[0]);
            setLoading(false);
            return;
          }
        }
        // Fallback nếu rỗng
        setProducts(flagshipHeroProductsFallback);
        setActiveTab(flagshipHeroProductsFallback[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load hero products from DB, using fallback", err);
        setProducts(flagshipHeroProductsFallback);
        setActiveTab(flagshipHeroProductsFallback[0]);
        setLoading(false);
      });
  }, []);

  // Tạo hiệu ứng hạt bay
  useEffect(() => {
    if (!activeTab) return;
    const cat = activeTab.category || "chan-ga";
    const count = 10;
    const emojis = cat === "chan-ga"
      ? ["🌶️", "🔥", "✨", "🌶️"]
      : cat === "tam-cay"
      ? ["🌶️", "💥", "🔥", "⚡"]
      : ["🧅", "🌾", "✨", "🍘"];

    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: `${15 + Math.random() * 70}%`,
        y: `${20 + Math.random() * 60}%`,
        size: 12 + Math.floor(Math.random() * 16),
        delay: Math.random() * 1.5,
        duration: 3 + Math.random() * 3,
        emoji: emojis[i % emojis.length],
      });
    }
    setParticles(newParticles);
  }, [activeTab]);

  const handleScrollToStory = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("brand-story");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const miniStats = [
    { label: "Đơn thành công", value: "6.2M+" },
    { label: "Cộng đồng", value: "3.2M+" },
    { label: "Nhà máy sạch", value: "3.300m²" },
  ];

  // Màu sắc chủ đề động theo tab sản phẩm
  const activeTheme = useMemo(() => {
    if (!activeTab) {
      return {
        glowColor: "rgba(249, 115, 22, 0.35)", // Orange
        gradient: "from-orange-500 via-amber-500 to-orange-600",
        btnGradient: "from-orange-500 to-amber-500",
        glowRing: "border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.2)]",
        badgeText: "CHỦ LỰC BÁN CHẠY #1",
        activeBtn: "bg-orange-500 text-white shadow-orange-500/40"
      };
    }
    const cat = activeTab.category;
    if (cat === "tam-cay") {
      return {
        glowColor: "rgba(239, 68, 68, 0.32)", // Red
        gradient: "from-red-600 via-orange-500 to-red-700",
        btnGradient: "from-red-600 to-orange-500",
        glowRing: "border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]",
        badgeText: "CỰC CAY TÊ - CỰC ĐÃ",
        activeBtn: "bg-red-600 text-white shadow-red-600/40"
      };
    } else if (cat === "banh-trang") {
      return {
        glowColor: "rgba(245, 158, 11, 0.3)", // Yellow/Amber
        gradient: "from-amber-500 via-yellow-400 to-amber-600",
        btnGradient: "from-amber-500 to-yellow-500",
        glowRing: "border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.25)]",
        badgeText: "THƠM GIÒN BẢN ĐỊA",
        activeBtn: "bg-amber-500 text-white shadow-amber-500/40"
      };
    } else {
      return {
        glowColor: "rgba(249, 115, 22, 0.35)", // Orange
        gradient: "from-orange-500 via-amber-500 to-orange-600",
        btnGradient: "from-orange-500 to-amber-500",
        glowRing: "border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.2)]",
        badgeText: "CHỦ LỰC BÁN CHẠY #1",
        activeBtn: "bg-orange-500 text-white shadow-orange-500/40"
      };
    }
  }, [activeTab]);

  const salesCount = useMemo(() => {
    if (activeTab?.stats && Array.isArray(activeTab.stats)) {
      const sale = activeTab.stats.find((s: any) => s.label === "Đơn đã bán" || s.label === "Đơn thành công");
      if (sale) return sale.value;
    }
    return activeTab?.sales || "1.000.000+";
  }, [activeTab]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#031018] pt-24 text-white">
      {/* Ambient background with color shifting */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute left-[-10%] top-[-10%] h-[560px] w-[560px] rounded-full blur-[140px] transition-all duration-1000 ease-in-out" 
          style={{ backgroundColor: activeTheme.glowColor }}
        />
        <div className="absolute bottom-[-18%] right-[-10%] h-[620px] w-[620px] rounded-full bg-cyan-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#031018_78%)]" />
      </div>

      {/* Noise layer */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl grid-cols-1 items-center gap-12 px-4 pb-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        
        {/* Left Column: Brand Statement & Story Hook */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          <motion.div
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-orange-300 shadow-[0_0_30px_rgba(249,115,22,0.15)] backdrop-blur-xl"
          >
            <Sparkles size={14} className="text-amber-300 animate-spin-slow" />
            Ăn vặt sạch — chuẩn thương hiệu quốc dân
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl font-black leading-[0.95] tracking-[-0.05em] sm:text-7xl lg:text-[5.8rem]"
          >
            Ăn vặt ngon
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.2)]">
              bung vị đỉnh cao.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-2xl text-base font-medium leading-8 text-slate-350 sm:text-lg"
          >
            Ăn Cùng Bà Tuyết mang trải nghiệm ăn vặt Việt Nam thơm ngon, sạch sẽ.
            Sản xuất khép kín chuẩn HACCP và bảo hiểm PVI bảo chứng an tâm.
          </motion.p>

          {/* Premium Handwritten-Style Story Teaser Card */}
          <motion.div
            variants={fadeUp}
            className="mt-8 relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 backdrop-blur-2xl flex flex-col sm:flex-row items-center gap-5 shadow-2xl shadow-black/30 group hover:border-orange-500/30 transition-all duration-500"
          >
            {/* Pulsing neon frame around logo */}
            <div className="relative shrink-0">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 opacity-60 blur-md group-hover:opacity-100 group-hover:scale-105 transition duration-500 animate-pulse" />
              <img 
                src="/logo-acbt.png" 
                alt="Bà Tuyết" 
                className="relative w-16 h-16 rounded-full border-2 border-white bg-white p-0.5 object-cover" 
              />
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs text-orange-400 font-extrabold uppercase tracking-widest">Lời ngỏ từ Bà Tuyết</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="text-[15px] text-slate-100 font-semibold italic mt-1.5 leading-relaxed font-sans">
                "Bà Tuyết làm đồ ăn vặt sạch như làm cho con cháu mình ăn ở nhà vậy — Ngon, Giòn, Đậm vị, nhìn là muốn ăn ngay!"
              </p>
              <a 
                href="#brand-story" 
                onClick={handleScrollToStory} 
                className="inline-flex items-center gap-1.5 text-xs text-orange-300 hover:text-orange-400 font-black mt-3 transition-all duration-300 group/link"
              >
                <span>Khám phá câu chuyện của tôi ngay</span>
                <ArrowRight size={13} className="group-hover/link:translate-x-1.5 transition-transform" />
              </a>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col gap-4 sm:flex-row"
          >
            <Link
              href="/san-pham"
              className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 text-sm font-black text-white shadow-[0_12px_40px_rgba(249,115,22,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(249,115,22,0.45)]"
            >
              <span className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative">Khám Phá Menu</span>
              <ArrowRight
                size={18}
                className="relative transition-transform group-hover:translate-x-1"
              />
            </Link>

            <a
              href="#brand-story"
              onClick={handleScrollToStory}
              className="group inline-flex items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-8 py-4 text-sm font-black text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.08]"
            >
              Đọc hành trình lập nghiệp
            </a>
          </motion.div>

          {/* Mini Stats Banner */}
          <motion.div
            variants={fadeUp}
            className="mt-10 grid max-w-xl grid-cols-3 gap-3"
          >
            {miniStats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 backdrop-blur-xl hover:bg-white/[0.05] transition"
              >
                <p className="text-xl sm:text-2xl font-black text-white">{item.value}</p>
                <p className="mt-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                  {item.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column: Switcher + High Converting Visual Card */}
        {activeTab && (
          <div className="relative w-full">
            {/* Switcher Tabs */}
            <div className="mb-4 flex gap-1.5 rounded-2xl bg-white/[0.03] p-1.5 border border-white/5 backdrop-blur-lg">
              {products.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => setActiveTab(p)}
                  className={`flex-1 rounded-xl py-3 px-2 text-xs font-black uppercase tracking-wider transition-all duration-500 ${
                    activeTab.slug === p.slug
                      ? `${activeTheme.activeBtn} text-white`
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {p.name.split(" ").slice(0, 2).join(" ")}
                </button>
              ))}
            </div>

            <div className="relative mx-auto aspect-[4/5] max-w-[460px] w-full">
              {/* Colored ambient glow behind card */}
              <div className={`absolute inset-0 rotate-6 rounded-[3rem] transition-all duration-700 blur-md bg-gradient-to-br ${activeTheme.gradient} opacity-20`} />
              <div className="absolute inset-4 -rotate-2 rounded-[3rem] border border-white/10 bg-white/[0.04] backdrop-blur-2xl" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab.slug}
                  initial={{ opacity: 0, scale: 0.96, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className={`relative h-full overflow-hidden rounded-[3rem] border border-white/12 bg-[#06121a]/95 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.55)] backdrop-blur-3xl flex flex-col justify-between`}
                >
                  {/* Floating Spice Particles */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                    {particles.map((p) => (
                      <motion.div
                        key={`${activeTab.slug}-p-${p.id}`}
                        initial={{ opacity: 0, y: 60, scale: 0.5 }}
                        animate={{
                          opacity: [0, 0.8, 0.8, 0],
                          y: -140 - Math.random() * 80,
                          x: [0, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 30],
                          scale: [0.5, 1.1, 1.1, 0.5],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: p.duration,
                          delay: p.delay,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                        className="absolute text-lg select-none"
                        style={{
                          left: p.x,
                          bottom: "22%",
                        }}
                      >
                        {p.emoji}
                      </motion.div>
                    ))}
                  </div>

                  {/* Product Image and Badges */}
                  <div className="relative aspect-[4/3.1] rounded-[2.4rem] overflow-hidden bg-slate-900 border border-white/5">
                    <img
                      src={activeTab.image}
                      alt={activeTab.name}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#031018]/90 via-[#031018]/10 to-transparent" />
                    
                    <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                      <span className="rounded-full bg-orange-500 px-3.5 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-white shadow-lg">
                        ĐÃ BÁN {salesCount}
                      </span>
                      <span className="w-fit rounded-full bg-emerald-500 px-3 py-1 text-[8px] font-black uppercase tracking-wider text-white shadow-md">
                        ✓ Kiểm định HACCP
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-4">
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest ${activeTheme.textColor}`}>
                        {activeTheme.badgeText}
                      </span>
                    </div>
                  </div>

                  {/* Text details */}
                  <div className="p-3 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{activeTab.name}</h3>
                        <span className={`text-lg sm:text-xl font-black ${activeTheme.textColor}`}>{activeTab.price}</span>
                      </div>
                      
                      <div className="mt-1 flex items-center gap-1 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={13} fill="currentColor" />
                        ))}
                        <span className="text-[11px] text-slate-400 font-bold ml-1">4.9/5 (Đánh giá cao)</span>
                      </div>

                      <p className="mt-2.5 text-xs sm:text-sm text-slate-350 leading-relaxed min-h-[40px]">
                        {activeTab.tagline}
                      </p>
                    </div>

                    {/* Dual Checkout CTAs */}
                    <div className="space-y-2 pt-1.5">
                      <div className="flex gap-2">
                        {/* Shopee Button */}
                        <a
                          href={activeTab.purchaseUrl || "https://shopee.vn/nmtvlog99"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#ff4d00] to-[#ff7a00] py-3 px-3 text-xs font-black text-white shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 transition-all duration-300 hover:-translate-y-0.5"
                        >
                          <ShoppingBag size={14} />
                          <span>Đặt Shopee Mall</span>
                        </a>

                        {/* TikTok Shop Button */}
                        <a
                          href="https://www.tiktok.com/@batuyethanhvi"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-white/10 py-3 px-3 text-xs font-black text-white shadow-md hover:shadow-black/25 transition-all duration-300 hover:-translate-y-0.5"
                        >
                          <Play size={12} className="fill-white" />
                          <span>Mua TikTok Shop</span>
                        </a>
                      </div>

                      <Link
                        href={`/san-pham/${activeTab.slug}`}
                        className="block w-full text-center py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-wider text-slate-300 transition-colors"
                      >
                        Xem chi tiết & nguyên liệu
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}    >
                      Chi tiết
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// 2. STATS SECTION
// ==========================================
function StatsSection() {
  const stats: {
    value: string;
    label: string;
    desc: string;
    icon: LucideIcon;
  }[] = [
      {
        value: "3.2M+",
        label: "Followers TikTok",
        desc: "Cộng đồng yêu thích ăn vặt",
        icon: Users,
      },
      {
        value: "6.2M+",
        label: "Đơn thành công",
        desc: "Minh chứng bằng doanh số thật",
        icon: TrendingUp,
      },
      {
        value: "3.300m²",
        label: "Nhà máy chuẩn",
        desc: "Quy trình sản xuất khép kín",
        icon: Factory,
      },
      {
        value: "100%",
        label: "Bảo hiểm PVI",
        desc: "Bảo chứng an tâm cho khách hàng",
        icon: ShieldCheck,
      },
    ];

  return (
    <section className="relative z-20 -mt-16 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-white bg-white/85 p-5 shadow-[0_30px_90px_rgba(15,23,42,0.13)] backdrop-blur-2xl">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.08 }}
                className="group rounded-[2rem] border border-slate-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_20px_50px_rgba(249,115,22,0.12)]"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 transition-all duration-300 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white">
                  <Icon size={26} strokeWidth={1.8} />
                </div>
                <p className="text-4xl font-black tracking-[-0.05em] text-slate-950">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-black uppercase tracking-wider text-slate-800">
                  {stat.label}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {stat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 3. FEATURED PRODUCTS
// ==========================================
function ProductHoverCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const href = `/san-pham/${product.slug || product.id || ""}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="h-full"
    >
      <Link href={href} className="group block h-full">
        <MagneticGlowCard className="h-full rounded-[2.4rem] border border-slate-100 bg-white p-3 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_35px_90px_rgba(249,115,22,0.18)]">
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-100">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={
                  product.image ||
                  "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=900&auto=format&fit=crop&q=85"
                }
                alt={product.name || "Sản phẩm"}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90" />

            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-900 backdrop-blur-xl">
                {product.categoryLabel || "Ăn vặt"}
              </span>
              <span className="rounded-full bg-orange-500 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                Hot
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/15 p-3 text-white backdrop-blur-xl">
                <span className="text-sm font-black">Xem chi tiết</span>
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </div>
          </div>

          <div className="px-4 pb-4 pt-5">
            <div className="mb-3 flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={15} fill="currentColor" />
              ))}
            </div>

            <h3 className="line-clamp-1 text-xl font-black tracking-[-0.03em] text-slate-950 transition-colors group-hover:text-orange-500">
              {product.name || "Sản phẩm nổi bật"}
            </h3>

            <p className="mt-2 line-clamp-2 min-h-[48px] text-sm leading-6 text-slate-500">
              {product.tagline ||
                "Món ăn vặt được tuyển chọn kỹ, chuẩn vị, đóng gói đẹp và an toàn."}
            </p>

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Giá từ
                </p>
                <p className="text-lg font-black text-slate-950">
                  {product.priceRange || product.price || "Liên hệ"}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white transition-all duration-300 group-hover:bg-orange-500">
                <ArrowRight size={18} />
              </div>
            </div>
          </div>
        </MagneticGlowCard>
      </Link>
    </motion.div>
  );
}

function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?featured=true")
      .then((res) => res.json())
      .then((data) => {
        setFeaturedProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed", err);
        setLoading(false);
      });
  }, []);

  // Chỉ lấy tối đa 3 sản phẩm chủ lực tiêu biểu (bỏ qua các món snack khác)
  const displayProducts = useMemo(() => {
    return featuredProducts
      .filter((p) => p.category !== "khac")
      .slice(0, 3);
  }, [featuredProducts]);

  return (
    <section className="relative overflow-hidden bg-[#fbfaf7] py-32">
      <div className="absolute left-0 top-20 h-80 w-80 rounded-full bg-orange-200/35 blur-[100px]" />
      <div className="absolute bottom-10 right-0 h-96 w-96 rounded-full bg-amber-200/40 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            label="Sản phẩm nổi bật"
            title="Tuyệt phẩm ăn vặt"
            description="Những món bán chạy, dễ nghiện, đóng gói đẹp và giữ trọn vị ngon đặc trưng."
          />

          <Link
            href="/san-pham"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-3 text-sm font-black text-orange-600 shadow-sm transition-all hover:-translate-y-1 hover:border-orange-400 hover:shadow-[0_16px_40px_rgba(249,115,22,0.14)]"
          >
            Xem tất cả menu
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-8 md:grid-cols-3"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[470px] animate-pulse rounded-[2.4rem] bg-white shadow-sm"
                />
              ))}
            </motion.div>
          ) : displayProducts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-[2rem] border border-dashed border-slate-200 bg-white p-12 text-center"
            >
              <p className="text-slate-500">Chưa có sản phẩm nổi bật.</p>
            </motion.div>
          ) : (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-8 md:grid-cols-3"
            >
              {displayProducts.map((product, i) => (
                <ProductHoverCard
                  key={product.id || product.slug || i}
                  product={product}
                  index={i}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ==========================================
// 4. SIGNATURE LAYOUTS - Ý TƯỞNG LAYOUT ĐỘC ĐÁO
// ==========================================
function SignatureLayouts() {
  const layouts = useMemo(
    () => [
      {
        key: "shop",
        label: "Shop Layout",
        title: "Layout bán hàng nhanh",
        desc: "Tập trung vào sản phẩm, combo hot, nút mua nổi bật và hiệu ứng bung card khi hover.",
        icon: ShoppingBag,
        image:
          "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=1000&auto=format&fit=crop&q=85",
      },
      {
        key: "factory",
        label: "Factory Layout",
        title: "Layout niềm tin nhà máy",
        desc: "Dùng bento, badge chứng nhận, quy trình sạch và thông số lớn để tăng độ tin cậy.",
        icon: Factory,
        image:
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1000&auto=format&fit=crop&q=85",
      },
      {
        key: "story",
        label: "Story Layout",
        title: "Layout câu chuyện thương hiệu",
        desc: "Timeline, quote, hình ảnh cảm xúc giúp thương hiệu có chiều sâu và dễ nhớ.",
        icon: Quote,
        image:
          "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1000&auto=format&fit=crop&q=85",
      },
    ],
    []
  );

  const [active, setActive] = useState(layouts[0]);
  const ActiveIcon = active.icon;

  return (
    <section className="bg-[#031018] py-32 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-14 max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-orange-300">
            <Zap size={14} />
            Layout concept
          </p>
          <h2 className="text-4xl font-black tracking-[-0.05em] sm:text-5xl">
            3 kiểu layout giúp trang nhìn xịn hơn hẳn
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-400">
            Vẫn giữ logic cũ, nhưng thêm hệ thống trình bày hiện đại để trang có
            chiều sâu: bán hàng, niềm tin và câu chuyện thương hiệu.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-3">
            {layouts.map((item) => {
              const Icon = item.icon;
              const isActive = active.key === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => setActive(item)}
                  className={`group w-full rounded-[2rem] border p-5 text-left transition-all duration-300 ${isActive
                    ? "border-orange-400/40 bg-orange-500 text-white shadow-[0_24px_80px_rgba(249,115,22,0.22)]"
                    : "border-white/10 bg-white/[0.05] hover:bg-white/[0.08]"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-13 w-13 items-center justify-center rounded-2xl ${isActive ? "bg-white text-orange-500" : "bg-white/10"
                        }`}
                    >
                      <Icon size={23} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black uppercase tracking-wider">
                        {item.label}
                      </p>
                      <p
                        className={`mt-1 text-sm leading-6 ${isActive ? "text-white/85" : "text-slate-400"
                          }`}
                      >
                        {item.desc}
                      </p>
                    </div>
                    <ChevronRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.key}
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -20 }}
                transition={{ duration: 0.35 }}
                className="relative min-h-[520px] overflow-hidden rounded-[2.4rem]"
              >
                <img
                  src={active.image}
                  alt={active.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#031018] via-[#031018]/45 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-500 text-white shadow-[0_20px_60px_rgba(249,115,22,0.4)]">
                    <ActiveIcon size={30} />
                  </div>
                  <h3 className="text-4xl font-black tracking-[-0.05em]">
                    {active.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
                    {active.desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 5. WHY CHOOSE US - BENTO GRID
// ==========================================
function WhyChooseUs() {
  const bentoItems: {
    colSpan: string;
    icon: LucideIcon;
    title: string;
    desc: string;
    className: string;
    iconClass: string;
    large?: boolean;
  }[] = [
      {
        colSpan: "lg:col-span-2 lg:row-span-2",
        icon: Factory,
        title: "Nhà máy chuẩn HACCP 3.300m²",
        desc: "Không gian sản xuất lớn, quy trình kiểm soát chất lượng khép kín, tập trung vào độ sạch, độ ổn định và sự an tâm.",
        className: "bg-slate-950 text-white",
        iconClass: "text-orange-400",
        large: true,
      },
      {
        colSpan: "lg:col-span-1",
        icon: ShieldCheck,
        title: "Bảo hiểm PVI",
        desc: "Gia tăng niềm tin bằng cam kết bảo vệ khách hàng.",
        className: "bg-orange-500 text-white",
        iconClass: "text-white",
      },
      {
        colSpan: "lg:col-span-1",
        icon: Leaf,
        title: "Nguyên liệu bản địa",
        desc: "Tập trung vào nguồn nguyên liệu rõ ràng, gần gũi và dễ kiểm soát.",
        className: "bg-amber-100 text-amber-950",
        iconClass: "text-amber-600",
      },
      {
        colSpan: "lg:col-span-2",
        icon: TrendingUp,
        title: "Top ngành ăn vặt trên TikTok Shop",
        desc: "Lượng đơn lớn, cộng đồng mạnh và khả năng bán hàng qua livestream là lợi thế thương hiệu nổi bật.",
        className: "bg-white text-slate-950 border border-slate-200",
        iconClass: "text-orange-500",
      },
    ];

  return (
    <section className="bg-[#fbfaf7] py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          label="Lý do chọn chúng tôi"
          title="Không chỉ ngon, mà còn đáng tin"
          description="Một landing page đẹp không chỉ cần ảnh đẹp, mà phải chứng minh được chất lượng bằng con số, quy trình và cam kết."
        />

        <div className="mt-16 grid auto-rows-[230px] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bentoItems.map((item, i) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.96, y: 24 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`${item.colSpan} ${item.className} group relative overflow-hidden rounded-[2.4rem] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(15,23,42,0.12)]`}
              >
                {item.large && (
                  <>
                    <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-orange-500/20 blur-[80px]" />
                    <div className="absolute right-8 top-8 rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-orange-300">
                      Premium trust
                    </div>
                  </>
                )}

                <div className="relative z-10 flex h-full flex-col justify-between">
                  <Icon
                    size={item.large ? 46 : 34}
                    className={item.iconClass}
                    strokeWidth={1.8}
                  />

                  <div>
                    <h3
                      className={`font-black tracking-[-0.04em] ${item.large ? "text-4xl" : "text-2xl"
                        }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`mt-3 max-w-xl leading-7 ${item.large ? "text-slate-400" : "opacity-75"
                        }`}
                    >
                      {item.desc}
                    </p>
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

// ==========================================
// 6. PROCESS RAIL
// ==========================================
function ProcessSection() {
  const steps = [
    {
      title: "Chọn nguyên liệu",
      desc: "Ưu tiên nguồn rõ ràng, kiểm tra đầu vào trước khi sản xuất.",
      icon: Leaf,
    },
    {
      title: "Sản xuất sạch",
      desc: "Kiểm soát quy trình, hạn chế rủi ro và giữ chất lượng ổn định.",
      icon: Factory,
    },
    {
      title: "Đóng gói chuẩn",
      desc: "Bao bì gọn, đẹp, dễ vận chuyển và giữ vị tốt hơn.",
      icon: PackageCheck,
    },
    {
      title: "Giao toàn quốc",
      desc: "Kết nối sàn thương mại điện tử để khách đặt hàng nhanh.",
      icon: Truck,
    },
  ];

  return (
    <section className="bg-white py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-orange-600">
              <Clock3 size={14} />
              Quy trình
            </p>

            <h2 className="text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-5xl">
              Từ nguyên liệu đến tay khách
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-500">
              Section này giúp trang không bị chỉ là “trưng sản phẩm”, mà có
              chiều sâu vận hành, tạo niềm tin giống website thương hiệu lớn.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-7 top-8 bottom-8 hidden w-px bg-gradient-to-b from-orange-500 via-orange-200 to-transparent md:block" />

            <div className="space-y-5">
              {steps.map((step, i) => {
                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: i * 0.08 }}
                    className="relative rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-1 hover:border-orange-200"
                  >
                    <div className="flex gap-5">
                      <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-[0_14px_40px_rgba(249,115,22,0.28)]">
                        <Icon size={25} />
                      </div>

                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
                          Bước 0{i + 1}
                        </p>
                        <h3 className="mt-1 text-2xl font-black tracking-[-0.04em] text-slate-950">
                          {step.title}
                        </h3>
                        <p className="mt-2 leading-7 text-slate-500">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 7. BRAND STORY
// ==========================================
function BrandStory() {
  const milestones = [
    {
      year: "2022",
      event: "Bắt đầu từ đam mê ẩm thực và những nội dung gần gũi với cộng đồng.",
    },
    {
      year: "2023",
      event: "Phát triển thương hiệu Ăn Cùng Bà Tuyết với định hướng đồ ăn vặt sạch.",
    },
    {
      year: "2024",
      event: "Mở rộng trên TikTok Shop, xây dựng cộng đồng khách hàng trung thành.",
    },
    {
      year: "2025",
      event: "Đẩy mạnh nhà máy, quy trình và tiêu chuẩn hóa sản phẩm.",
    },
  ];

  return (
    <section id="brand-story" className="relative overflow-hidden bg-[#031018] py-32 text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-[-10%] top-0 h-[500px] w-[500px] rounded-full bg-orange-500/15 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-orange-300">
            <BadgeCheck size={14} />
            Brand story
          </span>

          <h2 className="text-4xl font-black leading-tight tracking-[-0.05em] sm:text-5xl">
            Từ món ăn quen thuộc đến thương hiệu có cá tính riêng
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Câu chuyện thương hiệu nên được trình bày như một hành trình, để
            khách hàng nhớ tới con người, tiêu chuẩn và lý do thương hiệu tồn tại.
          </p>

          <Link
            href="/gioi-thieu"
            className="group mt-8 inline-flex items-center gap-3 border-b-2 border-orange-500 pb-1 text-sm font-black text-white transition-colors hover:text-orange-300"
          >
            Đọc toàn bộ câu chuyện
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/60 via-white/10 to-transparent" />

          <div className="space-y-8 pl-10">
            {milestones.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: 22 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-90px" }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className="relative"
              >
                <div className="absolute -left-[42px] top-8 h-4 w-4 rounded-full border-4 border-[#031018] bg-orange-500 shadow-[0_0_24px_rgba(249,115,22,0.8)]" />

                <div
                  className={`rounded-[2.2rem] border p-8 transition-all duration-300 hover:-translate-y-1 ${i === milestones.length - 1
                    ? "border-orange-400/35 bg-orange-500/10"
                    : "border-white/10 bg-white/[0.05] hover:bg-white/[0.08]"
                    }`}
                >
                  <p className="text-6xl font-black tracking-[-0.08em] text-white/15">
                    {item.year}
                  </p>
                  <p className="mt-4 text-lg font-semibold leading-8 text-slate-200">
                    {item.event}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 8. TESTIMONIAL / TRUST STRIP
// ==========================================
function TrustStrip() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2.8rem] bg-slate-950 p-8 text-white sm:p-10">
            <Quote className="mb-8 text-orange-400" size={42} />

            <h2 className="max-w-3xl text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl">
              “Một thương hiệu đồ ăn vặt muốn đi xa phải khiến khách hàng thấy
              ngon, tin và nhớ.”
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400">
              Vì vậy layout mới không chỉ đẹp hơn, mà còn chia rõ từng phần:
              hero gây ấn tượng, sản phẩm để chuyển đổi, bento để tạo niềm tin,
              timeline để kể chuyện và CTA để chốt đơn.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[2.4rem] border border-slate-100 bg-[#fbfaf7] p-8">
              <Award className="mb-6 text-orange-500" size={34} />
              <p className="text-3xl font-black tracking-[-0.05em] text-slate-950">
                Premium UI
              </p>
              <p className="mt-3 leading-7 text-slate-500">
                Bo góc lớn, kính mờ, glow nhẹ, motion vừa đủ, không rối.
              </p>
            </div>

            <div className="rounded-[2.4rem] border border-orange-100 bg-orange-50 p-8">
              <Flame className="mb-6 text-orange-500" size={34} />
              <p className="text-3xl font-black tracking-[-0.05em] text-slate-950">
                Bán hàng tốt hơn
              </p>
              <p className="mt-3 leading-7 text-slate-600">
                Sản phẩm nổi bật rõ hơn, hover bung card, CTA nổi bật hơn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 9. CTA SECTION
// ==========================================
function CTASection() {
  return (
    <section className="bg-[#031018] px-4 py-24 sm:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[3.2rem] bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 px-6 py-20 text-center shadow-[0_0_100px_rgba(249,115,22,0.35)] sm:px-16">
        <div className="absolute right-[-10%] top-[-40%] h-[520px] w-[520px] rounded-full bg-white/15 blur-[80px]" />
        <div className="absolute bottom-[-35%] left-[-8%] h-[420px] w-[420px] rounded-full bg-amber-200/25 blur-[70px]" />

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative z-10 mx-auto max-w-3xl"
        >
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white backdrop-blur-xl">
            <Sparkles size={14} />
            Chốt đơn ngay
          </p>

          <h2 className="text-4xl font-black leading-tight tracking-[-0.05em] text-white sm:text-6xl">
            Thèm ăn vặt?
            <br />
            Đặt ngay cho nóng.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base font-medium leading-8 text-white/90 sm:text-lg">
            Sản phẩm chính hãng, đóng gói đẹp, giao hàng toàn quốc qua các nền
            tảng quen thuộc.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="https://tiktok.com/@batuyethanhvi"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#031018] px-8 py-5 text-sm font-black text-white transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(3,16,24,0.25)]"
            >
              Mua qua TikTok Shop
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>

            <a
              href="https://shopee.vn/nmtvlog99"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-5 text-sm font-black text-orange-600 transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(255,255,255,0.25)]"
            >
              Đặt hàng Shopee
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// MAIN EXPORT
// ==========================================
export default function HomePage() {
  return (
    <main className="antialiased selection:bg-orange-500 selection:text-white">
      <HeroSection />
      <StatsSection />
      <FeaturedProducts />
      <SignatureLayouts />
      <WhyChooseUs />
      <ProcessSection />
      <BrandStory />
      <TrustStrip />
      <CTASection />
    </main>
  );
}