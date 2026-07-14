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

export type HomeTextItem = {
  id: string;
  key: string;
  group: string;
  label: string;
  value: string;
  multiline: boolean;
  sortOrder: number;
};

export type HomeSectionItem = {
  id: string;
  key: "hero_products" | "process" | "brand_story";
  label: string;
  description: string;
  enabled: boolean;
  sortOrder: number;
};

export type HomeNewsItem = {
  id: string;
  title: string;
  description: string;
  label: string;
  imageUrl: string;
  linkUrl: string;
  enabled: boolean;
  sortOrder: number;
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

export type CommunityActivityItem = {
  id: string;
  title: string;
  description: string;
  iconKey: "heart" | "users" | "message" | "hand";
  tone: "red" | "blue" | "orange" | "green";
  imageUrl: string;
  linkUrl: string;
  enabled: boolean;
  sortOrder: number;
};

export type MarketingConfigData = {
  press: PressItem[];
  feedback: FeedbackItem[];
  videos: VideoItem[];
  homeTexts: HomeTextItem[];
  homeSections: HomeSectionItem[];
  homeNewsItems: HomeNewsItem[];
  pageAssets: PageAssetItem[];
  trustSections: TrustSectionItem[];
  historyMilestones: HistoryMilestoneItem[];
  communityActivities: CommunityActivityItem[];
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
    id: "default-home-cta-image",
    key: "home_cta_image",
    label: "Ảnh CTA cuối trang chủ",
    imageUrl: "/hero/chan-ga-plate.png",
    linkUrl: "/san-pham",
  },
  {
    id: "default-home-factory-proof-1",
    key: "home_factory_proof_1",
    label: "Nguyên liệu được chọn lọc theo nguồn rõ ràng, ghi nhận thông tin và kiểm tra trước khi đưa vào sản xuất.",
    imageUrl: "/hero/chan-ga-plate.png",
    linkUrl: "/chat-luong/nha-may-quy-trinh-san-xuat",
  },
  {
    id: "default-home-factory-proof-2",
    key: "home_factory_proof_2",
    label: "Khu sơ chế, chế biến và đóng gói được trình bày bằng hình ảnh thực tế để khách hàng hiểu cách sản phẩm được làm ra.",
    imageUrl: "/bento/bento-factory.png",
    linkUrl: "/chat-luong/nha-may-quy-trinh-san-xuat",
  },
  {
    id: "default-home-factory-proof-3",
    key: "home_factory_proof_3",
    label: "Bao bì, tem nhãn và thông tin sản phẩm được chuẩn hóa để dễ nhận diện, dễ bảo quản và phù hợp phân phối toàn quốc.",
    imageUrl: "/hero/chan-ga-poster.png",
    linkUrl: "/san-pham",
  },
  {
    id: "default-home-factory-proof-4",
    key: "home_factory_proof_4",
    label: "Bảo hiểm PVI, giấy chứng nhận và hồ sơ liên quan giúp khách hàng có cơ sở kiểm chứng trước khi lựa chọn.",
    imageUrl: "/bento/bento-insurance.png",
    linkUrl: "/gioi-thieu/thanh-tuu",
  },
  {
    id: "default-home-factory-proof-5",
    key: "home_factory_proof_5",
    label: "Các nội dung báo chí và truyền thông được gom lại để kể câu chuyện thương hiệu bằng nguồn tham chiếu rõ ràng.",
    imageUrl: "/bento/bento-tiktok.png",
    linkUrl: "/tin-tuc",
  },
  {
    id: "default-about-process-background",
    key: "about_process_background",
    label: "Ảnh nền khu sản xuất phần giới thiệu",
    imageUrl: "/bento/bento-factory.png",
    linkUrl: "/chat-luong/nha-may-quy-trinh-san-xuat",
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
    linkUrl: "/chat-luong/nha-may-quy-trinh-san-xuat",
  },
  {
    id: "default-about-process-factory",
    key: "about_process_factory",
    label: "Nhà máy",
    imageUrl: "/bento/bento-factory.png",
    linkUrl: "/chat-luong/nha-may-quy-trinh-san-xuat",
  },
  {
    id: "default-about-process-packaging",
    key: "about_process_packaging",
    label: "Đóng gói",
    imageUrl: "/bento/bento-tiktok.png",
    linkUrl: "/chat-luong/nha-may-quy-trinh-san-xuat",
  },
  {
    id: "default-about-process-distribution",
    key: "about_process_distribution",
    label: "Phân phối",
    imageUrl: "/bento/bento-insurance.png",
    linkUrl: "/diem-ban",
  },
  {
    id: "default-process-farm",
    key: "process_farm",
    label: "Nguyên liệu đầu vào",
    imageUrl: "/bento/bento-ingredients.png",
    linkUrl: "/chat-luong/nha-may-quy-trinh-san-xuat",
  },
  {
    id: "default-process-inspect",
    key: "process_inspect",
    label: "Kiểm định nguyên liệu",
    imageUrl: "/bento/bento-insurance.png",
    linkUrl: "/chat-luong/nha-may-quy-trinh-san-xuat",
  },
  {
    id: "default-process-cooking",
    key: "process_cooking",
    label: "Sơ chế và chế biến",
    imageUrl: "/hero/chan-ga-plate.png",
    linkUrl: "/chat-luong/nha-may-quy-trinh-san-xuat",
  },
  {
    id: "default-process-qc",
    key: "process_qc",
    label: "Kiểm soát chất lượng",
    imageUrl: "/bento/bento-insurance.png",
    linkUrl: "/chat-luong/nha-may-quy-trinh-san-xuat",
  },
  {
    id: "default-process-packaging",
    key: "process_packaging",
    label: "Đóng gói",
    imageUrl: "/bento/bento-tiktok.png",
    linkUrl: "/chat-luong/nha-may-quy-trinh-san-xuat",
  },
  {
    id: "default-process-delivery",
    key: "process_delivery",
    label: "Giao hàng và phân phối",
    imageUrl: "/hero/chan-ga-poster.png",
    linkUrl: "/diem-ban",
  },
  {
    id: "default-process-factory",
    key: "process_factory",
    label: "Khu vực nhà máy",
    imageUrl: "/bento/bento-factory.png",
    linkUrl: "/chat-luong/nha-may-quy-trinh-san-xuat",
  },
  {
    id: "default-process-documents",
    key: "process_documents",
    label: "Hồ sơ và chứng từ",
    imageUrl: "/bento/bento-insurance.png",
    linkUrl: "/gioi-thieu",
  },
];

export const DEFAULT_HOME_TEXTS: HomeTextItem[] = [
  { id: "home-text-factory-proof-1-title", key: "factory_proof_1_title", group: "Trang chủ - Bằng chứng nhà máy", label: "Bằng chứng 1 - tên mục", value: "Nguyên liệu đầu vào", multiline: false, sortOrder: 70 },
  { id: "home-text-factory-proof-2-title", key: "factory_proof_2_title", group: "Trang chủ - Bằng chứng nhà máy", label: "Bằng chứng 2 - tên mục", value: "Quy trình sản xuất", multiline: false, sortOrder: 80 },
  { id: "home-text-factory-proof-3-title", key: "factory_proof_3_title", group: "Trang chủ - Bằng chứng nhà máy", label: "Bằng chứng 3 - tên mục", value: "Đóng gói - tem nhãn", multiline: false, sortOrder: 90 },
  { id: "home-text-factory-proof-4-title", key: "factory_proof_4_title", group: "Trang chủ - Bằng chứng nhà máy", label: "Bằng chứng 4 - tên mục", value: "Bảo chứng niềm tin", multiline: false, sortOrder: 100 },
  { id: "home-text-factory-proof-5-title", key: "factory_proof_5_title", group: "Trang chủ - Bằng chứng nhà máy", label: "Bằng chứng 5 - tên mục", value: "Báo chí / truyền thông", multiline: false, sortOrder: 105 },
  { id: "home-text-factory-card-label", key: "factory_card_label", group: "Trang chủ - Bằng chứng nhà máy", label: "Nhãn ảnh nhà máy", value: "Nhà máy / khu sản xuất", multiline: false, sortOrder: 10 },
  { id: "home-text-factory-card-title", key: "factory_card_title", group: "Trang chủ - Bằng chứng nhà máy", label: "Tiêu đề ảnh nhà máy", value: "Không gian sản xuất được kiểm soát", multiline: false, sortOrder: 20 },
  { id: "home-text-factory-card-description", key: "factory_card_description", group: "Trang chủ - Bằng chứng nhà máy", label: "Mô tả ảnh nhà máy", value: "Đưa hình ảnh nhà máy thật vào đây sẽ làm website giống công ty thực phẩm hơn rất nhiều so với nền tối và hiệu ứng glow.", multiline: true, sortOrder: 30 },
  { id: "home-text-factory-section-label", key: "factory_section_label", group: "Trang chủ - Bằng chứng nhà máy", label: "Nhãn cụm bên phải", value: "Bằng chứng thương hiệu", multiline: false, sortOrder: 40 },
  { id: "home-text-factory-section-title", key: "factory_section_title", group: "Trang chủ - Bằng chứng nhà máy", label: "Tiêu đề cụm bên phải", value: "Năng lực sản xuất rõ ràng trước khi nói về bán hàng", multiline: true, sortOrder: 50 },
  { id: "home-text-factory-section-description", key: "factory_section_description", group: "Trang chủ - Bằng chứng nhà máy", label: "Mô tả cụm bên phải", value: "Những bằng chứng giúp khách hàng yên tâm lựa chọn Ăn Cùng Bà Tuyết.", multiline: true, sortOrder: 60 },
  { id: "home-text-process-label", key: "process_label", group: "Trang chủ - Quy trình sản xuất", label: "Nhãn quy trình", value: "Quy trình sản xuất", multiline: false, sortOrder: 100 },
  { id: "home-text-process-title", key: "process_title", group: "Trang chủ - Quy trình sản xuất", label: "Tiêu đề quy trình", value: "Từ nguyên liệu đến sản phẩm đóng gói", multiline: true, sortOrder: 110 },
  { id: "home-text-process-description", key: "process_description", group: "Trang chủ - Quy trình sản xuất", label: "Mô tả quy trình", value: "Bố cục quy trình giúp người xem hiểu đây là doanh nghiệp sản xuất thực phẩm, không chỉ là shop bán hàng hoặc landing page quảng cáo.", multiline: true, sortOrder: 120 },
  { id: "home-text-process-step-1-title", key: "process_step_1_title", group: "Trang chủ - Quy trình sản xuất", label: "Bước 01 - tiêu đề", value: "Chọn nguyên liệu", multiline: false, sortOrder: 130 },
  { id: "home-text-process-step-1-description", key: "process_step_1_description", group: "Trang chủ - Quy trình sản xuất", label: "Bước 01 - mô tả", value: "Ưu tiên nguồn rõ ràng, kiểm tra đầu vào trước khi sản xuất.", multiline: true, sortOrder: 140 },
  { id: "home-text-process-step-2-title", key: "process_step_2_title", group: "Trang chủ - Quy trình sản xuất", label: "Bước 02 - tiêu đề", value: "Sơ chế và sản xuất", multiline: false, sortOrder: 150 },
  { id: "home-text-process-step-2-description", key: "process_step_2_description", group: "Trang chủ - Quy trình sản xuất", label: "Bước 02 - mô tả", value: "Kiểm soát từng công đoạn để giữ chất lượng ổn định giữa các lô hàng.", multiline: true, sortOrder: 160 },
  { id: "home-text-process-step-3-title", key: "process_step_3_title", group: "Trang chủ - Quy trình sản xuất", label: "Bước 03 - tiêu đề", value: "Đóng gói và tem nhãn", multiline: false, sortOrder: 170 },
  { id: "home-text-process-step-3-description", key: "process_step_3_description", group: "Trang chủ - Quy trình sản xuất", label: "Bước 03 - mô tả", value: "Bao bì rõ thông tin, dễ vận chuyển, dễ trưng bày và phù hợp bán online.", multiline: true, sortOrder: 180 },
  { id: "home-text-process-step-4-title", key: "process_step_4_title", group: "Trang chủ - Quy trình sản xuất", label: "Bước 04 - tiêu đề", value: "Giao hàng toàn quốc", multiline: false, sortOrder: 190 },
  { id: "home-text-process-step-4-description", key: "process_step_4_description", group: "Trang chủ - Quy trình sản xuất", label: "Bước 04 - mô tả", value: "Kết nối sàn thương mại điện tử để khách đặt hàng nhanh và thuận tiện.", multiline: true, sortOrder: 200 },
  { id: "home-text-brand-story-label", key: "brand_story_label", group: "Trang chủ - Câu chuyện thương hiệu", label: "Nhãn câu chuyện", value: "Câu chuyện thương hiệu", multiline: false, sortOrder: 300 },
  { id: "home-text-brand-story-title", key: "brand_story_title", group: "Trang chủ - Câu chuyện thương hiệu", label: "Tiêu đề câu chuyện", value: "Từ món ăn quen thuộc đến thương hiệu có quy trình", multiline: true, sortOrder: 310 },
  { id: "home-text-brand-story-description", key: "brand_story_description", group: "Trang chủ - Câu chuyện thương hiệu", label: "Mô tả câu chuyện", value: "Từ một căn bếp nhỏ với công thức gia truyền, Ăn Cùng Bà Tuyết đã phát triển thành thương hiệu ăn vặt có xưởng sản xuất riêng, quy trình kiểm soát chất lượng rõ ràng và hàng triệu khách hàng tin dùng.", multiline: true, sortOrder: 320 },
  { id: "home-text-brand-story-cta", key: "brand_story_cta", group: "Trang chủ - Câu chuyện thương hiệu", label: "Nút câu chuyện", value: "Đọc toàn bộ câu chuyện", multiline: false, sortOrder: 330 },
  { id: "home-text-brand-story-milestone-1-year", key: "brand_story_milestone_1_year", group: "Trang chủ - Câu chuyện thương hiệu", label: "Mốc 1 - năm", value: "2022", multiline: false, sortOrder: 340 },
  { id: "home-text-brand-story-milestone-1-event", key: "brand_story_milestone_1_event", group: "Trang chủ - Câu chuyện thương hiệu", label: "Mốc 1 - nội dung", value: "Bắt đầu từ đam mê ẩm thực và các nội dung gần gũi với cộng đồng.", multiline: true, sortOrder: 350 },
  { id: "home-text-brand-story-milestone-2-year", key: "brand_story_milestone_2_year", group: "Trang chủ - Câu chuyện thương hiệu", label: "Mốc 2 - năm", value: "2023", multiline: false, sortOrder: 360 },
  { id: "home-text-brand-story-milestone-2-event", key: "brand_story_milestone_2_event", group: "Trang chủ - Câu chuyện thương hiệu", label: "Mốc 2 - nội dung", value: "Phát triển thương hiệu Ăn Cùng Bà Tuyết với định hướng đồ ăn vặt sạch.", multiline: true, sortOrder: 370 },
  { id: "home-text-brand-story-milestone-3-year", key: "brand_story_milestone_3_year", group: "Trang chủ - Câu chuyện thương hiệu", label: "Mốc 3 - năm", value: "2024", multiline: false, sortOrder: 380 },
  { id: "home-text-brand-story-milestone-3-event", key: "brand_story_milestone_3_event", group: "Trang chủ - Câu chuyện thương hiệu", label: "Mốc 3 - nội dung", value: "Mở rộng trên TikTok Shop, xây dựng cộng đồng khách hàng trung thành.", multiline: true, sortOrder: 390 },
  { id: "home-text-brand-story-milestone-4-year", key: "brand_story_milestone_4_year", group: "Trang chủ - Câu chuyện thương hiệu", label: "Mốc 4 - năm", value: "2025", multiline: false, sortOrder: 400 },
  { id: "home-text-brand-story-milestone-4-event", key: "brand_story_milestone_4_event", group: "Trang chủ - Câu chuyện thương hiệu", label: "Mốc 4 - nội dung", value: "Đẩy mạnh nhà máy, quy trình và tiêu chuẩn hóa sản phẩm.", multiline: true, sortOrder: 410 },
  { id: "home-text-trust-section-label", key: "trust_section_label", group: "Trang chủ - Sứ mệnh", label: "Nhãn sứ mệnh", value: "Sứ mệnh", multiline: false, sortOrder: 500 },
  { id: "home-text-trust-section-title", key: "trust_section_title", group: "Trang chủ - Sứ mệnh", label: "Tiêu đề sứ mệnh", value: "Thay đổi định kiến về ăn vặt", multiline: true, sortOrder: 510 },
  { id: "home-text-trust-section-description", key: "trust_section_description", group: "Trang chủ - Sứ mệnh", label: "Mô tả sứ mệnh", value: "Ăn vặt ngon hơn khi khách hàng biết rõ nguyên liệu, quy trình và bằng chứng phía sau sản phẩm.", multiline: true, sortOrder: 520 },
  { id: "home-text-trust-item-1-title", key: "trust_item_1_title", group: "Trang chủ - Sứ mệnh", label: "Ô sứ mệnh 1 - tiêu đề", value: "Kiểm soát đầu vào", multiline: false, sortOrder: 530 },
  { id: "home-text-trust-item-1-description", key: "trust_item_1_description", group: "Trang chủ - Sứ mệnh", label: "Ô sứ mệnh 1 - mô tả", value: "Nguyên liệu được chọn lọc theo nguồn rõ ràng và kiểm tra trước khi đưa vào sản xuất.", multiline: true, sortOrder: 540 },
  { id: "home-text-trust-item-2-title", key: "trust_item_2_title", group: "Trang chủ - Sứ mệnh", label: "Ô sứ mệnh 2 - tiêu đề", value: "Quy trình sản xuất rõ ràng", multiline: false, sortOrder: 550 },
  { id: "home-text-trust-item-2-description", key: "trust_item_2_description", group: "Trang chủ - Sứ mệnh", label: "Ô sứ mệnh 2 - mô tả", value: "Các công đoạn được sắp xếp rõ ràng để giữ chất lượng ổn định giữa từng lô sản phẩm.", multiline: true, sortOrder: 560 },
  { id: "home-text-trust-item-3-title", key: "trust_item_3_title", group: "Trang chủ - Sứ mệnh", label: "Ô sứ mệnh 3 - tiêu đề", value: "Đóng gói và tem nhãn", multiline: false, sortOrder: 570 },
  { id: "home-text-trust-item-3-description", key: "trust_item_3_description", group: "Trang chủ - Sứ mệnh", label: "Ô sứ mệnh 3 - mô tả", value: "Bao bì thể hiện thông tin sản phẩm, thương hiệu và quy cách sử dụng.", multiline: true, sortOrder: 580 },
  { id: "home-text-trust-item-4-title", key: "trust_item_4_title", group: "Trang chủ - Sứ mệnh", label: "Ô sứ mệnh 4 - tiêu đề", value: "Bảo chứng niềm tin", multiline: false, sortOrder: 590 },
  { id: "home-text-trust-item-4-description", key: "trust_item_4_description", group: "Trang chủ - Sứ mệnh", label: "Ô sứ mệnh 4 - mô tả", value: "Bảo hiểm, giấy chứng nhận và hồ sơ liên quan giúp khách hàng có thêm cơ sở kiểm chứng.", multiline: true, sortOrder: 600 },
  { id: "about-hero-label", key: "about_hero_label", group: "Giới thiệu - Hero hồ sơ thương hiệu", label: "Nhãn nhỏ", value: "Hồ sơ thương hiệu", multiline: false, sortOrder: 601 },
  { id: "about-hero-title", key: "about_hero_title", group: "Giới thiệu - Hero hồ sơ thương hiệu", label: "Tiêu đề lớn", value: "Hồ sơ thương hiệu Ăn Cùng Bà Tuyết", multiline: true, sortOrder: 602 },
  { id: "about-hero-description", key: "about_hero_description", group: "Giới thiệu - Hero hồ sơ thương hiệu", label: "Mô tả", value: "Ăn Cùng Bà Tuyết là thương hiệu đồ ăn vặt Việt Nam được xây dựng từ những nội dung ẩm thực gần gũi, hướng đến các sản phẩm có nguồn gốc rõ ràng, được sản xuất theo quy trình và phân phối rộng rãi trên toàn quốc.", multiline: true, sortOrder: 603 },
  { id: "about-hero-primary-text", key: "about_hero_primary_text", group: "Giới thiệu - Hero hồ sơ thương hiệu", label: "Nút chính - chữ", value: "Xem sản phẩm", multiline: false, sortOrder: 604 },
  { id: "about-hero-primary-link", key: "about_hero_primary_link", group: "Giới thiệu - Hero hồ sơ thương hiệu", label: "Nút chính - link", value: "/san-pham", multiline: false, sortOrder: 605 },
  { id: "about-hero-secondary-text", key: "about_hero_secondary_text", group: "Giới thiệu - Hero hồ sơ thương hiệu", label: "Nút phụ - chữ", value: "Xem chất lượng & quy trình", multiline: false, sortOrder: 606 },
  { id: "about-hero-secondary-link", key: "about_hero_secondary_link", group: "Giới thiệu - Hero hồ sơ thương hiệu", label: "Nút phụ - link", value: "/chat-luong", multiline: false, sortOrder: 607 },
  { id: "about-hero-stat-1-value", key: "about_hero_stat_1_value", group: "Giới thiệu - Hero hồ sơ thương hiệu", label: "Số liệu 1 - giá trị", value: "Cần cập nhật", multiline: false, sortOrder: 608 },
  { id: "about-hero-stat-1-label", key: "about_hero_stat_1_label", group: "Giới thiệu - Hero hồ sơ thương hiệu", label: "Số liệu 1 - mô tả", value: "Doanh thu thương mại điện tử năm 2025.", multiline: true, sortOrder: 609 },
  { id: "about-hero-stat-2-value", key: "about_hero_stat_2_value", group: "Giới thiệu - Hero hồ sơ thương hiệu", label: "Số liệu 2 - giá trị", value: "Cần cập nhật", multiline: false, sortOrder: 610 },
  { id: "about-hero-stat-2-label", key: "about_hero_stat_2_label", group: "Giới thiệu - Hero hồ sơ thương hiệu", label: "Số liệu 2 - mô tả", value: "Sản phẩm đã bán ra trên các kênh phân phối.", multiline: true, sortOrder: 611 },
  { id: "about-hero-stat-3-value", key: "about_hero_stat_3_value", group: "Giới thiệu - Hero hồ sơ thương hiệu", label: "Số liệu 3 - giá trị", value: "Cần cập nhật", multiline: false, sortOrder: 612 },
  { id: "about-hero-stat-3-label", key: "about_hero_stat_3_label", group: "Giới thiệu - Hero hồ sơ thương hiệu", label: "Số liệu 3 - mô tả", value: "Người theo dõi trên các nền tảng mạng xã hội.", multiline: true, sortOrder: 613 },
  { id: "about-text-story-label", key: "about_story_label", group: "Giới thiệu - Câu chuyện thương hiệu", label: "Nhãn câu chuyện", value: "Câu chuyện thương hiệu", multiline: false, sortOrder: 620 },
  { id: "about-text-story-title", key: "about_story_title", group: "Giới thiệu - Câu chuyện thương hiệu", label: "Tiêu đề câu chuyện", value: "Tôi cũng có một nỗi sợ.", multiline: true, sortOrder: 603 },
  { id: "about-text-story-subtitle", key: "about_story_subtitle", group: "Giới thiệu - Câu chuyện thương hiệu", label: "Mô tả ngắn", value: "Hành trình của Chân Gà Bà Tuyết bắt đầu từ nỗi sợ rất thật của một người mẹ, một người bà: sợ những sản phẩm không rõ nguồn gốc, và mong muốn làm ra thứ gì đó minh bạch hơn.", multiline: true, sortOrder: 604 },
  { id: "about-text-story-full", key: "about_story_full", group: "Giới thiệu - Câu chuyện thương hiệu", label: "Toàn bộ câu chuyện trong popup", value: "Tôi cũng có một nỗi sợ.\n\nMột nỗi sợ giống như rất nhiều người tiêu dùng khác: sợ chân gà không rõ nguồn gốc. Sợ những sản phẩm bị gắn với cái tên “chân gà Trung Quốc”.\n\nTôi là một người mẹ, cũng là một người bà. Làm sao tôi có thể để con cháu mình ăn những sản phẩm mà không biết chúng đến từ đâu, được sản xuất như thế nào và có thực sự bảo đảm an toàn hay không?\n\nBởi sức khỏe của các con, các cháu hôm nay cũng chính là tương lai của chúng sau này.\n\nNhưng nỗi ám ảnh mang tên “chân gà Trung Quốc” đã ăn sâu vào suy nghĩ của nhiều người. Đến mức dù tôi có làm thật, nói thật và công khai mọi thứ, vẫn có người không tin.\n\nNgười ta nghi ngờ. Người ta chỉ trích. Người ta để lại những bình luận cay nghiệt và lan truyền những tin đồn không có căn cứ về Chân Gà Bà Tuyết.\n\nSức ép từ dư luận, chỉ có thể diễn tả bằng hai chữ: Khủng khiếp.\n\nCó những ngày tôi ngồi đọc từng bình luận ác ý, từng lời phủ nhận mọi công sức mà mình đã bỏ ra. Tôi thấy mệt mỏi. Tôi thấy tủi thân. Và dường như tôi già đi sau mỗi đêm mất ngủ.\n\nTôi biết con đường mình lựa chọn chưa bao giờ là dễ dàng. Làm tốt vẫn có thể bị nói. Làm đúng vẫn có thể bị nghi ngờ.\n\nCó những lúc tôi không thể chịu đựng thêm được nữa. Tôi đã từng muốn nói: “Hay là mình dừng lại thôi.”\n\nNhưng rồi tôi lại tự hỏi: Nếu ai cũng sợ hãi và bỏ cuộc, vậy ai sẽ là người đứng lên để xóa bỏ nỗi sợ ấy?\n\nChính vì vậy, tôi quyết định tiếp tục.\n\nTôi tin rằng nơi này sẽ tạo ra những sản phẩm có nguồn gốc rõ ràng, quy trình sản xuất minh bạch và chất lượng được kiểm soát nghiêm túc.\n\nTôi tin rằng nơi này không chỉ tạo ra những gói chân gà ngon, mà còn tạo thêm công ăn việc làm ổn định cho bà con tại Thái Nguyên.\n\nTôi tin rằng nơi này sẽ đóng góp một phần nhỏ bé vào hành trình xây dựng và phát triển quê hương. Và tôi tin rằng nơi này sẽ từng bước đưa Thái Nguyên lên bản đồ ăn vặt Việt Nam.\n\nTôi không mong mọi người tin tôi chỉ bằng những lời tôi nói.\n\nTôi mong mọi người hãy nhìn vào những gì chúng tôi đang làm. Hãy nhìn vào nhà máy. Hãy nhìn vào nguyên liệu. Hãy nhìn vào quy trình sản xuất. Và hãy nhìn vào từng sản phẩm được làm ra mỗi ngày.\n\nHãy để tôi và những con người tại đây từng bước xóa đi nỗi sợ mang tên: “Chân gà Trung Quốc.”\n\nĐể khi cầm trên tay một gói Chân Gà Bà Tuyết, mọi người không chỉ cảm nhận được vị ngon, mà còn cảm nhận được sự minh bạch, trách nhiệm và niềm tự hào của một sản phẩm được làm nên tại Thái Nguyên.\n\nCHÂN GÀ BÀ TUYẾT\nNgon phải rõ nguồn gốc – Ăn phải thật an tâm.", multiline: true, sortOrder: 605 },
  { id: "about-text-process-label", key: "about_process_label", group: "Giới thiệu - Quy trình vận hành", label: "Nhãn quy trình", value: "Quy trình vận hành", multiline: false, sortOrder: 610 },
  { id: "about-text-process-title", key: "about_process_title", group: "Giới thiệu - Quy trình vận hành", label: "Tiêu đề quy trình", value: "Quy trình sản xuất bài bản & an toàn", multiline: true, sortOrder: 611 },
  { id: "about-text-process-description", key: "about_process_description", group: "Giới thiệu - Quy trình vận hành", label: "Mô tả quy trình", value: "Từ nguyên liệu, xưởng sản xuất, đóng gói đến phân phối, mọi thông tin đều hướng tới sự minh bạch và dễ kiểm chứng.", multiline: true, sortOrder: 612 },
  { id: "about-text-process-step-1-title", key: "about_process_step_1_title", group: "Giới thiệu - Quy trình vận hành", label: "Thẻ 1 - tiêu đề", value: "Chọn nguyên liệu", multiline: false, sortOrder: 613 },
  { id: "about-text-process-step-1-description", key: "about_process_step_1_description", group: "Giới thiệu - Quy trình vận hành", label: "Thẻ 1 - mô tả", value: "Ưu tiên nguồn đầu vào rõ ràng, phù hợp tiêu chuẩn chế biến và kiểm soát chất lượng trước khi đưa vào sản xuất.", multiline: true, sortOrder: 614 },
  { id: "about-text-process-step-2-title", key: "about_process_step_2_title", group: "Giới thiệu - Quy trình vận hành", label: "Thẻ 2 - tiêu đề", value: "Sản xuất tại xưởng", multiline: false, sortOrder: 615 },
  { id: "about-text-process-step-2-description", key: "about_process_step_2_description", group: "Giới thiệu - Quy trình vận hành", label: "Thẻ 2 - mô tả", value: "Quy trình được tổ chức theo từng khu vực để giữ độ ổn định, hạn chế rủi ro và đảm bảo năng suất.", multiline: true, sortOrder: 616 },
  { id: "about-text-process-step-3-title", key: "about_process_step_3_title", group: "Giới thiệu - Quy trình vận hành", label: "Thẻ 3 - tiêu đề", value: "Đóng gói chỉn chu", multiline: false, sortOrder: 617 },
  { id: "about-text-process-step-3-description", key: "about_process_step_3_description", group: "Giới thiệu - Quy trình vận hành", label: "Thẻ 3 - mô tả", value: "Bao bì được chuẩn hóa để sản phẩm dễ vận chuyển, dễ nhận diện và giữ được trải nghiệm tốt khi đến tay khách.", multiline: true, sortOrder: 618 },
  { id: "about-text-process-step-4-title", key: "about_process_step_4_title", group: "Giới thiệu - Quy trình vận hành", label: "Thẻ 4 - tiêu đề", value: "Phân phối toàn quốc", multiline: false, sortOrder: 619 },
  { id: "about-text-process-step-4-description", key: "about_process_step_4_description", group: "Giới thiệu - Quy trình vận hành", label: "Thẻ 4 - mô tả", value: "Kết nối các sàn thương mại điện tử và hệ thống vận chuyển để khách hàng đặt mua thuận tiện hơn.", multiline: true, sortOrder: 620 },
  { id: "about-text-business-label", key: "about_business_label", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Nhãn cụm", value: "Thông tin doanh nghiệp", multiline: false, sortOrder: 621 },
  { id: "about-text-business-title", key: "about_business_title", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Tiêu đề cụm", value: "Thông tin thương hiệu và đơn vị sản xuất", multiline: true, sortOrder: 622 },
  { id: "about-text-business-description", key: "about_business_description", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Mô tả cụm", value: "Những thông tin cơ bản giúp khách hàng, đối tác và các đơn vị truyền thông có thể kiểm chứng rõ hơn về thương hiệu Ăn Cùng Bà Tuyết.", multiline: true, sortOrder: 623 },
  { id: "about-text-business-1-label", key: "about_business_1_label", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Dòng 1 - nhãn", value: "Tên thương hiệu", multiline: false, sortOrder: 624 },
  { id: "about-text-business-1-value", key: "about_business_1_value", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Dòng 1 - nội dung", value: "Ăn Cùng Bà Tuyết", multiline: false, sortOrder: 625 },
  { id: "about-text-business-2-label", key: "about_business_2_label", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Dòng 2 - nhãn", value: "Tên viết tắt", multiline: false, sortOrder: 626 },
  { id: "about-text-business-2-value", key: "about_business_2_value", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Dòng 2 - nội dung", value: "ACBT", multiline: false, sortOrder: 627 },
  { id: "about-text-business-3-label", key: "about_business_3_label", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Dòng 3 - nhãn", value: "Pháp nhân sản xuất", multiline: false, sortOrder: 628 },
  { id: "about-text-business-3-value", key: "about_business_3_value", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Dòng 3 - nội dung", value: "NMV Food", multiline: false, sortOrder: 629 },
  { id: "about-text-business-4-label", key: "about_business_4_label", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Dòng 4 - nhãn", value: "Người sáng lập", multiline: false, sortOrder: 630 },
  { id: "about-text-business-4-value", key: "about_business_4_value", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Dòng 4 - nội dung", value: "Đỗ Thị Tuyết", multiline: false, sortOrder: 631 },
  { id: "about-text-business-5-label", key: "about_business_5_label", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Dòng 5 - nhãn", value: "Năm hình thành thương hiệu", multiline: false, sortOrder: 632 },
  { id: "about-text-business-5-value", key: "about_business_5_value", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Dòng 5 - nội dung", value: "Cần xác nhận", multiline: false, sortOrder: 633 },
  { id: "about-text-business-6-label", key: "about_business_6_label", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Dòng 6 - nhãn", value: "Trụ sở/Văn phòng", multiline: false, sortOrder: 634 },
  { id: "about-text-business-6-value", key: "about_business_6_value", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Dòng 6 - nội dung", value: "Xuân Phương, Hà Nội", multiline: false, sortOrder: 635 },
  { id: "about-text-business-7-label", key: "about_business_7_label", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Dòng 7 - nhãn", value: "Nhà máy sản xuất", multiline: false, sortOrder: 636 },
  { id: "about-text-business-7-value", key: "about_business_7_value", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Dòng 7 - nội dung", value: "Nhà máy NMV Food tại Thái Nguyên", multiline: false, sortOrder: 637 },
  { id: "about-text-business-8-label", key: "about_business_8_label", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Dòng 8 - nhãn", value: "Địa chỉ chi tiết nhà máy", multiline: false, sortOrder: 638 },
  { id: "about-text-business-8-value", key: "about_business_8_value", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Dòng 8 - nội dung", value: "Cần xác nhận", multiline: false, sortOrder: 639 },
  { id: "about-text-business-9-label", key: "about_business_9_label", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Dòng 9 - nhãn", value: "Quy mô nhà máy", multiline: false, sortOrder: 640 },
  { id: "about-text-business-9-value", key: "about_business_9_value", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Dòng 9 - nội dung", value: "3.300 m²", multiline: false, sortOrder: 641 },
  { id: "about-text-business-10-label", key: "about_business_10_label", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Dòng 10 - nhãn", value: "Ngành hàng", multiline: false, sortOrder: 642 },
  { id: "about-text-business-10-value", key: "about_business_10_value", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Dòng 10 - nội dung", value: "Đồ ăn vặt chế biến", multiline: false, sortOrder: 643 },
  { id: "about-text-business-11-label", key: "about_business_11_label", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Dòng 11 - nhãn", value: "Kênh phân phối", multiline: false, sortOrder: 644 },
  { id: "about-text-business-11-value", key: "about_business_11_value", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Dòng 11 - nội dung", value: "Hệ thống tạp hóa toàn quốc, TikTok Shop và Shopee", multiline: false, sortOrder: 645 },
  { id: "about-text-business-12-label", key: "about_business_12_label", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Dòng 12 - nhãn", value: "Bảo hiểm sản phẩm", multiline: false, sortOrder: 646 },
  { id: "about-text-business-12-value", key: "about_business_12_value", group: "Giới thiệu - Thông tin doanh nghiệp", label: "Dòng 12 - nội dung", value: "Bảo hiểm trách nhiệm sản phẩm PVI", multiline: false, sortOrder: 647 },
  { id: "about-text-values-label", key: "about_values_label", group: "Giới thiệu - Sứ mệnh và giá trị", label: "Nhãn cụm", value: "Định hướng thương hiệu", multiline: false, sortOrder: 650 },
  { id: "about-text-values-title", key: "about_values_title", group: "Giới thiệu - Sứ mệnh và giá trị", label: "Tiêu đề cụm", value: "Sứ mệnh, tầm nhìn và giá trị cốt lõi.", multiline: true, sortOrder: 651 },
  { id: "about-text-values-description", key: "about_values_description", group: "Giới thiệu - Sứ mệnh và giá trị", label: "Mô tả cụm", value: "Ăn Cùng Bà Tuyết được xây dựng trên nền tảng của sự chân thật: làm sạch, bán thật, phục vụ tử tế và phát triển bền vững.", multiline: true, sortOrder: 652 },
  { id: "about-text-value-1-title", key: "about_value_1_title", group: "Giới thiệu - Sứ mệnh và giá trị", label: "Thẻ 1 - tiêu đề", value: "Sứ mệnh", multiline: false, sortOrder: 653 },
  { id: "about-text-value-1-description", key: "about_value_1_description", group: "Giới thiệu - Sứ mệnh và giá trị", label: "Thẻ 1 - mô tả", value: "Đưa đồ ăn vặt Việt Nam đến gần hơn với người tiêu dùng bằng sản phẩm rõ nguồn gốc, hương vị gần gũi và cách làm minh bạch.", multiline: true, sortOrder: 654 },
  { id: "about-text-value-2-title", key: "about_value_2_title", group: "Giới thiệu - Sứ mệnh và giá trị", label: "Thẻ 2 - tiêu đề", value: "Tầm nhìn", multiline: false, sortOrder: 655 },
  { id: "about-text-value-2-description", key: "about_value_2_description", group: "Giới thiệu - Sứ mệnh và giá trị", label: "Thẻ 2 - mô tả", value: "Trở thành thương hiệu ăn vặt Việt được nhận diện bằng chất lượng ổn định, quy trình bài bản và niềm tin của khách hàng.", multiline: true, sortOrder: 656 },
  { id: "about-text-value-3-title", key: "about_value_3_title", group: "Giới thiệu - Sứ mệnh và giá trị", label: "Thẻ 3 - tiêu đề", value: "Giá trị cốt lõi", multiline: false, sortOrder: 657 },
  { id: "about-text-value-3-description", key: "about_value_3_description", group: "Giới thiệu - Sứ mệnh và giá trị", label: "Thẻ 3 - mô tả", value: "Chân thật trong truyền thông, kỹ trong sản xuất, chỉn chu trong đóng gói và tử tế với từng khách hàng.", multiline: true, sortOrder: 658 },
  { id: "about-text-value-4-title", key: "about_value_4_title", group: "Giới thiệu - Sứ mệnh và giá trị", label: "Thẻ 4 - tiêu đề", value: "Con người", multiline: false, sortOrder: 659 },
  { id: "about-text-value-4-description", key: "about_value_4_description", group: "Giới thiệu - Sứ mệnh và giá trị", label: "Thẻ 4 - mô tả", value: "Đội ngũ sản xuất, kho vận, livestream và chăm sóc khách hàng cùng vận hành thương hiệu từ những công việc cụ thể mỗi ngày.", multiline: true, sortOrder: 660 },
  { id: "home-text-products-section-label", key: "products_section_label", group: "Trang chủ - Sản phẩm", label: "Nhãn sản phẩm", value: "Sản phẩm chủ lực", multiline: false, sortOrder: 700 },
  { id: "home-text-products-section-title", key: "products_section_title", group: "Trang chủ - Sản phẩm", label: "Tiêu đề sản phẩm", value: "Sản phẩm nổi bật", multiline: false, sortOrder: 710 },
  { id: "home-text-products-section-description", key: "products_section_description", group: "Trang chủ - Sản phẩm", label: "Mô tả sản phẩm", value: "Giới thiệu nhanh các dòng sản phẩm chính để khách hàng bấm xem chi tiết ở từng trang riêng.", multiline: true, sortOrder: 720 },
  { id: "home-text-news-section-label", key: "news_section_label", group: "Trang chủ - Tin tức & bằng chứng", label: "Nhãn tin tức", value: "Tin tức & bằng chứng", multiline: false, sortOrder: 800 },
  { id: "home-text-news-section-title", key: "news_section_title", group: "Trang chủ - Tin tức & bằng chứng", label: "Tiêu đề tin tức", value: "Từ sản phẩm thật đến hệ thống phân phối thật", multiline: true, sortOrder: 810 },
  { id: "home-text-news-section-description", key: "news_section_description", group: "Trang chủ - Tin tức & bằng chứng", label: "Mô tả tin tức", value: "Không phải hiệu ứng nào cũng tạo ra giá trị. Khách hàng cần thấy những thứ thật, có bằng chứng, có câu chuyện cụ thể.", multiline: true, sortOrder: 820 },
];

export const DEFAULT_HOME_SECTIONS: HomeSectionItem[] = [
  {
    id: "home-section-hero-products",
    key: "hero_products",
    label: "Sản phẩm đại diện trong hero",
    description: "Ẩn/hiện card sản phẩm đại diện và dãy chọn sản phẩm ở đầu trang chủ.",
    enabled: true,
    sortOrder: 5,
  },
  {
    id: "home-section-process",
    key: "process",
    label: "Quy trình sản xuất",
    description: "Ẩn/hiện cụm Quy trình sản xuất: Từ nguyên liệu đến sản phẩm đóng gói.",
    enabled: true,
    sortOrder: 10,
  },
  {
    id: "home-section-brand-story",
    key: "brand_story",
    label: "Câu chuyện thương hiệu",
    description: "Ẩn/hiện cụm Từ món ăn quen thuộc đến thương hiệu có quy trình.",
    enabled: true,
    sortOrder: 20,
  },
];

export const DEFAULT_HOME_NEWS_ITEMS: HomeNewsItem[] = [
  {
    id: "home-news-1",
    title: "Ăn Cùng Bà Tuyết dẫn đầu TikTok Shop ngành hàng đồ ăn vặt",
    description: "Thông tin nổi bật về thương hiệu, sản phẩm và hoạt động bán hàng.",
    label: "Báo chí",
    imageUrl: "/hero/tam-cay-pack.png",
    linkUrl: "/tin-tuc",
    enabled: true,
    sortOrder: 10,
  },
  {
    id: "home-news-2",
    title: "5 cách biến tấu snack Bánh Tráng Bà Tuyết cực ngon tại nhà",
    description: "Bài viết giới thiệu cách dùng sản phẩm trong các món ăn vặt quen thuộc.",
    label: "Công thức",
    imageUrl: "/hero/banh-trang-rong-bien.png",
    linkUrl: "/tin-tuc",
    enabled: true,
    sortOrder: 20,
  },
  {
    id: "home-news-3",
    title: "Hậu trường: Quy trình chế biến chân gà rút xương sạch sẽ",
    description: "Nội dung giúp khách hàng hiểu rõ hơn về quy trình sản xuất.",
    label: "Hậu trường",
    imageUrl: "/hero/chan-ga-poster.png",
    linkUrl: "/chat-luong/nha-may-quy-trinh-san-xuat",
    enabled: true,
    sortOrder: 30,
  },
  {
    id: "home-news-4",
    title: "Ăn Cùng Bà Tuyết hợp tác Bảo hiểm PVI",
    description: "Thông tin tạo niềm tin về bảo hiểm trách nhiệm sản phẩm cho khách hàng.",
    label: "Thông báo",
    imageUrl: "/bento/bento-insurance.png",
    linkUrl: "/gioi-thieu/thanh-tuu",
    enabled: true,
    sortOrder: 40,
  },
];

export const DEFAULT_MARKETING_CONFIG: MarketingConfigData = {
  press: [],
  feedback: [],
  videos: [],
  homeTexts: DEFAULT_HOME_TEXTS,
  homeSections: DEFAULT_HOME_SECTIONS,
  homeNewsItems: [],
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
      linkUrl: "/diem-ban",
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
      linkUrl: "/chat-luong/nha-may-quy-trinh-san-xuat",
      type: "milestone",
      enabled: true,
      sortOrder: 40,
    },
  ],
  communityActivities: [
    {
      id: "default-community-charity",
      title: "Hoạt động Thiện nguyện",
      description: "Ăn Cùng Bà Tuyết thường xuyên tổ chức các chương trình quyên góp, trao quà vùng cao, hỗ trợ trẻ em nghèo hiếu học và đồng bào gặp hoàn cảnh khó khăn.",
      iconKey: "heart",
      tone: "red",
      imageUrl: "",
      linkUrl: "",
      enabled: true,
      sortOrder: 10,
    },
    {
      id: "default-community-partner",
      title: "Đồng hành cùng đối tác Việt",
      description: "Hợp tác chặt chẽ cùng các nhà xưởng, hợp tác xã nông sản tại địa phương để tạo việc làm bền vững cho người lao động vùng trung du và miền núi.",
      iconKey: "users",
      tone: "blue",
      imageUrl: "",
      linkUrl: "",
      enabled: true,
      sortOrder: 20,
    },
    {
      id: "default-community-live",
      title: "Gắn kết qua Livestream",
      description: "Các phiên phát sóng trực tiếp không chỉ giới thiệu đồ ăn sạch, mà còn là không gian chia sẻ câu chuyện ẩm thực vui vẻ, mang tiếng cười đến mọi gia đình.",
      iconKey: "message",
      tone: "orange",
      imageUrl: "",
      linkUrl: "",
      enabled: true,
      sortOrder: 30,
    },
    {
      id: "default-community-care",
      title: "Tử tế từ những việc nhỏ nhất",
      description: "Lắng nghe góp ý của từng khách hàng, cam kết giải quyết khiếu nại chất lượng nhanh chóng và thỏa đáng để bảo vệ quyền lợi người tiêu dùng.",
      iconKey: "hand",
      tone: "green",
      imageUrl: "",
      linkUrl: "",
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
      linkUrl: "/chat-luong/nha-may-quy-trinh-san-xuat",
      enabled: true,
    },
    {
      id: "default-brand-story",
      key: "brand_story",
      title: "Câu chuyện thương hiệu",
      description: "Hành trình đứng lên trước nỗi sợ chân gà không rõ nguồn gốc và chọn cách trả lời bằng nhà máy, nguyên liệu, quy trình.",
      detailTitle: "Ngon phải rõ nguồn gốc, ăn phải thật an tâm",
      detailContent: "Tôi không mong mọi người tin tôi chỉ bằng những lời tôi nói. Tôi mong mọi người hãy nhìn vào những gì chúng tôi đang làm: nhà máy, nguyên liệu, quy trình sản xuất và từng sản phẩm được làm ra mỗi ngày.",
      imageUrl: "/hero/chan-ga-poster.png",
      linkUrl: "/gioi-thieu/cau-chuyen-thuong-hieu",
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

function normalizeHomeTexts(input: unknown): HomeTextItem[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((item, index) => {
      if (!isRecord(item)) return null;
      const key = stringValue(item.key);
      const group = stringValue(item.group);
      const label = stringValue(item.label);
      const value = stringValue(item.value);
      const sortOrder = Number.isFinite(Number(item.sortOrder))
        ? Number(item.sortOrder)
        : index * 10;

      if (!key && !label && !value) return null;

      return {
        id: itemId(item.id),
        key,
        group,
        label,
        value,
        multiline: item.multiline === true,
        sortOrder,
      };
    })
    .filter((item): item is HomeTextItem => Boolean(item));
}

function normalizeHomeSections(input: unknown): HomeSectionItem[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((item, index) => {
      if (!isRecord(item)) return null;
      const key =
        item.key === "hero_products"
          ? "hero_products"
          : item.key === "brand_story"
            ? "brand_story"
            : item.key === "process"
              ? "process"
              : null;
      const label = stringValue(item.label);
      const description = stringValue(item.description);
      const sortOrder = Number.isFinite(Number(item.sortOrder))
        ? Number(item.sortOrder)
        : index * 10;

      if (!key) return null;

      return {
        id: itemId(item.id),
        key,
        label,
        description,
        enabled: item.enabled !== false,
        sortOrder,
      };
    })
    .filter((item): item is HomeSectionItem => Boolean(item));
}

function normalizeHomeNewsItems(input: unknown): HomeNewsItem[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((item, index) => {
      if (!isRecord(item)) return null;
      const title = stringValue(item.title);
      const description = stringValue(item.description);
      const label = stringValue(item.label);
      const imageUrl = normalizeUploadPublicUrl(stringValue(item.imageUrl));
      const linkUrl = stringValue(item.linkUrl);
      const sortOrder = Number.isFinite(Number(item.sortOrder))
        ? Number(item.sortOrder)
        : index * 10;

      if (!title && !description && !label && !imageUrl && !linkUrl) return null;

      return {
        id: itemId(item.id),
        title,
        description,
        label,
        imageUrl,
        linkUrl,
        enabled: item.enabled !== false,
        sortOrder,
      };
    })
    .filter((item): item is HomeNewsItem => Boolean(item));
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

function normalizeCommunityActivities(input: unknown): CommunityActivityItem[] {
  if (!Array.isArray(input)) return DEFAULT_MARKETING_CONFIG.communityActivities;

  return input
    .map((item, index) => {
      if (!isRecord(item)) return null;
      const title = stringValue(item.title);
      const description = stringValue(item.description);
      const iconKey =
        item.iconKey === "users" || item.iconKey === "message" || item.iconKey === "hand"
          ? item.iconKey
          : "heart";
      const tone =
        item.tone === "blue" || item.tone === "orange" || item.tone === "green" || item.tone === "red"
          ? item.tone
          : "orange";
      const imageUrl = normalizeUploadPublicUrl(stringValue(item.imageUrl));
      const linkUrl = stringValue(item.linkUrl);
      const sortOrder = Number.isFinite(Number(item.sortOrder))
        ? Number(item.sortOrder)
        : index * 10;

      if (!title && !description && !imageUrl && !linkUrl) return null;

      return {
        id: itemId(item.id),
        title,
        description,
        iconKey,
        tone,
        imageUrl,
        linkUrl,
        enabled: item.enabled !== false,
        sortOrder,
      };
    })
    .filter((item): item is CommunityActivityItem => Boolean(item));
}

function withDefaultPageAssets(items: PageAssetItem[]) {
  const byKey = new Map(items.map((item) => [item.key, item]));

  return DEFAULT_PAGE_ASSETS.map((defaultItem) => ({
    ...defaultItem,
    ...(byKey.get(defaultItem.key) || {}),
    id: byKey.get(defaultItem.key)?.id || defaultItem.id,
  })).concat(items.filter((item) => item.key && !DEFAULT_PAGE_ASSETS.some((defaultItem) => defaultItem.key === item.key)));
}

function withDefaultHomeTexts(items: HomeTextItem[]) {
  const byKey = new Map(items.map((item) => [item.key, item]));

  return DEFAULT_HOME_TEXTS.map((defaultItem) => ({
    ...defaultItem,
    ...(byKey.get(defaultItem.key) || {}),
    id: byKey.get(defaultItem.key)?.id || defaultItem.id,
    group: byKey.get(defaultItem.key)?.group || defaultItem.group,
    label: byKey.get(defaultItem.key)?.label || defaultItem.label,
    multiline: byKey.get(defaultItem.key)?.multiline ?? defaultItem.multiline,
    sortOrder: byKey.get(defaultItem.key)?.sortOrder ?? defaultItem.sortOrder,
  })).concat(items.filter((item) => item.key && !DEFAULT_HOME_TEXTS.some((defaultItem) => defaultItem.key === item.key)));
}

function withDefaultHomeSections(items: HomeSectionItem[]) {
  const byKey = new Map(items.map((item) => [item.key, item]));

  return DEFAULT_HOME_SECTIONS.map((defaultItem) => ({
    ...defaultItem,
    ...(byKey.get(defaultItem.key) || {}),
    id: byKey.get(defaultItem.key)?.id || defaultItem.id,
    label: byKey.get(defaultItem.key)?.label || defaultItem.label,
    description: byKey.get(defaultItem.key)?.description || defaultItem.description,
    enabled: byKey.get(defaultItem.key)?.enabled ?? defaultItem.enabled,
    sortOrder: byKey.get(defaultItem.key)?.sortOrder ?? defaultItem.sortOrder,
  })).concat(items.filter((item) => item.key && !DEFAULT_HOME_SECTIONS.some((defaultItem) => defaultItem.key === item.key)));
}

function withDefaultHomeNewsItems(items: HomeNewsItem[]) {
  return items;
}

export function normalizeMarketingConfig(input: unknown): MarketingConfigData {
  const source = isRecord(input) ? input : {};
  const homeTexts = normalizeHomeTexts(source.homeTexts);
  const homeSections = normalizeHomeSections(source.homeSections);
  const homeNewsItems = normalizeHomeNewsItems(source.homeNewsItems);
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
    homeTexts: withDefaultHomeTexts(homeTexts),
    homeSections: withDefaultHomeSections(homeSections),
    homeNewsItems: withDefaultHomeNewsItems(homeNewsItems),
    pageAssets: withDefaultPageAssets(pageAssets),
    trustSections,
    historyMilestones: hasHistoryMilestones
      ? normalizeHistoryMilestones(source.historyMilestones)
      : legacyHistoryMilestones.length > 0
        ? legacyHistoryMilestones
        : DEFAULT_MARKETING_CONFIG.historyMilestones,
    communityActivities: normalizeCommunityActivities(source.communityActivities),
  };
}
