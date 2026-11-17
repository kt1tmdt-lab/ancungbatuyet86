import { NextRequest, NextResponse } from "next/server";
import { Prisma, ProductStatus, type Product } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getAuthErrorStatus, requireRole } from "@/lib/authz";
import { logAudit } from "@/lib/audit";
import {
  PRODUCT_SHEET_FIELDS,
  SpreadsheetError,
  parseBoolean,
  parseProductSpreadsheet,
  parseStatus,
  resolveHeader,
  type ProductSheetFieldKey,
} from "@/lib/product-spreadsheet";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

type FieldKey = ProductSheetFieldKey;
type Source = Record<FieldKey, string>;

type ImportRowDetail = {
  rowNumber: number;
  status: "success" | "error";
  action: "created" | "updated" | null;
  productName: string;
  source: Source;
  saved: Record<FieldKey, unknown> | null;
  importedFields: FieldKey[];
  missingRequired: FieldKey[];
  missingOptional: FieldKey[];
  defaultedFields: FieldKey[];
  error?: string;
};

const FIELD_LABELS = Object.fromEntries(
  PRODUCT_SHEET_FIELDS.map((field) => [field.key, field.label]),
) as Record<FieldKey, string>;
const REQUIRED_KEYS =PRODUCT_SHEET_FIELDS.filter((field) => field.required).map((field) => field.key);

function hasValue(value: unknown) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined && String(value).trim() !== "";
}

/** Chuẩn hóa đường dẫn: bỏ dấu tiếng Việt, chỉ giữ a-z, 0-9 và dấu gạch ngang. */
function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Giá trị đã chuyển kiểu của một trường, đúng như sẽ lưu vào DB. */
function convertField(key: FieldKey, raw: string, source: Source): unknown {
  switch (key) {
    case "slug":
      return toSlug(raw);
    case "name":
    case "category":
    case "image":
    case "tagline":
    case "description":
    case "purchaseUrl":
    case "story":
      return raw;
    case "categoryLabel":
      return raw || source.category;
    case "price":
      return raw || "0đ";
    case "priceRange":
      return raw || null;
    case "heroImage":
    case "shortDescription":
      return raw || null;
    case "featured":
      return parseBoolean(raw);
    case "ingredients":
      return raw
        .split(/[;\n]/)
        .map((item) => item.trim())
        .filter(Boolean);
    case "status":
      return parseStatus(raw) ?? ProductStatus.PUBLISHED;
    case "sortOrder":
      return Number.parseInt(raw, 10) || 0;
    case "id":
      return raw;
  }
}

function serializeSaved(product: Product): Record<FieldKey, unknown> {
  return Object.fromEntries(
    PRODUCT_SHEET_FIELDS.map((field) => [field.key, product[field.key]]),
  ) as Record<FieldKey, unknown>;
}

function describeSaveError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") return "Đường dẫn (slug) đã được dùng cho sản phẩm khác";
    return `Không thể lưu dữ liệu (${error.code})`;
  }
  return "Không thể lưu dữ liệu vào hệ thống";
}

export async function POST(req: NextRequest) {
  let viewer;
  try {
    viewer = requireRole(req, ["SUPER_ADMIN", "ADMIN", "EDITOR"]);
  } catch (error) {
    const status = getAuthErrorStatus(error);
    return NextResponse.json({ error: status === 403 ? "Forbidden" : "Unauthorized" }, { status });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Vui lòng chọn file tải lên" }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File quá lớn (tối đa 10MB)." }, { status: 400 });
    }

    let sheet;
    try {
      sheet = await parseProductSpreadsheet(file);
    } catch (error) {
      if (error instanceof SpreadsheetError) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      throw error;
    }

    // Ghép từng cột trong file với trường sản phẩm (nhận cả tiêu đề tiếng Việt lẫn tên trường).
    const columnKeys = sheet.headers.map(resolveHeader);
    const presentKeys = new Set(columnKeys.filter((key): key is FieldKey => key !== null));
    const ignoredHeaders = sheet.headers.filter((header, index) => header && columnKeys[index] === null);

    if (!presentKeys.has("id") && !presentKeys.has("slug")) {
      return NextResponse.json(
        { error: "File cần có cột ID hoặc Đường dẫn để xác định sản phẩm." },
        { status: 400 },
      );
    }

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];
    const rowDetails: ImportRowDetail[] = [];

    for (const { rowNumber, cells } of sheet.rows) {
      const source = Object.fromEntries(PRODUCT_SHEET_FIELDS.map((field) => [field.key, ""])) as Source;
      columnKeys.forEach((key, index) => {
        if (key && !source[key]) source[key] = cells[index] ?? "";
      });

      const importedFields = PRODUCT_SHEET_FIELDS.filter((field) => hasValue(source[field.key])).map(
        (field) => field.key,
      );
      const missingOptional = PRODUCT_SHEET_FIELDS.filter(
        (field) => !field.required && field.key !== "id" && presentKeys.has(field.key) && !hasValue(source[field.key]),
      ).map((field) => field.key);
      const productName = source.name || source.slug || `Dòng ${rowNumber}`;

      const fail = (message: string, missingRequired: FieldKey[] = []) => {
        errorCount++;
        errors.push(`Dòng ${rowNumber}: ${message}`);
        rowDetails.push({
          rowNumber,
          status: "error",
          action: null,
          productName,
          source,
          saved: null,
          importedFields,
          missingRequired,
          missingOptional,
          defaultedFields: [],
          error: message,
        });
      };

      try {
        const slug = toSlug(source.slug);
        const existing =
          (source.id ? await prisma.product.findUnique({ where: { id: source.id } }) : null) ??
          (slug ? await prisma.product.findUnique({ where: { slug } }) : null);

        // Sản phẩm mới phải đủ mọi trường bắt buộc; sản phẩm cũ chỉ cần các cột bắt buộc có trong file không bị bỏ trống.
        const missingRequired = REQUIRED_KEYS.filter(
          (key) => (existing ? presentKeys.has(key) : true) && !hasValue(source[key]),
        );
        if (missingRequired.length > 0) {
          const labels = missingRequired.map((key) => FIELD_LABELS[key]).join(", ");
          const message = existing
            ? `Không được để trống: ${labels}`
            : `Sản phẩm mới thiếu trường bắt buộc: ${labels}`;
          fail(message, missingRequired);
          continue;
        }
        if (presentKeys.has("slug") && !slug) {
          fail("Đường dẫn không hợp lệ", ["slug"]);
          continue;
        }
        if (presentKeys.has("status") && source.status && !parseStatus(source.status)) {
          fail(`Trạng thái không hợp lệ: "${source.status}"`);
          continue;
        }

        // Khi cập nhật chỉ ghi các cột có trong file; cột không có giữ nguyên dữ liệu cũ.
        const keysToWrite = PRODUCT_SHEET_FIELDS.map((field) => field.key).filter(
          (key) => key !== "id" && (existing ? presentKeys.has(key) : true),
        );
        const data: Record<string, unknown> = {};
        for (const key of keysToWrite) {
          data[key] = convertField(key, source[key].trim(), source);
        }
        const saved = existing
          ? await prisma.product.update({
              where: { id: existing.id },
              data: data as Prisma.ProductUncheckedUpdateInput,
            })
          : await prisma.product.create({
              data: {
                ...(source.id ? { id: source.id } : {}),
                ...(data as Omit<Prisma.ProductUncheckedCreateInput, "id">),
              },
            });

        const savedValues = serializeSaved(saved);
        const defaultedFields = PRODUCT_SHEET_FIELDS.filter(
          (field) =>
            field.key !== "id" &&
            keysToWrite.includes(field.key) &&
            !hasValue(source[field.key]) &&
            hasValue(savedValues[field.key]),
        ).map((field) => field.key);

        successCount++;
        rowDetails.push({
          rowNumber,
          status: "success",
          action: existing ? "updated" : "created",
          productName: saved.name,
          source,
          saved: savedValues,
          importedFields,
          missingRequired: [],
          missingOptional,
          defaultedFields,
        });
      } catch (error) {
        console.error(`Import error row ${rowNumber}:`, error);
        fail(describeSaveError(error));
      }
    }

    await logAudit({
      userId: viewer.id,
      action: "IMPORT_PRODUCTS",
      entityType: "Product",
      details: {
        successCount,
        errorCount,
        created: rowDetails.filter((row) => row.action === "created").length,
        updated: rowDetails.filter((row) => row.action === "updated").length,
        file: file.name,
      },
    });

    return NextResponse.json({
      success: true,
      fileName: file.name,
      totalRows: rowDetails.length,
      successCount,
      errorCount,
      errors,
      fields: PRODUCT_SHEET_FIELDS.map(({ key, label, required }) => ({ key, label, required })),
      ignoredHeaders,
      rows: rowDetails,
    });
  } catch (error) {
    console.error("POST Products Import Error:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi nhập dữ liệu" }, { status: 500 });
  }
}
