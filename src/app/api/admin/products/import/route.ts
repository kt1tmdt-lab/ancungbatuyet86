import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { Prisma, ProductStatus } from "@prisma/client";

const IMPORT_FIELDS = [
  { csv: "id", key: "id", label: "ID", required: false, reportMissing: false },
  { csv: "slug", key: "slug", label: "Đường dẫn", required: true, reportMissing: true },
  { csv: "name", key: "name", label: "Tên sản phẩm", required: true, reportMissing: true },
  { csv: "tagline", key: "tagline", label: "Thông điệp ngắn", required: false, reportMissing: true },
  { csv: "description", key: "description", label: "Mô tả", required: false, reportMissing: true },
  { csv: "category", key: "category", label: "Mã nhóm", required: true, reportMissing: true },
  { csv: "categorylabel", key: "categoryLabel", label: "Tên nhóm", required: false, reportMissing: true },
  { csv: "price", key: "price", label: "Giá", required: false, reportMissing: true },
  { csv: "pricerange", key: "priceRange", label: "Khoảng giá", required: false, reportMissing: true },
  { csv: "image", key: "image", label: "Ảnh đại diện", required: true, reportMissing: true },
  { csv: "heroimage", key: "heroImage", label: "Ảnh hero", required: false, reportMissing: true },
  { csv: "featured", key: "featured", label: "Sản phẩm chủ lực", required: false, reportMissing: true },
  { csv: "purchaseurl", key: "purchaseUrl", label: "Liên kết mua hàng", required: false, reportMissing: true },
  { csv: "ingredients", key: "ingredients", label: "Thành phần", required: false, reportMissing: true },
  { csv: "story", key: "story", label: "Câu chuyện sản phẩm", required: false, reportMissing: true },
  { csv: "status", key: "status", label: "Trạng thái", required: false, reportMissing: true },
  { csv: "sortorder", key: "sortOrder", label: "Thứ tự", required: false, reportMissing: true },
  { csv: "shortdescription", key: "shortDescription", label: "Mô tả ngắn", required: false, reportMissing: true },
] as const;

type ImportFieldKey = (typeof IMPORT_FIELDS)[number]["key"];

type ImportRowDetail = {
  rowNumber: number;
  status: "success" | "error";
  action: "created" | "updated" | null;
  productName: string;
  source: Record<ImportFieldKey, string>;
  saved: Record<ImportFieldKey, unknown> | null;
  importedFields: ImportFieldKey[];
  missingRequired: ImportFieldKey[];
  missingOptional: ImportFieldKey[];
  defaultedFields: ImportFieldKey[];
  error?: string;
};

const REQUIRED_HEADERS = IMPORT_FIELDS
  .filter((field) => field.required)
  .map((field) => field.csv);
const ACCEPTED_HEADERS = new Set<string>(
  IMPORT_FIELDS.map((field) => field.csv),
);

function emptySource(): Record<ImportFieldKey, string> {
  return Object.fromEntries(
    IMPORT_FIELDS.map((field) => [field.key, ""]),
  ) as Record<ImportFieldKey, string>;
}

function mapSourceRow(headers: string[], row: string[]) {
  const byHeader: Record<string, string> = {};
  headers.forEach((header, index) => {
    byHeader[header] = row[index]?.trim() || "";
  });

  const source = emptySource();
  IMPORT_FIELDS.forEach((field) => {
    source[field.key] = byHeader[field.csv] || "";
  });
  return source;
}

function hasValue(value: unknown) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined && String(value).trim() !== "";
}

function serializeSavedProduct(
  product: Awaited<ReturnType<typeof prisma.product.upsert>>,
): Record<ImportFieldKey, unknown> {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    tagline: product.tagline,
    description: product.description,
    category: product.category,
    categoryLabel: product.categoryLabel,
    price: product.price,
    priceRange: product.priceRange,
    image: product.image,
    heroImage: product.heroImage,
    featured: product.featured,
    purchaseUrl: product.purchaseUrl,
    ingredients: product.ingredients,
    story: product.story,
    status: product.status,
    sortOrder: product.sortOrder,
    shortDescription: product.shortDescription,
  };
}

function parseCSV(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  // Remove BOM if present
  let cleanText = text;
  if (text.startsWith("\uFEFF")) {
    cleanText = text.substring(1);
  }

  const normalizedText = cleanText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  for (let i = 0; i < normalizedText.length; i++) {
    const char = normalizedText[i];
    const next = normalizedText[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(cell);
        cell = "";
      } else if (char === "\n") {
        row.push(cell);
        if (row.length > 1 || row[0] !== "") {
          result.push(row);
        }
        row = [];
        cell = "";
      } else {
        cell += char;
      }
    }
  }

  if (cell !== "" || row.length > 0) {
    row.push(cell);
    result.push(row);
  }

  return result;
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || (payload.role !== "SUPER_ADMIN" && payload.role !== "ADMIN" && payload.role !== "EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "Vui lòng chọn file tải lên" }, { status: 400 });
    }

    const text = await file.text();
    const rows = parseCSV(text);

    if (rows.length < 2) {
      return NextResponse.json({ error: "File CSV trống hoặc sai cấu trúc" }, { status: 400 });
    }

    const headers = rows[0].map((h) => h.trim().toLowerCase());
    
    for (const reqHeader of REQUIRED_HEADERS) {
      if (!headers.includes(reqHeader)) {
        return NextResponse.json({ error: `Thiếu cột bắt buộc: ${reqHeader}` }, { status: 400 });
      }
    }

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];
    const rowDetails: ImportRowDetail[] = [];
    const ignoredHeaders = headers.filter(
      (header) => header && !ACCEPTED_HEADERS.has(header),
    );

    // Parse data rows
    for (let rIdx = 1; rIdx < rows.length; rIdx++) {
      const row = rows[rIdx];
      const source = mapSourceRow(headers, row);
      const importedFields = IMPORT_FIELDS
        .filter((field) => hasValue(source[field.key]))
        .map((field) => field.key);
      const missingRequired = IMPORT_FIELDS
        .filter((field) => field.required && !hasValue(source[field.key]))
        .map((field) => field.key);
      const missingOptional = IMPORT_FIELDS
        .filter(
          (field) =>
            !field.required &&
            field.reportMissing &&
            !hasValue(source[field.key]),
        )
        .map((field) => field.key);

      if (missingRequired.length > 0) {
        errorCount++;
        const message = `Thiếu trường bắt buộc: ${missingRequired.join(", ")}`;
        errors.push(`Dòng ${rIdx + 1}: ${message}`);
        rowDetails.push({
          rowNumber: rIdx + 1,
          status: "error",
          action: null,
          productName: source.name || source.slug || `Dòng ${rIdx + 1}`,
          source,
          saved: null,
          importedFields,
          missingRequired,
          missingOptional,
          defaultedFields: [],
          error: message,
        });
        continue;
      }

      const cleanSlug = source.slug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-");

      const productStatus = Object.values(ProductStatus).includes(
        source.status as ProductStatus,
      )
        ? (source.status as ProductStatus)
        : ProductStatus.PUBLISHED;

      const data: Prisma.ProductUncheckedCreateInput = {
        slug: cleanSlug,
        name: source.name.trim(),
        tagline: source.tagline,
        description: source.description,
        category: source.category.trim(),
        categoryLabel: source.categoryLabel || source.category.trim(),
        price: source.price || "0đ",
        priceRange: source.priceRange || source.price || null,
        image: source.image.trim(),
        heroImage: source.heroImage || null,
        featured: source.featured === "true" || source.featured === "1",
        purchaseUrl: source.purchaseUrl,
        ingredients: source.ingredients
          ? source.ingredients
              .split(";")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        story: source.story,
        status: productStatus,
        sortOrder: Number.parseInt(source.sortOrder, 10) || 0,
        shortDescription: source.shortDescription || null,
      };

      try {
        const existingProduct = source.id
          ? await prisma.product.findUnique({ where: { id: source.id } })
          : await prisma.product.findUnique({ where: { slug: cleanSlug } });
        let savedProduct;

        if (source.id) {
          savedProduct = await prisma.product.upsert({
            where: { id: source.id },
            update: data,
            create: { id: source.id, ...data },
          });
        } else {
          savedProduct = await prisma.product.upsert({
            where: { slug: cleanSlug },
            update: data,
            create: data,
          });
        }

        const saved = serializeSavedProduct(savedProduct);
        const defaultedFields = IMPORT_FIELDS
          .filter(
            (field) =>
              field.reportMissing &&
              !hasValue(source[field.key]) &&
              hasValue(saved[field.key]),
          )
          .map((field) => field.key);

        successCount++;
        rowDetails.push({
          rowNumber: rIdx + 1,
          status: "success",
          action: existingProduct ? "updated" : "created",
          productName: savedProduct.name,
          source,
          saved,
          importedFields,
          missingRequired,
          missingOptional,
          defaultedFields,
        });
      } catch (err: unknown) {
        console.error(`Import error row ${rIdx + 1}:`, err);
        errorCount++;
        const message =
          err instanceof Prisma.PrismaClientKnownRequestError
            ? `Không thể lưu dữ liệu (${err.code})`
            : "Không thể lưu dữ liệu vào hệ thống";
        errors.push(`Dòng ${rIdx + 1}: ${message}`);
        rowDetails.push({
          rowNumber: rIdx + 1,
          status: "error",
          action: null,
          productName: source.name || source.slug || `Dòng ${rIdx + 1}`,
          source,
          saved: null,
          importedFields,
          missingRequired,
          missingOptional,
          defaultedFields: [],
          error: message,
        });
      }
    }

    await logAudit({
      userId: payload.id,
      action: "IMPORT_PRODUCTS",
      entityType: "Product",
      details: { successCount, errorCount, file: file.name },
    });

    return NextResponse.json({
      success: true,
      fileName: file.name,
      totalRows: rowDetails.length,
      successCount,
      errorCount,
      errors,
      fields: IMPORT_FIELDS.map(({ key, label, required }) => ({
        key,
        label,
        required,
      })),
      ignoredHeaders,
      rows: rowDetails,
    });
  } catch (error: unknown) {
    console.error("POST Products Import Error:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi import dữ liệu" }, { status: 500 });
  }
}
