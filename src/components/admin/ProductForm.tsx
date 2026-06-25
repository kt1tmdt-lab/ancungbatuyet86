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
  specs?: { label: string; value: string }[];
  variants?: { name: string; weight: string; price: string; spiceLevel?: number }[];
  stats?: { label: string; value: string }[];
  processSteps?: { step: number; title: string; description: string }[];
  story?: string;
  status?: string;
  sortOrder?: number;
  shortDescription?: string;
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
  const [status, setStatus] = useState(initialData?.status || "PUBLISHED");
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder || 0);
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || "");
  const [ingredients, setIngredients] = useState<string[]>(initialData?.ingredients || []);
  const [newIngredient, setNewIngredient] = useState("");

  // Specs state
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>(
    initialData?.specs || []
  );
  const [newSpecLabel, setNewSpecLabel] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");

  // Variants state
  const [variants, setVariants] = useState<
    { name: string; weight: string; price: string; spiceLevel?: number }[]
  >(initialData?.variants || []);
  const [newVariantName, setNewVariantName] = useState("");
  const [newVariantWeight, setNewVariantWeight] = useState("");
  const [newVariantPrice, setNewVariantPrice] = useState("");
  const [newVariantSpice, setNewVariantSpice] = useState(0);

  // Process steps state
  const [processSteps, setProcessSteps] = useState<
    { step: number; title: string; description: string }[]
  >(initialData?.processSteps || []);
  const [newStepTitle, setNewStepTitle] = useState("");
  const [newStepDesc, setNewStepDesc] = useState("");

  // Stats state
  const [stats, setStats] = useState<{ label: string; value: string }[]>(
    initialData?.stats || []
  );
  const [newStatLabel, setNewStatLabel] = useState("");
  const [newStatValue, setNewStatValue] = useState("");

  // Story state
  const [story, setStory] = useState(initialData?.story || "");

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      specs,
      variants,
      processSteps,
      stats,
      story,
      status,
      sortOrder,
      shortDescription,
    };

    try {
      const url = initialData?.id ? `/api/products/${initialData.id}` : "/api/products";
      const method = initialData?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
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
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5  text-sm font-bold shadow-md shadow-primary/10 hover:shadow-lg transition-all disabled:opacity-50"
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
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200  text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
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
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200  text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
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
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200  text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mô tả ngắn (SEO & Card)</label>
              <textarea
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Mô tả tóm tắt hiển thị ngoài trang chủ và thẻ SEO..."
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
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
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200  text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
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
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200  text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Khoảng giá</label>
                <input
                  type="text"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  placeholder="Ví dụ: 45.000đ - 139.000đ"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200  text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
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
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200  text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
              />
              <p className="text-[11px] text-slate-400 mt-1">Khi khách hàng nhấn "Mua ngay" trên web sẽ tự động mở tab mới dẫn đến link này.</p>
            </div>
          </div>

          {/* Advanced Details Sections */}
          <div className="bg-white border border-slate-100 p-6 sm:p-8 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Thông số sản phẩm</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newSpecLabel}
                onChange={(e) => setNewSpecLabel(e.target.value)}
                placeholder="Tên thông số (ví dụ: Hạn sử dụng)"
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
              />
              <input
                type="text"
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                placeholder="Giá trị (ví dụ: 6 tháng)"
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
              />
              <button
                type="button"
                onClick={() => {
                  if (newSpecLabel.trim() && newSpecValue.trim()) {
                    setSpecs([...specs, { label: newSpecLabel.trim(), value: newSpecValue.trim() }]);
                    setNewSpecLabel("");
                    setNewSpecValue("");
                  }
                }}
                className="px-4 py-2 bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition"
              >
                Thêm
              </button>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200">
              {specs.length === 0 ? (
                <div className="p-4 text-sm text-slate-400 italic text-center">Chưa có thông số nào</div>
              ) : (
                specs.map((spec, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 transition">
                    <div className="grid grid-cols-[150px_1fr] gap-4 text-sm">
                      <span className="font-bold text-slate-500 uppercase text-xs tracking-wider">{spec.label}</span>
                      <span className="text-slate-800 font-semibold">{spec.value}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSpecs(specs.filter((_, i) => i !== idx))}
                      className="p-1 hover:bg-slate-200 text-slate-400 hover:text-red-500 transition"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-6 sm:p-8 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Phân loại sản phẩm</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newVariantName}
                onChange={(e) => setNewVariantName(e.target.value)}
                placeholder="Tên phân loại (ví dụ: Vị cay truyền thống)"
                className="px-4 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
              />
              <input
                type="text"
                value={newVariantWeight}
                onChange={(e) => setNewVariantWeight(e.target.value)}
                placeholder="Trọng lượng (ví dụ: 52g)"
                className="px-4 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
              />
              <input
                type="text"
                value={newVariantPrice}
                onChange={(e) => setNewVariantPrice(e.target.value)}
                placeholder="Giá (ví dụ: 45.000đ)"
                className="px-4 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
              />
              <div className="flex gap-3">
                <select
                  value={newVariantSpice}
                  onChange={(e) => setNewVariantSpice(Number(e.target.value))}
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
                >
                  <option value={0}>Không cay</option>
                  <option value={1}>Cay nhẹ (1 🔥)</option>
                  <option value={2}>Cay vừa (2 🔥)</option>
                  <option value={3}>Cay mạnh (3 🔥)</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    if (newVariantName.trim() && newVariantPrice.trim()) {
                      setVariants([
                        ...variants,
                        {
                          name: newVariantName.trim(),
                          weight: newVariantWeight.trim(),
                          price: newVariantPrice.trim(),
                          spiceLevel: newVariantSpice,
                        },
                      ]);
                      setNewVariantName("");
                      setNewVariantWeight("");
                      setNewVariantPrice("");
                      setNewVariantSpice(0);
                    }
                  }}
                  className="px-4 py-2 bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition"
                >
                  Thêm
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200">
              {variants.length === 0 ? (
                <div className="p-4 text-sm text-slate-400 italic text-center">Chưa có phân loại nào</div>
              ) : (
                variants.map((v, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 transition">
                    <div className="text-sm">
                      <p className="font-bold text-slate-900">{v.name} {v.weight && `(${v.weight})`}</p>
                      <p className="text-xs text-primary-dark font-semibold mt-0.5">{v.price} {v.spiceLevel ? `| 🔥 x ${v.spiceLevel}` : ""}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVariants(variants.filter((_, i) => i !== idx))}
                      className="p-1 hover:bg-slate-200 text-slate-400 hover:text-red-500 transition"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-6 sm:p-8 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Quy trình sản xuất</h3>
            <div className="grid gap-3">
              <input
                type="text"
                value={newStepTitle}
                onChange={(e) => setNewStepTitle(e.target.value)}
                placeholder="Tên bước (ví dụ: Sơ chế sạch)"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
              />
              <textarea
                rows={2}
                value={newStepDesc}
                onChange={(e) => setNewStepDesc(e.target.value)}
                placeholder="Mô tả quy trình chi tiết của bước này..."
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
              />
              <button
                type="button"
                onClick={() => {
                  if (newStepTitle.trim() && newStepDesc.trim()) {
                    const nextStepNum = processSteps.length + 1;
                    setProcessSteps([
                      ...processSteps,
                      { step: nextStepNum, title: newStepTitle.trim(), description: newStepDesc.trim() },
                    ]);
                    setNewStepTitle("");
                    setNewStepDesc("");
                  }
                }}
                className="px-4 py-2 bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition justify-self-end"
              >
                Thêm bước quy trình
              </button>
            </div>

            <div className="space-y-3">
              {processSteps.length === 0 ? (
                <div className="p-4 border border-slate-200 text-sm text-slate-400 italic text-center bg-white">Chưa thêm bước nào</div>
              ) : (
                processSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 p-4 border border-slate-200 bg-white hover:bg-slate-50 transition relative group">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary text-sm font-black text-white">
                      {step.step}
                    </div>
                    <div className="text-sm flex-1 pr-6">
                      <p className="font-bold text-slate-900">{step.title}</p>
                      <p className="text-slate-500 mt-1 text-xs leading-5">{step.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const filtered = processSteps.filter((_, i) => i !== idx);
                        const reindexed = filtered.map((s, i) => ({ ...s, step: i + 1 }));
                        setProcessSteps(reindexed);
                      }}
                      className="absolute top-4 right-4 p-1 hover:bg-slate-200 text-slate-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-6 sm:p-8 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Chỉ số nổi bật</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newStatLabel}
                onChange={(e) => setNewStatLabel(e.target.value)}
                placeholder="Tên chỉ số (ví dụ: Đơn đã bán)"
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
              />
              <input
                type="text"
                value={newStatValue}
                onChange={(e) => setNewStatValue(e.target.value)}
                placeholder="Giá trị (ví dụ: 2.000.000+)"
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
              />
              <button
                type="button"
                onClick={() => {
                  if (newStatLabel.trim() && newStatValue.trim()) {
                    setStats([...stats, { label: newStatLabel.trim(), value: newStatValue.trim() }]);
                    setNewStatLabel("");
                    setNewStatValue("");
                  }
                }}
                className="px-4 py-2 bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition"
              >
                Thêm
              </button>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200">
              {stats.length === 0 ? (
                <div className="p-4 text-sm text-slate-400 italic text-center">Chưa có chỉ số nào</div>
              ) : (
                stats.map((stat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 transition">
                    <div className="text-sm">
                      <span className="font-bold text-primary-dark text-base mr-3">{stat.value}</span>
                      <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">{stat.label}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStats(stats.filter((_, i) => i !== idx))}
                      className="p-1 hover:bg-slate-200 text-slate-400 hover:text-red-500 transition"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-6 sm:p-8 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Câu chuyện sản phẩm</h3>
            <div>
              <textarea
                rows={4}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Nhập câu chuyện sản phẩm, ý nghĩa hoặc nguồn gốc..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
              />
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
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200  text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
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
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none  peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after: after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Trạng thái hiển thị</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
              >
                <option value="PUBLISHED">Hiển thị (Đang bán)</option>
                <option value="DRAFT">Ẩn (Bản nháp/Ngừng bán)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Thứ tự ưu tiên (Sắp xếp)</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                placeholder="Ví dụ: 1"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
              />
              <p className="text-[11px] text-slate-400 mt-1">Số nhỏ hơn sẽ hiển thị trước (0, 1, 2...)</p>
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
                  <label className="flex-1 cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-primary  p-4 bg-slate-50 hover:bg-orange-50/5 transition-all text-slate-500">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    {uploading ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-primary-dark">
                        <Loader size={16} className="animate-spin" />
                        <span>Đang tải ảnh lên máy chủ...</span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-primary-dark">Chọn tệp ảnh từ thiết bị</span>
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
                    placeholder="https://cdn.example.com/product-image.png"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200  text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
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
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200  text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
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


