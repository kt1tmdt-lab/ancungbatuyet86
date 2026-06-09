const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const realProducts = [
  {
    slug: "chan-ga",
    name: "Chân Gà Rút Xương Vị Cay Tê",
    tagline: "Giòn sần sật, vị cay tê đậm đà chuẩn vị ăn vặt Bà Tuyết.",
    description: "Chân gà rút xương được tuyển chọn từ nguồn nguyên liệu sạch đạt tiêu chuẩn VietGAP. Sơ chế sạch sẽ qua 3 bước khử trùng sục ozone, hấp chín tới và rút xương thủ công khéo léo để giữ nguyên độ giòn dai đặc trưng. Gia vị sốt cay tê thấm đượm từng thớ thịt.",
    category: "chan-ga",
    categoryLabel: "Chân Gà",
    price: "15.000đ",
    priceRange: "15.000đ - 180.000đ",
    image: "/uploads/1780482157869-chan-ga-rut-xuong-moi-png.png",
    heroImage: "/uploads/1780482157869-chan-ga-rut-xuong-moi-png.png",
    featured: true,
    purchaseUrl: "https://shopee.vn/an-vat-ba-tuyet-chan-ga",
    ingredients: [
      "Chân gà tươi sạch (92%)",
      "Ớt tươi",
      "Hoa tiêu",
      "Gừng",
      "Sả",
      "Muối ăn",
      "Đường kính",
      "Dầu thực vật"
    ],
    specs: [
      { label: "Trọng lượng", value: "52g / gói" },
      { label: "Hạn sử dụng", value: "6 tháng kể từ ngày sản xuất" },
      { label: "Bảo quản", value: "Nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp" },
      { label: "Tiêu chuẩn", value: "Đạt chứng nhận ATVSTP & Bảo hiểm PVI bảo chứng" },
      { label: "Nơi sản xuất", value: "Thái Nguyên, Việt Nam" }
    ],
    variants: [
      { name: "Vị Cay Tê Truyền Thống", weight: "52g", price: "15.000đ", spiceLevel: 3 },
      { name: "Vị Tỏi Ớt Thơm Nồng", weight: "52g", price: "15.000đ", spiceLevel: 2 },
      { name: "Combo 5 Gói Tiết Kiệm", weight: "260g", price: "69.000đ", spiceLevel: 3 },
      { name: "Combo 10 Gói Siêu Hời", weight: "520g", price: "129.000đ", spiceLevel: 3 }
    ],
    stats: [
      { label: "Đơn đã bán", value: "5.000.000+" },
      { label: "Đánh giá", value: "4.9★" },
      { label: "TikTok Shop", value: "Top 1" }
    ],
    processSteps: [
      { step: 1, title: "Kiểm định nguyên liệu", description: "Chân gà tươi nhập từ trang trại sạch VietGAP" },
      { step: 2, title: "Khử trùng sục ozone", description: "Loại bỏ hoàn toàn vi khuẩn có hại" },
      { step: 3, title: "Rút xương thủ công", description: "Thực hiện bởi thợ lành nghề trong phòng vô trùng" },
      { step: 4, title: "Ủ sốt cay tê", description: "Tẩm ướp sốt hoa tiêu ớt hiểm trong 6 tiếng" },
      { step: 5, title: "Đóng gói hút chân không", description: "Đảm bảo tươi ngon không dùng chất bảo quản" }
    ],
    story: "Sản phẩm Chân Gà Rút Xương bắt đầu từ công thức ủ sả ớt truyền thống trong căn bếp nhỏ của Bà Tuyết. Nhờ sự yêu mến của hàng triệu bạn trẻ qua mạng xã hội, công thức gia đình đã được nhân rộng lên quy mô nhà máy hiện đại, nhưng hương vị cay giòn đậm đà nguyên bản vẫn được giữ trọn vẹn."
  },
  {
    slug: "tam-cay",
    name: "Tăm Cay Bà Tuyết",
    tagline: "Snack tăm cay giòn ngon, cay nồng khơi lại hương vị tuổi thơ.",
    description: "Tăm Cay Bà Tuyết là món ăn vặt quốc dân gắn liền với tuổi học trò. Được chế biến từ bột mì thượng hạng phối trộn nước sốt ớt cay gia truyền theo tỷ lệ vàng. Chiên giòn bằng dầu thực vật sạch và đóng gói kín giữ nguyên độ giòn cay.",
    category: "tam-cay",
    categoryLabel: "Tăm Cay",
    price: "10.000đ",
    priceRange: "10.000đ - 99.000đ",
    image: "/uploads/1780481867397-bimbim-tam-cay-10k.png",
    heroImage: "/uploads/1780481867397-bimbim-tam-cay-10k.png",
    featured: true,
    purchaseUrl: "https://shopee.vn/an-vat-ba-tuyet-tam-cay",
    ingredients: [
      "Bột mì nguyên cám",
      "Ớt bột tự nhiên",
      "Dầu thực vật tinh luyện",
      "Muối ăn",
      "Đường kính",
      "Ngũ vị hương"
    ],
    specs: [
      { label: "Trọng lượng", value: "25g / gói" },
      { label: "Hạn sử dụng", value: "8 tháng kể từ ngày sản xuất" },
      { label: "Bảo quản", value: "Nơi khô ráo, tránh ẩm ướt" },
      { label: "Chứng nhận", value: "Đạt chuẩn ATVSTP, đóng gói quy trình khép kín" },
      { label: "Nơi sản xuất", value: "Thái Nguyên, Việt Nam" }
    ],
    variants: [
      { name: "Vị Cay Truyền Thống", weight: "25g", price: "10.000đ", spiceLevel: 3 },
      { name: "Combo 5 Gói Mix Vị", weight: "125g", price: "45.000đ", spiceLevel: 3 },
      { name: "Combo 10 Gói Giá Sốc", weight: "250g", price: "85.000đ", spiceLevel: 3 }
    ],
    stats: [
      { label: "Đơn đã bán", value: "4.000.000+" },
      { label: "Đánh giá", value: "4.8★" },
      { label: "Hương vị", value: "Tuổi thơ" }
    ],
    processSteps: [
      { step: 1, title: "Trộn bột mì", description: "Bột mì nhào nước gia vị theo tỷ lệ vàng" },
      { step: 2, title: "Đùn sợi tạo hình", description: "Ép thành các thanh tăm cay tròn đều tăm tắp" },
      { step: 3, title: "Chiên giòn nhiệt độ cao", description: "Sử dụng dầu sạch thay mới hàng ngày" },
      { step: 4, title: "Tẩm bột sốt cay", description: "Phủ đều ớt bột và sốt cay đặc trưng" },
      { step: 5, title: "Đóng gói bảo quản", description: "Đóng bao bì nhôm cách ẩm giữ độ giòn" }
    ],
    story: "Mong muốn nâng tầm món tăm ăn vặt tuổi thơ trở thành sản phẩm sạch sẽ, an tâm cho mọi lứa tuổi, Bà Tuyết đã nghiên cứu quy trình ép bột và sấy sạch để loại bỏ dầu thừa, giữ lại vị cay giòn tê tê hoàn hảo."
  },
  {
    slug: "tam-cay-tieu-den",
    name: "Tăm Cay Vị Tiêu Đen",
    tagline: "Giòn dai thơm nức hương vị tiêu đen Phú Quốc.",
    description: "Dòng sản phẩm tăm cay cải tiến kết hợp hoàn hảo giữa bột mì thơm giòn và sốt dầu tiêu đen nồng ấm. Vị cay dịu hơn so với tăm ớt đỏ nhưng mùi tiêu đen thơm phức kích thích vị giác cực mạnh.",
    category: "tam-cay",
    categoryLabel: "Tăm Cay",
    price: "12.000đ",
    priceRange: "12.000đ - 99.000đ",
    image: "/uploads/1780482061970-tan-cay-tieu-den.png",
    heroImage: "/uploads/1780482061970-tan-cay-tieu-den.png",
    featured: false,
    purchaseUrl: "https://shopee.vn/an-vat-ba-tuyet-tam-cay",
    ingredients: [
      "Bột mì hảo hạng",
      "Hạt tiêu đen nghiền (4%)",
      "Dầu đậu nành",
      "Muối ăn",
      "Đường",
      "Gia vị thảo mộc"
    ],
    specs: [
      { label: "Trọng lượng", value: "28g / gói" },
      { label: "Hạn sử dụng", value: "8 tháng kể từ ngày sản xuất" },
      { label: "Bảo quản", value: "Nơi khô thoáng, tránh ẩm" },
      { label: "Nơi sản xuất", value: "Thái Nguyên, Việt Nam" }
    ],
    variants: [
      { name: "Gói Tiêu Đen Truyền Thống", weight: "28g", price: "12.000đ", spiceLevel: 2 },
      { name: "Combo 5 Gói Tiết Kiệm", weight: "140g", price: "55.000đ", spiceLevel: 2 }
    ],
    stats: [
      { label: "Đơn đã bán", value: "1.200.000+" },
      { label: "Đánh giá", value: "4.8★" },
      { label: "Đặc trưng", value: "Thơm tiêu đen" }
    ],
    processSteps: [
      { step: 1, title: "Nhào bột tiêu đen", description: "Bột mì nhào cùng tiêu đen xay nhuyễn" },
      { step: 2, title: "Ép thanh dẹt", description: "Tạo hình dẹt bản to tăng độ thấm gia vị" },
      { step: 3, title: "Nướng giòn tách dầu", description: "Nướng sấy giòn không dầu mỡ ngấy" },
      { step: 4, title: "Phun sấy hương vị", description: "Tẩm sốt thơm tiêu đen Phú Quốc" }
    ],
    story: "Lấy ý tưởng từ hạt tiêu đen cay thơm nồng ấm của đất Việt, Tăm Cay Tiêu Đen ra đời nhằm đem đến một lựa chọn mới lạ cho những ai yêu thích vị thơm ấm thay vì vị cay xé lưỡi của ớt hiểm."
  },
  {
    slug: "banh-trang",
    name: "Snack Bánh Tráng Vị Sa Tế Bò",
    tagline: "Giòn tan rôm rốp đậm đà vị sa tế bò nướng.",
    description: "Snack bánh tráng là sự kết hợp độc đáo giữa bột gạo nếp Việt Nam và công nghệ sấy nướng hiện đại. Bánh tráng giòn tan, phủ lớp gia vị sa tế bò đậm đà thơm hành phi nịnh miệng.",
    category: "banh-trang",
    categoryLabel: "Bánh Tráng",
    price: "15.000đ",
    priceRange: "15.000đ - 79.000đ",
    image: "/uploads/1780482043582-snack-banh-trang-vi-sa-te-bo.png",
    heroImage: "/uploads/1780482043582-snack-banh-trang-vi-sa-te-bo.png",
    featured: true,
    purchaseUrl: "https://shopee.vn/an-vat-ba-tuyet-banh-trang",
    ingredients: [
      "Bột gạo nếp tinh chất (75%)",
      "Sa tế bò (8%)",
      "Hành phi",
      "Muối Tây Ninh",
      "Ớt bột",
      "Dầu ăn"
    ],
    specs: [
      { label: "Trọng lượng", value: "35g / gói" },
      { label: "Hạn sử dụng", value: "6 tháng kể từ ngày sản xuất" },
      { label: "Bảo quản", value: "Nơi khô ráo, buộc kín sau khi mở" },
      { label: "Nơi sản xuất", value: "Thái Nguyên, Việt Nam" }
    ],
    variants: [
      { name: "Vị Sa Tế Bò Thơm Cay", weight: "35g", price: "15.000đ", spiceLevel: 2 },
      { name: "Vị Phô Mai Sữa Béo", weight: "35g", price: "15.000đ", spiceLevel: 0 },
      { name: "Combo 6 Gói Mix Vị", weight: "210g", price: "79.000đ", spiceLevel: 2 }
    ],
    stats: [
      { label: "Đơn đã bán", value: "2.500.000+" },
      { label: "Đánh giá", value: "4.9★" },
      { label: "Độ giòn", value: "Rôm rốp" }
    ],
    processSteps: [
      { step: 1, title: "Tráng nướng bánh", description: "Tráng bột nếp mỏng, sấy khô nướng phồng" },
      { step: 2, title: "Nghiền lắc gia vị", description: "Lắc gia vị sa tế bò nướng phủ đều mặt bánh" },
      { step: 3, title: "Trộn hành phi giòn", description: "Thêm hành phi sấy giòn thơm ngậy" },
      { step: 4, title: "Đóng gói chống ẩm", description: "Đóng túi nhôm có hạt hút ẩm để giữ bánh luôn giòn" }
    ],
    story: "Bánh tráng trộn vỉa hè đầy dầu mỡ giờ đây được nâng cấp thành miếng Snack Bánh Tráng giòn rụm, khô ráo dầu, sản xuất khép kín vệ sinh nhưng vị đậm đà hành phi sa tế thì vẫn cực kỳ lôi cuốn."
  },
  {
    slug: "dui-ga-pho-mai",
    name: "Snack Đùi Gà Phô Mai Đóng Hũ",
    tagline: "Đùi gà giòn phồng thơm ngậy vị bột phô mai lắc.",
    description: "Món snack đùi gà tuổi thơ dạng hình đùi gà phồng giòn tan rụm. Lớp vỏ được lắc bột phô mai vàng óng béo ngậy thơm nức mũi. Đóng dạng hũ pet trong suốt vệ sinh lịch sự, dễ ăn và bảo quản.",
    category: "khac",
    categoryLabel: "Ăn Vặt Khác",
    price: "39.000đ",
    priceRange: "39.000đ - 75.000đ",
    image: "/uploads/1780482013661-dui-ga-pho-mai-700g.png",
    heroImage: "/uploads/1780482013661-dui-ga-pho-mai-700g.png",
    featured: true,
    purchaseUrl: "https://shopee.vn/nmtvlog99",
    ingredients: [
      "Bột mì",
      "Bột ngô",
      "Bột phô mai Pháp (8%)",
      "Đường cát",
      "Bơ thực vật",
      "Dầu đậu nành",
      "Muối"
    ],
    specs: [
      { label: "Quy cách đóng gói", value: "Hũ Pet 700g" },
      { label: "Hạn sử dụng", value: "6 tháng kể từ ngày sản xuất" },
      { label: "Bảo quản", value: "Đậy kín nắp sau khi ăn, bảo quản thoáng mát" },
      { label: "Nơi sản xuất", value: "Thái Nguyên, Việt Nam" }
    ],
    variants: [
      { name: "Hũ Nhỏ Tiện Lợi", weight: "350g", price: "25.000đ", spiceLevel: 0 },
      { name: "Hũ Lớn Siêu To", weight: "700g", price: "39.000đ", spiceLevel: 0 }
    ],
    stats: [
      { label: "Đơn đã bán", value: "900.000+" },
      { label: "Đánh giá", value: "4.7★" },
      { label: "Quy cách", value: "Hũ Pet cao cấp" }
    ],
    processSteps: [
      { step: 1, title: "Tạo hình bánh đùi gà", description: "Cắt bột thành hình đùi gà rỗng ruột" },
      { step: 2, title: "Chiên phồng nở", description: "Chiên nhanh tách dầu để đùi gà giòn rỗng" },
      { step: 3, title: "Lắc bột phô mai", description: "Phủ bột bơ phô mai lắc nóng" },
      { step: 4, title: "Đóng hũ dán màng seal", description: "Dán màng seal bạc giữ giòn và chống ẩm tuyệt đối" }
    ],
    story: "Đùi gà phô mai đóng hũ là giải pháp tuyệt vời cho các buổi dã ngoại, xem phim gia đình. Thiết kế hũ sang trọng giúp giữ trọn vẹn hình dáng giòn phồng thơm béo không lo vỡ nát."
  },
  {
    slug: "snack-nem-nuong",
    name: "Snack Nem Nướng Bà Tuyết",
    tagline: "Miếng nem dai ngon vị nướng lò thơm phức.",
    description: "Snack nem nướng giả bò nướng hương vị thơm dai đậm đà sả ớt. Được làm từ bột mì cán dẹt tẩm nước sốt nem nướng đặc sản sấy lò thơm dẻo dai sần sật.",
    category: "khac",
    categoryLabel: "Ăn Vặt Khác",
    price: "15.000đ",
    priceRange: "15.000đ - 89.000đ",
    image: "/uploads/1780481989589-snack-nem-nuong-ba-tuyet-2k.png",
    heroImage: "/uploads/1780481989589-snack-nem-nuong-ba-tuyet-2k.png",
    featured: false,
    purchaseUrl: "https://shopee.vn/nmtvlog99",
    ingredients: [
      "Bột mì",
      "Sốt nướng BBQ",
      "Bột tỏi",
      "Bột ớt",
      "Sả băm",
      "Muối",
      "Đường"
    ],
    specs: [
      { label: "Trọng lượng", value: "30g / gói" },
      { label: "Hạn sử dụng", value: "6 tháng kể từ ngày sản xuất" },
      { label: "Bảo quản", value: "Nơi khô thoáng, ăn ngay sau khi mở" }
    ],
    variants: [
      { name: "Gói Nem Nướng Truyền Thống", weight: "30g", price: "15.000đ", spiceLevel: 2 },
      { name: "Combo 10 Gói Tặng 1", weight: "300g", price: "89.000đ", spiceLevel: 2 }
    ],
    stats: [
      { label: "Đơn đã bán", value: "1.800.000+" },
      { label: "Đánh giá", value: "4.8★" },
      { label: "Độ dẻo dai", value: "Sần sật" }
    ],
    processSteps: [
      { step: 1, title: "Cán mỏng dẹt bột", description: "Cán dẹt tạo vân sọc như nem nướng xiên" },
      { step: 2, title: "Sấy chín dẻo", description: "Sấy dẻo dai ở nhiệt độ vừa phải" },
      { step: 3, title: "Quét sốt nem nướng", description: "Quét nước sốt tỏi sả nướng nóng hổi" },
      { step: 4, title: "Đóng gói cách nhiệt", description: "Giữ nem dẻo dai thơm lừng không bị khô cứng" }
    ],
    story: "Món nem nướng tăm sả vỉa hè được tái hiện chỉn chu sạch sẽ, đóng gói gọn gàng giúp bạn thỏa mãn cơn thèm ăn vặt dẻo dai thơm lừng mọi lúc mọi nơi."
  },
  {
    slug: "gan-rong-hap-xa",
    name: "Gân Rồng Hấp Xả Vị Cay",
    tagline: "Snack chay dẻo dai sần sật, vị sả ớt cuốn hút.",
    description: "Gân Rồng Hấp Xả là món ăn vặt cực hot của giới trẻ. Sợi gân chay được cán xoắn dai dẻo sần sật, tẩm ướp cùng hương sả tươi và ớt hiểm sốt cay mang đến trải nghiệm ăn vô cùng vui miệng.",
    category: "khac",
    categoryLabel: "Ăn Vặt Khác",
    price: "15.000đ",
    priceRange: "15.000đ - 79.000đ",
    image: "/uploads/1780481777960-gan-rong-new.png",
    heroImage: "/uploads/1780481777960-gan-rong-new.png",
    featured: false,
    purchaseUrl: "https://shopee.vn/nmtvlog99",
    ingredients: [
      "Bột đậu nành",
      "Bột mì",
      "Tinh chất sả tươi",
      "Ớt cay",
      "Dầu hạt cải",
      "Muối",
      "Đường"
    ],
    specs: [
      { label: "Trọng lượng", value: "32g / gói" },
      { label: "Hạn sử dụng", value: "6 tháng kể từ ngày sản xuất" },
      { label: "Bảo quản", value: "Nơi mát lạnh hoặc thoáng mát" }
    ],
    variants: [
      { name: "Gân Rồng Vị Sả Ớt", weight: "32g", price: "15.000đ", spiceLevel: 3 },
      { name: "Combo 5 Gói Sả Ớt", weight: "160g", price: "65.000đ", spiceLevel: 3 }
    ],
    stats: [
      { label: "Đơn đã bán", value: "2.200.000+" },
      { label: "Đánh giá", value: "4.9★" },
      { label: "Kết cấu", value: "Dai giòn sần sật" }
    ],
    processSteps: [
      { step: 1, title: "Ép đùn gân đậu nành", description: "Ép xoắn tạo độ dai như gân bò" },
      { step: 2, title: "Hấp tiệt trùng", description: "Hấp hơi nước giữ nguyên độ ẩm dẻo" },
      { step: 3, title: "Trộn tinh chất sả ớt", description: "Ngâm ủ sốt sả ớt cho thẩm thấu sâu" },
      { step: 4, title: "Đóng gói chân không", description: "Bảo quản tươi dẻo giòn dai tự nhiên" }
    ],
    story: "Gân rồng hấp sả lấy cảm hứng từ món gân sả ớt truyền thống nhưng được biến tấu chay hóa từ đậu nành tốt cho sức khỏe, vị dai ngon sần sật cắn ngập răng gây nghiện."
  },
  {
    slug: "snack-bo-kobe",
    name: "Snack Bò Kobe Thơm Cay",
    tagline: "Snack giòn sấy nướng, đậm đà vị thịt bò tẩm gia vị.",
    description: "Snack giòn xốp vị thịt bò nướng lò thơm ngon nức lòng. Miếng snack vàng giòn rụm thấm vị sốt bò Kobe đậm đà nịnh miệng.",
    category: "khac",
    categoryLabel: "Ăn Vặt Khác",
    price: "12.000đ",
    priceRange: "12.000đ - 55.000đ",
    image: "/uploads/1780482029143-bo-kobe.png",
    heroImage: "/uploads/1780482029143-bo-kobe.png",
    featured: false,
    purchaseUrl: "https://shopee.vn/nmtvlog99",
    ingredients: [
      "Bột mì",
      "Tinh bột ngô",
      "Hương bò Kobe tổng hợp",
      "Sốt tiêu đen",
      "Dầu ăn",
      "Muối"
    ],
    specs: [
      { label: "Trọng lượng", value: "25g / gói" },
      { label: "Hạn sử dụng", value: "8 tháng kể từ ngày sản xuất" }
    ],
    variants: [
      { name: "Vị Bò Kobe Truyền Thống", weight: "25g", price: "12.000đ", spiceLevel: 1 },
      { name: "Combo 5 Gói Cực Hời", weight: "125g", price: "49.000đ", spiceLevel: 1 }
    ],
    stats: [
      { label: "Đơn đã bán", value: "500.000+" },
      { label: "Đánh giá", value: "4.6★" }
    ],
    processSteps: [
      { step: 1, title: "Đùn xốp tạo ô vuông", description: "Ép phồng đùn ô vuông lưới" },
      { step: 2, title: "Sấy giòn tách béo", description: "Sấy khô loại bỏ dầu ngấy" },
      { step: 3, title: "Lắc hương vị bò nướng", description: "Phủ sốt thịt bò nướng Kobe" }
    ],
    story: "Sản phẩm mang đến hương vị béo ngậy đậm đà cao cấp của thịt bò nướng kết hợp cùng độ giòn xốp tan ngay trên đầu lưỡi."
  },
  {
    slug: "snack-bia-cat-tong",
    name: "Snack Bìa Cát Tông Vị Cay Tê",
    tagline: "Snack cán dẹt dai giòn sần sật siêu cay độc đáo.",
    description: "Món ăn vặt độc lạ trứ danh của Bà Tuyết. Tấm snack cán dẹt to bản dẻo dai sần sật như bìa giấy cát tông nhưng cực kỳ ngấm nước sốt siêu cay tê lưỡi, mang đến cảm giác nhai vô cùng kích thích.",
    category: "khac",
    categoryLabel: "Ăn Vặt Khác",
    price: "15.000đ",
    priceRange: "15.000đ - 79.000đ",
    image: "/uploads/1780481698378-snack-bia-carton.png",
    heroImage: "/uploads/1780481698378-snack-bia-carton.png",
    featured: false,
    purchaseUrl: "https://shopee.vn/nmtvlog99",
    ingredients: [
      "Bột mì tẩm gia vị",
      "Ớt bột siêu cay chấu",
      "Sốt hoa tiêu",
      "Đường cát",
      "Muối ăn"
    ],
    specs: [
      { label: "Trọng lượng", value: "32g / gói" },
      { label: "Hạn sử dụng", value: "6 tháng kể từ ngày sản xuất" }
    ],
    variants: [
      { name: "Bìa Cát Tông Siêu Cay", weight: "32g", price: "15.000đ", spiceLevel: 3 },
      { name: "Combo 5 Tấm Bìa Cát Tông", weight: "160g", price: "65.000đ", spiceLevel: 3 }
    ],
    stats: [
      { label: "Đơn đã bán", value: "1.500.000+" },
      { label: "Đánh giá", value: "4.8★" }
    ],
    processSteps: [
      { step: 1, title: "Cán bột ép phẳng", description: "Cán bột mì dẹt mỏng to bản xếp nếp" },
      { step: 2, title: "Nướng sấy giữ dẻo", description: "Sấy dẻo dai đàn hồi nhẹ" },
      { step: 3, title: "Nhúng sốt hoa tiêu chấu", description: "Tẩm đẫm dầu sốt hoa tiêu chấu siêu cay" }
    ],
    story: "Tên gọi 'Bìa Cát Tông' hài hước xuất phát từ hình dáng dẹt dài to bản dẻo dai của miếng bánh cay. Đây là món ăn vặt được hàng triệu Tiktoker quay clip ăn thử nhờ độ dẻo dai nhai cực lâu cực đã."
  }
];

async function main() {
  console.log("Clearing existing products...");
  await prisma.product.deleteMany({});
  console.log("Inserting real products...");

  for (const prod of realProducts) {
    await prisma.product.create({
      data: prod
    });
    console.log(`Created product: ${prod.name}`);
  }

  console.log("Database seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("Reseed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
