import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";

// Helper to escape CSV values
function escapeCSV(val: unknown): string {
  if (val === null || val === undefined) return "";
  let str = "";
  if (typeof val === "object") {
    str = JSON.stringify(val);
  } else {
    str = String(val);
  }
  // Replace double quotes with doubled double quotes
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const products = await prisma.product.findMany({
      orderBy: { sortOrder: "asc" },
    });
    const totalProducts = products.length;
    const categoryTotals = products.reduce<Record<string, number>>((totals, product) => {
      const key = product.categoryLabel || product.category || "Khác";
      totals[key] = (totals[key] || 0) + 1;
      return totals;
    }, {});
    const statusTotals = products.reduce<Record<string, number>>((totals, product) => {
      const key = product.status || "UNKNOWN";
      totals[key] = (totals[key] || 0) + 1;
      return totals;
    }, {});

    const headers = [
      "id",
      "slug",
      "name",
      "tagline",
      "description",
      "category",
      "categoryLabel",
      "price",
      "priceRange",
      "image",
      "heroImage",
      "featured",
      "purchaseUrl",
      "ingredients",
      "story",
      "status",
      "sortOrder",
      "shortDescription",
      "soThuTuCongDon",
      "tongSanPham",
      "tongTheoDanhMuc",
      "tongTheoTrangThai",
    ];

    const csvRows = [headers.join(",")];

    for (const [index, p] of products.entries()) {
      const row = [
        escapeCSV(p.id),
        escapeCSV(p.slug),
        escapeCSV(p.name),
        escapeCSV(p.tagline),
        escapeCSV(p.description),
        escapeCSV(p.category),
        escapeCSV(p.categoryLabel),
        escapeCSV(p.price),
        escapeCSV(p.priceRange),
        escapeCSV(p.image),
        escapeCSV(p.heroImage),
        escapeCSV(p.featured ? "true" : "false"),
        escapeCSV(p.purchaseUrl),
        escapeCSV(p.ingredients.join(";")),
        escapeCSV(p.story),
        escapeCSV(p.status),
        escapeCSV(p.sortOrder),
        escapeCSV(p.shortDescription),
        escapeCSV(index + 1),
        escapeCSV(totalProducts),
        escapeCSV(categoryTotals[p.categoryLabel || p.category || "Khác"] || 0),
        escapeCSV(statusTotals[p.status] || 0),
      ];
      csvRows.push(row.join(","));
    }

    // Add UTF-8 BOM (\uFEFF) so Excel opens it with correct Vietnamese encoding
    const csvContent = "\uFEFF" + csvRows.join("\r\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="danh-sach-san-pham.csv"',
      },
    });
  } catch (error) {
    console.error("GET Products Export Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
