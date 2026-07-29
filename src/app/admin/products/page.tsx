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
  AlertTriangle,
  CheckCircle2,
  Download,
  Edit3,
  Eye,
  ExternalLink,
  FileSpreadsheet,
  Heart,
  Plus,
  Trash2,
  Upload,
  X,
  XCircle,
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

type ImportFieldDefinition = {
  key: string;
  label: string;
  required: boolean;
};

type ImportRowDetail = {
  rowNumber: number;
  status: "success" | "error";
  action: "created" | "updated" | null;
  productName: string;
  source: Record<string, string>;
  saved: Record<string, unknown> | null;
  importedFields: string[];
  missingRequired: string[];
  missingOptional: string[];
  defaultedFields: string[];
  error?: string;
};

type ImportResult = {
  fileName: string;
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: string[];
  fields: ImportFieldDefinition[];
  ignoredHeaders: string[];
  rows: ImportRowDetail[];
};

const HERO_PRODUCTS_ASSET_KEY = "products_landing_hero_products";
const SHOWCASE_PRODUCTS_ASSET_KEY = "products_landing_showcase_products";

function parseProductIds(value: string) {
  if (!value.trim() || value.trim().toLowerCase() === "none") return [];

  return Array.from(
    new Set(
      value
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean),
    ),
  );
}

function getHeroProductIds(config: MarketingConfigData | null) {
  if (!config) return [];

  const listAsset = config.pageAssets.find(
    (item) => item.key === HERO_PRODUCTS_ASSET_KEY,
  );
  const savedIds = parseProductIds(listAsset?.linkUrl || "");

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

function getShowcaseProductIds(config: MarketingConfigData | null) {
  if (!config) return [];

  const listAsset = config.pageAssets.find(
    (item) => item.key === SHOWCASE_PRODUCTS_ASSET_KEY,
  );
  return parseProductIds(listAsset?.linkUrl || "");
}

function formatImportValue(value: unknown) {
  if (Array.isArray(value)) return value.length > 0 ? value.join("; ") : "—";
  if (typeof value === "boolean") return value ? "Có" : "Không";
  if (value === null || value === undefined || String(value).trim() === "") {
    return "—";
  }
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function ImportReportDialog({
  report,
  open,
  selectedRow,
  onSelectRow,
  onClose,
}: {
  report: ImportResult | null;
  open: boolean;
  selectedRow: ImportRowDetail | null;
  onSelectRow: (row: ImportRowDetail) => void;
  onClose: () => void;
}) {
  if (!open || !report) return null;

  const fieldLabel = (key: string) =>
    report.fields.find((field) => field.key === key)?.label || key;
  const completeRows = report.rows.filter(
    (row) =>
      row.status === "success" &&
      row.missingRequired.length === 0 &&
      row.missingOptional.length === 0,
  ).length;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Chi tiết kết quả nhập sản phẩm"
    >
      <div className="flex max-h-[94vh] w-full max-w-7xl flex-col overflow-hidden border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-orange-600">
              <FileSpreadsheet size={16} />
              Báo cáo nhập CSV
            </div>
            <h2 className="mt-2 text-xl font-black text-slate-950 sm:text-2xl">
              {report.fileName}
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {report.successCount} đã lưu · {report.errorCount} lỗi ·{" "}
              {completeRows} dòng đủ toàn bộ trường
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center border border-slate-200 text-slate-500 transition hover:border-slate-400 hover:text-slate-950"
            aria-label="Đóng báo cáo nhập"
          >
            <X size={19} />
          </button>
        </div>

        {report.ignoredHeaders.length > 0 && (
          <div className="border-b border-amber-200 bg-amber-50 px-5 py-3 text-xs font-bold leading-5 text-amber-800 sm:px-6">
            Cột không dùng và đã bỏ qua: {report.ignoredHeaders.join(", ")}
          </div>
        )}

        <div className="grid min-h-0 flex-1 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="min-h-0 overflow-y-auto border-b border-slate-200 bg-slate-50 p-3 lg:border-b-0 lg:border-r">
            <p className="px-2 pb-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
              Chọn dòng để đối chiếu
            </p>
            <div className="space-y-2">
              {report.rows.map((row) => {
                const selected = selectedRow?.rowNumber === row.rowNumber;
                const isComplete =
                  row.status === "success" &&
                  row.missingOptional.length === 0;
                return (
                  <button
                    key={row.rowNumber}
                    type="button"
                    onClick={() => onSelectRow(row)}
                    className={`w-full border p-3 text-left transition ${
                      selected
                        ? "border-orange-500 bg-white shadow-sm"
                        : "border-slate-200 bg-white hover:border-orange-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-black text-slate-950">
                          {row.productName}
                        </span>
                        <span className="mt-1 block text-[11px] font-bold text-slate-400">
                          Dòng {row.rowNumber} ·{" "}
                          {row.action === "created"
                            ? "Tạo mới"
                            : row.action === "updated"
                              ? "Cập nhật"
                              : "Chưa lưu"}
                        </span>
                      </span>
                      {row.status === "error" ? (
                        <XCircle
                          size={18}
                          className="shrink-0 text-red-500"
                        />
                      ) : isComplete ? (
                        <CheckCircle2
                          size={18}
                          className="shrink-0 text-emerald-600"
                        />
                      ) : (
                        <AlertTriangle
                          size={18}
                          className="shrink-0 text-amber-500"
                        />
                      )}
                    </div>
                    <span
                      className={`mt-2 inline-flex px-2 py-1 text-[10px] font-black uppercase tracking-wide ${
                        row.status === "error"
                          ? "bg-red-50 text-red-700"
                          : isComplete
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {row.status === "error"
                        ? `Thiếu bắt buộc: ${row.missingRequired.length}`
                        : isComplete
                          ? "Đã nhập đủ"
                          : `Thiếu bổ sung: ${row.missingOptional.length}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="min-h-0 overflow-y-auto p-4 sm:p-6">
            {selectedRow ? (
              <div>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-orange-600">
                      Dòng {selectedRow.rowNumber}
                    </p>
                    <h3 className="mt-1 text-xl font-black text-slate-950">
                      {selectedRow.productName}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] font-black">
                    <span className="bg-slate-100 px-2.5 py-1.5 text-slate-700">
                      CSV có{" "}
                      {
                        selectedRow.importedFields.filter(
                          (key) => key !== "id",
                        ).length
                      }{" "}
                      trường nội dung
                    </span>
                    {selectedRow.missingRequired.length === 0 ? (
                      <span className="bg-emerald-50 px-2.5 py-1.5 text-emerald-700">
                        Đủ trường bắt buộc
                      </span>
                    ) : (
                      <span className="bg-red-50 px-2.5 py-1.5 text-red-700">
                        Thiếu {selectedRow.missingRequired.length} bắt buộc
                      </span>
                    )}
                  </div>
                </div>

                {selectedRow.error && (
                  <div className="mt-4 border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">
                    {selectedRow.error}
                  </div>
                )}

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="border border-emerald-200 bg-emerald-50 p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-emerald-700">
                      Đã có trong file
                    </p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-emerald-900">
                      {selectedRow.importedFields.length > 0
                        ? selectedRow.importedFields
                            .map(fieldLabel)
                            .join(", ")
                        : "Không có trường hợp lệ"}
                    </p>
                  </div>
                  <div
                    className={`border p-3 ${
                      selectedRow.missingRequired.length > 0
                        ? "border-red-200 bg-red-50"
                        : "border-amber-200 bg-amber-50"
                    }`}
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-700">
                      Còn thiếu
                    </p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-slate-800">
                      {selectedRow.missingRequired.length > 0 && (
                        <>
                          Bắt buộc:{" "}
                          {selectedRow.missingRequired
                            .map(fieldLabel)
                            .join(", ")}
                          .{" "}
                        </>
                      )}
                      {selectedRow.missingOptional.length > 0
                        ? `Bổ sung: ${selectedRow.missingOptional
                            .map(fieldLabel)
                            .join(", ")}.`
                        : selectedRow.missingRequired.length === 0
                          ? "Không thiếu trường nào."
                          : ""}
                    </p>
                  </div>
                </div>

                {selectedRow.defaultedFields.length > 0 && (
                  <div className="mt-3 border border-blue-200 bg-blue-50 p-3 text-xs font-semibold leading-5 text-blue-800">
                    Hệ thống tự điền:{" "}
                    {selectedRow.defaultedFields.map(fieldLabel).join(", ")}.
                    Giá trị cụ thể nằm ở cột “Đã lưu vào hệ thống”.
                  </div>
                )}

                <div className="mt-5 grid gap-4 xl:grid-cols-2">
                  <ImportValueColumn
                    title="Dữ liệu trong file CSV"
                    fields={report.fields}
                    values={selectedRow.source}
                    missingRequired={selectedRow.missingRequired}
                  />
                  <ImportValueColumn
                    title="Đã lưu vào hệ thống"
                    fields={report.fields}
                    values={selectedRow.saved || {}}
                    missingRequired={[]}
                    emptyMessage="Dòng này chưa được lưu."
                  />
                </div>
              </div>
            ) : (
              <div className="grid min-h-72 place-items-center text-center text-sm font-bold text-slate-400">
                Chưa có dòng dữ liệu để xem.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ImportValueColumn({
  title,
  fields,
  values,
  missingRequired,
  emptyMessage,
}: {
  title: string;
  fields: ImportFieldDefinition[];
  values: Record<string, unknown>;
  missingRequired: string[];
  emptyMessage?: string;
}) {
  if (Object.keys(values).length === 0 && emptyMessage) {
    return (
      <section className="border border-slate-200">
        <h4 className="border-b border-slate-200 bg-slate-950 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-white">
          {title}
        </h4>
        <p className="p-5 text-sm font-semibold text-slate-400">
          {emptyMessage}
        </p>
      </section>
    );
  }

  return (
    <section className="border border-slate-200">
      <h4 className="border-b border-slate-200 bg-slate-950 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-white">
        {title}
      </h4>
      <dl className="divide-y divide-slate-100">
        {fields.map((field) => {
          const missing = missingRequired.includes(field.key);
          return (
            <div
              key={field.key}
              className={`grid grid-cols-[130px_minmax(0,1fr)] gap-3 px-4 py-2.5 text-xs ${
                missing ? "bg-red-50" : "bg-white"
              }`}
            >
              <dt className="font-black text-slate-500">
                {field.label}
                {field.required && (
                  <span className="ml-1 text-red-500">*</span>
                )}
              </dt>
              <dd
                className={`break-words font-semibold ${
                  missing ? "text-red-700" : "text-slate-800"
                }`}
              >
                {formatImportValue(values[field.key])}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
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
  const [importReport, setImportReport] = useState<ImportResult | null>(null);
  const [importReportOpen, setImportReportOpen] = useState(false);
  const [selectedImportRow, setSelectedImportRow] =
    useState<ImportRowDetail | null>(null);
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

  const persistProductSelection = useCallback(
    async (
      currentConfig: MarketingConfigData,
      assetKey: typeof HERO_PRODUCTS_ASSET_KEY | typeof SHOWCASE_PRODUCTS_ASSET_KEY,
      nextIds: string[],
    ) => {
      if (!token) throw new Error("Phiên đăng nhập đã hết hạn.");

      const isShowcase = assetKey === SHOWCASE_PRODUCTS_ASSET_KEY;
      const storedValue =
        isShowcase && nextIds.length === 0 ? "none" : nextIds.join(",");
      const label = isShowcase
        ? `Danh sách showcase (${nextIds.length} sản phẩm)`
        : `Danh sách hero (${nextIds.length} sản phẩm)`;
      let hasSelectionAsset = false;

      const nextAssets = currentConfig.pageAssets.map((item) => {
        if (item.key === assetKey) {
          hasSelectionAsset = true;
          return { ...item, label, linkUrl: storedValue };
        }

        if (
          assetKey === HERO_PRODUCTS_ASSET_KEY &&
          /^products_landing_hero_image_[1-3]$/.test(item.key) &&
          item.linkUrl.startsWith("product:")
        ) {
          return { ...item, linkUrl: "" };
        }

        return item;
      });

      if (!hasSelectionAsset) {
        nextAssets.push({
          id: `admin-${assetKey}`,
          key: assetKey,
          label,
          imageUrl: "",
          linkUrl: storedValue,
        });
      }

      const nextConfig = { ...currentConfig, pageAssets: nextAssets };
      await adminRequest("/api/settings/marketing", {
        method: "PUT",
        token,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextConfig),
      });
      setMarketingConfig(nextConfig);
    },
    [token],
  );

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
        await persistProductSelection(
          currentConfig,
          HERO_PRODUCTS_ASSET_KEY,
          nextIds,
        );
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
    [marketingConfig, persistProductSelection, token],
  );

  const handleToggleShowcase = useCallback(
    async (product: Product) => {
      if (!token) return;
      const actionKey = `showcase:${product.id}`;
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

        const currentIds = getShowcaseProductIds(currentConfig);
        const productId = String(product.id);
        const isActive = currentIds.includes(productId);
        const nextIds = isActive
          ? currentIds.filter((id) => id !== productId)
          : [...currentIds, productId];

        await persistProductSelection(
          currentConfig,
          SHOWCASE_PRODUCTS_ASSET_KEY,
          nextIds,
        );
        toast.success(
          isActive
            ? `Đã bỏ “${product.name}” khỏi showcase.`
            : `Đã thêm “${product.name}” vào showcase.`,
        );
      } catch (error) {
        toast.error(
          getAdminErrorMessage(
            error,
            "Không thể cập nhật danh sách showcase sản phẩm.",
          ),
        );
      } finally {
        setActionLoading(null);
      }
    },
    [marketingConfig, persistProductSelection, token],
  );

  const handleMoveShowcase = useCallback(
    async (product: Product, direction: -1 | 1) => {
      if (!token || !marketingConfig) return;

      const currentIds = getShowcaseProductIds(marketingConfig);
      const currentIndex = currentIds.indexOf(String(product.id));
      const nextIndex = currentIndex + direction;
      if (
        currentIndex < 0 ||
        nextIndex < 0 ||
        nextIndex >= currentIds.length
      ) {
        return;
      }

      const actionKey = `showcase-order:${product.id}`;
      setActionLoading(actionKey);
      const nextIds = [...currentIds];
      [nextIds[currentIndex], nextIds[nextIndex]] = [
        nextIds[nextIndex],
        nextIds[currentIndex],
      ];

      try {
        await persistProductSelection(
          marketingConfig,
          SHOWCASE_PRODUCTS_ASSET_KEY,
          nextIds,
        );
        toast.success("Đã cập nhật thứ tự showcase.");
      } catch (error) {
        toast.error(
          getAdminErrorMessage(error, "Không thể đổi thứ tự showcase."),
        );
      } finally {
        setActionLoading(null);
      }
    },
    [marketingConfig, persistProductSelection, token],
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
      setImportReport(result);
      setSelectedImportRow(result.rows[0] || null);
      setImportReportOpen(true);
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
        id: "showcasePlacement",
        header: "Showcase phía dưới",
        enableSorting: false,
        cell: ({ row }) => {
          const product = row.original;
          const showcaseIds = getShowcaseProductIds(marketingConfig);
          const showcaseIndex = showcaseIds.indexOf(String(product.id));
          const active = showcaseIndex >= 0;
          const toggleLoadingKey = `showcase:${product.id}`;
          const orderLoadingKey = `showcase-order:${product.id}`;
          const isBusy =
            actionLoading === toggleLoadingKey ||
            actionLoading === orderLoadingKey;

          return (
            <div className="flex min-w-52 items-center gap-1">
              <button
                type="button"
                onClick={() => void handleToggleShowcase(product)}
                disabled={isBusy}
                className={`inline-flex min-h-9 min-w-32 items-center justify-center border px-3 text-xs font-black transition disabled:cursor-wait disabled:opacity-50 ${
                  active
                    ? "border-orange-600 bg-orange-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-600"
                }`}
                title={
                  active
                    ? `Bỏ ${product.name} khỏi showcase`
                    : `Thêm ${product.name} vào showcase`
                }
              >
                {active
                  ? `✓ Showcase #${showcaseIndex + 1}`
                  : "+ Thêm showcase"}
              </button>

              {active && showcaseIds.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => void handleMoveShowcase(product, -1)}
                    disabled={isBusy || showcaseIndex === 0}
                    className="grid h-9 w-9 place-items-center border border-slate-200 bg-white text-sm font-black text-slate-600 transition hover:border-orange-300 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label={`Đưa ${product.name} lên trước`}
                    title="Đưa lên trước"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleMoveShowcase(product, 1)}
                    disabled={
                      isBusy || showcaseIndex === showcaseIds.length - 1
                    }
                    className="grid h-9 w-9 place-items-center border border-slate-200 bg-white text-sm font-black text-slate-600 transition hover:border-orange-300 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label={`Đưa ${product.name} xuống sau`}
                    title="Đưa xuống sau"
                  >
                    ↓
                  </button>
                </>
              )}
            </div>
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
    [
      actionLoading,
      handleMoveShowcase,
      handleToggleFeatured,
      handleToggleHero,
      handleToggleShowcase,
      marketingConfig,
    ],
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
              “Thêm vào hero” điều khiển cụm ảnh mở đầu. “Thêm showcase” điều khiển các section sản phẩm phía dưới; dùng hai nút ↑ ↓ để đổi thứ tự.
              {marketingConfig
                ? ` Hiện có ${getHeroProductIds(marketingConfig).length} sản phẩm trong hero và ${getShowcaseProductIds(marketingConfig).length} sản phẩm trong showcase.`
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

        {importReport && (
          <div className="flex flex-col gap-4 border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center bg-emerald-50 text-emerald-600">
                <FileSpreadsheet size={19} />
              </span>
              <div>
                <p className="text-sm font-black text-slate-950">
                  Kết quả nhập gần nhất: {importReport.fileName}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {importReport.successCount}/{importReport.totalRows} dòng đã
                  lưu · {importReport.errorCount} dòng lỗi
                </p>
              </div>
            </div>
            <Button
              variant="adminSecondary"
              leftIcon={<Eye size={16} />}
              onClick={() => setImportReportOpen(true)}
            >
              Xem chi tiết đối chiếu
            </Button>
          </div>
        )}

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

      <ImportReportDialog
        report={importReport}
        open={importReportOpen}
        selectedRow={selectedImportRow}
        onSelectRow={setSelectedImportRow}
        onClose={() => setImportReportOpen(false)}
      />
    </ProtectedRoute>
  );
}
