const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const contentHtml = `
<p>Trong kỷ nguyên của truyền thông số và sự trỗi dậy mạnh mẽ của thương mại điện tử giải trí (Shoppertainment), câu chuyện về thương hiệu <strong>Ăn Cùng Bà Tuyết</strong> nổi lên như một hiện tượng đặc biệt. Không chỉ dừng lại ở một kênh sáng tạo nội dung triệu lượt xem, Ăn Cùng Bà Tuyết đã bứt phá ngoạn mục để trở thành một doanh nghiệp sản xuất thực phẩm quy mô lớn, sở hữu nhà máy hiện đại 3.300m² và phân phối hàng triệu đơn hàng ăn vặt sạch mỗi tháng tới tay người tiêu dùng trẻ tuổi trên khắp Việt Nam.</p>

<p>Nhưng ít ai biết rằng, đằng sau sự thành công rực rỡ và những con số triệu đơn ấy là một hành trình gian nan, đầy mồ hôi, nước mắt và khát vọng cháy bỏng của những người sáng lập nhằm định nghĩa lại khái niệm "đồ ăn vặt vỉa hè" thành "sản phẩm ăn vặt sạch, an toàn và bảo chứng".</p>

<h2>Phần I: Khởi nguồn từ căn bếp nhỏ Thái Nguyên</h2>
<p>Hành trình của thương hiệu bắt đầu vào những ngày cuối năm đầy gió lạnh tại tỉnh Thái Nguyên. Khi đó, gia đình của Bà Tuyết cùng đội ngũ sáng lập ban đầu chỉ mong muốn tạo ra những món ăn vặt quen thuộc của tuổi học trò nhưng với tiêu chí sạch sẽ và ngon miệng hơn. Với công thức gia vị truyền thống được chắt lọc từ khẩu vị bản địa, những mẻ chân gà rút xương đầu tiên và các thanh tăm cay giòn dai đã ra đời ngay trong căn bếp nhỏ của gia đình.</p>

<blockquote>
  "Hồi đó làm thủ công hết, tự đi chợ chọn từng chiếc chân gà tươi ngon nhất, tự tay rửa sạch bằng muối và dấm, rồi cẩn thận rút từng sợi xương nhỏ để chân gà giữ nguyên độ giòn dai. Ủ nước sốt cay cay tê tê theo công thức riêng rồi chia sẻ lên mạng xã hội, không ngờ lại được các bạn trẻ đón nhận nồng nhiệt đến thế!" - Bà Tuyết nhớ lại những ngày đầu khởi nghiệp.
</blockquote>

<p>Thời điểm đó, thách thức lớn nhất là làm thế nào để khách hàng ở xa tin tưởng vào chất lượng vệ sinh của một sản phẩm làm thủ công. Đội ngũ quyết định quay lại toàn bộ quy trình làm việc: từ khâu đeo găng tay kháng khuẩn, tiệt trùng dụng cụ cho đến đóng gói hút chân không thủ công. Sự chân thành, minh bạch cùng hình ảnh gần gũi, ấm áp của Bà Tuyết đã nhanh chóng chạm tới trái tim của hàng triệu người theo dõi trên TikTok và Facebook.</p>

<h2>Phần II: Cơn sốt "Triệu đơn" và Bài toán công suất</h2>
<p>Chỉ trong vòng chưa đầy một năm, các video ẩm thực gần gũi kết hợp cùng các buổi Livestream bán hàng của Ăn Cùng Bà Tuyết đã tạo nên những cơn sốt chưa từng có trên nền tảng TikTok Shop. Mỗi phiên Livestream thu hút hàng chục nghìn người xem đồng thời, các sản phẩm chủ lực như <strong>Chân Gà Rút Xương Vị Cay Tê</strong> và <strong>Tăm Cay Bà Tuyết</strong> liên tục rơi vào tình trạng cháy hàng chỉ sau vài phút mở bán.</p>

<p>Doanh số tăng trưởng thần tốc mang đến niềm vui lớn nhưng cũng đặt ra một bài toán vận hành vô cùng hóc búa. Công suất của căn bếp gia đình hay các xưởng sản xuất bán thủ công nhỏ lẻ không còn đủ sức gánh vác lượng đơn hàng khổng lồ. Nhiều lúc, hệ thống phải tạm khóa nút đặt hàng vì không kịp đóng gói và vận chuyển. Đây cũng là thời điểm ban lãnh đạo thương hiệu nhận ra: Muốn đi xa và phát triển bền vững, Ăn Cùng Bà Tuyết bắt buộc phải chuẩn hóa quy trình sản xuất theo hướng công nghiệp quy mô lớn.</p>

<h2>Phần III: Bước nhảy vọt với nhà máy 3.300m² đạt chuẩn HACCP</h2>
<p>Năm 2025 đánh dấu bước ngoặt lịch sử của thương hiệu khi tổ hợp nhà máy sản xuất khép kín quy mô lớn trị giá hàng chục tỷ đồng chính thức được khánh thành tại Thái Nguyên. Với diện tích sàn sử dụng lên tới 3.300m², nhà máy được trang bị hệ thống máy móc tự động hóa tối đa, hạn chế sự can thiệp trực tiếp của con người để triệt tiêu các tác nhân gây ô nhiễm thực phẩm.</p>

<h3>Quy trình kiểm soát chất lượng 5 bước nghiêm ngặt:</h3>
<ul>
  <li><strong>Bước 1: Tuyển chọn nguyên liệu đầu vào:</strong> Chỉ sử dụng chân gà tươi nguyên chất từ các trang trại chăn nuôi lớn đạt tiêu chuẩn VietGAP, có giấy kiểm dịch thú y đầy đủ.</li>
  <li><strong>Bước 2: Sơ chế và khử trùng công nghệ cao:</strong> Nguyên liệu được rửa sạch qua hệ thống sục khí ozone tiệt trùng để loại bỏ vi khuẩn và tạp chất có hại.</li>
  <li><strong>Bước 3: Chế biến trong phòng vô trùng:</strong> Công đoạn rút xương chân gà và tẩm ướp sốt hoa tiêu ớt hiểm được thực hiện bởi đội ngũ nhân công lành nghề trong hệ thống phòng lạnh vô trùng khép kín.</li>
  <li><strong>Bước 4: Nướng sấy tách dầu tự động:</strong> Với các sản phẩm dòng bánh mì và tăm cay, hệ thống lò nướng sấy giúp loại bỏ tối đa dầu thừa béo ngấy, giữ cho sản phẩm khô ráo và giòn ngon tự nhiên.</li>
  <li><strong>Bước 5: Đóng gói và dán màng seal bảo vệ:</strong> Các sản phẩm đóng túi nhôm được hút chân không tuyệt đối; dòng sản phẩm đóng hũ như đùi gà phô mai được dán màng seal bạc kỹ lưỡng trước khi dập nắp.</li>
</ul>

<p>Nhà máy mới đã giúp nâng công suất sản xuất lên gấp 3 lần, giải quyết hoàn toàn bài toán đứt gãy nguồn cung. Đồng thời, nhà máy cũng nhanh chóng đạt được chứng nhận an toàn thực phẩm quốc tế HACCP - một tấm thẻ thông hành khẳng định chất lượng xuất sắc của sản phẩm Ăn Cùng Bà Tuyết trên thị trường.</p>

<h2>Phần IV: Cam kết đột phá cùng Bảo hiểm PVI</h2>
<p>Nhằm khẳng định chất lượng và cam kết bảo vệ sức khỏe người dùng ở mức cao nhất, Ăn Cùng Bà Tuyết đã thực hiện một bước đi đột phá chưa từng có tiền lệ trong ngành đồ ăn vặt đóng gói Việt Nam: <strong>Mua bảo hiểm trách nhiệm sản phẩm của Tổng công ty Bảo hiểm PVI cho mọi khách hàng mua sản phẩm chính hãng.</strong></p>

<p>Hợp đồng bảo hiểm trị giá hàng chục tỷ đồng này là lời cam kết đanh thép của thương hiệu đối với sức khỏe của người tiêu dùng. Bất kỳ khách hàng nào khi mua hàng chính hãng của Ăn Cùng Bà Tuyết, nếu gặp phải vấn đề về an toàn thực phẩm do lỗi từ nhà sản xuất, đều được bảo hiểm PVI bồi thường và hỗ trợ tối đa về mặt y tế. Sự hợp tác này đã nâng thương hiệu Ăn Cùng Bà Tuyết lên một tầm cao mới, tách biệt hoàn toàn khỏi các cơ sở sản xuất ăn vặt trôi nổi không rõ nguồn gốc trên thị trường.</p>

<h2>Phần V: Hệ sinh thái sản phẩm ăn vặt phong phú</h2>
<p>Từ những sản phẩm ban đầu, Ăn Cùng Bà Tuyết giờ đây đã phát triển một hệ sinh thái sản phẩm phong phú, đáp ứng đa dạng nhu cầu của giới trẻ:</p>

<ol>
  <li><strong>Chân Gà Rút Xương Vị Cay Tê:</strong> Sản phẩm chủ lực với chân gà rút xương giòn sần sật quyện sốt ớt cay hoa tiêu tê lưỡi nồng nàn.</li>
  <li><strong>Tăm Cay Tuổi Thơ:</strong> Sợi tăm giòn dai cay nồng gợi nhớ ký ức học trò, làm từ bột mì nguyên cám sạch sẽ.</li>
  <li><strong>Tăm Cay Vị Tiêu Đen:</strong> Hương vị cải tiến nồng ấm mùi tiêu đen Phú Quốc, cay dịu kích thích vị giác.</li>
  <li><strong>Snack Bánh Tráng Vị Sa Tế Bò:</strong> Snack bánh tráng nướng giòn rôm rốp phủ gia vị bò nướng hành phi thơm ngậy.</li>
  <li><strong>Đùi Gà Phô Mai Hũ Pet:</strong> Snack hình đùi gà phồng giòn lắc bột phô mai béo ngậy đóng hũ sang trọng.</li>
  <li><strong>Gân Rồng Hấp Xả Vị Cay:</strong> Món ăn vặt chay dẻo dai làm từ bột đậu nành sấy sả ớt hiểm siêu cuốn.</li>
  <li><strong>Snack Bìa Cát Tông:</strong> Miếng snack dẹt to bản dẻo dai đàn hồi nhai cực lâu cực đã ngấm sốt siêu cay chấu.</li>
</ol>

<h2>Tầm nhìn tương lai: Đưa ẩm thực ăn vặt Việt Nam ra thế giới</h2>
<p>Hành trình từ căn bếp nhỏ Thái Nguyên của Ăn Cùng Bà Tuyết là minh chứng rõ nét cho việc: Một thương hiệu ẩm thực truyền thống nếu biết kết hợp giữa sự chân thành nguyên bản, chất lượng sản phẩm sạch đạt chuẩn công nghiệp và tư duy marketing thời đại số hoàn toàn có thể bứt phá tạo nên những kỳ tích.</p>

<p>Trong tương lai, Ăn Cùng Bà Tuyết không chỉ hướng tới mục tiêu phủ sóng mọi cửa hàng tạp hóa, siêu thị tại Việt Nam mà còn ấp ủ khát vọng xuất khẩu chính ngạch các dòng sản phẩm ăn vặt đậm chất Việt ra thị trường quốc tế, mang hương vị cay nồng giòn ngon đặc trưng giới thiệu tới bạn bè năm châu.</p>
`;

async function main() {
  console.log("Connecting to database...");

  const author = await prisma.user.findFirst({
    where: { role: "ADMIN" }
  }) || await prisma.user.findFirst();

  if (!author) {
    console.error("Please run database seed first to create admin user.");
    process.exit(1);
  }

  let category = await prisma.category.findUnique({
    where: { slug: "hau-truong" }
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: "Hậu trường",
        slug: "hau-truong",
        description: "Khám phá câu chuyện đằng sau hậu trường sản xuất của chúng tôi."
      }
    });
  }

  let tag = await prisma.tag.findUnique({
    where: { slug: "an-vat" }
  });

  if (!tag) {
    tag = await prisma.tag.create({
      data: {
        name: "Ăn vặt",
        slug: "an-vat"
      }
    });
  }

  console.log("Creating super long blog post...");

  const post = await prisma.post.create({
    data: {
      title: "Hành trình kỳ diệu của Ăn Cùng Bà Tuyết: Từ căn bếp nhỏ Thái Nguyên đến thương hiệu ăn vặt sạch triệu đơn",
      slug: "hanh-trinh-ky-dieu-cua-an-cung-ba-tuyet",
      excerpt: "Khám phá câu chuyện truyền cảm hứng phía sau Ăn Cùng Bà Tuyết - thương hiệu đồ ăn vặt sạch hàng đầu Việt Nam sở hữu hàng triệu người hâm mộ trên khắp các nền tảng số.",
      content: contentHtml,
      coverImageUrl: "/uploads/1780482157869-chan-ga-rut-xuong-moi-png.png",
      status: "PUBLISHED",
      authorId: author.id,
      categoryId: category.id,
      seoTitle: "Hành trình kỳ diệu thương hiệu Ăn Cùng Bà Tuyết triệu đơn",
      seoDescription: "Khám phá hành trình khởi nghiệp đầy cảm hứng của Ăn Cùng Bà Tuyết từ căn bếp Thái Nguyên đến nhà máy sản xuất khép kín triệu đơn hàng ăn vặt sạch.",
      seoKeywords: "hành trình bà tuyết, ăn cùng bà tuyết khởi nghiệp, câu chuyện bà tuyết, đồ ăn vặt sạch",
      publishedAt: new Date(),
      viewCount: 15400
    }
  });

  await prisma.postTag.create({
    data: {
      postId: post.id,
      tagId: tag.id
    }
  });

  console.log(`Successfully created super long blog post! Slug: ${post.slug}`);
}

main()
  .catch((e) => {
    console.error("Failed to seed long post:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
