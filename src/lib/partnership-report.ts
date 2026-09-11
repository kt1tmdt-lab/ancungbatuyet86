import { isPartnershipRegistration } from "@/lib/contact-partnership";
import ExcelJS from "exceljs";

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

export async function buildPartnershipWorkbook(contacts: PartnershipContact[]) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "ACBT Website";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Hồ sơ hợp tác", {
    views: [{ state: "frozen", ySplit: 1 }],
  });
  worksheet.columns = [
    { header: "STT", key: "index", width: 8 },
    { header: "Mã hồ sơ", key: "id", width: 28 },
    { header: "Họ tên / Đơn vị", key: "name", width: 26 },
    { header: "Điện thoại", key: "phone", width: 18 },
    { header: "Email", key: "email", width: 30 },
    { header: "Loại hợp tác", key: "source", width: 30 },
    { header: "Nội dung chi tiết", key: "content", width: 72 },
    { header: "Trạng thái", key: "status", width: 18 },
    { header: "Thời gian", key: "createdAt", width: 22 },
  ];

  for (const [index, contact] of contacts.entries()) {
    worksheet.addRow({
      index: index + 1,
      id: contact.id,
      name: contact.name,
      phone: contact.phone || "",
      email: contact.email || "",
      source: contact.source || "Hợp tác khác",
      content: contact.content,
      status: STATUS_LABELS[contact.status] || contact.status,
      createdAt: contact.createdAt.toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        dateStyle: "short",
        timeStyle: "short",
      }),
    });
  }

  const header = worksheet.getRow(1);
  header.height = 28;
  header.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
  header.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  header.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF97316" },
  };
  header.eachCell((cell) => {
    cell.border = {
      bottom: { style: "medium", color: { argb: "FFEA580C" } },
    };
  });

  worksheet.autoFilter = { from: "A1", to: "I1" };
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.alignment = { vertical: "top", wrapText: true };
      row.height = 42;
      const statusCell = row.getCell("H");
      const status = String(statusCell.value || "");
      const color = status.includes("Mới")
        ? "FFFFF7ED"
        : status.includes("phản hồi")
          ? "FFDCFCE7"
          : "FFEFF6FF";
      statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: color } };
    }
    row.eachCell((cell) => {
      cell.border = {
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
      };
    });
  });

  const summary = workbook.addWorksheet("Tóm tắt");
  summary.columns = [
    { header: "Chỉ số", key: "metric", width: 32 },
    { header: "Số lượng", key: "count", width: 16 },
  ];
  summary.addRows([
    { metric: "Tổng hồ sơ hợp tác", count: contacts.length },
    { metric: "Mới nhận", count: contacts.filter((contact) => contact.status === "NEW").length },
    { metric: "Đã xem", count: contacts.filter((contact) => contact.status === "READ").length },
    { metric: "Đã phản hồi", count: contacts.filter((contact) => contact.status === "RESPONDED").length },
  ]);
  const summaryHeader = summary.getRow(1);
  summaryHeader.font = { bold: true, color: { argb: "FFFFFFFF" } };
  summaryHeader.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEA580C" } };

  const buffer = await workbook.xlsx.writeBuffer();
  return new Uint8Array(buffer);
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
