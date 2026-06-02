"use client";

import { CreatePostForm } from "@/components/admin/CreatePostForm";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { useParams } from "next/navigation";

export default function EditPostPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "EDITOR", "AUTHOR"]}>
      <CreatePostForm postId={id} />
    </ProtectedRoute>
  );
}
