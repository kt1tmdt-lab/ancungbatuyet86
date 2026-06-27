"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
  X
} from "lucide-react";
import toast from "react-hot-toast";
import {
  normalizeMarketingConfig,
  type FeedbackItem,
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
  home_factory_proof_1: {
    page: "Trang chủ",
    position: "Bằng chứng 1",
    note: "Dòng nội dung bên phải ảnh nhà máy.",
    previewPath: "/#factory-proof",
  },
  home_factory_proof_2: {
    page: "Trang chủ",
    position: "Bằng chứng 2",
    note: "Dòng nội dung bên phải ảnh nhà máy.",
    previewPath: "/#factory-proof",
  },
  home_factory_proof_3: {
    page: "Trang chủ",
    position: "Bằng chứng 3",
    note: "Dòng nội dung bên phải ảnh nhà máy.",
    previewPath: "/#factory-proof",
  },
  home_factory_proof_4: {
    page: "Trang chủ",
    position: "Bằng chứng 4",
    note: "Dòng nội dung bên phải ảnh nhà máy.",
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
  process_farm: { page: "Quy trình", position: "Nguyên liệu đầu vào", note: "Ảnh/link bước quy trình.", previewPath: "/quy-trinh#process-steps" },
  process_inspect: { page: "Quy trình", position: "Kiểm định nguyên liệu", note: "Ảnh/link bước quy trình.", previewPath: "/quy-trinh#process-steps" },
  process_cooking: { page: "Quy trình", position: "Sơ chế và chế biến", note: "Ảnh/link bước quy trình.", previewPath: "/quy-trinh#process-steps" },
  process_qc: { page: "Quy trình", position: "Kiểm soát chất lượng", note: "Ảnh/link bước quy trình.", previewPath: "/quy-trinh#process-steps" },
  process_packaging: { page: "Quy trình", position: "Đóng gói", note: "Ảnh/link bước quy trình.", previewPath: "/quy-trinh#process-steps" },
  process_delivery: { page: "Quy trình", position: "Giao hàng và phân phối", note: "Ảnh/link bước quy trình.", previewPath: "/quy-trinh#process-steps" },
  process_factory: { page: "Quy trình", position: "Khu vực nhà máy", note: "Ảnh/link phần nhà máy.", previewPath: "/quy-trinh#process-factory" },
  process_documents: { page: "Quy trình", position: "Hồ sơ và chứng từ", note: "Ảnh/link phần chứng từ.", previewPath: "/quy-trinh#process-documents" },
};

function getPageAssetMeta(item: PageAssetItem) {
  return PAGE_ASSET_META[item.key] || {
    page: "Tùy chỉnh",
    position: item.label || item.key || "Vị trí mới",
    note: "Mục tùy chỉnh, chỉ có tác dụng khi code ngoài web đọc đúng key này.",
    previewPath: "/",
  };
}

function MarketingPageContent() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"press" | "feedback" | "videos" | "trust" | "assets">(
    searchParams.get("tab") === "assets" ? "assets" : "press",
  );
  const [previewAsset, setPreviewAsset] = useState<PageAssetItem | null>(null);
  const [mediaPickerAssetId, setMediaPickerAssetId] = useState<string | null>(null);

  // State for assets lists
  const [pressList, setPressList] = useState<PressItem[]>([]);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [videoList, setVideoList] = useState<VideoItem[]>([]);
  const [assetList, setAssetList] = useState<PageAssetItem[]>([]);
  const [trustList, setTrustList] = useState<TrustSectionItem[]>([]);

  useEffect(() => {
    if (searchParams.get("tab") === "assets") {
      const timer = window.setTimeout(() => setActiveTab("assets"), 0);
      return () => window.clearTimeout(timer);
    }
  }, [searchParams]);

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
        setAssetList(config.pageAssets);
        setTrustList(config.trustSections);
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings/marketing", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          press: pressList,
          feedback: feedbackList,
          videos: videoList,
          pageAssets: assetList,
          trustSections: trustList,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      const config = normalizeMarketingConfig(data?.data);
      setPressList(config.press);
      setFeedbackList(config.feedback);
      setVideoList(config.videos);
      setAssetList(config.pageAssets);
      setTrustList(config.trustSections);
      toast.success("Đã lưu tài sản truyền thông thành công!");
    } catch (error) {
      console.error("Failed to save marketing settings", error);
      toast.error("Lưu cấu hình truyền thông thất bại");
    } finally {
      setIsSaving(false);
    }
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

  const addAsset = () => {
    const newItem: PageAssetItem = {
      id: Date.now().toString(),
      key: "",
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

  const updateTrustSection = (
    id: string,
    field: keyof TrustSectionItem,
    val: string | boolean,
  ) => {
    setTrustList(trustList.map((item) => item.id === id ? { ...item, [field]: val } : item));
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "MARKETING", "EDITOR"]}>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Settings className="text-orange-500" size={28} />
              Quản lý truyền thông (Marketing)
            </h1>
            <p className="text-slate-500 mt-1">Cấu hình danh sách bài báo viết về thương hiệu, nhận xét từ khách hàng và video clip nổi bật.</p>
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

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("press")}
            className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "press"
                ? "border-orange-500 text-orange-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-950"
            }`}
          >
            <Newspaper size={16} />
            Báo chí nhắc tới ({pressList.length})
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "feedback"
                ? "border-orange-500 text-orange-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-950"
            }`}
          >
            <MessageSquare size={16} />
            Đánh giá khách hàng ({feedbackList.length})
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "videos"
                ? "border-orange-500 text-orange-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-950"
            }`}
          >
            <Video size={16} />
            Video truyền thông ({videoList.length})
          </button>
          <button
            onClick={() => setActiveTab("trust")}
            className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "trust"
                ? "border-orange-500 text-orange-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-950"
            }`}
          >
            <ShieldCheck size={16} />
            Uy tin ({trustList.filter((item) => item.enabled).length})
          </button>
          <button
            onClick={() => setActiveTab("assets")}
            className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "assets"
                ? "border-orange-500 text-orange-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-950"
            }`}
          >
            <ImageIcon size={16} />
            Ảnh & link trang ({assetList.length})
          </button>
        </div>

        {loading ? (
          <div className="h-96 bg-slate-100 animate-pulse border border-slate-200"></div>
        ) : (
          <div className="space-y-6">
            
            {/* Press Tab Content */}
            {activeTab === "press" && (
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
            {activeTab === "feedback" && (
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
            {activeTab === "videos" && (
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

            {activeTab === "trust" && (
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

            {activeTab === "assets" && (
              <div className="bg-white border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6 animate-fade-in">
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="text-base font-black text-slate-900 uppercase">Ảnh và link có thể cấu hình</h2>
                    <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                      Mỗi dòng là một vị trí đang dùng ngoài website. Bạn chỉ cần sửa ảnh, chữ hiển thị và link.
                    </p>
                  </div>
                  <button
                    onClick={addAsset}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow cursor-pointer transition"
                  >
                    <Plus size={14} />
                    Thêm ảnh/link
                  </button>
                </div>

                <div className="border border-orange-100 bg-orange-50 p-4 text-xs leading-5 text-slate-700">
                  <p className="font-bold text-slate-900">Logic sử dụng:</p>
                  <p className="mt-1">
                    Các vị trí có sẵn là những chỗ website đang đọc dữ liệu. Mặc định chỉ nên sửa
                    <span className="font-bold"> nhãn hiển thị, URL ảnh, URL link</span>. Mã key chỉ để hệ thống nhận ra đúng vị trí.
                  </p>
                </div>

                {assetList.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <AlertCircle className="mx-auto text-slate-300 mb-2" size={36} />
                    <p className="text-xs font-semibold">Chưa có ảnh/link nào được cấu hình.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assetList.map((item, index) => {
                      const meta = getPageAssetMeta(item);
                      const isFixedSlot = Boolean(PAGE_ASSET_META[item.key]);

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
                                  <span className="text-xs font-black text-slate-400">#{index + 1}</span>
                                </div>
                                <h3 className="mt-2 text-base font-black text-slate-950">{meta.position}</h3>
                                <p className="mt-1 text-xs font-medium leading-5 text-slate-500">{meta.note}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.9fr_1fr]">
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
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mã vị trí</label>
                                <input
                                  type="text"
                                  value={item.key}
                                  onChange={(e) => updateAsset(item.id, "key", e.target.value)}
                                  readOnly={isFixedSlot}
                                  placeholder="process_factory"
                                  className={`w-full border border-slate-300 p-2 text-xs font-mono font-bold outline-none focus:border-orange-500 ${
                                    isFixedSlot ? "bg-slate-100 text-slate-500" : "bg-white text-slate-900"
                                  }`}
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
          onSelect={(url) => {
            if (mediaPickerAssetId) {
              if (activeTab === "trust") {
                updateTrustSection(mediaPickerAssetId, "imageUrl", url);
              } else {
                updateAsset(mediaPickerAssetId, "imageUrl", url);
              }
            }
            setMediaPickerAssetId(null);
          }}
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
