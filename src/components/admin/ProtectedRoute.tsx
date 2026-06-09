"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthRole } from "@/lib/auth";

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
    if (!loading) {
      if (!user) {
        router.push("/admin/login");
      } else {
        const hasRequiredRole = !requiredRole || user.role === requiredRole;
        const hasAllowedRole = !allowedRoles || allowedRoles.includes(user.role);
        
        if (!hasRequiredRole || !hasAllowedRole) {
          router.push("/admin");
        }
      }
    }
  }, [user, loading, requiredRole, allowedRoles, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12  bg-primary flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold">BT</span>
          </div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const hasRequiredRole = !requiredRole || user.role === requiredRole;
  const hasAllowedRole = !allowedRoles || allowedRoles.includes(user.role);

  if (!hasRequiredRole || !hasAllowedRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 font-semibold">Bạn không có quyền truy cập trang này</p>
      </div>
    );
  }

  return <>{children}</>;
}
