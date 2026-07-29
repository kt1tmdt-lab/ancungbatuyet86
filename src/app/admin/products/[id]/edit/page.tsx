"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { ProductForm, type ProductData } from "@/components/admin/ProductForm";
import CmsPageHeader from "@/components/admin/CmsPageHeader";
import { AdminErrorState, AdminLoadingState } from "@/components/admin/AdminPrimitives";
import { adminRequest, getAdminErrorMessage } from "@/lib/admin-client";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();

  const fetchProduct = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      setProduct(
        await adminRequest<ProductData>(`/api/products/${id}`, { token }),
      );
    } catch (err) {
      setError(getAdminErrorMessage(err, "Không thể tải thông tin sản phẩm."));
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchProduct(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchProduct]);

  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "EDITOR"]}>
      <div className="space-y-6">
        <CmsPageHeader
          eyebrow="Sản phẩm"
          title="Chỉnh sửa sản phẩm"
          description="Cập nhật hồ sơ giới thiệu, hình ảnh, quy cách và nội dung chi tiết."
        />

        {loading ? (
          <AdminLoadingState title="Đang tải thông tin sản phẩm" />
        ) : error ? (
          <AdminErrorState description={error} />
        ) : (
          product ? <ProductForm initialData={product} /> : null
        )}
      </div>
    </ProtectedRoute>
  );
}
