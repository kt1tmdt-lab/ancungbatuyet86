"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ChartNoAxesCombined,
  Download,
  Eye,
  MapPin,
  MonitorSmartphone,
  RefreshCw,
  Settings2,
  UsersRound,
} from "lucide-react";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { adminRequest, getAdminErrorMessage } from "@/lib/admin-client";
import { useAuth } from "@/lib/auth-context";

type MonthlyReport = {
  source: "internal";
  month: string;
  generatedAt: string;
  totals: { pageViews: number; uniqueVisitors: number; viewsPerVisitor: number };
  previous: { pageViews: number; uniqueVisitors: number };
  daily: Array<{ date: string; views: number; visitors: number }>;
  topPages: Array<{ path: string; views: number; visitors: number }>;
  sources: Array<{ name: string; views: number; visitors: number }>;
  recentVisitors: Array<{
    visitorId: string;
    ipMasked: string | null;
    views: number;
    lastSeen: string;
    lastPath: string;
    source: string;
  }>;
};

type RealtimeReport = {
  configured: true;
  propertyId: string;
  measurementId: string;
  generatedAt: string;
  activeUsers: number;
  activeUsersLast5Minutes: number;
  views: number;
  events: number;
  pages: Array<{ name: string; views: number; activeUsers: number }>;
  eventNames: Array<{ name: string; count: number }>;
  devices: Array<{ name: string; activeUsers: number }>;
  cities: Array<{ name: string; activeUsers: number }>;
};

type RealtimeConfiguration = {
  configured: false;
  propertyId: string;
  measurementId: string;
  missing: string[];
};

const numberFormatter = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 });

function currentMonth() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  return `${year}-${month}`;
}

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function changePercent(current: number, previous: number) {
  if (!previous) return current ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function MetricCard({ label, value, note, icon: Icon }: {
  label: string;
  value: string;
  note: string;
  icon: typeof UsersRound;
}) {
  return (
    <div className="border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{note}</p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center bg-orange-50 text-orange-600"><Icon size={19} /></span>
      </div>
    </div>
  );
}

function DataTable({ title, icon: Icon, headers, rows }: {
  title: string;
  icon: typeof Activity;
  headers: string[];
  rows: Array<Array<string | number>>;
}) {
  return (
    <section className="border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
        <Icon size={16} className="text-orange-600" />
        <h2 className="font-black text-slate-950">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
            <tr>{headers.map((header, index) => <th key={header} className={`px-5 py-3 ${index ? "text-right" : ""}`}>{header}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, rowIndex) => (
              <tr key={`${row[0]}-${rowIndex}`}>
                {row.map((cell, index) => <td key={index} className={`px-5 py-3 ${index ? "text-right font-black text-slate-900" : "max-w-xs truncate font-bold text-slate-700"}`}>{typeof cell === "number" ? formatNumber(cell) : cell}</td>)}
              </tr>
            ))}
            {!rows.length ? <tr><td colSpan={headers.length} className="px-5 py-10 text-center text-slate-500">Chưa có dữ liệu.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function VisitorTable({ visitors }: { visitors: MonthlyReport["recentVisitors"] }) {
  return (
    <section className="border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <UsersRound size={16} className="text-orange-600" />
          <h2 className="font-black text-slate-950">Danh sách khách truy cập</h2>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Hiển thị tối đa 200 khách gần nhất trong tháng. IP được che để bảo vệ dữ liệu cá nhân.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">Mã khách</th>
              <th className="px-5 py-3">IP đã che</th>
              <th className="px-5 py-3">Lần cuối</th>
              <th className="px-5 py-3">Trang cuối</th>
              <th className="px-5 py-3">Nguồn</th>
              <th className="px-5 py-3 text-right">Lượt xem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visitors.map((visitor) => (
              <tr key={visitor.visitorId} className="hover:bg-orange-50/40">
                <td className="px-5 py-3 font-mono text-xs font-bold text-slate-700">{visitor.visitorId}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-700">{visitor.ipMasked || "Dữ liệu cũ"}</td>
                <td className="whitespace-nowrap px-5 py-3 text-slate-600">{formatDateTime(visitor.lastSeen)}</td>
                <td className="max-w-xs truncate px-5 py-3 font-medium text-slate-700" title={visitor.lastPath}>{visitor.lastPath}</td>
                <td className="px-5 py-3 text-slate-600">{visitor.source}</td>
                <td className="px-5 py-3 text-right font-black text-slate-900">{formatNumber(visitor.views)}</td>
              </tr>
            ))}
            {!visitors.length ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-slate-500">Chưa có dữ liệu khách truy cập.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function AnalyticsPage() {
  const { token } = useAuth();
  const [month, setMonth] = useState(currentMonth);
  const [monthly, setMonthly] = useState<MonthlyReport | null>(null);
  const [realtime, setRealtime] = useState<RealtimeReport | RealtimeConfiguration | null>(null);
  const [monthlyLoading, setMonthlyLoading] = useState(true);
  const [realtimeLoading, setRealtimeLoading] = useState(true);
  const [monthlyError, setMonthlyError] = useState("");
  const [realtimeError, setRealtimeError] = useState("");

  const loadMonthly = useCallback(async () => {
    if (!token) return;
    setMonthlyLoading(true);
    setMonthlyError("");
    try {
      setMonthly(await adminRequest<MonthlyReport>(`/api/admin/analytics?month=${month}`, { token }));
    } catch (error) {
      setMonthlyError(getAdminErrorMessage(error, "Không thể tải báo cáo tháng."));
    } finally {
      setMonthlyLoading(false);
    }
  }, [month, token]);

  const loadRealtime = useCallback(async () => {
    if (!token) return;
    setRealtimeLoading(true);
    setRealtimeError("");
    try {
      setRealtime(await adminRequest<RealtimeReport | RealtimeConfiguration>("/api/admin/analytics/realtime", { token }));
    } catch (error) {
      setRealtimeError(getAdminErrorMessage(error, "Không thể tải dữ liệu realtime."));
    } finally {
      setRealtimeLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const timer = window.setTimeout(() => void loadMonthly(), 0);
    return () => window.clearTimeout(timer);
  }, [loadMonthly, token]);

  useEffect(() => {
    if (!token) return;
    const initial = window.setTimeout(() => void loadRealtime(), 0);
    const interval = window.setInterval(() => void loadRealtime(), 60_000);
    return () => { window.clearTimeout(initial); window.clearInterval(interval); };
  }, [loadRealtime, token]);

  const maxDailyViews = useMemo(() => Math.max(...(monthly?.daily.map((item) => item.views) || []), 1), [monthly]);
  const viewsChange = monthly ? changePercent(monthly.totals.pageViews, monthly.previous.pageViews) : 0;
  const visitorsChange = monthly ? changePercent(monthly.totals.uniqueVisitors, monthly.previous.uniqueVisitors) : 0;

  const exportCsv = () => {
    if (!monthly) return;
    const rows: Array<Array<string | number>> = [
      ["Báo cáo truy cập acbt.vn", monthly.month],
      ["Lượt xem", monthly.totals.pageViews],
      ["Khách truy cập ước tính", monthly.totals.uniqueVisitors],
      [],
      ["Ngày", "Lượt xem", "Khách truy cập ước tính"],
      ...monthly.daily.map((item) => [item.date, item.views, item.visitors]),
      [],
      ["Trang", "Lượt xem", "Khách truy cập ước tính"],
      ...monthly.topPages.map((item) => [item.path, item.views, item.visitors]),
      [],
      ["Nguồn", "Lượt xem", "Khách truy cập ước tính"],
      ...monthly.sources.map((item) => [item.name, item.views, item.visitors]),
      [],
      ["Danh sách khách truy cập"],
      ["Mã khách", "IP đã che", "Lần cuối", "Trang cuối", "Nguồn", "Lượt xem"],
      ...monthly.recentVisitors.map((item) => [
        item.visitorId,
        item.ipMasked || "Dữ liệu cũ",
        formatDateTime(item.lastSeen),
        item.lastPath,
        item.source,
        item.views,
      ]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `acbt-analytics-${monthly.month}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "EDITOR", "MARKETING"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center bg-orange-600 text-white"><ChartNoAxesCombined size={22} /></span>
            <div><h1 className="text-2xl font-black tracking-tight text-slate-950">ACBT Analytics</h1><p className="mt-1 text-sm text-slate-500">Số liệu truy cập website acbt.vn</p></div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input type="month" value={month} max={currentMonth()} onChange={(event) => setMonth(event.target.value)} className="h-10 border border-slate-200 px-3 text-sm font-bold text-slate-700" />
            <button type="button" onClick={exportCsv} disabled={!monthly} className="inline-flex h-10 items-center gap-2 border border-slate-200 px-3 text-xs font-black text-slate-700 hover:border-orange-300 hover:text-orange-600 disabled:opacity-40"><Download size={15} /> Xuất CSV</button>
            <button type="button" onClick={() => { void loadMonthly(); void loadRealtime(); }} disabled={monthlyLoading || realtimeLoading} className="grid h-10 w-10 place-items-center border border-slate-200 text-slate-600 hover:text-orange-600 disabled:opacity-50" aria-label="Tải lại"><RefreshCw size={16} className={monthlyLoading || realtimeLoading ? "animate-spin" : ""} /></button>
          </div>
        </header>

        {monthlyError ? <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">{monthlyError}</div> : null}
        {monthly ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <MetricCard label="Lượt xem trong tháng" value={formatNumber(monthly.totals.pageViews)} note={`${viewsChange >= 0 ? "+" : ""}${viewsChange.toFixed(1)}% so với tháng trước`} icon={Eye} />
              <MetricCard label="Khách truy cập ước tính" value={formatNumber(monthly.totals.uniqueVisitors)} note={`${visitorsChange >= 0 ? "+" : ""}${visitorsChange.toFixed(1)}% so với tháng trước`} icon={UsersRound} />
              <MetricCard label="Lượt xem / khách" value={formatNumber(monthly.totals.viewsPerVisitor)} note="Tính từ dữ liệu truy cập nội bộ" icon={Activity} />
            </div>

            <section className="border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="border-b border-slate-100 pb-4"><h2 className="font-black text-slate-950">Lượt xem theo ngày</h2><p className="mt-1 text-xs text-slate-500">Tháng {monthly.month}</p></div>
              <div className="mt-5 overflow-x-auto pb-2">
                <div className="flex h-56 items-end gap-2" style={{ width: `${Math.max(monthly.daily.length * 36, 640)}px` }}>
                  {monthly.daily.map((item) => <div key={item.date} className="group flex h-full min-w-6 flex-1 flex-col items-center justify-end"><span className="mb-1 text-[10px] font-black text-slate-600 opacity-0 group-hover:opacity-100">{item.views}</span><div className="w-full min-h-0.5 bg-orange-500" style={{ height: `${Math.max((item.views / maxDailyViews) * 170, 2)}px` }} title={`${item.date}: ${item.views} lượt xem`} /><span className="mt-2 text-[9px] font-bold text-slate-400">{item.date.slice(8)}</span></div>)}
                </div>
              </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-2">
              <DataTable title="Trang được xem nhiều" icon={Eye} headers={["Trang", "Khách", "Lượt xem"]} rows={monthly.topPages.map((item) => [item.path, item.visitors, item.views])} />
              <DataTable title="Nguồn truy cập" icon={ChartNoAxesCombined} headers={["Nguồn", "Khách", "Lượt xem"]} rows={monthly.sources.map((item) => [item.name, item.visitors, item.views])} />
            </div>
            <VisitorTable visitors={monthly.recentVisitors || []} />
          </>
        ) : monthlyLoading ? <div className="h-32 animate-pulse border border-slate-200 bg-white" /> : null}

        <div className="flex items-center justify-between border-b border-slate-200 pb-3 pt-3"><div><h2 className="text-xl font-black text-slate-950">Realtime GA4</h2><p className="mt-1 text-xs text-slate-500">Tự làm mới mỗi 60 giây · dữ liệu 30 phút gần nhất</p></div><span className={`h-2.5 w-2.5 rounded-full ${realtime?.configured ? "bg-green-500" : "bg-amber-400"}`} /></div>
        {realtimeError ? <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">{realtimeError}</div> : null}
        {realtime && !realtime.configured ? (
          <div className="border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
            <div className="flex gap-3"><Settings2 className="mt-0.5 shrink-0" size={20} /><div><p className="font-black">Báo cáo tháng đã hoạt động. Realtime cần thêm quyền đọc GA4.</p><p className="mt-1 leading-6">Thêm <code>GOOGLE_ANALYTICS_CLIENT_EMAIL</code> và <code>GOOGLE_ANALYTICS_PRIVATE_KEY</code> vào môi trường VPS, rồi cấp quyền Viewer cho email đó tại GA4 Property {realtime.propertyId}.</p></div></div>
          </div>
        ) : null}
        {realtime?.configured ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Đang hoạt động" value={formatNumber(realtime.activeUsers)} note="Trong 30 phút qua" icon={UsersRound} />
              <MetricCard label="Hoạt động gần đây" value={formatNumber(realtime.activeUsersLast5Minutes)} note="Trong 5 phút qua" icon={Activity} />
              <MetricCard label="Lượt xem realtime" value={formatNumber(realtime.views)} note="Trong 30 phút qua" icon={Eye} />
              <MetricCard label="Sự kiện realtime" value={formatNumber(realtime.events)} note="Trong 30 phút qua" icon={ChartNoAxesCombined} />
            </div>
            <div className="grid gap-6 xl:grid-cols-2">
              <DataTable title="Trang đang được xem" icon={Eye} headers={["Trang", "Người dùng", "Lượt xem"]} rows={realtime.pages.map((item) => [item.name, item.activeUsers, item.views])} />
              <DataTable title="Sự kiện" icon={Activity} headers={["Tên sự kiện", "Số lượng"]} rows={realtime.eventNames.map((item) => [item.name, item.count])} />
              <DataTable title="Thiết bị" icon={MonitorSmartphone} headers={["Loại thiết bị", "Người dùng"]} rows={realtime.devices.map((item) => [item.name, item.activeUsers])} />
              <DataTable title="Thành phố" icon={MapPin} headers={["Thành phố", "Người dùng"]} rows={realtime.cities.map((item) => [item.name, item.activeUsers])} />
            </div>
            <div className="flex justify-end"><Link href={`https://analytics.google.com/analytics/web/#/p${realtime.propertyId}/reports/realtime`} target="_blank" className="text-xs font-black text-orange-600 hover:text-orange-700">Mở Google Analytics →</Link></div>
          </>
        ) : realtimeLoading ? <div className="h-28 animate-pulse border border-slate-200 bg-white" /> : null}
      </div>
    </ProtectedRoute>
  );
}
