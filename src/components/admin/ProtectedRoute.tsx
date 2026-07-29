"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthRole } from "@/lib/auth";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { AdminLoadingState } from "./AdminPrimitives";
import Button from "@/components/ui/Button";

export function ProtectedRoute({
  children,
  requiredRole,
  allowedRoles,
}: {
  children: React.ReactNode;
  requiredRole?: AuthRole;
  allowedRoles?: AuthRole[];
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <AdminLoadingState title="Đang xác thực phiên làm việc" />;
  }

  if (!user) {
    return null;
  }

  const hasRequiredRole = !requiredRole || user.role === requiredRole;
  const hasAllowedRole = !allowedRoles || allowedRoles.includes(user.role);

  if (!hasRequiredRole || !hasAllowedRole) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-4">
        <div className="w-full max-w-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <span className="mx-auto grid h-14 w-14 place-items-center border border-red-200 bg-red-50 text-red-600">
            <ShieldAlert size={26} />
          </span>
          <h1 className="mt-5 text-xl font-black text-slate-950">
            Không có quyền truy cập
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Tài khoản hiện tại không được cấp quyền sử dụng khu vực này.
          </p>
          <Button
            href="/admin"
            variant="adminSecondary"
            className="mt-6"
          >
            Về bảng điều khiển
          </Button>
          <Link
            href="/"
            className="mt-3 block text-xs font-bold text-slate-500 hover:text-orange-600"
          >
            Trở về website
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
