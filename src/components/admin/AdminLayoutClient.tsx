"use client";

import { AdminHeader } from "./AdminHeader";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <>
      <Toaster position="top-right" />
      {!isLoginPage && <AdminHeader />}
      <main className={`min-h-screen bg-gray-50 ${isLoginPage ? "" : "pt-16 lg:ml-64"}`}>
        <div className={isLoginPage ? "" : "max-w-7xl mx-auto px-4 sm:px-6 py-8"}>
          {children}
        </div>
      </main>
    </>
  );
}
