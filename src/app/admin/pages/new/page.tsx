"use client";

import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { PageForm } from "@/components/admin/PageForm";

export default function AdminNewPage() {
  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "EDITOR", "MARKETING"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Thêm trang tùy biến</h1>
          <p className="text-slate-500 text-sm mt-1">Dựng giao diện Landing Page mới cho các chiến dịch marketing bằng các khối cấu trúc linh hoạt.</p>
        </div>

        <PageForm />
      </div>
    </ProtectedRoute>
  );
}
