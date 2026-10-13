"use client";

import Link from "next/link";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Check,
  Edit3,
  ExternalLink,
  Eye,
  Send,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth-context";
import { adminRequest, getAdminErrorMessage } from "@/lib/admin-client";
import { DataTable } from "./DataTable";
import CmsStatusBadge from "./CmsStatusBadge";
import {
  AdminErrorState,
  AdminFormField,
  AdminLoadingState,
  AdminModal,
  AdminSearchInput,
  AdminSelect,
  AdminToolbar,
  ConfirmDialog,
} from "./AdminPrimitives";
import Button from "@/components/ui/Button";
import { normalizeMarketingConfig, type PressItem } from "@/lib/marketing-config";

export type PostStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "PUBLISHED"
  | "REJECTED"
  | "ARCHIVED";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: PostStatus;
  author: { id: string; name: string | null; email: string };
  category?: { id: string; name: string; slug: string } | null;
  viewCount: number;
  createdAt: string;
  rejectedReason?: string | null;
  press?: PressItem;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

type PostsTableProps = {
  status?: PostStatus;
  onActionSuccess?: () => void;
};

export function PostsTable({
  status: fixedStatus,
  onActionSuccess,
}: PostsTableProps) {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [pressItems, setPressItems] = useState<PressItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [pressLoading, setPressLoading] = useState(!fixedStatus);
  const [loadError, setLoadError] = useState("");
  const [pressError, setPressError] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "written" | "press">("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<PostStatus | "">(
    fixedStatus || "",
  );
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearch = useDeferredValue(searchQuery);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [pressDeleteTarget, setPressDeleteTarget] = useState<PressItem | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Post | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [rejectError, setRejectError] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      setCategories(await adminRequest<Category[]>("/api/categories"));
    } catch {
      setCategories([]);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setLoadError("");
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (categoryFilter) params.set("categoryId", categoryFilter);
    if (deferredSearch.trim()) params.set("search", deferredSearch.trim());

    try {
      setPosts(
        await adminRequest<Post[]>(`/api/posts?${params.toString()}`, {
          token,
        }),
      );
    } catch (error) {
      setLoadError(
        getAdminErrorMessage(error, "Không thể tải danh sách bài viết."),
      );
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, deferredSearch, statusFilter, token]);

  const fetchPress = useCallback(async () => {
    if (fixedStatus) return;
    setPressLoading(true);
    setPressError("");
    try {
      const response = await fetch("/api/settings/marketing", { cache: "no-store" });
      if (!response.ok) throw new Error("Không thể tải bài báo bên ngoài.");
      const result = await response.json();
      setPressItems(normalizeMarketingConfig(result?.data).press);
    } catch (error) {
      setPressError(getAdminErrorMessage(error, "Không thể tải bài báo bên ngoài."));
    } finally {
      setPressLoading(false);
    }
  }, [fixedStatus]);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchCategories(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchCategories]);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchPosts(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchPosts]);

  useEffect(() => {
    if (fixedStatus) return;
    const timer = window.setTimeout(() => void fetchPress(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchPress, fixedStatus]);

  const updatePostLocally = useCallback(
    (postId: string, nextStatus: PostStatus, rejectedReason?: string) => {
      setPosts((current) =>
        fixedStatus === "PENDING_REVIEW"
          ? current.filter((post) => post.id !== postId)
          : current.map((post) =>
              post.id === postId
                ? { ...post, status: nextStatus, rejectedReason }
                : post,
            ),
      );
      onActionSuccess?.();
    },
    [fixedStatus, onActionSuccess],
  );

  const handleApprove = useCallback(
    async (post: Post) => {
      if (!token) return;
      setActionLoading(post.id);
      try {
        await adminRequest("/api/posts/review", {
          method: "POST",
          token,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: post.id, action: "approve" }),
        });
        updatePostLocally(post.id, "PUBLISHED");
        toast.success("Bài viết đã được duyệt và xuất bản.");
      } catch (error) {
        toast.error(getAdminErrorMessage(error, "Không thể duyệt bài viết."));
      } finally {
        setActionLoading(null);
      }
    },
    [token, updatePostLocally],
  );

  const handleReject = async () => {
    if (!rejectTarget || !token) return;
    if (!rejectNote.trim()) {
      setRejectError("Vui lòng nhập lý do để tác giả có thể chỉnh sửa.");
      return;
    }

    setRejectError("");
    setActionLoading(rejectTarget.id);
    try {
      await adminRequest("/api/posts/review", {
        method: "POST",
        token,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: rejectTarget.id,
          action: "reject",
          note: rejectNote.trim(),
        }),
      });
      updatePostLocally(rejectTarget.id, "REJECTED", rejectNote.trim());
      toast.success("Đã từ chối bài viết và lưu lý do.");
      setRejectTarget(null);
      setRejectNote("");
    } catch (error) {
      toast.error(getAdminErrorMessage(error, "Không thể từ chối bài viết."));
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendToReview = useCallback(
    async (post: Post) => {
      if (!token) return;
      setActionLoading(post.id);
      try {
        await adminRequest(`/api/posts/${post.id}`, {
          method: "PUT",
          token,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "PENDING_REVIEW" }),
        });
        updatePostLocally(post.id, "PENDING_REVIEW");
        toast.success("Đã gửi bài viết tới hàng chờ duyệt.");
      } catch (error) {
        toast.error(getAdminErrorMessage(error, "Không thể gửi duyệt."));
      } finally {
        setActionLoading(null);
      }
    },
    [token, updatePostLocally],
  );

  const handleDelete = async () => {
    if (!deleteTarget || !token) return;
    setActionLoading(deleteTarget.id);
    try {
      await adminRequest(`/api/posts/${deleteTarget.id}`, {
        method: "DELETE",
        token,
      });
      setPosts((current) =>
        current.filter((post) => post.id !== deleteTarget.id),
      );
      onActionSuccess?.();
      toast.success("Đã xóa bài viết.");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(getAdminErrorMessage(error, "Không thể xóa bài viết."));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeletePress = async () => {
    if (!pressDeleteTarget || !token) return;
    setActionLoading(pressDeleteTarget.id);
    try {
      await adminRequest(`/api/settings/marketing/press/${encodeURIComponent(pressDeleteTarget.id)}`, {
        method: "DELETE",
        token,
      });
      setPressItems((current) => current.filter((item) => item.id !== pressDeleteTarget.id));
      setPressDeleteTarget(null);
      toast.success("Đã xóa bài báo bên ngoài.");
    } catch (error) {
      toast.error(getAdminErrorMessage(error, "Không thể xóa bài báo."));
    } finally {
      setActionLoading(null);
    }
  };

  const canReview =
    user?.role === "SUPER_ADMIN" ||
    user?.role === "ADMIN" ||
    user?.role === "EDITOR";

  const tableRows = useMemo(() => {
    const query = deferredSearch.trim().toLocaleLowerCase("vi-VN");
    const visiblePress = !fixedStatus && !categoryFilter && (!statusFilter || statusFilter === "PUBLISHED")
      ? pressItems.filter((item) => !query || [item.title, item.sourceName, item.description || ""].some((value) => value.toLocaleLowerCase("vi-VN").includes(query)))
      : [];
    const pressRows: Post[] = visiblePress.map((item) => ({
      id: `press:${item.id}`,
      title: item.title || `Bài báo từ ${item.sourceName}`,
      slug: "",
      status: "PUBLISHED",
      author: { id: "", name: item.sourceName || "Báo chí", email: "" },
      category: { id: "external-press", name: "Báo chí bên ngoài", slug: "external-press" },
      viewCount: 0,
      createdAt: item.publishDate || new Date(0).toISOString(),
      press: item,
    }));
    return [
      ...(typeFilter === "press" ? [] : posts),
      ...(typeFilter === "written" ? [] : pressRows),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [categoryFilter, deferredSearch, fixedStatus, posts, pressItems, statusFilter, typeFilter]);

  const columns = useMemo<ColumnDef<Post>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Bài viết",
        cell: ({ row }) => {
          const post = row.original;
          return (
            <div className="flex min-w-64 max-w-lg items-start gap-3">
              {post.press?.imageUrl && <img src={post.press.imageUrl} alt="" className="h-14 w-20 shrink-0 bg-slate-100 object-cover" referrerPolicy="no-referrer" />}
              <div>
                <p className="line-clamp-2 font-black leading-5 text-slate-950">{post.title}</p>
                <p className="mt-1 text-[10px] font-medium text-slate-400">
                  {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                </p>
                {post.status === "REJECTED" && post.rejectedReason ? (
                  <p className="mt-2 border-l-2 border-red-400 bg-red-50 px-2 py-1 text-[11px] font-medium leading-5 text-red-700">{post.rejectedReason}</p>
                ) : null}
              </div>
            </div>
          );
        },
      },
      {
        id: "author",
        accessorFn: (post) => post.author.name || post.author.email,
        header: "Tác giả / nguồn",
        cell: ({ row }) => (
          <span className="text-xs font-bold text-slate-700">
            {row.original.author.name || row.original.author.email}
          </span>
        ),
      },
      {
        id: "category",
        accessorFn: (post) => post.category?.name || "",
        header: "Danh mục",
        cell: ({ row }) =>
          row.original.category ? (
            <span className="inline-flex border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-600">
              {row.original.category.name}
            </span>
          ) : (
            <span className="text-xs italic text-slate-400">Chưa phân loại</span>
          ),
      },
      {
        accessorKey: "viewCount",
        header: "Lượt xem",
        cell: ({ row }) => row.original.press
          ? <span className="text-xs text-slate-400">—</span>
          : <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600"><Eye size={13} /> {row.original.viewCount}</span>,
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => row.original.press
          ? <span className="inline-flex border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800">Đã gắn link</span>
          : <CmsStatusBadge status={row.original.status} />,
      },
      {
        id: "actions",
        header: "Thao tác",
        enableSorting: false,
        cell: ({ row }) => {
          const post = row.original;
          if (post.press) {
            return (
              <div className="flex items-center justify-end gap-1">
                <Link href={`/tin-tuc/bao-chi/${encodeURIComponent(post.press.id)}`} target="_blank" className="acbt-icon-btn grid h-9 w-9 place-items-center text-slate-500 hover:bg-slate-100 hover:text-slate-950" title="Xem trên website" aria-label={`Xem ${post.title}`}><ExternalLink size={16} /></Link>
                {canReview && <Link href="/admin/marketing?tab=press" className="acbt-icon-btn grid h-9 w-9 place-items-center text-slate-600 hover:bg-orange-50 hover:text-orange-600" title="Chỉnh sửa thông tin bài báo" aria-label={`Sửa ${post.title}`}><Edit3 size={16} /></Link>}
                {canReview && <button type="button" onClick={() => setPressDeleteTarget(post.press || null)} disabled={actionLoading === post.press.id} className="acbt-icon-btn grid h-9 w-9 place-items-center text-red-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50" title="Xóa bài báo" aria-label={`Xóa ${post.title}`}><Trash2 size={16} /></button>}
              </div>
            );
          }
          const isOwner = post.author.id === user?.id;
          const canEdit =
            canReview ||
            (isOwner && ["DRAFT", "REJECTED"].includes(post.status));

          return (
            <div className="flex items-center justify-end gap-1">
              {post.status === "PUBLISHED" ? (
                <Link
                  href={`/tin-tuc/${post.slug}`}
                  target="_blank"
                  className="acbt-icon-btn grid h-9 w-9 place-items-center text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                  title="Xem trên website"
                  aria-label={`Xem ${post.title}`}
                >
                  <ExternalLink size={16} />
                </Link>
              ) : null}
              {user?.role === "AUTHOR" &&
              isOwner &&
              ["DRAFT", "REJECTED"].includes(post.status) ? (
                <button
                  type="button"
                  onClick={() => void handleSendToReview(post)}
                  disabled={actionLoading === post.id}
                  className="acbt-icon-btn grid h-9 w-9 place-items-center bg-orange-50 text-orange-600 hover:bg-orange-100 disabled:opacity-50"
                  title="Gửi duyệt"
                  aria-label={`Gửi duyệt ${post.title}`}
                >
                  <Send size={15} />
                </button>
              ) : null}
              {canReview && post.status === "PENDING_REVIEW" ? (
                <>
                  <button
                    type="button"
                    onClick={() => void handleApprove(post)}
                    disabled={actionLoading === post.id}
                    className="acbt-icon-btn grid h-9 w-9 place-items-center bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                    title="Duyệt bài"
                    aria-label={`Duyệt ${post.title}`}
                  >
                    <Check size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRejectTarget(post);
                      setRejectNote("");
                      setRejectError("");
                    }}
                    disabled={actionLoading === post.id}
                    className="acbt-icon-btn grid h-9 w-9 place-items-center bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
                    title="Từ chối"
                    aria-label={`Từ chối ${post.title}`}
                  >
                    <X size={16} />
                  </button>
                </>
              ) : null}
              {canEdit ? (
                <>
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="acbt-icon-btn grid h-9 w-9 place-items-center text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                    title="Chỉnh sửa"
                    aria-label={`Sửa ${post.title}`}
                  >
                    <Edit3 size={16} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(post)}
                    disabled={actionLoading === post.id}
                    className="acbt-icon-btn grid h-9 w-9 place-items-center text-red-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                    title="Xóa"
                    aria-label={`Xóa ${post.title}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              ) : null}
            </div>
          );
        },
      },
    ],
    [
      actionLoading,
      canReview,
      handleApprove,
      handleSendToReview,
      user?.id,
      user?.role,
    ],
  );

  return (
    <>
      {!fixedStatus && (
        <div className="flex flex-wrap gap-2 border-b border-slate-200 px-4 pt-4 sm:px-5" aria-label="Lọc loại bài viết">
          {([
            ["all", "Tất cả"],
            ["written", "Bài tự viết"],
            ["press", "Bài báo bên ngoài"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={typeFilter === value}
              onClick={() => {
                setTypeFilter(value);
                if (value === "press") { setStatusFilter(""); setCategoryFilter(""); }
              }}
              className={`border-b-2 px-2 pb-3 text-sm font-bold transition ${typeFilter === value ? "border-orange-600 text-orange-700" : "border-transparent text-slate-500 hover:text-slate-900"}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <AdminToolbar>
        <AdminSearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Tìm theo tiêu đề hoặc nội dung..."
        />
        {typeFilter !== "press" && <div className="flex flex-col gap-2 sm:flex-row">
          {!fixedStatus ? (
            <AdminSelect
              label="Lọc trạng thái"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as PostStatus | "")
              }
            >
              <option value="">Tất cả trạng thái</option>
              <option value="DRAFT">Bản nháp</option>
              <option value="PENDING_REVIEW">Chờ duyệt</option>
              <option value="PUBLISHED">Đã xuất bản</option>
              <option value="REJECTED">Bị từ chối</option>
              <option value="ARCHIVED">Lưu trữ</option>
            </AdminSelect>
          ) : null}
          <AdminSelect
            label="Lọc danh mục"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </AdminSelect>
        </div>}
      </AdminToolbar>

      {loadError && !loading && (
        <AdminErrorState description={loadError} action={<Button variant="adminSecondary" onClick={() => void fetchPosts()}>Thử lại</Button>} />
      )}
      {pressError && !pressLoading && (
        <div role="status" className="mx-5 my-3 border-l-2 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {pressError} <button type="button" onClick={() => void fetchPress()} className="font-bold underline">Thử lại</button>
        </div>
      )}
      {loading || pressLoading ? (
        <AdminLoadingState title="Đang tải bài viết" />
      ) : !loadError || tableRows.length > 0 ? (
        <DataTable
          columns={columns}
          data={tableRows}
          emptyTitle={
            fixedStatus === "PENDING_REVIEW"
              ? "Không có bài chờ duyệt"
              : typeFilter === "press" ? "Không tìm thấy bài báo bên ngoài" : "Không tìm thấy bài viết"
          }
          emptyDescription={
            searchQuery || statusFilter || categoryFilter
              ? "Hãy đổi từ khóa hoặc bộ lọc để xem kết quả khác."
              : typeFilter === "press" ? "Bài báo được gắn link sẽ xuất hiện tại đây." : "Bài viết mới sẽ xuất hiện tại đây."
          }
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Xóa bài viết?"
        description={`Bài viết “${deleteTarget?.title || ""}” sẽ không còn xuất hiện trong hệ thống.`}
        loading={Boolean(
          deleteTarget && actionLoading === deleteTarget.id,
        )}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
      />

      <ConfirmDialog
        open={Boolean(pressDeleteTarget)}
        title="Xóa bài báo bên ngoài?"
        description={`Bài báo “${pressDeleteTarget?.title || ""}” sẽ bị gỡ khỏi trang Tin tức.`}
        loading={Boolean(pressDeleteTarget && actionLoading === pressDeleteTarget.id)}
        onClose={() => setPressDeleteTarget(null)}
        onConfirm={() => void handleDeletePress()}
      />

      <AdminModal
        open={Boolean(rejectTarget)}
        title="Từ chối bài viết"
        description={`Gửi phản hồi rõ ràng cho tác giả của “${rejectTarget?.title || ""}”.`}
        onClose={() => {
          if (!actionLoading) setRejectTarget(null);
        }}
        size="sm"
        footer={
          <>
            <Button
              variant="adminSecondary"
              onClick={() => setRejectTarget(null)}
              disabled={Boolean(actionLoading)}
            >
              Hủy
            </Button>
            <Button
              variant="adminDanger"
              onClick={() => void handleReject()}
              loading={Boolean(
                rejectTarget && actionLoading === rejectTarget.id,
              )}
            >
              Xác nhận từ chối
            </Button>
          </>
        }
      >
        <AdminFormField
          label="Lý do từ chối"
          error={rejectError}
          required
        >
          <textarea
            value={rejectNote}
            onChange={(event) => {
              setRejectNote(event.target.value);
              if (rejectError) setRejectError("");
            }}
            rows={5}
            autoFocus
            className="w-full border border-slate-200 px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            placeholder="Nêu nội dung cần chỉnh sửa..."
          />
        </AdminFormField>
      </AdminModal>
    </>
  );
}
