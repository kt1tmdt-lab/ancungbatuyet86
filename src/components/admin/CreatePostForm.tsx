"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { 
  AlertCircle, 
  Check, 
  Eye, 
  FileText, 
  Save, 
  Send, 
  ArrowLeft,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Link as LinkIcon,
  List,
  Type,
  Loader
} from "lucide-react";
import Link from "next/link";

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
  
  // Tab control for rich editor
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setTitle(data.title);
        setSlug(data.slug);
        setExcerpt(data.excerpt || "");
        setContent(data.content || "");
        setCoverImageUrl(data.coverImageUrl || "");
        setCategoryId(data.categoryId || "");
        setSeoTitle(data.seoTitle || "");
        setSeoDescription(data.seoDescription || "");
        setSeoKeywords(data.seoKeywords || "");
        
        // Map tags array to string
        if (data.tags) {
          const tagNames = data.tags.map((t: any) => t.tag.name).join(", ");
          setTags(tagNames);
        }
      } else {
        setError("Không thể tải chi tiết bài viết");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải bài viết");
    } finally {
      setFetching(false);
    }
  };

  // Auto-slug generation from Title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!postId) {
      const generatedSlug = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove Vietnamese accents
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "") // Remove spec chars
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-"); // Collapse consecutive hyphens
      setSlug(generatedSlug);
    }
  };

  // Helper formatting insert for Textarea
  const insertFormatting = (before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const replacement = before + selectedText + after;

    setContent(text.substring(0, start) + replacement + text.substring(end));
    
    // Reset focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const handleSubmit = async (submitStatus: "DRAFT" | "PENDING_REVIEW" | "PUBLISHED") => {
    if (!title.trim()) {
      setError("Tiêu đề bài viết không được để trống");
      return;
    }
    if (!slug.trim()) {
      setError("Slug bài viết không được để trống");
      return;
    }
    if (submitStatus === "PENDING_REVIEW" && !content.trim()) {
      setError("Nội dung bài viết không được để trống khi gửi duyệt");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    const payloadBody = {
      title,
      slug,
      excerpt,
      content,
      coverImageUrl,
      categoryId: categoryId || null,
      tags,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
      seoKeywords,
      status: submitStatus
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
        submitStatus === "PUBLISHED" 
          ? "Bài viết đã được xuất bản trực tiếp thành công!" 
          : submitStatus === "PENDING_REVIEW" 
            ? "Bài viết đã được gửi duyệt! Chờ biên tập viên duyệt." 
            : "Đã lưu bài viết nháp thành công!"
      );
      
      setTimeout(() => {
        router.push("/admin/posts");
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi gửi bài viết");
    } finally {
      setLoading(false);
    }
  };

  const isEditorOrAdmin = user?.role === "ADMIN" || user?.role === "EDITOR";

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader className="animate-spin text-orange-500" size={36} />
        <p className="text-sm font-semibold text-slate-400">Đang tải dữ liệu bài viết...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link href="/admin/posts" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition">
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main form (Col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {postId ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
            </h2>

            {/* Title field */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800">Tiêu đề bài viết</label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Nhập tiêu đề hấp dẫn..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-semibold text-slate-900"
                required
              />
            </div>

            {/* Slug field */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800">Slug (Đường dẫn tĩnh)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="duong-dan-bai-viet"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium text-slate-700"
                required
              />
            </div>

            {/* Excerpt field */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800">Tóm tắt ngắn (Excerpt)</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Tóm tắt ngắn gọn nội dung bài viết để hiển thị trên trang danh sách tin tức..."
                rows={3}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm text-slate-700"
              />
            </div>

            {/* Rich Editor / Markdown area */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <label className="block text-sm font-bold text-slate-800">Nội dung bài viết (HTML / Text)</label>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setActiveTab("write")}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
                      activeTab === "write" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Viết bài
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
                      activeTab === "preview" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <Eye size={12} className="inline mr-1" /> Xem trước
                  </button>
                </div>
              </div>

              {activeTab === "write" ? (
                <div className="space-y-2 border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
                  {/* Text editor formatting toolbar */}
                  <div className="flex flex-wrap gap-1 bg-slate-50 p-2 border-b border-slate-200">
                    <button
                      type="button"
                      onClick={() => insertFormatting("<strong>", "</strong>")}
                      className="p-1.5 text-slate-600 hover:bg-slate-200 rounded transition"
                      title="Chữ đậm"
                    >
                      <Bold size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("<em>", "</em>")}
                      className="p-1.5 text-slate-600 hover:bg-slate-200 rounded transition"
                      title="Chữ nghiêng"
                    >
                      <Italic size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("<h2>", "</h2>")}
                      className="p-1.5 text-slate-600 hover:bg-slate-200 rounded transition"
                      title="Tiêu đề 2"
                    >
                      <Heading2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("<h3>", "</h3>")}
                      className="p-1.5 text-slate-600 hover:bg-slate-200 rounded transition"
                      title="Tiêu đề 3"
                    >
                      <Heading3 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("<p>", "</p>")}
                      className="p-1.5 text-slate-600 hover:bg-slate-200 rounded transition"
                      title="Đoạn văn"
                    >
                      <Type size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('<img src="https://images.unsplash.com/...?" alt="mô tả ảnh" className="w-full rounded-2xl my-6" />', "")}
                      className="p-1.5 text-slate-600 hover:bg-slate-200 rounded transition"
                      title="Chèn ảnh bìa bài viết"
                    >
                      <ImageIcon size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('<a href="https://" class="text-orange-500 font-semibold underline hover:text-orange-600">', "</a>")}
                      className="p-1.5 text-slate-600 hover:bg-slate-200 rounded transition"
                      title="Chèn liên kết"
                    >
                      <LinkIcon size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("<ul>\n  <li>Mục 1</li>\n  <li>Mục 2</li>\n</ul>", "")}
                      className="p-1.5 text-slate-600 hover:bg-slate-200 rounded transition"
                      title="Danh sách"
                    >
                      <List size={15} />
                    </button>
                  </div>

                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Nhập nội dung HTML hoặc Text tại đây..."
                    rows={12}
                    className="w-full px-4 py-3 bg-white border-0 focus:outline-none text-sm leading-relaxed text-slate-800"
                  />
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl p-6 bg-cream min-h-[300px] overflow-y-auto max-h-[500px]">
                  {content ? (
                    <article className="prose prose-orange max-w-none text-slate-800">
                      {coverImageUrl && (
                        <img src={coverImageUrl} alt="Cover Preview" className="w-full h-auto max-h-[300px] object-cover rounded-2xl mb-6 shadow-sm" />
                      )}
                      <div dangerouslySetInnerHTML={{ __html: content }} />
                    </article>
                  ) : (
                    <p className="text-xs italic text-slate-400 text-center py-20">Không có nội dung để hiển thị xem trước.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar settings (Col-span 1) */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
            <h2 className="text-md font-bold text-slate-900">Thiết lập bài viết</h2>

            {/* Category selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Chuyên mục (Category)</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                <option value="">Chọn chuyên mục...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Tags selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Tags (Thẻ từ khóa)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Ví dụ: nhà máy, ăn vặt, chân gà"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              <p className="text-[10px] text-slate-400">Ngăn cách nhau bằng dấu phẩy (,)</p>
            </div>

            {/* Cover Image URL */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Đường dẫn ảnh bìa (Cloudflare CDN / URL)</label>
              <input
                type="url"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-750 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              {coverImageUrl && (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-100 mt-2">
                  <img src={coverImageUrl} alt="Cover Thumbnail" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* SEO Details Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
            <h2 className="text-md font-bold text-slate-900">Tối ưu hóa SEO</h2>

            {/* SEO Title */}
            <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
              <label className="block text-[11px] font-bold text-slate-700">SEO Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Nếu trống sẽ dùng Tiêu đề bài viết"
                className="w-full bg-white border border-slate-200 px-2 py-1 rounded text-xs text-slate-750 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* SEO Description */}
            <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
              <label className="block text-[11px] font-bold text-slate-700">SEO Meta Description</label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Nếu trống sẽ dùng Tóm tắt ngắn"
                rows={2}
                className="w-full bg-white border border-slate-200 px-2 py-1 rounded text-xs text-slate-750 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* SEO Keywords */}
            <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
              <label className="block text-[11px] font-bold text-slate-700">SEO Keywords</label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="từ khóa 1, từ khóa 2..."
                className="w-full bg-white border border-slate-200 px-2 py-1 rounded text-xs text-slate-750 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Action buttons box */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-3">
            {error && (
              <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="text-red-600 mt-0.5 shrink-0" size={16} />
                <p className="text-xs text-red-700 font-semibold leading-relaxed">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-2.5 p-3 bg-green-50 border border-green-200 rounded-xl">
                <Check className="text-green-600 mt-0.5 shrink-0" size={16} />
                <p className="text-xs text-green-700 font-semibold leading-relaxed">{success}</p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {/* Button 1: Save as draft */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSubmit("DRAFT")}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-750 py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-50"
              >
                <Save size={13} />
                <span>Lưu bản nháp</span>
              </button>

              {/* Button 2: Submit for review */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSubmit("PENDING_REVIEW")}
                className="w-full inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-50 shadow-sm shadow-orange-500/10"
              >
                <Send size={13} />
                <span>Gửi xét duyệt</span>
              </button>

              {/* Button 3: Publish directly (Admin/Editor only) */}
              {isEditorOrAdmin && (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSubmit("PUBLISHED")}
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-50"
                >
                  <Check size={13} />
                  <span>Xuất bản trực tiếp</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
