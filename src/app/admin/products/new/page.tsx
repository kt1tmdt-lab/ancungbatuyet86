import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { ProductForm } from "@/components/admin/ProductForm";
import CmsPageHeader from "@/components/admin/CmsPageHeader";

export const metadata = {
  title: "Thêm sản phẩm mới | Admin",
};

export default function NewProductPage() {
  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "EDITOR"]}>
      <div className="space-y-6">
        <CmsPageHeader
          eyebrow="Landing sản phẩm"
          title="Tạo landing sản phẩm"
          description="Tạo một sản phẩm mới cùng trang giới thiệu riêng để xuất hiện trong showcase của website."
        />
        <ProductForm />
      </div>
    </ProtectedRoute>
  );
}
