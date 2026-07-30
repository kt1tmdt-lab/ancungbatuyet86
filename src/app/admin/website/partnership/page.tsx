"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, ImagePlus, Save } from "lucide-react";
import toast from "react-hot-toast";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import {
  normalizePartnershipConfig,
  type PartnershipPageConfig,
} from "@/lib/partnership-config";

export default function AdminPartnershipPage() {
  const { token } = useAuth();
  const [config, setConfig] = useState<PartnershipPageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    fetch("/api/settings/partnership", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Load failed");
        const payload = await response.json();
        setConfig(normalizePartnershipConfig(payload?.data));
      })
      .catch(() => toast.error("Không tải được ảnh trang Hợp tác"))
      .finally(() => setLoading(false));
  }, []);

  const updateHeroImage = (imageUrl: string) => {
    setConfig((current) => (current ? { ...current, imageUrl } : current));
    setPickerOpen(false);
  };

  const patch = (next: Partial<PartnershipPageConfig>) => {
    setConfig((current) => (current ? { ...current, ...next } : current));
  };

  const save = async () => {
    if (!token || !config) return;
    setSaving(true);

    try {
      const response = await fetch("/api/settings/partnership", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) throw new Error("Save failed");
      toast.success("Đã cập nhật ảnh trang Hợp tác");
    } catch {
      toast.error("Không lưu được ảnh. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute
      allowedRoles={["ADMIN", "SUPER_ADMIN", "MARKETING", "EDITOR"]}
    >
      <div className="mx-auto max-w-6xl space-y-6 pb-16">
        <header className="flex flex-col gap-4 border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">
              Quản lý website
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Trang Hợp tác
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Thay ảnh lớn ở đầu trang Hợp tác. Ảnh đã lưu sẽ xuất hiện trực
              tiếp ngoài website.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/hop-tac"
              target="_blank"
              className="inline-flex items-center gap-2 border border-slate-300 px-4 py-3 text-xs font-black uppercase tracking-wide text-slate-700 transition hover:border-orange-500 hover:text-orange-600"
            >
              <Eye size={15} /> Xem trang
            </Link>
            <button
              type="button"
              onClick={save}
              disabled={loading || saving || !config}
              className="inline-flex items-center gap-2 bg-orange-600 px-5 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={15} />
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </header>

        <section className="border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5">
            <h2 className="text-xl font-black text-slate-950">
              Nội dung đầu trang
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Các nội dung dưới đây nằm cùng khối với ảnh hero.
            </p>
          </div>

          {loading || !config ? (
            <p className="text-sm font-bold text-slate-500">
              Đang tải nội dung...
            </p>
          ) : (
            <div className="grid gap-5">
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">Nhãn nhỏ</span>
                <input value={config.label} onChange={(event) => patch({ label: event.target.value })} className="w-full border border-slate-300 px-4 py-3 text-sm font-semibold outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">Tiêu đề lớn</span>
                <input value={config.title} onChange={(event) => patch({ title: event.target.value })} className="w-full border border-slate-300 px-4 py-3 text-sm font-semibold outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">Mô tả</span>
                <textarea value={config.subtitle} onChange={(event) => patch({ subtitle: event.target.value })} className="min-h-28 w-full border border-slate-300 px-4 py-3 text-sm font-semibold leading-7 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
              </label>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">Chữ trên góc ảnh</span>
                  <input value={config.imageLabel} onChange={(event) => patch({ imageLabel: event.target.value })} className="w-full border border-slate-300 px-4 py-3 text-sm font-semibold outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">Nội dung phủ trên ảnh</span>
                  <input value={config.imageCaption} onChange={(event) => patch({ imageCaption: event.target.value })} className="w-full border border-slate-300 px-4 py-3 text-sm font-semibold outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
                </label>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">Tên nút (để trống sẽ ẩn)</span>
                  <input value={config.ctaText} onChange={(event) => patch({ ctaText: event.target.value })} className="w-full border border-slate-300 px-4 py-3 text-sm font-semibold outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">Đường dẫn của nút</span>
                  <input value={config.ctaLink} onChange={(event) => patch({ ctaLink: event.target.value })} placeholder="/lien-he" className="w-full border border-slate-300 px-4 py-3 text-sm font-semibold outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
                </label>
              </div>
            </div>
          )}
        </section>

        <section className="border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5">
            <h2 className="text-xl font-black text-slate-950">
              Ảnh đầu trang
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Nên dùng ảnh ngang, rõ nét. Vùng chữ phủ trên ảnh vẫn được giữ
              nguyên theo giao diện hiện tại.
            </p>
          </div>

          {loading ? (
            <div className="grid min-h-72 place-items-center bg-slate-50 text-sm font-bold text-slate-500">
              Đang tải ảnh...
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="group relative min-h-72 overflow-hidden border border-dashed border-orange-300 bg-orange-50 text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
              >
                {config?.imageUrl ? (
                  <img
                    src={config.imageUrl}
                    alt="Ảnh hero trang Hợp tác"
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <ImagePlus className="mx-auto" size={34} />
                )}
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-slate-950/80 px-4 py-3 text-xs font-black uppercase tracking-wide text-white">
                  <ImagePlus size={15} /> Chọn ảnh khác
                </span>
              </button>

              <div className="flex flex-col justify-between border border-slate-200 bg-slate-50 p-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    Ảnh đang dùng
                  </p>
                  <p className="mt-3 break-all text-sm font-semibold leading-6 text-slate-800">
                    {config?.imageUrl || "Chưa chọn ảnh"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="mt-6 inline-flex items-center justify-center gap-2 border border-orange-300 bg-white px-4 py-3 text-xs font-black uppercase tracking-wide text-orange-700 transition hover:bg-orange-600 hover:text-white"
                >
                  <ImagePlus size={15} /> Mở thư viện ảnh
                </button>
              </div>
            </div>
          )}
        </section>

        <MediaPickerModal
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={updateHeroImage}
        />
      </div>
    </ProtectedRoute>
  );
}
