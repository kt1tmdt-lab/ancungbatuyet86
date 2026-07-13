"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import {
  Plus,
  Loader,
  AlertCircle,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Globe,
  Wand2
} from "lucide-react";
import Link from "next/link";
import { DEFAULT_INFO_PAGES } from "@/lib/default-info-pages";
import { getSystemPageSeedContent as getCleanSystemPageSeedContent, isVisibleSystemPage } from "@/lib/system-page-seeds";

interface PageData {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  updatedAt: string;
}

function getSystemPageSeedContent(fallback: (typeof DEFAULT_INFO_PAGES)[string]) {
  if (fallback.routePath !== "/chat-luong") return fallback.blocks;

  return [
    {
      id: "chat-luong-hero",
      type: "hero",
      data: {
        label: "Chất lượng",
        title: "Chất lượng kiểm chứng được",
        subtitle: "Nguyên liệu, nhà máy, chứng nhận và bảo hiểm — mọi thứ đều có hồ sơ. Nội dung nào chưa có file public sẽ ghi rõ [cần bổ sung].",
        backgroundImage: "/bento/bento-factory.png",
        ctaText: "Xem hồ sơ pháp lý",
        ctaLink: "#ho-so-phap-ly"
      }
    },
    {
      id: "chat-luong-nguyen-lieu",
      type: "split",
      data: {
        title: "Nguyên liệu nhập khẩu từ châu Âu — có truy xuất",
        description: "Nguyên liệu chính như chân gà được định hướng công khai theo hồ sơ nhập khẩu từ Ba Lan, Hungary và các nước châu Âu khác. Cần bổ sung C/O, phiếu kiểm dịch và hồ sơ lô hàng tương ứng trước khi public claim đầy đủ.",
        imageUrl: "/bento/bento-ingredients.png",
        imagePosition: "right",
        ctaText: "Cần bổ sung video truy xuất",
        ctaLink: "#"
      }
    },
    {
      id: "chat-luong-facts",
      type: "features",
      data: {
        title: "Các điểm cần có bằng chứng đi kèm",
        subtitle: "Bên thứ ba nói thay, thương hiệu không tự tuyên bố.",
        items: [
          { icon: "Wheat", title: "Nhập khẩu từ Ba Lan, Hungary", description: "[cần bổ sung hồ sơ lô hàng public]" },
          { icon: "FileCheck2", title: "Có C/O và phiếu kiểm dịch", description: "[cần bổ sung ảnh scan]" },
          { icon: "Snowflake", title: "Lưu kho lạnh theo quy chuẩn", description: "[cần bổ sung ảnh kho lạnh]" }
        ]
      }
    },
    {
      id: "chat-luong-factory",
      type: "split",
      data: {
        title: "Nhà máy sản xuất NMV Food — Thái Nguyên",
        description: "NMV Food đạt chứng nhận ISO 22000:2018. Quy trình nên được mô tả là quy trình 6 bước có kiểm soát: nguyên liệu → sơ chế → chế biến → QC → đóng gói → giao hàng. Không dùng các cụm như an toàn tuyệt đối hoặc vô trùng.",
        imageUrl: "/bento/bento-factory.png",
        imagePosition: "left",
        ctaText: "Xem quy trình",
        ctaLink: "/chat-luong/nha-may-quy-trinh-san-xuat"
      }
    },
    {
      id: "chat-luong-documents",
      type: "features",
      data: {
        title: "Hồ sơ pháp lý & chứng nhận",
        subtitle: "Mỗi card nên có ảnh scan hoặc PDF để khách hàng, đối tác và báo chí kiểm chứng.",
        items: [
          { icon: "BadgeCheck", title: "ISO 22000:2018", description: "Ghi rõ: Cấp cho NMV Food. [cần bổ sung scan]" },
          { icon: "ClipboardCheck", title: "HACCP", description: "Chương trình đào tạo, NMV Food. [cần bổ sung hồ sơ]" },
          { icon: "FileCheck2", title: "Giấy phép ATTP", description: "Giấy đủ điều kiện ATTP. [cần bổ sung ảnh/PDF]" },
          { icon: "FileSearch", title: "Phiếu kiểm nghiệm", description: "VNTEST — kiểm nghiệm định kỳ hàng tháng (NMV Food). [cần bổ sung phiếu mới nhất]" }
        ]
      }
    },
    {
      id: "chat-luong-pvi",
      type: "text",
      data: {
        backgroundColor: "white",
        content: "<h2>Bảo hiểm trách nhiệm sản phẩm — PVI</h2><p>ACBT mua bảo hiểm trách nhiệm sản phẩm từ PVI. Đây là cam kết trách nhiệm nếu sản phẩm gây thiệt hại cho người tiêu dùng theo phạm vi hợp đồng, không phải chứng nhận chất lượng và không được trình bày như PVI xác nhận chất lượng sản phẩm.</p><p><strong>[cần xác nhận]</strong> Pháp nhân trên hợp đồng PVI và phạm vi bảo hiểm cụ thể.</p>"
      }
    },
    {
      id: "chat-luong-policy",
      type: "features",
      data: {
        title: "Chính sách bảo vệ quyền lợi khách hàng",
        subtitle: "Tóm tắt các điểm chính, bản đầy đủ nên dẫn sang trang hoặc PDF riêng.",
        items: [
          { icon: "Info", title: "Quyền được thông tin", description: "Sản phẩm ghi rõ thành phần, NSX, HSD." },
          { icon: "RefreshCw", title: "Quyền đổi trả", description: "Quy trình đổi trả khi sản phẩm lỗi. [cần bổ sung chi tiết]" },
          { icon: "MessageCircle", title: "Quyền khiếu nại", description: "Kênh tiếp nhận và thời gian xử lý. [cần bổ sung SLA]" },
          { icon: "Headphones", title: "Kênh hỗ trợ", description: "Hotline, email, thời gian làm việc. [cần bổ sung thông tin chính thức]" }
        ]
      }
    }
  ];
}

export default function AdminPagesList() {
  const router = useRouter();
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    fetch("/api/pages", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch pages");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setPages(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) console.error("Failed to fetch pages:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleDelete = async (pageId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa trang này không? Bố cục thiết kế sẽ bị mất vĩnh viễn.")) return;
    
    setActionLoading(pageId);
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        setPages((currentPages) => currentPages.filter((p) => p.id !== pageId));
      } else {
        const errData = await res.json();
        alert(errData.error || "Không thể xóa trang");
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi xóa trang");
    } finally {
      setActionLoading(null);
    }
  };

  const systemPages = Object.values(DEFAULT_INFO_PAGES).filter(isVisibleSystemPage).map((page) => ({
    ...page,
    cmsPage: pages.find((existing) => existing.slug === page.cmsSlug)
  }));

  const handleCreateSystemPage = async (cmsSlug: string) => {
    const fallback = Object.values(DEFAULT_INFO_PAGES).find((page) => page.cmsSlug === cmsSlug);
    if (!fallback || !token) return;

    setActionLoading(cmsSlug);
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: fallback.title,
          slug: fallback.cmsSlug,
          status: "PUBLISHED",
          content: getCleanSystemPageSeedContent(fallback)
        })
      });

      if (res.ok) {
        const created = await res.json();
        setPages((currentPages) => [created, ...currentPages]);
        router.push(`/admin/pages/${created.id}/edit`);
        return;
      }

      const errData = await res.json();
      alert(errData.error || "Khong the tao trang cau hinh");
    } catch (err) {
      console.error(err);
      alert("Da xay ra loi khi tao trang cau hinh");
    } finally {
      setActionLoading(null);
    }
  };

  // Filter search
  const filteredPages = pages
    .filter((page) => page.slug === "chat-luong" || !page.slug.startsWith("chat-luong-"))
    .filter((page) =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "EDITOR", "MARKETING"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Globe className="text-primary-dark" size={28} />
              Quản lý Trang động
            </h1>
            <p className="text-slate-500 text-sm mt-1">Dựng Landing Page, trang sự kiện, hoặc các trang phụ tùy biến với Block Builder.</p>
          </div>
          <Link
            href="/admin/pages/new"
            className="acbt-btn acbt-btn--admin acbt-btn--md self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Thêm Trang Mới</span>
          </Link>
        </div>

        <div className="bg-white  border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="border border-primary/20 bg-orange-50/50 p-5">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-950 flex items-center gap-2">
                  <Wand2 size={19} className="text-primary-dark" />
                  Trang menu can cau hinh
                </h2>
                <p className="text-xs text-slate-600 mt-1 max-w-3xl">
                  Cac trang nay da co route that tren header. Neu chua tao ban CMS, website se dung noi dung mac dinh.
                  Bam Tao & sua de cau hinh tung chu, tung anh va them/sua/xoa cac khoi lap lai.
                </p>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary-dark bg-white border border-primary/20 px-3 py-1">
                {systemPages.filter((page) => page.cmsPage).length}/{systemPages.length} da co CMS
              </span>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
              {systemPages.map((page) => {
                const cmsPage = page.cmsPage;
                return (
                  <div key={page.routePath} className="bg-white border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-extrabold text-slate-950 leading-tight line-clamp-2">{page.title}</p>
                        <p className="text-[11px] font-mono text-slate-500 mt-1 break-all">{page.routePath}</p>
                        <p className="text-[11px] text-slate-400 mt-1 break-all">CMS slug: {page.cmsSlug}</p>
                      </div>
                      <span className={`shrink-0 border px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                        cmsPage ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-50 text-slate-500 border-slate-200"
                      }`}>
                        {cmsPage ? "Co CMS" : "Mac dinh"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      {cmsPage ? (
                        <Link
                          href={`/admin/pages/${cmsPage.id}/edit`}
                          className="acbt-btn acbt-btn--admin acbt-btn--sm"
                        >
                          <Edit3 size={14} />
                          Sua noi dung
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleCreateSystemPage(page.cmsSlug)}
                          disabled={actionLoading === page.cmsSlug}
                          className="acbt-btn acbt-btn--admin acbt-btn--sm disabled:opacity-60"
                        >
                          {actionLoading === page.cmsSlug ? <Loader size={14} className="animate-spin" /> : <Plus size={14} />}
                          Tao & sua
                        </button>
                      )}
                      <Link
                        href={page.routePath}
                        target="_blank"
                        className="acbt-icon-btn p-2 text-slate-500 hover:bg-slate-100 hover:text-primary-dark"
                        title="Xem route public"
                      >
                        <ExternalLink size={15} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pb-2">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Tìm tên trang, slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200  text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
              />
            </div>
          </div>

          {/* Listing */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader className="animate-spin text-primary-dark" size={36} />
              <p className="text-xs font-semibold text-slate-400">Đang tải danh sách trang...</p>
            </div>
          ) : filteredPages.length === 0 ? (
            <div className="text-center py-20 text-slate-400 space-y-2">
              <AlertCircle size={40} className="mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-600">Không tìm thấy trang nào</p>
              <p className="text-xs text-slate-400">Nhấp nút &quot;Thêm Trang Mới&quot; để tạo trang tùy biến đầu tiên.</p>
            </div>
          ) : (
            <div className="overflow-x-auto  border border-slate-100">
              <table className="w-full text-sm text-left text-slate-700">
                <thead className="text-xs text-slate-400 uppercase bg-slate-50 border-b border-slate-100 font-bold">
                  <tr>
                    <th className="px-5 py-4">Tên trang</th>
                    <th className="px-5 py-4">Đường dẫn tĩnh (Slug)</th>
                    <th className="px-5 py-4 text-center">Trạng thái</th>
                    <th className="px-5 py-4 text-center">Cập nhật lúc</th>
                    <th className="px-5 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredPages.map((page) => {
                    const isDraft = page.status === "DRAFT";
                    return (
                      <tr key={page.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-5 py-4">
                          <span className="font-extrabold text-slate-900 leading-tight block">
                            {page.title}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono text-xs text-slate-500">
                          <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 ">
                            /trang/{page.slug}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-block border text-[10px] font-extrabold px-2.5 py-0.5  uppercase tracking-wider ${
                            isDraft
                              ? "bg-slate-100 text-slate-700 border-slate-200"
                              : "bg-green-100 text-green-700 border-green-200"
                          }`}>
                            {isDraft ? "Nháp" : "Xuất bản"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center text-xs text-slate-450 font-semibold">
                          {new Date(page.updatedAt).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Public Link */}
                            <Link
                              href={`/trang/${page.slug}`}
                              target="_blank"
                              className="acbt-icon-btn p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary-dark"
                              title="Xem trang thực tế"
                            >
                              <ExternalLink size={15} />
                            </Link>

                            {/* Edit */}
                            <Link
                              href={`/admin/pages/${page.id}/edit`}
                              className="acbt-icon-btn p-1.5 text-slate-600 hover:bg-slate-100 hover:text-primary-dark"
                              title="Chỉnh sửa bố cục"
                            >
                              <Edit3 size={15} />
                            </Link>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(page.id)}
                              disabled={actionLoading === page.id}
                              className="acbt-icon-btn p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                              title="Xóa trang"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

