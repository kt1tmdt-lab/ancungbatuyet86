"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit3, Mail, Plus, ShieldCheck, Trash2, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import type { AuthRole } from "@/lib/auth";
import { useAuth } from "@/lib/auth-context";
import { ADMIN_ROLE_LABELS } from "@/lib/admin-navigation";
import { adminRequest, getAdminErrorMessage } from "@/lib/admin-client";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { DataTable } from "@/components/admin/DataTable";
import CmsPageHeader from "@/components/admin/CmsPageHeader";
import { CmsPanel } from "@/components/admin/CmsPanel";
import {
  AdminErrorState,
  AdminFormField,
  AdminLoadingState,
  AdminModal,
  AdminSearchInput,
  AdminSelect,
  AdminToolbar,
  ConfirmDialog,
} from "@/components/admin/AdminPrimitives";
import Button from "@/components/ui/Button";

type UserAccount = {
  id: string;
  name: string | null;
  email: string;
  role: AuthRole;
  createdAt: string;
  updatedAt: string;
  _count?: { posts: number };
};

type UserForm = {
  name: string;
  email: string;
  password: string;
  role: AuthRole;
};

type UserFormErrors = Partial<Record<keyof UserForm, string>>;

const EMPTY_FORM: UserForm = {
  name: "",
  email: "",
  password: "",
  role: "USER",
};

const ASSIGNABLE_ROLES: AuthRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "EDITOR",
  "AUTHOR",
  "MARKETING",
  "SUPPORT",
  "USER",
];

export default function UsersPage() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<AuthRole | "ALL">("ALL");
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserAccount | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<UserForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<UserFormErrors>({});

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setLoadError("");
    try {
      setUsers(await adminRequest<UserAccount[]>("/api/users", { token }));
    } catch (error) {
      setLoadError(
        getAdminErrorMessage(error, "Không thể tải danh sách thành viên."),
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchUsers(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchUsers]);

  const openCreateForm = () => {
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setFormOpen(true);
  };

  const openEditForm = (user: UserAccount) => {
    setEditingUser(user);
    setForm({
      name: user.name || "",
      email: user.email,
      password: "",
      role: user.role,
    });
    setFormErrors({});
    setFormOpen(true);
  };

  const validateForm = () => {
    const errors: UserFormErrors = {};
    if (!form.name.trim()) errors.name = "Vui lòng nhập tên hiển thị.";
    if (!form.email.trim()) {
      errors.email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Email chưa đúng định dạng.";
    }
    if (!editingUser && !form.password) {
      errors.password = "Mật khẩu là bắt buộc khi tạo tài khoản.";
    } else if (form.password && form.password.length < 8) {
      errors.password = "Mật khẩu cần ít nhất 8 ký tự.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token || !validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLocaleLowerCase("vi"),
        role: form.role,
        ...(form.password ? { password: form.password } : {}),
      };
      const saved = await adminRequest<UserAccount>(
        editingUser ? `/api/users/${editingUser.id}` : "/api/users",
        {
          method: editingUser ? "PUT" : "POST",
          token,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      setUsers((current) =>
        editingUser
          ? current.map((item) =>
              item.id === editingUser.id
                ? { ...item, ...saved }
                : item,
            )
          : [saved, ...current],
      );
      toast.success(
        editingUser
          ? "Đã cập nhật thành viên."
          : "Đã tạo tài khoản mới.",
      );
      setFormOpen(false);
    } catch (error) {
      const message = getAdminErrorMessage(error, "Không thể lưu tài khoản.");
      if (message.toLowerCase().includes("email")) {
        setFormErrors((current) => ({ ...current, email: message }));
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
      await adminRequest(`/api/users/${deleteTarget.id}`, {
        method: "DELETE",
        token,
      });
      setUsers((current) =>
        current.filter((item) => item.id !== deleteTarget.id),
      );
      toast.success("Đã xóa tài khoản.");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(getAdminErrorMessage(error, "Không thể xóa tài khoản."));
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("vi");
    return users.filter((user) => {
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      const matchesSearch =
        !query ||
        user.name?.toLocaleLowerCase("vi").includes(query) ||
        user.email.toLocaleLowerCase("vi").includes(query);
      return matchesRole && matchesSearch;
    });
  }, [roleFilter, searchQuery, users]);

  const columns = useMemo<ColumnDef<UserAccount>[]>(
    () => [
      {
        id: "name",
        accessorFn: (user) => user.name || user.email,
        header: "Thành viên",
        cell: ({ row }) => (
          <div className="flex min-w-56 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center border border-slate-200 bg-slate-50 font-black text-slate-600">
              {(row.original.name || row.original.email)
                .charAt(0)
                .toLocaleUpperCase("vi")}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-black text-slate-950">
                {row.original.name || "Chưa đặt tên"}
              </span>
              <span className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-slate-500">
                <Mail size={11} />
                {row.original.email}
              </span>
            </span>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: "Vai trò",
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1.5 border border-orange-200 bg-orange-50 px-2.5 py-1 text-[11px] font-black text-orange-700">
            <ShieldCheck size={13} />
            {ADMIN_ROLE_LABELS[row.original.role]}
          </span>
        ),
      },
      {
        id: "posts",
        accessorFn: (user) => user._count?.posts || 0,
        header: "Bài viết",
        cell: ({ row }) => (
          <span className="font-bold text-slate-700">
            {row.original._count?.posts || 0}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Ngày tạo",
        cell: ({ row }) => (
          <span className="text-xs font-medium text-slate-500">
            {new Date(row.original.createdAt).toLocaleDateString("vi-VN")}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Thao tác",
        enableSorting: false,
        cell: ({ row }) => {
          const isCurrentUser = currentUser?.id === row.original.id;
          return (
            <div className="flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={() => openEditForm(row.original)}
                className="acbt-icon-btn grid h-9 w-9 place-items-center text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                aria-label={`Sửa ${row.original.name || row.original.email}`}
                title="Chỉnh sửa"
              >
                <Edit3 size={16} />
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(row.original)}
                disabled={isCurrentUser}
                className="acbt-icon-btn grid h-9 w-9 place-items-center text-red-500 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label={`Xóa ${row.original.name || row.original.email}`}
                title={
                  isCurrentUser
                    ? "Không thể tự xóa tài khoản đang đăng nhập"
                    : "Xóa"
                }
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        },
      },
    ],
    [currentUser?.id],
  );

  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
      <div className="space-y-5">
        <CmsPageHeader
          eyebrow="Hệ thống"
          title="Quản lý thành viên"
          description="Tạo tài khoản, cập nhật thông tin và phân quyền truy cập khu vực quản trị."
          actions={
            <Button
              variant="admin"
              leftIcon={<Plus size={16} />}
              onClick={openCreateForm}
            >
              Thêm thành viên
            </Button>
          }
        />

        <CmsPanel>
          <AdminToolbar>
            <AdminSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Tìm theo tên hoặc email..."
            />
            <AdminSelect
              label="Lọc theo vai trò"
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value as AuthRole | "ALL")
              }
            >
              <option value="ALL">Tất cả vai trò</option>
              {ASSIGNABLE_ROLES.map((role) => (
                <option key={role} value={role}>
                  {ADMIN_ROLE_LABELS[role]}
                </option>
              ))}
            </AdminSelect>
          </AdminToolbar>

          {loading ? (
            <AdminLoadingState title="Đang tải thành viên" />
          ) : loadError ? (
            <AdminErrorState
              description={loadError}
              action={
                <Button
                  variant="adminSecondary"
                  onClick={() => void fetchUsers()}
                >
                  Thử lại
                </Button>
              }
            />
          ) : (
            <DataTable
              columns={columns}
              data={filteredUsers}
              emptyTitle="Không tìm thấy thành viên"
              emptyDescription={
                searchQuery || roleFilter !== "ALL"
                  ? "Hãy đổi từ khóa hoặc bộ lọc để xem kết quả khác."
                  : "Tạo tài khoản đầu tiên để bắt đầu phân quyền."
              }
            />
          )}
        </CmsPanel>
      </div>

      <AdminModal
        open={formOpen}
        title={editingUser ? "Chỉnh sửa thành viên" : "Thêm thành viên"}
        description="Thông tin bắt buộc được kiểm tra ngay tại từng trường."
        onClose={() => {
          if (!submitting) setFormOpen(false);
        }}
        size="md"
        footer={
          <>
            <Button
              variant="adminSecondary"
              onClick={() => setFormOpen(false)}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button
              variant="admin"
              type="submit"
              form="admin-user-form"
              loading={submitting}
            >
              {editingUser ? "Lưu thay đổi" : "Tạo tài khoản"}
            </Button>
          </>
        }
      >
        <form
          id="admin-user-form"
          onSubmit={handleSubmit}
          className="grid gap-4 sm:grid-cols-2"
          noValidate
        >
          <AdminFormField
            label="Tên hiển thị"
            error={formErrors.name}
            required
          >
            <div className="relative">
              <UserRound
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={17}
              />
              <input
                value={form.name}
                onChange={(event) => {
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }));
                  setFormErrors((current) => ({
                    ...current,
                    name: undefined,
                  }));
                }}
                className="min-h-11 w-full border border-slate-200 py-2.5 pl-10 pr-3 text-sm font-semibold outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                placeholder="Nguyễn Văn A"
              />
            </div>
          </AdminFormField>

          <AdminFormField label="Vai trò" required>
            <select
              value={form.role}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  role: event.target.value as AuthRole,
                }))
              }
              disabled={editingUser?.id === currentUser?.id}
              className="min-h-11 w-full border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 disabled:bg-slate-50 disabled:text-slate-400"
            >
              {ASSIGNABLE_ROLES.map((role) => (
                <option key={role} value={role}>
                  {ADMIN_ROLE_LABELS[role]}
                </option>
              ))}
            </select>
          </AdminFormField>

          <AdminFormField
            label="Email"
            error={formErrors.email}
            required
          >
            <input
              type="email"
              value={form.email}
              onChange={(event) => {
                setForm((current) => ({
                  ...current,
                  email: event.target.value,
                }));
                setFormErrors((current) => ({
                  ...current,
                  email: undefined,
                }));
              }}
              disabled={editingUser?.id === currentUser?.id}
              className="min-h-11 w-full border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 disabled:bg-slate-50 disabled:text-slate-400"
              placeholder="email@example.com"
            />
          </AdminFormField>

          <AdminFormField
            label={editingUser ? "Mật khẩu mới" : "Mật khẩu"}
            error={formErrors.password}
            hint={editingUser ? "Để trống nếu không muốn đổi mật khẩu." : undefined}
            required={!editingUser}
          >
            <input
              type="password"
              value={form.password}
              onChange={(event) => {
                setForm((current) => ({
                  ...current,
                  password: event.target.value,
                }));
                setFormErrors((current) => ({
                  ...current,
                  password: undefined,
                }));
              }}
              className="min-h-11 w-full border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              placeholder="Tối thiểu 8 ký tự"
            />
          </AdminFormField>
        </form>
      </AdminModal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Xóa tài khoản?"
        description={`Tài khoản “${deleteTarget?.name || deleteTarget?.email || ""}” sẽ mất quyền truy cập và không thể khôi phục bằng thao tác này.`}
        loading={submitting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
      />
    </ProtectedRoute>
  );
}
