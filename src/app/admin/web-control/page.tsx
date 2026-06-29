"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import {
  Activity,
  ArrowRight,
  AlertTriangle,
  Boxes,
  CheckCircle2,
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

type CoverageItem = {
  title: string;
  detail: string;
  href: string;
  percent: number;
  status: "done" | "partial" | "todo";
};

const statusText: Record<ControlItem["status"], string> = {
  ready: "Sửa trực tiếp",
  partial: "Đang gom tiếp",
  system: "Hệ thống",
};

const statusClass: Record<ControlItem["status"], string> = {
  ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
  partial: "border-amber-200 bg-amber-50 text-amber-700",
  system: "border-slate-200 bg-slate-100 text-slate-700",
};

const coverageClass: Record<CoverageItem["status"], string> = {
  done: "bg-emerald-500",
  partial: "bg-amber-500",
  todo: "bg-slate-400",
};

const coverageText: Record<CoverageItem["status"], string> = {
  done: "Đã quản lý tốt",
  partial: "Còn một phần hard-code",
  todo: "Cần chuyển tiếp",
};

const CMS_COVERAGE: CoverageItem[] = [
  {
    title: "Header, footer, SEO, liên hệ",
    detail: "Menu, chân trang, thông tin liên hệ, hero trang chủ và SEO cơ bản đã có màn cấu hình.",
    href: "/admin/settings",
    percent: 100,
    status: "done",
  },
  {
    title: "Ảnh, link, video theo trang",
    detail: "Các asset chính của Trang chủ, Giới thiệu và Quy trình đã gom vào Quản lý Marketing.",
    href: "/admin/marketing?tab=assets",
    percent: 100,
    status: "done",
  },
  {
    title: "Lịch sử, thành tựu, cộng đồng",
    detail: "Các cột mốc, chứng nhận, hoạt động cộng đồng đã sửa được từng dòng và từng ảnh.",
    href: "/admin/marketing?tab=history",
    percent: 100,
    status: "done",
  },
  {
    title: "Sản phẩm, bài viết, trang tĩnh",
    detail: "Dữ liệu chính đã chạy bằng CMS: sản phẩm, tin tức, danh mục, trang tùy chỉnh và SEO bài/trang.",
    href: "/admin/web-control?focus=content",
    percent: 95,
    status: "done",
  },
  {
    title: "Trang chủ",
    detail: "Hero, sản phẩm, tin tức, ảnh chứng thực đã có dữ liệu động; một số tiêu đề section và CTA phụ vẫn nằm trong code.",
    href: "/admin/settings",
    percent: 78,
    status: "partial",
  },
  {
    title: "Giới thiệu chung và Quy trình",
    detail: "Ảnh/link chính đã sửa được, nhưng vài headline, đoạn mô tả và block nội dung còn cần đưa tiếp vào cấu hình.",
    href: "/admin/marketing?tab=assets",
    percent: 70,
    status: "partial",
  },
  {
    title: "Theme, hiệu ứng, layout toàn web",
    detail: "Màu sắc, bo góc, motion và thứ tự section hiện vẫn do code quyết định; muốn full page builder thì cần module riêng.",
    href: "/admin/web-control",
    percent: 35,
    status: "todo",
  },
];

const NEXT_ACTIONS = [
  "Chuyển các headline/đoạn mô tả còn hard-code ở Trang chủ, Giới thiệu chung và Quy trình vào cấu hình CMS.",
  "Thêm module bật/tắt và sắp xếp section theo từng trang.",
  "Thêm cấu hình theme toàn web: màu chính, bo góc, shadow, mật độ spacing và motion.",
  "Thêm preview trước khi lưu cho các khu vực marketing lớn.",
];

const CONTROL_GROUPS: ControlGroup[] = [
  {
    title: "Bảng điều khiển tổng",
    description: "Các màn hình để kiểm tra sức khỏe website, thông tin chung, SEO và cấu hình nền.",
    icon: <LayoutDashboard size={20} />,
    items: [
      {
        title: "Trung tâm hệ thống",
        description: "Rà soát DB, env, cảnh báo dữ liệu, nhật ký gần đây và lối tắt quản trị.",
        href: "/admin/system",
        editLabel: "Kiểm tra hệ thống",
        tags: ["hệ thống", "db", "log", "cảnh báo", "tổng quan"],
        status: "system",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        title: "Cấu hình web cơ bản",
        description: "Tên website, mô tả, thông tin liên hệ, SEO mặc định và các thiết lập chung.",
        href: "/admin/settings",
        editLabel: "Sửa cấu hình",
        tags: ["seo", "setting", "website", "liên hệ", "logo"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "MARKETING"],
      },
      {
        title: "Thư viện ảnh",
        description: "Upload, tìm và lấy ảnh để gắn vào các khu vực trên website.",
        href: "/admin/media",
        editLabel: "Quản lý ảnh",
        tags: ["ảnh", "media", "upload", "hình"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "EDITOR"],
      },
    ],
  },
  {
    title: "Text và ảnh theo trang",
    description: "Các nội dung đang hiển thị trên website được gom lại theo đúng khu vực cần sửa.",
    icon: <MonitorCog size={20} />,
    items: [
      {
        title: "Ảnh và link trang",
        description: "Sửa ảnh, link, video và các asset đang gắn trên Trang chủ, Giới thiệu, Quy trình.",
        href: "/admin/marketing?tab=assets",
        publicHref: "/",
        editLabel: "Sửa ảnh/link",
        tags: ["trang chủ", "giới thiệu", "quy trình", "ảnh", "video", "link"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "MARKETING", "EDITOR"],
      },
      {
        title: "Lịch sử phát triển",
        description: "Thêm, sửa, xóa, sắp xếp từng cột mốc lịch sử, năm, text chi tiết và ảnh minh họa.",
        href: "/admin/marketing?tab=history",
        publicHref: "/gioi-thieu/lich-su",
        editLabel: "Sửa cột mốc",
        tags: ["lịch sử", "cột mốc", "timeline", "năm", "ảnh"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "MARKETING", "EDITOR"],
      },
      {
        title: "Thành tựu và uy tín",
        description: "Sửa các chứng nhận, bằng chứng, thành tựu, quy trình sạch và câu chuyện thương hiệu.",
        href: "/admin/marketing?tab=trust",
        publicHref: "/gioi-thieu/thanh-tuu",
        editLabel: "Sửa thành tựu",
        tags: ["thành tựu", "uy tín", "chứng nhận", "pháp lý", "ảnh"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "MARKETING", "EDITOR"],
      },
      {
        title: "Cộng đồng",
        description: "Sửa các hoạt động thiện nguyện, livestream, đối tác và thông điệp cộng đồng.",
        href: "/admin/marketing?tab=community",
        publicHref: "/gioi-thieu/cong-dong",
        editLabel: "Sửa cộng đồng",
        tags: ["cộng đồng", "thiện nguyện", "livestream", "đối tác"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "MARKETING", "EDITOR"],
      },
      {
        title: "Trang tĩnh",
        description: "Quản lý các trang nội dung tạo bằng CMS, slug, trạng thái xuất bản và nội dung SEO.",
        href: "/admin/pages",
        editLabel: "Quản lý trang",
        tags: ["page", "trang tĩnh", "nội dung", "seo", "slug"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "EDITOR", "MARKETING"],
      },
    ],
  },
  {
    title: "Nội dung và marketing",
    description: "Bài viết, báo chí, phản hồi, video và các dữ liệu truyền thông.",
    icon: <Megaphone size={20} />,
    items: [
      {
        title: "Bài viết",
        description: "Viết bài, sửa bài, xuất bản, lên lịch và quản lý nội dung tin tức.",
        href: "/admin/posts",
        publicHref: "/tin-tuc",
        editLabel: "Quản lý bài",
        tags: ["tin tức", "blog", "bài viết", "seo"],
        status: "ready",
      },
      {
        title: "Bài chờ duyệt",
        description: "Kiểm tra và phê duyệt các bài đang chờ biên tập viên hoặc admin xử lý.",
        href: "/admin/posts/review",
        editLabel: "Duyệt bài",
        tags: ["duyệt bài", "pending", "review"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "EDITOR"],
      },
      {
        title: "Danh mục bài viết",
        description: "Thêm, sửa, xóa các danh mục dùng cho tin tức và bài viết.",
        href: "/admin/categories",
        editLabel: "Sửa danh mục",
        tags: ["danh mục", "category", "tin tức"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "EDITOR"],
      },
      {
        title: "Tư liệu marketing",
        description: "Báo chí, feedback khách hàng, video và các khối nội dung truyền thông.",
        href: "/admin/marketing",
        editLabel: "Sửa marketing",
        tags: ["báo chí", "feedback", "video", "marketing"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "MARKETING", "EDITOR"],
      },
      {
        title: "Radar thương hiệu",
        description: "Theo dõi mention, nguồn nội dung và việc cần đội marketing/CSKH kiểm tra.",
        href: "/admin/media-intelligence",
        editLabel: "Mở radar",
        tags: ["radar", "thương hiệu", "cskh", "mention"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "MARKETING", "EDITOR"],
      },
    ],
  },
  {
    title: "Sản phẩm và bán hàng",
    description: "Dữ liệu sản phẩm, điểm bán, kênh online và các đường dẫn mua hàng.",
    icon: <ShoppingBag size={20} />,
    items: [
      {
        title: "Sản phẩm",
        description: "Thêm, sửa, ẩn hiện sản phẩm, giá, ảnh, mô tả, slug và link mua hàng.",
        href: "/admin/products",
        publicHref: "/san-pham",
        editLabel: "Quản lý sản phẩm",
        tags: ["sản phẩm", "giá", "ảnh", "mua hàng", "slug"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "EDITOR"],
      },
      {
        title: "Hệ thống bán",
        description: "Quản lý điểm bán, kênh online, địa chỉ, trạng thái hiển thị và link bán hàng.",
        href: "/admin/sales-channels",
        publicHref: "/he-thong-ban",
        editLabel: "Sửa điểm bán",
        tags: ["điểm bán", "kênh bán", "online", "store"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "EDITOR"],
      },
    ],
  },
  {
    title: "Vận hành và tài khoản",
    description: "Liên hệ khách hàng, tài khoản quản trị, phân quyền và dấu vết thay đổi.",
    icon: <ShieldCheck size={20} />,
    items: [
      {
        title: "Liên hệ khách hàng",
        description: "Xem và xử lý form liên hệ, yêu cầu hợp tác, tư vấn từ website.",
        href: "/admin/contacts",
        editLabel: "Xử lý liên hệ",
        tags: ["liên hệ", "khách hàng", "form", "cskh"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN", "MARKETING", "EDITOR"],
      },
      {
        title: "Thành viên",
        description: "Quản lý tài khoản admin, editor, marketing, author và phân quyền truy cập.",
        href: "/admin/users",
        editLabel: "Quản lý user",
        tags: ["user", "admin", "phân quyền", "tài khoản"],
        status: "ready",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        title: "Nhật ký hoạt động",
        description: "Xem ai đã sửa gì, lúc nào, ở khu vực nào trong hệ quản trị.",
        href: "/admin/activity-logs",
        editLabel: "Xem nhật ký",
        tags: ["log", "audit", "lịch sử", "hoạt động"],
        status: "system",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
];

const quickFilters = [
  { label: "Tất cả", value: "" },
  { label: "Trang chủ", value: "trang chủ" },
  { label: "Ảnh", value: "ảnh" },
  { label: "Lịch sử", value: "lịch sử" },
  { label: "Sản phẩm", value: "sản phẩm" },
  { label: "SEO", value: "seo" },
  { label: "Hệ thống", value: "hệ thống" },
];

const iconByTitle: Record<string, React.ReactNode> = {
  "Trung tâm hệ thống": <ServerCog size={18} />,
  "Cấu hình web cơ bản": <Settings size={18} />,
  "Thư viện ảnh": <ImageIcon size={18} />,
  "Ảnh và link trang": <Link2 size={18} />,
  "Lịch sử phát triển": <Activity size={18} />,
  "Thành tựu và uy tín": <ShieldCheck size={18} />,
  "Cộng đồng": <Users size={18} />,
  "Trang tĩnh": <Globe2 size={18} />,
  "Bài viết": <Newspaper size={18} />,
  "Bài chờ duyệt": <ClipboardList size={18} />,
  "Danh mục bài viết": <FolderKanban size={18} />,
  "Tư liệu marketing": <Megaphone size={18} />,
  "Radar thương hiệu": <Activity size={18} />,
  "Sản phẩm": <Boxes size={18} />,
  "Hệ thống bán": <Store size={18} />,
  "Liên hệ khách hàng": <Users size={18} />,
  "Thành viên": <Users size={18} />,
  "Nhật ký hoạt động": <ClipboardList size={18} />,
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
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
  const averageCoverage = Math.round(CMS_COVERAGE.reduce((sum, item) => sum + item.percent, 0) / CMS_COVERAGE.length);
  const partialCount = CMS_COVERAGE.filter((item) => item.status !== "done").length;

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "MARKETING", "EDITOR"]}>
      <div className="space-y-7 pb-16">
        <div className="border border-slate-800 bg-slate-950 p-6 text-white shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 bg-orange-500 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                <MonitorCog size={15} />
                Tổng quan quản trị
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Tổng quản lý website</h1>
              <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-slate-300">
                Một nơi gom tất cả khu vực admin hay phải sửa: text, ảnh, link, sản phẩm, bài viết, điểm bán, SEO, hệ thống và nhật ký.
              </p>
            </div>
            <div className="grid grid-cols-2 border border-slate-800 bg-slate-900">
              <div className="border-r border-slate-800 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Mục tìm thấy</p>
                <p className="mt-2 text-3xl font-black text-white">{totalItems}</p>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Sửa trực tiếp</p>
                <p className="mt-2 text-3xl font-black text-orange-400">{readyItems}</p>
              </div>
            </div>
          </div>
        </div>

        <section className="border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
            <div className="border-b border-slate-100 p-5 lg:border-b-0 lg:border-r">
              <div className="inline-flex h-11 w-11 items-center justify-center bg-orange-50 text-orange-600">
                <CheckCircle2 size={22} />
              </div>
              <h2 className="mt-4 text-xl font-black text-slate-950">Độ phủ quản lý toàn web</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                Rà soát nhanh khu vực nào admin đã sửa được, khu vực nào còn cần chuyển tiếp từ code sang CMS.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Độ phủ TB</p>
                  <p className="mt-2 text-3xl font-black text-slate-950">{averageCoverage}%</p>
                </div>
                <div className="border border-amber-200 bg-amber-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-700">Cần nâng</p>
                  <p className="mt-2 text-3xl font-black text-amber-800">{partialCount}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-3">
              {CMS_COVERAGE.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group border-b border-r border-slate-100 p-5 transition hover:bg-orange-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-black text-slate-950">{item.title}</h3>
                      <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">{item.detail}</p>
                    </div>
                    {item.status === "done" ? (
                      <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
                    ) : (
                      <AlertTriangle size={18} className="shrink-0 text-amber-600" />
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="h-2 w-full bg-slate-100">
                      <div className={`h-full ${coverageClass[item.status]}`} style={{ width: `${item.percent}%` }} />
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                        {coverageText[item.status]}
                      </span>
                      <span className="text-xs font-black text-slate-950">{item.percent}%</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm: ảnh trang chủ, lịch sử, sản phẩm, SEO, liên hệ..."
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
            <p className="text-lg font-black text-slate-950">Không tìm thấy mục phù hợp</p>
            <p className="mt-2 text-sm font-semibold text-slate-500">Thử tìm bằng từ ngắn hơn như ảnh, seo, sản phẩm, lịch sử.</p>
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
                    {group.items.length} mục
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
          <p className="flex items-center gap-2 text-sm font-black text-amber-800">
            <AlertTriangle size={17} />
            Việc nên nâng cấp tiếp
          </p>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {NEXT_ACTIONS.map((action) => (
              <div key={action} className="border border-amber-200 bg-white/70 p-3 text-sm font-semibold leading-6 text-amber-800">
                {action}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
