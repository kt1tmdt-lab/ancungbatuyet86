"use client";

import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  PenTool, 
  FolderPlus, 
  Users, 
  ArrowRight,
  TrendingUp,
  ClipboardCheck
} from "lucide-react";
import { PostsTable } from "@/components/admin/PostsTable";

interface Stats {
  total: number;
  published: number;
  pending: number;
  rejected: number;
  archived: number;
  totalViews: number;
  pageViews: number;
  uniqueVisitors: number;
}

export default function AdminPage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setLoading(false);
    }
  };

  const isEditorOrAdmin = user?.role === "ADMIN" || user?.role === "EDITOR";

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "EDITOR", "AUTHOR"]}>
      <div className="space-y-8">
        {/* Banner Chào Mừng */}
        <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-slate-800">
          <div className="absolute right-0 bottom-0 translate-y-12 translate-x-12 opacity-10 pointer-events-none">
            <TrendingUp size={300} className="text-orange-500" />
          </div>
          <div className="relative z-10 space-y-2">
            <span className="inline-block bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Hệ thống quản lý
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Xin chào, {user?.name || user?.email}!
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl">
              Chào mừng quay trở lại trang quản trị nội dung Ăn Cùng Bà Tuyết. Hãy bắt đầu cập nhật tin tức hoặc phê duyệt bài viết mới ngay hôm nay.
            </p>
          </div>
        </div>

        {/* Loading / Stats Cards */}
        {loading ? (
          <div className={`grid grid-cols-2 ${isEditorOrAdmin ? "lg:grid-cols-6" : "lg:grid-cols-5"} gap-4 animate-pulse`}>
            {[...Array(isEditorOrAdmin ? 6 : 5)].map((_, i) => (
              <div key={i} className="h-28 bg-slate-800/10 rounded-2xl border border-gray-100" />
            ))}
          </div>
        ) : (
          <div className={`grid grid-cols-2 ${isEditorOrAdmin ? "lg:grid-cols-6" : "lg:grid-cols-5"} gap-4`}>
            {/* Card 1: Tổng bài */}
            <div 
              onClick={() => setSelectedStatus("")}
              className={`cursor-pointer rounded-2xl border p-5 shadow-sm transition hover:shadow-md select-none ${
                selectedStatus === "" 
                  ? "bg-blue-50/20 border-blue-500 ring-2 ring-blue-500/20" 
                  : "bg-white border-slate-100 hover:border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tổng bài viết</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText className="text-blue-600" size={16} />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">{stats?.total || 0}</p>
              <p className="text-xs text-slate-400 mt-1">Lưu trữ trong database</p>
            </div>

            {/* Card 2: Đã xuất bản */}
            <div 
              onClick={() => setSelectedStatus("PUBLISHED")}
              className={`cursor-pointer rounded-2xl border p-5 shadow-sm transition hover:shadow-md select-none ${
                selectedStatus === "PUBLISHED" 
                  ? "bg-green-50/20 border-green-500 ring-2 ring-green-500/20" 
                  : "bg-white border-slate-100 hover:border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Đã xuất bản</span>
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={16} />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">{stats?.published || 0}</p>
              <p className="text-xs text-green-600 font-semibold mt-1">Hiển thị công khai</p>
            </div>

            {/* Card 3: Chờ duyệt */}
            <div 
              onClick={() => setSelectedStatus("PENDING_REVIEW")}
              className={`cursor-pointer rounded-2xl border p-5 shadow-sm transition hover:shadow-md select-none ${
                selectedStatus === "PENDING_REVIEW" 
                  ? "bg-orange-50/30 border-orange-500 ring-2 ring-orange-500/20" 
                  : "bg-white border-slate-100 hover:border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Chờ duyệt</span>
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Clock className="text-orange-500" size={16} />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">{stats?.pending || 0}</p>
              <p className="text-xs text-orange-500 font-semibold mt-1">Cần xem xét phê duyệt</p>
            </div>

            {/* Card 4: Bị từ chối */}
            <div 
              onClick={() => setSelectedStatus("REJECTED")}
              className={`cursor-pointer rounded-2xl border p-5 shadow-sm transition hover:shadow-md select-none ${
                selectedStatus === "REJECTED" 
                  ? "bg-red-50/20 border-red-500 ring-2 ring-red-500/20" 
                  : "bg-white border-slate-100 hover:border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Từ chối</span>
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                  <XCircle className="text-red-500" size={16} />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">{stats?.rejected || 0}</p>
              <p className="text-xs text-red-500 font-semibold mt-1">Cần sửa đổi lại</p>
            </div>

            {/* Card 5: Tổng lượt xem */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition col-span-2 lg:col-span-1 select-none">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Lượt xem</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Eye className="text-purple-600" size={16} />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                {stats?.totalViews.toLocaleString("vi-VN") || 0}
              </p>
              <p className="text-xs text-slate-400 mt-1">Lượt đọc bài viết</p>
            </div>

            {/* Card 6: Khách truy cập (chỉ Admin/Editor) */}
            {isEditorOrAdmin && (
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition col-span-2 lg:col-span-1 select-none">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Khách truy cập</span>
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Users className="text-orange-500" size={16} />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                  {stats?.uniqueVisitors.toLocaleString("vi-VN") || 0}
                </p>
                <p className="text-xs text-slate-400 mt-1">Số khách ra vào web</p>
              </div>
            )}
          </div>
        )}

        {/* Danh sách bài viết động */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-orange-500 inline-block shadow-sm shadow-orange-500/30"></span>
                <span>
                  Danh sách: {
                    selectedStatus === "" ? "Tất cả bài viết" :
                    selectedStatus === "PUBLISHED" ? "Bài viết đã xuất bản" :
                    selectedStatus === "PENDING_REVIEW" ? "Bài viết chờ duyệt" :
                    selectedStatus === "REJECTED" ? "Bài viết bị từ chối" : ""
                  }
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Bấm vào các thẻ thống kê ở trên để chuyển bộ lọc và hiển thị bài viết tương ứng từ cơ sở dữ liệu.
              </p>
            </div>
            {selectedStatus && (
              <button
                onClick={() => setSelectedStatus("")}
                className="text-xs font-semibold text-orange-500 hover:text-orange-600 hover:underline self-start sm:self-auto bg-orange-50 px-3 py-1.5 rounded-lg transition"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
          <PostsTable key={selectedStatus} status={selectedStatus} onActionSuccess={fetchStats} />
        </div>

        {/* Quick Actions & Navigation Section */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cột 1: Lối tắt thao tác nhanh */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Thao tác nhanh</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Action: Viết bài */}
              <Link 
                href="/admin/posts/new"
                className="group p-5 bg-slate-50 hover:bg-orange-50 rounded-2xl border border-slate-100 hover:border-orange-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center mb-4 shadow-md shadow-orange-500/10">
                    <PenTool size={18} />
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-orange-500 transition-colors">
                    Viết bài mới
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Soạn thảo bài viết nháp, thiết lập SEO và gửi ban biên tập duyệt.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-orange-500 group-hover:translate-x-1 transition-transform">
                  Soạn thảo ngay <ArrowRight size={14} />
                </div>
              </Link>

              {/* Action: Quản lý bài viết */}
              <Link 
                href="/admin/posts"
                className="group p-5 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl border border-slate-100 hover:border-slate-800 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 group-hover:bg-slate-800 text-white flex items-center justify-center mb-4">
                    <FileText size={18} />
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-white transition-colors">
                    Danh sách bài viết
                  </h3>
                  <p className="text-xs text-slate-500 group-hover:text-slate-400 mt-1">
                    Xem, chỉnh sửa, lọc và tìm kiếm tất cả các bài viết hiện tại.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-900 group-hover:text-orange-400 group-hover:translate-x-1 transition-all">
                  Quản lý danh sách <ArrowRight size={14} />
                </div>
              </Link>

              {/* Action: Duyệt bài (Admin/Editor) */}
              {isEditorOrAdmin && (
                <Link 
                  href="/admin/posts/review"
                  className="group p-5 bg-slate-50 hover:bg-orange-50 rounded-2xl border border-slate-100 hover:border-orange-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                      <ClipboardCheck size={18} />
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      Duyệt bài viết
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Xem danh sách bài viết đang chờ phê duyệt trước khi công khai.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-orange-500 group-hover:translate-x-1 transition-transform">
                    Vào hàng chờ duyệt <ArrowRight size={14} />
                  </div>
                </Link>
              )}

              {/* Action: Danh mục (Admin/Editor) */}
              {isEditorOrAdmin && (
                <Link 
                  href="/admin/categories"
                  className="group p-5 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl border border-slate-100 hover:border-slate-800 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center mb-4">
                      <FolderPlus size={18} />
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-white transition-colors">
                      Quản lý danh mục
                    </h3>
                    <p className="text-xs text-slate-500 group-hover:text-slate-400 mt-1">
                      Thêm, sửa, xóa các chuyên mục bài viết của trang blog tin tức.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-900 group-hover:text-orange-400 group-hover:translate-x-1 transition-all">
                    Thiết lập chuyên mục <ArrowRight size={14} />
                  </div>
                </Link>
              )}

              {/* Action: Quản lý user (Admin Only) */}
              {user?.role === "ADMIN" && (
                <Link 
                  href="/admin/users"
                  className="group p-5 bg-slate-50 hover:bg-orange-50 rounded-2xl border border-slate-100 hover:border-orange-200 transition-all flex flex-col justify-between sm:col-span-2"
                >
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                      <Users size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-orange-500 transition-colors">
                        Quản lý người dùng & Phân quyền
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Chỉ Admin mới có quyền quản lý thành viên, thay đổi vai trò (ADMIN, EDITOR, AUTHOR, USER) và xem thống kê hoạt động.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-orange-500 group-hover:translate-x-1 transition-transform self-end">
                    Quản lý thành viên <ArrowRight size={14} />
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Cột 2: Hướng dẫn quy trình duyệt */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Quy trình biên tập</h2>
              <div className="relative border-l-2 border-slate-100 pl-6 space-y-6">
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white bg-slate-950 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">Bước 1: Soạn thảo (Author)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Tác giả viết bài viết mới, lưu ở dạng DRAFT (Nháp). Trực quan hóa nội dung và hình ảnh bằng URL Cloudflare CDN.</p>
                </div>
                {/* Step 2 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white bg-orange-500 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <p className="text-sm font-bold text-orange-500">Bước 2: Gửi duyệt (Author)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Tác giả gửi yêu cầu xét duyệt. Bài viết chuyển thành PENDING_REVIEW (Chờ duyệt) và khóa chỉnh sửa đối với tác giả.</p>
                </div>
                {/* Step 3 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white bg-green-500 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <p className="text-sm font-bold text-green-600">Bước 3: Xuất bản (Editor/Admin)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Ban biên tập phê duyệt bài viết lên PUBLISHED (Đã duyệt), hệ thống ghi nhận thời gian xuất bản và bài viết hiển thị công khai.</p>
                </div>
              </div>
            </div>

            <Link 
              href="/"
              target="_blank"
              className="mt-6 w-full text-center py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <span>Xem website chính</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
