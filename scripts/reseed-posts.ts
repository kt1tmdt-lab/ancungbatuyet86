const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Clearing existing post tags, logs, and posts...");
  await prisma.postReviewLog.deleteMany({});
  await prisma.postTag.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.category.deleteMany({});

  console.log("Finding seeded author user...");
  let author = await prisma.user.findFirst({
    where: { role: "ADMIN" }
  });

  if (!author) {
    author = await prisma.user.findFirst();
  }

  if (!author) {
    throw new Error("No user found in database. Seed users first using npm run seed");
  }

  console.log("Seeding Categories...");
  const catThongBao = await prisma.category.create({
    data: { name: "Thông báo", slug: "thong-bao", description: "Các tin tức hoạt động và thông báo chính thức từ Ăn Cùng Bà Tuyết." },
  });

  const catHauTruong = await prisma.category.create({
    data: { name: "Hậu trường", slug: "hau-truong", description: "Khám phá câu chuyện đằng sau hậu trường sản xuất của chúng tôi." },
  });

  const catCongThuc = await prisma.category.create({
    data: { name: "Công thức", slug: "cong-thuc", description: "Những cách chế biến món ăn ngon từ đồ ăn vặt Bà Tuyết." },
  });

  const catBaoChi = await prisma.category.create({
    data: { name: "Báo chí", slug: "bao-chi", description: "Báo chí viết về Ăn Cùng Bà Tuyết và các thành tích nổi bật." },
  });

  console.log("Seeding Tags...");
  const tagNhaMay = await prisma.tag.create({ data: { name: "Nhà máy", slug: "nha-may" } });
  const tagAnVat = await prisma.tag.create({ data: { name: "Ăn vặt", slug: "an-vat" } });
  const tagChanGa = await prisma.tag.create({ data: { name: "Chân gà", slug: "chan-ga" } });
  const tagSuKien = await prisma.tag.create({ data: { name: "Sự kiện", slug: "su-kien" } });

  console.log("Seeding real posts...");

  // Post 1: Nhà máy
  const post1 = await prisma.post.create({
    data: {
      title: "Ăn Cùng Bà Tuyết khánh thành nhà máy 3.300m² tại Thái Nguyên",
      slug: "khanh-thanh-nha-may-3300m2",
      excerpt: "Nhà máy mới đạt chuẩn quốc tế HACCP đánh dấu bước tiến đột phá, tăng công suất lên gấp 3 lần nhằm cung ứng đầy đủ đồ ăn vặt sạch cho toàn quốc.",
      content: `<h2>Sự kiện khánh thành nhà máy Thái Nguyên</h2>
<p>Nhằm đáp ứng nhu cầu ngày càng lớn của thị trường đồ ăn vặt Việt Nam, thương hiệu Ăn Cùng Bà Tuyết chính thức khánh thành tổ hợp nhà máy sản xuất mới quy mô hơn 3.300m² tại Thái Nguyên. Đây là nhà máy hiện đại bậc nhất trong phân khúc sản xuất đồ ăn vặt đóng gói hiện nay.</p>
<h3>Dây chuyền tự động khép kín</h3>
<p>Toàn bộ quy trình từ tuyển chọn nguyên liệu, sơ chế, khử trùng cho tới chế biến và đóng gói đều được tự động hóa tối đa bằng máy móc nhập khẩu. Đội ngũ kỹ sư KCS luôn kiểm tra chặt chẽ độ tiệt trùng trong từng công đoạn, đảm bảo không có tác nhân bên ngoài lọt vào.</p>
<p>Đại diện thương hiệu chia sẻ: <em>"Nhà máy mới không chỉ giải quyết bài toán thiếu hụt nguồn cung mỗi đợt Livestream mà quan trọng nhất là lời khẳng định cam kết của thương hiệu: Ăn vặt phải SẠCH và AN TOÀN."</em></p>`,
      coverImageUrl: "/uploads/1780482157869-chan-ga-rut-xuong-moi-png.png",
      status: "PUBLISHED",
      authorId: author.id,
      categoryId: catThongBao.id,
      seoTitle: "Ăn Cùng Bà Tuyết khánh thành nhà máy 3.300m2 Thái Nguyên",
      seoDescription: "Ăn Cùng Bà Tuyết chính thức khánh thành nhà máy sản xuất đồ ăn vặt sạch quy mô 3.300m2 tại Thái Nguyên đạt chuẩn HACCP.",
      seoKeywords: "nhà máy bà tuyết, ăn cùng bà tuyết thái nguyên, đồ ăn vặt sạch",
      publishedAt: new Date(),
      viewCount: 2540,
    }
  });

  // Post 2: Bảo hiểm PVI
  const post2 = await prisma.post.create({
    data: {
      title: "Ăn Cùng Bà Tuyết hợp tác Bảo hiểm PVI — Bảo vệ sức khỏe người dùng",
      slug: "bao-hiem-pvi-cho-nguoi-tieu-dung",
      excerpt: "Bước đi đột phá của Ăn Cùng Bà Tuyết khi trở thành thương hiệu đồ ăn vặt tiên phong mua gói bảo hiểm trách nhiệm sản phẩm cho khách hàng.",
      content: `<h2>Ký kết hợp tác cùng Tổng công ty Bảo hiểm PVI</h2>
<p>Để củng cố niềm tin tuyệt đối của khách hàng, Ăn Cùng Bà Tuyết đã hoàn tất thủ tục ký kết hợp đồng bảo hiểm trách nhiệm sản phẩm với Tổng công ty Bảo hiểm PVI. Theo điều khoản ký kết, khách hàng mua sản phẩm chính hãng của ACBT sẽ được bảo vệ quyền lợi tối đa nếu phát hiện các vấn đề liên quan đến vệ sinh an toàn thực phẩm.</p>
<h3>Khẳng định chất lượng hàng đầu</h3>
<p>Đây là hành động thiết thực chứng minh sự tự tin của thương hiệu đối với quy trình quản lý chất lượng khép kín tại nhà máy. Ăn Cùng Bà Tuyết không chỉ bán hương vị ngon mà bán cả sự an tâm trọn vẹn cho khách hàng.</p>`,
      coverImageUrl: "/uploads/1780481867397-bimbim-tam-cay-10k.png",
      status: "PUBLISHED",
      authorId: author.id,
      categoryId: catThongBao.id,
      seoTitle: "Ăn Cùng Bà Tuyết ký kết mua bảo hiểm trách nhiệm PVI",
      seoDescription: "Ăn Cùng Bà Tuyết là thương hiệu đồ ăn vặt đầu tiên mua bảo hiểm trách nhiệm sản phẩm PVI bảo vệ sức khỏe người tiêu dùng.",
      seoKeywords: "bảo hiểm pvi, ăn cùng bà tuyết bảo hiểm, đồ ăn vặt chất lượng",
      publishedAt: new Date(),
      viewCount: 1890,
    }
  });

  // Post 3: Hậu trường
  const post3 = await prisma.post.create({
    data: {
      title: "Hậu trường: Quy trình chế biến chân gà rút xương sạch sẽ",
      slug: "hau-truong-san-xuat-chan-ga",
      excerpt: "Khám phá quy trình chế biến khép kín chân gà rút xương Bà Tuyết từ khâu kiểm định nguyên liệu đến thành phẩm đóng gói hút chân không.",
      content: `<h2>Bắt đầu từ nguồn nguyên liệu đạt chuẩn VietGAP</h2>
<p>Chân gà tươi được nhập khẩu chính ngạch và thu mua từ các trang trại chăn nuôi chuẩn quy mô lớn. Từng lô hàng đều được kiểm tra cảm quan và đo nhiệt độ bảo quản nghiêm ngặt khi nhập kho.</p>
<h3>Rút xương và tẩm ướp vô trùng</h3>
<p>Chân gà sau khi làm sạch bằng công nghệ sục ozone sẽ được hấp chín và chuyển sang phòng vô trùng cách ly. Tại đây, công nhân đeo găng tay kháng khuẩn thực hiện rút xương thủ công khéo léo để không làm nát thớ thịt dai giòn, sau đó ủ nước sốt cay tê trong 6 tiếng để thấm đượm gia vị.</p>`,
      coverImageUrl: "/uploads/1780482157869-chan-ga-rut-xuong-moi-png.png",
      status: "PUBLISHED",
      authorId: author.id,
      categoryId: catHauTruong.id,
      seoTitle: "Hậu trường chế biến chân gà rút xương Ăn Cùng Bà Tuyết",
      seoDescription: "Cận cảnh quy trình rút xương chân gà thủ công sạch sẽ trong phòng vô trùng khép kín tại nhà máy NMT Food.",
      seoKeywords: "sản xuất chân gà, chân gà rút xương bà tuyết, xưởng sản xuất bà tuyết",
      publishedAt: new Date(),
      viewCount: 3200,
    }
  });

  // Post 4: Công thức
  const post4 = await prisma.post.create({
    data: {
      title: "5 cách biến tấu snack Bánh Tráng Bà Tuyết cực ngon tại nhà",
      slug: "cong-thuc-an-vat-sang-tao",
      excerpt: "Bánh tráng sa tế bò không chỉ ăn liền — bạn có thể biến tấu cùng xoài xanh, tôm khô, trứng cút để có món ăn vặt sang xịn mịn.",
      content: `<h2>1. Bánh tráng lắc xoài xanh trứng cút</h2>
<p>Cắt nhỏ miếng Snack Bánh Tráng vị sa tế bò, trộn đều cùng xoài xanh băm sợi, rau răm cắt khúc và trứng cút luộc bổ đôi. Thêm một chút muối tôm, bạn sẽ có ngay đĩa bánh tráng trộn giòn rụm chua ngọt hấp dẫn.</p>
<h2>2. Trứng chiên cuộn tăm cay</h2>
<p>Đập 2 quả trứng gà, thêm hành lá và muối, rán mỏng trên chảo. Đặt các sợi tăm cay Bà Tuyết vào giữa và cuộn tròn lại. Vị béo của trứng quyện cùng vị cay nồng giòn dai của tăm cay tạo nên món ăn vô cùng độc đáo.</p>`,
      coverImageUrl: "/uploads/1780482043582-snack-banh-trang-vi-sa-te-bo.png",
      status: "PUBLISHED",
      authorId: author.id,
      categoryId: catCongThuc.id,
      seoTitle: "Công thức biến tấu ăn vặt Ăn Cùng Bà Tuyết",
      seoDescription: "Hướng dẫn chi tiết 5 công thức món ngon sáng tạo từ tăm cay và snack bánh tráng Bà Tuyết tại nhà.",
      seoKeywords: "công thức nấu ăn, món ngon bà tuyết, tăm cay trộn mì",
      publishedAt: new Date(),
      viewCount: 1450,
    }
  });

  // Post 5: Top 1 TikTok Shop
  const post5 = await prisma.post.create({
    data: {
      title: "Ăn Cùng Bà Tuyết dẫn đầu TikTok Shop ngành hàng đồ ăn vặt",
      slug: "top-1-tiktok-shop-an-vat",
      excerpt: "Thương hiệu tiếp tục khẳng định vị thế dẫn đầu với hàng triệu đơn hàng bán ra nhờ sản phẩm chất lượng và truyền thông sáng tạo.",
      content: `<h2>Dẫn đầu xu hướng thương mại điện tử giải trí</h2>
<p>Bằng việc xây dựng nội dung gần gũi, các video nấu ăn vui nhộn của Bà Tuyết và đội ngũ sáng tạo đã thu hút hàng chục triệu lượt xem. Gian hàng Ăn Cùng Bà Tuyết liên tục nằm trong danh sách bán chạy số 1 của TikTok Shop Việt Nam ngành ẩm thực.</p>
<h3>Niềm tự hào đồ ăn vặt Việt</h3>
<p>Sản phẩm ngon, quy trình đóng gói chỉn chu và khâu chăm sóc khách hàng chu đáo chính là chiếc chìa khóa giúp ACBT duy trì được sự tin yêu lâu dài từ người tiêu dùng trẻ tuổi.</p>`,
      coverImageUrl: "/uploads/1780481867397-bimbim-tam-cay-10k.png",
      status: "PUBLISHED",
      authorId: author.id,
      categoryId: catBaoChi.id,
      seoTitle: "Ăn Cùng Bà Tuyết dẫn đầu TikTok Shop đồ ăn vặt",
      seoDescription: "Ăn Cùng Bà Tuyết tiếp tục giữ vững vị trí số 1 ngành hàng đồ ăn vặt trên nền tảng TikTok Shop Việt Nam.",
      seoKeywords: "top 1 tiktok shop, ăn cùng bà tuyết tiktok, doanh số bà tuyết",
      publishedAt: new Date(),
      viewCount: 4210,
    }
  });

  console.log("Connecting tags...");
  await prisma.postTag.createMany({
    data: [
      { postId: post1.id, tagId: tagNhaMay.id },
      { postId: post1.id, tagId: tagSuKien.id },
      { postId: post2.id, tagId: tagAnVat.id },
      { postId: post3.id, tagId: tagChanGa.id },
      { postId: post3.id, tagId: tagAnVat.id },
      { postId: post4.id, tagId: tagAnVat.id },
      { postId: post5.id, tagId: tagAnVat.id },
      { postId: post5.id, tagId: tagSuKien.id },
    ]
  });

  console.log("Database posts seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("Post reseed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
