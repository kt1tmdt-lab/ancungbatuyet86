import { isPartnershipRegistration } from "@/lib/contact-partnership";

export type PartnershipContact = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  content: string;
  source: string | null;
  status: string;
  createdAt: Date;
};

const STATUS_LABELS: Record<string, string> = {
  NEW: "Mới nhận",
  READ: "Đã xem",
  RESPONDED: "Đã phản hồi",
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeCsvCell(value: unknown) {
  let text = String(value ?? "").replace(/\r\n/g, "\n");
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function getPartnershipContacts<T extends { source: string | null }>(contacts: T[]) {
  return contacts.filter((contact) => isPartnershipRegistration(contact.source));
}

export function buildPartnershipCsv(contacts: PartnershipContact[]) {
  const headers = [
    "STT",
    "Mã hồ sơ",
    "Họ tên / Đơn vị",
    "Điện thoại",
    "Email",
    "Loại hợp tác",
    "Nội dung chi tiết",
    "Trạng thái",
    "Thời gian",
  ];
  const rows = contacts.map((contact, index) => [
    index + 1,
    contact.id,
    contact.name,
    contact.phone ? `${contact.phone}\t` : "",
    contact.email || "",
    contact.source || "Hợp tác",
    contact.content,
    STATUS_LABELS[contact.status] || contact.status,
    contact.createdAt.toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  ]);

  return [headers, ...rows]
    .map((row) => row.map(escapeCsvCell).join(","))
    .join("\r\n");
}

export function buildPartnershipSummary(contacts: PartnershipContact[]) {
  const byStatus = contacts.reduce<Record<string, number>>((result, contact) => {
    result[contact.status] = (result[contact.status] || 0) + 1;
    return result;
  }, {});
  const bySource = contacts.reduce<Record<string, number>>((result, contact) => {
    const source = contact.source || "Hợp tác khác";
    result[source] = (result[source] || 0) + 1;
    return result;
  }, {});
  const sourceLines = Object.entries(bySource)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 10)
    .map(([source, count]) => `• ${escapeHtml(source)}: <b>${count}</b>`)
    .join("\n");
  const oldest = contacts.at(-1)?.createdAt;
  const newest = contacts.at(0)?.createdAt;
  const formatDate = (date?: Date) =>
    date?.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) || "—";

  return (
    `📊 <b>TỔNG HỢP HỒ SƠ HỢP TÁC</b>\n\n` +
    `Tổng hồ sơ: <b>${contacts.length}</b>\n` +
    `🆕 Mới nhận: <b>${byStatus.NEW || 0}</b>\n` +
    `👀 Đã xem: <b>${byStatus.READ || 0}</b>\n` +
    `✅ Đã phản hồi: <b>${byStatus.RESPONDED || 0}</b>\n` +
    `📅 Dữ liệu: ${formatDate(oldest)} – ${formatDate(newest)}\n\n` +
    `<b>Theo loại hợp tác:</b>\n${sourceLines || "Chưa có dữ liệu"}`
  );
}
