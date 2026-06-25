"use client";

import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { 
  Users, 
  Loader, 
  AlertCircle, 
  Check, 
  ShieldCheck,
  FileText,
  Mail,
  Plus,
  Pencil,
  Trash,
  X,
  Lock,
  User as UserIcon
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface UserAccount {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "EDITOR" | "AUTHOR" | "USER" | "SUPER_ADMIN" | "MARKETING" | "SUPPORT";
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
  };
}

export default function UsersPage() {
  const { token, user: currentUser } = useAuth();
  
  const [usersList, setUsersList] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState<string>("USER");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      } else {
        setError("Không thể tải danh sách thành viên");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Đã xảy ra lỗi khi tải thành viên");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormName("");
    setFormEmail("");
    setFormPassword("");
    setFormRole("USER");
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: UserAccount) => {
    setEditingUser(user);
    setFormName(user.name || "");
    setFormEmail(user.email);
    setFormPassword("");
    setFormRole(user.role);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    setSuccess("");
    setError("");

    try {
      if (editingUser) {
        // Edit User
        const body: any = {
          name: formName,
          email: formEmail,
          role: formRole
        };
        if (formPassword) {
          body.password = formPassword;
        }

        const res = await fetch(`/api/users/${editingUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Gặp lỗi khi cập nhật thông tin");
        }

        const updated = await res.json();
        setUsersList(usersList.map(u => u.id === editingUser.id ? { ...u, ...updated } : u));
        setSuccess("Cập nhật thông tin thành viên thành công!");
        setIsModalOpen(false);
      } else {
        // Create User
        if (!formPassword) {
          throw new Error("Mật khẩu là bắt buộc khi tạo tài khoản mới");
        }

        const res = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: formName,
            email: formEmail,
            password: formPassword,
            role: formRole
          })
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Gặp lỗi khi tạo tài khoản mới");
        }

        const newUser = await res.json();
        setUsersList([newUser, ...usersList]);
        setSuccess("Tạo mới tài khoản thành viên thành công!");
        setIsModalOpen(false);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string, displayName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tài khoản "${displayName}" không?\nHành động này không thể hoàn tác!`)) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gặp lỗi khi xóa tài khoản");
      }

      setSuccess("Xóa tài khoản thành viên thành công!");
      setUsersList(usersList.filter(u => u.id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi xóa");
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (currentUser?.id === userId) {
      alert("Bạn không thể tự thay đổi vai trò của chính mình!");
      return;
    }

    setUpdatingId(userId);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gặp lỗi khi phân quyền");
      }

      setSuccess("Cập nhật vai trò người dùng thành công!");
      setUsersList(usersList.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setUpdatingId(null);
    }
  };

  const roleLabels: Record<string, string> = {
    SUPER_ADMIN: "Siêu quản trị",
    ADMIN: "Quản trị viên",
    EDITOR: "Biên tập viên",
    AUTHOR: "Tác giả",
    MARKETING: "Marketing",
    SUPPORT: "Hỗ trợ",
    USER: "Thành viên"
  };

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center shadow-md">
              <Users size={20} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quản lý thành viên</h1>
              <p className="text-slate-500 text-sm mt-1">Quản lý, tạo mới và phân quyền người dùng trong hệ thống.</p>
            </div>
          </div>
          
          <Button
            variant="admin"
            leftIcon={<Plus size={16} />}
            onClick={handleOpenCreateModal}
            className="self-start sm:self-auto shadow-md shadow-orange-500/10"
          >
            Thêm tài khoản
          </Button>
        </div>

        {/* Messaging responses */}
        {error && (
          <div className="flex items-start gap-2.5 p-4 bg-red-50 border border-red-200">
            <AlertCircle className="text-red-600 mt-0.5 shrink-0" size={18} />
            <p className="text-sm text-red-700 font-semibold leading-relaxed">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2.5 p-4 bg-green-50 border border-green-200">
            <Check className="text-green-600 mt-0.5 shrink-0" size={18} />
            <p className="text-sm text-green-700 font-semibold leading-relaxed">{success}</p>
          </div>
        )}

        {/* Users list table */}
        <div className="bg-white border border-slate-100 p-6 shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <Loader className="animate-spin text-orange-500" size={36} />
              <p className="text-xs text-slate-400 font-semibold">Đang tải danh sách thành viên...</p>
            </div>
          ) : usersList.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <AlertCircle className="mx-auto text-slate-350 mb-2" size={36} />
              <p className="text-sm font-semibold">Chưa có thành viên nào khác</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-100">
              <table className="w-full text-sm text-left text-slate-700">
                <thead className="text-xs text-slate-450 uppercase bg-slate-50 font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-4">Tên hiển thị</th>
                    <th className="px-5 py-4">Email liên hệ</th>
                    <th className="px-5 py-4">Ngày đăng ký</th>
                    <th className="px-5 py-4 text-center">Số bài viết</th>
                    <th className="px-5 py-4">Vai trò (Role)</th>
                    <th className="px-5 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {usersList.map((acc) => {
                    const isSelf = acc.id === currentUser?.id;
                    
                    return (
                      <tr key={acc.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-5 py-4 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <span>{acc.name || "Không tên"}</span>
                            {isSelf && (
                              <span className="bg-primary/10 text-orange-600 text-[9px] font-bold px-2 py-0.5 rounded border border-orange-200">
                                BẠN
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-500 text-xs sm:text-sm">
                          <div className="flex items-center gap-1.5 font-medium">
                            <Mail size={12} className="text-slate-400" />
                            <span>{acc.email}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-500 text-xs font-semibold">
                          {new Date(acc.createdAt).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <div className="inline-flex items-center gap-1 text-slate-600 font-semibold text-xs bg-slate-100 px-2.5 py-0.5">
                            <FileText size={11} />
                            <span>{acc._count?.posts || 0}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {isSelf ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1">
                              <ShieldCheck size={13} />
                              <span>{roleLabels[acc.role]}</span>
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <select
                                value={acc.role}
                                disabled={updatingId === acc.id}
                                onChange={(e) => handleRoleChange(acc.id, e.target.value)}
                                className="bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer disabled:opacity-50"
                              >
                                <option value="ADMIN">Quản trị viên</option>
                                <option value="EDITOR">Biên tập viên</option>
                                <option value="AUTHOR">Tác giả</option>
                                <option value="USER">Thành viên</option>
                                <option value="SUPER_ADMIN">Siêu quản trị</option>
                                <option value="MARKETING">Marketing</option>
                                <option value="SUPPORT">Hỗ trợ</option>
                              </select>
                              {updatingId === acc.id && (
                                <Loader className="animate-spin text-orange-500" size={14} />
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(acc)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition rounded"
                              title="Chỉnh sửa thông tin"
                            >
                              <Pencil size={14} />
                            </button>
                            {!isSelf && (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(acc.id, acc.name || acc.email)}
                                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 transition rounded"
                                title="Xóa tài khoản"
                              >
                                <Trash size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-slate-250 shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 text-primary">
                  <UserIcon size={16} />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {editingUser ? "Chỉnh sửa tài khoản" : "Tạo tài khoản mới"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-650 hover:bg-slate-100 rounded transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit}>
              <div className="p-6 space-y-4">
                {formError && (
                  <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200">
                    <AlertCircle className="text-red-600 mt-0.5 shrink-0" size={16} />
                    <p className="text-xs text-red-700 font-semibold leading-relaxed">{formError}</p>
                  </div>
                )}

                <Input
                  label="Họ tên thành viên"
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  leftIcon={<UserIcon size={16} />}
                />

                <Input
                  label="Địa chỉ Email"
                  type="email"
                  placeholder="vi_du@acbt.local"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  disabled={Boolean(editingUser && editingUser.id === currentUser?.id)}
                  leftIcon={<Mail size={16} />}
                />

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    Vai trò (Role)
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    disabled={Boolean(editingUser && editingUser.id === currentUser?.id)}
                    className="w-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 disabled:bg-slate-50 cursor-pointer"
                  >
                    <option value="USER">Thành viên (USER)</option>
                    <option value="AUTHOR">Tác giả (AUTHOR)</option>
                    <option value="EDITOR">Biên tập viên (EDITOR)</option>
                    <option value="ADMIN">Quản trị viên (ADMIN)</option>
                    <option value="MARKETING">Marketing (MARKETING)</option>
                    <option value="SUPPORT">Hỗ trợ kỹ thuật (SUPPORT)</option>
                    <option value="SUPER_ADMIN">Siêu quản trị (SUPER_ADMIN)</option>
                  </select>
                </div>

                <Input
                  label={editingUser ? "Mật khẩu mới (Để trống nếu không đổi)" : "Mật khẩu truy cập"}
                  type="password"
                  placeholder="••••••••"
                  required={!editingUser}
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  leftIcon={<Lock size={16} />}
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50">
                <Button
                  variant="adminSecondary"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2 text-xs"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  variant="admin"
                  loading={submitting}
                  className="px-5 py-2 text-xs shadow-md shadow-orange-500/10"
                >
                  {editingUser ? "Lưu thay đổi" : "Tạo tài khoản"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}

