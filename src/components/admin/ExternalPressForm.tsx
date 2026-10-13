"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Link2, Save } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import toast from "react-hot-toast";

export function ExternalPressForm() {
  const { token } = useAuth();
  const [sourceName, setSourceName] = useState("");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || saving) return;
    setSaving(true);
    setSaved(false);

    try {
      const response = await fetch("/api/settings/marketing/press", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sourceName, title, link, publishDate }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Không thể lưu bài báo.");
      }
      setSourceName("");
      setTitle("");
      setLink("");
      setPublishDate("");
      setSaved(true);
      toast.success("Đã thêm bài báo bên ngoài.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể lưu bài báo.");
    } finally {
      setSaving(false);
    }
  }

  const fieldClass = "mt-2 w-full border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white";

  return (
    <div className="space-y-5">
      <Link href="/admin/posts" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"><ArrowLeft size={16} /> Quay lại</Link>
      <form onSubmit={handleSubmit} className="max-w-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-3 border-b border-slate-100 pb-6">
          <span className="bg-orange-50 p-3 text-orange-600"><Link2 size={22} /></span>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Gắn bài báo bên ngoài</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">Bài báo sẽ xuất hiện tại Tin tức → Trên báo chí. Người đọc bấm vào sẽ mở bài gốc.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <label className="block text-sm font-bold text-slate-800">Tên báo / nguồn đăng <span className="text-red-500">*</span>
            <input required maxLength={120} value={sourceName} onChange={(event) => setSourceName(event.target.value)} placeholder="Ví dụ: VnExpress" className={fieldClass} />
          </label>
          <label className="block text-sm font-bold text-slate-800">Ngày đăng
            <input type="date" value={publishDate} onChange={(event) => setPublishDate(event.target.value)} className={fieldClass} />
          </label>
          <label className="block text-sm font-bold text-slate-800 sm:col-span-2">Tiêu đề bài báo <span className="text-red-500">*</span>
            <input required maxLength={240} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Nhập tiêu đề bài viết trên báo" className={fieldClass} />
          </label>
          <label className="block text-sm font-bold text-slate-800 sm:col-span-2">Link bài báo gốc <span className="text-red-500">*</span>
            <input required type="url" value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://..." className={fieldClass} />
          </label>
        </div>

        {saved && <p role="status" className="mt-6 border-l-4 border-green-600 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">Đã thêm bài báo. <Link href="/tin-tuc" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline">Xem trang Tin tức <ExternalLink size={14} /></Link><span className="px-2">·</span><Link href="/admin/marketing?tab=press" className="underline">Quản lý bài báo</Link></p>}

        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-6">
          <button type="submit" disabled={saving || !token} className="inline-flex items-center gap-2 bg-orange-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"><Save size={17} />{saving ? "Đang lưu..." : "Lưu bài báo"}</button>
          <span className="text-xs text-slate-500">Chỉ lưu liên kết và thông tin bài báo, không sao chép nội dung từ trang gốc.</span>
        </div>
      </form>
    </div>
  );
}
