"use client";

import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { 
  ClipboardList, 
  Loader, 
  AlertCircle, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Eye
} from "lucide-react";

interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  details: any;
  createdAt: string;
  user: {
    email: string;
    name: string | null;
    role: string;
  } | null;
}

export default function ActivityLogsPage() {
  const { token } = useAuth();
  
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    if (token) {
      fetchLogs();
    }
  }, [token, page, debouncedSearch]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/activity-logs?page=${page}&limit=20&search=${encodeURIComponent(debouncedSearch)}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      } else {
        setError("Không thể tải nhật ký hoạt động");
      }
    } catch (err) {
      console.error("Error fetching logs:", err);
      setError("Đã xảy ra lỗi khi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes("CREATE")) return "bg-green-50 text-green-700 border-green-200";
    if (act.includes("UPDATE") || act.includes("APPROVE") || act.includes("REJECT")) return "bg-blue-50 text-blue-700 border-blue-200";
    if (act.includes("DELETE")) return "bg-red-50 text-red-700 border-red-200";
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center shadow-md">
            <ClipboardList size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Nhật ký hoạt động</h1>
            <p className="text-slate-500 text-sm mt-1">Giám sát các thao tác tạo mới, cập nhật, duyệt hoặc xóa tài nguyên trên hệ thống.</p>
          </div>
        </div>

        {/* Search & Stats Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white border border-slate-150 p-4 shadow-sm">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm hành động, đối tượng..."
              className="w-full pl-9 pr-4 py-2 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm outline-none"
            />
          </div>
          <div className="text-xs text-slate-500 font-semibold">
            Tổng số: <span className="text-slate-900 font-bold">{total}</span> nhật ký hoạt động
          </div>
        </div>

        {/* Messaging responses */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 max-w-md">
            <AlertCircle className="text-red-600 mt-0.5 shrink-0" size={16} />
            <p className="text-xs text-red-700 font-semibold leading-normal">{error}</p>
          </div>
        )}

        {/* Logs list table */}
        <div className="bg-white border border-slate-100 p-6 shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <Loader className="animate-spin text-orange-500" size={36} />
              <p className="text-xs text-slate-400 font-semibold">Đang tải nhật ký hoạt động...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <AlertCircle className="mx-auto text-slate-350 mb-2" size={36} />
              <p className="text-sm font-semibold">Không tìm thấy nhật ký hoạt động nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto border border-slate-100">
                <table className="w-full text-sm text-left text-slate-700">
                  <thead className="text-xs text-slate-450 uppercase bg-slate-50 font-bold border-b border-slate-100">
                    <tr>
                      <th scope="col" className="px-6 py-3.5">Thời gian</th>
                      <th scope="col" className="px-6 py-3.5">Thành viên</th>
                      <th scope="col" className="px-6 py-3.5">Hành động</th>
                      <th scope="col" className="px-6 py-3.5">Đối tượng</th>
                      <th scope="col" className="px-6 py-3.5">ID Đối tượng</th>
                      <th scope="col" className="px-6 py-3.5 text-center">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-xs">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/55 transition-colors">
                        <td className="px-6 py-4 text-slate-500">
                          {new Date(log.createdAt).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-6 py-4">
                          {log.user ? (
                            <div className="flex flex-col">
                              <span className="text-slate-900 font-bold">{log.user.name || "N/A"}</span>
                              <span className="text-[10px] text-slate-400">{log.user.email}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Hệ thống / Ẩn danh</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 border text-[10px] font-black uppercase tracking-wider ${getActionBadge(log.action)}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-650 font-semibold">{log.entityType}</td>
                        <td className="px-6 py-4 text-slate-400 font-mono text-[10px] truncate max-w-[120px]">
                          {log.entityId || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
                            title="Xem chi tiết JSON"
                          >
                            <Eye size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="text-xs text-slate-500 font-semibold">
                    Trang {page} / {totalPages}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent transition"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent transition"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Details JSON Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/55 z-55 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 shadow-2xl p-6 w-full max-w-xl max-h-[80vh] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Chi tiết hoạt động</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold p-1"
              >
                Đóng
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 font-mono text-xs text-slate-800 bg-slate-900 p-4 border border-slate-950 mt-4 text-left">
              <pre className="text-green-400 whitespace-pre-wrap">
                {JSON.stringify(selectedLog.details, null, 2) || "No details available"}
              </pre>
            </div>
            <div className="mt-6 border-t border-slate-100 pt-3 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
