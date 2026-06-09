"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  X,
  Search,
  Check,
  Loader,
  Upload,
  Image as ImageIcon,
  Copy,
  ChevronLeft,
  ChevronRight,
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

interface MediaPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export function MediaPickerModal({ open, onClose, onSelect }: MediaPickerModalProps) {
  const { token } = useAuth();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fetchMedia = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "12",
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
    if (open) {
      fetchMedia();
    }
  }, [open, fetchMedia]);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSelectedId(null);
      setUploadError("");
    }
  }, [open]);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        // Refresh the media list
        setPage(1);
        await fetchMedia();
      } else {
        setUploadError(data.error || "Tải ảnh thất bại");
      }
    } catch {
      setUploadError("Không thể kết nối server");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleConfirm = () => {
    const selected = items.find((i) => i.id === selectedId);
    if (selected) {
      onSelect(selected.url);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-4xl max-h-[85vh] mx-4 shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary flex items-center justify-center">
              <ImageIcon size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Thư viện ảnh</h2>
              <p className="text-[10px] text-slate-500 font-semibold">{total} ảnh đã tải lên</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-slate-100 shrink-0">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm kiếm theo tên file..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold cursor-pointer hover:bg-primary-dark transition shrink-0">
            <Upload size={14} />
            {uploading ? "Đang tải..." : "Upload ảnh"}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
        {uploadError && (
          <div className="px-6 py-2 bg-red-50 border-b border-red-100">
            <p className="text-xs text-red-600 font-semibold">{uploadError}</p>
          </div>
        )}

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="animate-spin text-primary-dark" size={28} />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <ImageIcon size={40} className="mb-3" />
              <p className="text-sm font-semibold">Chưa có ảnh nào</p>
              <p className="text-xs mt-1">Hãy upload ảnh đầu tiên</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id === selectedId ? null : item.id)}
                  className={`group relative aspect-square bg-slate-50 border-2 overflow-hidden transition-all hover:shadow-md ${
                    selectedId === item.id
                      ? "border-primary ring-2 ring-orange-500/20"
                      : "border-slate-100 hover:border-slate-300"
                  }`}
                >
                  <img
                    src={item.url}
                    alt={item.fileName}
                    className="w-full h-full object-cover"
                  />
                  {selectedId === item.id && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="w-8 h-8 bg-primary flex items-center justify-center shadow-lg">
                        <Check size={16} className="text-white" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition">
                    <p className="text-[9px] text-white font-semibold truncate">{item.fileName}</p>
                    <p className="text-[8px] text-white/70">{formatBytes(item.size)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 text-slate-400 hover:text-slate-900 disabled:opacity-30 transition"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-slate-600">
              Trang {page}/{totalPages || 1}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 text-slate-400 hover:text-slate-900 disabled:opacity-30 transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedId}
              className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-dark disabled:opacity-40 transition shadow-sm"
            >
              Chọn ảnh này
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


