"use client";

import { useState } from "react";
import { FileText, Link2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { CreatePostForm } from "@/components/admin/CreatePostForm";
import { ExternalPressForm } from "@/components/admin/ExternalPressForm";

type CreationMode = "write" | "external";

export function NewPostContent() {
  const { user } = useAuth();
  const [mode, setMode] = useState<CreationMode>("write");
  const canAddExternal = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN" || user?.role === "EDITOR";

  return (
    <div className="space-y-6">
      {canAddExternal && (
        <div className="border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-black uppercase tracking-wider text-orange-600">Tạo nội dung tin tức</p>
          <h1 className="mt-1 text-xl font-extrabold text-slate-900">Bạn muốn đăng loại bài nào?</h1>
          <div className="mt-4 grid gap-3 sm:grid-cols-2" role="group" aria-label="Loại bài viết">
            <button
              type="button"
              onClick={() => setMode("write")}
              aria-pressed={mode === "write"}
              className={`flex items-center gap-3 border p-4 text-left transition ${mode === "write" ? "border-orange-500 bg-orange-50 text-orange-900" : "border-slate-200 text-slate-600 hover:border-orange-300"}`}
            >
              <FileText size={22} className="shrink-0 text-orange-600" />
              <span><strong className="block text-sm">Tự viết bài</strong><span className="mt-1 block text-xs">Soạn nội dung và xuất bản trên website.</span></span>
            </button>
            <button
              type="button"
              onClick={() => setMode("external")}
              aria-pressed={mode === "external"}
              className={`flex items-center gap-3 border p-4 text-left transition ${mode === "external" ? "border-orange-500 bg-orange-50 text-orange-900" : "border-slate-200 text-slate-600 hover:border-orange-300"}`}
            >
              <Link2 size={22} className="shrink-0 text-orange-600" />
              <span><strong className="block text-sm">Gắn bài báo bên ngoài</strong><span className="mt-1 block text-xs">Dẫn người đọc tới bài gốc trên trang báo.</span></span>
            </button>
          </div>
        </div>
      )}

      <div hidden={canAddExternal && mode !== "write"}><CreatePostForm /></div>
      {canAddExternal && <div hidden={mode !== "external"}><ExternalPressForm /></div>}
    </div>
  );
}
