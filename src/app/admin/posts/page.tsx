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
          description="Tìm kiếm, biên tập và theo dõi trạng thái xuất bản của tin tức, thông báo và công thức."
          actions={
          <Button
            href="/admin/posts/new"
            variant="admin"
            leftIcon={<Plus size={16} />}
          >
            Viết bài mới
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

