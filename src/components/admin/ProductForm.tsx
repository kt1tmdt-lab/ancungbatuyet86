"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Loader, AlertCircle, Save, ArrowLeft, Plus, Trash } from "lucide-react";
import Link from "next/link";

interface ProductData {
  id?: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  categoryLabel: string;
  price: string;
  priceRange: string;
  image: string;
  heroImage: string;
  featured: boolean;
  purchaseUrl: string;
  ingredients: string[];
}

export function ProductForm({ initialData }: { initialData?: ProductData }) {
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [tagline, setTagline] = useState(initialData?.tagline || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "chan-ga");
  const [categoryLabel, setCategoryLabel] = useState(initialData?.categoryLabel || "Chân Gà");
  const [price, setPrice] = useState(initialData?.price || "");
  const [priceRange, setPriceRange] = useState(initialData?.priceRange || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [heroImage, setHeroImage] = useState(initialData?.heroImage || "");
  const [purchaseUrl, setPurchaseUrl] = useState(initialData?.purchaseUrl || "");
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [ingredients, setIngredients] = useState<string[]>(initialData?.ingredients || []);
  const [newIngredient, setNewIngredient] = useState("");

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useAuth();
  const router = useRouter();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setImage(data.url);
      } else {
        setUploadError(data.error || "Tải ảnh lên thất bại");
      }
    } catch (err) {
      console.error(err);
      setUploadError("Không thể kết nối đến server upload");
    } finally {
      setUploading(false);
    }
  };

  // Auto-generate slug from name
  useEffect(() => {
    if (!initialData && name) {
      const generated = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setSlug(generated);
    }
  }, [name, initialData]);

  // Sync categoryLabel when category changes
  useEffect(() => {
    if (category === "chan-ga") setCategoryLabel("Chân Gà");
    else if (category === "tam-cay") setCategoryLabel("Tăm Cay");
    else if (category === "banh-trang") setCategoryLabel("Bánh Tráng");
    else if (category === "khac") setCategoryLabel("Ăn Vặt Khác");
  }, [category]);

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      name,
      slug,
      tagline,
      description,
      category,
      categoryLabel,
      price,
      priceRange: priceRange || price,
      image,
      heroImage: heroImage || image,
      featured,
      purchaseUrl,
      ingredients,
    };

    try {
      const url = initialData?.id ? `/api/products/${initialData.id}` : "/api/products";
      const method = initialData?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Có lỗi xảy ra khi lưu sản phẩm");
      }
    } catch (err) {
      console.error(err);
      setError("Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2  transition"
        >
          <ArrowLeft size={14} />
          <span>Quay lại danh sách</span>
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5  text-sm font-bold shadow-md shadow-orange-500/10 hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
          <span>{initialData?.id ? "Lưu thay đổi" : "Tạo sản phẩm"}</span>
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200  text-red-700 text-sm">
          <AlertCircle className="shrink-0 mt-0.5" size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Form Fields */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white  border border-slate-100 p-6 sm:p-8 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Thông tin cơ bản</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tên sản phẩm</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Chân Gà Rút Xương"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200  text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Slug (Đường dẫn)</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="Ví dụ: chan-ga-rut-xuong"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200  text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Slogan / Tagline ngắn</label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Ví dụ: Giòn ngon sần sật, đậm vị ớt hiểm Việt Nam."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200  text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mô tả sản phẩm</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập giới thiệu chi tiết về sản phẩm..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200  text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-800"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Đơn giá hiển thị</label>
                <input
                  type="text"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ví dụ: 89.000đ"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200  text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Khoảng giá</label>
                <input
                  type="text"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  placeholder="Ví dụ: 45.000đ - 139.000đ"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200  text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Link mua hàng sàn TMĐT (Shopee/TikTok Shop)</label>
              <input
                type="url"
                required
                value={purchaseUrl}
                onChange={(e) => setPurchaseUrl(e.target.value)}
                placeholder="Ví dụ: https://shopee.vn/an-vat-ba-tuyet-chan-ga"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200  text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-800"
              />
              <p className="text-[11px] text-slate-400 mt-1">Khi khách hàng nhấn "Mua ngay" trên web sẽ tự động mở tab mới dẫn đến link này.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Media */}
        <div className="space-y-6">
          <div className="bg-white  border border-slate-100 p-6 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Phân loại & Đẩy bài</h3>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Danh mục</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200  text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-800"
              >
                <option value="chan-ga">Chân Gà</option>
                <option value="tam-cay">Tăm Cay</option>
                <option value="banh-trang">Bánh Tráng</option>
                <option value="khac">Khác</option>
              </select>
            </div>

            <div className="p-4 bg-orange-50/50  border border-orange-100 flex items-center justify-between">
              <div>
                <span className="block text-sm font-bold text-orange-950">Push nổi bật</span>
                <span className="block text-xs text-orange-700">Đẩy lên trang chủ website</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none  peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after: after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>

          <div className="bg-white  border border-slate-100 p-6 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Hình ảnh & Nguyên liệu</h3>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ảnh sản phẩm</label>
              
              <div className="space-y-3">
                {/* Image Preview */}
                {image && (
                  <div className="relative w-32 h-32  overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImage("")}
                      className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1.5  hover:bg-red-600 transition shadow-sm"
                      title="Xóa ảnh"
                    >
                      <Trash size={12} />
                    </button>
                  </div>
                )}

                {/* File Upload Selector */}
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-orange-300  p-4 bg-slate-50 hover:bg-orange-50/5 transition-all text-slate-500">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    {uploading ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-orange-500">
                        <Loader size={16} className="animate-spin" />
                        <span>Đang tải lên Cloudflare R2...</span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-orange-600">Chọn tệp ảnh từ thiết bị</span>
                    )}
                  </label>
                </div>

                {uploadError && (
                  <p className="text-xs text-red-500 font-semibold">{uploadError}</p>
                )}

                {/* Manual Text URL fallback */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Hoặc nhập URL ảnh trực tiếp</label>
                  <input
                    type="text"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200  text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Ingredients Manager */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Thành phần / Nguyên liệu</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  placeholder="Ví dụ: Ớt hiểm đỏ"
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200  text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-800"
                />
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="px-3 py-2 bg-slate-900 text-white  text-xs font-bold hover:bg-slate-800 transition"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 border border-dashed border-slate-200 ">
                {ingredients.length === 0 ? (
                  <span className="text-[11px] text-slate-400 italic">Chưa thêm nguyên liệu nào</span>
                ) : (
                  ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[11px] font-semibold pl-2.5 pr-1 py-0.5  border border-slate-200"
                    >
                      <span>{ing}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(idx)}
                        className="p-0.5 hover:bg-slate-200 rounded text-slate-400 hover:text-red-500 transition"
                      >
                        <Trash size={10} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
