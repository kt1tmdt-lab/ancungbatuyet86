"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import {
  Plus,
  Loader,
  AlertCircle,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Globe,
  Check
} from "lucide-react";
import Link from "next/link";

interface PageData {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  updatedAt: string;
}

export default function AdminPagesList() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pages", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    } catch (err) {
      console.error("Failed to fetch pages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pageId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa trang này không? Bố cục thiết kế sẽ bị mất vĩnh viễn.")) return;
    
    setActionLoading(pageId);
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        setPages(pages.filter((p) => p.id !== pageId));
      } else {
        const errData = await res.json();
        alert(errData.error || "Không thể xóa trang");
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi xóa trang");
    } finally {
      setActionLoading(null);
    }
  };

  // Filter search
  const filteredPages = pages.filter((page) =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "EDITOR"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Globe className="text-primary-dark" size={28} />
              Quản lý Trang động
            </h1>
            <p className="text-slate-500 text-sm mt-1">Dựng Landing Page, trang sự kiện, hoặc các trang phụ tùy biến với Block Builder.</p>
          </div>
          <Link
            href="/admin/pages/new"
            className="acbt-btn acbt-btn--admin acbt-btn--md self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Thêm Trang Mới</span>
          </Link>
        </div>

        <div className="bg-white  border border-slate-100 p-6 shadow-sm space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pb-2">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Tìm tên trang, slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200  text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
              />
            </div>
          </div>

          {/* Listing */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader className="animate-spin text-primary-dark" size={36} />
              <p className="text-xs font-semibold text-slate-400">Đang tải danh sách trang...</p>
            </div>
          ) : filteredPages.length === 0 ? (
            <div className="text-center py-20 text-slate-400 space-y-2">
              <AlertCircle size={40} className="mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-600">Không tìm thấy trang nào</p>
              <p className="text-xs text-slate-400">Nhấp nút "Thêm Trang Mới" để tạo trang tùy biến đầu tiên.</p>
            </div>
          ) : (
            <div className="overflow-x-auto  border border-slate-100">
              <table className="w-full text-sm text-left text-slate-700">
                <thead className="text-xs text-slate-400 uppercase bg-slate-50 border-b border-slate-100 font-bold">
                  <tr>
                    <th className="px-5 py-4">Tên trang</th>
                    <th className="px-5 py-4">Đường dẫn tĩnh (Slug)</th>
                    <th className="px-5 py-4 text-center">Trạng thái</th>
                    <th className="px-5 py-4 text-center">Cập nhật lúc</th>
                    <th className="px-5 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredPages.map((page) => {
                    const isDraft = page.status === "DRAFT";
                    return (
                      <tr key={page.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-5 py-4">
                          <span className="font-extrabold text-slate-900 leading-tight block">
                            {page.title}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono text-xs text-slate-500">
                          <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 ">
                            /trang/{page.slug}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-block border text-[10px] font-extrabold px-2.5 py-0.5  uppercase tracking-wider ${
                            isDraft
                              ? "bg-slate-100 text-slate-700 border-slate-200"
                              : "bg-green-100 text-green-700 border-green-200"
                          }`}>
                            {isDraft ? "Nháp" : "Xuất bản"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center text-xs text-slate-450 font-semibold">
                          {new Date(page.updatedAt).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Public Link */}
                            <Link
                              href={`/trang/${page.slug}`}
                              target="_blank"
                              className="acbt-icon-btn p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary-dark"
                              title="Xem trang thực tế"
                            >
                              <ExternalLink size={15} />
                            </Link>

                            {/* Edit */}
                            <Link
                              href={`/admin/pages/${page.id}/edit`}
                              className="acbt-icon-btn p-1.5 text-slate-600 hover:bg-slate-100 hover:text-primary-dark"
                              title="Chỉnh sửa bố cục"
                            >
                              <Edit3 size={15} />
                            </Link>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(page.id)}
                              disabled={actionLoading === page.id}
                              className="acbt-icon-btn p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                              title="Xóa trang"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

