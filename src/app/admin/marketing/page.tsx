"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { 
  Newspaper, 
  MessageSquare, 
  Video, 
  Plus, 
  Trash2, 
  Save, 
  Loader,
  AlertCircle,
  Star,
  Globe,
  Play,
  Calendar,
  User,
  Settings
} from "lucide-react";
import toast from "react-hot-toast";

interface PressItem {
  id: string;
  sourceName: string;
  title: string;
  link: string;
  publishDate: string;
}

interface FeedbackItem {
  id: string;
  customerName: string;
  roleOrLocation: string;
  rating: number;
  comment: string;
}

interface VideoItem {
  id: string;
  platform: "tiktok" | "youtube";
  videoId: string;
  title: string;
  url: string;
}

export default function MarketingPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"press" | "feedback" | "videos">("press");

  // State for assets lists
  const [pressList, setPressList] = useState<PressItem[]>([]);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [videoList, setVideoList] = useState<VideoItem[]>([]);

  useEffect(() => {
    if (token) {
      fetchMarketingConfig();
    }
  }, [token]);

  const fetchMarketingConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings/marketing");
      if (res.ok) {
        const data = await res.json();
        if (data && data.data) {
          setPressList(data.data.press || []);
          setFeedbackList(data.data.feedback || []);
          setVideoList(data.data.videos || []);
        }
      }
    } catch (error) {
      console.error("Failed to load marketing settings", error);
      toast.error("Không thể tải cấu hình marketing");
    } finally {
      setLoading(false);
    }
  };

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
        }),
      });

      if (!res.ok) throw new Error("Failed to save");
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

  // Update Field Helpers
  const updatePress = (id: string, field: keyof PressItem, val: string) => {
    setPressList(pressList.map((item) => item.id === id ? { ...item, [field]: val } : item));
  };

  const updateFeedback = (id: string, field: keyof FeedbackItem, val: any) => {
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
                              onChange={(e) => updateVideo(item.id, "platform", e.target.value as any)}
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

          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
