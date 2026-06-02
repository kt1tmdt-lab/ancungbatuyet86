"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { 
  AlertCircle, 
  Check, 
  X, 
  Loader, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  ExternalLink,
  Send,
  Eye
} from "lucide-react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED" | "ARCHIVED";
  coverImageUrl?: string;
  author: { id: string; name: string; email: string };
  category?: { id: string; name: string; slug: string } | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  rejectedReason?: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function PostsTable({ 
  status: propStatus,
  onActionSuccess
}: { 
  status?: string;
  onActionSuccess?: () => void;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState(propStatus || "");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Reject Modal/Inline state
  const [rejectingPostId, setRejectingPostId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  const { user, token } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [statusFilter, categoryFilter, searchQuery]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Failed to fetch categories");
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = "/api/posts?";
      const params = new URLSearchParams();
      
      if (statusFilter) params.append("status", statusFilter);
      if (categoryFilter) params.append("categoryId", categoryFilter);
      if (searchQuery) params.append("search", searchQuery);

      const res = await fetch(url + params.toString(), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (postId: string) => {
    setActionLoading(postId);
    try {
      const res = await fetch("/api/posts/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, action: "approve" }),
      });
      if (res.ok) {
        // If we are viewing pending only, remove it; else update its status
        if (propStatus === "PENDING_REVIEW") {
          setPosts(posts.filter((p) => p.id !== postId));
        } else {
          setPosts(posts.map(p => p.id === postId ? { ...p, status: "PUBLISHED" } : p));
        }
        if (onActionSuccess) onActionSuccess();
      } else {
        const errData = await res.json();
        alert(errData.error || "Không thể duyệt bài viết");
      }
    } catch (err) {
      console.error("Failed to approve post");
    } finally {
      setActionLoading(null);
    }
  };

  const startReject = (postId: string) => {
    setRejectingPostId(postId);
    setRejectNote("");
  };

  const submitReject = async (postId: string) => {
    if (!rejectNote.trim()) {
      alert("Vui lòng nhập lý do từ chối bài viết");
      return;
    }
    setActionLoading(postId);
    try {
      const res = await fetch("/api/posts/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, action: "reject", note: rejectNote }),
      });
      if (res.ok) {
        if (propStatus === "PENDING_REVIEW") {
          setPosts(posts.filter((p) => p.id !== postId));
        } else {
          setPosts(posts.map(p => p.id === postId ? { ...p, status: "REJECTED", rejectedReason: rejectNote } : p));
        }
        setRejectingPostId(null);
        if (onActionSuccess) onActionSuccess();
      } else {
        const errData = await res.json();
        alert(errData.error || "Không thể từ chối bài viết");
      }
    } catch (err) {
      console.error("Failed to reject post");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendToReview = async (postId: string) => {
    setActionLoading(postId);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: posts.find(p => p.id === postId)?.title || "",
          slug: posts.find(p => p.id === postId)?.slug || "",
          status: "PENDING_REVIEW"
        })
      });
      if (res.ok) {
        setPosts(posts.map(p => p.id === postId ? { ...p, status: "PENDING_REVIEW" } : p));
        if (onActionSuccess) onActionSuccess();
      } else {
        const errData = await res.json();
        alert(errData.error || "Không thể gửi duyệt");
      }
    } catch (err) {
      console.error("Failed to send post to review");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) return;
    setActionLoading(postId);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== postId));
        if (onActionSuccess) onActionSuccess();
      } else {
        const errData = await res.json();
        alert(errData.error || "Không thể xóa bài viết");
      }
    } catch (err) {
      console.error("Failed to delete post");
    } finally {
      setActionLoading(null);
    }
  };

  const statusLabels = {
    DRAFT: { label: "Nháp", style: "bg-slate-100 text-slate-700 border-slate-200" },
    PENDING_REVIEW: { label: "Chờ duyệt", style: "bg-amber-100 text-amber-700 border-amber-200" },
    PUBLISHED: { label: "Đã đăng", style: "bg-green-100 text-green-700 border-green-200" },
    REJECTED: { label: "Từ chối", style: "bg-red-100 text-red-700 border-red-200" },
    ARCHIVED: { label: "Lưu trữ", style: "bg-purple-100 text-purple-700 border-purple-200" }
  };

  const isEditorOrAdmin = user?.role === "ADMIN" || user?.role === "EDITOR";

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm tiêu đề, trích dẫn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          {!propStatus && (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <Filter size={14} className="text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none pr-4 cursor-pointer"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="DRAFT">Bản nháp</option>
                <option value="PENDING_REVIEW">Chờ duyệt</option>
                <option value="PUBLISHED">Đã xuất bản</option>
                <option value="REJECTED">Bị từ chối</option>
                <option value="ARCHIVED">Đã lưu trữ</option>
              </select>
            </div>
          )}

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Filter size={14} className="text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none pr-4 cursor-pointer"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader className="animate-spin text-orange-500" size={36} />
          <p className="text-xs font-semibold text-slate-400">Đang tải danh sách bài viết...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-slate-400 space-y-2">
          <AlertCircle size={40} className="mx-auto text-slate-300" />
          <p className="text-sm font-bold text-slate-600">Không tìm thấy bài viết nào</p>
          <p className="text-xs text-slate-400">Hãy thử thay đổi bộ lọc hoặc tạo một bài viết mới.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-sm text-left text-slate-700">
            <thead className="text-xs text-slate-400 uppercase bg-slate-50 border-b border-slate-100 font-bold">
              <tr>
                <th className="px-5 py-4">Bài viết</th>
                <th className="px-5 py-4">Tác giả</th>
                <th className="px-5 py-4">Danh mục</th>
                <th className="px-5 py-4 text-center">Lượt xem</th>
                <th className="px-5 py-4 text-center">Trạng thái</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {posts.map((post) => {
                const statusMeta = statusLabels[post.status] || { label: post.status, style: "bg-slate-100" };
                const isAuthorOwner = post.author.id === user?.id;
                
                return (
                  <tr key={post.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-5 py-4 max-w-xs sm:max-w-sm">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-900 line-clamp-2 leading-tight">
                          {post.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Tạo ngày: {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                        {post.status === "REJECTED" && post.rejectedReason && (
                          <span className="text-[11px] text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded border border-red-100 w-fit mt-1">
                            Lý do từ chối: {post.rejectedReason}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-800 text-xs sm:text-sm">{post.author.name}</span>
                    </td>
                    <td className="px-5 py-4">
                      {post.category ? (
                        <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2 py-0.5 rounded-full">
                          {post.category.name}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Không có</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="inline-flex items-center gap-1 text-slate-500 font-medium text-xs bg-slate-100/60 px-2 py-0.5 rounded-lg">
                        <Eye size={12} />
                        <span>{post.viewCount}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-block border text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${statusMeta.style}`}>
                        {statusMeta.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {/* Action buttons wrapper */}
                      <div className="flex items-center justify-end gap-2">
                        {/* 1. View Public link (If published) */}
                        {post.status === "PUBLISHED" && (
                          <Link
                            href={`/tin-tuc/${post.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-orange-500 hover:bg-slate-100 rounded-lg transition"
                            title="Xem trên trang chủ"
                          >
                            <ExternalLink size={15} />
                          </Link>
                        )}

                        {/* 2. Submit for review (For author, if DRAFT/REJECTED) */}
                        {user?.role === "AUTHOR" && isAuthorOwner && (post.status === "DRAFT" || post.status === "REJECTED") && (
                          <button
                            onClick={() => handleSendToReview(post.id)}
                            disabled={actionLoading === post.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-500 text-white hover:bg-orange-600 rounded-lg text-xs font-bold transition disabled:opacity-50 shadow-sm shadow-orange-500/10"
                            title="Gửi duyệt"
                          >
                            <Send size={11} />
                            <span>Gửi duyệt</span>
                          </button>
                        )}

                        {/* 3. Approve / Reject (For Admin/Editor, if PENDING_REVIEW) */}
                        {isEditorOrAdmin && post.status === "PENDING_REVIEW" && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleApprove(post.id)}
                              disabled={actionLoading === post.id}
                              className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-xs font-bold transition disabled:opacity-50 flex items-center justify-center"
                              title="Duyệt xuất bản"
                            >
                              {actionLoading === post.id ? <Loader size={14} className="animate-spin" /> : <Check size={14} />}
                            </button>
                            <button
                              onClick={() => startReject(post.id)}
                              disabled={actionLoading === post.id}
                              className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition disabled:opacity-50 flex items-center justify-center"
                              title="Từ chối bài viết"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}

                        {/* 4. Edit (Allowed for Admin/Editor, OR Author if DRAFT/REJECTED) */}
                        {(isEditorOrAdmin || (user?.role === "AUTHOR" && isAuthorOwner && (post.status === "DRAFT" || post.status === "REJECTED"))) && (
                          <Link
                            href={`/admin/posts/${post.id}/edit`}
                            className="p-1.5 text-slate-600 hover:text-orange-500 hover:bg-slate-100 rounded-lg transition"
                            title="Chỉnh sửa bài viết"
                          >
                            <Edit3 size={15} />
                          </Link>
                        )}

                        {/* 5. Delete (Allowed for Admin/Editor, OR Author if DRAFT/REJECTED) */}
                        {(isEditorOrAdmin || (user?.role === "AUTHOR" && isAuthorOwner && (post.status === "DRAFT" || post.status === "REJECTED"))) && (
                          <button
                            onClick={() => handleDelete(post.id)}
                            disabled={actionLoading === post.id}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                            title="Xóa bài viết"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>

                      {/* Inline Rejection Panel */}
                      {rejectingPostId === post.id && (
                        <div className="mt-3 text-left p-4 bg-red-50 border border-red-200 rounded-xl space-y-2 col-span-full">
                          <label className="block text-xs font-bold text-red-800">
                            Nhập lý do từ chối bài viết (Bắt buộc):
                          </label>
                          <textarea
                            value={rejectNote}
                            onChange={(e) => setRejectNote(e.target.value)}
                            rows={2}
                            placeholder="Ví dụ: Bài viết thiếu hình ảnh minh họa, sai lỗi chính tả..."
                            className="w-full text-xs p-2 bg-white border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setRejectingPostId(null)}
                              className="px-2.5 py-1 text-slate-500 hover:bg-slate-200/50 rounded text-[10px] font-bold"
                            >
                              Hủy
                            </button>
                            <button
                              onClick={() => submitReject(post.id)}
                              className="px-3 py-1 bg-red-600 text-white hover:bg-red-700 rounded text-[10px] font-bold shadow-sm shadow-red-600/10"
                            >
                              Xác nhận từ chối
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
