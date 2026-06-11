"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import CurtainHover from "@/components/shared/CurtainHover";
import {
  Image as ImageIcon,
  Search,
  Trash2,
  Upload,
  Loader,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Calendar,
  HardDrive,
  User,
  AlertCircle,
  X,
} from "lucide-react";

interface MediaItem {
  id: string;
  fileName: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: string;
  uploader?: { name: string | null; email: string };
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getPublicMediaUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (typeof window === "undefined") {
    return url;
  }

  return `${window.location.origin}${url}`;
}

export default function MediaLibraryPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fetchMedia = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        ...(search ? { search } : {}),
      });
      const res = await fetch(`/api/admin/media?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch media", err);
    } finally {
      setLoading(false);
    }
  }, [token, page, search]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleUploadFiles = async (files: FileList | File[]) => {
    if (!token) return;
    setUploading(true);
    setUploadError("");

    const fileArray = Array.from(files);
    let hasError = false;

    for (const file of fileArray) {
      if (!file.type.startsWith("image/")) {
        setUploadError("Chỉ chấp nhận tệp hình ảnh");
        hasError = true;
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Kích thước file vượt quá 5MB");
        hasError = true;
        continue;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!res.ok) {
          const data = await res.json();
          setUploadError(data.error || "Upload thất bại");
          hasError = true;
        }
      } catch {
        setUploadError("Không thể kết nối server");
        hasError = true;
      }
    }

    setUploading(false);
    if (!hasError) {
      setPage(1);
    }
    fetchMedia();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUploadFiles(e.target.files);
    }
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setDeleteConfirmId(null);
        fetchMedia();
      }
    } catch {
      console.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const handleCopy = async (url: string, id: string) => {
    const publicUrl = getPublicMediaUrl(url);

    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = publicUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "EDITOR"]}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 bg-primary flex items-center justify-center shadow-md shadow-primary/10">
                <ImageIcon size={20} className="text-white" />
              </div>
              Thư viện phương tiện
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Quản lý tất cả hình ảnh đã tải lên hệ thống. Tổng cộng {total} ảnh.
            </p>
          </div>
        </div>

        {/* Upload Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed p-8 transition-all text-center ${
            dragActive
              ? "border-primary bg-orange-50/50"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`w-14 h-14 flex items-center justify-center transition ${
              dragActive ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
            }`}>
              <Upload size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                {uploading ? "Đang tải lên..." : "Kéo thả ảnh vào đây hoặc"}
              </p>
              <label className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-bold cursor-pointer hover:bg-primary-dark transition shadow-sm shadow-primary/10">
                <Upload size={14} />
                Chọn file từ máy tính
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInput}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <p className="text-[10px] text-slate-400 mt-2">Hỗ trợ: JPG, PNG, GIF, WebP — Tối đa 5MB/ảnh</p>
            </div>
          </div>
        </div>

        {uploadError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200">
            <AlertCircle className="text-red-500 shrink-0" size={16} />
            <p className="text-xs text-red-700 font-semibold">{uploadError}</p>
            <button onClick={() => setUploadError("")} className="ml-auto text-red-400 hover:text-red-600">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white border border-slate-100 p-4 shadow-sm">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Tìm kiếm ảnh theo tên file..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>
        </div>

        {/* Media Grid */}
        <div className="bg-white border border-slate-100 p-6 shadow-sm min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="animate-spin text-primary-dark" size={32} />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <ImageIcon size={48} className="mb-4" />
              <p className="text-lg font-bold text-slate-500">Chưa có ảnh nào</p>
              <p className="text-xs mt-1">Hãy upload ảnh đầu tiên bằng khu vực phía trên</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-slate-50 border border-slate-100 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all"
                >
                  {/* Image */}
                  <button
                    type="button"
                    onClick={() => setPreviewItem(item)}
                    className="w-full aspect-square overflow-hidden cursor-pointer block"
                  >
                    <CurtainHover
                      overlayMode="admin"
                      overlayContent={
                        <span className="text-[10px] font-extrabold uppercase tracking-wider">Xem / Sửa</span>
                      }
                      className="w-full h-full"
                    >
                      <img
                        src={item.url}
                        alt={item.fileName}
                        className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-300"
                      />
                    </CurtainHover>
                  </button>

                  {/* Info overlay */}
                  <div className="p-2.5 space-y-1">
                    <p className="text-[10px] font-bold text-slate-800 truncate">{item.fileName}</p>
                    <p className="text-[9px] text-slate-400">{formatBytes(item.size)}</p>
                  </div>

                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleCopy(item.url, item.id)}
                      className="p-1.5 bg-white/90 text-slate-600 hover:text-primary-dark border border-slate-200 shadow-sm transition"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-1.5 bg-white/90 text-slate-600 hover:text-red-500 border border-slate-200 shadow-sm transition"
                      title="Xóa ảnh"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8 pt-6 border-t border-slate-100">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 disabled:opacity-30 transition"
              >
                <ChevronLeft size={14} /> Trước
              </button>
              <span className="text-xs font-bold text-slate-600">
                Trang {page}/{totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 disabled:opacity-30 transition"
              >
                Sau <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
            <div className="relative bg-white p-6 shadow-2xl border border-slate-200 max-w-sm w-full mx-4 space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900">Xác nhận xóa ảnh</h3>
              <p className="text-sm text-slate-600">
                Ảnh sẽ bị xóa vĩnh viễn khỏi thư viện và máy chủ. Hành động này không thể hoàn tác.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 text-xs font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 transition"
                >
                  {deleting ? "Đang xóa..." : "Xóa vĩnh viễn"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {previewItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setPreviewItem(null)} />
            <div className="relative bg-white max-w-3xl w-full mx-4 shadow-2xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
                <h3 className="text-sm font-extrabold text-slate-900 truncate pr-4">{previewItem.fileName}</h3>
                <button onClick={() => setPreviewItem(null)} className="p-1.5 text-slate-400 hover:text-slate-900 transition">
                  <X size={18} />
                </button>
              </div>
              <div className="bg-slate-900 flex items-center justify-center p-4 max-h-[60vh]">
                <img
                  src={previewItem.url}
                  alt={previewItem.fileName}
                  className="max-w-full max-h-[55vh] object-contain"
                />
              </div>
              <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-500">
                  <HardDrive size={13} className="text-primary-dark" />
                  <span className="font-semibold">{formatBytes(previewItem.size)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <ImageIcon size={13} className="text-primary-dark" />
                  <span className="font-semibold">{previewItem.mimeType}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar size={13} className="text-primary-dark" />
                  <span className="font-semibold">{formatDate(previewItem.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <User size={13} className="text-primary-dark" />
                  <span className="font-semibold">{previewItem.uploader?.name || previewItem.uploader?.email || "—"}</span>
                </div>
              </div>
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center gap-2">
                <input
                  readOnly
                  value={getPublicMediaUrl(previewItem.url)}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 text-xs font-mono text-slate-600"
                />
                <button
                  onClick={() => handleCopy(previewItem.url, previewItem.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold hover:bg-primary-dark transition"
                >
                  {copiedId === previewItem.id ? <><Check size={12} /> Đã copy</> : <><Copy size={12} /> Copy URL</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}


