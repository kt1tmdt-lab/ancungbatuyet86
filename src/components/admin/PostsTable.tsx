"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { 
  AlertCircle, Check, X, Loader, Search, Filter, 
  Edit3, Trash2, ExternalLink, Send, Eye 
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

export function PostsTable({ status: propStatus, onActionSuccess }: { status?: string; onActionSuccess?: () => void; }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const [statusFilter, setStatusFilter] = useState(propStatus || "");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [rejectingPostId, setRejectingPostId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  const { user } = useAuth();

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
        setCategories(await res.json());
      }
    } catch (err) {}
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = "/api/posts?";
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (categoryFilter) params.append("categoryId", categoryFilter);
      if (searchQuery) params.append("search", searchQuery);

      const res = await fetch(url + params.toString());
      if (res.ok) {
        setPosts(await res.json());
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (postId: string) => {
    setActionLoading(postId);
    try {
      const res = await fetch("/api/posts/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, action: "approve" }),
      });
      if (res.ok) {
        if (propStatus === "PENDING_REVIEW") setPosts(posts.filter((p) => p.id !== postId));
        else setPosts(posts.map(p => p.id === postId ? { ...p, status: "PUBLISHED" } : p));
        onActionSuccess?.();
      } else {
        alert("Không thể duyệt bài viết");
      }
    } finally {
      setActionLoading(null);
    }
  };

  const submitReject = async (postId: string) => {
    if (!rejectNote.trim()) return alert("Vui lòng nhập lý do từ chối");
    setActionLoading(postId);
    try {
      const res = await fetch("/api/posts/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, action: "reject", note: rejectNote }),
      });
      if (res.ok) {
        if (propStatus === "PENDING_REVIEW") setPosts(posts.filter((p) => p.id !== postId));
        else setPosts(posts.map(p => p.id === postId ? { ...p, status: "REJECTED", rejectedReason: rejectNote } : p));
        setRejectingPostId(null);
        onActionSuccess?.();
      } else {
        alert("Không thể từ chối");
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendToReview = async (postId: string) => {
    setActionLoading(postId);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PENDING_REVIEW" })
      });
      if (res.ok) {
        setPosts(posts.map(p => p.id === postId ? { ...p, status: "PENDING_REVIEW" } : p));
        onActionSuccess?.();
      } else alert("Không thể gửi duyệt");
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
      });
      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== postId));
        onActionSuccess?.();
      } else alert("Không thể xóa bài viết");
    } finally {
      setActionLoading(null);
    }
  };

  const isEditorOrAdmin = user?.role === "ADMIN" || user?.role === "EDITOR";

  const columns = useMemo<ColumnDef<Post>[]>(() => [
    {
      accessorKey: "title",
      header: "Bài viết",
      cell: ({ row }) => {
        const post = row.original;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-slate-900 line-clamp-2 leading-tight">
              {post.title}
            </span>
            <span className="text-[10px] text-slate-400">
              Tạo ngày: {new Date(post.createdAt).toLocaleDateString("vi-VN")}
            </span>
            {post.status === "REJECTED" && post.rejectedReason && (
              <span className="text-[11px] text-red-600 font-medium bg-red-50 px-2 py-0.5 border border-red-100 w-fit mt-1">
                Lý do: {post.rejectedReason}
              </span>
            )}
            {rejectingPostId === post.id && (
              <div className="mt-3 text-left p-3 bg-red-50 border border-red-200 space-y-2">
                <textarea
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  rows={2}
                  placeholder="Lý do từ chối..."
                  className="w-full text-xs p-2 border border-red-300"
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setRejectingPostId(null)} className="px-2 py-1 text-xs">Hủy</button>
                  <button onClick={() => submitReject(post.id)} className="px-2 py-1 bg-red-600 text-white text-xs">Từ chối</button>
                </div>
              </div>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: "author.name",
      header: "Tác giả",
      cell: ({ row }) => <span className="font-semibold text-xs">{row.original.author.name}</span>
    },
    {
      accessorKey: "category.name",
      header: "Danh mục",
      cell: ({ row }) => row.original.category ? (
        <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2 py-0.5">
          {row.original.category.name}
        </span>
      ) : <span className="text-xs text-slate-400 italic">Không có</span>
    },
    {
      accessorKey: "viewCount",
      header: "Lượt xem",
      cell: ({ row }) => (
        <div className="inline-flex items-center gap-1 text-slate-500 font-medium text-xs bg-slate-100/60 px-2 py-0.5">
          <Eye size={12} /><span>{row.original.viewCount}</span>
        </div>
      )
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const statuses: any = {
          DRAFT: { label: "Nháp", style: "bg-slate-100 text-slate-700" },
          PENDING_REVIEW: { label: "Chờ duyệt", style: "bg-amber-100 text-amber-700" },
          PUBLISHED: { label: "Đã đăng", style: "bg-green-100 text-green-700" },
          REJECTED: { label: "Từ chối", style: "bg-red-100 text-red-700" },
          ARCHIVED: { label: "Lưu trữ", style: "bg-purple-100 text-purple-700" }
        };
        const s = statuses[row.original.status] || statuses.DRAFT;
        return <span className={`inline-block border text-[10px] font-extrabold px-2.5 py-0.5 uppercase tracking-wider ${s.style}`}>{s.label}</span>;
      }
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        const post = row.original;
        const isAuthorOwner = post.author.id === user?.id;
        return (
          <div className="flex items-center justify-end gap-1">
            {post.status === "PUBLISHED" && (
              <Link href={`/tin-tuc/${post.slug}`} target="_blank" className="p-1.5 hover:bg-slate-100"><ExternalLink size={15} /></Link>
            )}
            {user?.role === "AUTHOR" && isAuthorOwner && (post.status === "DRAFT" || post.status === "REJECTED") && (
              <button onClick={() => handleSendToReview(post.id)} className="p-1.5 bg-primary text-white hover:bg-primary-dark"><Send size={11} /></button>
            )}
            {isEditorOrAdmin && post.status === "PENDING_REVIEW" && (
              <>
                <button onClick={() => handleApprove(post.id)} className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100"><Check size={14} /></button>
                <button onClick={() => { setRejectingPostId(post.id); setRejectNote(""); }} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100"><X size={14} /></button>
              </>
            )}
            {(isEditorOrAdmin || (isAuthorOwner && ["DRAFT", "REJECTED"].includes(post.status))) && (
              <>
                <Link href={`/admin/posts/${post.id}/edit`} className="p-1.5 hover:bg-slate-100"><Edit3 size={15} /></Link>
                <button onClick={() => handleDelete(post.id)} className="p-1.5 hover:bg-red-50 text-red-500"><Trash2 size={15} /></button>
              </>
            )}
          </div>
        );
      }
    }
  ], [user, rejectingPostId, rejectNote]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm tiêu đề..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {!propStatus && (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5">
              <Filter size={14} className="text-slate-400" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent text-xs font-semibold focus:outline-none">
                <option value="">Tất cả trạng thái</option>
                <option value="DRAFT">Bản nháp</option>
                <option value="PENDING_REVIEW">Chờ duyệt</option>
                <option value="PUBLISHED">Đã xuất bản</option>
                <option value="REJECTED">Bị từ chối</option>
              </select>
            </div>
          )}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5">
            <Filter size={14} className="text-slate-400" />
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="bg-transparent text-xs font-semibold focus:outline-none">
              <option value="">Tất cả danh mục</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center"><Loader className="animate-spin text-primary mx-auto mb-2" size={30} /></div>
      ) : (
        <DataTable columns={columns} data={posts} />
      )}
    </div>
  );
}
