"use client";

import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { PostsTable } from "@/components/admin/PostsTable";
import { AlertCircle } from "lucide-react";

export default function ReviewPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN", "EDITOR"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bài viết chờ duyệt</h1>
          <p className="text-slate-500 text-sm mt-1">Xem xét, phê duyệt hoặc từ chối bài viết từ ban biên tập.</p>
        </div>

        <div className="bg-orange-50 border border-orange-200  p-4 flex gap-3 shadow-sm">
          <AlertCircle className="text-orange-600 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-bold text-orange-800">Quy định phê duyệt bài viết</p>
            <p className="text-xs text-orange-700 mt-0.5 leading-relaxed">
              Duyệt bài viết để xuất bản công khai lên website chính thức. Khi từ chối, bạn <strong>bắt buộc</strong> phải nhập lý do cụ thể để phản hồi cho tác giả.
            </p>
          </div>
        </div>

        <div className="bg-white  border border-slate-100 p-6 shadow-sm">
          <PostsTable status="PENDING_REVIEW" />
        </div>
      </div>
    </ProtectedRoute>
  );
}
