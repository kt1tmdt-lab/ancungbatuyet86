"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { normalizePageSlug } from "@/lib/pages";
import {
  Loader,
  AlertCircle,
  Check,
  Save,
  ArrowLeft,
  Plus,
  Trash,
  ArrowUp,
  ArrowDown,
  Eye,
  Settings,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Type,
  LayoutGrid,
  Columns,
  ShoppingBag,
  Upload,
  Globe,
  Monitor,
  Tablet,
  Smartphone
} from "lucide-react";
import Link from "next/link";
import { UploadProgressCircle } from "@/components/admin/UploadProgressCircle";
import { uploadAdminImage } from "@/lib/admin-upload-client";

// Define block interfaces
interface Block {
  id: string;
  type: "hero" | "text" | "features" | "split" | "products";
  // Builder blocks carry different schemas depending on their type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  categoryLabel: string;
}

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

// Pre-defined icons for features
const FEATURE_ICONS = [
  { name: "Truck", label: "Giao hàng hỏa tốc" },
  { name: "ShieldCheck", label: "Đảm bảo an toàn" },
  { name: "Award", label: "Đặc sản chất lượng" },
  { name: "Star", label: "Đánh giá 5 sao" },
  { name: "Heart", label: "Công thức truyền thống" },
  { name: "Clock", label: "Chế biến nhanh chóng" },
  { name: "DollarSign", label: "Giá cả hợp lý" },
  { name: "Check", label: "Đạt chuẩn Vệ sinh" }
];

export function PageForm({ pageId }: { pageId?: string }) {
  const router = useRouter();
  const { token } = useAuth();

  // Loaders & Errors
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(Boolean(pageId));
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Page Basic Meta Data
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  
  // Page Blocks List
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(null);

  // System Products (for product block selector)
  const [productsList, setProductsList] = useState<Product[]>([]);

  // Preview Drawer Modal
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [uploadingBlock, setUploadingBlock] = useState<{
    blockId: string;
    fieldName: string;
    progress: number;
  } | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProductsList(data);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const fetchPageDetails = useCallback(async () => {
    if (!pageId || !token) return;

    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setTitle(data.title);
        setSlug(data.slug);
        setStatus(data.status);
        setBlocks(data.content || []);
        
        // Expand first block if available
        if (data.content && data.content.length > 0) {
          setExpandedBlockId(data.content[0].id);
        }
      } else {
        setError("Không thể tải chi tiết trang");
      }
    } catch {
      setError("Đã xảy ra lỗi khi tải chi tiết trang");
    } finally {
      setFetching(false);
    }
  }, [pageId, token]);

  // Fetch supporting data and page details on edit mode
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchProducts();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchProducts]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchPageDetails();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchPageDetails]);

  // Generate slug dynamically from Title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!pageId) {
      setSlug(normalizePageSlug(val));
    }
  };

  // Add a new block
  const addBlock = (type: "hero" | "text" | "features" | "split" | "products") => {
    const id = `${type}-${Date.now()}`;
    let data = {};

    switch (type) {
      case "hero":
        data = {
          title: "Đại Tiệc Ăn Vặt Bà Tuyết",
          subtitle: "Đậm đà hương vị truyền thống, ăn là ghiền!",
          backgroundImage: "/hero-bg-default.jpg",
          ctaText: "Khám Phá Ngay",
          ctaLink: "/san-pham"
        };
        break;
      case "text":
        data = {
          content: "<h2>Cam kết chất lượng từ Bà Tuyết</h2><p>Chúng tôi luôn nỗ lực mang lại những sản phẩm chất lượng nhất, sạch sẽ nhất đến tay khách hàng thân yêu...</p>",
          backgroundColor: "cream"
        };
        break;
      case "features":
        data = {
          title: "Vì sao lựa chọn Ăn Cùng Bà Tuyết?",
          items: [
            { icon: "Truck", title: "Giao Hàng Nhanh", description: "Ship hoả tốc nội thành siêu tốc" },
            { icon: "ShieldCheck", title: "An Toàn Vệ Sinh", description: "Đạt chuẩn VSATTP ISO 22000" },
            { icon: "Award", title: "Độc Quyền Bà Tuyết", description: "Công thức cay nồng chuẩn vị" }
          ]
        };
        break;
      case "split":
        data = {
          title: "Hành trình sản xuất sạch sẽ",
          description: "Chân gà rút xương được tuyển chọn kỹ càng từ nông trại đạt chuẩn, trải qua quy trình sơ chế tiệt trùng khép kín và chế biến với nước sốt độc quyền làm nên thương hiệu.",
          imageUrl: "/uploads/process-preview.jpg",
          imagePosition: "right",
          ctaText: "Xem quy trình chi tiết",
          ctaLink: "/quy-trinh"
        };
        break;
      case "products":
        data = {
          title: "Món ngon phải thử ngay!",
          subtitle: "Sản phẩm bán chạy nhất tuần qua trên toàn hệ thống",
          productIds: []
        };
        break;
    }

    const newBlock: Block = { id, type, data };
    setBlocks([...blocks, newBlock]);
    setExpandedBlockId(id);
  };

  // Reordering blocks
  const moveBlock = (index: number, direction: "up" | "down") => {
    const newBlocks = [...blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    setBlocks(newBlocks);
  };

  // Delete a block
  const deleteBlock = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa khối này không?")) {
      setBlocks(blocks.filter((b) => b.id !== id));
      if (expandedBlockId === id) setExpandedBlockId(null);
    }
  };

  // Update block data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateBlockData = (id: string, updatedData: any) => {
    setBlocks(
      blocks.map((b) => (b.id === id ? { ...b, data: { ...b.data, ...updatedData } } : b))
    );
  };

  // Image Upload handler for block field
  const handleBlockImageUpload = async (blockId: string, fieldName: string, file: File) => {
    setUploadingBlock({ blockId, fieldName, progress: 0 });

    try {
      const data = await uploadAdminImage({
        file,
        token,
        onProgress: (progress) => setUploadingBlock({ blockId, fieldName, progress }),
      });
      if (data.url) {
        const targetBlock = blocks.find(b => b.id === blockId);
        if (targetBlock) {
          updateBlockData(blockId, { [fieldName]: data.url });
        }
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Lỗi kết nối khi tải ảnh");
    } finally {
      setUploadingBlock(null);
    }
  };

  // Submit Page
  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Tiêu đề trang không được để trống");
      return;
    }
    if (!slug.trim()) {
      setError("Slug trang không được để trống");
      return;
    }
    
    setError("");
    setSuccess("");
    setLoading(true);

    const payload = {
      title,
      slug,
      status,
      content: blocks
    };

    try {
      const url = pageId ? `/api/pages/${pageId}` : "/api/pages";
      const method = pageId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(pageId ? "Cập nhật trang thành công!" : "Tạo trang mới thành công!");
        setTimeout(() => {
          router.push("/admin/pages");
        }, 1200);
      } else {
        setError(data.error || "Lỗi khi lưu trang");
      }
    } catch {
      setError("Không thể lưu trang, vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader className="animate-spin text-orange-500" size={36} />
        <p className="text-sm font-semibold text-slate-400">Đang tải dữ liệu trang...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/admin/pages"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition self-start"
        >
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2  text-xs font-bold transition-all shadow-sm"
          >
            <Eye size={14} />
            <span>Xem trước trực tiếp</span>
          </button>
          
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5  text-xs font-bold transition-all disabled:opacity-50 shadow-md shadow-orange-500/10"
          >
            {loading ? <Loader className="animate-spin" size={14} /> : <Save size={14} />}
            <span>Lưu thiết kế</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-4 bg-red-50 border border-red-200 ">
          <AlertCircle className="text-red-600 mt-0.5 shrink-0" size={18} />
          <p className="text-sm text-red-700 font-semibold leading-relaxed">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2.5 p-4 bg-green-50 border border-green-200 ">
          <Check className="text-green-600 mt-0.5 shrink-0" size={18} />
          <p className="text-sm text-green-700 font-semibold leading-relaxed">{success}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Side: Blocks Editor (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white  border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Cấu trúc các khối nội dung</h2>
                <p className="text-xs text-slate-500 mt-0.5">Xây dựng trang hạ cánh (landing page) bằng các thành phần giao diện kéo thả trực quan.</p>
              </div>
            </div>

            {/* Block List */}
            {blocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-200  bg-slate-50/50 p-6 text-center">
                <LayoutGrid className="text-slate-350 mb-3" size={36} />
                <h3 className="text-sm font-bold text-slate-800">Trang chưa có khối nào</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[280px]">Hãy nhấn chọn các khối giao diện ở bảng dưới đây để bắt đầu thiết kế.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {blocks.map((block, index) => {
                  const isExpanded = expandedBlockId === block.id;
                  return (
                    <div
                      key={block.id}
                      className={`border  overflow-hidden transition-all ${
                        isExpanded ? "border-orange-200 shadow-sm shadow-orange-500/5 bg-white" : "border-slate-200 bg-slate-50/20"
                      }`}
                    >
                      {/* Block Accordion Header */}
                      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 select-none">
                        <div
                          className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                          onClick={() => setExpandedBlockId(isExpanded ? null : block.id)}
                        >
                          <div className={`p-1.5  ${
                            block.type === "hero" ? "bg-purple-50 text-purple-600" :
                            block.type === "text" ? "bg-blue-50 text-blue-600" :
                            block.type === "features" ? "bg-teal-50 text-teal-600" :
                            block.type === "split" ? "bg-amber-50 text-amber-600" :
                            "bg-orange-50 text-orange-600"
                          }`}>
                            {block.type === "hero" && <ImageIcon size={16} />}
                            {block.type === "text" && <Type size={16} />}
                            {block.type === "features" && <LayoutGrid size={16} />}
                            {block.type === "split" && <Columns size={16} />}
                            {block.type === "products" && <ShoppingBag size={16} />}
                          </div>
                          
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-slate-800 truncate capitalize">
                              Khối {block.type === "hero" ? "Hero Banner" :
                                     block.type === "text" ? "Văn bản chữ" :
                                     block.type === "features" ? "Lưới tính năng" :
                                     block.type === "split" ? "Ảnh & Chữ song song" :
                                     "Sản phẩm nổi bật"}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate">
                              {block.type === "hero" && (block.data.title || "Chưa nhập tiêu đề")}
                              {block.type === "text" && "Biên tập đoạn HTML/Text"}
                              {block.type === "features" && (block.data.title || "Lưới đặc trưng")}
                              {block.type === "split" && (block.data.title || "Khối 2 cột")}
                              {block.type === "products" && `${block.data.productIds?.length || 0} sản phẩm đã chọn`}
                            </span>
                          </div>
                        </div>

                        {/* Reordering & Deleting buttons */}
                        <div className="flex items-center gap-1.5 shrink-0 ml-4">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => moveBlock(index, "up")}
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100  transition disabled:opacity-30"
                            title="Di chuyển lên"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            disabled={index === blocks.length - 1}
                            onClick={() => moveBlock(index, "down")}
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100  transition disabled:opacity-30"
                            title="Di chuyển xuống"
                          >
                            <ArrowDown size={14} />
                          </button>
                          <div className="w-px h-4 bg-slate-200 mx-1" />
                          <button
                            type="button"
                            onClick={() => deleteBlock(block.id)}
                            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50  transition"
                            title="Xóa khối"
                          >
                            <Trash size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setExpandedBlockId(isExpanded ? null : block.id)}
                            className="p-1 text-slate-400 hover:text-slate-700  transition ml-1"
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Block Form Content */}
                      {isExpanded && (
                        <div className="p-5 border-t border-slate-100 bg-white space-y-4 animate-slide-down">
                          
                          {/* 1. HERO BLOCK EDIT */}
                          {block.type === "hero" && (
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div className="space-y-1">
                                  <label className="block text-xs font-bold text-slate-700">Tiêu đề lớn</label>
                                  <input
                                    type="text"
                                    value={block.data.title}
                                    onChange={(e) => updateBlockData(block.id, { title: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200  text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-xs font-bold text-slate-700">Phụ đề</label>
                                  <textarea
                                    value={block.data.subtitle}
                                    onChange={(e) => updateBlockData(block.id, { subtitle: e.target.value })}
                                    rows={2}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200  text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-700">Nút kêu gọi (CTA)</label>
                                    <input
                                      type="text"
                                      value={block.data.ctaText}
                                      onChange={(e) => updateBlockData(block.id, { ctaText: e.target.value })}
                                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200  text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-700">Đường dẫn CTA</label>
                                    <input
                                      type="text"
                                      value={block.data.ctaLink}
                                      onChange={(e) => updateBlockData(block.id, { ctaLink: e.target.value })}
                                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200  text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div className="space-y-1">
                                  <label className="block text-xs font-bold text-slate-700">Ảnh nền (Cloudflare URL)</label>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={block.data.backgroundImage}
                                      onChange={(e) => updateBlockData(block.id, { backgroundImage: e.target.value })}
                                      placeholder="https://..."
                                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200  text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    />
                                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2  flex items-center justify-center shrink-0 transition text-xs font-bold border border-slate-250">
                                      {uploadingBlock?.blockId === block.id && uploadingBlock.fieldName === "backgroundImage" ? (
                                        <UploadProgressCircle progress={uploadingBlock.progress} size={28} />
                                      ) : (
                                        <Upload size={14} className="mr-1" />
                                      )}
                                      {uploadingBlock?.blockId === block.id && uploadingBlock.fieldName === "backgroundImage" ? "Đang tải" : "Tải lên"}
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        disabled={uploadingBlock !== null}
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) handleBlockImageUpload(block.id, "backgroundImage", file);
                                          e.target.value = "";
                                        }}
                                      />
                                    </label>
                                  </div>
                                </div>
                                {block.data.backgroundImage && (
                                  <div className="relative aspect-video  overflow-hidden border border-slate-200 bg-slate-50">
                                    <img src={block.data.backgroundImage} alt="Background Preview" className="w-full h-full object-cover" />
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* 2. TEXT BLOCK EDIT */}
                          {block.type === "text" && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold text-slate-700">Soạn thảo văn bản (HTML/Văn bản thường)</label>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-semibold text-slate-400">Nền:</span>
                                  <select
                                    value={block.data.backgroundColor || "cream"}
                                    onChange={(e) => updateBlockData(block.id, { backgroundColor: e.target.value })}
                                    className="px-2 py-1 bg-slate-50 border border-slate-200  text-xs font-bold text-slate-700"
                                  >
                                    <option value="cream">Vàng kem dịu (Mặc định)</option>
                                    <option value="white">Trắng tinh tế</option>
                                    <option value="slate-900">Xám tối sang trọng</option>
                                  </select>
                                </div>
                              </div>
                              <textarea
                                value={block.data.content}
                                onChange={(e) => updateBlockData(block.id, { content: e.target.value })}
                                placeholder="<h3>Tiêu đề đoạn</h3><p>Nội dung chi tiết...</p>"
                                rows={8}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200  text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-orange-500 leading-relaxed"
                              />
                              <p className="text-[10px] text-slate-400 italic">Mách nhỏ: Bạn có thể nhập mã HTML thông thường như &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt; để định dạng đẹp đẽ.</p>
                            </div>
                          )}

                          {/* 3. FEATURES BLOCK EDIT */}
                          {block.type === "features" && (
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <label className="block text-xs font-bold text-slate-700">Tiêu đề tiêu điểm</label>
                                <input
                                  type="text"
                                  value={block.data.title}
                                  onChange={(e) => updateBlockData(block.id, { title: e.target.value })}
                                  placeholder="Vì sao chọn chúng tôi?"
                                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200  text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                              </div>

                              <div className="space-y-3">
                                <label className="block text-xs font-bold text-slate-700">Danh sách tính năng</label>
                                <div className="space-y-2">
                                  {(block.data.items || []).map((item: FeatureItem, fIndex: number) => (
                                    <div key={fIndex} className="flex gap-2 items-start border border-slate-100 p-3  bg-slate-50/50">
                                      <div className="grid grid-cols-1 gap-1 shrink-0 w-24">
                                        <span className="text-[9px] font-bold text-slate-500">Biểu tượng</span>
                                        <select
                                          value={item.icon}
                                          onChange={(e) => {
                                            const newItems = [...block.data.items];
                                            newItems[fIndex] = { ...newItems[fIndex], icon: e.target.value };
                                            updateBlockData(block.id, { items: newItems });
                                          }}
                                          className="px-2 py-1 bg-white border border-slate-200  text-[10px] font-semibold text-slate-700"
                                        >
                                          {FEATURE_ICONS.map((i) => (
                                            <option key={i.name} value={i.name}>{i.label}</option>
                                          ))}
                                        </select>
                                      </div>
                                      
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1">
                                        <div className="space-y-1">
                                          <input
                                            type="text"
                                            value={item.title}
                                            placeholder="Tiêu đề tính năng"
                                            onChange={(e) => {
                                              const newItems = [...block.data.items];
                                              newItems[fIndex] = { ...newItems[fIndex], title: e.target.value };
                                              updateBlockData(block.id, { items: newItems });
                                            }}
                                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200  text-xs text-slate-900 font-bold"
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <input
                                            type="text"
                                            value={item.description}
                                            placeholder="Mô tả ngắn gọn"
                                            onChange={(e) => {
                                              const newItems = [...block.data.items];
                                              newItems[fIndex] = { ...newItems[fIndex], description: e.target.value };
                                              updateBlockData(block.id, { items: newItems });
                                            }}
                                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200  text-xs text-slate-750"
                                          />
                                        </div>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newItems = (block.data.items || []).filter((_item: FeatureItem, idx: number) => idx !== fIndex);
                                          updateBlockData(block.id, { items: newItems });
                                        }}
                                        className="p-1 text-red-500 hover:bg-red-50  shrink-0 mt-1"
                                      >
                                        <Trash size={14} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newItems = [...(block.data.items || []), { icon: "Award", title: "Tính năng mới", description: "Nhập mô tả tính năng..." }];
                                    updateBlockData(block.id, { items: newItems });
                                  }}
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-600 transition p-1"
                                >
                                  <Plus size={14} /> Thêm tính năng
                                </button>
                              </div>
                            </div>
                          )}

                          {/* 4. SPLIT COLUMN BLOCK EDIT */}
                          {block.type === "split" && (
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div className="space-y-1">
                                  <label className="block text-xs font-bold text-slate-700">Tiêu đề đoạn</label>
                                  <input
                                    type="text"
                                    value={block.data.title}
                                    onChange={(e) => updateBlockData(block.id, { title: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200  text-xs text-slate-900 focus:outline-none"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-xs font-bold text-slate-700">Mô tả văn bản</label>
                                  <textarea
                                    value={block.data.description}
                                    onChange={(e) => updateBlockData(block.id, { description: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200  text-xs text-slate-900 focus:outline-none"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-700">Nút CTA (tùy chọn)</label>
                                    <input
                                      type="text"
                                      value={block.data.ctaText || ""}
                                      onChange={(e) => updateBlockData(block.id, { ctaText: e.target.value })}
                                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200  text-xs text-slate-900 focus:outline-none"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-700">Link CTA</label>
                                    <input
                                      type="text"
                                      value={block.data.ctaLink || ""}
                                      onChange={(e) => updateBlockData(block.id, { ctaLink: e.target.value })}
                                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200  text-xs text-slate-900 focus:outline-none"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-700">Vị trí ảnh</label>
                                    <select
                                      value={block.data.imagePosition}
                                      onChange={(e) => updateBlockData(block.id, { imagePosition: e.target.value })}
                                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200  text-xs text-slate-700"
                                    >
                                      <option value="right">Bên phải</option>
                                      <option value="left">Bên trái</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-xs font-bold text-slate-700">Ảnh minh họa (Cloudflare URL)</label>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={block.data.imageUrl}
                                      onChange={(e) => updateBlockData(block.id, { imageUrl: e.target.value })}
                                      placeholder="https://..."
                                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200  text-xs text-slate-900 focus:outline-none"
                                    />
                                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-750 px-3 py-2  flex items-center justify-center shrink-0 transition text-xs font-bold border border-slate-250">
                                      {uploadingBlock?.blockId === block.id && uploadingBlock.fieldName === "imageUrl" ? (
                                        <UploadProgressCircle progress={uploadingBlock.progress} size={28} />
                                      ) : (
                                        <Upload size={14} className="mr-1" />
                                      )}
                                      {uploadingBlock?.blockId === block.id && uploadingBlock.fieldName === "imageUrl" ? "Đang tải" : "Tải lên"}
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        disabled={uploadingBlock !== null}
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) handleBlockImageUpload(block.id, "imageUrl", file);
                                          e.target.value = "";
                                        }}
                                      />
                                    </label>
                                  </div>
                                </div>
                                {block.data.imageUrl && (
                                  <div className="relative aspect-video  overflow-hidden border border-slate-200 bg-slate-50">
                                    <img src={block.data.imageUrl} alt="Split Image Preview" className="w-full h-full object-cover" />
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* 5. PRODUCTS BLOCK EDIT */}
                          {block.type === "products" && (
                            <div className="space-y-4">
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="block text-xs font-bold text-slate-700">Tiêu đề phần sản phẩm</label>
                                  <input
                                    type="text"
                                    value={block.data.title}
                                    onChange={(e) => updateBlockData(block.id, { title: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200  text-xs text-slate-900 focus:outline-none"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-xs font-bold text-slate-700">Phụ đề sản phẩm</label>
                                  <input
                                    type="text"
                                    value={block.data.subtitle}
                                    onChange={(e) => updateBlockData(block.id, { subtitle: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200  text-xs text-slate-900 focus:outline-none"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-700">Chọn sản phẩm hiển thị trong lưới</label>
                                {productsLoading ? (
                                  <div className="flex items-center gap-2 py-4">
                                    <Loader className="animate-spin text-orange-500" size={16} />
                                    <span className="text-xs text-slate-400 font-semibold">Đang tải sản phẩm hệ thống...</span>
                                  </div>
                                ) : productsList.length === 0 ? (
                                  <p className="text-xs italic text-slate-400">Không tìm thấy sản phẩm nào trong hệ thống. Vui lòng thêm sản phẩm trước.</p>
                                ) : (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[220px] overflow-y-auto border border-slate-200 p-4  bg-slate-50/50">
                                    {productsList.map((product) => {
                                      const isChecked = (block.data.productIds || []).includes(product.id);
                                      return (
                                        <label
                                          key={product.id}
                                          className={`flex items-center gap-3 p-2  border cursor-pointer select-none bg-white transition-all ${
                                            isChecked ? "border-orange-500 ring-2 ring-orange-500/10" : "border-slate-100 hover:border-slate-300"
                                          }`}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={(e) => {
                                              const checked = e.target.checked;
                                              let newIds = [...(block.data.productIds || [])];
                                              if (checked) {
                                                newIds.push(product.id);
                                              } else {
                                                newIds = newIds.filter(id => id !== product.id);
                                              }
                                              updateBlockData(block.id, { productIds: newIds });
                                            }}
                                            className="w-3.5 h-3.5 text-orange-500 border-slate-300 rounded focus:ring-orange-500"
                                          />
                                          <div className="w-8 h-8  overflow-hidden shrink-0 border border-slate-100">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                          </div>
                                          <div className="flex flex-col min-w-0">
                                            <span className="text-[10px] font-bold text-slate-900 truncate">{product.name}</span>
                                            <span className="text-[9px] text-orange-500 font-semibold">{product.price}</span>
                                          </div>
                                        </label>
                                      );
                                    })}
                                  </div>
                                )}
                                <p className="text-[10px] text-slate-400">Các sản phẩm được chọn sẽ tự động lấy thông tin giá cả, ảnh và link mua hàng thực tế từ cơ sở dữ liệu để hiển thị chuyên nghiệp ngoài trang chủ.</p>
                              </div>
                            </div>
                          )}

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Add Block Bar */}
            <div className="border-t border-slate-100 pt-6 space-y-3">
              <label className="block text-xs font-bold text-slate-700">Nhấp chọn khối để chèn thêm vào trang:</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <button
                  type="button"
                  onClick={() => addBlock("hero")}
                  className="flex flex-col items-center justify-center p-3  border border-slate-200 hover:border-orange-500 hover:bg-orange-50/10 hover:text-orange-600 transition group gap-1 text-slate-600"
                >
                  <ImageIcon size={18} className="group-hover:scale-110 transition" />
                  <span className="text-[10px] font-bold">Hero Banner</span>
                </button>

                <button
                  type="button"
                  onClick={() => addBlock("text")}
                  className="flex flex-col items-center justify-center p-3  border border-slate-200 hover:border-orange-500 hover:bg-orange-50/10 hover:text-orange-600 transition group gap-1 text-slate-600"
                >
                  <Type size={18} className="group-hover:scale-110 transition" />
                  <span className="text-[10px] font-bold">Khối Văn Bản</span>
                </button>

                <button
                  type="button"
                  onClick={() => addBlock("features")}
                  className="flex flex-col items-center justify-center p-3  border border-slate-200 hover:border-orange-500 hover:bg-orange-50/10 hover:text-orange-600 transition group gap-1 text-slate-600"
                >
                  <LayoutGrid size={18} className="group-hover:scale-110 transition" />
                  <span className="text-[10px] font-bold">Khối Tính Năng</span>
                </button>

                <button
                  type="button"
                  onClick={() => addBlock("split")}
                  className="flex flex-col items-center justify-center p-3  border border-slate-200 hover:border-orange-500 hover:bg-orange-50/10 hover:text-orange-600 transition group gap-1 text-slate-600"
                >
                  <Columns size={18} className="group-hover:scale-110 transition" />
                  <span className="text-[10px] font-bold">Khối Ảnh & Chữ</span>
                </button>

                <button
                  type="button"
                  onClick={() => addBlock("products")}
                  className="flex flex-col items-center justify-center p-3  border border-slate-200 hover:border-orange-500 hover:bg-orange-50/10 hover:text-orange-600 transition group gap-1 text-slate-600 col-span-2 sm:col-span-1"
                >
                  <ShoppingBag size={18} className="group-hover:scale-110 transition" />
                  <span className="text-[10px] font-bold">Khối Sản Phẩm</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Page settings & publishing status (1/3) */}
        <div className="space-y-6">
          <div className="bg-white  border border-slate-100 p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Settings size={15} />
              Cài đặt cấu hình trang
            </h3>

            {/* Page Title */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Tiêu đề trang</label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ví dụ: Khuyến Mãi Hè 2026..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200  text-xs font-semibold text-slate-900 focus:outline-none"
                required
              />
            </div>

            {/* Page Slug */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Đường dẫn tĩnh (Slug)</span>
                <span className="text-[9px] text-slate-400">/trang/slug-cua-ban</span>
              </label>
              <div className="flex">
                <span className="bg-slate-100 border border-r-0 border-slate-200 px-2 py-2 rounded-l-xl text-[10px] text-slate-500 flex items-center font-medium">
                  /trang/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="khuyen-mai-he-2026"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-r-xl text-xs font-medium text-slate-700 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Status selection */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Trạng thái công khai</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200  text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="DRAFT">Draft (Bản nháp - Chỉ Admin xem)</option>
                <option value="PUBLISHED">Published (Xuất bản - Mọi người xem)</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-900 text-white  p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-orange-400 tracking-wider uppercase">Tóm tắt thiết kế</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Số khối thiết kế:</span>
                <span className="font-bold">{blocks.length} khối</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Đường dẫn xem trang:</span>
                <span className="font-bold text-orange-350 truncate max-w-[120px]" title={`/trang/${slug || "..."}`}>
                  /trang/{slug || "..."}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Trạng thái lưu:</span>
                <span className={`font-bold ${status === "PUBLISHED" ? "text-green-400" : "text-amber-400"}`}>
                  {status === "PUBLISHED" ? "Xuất Bản" : "Nháp"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FULL SCREEN LIVE PREVIEW DRAWER MODAL */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col justify-end lg:justify-center lg:items-center">
          <div className="bg-cream w-full h-[90vh] lg:w-[90vw] lg:h-[88vh] lg: shadow-2xl flex flex-col overflow-hidden animate-slide-up">
            
            {/* Preview Toolbar */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5  bg-red-500" />
                <span className="w-2.5 h-2.5  bg-yellow-500" />
                <span className="w-2.5 h-2.5  bg-green-500" />
                <div className="h-4 w-px bg-slate-800 mx-2" />
                <h3 className="text-sm font-bold tracking-wide">Live Preview: <span className="text-orange-400">{title || "Trang mới"}</span></h3>
              </div>

              {/* Device simulation controls */}
              <div className="hidden sm:flex items-center gap-1 bg-slate-800 p-1 ">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1.5  transition ${previewDevice === "desktop" ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white"}`}
                  title="Desktop View"
                >
                  <Monitor size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("tablet")}
                  className={`p-1.5  transition ${previewDevice === "tablet" ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white"}`}
                  title="Tablet View"
                >
                  <Tablet size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1.5  transition ${previewDevice === "mobile" ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white"}`}
                  title="Mobile View"
                >
                  <Smartphone size={14} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white px-3 py-1.5  text-xs font-bold transition"
              >
                Đóng Xem Trước
              </button>
            </div>

            {/* Simulated website frame */}
            <div className="flex-1 overflow-y-auto bg-slate-800/20 p-4 sm:p-8 flex justify-center items-start">
              <div
                className={`bg-cream shadow-xl min-h-[100%]  overflow-hidden border border-slate-100 transition-all duration-300 ${
                  previewDevice === "desktop" ? "w-full" :
                  previewDevice === "tablet" ? "w-[768px]" :
                  "w-[375px]"
                }`}
              >
                {/* Simulated Header */}
                <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-100 shrink-0">
                  <div className="flex items-center gap-2">
                    <img src="/logo-acbt.png" alt="Logo" className="w-8 h-8  border border-slate-150" />
                    <span className="font-black text-slate-900 text-sm tracking-wide">BÀ TUYẾT</span>
                  </div>
                  <div className="flex gap-4 text-xs font-bold text-slate-600">
                    <span>Sản phẩm</span>
                    <span>Quy trình</span>
                    <span>Giới thiệu</span>
                  </div>
                </div>

                {/* Main Render List */}
                <div className="divide-y divide-slate-100/50">
                  {blocks.length === 0 ? (
                    <div className="py-20 text-center text-slate-400 italic text-xs">
                      Không có khối nào được thiết lập. Hãy chèn các khối từ trang cấu trúc.
                    </div>
                  ) : (
                    blocks.map((block) => {
                      return (
                        <div key={block.id} className="relative">
                          
                          {/* 1. HERO RENDER */}
                          {block.type === "hero" && (
                            <section
                              className="relative min-h-[300px] flex items-center justify-center bg-cover bg-center py-20 px-6 text-center text-white"
                              style={{
                                backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.65)), url(${block.data.backgroundImage || "/hero-bg-default.jpg"})`
                              }}
                            >
                              <div className="max-w-2xl space-y-4">
                                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-sm leading-tight text-white">
                                  {block.data.title || "Tiêu đề Hero"}
                                </h1>
                                <p className="text-sm text-slate-200 drop-shadow-sm max-w-xl mx-auto leading-relaxed">
                                  {block.data.subtitle}
                                </p>
                                {block.data.ctaText && (
                                  <div className="pt-2">
                                    <span className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs px-6 py-3  shadow-md cursor-pointer transition transform hover:scale-105 active:scale-95">
                                      {block.data.ctaText}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </section>
                          )}

                          {/* 2. TEXT RENDER */}
                          {block.type === "text" && (
                            <section className={`py-12 px-6 sm:px-12 flex justify-center ${
                              block.data.backgroundColor === "slate-900" ? "bg-slate-900 text-slate-100" :
                              block.data.backgroundColor === "white" ? "bg-white text-slate-900" :
                              "bg-cream text-slate-900"
                            }`}>
                              <div
                                className={`prose prose-orange max-w-2xl w-full text-sm leading-relaxed ${
                                  block.data.backgroundColor === "slate-900" ? "prose-invert" : ""
                                }`}
                                dangerouslySetInnerHTML={{ __html: block.data.content || "" }}
                              />
                            </section>
                          )}

                          {/* 3. FEATURES RENDER */}
                          {block.type === "features" && (
                            <section className="py-16 px-6 sm:px-12 bg-white">
                              <div className="max-w-5xl mx-auto text-center space-y-10">
                                {block.data.title && (
                                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{block.data.title}</h2>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                  {(block.data.items || []).map((item: FeatureItem, fIdx: number) => {
                                    return (
                                      <div key={fIdx} className="bg-cream  border border-slate-100/50 p-6 flex flex-col items-center text-center space-y-3 transition transform hover:-translate-y-1">
                                        <div className="w-10 h-10  bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 shadow-sm border border-orange-100/50">
                                          {/* Mock icon displaying */}
                                          <Globe size={18} />
                                        </div>
                                        <h3 className="text-sm font-extrabold text-slate-950">{item.title}</h3>
                                        <p className="text-xs text-slate-650 leading-relaxed">{item.description}</p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </section>
                          )}

                          {/* 4. SPLIT COLUMN RENDER */}
                          {block.type === "split" && (
                            <section className="py-16 px-6 sm:px-12 bg-cream">
                              <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
                                <div className={`space-y-4 ${block.data.imagePosition === "left" ? "md:order-2" : "md:order-1"}`}>
                                  <h2 className="text-2xl font-black text-slate-900 leading-tight">{block.data.title}</h2>
                                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{block.data.description}</p>
                                  {block.data.ctaText && (
                                    <div className="pt-2">
                                      <span className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5  cursor-pointer shadow transition-all">
                                        {block.data.ctaText}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className={`relative aspect-video sm:aspect-square md:aspect-video  overflow-hidden border border-slate-100 shadow-md ${
                                  block.data.imagePosition === "left" ? "md:order-1" : "md:order-2"
                                }`}>
                                  <img src={block.data.imageUrl || "/uploads/process-preview.jpg"} alt={block.data.title} className="w-full h-full object-cover" />
                                </div>
                              </div>
                            </section>
                          )}

                          {/* 5. PRODUCTS RENDER */}
                          {block.type === "products" && (
                            <section className="py-16 px-6 sm:px-12 bg-white">
                              <div className="max-w-5xl mx-auto space-y-10">
                                <div className="text-center space-y-2">
                                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{block.data.title}</h2>
                                  {block.data.subtitle && (
                                    <p className="text-xs text-slate-400 font-semibold">{block.data.subtitle}</p>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                  {/* Filter products that are checked */}
                                  {productsList
                                    .filter(p => (block.data.productIds || []).includes(p.id))
                                    .map(p => (
                                      <div key={p.id} className="bg-cream  border border-slate-100 overflow-hidden shadow-sm flex flex-col justify-between h-full group hover:shadow-md transition">
                                        <div className="relative aspect-square overflow-hidden bg-slate-50">
                                          <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                          <span className="absolute top-2.5 left-2.5 bg-orange-500 text-white text-[9px] font-black px-2.5 py-1  uppercase tracking-wider">
                                            {p.categoryLabel}
                                          </span>
                                        </div>
                                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                                          <div className="space-y-1">
                                            <h3 className="text-xs font-bold text-slate-900 group-hover:text-orange-500 transition line-clamp-1">{p.name}</h3>
                                            <p className="text-xs font-black text-orange-500">{p.price}</p>
                                          </div>
                                          <span className="w-full text-center bg-slate-900 text-white text-[10px] font-bold py-2  block cursor-pointer transition hover:bg-orange-500">
                                            Đặt Mua Ngay
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  {productsList.filter(p => (block.data.productIds || []).includes(p.id)).length === 0 && (
                                    <div className="col-span-3 text-center text-slate-400 italic text-xs py-8">
                                      Chưa có sản phẩm nào được chọn để hiển thị ở đây.
                                    </div>
                                  )}
                                </div>
                              </div>
                            </section>
                          )}

                        </div>
                      );
                    })
                  )}
                </div>

                {/* Simulated Footer */}
                <div className="bg-slate-900 text-slate-400 p-8 text-center text-[10px] border-t border-slate-800 space-y-1">
                  <p className="font-bold text-slate-200">© 2026 Ăn Cùng Bà Tuyết. All rights reserved.</p>
                  <p>Hệ thống sản xuất thực phẩm sạch hàng đầu Việt Nam.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
