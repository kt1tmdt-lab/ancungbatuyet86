const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log("Starting seeding...");

  // Reset database before seeding (optional but safe since we just reset db schema)
  await prisma.postReviewLog.deleteMany({});
  await prisma.postTag.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Hash passwords
  const passwordHash = await hashPassword("123456");

  // 2. Create Users
  const admin = await prisma.user.create({
    data: {
      email: "admin@acbt.local",
      password: passwordHash,
      name: "Admin Bà Tuyết",
      role: "ADMIN",
    },
  });

  const editor = await prisma.user.create({
    data: {
      email: "editor@acbt.local",
      password: passwordHash,
      name: "Editor Tuyết",
      role: "EDITOR",
    },
  });

  const author = await prisma.user.create({
    data: {
      email: "author@acbt.local",
      password: passwordHash,
      name: "Author Tuyết",
      role: "AUTHOR",
    },
  });

  const user = await prisma.user.create({
    data: {
      email: "user@acbt.local",
      password: passwordHash,
      name: "Khách Tuyết",
      role: "USER",
    },
  });

  console.log("Users seeded successfully.");

  // 3. Create Categories
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

  console.log("Categories seeded successfully.");

  // 4. Create Tags
  const tagNhaMay = await prisma.tag.create({ data: { name: "Nhà máy", slug: "nha-may" } });
  const tagAnVat = await prisma.tag.create({ data: { name: "Ăn vặt", slug: "an-vat" } });
  const tagChanGa = await prisma.tag.create({ data: { name: "Chân gà", slug: "chan-ga" } });
  const tagSuKien = await prisma.tag.create({ data: { name: "Sự kiện", slug: "su-kien" } });

  console.log("Tags seeded successfully.");

  // 5. Create Posts
  // 5.1 Published Post 1
  const post1 = await prisma.post.create({
    data: {
      title: "Ăn Cùng Bà Tuyết khánh thành nhà máy 3.300m² tại Thái Nguyên",
      slug: "khanh-thanh-nha-may-3300m2",
      excerpt: "Nhà máy mới với diện tích 3.300m² đánh dấu bước ngoặt quan trọng trong hành trình nâng cao chất lượng sản phẩm và mở rộng công suất sản xuất của thương hiệu Ăn Cùng Bà Tuyết.",
      content: `<h2>Sự kiện khánh thành nhà máy Thái Nguyên</h2>
<p>Nhằm đáp ứng nhu cầu ngày càng cao của thị trường đồ ăn vặt Việt Nam, Ăn Cùng Bà Tuyết chính thức khánh thành nhà máy sản xuất mới với quy mô 3.300m² tại Thái Nguyên. Nhà máy được trang bị dây chuyền sản xuất khép kín, đạt tiêu chuẩn an toàn vệ sinh thực phẩm quốc tế HACCP.</p>
<h3>Trang thiết bị hiện đại bậc nhất</h3>
<p>Chúng tôi đã đầu tư hàng chục tỷ đồng để nhập khẩu máy móc tự động hóa từ nước ngoài, hạn chế tối đa sự can thiệp thủ công nhằm đảm bảo độ đồng đều và vệ sinh cho từng sản phẩm như chân gà rút xương, tăm cay và snack các loại.</p>
<p>Phát biểu tại buổi lễ, đại diện thương hiệu chia sẻ: <em>"Nhà máy Thái Nguyên không chỉ giúp tăng sản lượng lên gấp 3 lần mà còn là lời cam kết của Ăn Cùng Bà Tuyết về một thương hiệu đồ ăn vặt sạch, chất lượng cao, phục vụ hàng triệu người tiêu dùng Việt Nam."</em></p>`,
      coverImageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60",
      status: "PUBLISHED",
      authorId: author.id,
      reviewerId: admin.id,
      categoryId: catThongBao.id,
      seoTitle: "Ăn Cùng Bà Tuyết khánh thành nhà máy 3.300m2 tại Thái Nguyên",
      seoDescription: "Ăn Cùng Bà Tuyết khánh thành nhà máy 3.300m2 tại Thái Nguyên đạt chuẩn HACCP, tăng công suất gấp 3 lần.",
      seoKeywords: "nhà máy bà tuyết, ăn cùng bà tuyết thái nguyên, đồ ăn vặt sạch",
      publishedAt: new Date(),
      viewCount: 1520,
    },
  });

  // 5.2 Published Post 2
  const post2 = await prisma.post.create({
    data: {
      title: "ACBT hợp tác PVI — Mua bảo hiểm cho người tiêu dùng",
      slug: "bao-hiem-pvi-cho-nguoi-tieu-dung",
      excerpt: "Ăn Cùng Bà Tuyết trở thành thương hiệu đồ ăn vặt đầu tiên mua bảo hiểm trách nhiệm sản phẩm cho khách hàng, khẳng định cam kết chất lượng.",
      content: `<h2>Lễ ký kết bảo hiểm trách nhiệm sản phẩm</h2>
<p>Ăn Cùng Bà Tuyết vừa thực hiện lễ ký kết hợp đồng bảo hiểm trách nhiệm sản phẩm với Tổng công ty Bảo hiểm PVI. Theo đó, tất cả khách hàng mua sản phẩm chính hãng của chúng tôi đều được bảo vệ quyền lợi tối đa khi gặp các vấn đề liên quan đến chất lượng sản phẩm.</p>
<p>Đây là một bước đi đột phá chưa từng có trong ngành đồ ăn vặt tại Việt Nam, chứng minh sự tự tin tuyệt đối của thương hiệu đối với quy trình sản xuất và nguồn gốc nguyên liệu đầu vào sạch.</p>`,
      coverImageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
      status: "PUBLISHED",
      authorId: author.id,
      reviewerId: editor.id,
      categoryId: catThongBao.id,
      seoTitle: "Ăn Cùng Bà Tuyết hợp tác Bảo hiểm PVI bảo vệ người tiêu dùng",
      seoDescription: "Thương hiệu đồ ăn vặt Ăn Cùng Bà Tuyết ký kết hợp tác mua bảo hiểm trách nhiệm sản phẩm PVI cho người tiêu dùng.",
      seoKeywords: "bảo hiểm pvi, ăn cùng bà tuyết bảo hiểm, đồ ăn vặt chất lượng",
      publishedAt: new Date(),
      viewCount: 780,
    },
  });

  // 5.3 Pending Review Post
  const post3 = await prisma.post.create({
    data: {
      title: "Hậu trường: Một ngày tại xưởng sản xuất chân gà rút xương",
      slug: "hau-truong-san-xuat-chan-ga",
      excerpt: "Từ 4 giờ sáng, đội ngũ sản xuất của Ăn Cùng Bà Tuyết đã bắt đầu ngày mới. Theo chân chúng tôi khám phá quy trình tạo ra sản phẩm best-seller của thương hiệu.",
      content: `<h2>Bắt đầu từ khâu kiểm định nguyên liệu lúc sáng sớm</h2>
<p>Mỗi ngày, hàng tấn chân gà tươi sạch được vận chuyển trực tiếp từ các trang trại chăn nuôi đạt chuẩn VietGAP đến nhà máy. Tại đây, bộ phận KCS sẽ kiểm tra kỹ lưỡng nhiệt độ và độ tươi của từng lô hàng trước khi đưa vào dây chuyền rút xương.</p>
<p>Từng chiếc chân gà được làm sạch bằng công nghệ sục ozone, sau đó được luộc chín trong phòng vô trùng và tiến hành rút xương thủ công bởi những công nhân lành nghề đeo găng tay kháng khuẩn.</p>`,
      coverImageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=60",
      status: "PENDING_REVIEW",
      authorId: author.id,
      categoryId: catHauTruong.id,
      seoTitle: "Hậu trường sản xuất chân gà rút xương Ăn Cùng Bà Tuyết",
      seoDescription: "Khám phá quy trình sản xuất khép kín chân gà rút xương Bà Tuyết từ khâu kiểm định nguyên liệu đến thành phẩm đóng gói.",
      seoKeywords: "sản xuất chân gà, chân gà rút xương bà tuyết, xưởng sản xuất bà tuyết",
      viewCount: 0,
    },
  });

  // 5.4 Draft Post
  const post4 = await prisma.post.create({
    data: {
      title: "5 cách biến tấu snack Bà Tuyết thành món ăn mới lạ",
      slug: "cong-thuc-an-vat-sang-tao",
      excerpt: "Không chỉ ăn trực tiếp — tăm cay có thể trộn mì, chân gà rút xương kết hợp cơm cháy... Khám phá những công thức sáng tạo từ cộng đồng.",
      content: `<h2>1. Mì trộn tăm cay Bà Tuyết</h2>
<p>Một gói mì gói ăn liền luộc chín, trộn với nước sốt chua ngọt và một ít tăm cay Bà Tuyết cắt khúc nhỏ. Thêm xúc xích và hành lá, bạn sẽ có ngay một đĩa mì trộn giòn cay, thơm ngon lạ miệng.</p>
<h2>2. Chân gà rút xương trộn cơm cháy</h2>
<p>Bẻ nhỏ cơm cháy, trộn đều với chân gà rút xương vị ớt hiểm cùng với xoài xanh băm sợi và rau răm. Món gỏi trộn này cực kỳ thích hợp cho các buổi tụ họp bạn bè dịp cuối tuần.</p>`,
      coverImageUrl: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&auto=format&fit=crop&q=60",
      status: "DRAFT",
      authorId: author.id,
      categoryId: catCongThuc.id,
      seoTitle: "Công thức món ngon từ đồ ăn vặt Ăn Cùng Bà Tuyết",
      seoDescription: "Hướng dẫn 5 cách chế biến độc đáo, biến tấu tăm cay, chân gà rút xương Bà Tuyết thành những món ăn hấp dẫn.",
      seoKeywords: "công thức nấu ăn, món ngon bà tuyết, tăm cay trộn mì",
      viewCount: 0,
    },
  });

  // 5.5 Rejected Post
  const post5 = await prisma.post.create({
    data: {
      title: "Ra mắt MV 'Ăn Cùng Bà Tuyết' kết hợp cùng Tuấn Cry",
      slug: "mv-an-cung-ba-tuyet-x-tuan-cry",
      excerpt: "MV âm nhạc đầu tiên của thương hiệu đồ ăn vặt Việt Nam, kể câu chuyện từ người nông dân đến thương hiệu quốc dân.",
      content: `<p>Mới đây, Ăn Cùng Bà Tuyết chính thức phát hành MV ca nhạc cùng tên hợp tác cùng nam nghệ sĩ trẻ Tuấn Cry. MV mang màu sắc tươi sáng, âm nhạc sôi động kể lại hành trình gian nan từ những ngày đầu khởi nghiệp vất vả của thương hiệu cho đến khi trở thành món ăn vặt được yêu thích trên khắp cả nước.</p>`,
      coverImageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60",
      status: "REJECTED",
      authorId: author.id,
      reviewerId: editor.id,
      categoryId: catBaoChi.id,
      rejectedReason: "Nội dung bài viết quá ngắn, thiếu thông tin chi tiết về MV và link video nhúng. Cần chỉnh sửa lại.",
      viewCount: 0,
    },
  });

  // 5.6 Published Post 3
  const post6 = await prisma.post.create({
    data: {
      title: "Ăn Cùng Bà Tuyết giữ vững Top 1 TikTok Shop ngành ăn vặt",
      slug: "top-1-tiktok-shop-an-vat",
      excerpt: "Với hơn 6.2 triệu đơn hàng, thương hiệu tiếp tục dẫn đầu danh mục đồ ăn vặt trên nền tảng thương mại điện tử lớn nhất.",
      content: `<h2>Bứt phá doanh số trên nền tảng số</h2>
<p>Nhờ chiến lược truyền thông gần gũi, hài hước thông qua các video của Bà Tuyết và đội ngũ sáng tạo nội dung, Ăn Cùng Bà Tuyết tiếp tục duy trì vị thế độc tôn với vị trí Top 1 ngành hàng ăn vặt trên TikTok Shop Việt Nam suốt 4 quý liên tiếp.</p>
<p>Sản phẩm chân gà rút xương vị ớt hiểm và tăm cay truyền thống liên tục rơi vào tình trạng cháy hàng mỗi khi livestream. Đây là minh chứng rõ nét cho sự chuyển đổi số thành công của một thương hiệu ẩm thực Việt.</p>`,
      coverImageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=60",
      status: "PUBLISHED",
      authorId: admin.id,
      reviewerId: admin.id,
      categoryId: catBaoChi.id,
      seoTitle: "Ăn Cùng Bà Tuyết Top 1 TikTok Shop đồ ăn vặt",
      seoDescription: "Ăn Cùng Bà Tuyết dẫn đầu TikTok Shop Việt Nam với hàng triệu đơn hàng bán ra nhờ quy trình sạch và chất lượng tuyệt hảo.",
      seoKeywords: "top 1 tiktok shop, ăn cùng bà tuyết tiktok, doanh số bà tuyết",
      publishedAt: new Date(),
      viewCount: 2450,
    },
  });

  // 6. Connect Tags to Posts (PostTag)
  await prisma.postTag.createMany({
    data: [
      { postId: post1.id, tagId: tagNhaMay.id },
      { postId: post1.id, tagId: tagSuKien.id },
      { postId: post2.id, tagId: tagAnVat.id },
      { postId: post3.id, tagId: tagChanGa.id },
      { postId: post3.id, tagId: tagAnVat.id },
      { postId: post4.id, tagId: tagAnVat.id },
      { postId: post6.id, tagId: tagAnVat.id },
      { postId: post6.id, tagId: tagSuKien.id },
    ],
  });

  // 7. Seed Review logs
  await prisma.postReviewLog.create({
    data: {
      postId: post3.id,
      reviewerId: author.id, // logged as author submitting
      action: "SUBMIT",
      note: "Gửi bài viết nhờ ban biên tập duyệt giúp.",
    },
  });

  await prisma.postReviewLog.create({
    data: {
      postId: post5.id,
      reviewerId: author.id,
      action: "SUBMIT",
      note: "Gửi duyệt bài viết về MV kết hợp cùng Tuấn Cry.",
    },
  });

  await prisma.postReviewLog.create({
    data: {
      postId: post5.id,
      reviewerId: editor.id,
      action: "REJECT",
      note: "Nội dung bài viết quá ngắn, thiếu thông tin chi tiết về MV và link video nhúng. Cần chỉnh sửa lại.",
    },
  });

  console.log("Database seeding completed successfully!");
  console.log("\nAccounts seeded:");
  console.log("- ADMIN: admin@acbt.local / 123456");
  console.log("- EDITOR: editor@acbt.local / 123456");
  console.log("- AUTHOR: author@acbt.local / 123456");
  console.log("- USER: user@acbt.local / 123456");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
