"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit3, ExternalLink, Loader, Plus, RotateCcw, Wand2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DEFAULT_INFO_PAGES } from "@/lib/default-info-pages";
import { getSystemPageSeedContent, isVisibleSystemPage } from "@/lib/system-page-seeds";

interface PageData {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  updatedAt: string;
}

export function SystemPagesManager() {
  const router = useRouter();
  const { token } = useAuth();
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [bulkLoading, setBulkLoading] = useState<"create" | "reload" | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    fetch("/api/pages", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch pages");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setPages(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) console.error("Failed to fetch system pages:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const visibleFallbackPages = useMemo(() => Object.values(DEFAULT_INFO_PAGES).filter(isVisibleSystemPage), []);

  const systemPages = visibleFallbackPages.map((page) => ({
    ...page,
    cmsPage: pages.find((existing) => existing.slug === page.cmsSlug),
  }));

  const createPayload = (cmsSlug: string) => {
    const fallback = visibleFallbackPages.find((page) => page.cmsSlug === cmsSlug);
    if (!fallback) return null;
    return {
      fallback,
      body: {
        title: fallback.title,
        slug: fallback.cmsSlug,
        status: "PUBLISHED",
        content: getSystemPageSeedContent(fallback),
      },
    };
  };

  const handleCreateSystemPage = async (cmsSlug: string) => {
    const payload = createPayload(cmsSlug);
    if (!payload || !token) return;

    setActionLoading(cmsSlug);
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload.body),
      });

      if (res.ok) {
        const created = await res.json();
        setPages((currentPages) => [created, ...currentPages]);
        router.push(`/admin/pages/${created.id}/edit`);
        return;
      }

      const errData = await res.json();
      alert(errData.error || "Không thể tạo trang cấu hình");
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi tạo trang cấu hình");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReloadSampleContent = async (pageId: string, cmsSlug: string) => {
    const payload = createPayload(cmsSlug);
    if (!payload || !token) return;
    if (!confirm("Nạp lại mẫu sẽ ghi đè nội dung hiện tại của trang này. Tiếp tục chứ?")) return;

    setActionLoading(`reload-${cmsSlug}`);
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload.body),
      });

      if (res.ok) {
        const updated = await res.json();
        setPages((currentPages) => currentPages.map((page) => (page.id === updated.id ? updated : page)));
        router.push(`/admin/pages/${updated.id}/edit`);
        return;
      }

      const errData = await res.json();
      alert(errData.error || "Không thể nạp dữ liệu mẫu");
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi nạp dữ liệu mẫu");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateAllMissingPages = async () => {
    const missingPages = systemPages.filter((page) => !page.cmsPage);
    if (!missingPages.length) {
      alert("Tất cả trang hệ thống đã có CMS rồi.");
      return;
    }

    setBulkLoading("create");
    try {
      let createdCount = 0;
      for (const page of missingPages) {
        const payload = createPayload(page.cmsSlug);
        if (!payload || !token) continue;

        const res = await fetch("/api/pages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload.body),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || `Không thể tạo ${payload.fallback.title}`);
        }

        const created = await res.json();
        createdCount += 1;
        setPages((currentPages) => [created, ...currentPages.filter((item) => item.id !== created.id)]);
      }

      alert(`Đã tạo ${createdCount} trang mẫu vào CMS.`);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Có lỗi khi tạo hàng loạt trang mẫu");
    } finally {
      setBulkLoading(null);
      setActionLoading(null);
    }
  };

  const handleReloadAllSampleContent = async () => {
    const existingPages = systemPages.filter((page) => page.cmsPage);
    if (!existingPages.length) {
      alert("Chưa có trang CMS nào để nạp mẫu. Bấm tạo tất cả mẫu trước.");
      return;
    }
    if (!confirm("Nạp mẫu toàn bộ sẽ ghi đè nội dung hiện tại của tất cả trang hệ thống đã có CMS. Tiếp tục chứ?")) return;

    setBulkLoading("reload");
    try {
      let updatedCount = 0;
      for (const page of existingPages) {
        const payload = createPayload(page.cmsSlug);
        if (!payload || !token || !page.cmsPage) continue;

        const res = await fetch(`/api/pages/${page.cmsPage.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload.body),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || `Không thể nạp mẫu ${payload.fallback.title}`);
        }

        const updated = await res.json();
        updatedCount += 1;
        setPages((currentPages) => currentPages.map((item) => (item.id === updated.id ? updated : item)));
      }

      alert(`Đã nạp lại mẫu cho ${updatedCount} trang.`);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Có lỗi khi nạp mẫu hàng loạt");
    } finally {
      setBulkLoading(null);
      setActionLoading(null);
    }
  };

  return (
    <section className="border border-orange-200 bg-orange-50/50 p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-black text-slate-950">
            <Wand2 size={21} className="text-orange-600" />
            Trang hệ thống cần cấu hình
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
            Đây là nơi sửa chữ, ảnh và các block lặp lại cho các trang có trên website. Trang Chất lượng giờ chỉ còn một trang tổng, không tách mấy trang con cũ nữa.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCreateAllMissingPages}
            disabled={loading || bulkLoading !== null}
            className="inline-flex items-center gap-2 bg-orange-600 px-4 py-2.5 text-xs font-black uppercase tracking-wide text-white transition hover:bg-slate-950 disabled:opacity-60"
          >
            {bulkLoading === "create" ? <Loader size={14} className="animate-spin" /> : <Plus size={14} />}
            Tạo tất cả mẫu
          </button>
          <button
            type="button"
            onClick={handleReloadAllSampleContent}
            disabled={loading || bulkLoading !== null}
            className="inline-flex items-center gap-2 border border-orange-200 bg-white px-4 py-2.5 text-xs font-black uppercase tracking-wide text-orange-700 transition hover:border-orange-400 hover:bg-orange-50 disabled:opacity-60"
          >
            {bulkLoading === "reload" ? <Loader size={14} className="animate-spin" /> : <RotateCcw size={14} />}
            Nạp mẫu toàn bộ
          </button>
        </div>
        <span className="w-fit border border-orange-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-wider text-orange-700">
          {loading ? "Đang tải" : `${systemPages.filter((page) => page.cmsPage).length}/${systemPages.length} đã có CMS`}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {systemPages.map((page) => {
          const cmsPage = page.cmsPage;
          return (
            <div key={page.routePath} className="border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="line-clamp-2 font-black leading-tight text-slate-950">{page.title}</p>
                  <p className="mt-1 break-all font-mono text-[11px] text-slate-500">{page.routePath}</p>
                  <p className="mt-1 break-all text-[11px] text-slate-400">CMS slug: {page.cmsSlug}</p>
                </div>
                <span className={`shrink-0 border px-2 py-0.5 text-[10px] font-black uppercase ${
                  cmsPage ? "border-green-200 bg-green-50 text-green-700" : "border-slate-200 bg-slate-50 text-slate-500"
                }`}>
                  {cmsPage ? "Có CMS" : "Mặc định"}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {cmsPage ? (
                  <>
                    <Link href={`/admin/pages/${cmsPage.id}/edit`} className="inline-flex items-center gap-2 bg-orange-600 px-3 py-2 text-xs font-black uppercase tracking-wide text-white hover:bg-slate-950">
                      <Edit3 size={14} />
                      Sửa nội dung
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleReloadSampleContent(cmsPage.id, page.cmsSlug)}
                      disabled={actionLoading === `reload-${page.cmsSlug}`}
                      className="inline-flex items-center gap-2 border border-orange-200 px-3 py-2 text-xs font-black uppercase tracking-wide text-orange-700 hover:bg-orange-50 disabled:opacity-60"
                    >
                      {actionLoading === `reload-${page.cmsSlug}` ? <Loader size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                      Nạp mẫu
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleCreateSystemPage(page.cmsSlug)}
                    disabled={actionLoading === page.cmsSlug}
                    className="inline-flex items-center gap-2 bg-orange-600 px-3 py-2 text-xs font-black uppercase tracking-wide text-white hover:bg-slate-950 disabled:opacity-60"
                  >
                    {actionLoading === page.cmsSlug ? <Loader size={14} className="animate-spin" /> : <Plus size={14} />}
                    Tạo & sửa
                  </button>
                )}
                <Link href={page.routePath} target="_blank" className="grid h-9 w-9 place-items-center border border-slate-200 text-slate-500 hover:border-orange-300 hover:text-orange-600" title="Xem route public">
                  <ExternalLink size={15} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
