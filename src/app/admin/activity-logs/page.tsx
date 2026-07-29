"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useState,
} from "react";
import { Eye } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { adminRequest, getAdminErrorMessage } from "@/lib/admin-client";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import CmsPageHeader from "@/components/admin/CmsPageHeader";
import { CmsPanel } from "@/components/admin/CmsPanel";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
  AdminModal,
  AdminPagination,
  AdminSearchInput,
  AdminToolbar,
} from "@/components/admin/AdminPrimitives";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

type AuditDetails = Record<string, unknown> | unknown[] | string | number | null;

interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  details: AuditDetails;
  createdAt: string;
  user: {
    email: string;
    name: string | null;
    role: string;
  } | null;
}

type AuditResponse = {
  logs: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

function getActionVariant(action: string) {
  const normalized = action.toUpperCase();
  if (normalized.includes("DELETE")) return "danger" as const;
  if (normalized.includes("CREATE")) return "success" as const;
  if (
    normalized.includes("UPDATE") ||
    normalized.includes("APPROVE") ||
    normalized.includes("REJECT")
  ) {
    return "default" as const;
  }
  return "muted" as const;
}

export default function ActivityLogsPage() {
  const { token } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setLoadError("");

    const params = new URLSearchParams({
      page: String(page),
      limit: "20",
    });
    if (deferredSearch.trim()) {
      params.set("search", deferredSearch.trim());
    }

    try {
      const data = await adminRequest<AuditResponse>(
        `/api/admin/activity-logs?${params.toString()}`,
        { token },
      );
      setLogs(data.logs);
      setTotalPages(Math.max(data.pagination.totalPages, 1));
      setTotal(data.pagination.total);
    } catch (error) {
      setLoadError(
        getAdminErrorMessage(error, "Không thể tải nhật ký hoạt động."),
      );
    } finally {
      setLoading(false);
    }
  }, [deferredSearch, page, token]);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchLogs(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchLogs]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
      <div className="space-y-5">
        <CmsPageHeader
          eyebrow="Hệ thống"
          title="Nhật ký hoạt động"
          description="Theo dõi thao tác tạo, cập nhật, duyệt và xóa dữ liệu trong khu vực quản trị."
        />

        <CmsPanel>
          <AdminToolbar>
            <AdminSearchInput
              value={search}
              onChange={handleSearchChange}
              placeholder="Tìm hành động, loại hoặc mã đối tượng..."
            />
            <p className="text-xs font-semibold text-slate-500">
              Tổng cộng <strong className="text-slate-950">{total}</strong> hoạt
              động
            </p>
          </AdminToolbar>

          {loading ? (
            <AdminLoadingState title="Đang tải nhật ký" />
          ) : loadError ? (
            <AdminErrorState
              description={loadError}
              action={
                <Button
                  variant="adminSecondary"
                  onClick={() => void fetchLogs()}
                >
                  Thử lại
                </Button>
              }
            />
          ) : logs.length === 0 ? (
            <AdminEmptyState
              title="Không tìm thấy hoạt động"
              description={
                search
                  ? "Hãy thử một từ khóa khác."
                  : "Các hoạt động mới sẽ xuất hiện tại đây."
              }
            />
          ) : (
            <>
              <div className="max-w-full overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3.5">Thời gian</th>
                      <th className="px-5 py-3.5">Thành viên</th>
                      <th className="px-5 py-3.5">Hành động</th>
                      <th className="px-5 py-3.5">Đối tượng</th>
                      <th className="px-5 py-3.5">Mã đối tượng</th>
                      <th className="sticky right-0 border-l border-slate-100 bg-slate-50 px-5 py-3.5 text-right">
                        Chi tiết
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {logs.map((log) => (
                      <tr
                        key={log.id}
                        className="bg-white transition hover:bg-orange-50/35"
                      >
                        <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                          {new Date(log.createdAt).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-5 py-4">
                          {log.user ? (
                            <>
                              <p className="font-black text-slate-900">
                                {log.user.name || "Chưa đặt tên"}
                              </p>
                              <p className="mt-0.5 text-[10px] text-slate-400">
                                {log.user.email}
                              </p>
                            </>
                          ) : (
                            <span className="text-xs italic text-slate-400">
                              Hệ thống
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant={getActionVariant(log.action)}>
                            {log.action}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-xs font-bold text-slate-700">
                          {log.entityType}
                        </td>
                        <td className="max-w-48 truncate px-5 py-4 font-mono text-[10px] text-slate-400">
                          {log.entityId || "—"}
                        </td>
                        <td className="sticky right-0 border-l border-slate-100 bg-inherit px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedLog(log)}
                            className="acbt-icon-btn ml-auto grid h-9 w-9 place-items-center text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                            title="Xem dữ liệu chi tiết"
                            aria-label={`Xem chi tiết ${log.action}`}
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <AdminPagination
                page={page}
                pageCount={totalPages}
                totalItems={total}
                onPageChange={setPage}
              />
            </>
          )}
        </CmsPanel>
      </div>

      <AdminModal
        open={Boolean(selectedLog)}
        title="Chi tiết hoạt động"
        description={
          selectedLog
            ? `${selectedLog.action} · ${new Date(selectedLog.createdAt).toLocaleString("vi-VN")}`
            : undefined
        }
        onClose={() => setSelectedLog(null)}
        size="md"
        footer={
          <Button
            variant="adminSecondary"
            onClick={() => setSelectedLog(null)}
          >
            Đóng
          </Button>
        }
      >
        <pre className="max-h-[55vh] overflow-auto whitespace-pre-wrap break-words bg-slate-950 p-4 font-mono text-xs leading-6 text-emerald-300">
          {JSON.stringify(selectedLog?.details ?? {}, null, 2)}
        </pre>
      </AdminModal>
    </ProtectedRoute>
  );
}
