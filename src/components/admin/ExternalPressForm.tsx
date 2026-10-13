"use client";

import { useEffect, useState, type FormEvent } from "react";
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
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewStatus, setPreviewStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!token || !/^https?:\/\//i.test(link.trim())) {
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setPreviewStatus("loading");
      try {
        const response = await fetch("/api/settings/marketing/press/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ link: link.trim() }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Không lấy được thông tin tự động.");
        const result = await response.json();
        if (controller.signal.aborted) return;
        const data = result.data;
        setSourceName(data.sourceName || "");
        setTitle(data.title || "");
        setPublishDate(data.publishDate || "");
        setDescription(data.description || "");
        setImageUrl(data.imageUrl || "");
        setPreviewStatus("success");
      } catch {
        if (!controller.signal.aborted) setPreviewStatus("error");
      }
    }, 650);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [link, token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || saving) return;
    setSaving(true);
    setSaved(false);

    try {
      const response = await fetch("/api/settings/marketing/press", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sourceName, title, link, publishDate, description, imageUrl }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Không thể lưu bài báo.");
      }
      setSourceName("");
      setTitle("");
      setLink("");
      setPublishDate("");
      setDescription("");
      setImageUrl("");
      setPreviewStatus("idle");
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
            <p className="mt-1 text-sm leading-6 text-slate-500">Dán link bài báo để tự lấy tiêu đề, ảnh và mô tả. Bạn có thể chỉnh lại trước khi lưu.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <label className="block text-sm font-bold text-slate-800 sm:col-span-2">Link bài báo gốc <span className="text-red-500">*</span>
            <input required type="url" value={link} onChange={(event) => { setLink(event.target.value); setSaved(false); setPreviewStatus("idle"); }} placeholder="https://www.saostar.vn/..." className={fieldClass} />
            {previewStatus === "loading" && <span className="mt-2 block text-xs font-semibold text-orange-700">Đang lấy thông tin từ bài báo...</span>}
            {previewStatus === "success" && <span className="mt-2 block text-xs font-semibold text-green-700">Đã lấy thông tin. Hãy kiểm tra lại trước khi lưu.</span>}
            {previewStatus === "error" && <span className="mt-2 block text-xs font-semibold text-amber-700">Trang báo không cho đọc tự động hoặc đang lỗi. Bạn vẫn có thể nhập thông tin thủ công.</span>}
          </label>
          <label className="block text-sm font-bold text-slate-800">Tên báo / nguồn đăng <span className="text-red-500">*</span>
            <input required maxLength={120} value={sourceName} onChange={(event) => setSourceName(event.target.value)} placeholder="Ví dụ: VnExpress" className={fieldClass} />
          </label>
          <label className="block text-sm font-bold text-slate-800">Ngày đăng
            <input type="date" value={publishDate} onChange={(event) => setPublishDate(event.target.value)} className={fieldClass} />
          </label>
          <label className="block text-sm font-bold text-slate-800 sm:col-span-2">Tiêu đề bài báo <span className="text-red-500">*</span>
            <input required maxLength={240} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Nhập tiêu đề bài viết trên báo" className={fieldClass} />
          </label>
          <label className="block text-sm font-bold text-slate-800 sm:col-span-2">Mô tả ngắn
            <textarea rows={3} maxLength={500} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Tóm tắt hiển thị trên thẻ bài báo" className={fieldClass} />
          </label>
          <label className="block text-sm font-bold text-slate-800 sm:col-span-2">Ảnh đại diện
            <input type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="https://..." className={fieldClass} />
          </label>
        </div>

        {imageUrl && <div className="mt-6 overflow-hidden border border-slate-200 bg-slate-50"><img src={imageUrl} alt="Ảnh đại diện bài báo" className="max-h-72 w-full object-cover" referrerPolicy="no-referrer" onError={() => setImageUrl("")} /></div>}

        {saved && <p role="status" className="mt-6 border-l-4 border-green-600 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">Đã thêm bài báo. <Link href="/tin-tuc" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline">Xem trang Tin tức <ExternalLink size={14} /></Link><span className="px-2">·</span><Link href="/admin/marketing?tab=press" className="underline">Quản lý bài báo</Link></p>}

        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-6">
          <button type="submit" disabled={saving || !token} className="inline-flex items-center gap-2 bg-orange-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"><Save size={17} />{saving ? "Đang lưu..." : "Lưu bài báo"}</button>
          <span className="text-xs text-slate-500">Nội dung bài gốc được hiển thị qua trang báo nếu trang đó cho phép nhúng.</span>
        </div>
      </form>
    </div>
  );
}
