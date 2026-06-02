export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: "chan-ga" | "tam-cay" | "banh-trang" | "khac";
  categoryLabel: string;
  price: string;
  priceRange: string;
  image: string;
  heroImage: string;
  featured: boolean;
  stats: { label: string; value: string }[];
  ingredients: string[];
  specs: { label: string; value: string }[];
  variants: { name: string; weight: string; price: string; spiceLevel?: number }[];
  processSteps: { step: number; title: string; description: string }[];
  story: string;
}

export const products: Product[] = [
  {
    id: "cg-01",
    slug: "chan-ga",
    name: "Chân Gà Rút Xương",
    tagline: "Giòn tan. Đậm vị. Sạch từ nguồn.",
    description:
      "Chân gà rút xương Bà Tuyết — sản phẩm chủ lực đã chinh phục hàng triệu tín đồ ăn vặt. Được chế biến từ chân gà tươi nguyên chất, rút xương thủ công, tẩm ướp gia vị đậm đà và chiên giòn hoàn hảo.",
    category: "chan-ga",
    categoryLabel: "Chân Gà",
    price: "89.000đ",
    priceRange: "45.000đ - 189.000đ",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80",
    heroImage: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=1200&auto=format&fit=crop&q=80",
    featured: true,
    stats: [
      { label: "Đơn đã bán", value: "2.000.000+" },
      { label: "Đánh giá", value: "4.8★" },
      { label: "Chất bảo quản", value: "0" },
      { label: "Hạng TikTok Shop", value: "#1" },
    ],
    ingredients: [
      "Chân gà tươi nguyên chất",
      "Gia vị tự nhiên (ớt, tỏi, sả)",
      "Dầu thực vật cao cấp",
      "Không chất bảo quản",
      "Không phẩm màu nhân tạo",
    ],
    specs: [
      { label: "Trọng lượng", value: "52g / 150g / 250g" },
      { label: "Hạn sử dụng", value: "6 tháng" },
      { label: "Bảo quản", value: "Nơi khô ráo, thoáng mát" },
      { label: "Chứng nhận", value: "ATTP + Bảo hiểm PVI" },
      { label: "Xuất xứ", value: "Thái Nguyên, Việt Nam" },
      { label: "Nhà sản xuất", value: "NMT Food" },
    ],
    variants: [
      { name: "Vị cay truyền thống", weight: "52g", price: "45.000đ", spiceLevel: 3 },
      { name: "Vị cay truyền thống", weight: "150g", price: "89.000đ", spiceLevel: 3 },
      { name: "Vị cay truyền thống", weight: "250g", price: "139.000đ", spiceLevel: 3 },
      { name: "Vị phô mai", weight: "52g", price: "49.000đ", spiceLevel: 1 },
      { name: "Vị tiêu đen", weight: "52g", price: "45.000đ", spiceLevel: 2 },
      { name: "Vị tỏi", weight: "52g", price: "45.000đ", spiceLevel: 2 },
      { name: "Combo 5 gói mix vị", weight: "260g", price: "189.000đ", spiceLevel: 3 },
    ],
    processSteps: [
      { step: 1, title: "Chọn nguyên liệu", description: "Chân gà tươi từ trang trại đạt chuẩn" },
      { step: 2, title: "Sơ chế sạch", description: "Rửa sạch 3 lần, loại bỏ tạp chất" },
      { step: 3, title: "Ướp gia vị", description: "Tẩm ướp công thức gia vị đặc biệt 4 tiếng" },
      { step: 4, title: "Hấp chín", description: "Hấp bằng hơi nước ở nhiệt độ chuẩn" },
      { step: 5, title: "Rút xương", description: "Rút xương thủ công, giữ nguyên hình dáng" },
      { step: 6, title: "Đóng gói", description: "Đóng gói hút chân không, dán tem QR" },
    ],
    story:
      "Chân gà rút xương là sản phẩm đầu tiên đưa tên tuổi Bà Tuyết đến với hàng triệu người. Bắt đầu từ công thức gia truyền trong căn bếp nhỏ ở Thái Nguyên, trải qua hàng trăm lần thử nghiệm và cải tiến, mỗi miếng chân gà giờ đây là kết tinh của sự kiên trì và tâm huyết.",
  },
  {
    id: "tc-01",
    slug: "tam-cay",
    name: "Tăm Cay",
    tagline: "Cay đã. Cay sạch. Cay đúng chuẩn.",
    description:
      "Tăm cay Bà Tuyết — snack cay nồng đậm vị, được làm từ bột mì và gia vị tự nhiên. Mỗi thanh tăm cay là sự cân bằng hoàn hảo giữa độ giòn, vị cay và hương thơm đặc trưng.",
    category: "tam-cay",
    categoryLabel: "Tăm Cay",
    price: "35.000đ",
    priceRange: "15.000đ - 99.000đ",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=80",
    heroImage: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=1200&auto=format&fit=crop&q=80",
    featured: true,
    stats: [
      { label: "Đơn đã bán", value: "1.500.000+" },
      { label: "Đánh giá", value: "4.7★" },
      { label: "Hương vị", value: "6 vị" },
      { label: "Hạng Shopee", value: "Top 3" },
    ],
    ingredients: [
      "Bột mì cao cấp",
      "Ớt tự nhiên",
      "Dầu thực vật",
      "Gia vị tổng hợp",
      "Không chất bảo quản",
    ],
    specs: [
      { label: "Trọng lượng", value: "25g / 100g / 200g" },
      { label: "Hạn sử dụng", value: "8 tháng" },
      { label: "Bảo quản", value: "Nơi khô ráo, thoáng mát" },
      { label: "Chứng nhận", value: "ATTP + Bảo hiểm PVI" },
      { label: "Xuất xứ", value: "Thái Nguyên, Việt Nam" },
      { label: "Nhà sản xuất", value: "NMT Food" },
    ],
    variants: [
      { name: "Vị cay truyền thống", weight: "25g", price: "15.000đ", spiceLevel: 3 },
      { name: "Vị cay truyền thống", weight: "100g", price: "35.000đ", spiceLevel: 3 },
      { name: "Vị tiêu đen", weight: "25g", price: "15.000đ", spiceLevel: 2 },
      { name: "Vị bò", weight: "25g", price: "17.000đ", spiceLevel: 2 },
      { name: "Vị mắm", weight: "25g", price: "15.000đ", spiceLevel: 3 },
      { name: "Combo 10 gói mix", weight: "250g", price: "99.000đ", spiceLevel: 3 },
    ],
    processSteps: [
      { step: 1, title: "Nhào bột", description: "Bột mì trộn gia vị theo tỷ lệ vàng" },
      { step: 2, title: "Ép sợi", description: "Ép thành sợi tăm đều đặn" },
      { step: 3, title: "Chiên giòn", description: "Chiên trong dầu sạch ở nhiệt độ chuẩn" },
      { step: 4, title: "Tẩm gia vị", description: "Phủ lớp gia vị cay đặc trưng" },
      { step: 5, title: "Kiểm tra", description: "QC kiểm tra từng lô sản phẩm" },
      { step: 6, title: "Đóng gói", description: "Đóng gói kín, giữ trọn độ giòn" },
    ],
    story:
      "Tăm cay — món ăn vặt tuổi thơ của biết bao thế hệ. Bà Tuyết đã nâng tầm món snack bình dân này bằng nguyên liệu sạch và công thức gia vị độc đáo, để mỗi thanh tăm cay không chỉ cay mà còn an toàn.",
  },
  {
    id: "bt-01",
    slug: "banh-trang",
    name: "Snack Bánh Tráng",
    tagline: "Giòn rụm từ bột gạo thuần Việt.",
    description:
      "Snack bánh tráng Bà Tuyết — giòn rụm, đậm đà hương vị Việt. Được làm từ bột gạo nguyên chất, nướng giòn và tẩm gia vị vừa miệng.",
    category: "banh-trang",
    categoryLabel: "Bánh Tráng",
    price: "29.000đ",
    priceRange: "12.000đ - 79.000đ",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80",
    heroImage: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=1200&auto=format&fit=crop&q=80",
    featured: true,
    stats: [
      { label: "Đơn đã bán", value: "800.000+" },
      { label: "Đánh giá", value: "4.6★" },
      { label: "Hương vị", value: "4 vị" },
      { label: "Nguyên liệu", value: "100% VN" },
    ],
    ingredients: [
      "Bột gạo nguyên chất",
      "Gia vị tự nhiên",
      "Hành phi",
      "Dầu thực vật",
      "Không phẩm màu nhân tạo",
    ],
    specs: [
      { label: "Trọng lượng", value: "30g / 80g / 150g" },
      { label: "Hạn sử dụng", value: "8 tháng" },
      { label: "Bảo quản", value: "Nơi khô ráo, thoáng mát" },
      { label: "Chứng nhận", value: "ATTP + Bảo hiểm PVI" },
      { label: "Xuất xứ", value: "Thái Nguyên, Việt Nam" },
      { label: "Nhà sản xuất", value: "NMT Food" },
    ],
    variants: [
      { name: "Vị muối ớt", weight: "30g", price: "12.000đ", spiceLevel: 2 },
      { name: "Vị phô mai", weight: "30g", price: "15.000đ", spiceLevel: 0 },
      { name: "Vị bò nướng", weight: "30g", price: "15.000đ", spiceLevel: 1 },
      { name: "Vị rong biển", weight: "30g", price: "15.000đ", spiceLevel: 0 },
      { name: "Combo 6 gói mix", weight: "180g", price: "79.000đ" },
    ],
    processSteps: [
      { step: 1, title: "Xay bột gạo", description: "Gạo nguyên chất xay mịn" },
      { step: 2, title: "Tráng bánh", description: "Tráng thành lớp mỏng đều" },
      { step: 3, title: "Phơi khô", description: "Sấy ở nhiệt độ chuẩn" },
      { step: 4, title: "Nướng giòn", description: "Nướng đến độ giòn hoàn hảo" },
      { step: 5, title: "Tẩm gia vị", description: "Phủ lớp gia vị đặc trưng" },
      { step: 6, title: "Đóng gói", description: "Đóng gói hút ẩm, giữ giòn" },
    ],
    story:
      "Bánh tráng — hương vị quen thuộc của miền quê Việt Nam. Bà Tuyết mang tinh hoa ẩm thực truyền thống vào từng miếng snack, để bạn thưởng thức được vị giòn rụm đúng chuẩn mọi lúc mọi nơi.",
  },
];

export const otherProducts = [
  { id: "k-01", name: "Snack Đùi Gà Phô Mai", price: "39.000đ", image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80" },
  { id: "k-02", name: "Snack Bò Kobe", price: "35.000đ", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80" },
  { id: "k-03", name: "Snack Sashimi", price: "32.000đ", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=80" },
  { id: "k-04", name: "Snack Bìa Cát Tông", price: "25.000đ", image: "https://images.unsplash.com/photo-1599490659213-e2b9527b0876?w=500&auto=format&fit=crop&q=80" },
  { id: "k-05", name: "Bim Bim Que", price: "20.000đ", image: "https://images.unsplash.com/photo-1618449840665-9ed506d73a34?w=500&auto=format&fit=crop&q=80" },
  { id: "k-06", name: "Quẩy Que", price: "22.000đ", image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80" },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}
