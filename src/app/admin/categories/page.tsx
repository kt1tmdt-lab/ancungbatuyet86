"use client";

import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { 
  FolderPlus, 
  Edit3, 
  Trash2, 
  Loader, 
  AlertCircle, 
  Check, 
  Plus, 
  X,
  FileText
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count?: {
    posts: number;
  };
}

export default function CategoriesPage() {
  const { token } = useAuth();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Edit Mode state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (token) {
      fetchCategories();
    }
  }, [token]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e: string) => {
    setName(e);
    if (!editingId) {
      const generatedSlug = e
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove Vietnamese accents
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "") // Remove spec chars
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-");
      setSlug(generatedSlug);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setError("");
    setSuccess("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      setError("Tên và slug không được để trống");
      return;
    }

    setError("");
    setSuccess("");
    setSubmitLoading(true);

    try {
      const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, slug, description }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gặp lỗi khi lưu danh mục");
      }

      setSuccess(editingId ? "Cập nhật danh mục thành công!" : "Tạo danh mục mới thành công!");
      setName("");
      setSlug("");
      setDescription("");
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này? Các bài viết thuộc danh mục này sẽ chuyển sang không có danh mục.")) return;
    
    setError("");
    setSuccess("");
    
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Không thể xóa danh mục");
      }

      setSuccess("Xóa danh mục thành công!");
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "EDITOR"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quản lý danh mục</h1>
          <p className="text-slate-500 text-sm mt-1">Phân chia chuyên mục bài viết của trang blog tin tức.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* List Categories (Col-span 2) */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Danh sách chuyên mục</h2>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <Loader className="animate-spin text-orange-500" size={32} />
                <p className="text-xs text-slate-400 font-medium">Đang tải danh mục...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <AlertCircle className="mx-auto text-slate-300 mb-2" size={32} />
                <p className="text-sm font-semibold">Chưa có danh mục nào được tạo</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full text-sm text-left text-slate-700">
                  <thead className="text-xs text-slate-450 uppercase bg-slate-50 font-bold border-b border-slate-100">
                    <tr>
                      <th className="px-5 py-4">Tên danh mục</th>
                      <th className="px-5 py-4">Đường dẫn (Slug)</th>
                      <th className="px-5 py-4">Mô tả</th>
                      <th className="px-5 py-4 text-center">Số bài viết</th>
                      <th className="px-5 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-5 py-4 font-bold text-slate-900">{cat.name}</td>
                        <td className="px-5 py-4 text-slate-500 font-mono text-xs">{cat.slug}</td>
                        <td className="px-5 py-4 text-slate-500 max-w-xs truncate">{cat.description || "-"}</td>
                        <td className="px-5 py-4 text-center">
                          <div className="inline-flex items-center gap-1 text-slate-600 font-semibold text-xs bg-slate-100 px-2.5 py-0.5 rounded-full">
                            <FileText size={11} />
                            <span>{cat._count?.posts || 0}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => startEdit(cat)}
                              className="p-1.5 text-slate-600 hover:text-orange-500 hover:bg-slate-100 rounded-lg transition"
                              title="Sửa danh mục"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(cat.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Xóa danh mục"
                            >
                              <Trash2 size={15} />
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

          {/* Form Create/Edit (Col-span 1) */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {editingId ? "Cập nhật danh mục" : "Tạo chuyên mục mới"}
              </h2>
              {editingId && (
                <button
                  onClick={cancelEdit}
                  className="p-1 text-slate-400 hover:bg-slate-100 rounded transition"
                  title="Hủy cập nhật"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Tên chuyên mục</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ví dụ: Công thức món ngon"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  required
                />
              </div>

              {/* Slug field */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Đường dẫn (Slug)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="cong-thuc-mon-ngon"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  required
                />
              </div>

              {/* Description field */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Mô tả danh mục</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả tóm tắt ý nghĩa chuyên mục bài viết..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
              </div>

              {/* Message responses */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="text-red-600 mt-0.5 shrink-0" size={16} />
                  <p className="text-xs text-red-700 font-semibold leading-normal">{error}</p>
                </div>
              )}

              {success && (
                <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <Check className="text-green-600 mt-0.5 shrink-0" size={16} />
                  <p className="text-xs text-green-700 font-semibold leading-normal">{success}</p>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm shadow-orange-500/10"
              >
                {submitLoading ? (
                  <Loader className="animate-spin" size={14} />
                ) : editingId ? (
                  <Check size={14} />
                ) : (
                  <Plus size={14} />
                )}
                <span>{editingId ? "Cập nhật danh mục" : "Tạo danh mục"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
