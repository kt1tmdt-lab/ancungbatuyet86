"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { DataTable } from "@/components/admin/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Loader, Plus, AlertCircle, Trash, Edit3, Heart, ExternalLink, Search, Download, Upload } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  categoryLabel: string;
  price: string;
  image: string;
  featured: boolean;
  purchaseUrl: string;
  status: string;
  sortOrder: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isImporting, setIsImporting] = useState(false);
  const { token } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (token) fetchProducts();
  }, [token]);

  const fetchProducts = async () => {
    if (!token) return;

    try {
      const res = await fetch("/api/products?status=ALL", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setProducts(await res.json());
    } catch (err) {} 
    finally { setLoading(false); }
  };

  const handleExport = () => {
    if (!token) return;
    // Download via direct link with token
    window.open(`/api/admin/products/export?token=${token}`, "_blank");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Nhập dữ liệu thành công! Đã tạo/cập nhật ${data.successCount} sản phẩm.`);
        if (data.errorCount > 0) {
          toast.error(`Có ${data.errorCount} lỗi xảy ra. Xem chi tiết trong console.`);
          console.warn("Import errors details:", data.errors);
        }
        fetchProducts();
      } else {
        toast.error(data.error || "Nhập dữ liệu thất bại");
      }
    } catch (err) {
      console.error("Failed to import products:", err);
      toast.error("Đã xảy ra lỗi khi kết nối máy chủ");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    setActionLoading(product.id);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ featured: !product.featured }),
      });
      if (res.ok) {
        setProducts(products.map((p) => (p.id === product.id ? { ...p, featured: !p.featured } : p)));
        toast.success(!product.featured ? "Đã đưa sản phẩm lên 2 cụm trang chủ" : "Đã ẩn sản phẩm khỏi 2 cụm trang chủ");
      } else alert("Không thể thay đổi trạng thái hiển thị trang chủ");
    } finally { setActionLoading(null); }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) return;
    setActionLoading(productId);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== productId));
      } else alert("Không thể xóa sản phẩm");
    } finally { setActionLoading(null); }
  };

  const filteredProducts = useMemo(() => {
    let result = products;

    if (statusFilter !== "ALL") {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(lowerQuery) || p.slug.includes(lowerQuery));
    }

    return result;
  }, [products, searchQuery, statusFilter]);

  const columns = useMemo<ColumnDef<Product>[]>(() => [
    {
      accessorKey: "name",
      header: "Sản phẩm",
      cell: ({ row }) => {
        const prod = row.original;
        return (
          <div className="flex items-center gap-3">
            <img src={prod.image} alt={prod.name} className="w-12 h-12 object-cover border border-slate-100" />
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 leading-tight">{prod.name}</span>
              <span className="text-[10px] text-slate-400">Slug: {prod.slug}</span>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "categoryLabel",
      header: "Danh mục",
      cell: ({ row }) => (
        <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2 py-0.5">
          {row.original.categoryLabel}
        </span>
      )
    },
    {
      accessorKey: "price",
      header: "Đơn giá",
      cell: ({ row }) => <span className="font-semibold text-slate-900">{row.original.price}</span>
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => (
        <span className={`px-2 py-0.5 text-[11px] font-bold ${row.original.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"}`}>
          {row.original.status === "PUBLISHED" ? "HIỂN THỊ" : "ẨN"}
        </span>
      )
    },
    {
      accessorKey: "sortOrder",
      header: "Thứ tự trang chủ",
      cell: ({ row }) => <span className="font-semibold text-slate-900">{row.original.sortOrder || 0}</span>
    },
    {
      accessorKey: "featured",
      header: "Hiện ở 2 cụm trang chủ",
      cell: ({ row }) => {
        const prod = row.original;
        return (
          <button
            onClick={() => handleToggleFeatured(prod)}
            disabled={actionLoading === prod.id}
            className={`acbt-btn acbt-btn--sm ${prod.featured ? "acbt-btn--admin" : "acbt-btn--admin-secondary"}`}
            title={prod.featured ? "Ẩn khỏi hero và sản phẩm nổi bật" : "Hiện ở hero và sản phẩm nổi bật"}
          >
            <Heart size={12} fill={prod.featured ? "currentColor" : "none"} />
            <span>{prod.featured ? "Đang hiện" : "Cho hiện"}</span>
          </button>
        );
      }
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        const prod = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <a href={`/san-pham/${prod.slug}`} target="_blank" className="acbt-icon-btn p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary-dark">
              <ExternalLink size={15} />
            </a>
            <Link href={`/admin/products/${prod.id}/edit`} className="acbt-icon-btn p-1.5 text-slate-600 hover:bg-slate-100 hover:text-primary-dark">
              <Edit3 size={15} />
            </Link>
            <button onClick={() => handleDelete(prod.id)} disabled={actionLoading === prod.id} className="acbt-icon-btn p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50">
              <Trash size={15} />
            </button>
          </div>
        );
      }
    }
  ], [actionLoading]);

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "EDITOR"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quản lý sản phẩm</h1>
            <p className="text-slate-500 text-sm mt-1">Danh sách sản phẩm giới thiệu hiển thị công khai trên website.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition shadow-sm cursor-pointer"
            >
              <Download size={14} />
              <span>Xuất Excel/CSV</span>
            </button>
            <button
              type="button"
              onClick={handleImportClick}
              disabled={isImporting}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Upload size={14} />
              <span>{isImporting ? "Đang nhập..." : "Nhập từ file"}</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".csv"
              className="hidden"
            />
            <Link href="/admin/products/new" className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition">
              <Plus size={14} />
              <span>Thêm sản phẩm mới</span>
            </Link>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PUBLISHED">Đang hiển thị</option>
              <option value="DRAFT">Đang ẩn (Nháp)</option>
            </select>
          </div>

          {loading ? (
            <div className="py-20 text-center"><Loader className="animate-spin text-primary mx-auto mb-2" size={30} /></div>
          ) : (
            <DataTable columns={columns} data={filteredProducts} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
