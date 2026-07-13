"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit3, ExternalLink, Loader, Plus, RotateCcw, Wand2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DEFAULT_INFO_PAGES } from "@/lib/default-info-pages";

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
        subtitle:
          "Nguyên liệu, nhà máy, chứng nhận và bảo hiểm — mọi thứ đều có hồ sơ. Nội dung nào chưa có file public sẽ ghi rõ [cần bổ sung].",
        backgroundImage: "/bento/bento-factory.png",
        ctaText: "Xem hồ sơ pháp lý",
        ctaLink: "#ho-so-phap-ly",
      },
    },
    {
      id: "chat-luong-nguyen-lieu",
      type: "split",
      data: {
        title: "Nguyên liệu nhập khẩu từ châu Âu — có truy xuất",
        description:
          "Nguyên liệu chính như chân gà được định hướng công khai theo hồ sơ nhập khẩu từ Ba Lan, Hungary và các nước châu Âu khác. Cần bổ sung C/O, phiếu kiểm dịch và hồ sơ lô hàng tương ứng trước khi public claim đầy đủ.",
        imageUrl: "/bento/bento-ingredients.png",
        imagePosition: "right",
        ctaText: "Cần bổ sung video truy xuất",
        ctaLink: "#",
      },
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
          { icon: "Snowflake", title: "Lưu kho lạnh theo quy chuẩn", description: "[cần bổ sung ảnh kho lạnh]" },
        ],
      },
    },
    {
      id: "chat-luong-factory",
      type: "split",
      data: {
        title: "Nhà máy sản xuất NMV Food — Thái Nguyên",
        description:
          "NMV Food đạt chứng nhận ISO 22000:2018. Quy trình nên được mô tả là quy trình 6 bước có kiểm soát: nguyên liệu → sơ chế → chế biến → QC → đóng gói → giao hàng. Không dùng các cụm như an toàn tuyệt đối hoặc vô trùng.",
        imageUrl: "/bento/bento-factory.png",
        imagePosition: "left",
        ctaText: "Xem quy trình",
        ctaLink: "/chat-luong/nha-may-quy-trinh-san-xuat",
      },
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
          { icon: "FileSearch", title: "Phiếu kiểm nghiệm", description: "VNTEST — kiểm nghiệm định kỳ hàng tháng (NMV Food). [cần bổ sung phiếu mới nhất]" },
        ],
      },
    },
    {
      id: "chat-luong-pvi",
      type: "text",
      data: {
        backgroundColor: "white",
        content:
          "<h2>Bảo hiểm trách nhiệm sản phẩm — PVI</h2><p>ACBT mua bảo hiểm trách nhiệm sản phẩm từ PVI. Đây là cam kết trách nhiệm nếu sản phẩm gây thiệt hại cho người tiêu dùng theo phạm vi hợp đồng, không phải chứng nhận chất lượng và không được trình bày như PVI xác nhận chất lượng sản phẩm.</p><p><strong>[cần xác nhận]</strong> Pháp nhân trên hợp đồng PVI và phạm vi bảo hiểm cụ thể.</p>",
      },
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
          { icon: "Headphones", title: "Kênh hỗ trợ", description: "Hotline, email, thời gian làm việc. [cần bổ sung thông tin chính thức]" },
        ],
      },
    },
  ];
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

  const systemPages = Object.values(DEFAULT_INFO_PAGES).map((page) => ({
    ...page,
    cmsPage: pages.find((existing) => existing.slug === page.cmsSlug),
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: fallback.title,
          slug: fallback.cmsSlug,
          status: "PUBLISHED",
          content: getSystemPageSeedContent(fallback),
        }),
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
    const fallback = Object.values(DEFAULT_INFO_PAGES).find((page) => page.cmsSlug === cmsSlug);
    if (!fallback || !token) return;
    if (!confirm("Nạp lại dữ liệu mẫu sẽ ghi đè nội dung hiện tại của trang này. Tiếp tục chứ?")) return;

    setActionLoading(`reload-${cmsSlug}`);
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: fallback.title,
          slug: fallback.cmsSlug,
          status: "PUBLISHED",
          content: getSystemPageSeedContent(fallback),
        }),
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
      alert("Tất cả trang menu hệ thống đã có CMS rồi.");
      return;
    }

    setBulkLoading("create");
    try {
      let createdCount = 0;
      for (const page of missingPages) {
        const fallback = Object.values(DEFAULT_INFO_PAGES).find((item) => item.cmsSlug === page.cmsSlug);
        if (!fallback || !token) continue;

        const res = await fetch("/api/pages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: fallback.title,
            slug: fallback.cmsSlug,
            status: "PUBLISHED",
            content: getSystemPageSeedContent(fallback),
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || `Không thể tạo ${fallback.title}`);
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
    if (!confirm("Nạp mẫu toàn bộ sẽ ghi đè nội dung hiện tại của tất cả trang menu hệ thống đã có CMS. Tiếp tục chứ?")) return;

    setBulkLoading("reload");
    try {
      let updatedCount = 0;
      for (const page of existingPages) {
        const fallback = Object.values(DEFAULT_INFO_PAGES).find((item) => item.cmsSlug === page.cmsSlug);
        if (!fallback || !token || !page.cmsPage) continue;

        const res = await fetch(`/api/pages/${page.cmsPage.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: fallback.title,
            slug: fallback.cmsSlug,
            status: "PUBLISHED",
            content: getSystemPageSeedContent(fallback),
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || `Không thể nạp mẫu ${fallback.title}`);
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
            Trang menu hệ thống
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
            Các trang nằm trên header như Giới thiệu, Chất lượng, Điểm bán, Hợp tác. Bấm tạo để có bản CMS, rồi sửa từng chữ, từng ảnh và các block lặp lại.
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

              <div className="mt-4 flex items-center gap-2">
                {cmsPage ? (
                  <>
                    <Link href={`/admin/pages/${cmsPage.id}/edit`} className="acbt-btn acbt-btn--admin acbt-btn--sm">
                      <Edit3 size={14} />
                      Sửa nội dung
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleReloadSampleContent(cmsPage.id, page.cmsSlug)}
                      disabled={actionLoading === `reload-${page.cmsSlug}`}
                      className="inline-flex items-center gap-1.5 border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 transition hover:border-orange-300 hover:text-orange-600 disabled:opacity-60"
                    >
                      {actionLoading === `reload-${page.cmsSlug}` ? <Loader size={13} className="animate-spin" /> : <RotateCcw size={13} />}
                      Nạp mẫu
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleCreateSystemPage(page.cmsSlug)}
                    disabled={actionLoading === page.cmsSlug}
                    className="acbt-btn acbt-btn--admin acbt-btn--sm disabled:opacity-60"
                  >
                    {actionLoading === page.cmsSlug ? <Loader size={14} className="animate-spin" /> : <Plus size={14} />}
                    Tạo & sửa
                  </button>
                )}
                <Link
                  href={page.routePath}
                  target="_blank"
                  className="acbt-icon-btn p-2 text-slate-500 hover:bg-slate-100 hover:text-orange-600"
                  title="Xem trang public"
                >
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
