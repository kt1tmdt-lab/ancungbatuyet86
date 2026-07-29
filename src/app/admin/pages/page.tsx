"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import {
  Plus,
  Loader,
  Edit3,
  Trash2,
  ExternalLink,
  Wand2
} from "lucide-react";
import Link from "next/link";
import { DEFAULT_INFO_PAGES } from "@/lib/default-info-pages";
import { getSystemPageSeedContent as getCleanSystemPageSeedContent, isVisibleSystemPage } from "@/lib/system-page-seeds";
import toast from "react-hot-toast";
import CmsPageHeader from "@/components/admin/CmsPageHeader";
import { CmsPanel } from "@/components/admin/CmsPanel";
import {
  AdminErrorState,
  AdminLoadingState,
  AdminSearchInput,
  AdminToolbar,
  ConfirmDialog,
} from "@/components/admin/AdminPrimitives";
import Button from "@/components/ui/Button";

interface PageData {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  updatedAt: string;
}

export default function AdminPagesList() {
  const router = useRouter();
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<PageData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      setLoadError("");
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
        if (!cancelled) {
          console.error("Failed to fetch pages:", err);
          setLoadError("Không thể tải danh sách trang.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [token]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(deleteTarget.id);
    try {
      const res = await fetch(`/api/pages/${deleteTarget.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        setPages((currentPages) => currentPages.filter((p) => p.id !== deleteTarget.id));
        toast.success("Đã xóa trang.");
        setDeleteTarget(null);
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Không thể xóa trang");
      }
    } catch (err) {
      console.error(err);
      toast.error("Đã xảy ra lỗi khi xóa trang");
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
      toast.error(errData.error || "Không thể tạo trang cấu hình");
    } catch (err) {
      console.error(err);
      toast.error("Đã xảy ra lỗi khi tạo trang cấu hình");
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
        <CmsPageHeader
          eyebrow="Nội dung"
          title="Quản lý trang tùy biến"
          description="Tạo landing page, trang sự kiện và các trang phụ bằng trình dựng nội dung theo khối."
          actions={
          <Button
            href="/admin/pages/new"
            variant="admin"
            leftIcon={<Plus size={16} />}
          >
            Thêm trang
          </Button>
          }
        />

        <CmsPanel className="space-y-4 p-4 sm:p-6">
          <div className="border border-primary/20 bg-orange-50/50 p-5">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-950 flex items-center gap-2">
                  <Wand2 size={19} className="text-primary-dark" />
                  Trang hệ thống có thể cấu hình
                </h2>
                <p className="text-xs text-slate-600 mt-1 max-w-3xl">
                  Các trang này đã có đường dẫn công khai. Khi chưa tạo bản CMS,
                  website sử dụng nội dung mặc định; khi tạo, quản trị viên có thể
                  sửa từng khối nội dung và hình ảnh.
                </p>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary-dark bg-white border border-primary/20 px-3 py-1">
                {systemPages.filter((page) => page.cmsPage).length}/{systemPages.length} đã có CMS
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
                        {cmsPage ? "Có CMS" : "Mặc định"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      {cmsPage ? (
                        <Link
                          href={`/admin/pages/${cmsPage.id}/edit`}
                          className="acbt-btn acbt-btn--admin acbt-btn--sm"
                        >
                          <Edit3 size={14} />
                          Sửa nội dung
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleCreateSystemPage(page.cmsSlug)}
                          disabled={actionLoading === page.cmsSlug}
                          className="acbt-btn acbt-btn--admin acbt-btn--sm disabled:opacity-60"
                        >
                          {actionLoading === page.cmsSlug ? <Loader size={14} className="animate-spin" /> : <Plus size={14} />}
                          Tạo và sửa
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

          <AdminToolbar className="-mx-4 border-y sm:-mx-6">
            <AdminSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Tìm tên trang hoặc đường dẫn..."
            />
          </AdminToolbar>

          {loading ? (
            <AdminLoadingState title="Đang tải danh sách trang" />
          ) : loadError ? (
            <AdminErrorState description={loadError} />
          ) : filteredPages.length === 0 ? (
            <AdminErrorState
              title="Không tìm thấy trang"
              description="Hãy đổi từ khóa hoặc thêm một trang mới."
            />
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
                            <Link
                              href={`/trang/${page.slug}`}
                              target="_blank"
                              className="acbt-icon-btn p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary-dark"
                              title="Xem trang thực tế"
                            >
                              <ExternalLink size={15} />
                            </Link>

                            <Link
                              href={`/admin/pages/${page.id}/edit`}
                              className="acbt-icon-btn p-1.5 text-slate-600 hover:bg-slate-100 hover:text-primary-dark"
                              title="Chỉnh sửa bố cục"
                            >
                              <Edit3 size={15} />
                            </Link>

                            <button
                              onClick={() => setDeleteTarget(page)}
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
        </CmsPanel>
      </div>
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Xóa trang?"
        description={`Trang “${deleteTarget?.title || ""}” và toàn bộ bố cục đã thiết kế sẽ bị xóa vĩnh viễn.`}
        loading={Boolean(deleteTarget && actionLoading === deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
      />
    </ProtectedRoute>
  );
}

