"use client";

import Link from "next/link";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import {
  ArrowRight,
  History,
  Home,
  Megaphone,
  Menu,
  Newspaper,
  Package,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  Users,
} from "lucide-react";

const pageGroups = [
  {
    title: "Trang chủ",
    description: "Các phần đang xuất hiện ngay khi khách truy cập mở website.",
    items: [
      { title: "Hero đầu trang", description: "Ảnh Bà Tuyết, tiêu đề, mô tả, số liệu và hai nút bấm.", href: "/admin/settings?tab=hero", icon: Home },
      { title: "Nội dung trang chủ", description: "Tiêu đề, mô tả, bật/tắt section, ảnh và link đang dùng trên trang chủ.", href: "/admin/site-content?tab=home", icon: Home },
      { title: "Sản phẩm nổi bật", description: "Chọn sản phẩm, ảnh, mô tả và liên kết mua hàng.", href: "/admin/products", icon: Package },
    ],
  },
  {
    title: "Thanh đầu trang và chân trang",
    description: "Các thành phần dùng chung trên toàn bộ website.",
    items: [
      { title: "Menu website", description: "Tên mục menu và đường dẫn khi khách bấm vào.", href: "/admin/settings?tab=navigation", icon: Menu },
      { title: "Chân trang và liên hệ", description: "Các link footer, hotline, email, địa chỉ và mạng xã hội.", href: "/admin/settings?tab=navigation", icon: ShoppingBag },
      { title: "SEO website", description: "Tiêu đề và mô tả hiển thị trên Google.", href: "/admin/settings?tab=seo", icon: Search },
    ],
  },
  {
    title: "Giới thiệu thương hiệu",
    description: "Lịch sử, uy tín và hoạt động của Ăn Cùng Bà Tuyết.",
    items: [
      { title: "Lịch sử phát triển", description: "Các cột mốc, năm, nội dung và ảnh minh họa.", href: "/admin/site-content?tab=history", icon: History },
      { title: "Thành tựu và uy tín", description: "Chứng nhận, kiểm nghiệm và thông tin tạo niềm tin.", href: "/admin/site-content?tab=trust", icon: ShieldCheck },
      { title: "Hoạt động cộng đồng", description: "Thiện nguyện, livestream, đối tác và hoạt động xã hội.", href: "/admin/site-content?tab=community", icon: Users },
    ],
  },
  {
    title: "Bán hàng và truyền thông",
    description: "Những dữ liệu được cập nhật thường xuyên.",
    items: [
      { title: "Sản phẩm", description: "Thêm, sửa, ẩn hiện sản phẩm, giá, ảnh và link mua.", href: "/admin/products", icon: Package },
      { title: "Điểm bán", description: "Điểm bán, kênh online và đường dẫn mua hàng.", href: "/admin/sales-channels", icon: Store },
      { title: "Tin tức", description: "Viết, sửa và xuất bản bài viết trên website.", href: "/admin/posts", icon: Newspaper },
      { title: "Báo chí và phản hồi", description: "Bài báo, nhận xét khách hàng và video thương hiệu.", href: "/admin/marketing", icon: Megaphone },
    ],
  },
  {
    title: "Chất lượng & bằng chứng",
    description: "Cấu hình riêng trang Chất lượng đúng layout đang hiển thị ngoài website.",
    items: [
      { title: "Trang Chất lượng", description: "Sửa hero, nguồn nguyên liệu, nhà máy, hồ sơ pháp lý, PVI, chính sách, FAQ và ảnh popup.", href: "/admin/quality", icon: ShieldCheck },
    ],
  },
];

export default function AdminWebControlPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "MARKETING", "EDITOR"]}>
      <div className="mx-auto max-w-7xl space-y-8 pb-16">
        <header className="border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">Quản lý website</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Anh muốn sửa khu vực nào?</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Chọn đúng khu vực đang nhìn thấy trên website. Mỗi nút dưới đây dẫn thẳng tới màn hình chỉnh sửa tương ứng.
          </p>
          <Link href="/" target="_blank" className="mt-5 inline-flex items-center gap-2 border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-orange-500 hover:text-orange-600">
            Xem website hiện tại <ArrowRight size={16} />
          </Link>
        </header>

        {pageGroups.map((group) => (
          <section key={group.title}>
            <div className="mb-4">
              <h2 className="text-xl font-black text-slate-950">{group.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{group.description}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={`${item.title}-${item.href}`} href={item.href} className="group flex min-h-44 flex-col border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-400 hover:shadow-md">
                    <span className="flex h-11 w-11 items-center justify-center bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white"><Icon size={21} /></span>
                    <h3 className="mt-4 font-black text-slate-950">{item.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">{item.description}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-orange-600">Mở để chỉnh sửa <ArrowRight size={14} /></span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        <div className="border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-900">
          <span className="font-black">Trang nội dung tự tạo:</span>{" "}
          Nếu cần tạo một trang hoàn toàn mới, vào <Link href="/admin/pages" className="font-bold underline">Quản lý trang</Link>.
          Đây là chức năng nâng cao, không dùng để sửa các khu vực có sẵn ở trên.
        </div>
      </div>
    </ProtectedRoute>
  );
}
