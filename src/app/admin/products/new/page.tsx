import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = {
  title: "Thêm sản phẩm mới | Admin",
};

export default function NewProductPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN", "EDITOR"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Thêm sản phẩm</h1>
          <p className="text-slate-500 text-sm mt-1">Tạo một sản phẩm giới thiệu mới trên hệ thống.</p>
        </div>
        <ProductForm />
      </div>
    </ProtectedRoute>
  );
}
