"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import {
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Link2,
  Unlink,
} from "lucide-react";
import Link from "next/link";
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
import {
  normalizeSiteConfig,
  type SiteConfigData,
} from "@/lib/site-config-defaults";
import { customPageHref } from "@/lib/custom-pages";

interface PageData {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  updatedAt: string;
}

export default function AdminPagesList() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfigData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [menuLoading, setMenuLoading] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<PageData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { token, user } = useAuth();
  const canManageWebsiteMenu = Boolean(
    user &&
      ["SUPER_ADMIN", "ADMIN", "MARKETING"].includes(user.role),
  );

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setLoadError("");
      try {
        const [pagesResult, settingsResult] = await Promise.allSettled([
          fetch("/api/pages", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("/api/settings"),
        ]);

        if (
          pagesResult.status !== "fulfilled" ||
          !pagesResult.value.ok
        ) {
          throw new Error("Failed to fetch pages");
        }

        const pageData = await pagesResult.value.json();
        if (!cancelled) {
          setPages(Array.isArray(pageData) ? pageData : []);
        }

        if (
          settingsResult.status === "fulfilled" &&
          settingsResult.value.ok
        ) {
          const settingsData = await settingsResult.value.json();
          if (!cancelled) {
            setSiteConfig(normalizeSiteConfig(settingsData?.data));
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch pages:", err);
          setLoadError("Không thể tải danh sách trang.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [token]);

  const persistSiteConfig = async (nextConfig: SiteConfigData) => {
    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(nextConfig),
    });

    if (!response.ok) {
      throw new Error("Không thể cập nhật menu website");
    }

    setSiteConfig(nextConfig);
  };

  const togglePageInMenu = async (page: PageData) => {
    if (!siteConfig || !token) {
      toast.error("Chưa tải được cấu hình menu website.");
      return;
    }

    const href = customPageHref(page.slug);
    const isInMenu = siteConfig.navbarLinks.some((item) => item.href === href);
    const navbarLinks = isInMenu
      ? siteConfig.navbarLinks.filter((item) => item.href !== href)
      : [...siteConfig.navbarLinks, { href, label: page.title }];

    setMenuLoading(page.id);
    try {
      await persistSiteConfig({ ...siteConfig, navbarLinks });
      toast.success(
        isInMenu
          ? "Đã gỡ trang khỏi menu website."
          : "Đã đưa trang lên menu website.",
      );
    } catch (error) {
      console.error(error);
      toast.error("Không thể cập nhật menu website.");
    } finally {
      setMenuLoading(null);
    }
  };

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

  // Filter search
  const filteredPages = pages
    .filter((page) =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "EDITOR", "MARKETING"]}>
      <div className="space-y-6">
        <CmsPageHeader
          eyebrow="Nội dung"
          title="Trang tạo thêm"
          description="Tạo landing page, trang sự kiện hoặc trang thông tin mới rồi chủ động đưa lên menu website."
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
          <div className="border border-orange-200 bg-orange-50/60 p-4 text-sm font-semibold leading-6 text-orange-950">
            Khu vực này chỉ quản lý những trang mới do Admin tự tạo. Trang chủ,
            Giới thiệu, Chất lượng, Sản phẩm và Điểm bán đã có màn quản lý riêng,
            nên không xuất hiện lặp lại tại đây.
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
                    <th className="px-5 py-4 text-center">Menu website</th>
                    <th className="px-5 py-4 text-center">Cập nhật lúc</th>
                    <th className="px-5 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredPages.map((page) => {
                    const isDraft = page.status === "DRAFT";
                    const pageHref = customPageHref(page.slug);
                    const isInMenu = Boolean(
                      siteConfig?.navbarLinks.some(
                        (item) => item.href === pageHref,
                      ),
                    );
                    return (
                      <tr key={page.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-5 py-4">
                          <span className="font-extrabold text-slate-900 leading-tight block">
                            {page.title}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono text-xs text-slate-500">
                          <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 ">
                            {pageHref}
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
                        <td className="px-5 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => void togglePageInMenu(page)}
                            disabled={
                              isDraft ||
                              !siteConfig ||
                              !canManageWebsiteMenu ||
                              menuLoading === page.id
                            }
                            className={`inline-flex min-h-9 items-center gap-2 border px-3 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                              isInMenu
                                ? "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
                                : "border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-700"
                            }`}
                            title={
                              isDraft
                                ? "Xuất bản trang trước khi đưa lên menu"
                                : !canManageWebsiteMenu
                                  ? "Tài khoản này không có quyền sửa menu website"
                                : isInMenu
                                  ? "Gỡ khỏi menu website"
                                  : "Đưa lên menu website"
                            }
                          >
                            {isInMenu ? (
                              <Unlink size={14} />
                            ) : (
                              <Link2 size={14} />
                            )}
                            {menuLoading === page.id
                              ? "Đang lưu"
                              : isInMenu
                                ? "Đang hiển thị"
                                : "Đưa lên menu"}
                          </button>
                        </td>
                        <td className="px-5 py-4 text-center text-xs text-slate-450 font-semibold">
                          {new Date(page.updatedAt).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={pageHref}
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

