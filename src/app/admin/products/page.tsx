"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Download,
  Edit3,
  ExternalLink,
  Heart,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth-context";
import { adminRequest, getAdminErrorMessage } from "@/lib/admin-client";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { DataTable } from "@/components/admin/DataTable";
import CmsPageHeader from "@/components/admin/CmsPageHeader";
import { CmsPanel } from "@/components/admin/CmsPanel";
import CmsStatusBadge from "@/components/admin/CmsStatusBadge";
import {
  AdminErrorState,
  AdminLoadingState,
  AdminSearchInput,
  AdminSelect,
  AdminToolbar,
  ConfirmDialog,
} from "@/components/admin/AdminPrimitives";
import Button from "@/components/ui/Button";

type ProductStatus = "DRAFT" | "PUBLISHED" | "OUT_OF_STOCK" | "ARCHIVED";

interface Product {
  id: string;
  name: string;
  slug: string;
  categoryLabel: string;
  image: string;
  featured: boolean;
  status: ProductStatus;
  sortOrder: number;
}

type ImportResult = {
  successCount: number;
  errorCount: number;
  errors?: unknown[];
};

export default function AdminProductsPage() {
  const { token } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isImporting, setIsImporting] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setLoadError("");
    try {
      setProducts(
        await adminRequest<Product[]>("/api/products?status=ALL", { token }),
      );
    } catch (error) {
      setLoadError(
        getAdminErrorMessage(error, "Không thể tải danh sách sản phẩm."),
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchProducts(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchProducts]);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;

    setIsImporting(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const result = await adminRequest<ImportResult>(
        "/api/admin/products/import",
        { method: "POST", token, body },
      );
      toast.success(
        `Đã tạo hoặc cập nhật ${result.successCount} sản phẩm.`,
      );
      if (result.errorCount > 0) {
        console.warn("Product import errors:", result.errors);
        toast.error(`${result.errorCount} dòng không thể nhập.`);
      }
      await fetchProducts();
    } catch (error) {
      toast.error(getAdminErrorMessage(error, "Nhập dữ liệu thất bại."));
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleToggleFeatured = useCallback(
    async (product: Product) => {
      if (!token) return;
      setActionLoading(product.id);

      try {
        await adminRequest<Product>(`/api/products/${product.id}`, {
          method: "PUT",
          token,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ featured: !product.featured }),
        });
        setProducts((current) =>
          current.map((item) =>
            item.id === product.id
              ? { ...item, featured: !product.featured }
              : item,
          ),
        );
        toast.success(
          product.featured
            ? "Đã gỡ sản phẩm khỏi khu vực nổi bật."
            : "Đã đưa sản phẩm vào khu vực nổi bật.",
        );
      } catch (error) {
        toast.error(
          getAdminErrorMessage(error, "Không thể cập nhật sản phẩm."),
        );
      } finally {
        setActionLoading(null);
      }
    },
    [token],
  );

  const handleDelete = async () => {
    if (!deleteTarget || !token) return;
    setActionLoading(deleteTarget.id);

    try {
      await adminRequest(`/api/products/${deleteTarget.id}`, {
        method: "DELETE",
        token,
      });
      setProducts((current) =>
        current.filter((item) => item.id !== deleteTarget.id),
      );
      toast.success("Đã xóa sản phẩm.");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(getAdminErrorMessage(error, "Không thể xóa sản phẩm."));
    } finally {
      setActionLoading(null);
    }
  };

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLocaleLowerCase("vi");
    return products.filter((product) => {
      const matchesStatus =
        statusFilter === "ALL" || product.status === statusFilter;
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLocaleLowerCase("vi").includes(normalizedSearch) ||
        product.slug.toLocaleLowerCase("vi").includes(normalizedSearch) ||
        product.categoryLabel
          .toLocaleLowerCase("vi")
          .includes(normalizedSearch);
      return matchesStatus && matchesSearch;
    });
  }, [products, searchQuery, statusFilter]);

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Sản phẩm",
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="flex min-w-64 items-center gap-3">
              <span className="relative h-12 w-12 shrink-0 overflow-hidden border border-slate-200 bg-slate-50">
                <Image
                  src={product.image || "/placeholder-product.jpg"}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </span>
              <span className="min-w-0">
                <span className="block font-black leading-5 text-slate-950">
                  {product.name}
                </span>
                <span className="mt-0.5 block truncate font-mono text-[10px] text-slate-400">
                  {product.slug}
                </span>
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "categoryLabel",
        header: "Nhóm",
        cell: ({ row }) => (
          <span className="inline-flex border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600">
            {row.original.categoryLabel || "Chưa phân nhóm"}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => <CmsStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "sortOrder",
        header: "Thứ tự",
        cell: ({ row }) => (
          <span className="font-bold text-slate-700">
            {row.original.sortOrder}
          </span>
        ),
      },
      {
        accessorKey: "featured",
        header: "Nổi bật",
        enableSorting: false,
        cell: ({ row }) => {
          const product = row.original;
          return (
            <button
              type="button"
              onClick={() => void handleToggleFeatured(product)}
              disabled={actionLoading === product.id}
              className={`inline-flex min-h-9 items-center gap-1.5 border px-3 text-xs font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:cursor-wait disabled:opacity-50 ${
                product.featured
                  ? "border-orange-600 bg-orange-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              <Heart
                size={13}
                fill={product.featured ? "currentColor" : "none"}
              />
              {product.featured ? "Đang hiện" : "Cho hiện"}
            </button>
          );
        },
      },
      {
        id: "actions",
        header: "Thao tác",
        enableSorting: false,
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="flex items-center justify-end gap-1">
              <Link
                href={`/san-pham/${product.slug}`}
                target="_blank"
                className="acbt-icon-btn grid h-9 w-9 place-items-center text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                aria-label={`Xem ${product.name}`}
                title="Xem trên website"
              >
                <ExternalLink size={16} />
              </Link>
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="acbt-icon-btn grid h-9 w-9 place-items-center text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                aria-label={`Sửa ${product.name}`}
                title="Chỉnh sửa"
              >
                <Edit3 size={16} />
              </Link>
              <button
                type="button"
                onClick={() => setDeleteTarget(product)}
                disabled={actionLoading === product.id}
                className="acbt-icon-btn grid h-9 w-9 place-items-center text-red-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                aria-label={`Xóa ${product.name}`}
                title="Xóa"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        },
      },
    ],
    [actionLoading, handleToggleFeatured],
  );

  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "EDITOR"]}>
      <div className="space-y-5">
        <CmsPageHeader
          eyebrow="Sản phẩm & phân phối"
          title="Quản lý sản phẩm"
          description="Cập nhật nội dung showcase, trạng thái hiển thị và thứ tự sản phẩm trên website."
          actions={
            <>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleImport}
                accept=".csv"
                className="hidden"
              />
              <Button
                variant="adminSecondary"
                leftIcon={<Download size={16} />}
                onClick={() =>
                  window.open("/api/admin/products/export", "_blank")
                }
              >
                Xuất CSV
              </Button>
              <Button
                variant="adminSecondary"
                leftIcon={<Upload size={16} />}
                loading={isImporting}
                onClick={() => fileInputRef.current?.click()}
              >
                Nhập CSV
              </Button>
              <Button
                href="/admin/products/new"
                variant="admin"
                leftIcon={<Plus size={16} />}
              >
                Thêm sản phẩm
              </Button>
            </>
          }
        />

        <CmsPanel>
          <AdminToolbar>
            <AdminSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Tìm tên, đường dẫn hoặc nhóm sản phẩm..."
            />
            <AdminSelect
              label="Lọc theo trạng thái"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PUBLISHED">Đang hiển thị</option>
              <option value="DRAFT">Bản nháp</option>
              <option value="OUT_OF_STOCK">Tạm hết hàng</option>
              <option value="ARCHIVED">Lưu trữ</option>
            </AdminSelect>
          </AdminToolbar>

          {loading ? (
            <AdminLoadingState title="Đang tải sản phẩm" />
          ) : loadError ? (
            <AdminErrorState
              description={loadError}
              action={
                <Button
                  variant="adminSecondary"
                  onClick={() => void fetchProducts()}
                >
                  Thử lại
                </Button>
              }
            />
          ) : (
            <DataTable
              columns={columns}
              data={filteredProducts}
              emptyTitle="Không tìm thấy sản phẩm"
              emptyDescription={
                searchQuery || statusFilter !== "ALL"
                  ? "Hãy đổi từ khóa hoặc bộ lọc để xem kết quả khác."
                  : "Bấm “Thêm sản phẩm” để tạo sản phẩm đầu tiên."
              }
            />
          )}
        </CmsPanel>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Xóa sản phẩm?"
        description={`Sản phẩm “${deleteTarget?.name || ""}” sẽ bị xóa vĩnh viễn khỏi hệ thống.`}
        loading={Boolean(
          deleteTarget && actionLoading === deleteTarget.id,
        )}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
      />
    </ProtectedRoute>
  );
}
