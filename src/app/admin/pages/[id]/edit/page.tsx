"use client";

import { PageForm } from "@/components/admin/PageForm";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { useParams } from "next/navigation";
import CmsPageHeader from "@/components/admin/CmsPageHeader";

export default function EditPagePage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "EDITOR", "MARKETING"]}>
      <div className="space-y-6">
        <CmsPageHeader
          eyebrow="Nội dung"
          title="Chỉnh sửa trang"
          description="Cập nhật và sắp xếp các khối nội dung của landing page."
        />

        <PageForm pageId={id} />
      </div>
    </ProtectedRoute>
  );
}
