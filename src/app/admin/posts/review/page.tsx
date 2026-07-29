"use client";

import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { PostsTable } from "@/components/admin/PostsTable";
import { AlertCircle } from "lucide-react";
import CmsPageHeader from "@/components/admin/CmsPageHeader";
import { CmsPanel } from "@/components/admin/CmsPanel";

export default function ReviewPage() {
  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "EDITOR"]}>
      <div className="space-y-5">
        <CmsPageHeader
          eyebrow="Quy trình biên tập"
          title="Bài viết chờ duyệt"
          description="Xem nội dung, phê duyệt để xuất bản hoặc phản hồi rõ lý do cho tác giả."
        />

        <div className="flex gap-3 border border-orange-200 bg-orange-50 p-4 shadow-sm">
          <AlertCircle className="text-orange-600 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-bold text-orange-800">Quy định phê duyệt bài viết</p>
            <p className="text-xs text-orange-700 mt-0.5 leading-relaxed">
              Duyệt bài viết để xuất bản công khai lên website chính thức. Khi từ chối, bạn <strong>bắt buộc</strong> phải nhập lý do cụ thể để phản hồi cho tác giả.
            </p>
          </div>
        </div>

        <CmsPanel>
          <PostsTable status="PENDING_REVIEW" />
        </CmsPanel>
      </div>
    </ProtectedRoute>
  );
}
