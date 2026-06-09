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
            className="acbt-btn acbt-btn--admin acbt-btn--md self-start sm:self-auto"
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

