"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, ExternalLink, Navigation, Filter } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { locations, provinces, onlineChannels } from "@/data/locations";

export default function LocationsPage() {
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const filtered = locations.filter((loc) => {
    if (selectedProvince !== "all" && loc.province !== selectedProvince) return false;
    if (selectedType !== "all" && loc.type !== selectedType) return false;
    return loc.isActive;
  });

  return (
    <>
      {/* Hero */}
      <section className="pt-20 pb-10 bg-gradient-to-b from-neutral to-neutral-light text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary-light text-sm font-semibold uppercase tracking-wider">Hệ thống phân phối</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mt-3">Mua Bà Tuyết ở đâu?</h1>
            <p className="text-gray-300 text-lg mt-4 max-w-2xl mx-auto">
              Mua online trên TikTok Shop, Shopee, Lazada — hoặc tìm cửa hàng gần bạn
            </p>
          </motion.div>
        </div>
      </section>

      {/* Online Channels */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader label="Kênh online" title="Mua hàng trực tuyến" description="Đặt hàng dễ dàng — Giao hàng toàn quốc" />
          <div className="grid sm:grid-cols-3 gap-6">
            {onlineChannels.map((channel, i) => (
              <motion.a
                key={channel.name}
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-6 rounded-2xl bg-cream hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-200"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-4" style={{ backgroundColor: channel.color }}>
                  {channel.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-neutral">{channel.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{channel.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-semibold text-gray-400">{channel.followers} followers</span>
                  <ExternalLink size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Map & Locations */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader label="Cửa hàng" title="Điểm bán offline" description="Tìm cửa hàng, đại lý Bà Tuyết gần bạn nhất" />

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Filter size={16} />
              <span>Lọc theo:</span>
            </div>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Tất cả tỉnh/TP</option>
              {provinces.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Tất cả loại</option>
              <option value="chi-nhanh">Chi nhánh</option>
              <option value="dai-ly">Đại lý</option>
              <option value="sieu-thi">Siêu thị</option>
            </select>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Map placeholder */}
            <div className="lg:col-span-3 rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-200 min-h-[500px]">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d4000000!2d106.0!3d16.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2svn!4v1`}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 500 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ điểm bán Bà Tuyết"
              />
            </div>

            {/* Location list */}
            <div className="lg:col-span-2 space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {filtered.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <MapPin size={40} className="mx-auto mb-3 opacity-30" />
                  <p>Chưa có điểm bán tại khu vực này</p>
                </div>
              ) : (
                filtered.map((loc, i) => (
                  <motion.div
                    key={loc.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow border border-gray-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        loc.type === "chi-nhanh" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                      }`}>
                        <MapPin size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-neutral text-sm truncate">{loc.name}</h3>
                          <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                            loc.type === "chi-nhanh" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                          }`}>
                            {loc.type === "chi-nhanh" ? "Chi nhánh" : "Đại lý"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 flex items-start gap-1">
                          <MapPin size={12} className="mt-0.5 shrink-0" />
                          {loc.address}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Phone size={10} /> {loc.phone}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={10} /> {loc.hours}
                          </span>
                        </div>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary text-xs font-semibold mt-2 hover:underline"
                        >
                          <Navigation size={12} /> Chỉ đường
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Become Dealer */}
      <section className="py-20 bg-gradient-to-r from-secondary to-secondary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold">Muốn trở thành đại lý?</h2>
            <p className="text-white/80 mt-4 text-lg">
              Gia nhập hệ thống phân phối Ăn Cùng Bà Tuyết — Hỗ trợ vốn hàng, marketing và vận hành
            </p>
            <a href="/lien-he" className="inline-flex items-center gap-2 bg-white text-secondary-dark px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors mt-8">
              Liên hệ ngay <ExternalLink size={16} />
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
