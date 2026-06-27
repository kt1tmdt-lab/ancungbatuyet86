"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, type PostFormValues } from "@/lib/validations/post";
import { RichTextEditor } from "./RichTextEditor";
import { 
  AlertCircle, Check, Save, Send, ArrowLeft, Loader, Sparkles, Upload, ImagePlus
} from "lucide-react";
import Link from "next/link";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { SeoScorePanel } from "@/components/admin/SeoScorePanel";
import { normalizeContentAssetUrls } from "@/lib/content-assets";
import { UploadProgressCircle } from "@/components/admin/UploadProgressCircle";
import { uploadAdminImage } from "@/lib/admin-upload-client";

const POST_TEMPLATES = [
  {
    id: "recipe",
    name: "🍳 Công thức nấu ăn",
    description: "Hướng dẫn làm các món ăn từ đồ ăn vặt Bà Tuyết.",
    content: `<h2>[Tên món ăn hấp dẫn]</h2><p><em>Một mô tả ngắn...</em></p><h3>🛒 Nguyên liệu</h3><ul><li>Nguyên liệu 1</li></ul><h3>👩‍🍳 Quy trình</h3><ol><li>Bước 1</li></ol>`
  },
  {
    id: "review",
    name: "⭐ Đánh giá món ăn vặt",
    description: "Đánh giá chân thực về bao bì, hương vị.",
    content: `<h2>Review Chi Tiết: [Tên sản phẩm]</h2><p><em>Mô tả...</em></p><h3>🌶️ Cảm nhận hương vị</h3><ul><li>Ngon</li></ul>`
  },
  {
    id: "promo",
    name: "🎁 Tin khuyến mãi",
    description: "Thông báo chương trình tặng quà, giảm giá.",
    content: `<h2>BÙNG NỔ ƯU ĐÃI: [Tên chương trình]</h2><p><strong>Cơ hội vàng!</strong></p>`
  }
];

interface Category {
  id: string;
  name: string;
}

export function CreatePostForm({ postId }: { postId?: string }) {
  const router = useRouter();
  const { token, user } = useAuth();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [coverUploading, setCoverUploading] = useState(false);
  const [coverUploadProgress, setCoverUploadProgress] = useState(0);
  const [coverUploadError, setCoverUploadError] = useState("");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImageUrl: "",
      categoryId: "",
      tags: "",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: ""
    }
  });

  const formValues = watch();

  useEffect(() => {
    fetchCategories();
    if (postId) {
      fetchPostDetails();
    }
  }, [postId]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Failed to fetch categories");
    }
  };

  const fetchPostDetails = async () => {
    setFetching(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        reset({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || "",
          content: normalizeContentAssetUrls(data.content),
          coverImageUrl: data.coverImageUrl || "",
          categoryId: data.categoryId || "",
          seoTitle: data.seoTitle || "",
          seoDescription: data.seoDescription || "",
          seoKeywords: data.seoKeywords || "",
          tags: data.tags ? data.tags.map((t: any) => t.tag.name).join(", ") : ""
        });
      } else {
        setError("Không thể tải chi tiết bài viết");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải bài viết");
    } finally {
      setFetching(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("title", val, { shouldValidate: true });
    
    if (!postId) {
      const generatedSlug = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  };

  const applyTemplate = (tmpl: typeof POST_TEMPLATES[0]) => {
    if (formValues.content?.trim()) {
      const confirmOverwrite = confirm(`Bạn có chắc muốn áp dụng mẫu "${tmpl.name}"?`);
      if (!confirmOverwrite) return;
    }
    setValue("content", tmpl.content, { shouldValidate: true });
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setCoverUploading(true);
    setCoverUploadProgress(0);
    setCoverUploadError("");

    try {
      const data = await uploadAdminImage({
        file,
        token,
        onProgress: setCoverUploadProgress,
      });
      if (data.url) {
        setValue("coverImageUrl", data.url, { shouldValidate: true });
      }
    } catch (err) {
      setCoverUploadError(err instanceof Error ? err.message : "Không thể kết nối server upload");
    } finally {
      setCoverUploading(false);
      setCoverUploadProgress(0);
      e.target.value = "";
    }
  };

  const onSubmitForm = async (data: PostFormValues, status: string) => {
    setError("");
    setSuccess("");
    setLoading(true);

    const payloadBody = {
      ...data,
      content: normalizeContentAssetUrls(data.content),
      status,
    };

    try {
      const url = postId ? `/api/posts/${postId}` : "/api/posts";
      const method = postId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payloadBody),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gặp lỗi khi lưu bài viết");
      }

      setSuccess(
        status === "PUBLISHED" ? "Bài viết đã được xuất bản!" 
          : status === "PENDING_REVIEW" ? "Đã gửi duyệt!" 
          : "Đã lưu bản nháp!"
      );
      
      setTimeout(() => router.push("/admin/posts"), 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const isEditorOrAdmin = user?.role === "ADMIN" || user?.role === "EDITOR";

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader className="animate-spin text-primary-dark" size={36} />
        <p className="text-sm font-semibold text-slate-400">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/posts" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition">
        <ArrowLeft size={16} /> Quay lại
      </Link>

      <form className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {postId ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
            </h2>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800">Tiêu đề <span className="text-red-500">*</span></label>
              <input
                {...register("title")}
                onChange={handleTitleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800">Slug <span className="text-red-500">*</span></label>
              <input
                {...register("slug")}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              />
              {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800">Tóm tắt</label>
              <textarea
                {...register("excerpt")}
                rows={3}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              />
              {errors.excerpt && <p className="text-red-500 text-xs mt-1">{errors.excerpt.message}</p>}
            </div>

            {!postId && (
              <div className="bg-orange-50/50 border border-orange-100 p-5 space-y-3">
                <div className="flex items-center gap-1.5"><Sparkles className="text-primary" size={16} /><span className="text-xs font-bold text-slate-900">Mẫu bài viết:</span></div>
                <div className="grid sm:grid-cols-3 gap-3">
                  {POST_TEMPLATES.map((tmpl) => (
                    <button key={tmpl.id} type="button" onClick={() => applyTemplate(tmpl)} className="text-left p-3 border border-slate-200 bg-white hover:border-primary">
                      <div className="text-xs font-bold">{tmpl.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800">Nội dung</label>
              <RichTextEditor 
                value={normalizeContentAssetUrls(formValues.content)} 
                onChange={(html) => setValue("content", normalizeContentAssetUrls(html), { shouldValidate: true })}
              />
              {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-100 p-6 shadow-sm space-y-6">
            <h2 className="text-md font-bold text-slate-900">Thiết lập</h2>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Chuyên mục</label>
              <select {...register("categoryId")} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-primary/20">
                <option value="">Chọn chuyên mục...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Tags</label>
              <input {...register("tags")} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-primary/20" />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Ảnh bìa</label>
              <input {...register("coverImageUrl")} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs mb-2" />
              <div className="flex gap-2">
                <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-white text-[11px] font-bold cursor-pointer hover:bg-primary-dark">
                  {coverUploading ? <UploadProgressCircle progress={coverUploadProgress} size={28} /> : <Upload size={13} />}
                  {coverUploading ? "Đang tải..." : "Tải lên"}
                  <input type="file" accept="image/*" onChange={handleCoverUpload} disabled={coverUploading} className="hidden" />
                </label>
                <button type="button" onClick={() => setMediaPickerOpen(true)} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200">
                  <ImagePlus size={13} /> Thư viện
                </button>
              </div>
              {formValues.coverImageUrl && (
                <div className="mt-2 relative bg-slate-50 border border-slate-100 aspect-video flex items-center justify-center overflow-hidden">
                  <img
                    src={formValues.coverImageUrl}
                    className="w-full h-full object-cover"
                    alt="Cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      // Find or create a sibling element to show the error placeholder
                      const p = e.currentTarget.parentElement?.querySelector('.img-error-placeholder');
                      if (p) {
                        (p as HTMLElement).style.display = 'flex';
                      }
                    }}
                    onLoad={(e) => {
                      e.currentTarget.style.display = 'block';
                      const p = e.currentTarget.parentElement?.querySelector('.img-error-placeholder');
                      if (p) {
                        (p as HTMLElement).style.display = 'none';
                      }
                    }}
                  />
                  <div className="img-error-placeholder hidden absolute inset-0 flex-col items-center justify-center p-4 text-center bg-slate-50 text-slate-400">
                    <AlertCircle size={24} className="text-slate-300 mb-1" />
                    <span className="text-[10px] font-semibold">Không tải được hình ảnh (Lỗi kết nối)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-6 shadow-sm space-y-4">
            <h2 className="text-md font-bold text-slate-900">SEO</h2>
            <div>
              <label className="block text-[11px] font-bold">SEO Title</label>
              <input {...register("seoTitle")} className="w-full border border-slate-200 px-2 py-1 mt-1 text-xs" />
            </div>
            <div>
              <label className="block text-[11px] font-bold">SEO Meta Description</label>
              <textarea {...register("seoDescription")} rows={2} className="w-full border border-slate-200 px-2 py-1 mt-1 text-xs" />
            </div>
            <div>
              <label className="block text-[11px] font-bold">SEO Keywords</label>
              <input {...register("seoKeywords")} className="w-full border border-slate-200 px-2 py-1 mt-1 text-xs" />
            </div>
          </div>

          <SeoScorePanel
            title={formValues.title || ""}
            slug={formValues.slug || ""}
            excerpt={formValues.excerpt || ""}
            coverImageUrl={formValues.coverImageUrl || ""}
            seoTitle={formValues.seoTitle || ""}
            seoDescription={formValues.seoDescription || ""}
          />

          <div className="bg-white border border-slate-100 p-6 shadow-sm space-y-3">
            {error && <div className="p-3 bg-red-50 text-xs text-red-700 flex gap-2"><AlertCircle size={16} />{error}</div>}
            {success && <div className="p-3 bg-green-50 text-xs text-green-700 flex gap-2"><Check size={16} />{success}</div>}

            <div className="flex flex-col gap-2">
              <button type="button" onClick={handleSubmit((data) => onSubmitForm(data, "DRAFT"))} disabled={loading} className="w-full bg-slate-100 py-2.5 text-xs font-bold flex justify-center gap-2">
                <Save size={13} /> Lưu bản nháp
              </button>
              <button type="button" onClick={handleSubmit((data) => onSubmitForm(data, "PENDING_REVIEW"))} disabled={loading} className="w-full bg-primary text-white py-2.5 text-xs font-bold flex justify-center gap-2">
                <Send size={13} /> Gửi xét duyệt
              </button>
              {isEditorOrAdmin && (
                <button type="button" onClick={handleSubmit((data) => onSubmitForm(data, "PUBLISHED"))} disabled={loading} className="w-full bg-slate-900 text-white py-2.5 text-xs font-bold flex justify-center gap-2">
                  <Check size={13} /> Xuất bản trực tiếp
                </button>
              )}
            </div>
          </div>
        </div>
      </form>

      <MediaPickerModal open={mediaPickerOpen} onClose={() => setMediaPickerOpen(false)} onSelect={(url) => { setValue("coverImageUrl", url, { shouldValidate: true }); setMediaPickerOpen(false); }} />
    </div>
  );
}
