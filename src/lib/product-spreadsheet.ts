import ExcelJS from "exceljs";
import { ProductStatus, type Product } from "@prisma/client";

/** Các cột được nhập/xuất trong file Excel sản phẩm. */
export const PRODUCT_SHEET_FIELDS = [
  { key: "id", label: "ID", required: false, width: 28, note: "Mã hệ thống. Để trống khi thêm sản phẩm mới. Không sửa ID của sản phẩm đã có." },
  { key: "slug", label: "Đường dẫn", required: true, width: 28, note: "Bắt buộc, duy nhất. Chỉ chữ thường không dấu, số và dấu gạch ngang, ví dụ: banh-trang-tron." },
  { key: "name", label: "Tên sản phẩm", required: true, width: 32, note: "Bắt buộc." },
  { key: "tagline", label: "Thông điệp ngắn", required: false, width: 36, note: "" },
  { key: "shortDescription", label: "Mô tả ngắn", required: false, width: 40, note: "" },
  { key: "description", label: "Mô tả", required: false, width: 50, note: "" },
  { key: "category", label: "Mã nhóm", required: true, width: 18, note: "Bắt buộc. Mã danh mục, ví dụ: banh-trang." },
  { key: "categoryLabel", label: "Tên nhóm", required: false, width: 22, note: "Để trống sẽ dùng Mã nhóm." },
  { key: "price", label: "Giá", required: false, width: 14, note: "Ví dụ: 35.000đ. Để trống sẽ là 0đ." },
  { key: "priceRange", label: "Khoảng giá", required: false, width: 18, note: "Ví dụ: 35.000đ - 120.000đ." },
  { key: "image", label: "Ảnh đại diện", required: true, width: 40, note: "Bắt buộc. Đường dẫn ảnh, ví dụ: /uploads/... hoặc https://..." },
  { key: "heroImage", label: "Ảnh hero", required: false, width: 40, note: "" },
  { key: "featured", label: "Sản phẩm chủ lực", required: false, width: 16, note: "Có hoặc Không." },
  { key: "purchaseUrl", label: "Liên kết mua hàng", required: false, width: 40, note: "" },
  { key: "ingredients", label: "Thành phần", required: false, width: 40, note: "Các thành phần cách nhau bởi dấu chấm phẩy (;)." },
  { key: "story", label: "Câu chuyện sản phẩm", required: false, width: 50, note: "" },
  { key: "status", label: "Trạng thái", required: false, width: 18, note: "Đang hiển thị, Bản nháp, Tạm hết hàng hoặc Lưu trữ. Để trống sẽ là Đang hiển thị." },
  { key: "sortOrder", label: "Thứ tự", required: false, width: 10, note: "Số nguyên, nhỏ hiển thị trước." },
] as const;

export type ProductSheetFieldKey = (typeof PRODUCT_SHEET_FIELDS)[number]["key"];

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  PUBLISHED: "Đang hiển thị",
  DRAFT: "Bản nháp",
  OUT_OF_STOCK: "Tạm hết hàng",
  ARCHIVED: "Lưu trữ",
};

const SHEET_NAME = "Sản phẩm";
const MAX_IMPORT_ROWS = 2000;

/** Bỏ dấu, chữ thường, chỉ giữ chữ và số, để so khớp tiêu đề cột/giá trị. */
function normalizeToken(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

const HEADER_LOOKUP = new Map<string, ProductSheetFieldKey>();
for (const field of PRODUCT_SHEET_FIELDS) {
  HEADER_LOOKUP.set(normalizeToken(field.key), field.key);
  HEADER_LOOKUP.set(normalizeToken(field.label), field.key);
}

/** Đổi tiêu đề cột (tiếng Việt hoặc tên trường) về khóa trường; null nếu không nhận ra. */
export function resolveHeader(header: string): ProductSheetFieldKey | null {
  const token = normalizeToken(header.replace(/\*/g, ""));
  return token ? HEADER_LOOKUP.get(token) ?? null : null;
}

export function parseStatus(value: string): ProductStatus | null {
  const token = normalizeToken(value);
  if (!token) return null;
  for (const status of Object.values(ProductStatus)) {
    if (normalizeToken(status) === token || normalizeToken(PRODUCT_STATUS_LABELS[status]) === token) {
      return status;
    }
  }
  return null;
}

export function parseBoolean(value: string) {
  return ["true", "1", "co", "x", "yes", "y"].includes(normalizeToken(value));
}

function productToRow(product: Product): Record<ProductSheetFieldKey, string | number> {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    tagline: product.tagline,
    shortDescription: product.shortDescription ?? "",
    description: product.description,
    category: product.category,
    categoryLabel: product.categoryLabel,
    price: product.price,
    priceRange: product.priceRange ?? "",
    image: product.image,
    heroImage: product.heroImage ?? "",
    featured: product.featured ? "Có" : "Không",
    purchaseUrl: product.purchaseUrl,
    ingredients: product.ingredients.join("; "),
    story: product.story,
    status: PRODUCT_STATUS_LABELS[product.status] ?? product.status,
    sortOrder: product.sortOrder,
  };
}

/** Tạo file Excel danh sách sản phẩm (hoặc file mẫu trống khi products rỗng). */
export async function buildProductWorkbook(products: Product[]) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "ACBT CMS";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet(SHEET_NAME, {
    views: [{ state: "frozen", xSplit: 3, ySplit: 1 }],
  });

  sheet.columns = PRODUCT_SHEET_FIELDS.map((field) => ({
    key: field.key,
    header: field.label,
    width: field.width,
    style: { alignment: { vertical: "top", wrapText: true } },
  }));

  const header = sheet.getRow(1);
  header.height = 24;
  PRODUCT_SHEET_FIELDS.forEach((field, index) => {
    const cell = header.getCell(index + 1);
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: field.required ? "FFC2410C" : field.key === "id" ? "FF64748B" : "FF1E293B" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    if (field.note) cell.note = field.note;
  });

  for (const product of products) {
    sheet.addRow(productToRow(product));
  }

  // Ô ID tô xám để nhắc không sửa; Trạng thái / Chủ lực có danh sách chọn sẵn.
  const lastRow = Math.max(products.length + 1, 500);
  const statusColumn = PRODUCT_SHEET_FIELDS.findIndex((field) => field.key === "status") + 1;
  const featuredColumn = PRODUCT_SHEET_FIELDS.findIndex((field) => field.key === "featured") + 1;
  const statusList = `"${Object.values(PRODUCT_STATUS_LABELS).join(",")}"`;
  for (let rowNumber = 2; rowNumber <= lastRow; rowNumber++) {
    const row = sheet.getRow(rowNumber);
    row.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1F5F9" } };
    row.getCell(statusColumn).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [statusList],
    };
    row.getCell(featuredColumn).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: ['"Có,Không"'],
    };
  }

  const guide = workbook.addWorksheet("Hướng dẫn");
  guide.columns = [
    { header: "Cột", key: "label", width: 24 },
    { header: "Bắt buộc", key: "required", width: 10 },
    { header: "Ghi chú", key: "note", width: 90 },
  ];
  guide.getRow(1).font = { bold: true };
  for (const field of PRODUCT_SHEET_FIELDS) {
    guide.addRow({ label: field.label, required: field.required ? "Có" : "", note: field.note });
  }
  guide.addRow({});
  [
    "Sửa sản phẩm: xuất file, sửa trực tiếp trên dòng của sản phẩm (giữ nguyên ID), rồi nhập lại.",
    "Thêm sản phẩm: thêm dòng mới, để trống ID, điền đủ các cột bắt buộc (tiêu đề màu cam).",
    "Nếu ID trống nhưng Đường dẫn trùng sản phẩm đã có, sản phẩm đó sẽ được cập nhật.",
    "Có thể xóa bớt cột không cần sửa: cột không có trong file sẽ được giữ nguyên dữ liệu cũ.",
    "Ô để trống trong cột có trong file sẽ xóa giá trị cũ (hoặc dùng giá trị mặc định).",
    "Nhập file không xóa sản phẩm. Muốn xóa hãy dùng nút xóa trên trang quản trị.",
  ].forEach((line) => guide.addRow({ label: line }));

  return workbook.xlsx.writeBuffer();
}

/** Đổi giá trị ô Excel (chuỗi, số, ngày, rich text, link, công thức) thành chuỗi. */
function cellToString(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") {
    if ("richText" in value) return value.richText.map((part) => part.text).join("");
    if ("hyperlink" in value) return cellToString(value.text as ExcelJS.CellValue) || String(value.hyperlink);
    if ("formula" in value || "sharedFormula" in value) {
      return cellToString((value as ExcelJS.CellFormulaValue).result as ExcelJS.CellValue);
    }
    if ("error" in value) return "";
  }
  return String(value);
}

export type ParsedSheet = {
  headers: string[];
  rows: { rowNumber: number; cells: string[] }[];
};

async function parseXlsx(buffer: ArrayBuffer): Promise<ParsedSheet> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const sheet =
    workbook.getWorksheet(SHEET_NAME) ??
    workbook.worksheets.find((ws) => ws.state === "visible") ??
    workbook.worksheets[0];
  if (!sheet) return { headers: [], rows: [] };

  const columnCount = sheet.columnCount;
  const readRow = (row: ExcelJS.Row) =>
    Array.from({ length: columnCount }, (_, index) => cellToString(row.getCell(index + 1).value).trim());

  const headers = readRow(sheet.getRow(1));
  const rows: ParsedSheet["rows"] = [];
  sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return;
    const cells = readRow(row);
    if (cells.some((cell) => cell !== "")) rows.push({ rowNumber, cells });
  });

  return { headers, rows };
}

function parseCsv(text: string): ParsedSheet {
  const result: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  const input = text.replace(/^﻿/, "").replace(/\r\n?/g, "\n");

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (inQuotes) {
      if (char === '"' && input[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      result.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  if (cell !== "" || row.length > 0) {
    row.push(cell);
    result.push(row);
  }

  const [headers = [], ...data] = result;
  return {
    headers: headers.map((header) => header.trim()),
    rows: data
      .map((cells, index) => ({ rowNumber: index + 2, cells: cells.map((value) => value.trim()) }))
      .filter((entry) => entry.cells.some((value) => value !== "")),
  };
}

export class SpreadsheetError extends Error {}

/** Đọc file .xlsx hoặc .csv tải lên. */
export async function parseProductSpreadsheet(file: File): Promise<ParsedSheet> {
  const name = file.name.toLowerCase();
  let parsed: ParsedSheet;

  if (name.endsWith(".xlsx")) {
    try {
      parsed = await parseXlsx(await file.arrayBuffer());
    } catch {
      throw new SpreadsheetError("Không đọc được file Excel. Hãy lưu file dưới dạng .xlsx rồi thử lại.");
    }
  } else if (name.endsWith(".csv")) {
    parsed = parseCsv(await file.text());
  } else {
    throw new SpreadsheetError("Chỉ hỗ trợ file Excel (.xlsx) hoặc CSV (.csv).");
  }

  if (parsed.rows.length === 0) {
    throw new SpreadsheetError("File không có dòng dữ liệu nào.");
  }
  if (parsed.rows.length > MAX_IMPORT_ROWS) {
    throw new SpreadsheetError(`File có quá nhiều dòng (tối đa ${MAX_IMPORT_ROWS}).`);
  }
  return parsed;
}
