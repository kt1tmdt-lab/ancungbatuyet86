import { normalizeUploadPublicUrl } from "@/lib/upload-url";

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

export type TrustSectionItem = {
  id: string;
  key: string;
  title: string;
  description: string;
  detailTitle: string;
  detailContent: string;
  imageUrl: string;
  linkUrl: string;
  enabled: boolean;
};

export type HistoryMilestoneItem = {
  id: string;
  year: string;
  title: string;
  description: string;
  detailContent: string;
  imageUrl: string;
  linkUrl: string;
  type: "milestone" | "achievement";
  enabled: boolean;
  sortOrder: number;
};

export type MarketingConfigData = {
  press: PressItem[];
  feedback: FeedbackItem[];
  videos: VideoItem[];
  pageAssets: PageAssetItem[];
  trustSections: TrustSectionItem[];
  historyMilestones: HistoryMilestoneItem[];
};

const TRUST_DOCUMENT_KEYS = new Set(["food_safety_certificate", "pvi_insurance"]);
const TRUST_DOCUMENT_PLACEHOLDER_IMAGES = new Set(["/bento/bento-insurance.png"]);

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
  historyMilestones: [
    {
      id: "default-history-2022",
      year: "2022",
      title: "Bắt đầu từ căn bếp nhỏ",
      description: "Hành trình Ăn Cùng Bà Tuyết bắt đầu từ đam mê ẩm thực và những món ăn vặt quen thuộc.",
      detailContent: "Từ các công thức gần gũi, đội ngũ bắt đầu thử nghiệm sản phẩm, lắng nghe phản hồi của khách hàng và xây dựng những nền tảng đầu tiên cho thương hiệu.",
      imageUrl: "/hero/ba-tuyet-character.png",
      linkUrl: "/gioi-thieu",
      type: "milestone",
      enabled: true,
      sortOrder: 10,
    },
    {
      id: "default-history-2023",
      year: "2023",
      title: "Phát triển thương hiệu Ăn Cùng Bà Tuyết",
      description: "Thương hiệu được định hình rõ hơn với nhóm sản phẩm ăn vặt đóng gói, dễ mua và dễ nhận diện.",
      detailContent: "Bao bì, kênh bán và cách kể câu chuyện thương hiệu được chuẩn hóa dần để khách hàng nhận biết sản phẩm tốt hơn.",
      imageUrl: "/hero/chan-ga-poster.png",
      linkUrl: "/san-pham",
      type: "milestone",
      enabled: true,
      sortOrder: 20,
    },
    {
      id: "default-history-2024",
      year: "2024",
      title: "Mở rộng kênh bán online",
      description: "Sản phẩm xuất hiện mạnh hơn trên các kênh thương mại điện tử và mạng xã hội.",
      detailContent: "TikTok Shop, Shopee và các điểm bán online giúp thương hiệu tiếp cận nhiều khách hàng hơn trên toàn quốc.",
      imageUrl: "/bento/bento-tiktok.png",
      linkUrl: "/he-thong-ban",
      type: "achievement",
      enabled: true,
      sortOrder: 30,
    },
    {
      id: "default-history-2025",
      year: "2025",
      title: "Tập trung vào quy trình và năng lực sản xuất",
      description: "Thương hiệu đẩy mạnh tiêu chuẩn hóa quy trình, hình ảnh nhà xưởng và hồ sơ uy tín.",
      detailContent: "Các nội dung về nguyên liệu, kiểm soát chất lượng, đóng gói và phân phối được trình bày rõ hơn để tạo niềm tin với khách hàng.",
      imageUrl: "/bento/bento-factory.png",
      linkUrl: "/quy-trinh",
      type: "milestone",
      enabled: true,
      sortOrder: 40,
    },
  ],
  trustSections: [
    {
      id: "default-food-safety",
      key: "food_safety_certificate",
      title: "Giấy vệ sinh an toàn thực phẩm",
      description: "Khu vực dành cho giấy chứng nhận, hồ sơ pháp lý và tiêu chuẩn an toàn thực phẩm của thương hiệu.",
      detailTitle: "Hồ sơ an toàn thực phẩm",
      detailContent: "Đưa hình ảnh giấy chứng nhận, ngày cấp, đơn vị cấp và phạm vi áp dụng vào đây để khách hàng có thể kiểm chứng nhanh. Nên bổ sung ảnh thật của giấy tờ và ghi rõ sản phẩm hoặc cơ sở sản xuất liên quan.",
      imageUrl: "",
      linkUrl: "/gioi-thieu",
      enabled: true,
    },
    {
      id: "default-pvi-insurance",
      key: "pvi_insurance",
      title: "Bảo hiểm PVI",
      description: "Thể hiện cam kết bảo vệ người tiêu dùng và trách nhiệm của doanh nghiệp với sản phẩm đưa ra thị trường.",
      detailTitle: "Cam kết bảo vệ người tiêu dùng",
      detailContent: "Trình bày số hợp đồng, phạm vi bảo hiểm, thời hạn hiệu lực và ý nghĩa của bảo hiểm đối với khách hàng. Phần này giúp người mua hiểu doanh nghiệp có trách nhiệm rõ ràng với sản phẩm.",
      imageUrl: "",
      linkUrl: "/gioi-thieu",
      enabled: true,
    },
    {
      id: "default-company-history",
      key: "company_history",
      title: "Lịch sử hình thành công ty",
      description: "Tóm tắt hành trình phát triển, các mốc quan trọng và bước chuyển từ căn bếp nhỏ đến vận hành bài bản.",
      detailTitle: "Hành trình phát triển",
      detailContent: "Kể các cột mốc quan trọng theo thời gian: lúc bắt đầu bán hàng, mở rộng đội ngũ, xây dựng nhà xưởng, phát triển kênh online và các bước chuyển giúp thương hiệu vận hành chuyên nghiệp hơn.",
      imageUrl: "/hero/ba-tuyet-character.png",
      linkUrl: "/gioi-thieu",
      enabled: true,
    },
    {
      id: "default-achievements",
      key: "achievements",
      title: "Thành tích đáng tự hào",
      description: "Khu vực trưng bày cúp, giải thưởng, dấu mốc kinh doanh và những ghi nhận nổi bật của thương hiệu.",
      detailTitle: "Dấu mốc và ghi nhận",
      detailContent: "Ghi rõ các cúp, giải thưởng, xếp hạng sàn thương mại điện tử, doanh số hoặc bài báo tiêu biểu. Nên ưu tiên số liệu có nguồn đối chiếu để tăng độ tin cậy.",
      imageUrl: "/bento/bento-tiktok.png",
      linkUrl: "/tin-tuc",
      enabled: true,
    },
    {
      id: "default-production-process",
      key: "production_process",
      title: "Quy trình sản xuất",
      description: "Mô tả các bước chọn nguyên liệu, sơ chế, kiểm soát chất lượng, đóng gói và phân phối.",
      detailTitle: "Từ nguyên liệu đến đóng gói",
      detailContent: "Mô tả ngắn từng bước: chọn nguyên liệu, sơ chế, tẩm ướp, kiểm soát chất lượng, đóng gói, lưu kho và vận chuyển. Có thể thêm ảnh xưởng hoặc ảnh từng công đoạn để khách hàng thấy quy trình thật.",
      imageUrl: "/bento/bento-factory.png",
      linkUrl: "/quy-trinh",
      enabled: true,
    },
    {
      id: "default-brand-story",
      key: "brand_story",
      title: "Câu chuyện thương hiệu",
      description: "Câu chuyện về con người, sản phẩm và tinh thần gần gũi làm nên Ăn Cùng Bà Tuyết.",
      detailTitle: "Tinh thần làm thật, bán thật",
      detailContent: "Kể câu chuyện thương hiệu bằng giọng gần gũi: vì sao chọn ngành ăn vặt, điều gì khiến khách hàng nhớ đến Bà Tuyết, và đội ngũ giữ chất lượng sản phẩm như thế nào qua từng ngày.",
      imageUrl: "/hero/chan-ga-poster.png",
      linkUrl: "/gioi-thieu",
      enabled: true,
    },
    {
      id: "default-mission",
      key: "mission",
      title: "Sứ mệnh",
      description: "Mang đến các món ăn vặt sạch, ngon, dễ tiếp cận và có thông tin minh bạch cho khách hàng.",
      detailTitle: "Sứ mệnh thương hiệu",
      detailContent: "Nêu rõ thương hiệu muốn giải quyết điều gì cho khách hàng: đồ ăn vặt ngon, dễ mua, rõ nguồn gốc và được phục vụ tử tế.",
      imageUrl: "/hero/chan-ga-plate.png",
      linkUrl: "/gioi-thieu",
      enabled: true,
    },
    {
      id: "default-vision",
      key: "vision",
      title: "Tầm nhìn",
      description: "Trở thành thương hiệu đồ ăn vặt Việt Nam có quy trình, uy tín và được yêu thích rộng rãi.",
      detailTitle: "Tầm nhìn dài hạn",
      detailContent: "Mô tả mục tiêu phát triển trong vài năm tới: chuẩn hóa sản xuất, mở rộng kênh bán, xây dựng niềm tin và đưa sản phẩm ăn vặt Việt đến nhiều khách hàng hơn.",
      imageUrl: "/bento/bento-ingredients.png",
      linkUrl: "/gioi-thieu",
      enabled: true,
    },
  ],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function trustImageUrl(key: string, imageUrl: string) {
  if (TRUST_DOCUMENT_KEYS.has(key) && TRUST_DOCUMENT_PLACEHOLDER_IMAGES.has(imageUrl)) {
    return "";
  }

  return normalizeUploadPublicUrl(imageUrl);
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
      const imageUrl = normalizeUploadPublicUrl(stringValue(item.imageUrl));
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

function normalizeTrustSections(input: unknown): TrustSectionItem[] {
  if (!Array.isArray(input)) return DEFAULT_MARKETING_CONFIG.trustSections;

  const items = input
    .map((item) => {
      if (!isRecord(item)) return null;
      const key = stringValue(item.key);
      const title = stringValue(item.title);
      const description = stringValue(item.description);
      const detailTitle = stringValue(item.detailTitle);
      const detailContent = stringValue(item.detailContent);
      const imageUrl = trustImageUrl(key, stringValue(item.imageUrl));
      const linkUrl = stringValue(item.linkUrl);

      if (!key && !title && !description && !detailTitle && !detailContent && !imageUrl && !linkUrl) return null;

      return {
        id: itemId(item.id),
        key,
        title,
        description,
        detailTitle,
        detailContent,
        imageUrl,
        linkUrl,
        enabled: item.enabled !== false,
      };
    })
    .filter((item): item is TrustSectionItem => Boolean(item));

  const byKey = new Map(items.map((item) => [item.key, item]));

  return DEFAULT_MARKETING_CONFIG.trustSections.map((defaultItem) => ({
    ...defaultItem,
    ...(byKey.get(defaultItem.key) || {}),
    id: byKey.get(defaultItem.key)?.id || defaultItem.id,
  })).concat(items.filter((item) => item.key && !DEFAULT_MARKETING_CONFIG.trustSections.some((defaultItem) => defaultItem.key === item.key)));
}

function historyYearFromText(...values: string[]) {
  const text = values.join(" ");
  const match = text.match(/\b(19\d\d|20\d\d)\b/);
  return match ? match[0] : "";
}

function buildHistoryMilestonesFromTrustSections(items: TrustSectionItem[]) {
  const historyItems = items.filter((item) =>
    ["company_history", "achievements"].includes(item.key),
  );

  return historyItems.map((item, index): HistoryMilestoneItem => ({
    id: `migrated-${item.id || item.key}`,
    year: historyYearFromText(item.title, item.description, item.detailContent),
    title: item.title,
    description: item.description,
    detailContent: item.detailContent,
    imageUrl: item.imageUrl,
    linkUrl: item.linkUrl,
    type: item.key === "achievements" ? "achievement" : "milestone",
    enabled: item.enabled,
    sortOrder: (index + 1) * 10,
  }));
}

function normalizeHistoryMilestones(input: unknown): HistoryMilestoneItem[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((item, index) => {
      if (!isRecord(item)) return null;
      const year = stringValue(item.year);
      const title = stringValue(item.title);
      const description = stringValue(item.description);
      const detailContent = stringValue(item.detailContent);
      const imageUrl = normalizeUploadPublicUrl(stringValue(item.imageUrl));
      const linkUrl = stringValue(item.linkUrl);
      const type = item.type === "achievement" ? "achievement" : "milestone";
      const sortOrder = Number.isFinite(Number(item.sortOrder))
        ? Number(item.sortOrder)
        : index * 10;

      if (!year && !title && !description && !detailContent && !imageUrl && !linkUrl) {
        return null;
      }

      return {
        id: itemId(item.id),
        year,
        title,
        description,
        detailContent,
        imageUrl,
        linkUrl,
        type,
        enabled: item.enabled !== false,
        sortOrder,
      };
    })
    .filter((item): item is HistoryMilestoneItem => Boolean(item));
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
  const trustSections = normalizeTrustSections(source.trustSections);
  const hasHistoryMilestones = Array.isArray(source.historyMilestones);
  const hasLegacyTrustSections = Array.isArray(source.trustSections);
  const legacyHistoryMilestones = hasLegacyTrustSections
    ? buildHistoryMilestonesFromTrustSections(trustSections)
    : [];

  return {
    press: normalizePress(source.press),
    feedback: normalizeFeedback(source.feedback),
    videos: normalizeVideos(source.videos),
    pageAssets: withDefaultPageAssets(pageAssets),
    trustSections,
    historyMilestones: hasHistoryMilestones
      ? normalizeHistoryMilestones(source.historyMilestones)
      : legacyHistoryMilestones.length > 0
        ? legacyHistoryMilestones
        : DEFAULT_MARKETING_CONFIG.historyMilestones,
  };
}
