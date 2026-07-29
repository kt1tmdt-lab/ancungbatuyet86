import { NextRequest, NextResponse } from "next/server";
import {
  DISTRIBUTION_PAGE_SIZE,
  loadDistributionData,
} from "@/lib/distribution-data";

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export async function GET(request: NextRequest) {
  try {
    const data = await loadDistributionData();
    const requestedPage = Number(request.nextUrl.searchParams.get("page") || "1");
    const page = Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;
    const query = normalizeSearch(request.nextUrl.searchParams.get("q") || "");
    const requestedType = request.nextUrl.searchParams.get("type");
    const typeIndex = requestedType === null || requestedType === "all" ? -1 : Number(requestedType);

    const filteredPoints =
      !query && typeIndex < 0
        ? data.points
        : data.points.filter((point) => {
            if (typeIndex >= 0 && point[3] !== typeIndex) return false;
            if (query && !normalizeSearch(point[2]).includes(query)) return false;
            return true;
          });

    const total = filteredPoints.length;
    const totalPages = Math.max(1, Math.ceil(total / DISTRIBUTION_PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const offset = (safePage - 1) * DISTRIBUTION_PAGE_SIZE;

    return NextResponse.json(
      {
        count: data.count,
        skipped: data.skipped,
        types: data.types,
        points: filteredPoints.slice(offset, offset + DISTRIBUTION_PAGE_SIZE),
        total,
        page: safePage,
        pageSize: DISTRIBUTION_PAGE_SIZE,
        totalPages,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("GET distribution points error:", error);
    return NextResponse.json({ error: "Không thể tải dữ liệu điểm phân phối" }, { status: 500 });
  }
}
