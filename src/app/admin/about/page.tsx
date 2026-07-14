"use client";

import Link from "next/link";
import { ArrowRight, Building2, Eye, Film, ImageIcon, Route, ShieldCheck, Target, Users } from "lucide-react";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

const aboutSections = [
  {
    title: "Video, gallery và ảnh trang Giới thiệu",
    description: "Sửa video giới thiệu, ảnh quy trình, gallery và ảnh quote đang dùng trên /gioi-thieu.",
    href: "/admin/site-content?tab=about",
    icon: ImageIcon,
  },
  {
    title: "Thông tin doanh nghiệp / thành tựu",
    description: "Sửa các card uy tín, chứng nhận, bảo hiểm và năng lực đang gộp vào section Thông tin doanh nghiệp.",
    href: "/admin/site-content?tab=trust",
    icon: ShieldCheck,
  },
  {
    title: "Bảng thông tin doanh nghiệp",
    description: "Sửa tiêu đề, mô tả và từng dòng trong bảng thông tin thương hiệu, pháp nhân, nhà máy, kênh phân phối.",
    href: "/admin/site-content?tab=homeTexts",
    icon: Building2,
  },
  {
    title: "Sứ mệnh, tầm nhìn và giá trị",
    description: "Sửa nhãn, tiêu đề, mô tả và 4 thẻ Sứ mệnh / Tầm nhìn / Giá trị cốt lõi / Con người.",
    href: "/admin/site-content?tab=homeTexts",
    icon: Target,
  },
  {
    title: "Hành trình phát triển",
    description: "Sửa cột mốc, năm, mô tả, ảnh và thứ tự hiển thị trong section Hành trình phát triển.",
    href: "/admin/site-content?tab=history",
    icon: Route,
  },
  {
    title: "Cộng đồng",
    description: "Sửa hoạt động cộng đồng, khách hàng, livestream, thiện nguyện hoặc nội dung xã hội.",
    href: "/admin/site-content?tab=community",
    icon: Users,
  },
  {
    title: "Video TikTok",
    description: "Quản lý các video/tài khoản nguồn nếu trang Giới thiệu dùng video truyền thông.",
    href: "/admin/tiktok",
    icon: Film,
  },
];

export default function AdminAboutPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "MARKETING", "EDITOR"]}>
      <div className="mx-auto max-w-7xl space-y-6 pb-16">
        <header className="flex flex-col gap-4 border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">Cấu hình website</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Trang Giới thiệu</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Trang Giới thiệu giờ là một trang tổng. Ba trang con cũ đã được gộp thành section trong /gioi-thieu.
            </p>
          </div>
          <Link href="/gioi-thieu" target="_blank" className="inline-flex items-center gap-2 border border-slate-300 px-4 py-3 text-xs font-black uppercase tracking-wide text-slate-700 hover:border-orange-500 hover:text-orange-600">
            <Eye size={15} /> Xem trang
          </Link>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {aboutSections.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="group flex min-h-48 flex-col border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-400 hover:shadow-md">
                <span className="flex h-11 w-11 items-center justify-center bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white"><Icon size={21} /></span>
                <h2 className="mt-4 font-black text-slate-950">{item.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">{item.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-orange-600">Mở phần cấu hình <ArrowRight size={14} /></span>
              </Link>
            );
          })}
        </div>
      </div>
    </ProtectedRoute>
  );
}
