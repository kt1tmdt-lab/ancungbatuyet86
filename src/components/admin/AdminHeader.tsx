"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Bell, Clock, LogOut, Menu, X, FileText, Users, LayoutDashboard, ClipboardCheck, FolderKanban, FolderPlus, Globe, Store, ImagePlus, Megaphone, ClipboardList, Radar, ServerCog, MonitorCog } from "lucide-react";
import { toast } from "react-hot-toast";

type AdminNotification = {
  id: string;
  title: string;
  description: string;
  link: string;
  type: string;
  createdAt: string;
};

function formatTimeAgo(dateString: string) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
  } catch {
    return "";
  }
}

export function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [lastViewedTime, setLastViewedTime] = useState<string | null>(null);

  const latestNotificationTimeRef = useRef<string | null>(null);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  useEffect(() => {
    if (!user) return;

    const savedTime = localStorage.getItem("last_viewed_notifications_time");
    const initTimer = window.setTimeout(() => setLastViewedTime(savedTime), 0);

    const fetchNotifications = async (isInitial: boolean = false) => {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch("/api/admin/notifications", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) return;

        const data = (await res.json()) as AdminNotification[];
        setNotifications(data);

        const refTime = savedTime || localStorage.getItem("last_viewed_notifications_time") || new Date(0).toISOString();
        const unread = data.filter((n) => new Date(n.createdAt).getTime() > new Date(refTime).getTime()).length;
        setUnreadCount(unread);

        if (data.length > 0) {
          const newestItemTime = data[0].createdAt;
          
          if (!isInitial && latestNotificationTimeRef.current) {
            const previousLatestTime = new Date(latestNotificationTimeRef.current).getTime();
            const newItems = data
              .filter((n) => new Date(n.createdAt).getTime() > previousLatestTime)
              .reverse();

            newItems.forEach((item) => {
              toast((t) => (
                <div 
                  onClick={() => {
                    toast.dismiss(t.id);
                    router.push(item.link);
                  }}
                  className="cursor-pointer flex flex-col gap-1 p-1"
                >
                  <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    {item.title}
                  </span>
                  <span className="text-xs text-slate-600 line-clamp-2">
                    {item.description}
                  </span>
                </div>
              ), {
                duration: 6000,
                position: "top-right",
                icon: item.type === "CONTACT" ? "📞" : "⚙️",
              });
            });
          }

          latestNotificationTimeRef.current = newestItemTime;
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications(true);

    const interval = setInterval(() => {
      fetchNotifications(false);
    }, 15000);

    return () => {
      window.clearTimeout(initTimer);
      clearInterval(interval);
    };
  }, [user, router]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClose = () => setDropdownOpen(false);
    window.addEventListener("click", handleClose);
    return () => window.removeEventListener("click", handleClose);
  }, [dropdownOpen]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);

    const nowStr = new Date().toISOString();
    localStorage.setItem("last_viewed_notifications_time", nowStr);
    setLastViewedTime(nowStr);
    setUnreadCount(0);
  };

  const roleLabels: Record<string, string> = {
    SUPER_ADMIN: "👑 Quản trị tối cao",
    ADMIN: "👨‍💼 Quản trị viên",
    EDITOR: "✍️ Biên tập viên",
    AUTHOR: "📝 Tác giả",
    MARKETING: "📢 Tiếp thị",
    SUPPORT: "🛠️ Hỗ trợ",
    USER: "👤 Thành viên",
  };

  const isAdminOrEditor = user?.role === "ADMIN" || user?.role === "EDITOR";
  const isMarketingAllowed = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" || user?.role === "MARKETING" || user?.role === "EDITOR";
  const isSettingsAllowed = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" || user?.role === "MARKETING";
  const isAdminOrSuperAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const isContactAllowed = isAdminOrEditor || user?.role === "SUPER_ADMIN" || user?.role === "MARKETING";
  const isPageManager = isContactAllowed;

  const groupedNavItems = [
    {
      group: "Tổng quan",
      items: [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard, show: true },
        { href: "/admin/web-control", label: "Tổng quản lý web", icon: MonitorCog, show: isMarketingAllowed },
      ],
    },
    {
      group: "Nội dung",
      items: [
        { href: "/admin/posts", label: "Bài viết", icon: FileText, show: true },
        { href: "/admin/posts/review", label: "Bài chờ duyệt", icon: ClipboardCheck, show: isAdminOrEditor },
        { href: "/admin/categories", label: "Danh mục", icon: FolderKanban, show: isAdminOrEditor },
        { href: "/admin/pages", label: "Trang", icon: Globe, show: isPageManager },
        { href: "/admin/media", label: "Thư viện ảnh", icon: ImagePlus, show: isAdminOrEditor },
      ],
    },
    {
      group: "Cửa hàng",
      items: [
        { href: "/admin/products", label: "Sản phẩm", icon: FolderPlus, show: isAdminOrEditor },
        { href: "/admin/sales-channels", label: "Hệ thống bán", icon: Store, show: isAdminOrEditor },
      ],
    },
    {
      group: "Marketing & CSKH",
      items: [
        { href: "/admin/marketing", label: "Quản lý Marketing", icon: Megaphone, show: isMarketingAllowed },
        { href: "/admin/media-intelligence", label: "Radar Thương Hiệu", icon: Radar, show: isMarketingAllowed },
        { href: "/admin/marketing?tab=assets", label: "Ảnh & link trang", icon: ImagePlus, show: isMarketingAllowed },
        { href: "/admin/contacts", label: "Liên hệ", icon: Users, show: isContactAllowed },
      ],
    },
    {
      group: "Hệ thống",
      items: [
        { href: "/admin/system", label: "Trung tâm hệ thống", icon: ServerCog, show: isAdminOrSuperAdmin },
        { href: "/admin/settings", label: "Cấu hình Web", icon: Globe, show: isSettingsAllowed },
        { href: "/admin/activity-logs", label: "Nhật ký hoạt động", icon: ClipboardList, show: isAdminOrSuperAdmin },
        { href: "/admin/users", label: "Thành viên", icon: Users, show: isAdminOrSuperAdmin },
      ],
    },
  ];

  const visibleGroups = groupedNavItems
    .map((g) => ({
      ...g,
      items: g.items.filter((item) => item.show),
    }))
    .filter((g) => g.items.length > 0);

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

            {/* Bell Notification */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-full transition relative flex items-center justify-center focus:outline-none"
                aria-label="Xem thông báo"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-slate-900 animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {dropdownOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-800 border border-slate-700 rounded-lg shadow-xl text-slate-200 z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between bg-slate-900">
                    <span className="font-bold text-sm text-white">🔔 Thông báo hệ thống</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => {
                          const nowStr = new Date().toISOString();
                          localStorage.setItem("last_viewed_notifications_time", nowStr);
                          setLastViewedTime(nowStr);
                          setUnreadCount(0);
                        }}
                        className="text-xs text-orange-400 hover:text-orange-300 font-semibold"
                      >
                        Đánh dấu đã đọc
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-700/50">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-slate-400">
                        Không có thông báo mới nào.
                      </div>
                    ) : (
                      notifications.map((item) => {
                        const isNew = lastViewedTime 
                          ? new Date(item.createdAt).getTime() > new Date(lastViewedTime).getTime()
                          : true;
                        
                        return (
                          <Link
                            key={item.id}
                            href={item.link}
                            onClick={() => setDropdownOpen(false)}
                            className={`flex gap-3 px-4 py-3 hover:bg-slate-700/40 transition text-left block w-full ${
                              isNew ? "bg-slate-700/20 border-l-2 border-orange-500" : ""
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                item.type === "CONTACT" 
                                  ? "bg-blue-500/10 text-blue-400" 
                                  : "bg-orange-500/10 text-orange-400"
                              }`}>
                                {item.type === "CONTACT" ? (
                                  <Users size={14} />
                                ) : (
                                  <ClipboardList size={14} />
                                )}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-semibold text-slate-200 truncate ${isNew ? "text-orange-400" : ""}`}>
                                {item.title}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                                <Clock size={10} />
                                {formatTimeAgo(item.createdAt)}
                              </p>
                            </div>
                          </Link>
                        );
                      })
                    )}
                  </div>

                  <div className="px-4 py-2 border-t border-slate-700 bg-slate-900 text-center">
                    <Link
                      href="/admin/activity-logs"
                      onClick={() => setDropdownOpen(false)}
                      className="text-xs text-slate-400 hover:text-white font-semibold block w-full"
                    >
                      Xem toàn bộ nhật ký hoạt động
                    </Link>
                  </div>
                </div>
              )}
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
          <div className="lg:hidden bg-slate-900 border-t border-slate-800 shadow-xl py-3 px-4 animate-fade-in max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="sm:hidden pb-3 mb-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-200">{user?.name || user?.email}</span>
                <span className="text-xs text-orange-400">{roleLabels[user?.role || ""]}</span>
              </div>
            </div>
            <nav className="space-y-4">
              {visibleGroups.map((group) => (
                <div key={group.group} className="space-y-1">
                  <span className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1 mt-3 first:mt-0">
                    {group.group}
                  </span>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2 text-sm font-semibold transition ${
                            isActive
                              ? "bg-orange-500 text-white shadow-md shadow-orange-500/10"
                              : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                          }`}
                        >
                          <item.icon size={18} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
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
        <div className="space-y-6 flex flex-col min-h-0">
          <div className="px-3 py-2 bg-slate-800/40  border border-slate-800/60 flex items-center gap-3 shrink-0">
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

          <nav className="space-y-5 overflow-y-auto pr-1 flex-1 scrollbar-thin scrollbar-thumb-slate-800">
            {visibleGroups.map((group) => (
              <div key={group.group} className="space-y-1">
                <span className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1 mt-3 first:mt-0">
                  {group.group}
                </span>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-2.5  text-sm font-semibold transition-all ${
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
                </div>
              </div>
            ))}
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
