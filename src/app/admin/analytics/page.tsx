"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ChartNoAxesCombined,
  Clock3,
  ExternalLink,
  Eye,
  MousePointerClick,
  RefreshCw,
  Settings2,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { adminRequest, getAdminErrorMessage } from "@/lib/admin-client";
import { useAuth } from "@/lib/auth-context";

type AnalyticsReport = {
  configured: true;
  propertyId: string;
  measurementId: string;
  days: number;
  totals: {
    activeUsers: number;
    newUsers: number;
    sessions: number;
    views: number;
    engagementRate: number;
    engagementSecondsPerSession: number;
  };
  daily: Array<{
    date: string;
    activeUsers: number;
    sessions: number;
    views: number;
  }>;
  topPages: Array<{
    path: string;
    title: string;
    views: number;
    activeUsers: number;
  }>;
  sources: Array<{
    source: string;
    medium: string;
    sessions: number;
    activeUsers: number;
  }>;
};

type ConfigurationStatus = {
  configured: false;
  measurementId: string;
  missing: string[];
};

type AnalyticsResponse = AnalyticsReport | ConfigurationStatus;
type DateRange = 7 | 30 | 90;

const RANGE_OPTIONS: Array<{ value: DateRange; label: string }> = [
  { value: 7, label: "7 ngày" },
  { value: 30, label: "30 ngày" },
  { value: 90, label: "90 ngày" },
];

const numberFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 0,
});

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function formatDuration(seconds: number) {
  const rounded = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(rounded / 60);
  const remainingSeconds = rounded % 60;
  return minutes > 0 ? `${minutes}p ${remainingSeconds}s` : `${remainingSeconds}s`;
}

function formatDate(value: string) {
  if (!/^\d{8}$/.test(value)) return value;
  return `${value.slice(6, 8)}/${value.slice(4, 6)}`;
}

function MetricCard({
  label,
  value,
  note,
  icon: Icon,
}: {
  label: string;
  value: string;
  note: string;
  icon: typeof UsersRound;
}) {
  return (
    <div className="border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
            {label}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{note}</p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center bg-orange-50 text-orange-600">
          <Icon size={19} />
        </span>
      </div>
    </div>
  );
}

export default function GoogleAnalyticsPage() {
  const { token } = useAuth();
  const [range, setRange] = useState<DateRange>(30);
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");

    try {
      const report = await adminRequest<AnalyticsResponse>(
        `/api/admin/analytics?days=${range}`,
        { token },
      );
      setData(report);
    } catch (requestError) {
      setError(
        getAdminErrorMessage(requestError, "Không thể tải dữ liệu Google Analytics."),
      );
    } finally {
      setLoading(false);
    }
  }, [range, token]);

  useEffect(() => {
    if (!token) return;
    const timer = window.setTimeout(() => void loadReport(), 0);
    return () => window.clearTimeout(timer);
  }, [loadReport, token]);

  const maxDailyViews = useMemo(() => {
    if (!data?.configured) return 1;
    return Math.max(...data.daily.map((item) => item.views), 1);
  }, [data]);

  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "EDITOR", "MARKETING"]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center bg-orange-600 text-white">
              <ChartNoAxesCombined size={22} />
            </span>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950">
                Google Analytics
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Báo cáo truy cập GA4 của website Ăn Cùng Bà Tuyết
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRange(option.value)}
                className={`h-9 border px-3 text-xs font-black transition ${
                  range === option.value
                    ? "border-orange-600 bg-orange-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-600"
                }`}
              >
                {option.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => void loadReport()}
              disabled={loading}
              className="grid h-9 w-9 place-items-center border border-slate-200 text-slate-600 transition hover:border-orange-300 hover:text-orange-600 disabled:opacity-50"
              aria-label="Tải lại báo cáo"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {loading && !data ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="h-32 animate-pulse border border-slate-200 bg-white" />
            ))}
          </div>
        ) : null}

        {error ? (
          <div className="border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            <p className="font-black">Không thể kết nối Google Analytics</p>
            <p className="mt-1 leading-6">{error}</p>
          </div>
        ) : null}

        {data && !data.configured ? (
          <div className="border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <Settings2 className="mt-0.5 shrink-0 text-amber-700" size={22} />
              <div className="min-w-0">
                <h2 className="text-lg font-black text-amber-950">Cần kết nối Data API</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-amber-900/80">
                  Mã đo lường <strong>{data.measurementId}</strong> đã gửi lượt truy cập về GA4.
                  Để đọc báo cáo ngay tại trang này, hãy bật Google Analytics Data API,
                  cấp quyền Viewer cho service account và thêm các biến sau vào file .env trên VPS.
                </p>
                <div className="mt-4 overflow-x-auto bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-200">
                  {data.missing.map((name) => (
                    <div key={name}>{name}=&quot;&quot;</div>
                  ))}
                </div>
                <Link
                  href="https://analytics.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-black text-amber-800 hover:text-orange-700"
                >
                  Mở Google Analytics <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        {data?.configured ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <MetricCard label="Người dùng" value={formatNumber(data.totals.activeUsers)} note="Người dùng hoạt động" icon={UsersRound} />
              <MetricCard label="Người dùng mới" value={formatNumber(data.totals.newUsers)} note="Lần đầu truy cập" icon={UserPlus} />
              <MetricCard label="Phiên truy cập" value={formatNumber(data.totals.sessions)} note="Tổng số phiên" icon={MousePointerClick} />
              <MetricCard label="Lượt xem" value={formatNumber(data.totals.views)} note="Tổng lượt xem trang" icon={Eye} />
              <MetricCard label="Tỷ lệ tương tác" value={`${(data.totals.engagementRate * 100).toFixed(1)}%`} note="Phiên có tương tác" icon={Activity} />
              <MetricCard label="Tương tác / phiên" value={formatDuration(data.totals.engagementSecondsPerSession)} note="Thời gian trung bình" icon={Clock3} />
            </div>

            <section className="border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-black text-slate-950">Lượt xem theo ngày</h2>
                  <p className="mt-1 text-xs text-slate-500">Dữ liệu trong {data.days} ngày gần nhất</p>
                </div>
                <span className="text-xs font-bold text-slate-400">Property {data.propertyId}</span>
              </div>
              <div className="mt-5 overflow-x-auto pb-2">
                <div className="flex h-56 min-w-full items-end gap-2" style={{ width: `${Math.max(data.daily.length * 34, 640)}px` }}>
                  {data.daily.map((item) => (
                    <div key={item.date} className="group flex h-full min-w-6 flex-1 flex-col items-center justify-end">
                      <span className="mb-1 text-[10px] font-black text-slate-600 opacity-0 transition group-hover:opacity-100">
                        {formatNumber(item.views)}
                      </span>
                      <div
                        className="w-full min-h-0.5 bg-orange-500 transition hover:bg-orange-600"
                        style={{ height: `${Math.max((item.views / maxDailyViews) * 170, 2)}px` }}
                        title={`${formatDate(item.date)}: ${formatNumber(item.views)} lượt xem`}
                      />
                      <span className="mt-2 text-[9px] font-bold text-slate-400 [writing-mode:vertical-rl]">
                        {formatDate(item.date)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-2">
              <section className="border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                  <h2 className="font-black text-slate-950">Trang được xem nhiều</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
                      <tr><th className="px-5 py-3">Trang</th><th className="px-4 py-3 text-right">Người dùng</th><th className="px-5 py-3 text-right">Lượt xem</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.topPages.map((page) => (
                        <tr key={`${page.path}-${page.title}`}>
                          <td className="max-w-xs px-5 py-3"><p className="truncate font-bold text-slate-800">{page.title}</p><p className="mt-0.5 truncate text-xs text-slate-400">{page.path}</p></td>
                          <td className="px-4 py-3 text-right text-slate-600">{formatNumber(page.activeUsers)}</td>
                          <td className="px-5 py-3 text-right font-black text-slate-900">{formatNumber(page.views)}</td>
                        </tr>
                      ))}
                      {data.topPages.length === 0 ? <tr><td colSpan={3} className="px-5 py-10 text-center text-slate-500">Chưa có dữ liệu.</td></tr> : null}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                  <h2 className="font-black text-slate-950">Nguồn truy cập</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
                      <tr><th className="px-5 py-3">Nguồn / phương tiện</th><th className="px-4 py-3 text-right">Người dùng</th><th className="px-5 py-3 text-right">Phiên</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.sources.map((source) => (
                        <tr key={`${source.source}-${source.medium}`}>
                          <td className="px-5 py-3"><p className="font-bold text-slate-800">{source.source}</p><p className="mt-0.5 text-xs text-slate-400">{source.medium}</p></td>
                          <td className="px-4 py-3 text-right text-slate-600">{formatNumber(source.activeUsers)}</td>
                          <td className="px-5 py-3 text-right font-black text-slate-900">{formatNumber(source.sessions)}</td>
                        </tr>
                      ))}
                      {data.sources.length === 0 ? <tr><td colSpan={3} className="px-5 py-10 text-center text-slate-500">Chưa có dữ liệu.</td></tr> : null}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            <div className="flex justify-end">
              <Link href={`https://analytics.google.com/analytics/web/#/p${data.propertyId}/reports/intelligenthome`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-black text-orange-600 hover:text-orange-700">
                Xem báo cáo đầy đủ trên Google Analytics <ExternalLink size={13} />
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </ProtectedRoute>
  );
}
