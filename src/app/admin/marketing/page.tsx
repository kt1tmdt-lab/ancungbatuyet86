"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { useAuth } from "@/lib/auth-context";
import { 
  Newspaper, 
  MessageSquare, 
  Video, 
  Plus, 
  Trash2, 
  Save, 
  AlertCircle,
  Star,
  Globe,
  Play,
  Calendar,
  User,
  Settings,
  ShieldCheck,
  Image as ImageIcon,
  ImagePlus,
  Link2,
  Eye,
  ExternalLink,
  X,
  Heart,
  Search
} from "lucide-react";
import toast from "react-hot-toast";
import {
  normalizeMarketingConfig,
  type CommunityActivityItem,
  type FeedbackItem,
  type HistoryMilestoneItem,
  type HomeNewsItem,
  type HomeSectionItem,
  type HomeTextItem,
  type PageAssetItem,
  type PressItem,
  type TrustSectionItem,
  type VideoItem,
} from "@/lib/marketing-config";

const PAGE_ASSET_META: Record<string, { page: string; position: string; note: string; previewPath: string }> = {
  about_video: {
    page: "Giới thiệu",
    position: "Video giới thiệu",
    note: "Dán link YouTube/TikTok hoặc link embed vào ô link.",
    previewPath: "/gioi-thieu#about-video",
  },
  home_factory_proof_image: {
    page: "Trang chủ",
    position: "Ảnh nhà máy lớn",
    note: "Ảnh lớn bên trái trong khối bằng chứng thương hiệu.",
    previewPath: "/#factory-proof",
  },
  home_cta_image: {
    page: "Trang chủ",
    position: "Ảnh CTA cuối trang chủ",
    note: "Ảnh lớn bên phải ở khối kêu gọi tìm hiểu sản phẩm cuối trang chủ.",
    previewPath: "/#home-cta",
  },
  home_factory_proof_1: {
    page: "Trang chủ",
    position: "Bằng chứng 1: Nguyên liệu đầu vào",
    note: "Ảnh, nội dung và link khi bấm mục Nguyên liệu đầu vào.",
    previewPath: "/#factory-proof",
  },
  home_factory_proof_2: {
    page: "Trang chủ",
    position: "Bằng chứng 2: Quy trình sản xuất",
    note: "Ảnh, nội dung và link khi bấm mục Quy trình sản xuất.",
    previewPath: "/#factory-proof",
  },
  home_factory_proof_3: {
    page: "Trang chủ",
    position: "Bằng chứng 3: Đóng gói - tem nhãn",
    note: "Ảnh, nội dung và link khi bấm mục Đóng gói - tem nhãn.",
    previewPath: "/#factory-proof",
  },
  home_factory_proof_4: {
    page: "Trang chủ",
    position: "Bằng chứng 4: Bảo chứng niềm tin",
    note: "Ảnh, nội dung và link khi bấm mục Bảo chứng niềm tin.",
    previewPath: "/#factory-proof",
  },
  home_factory_proof_5: {
    page: "Trang chủ",
    position: "Bằng chứng 5: Báo chí / truyền thông",
    note: "Ảnh, nội dung và link khi bấm mục Báo chí / truyền thông.",
    previewPath: "/#factory-proof",
  },
  about_process_background: {
    page: "Giới thiệu",
    position: "Ảnh nền khu sản xuất",
    note: "Ảnh lớn trong phần nói về năng lực sản xuất.",
    previewPath: "/gioi-thieu#about-process",
  },
  about_gallery_1: { page: "Giới thiệu", position: "Gallery ảnh 1", note: "Ảnh trong lưới giới thiệu thương hiệu.", previewPath: "/gioi-thieu#about-gallery" },
  about_gallery_2: { page: "Giới thiệu", position: "Gallery ảnh 2", note: "Ảnh trong lưới giới thiệu thương hiệu.", previewPath: "/gioi-thieu#about-gallery" },
  about_gallery_3: { page: "Giới thiệu", position: "Gallery ảnh 3", note: "Ảnh trong lưới giới thiệu thương hiệu.", previewPath: "/gioi-thieu#about-gallery" },
  about_gallery_4: { page: "Giới thiệu", position: "Gallery ảnh 4", note: "Ảnh trong lưới giới thiệu thương hiệu.", previewPath: "/gioi-thieu#about-gallery" },
  about_gallery_5: { page: "Giới thiệu", position: "Gallery ảnh 5", note: "Ảnh trong lưới giới thiệu thương hiệu.", previewPath: "/gioi-thieu#about-gallery" },
  about_gallery_6: { page: "Giới thiệu", position: "Gallery ảnh 6", note: "Ảnh trong lưới giới thiệu thương hiệu.", previewPath: "/gioi-thieu#about-gallery" },
  about_team_quote: {
    page: "Giới thiệu",
    position: "Ảnh câu chuyện đội ngũ",
    note: "Ảnh đi cùng phần trích dẫn/câu chuyện thương hiệu.",
    previewPath: "/gioi-thieu#about-team",
  },
  about_process_ingredient: { page: "Giới thiệu", position: "Thẻ quy trình: Nguyên liệu", note: "Ảnh/link của thẻ quy trình.", previewPath: "/gioi-thieu#about-process" },
  about_process_factory: { page: "Giới thiệu", position: "Thẻ quy trình: Nhà máy", note: "Ảnh/link của thẻ quy trình.", previewPath: "/gioi-thieu#about-process" },
  about_process_packaging: { page: "Giới thiệu", position: "Thẻ quy trình: Đóng gói", note: "Ảnh/link của thẻ quy trình.", previewPath: "/gioi-thieu#about-process" },
  about_process_distribution: { page: "Giới thiệu", position: "Thẻ quy trình: Phân phối", note: "Ảnh/link của thẻ quy trình.", previewPath: "/gioi-thieu#about-process" },
  process_farm: { page: "Chất lượng", position: "Nguyên liệu đầu vào", note: "Ảnh/link bước quy trình trong trang Chất lượng.", previewPath: "/chat-luong/nha-may-quy-trinh-san-xuat#process-steps" },
  process_inspect: { page: "Chất lượng", position: "Kiểm định nguyên liệu", note: "Ảnh/link bước quy trình trong trang Chất lượng.", previewPath: "/chat-luong/nha-may-quy-trinh-san-xuat#process-steps" },
  process_cooking: { page: "Chất lượng", position: "Sơ chế và chế biến", note: "Ảnh/link bước quy trình trong trang Chất lượng.", previewPath: "/chat-luong/nha-may-quy-trinh-san-xuat#process-steps" },
  process_qc: { page: "Chất lượng", position: "Kiểm soát chất lượng", note: "Ảnh/link bước quy trình trong trang Chất lượng.", previewPath: "/chat-luong/nha-may-quy-trinh-san-xuat#process-steps" },
  process_packaging: { page: "Chất lượng", position: "Đóng gói", note: "Ảnh/link bước quy trình trong trang Chất lượng.", previewPath: "/chat-luong/nha-may-quy-trinh-san-xuat#process-steps" },
  process_delivery: { page: "Chất lượng", position: "Giao hàng và phân phối", note: "Ảnh/link bước quy trình trong trang Chất lượng.", previewPath: "/chat-luong/nha-may-quy-trinh-san-xuat#process-steps" },
  process_factory: { page: "Chất lượng", position: "Khu vực nhà máy", note: "Ảnh/link phần nhà máy trong trang Chất lượng.", previewPath: "/chat-luong/nha-may-quy-trinh-san-xuat#process-factory" },
  process_documents: { page: "Chất lượng", position: "Hồ sơ và chứng từ", note: "Ảnh/link phần chứng từ trong trang Chất lượng.", previewPath: "/chat-luong/ho-so-phap-ly-chung-nhan" },
};

const FACTORY_PROOF_ASSET_KEYS = new Set([
  "home_factory_proof_1",
  "home_factory_proof_2",
  "home_factory_proof_3",
  "home_factory_proof_4",
  "home_factory_proof_5",
]);

function getFactoryProofTitleKey(key: string) {
  const match = key.match(/^home_factory_proof_(\d)$/);
  return match ? `factory_proof_${match[1]}_title` : "";
}

function getPageAssetMeta(item: PageAssetItem) {
  return PAGE_ASSET_META[item.key] || {
    page: "Tùy chỉnh",
    position: item.label || item.key || "Vị trí mới",
    note: "Mục tùy chỉnh, chỉ có tác dụng khi code ngoài web đọc đúng key này.",
    previewPath: "/",
  };
}

function getPageAssetScope(item: PageAssetItem) {
  const previewPath = getPageAssetMeta(item).previewPath;

  if (previewPath.startsWith("/gioi-thieu")) return "about";
  if (previewPath.startsWith("/chat-luong")) return "process";
  if (previewPath.startsWith("/#") || previewPath === "/") return "home";

  return "other";
}

type HomeTextScope = "all" | "home" | "about" | "quality";

function normalizeAdminSearch(value: unknown) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

function isFactoryProofText(item: HomeTextItem) {
  return item.key.startsWith("factory_proof");
}

function getHomeTextMeta(item: HomeTextItem): { page: string; section: string; note: string; previewPath: string; scope: HomeTextScope } {
  const key = item.key || "";
  const group = item.group || "";

  if (key.startsWith("about_hero")) {
    return { page: "Giới thiệu", section: "Hero hồ sơ thương hiệu", note: "Đoạn đầu trang Giới thiệu: tiêu đề, mô tả, nút và 3 ô số liệu.", previewPath: "/gioi-thieu", scope: "about" };
  }
  if (key.startsWith("about_story")) {
    return { page: "Giới thiệu", section: "Câu chuyện thương hiệu", note: "Video/câu chuyện và popup đọc toàn bộ câu chuyện.", previewPath: "/gioi-thieu#about-story", scope: "about" };
  }
  if (key.startsWith("about_process")) {
    return { page: "Giới thiệu", section: "Quy trình vận hành", note: "Cụm quy trình/nhà máy trên trang Giới thiệu.", previewPath: "/gioi-thieu#about-process", scope: "about" };
  }
  if (key.startsWith("about_business")) {
    return { page: "Giới thiệu", section: "Thông tin doanh nghiệp", note: "Bảng thông tin thương hiệu, pháp nhân, nhà máy và kênh phân phối.", previewPath: "/gioi-thieu#about-business", scope: "about" };
  }
  if (key.startsWith("about_values") || key.startsWith("about_value_")) {
    return { page: "Giới thiệu", section: "Sứ mệnh & giá trị", note: "Các thẻ Sứ mệnh, Tầm nhìn, Giá trị cốt lõi và Con người.", previewPath: "/gioi-thieu#about-values", scope: "about" };
  }
  if (key.startsWith("factory_proof")) {
    return { page: "Trang chủ", section: "Năng lực sản xuất / bằng chứng thương hiệu", note: "Cụm nhà máy và các mục bằng chứng trên trang chủ.", previewPath: "/#factory-proof", scope: "home" };
  }
  if (key.startsWith("products_")) {
    return { page: "Trang chủ", section: "Sản phẩm nổi bật", note: "Tiêu đề và mô tả cụm sản phẩm nổi bật.", previewPath: "/#products", scope: "home" };
  }
  if (key.startsWith("process_")) {
    return { page: "Trang chủ", section: "Quy trình sản xuất", note: "Cụm quy trình trên trang chủ.", previewPath: "/#process", scope: "home" };
  }
  if (key.startsWith("brand_story")) {
    return { page: "Trang chủ", section: "Câu chuyện thương hiệu", note: "Cụm câu chuyện thương hiệu trên trang chủ.", previewPath: "/#brand-story", scope: "home" };
  }
  if (key.startsWith("trust_")) {
    return { page: "Trang chủ", section: "Sứ mệnh", note: "Cụm sứ mệnh/niềm tin trên trang chủ.", previewPath: "/#mission", scope: "home" };
  }
  if (group.includes("Chất lượng")) {
    return { page: "Chất lượng", section: group, note: "Nội dung liên quan trang Chất lượng.", previewPath: "/chat-luong", scope: "quality" };
  }
  if (group.includes("Giới thiệu")) {
    return { page: "Giới thiệu", section: group.replace("Giới thiệu - ", ""), note: "Nội dung trang Giới thiệu.", previewPath: "/gioi-thieu", scope: "about" };
  }

  return { page: "Trang chủ", section: group || "Khác", note: "Nội dung chữ hiển thị trên website.", previewPath: "/", scope: "home" };
}

type ContentTab = "press" | "feedback" | "videos" | "home" | "trust" | "history" | "community";

function MarketingPageContent() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isWebsiteContent = pathname.startsWith("/admin/site-content");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ContentTab>(
    isWebsiteContent
      ? searchParams.get("tab") === "assets" || searchParams.get("tab") === "homeTexts"
        ? "home"
        : searchParams.get("tab") === "history"
          ? "history"
          : searchParams.get("tab") === "trust"
            ? "trust"
            : searchParams.get("tab") === "community"
              ? "community"
              : "home"
      : searchParams.get("tab") === "feedback"
        ? "feedback"
        : searchParams.get("tab") === "videos"
          ? "videos"
          : "press",
  );
  const [previewAsset, setPreviewAsset] = useState<PageAssetItem | null>(null);
  const [mediaPickerAssetId, setMediaPickerAssetId] = useState<string | null>(null);
  const [homeTextSearch, setHomeTextSearch] = useState("");
  const [homeTextScope, setHomeTextScope] = useState<HomeTextScope>("all");

  // State for assets lists
  const [pressList, setPressList] = useState<PressItem[]>([]);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [videoList, setVideoList] = useState<VideoItem[]>([]);
  const [homeTextList, setHomeTextList] = useState<HomeTextItem[]>([]);
  const [homeSectionList, setHomeSectionList] = useState<HomeSectionItem[]>([]);
  const [homeNewsList, setHomeNewsList] = useState<HomeNewsItem[]>([]);
  const [assetList, setAssetList] = useState<PageAssetItem[]>([]);
  const [trustList, setTrustList] = useState<TrustSectionItem[]>([]);
  const [historyList, setHistoryList] = useState<HistoryMilestoneItem[]>([]);
  const [communityList, setCommunityList] = useState<CommunityActivityItem[]>([]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    const websiteTabs = ["home", "assets", "homeTexts", "history", "trust", "community"];
    const communicationTabs = ["press", "feedback", "videos"];

    const normalizedTab = isWebsiteContent
      ? tab && websiteTabs.includes(tab)
        ? tab === "assets" || tab === "homeTexts" ? "home" : tab
        : "home"
      : tab && communicationTabs.includes(tab)
        ? tab
        : "press";

    const timer = window.setTimeout(() => setActiveTab(normalizedTab as ContentTab), 0);
    return () => window.clearTimeout(timer);
  }, [isWebsiteContent, searchParams]);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    fetch("/api/settings/marketing", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load"))))
      .then((data) => {
        if (cancelled) return;
        const config = normalizeMarketingConfig(data?.data);
        setPressList(config.press);
        setFeedbackList(config.feedback);
        setVideoList(config.videos);
        setHomeTextList(config.homeTexts);
        setHomeSectionList(config.homeSections);
        setHomeNewsList(config.homeNewsItems);
        setAssetList(config.pageAssets);
        setTrustList(config.trustSections);
        setHistoryList(config.historyMilestones);
        setCommunityList(config.communityActivities);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Failed to load marketing settings", error);
        toast.error("Không thể tải cấu hình marketing");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const saveMarketingConfig = async (nextConfig?: {
    press?: PressItem[];
    feedback?: FeedbackItem[];
    videos?: VideoItem[];
    homeTexts?: HomeTextItem[];
    homeSections?: HomeSectionItem[];
    homeNewsItems?: HomeNewsItem[];
    pageAssets?: PageAssetItem[];
    trustSections?: TrustSectionItem[];
    historyMilestones?: HistoryMilestoneItem[];
    communityActivities?: CommunityActivityItem[];
  }) => {
    setIsSaving(true);
    try {
      const nextPress = nextConfig?.press || pressList;
      const nextFeedback = nextConfig?.feedback || feedbackList;
      const nextVideos = nextConfig?.videos || videoList;
      const nextHomeTexts = nextConfig?.homeTexts || homeTextList;
      const nextHomeSections = nextConfig?.homeSections || homeSectionList;
      const nextHomeNewsItems = nextConfig?.homeNewsItems || homeNewsList;
      const nextPageAssets = nextConfig?.pageAssets || assetList;
      const nextTrustSections = nextConfig?.trustSections || trustList;
      const nextHistoryMilestones = nextConfig?.historyMilestones || historyList;
      const nextCommunityActivities = nextConfig?.communityActivities || communityList;

      const res = await fetch("/api/settings/marketing", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          press: nextPress,
          feedback: nextFeedback,
          videos: nextVideos,
          homeTexts: nextHomeTexts,
          homeSections: nextHomeSections,
          homeNewsItems: nextHomeNewsItems,
          pageAssets: nextPageAssets,
          trustSections: nextTrustSections,
          historyMilestones: nextHistoryMilestones,
          communityActivities: nextCommunityActivities,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      const config = normalizeMarketingConfig(data?.data);
      setPressList(config.press);
      setFeedbackList(config.feedback);
      setVideoList(config.videos);
      setHomeTextList(config.homeTexts);
      setHomeSectionList(config.homeSections);
      setHomeNewsList(config.homeNewsItems);
      setAssetList(config.pageAssets);
      setTrustList(config.trustSections);
      setHistoryList(config.historyMilestones);
      setCommunityList(config.communityActivities);
      toast.success("Đã lưu tài sản truyền thông thành công!");
    } catch (error) {
      console.error("Failed to save marketing settings", error);
      toast.error("Lưu cấu hình truyền thông thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    await saveMarketingConfig();
  };

  // Add Item Helpers
  const addPress = () => {
    const newItem: PressItem = {
      id: Date.now().toString(),
      sourceName: "",
      title: "",
      link: "",
      publishDate: new Date().toISOString().split("T")[0],
    };
    setPressList([...pressList, newItem]);
  };

  const addFeedback = () => {
    const newItem: FeedbackItem = {
      id: Date.now().toString(),
      customerName: "",
      roleOrLocation: "",
      rating: 5,
      comment: "",
    };
    setFeedbackList([...feedbackList, newItem]);
  };

  const addVideo = () => {
    const newItem: VideoItem = {
      id: Date.now().toString(),
      platform: "tiktok",
      videoId: "",
      title: "",
      url: "",
    };
    setVideoList([...videoList, newItem]);
  };

  const addHomeNewsItem = () => {
    const newItem: HomeNewsItem = {
      id: `custom_${Date.now()}`,
      title: "",
      description: "",
      label: "",
      imageUrl: "",
      logoUrl: "",
      linkUrl: "",
      enabled: true,
      sortOrder: homeNewsList.length > 0
        ? Math.max(...homeNewsList.map((item) => Number(item.sortOrder) || 0)) + 10
        : 10,
    };
    setHomeNewsList([...homeNewsList, newItem]);
  };

  const addAsset = () => {
    const newItem: PageAssetItem = {
      id: Date.now().toString(),
      key: `custom_${Date.now()}`,
      label: "",
      imageUrl: "",
      linkUrl: "",
    };
    setAssetList([...assetList, newItem]);
  };

  const addTrustSection = () => {
    const newItem: TrustSectionItem = {
      id: Date.now().toString(),
      key: `custom_${Date.now()}`,
      title: "",
      description: "",
      detailTitle: "",
      detailContent: "",
      imageUrl: "",
      linkUrl: "",
      enabled: true,
    };
    setTrustList([...trustList, newItem]);
  };

  const addHistoryMilestone = () => {
    const newItem: HistoryMilestoneItem = {
      id: Date.now().toString(),
      year: new Date().getFullYear().toString(),
      title: "",
      description: "",
      detailContent: "",
      imageUrl: "",
      linkUrl: "",
      type: "milestone",
      enabled: true,
      sortOrder: historyList.length > 0
        ? Math.max(...historyList.map((item) => Number(item.sortOrder) || 0)) + 10
        : 10,
    };
    setHistoryList([...historyList, newItem]);
  };

  const addCommunityActivity = () => {
    const newItem: CommunityActivityItem = {
      id: Date.now().toString(),
      title: "",
      description: "",
      iconKey: "heart",
      tone: "orange",
      imageUrl: "",
      linkUrl: "",
      enabled: true,
      sortOrder: communityList.length > 0
        ? Math.max(...communityList.map((item) => Number(item.sortOrder) || 0)) + 10
        : 10,
    };
    setCommunityList([...communityList, newItem]);
  };

  // Remove Item Helpers
  const removePress = (id: string) => {
    setPressList(pressList.filter((item) => item.id !== id));
  };

  const removeFeedback = (id: string) => {
    setFeedbackList(feedbackList.filter((item) => item.id !== id));
  };

  const removeVideo = (id: string) => {
    setVideoList(videoList.filter((item) => item.id !== id));
  };

  const removeAsset = (id: string) => {
    setAssetList(assetList.filter((item) => item.id !== id));
  };

  const removeTrustSection = (id: string) => {
    setTrustList(trustList.filter((item) => item.id !== id));
  };

  const removeHistoryMilestone = (id: string) => {
    setHistoryList(historyList.filter((item) => item.id !== id));
  };

  const removeCommunityActivity = (id: string) => {
    setCommunityList(communityList.filter((item) => item.id !== id));
  };

  const removeHomeNewsItem = (id: string) => {
    setHomeNewsList(homeNewsList.filter((item) => item.id !== id));
  };

  // Update Field Helpers
  const updatePress = (id: string, field: keyof PressItem, val: string) => {
    setPressList(pressList.map((item) => item.id === id ? { ...item, [field]: val } : item));
  };

  const updateFeedback = (id: string, field: keyof FeedbackItem, val: string | number) => {
    setFeedbackList(feedbackList.map((item) => item.id === id ? { ...item, [field]: val } : item));
  };

  const updateVideo = (id: string, field: keyof VideoItem, val: string) => {
    setVideoList(videoList.map((item) => {
      if (item.id === id) {
        const updated = { ...item, [field]: val };
        // Auto extract videoId from URL if pasting into url field
        if (field === "url" && val.trim() !== "") {
          if (updated.platform === "youtube") {
            const ytMatch = val.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^#\&\?]+)/);
            if (ytMatch && ytMatch[1]) updated.videoId = ytMatch[1];
          } else if (updated.platform === "tiktok") {
            const ttMatch = val.match(/video\/(\d+)/);
            if (ttMatch && ttMatch[1]) updated.videoId = ttMatch[1];
          }
        }
        return updated;
      }
      return item;
    }));
  };

  const updateAsset = (id: string, field: keyof PageAssetItem, val: string) => {
    setAssetList(assetList.map((item) => item.id === id ? { ...item, [field]: val } : item));
  };

  const updateHomeText = (id: string, value: string) => {
    setHomeTextList(homeTextList.map((item) => item.id === id ? { ...item, value } : item));
  };

  const updateHomeTextByKey = (key: string, value: string) => {
    setHomeTextList((items) => {
      const existingItem = items.find((item) => item.key === key);
      if (existingItem) {
        return items.map((item) => item.id === existingItem.id ? { ...item, value } : item);
      }

      return [
        ...items,
        {
          id: `home-text-${key}`,
          key,
          group: "Trang chủ - Bằng chứng nhà máy",
          label: "Tên mục bằng chứng",
          value,
          multiline: false,
          sortOrder: 70,
        },
      ];
    });
  };

  const updateHomeSection = (id: string, enabled: boolean) => {
    setHomeSectionList(homeSectionList.map((item) => item.id === id ? { ...item, enabled } : item));
  };

  const updateHomeNewsItem = (
    id: string,
    field: keyof HomeNewsItem,
    val: string | boolean | number,
  ) => {
    setHomeNewsList(homeNewsList.map((item) => item.id === id ? { ...item, [field]: val } : item));
  };

  const updateTrustSection = (
    id: string,
    field: keyof TrustSectionItem,
    val: string | boolean,
  ) => {
    setTrustList(trustList.map((item) => item.id === id ? { ...item, [field]: val } : item));
  };

  const updateHistoryMilestone = (
    id: string,
    field: keyof HistoryMilestoneItem,
    val: string | boolean | number,
  ) => {
    setHistoryList(historyList.map((item) => item.id === id ? { ...item, [field]: val } : item));
  };

  const updateCommunityActivity = (
    id: string,
    field: keyof CommunityActivityItem,
    val: string | boolean | number,
  ) => {
    setCommunityList(communityList.map((item) => item.id === id ? { ...item, [field]: val } : item));
  };

  const handleMediaSelect = async (url: string) => {
    if (!mediaPickerAssetId) return;

    if (mediaPickerAssetId.startsWith("home-news-logo:")) {
      const itemId = mediaPickerAssetId.replace("home-news-logo:", "");
      const nextHomeNewsList = homeNewsList.map((item) =>
        item.id === itemId ? { ...item, logoUrl: url } : item,
      );
      setHomeNewsList(nextHomeNewsList);
      setMediaPickerAssetId(null);
      await saveMarketingConfig({ homeNewsItems: nextHomeNewsList });
      return;
    }

    if (mediaPickerAssetId.startsWith("home-news:")) {
      const itemId = mediaPickerAssetId.replace("home-news:", "");
      const nextHomeNewsList = homeNewsList.map((item) =>
        item.id === itemId ? { ...item, imageUrl: url } : item,
      );
      setHomeNewsList(nextHomeNewsList);
      setMediaPickerAssetId(null);
      await saveMarketingConfig({ homeNewsItems: nextHomeNewsList });
      return;
    }

    if (mediaPickerAssetId.startsWith("history:")) {
      const itemId = mediaPickerAssetId.replace("history:", "");
      const nextHistoryList = historyList.map((item) =>
        item.id === itemId ? { ...item, imageUrl: url } : item,
      );
      setHistoryList(nextHistoryList);
      setMediaPickerAssetId(null);
      await saveMarketingConfig({ historyMilestones: nextHistoryList });
      return;
    }

    if (activeTab === "trust") {
      const nextTrustList = trustList.map((item) =>
        item.id === mediaPickerAssetId ? { ...item, imageUrl: url } : item,
      );
      setTrustList(nextTrustList);
      setMediaPickerAssetId(null);
      await saveMarketingConfig({ trustSections: nextTrustList });
      return;
    }

    if (activeTab === "history") {
      const nextHistoryList = historyList.map((item) =>
        item.id === mediaPickerAssetId ? { ...item, imageUrl: url } : item,
      );
      setHistoryList(nextHistoryList);
      setMediaPickerAssetId(null);
      await saveMarketingConfig({ historyMilestones: nextHistoryList });
      return;
    }

    if (activeTab === "community") {
      const nextCommunityList = communityList.map((item) =>
        item.id === mediaPickerAssetId ? { ...item, imageUrl: url } : item,
      );
      setCommunityList(nextCommunityList);
      setMediaPickerAssetId(null);
      await saveMarketingConfig({ communityActivities: nextCommunityList });
      return;
    }

    const nextAssetList = assetList.map((item) =>
      item.id === mediaPickerAssetId ? { ...item, imageUrl: url } : item,
    );
    setAssetList(nextAssetList);
    setMediaPickerAssetId(null);
    await saveMarketingConfig({ pageAssets: nextAssetList });
  };

  const homeAssetList = assetList.filter((item) => getPageAssetScope(item) === "home");
  const homeTextByKey = homeTextList.reduce<Record<string, HomeTextItem>>((acc, item) => {
    acc[item.key] = item;
    return acc;
  }, {});
  const factoryMainAsset = homeAssetList.find((item) => item.key === "home_factory_proof_image");
  const factoryProofAssets = Array.from(FACTORY_PROOF_ASSET_KEYS)
    .map((key) => homeAssetList.find((item) => item.key === key))
    .filter((item): item is PageAssetItem => Boolean(item));
  const normalizedHomeTextSearch = normalizeAdminSearch(homeTextSearch.trim());
  const visibleHomeTextList = useMemo(() => homeTextList.filter((item) => {
    const meta = getHomeTextMeta(item);
    const scopeMatches = homeTextScope === "all" || meta.scope === homeTextScope;
    if (!scopeMatches) return false;
    if (!normalizedHomeTextSearch) return true;

    return [
      item.label,
      item.value,
      item.key,
      item.group,
      meta.page,
      meta.section,
      meta.note,
    ].some((value) => normalizeAdminSearch(value).includes(normalizedHomeTextSearch));
  }), [homeTextList, homeTextScope, normalizedHomeTextSearch]);
  const factoryHomeTextItems = visibleHomeTextList
    .filter(isFactoryProofText)
    .filter((item) => !/^factory_proof_\d_title$/.test(item.key))
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const groupedTextSource = visibleHomeTextList.filter((item) => !isFactoryProofText(item));
  const groupedHomeTextItems = Array.from(new Set(groupedTextSource.map((item) => item.group || "Khác")))
    .map((group) => ({
      group,
      items: groupedTextSource
        .filter((item) => (item.group || "Khác") === group)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }))
    .filter(({ items }) => items.length > 0);
  const looseHomeAssets = homeAssetList.filter((item) => (
    item.key !== "home_factory_proof_image" && !FACTORY_PROOF_ASSET_KEYS.has(item.key)
  ));
  const showFactoryProofSection = (homeTextScope === "all" || homeTextScope === "home")
    && (!normalizedHomeTextSearch || factoryHomeTextItems.length > 0);

  const renderHomeTextField = (item: HomeTextItem) => {
    const meta = getHomeTextMeta(item);

    return (
      <div key={item.id} className="grid gap-3 border border-slate-200 bg-white p-4 lg:grid-cols-[240px_1fr_230px] lg:items-start">
        <div>
          <div className="flex flex-wrap gap-1.5">
            <span className="bg-orange-50 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-orange-700">{meta.page}</span>
            <span className="bg-slate-100 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-600">{meta.section}</span>
          </div>
          <label className="mt-3 block text-sm font-black text-slate-900">{item.label}</label>
          <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">{meta.note}</p>
          <p className="mt-2 break-all font-mono text-[10px] font-bold text-slate-400">{item.key}</p>
        </div>

        <div>
          {item.multiline ? (
            <textarea
              value={item.value}
              onChange={(e) => updateHomeText(item.id, e.target.value)}
              rows={4}
              className="w-full border border-slate-300 bg-white p-3 text-sm font-semibold leading-6 text-slate-800 outline-none transition focus:border-orange-500"
            />
          ) : (
            <input
              type="text"
              value={item.value}
              onChange={(e) => updateHomeText(item.id, e.target.value)}
              className="w-full border border-slate-300 bg-white p-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-orange-500"
            />
          )}
        </div>

        <div className="border border-orange-100 bg-orange-50 p-3">
          <p className="text-[10px] font-black uppercase tracking-wider text-orange-700">Preview chữ đang nhập</p>
          <div className="mt-2 max-h-28 overflow-y-auto whitespace-pre-wrap break-words bg-white p-3 text-xs font-semibold leading-5 text-slate-700">
            {item.value || <span className="text-slate-400">Đang trống</span>}
          </div>
          <a
            href={meta.previewPath}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-orange-700 hover:text-orange-900"
          >
            Xem ngoài web <ExternalLink size={13} />
          </a>
        </div>
      </div>
    );
  };

  const renderAssetEditor = (item: PageAssetItem, compact = false) => {
    const meta = getPageAssetMeta(item);
    const isFixedSlot = Boolean(PAGE_ASSET_META[item.key]);
    const factoryProofTitleKey = getFactoryProofTitleKey(item.key);
    const factoryProofTitle = factoryProofTitleKey ? homeTextByKey[factoryProofTitleKey]?.value || "" : "";

    return (
      <div key={item.id} className={`grid gap-4 border border-slate-200 bg-white p-4 ${compact ? "" : "lg:grid-cols-[180px_1fr_auto]"}`}>
        <div className="overflow-hidden border border-slate-200 bg-slate-50">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.label || item.key} className={`${compact ? "h-28" : "h-36"} w-full object-cover`} />
          ) : (
            <div className={`flex ${compact ? "h-28" : "h-36"} items-center justify-center px-4 text-center text-xs font-semibold text-slate-400`}>
              Không có ảnh
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-4">
          <div>
            <h3 className="text-base font-black text-slate-950">{meta.position}</h3>
            <p className="mt-1 text-xs font-medium leading-5 text-slate-500">{meta.note}</p>
          </div>

          {factoryProofTitleKey && (
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Tên mục</label>
              <input
                type="text"
                value={factoryProofTitle}
                onChange={(e) => updateHomeTextByKey(factoryProofTitleKey, e.target.value)}
                placeholder="VD: Quy trình sản xuất"
                className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Nội dung / mô tả</label>
            <input
              type="text"
              value={item.label}
              onChange={(e) => updateAsset(item.id, "label", e.target.value)}
              placeholder="Nội dung hiển thị cho vị trí này"
              className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div>
              <label className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase text-slate-500">
                <ImageIcon size={11} /> URL ảnh
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={item.imageUrl}
                  onChange={(e) => updateAsset(item.id, "imageUrl", e.target.value)}
                  placeholder="/uploads/anh-that.png hoặc https://..."
                  className="min-w-0 flex-1 border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setMediaPickerAssetId(item.id)}
                  className="inline-flex shrink-0 items-center gap-1.5 border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                >
                  <ImagePlus size={14} />
                  Thư viện
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase text-slate-500">
                <Link2 size={11} /> URL link khi bấm
              </label>
              <input
                type="text"
                value={item.linkUrl}
                onChange={(e) => updateAsset(item.id, "linkUrl", e.target.value)}
                placeholder="/tin-tuc/bai-viet hoặc https://..."
                className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:flex-col lg:items-end lg:justify-center">
          <button
            onClick={() => setPreviewAsset(item)}
            className="flex items-center gap-1.5 border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
            title="Xem thử ảnh và link"
          >
            <Eye size={16} />
            Xem thử
          </button>
          {!isFixedSlot && (
            <button
              onClick={() => removeAsset(item.id)}
              className="flex items-center gap-1.5 border border-transparent px-3 py-2 text-xs font-bold text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              title="Xóa dòng này"
            >
              <Trash2 size={16} />
              Xóa
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "MARKETING", "EDITOR"]}>
      <div className="mx-auto max-w-7xl space-y-6 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Settings className="text-orange-500" size={28} />
              {isWebsiteContent ? "Nội dung website" : "Truyền thông thương hiệu"}
            </h1>
            <p className="text-slate-500 mt-1">
              {isWebsiteContent
                ? "Chỉnh nội dung trang chủ, hình ảnh, lịch sử và thông tin uy tín của thương hiệu."
                : "Quản lý báo chí, đánh giá khách hàng và video truyền thông."}
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold transition disabled:opacity-50 shadow-md cursor-pointer self-start sm:self-auto"
          >
            <Save size={18} />
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {(isWebsiteContent ? [
            {
              title: "Trang chủ",
              description: "Sửa nội dung và hình ảnh đang hiển thị trên trang chủ.",
              tabs: [
                { id: "home" as const, label: "Trang chủ", icon: Settings },
              ],
            },
            {
              title: "Giới thiệu thương hiệu",
              description: "Quản lý câu chuyện, uy tín và hoạt động thương hiệu.",
              tabs: [
                { id: "history" as const, label: "Lịch sử phát triển", icon: Calendar },
                { id: "trust" as const, label: "Chứng nhận & uy tín", icon: ShieldCheck },
                { id: "community" as const, label: "Hoạt động cộng đồng", icon: Heart },
              ],
            },
          ] : [{
            title: "Truyền thông",
            description: "Nội dung bên ngoài nói về thương hiệu.",
            tabs: [
              { id: "press" as const, label: "Báo chí", icon: Newspaper },
              { id: "feedback" as const, label: "Đánh giá khách hàng", icon: MessageSquare },
              { id: "videos" as const, label: "Video", icon: Video },
            ],
          }]).map((group) => (
            <section key={group.title} className="border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-black text-slate-950">{group.title}</h2>
              <p className="mt-1 min-h-10 text-xs leading-5 text-slate-500">{group.description}</p>
              <div className="mt-3 grid gap-2">
                {group.tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 border px-3 py-2.5 text-left text-sm font-bold transition ${
                        activeTab === tab.id
                          ? "border-orange-500 bg-orange-50 text-orange-700"
                          : "border-slate-200 text-slate-600 hover:border-orange-300 hover:text-slate-950"
                      }`}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {loading ? (
          <div className="h-96 bg-slate-100 animate-pulse border border-slate-200"></div>
        ) : (
          <div className="space-y-6">
            
            {/* Press Tab Content */}
            {!isWebsiteContent && activeTab === "press" && (
              <div className="bg-white border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6 animate-fade-in">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <h2 className="text-base font-black text-slate-900 uppercase">Bài báo nhắc đến Ăn Cùng Bà Tuyết</h2>
                  <button
                    onClick={addPress}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow cursor-pointer transition"
                  >
                    <Plus size={14} />
                    Thêm bài báo
                  </button>
                </div>

                {pressList.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <AlertCircle className="mx-auto text-slate-300 mb-2" size={36} />
                    <p className="text-xs font-semibold">Chưa có bài viết báo chí nào được thêm.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pressList.map((item, index) => (
                      <div key={item.id} className="flex gap-4 p-4 border border-slate-200 bg-slate-50 relative group">
                        <span className="text-xs font-black text-slate-450 self-start mt-2">#{index + 1}</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                              <Globe size={11} /> Nguồn báo
                            </label>
                            <input
                              type="text"
                              value={item.sourceName}
                              onChange={(e) => updatePress(item.id, "sourceName", e.target.value)}
                              placeholder="VD: Dân Trí, VnExpress..."
                              className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                              <Newspaper size={11} /> Tiêu đề bài viết
                            </label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updatePress(item.id, "title", e.target.value)}
                              placeholder="Tiêu đề hiển thị..."
                              className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                              <Calendar size={11} /> Ngày xuất bản
                            </label>
                            <input
                              type="date"
                              value={item.publishDate}
                              onChange={(e) => updatePress(item.id, "publishDate", e.target.value)}
                              className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Đường dẫn chi tiết</label>
                            <input
                              type="text"
                              value={item.link}
                              onChange={(e) => updatePress(item.id, "link", e.target.value)}
                              placeholder="https://dantri.com.vn/..."
                              className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => removePress(item.id)}
                          className="p-2 border border-transparent hover:border-red-200 text-slate-400 hover:text-red-500 hover:bg-red-50 transition self-center"
                          title="Xóa dòng này"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Feedback Tab Content */}
            {!isWebsiteContent && activeTab === "feedback" && (
              <div className="bg-white border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6 animate-fade-in">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <h2 className="text-base font-black text-slate-900 uppercase">Phản hồi của khách hàng (Testimonials)</h2>
                  <button
                    onClick={addFeedback}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow cursor-pointer transition"
                  >
                    <Plus size={14} />
                    Thêm nhận xét
                  </button>
                </div>

                {feedbackList.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <AlertCircle className="mx-auto text-slate-300 mb-2" size={36} />
                    <p className="text-xs font-semibold">Chưa có nhận xét nào được thêm.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {feedbackList.map((item, index) => (
                      <div key={item.id} className="flex gap-4 p-4 border border-slate-200 bg-slate-50 relative group">
                        <span className="text-xs font-black text-slate-450 self-start mt-2">#{index + 1}</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                              <User size={11} /> Tên khách hàng
                            </label>
                            <input
                              type="text"
                              value={item.customerName}
                              onChange={(e) => updateFeedback(item.id, "customerName", e.target.value)}
                              placeholder="Nguyễn Văn A..."
                              className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                              <Globe size={11} /> Địa điểm / Vai trò
                            </label>
                            <input
                              type="text"
                              value={item.roleOrLocation}
                              onChange={(e) => updateFeedback(item.id, "roleOrLocation", e.target.value)}
                              placeholder="Học sinh tại Hà Nội..."
                              className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                              <Star size={11} className="text-yellow-500 fill-yellow-500" /> Đánh giá (Sao)
                            </label>
                            <select
                              value={item.rating}
                              onChange={(e) => updateFeedback(item.id, "rating", parseInt(e.target.value))}
                              className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500 text-slate-800"
                            >
                              <option value="5">⭐⭐⭐⭐⭐ (5 sao)</option>
                              <option value="4">⭐⭐⭐⭐ (4 sao)</option>
                              <option value="3">⭐⭐⭐ (3 sao)</option>
                              <option value="2">⭐⭐ (2 sao)</option>
                              <option value="1">⭐ (1 sao)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lời nhận xét</label>
                            <input
                              type="text"
                              value={item.comment}
                              onChange={(e) => updateFeedback(item.id, "comment", e.target.value)}
                              placeholder="Đồ ăn giòn và rất ngon..."
                              className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => removeFeedback(item.id)}
                          className="p-2 border border-transparent hover:border-red-200 text-slate-400 hover:text-red-500 hover:bg-red-50 transition self-center"
                          title="Xóa dòng này"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Videos Tab Content */}
            {!isWebsiteContent && activeTab === "videos" && (
              <div className="bg-white border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6 animate-fade-in">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <h2 className="text-base font-black text-slate-900 uppercase">Video clip truyền thông giới thiệu sản phẩm</h2>
                  <button
                    onClick={addVideo}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow cursor-pointer transition"
                  >
                    <Plus size={14} />
                    Thêm video
                  </button>
                </div>

                {videoList.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <AlertCircle className="mx-auto text-slate-300 mb-2" size={36} />
                    <p className="text-xs font-semibold">Chưa có video truyền thông nào được thêm.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {videoList.map((item, index) => (
                      <div key={item.id} className="flex gap-4 p-4 border border-slate-200 bg-slate-50 relative group">
                        <span className="text-xs font-black text-slate-450 self-start mt-2">#{index + 1}</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                              <Play size={11} /> Nền tảng
                            </label>
                            <select
                              value={item.platform}
                              onChange={(e) => updateVideo(item.id, "platform", e.target.value)}
                              className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500 text-slate-800"
                            >
                              <option value="tiktok">TikTok Video</option>
                              <option value="youtube">YouTube Video</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                              Tiêu đề hiển thị
                            </label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updateVideo(item.id, "title", e.target.value)}
                              placeholder="VD: Lễ khánh thành nhà máy..."
                              className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                              Đường dẫn chi tiết (URL)
                            </label>
                            <input
                              type="text"
                              value={item.url}
                              onChange={(e) => updateVideo(item.id, "url", e.target.value)}
                              placeholder="Dán link video thật vào đây..."
                              className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mã video (Video ID)</label>
                            <input
                              type="text"
                              value={item.videoId}
                              onChange={(e) => updateVideo(item.id, "videoId", e.target.value)}
                              placeholder="Mã số hoặc chuỗi ID video..."
                              className="w-full border border-slate-300 bg-white p-2 text-xs font-mono font-bold outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => removeVideo(item.id)}
                          className="p-2 border border-transparent hover:border-red-200 text-slate-400 hover:text-red-500 hover:bg-red-50 transition self-center"
                          title="Xóa dòng này"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {isWebsiteContent && activeTab === "trust" && (
              <div className="bg-white border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6 animate-fade-in">
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-base font-black text-slate-900 uppercase">Nội dung thể hiện uy tín</h2>
                    <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                      Quản lý chứng nhận, bảo hiểm, lịch sử công ty, thành tích, quy trình và câu chuyện thương hiệu. Mỗi mục có phần chi tiết riêng để khách bấm xem thêm.
                    </p>
                  </div>
                  <button
                    onClick={addTrustSection}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow cursor-pointer transition"
                  >
                    <Plus size={14} />
                    Thêm mục
                  </button>
                </div>

                <div className="grid gap-4">
                  {trustList.map((item, index) => (
                    <div key={item.id} className="grid gap-4 border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[150px_1fr_auto]">
                      <div className="overflow-hidden border border-slate-200 bg-white">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title} className="h-32 w-full object-contain bg-white p-2" />
                        ) : (
                          <div className="flex h-32 items-center justify-center px-4 text-center text-xs font-semibold text-slate-400">
                            Chon anh
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="bg-orange-500 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                            #{index + 1}
                          </span>
                          <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700">
                            <input
                              type="checkbox"
                              checked={item.enabled}
                              onChange={(e) => updateTrustSection(item.id, "enabled", e.target.checked)}
                              className="h-4 w-4 accent-orange-500"
                            />
                            Hiển thị ngoài website
                          </label>
                        </div>

                        <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mã mục</label>
                            <input
                              type="text"
                              value={item.key}
                              onChange={(e) => updateTrustSection(item.id, "key", e.target.value)}
                              className="w-full border border-slate-300 bg-white p-2 text-xs font-mono font-bold outline-none focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tiêu đề</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updateTrustSection(item.id, "title", e.target.value)}
                              className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mô tả ngắn</label>
                          <textarea
                            value={item.description}
                            onChange={(e) => updateTrustSection(item.id, "description", e.target.value)}
                            rows={3}
                            className="w-full resize-none border border-slate-300 bg-white p-2 text-xs font-semibold leading-5 outline-none focus:border-orange-500"
                          />
                        </div>

                        <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tiêu đề chi tiết</label>
                            <input
                              type="text"
                              value={item.detailTitle}
                              onChange={(e) => updateTrustSection(item.id, "detailTitle", e.target.value)}
                              placeholder="Ví dụ: Hồ sơ an toàn thực phẩm"
                              className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nội dung chi tiết khi bấm xem thêm</label>
                            <textarea
                              value={item.detailContent}
                              onChange={(e) => updateTrustSection(item.id, "detailContent", e.target.value)}
                              rows={4}
                              placeholder="Viết nội dung chi tiết, mỗi ý có thể xuống dòng."
                              className="w-full resize-none border border-slate-300 bg-white p-2 text-xs font-semibold leading-5 outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 xl:grid-cols-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                              <ImageIcon size={11} /> URL ảnh
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={item.imageUrl}
                                onChange={(e) => updateTrustSection(item.id, "imageUrl", e.target.value)}
                                className="min-w-0 flex-1 border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                              />
                              <button
                                type="button"
                                onClick={() => setMediaPickerAssetId(item.id)}
                                className="inline-flex shrink-0 items-center gap-1.5 border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                              >
                                <ImagePlus size={14} />
                                Thư viện
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                              <Link2 size={11} /> URL link
                            </label>
                            <input
                              type="text"
                              value={item.linkUrl}
                              onChange={(e) => updateTrustSection(item.id, "linkUrl", e.target.value)}
                              className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removeTrustSection(item.id)}
                        className="flex h-fit items-center gap-1.5 border border-transparent px-3 py-2 text-xs font-bold text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 lg:self-center"
                      >
                        <Trash2 size={16} />
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isWebsiteContent && activeTab === "history" && (
              <div className="bg-white border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6 animate-fade-in">
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="text-base font-black text-slate-900 uppercase">Cột mốc lịch sử phát triển</h2>
                    <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                      Mỗi dòng là một cột mốc hiển thị trong section Hành trình phát triển của trang /gioi-thieu. Admin sửa ở đây thì ngoài trang Giới thiệu đổi theo.
                    </p>
                  </div>
                  <button
                    onClick={addHistoryMilestone}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow cursor-pointer transition"
                  >
                    <Plus size={14} />
                    Thêm cột mốc
                  </button>
                </div>

                <div className="border border-orange-100 bg-orange-50 p-4 text-xs leading-5 text-slate-700">
                  <p className="font-bold text-slate-900">Cách dùng:</p>
                  <p className="mt-1">
                    Nhập năm, tiêu đề, mô tả ngắn, nội dung chi tiết và ảnh. Ngoài /gioi-thieu sẽ hiện cả mô tả ngắn và nội dung chi tiết. Bật/tắt để ẩn hiện, ô thứ tự càng nhỏ sẽ hiển thị càng trước.
                  </p>
                </div>

                {historyList.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <AlertCircle className="mx-auto text-slate-300 mb-2" size={36} />
                    <p className="text-xs font-semibold">Chưa có cột mốc nào. Bấm &quot;Thêm cột mốc&quot; để tạo dòng đầu tiên.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[...historyList]
                      .sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0))
                      .map((item, index) => (
                        <div key={item.id} className="grid gap-4 border border-slate-200 bg-slate-50 p-4 xl:grid-cols-[180px_1fr_auto]">
                          <div className="overflow-hidden border border-slate-200 bg-white">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.title || item.year} className="h-40 w-full object-cover" />
                            ) : (
                              <div className="flex h-40 items-center justify-center px-4 text-center text-xs font-semibold text-slate-400">
                                Chưa có ảnh
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="bg-orange-500 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                                  Cột mốc #{index + 1}
                                </span>
                                <span className="text-xs font-black text-slate-400">
                                  {item.enabled ? "Đang hiển thị" : "Đang ẩn"}
                                </span>
                              </div>
                              <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-600">
                                <input
                                  type="checkbox"
                                  checked={item.enabled}
                                  onChange={(e) => updateHistoryMilestone(item.id, "enabled", e.target.checked)}
                                  className="h-4 w-4 accent-orange-500"
                                />
                                Hiển thị
                              </label>
                            </div>

                            <div className="grid gap-4 md:grid-cols-[120px_1fr_150px_120px]">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Năm</label>
                                <input
                                  type="text"
                                  value={item.year}
                                  onChange={(e) => updateHistoryMilestone(item.id, "year", e.target.value)}
                                  placeholder="2026"
                                  className="w-full border border-slate-300 bg-white p-2 text-xs font-bold outline-none focus:border-orange-500"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tiêu đề</label>
                                <input
                                  type="text"
                                  value={item.title}
                                  onChange={(e) => updateHistoryMilestone(item.id, "title", e.target.value)}
                                  placeholder="Mở rộng nhà xưởng..."
                                  className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Loại</label>
                                <select
                                  value={item.type}
                                  onChange={(e) => updateHistoryMilestone(item.id, "type", e.target.value)}
                                  className="w-full border border-slate-300 bg-white p-2 text-xs font-bold outline-none focus:border-orange-500"
                                >
                                  <option value="milestone">Cột mốc</option>
                                  <option value="achievement">Thành tựu</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Thứ tự</label>
                                <input
                                  type="number"
                                  value={item.sortOrder}
                                  onChange={(e) => updateHistoryMilestone(item.id, "sortOrder", Number(e.target.value))}
                                  className="w-full border border-slate-300 bg-white p-2 text-xs font-bold outline-none focus:border-orange-500"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mô tả ngắn</label>
                              <textarea
                                value={item.description}
                                onChange={(e) => updateHistoryMilestone(item.id, "description", e.target.value)}
                                rows={2}
                                placeholder="Một đoạn ngắn hiển thị ở thẻ chính ngoài trang lịch sử."
                                className="w-full resize-none border border-slate-300 bg-white p-2 text-xs font-semibold leading-5 outline-none focus:border-orange-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nội dung chi tiết</label>
                              <textarea
                                value={item.detailContent}
                                onChange={(e) => updateHistoryMilestone(item.id, "detailContent", e.target.value)}
                                rows={4}
                                placeholder="Viết nội dung chi tiết. Có thể xuống dòng để tách đoạn."
                                className="w-full resize-none border border-slate-300 bg-white p-2 text-xs font-semibold leading-5 outline-none focus:border-orange-500"
                              />
                            </div>

                            <div className="grid gap-4 xl:grid-cols-2">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                                  <ImageIcon size={11} /> URL ảnh
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={item.imageUrl}
                                    onChange={(e) => updateHistoryMilestone(item.id, "imageUrl", e.target.value)}
                                    placeholder="/uploads/anh-cot-moc.png"
                                    className="min-w-0 flex-1 border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setMediaPickerAssetId(`history:${item.id}`)}
                                    className="inline-flex shrink-0 items-center gap-1.5 border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                                  >
                                    <ImagePlus size={14} />
                                    Thư viện
                                  </button>
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                                  <Link2 size={11} /> Link liên quan
                                </label>
                                <input
                                  type="text"
                                  value={item.linkUrl}
                                  onChange={(e) => updateHistoryMilestone(item.id, "linkUrl", e.target.value)}
                                  placeholder="/tin-tuc/bai-viet hoặc https://..."
                                  className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                                />
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => removeHistoryMilestone(item.id)}
                            className="flex h-fit items-center gap-1.5 border border-transparent px-3 py-2 text-xs font-bold text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 xl:self-center"
                          >
                            <Trash2 size={16} />
                            Xóa
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {isWebsiteContent && activeTab === "community" && (
              <div className="bg-white border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6 animate-fade-in">
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="text-base font-black text-slate-900 uppercase">Hoat dong cong dong</h2>
                    <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                      Quan ly tung dong noi dung trong trang Cong dong: tieu de, mo ta, icon, mau, anh, link, bat/tat va thu tu hien thi.
                    </p>
                  </div>
                  <button
                    onClick={addCommunityActivity}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow cursor-pointer transition"
                  >
                    <Plus size={14} />
                    Them hoat dong
                  </button>
                </div>

                {communityList.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <AlertCircle className="mx-auto text-slate-300 mb-2" size={36} />
                    <p className="text-xs font-semibold">Chua co hoat dong cong dong nao.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {communityList
                      .slice()
                      .sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0))
                      .map((item, index) => (
                        <div key={item.id} className="grid gap-4 border border-slate-200 bg-slate-50 p-4 xl:grid-cols-[150px_1fr_auto]">
                          <div className="overflow-hidden border border-slate-200 bg-white">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.title} className="h-32 w-full object-cover" />
                            ) : (
                              <div className="flex h-32 items-center justify-center px-4 text-center text-xs font-semibold text-slate-400">
                                Chua co anh
                              </div>
                            )}
                          </div>

                          <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="bg-orange-500 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                                #{index + 1}
                              </span>
                              <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700">
                                <input
                                  type="checkbox"
                                  checked={item.enabled}
                                  onChange={(e) => updateCommunityActivity(item.id, "enabled", e.target.checked)}
                                  className="h-4 w-4 accent-orange-500"
                                />
                                Hien thi ngoai website
                              </label>
                            </div>

                            <div className="grid gap-4 md:grid-cols-[1fr_140px_140px_120px]">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tieu de</label>
                                <input
                                  type="text"
                                  value={item.title}
                                  onChange={(e) => updateCommunityActivity(item.id, "title", e.target.value)}
                                  className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Icon</label>
                                <select
                                  value={item.iconKey}
                                  onChange={(e) => updateCommunityActivity(item.id, "iconKey", e.target.value)}
                                  className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                                >
                                  <option value="heart">Trai tim</option>
                                  <option value="users">Cong dong</option>
                                  <option value="message">Tin nhan</option>
                                  <option value="hand">Ho tro</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mau</label>
                                <select
                                  value={item.tone}
                                  onChange={(e) => updateCommunityActivity(item.id, "tone", e.target.value)}
                                  className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                                >
                                  <option value="orange">Cam</option>
                                  <option value="red">Do</option>
                                  <option value="blue">Xanh duong</option>
                                  <option value="green">Xanh la</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Thu tu</label>
                                <input
                                  type="number"
                                  value={item.sortOrder}
                                  onChange={(e) => updateCommunityActivity(item.id, "sortOrder", Number(e.target.value))}
                                  className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mo ta</label>
                              <textarea
                                value={item.description}
                                onChange={(e) => updateCommunityActivity(item.id, "description", e.target.value)}
                                rows={3}
                                className="w-full resize-none border border-slate-300 bg-white p-2 text-xs font-semibold leading-5 outline-none focus:border-orange-500"
                              />
                            </div>

                            <div className="grid gap-4 xl:grid-cols-2">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                                  <ImageIcon size={11} /> URL anh
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={item.imageUrl}
                                    onChange={(e) => updateCommunityActivity(item.id, "imageUrl", e.target.value)}
                                    placeholder="/uploads/hoat-dong.png"
                                    className="min-w-0 flex-1 border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setMediaPickerAssetId(item.id)}
                                    className="inline-flex shrink-0 items-center gap-1.5 border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                                  >
                                    <ImagePlus size={14} />
                                    Thu vien
                                  </button>
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                                  <Link2 size={11} /> Link khi bam
                                </label>
                                <input
                                  type="text"
                                  value={item.linkUrl}
                                  onChange={(e) => updateCommunityActivity(item.id, "linkUrl", e.target.value)}
                                  placeholder="/tin-tuc/hoat-dong hoac https://..."
                                  className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                                />
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => removeCommunityActivity(item.id)}
                            className="flex h-fit items-center gap-1.5 border border-transparent px-3 py-2 text-xs font-bold text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 xl:self-center"
                          >
                            <Trash2 size={16} />
                            Xoa
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {isWebsiteContent && activeTab === "home" && (
              <div className="bg-white border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6 animate-fade-in">
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="text-base font-black uppercase text-slate-900">Trang chủ</h2>
                    <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                      Mỗi khu vực gom chung chữ, ảnh và link đang hiển thị ngoài trang chủ.
                    </p>
                  </div>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <ExternalLink size={14} />
                    Xem trang chủ
                  </a>
                </div>

                <section className="border border-slate-200 bg-slate-50">
                  <div className="border-b border-slate-200 bg-white px-4 py-3">
                    <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">Ẩn/hiện cụm trang chủ</h3>
                  </div>
                  <div className="grid gap-3 p-4 md:grid-cols-2">
                    {homeSectionList
                      .slice()
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((item) => (
                        <label key={item.id} className="flex cursor-pointer items-start gap-3 border border-slate-200 bg-white p-4">
                          <input
                            type="checkbox"
                            checked={item.enabled}
                            onChange={(e) => updateHomeSection(item.id, e.target.checked)}
                            className="mt-1 h-4 w-4 accent-orange-600"
                          />
                          <span>
                            <span className="block text-sm font-black text-slate-900">{item.label}</span>
                            <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">{item.description}</span>
                          </span>
                        </label>
                      ))}
                  </div>
                </section>

                <section className="border border-orange-200 bg-orange-50 p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wide text-slate-950">Tìm nhanh chữ cần sửa</h3>
                      <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">
                        Gõ tên khu vực, nội dung, key hoặc chọn trang để lọc. Mỗi dòng bên dưới đều có preview và nút mở đúng vị trí ngoài web.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        ["all", "Tất cả"],
                        ["home", "Trang chủ"],
                        ["about", "Giới thiệu"],
                        ["quality", "Chất lượng"],
                      ].map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setHomeTextScope(value as HomeTextScope)}
                          className={`border px-3 py-2 text-xs font-black uppercase tracking-wide transition ${
                            homeTextScope === value
                              ? "border-orange-600 bg-orange-600 text-white"
                              : "border-orange-200 bg-white text-slate-700 hover:border-orange-500 hover:text-orange-700"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 border border-orange-200 bg-white px-3 py-2">
                    <Search size={16} className="text-orange-600" />
                    <input
                      type="search"
                      value={homeTextSearch}
                      onChange={(event) => setHomeTextSearch(event.target.value)}
                      placeholder="Tìm: hero, số liệu, giới thiệu, nút, sản phẩm, nhà máy..."
                      className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                    />
                    <span className="text-xs font-black text-slate-400">{visibleHomeTextList.length}/{homeTextList.length}</span>
                  </div>
                </section>

                {showFactoryProofSection && (
                  <section className="border border-slate-200 bg-slate-50">
                    <div className="border-b border-slate-200 bg-white px-4 py-3">
                      <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">Năng lực sản xuất / bằng chứng thương hiệu</h3>
                      <p className="mt-1 text-[11px] font-semibold text-slate-500">Chữ, ảnh lớn, ảnh từng mục và link đều nằm chung trong cụm này.</p>
                    </div>
                    <div className="grid gap-5 p-4">
                      <div className="grid gap-4">
                        {factoryHomeTextItems.map(renderHomeTextField)}
                      </div>
                      {factoryMainAsset && (
                        <div>
                          <p className="mb-2 text-xs font-black uppercase text-slate-500">Ảnh lớn của cụm</p>
                          {renderAssetEditor(factoryMainAsset)}
                        </div>
                      )}
                      {factoryProofAssets.length > 0 && (
                        <div>
                          <p className="mb-2 text-xs font-black uppercase text-slate-500">Các mục nhỏ trong cụm</p>
                          <div className="grid gap-4 xl:grid-cols-2">
                            {factoryProofAssets.map((item) => renderAssetEditor(item, true))}
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {groupedHomeTextItems.map(({ group, items }) => (
                  <section key={group} className="border border-slate-200 bg-slate-50">
                    <div className="border-b border-slate-200 bg-white px-4 py-3">
                      <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">{group}</h3>
                    </div>
                    <div className="grid gap-4 p-4">
                      {items.map(renderHomeTextField)}
                    </div>
                  </section>
                ))}

                <section className="border border-slate-200 bg-slate-50">
                  <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">Tin tức & bằng chứng ngoài trang chủ</h3>
                      <p className="mt-1 text-[11px] font-semibold text-slate-500">Tự chọn bài nào hiển thị ở block này: bài nội bộ, bài báo ngoài, link sản phẩm hoặc link bất kỳ.</p>
                    </div>
                    <button
                      type="button"
                      onClick={addHomeNewsItem}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow cursor-pointer transition w-fit"
                    >
                      <Plus size={14} />
                      Thêm bài
                    </button>
                  </div>
                  <div className="grid gap-4 p-4">
                    {homeNewsList
                      .slice()
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((item, index) => (
                        <div key={item.id} className="grid gap-4 border border-slate-200 bg-white p-4 lg:grid-cols-[180px_1fr_auto]">
                          <div className="space-y-3">
                            <div className="overflow-hidden border border-slate-200 bg-slate-50">
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.title || `Bài ${index + 1}`} className="h-32 w-full object-cover" />
                              ) : (
                                <div className="flex h-32 items-center justify-center px-4 text-center text-xs font-semibold text-slate-400">
                                  Chưa có ảnh
                                </div>
                              )}
                            </div>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                              <input
                                type="checkbox"
                                checked={item.enabled}
                                onChange={(e) => updateHomeNewsItem(item.id, "enabled", e.target.checked)}
                                className="h-4 w-4 accent-orange-600"
                              />
                              Hiển thị bài này
                            </label>
                          </div>

                          <div className="grid gap-4">
                            <div className="flex items-center justify-between gap-3">
                              <h4 className="text-sm font-black text-slate-950">Bài hiển thị #{index + 1}</h4>
                              <input
                                type="number"
                                value={item.sortOrder}
                                onChange={(e) => updateHomeNewsItem(item.id, "sortOrder", Number(e.target.value) || 0)}
                                className="w-20 border border-slate-300 bg-white p-2 text-xs font-bold outline-none focus:border-orange-500"
                                title="Thứ tự hiển thị"
                              />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Nhãn</label>
                                <input
                                  type="text"
                                  value={item.label}
                                  onChange={(e) => updateHomeNewsItem(item.id, "label", e.target.value)}
                                  placeholder="VD: Báo chí, Công thức, Hậu trường"
                                  className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">URL link khi bấm</label>
                                <input
                                  type="text"
                                  value={item.linkUrl}
                                  onChange={(e) => updateHomeNewsItem(item.id, "linkUrl", e.target.value)}
                                  placeholder="/tin-tuc/bai-viet hoặc https://..."
                                  className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Tiêu đề</label>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateHomeNewsItem(item.id, "title", e.target.value)}
                                placeholder="Tiêu đề bài muốn hiển thị"
                                className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Mô tả</label>
                              <textarea
                                value={item.description}
                                onChange={(e) => updateHomeNewsItem(item.id, "description", e.target.value)}
                                rows={3}
                                placeholder="Mô tả ngắn hiện dưới tiêu đề"
                                className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold leading-5 outline-none focus:border-orange-500"
                              />
                            </div>
                            <div>
                              <label className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase text-slate-500">
                                <ImageIcon size={11} /> URL ảnh bài báo
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={item.imageUrl}
                                  onChange={(e) => updateHomeNewsItem(item.id, "imageUrl", e.target.value)}
                                  placeholder="/uploads/anh.png hoặc https://..."
                                  className="min-w-0 flex-1 border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => setMediaPickerAssetId(`home-news:${item.id}`)}
                                  className="inline-flex shrink-0 items-center gap-1.5 border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                                >
                                  <ImagePlus size={14} />
                                  Thư viện
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase text-slate-500">
                                <ImageIcon size={11} /> Logo báo / nguồn bài viết
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={item.logoUrl || ""}
                                  onChange={(e) => updateHomeNewsItem(item.id, "logoUrl", e.target.value)}
                                  placeholder="/uploads/logo-vnexpress.png hoặc https://..."
                                  className="min-w-0 flex-1 border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => setMediaPickerAssetId(`home-news-logo:${item.id}`)}
                                  className="inline-flex shrink-0 items-center gap-1.5 border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                                >
                                  <ImagePlus size={14} />
                                  Thư viện
                                </button>
                              </div>
                              <p className="mt-1 text-[11px] font-semibold text-slate-400">
                                Logo này sẽ hiện thay icon và nổi bật khi rê chuột vào lớp màu cam.
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeHomeNewsItem(item.id)}
                            className="flex h-fit items-center gap-1.5 border border-transparent px-3 py-2 text-xs font-bold text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 lg:self-center"
                          >
                            <Trash2 size={16} />
                            Xóa
                          </button>
                        </div>
                      ))}
                  </div>
                </section>

                {looseHomeAssets.length > 0 && (
                  <section className="border border-slate-200 bg-slate-50">
                    <div className="border-b border-slate-200 bg-white px-4 py-3">
                      <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">Hình ảnh khác trên trang chủ</h3>
                    </div>
                    <div className="grid gap-4 p-4">
                      {looseHomeAssets.map((item) => renderAssetEditor(item))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {false && activeTab === "home" && (
              <div className="bg-white border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6 animate-fade-in">
                <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="text-base font-black text-slate-900 uppercase">Chữ hiển thị trên trang chủ</h2>
                    <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                      Sửa từng tiêu đề, mô tả, dòng bullet và mốc thời gian đang hiển thị ở trang chủ.
                    </p>
                  </div>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <ExternalLink size={14} />
                    Xem trang chủ
                  </a>
                </div>

                <div className="border border-orange-100 bg-orange-50 p-4 text-xs leading-5 text-slate-700">
                  <p className="font-bold text-slate-900">Cách dùng:</p>
                  <p className="mt-1">
                    Gõ nội dung mới vào ô cần sửa rồi bấm <span className="font-bold">Lưu thay đổi</span>.
                    Nếu để trống, website sẽ dùng chữ mặc định để tránh bị mất nội dung ngoài trang.
                  </p>
                </div>

                <section className="border border-slate-200 bg-slate-50">
                  <div className="border-b border-slate-200 bg-white px-4 py-3">
                    <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">Ẩn/hiện cụm trang chủ</h3>
                    <p className="mt-1 text-[11px] font-semibold text-slate-500">
                      Tắt cụm nào thì cụm đó không hiển thị ngoài trang chủ, dữ liệu chữ vẫn được giữ lại.
                    </p>
                  </div>
                  <div className="grid gap-3 p-4">
                    {homeSectionList
                      .slice()
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((item) => (
                        <label key={item.id} className="flex cursor-pointer items-start gap-3 border border-slate-200 bg-white p-4">
                          <input
                            type="checkbox"
                            checked={item.enabled}
                            onChange={(e) => updateHomeSection(item.id, e.target.checked)}
                            className="mt-1 h-4 w-4 accent-orange-600"
                          />
                          <span>
                            <span className="block text-sm font-black text-slate-900">{item.label}</span>
                            <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">{item.description}</span>
                          </span>
                        </label>
                      ))}
                  </div>
                </section>

                <div className="space-y-6">
                  {Array.from(new Set(homeTextList.map((item) => item.group || "Khác"))).map((group) => {
                    const items = homeTextList
                      .filter((item) => (item.group || "Khác") === group)
                      .sort((a, b) => a.sortOrder - b.sortOrder);

                    return (
                      <section key={group} className="border border-slate-200 bg-slate-50">
                        <div className="border-b border-slate-200 bg-white px-4 py-3">
                          <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">{group}</h3>
                          <p className="mt-1 text-[11px] font-semibold text-slate-500">{items.length} dòng chữ có thể sửa</p>
                        </div>
                        <div className="grid gap-4 p-4">
                          {items.map((item) => (
                            <div key={item.id} className="grid gap-2 lg:grid-cols-[220px_1fr] lg:items-start">
                              <div>
                                <label className="block text-xs font-black text-slate-800">{item.label}</label>
                              </div>
                              {item.multiline ? (
                                <textarea
                                  value={item.value}
                                  onChange={(e) => updateHomeText(item.id, e.target.value)}
                                  rows={3}
                                  className="w-full border border-slate-300 bg-white p-3 text-sm font-semibold leading-6 text-slate-800 outline-none transition focus:border-orange-500"
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={item.value}
                                  onChange={(e) => updateHomeText(item.id, e.target.value)}
                                  className="w-full border border-slate-300 bg-white p-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-orange-500"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </div>
            )}

            {false && activeTab === "home" && (
              <div className="bg-white border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6 animate-fade-in">
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="text-base font-black text-slate-900 uppercase">Hình ảnh trên website</h2>
                    <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                      Mỗi thẻ bên dưới tương ứng với một hình ảnh đang hiển thị trên website.
                    </p>
                  </div>
                  <button
                    onClick={addAsset}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow cursor-pointer transition"
                  >
                    <Plus size={14} />
                    Thêm hình ảnh
                  </button>
                </div>

                {homeAssetList.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <AlertCircle className="mx-auto text-slate-300 mb-2" size={36} />
                    <p className="text-xs font-semibold">Chưa có ảnh/link nào được cấu hình.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {homeAssetList.map((item) => {
                      const meta = getPageAssetMeta(item);
                      const isFixedSlot = Boolean(PAGE_ASSET_META[item.key]);
                      const isFactoryProofAsset = FACTORY_PROOF_ASSET_KEYS.has(item.key);
                      const factoryProofTitleKey = getFactoryProofTitleKey(item.key);
                      const factoryProofTitle = factoryProofTitleKey
                        ? homeTextList.find((textItem) => textItem.key === factoryProofTitleKey)?.value || ""
                        : "";

                      return (
                        <div key={item.id} className="grid gap-4 border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[180px_1fr_auto]">
                          <div className="overflow-hidden border border-slate-200 bg-white">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.label || item.key} className="h-36 w-full object-cover" />
                            ) : (
                              <div className="flex h-36 items-center justify-center px-4 text-center text-xs font-semibold text-slate-400">
                                Không có ảnh
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 space-y-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="bg-orange-500 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                                    {meta.page}
                                  </span>
                                </div>
                                <h3 className="mt-2 text-base font-black text-slate-950">{meta.position}</h3>
                                <p className="mt-1 text-xs font-medium leading-5 text-slate-500">{meta.note}</p>
                                {isFactoryProofAsset && (
                                  <p className="mt-1 text-xs font-bold leading-5 text-orange-600">
                                    Có thể đổi tên mục và hình ảnh ngay tại thẻ này.
                                  </p>
                                )}
                              </div>
                            </div>

                            {isFactoryProofAsset && factoryProofTitleKey && (
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tên mục</label>
                                <input
                                  type="text"
                                  value={factoryProofTitle}
                                  onChange={(e) => updateHomeTextByKey(factoryProofTitleKey, e.target.value)}
                                  placeholder="VD: Quy trình sản xuất"
                                  className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                                />
                              </div>
                            )}

                            <div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nhãn hiển thị</label>
                                <input
                                  type="text"
                                  value={item.label}
                                  onChange={(e) => updateAsset(item.id, "label", e.target.value)}
                                  placeholder="Tên hiển thị cho vị trí này"
                                  className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                                  <ImageIcon size={11} /> URL ảnh
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={item.imageUrl}
                                    onChange={(e) => updateAsset(item.id, "imageUrl", e.target.value)}
                                    placeholder="/uploads/anh-that.png hoặc https://..."
                                    className="min-w-0 flex-1 border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setMediaPickerAssetId(item.id)}
                                    className="inline-flex shrink-0 items-center gap-1.5 border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                                  >
                                    <ImagePlus size={14} />
                                    Thư viện
                                  </button>
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                                  <Link2 size={11} /> URL link khi bấm
                                </label>
                                <input
                                  type="text"
                                  value={item.linkUrl}
                                  onChange={(e) => updateAsset(item.id, "linkUrl", e.target.value)}
                                  placeholder="/tin-tuc/bai-viet hoặc https://..."
                                  className="w-full border border-slate-300 bg-white p-2 text-xs font-semibold outline-none focus:border-orange-500"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 lg:flex-col lg:items-end lg:justify-center">
                            <button
                              onClick={() => setPreviewAsset(item)}
                              className="flex items-center gap-1.5 border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                              title="Xem thử ảnh và link"
                            >
                              <Eye size={16} />
                              Xem thử
                            </button>
                            {!isFixedSlot && (
                              <button
                                onClick={() => removeAsset(item.id)}
                                className="flex items-center gap-1.5 border border-transparent px-3 py-2 text-xs font-bold text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                                title="Xóa dòng này"
                              >
                                <Trash2 size={16} />
                                Xóa
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {previewAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
            <div className="w-full max-w-6xl overflow-hidden border border-slate-200 bg-white shadow-2xl">
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">
                    Vị trí thật trên website
                  </p>
                  <h3 className="mt-1 text-lg font-black text-slate-950">
                    {previewAsset.label || previewAsset.key || "Ảnh/link chưa đặt tên"}
                  </h3>
                  <p className="mt-1 text-xs font-bold text-slate-500">
                    {getPageAssetMeta(previewAsset).page} / {getPageAssetMeta(previewAsset).position}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewAsset(null)}
                  className="border border-slate-200 p-2 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                  aria-label="Đóng preview"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid gap-5 p-5 lg:grid-cols-[1.7fr_0.9fr]">
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Khung xem trang thật
                    </p>
                    <a
                      href={getPageAssetMeta(previewAsset).previewPath}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-black text-orange-600 hover:text-orange-700"
                    >
                      Mở vị trí này trên web
                      <ExternalLink size={13} />
                    </a>
                  </div>
                  <div className="h-[520px] overflow-hidden border border-slate-200 bg-slate-100">
                    <iframe
                      src={getPageAssetMeta(previewAsset).previewPath}
                      title={`Vị trí thật của ${previewAsset.label || previewAsset.key}`}
                      className="h-full w-full border-0"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border border-orange-100 bg-orange-50 p-4">
                    <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-orange-700">Nó nằm ở đâu?</label>
                    <p className="text-sm font-black text-slate-950">{getPageAssetMeta(previewAsset).page}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">{getPageAssetMeta(previewAsset).position}</p>
                    <p className="mt-2 text-xs font-medium leading-5 text-slate-600">{getPageAssetMeta(previewAsset).note}</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">Ảnh đang cấu hình</label>
                    <div className="min-h-40 border border-slate-200 bg-slate-100">
                      {previewAsset.imageUrl ? (
                        <img
                          src={previewAsset.imageUrl}
                          alt={previewAsset.label || previewAsset.key}
                          className="h-40 w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-40 items-center justify-center px-6 text-center text-sm font-semibold text-slate-400">
                          Chưa nhập URL ảnh cho mục này.
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">URL ảnh</label>
                    <div className="break-all border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-700">
                      {previewAsset.imageUrl || "Chưa có"}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">Link khi bấm</label>
                    <div className="break-all border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-700">
                      {previewAsset.linkUrl || "Chưa có"}
                    </div>
                  </div>

                  {previewAsset.linkUrl ? (
                    <a
                      href={previewAsset.linkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-orange-500 px-4 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-orange-600"
                    >
                      Mở link kiểm tra
                      <ExternalLink size={14} />
                    </a>
                  ) : (
                    <p className="text-xs font-semibold leading-5 text-slate-500">
                      Nếu muốn bấm được ngoài website, nhập thêm URL ở ô &quot;URL link khi bấm&quot;.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <MediaPickerModal
          open={Boolean(mediaPickerAssetId)}
          onClose={() => setMediaPickerAssetId(null)}
          onSelect={handleMediaSelect}
        />
      </div>
    </ProtectedRoute>
  );
}

export default function MarketingPage() {
  return (
    <Suspense fallback={null}>
      <MarketingPageContent />
    </Suspense>
  );
}
