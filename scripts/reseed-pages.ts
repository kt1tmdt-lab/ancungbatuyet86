const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const realPages = [
  {
    slug: "cam-ket-chat-luong",
    title: "Cam kết chất lượng",
    status: "PUBLISHED",
    content: [
      {
        id: "hero-1",
        type: "hero",
        data: {
          title: "Cam kết chất lượng sản phẩm Ăn Cùng Bà Tuyết",
          subtitle: "Chúng tôi nỗ lực tối đa để mang tới những sản phẩm ăn vặt sạch sẽ, an toàn, được bảo chứng chất lượng bởi các cơ quan chức năng và bảo hiểm hàng đầu Việt Nam.",
          label: "AN TOÀN THỰC PHẨM",
          ctaText: "Xem danh mục sản phẩm",
          ctaLink: "/san-pham",
          backgroundImage: "/uploads/1780482157869-chan-ga-rut-xuong-moi-png.png"
        }
      },
      {
        id: "features-1",
        type: "features",
        data: {
          title: "Hệ thống tiêu chuẩn an toàn",
          subtitle: "Ăn Cùng Bà Tuyết luôn đặt sức khỏe người tiêu dùng lên hàng đầu.",
          items: [
            { icon: "ShieldCheck", title: "Bảo hiểm PVI", description: "Bảo hiểm trách nhiệm sản phẩm cho khách hàng trị giá hàng chục tỷ đồng." },
            { icon: "Factory", title: "Nhà máy HACCP", description: "Sản xuất khép kín tại nhà máy đạt tiêu chuẩn an toàn quốc tế." },
            { icon: "Leaf", title: "Nguyên liệu sạch", description: "Chân gà, nông sản tươi sạch thu mua từ các vùng nuôi VietGAP." }
          ]
        }
      },
      {
        id: "text-1",
        type: "text",
        data: {
          backgroundColor: "white",
          content: "<h2>Cam kết bằng hành động thực tế</h2><p>Ăn Cùng Bà Tuyết tự hào là thương hiệu đồ ăn vặt đóng gói tiên phong tại Việt Nam ký kết mua bảo hiểm trách nhiệm sản phẩm với Tổng công ty Bảo hiểm PVI. Mọi sản phẩm khi xuất xưởng đều trải qua quy trình kiểm soát KCS nghiêm ngặt từ khâu nguyên liệu đầu vào cho tới màng seal đóng gói.</p><p>Chúng tôi hiểu rằng, đồ ăn vặt không chỉ cần ngon mà trước hết phải SẠCH và AN TOÀN. Nhà máy sản xuất quy mô 3.300m² tại Thái Nguyên hoạt động hoàn toàn trên dây chuyền tự động hóa khép kín, đảm bảo không có tác nhân gây ô nhiễm từ bên ngoài.</p>"
        }
      }
    ]
  },
  {
    slug: "huong-dan-mua-hang",
    title: "Hướng dẫn mua hàng",
    status: "PUBLISHED",
    content: [
      {
        id: "hero-2",
        type: "hero",
        data: {
          title: "Hướng dẫn đặt mua sản phẩm chính hãng",
          subtitle: "Để tránh mua phải hàng giả, hàng nhái kém chất lượng trôi nổi trên thị trường, quý khách vui lòng xem kỹ các kênh mua hàng chính thức dưới đây.",
          label: "MUA HÀNG CHÍNH HÃNG",
          ctaText: "Xem cửa hàng Shopee",
          ctaLink: "https://shopee.vn/nmtvlog99",
          backgroundImage: "/uploads/1780481867397-bimbim-tam-cay-10k.png"
        }
      },
      {
        id: "text-2",
        type: "text",
        data: {
          backgroundColor: "white",
          content: "<h2>1. Đặt mua online trực tiếp</h2><p>Quý khách có thể mua hàng chính hãng của Ăn Cùng Bà Tuyết tại các gian hàng thương mại điện tử chính thức sau:</p><ul><li><strong>TikTok Shop:</strong> Kênh livestream chính thức nơi có nhiều ưu đãi giá sốc mỗi ngày.</li><li><strong>Shopee:</strong> Shop Mall chính hãng giao hàng toàn quốc cực nhanh.</li><li><strong>Lazada:</strong> Gian hàng chính hãng của hệ thống ACBT.</li></ul><h2>2. Mua trực tiếp tại hệ thống điểm bán lẻ</h2><p>Hiện nay các sản phẩm của Ăn Cùng Bà Tuyết đã phủ sóng tại hơn 8 tỉnh thành trên toàn quốc qua các đại lý phân phối và siêu thị tiện lợi. Quý khách vui lòng tra cứu danh sách điểm bán gần nhất tại trang <a href='/he-thong-ban'>Hệ thống điểm bán</a> để mua hàng nhanh nhất.</p>"
        }
      }
    ]
  }
];

async function main() {
  console.log("Clearing existing pages...");
  await prisma.page.deleteMany({});
  console.log("Inserting real pages...");

  for (const p of realPages) {
    await prisma.page.create({
      data: p
    });
    console.log(`Created CMS Page: ${p.title}`);
  }

  console.log("Database page seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("Page reseed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
