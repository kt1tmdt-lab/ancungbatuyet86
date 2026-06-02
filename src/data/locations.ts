export interface Location {
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
}

export const onlineChannels = [
  {
    name: "TikTok Shop",
    description: "Kênh bán hàng chính — Livestream mỗi ngày",
    url: "https://tiktok.com/@batuyethanhvi",
    icon: "tiktok",
    followers: "3.2M+",
    color: "#000000",
  },
  {
    name: "Shopee",
    description: "Giao hàng nhanh — Nhiều voucher giảm giá",
    url: "https://shopee.vn/nmtvlog99",
    icon: "shopee",
    followers: "200K+",
    color: "#EE4D2D",
  },
  {
    name: "Lazada",
    description: "Đặt hàng dễ dàng — Trả góp 0%",
    url: "https://www.lazada.vn/shop/an-cung-ba-tuyet",
    icon: "lazada",
    followers: "50K+",
    color: "#0F1689",
  },
];

export const locations: Location[] = [
  {
    id: "loc-01",
    name: "Trụ sở chính & Nhà máy",
    type: "chi-nhanh",
    address: "Khu công nghiệp Sông Công, Thái Nguyên",
    province: "Thái Nguyên",
    phone: "0989 852 948",
    hours: "8:00 - 17:00 (T2 - T7)",
    lat: 21.4735,
    lng: 105.8490,
    isActive: true,
  },
  {
    id: "loc-02",
    name: "Chi nhánh Hà Nội",
    type: "chi-nhanh",
    address: "Số 45, Đường Trần Duy Hưng, Cầu Giấy, Hà Nội",
    province: "Hà Nội",
    phone: "0989 852 949",
    hours: "8:00 - 21:00 (Hàng ngày)",
    lat: 21.0105,
    lng: 105.7985,
    isActive: true,
  },
  {
    id: "loc-03",
    name: "Đại lý Bắc Ninh",
    type: "dai-ly",
    address: "Số 12, Đường Lý Thái Tổ, TP Bắc Ninh",
    province: "Bắc Ninh",
    phone: "0912 345 678",
    hours: "8:00 - 20:00 (Hàng ngày)",
    lat: 21.1861,
    lng: 106.0763,
    isActive: true,
  },
  {
    id: "loc-04",
    name: "Đại lý Hải Phòng",
    type: "dai-ly",
    address: "Số 88, Đường Lạch Tray, Ngô Quyền, Hải Phòng",
    province: "Hải Phòng",
    phone: "0923 456 789",
    hours: "8:00 - 20:00 (Hàng ngày)",
    lat: 20.8449,
    lng: 106.6881,
    isActive: true,
  },
  {
    id: "loc-05",
    name: "Đại lý Nghệ An",
    type: "dai-ly",
    address: "Số 56, Đường Lê Lợi, TP Vinh, Nghệ An",
    province: "Nghệ An",
    phone: "0934 567 890",
    hours: "8:00 - 20:00 (Hàng ngày)",
    lat: 18.6796,
    lng: 105.6813,
    isActive: true,
  },
  {
    id: "loc-06",
    name: "Đại lý Đà Nẵng",
    type: "dai-ly",
    address: "Số 123, Đường Nguyễn Văn Linh, Hải Châu, Đà Nẵng",
    province: "Đà Nẵng",
    phone: "0945 678 901",
    hours: "8:00 - 21:00 (Hàng ngày)",
    lat: 16.0544,
    lng: 108.2022,
    isActive: true,
  },
  {
    id: "loc-07",
    name: "Chi nhánh TP.HCM",
    type: "chi-nhanh",
    address: "Số 200, Đường Nguyễn Thị Minh Khai, Quận 3, TP.HCM",
    province: "TP.HCM",
    phone: "0989 852 950",
    hours: "8:00 - 21:00 (Hàng ngày)",
    lat: 10.7769,
    lng: 106.6869,
    isActive: true,
  },
  {
    id: "loc-08",
    name: "Đại lý Cần Thơ",
    type: "dai-ly",
    address: "Số 78, Đường 30 Tháng 4, Ninh Kiều, Cần Thơ",
    province: "Cần Thơ",
    phone: "0956 789 012",
    hours: "8:00 - 20:00 (Hàng ngày)",
    lat: 10.0341,
    lng: 105.7222,
    isActive: true,
  },
];

export const provinces = [...new Set(locations.map((l) => l.province))];
