"use client";

import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { PostsTable } from "@/components/admin/PostsTable";
import { Plus } from "lucide-react";
import CmsPageHeader from "@/components/admin/CmsPageHeader";
import { CmsPanel } from "@/components/admin/CmsPanel";
import Button from "@/components/ui/Button";

export default function PostsPage() {
  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "EDITOR", "AUTHOR"]}>
      <div className="space-y-5">
        <CmsPageHeader
          eyebrow="Nội dung"
          title="Quản lý bài viết"
          description="Quản lý bài tự viết, bài báo bên ngoài và các thẻ tin đang cấu hình cho trang chủ."
          actions={
          <Button
            href="/admin/posts/new"
            variant="admin"
            leftIcon={<Plus size={16} />}
          >
            Thêm bài viết
          </Button>
          }
        />
        <CmsPanel>
          <PostsTable />
        </CmsPanel>
      </div>
    </ProtectedRoute>
  );
}

