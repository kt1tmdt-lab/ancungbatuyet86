"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Database,
  FileText,
  Globe,
  HardDrive,
  Image as ImageIcon,
  Link2,
  Loader2,
  RefreshCw,
  ServerCog,
  ShieldCheck,
  ShoppingBag,
  Users,
  XCircle,
} from "lucide-react";

type Status = "ok" | "warning" | "danger";

type SystemData = {
  generatedAt: string;
  responseMs: number;
  environment: {
    nodeEnv: string;
    hasDatabaseUrl: boolean;
    hasJwtSecret: boolean;
  };
  summary: {
    posts: { total: number; published: number; draft: number; pending: number; scheduled: number };
    products: { total: number; published: number; draft: number; outOfStock: number; missingPurchaseUrl: number };
    pages: { total: number; published: number; draft: number };
    media: { total: number; totalSize: number };
    users: { total: number; admins: number };
    contacts: { total: number; new: number };
    sales: {
      activeLocations: number;
      inactiveLocations: number;
      activeChannels: number;
      inactiveChannels: number;
    };
  };
  checks: {
    id: string;
    label: string;
    status: Status;
    detail: string;
    href: string;
  }[];
  issues: {
    id: string;
    title: string;
    count: number;
    status: Status;
    href: string;
  }[];
  recentLogs: {
    id: string;
    action: string;
    entityType: string;
    entityId: string | null;
    createdAt: string;
    user: { email: string; name: string | null; role: string } | null;
  }[];
  quickLinks: {
    href: string;
    label: string;
    group: string;
  }[];
};

const statusStyle: Record<Status, string> = {
  ok: "border-emerald-100 bg-emerald-50 text-emerald-700",
  warning: "border-amber-100 bg-amber-50 text-amber-700",
  danger: "border-red-100 bg-red-50 text-red-700",
};

const statusLabel: Record<Status, string> = {
  ok: "Ổn",
  warning: "Cần xem",
  danger: "Nguy cấp",
};

function StatusIcon({ status }: { status: Status }) {
  if (status === "ok") return <CheckCircle2 size={18} />;
  if (status === "warning") return <AlertTriangle size={18} />;
  return <XCircle size={18} />;
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function StatTile({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <div className="border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{value}</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{detail}</p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-orange-50 text-orange-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function AdminSystemPage() {
  const { token } = useAuth();
  const [data, setData] = useState<SystemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSystemData = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/system", {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Không thể tải dữ liệu hệ thống");
      setData(await res.json());
    } catch (err) {
      console.error("Failed to load system overview", err);
      setError("Không thể tải trung tâm hệ thống lúc này.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchSystemData();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchSystemData]);

  const criticalCount = data?.issues.filter((item) => item.status === "danger").length || 0;
  const warningCount = data?.issues.filter((item) => item.status === "warning").length || 0;
  const healthyCount = data?.checks.filter((item) => item.status === "ok").length || 0;

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      <div className="space-y-7 pb-16">
        <div className="border border-slate-800 bg-slate-950 p-6 text-white shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 bg-orange-500 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                <ServerCog size={15} />
                Trung tâm kiểm soát
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Quản lí hệ thống toàn diện</h1>
              <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-slate-300">
                Một màn hình để admin rà soát sức khỏe website, dữ liệu nội dung, cấu hình quan trọng, cảnh báo vận hành và lối tắt quản trị.
              </p>
            </div>
            <button
              type="button"
              onClick={fetchSystemData}
              disabled={loading}
              className="inline-flex w-fit items-center gap-2 border border-slate-700 bg-slate-900 px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-100 transition hover:border-orange-500 hover:text-orange-300 disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              Rà soát lại
            </button>
          </div>
        </div>

        {error && (
          <div className="border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        {loading && !data ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-36 animate-pulse border border-slate-200 bg-slate-100" />
            ))}
          </div>
        ) : data ? (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="border border-emerald-100 bg-emerald-50 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">Hạng mục ổn</p>
                <p className="mt-2 text-3xl font-black text-emerald-800">{healthyCount}/{data.checks.length}</p>
              </div>
              <div className="border border-amber-100 bg-amber-50 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">Cảnh báo</p>
                <p className="mt-2 text-3xl font-black text-amber-800">{warningCount}</p>
              </div>
              <div className="border border-red-100 bg-red-50 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-700">Nguy cấp</p>
                <p className="mt-2 text-3xl font-black text-red-800">{criticalCount}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatTile
                icon={<FileText size={21} />}
                label="Nội dung"
                value={data.summary.posts.total}
                detail={`${data.summary.posts.published} bài đã xuất bản, ${data.summary.posts.pending} bài chờ duyệt`}
              />
              <StatTile
                icon={<ShoppingBag size={21} />}
                label="Sản phẩm"
                value={data.summary.products.total}
                detail={`${data.summary.products.published} đang bán, ${data.summary.products.outOfStock} hết hàng`}
              />
              <StatTile
                icon={<ImageIcon size={21} />}
                label="Media"
                value={data.summary.media.total}
                detail={`Dung lượng đã ghi nhận ${formatBytes(data.summary.media.totalSize)}`}
              />
              <StatTile
                icon={<Users size={21} />}
                label="Thành viên"
                value={data.summary.users.total}
                detail={`${data.summary.users.admins} tài khoản quản trị`}
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-950">Kiểm tra hệ thống</h2>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Cập nhật lúc {formatTime(data.generatedAt)} trong {data.responseMs}ms.
                    </p>
                  </div>
                  <Database size={22} className="text-orange-600" />
                </div>
                <div className="grid gap-3">
                  {data.checks.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="grid gap-3 border border-slate-100 bg-slate-50 p-4 transition hover:border-orange-200 hover:bg-orange-50 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                    >
                      <span className={`flex h-10 w-10 items-center justify-center border ${statusStyle[item.status]}`}>
                        <StatusIcon status={item.status} />
                      </span>
                      <span>
                        <span className="block text-sm font-black text-slate-950">{item.label}</span>
                        <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">{item.detail}</span>
                      </span>
                      <span className={`w-fit border px-2 py-1 text-[10px] font-black uppercase tracking-wider ${statusStyle[item.status]}`}>
                        {statusLabel[item.status]}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-950">Việc cần rà soát</h2>
                    <p className="mt-1 text-xs font-semibold text-slate-500">Các điểm dữ liệu có thể ảnh hưởng vận hành.</p>
                  </div>
                  <AlertTriangle size={22} className="text-amber-600" />
                </div>
                <div className="space-y-3">
                  {data.issues.map((issue) => (
                    <Link
                      key={issue.id}
                      href={issue.href}
                      className="flex items-center justify-between gap-4 border border-slate-100 p-4 transition hover:border-orange-200 hover:bg-orange-50"
                    >
                      <div>
                        <p className="text-sm font-black text-slate-950">{issue.title}</p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          {issue.count > 0 ? `${issue.count} mục cần kiểm tra` : "Không có vấn đề"}
                        </p>
                      </div>
                      <span className={`flex h-9 w-9 items-center justify-center border ${statusStyle[issue.status]}`}>
                        {issue.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-black text-slate-950">Lối tắt quản trị</h2>
                  <Link2 size={21} className="text-orange-600" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {data.quickLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group border border-slate-100 bg-slate-50 p-4 transition hover:border-orange-200 hover:bg-orange-50"
                    >
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-600">{link.group}</p>
                      <p className="mt-2 flex items-center justify-between gap-3 text-sm font-black text-slate-950">
                        {link.label}
                        <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-950">Nhật ký gần nhất</h2>
                    <p className="mt-1 text-xs font-semibold text-slate-500">Theo dõi các thay đổi quản trị mới nhất.</p>
                  </div>
                  <Activity size={21} className="text-orange-600" />
                </div>
                <div className="space-y-3">
                  {data.recentLogs.length === 0 ? (
                    <p className="border border-dashed border-slate-200 p-5 text-center text-xs font-semibold text-slate-400">
                      Chưa có nhật ký hoạt động.
                    </p>
                  ) : (
                    data.recentLogs.map((log) => (
                      <div key={log.id} className="grid gap-3 border border-slate-100 p-4 sm:grid-cols-[auto_1fr]">
                        <div className="flex h-10 w-10 items-center justify-center bg-slate-100 text-slate-600">
                          <Clock3 size={17} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-slate-950">
                            {log.action} / {log.entityType}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-slate-500">
                            {log.user?.name || log.user?.email || "Hệ thống"} - {formatTime(log.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <Link
                  href="/admin/activity-logs"
                  className="mt-5 inline-flex items-center gap-2 bg-slate-950 px-4 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-orange-600"
                >
                  Xem toàn bộ nhật ký
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <StatTile
                icon={<Globe size={20} />}
                label="Trang tĩnh"
                value={data.summary.pages.total}
                detail={`${data.summary.pages.published} đã xuất bản, ${data.summary.pages.draft} bản nháp`}
              />
              <StatTile
                icon={<ShieldCheck size={20} />}
                label="Môi trường"
                value={data.environment.nodeEnv}
                detail={`DB: ${data.environment.hasDatabaseUrl ? "có" : "thiếu"} / JWT: ${data.environment.hasJwtSecret ? "có" : "fallback"}`}
              />
              <StatTile
                icon={<HardDrive size={20} />}
                label="Điểm bán"
                value={data.summary.sales.activeLocations + data.summary.sales.activeChannels}
                detail={`${data.summary.sales.inactiveLocations + data.summary.sales.inactiveChannels} mục đang tắt`}
              />
              <StatTile
                icon={<Activity size={20} />}
                label="Liên hệ"
                value={data.summary.contacts.total}
                detail={`${data.summary.contacts.new} tin nhắn mới cần xử lý`}
              />
            </div>
          </>
        ) : null}
      </div>
    </ProtectedRoute>
  );
}
