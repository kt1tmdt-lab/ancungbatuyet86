"use client";

import { use, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { ProductForm } from "@/components/admin/ProductForm";
import { Loader, AlertCircle } from "lucide-react";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    if (id && token) {
      fetchProduct();
    }
  }, [id, token]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      } else {
        setError("Không thể tải thông tin sản phẩm");
      }
    } catch (err) {
      console.error(err);
      setError("Có lỗi kết nối xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "EDITOR"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Chỉnh sửa sản phẩm</h1>
          <p className="text-slate-500 text-sm mt-1">Cập nhật thông tin chi tiết và liên kết sàn TMĐT của sản phẩm.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader className="animate-spin text-orange-500" size={36} />
            <p className="text-xs font-semibold text-slate-400">Đang tải thông tin sản phẩm...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        ) : (
          <ProductForm initialData={product} />
        )}
      </div>
    </ProtectedRoute>
  );
}
