"use client";

import { AdminHeader } from "./AdminHeader";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "./ProtectedRoute";
import { ADMIN_PANEL_ROLES } from "@/lib/admin-navigation";
import { cn } from "@/components/ui/Button";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCollapsed(localStorage.getItem("admin_sidebar_collapsed") === "true");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleCollapsedChange = (nextCollapsed: boolean) => {
    setCollapsed(nextCollapsed);
    localStorage.setItem("admin_sidebar_collapsed", String(nextCollapsed));
  };

  if (isLoginPage) {
    return (
      <>
        <Toaster position="top-right" />
        <main className="min-h-screen bg-slate-50">{children}</main>
      </>
    );
  }

  return (
    <ProtectedRoute allowedRoles={ADMIN_PANEL_ROLES}>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <AdminHeader
        collapsed={collapsed}
        onCollapsedChange={handleCollapsedChange}
      />
      <main
        className={cn(
          "min-h-screen bg-slate-50 pt-16 transition-[margin] duration-300",
          collapsed ? "lg:ml-20" : "lg:ml-64",
        )}
      >
        <div className="mx-auto w-full max-w-[1600px] px-3 py-5 sm:px-5 sm:py-7 lg:px-7">
          {children}
        </div>
      </main>
    </ProtectedRoute>
  );
}
