"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/lib/auth-context";
import {
  ADMIN_ROLE_LABELS,
  getActiveAdminPath,
  getVisibleAdminNavigation,
} from "@/lib/admin-navigation";
import { adminRequest } from "@/lib/admin-client";
import { cn } from "@/components/ui/Button";

type AdminNotification = {
  id: string;
  title: string;
  description: string;
  link: string;
  type: string;
  createdAt: string;
};

type AdminHeaderProps = {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
};

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  const elapsed = Date.now() - date.getTime();
  const minutes = Math.max(0, Math.floor(elapsed / 60_000));
  const hours = Math.floor(elapsed / 3_600_000);
  const days = Math.floor(elapsed / 86_400_000);

  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  return `${days} ngày trước`;
}

function getSafeNotificationLink(link: string) {
  return link.startsWith("/admin") ? link : "/admin/activity-logs";
}

function isAdminHrefActive(
  href: string,
  pathname: string,
  searchParams: { get(name: string): string | null },
) {
  const [targetPath, queryString] = href.split("?");
  const pathMatches =
    pathname === targetPath || pathname.startsWith(`${targetPath}/`);
  if (!pathMatches) return false;
  if (!queryString) return true;

  const expectedParams = new URLSearchParams(queryString);
  return Array.from(expectedParams.entries()).every(
    ([key, value]) => searchParams.get(key) === value,
  );
}

export function AdminHeader({
  collapsed,
  onCollapsedChange,
}: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const notificationRef = useRef<HTMLDivElement>(null);
  const latestNotificationTimeRef = useRef<string | null>(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [expandedNavigation, setExpandedNavigation] = useState<
    Record<string, boolean>
  >({});
  const [lastViewedTime, setLastViewedTime] = useState<string | null>(() =>
    typeof window === "undefined"
      ? null
      : localStorage.getItem("last_viewed_notifications_time"),
  );

  const visibleGroups = useMemo(
    () => getVisibleAdminNavigation(user?.role),
    [user?.role],
  );
  const activePath = useMemo(
    () => {
      const websiteControl = visibleGroups
        .flatMap((group) => group.items)
        .find((item) => item.href === "/admin/web-control");
      const isWebsiteChildActive = websiteControl?.children?.some((child) =>
        isAdminHrefActive(child.href, pathname, searchParams),
      );

      return isWebsiteChildActive
        ? "/admin/web-control"
        : getActiveAdminPath(pathname, visibleGroups);
    },
    [pathname, searchParams, visibleGroups],
  );

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!notificationsOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!notificationRef.current?.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNotificationsOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [notificationsOpen]);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    const fetchNotifications = async (initial = false) => {
      try {
        const token = localStorage.getItem("auth_token");
        const data = await adminRequest<AdminNotification[]>(
          "/api/admin/notifications",
          { token },
        );
        if (cancelled) return;

        setNotifications(data);
        const referenceTime =
          localStorage.getItem("last_viewed_notifications_time") ||
          new Date(0).toISOString();
        setUnreadCount(
          data.filter(
            (item) =>
              new Date(item.createdAt).getTime() >
              new Date(referenceTime).getTime(),
          ).length,
        );

        const newestTime = data[0]?.createdAt;
        if (
          !initial &&
          newestTime &&
          latestNotificationTimeRef.current
        ) {
          const previousTime = new Date(
            latestNotificationTimeRef.current,
          ).getTime();
          data
            .filter(
              (item) => new Date(item.createdAt).getTime() > previousTime,
            )
            .reverse()
            .forEach((item) => {
              toast(
                (notificationToast) => (
                  <button
                    type="button"
                    onClick={() => {
                      toast.dismiss(notificationToast.id);
                      router.push(getSafeNotificationLink(item.link));
                    }}
                    className="flex w-full flex-col gap-1 text-left"
                  >
                    <span className="text-sm font-black text-slate-900">
                      {item.title}
                    </span>
                    <span className="line-clamp-2 text-xs leading-5 text-slate-600">
                      {item.description}
                    </span>
                  </button>
                ),
                { duration: 6000, position: "top-right" },
              );
            });
        }

        if (newestTime) latestNotificationTimeRef.current = newestTime;
      } catch {
        // Notifications are supplementary; do not interrupt the admin workflow.
      }
    };

    void fetchNotifications(true);
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void fetchNotifications(false);
      }
    }, 60_000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [router, user]);

  const markNotificationsViewed = () => {
    const now = new Date().toISOString();
    localStorage.setItem("last_viewed_notifications_time", now);
    setLastViewedTime(now);
    setUnreadCount(0);
  };

  const handleNotificationToggle = () => {
    setNotificationsOpen((open) => !open);
    markNotificationsViewed();
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/admin/login");
  };

  const renderNavigation = (isCollapsed: boolean) => (
    <nav className="space-y-5" aria-label="Điều hướng quản trị">
      {visibleGroups.map((group) => (
        <div key={group.label}>
          {!isCollapsed ? (
            <p className="mb-1.5 px-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
              {group.label}
            </p>
          ) : null}
          <div className="space-y-1">
            {group.items.map((item) => {
              const activeChild = item.children?.find((child) =>
                isAdminHrefActive(child.href, pathname, searchParams),
              );
              const isActive =
                activePath === item.href || Boolean(activeChild);
              const isExpanded =
                expandedNavigation[item.href] ?? isActive;

              if (item.children?.length && !isCollapsed) {
                return (
                  <div key={item.href}>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedNavigation((current) => ({
                          ...current,
                          [item.href]: !isExpanded,
                        }))
                      }
                      aria-expanded={isExpanded}
                      className={cn(
                        "group relative flex min-h-11 w-full items-center gap-3 px-3 text-left text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-400",
                        isActive
                          ? "bg-orange-600 text-white shadow-lg shadow-orange-950/20"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white",
                      )}
                    >
                      <item.icon
                        size={18}
                        className="shrink-0"
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1 truncate">
                        {item.label}
                      </span>
                      <ChevronDown
                        size={15}
                        className={cn(
                          "shrink-0 transition-transform duration-200",
                          isExpanded && "rotate-180",
                        )}
                        aria-hidden="true"
                      />
                    </button>

                    <div
                      className={cn(
                        "grid overflow-hidden transition-[grid-template-rows,opacity] duration-200",
                        isExpanded
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="min-h-0">
                        <div className="ml-5 mt-1 space-y-0.5 border-l border-slate-700 py-1 pl-3">
                          {item.children.map((child) => {
                            const isChildActive =
                              activeChild?.href === child.href;
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                  "flex min-h-9 items-center border-l-2 px-3 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400",
                                  isChildActive
                                    ? "border-orange-500 bg-slate-800 text-orange-300"
                                    : "border-transparent text-slate-400 hover:border-slate-500 hover:bg-slate-800 hover:text-white",
                                )}
                              >
                                <span className="truncate">{child.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  title={isCollapsed ? item.label : undefined}
                  className={cn(
                    "group relative flex min-h-11 items-center gap-3 px-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-400",
                    isCollapsed && "justify-center px-2",
                    isActive
                      ? "bg-orange-600 text-white shadow-lg shadow-orange-950/20"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white",
                  )}
                >
                  <item.icon
                    size={18}
                    className="shrink-0"
                    aria-hidden="true"
                  />
                  {!isCollapsed ? (
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  ) : null}
                  {isActive && !isCollapsed ? (
                    <ChevronRight size={14} aria-hidden="true" />
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-slate-800 bg-slate-950 text-white shadow-sm">
        <div className="flex h-full items-center justify-between gap-3 px-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="acbt-icon-btn grid h-10 w-10 place-items-center text-slate-300 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 lg:hidden"
              aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={21} /> : <Menu size={21} />}
            </button>

            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex min-w-0 items-center gap-2.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden bg-white">
                <Image
                  src="/logo-acbt.png"
                  alt="Ăn Cùng Bà Tuyết"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className="block truncate text-sm font-black leading-tight">
                  Ăn Cùng Bà Tuyết
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-orange-400">
                  Quản trị website
                </span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden text-right md:block">
              <p className="max-w-48 truncate text-xs font-bold text-slate-100">
                {user?.name || user?.email}
              </p>
              <p className="text-[10px] font-semibold text-slate-400">
                {user?.role ? ADMIN_ROLE_LABELS[user.role] : ""}
              </p>
            </div>

            <div ref={notificationRef} className="relative">
              <button
                type="button"
                onClick={handleNotificationToggle}
                className="acbt-icon-btn relative grid h-10 w-10 place-items-center text-slate-300 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                aria-label="Xem thông báo"
                aria-expanded={notificationsOpen}
              >
                <Bell size={19} />
                {unreadCount > 0 ? (
                  <span className="absolute right-1 top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                ) : null}
              </button>

              {notificationsOpen ? (
                <div className="absolute right-0 mt-2 w-[min(24rem,calc(100vw-1.5rem))] overflow-hidden border border-slate-200 bg-white text-slate-900 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <div>
                      <p className="text-sm font-black">Thông báo</p>
                      <p className="text-[11px] text-slate-500">
                        Hoạt động mới nhất trong hệ thống
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={markNotificationsViewed}
                      className="text-[11px] font-bold text-orange-600 hover:text-orange-700"
                    >
                      Đánh dấu đã đọc
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="px-4 py-8 text-center text-sm text-slate-500">
                        Chưa có thông báo mới.
                      </p>
                    ) : (
                      notifications.map((item) => {
                        const isNew = lastViewedTime
                          ? new Date(item.createdAt).getTime() >
                            new Date(lastViewedTime).getTime()
                          : true;
                        return (
                          <Link
                            key={item.id}
                            href={getSafeNotificationLink(item.link)}
                            onClick={() => setNotificationsOpen(false)}
                            className={cn(
                              "flex gap-3 border-b border-slate-100 px-4 py-3 transition last:border-b-0 hover:bg-slate-50",
                              isNew && "border-l-2 border-l-orange-500 bg-orange-50/50",
                            )}
                          >
                            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center bg-slate-100 text-slate-600">
                              {item.type === "CONTACT" ? (
                                <Users size={15} />
                              ) : (
                                <ClipboardList size={15} />
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-xs font-black">
                                {item.title}
                              </span>
                              <span className="mt-0.5 line-clamp-2 block text-[11px] leading-5 text-slate-500">
                                {item.description}
                              </span>
                              <span className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                                <Clock3 size={10} />
                                {formatTimeAgo(item.createdAt)}
                              </span>
                            </span>
                          </Link>
                        );
                      })
                    )}
                  </div>
                  <Link
                    href="/admin/activity-logs"
                    onClick={() => setNotificationsOpen(false)}
                    className="block border-t border-slate-100 bg-slate-50 px-4 py-3 text-center text-xs font-black text-slate-700 hover:text-orange-600"
                  >
                    Xem nhật ký hoạt động
                  </Link>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="acbt-icon-btn inline-flex h-10 items-center gap-2 px-3 text-slate-300 hover:bg-red-500/15 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              aria-label="Đăng xuất"
            >
              <LogOut size={18} />
              <span className="hidden text-xs font-bold sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      <aside
        className={cn(
          "fixed bottom-0 left-0 top-16 z-40 hidden flex-col border-r border-slate-800 bg-slate-950 px-3 py-4 text-white transition-[width] duration-300 lg:flex",
          collapsed ? "w-20" : "w-64",
        )}
      >
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-4">
          {renderNavigation(collapsed)}
        </div>
        <div className="border-t border-slate-800 pt-3">
          <button
            type="button"
            onClick={() => onCollapsedChange(!collapsed)}
            className={cn(
              "flex min-h-10 w-full items-center gap-3 px-3 text-xs font-bold text-slate-400 transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400",
              collapsed && "justify-center px-2",
            )}
            aria-label={collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
            title={collapsed ? "Mở rộng" : undefined}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            {!collapsed ? <span>Thu gọn thanh bên</span> : null}
          </button>
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 top-16 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
            aria-label="Đóng menu"
          />
          <aside className="relative h-full w-[min(21rem,88vw)] overflow-y-auto border-r border-slate-800 bg-slate-950 px-4 py-5 text-white shadow-2xl">
            <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-black">
                  {user?.name || user?.email}
                </p>
                <p className="mt-0.5 text-xs text-orange-400">
                  {user?.role ? ADMIN_ROLE_LABELS[user.role] : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="grid h-9 w-9 place-items-center text-slate-400 hover:bg-slate-800 hover:text-white"
                aria-label="Đóng menu"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
            {renderNavigation(false)}
          </aside>
        </div>
      ) : null}
    </>
  );
}
