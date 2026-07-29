import type { LucideIcon } from "lucide-react";
import {
  ClipboardCheck,
  ClipboardList,
  FileText,
  FolderKanban,
  FolderPlus,
  Gauge,
  Globe2,
  ImagePlus,
  Megaphone,
  MonitorCog,
  Radar,
  ServerCog,
  Settings2,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import type { AuthRole } from "@/lib/auth";

export const ADMIN_PANEL_ROLES: AuthRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "EDITOR",
  "AUTHOR",
  "MARKETING",
  "SUPPORT",
];

const CONTENT_ROLES: AuthRole[] = ["SUPER_ADMIN", "ADMIN", "EDITOR"];
const PAGE_ROLES: AuthRole[] = ["SUPER_ADMIN", "ADMIN", "EDITOR", "MARKETING"];
const MARKETING_ROLES: AuthRole[] = ["SUPER_ADMIN", "ADMIN", "EDITOR", "MARKETING"];
const SYSTEM_ROLES: AuthRole[] = ["SUPER_ADMIN", "ADMIN"];

export const ADMIN_ROLE_LABELS: Record<AuthRole, string> = {
  SUPER_ADMIN: "Quản trị tối cao",
  ADMIN: "Quản trị viên",
  EDITOR: "Biên tập viên",
  AUTHOR: "Tác giả",
  MARKETING: "Marketing",
  SUPPORT: "Hỗ trợ",
  USER: "Thành viên",
};

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: AuthRole[];
  exact?: boolean;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

export const ADMIN_NAVIGATION: AdminNavGroup[] = [
  {
    label: "Tổng quan",
    items: [
      {
        href: "/admin",
        label: "Bảng điều khiển",
        icon: Gauge,
        roles: ADMIN_PANEL_ROLES,
        exact: true,
      },
      {
        href: "/admin/web-control",
        label: "Quản lý website",
        icon: MonitorCog,
        roles: PAGE_ROLES,
      },
    ],
  },
  {
    label: "Nội dung",
    items: [
      {
        href: "/admin/posts",
        label: "Bài viết",
        icon: FileText,
        roles: ["SUPER_ADMIN", "ADMIN", "EDITOR", "AUTHOR"],
      },
      {
        href: "/admin/posts/review",
        label: "Bài chờ duyệt",
        icon: ClipboardCheck,
        roles: CONTENT_ROLES,
      },
      {
        href: "/admin/categories",
        label: "Danh mục",
        icon: FolderKanban,
        roles: CONTENT_ROLES,
      },
      {
        href: "/admin/pages",
        label: "Trang tùy biến",
        icon: Globe2,
        roles: PAGE_ROLES,
      },
      {
        href: "/admin/media",
        label: "Thư viện ảnh",
        icon: ImagePlus,
        roles: CONTENT_ROLES,
      },
    ],
  },
  {
    label: "Sản phẩm & phân phối",
    items: [
      {
        href: "/admin/products",
        label: "Sản phẩm",
        icon: FolderPlus,
        roles: CONTENT_ROLES,
      },
      {
        href: "/admin/sales-channels",
        label: "Điểm bán",
        icon: Store,
        roles: CONTENT_ROLES,
      },
    ],
  },
  {
    label: "Thương hiệu & khách hàng",
    items: [
      {
        href: "/admin/marketing",
        label: "Nội dung thương hiệu",
        icon: Megaphone,
        roles: MARKETING_ROLES,
      },
      {
        href: "/admin/media-intelligence",
        label: "Radar thương hiệu",
        icon: Radar,
        roles: MARKETING_ROLES,
      },
      {
        href: "/admin/contacts",
        label: "Liên hệ khách hàng",
        icon: Users,
        roles: [...MARKETING_ROLES, "SUPPORT"],
      },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      {
        href: "/admin/system",
        label: "Trạng thái hệ thống",
        icon: ServerCog,
        roles: SYSTEM_ROLES,
      },
      {
        href: "/admin/settings",
        label: "Cấu hình website",
        icon: Settings2,
        roles: ["SUPER_ADMIN", "ADMIN", "MARKETING"],
      },
      {
        href: "/admin/activity-logs",
        label: "Nhật ký hoạt động",
        icon: ClipboardList,
        roles: SYSTEM_ROLES,
      },
      {
        href: "/admin/users",
        label: "Thành viên",
        icon: ShieldCheck,
        roles: SYSTEM_ROLES,
      },
    ],
  },
];

export function getVisibleAdminNavigation(role?: AuthRole | null) {
  if (!role) return [];

  return ADMIN_NAVIGATION.map((group) => ({
    ...group,
    items: group.items.filter((item) => item.roles.includes(role)),
  })).filter((group) => group.items.length > 0);
}

export function getActiveAdminPath(pathname: string, groups: AdminNavGroup[]) {
  const candidates = groups
    .flatMap((group) => group.items)
    .filter((item) =>
      item.exact
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(`${item.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length);

  return candidates[0]?.href ?? null;
}
