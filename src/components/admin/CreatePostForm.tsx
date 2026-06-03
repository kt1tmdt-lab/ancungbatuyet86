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
  Loader,
  Sparkles
} from "lucide-react";
import Link from "next/link";

// Pre-defined writing templates for professional snack blog content
const POST_TEMPLATES = [
  {
    id: "recipe",
    name: "🍳 Công thức nấu ăn / Chế biến",
    description: "Hướng dẫn làm các món ăn từ đồ ăn vặt Bà Tuyết, thời gian chuẩn bị, nguyên liệu và quy trình các bước chi tiết.",
    content: `<h2>[Tên món ăn hấp dẫn]</h2>
<p><em>Một mô tả ngắn khoảng 2-3 câu giới thiệu món ăn này ngon như thế nào và tại sao độc giả nên thử làm ngay hôm nay.</em></p>

<div class="bg-orange-50 border-l-4 border-orange-500 p-4 my-6 ">
  <p class="font-bold text-orange-900 my-0">⏱️ Thông tin chuẩn bị:</p>
  <ul class="my-1 text-slate-750 text-sm">
    <li><strong>Thời gian chuẩn bị:</strong> 15 phút</li>
    <li><strong>Thời gian chế biến:</strong> 20 phút</li>
    <li><strong>Khẩu phần:</strong> 2 - 3 người ăn</li>
    <li><strong>Độ khó:</strong> Dễ</li>
  </ul>
</div>

<h3>🛒 Nguyên liệu cần chuẩn bị</h3>
<ul>
  <li>Chân gà rút xương Bà Tuyết: 1 gói (500g)</li>
  <li>Sả: 5 nhánh (thái lát mỏng)</li>
  <li>Ớt chỉ thiên: 3 quả (băm nhỏ)</li>
  <li>Quất (tắc): 5 quả (thái lát bỏ hạt)</li>
  <li>Gia vị: Nước mắm, đường, giấm, muối</li>
</ul>

<h3>👩‍🍳 Quy trình thực hiện chi tiết</h3>
<ol>
  <li><strong>Bước 1 - Sơ chế nguyên liệu:</strong> Rửa sạch chân gà với muối và chanh, luộc sơ qua với sả trong 5 phút rồi vớt ra ngâm nước đá lạnh để chân gà giữ độ giòn sần sật.</li>
  <li><strong>Bước 2 - Pha nước sốt trộn:</strong> Hòa tan 3 thìa nước mắm ngon, 2 thìa đường, 2 thìa giấm và 1 bát nước lọc. Đun sôi hỗn hợp này rồi để thật nguội.</li>
  <li><strong>Bước 3 - Trộn và ngâm:</strong> Cho chân gà vào tô lớn, thêm sả, ớt, quất và đổ nước sốt vào ngập chân gà. Trộn đều và để vào ngăn mát tủ lạnh từ 2-3 tiếng cho ngấm vị.</li>
</ol>

<div class="my-6">
  <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80" alt="Thành phẩm món ăn" class="w-full  shadow-sm" />
</div>

<h3>✨ Mẹo nhỏ từ Bà Tuyết</h3>
<p>Hãy ngâm chân gà vào nước đá lạnh tối thiểu 10 phút sau khi luộc. Đây là bí quyết giúp chân gà rút xương giòn dai chuẩn vị nhà hàng!</p>`
  },
  {
    id: "product_review",
    name: "⭐ Đánh giá / Review món ăn vặt",
    description: "Đánh giá chân thực về bao bì, hương vị thực tế, độ cay nồng, ưu điểm và nhược điểm của sản phẩm.",
    content: `<h2>Review Chi Tiết: [Tên sản phẩm ăn vặt]</h2>
<p><em>Ăn vặt là niềm đam mê bất tận! Hôm nay mình sẽ review chân thực nhất về siêu phẩm đang làm mưa làm gió cộng đồng mạng thời gian qua: [Tên sản phẩm]. Hãy xem có đáng tiền mua không nhé!</em></p>

<h3>📦 Thiết kế bao bì & Quy cách đóng gói</h3>
<p>Sản phẩm được đóng gói cực kỳ chắc chắn trong bao bì túi zip dập kín. Mặt trước in hình ảnh minh họa chân thực, đầy đủ thông tin xuất xứ rõ ràng và chứng nhận an toàn thực phẩm. Trọng lượng tịnh của sản phẩm là [Ví dụ: 150g], rất vừa vặn cho một lần ăn vặt cùng bạn bè.</p>

<h3>🌶️ Cảm nhận hương vị & Độ cay</h3>
<ul>
  <li><strong>Hương vị đặc trưng:</strong> Khi mở túi ra, mùi thơm nồng của sả và ớt lập tức tỏa ra. Khi cắn miếng đầu tiên, bạn sẽ cảm nhận vị ngọt thanh tự nhiên trộn lẫn với gia vị cay cay mặn mặn đậm đà.</li>
  <li><strong>Độ cay:</strong> Ở mức [2/5 - Cay nhẹ / 4/5 - Siêu cay dã man]. Những ai không ăn được cay nhiều vẫn có thể thưởng thức thoải mái.</li>
  <li><strong>Độ giòn:</strong> Miếng ăn vặt [giòn dai, sần sật] rất kích thích vị giác.</li>
</ul>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
  <div class="bg-green-50 border-l-4 border-green-500 p-4 ">
    <p class="font-bold text-green-900 my-0">👍 Ưu điểm nổi bật:</p>
    <ul class="text-xs text-slate-750 my-1">
      <li>Nguyên liệu sạch sẽ, rõ nguồn gốc</li>
      <li>Gia vị thấm đều, chuẩn công thức gia truyền</li>
      <li>Giá cả bình dân phù hợp học sinh sinh viên</li>
    </ul>
  </div>
  <div class="bg-red-50 border-l-4 border-red-500 p-4 ">
    <p class="font-bold text-red-900 my-0">👎 Điểm cần lưu ý:</p>
    <ul class="text-xs text-slate-750 my-1">
      <li>Khá cay, nên chuẩn bị sẵn nước uống kèm</li>
      <li>Nên ăn ngay sau khi mở túi zip để giữ độ ngon tối đa</li>
    </ul>
  </div>
</div>

<h3>🎯 Kết luận & Điểm số đánh giá</h3>
<p>Nhìn chung, đây là món ăn vặt cực kỳ đáng thử, thích hợp cho các buổi cày phim hay ngồi tám chuyện. Mình xin đánh giá điểm số của siêu phẩm này là <strong>9/10</strong>!</p>
<p><a href="/san-pham" class="text-orange-500 font-bold underline">👉 Đặt mua sản phẩm chính hãng trực tiếp tại đây để nhận khuyến mãi!</a></p>`
  },
  {
    id: "promotion",
    name: "🎁 Tin khuyến mãi / Sự kiện ưu đãi",
    description: "Thông báo chương trình tặng quà, giảm giá, combo giá hời theo mốc thời gian áp dụng.",
    content: `<h2>BÙNG NỔ ƯU ĐÃI: [Tên chương trình khuyến mãi]</h2>
<p><strong>Cơ hội vàng cho các tín đồ ăn vặt!</strong> Ăn Cùng Bà Tuyết xin gửi tới quý khách hàng chương trình khuyến mãi lớn nhất năm với hàng ngàn phần quà và ưu đãi giảm giá sập sàn dưới đây.</p>

<div class="bg-amber-500 text-slate-950 font-black text-center p-3  my-6">
  🔥 KHUYẾN MÃI ÁP DỤNG TỪ [Ngày bắt đầu] ĐẾN HẾT NGÀY [Ngày kết thúc] 🔥
</div>

<h3>🎉 Chi tiết các chương trình khuyến mãi cực khủng</h3>
<table class="w-full text-left text-sm border-collapse my-6">
  <thead>
    <tr class="bg-slate-100 font-bold">
      <th class="border p-2">Chương trình</th>
      <th class="border p-2">Nội dung ưu đãi</th>
      <th class="border p-2">Sản phẩm áp dụng</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border p-2"><strong>MUA 2 TẶNG 1</strong></td>
      <td class="border p-2">Mua 2 gói chân gà tặng ngay 1 gói tăm cay</td>
      <td class="border p-2">Chân gà rút xương</td>
    </tr>
    <tr>
      <td class="border p-2"><strong>SIÊU COMBO</strong></td>
      <td class="border p-2">Combo Ăn Sập Tiệm giảm giá trực tiếp 20%</td>
      <td class="border p-2">Toàn bộ combo của shop</td>
    </tr>
    <tr>
      <td class="border p-2"><strong>FREESHIP</strong></td>
      <td class="border p-2">Miễn phí vận chuyển toàn quốc cho đơn hàng từ 199k</td>
      <td class="border p-2">Áp dụng cho mọi đơn hàng</td>
    </tr>
  </tbody>
</table>

<h3>📝 Hướng dẫn cách thức nhận ưu đãi</h3>
<ol>
  <li>Truy cập vào danh sách sản phẩm hoặc liên hệ hotline để đặt hàng.</li>
  <li>Lựa chọn các sản phẩm nằm trong chương trình khuyến mãi nêu trên.</li>
  <li>Hệ thống sẽ tự động trừ tiền giảm giá hoặc nhân viên sẽ xác nhận quà tặng kèm khi gọi điện chốt đơn.</li>
</ol>

<p>Số lượng quà tặng có hạn, chương trình có thể kết thúc sớm hơn dự kiến. Các tín đồ ăn vặt nhanh tay rủ bạn bè đặt mua ngay hôm nay để không bỏ lỡ đại tiệc ưu đãi này nhé!</p>
<p><a href="/san-pham" class="text-orange-500 font-bold underline">🛒 Nhấp vào đây để xem các sản phẩm và mua ngay!</a></p>`
  },
  {
    id: "handbook",
    name: "📚 Cẩm nang / Chia sẻ kinh nghiệm",
    description: "Chia sẻ kiến thức bổ ích về ẩm thực, vệ sinh an toàn thực phẩm, mẹo bảo quản đồ ăn sạch.",
    content: `<h2>Cẩm Nang Ăn Vặt: [Tên bài chia sẻ kiến thức]</h2>
<p><em>Chào các bạn độc giả yêu quý, đồ ăn vặt là một phần không thể thiếu trong cuộc sống bận rộn hiện đại. Tuy nhiên, ăn vặt thế nào cho thông minh, an toàn sức khỏe thì không phải ai cũng biết. Hôm nay hãy cùng Bà Tuyết tìm hiểu vấn đề này nhé!</em></p>

<h3>1. [Nội dung chia sẻ số 1]</h3>
<p>Nhập đoạn văn phân tích chi tiết tại đây. Sử dụng ngôn từ gần gũi, chia sẻ các kinh nghiệm thực tế của bạn hoặc thương hiệu để tạo dựng niềm tin vững chắc đối với độc giả.</p>

<h3>2. [Nội dung chia sẻ số 2]</h3>
<p>Phân tích các luận điểm tiếp theo. Bạn nên chèn các gạch đầu dòng để người đọc dễ theo dõi:</p>
<ul>
  <li><strong>Ý thứ nhất:</strong> Chi tiết phân tích...</li>
  <li><strong>Ý thứ hai:</strong> Chi tiết phân tích...</li>
  <li><strong>Ý thứ ba:</strong> Chi tiết phân tích...</li>
</ul>

<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-6 ">
  <p class="font-bold text-blue-900 my-0">💡 Bạn có biết?</p>
  <p class="text-slate-700 text-xs my-1">Nhập một thông tin thú vị hoặc số liệu thống kê liên quan để bài viết thêm phần chuyên nghiệp và tăng sức thuyết phục.</p>
</div>

<h3>3. [Nội dung chia sẻ số 3]</h3>
<p>Tóm tắt các giải pháp hữu ích, kết luận lại vấn đề và đưa ra lời khuyên dành cho người tiêu dùng thông thái.</p>

<p>Hy vọng bài chia sẻ cẩm nang này sẽ giúp ích cho các bạn trong việc chọn lựa những món ăn vặt an toàn, bổ dưỡng cho cả gia đình. Nếu thấy thông tin bổ ích, đừng ngần ngại chia sẻ cho bạn bè cùng biết nhé!</p>`
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

  const applyTemplate = (tmpl: typeof POST_TEMPLATES[0]) => {
    if (content.trim()) {
      const confirmOverwrite = confirm(
        `Bạn có chắc chắn muốn áp dụng mẫu "${tmpl.name}"? Nội dung hiện tại trong khung soạn thảo sẽ bị ghi đè hoàn toàn.`
      );
      if (!confirmOverwrite) return;
    }
    setContent(tmpl.content);
  };

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
          <div className="bg-white  border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
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
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200  focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-semibold text-slate-900"
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
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200  focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium text-slate-700"
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
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200  focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm text-slate-700"
              />
            </div>

            {/* Quick Content Templates */}
            {!postId && (
              <div className="bg-orange-50/50 border border-orange-100 p-5  space-y-3">
                <div className="flex items-center gap-1.5 text-slate-800">
                  <Sparkles className="text-orange-500" size={16} />
                  <span className="text-xs font-bold text-slate-900">Chọn mẫu soạn nhanh bài viết (Blog Templates):</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {POST_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => applyTemplate(tmpl)}
                      className="text-left p-3.5 bg-white border border-slate-100  hover:border-orange-500 hover:bg-orange-50/10 hover:shadow-sm transition-all select-none group cursor-pointer"
                    >
                      <div className="text-xs font-bold text-slate-900 group-hover:text-orange-650">
                        {tmpl.name}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1.5 leading-relaxed font-semibold">
                        {tmpl.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Rich Editor / Markdown area */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <label className="block text-sm font-bold text-slate-800">Nội dung bài viết (HTML / Text)</label>
                <div className="flex bg-slate-100 p-1 ">
                  <button
                    type="button"
                    onClick={() => setActiveTab("write")}
                    className={`px-3 py-1.5  text-xs font-bold transition ${
                      activeTab === "write" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Viết bài
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`px-3 py-1.5  text-xs font-bold transition ${
                      activeTab === "preview" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <Eye size={12} className="inline mr-1" /> Xem trước
                  </button>
                </div>
              </div>

              {activeTab === "write" ? (
                <div className="space-y-2 border border-slate-200  overflow-hidden focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
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
                      onClick={() => insertFormatting('<img src="https://images.unsplash.com/...?" alt="mô tả ảnh" className="w-full  my-6" />', "")}
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
                <div className="border border-slate-200  p-6 bg-cream min-h-[300px] overflow-y-auto max-h-[500px]">
                  {content ? (
                    <article className="prose prose-orange max-w-none text-slate-800">
                      {coverImageUrl && (
                        <img src={coverImageUrl} alt="Cover Preview" className="w-full h-auto max-h-[300px] object-cover  mb-6 shadow-sm" />
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
          <div className="bg-white  border border-slate-100 p-6 shadow-sm space-y-6">
            <h2 className="text-md font-bold text-slate-900">Thiết lập bài viết</h2>

            {/* Category selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Chuyên mục (Category)</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200  text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200  text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200  text-xs font-semibold text-slate-750 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              {coverImageUrl && (
                <div className="relative aspect-video  overflow-hidden border border-slate-100 mt-2">
                  <img src={coverImageUrl} alt="Cover Thumbnail" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* SEO Details Card */}
          <div className="bg-white  border border-slate-100 p-6 shadow-sm space-y-6">
            <h2 className="text-md font-bold text-slate-900">Tối ưu hóa SEO</h2>

            {/* SEO Title */}
            <div className="space-y-1 bg-slate-50/50 p-2.5  border border-slate-100">
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
            <div className="space-y-1 bg-slate-50/50 p-2.5  border border-slate-100">
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
            <div className="space-y-1 bg-slate-50/50 p-2.5  border border-slate-100">
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
          <div className="bg-white  border border-slate-100 p-6 shadow-sm space-y-3">
            {error && (
              <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 ">
                <AlertCircle className="text-red-600 mt-0.5 shrink-0" size={16} />
                <p className="text-xs text-red-700 font-semibold leading-relaxed">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-2.5 p-3 bg-green-50 border border-green-200 ">
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
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-750 py-2.5  text-xs font-bold transition disabled:opacity-50"
              >
                <Save size={13} />
                <span>Lưu bản nháp</span>
              </button>

              {/* Button 2: Submit for review */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSubmit("PENDING_REVIEW")}
                className="w-full inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2.5  text-xs font-bold transition disabled:opacity-50 shadow-sm shadow-orange-500/10"
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
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5  text-xs font-bold transition disabled:opacity-50"
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
