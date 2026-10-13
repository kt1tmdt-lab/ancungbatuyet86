import { NewPostContent } from "@/components/admin/NewPostContent";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

export const metadata = {
  title: "Tạo bài viết mới | Admin Panel",
};

export default function NewPostPage() {
  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "EDITOR", "AUTHOR"]}>
      <NewPostContent />
    </ProtectedRoute>
  );
}
