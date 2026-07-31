"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { WebsiteContentManager } from "@/app/admin/marketing/page";
import { useAuth } from "@/lib/auth-context";
import { normalizeSiteConfig, type SiteConfigData } from "@/lib/site-config-defaults";

export default function AdminSalesContentPage() {
  const { token } = useAuth();
  const [config, setConfig] = useState<SiteConfigData | null>(null);
  const [saving, setSaving] = useState(false);

  const loadVisibility = useCallback(async () => {
    try {
      const response = await fetch("/api/settings", { cache: "no-store" });
      if (!response.ok) throw new Error("Không thể tải cấu hình");
      const payload = await response.json();
      setConfig(normalizeSiteConfig(payload?.data));
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải trạng thái hiển thị Điểm bán");
    }
  }, []);

  useEffect(() => {
    void loadVisibility();
  }, [loadVisibility]);

  const toggleVisibility = async () => {
    if (!config || !token || saving) return;

    const nextEnabled = !config.visibility.salesPointsEnabled;
    const nextConfig: SiteConfigData = {
      ...config,
      visibility: {
        ...config.visibility,
        salesPointsEnabled: nextEnabled,
      },
    };

    setSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nextConfig),
      });
      if (!response.ok) throw new Error("Không thể lưu cấu hình");
      setConfig(nextConfig);
      toast.success(
        nextEnabled
          ? "Đã hiện lại Điểm bán trên website"
          : "Đã tạm ẩn Điểm bán khỏi website và header",
      );
    } catch (error) {
      console.error(error);
      toast.error("Không thể thay đổi trạng thái hiển thị");
    } finally {
      setSaving(false);
    }
  };

  const enabled = config?.visibility.salesPointsEnabled ?? true;

  return (
    <div>
      <div className="mx-auto mt-6 flex max-w-[1440px] flex-col gap-4 border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center ${enabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
            {enabled ? <Eye size={20} /> : <EyeOff size={20} />}
          </span>
          <div>
            <p className="text-sm font-black text-slate-950">
              {enabled ? "Điểm bán đang hiển thị" : "Điểm bán đang tạm ẩn"}
            </p>
            <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
              Công tắc này ẩn cả trang và mục Điểm bán trên header; toàn bộ dữ liệu bên dưới vẫn được giữ nguyên.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleVisibility}
          disabled={!config || !token || saving}
          className={`inline-flex min-w-44 items-center justify-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
            enabled ? "bg-slate-900 hover:bg-slate-700" : "bg-orange-600 hover:bg-orange-700"
          }`}
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : enabled ? <EyeOff size={16} /> : <Eye size={16} />}
          {enabled ? "Tạm ẩn Điểm bán" : "Hiện lại Điểm bán"}
        </button>
      </div>
      <WebsiteContentManager scope="sales" />
    </div>
  );
}
