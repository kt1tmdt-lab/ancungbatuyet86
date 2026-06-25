"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  ExternalLink,
  Filter,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  Users,
} from "lucide-react";

type Location = {
  id: string;
  name: string;
  type: "chi-nhanh" | "dai-ly" | "sieu-thi" | "online";
  address: string;
  province: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
  isActive: boolean;
};

type OnlineChannel = {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  followers: string;
  color: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

function getTypeLabel(type: string) {
  if (type === "chi-nhanh") return "Chi nhánh";
  if (type === "sieu-thi") return "Siêu thị";
  return "Đại lý";
}

function getTypeClass(type: string) {
  if (type === "chi-nhanh") {
    return "border-orange-500 bg-orange-50 text-orange-700";
  }

  if (type === "sieu-thi") {
    return "border-emerald-500 bg-emerald-50 text-emerald-700";
  }

  return "border-amber-500 bg-amber-50 text-amber-700";
}

function PageIntro({
  totalLocations,
  totalOnlineChannels,
}: {
  totalLocations: number;
  totalOnlineChannels: number;
}) {
  return (
    <section className="border-b border-orange-100 bg-[#fff7ed] px-4 pb-8 pt-24 sm:px-6 lg:px-10">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-end"
      >
        <div>
          <motion.div
            variants={fadeUp}
            className="mb-4 inline-flex items-center gap-2 border border-orange-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-orange-700"
          >
            <Store size={15} />
            Hệ thống phân phối
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="max-w-4xl text-3xl font-black leading-tight tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl"
          >
            Mua Ăn Cùng Bà Tuyết chính hãng ở đâu?
          </motion.h1>
        </div>

        <motion.div variants={fadeUp} className="max-w-4xl lg:justify-self-end">
          <p className="text-base leading-8 text-slate-600">
            Trang này dùng để truyền thông hệ thống bán hàng: khách hàng xem
            nhanh kênh mua online, lọc điểm bán theo khu vực và mở chỉ đường
            Google Maps khi cần mua trực tiếp.
          </p>

          <div className="mt-5 grid grid-cols-3 border border-orange-100 bg-white">
            {[
              { value: `${totalOnlineChannels}+`, label: "kênh online" },
              { value: `${totalLocations}`, label: "điểm bán" },
              { value: "24/7", label: "tra cứu" },
            ].map((item) => (
              <div
                key={item.label}
                className="border-r border-orange-100 p-4 last:border-r-0"
              >
                <p className="text-2xl font-black text-slate-950">
                  {item.value}
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function BuyingMessageStrip() {
  const items = [
    {
      icon: ShoppingBag,
      title: "Mua đúng kênh",
      text: "Ưu tiên gian hàng chính thức để dễ kiểm tra giá, chính sách và thông tin sản phẩm.",
    },
    {
      icon: ShieldCheck,
      title: "Kiểm tra điểm bán",
      text: "Xem địa chỉ, số điện thoại và giờ hoạt động trước khi ghé mua trực tiếp.",
    },
    {
      icon: Truck,
      title: "Nhận hàng tiện lợi",
      text: "Đặt online để giao tận nơi hoặc mở chỉ đường để tìm điểm bán gần bạn.",
    },
  ];

  return (
    <section className="grid border-b border-orange-100 bg-white sm:grid-cols-3">
      {items.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="border-b border-orange-100 p-6 sm:border-b-0 sm:border-r sm:last:border-r-0 lg:p-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-orange-600 text-white">
                <Icon size={22} />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-500">
                  0{index + 1}
                </p>
                <h3 className="mt-1 text-xl font-black tracking-[-0.03em] text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.text}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function OnlineChannelsSection({ onlineChannels }: { onlineChannels: OnlineChannel[] }) {
  return (
    <section className="bg-[#fbfaf7] px-4 py-12 sm:px-6 lg:px-10">
      <div className="mb-7 grid gap-5 border-b border-slate-200 pb-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-700">
            Kênh online
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
            Đặt hàng trực tuyến
          </h2>
        </div>

        <p className="max-w-3xl text-base leading-7 text-slate-600 lg:justify-self-end">
          Các kênh online phù hợp khi khách hàng muốn mua nhanh, theo dõi vận
          chuyển và đối chiếu thông tin sản phẩm rõ ràng.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {onlineChannels.map((channel, index) => (
          <motion.a
            key={channel.name}
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.42, delay: index * 0.06 }}
            className="group border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-orange-300 hover:shadow-[0_20px_60px_rgba(249,115,22,0.1)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center text-xl font-black text-white"
                style={{ backgroundColor: channel.color }}
              >
                {channel.name.charAt(0)}
              </div>

              <ExternalLink
                size={18}
                className="text-slate-300 transition-colors group-hover:text-orange-600"
              />
            </div>

            <h3 className="mt-8 text-2xl font-black tracking-[-0.04em] text-slate-950">
              {channel.name}
            </h3>

            <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-600">
              {channel.description}
            </p>

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                {channel.followers} followers
              </span>

              <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-orange-700">
                Mở kênh
                <ArrowRight size={14} />
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

const PROVINCE_TO_REGION: Record<string, string> = {
  "Hà Nội": "Miền Bắc",
  "Thái Nguyên": "Miền Bắc",
  "Bắc Ninh": "Miền Bắc",
  "Hải Phòng": "Miền Bắc",
  "Vĩnh Phúc": "Miền Bắc",
  "Bắc Giang": "Miền Bắc",
  "Quảng Ninh": "Miền Bắc",
  "Hải Dương": "Miền Bắc",
  "Hưng Yên": "Miền Bắc",
  "Hòa Bình": "Miền Bắc",
  "Sơn La": "Miền Bắc",
  "Điện Biên": "Miền Bắc",
  "Lai Châu": "Miền Bắc",
  "Lào Cai": "Miền Bắc",
  "Yên Bái": "Miền Bắc",
  "Phú Thọ": "Miền Bắc",
  "Hà Giang": "Miền Bắc",
  "Tuyên Quang": "Miền Bắc",
  "Cao Bằng": "Miền Bắc",
  "Bắc Kạn": "Miền Bắc",
  "Lạng Sơn": "Miền Bắc",
  "Hà Nam": "Miền Bắc",
  "Nam Định": "Miền Bắc",
  "Ninh Bình": "Miền Bắc",
  "Thái Bình": "Miền Bắc",
  "Nghệ An": "Miền Trung",
  "Đà Nẵng": "Miền Trung",
  "Thanh Hóa": "Miền Trung",
  "Hà Tĩnh": "Miền Trung",
  "Quảng Bình": "Miền Trung",
  "Quảng Trị": "Miền Trung",
  "Thừa Thiên Huế": "Miền Trung",
  "Quảng Nam": "Miền Trung",
  "Quảng Ngãi": "Miền Trung",
  "Bình Định": "Miền Trung",
  "Phú Yên": "Miền Trung",
  "Khánh Hòa": "Miền Trung",
  "Ninh Thuận": "Miền Trung",
  "Bình Thuận": "Miền Trung",
  "Kon Tum": "Miền Trung",
  "Gia Lai": "Miền Trung",
  "Đắk Lắk": "Miền Trung",
  "Đắk Nông": "Miền Trung",
  "Lâm Đồng": "Miền Trung",
  "TP.HCM": "Miền Nam",
  "TP. Hồ Chí Minh": "Miền Nam",
  "Hồ Chí Minh": "Miền Nam",
  "Cần Thơ": "Miền Nam",
  "Bình Dương": "Miền Nam",
  "Đồng Nai": "Miền Nam",
  "Bà Rịa - Vũng Tàu": "Miền Nam",
  "Tây Ninh": "Miền Nam",
  "Bình Phước": "Miền Nam",
  "Long An": "Miền Nam",
  "Tiền Giang": "Miền Nam",
  "Bến Tre": "Miền Nam",
  "Trà Vinh": "Miền Nam",
  "Vĩnh Long": "Miền Nam",
  "Đồng Tháp": "Miền Nam",
  "An Giang": "Miền Nam",
  "Kiên Giang": "Miền Nam",
  "Hậu Giang": "Miền Nam",
  "Sóc Trăng": "Miền Nam",
  "Bạc Liêu": "Miền Nam",
  "Cà Mau": "Miền Nam",
};

function getRegion(province: string): string {
  return PROVINCE_TO_REGION[province] || "Khác";
}

function getDistrict(address: string, province: string): string {
  const parts = address.split(",").map((p) => p.trim());
  if (parts.length < 2) return "Khác";
  let district = parts[parts.length - 2];
  if (district.toLowerCase() === province.toLowerCase() && parts.length >= 3) {
    district = parts[parts.length - 3];
  }
  if (district.startsWith("Khu công nghiệp ")) {
    district = district.replace("Khu công nghiệp ", "");
  }
  return district;
}

function LocationsSection({
  selectedRegion,
  setSelectedRegion,
  selectedProvince,
  setSelectedProvince,
  selectedDistrict,
  setSelectedDistrict,
  selectedType,
  setSelectedType,
  filtered,
  availableProvinces,
  availableDistricts,
}: {
  selectedRegion: string;
  setSelectedRegion: (value: string) => void;
  selectedProvince: string;
  setSelectedProvince: (value: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  filtered: Location[];
  availableProvinces: string[];
  availableDistricts: string[];
}) {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-10">
      <div className="mb-7 grid gap-5 border-b border-slate-200 pb-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-700">
            Điểm bán offline
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
            Tra cứu cửa hàng, đại lý
          </h2>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
              <Filter size={16} />
              <span>Lọc theo</span>
            </div>

            <select
              value={selectedRegion}
              onChange={(event) => {
                setSelectedRegion(event.target.value);
                setSelectedProvince("all");
                setSelectedDistrict("all");
              }}
              className="h-11 border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            >
              <option value="all">Tất cả vùng miền</option>
              <option value="Miền Bắc">Miền Bắc</option>
              <option value="Miền Trung">Miền Trung</option>
              <option value="Miền Nam">Miền Nam</option>
            </select>

            <select
              value={selectedProvince}
              onChange={(event) => {
                setSelectedProvince(event.target.value);
                setSelectedDistrict("all");
              }}
              className="h-11 border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            >
              <option value="all">Tất cả tỉnh/TP</option>
              {availableProvinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>

            <select
              value={selectedDistrict}
              onChange={(event) => setSelectedDistrict(event.target.value)}
              className="h-11 border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            >
              <option value="all">Tất cả quận/huyện</option>
              {availableDistricts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
              className="h-11 border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            >
              <option value="all">Tất cả loại</option>
              <option value="chi-nhanh">Chi nhánh</option>
              <option value="dai-ly">Đại lý</option>
              <option value="sieu-thi">Siêu thị</option>
            </select>
          </div>

          <p className="text-sm text-slate-500">
            Đang hiển thị{" "}
            <span className="font-black text-slate-950">{filtered.length}</span>{" "}
            điểm bán phù hợp.
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="border border-slate-200 bg-[#f8f3ea]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-700">
                Bản đồ phân phối
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Xem tổng quan khu vực và mở chỉ đường.
              </p>
            </div>
            <MapPin className="text-orange-600" size={24} />
          </div>

          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d4000000!2d106.0!3d16.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2svn!4v1`}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 560 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bản đồ điểm bán Bà Tuyết"
          />
        </div>

        <div className="border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-700">
              Danh sách điểm bán
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Chọn điểm bán để gọi điện hoặc mở chỉ đường Google Maps.
            </p>
          </div>

          <div className="max-h-[620px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-6 py-16 text-center text-slate-400">
                <MapPin size={42} className="mx-auto mb-4 opacity-30" />
                <p className="font-semibold">Chưa có điểm bán tại khu vực này</p>
                <p className="mt-2 text-sm">
                  Bạn có thể đặt hàng qua các kênh online phía trên.
                </p>
              </div>
            ) : (
              filtered.map((loc, index) => (
                <motion.div
                  key={loc.id}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-70px" }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="border-b border-slate-100 p-5 transition-colors hover:bg-[#fff7ed] last:border-b-0"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center border-l-4 ${getTypeClass(
                        loc.type
                      )}`}
                    >
                      <MapPin size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-slate-950">
                          {loc.name}
                        </h3>

                        <span
                          className={`border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${getTypeClass(
                            loc.type
                          )}`}
                        >
                          {getTypeLabel(loc.type)}
                        </span>
                      </div>

                      <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-slate-600">
                        <MapPin
                          size={14}
                          className="mt-1 shrink-0 text-slate-400"
                        />
                        {loc.address}
                      </p>

                      <div className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
                        <span className="flex items-center gap-2">
                          <Phone size={13} />
                          {loc.phone}
                        </span>

                        <span className="flex items-center gap-2">
                          <Clock size={13} />
                          {loc.hours}
                        </span>
                      </div>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 bg-orange-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition hover:bg-orange-700"
                      >
                        <Navigation size={13} />
                        Chỉ đường
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
  );
}

function DealerSection() {
  return (
    <section className="grid border-t border-orange-100 bg-[#fff7ed] lg:grid-cols-[0.9fr_1.1fr]">
      <div className="border-b border-orange-100 p-8 lg:border-b-0 lg:border-r lg:p-10">
        <div className="mb-6 flex h-14 w-14 items-center justify-center bg-orange-600 text-white">
          <Users size={26} />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-700">
          Hợp tác phân phối
        </p>

        <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
          Mở rộng điểm bán Ăn Cùng Bà Tuyết
        </h2>
      </div>

      <div className="flex flex-col justify-between gap-8 bg-orange-700 p-8 text-white lg:p-10">
        <p className="max-w-3xl text-base leading-8 text-orange-50 sm:text-lg">
          Phù hợp cho đại lý, cửa hàng thực phẩm, siêu thị mini và điểm bán đồ
          ăn vặt muốn bổ sung nhóm sản phẩm có nhận diện thương hiệu mạnh, dễ
          truyền thông và dễ bán qua nhiều kênh.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/lien-he"
            className="inline-flex items-center justify-center gap-2 bg-white px-7 py-4 text-sm font-black uppercase tracking-wider text-orange-700 transition hover:bg-orange-50"
          >
            Liên hệ hợp tác
            <ExternalLink size={16} />
          </Link>

          <Link
            href="/san-pham"
            className="inline-flex items-center justify-center gap-2 border border-white/30 px-7 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-white/10"
          >
            Xem sản phẩm
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function LocationsPage() {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [locations, setLocations] = useState<Location[]>([]);
  const [onlineChannels, setOnlineChannels] = useState<OnlineChannel[]>([]);

  useEffect(() => {
    fetch("/api/locations")
      .then((res) => res.json())
      .then((data) => {
        setLocations(Array.isArray(data.locations) ? data.locations : []);
        setOnlineChannels(Array.isArray(data.onlineChannels) ? data.onlineChannels : []);
      })
      .catch((error) => {
        console.error("Failed to load locations from DB", error);
      });
  }, []);

  const activeLocations = useMemo(() => {
    return locations.filter((loc) => loc.isActive);
  }, [locations]);

  const availableProvinces = useMemo(() => {
    const activeProvinces = [...new Set(activeLocations.map((loc) => loc.province))];
    if (selectedRegion === "all") {
      return activeProvinces;
    }
    return activeProvinces.filter((p) => getRegion(p) === selectedRegion);
  }, [activeLocations, selectedRegion]);

  const availableDistricts = useMemo(() => {
    const matches = activeLocations.filter((loc) => {
      if (selectedRegion !== "all" && getRegion(loc.province) !== selectedRegion) {
        return false;
      }
      if (selectedProvince !== "all" && loc.province !== selectedProvince) {
        return false;
      }
      return true;
    });
    return [...new Set(matches.map((loc) => getDistrict(loc.address, loc.province)))];
  }, [activeLocations, selectedRegion, selectedProvince]);

  const filtered = useMemo(() => {
    return activeLocations.filter((loc) => {
      if (selectedRegion !== "all" && getRegion(loc.province) !== selectedRegion) {
        return false;
      }

      if (selectedProvince !== "all" && loc.province !== selectedProvince) {
        return false;
      }

      if (selectedDistrict !== "all" && getDistrict(loc.address, loc.province) !== selectedDistrict) {
        return false;
      }

      if (selectedType !== "all" && loc.type !== selectedType) {
        return false;
      }

      return true;
    });
  }, [activeLocations, selectedRegion, selectedProvince, selectedDistrict, selectedType]);

  return (
    <main className="bg-white antialiased selection:bg-orange-600 selection:text-white">
      <PageIntro
        totalLocations={activeLocations.length}
        totalOnlineChannels={onlineChannels.length}
      />
      <BuyingMessageStrip />
      <OnlineChannelsSection onlineChannels={onlineChannels} />
      <LocationsSection
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        selectedProvince={selectedProvince}
        setSelectedProvince={setSelectedProvince}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        filtered={filtered}
        availableProvinces={availableProvinces}
        availableDistricts={availableDistricts}
      />
      <DealerSection />
    </main>
  );
}
