import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthErrorStatus, requireRole } from "@/lib/authz";
import { buildProductWorkbook } from "@/lib/product-spreadsheet";

export const runtime = "nodejs";

/** Xuất danh sách sản phẩm ra Excel. `?template=1` trả file mẫu trống để thêm sản phẩm mới. */
export async function GET(req: NextRequest) {
  try {
    requireRole(req, ["SUPER_ADMIN", "ADMIN", "EDITOR"]);
  } catch (error) {
    const status = getAuthErrorStatus(error);
    return NextResponse.json({ error: status === 403 ? "Forbidden" : "Unauthorized" }, { status });
  }

  try {
    const isTemplate = req.nextUrl.searchParams.get("template") === "1";
    const products = isTemplate
      ? []
      : await prisma.product.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });

    const workbook = await buildProductWorkbook(products);
    const date = new Date().toISOString().slice(0, 10);
    const filename = isTemplate ? "mau-nhap-san-pham.xlsx" : `danh-sach-san-pham-${date}.xlsx`;

    return new NextResponse(Buffer.from(workbook), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("GET Products Export Error:", error);
    return NextResponse.json({ error: "Không thể xuất file Excel." }, { status: 500 });
  }
}
