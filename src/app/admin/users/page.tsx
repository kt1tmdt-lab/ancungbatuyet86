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
  Mail
} from "lucide-react";

interface UserAccount {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "EDITOR" | "AUTHOR" | "USER";
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

  const roleLabels = {
    ADMIN: "Quản trị viên",
    EDITOR: "Biên tập viên",
    AUTHOR: "Tác giả",
    USER: "Thành viên"
  };

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 text-white  flex items-center justify-center shadow-md">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quản lý thành viên</h1>
            <p className="text-slate-500 text-sm mt-1">Phân quyền vai trò người dùng hệ thống (ADMIN, EDITOR, AUTHOR, USER).</p>
          </div>
        </div>

        {/* Messaging responses */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200  max-w-md">
            <AlertCircle className="text-red-600 mt-0.5 shrink-0" size={16} />
            <p className="text-xs text-red-700 font-semibold leading-normal">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200  max-w-md">
            <Check className="text-green-600 mt-0.5 shrink-0" size={16} />
            <p className="text-xs text-green-700 font-semibold leading-normal">{success}</p>
          </div>
        )}

        {/* Users list table */}
        <div className="bg-white  border border-slate-100 p-6 shadow-sm">
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
            <div className="overflow-x-auto  border border-slate-100">
              <table className="w-full text-sm text-left text-slate-700">
                <thead className="text-xs text-slate-450 uppercase bg-slate-50 font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-4">Tên hiển thị</th>
                    <th className="px-5 py-4">Email liên hệ</th>
                    <th className="px-5 py-4">Ngày đăng ký</th>
                    <th className="px-5 py-4 text-center">Số bài viết</th>
                    <th className="px-5 py-4">Vai trò (Role)</th>
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
                              <span className="bg-orange-500/10 text-orange-600 text-[9px] font-bold px-2 py-0.5 rounded border border-orange-200">
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
                          <div className="inline-flex items-center gap-1 text-slate-600 font-semibold text-xs bg-slate-100 px-2.5 py-0.5 ">
                            <FileText size={11} />
                            <span>{acc._count?.posts || 0}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {isSelf ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 ">
                              <ShieldCheck size={13} />
                              <span>{roleLabels[acc.role]}</span>
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <select
                                value={acc.role}
                                disabled={updatingId === acc.id}
                                onChange={(e) => handleRoleChange(acc.id, e.target.value)}
                                className="bg-slate-50 border border-slate-200 px-3 py-1  text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer disabled:opacity-50"
                              >
                                <option value="ADMIN">Quản trị viên</option>
                                <option value="EDITOR">Biên tập viên</option>
                                <option value="AUTHOR">Tác giả</option>
                                <option value="USER">Thành viên</option>
                              </select>
                              {updatingId === acc.id && (
                                <Loader className="animate-spin text-orange-500" size={14} />
                              )}
                            </div>
                          )}
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
    </ProtectedRoute>
  );
}
