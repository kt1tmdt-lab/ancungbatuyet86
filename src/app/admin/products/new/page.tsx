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
          eyebrow="Sản phẩm"
          title="Thêm sản phẩm"
          description="Tạo hồ sơ sản phẩm mới để sử dụng trong khu vực showcase của website."
        />
        <ProductForm />
      </div>
    </ProtectedRoute>
  );
}
