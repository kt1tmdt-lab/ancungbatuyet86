"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import {
  Activity,
  ArrowRight,
  Boxes,
  ClipboardList,
  Eye,
  FileText,
  FolderKanban,
  Globe2,
  Image as ImageIcon,
  LayoutDashboard,
  Link2,
  Megaphone,
  MonitorCog,
  Newspaper,
  Search,
  ServerCog,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Store,
  Users,
} from "lucide-react";

type ControlItem = {
  title: string;
  description: string;
  href: string;
  publicHref?: string;
  editLabel: string;
  tags: string[];
  status: "ready" | "partial" | "system";
  roles?: string[];
};

type ControlGroup = {
  title: string;
  description: string;
  icon: React.ReactNode;
  items: ControlItem[];
};

const statusText: Record<ControlItem["status"], string> = {
  ready: "Sua truc tiep",
  partial: "Dang gom tiep",
  system: "He thong",
};

const statusClass: Record<ControlItem["status"], string> = {
  ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
  partial: "border-amber-200 bg-amber-50 text-amber-700",
  system: "border-slate-200 bg-slate-100 text-slate-700",
};

const CONTROL_GROUPS: ControlGroup[] = [
  {
    title: "Ban dieu khien tong",
    description: "Cac man hinh de kiem tra suc khoe website, thong tin chung, SEO va cau hinh nen.",
    icon: <LayoutDashboard size={20} />,
    items: [
      {
        title: "Trung tam he thong",
        description: "Rao soat DB, env, canh bao du lieu, nhat ky gan day va loi tat quan tri.",
        href: "/admin/system",
        editLabel: "Kiem tra he thong",
        tags: ["he thong", "db", "log", "canh bao", "tong quan"],
        status: "system",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        title: "Cau hinh web co ban",
        description: "Ten website, mo ta, thong tin lien he, SEO mac dinh va cac thiet lap chung.",
        href: "/admin/settings",
        editLabel: "Sua cau hinh",
        tags: ["seo", "setting", "website", "lien he", "logo"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "MARKETING"],
      },
      {
        title: "Thu vien anh",
        description: "Upload, tim va lay anh de gan vao cac khu vuc tren website.",
        href: "/admin/media",
        editLabel: "Quan ly anh",
        tags: ["anh", "media", "upload", "hinh"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "EDITOR"],
      },
    ],
  },
  {
    title: "Text va anh theo trang",
    description: "Cac noi dung dang hien thi tren website duoc gom lai theo dung khu vuc can sua.",
    icon: <MonitorCog size={20} />,
    items: [
      {
        title: "Anh va link trang",
        description: "Sua anh, link, video va cac asset dang gan tren Trang chu, Gioi thieu, Quy trinh.",
        href: "/admin/marketing?tab=assets",
        publicHref: "/",
        editLabel: "Sua anh/link",
        tags: ["trang chu", "gioi thieu", "quy trinh", "anh", "video", "link"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "MARKETING", "EDITOR"],
      },
      {
        title: "Lich su phat trien",
        description: "Them, sua, xoa, sap xep tung cot moc lich su, nam, text chi tiet va anh minh hoa.",
        href: "/admin/marketing?tab=history",
        publicHref: "/gioi-thieu/lich-su",
        editLabel: "Sua cot moc",
        tags: ["lich su", "cot moc", "timeline", "nam", "anh"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "MARKETING", "EDITOR"],
      },
      {
        title: "Thanh tuu va uy tin",
        description: "Sua cac chung nhan, bang chung, thanh tuu, quy trinh sach va cau chuyen thuong hieu.",
        href: "/admin/marketing?tab=trust",
        publicHref: "/gioi-thieu/thanh-tuu",
        editLabel: "Sua thanh tuu",
        tags: ["thanh tuu", "uy tin", "chung nhan", "phap ly", "anh"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "MARKETING", "EDITOR"],
      },
      {
        title: "Cong dong",
        description: "Sua cac hoat dong thien nguyen, livestream, doi tac va thong diep cong dong.",
        href: "/admin/marketing?tab=community",
        publicHref: "/gioi-thieu/cong-dong",
        editLabel: "Sua cong dong",
        tags: ["cong dong", "thien nguyen", "livestream", "doi tac"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "MARKETING", "EDITOR"],
      },
      {
        title: "Trang tinh",
        description: "Quan ly cac trang noi dung tao bang CMS, slug, trang thai xuat ban va noi dung SEO.",
        href: "/admin/pages",
        editLabel: "Quan ly trang",
        tags: ["page", "trang tinh", "noi dung", "seo", "slug"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "EDITOR", "MARKETING"],
      },
    ],
  },
  {
    title: "Noi dung va marketing",
    description: "Bai viet, bao chi, phan hoi, video va cac du lieu truyen thong.",
    icon: <Megaphone size={20} />,
    items: [
      {
        title: "Bai viet",
        description: "Viet bai, sua bai, xuat ban, len lich va quan ly noi dung tin tuc.",
        href: "/admin/posts",
        publicHref: "/tin-tuc",
        editLabel: "Quan ly bai",
        tags: ["tin tuc", "blog", "bai viet", "seo"],
        status: "ready",
      },
      {
        title: "Bai cho duyet",
        description: "Kiem tra va phe duyet cac bai dang cho bien tap vien hoac admin xu ly.",
        href: "/admin/posts/review",
        editLabel: "Duyet bai",
        tags: ["duyet bai", "pending", "review"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "EDITOR"],
      },
      {
        title: "Danh muc bai viet",
        description: "Them, sua, xoa cac danh muc dung cho tin tuc va bai viet.",
        href: "/admin/categories",
        editLabel: "Sua danh muc",
        tags: ["danh muc", "category", "tin tuc"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "EDITOR"],
      },
      {
        title: "Tu lieu marketing",
        description: "Bao chi, feedback khach hang, video va cac khoi noi dung truyen thong.",
        href: "/admin/marketing",
        editLabel: "Sua marketing",
        tags: ["bao chi", "feedback", "video", "marketing"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "MARKETING", "EDITOR"],
      },
      {
        title: "Radar thuong hieu",
        description: "Theo doi mention, nguon noi dung va viec can doi marketing/CSKH kiem tra.",
        href: "/admin/media-intelligence",
        editLabel: "Mo radar",
        tags: ["radar", "thuong hieu", "cskh", "mention"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "MARKETING", "EDITOR"],
      },
    ],
  },
  {
    title: "San pham va ban hang",
    description: "Du lieu san pham, diem ban, kenh online va cac duong dan mua hang.",
    icon: <ShoppingBag size={20} />,
    items: [
      {
        title: "San pham",
        description: "Them, sua, an hien san pham, gia, anh, mo ta, slug va link mua hang.",
        href: "/admin/products",
        publicHref: "/san-pham",
        editLabel: "Quan ly san pham",
        tags: ["san pham", "gia", "anh", "mua hang", "slug"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "EDITOR"],
      },
      {
        title: "He thong ban",
        description: "Quan ly diem ban, kenh online, dia chi, trang thai hien thi va link ban hang.",
        href: "/admin/sales-channels",
        publicHref: "/he-thong-ban",
        editLabel: "Sua diem ban",
        tags: ["diem ban", "kenh ban", "online", "store"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "EDITOR"],
      },
    ],
  },
  {
    title: "Van hanh va tai khoan",
    description: "Lien he khach hang, tai khoan quan tri, phan quyen va dau vet thay doi.",
    icon: <ShieldCheck size={20} />,
    items: [
      {
        title: "Lien he khach hang",
        description: "Xem va xu ly form lien he, yeu cau hop tac, tu van tu website.",
        href: "/admin/contacts",
        editLabel: "Xu ly lien he",
        tags: ["lien he", "khach hang", "form", "cskh"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "MARKETING", "EDITOR"],
      },
      {
        title: "Thanh vien",
        description: "Quan ly tai khoan admin, editor, marketing, author va phan quyen truy cap.",
        href: "/admin/users",
        editLabel: "Quan ly user",
        tags: ["user", "admin", "phan quyen", "tai khoan"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        title: "Nhat ky hoat dong",
        description: "Xem ai da sua gi, luc nao, o khu vuc nao trong he quan tri.",
        href: "/admin/activity-logs",
        editLabel: "Xem nhat ky",
        tags: ["log", "audit", "lich su", "hoat dong"],
        status: "system",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
];

const quickFilters = [
  { label: "Tat ca", value: "" },
  { label: "Trang chu", value: "trang chu" },
  { label: "Anh", value: "anh" },
  { label: "Lich su", value: "lich su" },
  { label: "San pham", value: "san pham" },
  { label: "SEO", value: "seo" },
  { label: "He thong", value: "he thong" },
];

const iconByTitle: Record<string, React.ReactNode> = {
  "Trung tam he thong": <ServerCog size={18} />,
  "Cau hinh web co ban": <Settings size={18} />,
  "Thu vien anh": <ImageIcon size={18} />,
  "Anh va link trang": <Link2 size={18} />,
  "Lich su phat trien": <Activity size={18} />,
  "Thanh tuu va uy tin": <ShieldCheck size={18} />,
  "Cong dong": <Users size={18} />,
  "Trang tinh": <Globe2 size={18} />,
  "Bai viet": <Newspaper size={18} />,
  "Bai cho duyet": <ClipboardList size={18} />,
  "Danh muc bai viet": <FolderKanban size={18} />,
  "Tu lieu marketing": <Megaphone size={18} />,
  "Radar thuong hieu": <Activity size={18} />,
  "San pham": <Boxes size={18} />,
  "He thong ban": <Store size={18} />,
  "Lien he khach hang": <Users size={18} />,
  "Thanh vien": <Users size={18} />,
  "Nhat ky hoat dong": <ClipboardList size={18} />,
};

function normalize(text: string) {
  return text.toLowerCase().trim();
}

function itemMatches(item: ControlItem, query: string) {
  if (!query) return true;
  const haystack = normalize(`${item.title} ${item.description} ${item.tags.join(" ")}`);
  return haystack.includes(query);
}

export default function AdminWebControlPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");

  const normalizedQuery = normalize(query);
  const userRole = user?.role;

  const visibleGroups = useMemo(() => {
    return CONTROL_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const roleAllowed = !item.roles || (userRole && item.roles.includes(userRole));
        return roleAllowed && itemMatches(item, normalizedQuery);
      }),
    })).filter((group) => group.items.length > 0);
  }, [normalizedQuery, userRole]);

  const totalItems = visibleGroups.reduce((sum, group) => sum + group.items.length, 0);
  const readyItems = visibleGroups.reduce(
    (sum, group) => sum + group.items.filter((item) => item.status === "ready").length,
    0,
  );

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "MARKETING", "EDITOR"]}>
      <div className="space-y-7 pb-16">
        <div className="border border-slate-800 bg-slate-950 p-6 text-white shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 bg-orange-500 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                <MonitorCog size={15} />
                Tong quan quan tri
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Tong quan ly website</h1>
              <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-slate-300">
                Mot noi gom tat ca khu vuc admin hay phai sua: text, anh, link, san pham, bai viet, diem ban, SEO, he thong va nhat ky.
              </p>
            </div>
            <div className="grid grid-cols-2 border border-slate-800 bg-slate-900">
              <div className="border-r border-slate-800 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Muc tim thay</p>
                <p className="mt-2 text-3xl font-black text-white">{totalItems}</p>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Sua truc tiep</p>
                <p className="mt-2 text-3xl font-black text-orange-400">{readyItems}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tim: anh trang chu, lich su, san pham, SEO, lien he..."
                className="h-12 w-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white"
              />
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              {quickFilters.map((filter) => (
                <button
                  key={filter.label}
                  type="button"
                  onClick={() => setQuery(filter.value)}
                  className={`whitespace-nowrap border px-3 py-2 text-xs font-black uppercase tracking-wider transition ${
                    query === filter.value
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:bg-orange-50"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {visibleGroups.length === 0 ? (
          <div className="border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-lg font-black text-slate-950">Khong tim thay muc phu hop</p>
            <p className="mt-2 text-sm font-semibold text-slate-500">Thu tim bang tu ngan hon nhu anh, seo, san pham, lich su.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {visibleGroups.map((group) => (
              <section key={group.title} className="border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-orange-50 text-orange-600">
                      {group.icon}
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-950">{group.title}</h2>
                      <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{group.description}</p>
                    </div>
                  </div>
                  <span className="w-fit border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-600">
                    {group.items.length} muc
                  </span>
                </div>

                <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((item) => (
                    <div key={`${group.title}-${item.title}`} className="border-b border-r border-slate-100 p-5 last:border-b-0">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-slate-100 text-slate-700">
                          {iconByTitle[item.title] || <FileText size={18} />}
                        </div>
                        <span className={`border px-2 py-1 text-[10px] font-black uppercase tracking-wider ${statusClass[item.status]}`}>
                          {statusText[item.status]}
                        </span>
                      </div>
                      <h3 className="text-base font-black text-slate-950">{item.title}</h3>
                      <p className="mt-2 min-h-14 text-sm font-medium leading-6 text-slate-500">{item.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <Link
                          href={item.href}
                          className="inline-flex items-center gap-2 bg-slate-950 px-4 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-orange-600"
                        >
                          {item.editLabel}
                          <ArrowRight size={14} />
                        </Link>
                        {item.publicHref && (
                          <Link
                            href={item.publicHref}
                            target="_blank"
                            className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
                          >
                            <Eye size={14} />
                            Xem web
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <div className="border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-black text-amber-800">Ghi chu de nang cap tiep</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-amber-700">
            Trang nay da gom cac chuc nang dang co vao mot noi. De thanh full page builder dung nghia, buoc tiep theo la chuyen cac section con hard-code tren tung trang thanh du lieu CMS co the bat/tat, sap xep va sua inline.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
