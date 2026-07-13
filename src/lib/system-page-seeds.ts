import type { DefaultInfoPage } from "@/lib/default-info-pages";
import type { PageBlock } from "@/lib/pages";

export function isVisibleSystemPage(page: DefaultInfoPage) {
  return !page.routePath.startsWith("/chat-luong/");
}

export function getSystemPageSeedContent(fallback: DefaultInfoPage): PageBlock[] {
  if (fallback.routePath !== "/chat-luong") return fallback.blocks as PageBlock[];

  return [
    {
      id: "chat-luong-hero",
      type: "hero",
      data: {
        label: "Chất lượng kiểm chứng",
        title: "Năng lực sản xuất rõ ràng trước khi nói về bán hàng",
        subtitle:
          "Nguyên liệu, nhà máy, chứng nhận và bảo hiểm — mọi thứ cần có hồ sơ đi kèm. Chỗ nào chưa có file công khai sẽ ghi rõ [cần bổ sung], không tự tuyên bố thay bằng chứng.",
        backgroundImage: "/bento/bento-factory.png",
        ctaText: "Xem hồ sơ pháp lý",
        ctaLink: "#ho-so-phap-ly",
      },
    },
    {
      id: "chat-luong-nguyen-lieu",
      type: "split",
      data: {
        title: "Nguyên liệu nhập khẩu từ châu Âu — có truy xuất",
        description:
          "Nguyên liệu chính như chân gà được định hướng công khai theo hồ sơ nhập khẩu từ Ba Lan, Hungary và các nước châu Âu khác. Khi công bố claim này, cần đi kèm C/O, phiếu kiểm dịch và hồ sơ lô hàng tương ứng.",
        imageUrl: "/bento/bento-ingredients.png",
        imagePosition: "right",
        ctaText: "Mở ghi chú nguồn nguyên liệu",
        ctaLink: "#nguon-nguyen-lieu",
      },
    },
    {
      id: "chat-luong-facts",
      type: "features",
      data: {
        title: "Các điểm cần có bằng chứng đi kèm",
        subtitle: "Bên thứ ba nói thay, thương hiệu không tự tuyên bố.",
        items: [
          { icon: "Wheat", title: "Nhập khẩu từ Ba Lan, Hungary", description: "Nguồn nhập khẩu châu Âu. [cần bổ sung hồ sơ lô hàng public]" },
          { icon: "FileCheck2", title: "Có C/O và phiếu kiểm dịch", description: "Claim nguồn gốc cần đi kèm C/O, kiểm dịch. [cần bổ sung ảnh scan]" },
          { icon: "Snowflake", title: "Lưu kho lạnh theo quy chuẩn", description: "Lưu kho lạnh theo quy chuẩn vận hành. [cần bổ sung ảnh/video kho]" },
        ],
      },
    },
    {
      id: "chat-luong-factory",
      type: "split",
      data: {
        title: "Nhà máy sản xuất NMV Food — Thái Nguyên",
        description:
          "Ghi đúng chủ thể: NMV Food đạt chứng nhận ISO 22000:2018. Không ghi thành ACBT nếu hồ sơ không thể hiện như vậy. Không dùng “an toàn tuyệt đối”, “vô trùng”; dùng “quy trình 6 bước có kiểm soát”.",
        imageUrl: "/bento/bento-factory.png",
        imagePosition: "left",
        ctaText: "Xem quy trình 6 bước",
        ctaLink: "#nha-may",
      },
    },
    {
      id: "chat-luong-documents",
      type: "features",
      data: {
        title: "Hồ sơ pháp lý & chứng nhận",
        subtitle: "Mỗi card nên có ảnh scan hoặc PDF để khách hàng, đối tác và báo chí kiểm chứng.",
        items: [
          { icon: "BadgeCheck", title: "ISO 22000:2018", description: "Ghi rõ: cấp cho NMV Food. [cần bổ sung scan chứng nhận]" },
          { icon: "ClipboardCheck", title: "HACCP", description: "Chương trình đào tạo, NMV Food. [cần bổ sung hồ sơ]" },
          { icon: "FileCheck2", title: "Giấy phép ATTP", description: "Giấy đủ điều kiện an toàn thực phẩm. [cần bổ sung ảnh/PDF]" },
          { icon: "FileSearch", title: "Phiếu kiểm nghiệm", description: "VNTEST — kiểm nghiệm định kỳ hàng tháng (NMV Food). [cần bổ sung phiếu mới nhất]" },
        ],
      },
    },
    {
      id: "chat-luong-pvi",
      type: "text",
      data: {
        backgroundColor: "slate-900",
        content:
          "<h2>Bảo hiểm trách nhiệm sản phẩm — PVI</h2><p>ACBT mua bảo hiểm trách nhiệm sản phẩm từ PVI. Đây là cam kết trách nhiệm nếu sản phẩm gây thiệt hại cho người tiêu dùng theo phạm vi hợp đồng, không phải chứng nhận chất lượng và không được trình bày như PVI xác nhận chất lượng sản phẩm.</p><p><strong>[cần xác nhận]</strong> Pháp nhân trên hợp đồng PVI và phạm vi bảo hiểm cụ thể.</p>",
      },
    },
    {
      id: "chat-luong-policy",
      type: "features",
      data: {
        title: "Chính sách bảo vệ quyền lợi khách hàng",
        subtitle: "Tóm tắt các điểm chính, bản đầy đủ nên dẫn sang trang hoặc PDF riêng.",
        items: [
          { icon: "Info", title: "Quyền được thông tin", description: "Sản phẩm ghi rõ thành phần, NSX, HSD." },
          { icon: "RefreshCw", title: "Quyền đổi trả", description: "Quy trình đổi trả khi sản phẩm lỗi. [cần bổ sung chi tiết]" },
          { icon: "MessageCircle", title: "Quyền khiếu nại", description: "Kênh tiếp nhận và thời gian xử lý. [cần bổ sung SLA]" },
          { icon: "Headphones", title: "Kênh hỗ trợ", description: "Hotline, email, thời gian làm việc. [cần bổ sung thông tin chính thức]" },
        ],
      },
    },
  ];
}
