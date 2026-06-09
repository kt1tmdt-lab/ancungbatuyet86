"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { useForm, useFieldArray } from "react-hook-form";
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
  Settings,
  Share2
} from "lucide-react";
import toast from "react-hot-toast";

const linkItemSchema = z.object({
  label: z.string().min(1, "Nhãn không được trống"),
  href: z.string().min(1, "Liên kết không được trống"),
});

const settingsSchema = z.object({
  heroBanner: z.object({
    title: z.string().min(1, "Vui lòng nhập tiêu đề"),
    subtitle: z.string().min(1, "Vui lòng nhập mô tả ngắn"),
    ctaText: z.string().min(1, "Vui lòng nhập nút CTA"),
    ctaLink: z.string().min(1, "Vui lòng nhập link CTA"),
  }),
  seo: z.object({
    title: z.string().min(1, "Vui lòng nhập Meta Title"),
    description: z.string().min(1, "Vui lòng nhập Meta Description"),
    keywords: z.string().optional(),
  }),
  navbarLinks: z.array(linkItemSchema),
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
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "navigation">("general");

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      heroBanner: { title: "", subtitle: "", ctaText: "", ctaLink: "" },
      seo: { title: "", description: "", keywords: "" },
      navbarLinks: [],
      footerLinks: { products: [], explore: [] },
      footerContact: {
        phone: "0989 852 948",
        email: "ancungbatuyet@gmail.com",
        address: "Thái Nguyên, Việt Nam",
        workingHours: "T2 - T7: 8:00 - 17:00",
        shopeeUrl: "",
        tiktokUrl: "",
        facebookUrl: "",
      },
    },
  });

  const { control, register, handleSubmit, reset, formState: { errors } } = form;

  // Field arrays for menus
  const { fields: navbarFields, append: appendNavbar, remove: removeNavbar } = useFieldArray({
    control,
    name: "navbarLinks",
  });

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
    }
  }, [token]);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data && data.data) {
          // Fallbacks for arrays/objects in case of empty SiteConfig
          const config = data.data;
          reset({
            heroBanner: config.heroBanner || { title: "", subtitle: "", ctaText: "", ctaLink: "" },
            seo: config.seo || { title: "", description: "", keywords: "" },
            navbarLinks: config.navbarLinks || [
              { href: "/", label: "Trang chủ" },
              { href: "/san-pham", label: "Sản phẩm" },
              { href: "/quy-trinh", label: "Quy trình" },
              { href: "/he-thong-ban", label: "Hệ thống bán" },
              { href: "/gioi-thieu", label: "Giới thiệu" },
              { href: "/tin-tuc", label: "Tin tức" },
              { href: "/lien-he", label: "Liên hệ" },
            ],
            footerLinks: config.footerLinks || {
              products: [
                { href: "/san-pham/chan-ga", label: "Chân Gà Rút Xương" },
                { href: "/san-pham/tam-cay", label: "Tăm Cay" },
                { href: "/san-pham/banh-trang", label: "Snack Bánh Tráng" },
                { href: "/san-pham/bo-suu-tap", label: "Sản Phẩm Khác" },
              ],
              explore: [
                { href: "/quy-trinh", label: "Quy trình sản xuất" },
                { href: "/he-thong-ban", label: "Hệ thống điểm bán" },
                { href: "/gioi-thieu", label: "Về chúng tôi" },
                { href: "/tin-tuc", label: "Tin tức" },
                { href: "/lien-he", label: "Liên hệ" },
              ],
            },
            footerContact: config.footerContact || {
              phone: "0989 852 948",
              email: "ancungbatuyet@gmail.com",
              address: "Thái Nguyên, Việt Nam",
              workingHours: "T2 - T7: 8:00 - 17:00",
              shopeeUrl: "https://shopee.vn/nmtvlog99",
              tiktokUrl: "https://tiktok.com/@batuyethanhvi",
              facebookUrl: "https://facebook.com/ancungbatuyet",
            },
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
      toast.error("Không thể tải cấu hình");
    } finally {
      setLoading(false);
    }
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
              Cấu hình hệ thống & SEO
            </h1>
            <p className="text-slate-500 mt-1">Tùy biến nội dung Trang chủ, Thẻ SEO, Menu chính và Chân trang Footer động.</p>
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
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-6 py-3 font-bold text-sm border-b-2 transition-all ${
              activeTab === "general"
                ? "border-orange-500 text-orange-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-950"
            }`}
          >
            Nội dung chính & SEO
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
            {activeTab === "general" && (
              <div className="space-y-8 animate-fade-in">
                {/* Section: Hero Banner */}
                <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                    <LayoutDashboard className="text-orange-500" size={20} />
                    <h2 className="text-lg font-bold text-slate-900">Nội dung Trang chủ (Hero Banner)</h2>
                  </div>
                  <div className="p-6 space-y-5">
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
                  </div>
                </div>

                {/* Section: Global SEO */}
                <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
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
    </ProtectedRoute>
  );
}
