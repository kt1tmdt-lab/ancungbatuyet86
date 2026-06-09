import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

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
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "EDITOR")) {
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
    
    // Check if required headers are present: name, slug, category, image
    const required = ["name", "slug", "category", "image"];
    for (const reqHeader of required) {
      if (!headers.includes(reqHeader)) {
        return NextResponse.json({ error: `Thiếu cột bắt buộc: ${reqHeader}` }, { status: 400 });
      }
    }

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Parse data rows
    for (let rIdx = 1; rIdx < rows.length; rIdx++) {
      const row = rows[rIdx];
      if (row.length < required.length) continue; // skip blank/corrupted rows

      // Map headers to row cell values
      const p: Record<string, string> = {};
      headers.forEach((h, colIdx) => {
        p[h] = row[colIdx] || "";
      });

      const {
        id,
        slug,
        name,
        tagline,
        description,
        category,
        categorylabel,
        price,
        pricerange,
        image,
        heroimage,
        featured,
        purchaseurl,
        ingredients,
        story,
        status,
        sortorder,
        shortdescription,
      } = p;

      if (!name || !slug || !category || !image) {
        errorCount++;
        errors.push(`Dòng ${rIdx + 1}: Thiếu trường dữ liệu bắt buộc (name/slug/category/image)`);
        continue;
      }

      const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");

      const data: any = {
        slug: cleanSlug,
        name: name.trim(),
        tagline: tagline ? tagline.trim() : "",
        description: description ? description.trim() : "",
        category: category.trim(),
        categoryLabel: categorylabel ? categorylabel.trim() : category.trim(),
        price: price ? price.trim() : "0đ",
        priceRange: pricerange ? pricerange.trim() : (price ? price.trim() : null),
        image: image.trim(),
        heroImage: heroimage ? heroimage.trim() : null,
        featured: featured === "true" || featured === "1",
        purchaseUrl: purchaseurl ? purchaseurl.trim() : "",
        ingredients: ingredients ? ingredients.split(";").map((i) => i.trim()).filter(Boolean) : [],
        story: story ? story.trim() : "",
        status: (status === "DRAFT" || status === "PUBLISHED" || status === "OUT_OF_STOCK" || status === "ARCHIVED") ? status : "PUBLISHED",
        sortOrder: parseInt(sortorder) || 0,
        shortDescription: shortdescription ? shortdescription.trim() : null,
      };

      try {
        if (id && id.trim()) {
          // Upsert by ID
          const cleanId = id.trim();
          await prisma.product.upsert({
            where: { id: cleanId },
            update: data,
            create: { id: cleanId, ...data },
          });
        } else {
          // Upsert by Slug
          await prisma.product.upsert({
            where: { slug: cleanSlug },
            update: data,
            create: data,
          });
        }
        successCount++;
      } catch (err: any) {
        console.error(`Import error row ${rIdx + 1}:`, err);
        errorCount++;
        errors.push(`Dòng ${rIdx + 1}: Lỗi lưu vào cơ sở dữ liệu (${err?.message || String(err)})`);
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
      successCount,
      errorCount,
      errors,
    });
  } catch (error: any) {
    console.error("POST Products Import Error:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi import dữ liệu" }, { status: 500 });
  }
}
