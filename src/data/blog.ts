export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: "thong-bao" | "hau-truong" | "cong-thuc" | "bao-chi";
  categoryLabel: string;
  image: string;
  date: string;
  readTime: string;
  featured: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: "b-01",
    slug: "khanh-thanh-nha-may-3300m2",
    title: "Ăn Cùng Bà Tuyết khánh thành nhà máy 3.300m² tại Thái Nguyên",
    excerpt:
      "Nhà máy mới với diện tích 3.300m² đánh dấu bước ngoặt quan trọng trong hành trình nâng cao chất lượng sản phẩm và mở rộng công suất sản xuất.",
    category: "thong-bao",
    categoryLabel: "Thông báo",
    image: "/uploads/1780482157869-chan-ga-rut-xuong-moi-png.png",
    date: "2026-05-10",
    readTime: "5 phút",
    featured: true,
  },
  {
    id: "b-02",
    slug: "bao-hiem-pvi-cho-nguoi-tieu-dung",
    title: "ACBT hợp tác PVI — Mua bảo hiểm cho người tiêu dùng",
    excerpt:
      "Ăn Cùng Bà Tuyết trở thành thương hiệu đồ ăn vặt đầu tiên mua bảo hiểm trách nhiệm sản phẩm cho khách hàng, khẳng định cam kết chất lượng.",
    category: "thong-bao",
    categoryLabel: "Thông báo",
    image: "/uploads/1780482013661-dui-ga-pho-mai-700g.png",
    date: "2026-03-15",
    readTime: "4 phút",
    featured: false,
  },
  {
    id: "b-03",
    slug: "hau-truong-san-xuat-chan-ga",
    title: "Hậu trường: Một ngày tại xưởng sản xuất chân gà rút xương",
    excerpt:
      "Từ 4 giờ sáng, đội ngũ đã bắt đầu ngày mới. Theo chân chúng tôi khám phá quy trình tạo ra sản phẩm best-seller của Bà Tuyết.",
    category: "hau-truong",
    categoryLabel: "Hậu trường",
    image: "/uploads/1780482043582-snack-banh-trang-vi-sa-te-bo.png",
    date: "2026-04-22",
    readTime: "6 phút",
    featured: false,
  },
  {
    id: "b-04",
    slug: "cong-thuc-an-vat-sang-tao",
    title: "5 cách biến tấu snack Bà Tuyết thành món ăn mới lạ",
    excerpt:
      "Không chỉ ăn trực tiếp — tăm cay có thể trộn mì, chân gà rút xương kết hợp cơm cháy... Khám phá những công thức sáng tạo từ cộng đồng.",
    category: "cong-thuc",
    categoryLabel: "Công thức",
    image: "/uploads/1780482061970-tan-cay-tieu-den.png",
    date: "2026-04-10",
    readTime: "3 phút",
    featured: false,
  },
  {
    id: "b-05",
    slug: "mv-an-cung-ba-tuyet-x-tuan-cry",
    title: "Ra mắt MV 'Ăn Cùng Bà Tuyết' kết hợp cùng Tuấn Cry",
    excerpt:
      "MV âm nhạc đầu tiên của thương hiệu đồ ăn vặt Việt Nam, kể câu chuyện từ người nông dân đến thương hiệu quốc dân.",
    category: "bao-chi",
    categoryLabel: "Báo chí",
    image: "/uploads/1780481989589-snack-nem-nuong-ba-tuyet-2k.png",
    date: "2026-05-01",
    readTime: "4 phút",
    featured: false,
  },
  {
    id: "b-06",
    slug: "top-1-tiktok-shop-an-vat",
    title: "Ăn Cùng Bà Tuyết giữ vững Top 1 TikTok Shop ngành ăn vặt",
    excerpt:
      "Với hơn 6.2 triệu đơn hàng, thương hiệu tiếp tục dẫn đầu danh mục đồ ăn vặt trên nền tảng thương mại điện tử lớn nhất.",
    category: "bao-chi",
    categoryLabel: "Báo chí",
    image: "/uploads/1780481698378-snack-bia-carton.png",
    date: "2026-02-20",
    readTime: "3 phút",
    featured: false,
  },
];

export const blogCategories = [
  { value: "all", label: "Tất cả" },
  { value: "thong-bao", label: "Thông báo" },
  { value: "hau-truong", label: "Hậu trường" },
  { value: "cong-thuc", label: "Công thức" },
  { value: "bao-chi", label: "Báo chí" },
];
