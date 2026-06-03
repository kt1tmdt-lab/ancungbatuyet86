"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Menu, X, FileText, Users, LayoutDashboard, ClipboardCheck, FolderKanban, FolderPlus, Globe } from "lucide-react";
import { useState } from "react";

export function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const roleLabels: Record<string, string> = {
    ADMIN: "👨‍💼 Quản trị viên",
    EDITOR: "✍️ Biên tập viên",
    AUTHOR: "📝 Tác giả",
    USER: "👤 Thành viên",
  };

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/posts", label: "Bài viết", icon: FileText },
    ...((user?.role === "ADMIN" || user?.role === "EDITOR")
      ? [
          { href: "/admin/posts/review", label: "Bài chờ duyệt", icon: ClipboardCheck },
          { href: "/admin/categories", label: "Danh mục", icon: FolderKanban },
          { href: "/admin/products", label: "Sản phẩm", icon: FolderPlus },
          { href: "/admin/pages", label: "Trang", icon: Globe },
        ]
      : []),
    ...(user?.role === "ADMIN" ? [{ href: "/admin/users", label: "Thành viên", icon: Users }] : []),
  ];

  return (
    <>
      {/* Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900 text-slate-100 border-b border-slate-800 shadow-sm">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800  transition"
              aria-label="Toggle Sidebar"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-9 h-9 overflow-hidden  border border-slate-700 flex items-center justify-center bg-white shadow-md shadow-orange-500/10">
                <img src="/logo-acbt.png" alt="Ăn Cùng Bà Tuyết Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-sm tracking-wide leading-none">BÀ TUYẾT</span>
                <span className="text-[10px] text-orange-400 font-semibold tracking-wider">CMS PANEL</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-200">{user?.name || user?.email}</span>
              <span className="text-xs text-orange-400 font-medium">
                {roleLabels[user?.role || ""] || "👤 Thành viên"}
              </span>
            </div>
            
            <div className="w-px h-6 bg-slate-800 hidden sm:block" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10  transition border border-transparent hover:border-red-500/20"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* Mobile sidebar list */}
        {sidebarOpen && (
          <div className="lg:hidden bg-slate-900 border-t border-slate-800 shadow-xl py-3 px-4 animate-fade-in">
            <div className="sm:hidden pb-3 mb-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-200">{user?.name || user?.email}</span>
                <span className="text-xs text-orange-400">{roleLabels[user?.role || ""]}</span>
              </div>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5  text-sm font-semibold transition ${
                      isActive
                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/10"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 pt-3 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5  text-sm font-semibold text-red-400 hover:bg-red-500/10 transition"
              >
                <LogOut size={18} />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:fixed left-0 top-16 bottom-0 w-64 bg-slate-900 border-r border-slate-800 p-4 z-30 flex-col justify-between">
        <div className="space-y-6">
          <div className="px-3 py-2 bg-slate-800/40  border border-slate-800/60 flex items-center gap-3">
            <div className="w-10 h-10  bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-slate-700">
              {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-200 truncate">{user?.name || "Người dùng"}</span>
              <span className="text-xs text-orange-400 truncate font-semibold">
                {roleLabels[user?.role || ""] || "Thành viên"}
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3  text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/10 translate-x-1"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                  }`}
                >
                  <item.icon size={18} className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-100"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5  text-sm font-semibold text-red-400 hover:text-white hover:bg-red-500 transition-all border border-red-500/20 hover:border-transparent"
          >
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
          <p className="text-[10px] text-slate-500 text-center">
            Ăn Cùng Bà Tuyết CMS v2.0
          </p>
        </div>
      </aside>

      {/* Main content offset - only on desktop */}
      <div className="hidden lg:block lg:w-64 shrink-0" />
    </>
  );
}
