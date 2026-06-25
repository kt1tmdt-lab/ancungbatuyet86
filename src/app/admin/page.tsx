"use client";

import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { useState, useEffect } from "react";
import CurtainHover from "@/components/shared/CurtainHover";
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
  totalProducts: number;
  newContacts: number;
  viewsByDay: { date: string; count: number }[];
  mostViewedPosts: { id: string; title: string; viewCount: number }[];
  mostClickedProducts: { name: string; clicks: number }[];
  contactsOverTime: { date: string; count: number }[];
  trafficSources: { source: string; percentage: number }[];
}

export default function AdminPage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    if (token) fetchStats();
  }, [token]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
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
        <div className="relative overflow-hidden bg-slate-900 p-6 sm:p-8 text-white shadow-lg border border-slate-800">
          <div className="absolute right-0 bottom-0 translate-y-12 translate-x-12 opacity-10 pointer-events-none">
            <TrendingUp size={300} className="text-orange-500" />
          </div>
          <div className="relative z-10 space-y-2">
            <span className="inline-block bg-primary/20 text-orange-400 text-xs font-bold px-3 py-1 uppercase tracking-wider">
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
          <div className={`grid grid-cols-2 lg:grid-cols-6 gap-4 animate-pulse`}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-28 bg-slate-800/10 border border-gray-100" />
            ))}
          </div>
        ) : (
          <div className={`grid grid-cols-2 lg:grid-cols-6 gap-4`}>
            {/* Card 1: Tổng bài */}
            <div 
              onClick={() => setSelectedStatus("")}
              className={`cursor-pointer border p-5 shadow-sm transition hover:shadow-md select-none ${
                selectedStatus === "" 
                  ? "bg-blue-50/20 border-blue-500 ring-2 ring-blue-500/20" 
                  : "bg-white border-slate-100 hover:border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Bài viết</span>
                <div className="w-8 h-8 bg-blue-50 flex items-center justify-center">
                  <FileText className="text-blue-600" size={16} />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">{stats?.total || 0}</p>
              <p className="text-xs text-slate-400 mt-1">Tổng bài viết</p>
            </div>

            {/* Card 2: Tổng sản phẩm */}
            <div className="bg-white border border-slate-100 p-5 shadow-sm hover:shadow-md transition select-none">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Sản phẩm</span>
                <div className="w-8 h-8 bg-indigo-50 flex items-center justify-center">
                  <FolderPlus className="text-indigo-600" size={16} />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">{stats?.totalProducts || 0}</p>
              <p className="text-xs text-indigo-600 font-semibold mt-1">Sản phẩm hiện có</p>
            </div>

            {/* Card 3: Đã xuất bản */}
            <div 
              onClick={() => setSelectedStatus("PUBLISHED")}
              className={`cursor-pointer border p-5 shadow-sm transition hover:shadow-md select-none ${
                selectedStatus === "PUBLISHED" 
                  ? "bg-green-50/20 border-green-500 ring-2 ring-green-500/20" 
                  : "bg-white border-slate-100 hover:border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Xuất bản</span>
                <div className="w-8 h-8 bg-green-50 flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={16} />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">{stats?.published || 0}</p>
              <p className="text-xs text-green-600 font-semibold mt-1">Hiển thị công khai</p>
            </div>

            {/* Card 4: Chờ duyệt */}
            <div 
              onClick={() => setSelectedStatus("PENDING_REVIEW")}
              className={`cursor-pointer border p-5 shadow-sm transition hover:shadow-md select-none ${
                selectedStatus === "PENDING_REVIEW" 
                  ? "bg-orange-50/30 border-orange-500 ring-2 ring-orange-500/20" 
                  : "bg-white border-slate-100 hover:border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Chờ duyệt</span>
                <div className="w-8 h-8 bg-orange-50 flex items-center justify-center">
                  <Clock className="text-orange-500" size={16} />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">{stats?.pending || 0}</p>
              <p className="text-xs text-orange-500 font-semibold mt-1">Cần xem xét</p>
            </div>

            {/* Card 5: Form Liên hệ mới */}
            <Link href="/admin/contacts" className="block">
              <div className="bg-red-50 border border-red-100 p-5 shadow-sm hover:shadow-md transition select-none h-full relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-y-1 translate-x-1">
                   {stats?.newContacts ? <span className="flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span> : null}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Tin nhắn</span>
                  <div className="w-8 h-8 bg-red-100 flex items-center justify-center">
                    <ClipboardCheck className="text-red-600" size={16} />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">{stats?.newContacts || 0}</p>
                <p className="text-xs text-red-600 font-semibold mt-1">Yêu cầu liên hệ mới</p>
              </div>
            </Link>

            {/* Card 6: Tổng lượt xem */}
            <div className="bg-white border border-slate-100 p-5 shadow-sm hover:shadow-md transition col-span-2 lg:col-span-1 select-none">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Lượt xem</span>
                <div className="w-8 h-8 bg-purple-50 flex items-center justify-center">
                  <Eye className="text-purple-600" size={16} />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                {stats?.totalViews.toLocaleString("vi-VN") || 0}
              </p>
              <p className="text-xs text-slate-400 mt-1">Lượt đọc bài viết</p>
            </div>
          </div>
        )}

        {/* Analytics & Charts Section */}
        {!loading && stats && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Chart 1: Lượt xem website theo ngày */}
            <div className="bg-white border border-slate-100 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Lượt xem website (7 ngày)
                </h3>
                <span className="text-[10px] bg-orange-50 text-orange-600 font-bold px-2 py-0.5 uppercase tracking-wider">
                  Đang chạy
                </span>
              </div>
              
              {(() => {
                const viewsData = stats.viewsByDay || [];
                const maxViews = Math.max(...viewsData.map(d => d.count), 1);
                const svgWidth = 500;
                const svgHeight = 150;
                const points = viewsData.map((d, i) => {
                  const x = 40 + (i / 6) * (svgWidth - 80);
                  const y = svgHeight - 30 - (d.count / maxViews) * (svgHeight - 60);
                  return { x, y, ...d };
                });

                const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                const areaPath = points.length > 0 ? `${linePath} L ${points[points.length - 1].x} ${svgHeight - 30} L ${points[0].x} ${svgHeight - 30} Z` : '';

                return (
                  <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-40">
                    <defs>
                      <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                      const y = svgHeight - 30 - ratio * (svgHeight - 60);
                      return (
                        <line key={idx} x1="40" y1={y} x2={svgWidth - 40} y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                      );
                    })}
                    {points.length > 0 && <path d={areaPath} fill="url(#viewsGradient)" />}
                    {points.length > 0 && <path d={linePath} fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
                    {points.map((p, idx) => (
                      <g key={idx} className="group/point">
                        <circle cx={p.x} cy={p.y} r="4.5" fill="#ffffff" stroke="#f97316" strokeWidth="2.5" className="transition-all duration-200 hover:scale-125 cursor-pointer" />
                        <g className="opacity-0 group-hover/point:opacity-100 transition-opacity duration-200 pointer-events-none">
                          <rect x={p.x - 45} y={p.y - 35} width="90" height="22" rx="4" fill="#0f172a" />
                          <text x={p.x} y={p.y - 20} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                            {p.count} lượt xem
                          </text>
                        </g>
                      </g>
                    ))}
                    {points.map((p, idx) => {
                      const dateStr = p.date.substring(5).replace("-", "/");
                      return (
                        <text key={idx} x={p.x} y={svgHeight - 10} fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle">
                          {dateStr}
                        </text>
                      );
                    })}
                  </svg>
                );
              })()}
            </div>

            {/* Chart 2: Form liên hệ theo thời gian */}
            <div className="bg-white border border-slate-100 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Lượng liên hệ (7 ngày)
                </h3>
                <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 uppercase tracking-wider">
                  Tin nhắn
                </span>
              </div>
              
              {(() => {
                const contactsData = stats.contactsOverTime || [];
                const maxContacts = Math.max(...contactsData.map(d => d.count), 1);
                const svgWidth = 500;
                const svgHeight = 150;
                const cPoints = contactsData.map((d, i) => {
                  const x = 40 + (i / 6) * (svgWidth - 80);
                  const barHeight = (d.count / maxContacts) * (svgHeight - 60);
                  return { x, y: svgHeight - 30 - barHeight, barHeight, ...d };
                });

                return (
                  <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-40">
                    {[0, 0.5, 1].map((ratio, idx) => {
                      const y = svgHeight - 30 - ratio * (svgHeight - 60);
                      return (
                        <line key={idx} x1="40" y1={y} x2={svgWidth - 40} y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                      );
                    })}
                    {cPoints.map((p, idx) => (
                      <g key={idx} className="group/bar">
                        <rect
                          x={p.x - 12}
                          y={p.y}
                          width="24"
                          height={p.barHeight > 0 ? p.barHeight : 2}
                          fill="#3b82f6"
                          rx="2"
                          className="transition-all duration-200 hover:fill-blue-600 cursor-pointer"
                        />
                        <g className="opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 pointer-events-none">
                          <rect x={p.x - 40} y={p.y - 35} width="80" height="22" rx="4" fill="#0f172a" />
                          <text x={p.x} y={p.y - 20} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                            {p.count} liên hệ
                          </text>
                        </g>
                        <text x={p.x} y={svgHeight - 10} fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle">
                          {p.date.substring(5).replace("-", "/")}
                        </text>
                      </g>
                    ))}
                  </svg>
                );
              })()}
            </div>

            {/* Chart 3: Nguồn traffic */}
            <div className="bg-white border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Nguồn Traffic chính
                </h3>
              </div>
              <div className="flex items-center justify-around flex-1 py-2">
                {(() => {
                  const sources = stats.trafficSources || [];
                  const colors = ["#3b82f6", "#ec4899", "#10b981", "#64748b"];
                  let accumulatedPercent = 0;
                  const donutSegments = sources.map((s, idx) => {
                    const strokeDasharray = `${s.percentage} ${100 - s.percentage}`;
                    const strokeDashoffset = -accumulatedPercent;
                    accumulatedPercent += s.percentage;
                    return {
                      ...s,
                      strokeDasharray,
                      strokeDashoffset,
                      color: colors[idx] || "#cbd5e1"
                    };
                  });

                  return (
                    <svg viewBox="0 0 36 36" className="w-24 h-24">
                      <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#f1f5f9" strokeWidth="4.5" />
                      {donutSegments.map((seg, idx) => (
                        <circle
                          key={idx}
                          cx="18"
                          cy="18"
                          r="15.91549430918954"
                          fill="transparent"
                          stroke={seg.color}
                          strokeWidth="4.5"
                          strokeDasharray={seg.strokeDasharray}
                          strokeDashoffset={seg.strokeDashoffset}
                          className="transition-all duration-300 hover:stroke-[5.5px] cursor-pointer"
                          transform="rotate(-90 18 18)"
                        />
                      ))}
                    </svg>
                  );
                })()}
                
                {/* Legends */}
                <div className="space-y-1 text-xs">
                  {(stats.trafficSources || []).map((s, idx) => {
                    const colors = ["#3b82f6", "#ec4899", "#10b981", "#64748b"];
                    return (
                      <div key={s.source} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 inline-block rounded-full" style={{ backgroundColor: colors[idx] }} />
                        <span className="font-semibold text-slate-600 text-[11px]">{s.source}</span>
                        <span className="text-slate-400 font-bold text-[11px]">{s.percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Chart 4: Top bài viết được xem nhiều */}
            <div className="bg-white border border-slate-100 p-6 shadow-sm space-y-4 md:col-span-2">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Bài viết được xem nhiều nhất
                </h3>
              </div>
              {(() => {
                const postsList = stats.mostViewedPosts || [];
                const maxPostViews = Math.max(...postsList.map(p => p.viewCount), 1);
                return (
                  <div className="space-y-3">
                    {postsList.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Chưa có dữ liệu bài viết</p>
                    ) : (
                      postsList.map((post) => {
                        const percent = (post.viewCount / maxPostViews) * 100;
                        return (
                          <div key={post.id} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold text-slate-800">
                              <span className="truncate max-w-[350px]" title={post.title}>{post.title}</span>
                              <span className="text-slate-500">{post.viewCount.toLocaleString("vi-VN")} lượt xem</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Chart 5: Top sản phẩm được click nhiều */}
            <div className="bg-white border border-slate-100 p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Sản phẩm được xem/click nhiều
                </h3>
              </div>
              {(() => {
                const productsList = stats.mostClickedProducts || [];
                const maxProductClicks = Math.max(...productsList.map(p => p.clicks), 1);
                return (
                  <div className="space-y-3">
                    {productsList.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Chưa có dữ liệu sản phẩm</p>
                    ) : (
                      productsList.map((prod, idx) => {
                        const percent = (prod.clicks / maxProductClicks) * 100;
                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold text-slate-800">
                              <span className="truncate max-w-[200px]" title={prod.name}>{prod.name}</span>
                              <span className="text-slate-500">{prod.clicks.toLocaleString("vi-VN")} clicks</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Danh sách bài viết động */}
        <div className="bg-white border border-slate-100 p-6 sm:p-8 shadow-sm">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <span className="w-3 h-3 bg-primary inline-block shadow-sm shadow-orange-500/30"></span>
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
                className="text-xs font-semibold text-orange-500 hover:text-orange-600 hover:underline self-start sm:self-auto bg-orange-50 px-3 py-1.5 transition"
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
          <div className="md:col-span-2 bg-white border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Thao tác nhanh</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Action: Viết bài */}
              <Link 
                href="/admin/posts/new"
                className="group border border-slate-100 hover:border-orange-200 transition-all block"
              >
                <CurtainHover
                  overlayMode="full"
                  overlayContent={
                    <span className="flex items-center gap-1">
                      Quản lý <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  }
                  overlayClassName="bg-primary/90 text-white"
                  className="p-5 bg-slate-50 flex flex-col justify-between h-full min-h-[170px]"
                >
                  <div>
                    <div className="w-10 h-10 bg-primary text-white flex items-center justify-center mb-4 shadow-md shadow-orange-500/10">
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
                </CurtainHover>
              </Link>

              {/* Action: Quản lý bài viết */}
              <Link 
                href="/admin/posts"
                className="group border border-slate-100 hover:border-slate-800 transition-all block"
              >
                <CurtainHover
                  overlayMode="full"
                  overlayContent={
                    <span className="flex items-center gap-1">
                      Quản lý <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  }
                  overlayClassName="bg-slate-950/90 text-white"
                  className="p-5 bg-slate-50 flex flex-col justify-between h-full min-h-[170px]"
                >
                  <div>
                    <div className="w-10 h-10 bg-slate-900 group-hover:bg-slate-800 text-white flex items-center justify-center mb-4">
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
                </CurtainHover>
              </Link>

              {/* Action: Duyệt bài (Admin/Editor) */}
              {isEditorOrAdmin && (
                <Link 
                  href="/admin/posts/review"
                  className="group border border-slate-100 hover:border-orange-200 transition-all block"
                >
                  <CurtainHover
                    overlayMode="full"
                    overlayContent={
                      <span className="flex items-center gap-1">
                        Quản lý <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    }
                    overlayClassName="bg-primary/90 text-white"
                    className="p-5 bg-slate-50 flex flex-col justify-between h-full min-h-[170px]"
                  >
                    <div>
                      <div className="w-10 h-10 bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
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
                  </CurtainHover>
                </Link>
              )}

              {/* Action: Danh mục (Admin/Editor) */}
              {isEditorOrAdmin && (
                <Link 
                  href="/admin/categories"
                  className="group border border-slate-100 hover:border-slate-800 transition-all block"
                >
                  <CurtainHover
                    overlayMode="full"
                    overlayContent={
                      <span className="flex items-center gap-1">
                        Quản lý <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    }
                    overlayClassName="bg-slate-950/90 text-white"
                    className="p-5 bg-slate-50 flex flex-col justify-between h-full min-h-[170px]"
                  >
                    <div>
                      <div className="w-10 h-10 bg-slate-200 text-slate-700 flex items-center justify-center mb-4">
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
                  </CurtainHover>
                </Link>
              )}

              {/* Action: Quản lý user (Admin Only) */}
              {user?.role === "ADMIN" && (
                <Link 
                  href="/admin/users"
                  className="group border border-slate-100 hover:border-orange-200 transition-all block sm:col-span-2"
                >
                  <CurtainHover
                    overlayMode="full"
                    overlayContent={
                      <span className="flex items-center gap-1">
                        Quản lý <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    }
                    overlayClassName="bg-primary/90 text-white"
                    className="p-5 bg-slate-50 flex flex-col justify-between h-full min-h-[170px]"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 shrink-0 bg-slate-900 text-white flex items-center justify-center">
                        <Users size={18} />
                      </div>
                      <div className="text-left">
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
                  </CurtainHover>
                </Link>
              )}
            </div>
          </div>

          {/* Cột 2: Hướng dẫn quy trình duyệt */}
          <div className="bg-white border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Quy trình biên tập</h2>
              <div className="relative border-l-2 border-slate-100 pl-6 space-y-6">
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 border-2 border-white bg-slate-950 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">Bước 1: Soạn thảo (Author)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Tác giả viết bài viết mới, lưu ở dạng DRAFT (Nháp). Trực quan hóa nội dung và hình ảnh bằng URL Cloudflare CDN.</p>
                </div>
                {/* Step 2 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 border-2 border-white bg-primary flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white" />
                  </div>
                  <p className="text-sm font-bold text-orange-500">Bước 2: Gửi duyệt (Author)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Tác giả gửi yêu cầu xét duyệt. Bài viết chuyển thành PENDING_REVIEW (Chờ duyệt) và khóa chỉnh sửa đối với tác giả.</p>
                </div>
                {/* Step 3 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 border-2 border-white bg-green-500 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white" />
                  </div>
                  <p className="text-sm font-bold text-green-600">Bước 3: Xuất bản (Editor/Admin)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Ban biên tập phê duyệt bài viết lên PUBLISHED (Đã duyệt), hệ thống ghi nhận thời gian xuất bản và bài viết hiển thị công khai.</p>
                </div>
              </div>
            </div>

            <Link 
              href="/"
              target="_blank"
              className="mt-6 w-full text-center py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2"
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

