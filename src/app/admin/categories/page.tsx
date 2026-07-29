"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit3, FileText, Plus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth-context";
import { adminRequest, getAdminErrorMessage } from "@/lib/admin-client";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { DataTable } from "@/components/admin/DataTable";
import CmsPageHeader from "@/components/admin/CmsPageHeader";
import { CmsPanel, CmsPanelBody } from "@/components/admin/CmsPanel";
import {
  AdminErrorState,
  AdminFormField,
  AdminLoadingState,
  AdminSearchInput,
  AdminToolbar,
  ConfirmDialog,
} from "@/components/admin/AdminPrimitives";
import Button from "@/components/ui/Button";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count?: { posts: number };
}

type CategoryForm = {
  name: string;
  slug: string;
  description: string;
};

type CategoryFormErrors = Partial<Record<keyof CategoryForm, string>>;

const EMPTY_FORM: CategoryForm = {
  name: "",
  slug: "",
  description: "",
};

function toSlug(value: string) {
  return value
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function CategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<CategoryFormErrors>({});

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      setCategories(await adminRequest<Category[]>("/api/categories"));
    } catch (error) {
      setLoadError(
        getAdminErrorMessage(error, "Không thể tải danh sách danh mục."),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchCategories(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchCategories]);

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: CategoryFormErrors = {};
    if (!form.name.trim()) errors.name = "Vui lòng nhập tên danh mục.";
    if (!form.slug.trim()) errors.slug = "Vui lòng nhập đường dẫn.";
    if (form.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) {
      errors.slug = "Chỉ dùng chữ thường không dấu, số và dấu gạch ngang.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token || !validateForm()) return;

    setSubmitting(true);
    try {
      const saved = await adminRequest<Category>(
        editingId ? `/api/categories/${editingId}` : "/api/categories",
        {
          method: editingId ? "PUT" : "POST",
          token,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            slug: form.slug.trim(),
            description: form.description.trim(),
          }),
        },
      );

      setCategories((current) =>
        editingId
          ? current.map((item) =>
              item.id === editingId
                ? { ...item, ...saved, _count: item._count }
                : item,
            )
          : [{ ...saved, _count: { posts: 0 } }, ...current],
      );
      toast.success(
        editingId ? "Đã cập nhật danh mục." : "Đã tạo danh mục mới.",
      );
      resetForm();
    } catch (error) {
      const message = getAdminErrorMessage(error, "Không thể lưu danh mục.");
      if (message.toLowerCase().includes("slug")) {
        setFormErrors((current) => ({ ...current, slug: message }));
      } else {
        toast.error(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !token) return;
    setSubmitting(true);
    try {
      await adminRequest(`/api/categories/${deleteTarget.id}`, {
        method: "DELETE",
        token,
      });
      setCategories((current) =>
        current.filter((item) => item.id !== deleteTarget.id),
      );
      if (editingId === deleteTarget.id) resetForm();
      toast.success("Đã xóa danh mục.");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(getAdminErrorMessage(error, "Không thể xóa danh mục."));
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("vi");
    if (!query) return categories;
    return categories.filter(
      (category) =>
        category.name.toLocaleLowerCase("vi").includes(query) ||
        category.slug.toLocaleLowerCase("vi").includes(query) ||
        category.description?.toLocaleLowerCase("vi").includes(query),
    );
  }, [categories, searchQuery]);

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Danh mục",
        cell: ({ row }) => (
          <div className="min-w-44">
            <p className="font-black text-slate-950">{row.original.name}</p>
            <p className="mt-1 font-mono text-[10px] text-slate-400">
              {row.original.slug}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "description",
        header: "Mô tả",
        cell: ({ row }) => (
          <p className="max-w-md text-xs leading-5 text-slate-500">
            {row.original.description || "Chưa có mô tả"}
          </p>
        ),
      },
      {
        id: "posts",
        accessorFn: (category) => category._count?.posts || 0,
        header: "Bài viết",
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1.5 border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600">
            <FileText size={13} />
            {row.original._count?.posts || 0}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Thao tác",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => startEdit(row.original)}
              className="acbt-icon-btn grid h-9 w-9 place-items-center text-slate-600 hover:bg-orange-50 hover:text-orange-600"
              title="Chỉnh sửa"
              aria-label={`Sửa ${row.original.name}`}
            >
              <Edit3 size={16} />
            </button>
            <button
              type="button"
              onClick={() => setDeleteTarget(row.original)}
              className="acbt-icon-btn grid h-9 w-9 place-items-center text-red-500 hover:bg-red-50 hover:text-red-700"
              title="Xóa"
              aria-label={`Xóa ${row.original.name}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "EDITOR"]}>
      <div className="space-y-5">
        <CmsPageHeader
          eyebrow="Nội dung"
          title="Quản lý danh mục"
          description="Tổ chức bài viết theo chuyên mục rõ ràng để người đọc và biên tập viên dễ tìm kiếm."
        />

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <CmsPanel>
            <AdminToolbar>
              <AdminSearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Tìm tên, đường dẫn hoặc mô tả..."
              />
            </AdminToolbar>
            {loading ? (
              <AdminLoadingState title="Đang tải danh mục" />
            ) : loadError ? (
              <AdminErrorState
                description={loadError}
                action={
                  <Button
                    variant="adminSecondary"
                    onClick={() => void fetchCategories()}
                  >
                    Thử lại
                  </Button>
                }
              />
            ) : (
              <DataTable
                columns={columns}
                data={filteredCategories}
                emptyTitle="Không tìm thấy danh mục"
                emptyDescription={
                  searchQuery
                    ? "Hãy thử một từ khóa khác."
                    : "Tạo danh mục đầu tiên bằng biểu mẫu bên cạnh."
                }
              />
            )}
          </CmsPanel>

          <CmsPanel className="xl:sticky xl:top-20">
            <CmsPanelBody>
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-slate-950">
                    {editingId ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Đường dẫn được tạo tự động và vẫn có thể chỉnh lại.
                  </p>
                </div>
                {editingId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="acbt-icon-btn grid h-9 w-9 place-items-center text-slate-500 hover:bg-slate-100"
                    aria-label="Hủy chỉnh sửa"
                    title="Hủy chỉnh sửa"
                  >
                    <X size={17} />
                  </button>
                ) : null}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <AdminFormField
                  label="Tên danh mục"
                  error={formErrors.name}
                  required
                >
                  <input
                    value={form.name}
                    onChange={(event) => {
                      const name = event.target.value;
                      setForm((current) => ({
                        ...current,
                        name,
                        slug: editingId ? current.slug : toSlug(name),
                      }));
                      setFormErrors((current) => ({
                        ...current,
                        name: undefined,
                      }));
                    }}
                    className="min-h-11 w-full border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                    placeholder="Ví dụ: Công thức món ngon"
                  />
                </AdminFormField>

                <AdminFormField
                  label="Đường dẫn"
                  error={formErrors.slug}
                  hint={`URL dự kiến: /tin-tuc?category=${form.slug || "duong-dan"}`}
                  required
                >
                  <input
                    value={form.slug}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        slug: toSlug(event.target.value),
                      }));
                      setFormErrors((current) => ({
                        ...current,
                        slug: undefined,
                      }));
                    }}
                    className="min-h-11 w-full border border-slate-200 px-3 py-2.5 font-mono text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                    placeholder="cong-thuc-mon-ngon"
                  />
                </AdminFormField>

                <AdminFormField label="Mô tả">
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full border border-slate-200 px-3 py-2.5 text-sm leading-6 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                    placeholder="Mô tả ngắn về nội dung của chuyên mục..."
                  />
                </AdminFormField>

                <div className="flex flex-wrap justify-end gap-2 pt-2">
                  {editingId ? (
                    <Button
                      variant="adminSecondary"
                      onClick={resetForm}
                      disabled={submitting}
                    >
                      Hủy
                    </Button>
                  ) : null}
                  <Button
                    type="submit"
                    variant="admin"
                    loading={submitting}
                    leftIcon={<Plus size={15} />}
                  >
                    {editingId ? "Lưu thay đổi" : "Thêm danh mục"}
                  </Button>
                </div>
              </form>
            </CmsPanelBody>
          </CmsPanel>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Xóa danh mục?"
        description={`Danh mục “${deleteTarget?.name || ""}” sẽ bị xóa. Các bài viết hiện có sẽ chuyển sang trạng thái chưa phân loại.`}
        loading={submitting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
      />
    </ProtectedRoute>
  );
}
