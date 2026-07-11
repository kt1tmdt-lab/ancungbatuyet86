"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { useAuth } from "@/lib/auth-context";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Save, 
  LayoutDashboard, 
  Globe, 
  Link2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Plus, 
  Trash2,
  ArrowUp,
  ArrowDown,
  Settings,
  Share2,
  Users,
  TrendingUp,
  Factory,
  ShieldCheck,
  ImagePlus
} from "lucide-react";
import toast from "react-hot-toast";
import { DEFAULT_SITE_CONFIG, normalizeSiteConfig } from "@/lib/site-config-defaults";

const linkItemSchema = z.object({
  label: z.string().min(1, "Nhãn không được trống"),
  href: z.string().min(1, "Liên kết không được trống"),
});

const productMenuLinkSchema = linkItemSchema.extend({
  note: z.string().optional(),
});

const statItemSchema = z.object({
  value: z.string().min(1, "Vui lòng nhập giá trị"),
  label: z.string().min(1, "Vui lòng nhập nhãn"),
  desc: z.string().min(1, "Vui lòng nhập mô tả"),
});

const settingsSchema = z.object({
  heroBanner: z.object({
    eyebrow: z.string().min(1, "Vui lòng nhập nhãn thương hiệu"),
    title: z.string().min(1, "Vui lòng nhập tiêu đề"),
    subtitle: z.string().min(1, "Vui lòng nhập mô tả ngắn"),
    characterImage: z.string().min(1, "Vui lòng chọn ảnh Hero"),
    characterAlt: z.string().min(1, "Vui lòng nhập mô tả ảnh"),
    quote: z.string().min(1, "Vui lòng nhập câu trích dẫn"),
    statValue: z.string().min(1, "Vui lòng nhập số liệu"),
    statLabel: z.string().min(1, "Vui lòng nhập nhãn số liệu"),
    ctaText: z.string().min(1, "Vui lòng nhập nút CTA"),
    ctaLink: z.string().min(1, "Vui lòng nhập link CTA"),
    secondaryCtaText: z.string().min(1, "Vui lòng nhập nút phụ"),
    secondaryCtaLink: z.string().min(1, "Vui lòng nhập link nút phụ"),
    highlights: z.array(z.object({
      value: z.string().min(1, "Vui lòng nhập giá trị"),
      label: z.string().min(1, "Vui lòng nhập mô tả"),
    })).length(3),
  }),
  seo: z.object({
    title: z.string().min(1, "Vui lòng nhập Meta Title"),
    description: z.string().min(1, "Vui lòng nhập Meta Description"),
    keywords: z.string().optional(),
  }),
  navbarLinks: z.array(linkItemSchema),
  productMenuLinks: z.array(productMenuLinkSchema),
  footerLinks: z.object({
    products: z.array(linkItemSchema),
    explore: z.array(linkItemSchema),
  }),
  footerContact: z.object({
    phone: z.string().min(1, "Vui lòng nhập hotline"),
    email: z.string().min(1, "Vui lòng nhập email"),
    address: z.string().min(1, "Vui lòng nhập địa chỉ"),
    workingHours: z.string().min(1, "Vui lòng nhập giờ làm việc"),
    shopeeUrl: z.string().optional(),
    tiktokUrl: z.string().optional(),
    facebookUrl: z.string().optional(),
  }),
  stats: z.object({
    followers: statItemSchema,
    orders: statItemSchema,
    area: statItemSchema,
    insurance: statItemSchema,
  }),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

type ProductOption = {
  id: string;
  slug: string;
  name: string;
  category?: string | null;
};

export default function SettingsPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"hero" | "seo" | "navigation" | "stats">("hero");
  const [heroMediaOpen, setHeroMediaOpen] = useState(false);
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);

  useEffect(() => {
    const tab = new URLSearchParams(window.location.search).get("tab");
    if (tab === "hero" || tab === "seo" || tab === "navigation" || tab === "stats") {
      setActiveTab(tab);
    }
  }, []);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: DEFAULT_SITE_CONFIG,
  });

  const { control, register, handleSubmit, reset, setValue, getValues, formState: { errors } } = form;

  // Field arrays for menus
  const { fields: navbarFields, append: appendNavbar, remove: removeNavbar, move: moveNavbar } = useFieldArray({
    control,
    name: "navbarLinks",
  });

  const { fields: productMenuFields, append: appendProductMenu, remove: removeProductMenu, move: moveProductMenu } = useFieldArray({
    control,
    name: "productMenuLinks",
  });
  const watchedProductMenuLinks = useWatch({ control, name: "productMenuLinks" });
  const watchedHeroImage = useWatch({ control, name: "heroBanner.characterImage" });

  const { fields: footerProductsFields, append: appendFooterProduct, remove: removeFooterProduct } = useFieldArray({
    control,
    name: "footerLinks.products",
  });

  const { fields: footerExploreFields, append: appendFooterExplore, remove: removeFooterExplore } = useFieldArray({
    control,
    name: "footerLinks.explore",
  });

  useEffect(() => {
    if (token) {
      fetchSettings();
      fetchProducts();
    }
  }, [token]);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        reset(normalizeSiteConfig(data?.data));
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
      toast.error("Không thể tải cấu hình");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      let res = await fetch("/api/products?status=ALL", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        res = await fetch("/api/products");
      }

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();
      setProductOptions(Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      console.error("Failed to fetch products", error);
      toast.error("Không thể tải danh sách sản phẩm");
    }
  };

  const getProductHref = (product: ProductOption) => `/san-pham/${product.slug}`;

  const getProductNote = (product: ProductOption) => product.category || "Sản phẩm chủ lực";

  const handleProductMenuSelect = (index: number, href: string) => {
    const product = productOptions.find((item) => getProductHref(item) === href);
    if (!product) return;

    setValue(`productMenuLinks.${index}.href`, href, { shouldDirty: true, shouldValidate: true });
    setValue(`productMenuLinks.${index}.label`, product.name, { shouldDirty: true, shouldValidate: true });
    setValue(`productMenuLinks.${index}.note`, getProductNote(product), { shouldDirty: true, shouldValidate: true });
  };

  const addProductMenuItem = () => {
    const selectedHrefs = new Set((getValues("productMenuLinks") || []).map((item) => item.href));
    const product = productOptions.find((item) => !selectedHrefs.has(getProductHref(item)));

    if (!product) {
      toast.error("Không còn sản phẩm nào để thêm vào dropdown");
      return;
    }

    appendProductMenu({
      label: product.name,
      href: getProductHref(product),
      note: getProductNote(product),
    });
  };

  const onSubmit = async (data: SettingsFormValues) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to save settings");
      }
      toast.success("Đã lưu cấu hình thành công!");
    } catch (error) {
      console.error("Failed to save settings", error);
      toast.error("Lưu cấu hình thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "MARKETING"]}>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Settings className="text-orange-500" size={28} />
              Cấu hình website
            </h1>
            <p className="text-slate-500 mt-1">Chỉnh Hero, SEO, số liệu, menu và chân trang. Các nội dung khác mở từ trang Quản lý website.</p>
          </div>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold transition disabled:opacity-50 shadow-md cursor-pointer self-start sm:self-auto"
          >
            <Save size={18} />
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200">
          <button
            onClick={() => setActiveTab("hero")}
            className={`px-6 py-3 font-bold text-sm border-b-2 transition-all ${
              activeTab === "hero"
                ? "border-orange-500 text-orange-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-950"
            }`}
          >
            Hero trang chủ
          </button>
          <button
            onClick={() => setActiveTab("seo")}
            className={`px-6 py-3 font-bold text-sm border-b-2 transition-all ${
              activeTab === "seo"
                ? "border-orange-500 text-orange-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-950"
            }`}
          >
            SEO
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-6 py-3 font-bold text-sm border-b-2 transition-all ${
              activeTab === "stats"
                ? "border-orange-500 text-orange-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-950"
            }`}
          >
            Số liệu tiêu biểu
          </button>
          <button
            onClick={() => setActiveTab("navigation")}
            className={`px-6 py-3 font-bold text-sm border-b-2 transition-all ${
              activeTab === "navigation"
                ? "border-orange-500 text-orange-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-950"
            }`}
          >
            Menu & Chân trang Footer
          </button>
        </div>

        {loading ? (
          <div className="h-96 bg-slate-100 animate-pulse border border-slate-200"></div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {(activeTab === "hero" || activeTab === "seo") && (
              <div className="space-y-8 animate-fade-in">
                {/* Section: Hero Banner */}
                <div className={`${activeTab === "hero" ? "block" : "hidden"} bg-white border border-slate-200 shadow-sm overflow-hidden`}>
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                    <LayoutDashboard className="text-orange-500" size={20} />
                    <h2 className="text-lg font-bold text-slate-900">Nội dung Trang chủ (Hero Banner)</h2>
                  </div>
                  <div className="p-6 space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Nhãn nhỏ phía trên tiêu đề</label>
                      <input {...register("heroBanner.eyebrow")} className="w-full border border-slate-300 p-2.5 focus:border-orange-500 outline-none text-sm font-medium" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Tiêu đề chính (H1)</label>
                      <input
                        {...register("heroBanner.title")}
                        className="w-full border border-slate-300 p-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm font-medium"
                        placeholder="VD: Ăn Cùng Bà Tuyết"
                      />
                      {errors.heroBanner?.title && (
                        <p className="text-red-500 text-xs mt-1">{errors.heroBanner.title.message}</p>
                      )}
                    </div>

                    <div className="grid gap-5 border-t border-slate-100 pt-5 lg:grid-cols-[220px_1fr]">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Ảnh nhân vật Hero</label>
                        <div className="flex min-h-52 items-center justify-center border border-dashed border-slate-300 bg-slate-50 p-3">
                          {watchedHeroImage ? (
                            <img src={watchedHeroImage} alt="Xem trước ảnh Hero" className="max-h-48 w-full object-contain" />
                          ) : <ImagePlus className="text-slate-300" size={40} />}
                        </div>
                        <button type="button" onClick={() => setHeroMediaOpen(true)} className="mt-2 w-full bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600">
                          Chọn hoặc tải ảnh
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Đường dẫn ảnh</label>
                          <input {...register("heroBanner.characterImage")} className="w-full border border-slate-300 p-2.5 outline-none focus:border-orange-500 text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Mô tả ảnh (alt)</label>
                          <input {...register("heroBanner.characterAlt")} className="w-full border border-slate-300 p-2.5 outline-none focus:border-orange-500 text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Câu trích dẫn bên cạnh ảnh</label>
                          <textarea {...register("heroBanner.quote")} className="min-h-24 w-full border border-slate-300 p-2.5 outline-none focus:border-orange-500 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className="block text-sm font-bold text-slate-700 mb-1">Số liệu nổi bật</label><input {...register("heroBanner.statValue")} className="w-full border border-slate-300 p-2.5 outline-none focus:border-orange-500 text-sm" /></div>
                          <div><label className="block text-sm font-bold text-slate-700 mb-1">Nhãn số liệu</label><input {...register("heroBanner.statLabel")} className="w-full border border-slate-300 p-2.5 outline-none focus:border-orange-500 text-sm" /></div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Mô tả ngắn (Subtitle)</label>
                      <textarea
                        {...register("heroBanner.subtitle")}
                        className="w-full border border-slate-300 p-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none min-h-[90px] text-sm font-medium"
                        placeholder="VD: Thương hiệu đồ ăn vặt sạch hàng đầu Việt Nam..."
                      />
                      {errors.heroBanner?.subtitle && (
                        <p className="text-red-500 text-xs mt-1">{errors.heroBanner.subtitle.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Text nút hành động (CTA)</label>
                        <input
                          {...register("heroBanner.ctaText")}
                          className="w-full border border-slate-300 p-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm font-medium"
                          placeholder="VD: Xem Sản Phẩm"
                        />
                        {errors.heroBanner?.ctaText && (
                          <p className="text-red-500 text-xs mt-1">{errors.heroBanner.ctaText.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Liên kết CTA</label>
                        <input
                          {...register("heroBanner.ctaLink")}
                          className="w-full border border-slate-300 p-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm font-medium"
                          placeholder="VD: /san-pham"
                        />
                        {errors.heroBanner?.ctaLink && (
                          <p className="text-red-500 text-xs mt-1">{errors.heroBanner.ctaLink.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Chữ nút phụ</label>
                        <input {...register("heroBanner.secondaryCtaText")} className="w-full border border-slate-300 p-2.5 focus:border-orange-500 outline-none text-sm font-medium" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Nút phụ trỏ đến đâu?</label>
                        <input {...register("heroBanner.secondaryCtaLink")} className="w-full border border-slate-300 p-2.5 focus:border-orange-500 outline-none text-sm font-medium" placeholder="/gioi-thieu" />
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-5">
                      <h3 className="mb-3 font-bold text-slate-900">Ba ô thông tin dưới Hero</h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        {[0, 1, 2].map((index) => (
                          <div key={index} className="space-y-3 border border-slate-200 bg-slate-50 p-4">
                            <div className="text-xs font-black uppercase text-orange-600">Ô {index + 1}</div>
                            <input {...register(`heroBanner.highlights.${index}.value` as const)} className="w-full border border-slate-300 p-2.5 text-sm font-bold outline-none focus:border-orange-500" placeholder="Giá trị lớn" />
                            <input {...register(`heroBanner.highlights.${index}.label` as const)} className="w-full border border-slate-300 p-2.5 text-sm outline-none focus:border-orange-500" placeholder="Dòng mô tả" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Global SEO */}
                <div className={`${activeTab === "seo" ? "block" : "hidden"} bg-white border border-slate-200 shadow-sm overflow-hidden`}>
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                    <Globe className="text-blue-500" size={20} />
                    <h2 className="text-lg font-bold text-slate-900">SEO Toàn cục (Global SEO)</h2>
                  </div>
                  <div className="p-6 space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Meta Title</label>
                      <input
                        {...register("seo.title")}
                        className="w-full border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Meta Description</label>
                      <textarea
                        {...register("seo.description")}
                        className="w-full border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[90px] text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Meta Keywords (cách nhau dấu phẩy)</label>
                      <input
                        {...register("seo.keywords")}
                        className="w-full border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm font-medium"
                        placeholder="đồ ăn vặt sạch, ăn cùng bà tuyết, tăm cay..."
                      />
                    </div>

                    {/* SEO Preview */}
                    <div className="p-4 border border-slate-200 bg-slate-50">
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Xem trước kết quả tìm kiếm Google</h4>
                      <div className="text-lg text-blue-700 truncate cursor-pointer hover:underline font-semibold leading-snug">
                        {form.watch("seo.title") || "Tiêu đề trang web..."}
                      </div>
                      <div className="text-xs text-green-700 truncate mb-1">https://ancungbatuyet.vn</div>
                      <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {form.watch("seo.description") || "Mô tả của trang web sẽ hiển thị tại đây..."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "stats" && (
              <div className="space-y-8 animate-fade-in">
                <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                    <TrendingUp className="text-orange-500" size={20} />
                    <h2 className="text-lg font-bold text-slate-900">Cấu hình số liệu tiêu biểu</h2>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Stat item: Followers */}
                    <div className="p-4 border border-slate-100 bg-slate-50 space-y-4">
                      <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-200 pb-2">
                        <Users size={18} className="text-orange-500" />
                        <span>Mục 1: Số lượng Followers</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Giá trị hiển thị</label>
                          <input
                            {...register("stats.followers.value")}
                            className="w-full border border-slate-300 p-2.5 outline-none focus:border-orange-500 text-xs font-semibold"
                            placeholder="VD: 10M+"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Nhãn tiêu đề</label>
                          <input
                            {...register("stats.followers.label")}
                            className="w-full border border-slate-300 p-2.5 outline-none focus:border-orange-500 text-xs font-semibold"
                            placeholder="VD: Followers"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả chi tiết</label>
                        <textarea
                          {...register("stats.followers.desc")}
                          className="w-full border border-slate-300 p-2.5 outline-none focus:border-orange-500 min-h-[60px] text-xs font-semibold"
                          placeholder="Mô tả..."
                        />
                      </div>
                    </div>

                    {/* Stat item: Orders */}
                    <div className="p-4 border border-slate-100 bg-slate-50 space-y-4">
                      <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-200 pb-2">
                        <TrendingUp size={18} className="text-orange-500" />
                        <span>Mục 2: Tổng số đơn hàng</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Giá trị hiển thị</label>
                          <input
                            {...register("stats.orders.value")}
                            className="w-full border border-slate-300 p-2.5 outline-none focus:border-orange-500 text-xs font-semibold"
                            placeholder="VD: 8M+"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Nhãn tiêu đề</label>
                          <input
                            {...register("stats.orders.label")}
                            className="w-full border border-slate-300 p-2.5 outline-none focus:border-orange-500 text-xs font-semibold"
                            placeholder="VD: Đơn hàng"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả chi tiết</label>
                        <textarea
                          {...register("stats.orders.desc")}
                          className="w-full border border-slate-300 p-2.5 outline-none focus:border-orange-500 min-h-[60px] text-xs font-semibold"
                          placeholder="Mô tả..."
                        />
                      </div>
                    </div>

                    {/* Stat item: Area */}
                    <div className="p-4 border border-slate-100 bg-slate-50 space-y-4">
                      <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-200 pb-2">
                        <Factory size={18} className="text-orange-500" />
                        <span>Mục 3: Năng lực sản xuất / Nhà máy</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Giá trị hiển thị</label>
                          <input
                            {...register("stats.area.value")}
                            className="w-full border border-slate-300 p-2.5 outline-none focus:border-orange-500 text-xs font-semibold"
                            placeholder="VD: 5.000+m²"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Nhãn tiêu đề</label>
                          <input
                            {...register("stats.area.label")}
                            className="w-full border border-slate-300 p-2.5 outline-none focus:border-orange-500 text-xs font-semibold"
                            placeholder="VD: Diện tích nhà máy"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả chi tiết</label>
                        <textarea
                          {...register("stats.area.desc")}
                          className="w-full border border-slate-300 p-2.5 outline-none focus:border-orange-500 min-h-[60px] text-xs font-semibold"
                          placeholder="Mô tả..."
                        />
                      </div>
                    </div>

                    {/* Stat item: Insurance */}
                    <div className="p-4 border border-slate-100 bg-slate-50 space-y-4">
                      <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-200 pb-2">
                        <ShieldCheck size={18} className="text-orange-500" />
                        <span>Mục 4: Bảo hiểm / Cam kết</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Giá trị hiển thị</label>
                          <input
                            {...register("stats.insurance.value")}
                            className="w-full border border-slate-300 p-2.5 outline-none focus:border-orange-500 text-xs font-semibold"
                            placeholder="VD: PVI"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Nhãn tiêu đề</label>
                          <input
                            {...register("stats.insurance.label")}
                            className="w-full border border-slate-300 p-2.5 outline-none focus:border-orange-500 text-xs font-semibold"
                            placeholder="VD: Bảo hiểm sản phẩm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả chi tiết</label>
                        <textarea
                          {...register("stats.insurance.desc")}
                          className="w-full border border-slate-300 p-2.5 outline-none focus:border-orange-500 min-h-[60px] text-xs font-semibold"
                          placeholder="Mô tả..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "navigation" && (
              <div className="space-y-8 animate-fade-in">
                {/* Section: Menu Navbar */}
                <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link2 className="text-orange-500" size={20} />
                      <h2 className="text-lg font-bold text-slate-900">Menu Header (Thanh điều hướng Navbar)</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => appendNavbar({ label: "", href: "" })}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white font-bold text-xs hover:bg-orange-600 transition shadow cursor-pointer"
                    >
                      <Plus size={14} />
                      Thêm liên kết
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    {navbarFields.length === 0 ? (
                      <p className="text-center py-6 text-xs text-slate-400 font-semibold italic">Chưa có liên kết nào, hệ thống sẽ sử dụng danh sách tĩnh mặc định.</p>
                    ) : (
                      <div className="space-y-3">
                        {navbarFields.map((field, idx) => (
                          <div key={field.id} className="flex gap-3 items-center">
                            <span className="text-xs font-bold text-slate-400 w-8">#{idx + 1}</span>
                            <div className="grid grid-cols-2 gap-3 flex-1">
                              <input
                                {...register(`navbarLinks.${idx}.label` as const)}
                                placeholder="Tên hiển thị (VD: Giới thiệu)"
                                className="border border-slate-350 p-2 text-xs font-semibold outline-none focus:border-orange-500"
                              />
                              <input
                                {...register(`navbarLinks.${idx}.href` as const)}
                                placeholder="Liên kết (VD: /gioi-thieu)"
                                className="border border-slate-350 p-2 text-xs font-semibold outline-none focus:border-orange-500"
                              />
                            </div>
                            <div className="flex border border-slate-200">
                              <button
                                type="button"
                                onClick={() => moveNavbar(idx, idx - 1)}
                                disabled={idx === 0}
                                className="p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30"
                                aria-label="Đưa mục menu lên trên"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveNavbar(idx, idx + 1)}
                                disabled={idx === navbarFields.length - 1}
                                className="border-l border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30"
                                aria-label="Đưa mục menu xuống dưới"
                              >
                                <ArrowDown size={14} />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeNavbar(idx)}
                              className="p-2 border border-red-200 hover:bg-red-50 text-red-500 hover:text-red-700 transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Link2 className="text-orange-500" size={20} />
                        <h2 className="text-lg font-bold text-slate-900">Dropdown sản phẩm Header</h2>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        Chọn từ sản phẩm đã có. Website tự lấy tên và link sản phẩm đúng theo slug.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addProductMenuItem}
                      disabled={productOptions.length === 0}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white font-bold text-xs hover:bg-orange-600 transition shadow cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      <Plus size={14} />
                      Thêm sản phẩm
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    {productOptions.length === 0 ? (
                      <p className="text-center py-6 text-xs text-slate-400 font-semibold italic">
                        Chưa tải được sản phẩm. Hãy kiểm tra mục quản lý sản phẩm trước.
                      </p>
                    ) : productMenuFields.length === 0 ? (
                      <p className="text-center py-6 text-xs text-slate-400 font-semibold italic">
                        Chưa có sản phẩm trong dropdown. Bấm Thêm sản phẩm để chọn.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {productMenuFields.map((field, idx) => {
                          const selectedItem = watchedProductMenuLinks?.[idx];
                          const selectedHref = selectedItem?.href || "";
                          const selectedLabel = selectedItem?.label || "";

                          return (
                            <div key={field.id} className="grid grid-cols-1 lg:grid-cols-[32px_1fr_220px_82px_40px] gap-3 items-center">
                              <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                              <div>
                                <select
                                  value={selectedHref}
                                  onChange={(event) => handleProductMenuSelect(idx, event.target.value)}
                                  className="w-full border border-slate-300 p-2 text-xs font-semibold outline-none focus:border-orange-500 bg-white"
                                >
                                  {productOptions.map((product) => {
                                    const href = getProductHref(product);
                                    return (
                                      <option key={product.id} value={href}>
                                        {product.name}
                                      </option>
                                    );
                                  })}
                                </select>
                                <p className="mt-1 text-[11px] font-semibold text-slate-400">
                                  {selectedLabel} - {selectedHref}
                                </p>
                                <input type="hidden" {...register(`productMenuLinks.${idx}.label` as const)} />
                                <input type="hidden" {...register(`productMenuLinks.${idx}.href` as const)} />
                              </div>
                              <input
                                {...register(`productMenuLinks.${idx}.note` as const)}
                                placeholder="Ghi chú nhỏ"
                                className="border border-slate-300 p-2 text-xs font-semibold outline-none focus:border-orange-500"
                              />
                              <div className="flex border border-slate-200">
                                <button
                                  type="button"
                                  onClick={() => moveProductMenu(idx, idx - 1)}
                                  disabled={idx === 0}
                                  className="p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30"
                                  aria-label="Đưa sản phẩm lên trên"
                                >
                                  <ArrowUp size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveProductMenu(idx, idx + 1)}
                                  disabled={idx === productMenuFields.length - 1}
                                  className="border-l border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30"
                                  aria-label="Đưa sản phẩm xuống dưới"
                                >
                                  <ArrowDown size={14} />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeProductMenu(idx)}
                                className="p-2 border border-red-200 hover:bg-red-50 text-red-500 hover:text-red-700 transition"
                                aria-label="Xóa sản phẩm khỏi dropdown"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Section: Footer Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Footer Product links */}
                  <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                      <h2 className="text-sm font-black text-slate-900 uppercase">Liên kết Sản Phẩm Footer</h2>
                      <button
                        type="button"
                        onClick={() => appendFooterProduct({ label: "", href: "" })}
                        className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase cursor-pointer"
                      >
                        <Plus size={12} />
                        Thêm
                      </button>
                    </div>
                    <div className="p-5 space-y-3">
                      {footerProductsFields.map((field, idx) => (
                        <div key={field.id} className="flex gap-2 items-center">
                          <input
                            {...register(`footerLinks.products.${idx}.label` as const)}
                            placeholder="Nhãn"
                            className="border border-slate-350 p-1.5 text-xs font-semibold outline-none w-1/2"
                          />
                          <input
                            {...register(`footerLinks.products.${idx}.href` as const)}
                            placeholder="Link"
                            className="border border-slate-350 p-1.5 text-xs font-semibold outline-none w-1/2"
                          />
                          <button
                            type="button"
                            onClick={() => removeFooterProduct(idx)}
                            className="p-1.5 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Explore links */}
                  <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                      <h2 className="text-sm font-black text-slate-900 uppercase">Liên kết Khám Phá Footer</h2>
                      <button
                        type="button"
                        onClick={() => appendFooterExplore({ label: "", href: "" })}
                        className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase cursor-pointer"
                      >
                        <Plus size={12} />
                        Thêm
                      </button>
                    </div>
                    <div className="p-5 space-y-3">
                      {footerExploreFields.map((field, idx) => (
                        <div key={field.id} className="flex gap-2 items-center">
                          <input
                            {...register(`footerLinks.explore.${idx}.label` as const)}
                            placeholder="Nhãn"
                            className="border border-slate-350 p-1.5 text-xs font-semibold outline-none w-1/2"
                          />
                          <input
                            {...register(`footerLinks.explore.${idx}.href` as const)}
                            placeholder="Link"
                            className="border border-slate-350 p-1.5 text-xs font-semibold outline-none w-1/2"
                          />
                          <button
                            type="button"
                            onClick={() => removeFooterExplore(idx)}
                            className="p-1.5 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section: Footer Contact Info */}
                <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                    <Phone className="text-orange-500" size={20} />
                    <h2 className="text-lg font-bold text-slate-900">Thông tin liên hệ & Mạng xã hội Chân trang</h2>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                          <Phone size={14} />
                          Hotline điện thoại
                        </label>
                        <input
                          {...register("footerContact.phone")}
                          className="w-full border border-slate-300 p-2 text-xs font-semibold outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                          <Mail size={14} />
                          Email liên hệ
                        </label>
                        <input
                          {...register("footerContact.email")}
                          className="w-full border border-slate-300 p-2 text-xs font-semibold outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                          <MapPin size={14} />
                          Địa chỉ
                        </label>
                        <input
                          {...register("footerContact.address")}
                          className="w-full border border-slate-300 p-2 text-xs font-semibold outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                          <Clock size={14} />
                          Thời gian làm việc
                        </label>
                        <input
                          {...register("footerContact.workingHours")}
                          className="w-full border border-slate-300 p-2 text-xs font-semibold outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4 space-y-4">
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                        <Share2 size={16} />
                        Liên kết Kênh bán hàng & Mạng xã hội
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Shopee URL</label>
                          <input
                            {...register("footerContact.shopeeUrl")}
                            className="w-full border border-slate-300 p-2 text-xs font-semibold outline-none"
                            placeholder="https://shopee.vn/..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">TikTok Shop URL</label>
                          <input
                            {...register("footerContact.tiktokUrl")}
                            className="w-full border border-slate-300 p-2 text-xs font-semibold outline-none"
                            placeholder="https://tiktok.com/@..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Facebook URL</label>
                          <input
                            {...register("footerContact.facebookUrl")}
                            className="w-full border border-slate-300 p-2 text-xs font-semibold outline-none"
                            placeholder="https://facebook.com/..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
      <MediaPickerModal
        open={heroMediaOpen}
        onClose={() => setHeroMediaOpen(false)}
        onSelect={(url) => {
          setValue("heroBanner.characterImage", url, { shouldDirty: true, shouldValidate: true });
          setHeroMediaOpen(false);
        }}
      />
    </ProtectedRoute>
  );
}
