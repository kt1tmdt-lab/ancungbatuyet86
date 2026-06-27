"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DEFAULT_MARKETING_CONFIG,
  normalizeMarketingConfig,
  type TrustSectionItem,
} from "@/lib/marketing-config";
import {
  Calendar,
  Award,
  History,
  ArrowRight,
  Compass,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  BookOpen,
  ShieldAlert,
  Clock,
} from "lucide-react";
import Link from "next/link";

// Helper function to extract a 4-digit year from the title
function extractYear(title: string): string | null {
  const match = title.match(/\b(19\d\d|20\d\d)\b/);
  return match ? match[0] : null;
}

// Helper to get clean title without the year string to avoid repetition
function getCleanTitle(title: string, year: string | null): string {
  if (!year) return title;
  const regex = new RegExp(`\\b(Năm\\s+)?${year}\\b\\s*[:\\-–—]?\\s*`, "i");
  const cleaned = title.replace(regex, "").trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export default function HistoryPage() {
  const [trustSections, setTrustSections] = useState<TrustSectionItem[]>(
    DEFAULT_MARKETING_CONFIG.trustSections,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1: left, 1: right
  const [selectedItem, setSelectedItem] = useState<TrustSectionItem | null>(null);
  
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/settings/marketing", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const marketingConfig = normalizeMarketingConfig(data?.data);
        setTrustSections(marketingConfig.trustSections);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    }
    fetchHistory();
  }, []);

  const rawHistoryItems = trustSections.filter(
    (item) => item.enabled && ["company_history", "achievements"].includes(item.key)
  );

  const historyItems = rawHistoryItems
    .map((item, idx) => {
      const year = extractYear(item.title) || extractYear(item.description);
      const cleanTitle = getCleanTitle(item.title, year);
      return {
        ...item,
        year,
        cleanTitle,
        yearLabel: year || (item.key === "achievements" ? "Thành tựu" : `Mốc ${idx + 1}`),
        sortYear: parseInt(year || "2020") + idx * 0.1, // stable chronological order fallback
      };
    })
    .sort((a, b) => a.sortYear - b.sortYear);

  // Auto-scroll the active node to the center of the timeline bar on mobile/tablet
  useEffect(() => {
    if (timelineRef.current) {
      const container = timelineRef.current;
      const activeNode = container.querySelector(`[data-index="${activeIndex}"]`);
      if (activeNode) {
        const containerWidth = container.clientWidth;
        const activeNodeLeft = (activeNode as HTMLElement).offsetLeft;
        const activeNodeWidth = (activeNode as HTMLElement).clientWidth;
        
        container.scrollTo({
          left: activeNodeLeft - containerWidth / 2 + activeNodeWidth / 2,
          behavior: "smooth",
        });
      }
    }
  }, [activeIndex]);

  const handlePrev = () => {
    if (activeIndex > 0) {
      setDirection(-1);
      setActiveIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < historyItems.length - 1) {
      setDirection(1);
      setActiveIndex((prev) => prev + 1);
    }
  };

  const selectIndex = (index: number) => {
    if (index > activeIndex) {
      setDirection(1);
    } else if (index < activeIndex) {
      setDirection(-1);
    } else {
      setDirection(0);
    }
    setActiveIndex(index);
  };

  if (historyItems.length === 0) {
    return (
      <main className="bg-[#fbf7ef] py-16 px-4 sm:px-6 lg:px-8 min-h-screen relative overflow-hidden">
        {/* Background Decorative Blur */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="max-w-6xl mx-auto text-center mt-20">
          <div className="border border-dashed border-orange-200 bg-white p-12 text-center text-sm font-bold text-slate-500 rounded-2xl shadow-sm">
            Chưa có thông tin lịch sử thương hiệu được cấu hình.
          </div>
        </div>
      </main>
    );
  }

  const activeItem = historyItems[activeIndex];

  // Slide transitions variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : dir < 0 ? -120 : 0,
      opacity: 0,
      scale: 0.97,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -120 : dir < 0 ? 120 : 0,
      opacity: 0,
      scale: 0.97,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
      },
    }),
  };

  return (
    <main className="bg-[#fbf7ef] py-16 px-4 sm:px-6 lg:px-8 min-h-screen relative overflow-hidden">
      {/* Decorative Background Elements with Floating Motion */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-1/4 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl pointer-events-none -z-10"
      />
      <motion.div
        animate={{
          y: [0, 15, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-1/4 w-96 h-96 bg-amber-50 rounded-full blur-3xl pointer-events-none -z-10"
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 border border-orange-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-orange-700 shadow-sm rounded-full mb-4">
            <History size={13} className="text-orange-600 animate-spin-slow" />
            Hành trình thời gian
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-[-0.04em]">
            Lịch sử & Cột mốc
          </h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto my-6 rounded-full" />
          <p className="text-base sm:text-lg text-slate-655 max-w-2xl mx-auto leading-relaxed font-medium">
            Từ một căn bếp nhỏ đong đầy tâm huyết đến thương hiệu ăn vặt quốc dân. Nhìn lại những dấu mốc kiến tạo nên Ăn Cùng Bà Tuyết hôm nay.
          </p>
        </div>

        {/* Horizontal Timeline Navigation Axis */}
        <div className="relative mb-12 bg-white/50 backdrop-blur-sm border border-orange-100/60 p-6 rounded-3xl shadow-[0_8px_30px_rgba(234,88,12,0.02)]">
          <div
            ref={timelineRef}
            className="w-full overflow-x-auto no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing py-8"
          >
            <div className="relative min-w-[700px] md:min-w-0 md:w-full h-12 flex items-center px-12">
              {/* Timeline Track Line */}
              <div className="absolute left-12 right-12 h-1 bg-slate-200 rounded-full">
                {/* Highlighted active segment */}
                <motion.div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 rounded-full shadow-[0_0_8px_rgba(234,88,12,0.4)]"
                  initial={false}
                  animate={{
                    width: historyItems.length <= 1 ? "100%" : `${(activeIndex / (historyItems.length - 1)) * 100}%`,
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
                
                {/* Glowing Arrowhead Indicator pointing right */}
                <div 
                  className={`absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 border-t-3 border-r-3 rotate-45 transition-colors duration-300 ${
                    activeIndex === historyItems.length - 1 ? "border-amber-500" : "border-slate-300"
                  }`}
                  style={{
                    marginRight: "-1px"
                  }}
                />
              </div>

              {/* Milestone Nodes */}
              {historyItems.map((item, index) => {
                const isSelected = index === activeIndex;
                const isPast = index < activeIndex;
                const pct = historyItems.length <= 1 ? 50 : (index / (historyItems.length - 1)) * 100;

                return (
                  <div
                    key={item.id || item.key}
                    data-index={index}
                    onClick={() => selectIndex(index)}
                    className="absolute -translate-x-1/2 flex flex-col items-center group cursor-pointer z-10"
                    style={{
                      left: `calc(3rem + (${pct}% - ${pct * 0.01 * 6}rem))`
                    }}
                  >
                    {/* Year text wrapper */}
                    <motion.div
                      animate={{
                        y: isSelected ? -8 : 0,
                        scale: isSelected ? 1.08 : 1,
                      }}
                      className={`mb-3 px-3.5 py-1 text-xs font-black rounded-full border transition-all duration-300 ${
                        isSelected
                          ? "bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-500/20"
                          : isPast
                          ? "bg-orange-50 text-orange-600 border-orange-200"
                          : "bg-white text-slate-400 border-slate-200 group-hover:border-orange-300 group-hover:text-orange-500"
                      }`}
                    >
                      {item.yearLabel}
                    </motion.div>

                    {/* Node Circle */}
                    <div className="relative flex items-center justify-center">
                      {/* Interactive Ripple rings around active node */}
                      {isSelected && (
                        <motion.span
                          layoutId="timeline-glow-ring"
                          className="absolute w-7 h-7 bg-orange-500/20 border border-orange-500/60 rounded-full"
                          animate={{ scale: [1, 1.4, 1] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        />
                      )}

                      {/* Actual dot */}
                      <motion.div
                        animate={{
                          scale: isSelected ? 1.25 : 1,
                        }}
                        className={`w-4 h-4 rounded-full border-3 transition-colors duration-300 ${
                          isSelected
                            ? "bg-white border-orange-600 shadow-sm"
                            : isPast
                            ? "bg-orange-500 border-orange-500"
                            : "bg-white border-slate-300 group-hover:border-orange-400"
                        }`}
                      />
                    </div>

                    {/* Brief tag indicator under node */}
                    <span className={`mt-2 text-[9px] font-black uppercase tracking-wider transition-colors duration-300 ${
                      isSelected ? "text-slate-800" : "text-slate-400 group-hover:text-slate-600"
                    }`}>
                      {item.key === "achievements" ? "Thành tựu" : "Cột mốc"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Milestone Bento Card & Slider Controls */}
        <div className="relative">
          {/* Desktop Left navigation arrow */}
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-7 w-13 h-13 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-orange-600 disabled:opacity-20 hover:border-orange-500 hover:shadow-xl hover:scale-105 disabled:hover:scale-100 disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all z-20 shadow-md cursor-pointer hidden md:flex"
            title="Cột mốc trước"
          >
            <ChevronLeft size={22} strokeWidth={2.2} />
          </button>

          {/* Desktop Right navigation arrow */}
          <button
            onClick={handleNext}
            disabled={activeIndex === historyItems.length - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-7 w-13 h-13 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-orange-600 disabled:opacity-20 hover:border-orange-500 hover:shadow-xl hover:scale-105 disabled:hover:scale-100 disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all z-20 shadow-md cursor-pointer hidden md:flex"
            title="Cột mốc sau"
          >
            <ChevronRight size={22} strokeWidth={2.2} />
          </button>

          {/* Sliding Content Container */}
          <div className="overflow-hidden rounded-3xl min-h-[420px] bg-white border border-orange-100/60 shadow-[0_15px_40px_rgba(234,88,12,0.03)] relative">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeItem.id || activeItem.key}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-6 sm:p-8 md:p-10 flex flex-col md:grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-center min-h-[420px] relative w-full h-full"
              >
                {/* Year Watermark in the background */}
                {activeItem.year && (
                  <div className="absolute right-8 bottom-4 text-[120px] sm:text-[150px] font-black text-slate-100 select-none pointer-events-none tracking-tighter leading-none font-sans z-0">
                    {activeItem.year}
                  </div>
                )}

                {/* Left Area: Text Content */}
                <div className="relative z-10 w-full flex flex-col justify-between h-full">
                  <div>
                    {/* Category Label and Year Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        activeItem.key === "achievements" 
                          ? "bg-amber-50 text-amber-700 border-amber-100" 
                          : "bg-orange-50 text-orange-700 border-orange-100"
                      }`}>
                        {activeItem.key === "achievements" ? <Award size={12} /> : <Compass size={12} />}
                        {activeItem.key === "achievements" ? "Thành tựu" : "Cột mốc"}
                      </span>
                      {activeItem.year && (
                        <span className="text-xs font-black text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full flex items-center gap-1">
                          <Calendar size={11} /> Năm {activeItem.year}
                        </span>
                      )}
                    </div>

                    {/* Cleaned Title */}
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-[-0.03em] leading-tight mb-4 pr-6 group-hover:text-orange-600 transition-colors">
                      {activeItem.cleanTitle}
                    </h3>

                    {/* Brief description */}
                    <p className="text-sm sm:text-base leading-relaxed text-slate-600 font-medium mb-6 line-clamp-4">
                      {activeItem.description}
                    </p>
                  </div>

                  {/* Actions row */}
                  <div className="flex flex-wrap gap-4 mt-auto">
                    <button
                      onClick={() => setSelectedItem(activeItem)}
                      className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-md shadow-orange-600/10 hover:shadow-lg hover:shadow-orange-600/20 active:scale-95 cursor-pointer"
                    >
                      Xem chi tiết cột mốc
                      <ArrowRight size={14} />
                    </button>
                    
                    {activeItem.linkUrl && activeItem.linkUrl !== "/gioi-thieu" && (
                      <Link
                        href={activeItem.linkUrl}
                        className="inline-flex items-center gap-1.5 px-6 py-3.5 border border-slate-200 bg-white hover:border-orange-300 text-slate-700 hover:text-orange-600 rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
                      >
                        Tài liệu liên quan
                      </Link>
                    )}
                  </div>
                </div>

                {/* Right Area: Image visual or creative placeholder */}
                <div className="w-full relative z-10">
                  {activeItem.imageUrl ? (
                    <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl border border-orange-100/50 bg-orange-50/50 shadow-md group">
                      <img
                        src={activeItem.imageUrl}
                        alt={activeItem.title}
                        className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-103"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent pointer-events-none" />
                    </div>
                  ) : (
                    <div className="relative aspect-[16/11] w-full bg-gradient-to-br from-orange-50 to-amber-100 border border-orange-100/70 rounded-2xl flex flex-col items-center justify-center p-8 overflow-hidden shadow-sm">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-300/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                      
                      {activeItem.key === "achievements" ? (
                        <Award size={56} className="text-amber-600 stroke-[1.2] mb-3" />
                      ) : (
                        <Compass size={56} className="text-orange-600 stroke-[1.2] mb-3" />
                      )}
                      
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {activeItem.key === "achievements" ? "Bảo chứng uy tín" : "Cột mốc phát triển"}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Navigation Buttons (stacked below) */}
        <div className="flex md:hidden items-center justify-between gap-4 mt-6">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white border border-orange-150 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-40 transition-colors shadow-sm"
          >
            <ChevronLeft size={16} strokeWidth={2.2} />
            Cột mốc trước
          </button>
          <button
            onClick={handleNext}
            disabled={activeIndex === historyItems.length - 1}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-orange-600 text-white font-bold text-xs rounded-xl disabled:opacity-40 transition-colors shadow-sm"
          >
            Cột mốc sau
            <ChevronRight size={16} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* Modern Detailed Modal Overlay */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Dark Blurred Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-slate-950/65 backdrop-blur-md"
            />

            {/* Modal Box Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ type: "spring", duration: 0.45 }}
              className="bg-white text-slate-950 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative border border-orange-100 flex flex-col md:grid md:grid-cols-[1.1fr_1.3fr] h-auto max-h-[85vh] md:max-h-[80vh] z-10"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="absolute right-4 top-4 bg-white/95 backdrop-blur-sm text-slate-800 p-2 rounded-full border border-slate-200 hover:bg-orange-600 hover:text-white hover:border-orange-500 hover:rotate-90 transition-all z-20 shadow-md cursor-pointer"
                aria-label="Đóng"
              >
                <X size={18} />
              </button>

              {/* Left Column: Image Area */}
              <div className="relative bg-slate-50 border-b md:border-b-0 md:border-r border-orange-100 overflow-hidden min-h-[220px] md:min-h-0 flex items-stretch">
                {selectedItem.imageUrl ? (
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 text-orange-500 p-8 min-h-[240px]">
                    {selectedItem.key === "achievements" ? (
                      <Award size={48} className="stroke-[1.5] mb-2 text-amber-600" />
                    ) : (
                      <Compass size={48} className="stroke-[1.5] mb-2 text-orange-600" />
                    )}
                    <span className="text-xs font-black uppercase tracking-wider text-slate-450">Hình ảnh cột mốc</span>
                  </div>
                )}
              </div>

              {/* Right Column: Text & Content Area (scrollable) */}
              <div className="p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[80vh]">
                <div>
                  {/* Category and year badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      selectedItem.key === "achievements"
                        ? "bg-amber-50 text-amber-700 border-amber-100"
                        : "bg-orange-50 text-orange-700 border-orange-100"
                    }`}>
                      {selectedItem.key === "achievements" ? <Award size={10} /> : <Compass size={10} />}
                      {selectedItem.key === "achievements" ? "Thành tựu" : "Cột mốc"}
                    </span>
                    {extractYear(selectedItem.title) && (
                      <span className="text-[10px] font-black text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full flex items-center gap-1">
                        <Clock size={10} /> Năm {extractYear(selectedItem.title)}
                      </span>
                    )}
                  </div>

                  {/* Title without year */}
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-[-0.04em] leading-tight">
                    {getCleanTitle(selectedItem.title, extractYear(selectedItem.title))}
                  </h3>

                  {/* Summary Box */}
                  <p className="mt-4 text-sm font-semibold leading-relaxed text-orange-750 bg-orange-50/50 p-4 border border-orange-100/50 rounded-2xl">
                    {selectedItem.description}
                  </p>

                  {/* Detailed descriptions */}
                  <div className="mt-6 space-y-4 border-t border-slate-100 pt-6 text-sm leading-relaxed text-slate-655 font-medium">
                    {(selectedItem.detailContent || "Thông tin chi tiết về cột mốc này đang được cập nhật. Vui lòng quay lại sau.")
                      .split(/\n+/)
                      .filter(Boolean)
                      .map((paragraph, index) => (
                        <p key={index} className="relative pl-5 before:absolute before:left-0 before:top-[8px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange-500">
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </div>

                {/* Optional Footer Link */}
                {selectedItem.linkUrl && selectedItem.linkUrl !== "/gioi-thieu" && (
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <Link
                      href={selectedItem.linkUrl}
                      onClick={() => setSelectedItem(null)}
                      className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-750 text-white w-full sm:w-auto px-6 py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-colors shadow-md hover:shadow-lg"
                    >
                      Tài liệu / Trang liên quan
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
