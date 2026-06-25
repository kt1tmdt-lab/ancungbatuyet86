"use client";

import { useState, useEffect, useMemo } from "react";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { DataTable } from "@/components/admin/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Search, Loader, Trash, Phone, Mail, User } from "lucide-react";
import toast from "react-hot-toast";

interface ContactMessage {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  content: string;
  source: string | null;
  status: string; // NEW, READ, RESPONDED
  createdAt: string;
}

export default function ContactsPage() {
  const { token, user } = useAuth();
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    fetch("/api/contacts", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load"))))
      .then((data) => {
        if (!cancelled) setContacts(data);
      })
      .catch((error) => {
        if (!cancelled) console.error("Failed to fetch contacts", error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setContacts(contacts.map(c => c.id === id ? { ...c, status: newStatus } : c));
        toast.success("Cập nhật trạng thái thành công");
      } else {
        toast.error("Không thể cập nhật trạng thái");
      }
    } catch {
      toast.error("Lỗi kết nối");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tin nhắn này không?")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setContacts(contacts.filter(c => c.id !== id));
        toast.success("Đã xóa tin nhắn");
      } else {
        toast.error("Không thể xóa tin nhắn");
      }
    } catch {
      toast.error("Lỗi kết nối");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredContacts = useMemo(() => {
    let result = contacts;
    
    if (statusFilter !== "ALL") {
      result = result.filter(c => c.status === statusFilter);
    }

    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(lower) || 
        (c.phone && c.phone.includes(lower)) ||
        (c.email && c.email.toLowerCase().includes(lower)) ||
        c.content.toLowerCase().includes(lower)
      );
    }

    return result;
  }, [contacts, searchQuery, statusFilter]);

  const columns = useMemo<ColumnDef<ContactMessage>[]>(() => [
    {
      accessorKey: "name",
      header: "Người gửi",
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <User size={14} className="text-slate-400" />
              <span className="font-bold text-slate-900">{c.name}</span>
            </div>
            {c.phone && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Phone size={12} className="text-slate-400" />
                <span>{c.phone}</span>
              </div>
            )}
            {c.email && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Mail size={12} className="text-slate-400" />
                <span>{c.email}</span>
              </div>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: "content",
      header: "Nội dung tin nhắn",
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="max-w-xs xl:max-w-md">
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap line-clamp-3">
              {c.content}
            </p>
            {c.source && (
              <span className="inline-block mt-2 text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5">
                Nguồn: {c.source}
              </span>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: "createdAt",
      header: "Thời gian",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return (
          <div className="flex flex-col gap-1 text-xs text-slate-600">
            <span className="font-bold text-slate-800">{date.toLocaleDateString("vi-VN")}</span>
            <span>{date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        );
      }
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const c = row.original;
        return (
          <select
            value={c.status}
            onChange={(e) => handleUpdateStatus(c.id, e.target.value)}
            disabled={actionLoading === c.id}
            className={`text-xs font-bold px-2 py-1.5 outline-none border-b-2 bg-transparent ${
              c.status === "NEW" ? "text-orange-600 border-orange-500" :
              c.status === "READ" ? "text-blue-600 border-blue-500" :
              "text-green-600 border-green-500"
            }`}
          >
            <option value="NEW" className="text-slate-900">Mới</option>
            <option value="READ" className="text-slate-900">Đã xem</option>
            <option value="RESPONDED" className="text-slate-900">Đã phản hồi</option>
          </select>
        );
      }
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        const c = row.original;
        const canDelete = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
        return (
          <div className="flex items-center justify-end gap-2">
            {canDelete && (
            <button
              onClick={() => handleDelete(c.id)}
              disabled={actionLoading === c.id}
              className="acbt-icon-btn p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              title="Xóa tin nhắn"
            >
              <Trash size={15} />
            </button>
            )}
          </div>
        );
      }
    }
  ], [actionLoading, user?.role]);

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "EDITOR", "MARKETING"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Liên hệ & Phản hồi</h1>
          <p className="text-slate-500 text-sm mt-1">Quản lý tin nhắn, yêu cầu tư vấn và phản hồi từ khách hàng.</p>
        </div>

        <div className="bg-white border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Tìm tên, SĐT, Email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="NEW">Mới nhận</option>
              <option value="READ">Đã xem</option>
              <option value="RESPONDED">Đã phản hồi</option>
            </select>
          </div>

          {loading ? (
            <div className="py-20 text-center"><Loader className="animate-spin text-primary mx-auto mb-2" size={30} /></div>
          ) : (
            <DataTable columns={columns} data={filteredContacts} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
