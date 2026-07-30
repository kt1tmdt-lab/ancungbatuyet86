export type InfoPageBlock =
  | {
      id: string;
      type: "hero";
      data: {
        label?: string;
        title: string;
        subtitle?: string;
        backgroundImage?: string;
        imageLabel?: string;
        imageCaption?: string;
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
        items: Array<{
          icon: string;
          title: string;
          description: string;
        }>;
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
        items: Array<{
          name: string;
          role: string;
          review: string;
          rating: number;
          avatarUrl?: string;
        }>;
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
        items: Array<{
          name: string;
          price: string;
          originalPrice?: string;
          benefits: string[];
          tag?: string;
          ctaLink?: string;
        }>;
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

function createInfoPage(
  routePath: string,
  title: string,
  label: string,
  subtitle: string,
  blocks: InfoPageBlock[],
): DefaultInfoPage {
  const cmsSlug = routePath.replace(/^\//, "").replace(/\//g, "-");
  const splitImage = blocks.find((block) => block.type === "split");

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
          backgroundImage:
            splitImage?.type === "split"
              ? splitImage.data.imageUrl
              : "/bento/bento-factory.png",
        },
      },
      ...blocks,
    ],
  };
}

export const DEFAULT_INFO_PAGES: Record<string, DefaultInfoPage> = {
  "/hop-tac": createInfoPage(
    "/hop-tac",
    "Hợp tác",
    "Kết nối",
    "Thông tin dành cho đại lý, nhà phân phối, đối tác truyền thông và các bên muốn làm việc cùng Ăn Cùng Bà Tuyết.",
    [
      {
        id: "partner-overview-split",
        type: "split",
        data: {
          title: "Chọn đúng hướng hợp tác",
          description:
            "Mỗi nhóm nhu cầu có một luồng tiếp nhận riêng để thông tin được chuyển đúng bộ phận và phản hồi nhanh hơn.",
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
          title: "Các hướng hợp tác",
          subtitle: "Chọn nhóm phù hợp với nhu cầu hiện tại.",
          items: [
            {
              icon: "Store",
              title: "Đại lý/Nhà phân phối",
              description:
                "Dành cho đối tác muốn bán, phân phối hoặc mở rộng điểm bán.",
            },
            {
              icon: "Megaphone",
              title: "Truyền thông",
              description:
                "Dành cho báo chí, KOL/KOC, cộng đồng và đơn vị sáng tạo nội dung.",
            },
            {
              icon: "Headphones",
              title: "Hỗ trợ khách hàng",
              description:
                "Dành cho khách hàng cần phản hồi hoặc xác minh thông tin.",
            },
          ],
        },
      },
    ],
  ),
  "/hop-tac/dai-ly-nha-phan-phoi": createInfoPage(
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
            "Hãy gửi khu vực kinh doanh, mô hình bán hàng, năng lực phân phối và thông tin người phụ trách để thương hiệu có cơ sở trao đổi cụ thể.",
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
          title: "Thông tin nên chuẩn bị",
          items: [
            {
              icon: "MapPin",
              title: "Khu vực phân phối",
              description: "Tỉnh/thành và phạm vi bán hàng dự kiến.",
            },
            {
              icon: "Store",
              title: "Mô hình bán hàng",
              description: "Cửa hàng, đại lý, siêu thị mini hoặc kênh online.",
            },
            {
              icon: "Truck",
              title: "Năng lực vận hành",
              description: "Sản lượng dự kiến, kho bãi và khả năng giao hàng.",
            },
            {
              icon: "Phone",
              title: "Người phụ trách",
              description: "Họ tên, số điện thoại, email và thời gian tiện trao đổi.",
            },
          ],
        },
      },
    ],
  ),
  "/hop-tac/truyen-thong": createInfoPage(
    "/hop-tac/truyen-thong",
    "Hợp tác truyền thông",
    "Hợp tác",
    "Thông tin dành cho báo chí, KOL/KOC, cộng đồng và các đơn vị truyền thông muốn làm việc với thương hiệu.",
    [
      {
        id: "media-partner-split",
        type: "split",
        data: {
          title: "Truyền thông đúng thông tin, đúng hồ sơ",
          description:
            "Nội dung hợp tác cần dùng thông tin đã được thương hiệu xác nhận về câu chuyện, sản phẩm, hồ sơ chất lượng và kênh mua chính thức.",
          imageUrl: "/hero/ba-tuyet-character.png",
          imagePosition: "right",
          ctaText: "Liên hệ truyền thông",
          ctaLink: "/lien-he",
        },
      },
      {
        id: "media-partner-features",
        type: "features",
        data: {
          title: "Nhóm hợp tác truyền thông",
          items: [
            {
              icon: "Newspaper",
              title: "Báo chí",
              description:
                "Trao đổi thông tin thương hiệu, hình ảnh và đầu mối xác minh.",
            },
            {
              icon: "Video",
              title: "KOL/KOC & video",
              description:
                "Review sản phẩm, trải nghiệm và nội dung hướng dẫn.",
            },
            {
              icon: "Users",
              title: "Cộng đồng",
              description:
                "Hoạt động cộng đồng, livestream, sampling hoặc chương trình đồng hành.",
            },
          ],
        },
      },
    ],
  ),
};

export function getDefaultInfoPage(routePath: string) {
  return DEFAULT_INFO_PAGES[routePath] || null;
}
