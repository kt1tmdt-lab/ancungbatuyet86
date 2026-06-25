export type PressItem = {
  id: string;
  sourceName: string;
  title: string;
  link: string;
  publishDate: string;
};

export type FeedbackItem = {
  id: string;
  customerName: string;
  roleOrLocation: string;
  rating: number;
  comment: string;
};

export type VideoItem = {
  id: string;
  platform: "tiktok" | "youtube";
  videoId: string;
  title: string;
  url: string;
};

export type PageAssetItem = {
  id: string;
  key: string;
  label: string;
  imageUrl: string;
  linkUrl: string;
};

export type MarketingConfigData = {
  press: PressItem[];
  feedback: FeedbackItem[];
  videos: VideoItem[];
  pageAssets: PageAssetItem[];
};

export const DEFAULT_PAGE_ASSETS: PageAssetItem[] = [
  {
    id: "default-about-video",
    key: "about_video",
    label: "Video giới thiệu thương hiệu",
    imageUrl: "",
    linkUrl: "https://www.youtube.com/embed/NbWkmT79i5s?autoplay=0&rel=0",
  },
  {
    id: "default-home-factory-proof-image",
    key: "home_factory_proof_image",
    label: "Ảnh nhà máy ở trang chủ",
    imageUrl: "/bento/bento-factory.png",
    linkUrl: "/gioi-thieu",
  },
  {
    id: "default-home-factory-proof-1",
    key: "home_factory_proof_1",
    label: "Khu sản xuất và đóng gói được trình bày rõ ràng bằng hình ảnh thực tế.",
    imageUrl: "",
    linkUrl: "/quy-trinh",
  },
  {
    id: "default-home-factory-proof-2",
    key: "home_factory_proof_2",
    label: "Thông tin bảo hiểm, tiêu chuẩn và hồ sơ sản phẩm có vị trí riêng để tạo niềm tin.",
    imageUrl: "",
    linkUrl: "/gioi-thieu",
  },
  {
    id: "default-home-factory-proof-3",
    key: "home_factory_proof_3",
    label: "Nội dung tập trung vào an toàn, ổn định chất lượng và phân phối toàn quốc.",
    imageUrl: "",
    linkUrl: "/he-thong-ban",
  },
  {
    id: "default-home-factory-proof-4",
    key: "home_factory_proof_4",
    label: "Bố cục vuông, sáng, nhiều khoảng trắng, giảm hiệu ứng như web công nghệ.",
    imageUrl: "",
    linkUrl: "/tin-tuc",
  },
  {
    id: "default-about-process-background",
    key: "about_process_background",
    label: "Ảnh nền khu sản xuất phần giới thiệu",
    imageUrl: "/bento/bento-factory.png",
    linkUrl: "/quy-trinh",
  },
  {
    id: "default-about-gallery-1",
    key: "about_gallery_1",
    label: "Ảnh sản phẩm nổi bật",
    imageUrl: "/hero/chan-ga-plate.png",
    linkUrl: "/san-pham",
  },
  {
    id: "default-about-gallery-2",
    key: "about_gallery_2",
    label: "Ảnh poster sản phẩm",
    imageUrl: "/hero/chan-ga-poster.png",
    linkUrl: "/san-pham",
  },
  {
    id: "default-about-gallery-3",
    key: "about_gallery_3",
    label: "Ảnh nhân vật thương hiệu",
    imageUrl: "/hero/ba-tuyet-character.png",
    linkUrl: "/gioi-thieu",
  },
  {
    id: "default-about-gallery-4",
    key: "about_gallery_4",
    label: "Ảnh bánh tráng rong biển",
    imageUrl: "/hero/banh-trang-rong-bien.png",
    linkUrl: "/san-pham",
  },
  {
    id: "default-about-gallery-5",
    key: "about_gallery_5",
    label: "Ảnh đùi gà phô mai",
    imageUrl: "/hero/dui-ga-pho-mai.png",
    linkUrl: "/san-pham",
  },
  {
    id: "default-about-gallery-6",
    key: "about_gallery_6",
    label: "Ảnh tăm cay",
    imageUrl: "/hero/tam-cay-pack.png",
    linkUrl: "/san-pham",
  },
  {
    id: "default-about-team-quote",
    key: "about_team_quote",
    label: "Ảnh phần câu chuyện đội ngũ",
    imageUrl: "/hero/ba-tuyet-character.png",
    linkUrl: "/gioi-thieu",
  },
  {
    id: "default-about-process-ingredient",
    key: "about_process_ingredient",
    label: "Nguyên liệu",
    imageUrl: "/bento/bento-ingredients.png",
    linkUrl: "/quy-trinh",
  },
  {
    id: "default-about-process-factory",
    key: "about_process_factory",
    label: "Nhà máy",
    imageUrl: "/bento/bento-factory.png",
    linkUrl: "/quy-trinh",
  },
  {
    id: "default-about-process-packaging",
    key: "about_process_packaging",
    label: "Đóng gói",
    imageUrl: "/bento/bento-tiktok.png",
    linkUrl: "/quy-trinh",
  },
  {
    id: "default-about-process-distribution",
    key: "about_process_distribution",
    label: "Phân phối",
    imageUrl: "/bento/bento-insurance.png",
    linkUrl: "/he-thong-ban",
  },
  {
    id: "default-process-farm",
    key: "process_farm",
    label: "Nguyên liệu đầu vào",
    imageUrl: "/bento/bento-ingredients.png",
    linkUrl: "/quy-trinh",
  },
  {
    id: "default-process-inspect",
    key: "process_inspect",
    label: "Kiểm định nguyên liệu",
    imageUrl: "/bento/bento-insurance.png",
    linkUrl: "/quy-trinh",
  },
  {
    id: "default-process-cooking",
    key: "process_cooking",
    label: "Sơ chế và chế biến",
    imageUrl: "/hero/chan-ga-plate.png",
    linkUrl: "/quy-trinh",
  },
  {
    id: "default-process-qc",
    key: "process_qc",
    label: "Kiểm soát chất lượng",
    imageUrl: "/bento/bento-insurance.png",
    linkUrl: "/quy-trinh",
  },
  {
    id: "default-process-packaging",
    key: "process_packaging",
    label: "Đóng gói",
    imageUrl: "/bento/bento-tiktok.png",
    linkUrl: "/quy-trinh",
  },
  {
    id: "default-process-delivery",
    key: "process_delivery",
    label: "Giao hàng và phân phối",
    imageUrl: "/hero/chan-ga-poster.png",
    linkUrl: "/he-thong-ban",
  },
  {
    id: "default-process-factory",
    key: "process_factory",
    label: "Khu vực nhà máy",
    imageUrl: "/bento/bento-factory.png",
    linkUrl: "/quy-trinh",
  },
  {
    id: "default-process-documents",
    key: "process_documents",
    label: "Hồ sơ và chứng từ",
    imageUrl: "/bento/bento-insurance.png",
    linkUrl: "/gioi-thieu",
  },
];

export const DEFAULT_MARKETING_CONFIG: MarketingConfigData = {
  press: [],
  feedback: [],
  videos: [],
  pageAssets: DEFAULT_PAGE_ASSETS,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function itemId(value: unknown) {
  return stringValue(value) || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizePress(input: unknown): PressItem[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((item) => {
      if (!isRecord(item)) return null;
      const sourceName = stringValue(item.sourceName);
      const title = stringValue(item.title);
      const link = stringValue(item.link);
      const publishDate = stringValue(item.publishDate);

      if (!sourceName && !title && !link) return null;

      return {
        id: itemId(item.id),
        sourceName,
        title,
        link,
        publishDate: publishDate || new Date().toISOString().slice(0, 10),
      };
    })
    .filter((item): item is PressItem => Boolean(item));
}

function normalizeFeedback(input: unknown): FeedbackItem[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((item) => {
      if (!isRecord(item)) return null;
      const customerName = stringValue(item.customerName);
      const roleOrLocation = stringValue(item.roleOrLocation);
      const comment = stringValue(item.comment);
      const rating = Math.min(5, Math.max(1, Number(item.rating) || 5));

      if (!customerName && !roleOrLocation && !comment) return null;

      return {
        id: itemId(item.id),
        customerName,
        roleOrLocation,
        rating,
        comment,
      };
    })
    .filter((item): item is FeedbackItem => Boolean(item));
}

function normalizeVideos(input: unknown): VideoItem[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((item) => {
      if (!isRecord(item)) return null;
      const platform = item.platform === "youtube" ? "youtube" : "tiktok";
      const videoId = stringValue(item.videoId);
      const title = stringValue(item.title);
      const url = stringValue(item.url);

      if (!videoId && !title && !url) return null;

      return {
        id: itemId(item.id),
        platform,
        videoId,
        title,
        url,
      };
    })
    .filter((item): item is VideoItem => Boolean(item));
}

function normalizePageAssets(input: unknown): PageAssetItem[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((item) => {
      if (!isRecord(item)) return null;
      const key = stringValue(item.key);
      const label = stringValue(item.label);
      const imageUrl = stringValue(item.imageUrl);
      const linkUrl = stringValue(item.linkUrl);

      if (!key && !label && !imageUrl && !linkUrl) return null;

      return {
        id: itemId(item.id),
        key,
        label,
        imageUrl,
        linkUrl,
      };
    })
    .filter((item): item is PageAssetItem => Boolean(item));
}

function withDefaultPageAssets(items: PageAssetItem[]) {
  const byKey = new Map(items.map((item) => [item.key, item]));

  return DEFAULT_PAGE_ASSETS.map((defaultItem) => ({
    ...defaultItem,
    ...(byKey.get(defaultItem.key) || {}),
    id: byKey.get(defaultItem.key)?.id || defaultItem.id,
  })).concat(items.filter((item) => item.key && !DEFAULT_PAGE_ASSETS.some((defaultItem) => defaultItem.key === item.key)));
}

export function normalizeMarketingConfig(input: unknown): MarketingConfigData {
  const source = isRecord(input) ? input : {};
  const pageAssets = normalizePageAssets(source.pageAssets);

  return {
    press: normalizePress(source.press),
    feedback: normalizeFeedback(source.feedback),
    videos: normalizeVideos(source.videos),
    pageAssets: withDefaultPageAssets(pageAssets),
  };
}
