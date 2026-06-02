import { CreatePostForm } from "@/components/admin/CreatePostForm";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

export const metadata = {
  title: "Tạo bài viết mới | Admin Panel",
};

export default function NewPostPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN", "EDITOR", "AUTHOR"]}>
      <CreatePostForm />
    </ProtectedRoute>
  );
}
