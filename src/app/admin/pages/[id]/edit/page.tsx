"use client";

import { PageForm } from "@/components/admin/PageForm";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { useParams } from "next/navigation";

export default function EditPagePage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "EDITOR", "MARKETING"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Chỉnh sửa trang</h1>
          <p className="text-slate-500 text-sm mt-1">Cập nhật và sắp xếp lại các khối nội dung của Landing Page.</p>
        </div>

        <PageForm pageId={id} />
      </div>
    </ProtectedRoute>
  );
}
