"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import {
  Save,
  Loader,
  AlertCircle,
  Check,
  Tv,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  PlayCircle
} from "lucide-react";
import Link from "next/link";

interface TikTokVideo {
  id: string;
  title: string;
  authorName?: string;
  authorUrl?: string;
}

interface PageData {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  content: TikTokVideo[];
}

function createEmptyVideos(): TikTokVideo[] {
  return Array.from({ length: 3 }, () => ({
    id: "",
    title: "",
    authorName: "",
    authorUrl: "",
  }));
}

export default function AdminTikTokSettings() {
  const { token } = useAuth();
  
  // Page states
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [videos, setVideos] = useState<TikTokVideo[]>(createEmptyVideos);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (token) {
      fetchOrInitSettings();
    }
  }, [token]);

  const fetchOrInitSettings = async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Try to fetch existing settings
      const res = await fetch("/api/pages/slug/tiktok-settings", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setPageData(data);
        if (Array.isArray(data.content) && data.content.length > 0) {
          // Merge to ensure 3 videos
          const merged = createEmptyVideos();
          data.content.forEach((v: any, index: number) => {
            if (index < 3 && v && typeof v === "object") {
              merged[index] = {
                id: v.id || "",
                title: v.title || "",
                authorName: v.authorName || "",
                authorUrl: v.authorUrl || ""
              };
            }
          });
          setVideos(merged);
        }
      } else if (res.status === 404) {
        setPageData(null);
        setVideos(createEmptyVideos());
      } else {
        setError("Có lỗi xảy ra khi tải cấu hình");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối cơ sở dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoChange = (index: number, field: keyof TikTokVideo, value: string) => {
    const newVideos = [...videos];
    newVideos[index] = {
      ...newVideos[index],
      [field]: value
    };
    setVideos(newVideos);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    // Validate video inputs
    for (let i = 0; i < 3; i++) {
      if (!videos[i].id.trim()) {
        setError(`Vui lòng điền mã video TikTok thứ ${i + 1}`);
        setSaving(false);
        return;
      }
      if (!videos[i].title.trim()) {
        setError(`Vui lòng điền tiêu đề hiển thị video thứ ${i + 1}`);
        setSaving(false);
        return;
      }
    }

    try {
      const res = await fetch(pageData ? `/api/pages/${pageData.id}` : "/api/pages", {
        method: pageData ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: "Cấu hình Video TikTok",
          slug: "tiktok-settings",
          status: "PUBLISHED", // Keep published so page can load without token
          content: videos
        })
      });

      if (res.ok) {
        setSuccess("Lưu cấu hình video TikTok thành công!");
        const updated = await res.json();
        setPageData(updated);
      } else {
        const errData = await res.json();
        setError(errData.error || "Không thể lưu cấu hình");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối hệ thống khi lưu");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "EDITOR"]}>
      <div className="space-y-6">
        {/* Top bar navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Tv className="text-primary-dark" size={28} />
              Quản lý Video TikTok
            </h1>
            <p className="text-slate-500 text-sm mt-1">Thay đổi liên kết, tiêu đề và tài khoản nguồn của các video hiển thị ở trang Giới thiệu.</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/gioi-thieu"
              target="_blank"
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 text-xs font-bold transition-all shadow-sm"
            >
              Xem trang giới thiệu <ExternalLink size={14} />
            </Link>
            <button
              onClick={handleSave}
              disabled={loading || saving}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 text-xs font-bold transition-all shadow-md shadow-primary/10 hover:shadow-lg disabled:opacity-50"
            >
              {saving ? <Loader className="animate-spin" size={14} /> : <Save size={14} />}
              <span>Lưu cấu hình</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-4 bg-red-50 border border-red-200">
            <AlertCircle className="text-red-600 mt-0.5 shrink-0" size={18} />
            <p className="text-sm text-red-700 font-semibold leading-relaxed">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2.5 p-4 bg-green-50 border border-green-200">
            <Check className="text-green-600 mt-0.5 shrink-0" size={18} />
            <p className="text-sm text-green-700 font-semibold leading-relaxed">{success}</p>
          </div>
        )}

        {loading ? (
          <div className="bg-white border border-slate-100 p-20 flex flex-col items-center justify-center gap-3">
            <Loader className="animate-spin text-primary-dark" size={36} />
            <p className="text-sm font-semibold text-slate-400">Đang tải thông tin cấu hình...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form Inputs (3 cols) */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
                  Cấu hình chi tiết nguồn video
                </h2>

                <div className="space-y-6">
                  {videos.map((video, index) => (
                    <div key={index} className="p-5 bg-slate-50 border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                          <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px]">
                            {index + 1}
                          </span>
                          Video TikTok thứ {index + 1}
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700">Mã ID Video TikTok</label>
                          <input
                            type="text"
                            value={video.id}
                            placeholder="Nhap ID video TikTok"
                            onChange={(e) => handleVideoChange(index, "id", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
                          />
                          <p className="text-[10px] text-slate-400 mt-1">
                            Lấy mã số ở phần đuôi URL video (ví dụ: video/<strong className="text-slate-700">VIDEO_ID</strong>)
                          </p>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700">Tiêu đề hiển thị</label>
                          <input
                            type="text"
                            value={video.title}
                            placeholder="Nhap tieu de video"
                            onChange={(e) => handleVideoChange(index, "title", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                          <p className="text-[10px] text-slate-400 mt-1">Tiêu đề phụ mô tả ngắn gọn nội dung của video này.</p>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700">Tên tài khoản (Ví dụ: @ten_tai_khoan)</label>
                          <input
                            type="text"
                            value={video.authorName || ""}
                            placeholder="@ten_tai_khoan"
                            onChange={(e) => handleVideoChange(index, "authorName", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700">Link tài khoản TikTok chính chủ</label>
                          <input
                            type="text"
                            value={video.authorUrl || ""}
                            placeholder="https://www.tiktok.com/@ten_tai_khoan"
                            onChange={(e) => handleVideoChange(index, "authorUrl", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
                          />
                          <p className="text-[10px] text-slate-400 mt-1">Địa chỉ profile tài khoản để dẫn link click cho khách xem.</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 text-xs font-bold transition-all shadow-md shadow-primary/10 hover:shadow-lg disabled:opacity-50"
                  >
                    {saving ? <Loader className="animate-spin" size={14} /> : <Save size={14} />}
                    <span>Lưu cấu hình</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Preview (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-950 text-white border border-slate-800 p-6 sm:p-8 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,244,238,0.04),transparent_40%)]" />
                <h2 className="text-lg font-bold text-white border-b border-white/10 pb-4 relative z-10 flex items-center gap-2">
                  <Sparkles className="text-cyan-400" size={18} />
                  Xem trước giao diện
                </h2>

                <div className="mt-6 space-y-8 relative z-10 flex flex-col items-center">
                  {videos.map((video, idx) => (
                    <div key={idx} className="w-full max-w-[210px] flex flex-col items-center">
                      {/* Phone frame preview */}
                      <div className="w-full aspect-[9/19] rounded-[30px] p-[2px] bg-gradient-to-tr from-[#25F4EE] via-slate-800 to-[#FE2C55] shadow-md relative overflow-hidden">
                        <div className="w-full h-full rounded-[28px] p-1 bg-slate-950 flex flex-col justify-between overflow-hidden relative">
                          {/* Notch */}
                          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-black rounded-full z-30 border border-white/5 flex items-center justify-center">
                            <div className="w-6 h-0.5 rounded-full bg-zinc-800" />
                          </div>

                          {/* Screen */}
                          <div className="w-full h-full rounded-[24px] overflow-hidden bg-black relative flex items-center justify-center">
                            {video.id.trim() ? (
                              <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-center p-4">
                                <PlayCircle className="text-cyan-400 mb-2" size={32} />
                                <span className="text-[10px] font-mono text-zinc-400 truncate max-w-full">
                                  ID: {video.id}
                                </span>
                                <span className="text-[10px] text-zinc-500 italic mt-1 leading-normal">
                                  Hệ thống sẽ tải video thật tại trang ngoài
                                </span>
                              </div>
                            ) : (
                              <div className="text-[10px] text-slate-500">Chưa nhập ID</div>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="mt-3 text-xs font-black uppercase text-center tracking-[0.16em] text-cyan-400 block truncate max-w-full">
                        {video.title || "Chưa có tiêu đề"}
                      </span>
                      {video.authorName && (
                        <span className="text-[10px] text-zinc-500 mt-0.5 tracking-wider truncate max-w-full block">
                          Kênh: {video.authorName}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

