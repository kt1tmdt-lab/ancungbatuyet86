"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { Loader, Plus, AlertCircle, Trash, Edit3, Heart, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  categoryLabel: string;
  price: string;
  image: string;
  featured: boolean;
  purchaseUrl: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    setActionLoading(product.id);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ featured: !product.featured }),
      });
      if (res.ok) {
        setProducts(
          products.map((p) => (p.id === product.id ? { ...p, featured: !p.featured } : p))
        );
      } else {
        alert("Không thể thay đổi trạng thái nổi bật");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) return;
    setActionLoading(productId);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== productId));
      } else {
        alert("Không thể xóa sản phẩm");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "EDITOR"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quản lý sản phẩm</h1>
            <p className="text-slate-500 text-sm mt-1">Danh sách sản phẩm giới thiệu hiển thị công khai trên website.</p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-orange-500/10 hover:shadow-lg transition-all self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Thêm sản phẩm mới</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader className="animate-spin text-orange-500" size={36} />
              <p className="text-xs font-semibold text-slate-400">Đang tải danh sách sản phẩm...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-slate-400 space-y-2">
              <AlertCircle size={40} className="mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-600">Chưa có sản phẩm nào</p>
              <p className="text-xs text-slate-400">Hãy thêm sản phẩm mới để hiển thị lên website.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-sm text-left text-slate-700">
                <thead className="text-xs text-slate-400 uppercase bg-slate-50 border-b border-slate-100 font-bold">
                  <tr>
                    <th className="px-5 py-4">Sản phẩm</th>
                    <th className="px-5 py-4">Danh mục</th>
                    <th className="px-5 py-4">Đơn giá</th>
                    <th className="px-5 py-4 text-center">Nổi bật (Push)</th>
                    <th className="px-5 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-12 h-12 object-cover rounded-xl border border-slate-100"
                          />
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 leading-tight">
                              {prod.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Slug: {prod.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2 py-0.5 rounded-full">
                          {prod.categoryLabel}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-semibold text-slate-900">{prod.price}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(prod)}
                          disabled={actionLoading === prod.id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                            prod.featured
                              ? "bg-orange-500 text-white shadow-md shadow-orange-500/10"
                              : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                          }`}
                          title={prod.featured ? "Hạ nổi bật" : "Đẩy lên nổi bật trang chủ"}
                        >
                          <Heart size={12} fill={prod.featured ? "currentColor" : "none"} />
                          <span>{prod.featured ? "Đã đẩy" : "Push"}</span>
                        </button>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/san-pham/${prod.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-orange-500 hover:bg-slate-100 rounded-lg transition"
                            title="Xem trang sản phẩm"
                          >
                            <ExternalLink size={15} />
                          </a>
                          <Link
                            href={`/admin/products/${prod.id}/edit`}
                            className="p-1.5 text-slate-600 hover:text-orange-500 hover:bg-slate-100 rounded-lg transition"
                            title="Sửa sản phẩm"
                          >
                            <Edit3 size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(prod.id)}
                            disabled={actionLoading === prod.id}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                            title="Xóa sản phẩm"
                          >
                            <Trash size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
