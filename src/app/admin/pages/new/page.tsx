"use client";

import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { PageForm } from "@/components/admin/PageForm";
import CmsPageHeader from "@/components/admin/CmsPageHeader";

export default function AdminNewPage() {
  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "EDITOR", "MARKETING"]}>
      <div className="space-y-6">
        <CmsPageHeader
          eyebrow="Nội dung"
          title="Thêm trang tùy biến"
          description="Dựng landing page mới bằng các khối nội dung có thể sắp xếp và tái sử dụng."
        />

        <PageForm />
      </div>
    </ProtectedRoute>
  );
}
