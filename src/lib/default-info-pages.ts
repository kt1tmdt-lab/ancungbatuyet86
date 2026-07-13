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

DEFAULT_INFO_PAGES["/diem-ban"] = page(
  "/diem-ban",
  "Điểm bán",
  "Phân phối chính thức",
  "Tìm đúng nơi mua sản phẩm Ăn Cùng Bà Tuyết: điểm bán offline, kênh online chính thức và cách nhận diện hàng chính hãng.",
  [
    {
      id: "sales-overview-split",
      type: "split",
      data: {
        title: "Mua đúng kênh — tránh nhầm hàng giả, hàng trôi nổi",
        description:
          "Trang Điểm bán giúp khách hàng biết nên mua sản phẩm ở đâu, kênh nào được thương hiệu công bố và cần kiểm tra gì trước khi đặt hàng. Các kênh chưa được xác nhận chính thức nên được ghi rõ [cần bổ sung] để tránh gây hiểu nhầm.",
        imageUrl: "/bento/bento-factory.png",
        imagePosition: "right",
        ctaText: "Xem kênh online chính thức",
        ctaLink: "/diem-ban/kenh-online-chinh-thuc",
      },
    },
    {
      id: "sales-overview-features",
      type: "features",
      data: {
        title: "3 việc khách hàng cần làm trước khi mua",
        subtitle: "Mục tiêu là mua đúng sản phẩm, đúng nguồn và có kênh hỗ trợ khi cần.",
        items: [
          {
            icon: "Store",
            title: "Kiểm tra điểm bán",
            description: "Ưu tiên điểm bán, đại lý hoặc kênh phân phối được thương hiệu công bố.",
          },
          {
            icon: "ShoppingBag",
            title: "Chọn kênh online chính thức",
            description: "Mua qua gian hàng/sàn/kênh mạng xã hội đã được xác nhận. [cần bổ sung link chính thức]",
          },
          {
            icon: "PackageCheck",
            title: "Nhận diện hàng chính hãng",
            description: "Kiểm tra bao bì, tem nhãn, hạn sử dụng và thông tin nhà sản xuất trước khi dùng.",
          },
        ],
      },
    },
    {
      id: "sales-overview-text",
      type: "text",
      data: {
        backgroundColor: "white",
        content:
          "<h2>Kênh mua hàng cần được công bố rõ</h2><p>Danh sách điểm bán và kênh online nên được cập nhật định kỳ để khách hàng dễ đối chiếu. Nếu một cửa hàng hoặc tài khoản bán hàng chưa có trong danh sách, khách hàng nên liên hệ CSKH để xác minh trước khi mua.</p><ul><li><strong>Offline:</strong> cửa hàng, đại lý, khu vực phân phối.</li><li><strong>Online:</strong> sàn TMĐT, website, fanpage/kênh bán chính thức.</li><li><strong>Hỗ trợ:</strong> tiếp nhận phản ánh khi nghi ngờ hàng giả, hàng nhái hoặc hàng không rõ nguồn.</li></ul>",
      },
    },
  ],
);

DEFAULT_INFO_PAGES["/diem-ban/he-thong-diem-ban-offline"] = page(
  "/diem-ban/he-thong-diem-ban-offline",
  "Hệ thống điểm bán offline",
  "Điểm bán",
  "Thông tin về cửa hàng, đại lý và khu vực phân phối offline đang được công bố.",
  [
    {
      id: "offline-store-split",
      type: "split",
      data: {
        title: "Danh sách điểm bán offline cần rõ địa chỉ và khu vực",
        description:
          "Mỗi điểm bán nên có tên cửa hàng/đại lý, địa chỉ, khu vực phục vụ, số điện thoại liên hệ và trạng thái xác nhận. Nếu chưa có danh sách chính thức, trang này giữ nội dung hướng dẫn và đánh dấu [cần bổ sung danh sách điểm bán].",
        imageUrl: "/bento/bento-factory.png",
        imagePosition: "left",
        ctaText: "Liên hệ xác minh điểm bán",
        ctaLink: "/lien-he",
      },
    },
    {
      id: "offline-store-features",
      type: "features",
      data: {
        title: "Thông tin nên có cho từng điểm bán",
        subtitle: "Càng rõ dữ liệu, khách hàng càng dễ mua đúng nơi.",
        items: [
          { icon: "MapPin", title: "Địa chỉ cụ thể", description: "Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành." },
          { icon: "Phone", title: "Liên hệ cửa hàng", description: "Số điện thoại hoặc kênh nhắn tin để kiểm tra hàng trước khi đến." },
          { icon: "BadgeCheck", title: "Trạng thái xác nhận", description: "Ghi rõ điểm bán đã xác nhận, đang cập nhật hoặc cần bổ sung." },
        ],
      },
    },
    {
      id: "offline-store-text",
      type: "text",
      data: {
        backgroundColor: "cream",
        content:
          "<h2>[cần bổ sung] Danh sách điểm bán offline</h2><p>Khi có dữ liệu chính thức, nhập theo nhóm khu vực để khách dễ tra cứu: Hà Nội, miền Bắc, miền Trung, miền Nam hoặc theo tỉnh/thành.</p><p>Nên ưu tiên hiển thị các điểm bán còn hoạt động và có khả năng hỗ trợ đổi trả/kiểm tra thông tin đơn hàng.</p>",
      },
    },
  ],
);

DEFAULT_INFO_PAGES["/diem-ban/kenh-online-chinh-thuc"] = page(
  "/diem-ban/kenh-online-chinh-thuc",
  "Kênh online chính thức",
  "Điểm bán",
  "Các kênh online được công bố để khách hàng hạn chế mua nhầm hàng giả, hàng nhái hoặc tài khoản mạo danh.",
  [
    {
      id: "online-channel-split",
      type: "split",
      data: {
        title: "Mua online cần đúng gian hàng/kênh được xác nhận",
        description:
          "Khách hàng nên đặt hàng qua các kênh được thương hiệu công bố như sàn TMĐT, website, fanpage hoặc TikTok Shop chính thức. Các link cụ thể cần được admin cập nhật và kiểm tra định kỳ.",
        imageUrl: "/hero/chan-ga-plate.png",
        imagePosition: "right",
        ctaText: "Xem sản phẩm",
        ctaLink: "/san-pham",
      },
    },
    {
      id: "online-channel-features",
      type: "features",
      data: {
        title: "Kênh online cần công bố",
        subtitle: "Mỗi kênh nên có link bấm được và ghi rõ trạng thái chính thức.",
        items: [
          { icon: "ShoppingCart", title: "Sàn TMĐT", description: "Shopee/TikTok Shop/Lazada nếu có. [cần bổ sung link chính thức]" },
          { icon: "Facebook", title: "Fanpage & cộng đồng", description: "Fanpage bán hàng hoặc kênh chăm sóc khách hàng được xác nhận." },
          { icon: "Globe", title: "Website/landing page", description: "Trang giới thiệu sản phẩm, thông tin mua hàng và liên hệ hỗ trợ." },
        ],
      },
    },
    {
      id: "online-channel-text",
      type: "text",
      data: {
        backgroundColor: "white",
        content:
          "<h2>Cảnh báo tài khoản mạo danh</h2><p>Không chuyển khoản hoặc đặt hàng qua tài khoản chưa được công bố. Nếu link bán hàng, tên shop hoặc hình ảnh sản phẩm có dấu hiệu bất thường, khách hàng nên chụp màn hình và gửi về kênh hỗ trợ để xác minh.</p><ul><li>Kiểm tra tên shop và đường link.</li><li>Kiểm tra đánh giá, thông tin liên hệ và chính sách đổi trả.</li><li>Không mua nếu giá quá bất thường hoặc thông tin sản phẩm thiếu rõ ràng.</li></ul>",
      },
    },
  ],
);

DEFAULT_INFO_PAGES["/diem-ban/nhan-dien-hang-chinh-hang"] = page(
  "/diem-ban/nhan-dien-hang-chinh-hang",
  "Nhận diện hàng chính hãng",
  "Điểm bán",
  "Hướng dẫn khách hàng kiểm tra bao bì, tem nhãn, hạn sử dụng và nguồn mua trước khi lựa chọn.",
  [
    {
      id: "authentic-product-split",
      type: "split",
      data: {
        title: "Đừng chỉ nhìn ảnh sản phẩm — hãy kiểm tra nguồn mua",
        description:
          "Sản phẩm chính hãng cần có bao bì rõ ràng, thông tin nhà sản xuất/đơn vị chịu trách nhiệm, ngày sản xuất, hạn sử dụng và kênh bán có thể xác minh. Nếu nghi ngờ hàng giả, khách hàng nên giữ lại bao bì và hóa đơn/chứng từ mua hàng.",
        imageUrl: "/hero/chan-ga-plate.png",
        imagePosition: "left",
        ctaText: "Liên hệ hỗ trợ kiểm tra",
        ctaLink: "/lien-he",
      },
    },
    {
      id: "authentic-product-features",
      type: "features",
      data: {
        title: "Checklist nhận diện trước khi mua",
        subtitle: "Các dấu hiệu cơ bản giúp hạn chế mua nhầm hàng trôi nổi.",
        items: [
          { icon: "PackageCheck", title: "Bao bì & thiết kế", description: "Kiểm tra hình ảnh, màu sắc, thông tin sản phẩm và dấu hiệu in ấn bất thường." },
          { icon: "CalendarCheck", title: "NSX / HSD", description: "Không mua sản phẩm mờ ngày, thiếu hạn sử dụng hoặc có dấu hiệu tẩy xóa." },
          { icon: "QrCode", title: "Tem nhãn / mã kiểm tra", description: "Nếu có mã hoặc tem, cần đối chiếu đúng hướng dẫn từ thương hiệu. [cần bổ sung hướng dẫn cụ thể]" },
          { icon: "Store", title: "Nguồn mua", description: "Ưu tiên kênh chính thức, điểm bán được công bố hoặc shop có thể xác minh." },
        ],
      },
    },
    {
      id: "authentic-product-text",
      type: "text",
      data: {
        backgroundColor: "cream",
        content:
          "<h2>Khi nghi ngờ hàng giả/hàng nhái</h2><p>Khách hàng nên giữ lại sản phẩm, bao bì, hóa đơn hoặc ảnh chụp màn hình đơn hàng. Gửi thông tin về kênh hỗ trợ để được kiểm tra và hướng dẫn bước tiếp theo.</p><p><strong>[cần bổ sung]</strong> Hotline/email CSKH chính thức và quy trình tiếp nhận phản ánh hàng giả.</p>",
      },
    },
  ],
);

DEFAULT_INFO_PAGES["/gioi-thieu/cau-chuyen-thuong-hieu"] = page(
  "/gioi-thieu/cau-chuyen-thuong-hieu",
  "Câu chuyện thương hiệu",
  "Giới thiệu",
  "Ăn Cùng Bà Tuyết được xây dựng từ một tinh thần rất đơn giản: món ăn vặt ngon phải đi cùng nguồn gốc rõ ràng, quy trình rõ ràng và trách nhiệm rõ ràng.",
  [
    {
      id: "brand-story-origin",
      type: "split",
      data: {
        title: "Từ món ăn quen thuộc đến thương hiệu có quy trình",
        description:
          "Ăn Cùng Bà Tuyết không chỉ kể câu chuyện bằng hình ảnh vui vẻ trên bao bì. Thương hiệu cần được nhìn thấy qua cách chọn nguyên liệu, cách sản xuất, cách công bố thông tin và cách xử lý trách nhiệm với khách hàng sau khi bán.",
        imageUrl: "/hero/ba-tuyet-character.png",
        imagePosition: "right",
        ctaText: "Xem chất lượng kiểm chứng",
        ctaLink: "/chat-luong",
      },
    },
    {
      id: "brand-story-principles",
      type: "features",
      data: {
        title: "Tinh thần thương hiệu",
        subtitle: "Không nói quá. Không tự phong. Cái gì có bằng chứng thì công bố, cái gì chưa đủ hồ sơ thì ghi rõ cần bổ sung.",
        items: [
          { icon: "Heart", title: "Gần gũi", description: "Giữ tinh thần món ăn vặt Việt: dễ ăn, dễ nhớ, có cá tính riêng." },
          { icon: "Factory", title: "Có quy trình", description: "Sản phẩm cần được đặt trong hệ thống sản xuất, kiểm soát và phân phối rõ ràng." },
          { icon: "FileSearch", title: "Có hồ sơ", description: "Thông tin về nguyên liệu, nhà máy, chứng nhận và bảo hiểm cần có tài liệu đi kèm." },
        ],
      },
    },
    {
      id: "brand-story-text",
      type: "text",
      data: {
        backgroundColor: "white",
        content:
          "<h2>Đừng tin những gì chúng tôi nói, hãy nhìn những gì chúng tôi làm</h2><p>Câu chuyện thương hiệu nên dẫn người xem tới những bằng chứng cụ thể: nguyên liệu nhập khẩu, quy trình sản xuất, chứng nhận nhà máy, phiếu kiểm nghiệm, bảo hiểm trách nhiệm sản phẩm và chính sách bảo vệ khách hàng.</p><p><strong>[cần bổ sung]</strong> timeline hình thành thương hiệu, hình ảnh người sáng lập/đội ngũ và các cột mốc truyền thông đã được xác minh.</p>",
      },
    },
  ],
);

DEFAULT_INFO_PAGES["/gioi-thieu/thong-tin-doanh-nghiep"] = page(
  "/gioi-thieu/thong-tin-doanh-nghiep",
  "Thông tin doanh nghiệp",
  "Giới thiệu",
  "Trang tổng hợp thông tin nền tảng về pháp nhân, định hướng vận hành, năng lực sản xuất liên quan và các kênh liên hệ chính thức.",
  [
    {
      id: "company-info-split",
      type: "split",
      data: {
        title: "Thông tin cần công khai để đối tác dễ kiểm chứng",
        description:
          "Trang này dùng cho khách hàng, đại lý, báo chí và đối tác muốn hiểu thương hiệu đang vận hành trên nền tảng nào. Các thông tin pháp nhân, địa chỉ, kênh liên hệ, giấy tờ liên quan nên được cập nhật rõ và thống nhất.",
        imageUrl: "/bento/bento-factory.png",
        imagePosition: "right",
        ctaText: "Liên hệ doanh nghiệp",
        ctaLink: "/lien-he",
      },
    },
    {
      id: "company-info-features",
      type: "features",
      data: {
        title: "Nhóm thông tin nên hiển thị",
        subtitle: "Các mục chưa có dữ liệu chính thức để [cần bổ sung], tránh tự bịa hoặc ghi sai pháp nhân.",
        items: [
          { icon: "Building2", title: "Pháp nhân & địa chỉ", description: "Tên doanh nghiệp, mã số thuế, địa chỉ đăng ký, địa chỉ liên hệ. [cần bổ sung]" },
          { icon: "Phone", title: "Kênh liên hệ chính thức", description: "Hotline, email, website, fanpage và thời gian làm việc." },
          { icon: "ShieldCheck", title: "Hồ sơ liên quan", description: "Giấy phép, chứng nhận, bảo hiểm, chính sách khách hàng và tài liệu kiểm chứng." },
        ],
      },
    },
    {
      id: "company-info-text",
      type: "text",
      data: {
        backgroundColor: "cream",
        content:
          "<h2>Gợi ý nội dung doanh nghiệp</h2><ul><li><strong>Tên thương hiệu:</strong> Ăn Cùng Bà Tuyết.</li><li><strong>Lĩnh vực:</strong> sản phẩm ăn vặt đóng gói.</li><li><strong>Định hướng:</strong> phát triển sản phẩm có nguồn nguyên liệu rõ, quy trình sản xuất rõ và hệ thống phân phối chính thức.</li><li><strong>[cần bổ sung]</strong> tên pháp nhân, mã số thuế, địa chỉ, người đại diện nếu được phép public.</li></ul>",
      },
    },
  ],
);

DEFAULT_INFO_PAGES["/gioi-thieu/hanh-trinh-phat-trien"] = page(
  "/gioi-thieu/hanh-trinh-phat-trien",
  "Hành trình phát triển",
  "Giới thiệu",
  "Các cột mốc giúp thương hiệu đi từ món ăn quen thuộc đến hệ thống sản phẩm có quy trình, có kênh bán và có hồ sơ kiểm chứng.",
  [
    {
      id: "journey-split",
      type: "split",
      data: {
        title: "Mỗi giai đoạn phải chứng minh bằng việc đã làm",
        description:
          "Hành trình phát triển không nên chỉ là các câu tự hào. Mỗi mốc nên gắn với một bằng chứng: ra mắt sản phẩm, mở rộng kênh phân phối, hoàn thiện bao bì, công bố hồ sơ chất lượng hoặc ký bảo hiểm trách nhiệm sản phẩm.",
        imageUrl: "/hero/ba-tuyet-character.png",
        imagePosition: "left",
        ctaText: "Xem tin tức & bằng chứng",
        ctaLink: "/tin-tuc",
      },
    },
    {
      id: "journey-features",
      type: "features",
      data: {
        title: "Các mốc nên cập nhật",
        subtitle: "Admin có thể thay từng mốc bằng năm/tháng thật khi có dữ liệu.",
        items: [
          { icon: "Sparkles", title: "Khởi đầu sản phẩm", description: "Giai đoạn hình thành món ăn/nhóm sản phẩm chủ lực. [cần bổ sung thời gian]" },
          { icon: "PackageCheck", title: "Chuẩn hóa đóng gói", description: "Hoàn thiện bao bì, nhãn, thông tin sản phẩm và nhận diện thương hiệu." },
          { icon: "Truck", title: "Mở rộng phân phối", description: "Phát triển kênh online, offline, đại lý và đối tác phân phối." },
          { icon: "FileCheck2", title: "Công bố hồ sơ", description: "Bổ sung chứng nhận, kiểm nghiệm, bảo hiểm và chính sách khách hàng." },
        ],
      },
    },
    {
      id: "journey-text",
      type: "text",
      data: {
        backgroundColor: "white",
        content:
          "<h2>[cần bổ sung] Timeline chính thức</h2><p>Nên cập nhật bằng các mốc có ngày/tháng/năm rõ ràng. Mỗi mốc nên có ảnh, bài viết, giấy tờ hoặc link chứng minh để tránh biến trang này thành lời kể chung chung.</p>",
      },
    },
  ],
);

DEFAULT_INFO_PAGES["/chat-luong/minh-bach-nguon-nguyen-lieu"] = page(
  "/chat-luong/minh-bach-nguon-nguyen-lieu",
  "Minh bạch nguồn nguyên liệu",
  "Chất lượng",
  "Nơi trình bày nguồn nguyên liệu, hồ sơ nhập khẩu, C/O, kiểm dịch và điều kiện lưu kho trước khi đưa vào sản xuất.",
  [
    {
      id: "ingredient-proof-split",
      type: "split",
      data: {
        title: "Nguyên liệu nhập khẩu từ châu Âu — cần có hồ sơ đi kèm",
        description:
          "Thông tin nguồn nguyên liệu chính như chân gà nhập từ Ba Lan, Hungary và các nước châu Âu khác chỉ nên công bố đầy đủ khi có C/O, phiếu kiểm dịch và hồ sơ lô hàng có thể đối chiếu.",
        imageUrl: "/bento/bento-ingredients.png",
        imagePosition: "right",
        ctaText: "Xem hồ sơ pháp lý",
        ctaLink: "/chat-luong/ho-so-phap-ly-chung-nhan",
      },
    },
    {
      id: "ingredient-proof-features",
      type: "features",
      data: {
        title: "Hồ sơ cần bổ sung cho nguyên liệu",
        subtitle: "Claim nào có bằng chứng thì hiển thị; chưa có thì giữ nhãn [cần bổ sung].",
        items: [
          { icon: "FileCheck2", title: "C/O", description: "Chứng nhận xuất xứ theo từng lô hàng. [cần bổ sung ảnh/PDF]" },
          { icon: "ClipboardCheck", title: "Phiếu kiểm dịch", description: "Tài liệu kiểm dịch nhập khẩu. [cần bổ sung]" },
          { icon: "Snowflake", title: "Kho lạnh", description: "Ảnh/video kho lạnh và quy chuẩn lưu trữ. [cần bổ sung]" },
        ],
      },
    },
    {
      id: "ingredient-proof-text",
      type: "text",
      data: {
        backgroundColor: "white",
        content:
          "<h2>Video truy xuất nguồn nguyên liệu</h2><p>[cần xác nhận] Link video truy xuất nguồn nguyên liệu từ Ba Lan để embed vào trang này. Khi có video, nên kèm mô tả ngắn: lô hàng nào, nguồn nào, giấy tờ nào liên quan.</p>",
      },
    },
  ],
);

DEFAULT_INFO_PAGES["/chat-luong/nha-may-quy-trinh-san-xuat"] = page(
  "/chat-luong/nha-may-quy-trinh-san-xuat",
  "Nhà máy & Quy trình sản xuất",
  "Chất lượng",
  "Giới thiệu nhà máy sản xuất NMV Food, quy trình 6 bước có kiểm soát và các hình ảnh thực tế cần công bố.",
  [
    {
      id: "factory-process-split",
      type: "split",
      data: {
        title: "Nhà máy sản xuất NMV Food — Thái Nguyên",
        description:
          "NMV Food đạt chứng nhận ISO 22000:2018. Nội dung public nên ghi đúng chủ thể chứng nhận, không ghi thành ACBT nếu hồ sơ không thể hiện như vậy. Quy trình nên dùng cách nói: quy trình 6 bước có kiểm soát.",
        imageUrl: "/bento/bento-factory.png",
        imagePosition: "left",
        ctaText: "Xem hồ sơ chứng nhận",
        ctaLink: "/chat-luong/ho-so-phap-ly-chung-nhan",
      },
    },
    {
      id: "factory-process-features",
      type: "features",
      data: {
        title: "Quy trình 6 bước có kiểm soát",
        subtitle: "Không dùng các cụm như an toàn tuyệt đối, vô trùng hoặc kiểm soát nghiêm ngặt nếu không có cơ sở pháp lý.",
        items: [
          { icon: "Wheat", title: "1. Nguyên liệu", description: "Tiếp nhận và kiểm tra thông tin đầu vào." },
          { icon: "Droplets", title: "2. Sơ chế", description: "Sơ chế theo quy trình nội bộ đã thiết lập." },
          { icon: "Flame", title: "3. Chế biến", description: "Chế biến theo công thức và quy trình được kiểm soát." },
          { icon: "SearchCheck", title: "4. QC", description: "Kiểm tra trước khi đóng gói. [cần bổ sung tiêu chí QC]" },
          { icon: "PackageCheck", title: "5. Đóng gói", description: "Đóng gói, nhãn, NSX/HSD và thông tin sản phẩm." },
          { icon: "Truck", title: "6. Giao hàng", description: "Lưu kho và phân phối tới kênh bán." },
        ],
      },
    },
    {
      id: "factory-process-text",
      type: "text",
      data: {
        backgroundColor: "cream",
        content:
          "<h2>[cần bổ sung] Gallery nhà máy thật</h2><p>Nên bổ sung 4–6 ảnh/video tại NMV Food: dây chuyền, kho, sơ chế, đóng gói, QC. Không dùng ảnh minh họa gây hiểu nhầm là ảnh nhà máy thật.</p>",
      },
    },
  ],
);

DEFAULT_INFO_PAGES["/chat-luong/ho-so-phap-ly-chung-nhan"] = page(
  "/chat-luong/ho-so-phap-ly-chung-nhan",
  "Hồ sơ pháp lý & chứng nhận",
  "Chất lượng",
  "Trang tập trung giấy tờ, chứng nhận, phiếu kiểm nghiệm và tài liệu pháp lý để khách hàng, đối tác, báo chí kiểm chứng.",
  [
    {
      id: "legal-documents-split",
      type: "split",
      data: {
        title: "Bằng chứng phải mở ra xem được",
        description:
          "Mỗi chứng nhận nên có ảnh scan hoặc PDF đi kèm. Nếu chưa có file public, cần ghi rõ [cần bổ sung] thay vì để khách hàng hiểu nhầm là đã có hồ sơ đầy đủ.",
        imageUrl: "/bento/bento-insurance.png",
        imagePosition: "right",
        ctaText: "Liên hệ nhận hồ sơ",
        ctaLink: "/lien-he",
      },
    },
    {
      id: "legal-documents-features",
      type: "features",
      data: {
        title: "Nhóm hồ sơ cần có",
        subtitle: "Ghi đúng chủ thể được cấp, ví dụ ISO 22000:2018 cấp cho NMV Food.",
        items: [
          { icon: "BadgeCheck", title: "ISO 22000:2018", description: "Cấp cho NMV Food. [cần bổ sung scan]" },
          { icon: "ClipboardCheck", title: "HACCP", description: "Chương trình đào tạo, NMV Food. [cần bổ sung]" },
          { icon: "FileCheck2", title: "Giấy phép ATTP", description: "Giấy đủ điều kiện ATTP. [cần bổ sung ảnh/PDF]" },
          { icon: "FileSearch", title: "Phiếu kiểm nghiệm", description: "VNTEST — kiểm nghiệm định kỳ hàng tháng (NMV Food). [cần bổ sung phiếu mới nhất]" },
        ],
      },
    },
    {
      id: "legal-documents-text",
      type: "text",
      data: {
        backgroundColor: "white",
        content:
          "<h2>Nguyên tắc công bố hồ sơ</h2><p>Không gộp chứng nhận của nhà máy thành chứng nhận của thương hiệu nếu giấy tờ không thể hiện như vậy. Không gọi bảo hiểm PVI là bảo chứng chất lượng. Mỗi tài liệu nên có ngày cấp, đơn vị cấp, chủ thể được cấp và file xem chi tiết.</p>",
      },
    },
  ],
);

DEFAULT_INFO_PAGES["/chat-luong/bao-hiem-trach-nhiem-san-pham-pvi"] = page(
  "/chat-luong/bao-hiem-trach-nhiem-san-pham-pvi",
  "Bảo hiểm trách nhiệm sản phẩm - PVI",
  "Chất lượng",
  "Giải thích đúng về bảo hiểm trách nhiệm sản phẩm PVI: đây là cam kết trách nhiệm, không phải chứng nhận chất lượng.",
  [
    {
      id: "pvi-insurance-split",
      type: "split",
      data: {
        title: "Bảo hiểm trách nhiệm sản phẩm — PVI",
        description:
          "ACBT mua bảo hiểm trách nhiệm sản phẩm từ PVI. Nếu sản phẩm gây thiệt hại cho người tiêu dùng theo phạm vi hợp đồng, có đơn vị bảo hiểm tham gia trách nhiệm bồi thường. Nội dung này không được trình bày như PVI xác nhận chất lượng sản phẩm.",
        imageUrl: "/bento/bento-insurance.png",
        imagePosition: "left",
        ctaText: "Xem chính sách khách hàng",
        ctaLink: "/chat-luong/chinh-sach-bao-ve-quyen-loi-khach-hang",
      },
    },
    {
      id: "pvi-insurance-features",
      type: "features",
      data: {
        title: "Viết đúng về PVI",
        subtitle: "Tránh các cụm từ dễ gây hiểu nhầm.",
        items: [
          { icon: "CheckCircle2", title: "Được dùng", description: "Bảo hiểm trách nhiệm sản phẩm." },
          { icon: "Ban", title: "Không dùng", description: "Bảo chứng chất lượng, bảo chứng niềm tin, PVI xác nhận chất lượng." },
          { icon: "FileSearch", title: "Cần xác nhận", description: "Pháp nhân trên hợp đồng và phạm vi bảo hiểm cụ thể." },
        ],
      },
    },
    {
      id: "pvi-insurance-text",
      type: "text",
      data: {
        backgroundColor: "white",
        content:
          "<h2>[cần bổ sung] Scan hợp đồng hoặc xác nhận được phép public</h2><p>Trước khi đưa hình hợp đồng lên website, cần xác nhận phần nào được phép công khai và có che thông tin nhạy cảm hay không.</p>",
      },
    },
  ],
);

DEFAULT_INFO_PAGES["/chat-luong/chinh-sach-bao-ve-quyen-loi-khach-hang"] = page(
  "/chat-luong/chinh-sach-bao-ve-quyen-loi-khach-hang",
  "Chính sách bảo vệ quyền lợi khách hàng",
  "Chất lượng",
  "Tóm tắt các quyền lợi chính của khách hàng khi mua sản phẩm: được thông tin, đổi trả, khiếu nại, hỗ trợ và bảo hiểm trách nhiệm sản phẩm.",
  [
    {
      id: "customer-policy-split",
      type: "split",
      data: {
        title: "Khách hàng cần biết họ được bảo vệ như thế nào",
        description:
          "Trang này tóm tắt chính sách CSKH theo cách dễ hiểu. Bản đầy đủ nên dẫn sang PDF hoặc trang riêng khi đã chốt đủ 11 điều.",
        imageUrl: "/hero/ba-tuyet-character.png",
        imagePosition: "right",
        ctaText: "Liên hệ hỗ trợ",
        ctaLink: "/lien-he",
      },
    },
    {
      id: "customer-policy-features-full",
      type: "features",
      data: {
        title: "5 điểm chính trong chính sách",
        subtitle: "Các dòng [cần bổ sung] để admin điền chính xác theo quy định CSKH.",
        items: [
          { icon: "Info", title: "Quyền được thông tin", description: "Sản phẩm ghi rõ thành phần, NSX, HSD và thông tin cần thiết." },
          { icon: "RefreshCw", title: "Quyền đổi trả", description: "Quy trình đổi trả khi sản phẩm lỗi. [cần bổ sung điều kiện]" },
          { icon: "MessageCircle", title: "Quyền khiếu nại", description: "Kênh tiếp nhận và thời gian xử lý. [cần bổ sung SLA]" },
          { icon: "ShieldCheck", title: "Bảo hiểm sản phẩm", description: "Sản phẩm được bảo hiểm trách nhiệm sản phẩm bởi PVI theo phạm vi hợp đồng." },
          { icon: "Headphones", title: "Kênh hỗ trợ", description: "Hotline, email và thời gian làm việc. [cần bổ sung]" },
        ],
      },
    },
    {
      id: "customer-policy-text",
      type: "text",
      data: {
        backgroundColor: "cream",
        content:
          "<h2>[cần bổ sung] Link chính sách đầy đủ</h2><p>Khi có bản chính sách 11 điều, gắn link PDF hoặc tạo trang chi tiết riêng. Trang này chỉ nên là bản tóm tắt dễ đọc.</p>",
      },
    },
  ],
);

DEFAULT_INFO_PAGES["/hop-tac"] = page(
  "/hop-tac",
  "Hợp tác",
  "Kết nối",
  "Thông tin dành cho đại lý, nhà phân phối, đối tác truyền thông và các bên muốn làm việc cùng Ăn Cùng Bà Tuyết.",
  [
    {
      id: "partner-overview-split",
      type: "split",
      data: {
        title: "Hợp tác phải rõ vai trò, khu vực và cách liên hệ",
        description:
          "Trang này giúp đối tác hiểu các hướng hợp tác chính: phân phối sản phẩm, mở rộng điểm bán, hợp tác truyền thông hoặc liên hệ thương hiệu. Mỗi nhóm hợp tác nên có form/đầu mối tiếp nhận riêng.",
        imageUrl: "/bento/bento-factory.png",
        imagePosition: "right",
        ctaText: "Trở thành đại lý",
        ctaLink: "/hop-tac/dai-ly-nha-phan-phoi",
      },
    },
    {
      id: "partner-overview-features",
      type: "features",
      data: {
        title: "Nhóm hợp tác chính",
        subtitle: "Tách rõ nhu cầu để người liên hệ không bị lạc.",
        items: [
          { icon: "Store", title: "Đại lý/Nhà phân phối", description: "Dành cho đối tác muốn bán, phân phối hoặc mở điểm bán." },
          { icon: "Megaphone", title: "Truyền thông", description: "Dành cho báo chí, KOL/KOC, cộng đồng và đơn vị sáng tạo nội dung." },
          { icon: "Headphones", title: "Liên hệ hỗ trợ", description: "Dành cho khách hàng cần phản hồi, xác minh thông tin hoặc hỗ trợ mua hàng." },
        ],
      },
    },
    {
      id: "partner-overview-text",
      type: "text",
      data: {
        backgroundColor: "white",
        content:
          "<h2>Thông tin nên chuẩn bị trước khi liên hệ</h2><ul><li>Họ tên/người phụ trách.</li><li>Doanh nghiệp/kênh truyền thông/khu vực hoạt động.</li><li>Nhu cầu hợp tác cụ thể.</li><li>Sản lượng/kênh bán/tệp khách hàng nếu là đại lý.</li><li>Link kênh hoặc media kit nếu là truyền thông.</li></ul>",
      },
    },
  ],
);

DEFAULT_INFO_PAGES["/hop-tac/dai-ly-nha-phan-phoi"] = page(
  "/hop-tac/dai-ly-nha-phan-phoi",
  "Trở thành Đại lý/Nhà phân phối",
  "Hợp tác",
  "Trang dành cho đối tác muốn phân phối sản phẩm, mở điểm bán hoặc phát triển kênh bán chính thức cùng thương hiệu.",
  [
    {
      id: "dealer-partner-split",
      type: "split",
      data: {
        title: "Cùng mở rộng kênh phân phối chính thức",
        description:
          "Đối tác đại lý/nhà phân phối cần cung cấp khu vực kinh doanh, mô hình bán hàng, năng lực phân phối và thông tin liên hệ. Thương hiệu nên phản hồi theo quy trình rõ ràng để tránh bỏ sót cơ hội hợp tác.",
        imageUrl: "/hero/chan-ga-plate.png",
        imagePosition: "left",
        ctaText: "Gửi thông tin hợp tác",
        ctaLink: "/lien-he",
      },
    },
    {
      id: "dealer-partner-features",
      type: "features",
      data: {
        title: "Thông tin đối tác cần cung cấp",
        subtitle: "Các mục này có thể chuyển thành form sau.",
        items: [
          { icon: "MapPin", title: "Khu vực phân phối", description: "Tỉnh/thành, quận/huyện hoặc hệ thống điểm bán đang có." },
          { icon: "Store", title: "Mô hình bán hàng", description: "Cửa hàng, đại lý, tạp hóa, siêu thị mini, online hoặc kênh riêng." },
          { icon: "Truck", title: "Năng lực vận hành", description: "Sản lượng dự kiến, kho bãi, đội giao hàng hoặc năng lực bán hàng." },
          { icon: "Phone", title: "Thông tin liên hệ", description: "Người phụ trách, số điện thoại, email và thời gian tiện trao đổi." },
        ],
      },
    },
    {
      id: "dealer-partner-text",
      type: "text",
      data: {
        backgroundColor: "cream",
        content:
          "<h2>[cần bổ sung] Chính sách đại lý</h2><p>Cần bổ sung điều kiện hợp tác, mức chiết khấu, khu vực ưu tiên, yêu cầu nhận diện hàng chính hãng và quy trình đặt hàng/đổi trả dành cho đối tác.</p>",
      },
    },
  ],
);

DEFAULT_INFO_PAGES["/hop-tac/truyen-thong"] = page(
  "/hop-tac/truyen-thong",
  "Hợp tác truyền thông",
  "Hợp tác",
  "Thông tin dành cho báo chí, KOL/KOC, cộng đồng và các đơn vị truyền thông muốn làm việc với thương hiệu.",
  [
    {
      id: "media-partner-split",
      type: "split",
      data: {
        title: "Truyền thông cần đúng thông tin, đúng hồ sơ",
        description:
          "Các hợp tác truyền thông nên dùng thông tin đã kiểm chứng: câu chuyện thương hiệu, sản phẩm đại diện, hồ sơ chất lượng, kênh mua chính thức và chính sách khách hàng. Không dùng claim chưa có bằng chứng.",
        imageUrl: "/hero/ba-tuyet-character.png",
        imagePosition: "right",
        ctaText: "Xem hồ sơ chất lượng",
        ctaLink: "/chat-luong",
      },
    },
    {
      id: "media-partner-features",
      type: "features",
      data: {
        title: "Nhóm hợp tác truyền thông",
        subtitle: "Mỗi nhóm cần đầu mối và brief rõ ràng.",
        items: [
          { icon: "Newspaper", title: "Báo chí", description: "Cung cấp thông tin thương hiệu, hình ảnh, hồ sơ và đầu mối xác minh." },
          { icon: "Video", title: "KOL/KOC & video", description: "Review sản phẩm, trải nghiệm nhà máy, nội dung hướng dẫn mua chính hãng." },
          { icon: "Users", title: "Cộng đồng", description: "Hoạt động cộng đồng, livestream, sampling hoặc chương trình đồng hành." },
        ],
      },
    },
    {
      id: "media-partner-text",
      type: "text",
      data: {
        backgroundColor: "white",
        content:
          "<h2>[cần bổ sung] Media kit</h2><p>Nên có bộ tài liệu truyền thông: logo, ảnh sản phẩm, ảnh nhân vật, mô tả thương hiệu ngắn, thông tin pháp lý được phép công bố, các claim được phép dùng và danh sách claim không được dùng.</p>",
      },
    },
  ],
);

export function getDefaultInfoPage(routePath: string) {
  return DEFAULT_INFO_PAGES[routePath] || null;
}
