"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Check,
  ClipboardCheck,
  Eye,
  Mail,
  MessageSquare,
  Phone,
  Trash2,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth-context";
import { adminRequest, getAdminErrorMessage } from "@/lib/admin-client";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { DataTable } from "@/components/admin/DataTable";
import CmsPageHeader from "@/components/admin/CmsPageHeader";
import { CmsPanel } from "@/components/admin/CmsPanel";
import {
  AdminErrorState,
  AdminLoadingState,
  AdminModal,
  AdminSearchInput,
  AdminSelect,
  AdminToolbar,
  ConfirmDialog,
} from "@/components/admin/AdminPrimitives";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

type ContactStatus = "NEW" | "READ" | "RESPONDED";

interface ContactMessage {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  content: string;
  source: string | null;
  status: ContactStatus;
  createdAt: string;
}

const STATUS_LABELS: Record<ContactStatus, string> = {
  NEW: "Mới nhận",
  READ: "Đã xem",
  RESPONDED: "Đã phản hồi",
};

export default function ContactsPage() {
  const { token, user } = useAuth();
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "ALL">(
    "ALL",
  );
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [viewingContact, setViewingContact] =
    useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(
    null,
  );

  const fetchContacts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setLoadError("");
    try {
      setContacts(
        await adminRequest<ContactMessage[]>("/api/contacts", { token }),
      );
    } catch (error) {
      setLoadError(
        getAdminErrorMessage(error, "Không thể tải danh sách liên hệ."),
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchContacts(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchContacts]);

  const handleUpdateStatus = useCallback(
    async (contact: ContactMessage, nextStatus: ContactStatus) => {
      if (!token || contact.status === nextStatus) return;
      setActionLoading(contact.id);

      try {
        const updated = await adminRequest<ContactMessage>(
          `/api/contacts/${contact.id}`,
          {
            method: "PUT",
            token,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: nextStatus }),
          },
        );
        setContacts((current) =>
          current.map((item) => (item.id === contact.id ? updated : item)),
        );
        setViewingContact((current) =>
          current?.id === contact.id ? updated : current,
        );
        toast.success("Đã cập nhật trạng thái liên hệ.");
      } catch (error) {
        toast.error(
          getAdminErrorMessage(error, "Không thể cập nhật trạng thái."),
        );
      } finally {
        setActionLoading(null);
      }
    },
    [token],
  );

  const openContact = useCallback(
    (contact: ContactMessage) => {
      setViewingContact(contact);
      if (contact.status === "NEW") {
        void handleUpdateStatus(contact, "READ");
      }
    },
    [handleUpdateStatus],
  );

  const handleDelete = async () => {
    if (!deleteTarget || !token) return;
    setActionLoading(deleteTarget.id);
    try {
      await adminRequest(`/api/contacts/${deleteTarget.id}`, {
        method: "DELETE",
        token,
      });
      setContacts((current) =>
        current.filter((contact) => contact.id !== deleteTarget.id),
      );
      setViewingContact((current) =>
        current?.id === deleteTarget.id ? null : current,
      );
      toast.success("Đã xóa thư liên hệ.");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(getAdminErrorMessage(error, "Không thể xóa thư liên hệ."));
    } finally {
      setActionLoading(null);
    }
  };

  const canDelete =
    user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  const filteredContacts = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("vi");
    return contacts.filter((contact) => {
      const matchesStatus =
        statusFilter === "ALL" || contact.status === statusFilter;
      const matchesSearch =
        !query ||
        contact.name.toLocaleLowerCase("vi").includes(query) ||
        contact.phone?.includes(query) ||
        contact.email?.toLocaleLowerCase("vi").includes(query) ||
        contact.content.toLocaleLowerCase("vi").includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [contacts, searchQuery, statusFilter]);

  const columns = useMemo<ColumnDef<ContactMessage>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Người gửi",
        cell: ({ row }) => (
          <div className="min-w-52 space-y-1">
            <p className="flex items-center gap-2 font-black text-slate-950">
              <UserRound size={14} className="text-slate-400" />
              {row.original.name}
            </p>
            {row.original.phone ? (
              <p className="flex items-center gap-2 text-xs text-slate-500">
                <Phone size={12} />
                {row.original.phone}
              </p>
            ) : null}
            {row.original.email ? (
              <p className="flex items-center gap-2 text-xs text-slate-500">
                <Mail size={12} />
                {row.original.email}
              </p>
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: "content",
        header: "Nội dung",
        cell: ({ row }) => (
          <div className="max-w-md">
            <p className="line-clamp-2 text-sm leading-6 text-slate-700">
              {row.original.content}
            </p>
            {row.original.source ? (
              <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Nguồn: {row.original.source}
              </p>
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Thời gian",
        cell: ({ row }) => (
          <span className="block min-w-24 text-xs font-medium leading-5 text-slate-500">
            {new Date(row.original.createdAt).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => (
          <AdminSelect
            label={`Trạng thái của ${row.original.name}`}
            value={row.original.status}
            disabled={actionLoading === row.original.id}
            onChange={(event) =>
              void handleUpdateStatus(
                row.original,
                event.target.value as ContactStatus,
              )
            }
            className="min-w-36"
          >
            <option value="NEW">Mới nhận</option>
            <option value="READ">Đã xem</option>
            <option value="RESPONDED">Đã phản hồi</option>
          </AdminSelect>
        ),
      },
      {
        id: "actions",
        header: "Thao tác",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => openContact(row.original)}
              className="acbt-icon-btn grid h-9 w-9 place-items-center text-slate-600 hover:bg-orange-50 hover:text-orange-600"
              aria-label={`Xem thư của ${row.original.name}`}
              title="Xem chi tiết"
            >
              <Eye size={16} />
            </button>
            {canDelete ? (
              <button
                type="button"
                onClick={() => setDeleteTarget(row.original)}
                disabled={actionLoading === row.original.id}
                className="acbt-icon-btn grid h-9 w-9 place-items-center text-red-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                aria-label={`Xóa thư của ${row.original.name}`}
                title="Xóa"
              >
                <Trash2 size={16} />
              </button>
            ) : null}
          </div>
        ),
      },
    ],
    [
      actionLoading,
      canDelete,
      handleUpdateStatus,
      openContact,
    ],
  );

  return (
    <ProtectedRoute
      allowedRoles={[
        "SUPER_ADMIN",
        "ADMIN",
        "EDITOR",
        "MARKETING",
        "SUPPORT",
      ]}
    >
      <div className="space-y-5">
        <CmsPageHeader
          eyebrow="Khách hàng"
          title="Liên hệ & phản hồi"
          description="Theo dõi yêu cầu tư vấn, cập nhật tiến độ xử lý và xem đầy đủ nội dung khách hàng gửi."
        />

        <CmsPanel>
          <AdminToolbar>
            <AdminSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Tìm tên, số điện thoại, email hoặc nội dung..."
            />
            <AdminSelect
              label="Lọc theo trạng thái"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as ContactStatus | "ALL",
                )
              }
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="NEW">Mới nhận</option>
              <option value="READ">Đã xem</option>
              <option value="RESPONDED">Đã phản hồi</option>
            </AdminSelect>
          </AdminToolbar>

          {loading ? (
            <AdminLoadingState title="Đang tải thư liên hệ" />
          ) : loadError ? (
            <AdminErrorState
              description={loadError}
              action={
                <Button
                  variant="adminSecondary"
                  onClick={() => void fetchContacts()}
                >
                  Thử lại
                </Button>
              }
            />
          ) : (
            <DataTable
              columns={columns}
              data={filteredContacts}
              emptyTitle="Không tìm thấy liên hệ"
              emptyDescription={
                searchQuery || statusFilter !== "ALL"
                  ? "Hãy đổi từ khóa hoặc bộ lọc để xem kết quả khác."
                  : "Các yêu cầu mới từ website sẽ xuất hiện tại đây."
              }
            />
          )}
        </CmsPanel>
      </div>

      <AdminModal
        open={Boolean(viewingContact)}
        title="Chi tiết thư liên hệ"
        description={
          viewingContact
            ? `Gửi lúc ${new Date(viewingContact.createdAt).toLocaleString("vi-VN")}`
            : undefined
        }
        onClose={() => setViewingContact(null)}
        size="lg"
        footer={
          viewingContact ? (
            <>
              {viewingContact.status !== "RESPONDED" ? (
                <Button
                  variant="adminSecondary"
                  leftIcon={<ClipboardCheck size={15} />}
                  loading={actionLoading === viewingContact.id}
                  onClick={() =>
                    void handleUpdateStatus(viewingContact, "RESPONDED")
                  }
                >
                  Đánh dấu đã phản hồi
                </Button>
              ) : null}
              {viewingContact.status === "NEW" ? (
                <Button
                  variant="adminSecondary"
                  leftIcon={<Check size={15} />}
                  onClick={() =>
                    void handleUpdateStatus(viewingContact, "READ")
                  }
                >
                  Đánh dấu đã đọc
                </Button>
              ) : null}
              {canDelete ? (
                <Button
                  variant="adminDanger"
                  leftIcon={<Trash2 size={15} />}
                  onClick={() => setDeleteTarget(viewingContact)}
                >
                  Xóa thư
                </Button>
              ) : null}
            </>
          ) : null
        }
      >
        {viewingContact ? (
          <div className="grid gap-6 md:grid-cols-[240px_minmax(0,1fr)]">
            <div className="space-y-5 border-b border-slate-100 pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-6">
              <ContactDetail label="Người gửi" value={viewingContact.name} />
              <ContactDetail
                label="Số điện thoại"
                value={viewingContact.phone || "Không cung cấp"}
              />
              <ContactDetail
                label="Email"
                value={viewingContact.email || "Không cung cấp"}
              />
              <ContactDetail
                label="Nguồn"
                value={viewingContact.source || "Website"}
              />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                  Trạng thái
                </p>
                <Badge
                  variant={
                    viewingContact.status === "NEW"
                      ? "warning"
                      : viewingContact.status === "RESPONDED"
                        ? "success"
                        : "default"
                  }
                  className="mt-2"
                >
                  {STATUS_LABELS[viewingContact.status]}
                </Badge>
              </div>
            </div>
            <div>
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                <MessageSquare size={14} />
                Nội dung khách hàng gửi
              </p>
              <div className="mt-3 min-h-52 whitespace-pre-wrap border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-800">
                {viewingContact.content}
              </div>
            </div>
          </div>
        ) : null}
      </AdminModal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Xóa thư liên hệ?"
        description={`Thư của “${deleteTarget?.name || ""}” sẽ bị xóa vĩnh viễn.`}
        loading={Boolean(
          deleteTarget && actionLoading === deleteTarget.id,
        )}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
      />
    </ProtectedRoute>
  );
}

function ContactDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-bold leading-6 text-slate-800">
        {value}
      </p>
    </div>
  );
}
