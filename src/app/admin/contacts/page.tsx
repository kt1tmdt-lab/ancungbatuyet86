"use client";

import { useState, useEffect, useMemo } from "react";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { DataTable } from "@/components/admin/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Search, Loader, Trash, Phone, Mail, User, Eye, X, Check, ClipboardCheck, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";

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
  
  // Modal State for Viewing Detail
  const [viewingContact, setViewingContact] = useState<ContactMessage | null>(null);

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
        const updated = contacts.map(c => c.id === id ? { ...c, status: newStatus } : c);
        setContacts(updated);
        
        // Update currently viewing contact state if open
        if (viewingContact && viewingContact.id === id) {
          setViewingContact({ ...viewingContact, status: newStatus });
        }
        
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
        if (viewingContact && viewingContact.id === id) {
          setViewingContact(null);
        }
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
              <div className="flex items-center gap-2 text-xs text-slate-650">
                <Phone size={12} className="text-slate-400" />
                <span>{c.phone}</span>
              </div>
            )}
            {c.email && (
              <div className="flex items-center gap-2 text-xs text-slate-650">
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
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap line-clamp-2">
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
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => {
                setViewingContact(c);
                if (c.status === "NEW") {
                  handleUpdateStatus(c.id, "READ");
                }
              }}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition rounded"
              title="Xem chi tiết tin nhắn"
            >
              <Eye size={15} />
            </button>
            {canDelete && (
              <button
                onClick={() => handleDelete(c.id)}
                disabled={actionLoading === c.id}
                className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition rounded disabled:opacity-50"
                title="Xóa tin nhắn"
              >
                <Trash size={15} />
              </button>
            )}
          </div>
        );
      }
    }
  ], [actionLoading, user?.role, viewingContact]);

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
              className="px-4 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 text-xs font-bold cursor-pointer"
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

      {/* Message Details Modal */}
      {viewingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-slate-250 shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 text-primary">
                  <MessageSquare size={16} />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Chi tiết thư liên hệ
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingContact(null)}
                className="p-1 text-slate-400 hover:text-slate-650 hover:bg-slate-100 rounded transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="grid md:grid-cols-[1fr_1.3fr] divide-y md:divide-y-0 md:divide-x divide-slate-100 h-full">
              {/* Left Column: Sender Metadata */}
              <div className="p-6 space-y-4 text-sm">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Người gửi</label>
                  <p className="font-extrabold text-slate-900 mt-1">{viewingContact.name}</p>
                </div>
                
                {viewingContact.phone && (
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Số điện thoại</label>
                    <p className="font-semibold text-slate-700 mt-1 flex items-center gap-1.5">
                      <Phone size={13} className="text-slate-400" />
                      {viewingContact.phone}
                    </p>
                  </div>
                )}

                {viewingContact.email && (
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email liên hệ</label>
                    <p className="font-semibold text-slate-700 mt-1 flex items-center gap-1.5">
                      <Mail size={13} className="text-slate-400" />
                      {viewingContact.email}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Thời gian gửi</label>
                  <p className="font-semibold text-slate-700 mt-1">
                    {new Date(viewingContact.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Trạng thái hiện tại</label>
                  <div className="mt-1">
                    <span className={`inline-block px-2.5 py-1 text-xs font-bold ${
                      viewingContact.status === "NEW" ? "bg-orange-50 text-orange-600 border border-orange-200" :
                      viewingContact.status === "READ" ? "bg-blue-50 text-blue-600 border border-blue-200" :
                      "bg-green-50 text-green-600 border border-green-200"
                    }`}>
                      {viewingContact.status === "NEW" ? "Mới nhận" :
                       viewingContact.status === "READ" ? "Đã xem" :
                       "Đã phản hồi"}
                    </span>
                  </div>
                </div>

                {viewingContact.source && (
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nguồn thu thập</label>
                    <p className="font-semibold text-slate-700 mt-0.5">{viewingContact.source}</p>
                  </div>
                )}
              </div>

              {/* Right Column: Message Content */}
              <div className="p-6 bg-slate-50/50 flex flex-col justify-between">
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nội dung tin nhắn</label>
                  <div className="bg-white border border-slate-200/60 p-4 min-h-[160px] text-sm text-slate-800 leading-relaxed whitespace-pre-wrap select-text overflow-y-auto max-h-[250px]">
                    {viewingContact.content}
                  </div>
                </div>

                {/* Actions inside Modal */}
                <div className="mt-6 flex flex-wrap gap-2 justify-end border-t border-slate-100 pt-4">
                  {viewingContact.status !== "RESPONDED" && (
                    <Button
                      variant="adminSecondary"
                      onClick={() => handleUpdateStatus(viewingContact.id, "RESPONDED")}
                      leftIcon={<ClipboardCheck size={14} />}
                      className="px-3.5 py-1.5 text-xs text-green-700 hover:text-green-800"
                    >
                      Đã phản hồi
                    </Button>
                  )}
                  {viewingContact.status === "NEW" && (
                    <Button
                      variant="adminSecondary"
                      onClick={() => handleUpdateStatus(viewingContact.id, "READ")}
                      leftIcon={<Check size={14} />}
                      className="px-3.5 py-1.5 text-xs text-blue-700 hover:text-blue-800"
                    >
                      Đã đọc
                    </Button>
                  )}
                  {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
                    <Button
                      variant="adminDanger"
                      onClick={() => handleDelete(viewingContact.id)}
                      leftIcon={<Trash size={14} />}
                      className="px-3.5 py-1.5 text-xs"
                    >
                      Xóa thư
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end px-6 py-4 border-t border-slate-100 bg-slate-50">
              <Button
                variant="adminSecondary"
                onClick={() => setViewingContact(null)}
                className="px-4 py-2 text-xs"
              >
                Đóng lại
              </Button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
