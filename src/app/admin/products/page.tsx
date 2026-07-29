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
import {
  normalizeMarketingConfig,
  type MarketingConfigData,
} from "@/lib/marketing-config";

type ProductStatus = "DRAFT" | "PUBLISHED" | "OUT_OF_STOCK" | "ARCHIVED";

interface Product {
  id: string;
  name: string;
  slug: string;
  categoryLabel: string;
  image: string;
  heroImage?: string | null;
  featured: boolean;
  status: ProductStatus;
  sortOrder: number;
}

type ImportResult = {
  successCount: number;
  errorCount: number;
  errors?: unknown[];
};

const HERO_PRODUCTS_ASSET_KEY = "products_landing_hero_products";

function getHeroProductIds(config: MarketingConfigData | null) {
  if (!config) return [];

  const listAsset = config.pageAssets.find(
    (item) => item.key === HERO_PRODUCTS_ASSET_KEY,
  );
  const savedIds = (listAsset?.linkUrl || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (savedIds.length > 0) return Array.from(new Set(savedIds));

  return config.pageAssets
    .filter((item) => /^products_landing_hero_image_[1-3]$/.test(item.key))
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((item) =>
      item.linkUrl.startsWith("product:")
        ? item.linkUrl.slice("product:".length)
        : "",
    )
    .filter(Boolean);
}

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
  const [marketingConfig, setMarketingConfig] =
    useState<MarketingConfigData | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setLoadError("");
    try {
      const productList = await adminRequest<Product[]>(
        "/api/products?status=ALL",
        { token },
      );
      setProducts(productList);

      try {
        const settings = await adminRequest<{ data?: unknown }>(
          "/api/settings/marketing",
          { token },
        );
        setMarketingConfig(normalizeMarketingConfig(settings.data));
      } catch (settingsError) {
        console.error("Failed to load product hero settings", settingsError);
      }
    } catch (error) {
      setLoadError(
        getAdminErrorMessage(error, "Không thể tải danh sách sản phẩm."),
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleToggleHero = useCallback(
    async (product: Product) => {
      if (!token) return;
      const actionKey = `hero:${product.id}`;
      setActionLoading(actionKey);

      try {
        let currentConfig = marketingConfig;
        if (!currentConfig) {
          const settings = await adminRequest<{ data?: unknown }>(
            "/api/settings/marketing",
            { token },
          );
          currentConfig = normalizeMarketingConfig(settings.data);
        }

        const currentIds = getHeroProductIds(currentConfig);
        const isActive = currentIds.includes(String(product.id));
        const nextIds = isActive
          ? currentIds.filter((id) => id !== String(product.id))
          : [...currentIds, String(product.id)];
        const nextAssets = currentConfig.pageAssets.map((item) =>
          item.key === HERO_PRODUCTS_ASSET_KEY
            ? {
                ...item,
                label: `Danh sách hero (${nextIds.length} sản phẩm)`,
                linkUrl: nextIds.join(","),
              }
            : /^products_landing_hero_image_[1-3]$/.test(item.key) &&
                item.linkUrl.startsWith("product:")
              ? { ...item, linkUrl: "" }
              : item,
        );
        const nextConfig = { ...currentConfig, pageAssets: nextAssets };

        await adminRequest("/api/settings/marketing", {
          method: "PUT",
          token,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nextConfig),
        });

        setMarketingConfig(nextConfig);
        toast.success(
          isActive
            ? `Đã bỏ “${product.name}” khỏi hero.`
            : `Đã thêm “${product.name}” vào hero.`,
        );
      } catch (error) {
        toast.error(
          getAdminErrorMessage(error, "Không thể đưa sản phẩm lên hero."),
        );
      } finally {
        setActionLoading(null);
      }
    },
    [marketingConfig, token],
  );

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
        header: "Chủ lực",
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
        id: "heroPlacement",
        header: "Hero trang tổng",
        enableSorting: false,
        cell: ({ row }) => {
          const product = row.original;
          const active = getHeroProductIds(marketingConfig).includes(
            String(product.id),
          );
          const loadingKey = `hero:${product.id}`;

          return (
            <button
              type="button"
              onClick={() => void handleToggleHero(product)}
              disabled={actionLoading === loadingKey}
              className={`inline-flex min-h-9 min-w-28 items-center justify-center border px-3 text-xs font-black transition disabled:cursor-wait disabled:opacity-50 ${
                active
                  ? "border-orange-600 bg-orange-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-600"
              }`}
              title={
                active
                  ? `Bỏ ${product.name} khỏi hero`
                  : `Thêm ${product.name} vào hero`
              }
            >
              {active ? "✓ Đang ở hero" : "+ Thêm vào hero"}
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
                title="Chỉnh landing sản phẩm"
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
    [actionLoading, handleToggleFeatured, handleToggleHero, marketingConfig],
  );

  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "EDITOR"]}>
      <div className="space-y-5">
        <CmsPageHeader
          eyebrow="Landing sản phẩm"
          title="Quản lý từng landing sản phẩm"
          description="Mỗi dòng bên dưới là một landing page riêng. Sửa tên, nội dung, ảnh hero, câu chuyện, thành phần, quy trình và hồ sơ sản phẩm tại đây."
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

        <div className="grid gap-3 border border-orange-200 bg-orange-50 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
          <div>
            <p className="text-sm font-black text-slate-950">Cần sửa phần mở đầu của trang tổng Sản phẩm?</p>
            <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">
              Bấm “Thêm vào hero” ở bất kỳ sản phẩm nào; không giới hạn số lượng. Ngoài website hiển thị ba sản phẩm mỗi lượt và có nút chuyển tiếp.
              {marketingConfig
                ? ` Hiện đang chọn ${getHeroProductIds(marketingConfig).length} sản phẩm.`
                : ""}
            </p>
          </div>
          <Link
            href="/admin/website/products"
            className="inline-flex items-center justify-center gap-2 border border-orange-300 bg-white px-4 py-2.5 text-xs font-black text-orange-700 transition hover:bg-orange-600 hover:text-white"
          >
            Quản lý trang tổng
            <Edit3 size={15} />
          </Link>
          <Link
            href="/san-pham"
            target="_blank"
            className="inline-flex items-center justify-center gap-2 border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
          >
            Xem ngoài web
            <ExternalLink size={15} />
          </Link>
        </div>

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
