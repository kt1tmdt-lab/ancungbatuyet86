import { AuthProvider } from "@/lib/auth-context";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export const metadata = {
  title: "Quản trị website | Ăn Cùng Bà Tuyết",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </AuthProvider>
  );
}
