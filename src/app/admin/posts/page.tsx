"use client";

import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { PostsTable } from "@/components/admin/PostsTable";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function PostsPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN", "EDITOR", "AUTHOR"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quản lý bài viết</h1>
            <p className="text-slate-500 text-sm mt-1">Danh sách tất cả bài viết tin tức, thông báo và công thức.</p>
          </div>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5  text-sm font-bold shadow-md shadow-orange-500/10 hover:shadow-lg transition-all self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Viết bài mới</span>
          </Link>
        </div>

        <div className="bg-white  border border-slate-100 p-6 shadow-sm">
          <PostsTable />
        </div>
      </div>
    </ProtectedRoute>
  );
}
