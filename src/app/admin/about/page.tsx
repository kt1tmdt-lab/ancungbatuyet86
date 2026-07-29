"use client";

import Link from "next/link";
import { ArrowRight, Eye, FileText, Film, ImageIcon } from "lucide-react";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

const ABOUT_MANAGEMENT_AREAS = [
  {
    title: "Toàn bộ nội dung đang hiển thị",
    description:
      "Sửa hành trình thương hiệu, ba ô số liệu, bốn bằng chứng, sứ mệnh, tầm nhìn, triết lý, giá trị cốt lõi và CTA cuối trang.",
    href: "/admin/site-content?tab=homeTexts&scope=about",
    icon: FileText,
  },
  {
    title: "Video câu chuyện thương hiệu",
    description:
      "Chọn video hoặc thay liên kết YouTube đang được nhúng trên trang Giới thiệu.",
    href: "/admin/site-content?tab=home&scope=about",
    icon: Film,
  },
  {
    title: "Thư viện hình ảnh",
    description:
      "Tải ảnh mới lên một lần rồi chọn lại trong các màn hình cấu hình nội dung.",
    href: "/admin/media",
    icon: ImageIcon,
  },
];

export default function AdminAboutPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "MARKETING", "EDITOR"]}>
      <div className="mx-auto max-w-7xl space-y-6 pb-16">
        <header className="flex flex-col gap-4 border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">
              Quản lý website
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Trang Giới thiệu
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Các mục dưới đây khớp trực tiếp với nội dung đang xuất hiện trên
              trang công khai. Thay đổi được lưu tại một nơi và áp dụng ngay
              cho trang Giới thiệu.
            </p>
          </div>
          <Link
            href="/gioi-thieu"
            target="_blank"
            className="inline-flex items-center gap-2 border border-slate-300 px-4 py-3 text-xs font-black uppercase tracking-wide text-slate-700 transition hover:border-orange-500 hover:text-orange-600"
          >
            <Eye size={15} />
            Xem trang
          </Link>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ABOUT_MANAGEMENT_AREAS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex min-h-52 flex-col border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-400 hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center bg-orange-50 text-orange-600 transition group-hover:bg-orange-600 group-hover:text-white">
                  <Icon size={21} />
                </span>
                <h2 className="mt-4 text-lg font-black text-slate-950">{item.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-orange-600">
                  Mở để chỉnh sửa
                  <ArrowRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </ProtectedRoute>
  );
}
