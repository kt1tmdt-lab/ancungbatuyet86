export type InfoPageBlock =
  | {
      id: string;
      type: "hero";
      data: {
        label?: string;
        title: string;
        subtitle?: string;
        backgroundImage?: string;
        ctaText?: string;
        ctaLink?: string;
      };
    }
  | {
      id: string;
      type: "text";
      data: {
        content: string;
        backgroundColor?: string;
      };
    }
  | {
      id: string;
      type: "features";
      data: {
        title: string;
        subtitle?: string;
        items: Array<{ icon: string; title: string; description: string }>;
      };
    }
  | {
      id: string;
      type: "split";
      data: {
        title: string;
        description: string;
        imageUrl?: string;
        imagePosition?: "left" | "right";
        ctaText?: string;
        ctaLink?: string;
      };
    }
  | {
      id: string;
      type: "products";
      data: {
        title: string;
        subtitle?: string;
        productIds: string[];
      };
    }
  | {
      id: string;
      type: "testimonials";
      data: {
        title: string;
        subtitle?: string;
        items: Array<{ name: string; role: string; review: string; rating: number; avatarUrl?: string }>;
      };
    }
  | {
      id: string;
      type: "gallery";
      data: {
        title: string;
        subtitle?: string;
        images: string[];
      };
    }
  | {
      id: string;
      type: "combos";
      data: {
        title: string;
        subtitle?: string;
        items: Array<{ name: string; price: string; originalPrice?: string; benefits: string[]; tag?: string; ctaLink?: string }>;
      };
    }
  | {
      id: string;
      type: "faq";
      data: {
        title: string;
        items: Array<{ question: string; answer: string }>;
      };
    };

export type DefaultInfoPage = {
  title: string;
  cmsSlug: string;
  routePath: string;
  blocks: InfoPageBlock[];
};

const defaultImage = "/bento/bento-factory.png";
const productImage = "/hero/chan-ga-plate.png";
const proofImage = "/bento/bento-insurance.png";

function page(
  routePath: string,
  title: string,
  label: string,
  subtitle: string,
  blocks: InfoPageBlock[],
): DefaultInfoPage {
  const cmsSlug = routePath.replace(/^\//, "").replace(/\//g, "-");

  return {
    title,
    cmsSlug,
    routePath,
    blocks: [
      {
        id: `${cmsSlug}-hero`,
        type: "hero",
        data: {
          label,
          title,
          subtitle,
          backgroundImage: blocks.find((block) => block.type === "split")?.data.imageUrl || defaultImage,
        },
      },
      ...blocks,
    ],
  };
}

export const DEFAULT_INFO_PAGES: Record<string, DefaultInfoPage> = {
  "/gioi-thieu/cau-chuyen-thuong-hieu": page(
    "/gioi-thieu/cau-chuyen-thuong-hieu",
    "Câu chuyện thương hiệu",
    "Giới thiệu",
    "Từ món ăn quen thuộc đến cách làm minh bạch, Ăn Cùng Bà Tuyết xây dựng niềm tin bằng sản phẩm thật và quy trình thật.",
    [
      {
        id: "brand-story-split",
        type: "split",
        data: {
          title: "Ăn vặt thì phải rõ nguồn gốc",
          description:
            "Câu chuyện thương hiệu không chỉ nằm ở bao bì hay truyền thông, mà nằm ở cách sản phẩm được chọn nguyên liệu, sản xuất, đóng gói và đưa tới khách hàng.",
          imageUrl: "/hero/ba-tuyet-character.png",
          imagePosition: "right",
        },
      },
    ],
  ),
  "/gioi-thieu/thong-tin-doanh-nghiep": page(
    "/gioi-thieu/thong-tin-doanh-nghiep",
    "Thông tin doanh nghiệp",
    "Giới thiệu",
    "Thông tin nền tảng về định hướng, năng lực và cam kết của thương hiệu.",
    [
      {
        id: "company-features",
        type: "features",
        data: {
          title: "Nền tảng vận hành",
          items: [
            { icon: "Factory", title: "Sản xuất rõ ràng", description: "Tập trung vào quy trình và khả năng kiểm soát chất lượng." },
            { icon: "ShieldCheck", title: "Bảo chứng niềm tin", description: "Thông tin pháp lý, chứng nhận và bảo hiểm được trình bày minh bạch." },
            { icon: "Users", title: "Phục vụ khách hàng", description: "Lắng nghe phản hồi và bảo vệ quyền lợi người tiêu dùng." },
          ],
        },
      },
    ],
  ),
  "/gioi-thieu/hanh-trinh-phat-trien": page(
    "/gioi-thieu/hanh-trinh-phat-trien",
    "Hành trình phát triển",
    "Giới thiệu",
    "Những dấu mốc giúp thương hiệu đi từ món ăn quen thuộc tới hệ thống sản phẩm có quy trình.",
    [
      {
        id: "journey-text",
        type: "text",
        data: {
          content:
            "<h2>Hành trình được xây bằng niềm tin</h2><p>Mỗi giai đoạn phát triển đều gắn với một yêu cầu cụ thể: sản phẩm rõ hơn, quy trình chắc hơn và thông tin minh bạch hơn với khách hàng.</p>",
        },
      },
    ],
  ),
  "/chat-luong": page(
    "/chat-luong",
    "Chất lượng",
    "Minh bạch",
    "Tập hợp các bằng chứng về nguyên liệu, nhà máy, quy trình, chứng nhận và chính sách bảo vệ khách hàng.",
    [
      {
        id: "quality-features",
        type: "features",
        data: {
          title: "Những điểm cần kiểm chứng",
          items: [
            { icon: "Wheat", title: "Nguồn nguyên liệu", description: "Thông tin đầu vào rõ ràng, được kiểm tra trước sản xuất." },
            { icon: "Factory", title: "Nhà máy & quy trình", description: "Sản xuất theo quy trình để giữ chất lượng ổn định." },
            { icon: "BadgeCheck", title: "Chứng nhận", description: "Hồ sơ pháp lý và kiểm nghiệm được trình bày minh bạch." },
          ],
        },
      },
    ],
  ),
  "/chat-luong/minh-bach-nguon-nguyen-lieu": page(
    "/chat-luong/minh-bach-nguon-nguyen-lieu",
    "Minh bạch nguồn nguyên liệu",
    "Chất lượng",
    "Nguyên liệu rõ nguồn, có kiểm tra và có tiêu chí lựa chọn trước khi đưa vào sản xuất.",
    [
      {
        id: "ingredient-split",
        type: "split",
        data: {
          title: "Rõ từ đầu vào",
          description: "Khách hàng cần biết sản phẩm bắt đầu từ đâu. Trang này dùng để trình bày nguồn nguyên liệu, tiêu chí lựa chọn và cách kiểm soát đầu vào.",
          imageUrl: "/bento/bento-ingredients.png",
        },
      },
    ],
  ),
  "/chat-luong/nha-may-quy-trinh-san-xuat": page(
    "/chat-luong/nha-may-quy-trinh-san-xuat",
    "Nhà máy & Quy trình sản xuất",
    "Chất lượng",
    "Không gian sản xuất, các công đoạn chính và cách kiểm soát chất lượng trong từng lô sản phẩm.",
    [
      {
        id: "factory-split",
        type: "split",
        data: {
          title: "Quy trình giúp sản phẩm ổn định",
          description: "Từ sơ chế, chế biến, đóng gói đến kiểm tra, mỗi công đoạn đều cần được trình bày rõ để khách hàng hiểu đây là sản phẩm có quy trình.",
          imageUrl: defaultImage,
        },
      },
    ],
  ),
  "/chat-luong/ho-so-phap-ly-chung-nhan": page(
    "/chat-luong/ho-so-phap-ly-chung-nhan",
    "Hồ sơ pháp lý & chứng nhận",
    "Chất lượng",
    "Khu vực tổng hợp giấy tờ, kiểm nghiệm, chứng nhận và các tài liệu giúp khách hàng kiểm chứng.",
    [
      {
        id: "documents-split",
        type: "split",
        data: {
          title: "Bằng chứng cần nhìn thấy",
          description: "Trang này dành cho các hình ảnh chứng nhận, hồ sơ kiểm nghiệm, giấy tờ pháp lý và tài liệu liên quan.",
          imageUrl: proofImage,
        },
      },
    ],
  ),
  "/chat-luong/bao-hiem-trach-nhiem-san-pham-pvi": page(
    "/chat-luong/bao-hiem-trach-nhiem-san-pham-pvi",
    "Bảo hiểm trách nhiệm sản phẩm - PVI",
    "Chất lượng",
    "Thông tin về bảo hiểm trách nhiệm sản phẩm và cam kết bảo vệ người tiêu dùng.",
    [
      {
        id: "pvi-text",
        type: "text",
        data: {
          content:
            "<h2>Cam kết bảo vệ người tiêu dùng</h2><p>Bảo hiểm trách nhiệm sản phẩm là một phần trong hệ thống bảo chứng niềm tin, giúp khách hàng có thêm cơ sở yên tâm khi lựa chọn sản phẩm.</p>",
        },
      },
    ],
  ),
  "/chat-luong/chinh-sach-bao-ve-quyen-loi-khach-hang": page(
    "/chat-luong/chinh-sach-bao-ve-quyen-loi-khach-hang",
    "Chính sách bảo vệ quyền lợi khách hàng",
    "Chất lượng",
    "Nơi trình bày chính sách tiếp nhận phản hồi, xử lý khiếu nại và hỗ trợ khách hàng.",
    [
      {
        id: "customer-policy-features",
        type: "features",
        data: {
          title: "Nguyên tắc hỗ trợ",
          items: [
            { icon: "MessageCircle", title: "Tiếp nhận rõ ràng", description: "Ghi nhận thông tin phản hồi từ khách hàng." },
            { icon: "SearchCheck", title: "Kiểm tra minh bạch", description: "Đối chiếu thông tin sản phẩm và tình huống thực tế." },
            { icon: "HeartHandshake", title: "Giải quyết tử tế", description: "Ưu tiên quyền lợi chính đáng của khách hàng." },
          ],
        },
      },
    ],
  ),
  "/diem-ban": page(
    "/diem-ban",
    "Điểm bán",
    "Phân phối",
    "Thông tin về điểm bán offline, kênh online chính thức và cách nhận diện hàng chính hãng.",
    [
      {
        id: "distribution-split",
        type: "split",
        data: {
          title: "Tìm đúng kênh chính thức",
          description: "Trang này giúp khách hàng và đối tác hiểu các kênh phân phối đang được thương hiệu công bố.",
          imageUrl: productImage,
        },
      },
    ],
  ),
  "/diem-ban/he-thong-diem-ban-offline": page(
    "/diem-ban/he-thong-diem-ban-offline",
    "Hệ thống điểm bán offline",
    "Điểm bán",
    "Danh sách hoặc thông tin về các điểm bán, khu vực phân phối và đại lý chính thức.",
    [
      { id: "offline-text", type: "text", data: { content: "<h2>Điểm bán offline</h2><p>Cập nhật hệ thống cửa hàng, đại lý hoặc khu vực phân phối đang hoạt động.</p>" } },
    ],
  ),
  "/diem-ban/kenh-online-chinh-thuc": page(
    "/diem-ban/kenh-online-chinh-thuc",
    "Kênh online chính thức",
    "Điểm bán",
    "Các kênh online do thương hiệu công bố để khách hàng hạn chế mua nhầm hàng giả, hàng nhái.",
    [
      { id: "online-text", type: "text", data: { content: "<h2>Kênh online chính thức</h2><p>Dùng trang này để gắn link sàn, mạng xã hội hoặc kênh bán hàng được xác nhận.</p>" } },
    ],
  ),
  "/diem-ban/nhan-dien-hang-chinh-hang": page(
    "/diem-ban/nhan-dien-hang-chinh-hang",
    "Nhận diện hàng chính hãng",
    "Điểm bán",
    "Hướng dẫn khách hàng kiểm tra bao bì, tem nhãn và nguồn mua trước khi lựa chọn.",
    [
      { id: "authentic-features", type: "features", data: { title: "Cách nhận diện", items: [
        { icon: "PackageCheck", title: "Bao bì", description: "Kiểm tra thiết kế, thông tin sản phẩm và dấu hiệu bất thường." },
        { icon: "QrCode", title: "Tem nhãn", description: "Kiểm tra mã, nhãn và thông tin nhà sản xuất." },
        { icon: "Store", title: "Nguồn mua", description: "Ưu tiên kênh chính thức hoặc điểm bán được công bố." },
      ] } },
    ],
  ),
  "/hop-tac": page(
    "/hop-tac",
    "Hợp tác",
    "Kết nối",
    "Thông tin dành cho đại lý, nhà phân phối, truyền thông và các đối tác muốn làm việc cùng thương hiệu.",
    [
      { id: "partner-split", type: "split", data: { title: "Cùng phát triển hệ thống phân phối", description: "Trang hợp tác giúp đối tác hiểu định hướng, cách liên hệ và các nhóm cơ hội làm việc cùng Ăn Cùng Bà Tuyết.", imageUrl: defaultImage } },
    ],
  ),
  "/hop-tac/dai-ly-nha-phan-phoi": page(
    "/hop-tac/dai-ly-nha-phan-phoi",
    "Trở thành Đại lý/Nhà phân phối",
    "Hợp tác",
    "Thông tin dành cho đối tác muốn phân phối sản phẩm hoặc mở rộng điểm bán.",
    [
      { id: "dealer-text", type: "text", data: { content: "<h2>Đăng ký hợp tác phân phối</h2><p>Trình bày điều kiện hợp tác, khu vực ưu tiên và cách gửi thông tin liên hệ.</p>" } },
    ],
  ),
  "/hop-tac/truyen-thong": page(
    "/hop-tac/truyen-thong",
    "Hợp tác truyền thông",
    "Hợp tác",
    "Thông tin dành cho báo chí, KOL/KOC, cộng đồng và các đơn vị truyền thông.",
    [
      { id: "media-text", type: "text", data: { content: "<h2>Hợp tác truyền thông</h2><p>Trang này dùng để giới thiệu định hướng truyền thông, thông tin liên hệ và các tài nguyên thương hiệu.</p>" } },
    ],
  ),
};

export function getDefaultInfoPage(routePath: string) {
  return DEFAULT_INFO_PAGES[routePath] || null;
}
