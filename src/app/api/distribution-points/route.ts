import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

type DistributionPoint = [latitude: number, longitude: number, name: string, typeIndex: number];

type DistributionData = {
  count: number;
  skipped: number;
  types: Array<{ name: string; count: number }>;
  points: DistributionPoint[];
};

const PAGE_SIZE = 12;
let distributionDataPromise: Promise<DistributionData> | null = null;

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function loadDistributionData() {
  if (!distributionDataPromise) {
    const dataPath = path.join(process.cwd(), "public", "data", "distribution-points.json");
    distributionDataPromise = readFile(dataPath, "utf8")
      .then((content) => JSON.parse(content) as DistributionData)
      .catch((error) => {
        distributionDataPromise = null;
        throw error;
      });
  }

  return distributionDataPromise;
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
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const offset = (safePage - 1) * PAGE_SIZE;

    return NextResponse.json(
      {
        count: data.count,
        skipped: data.skipped,
        types: data.types,
        points: filteredPoints.slice(offset, offset + PAGE_SIZE),
        total,
        page: safePage,
        pageSize: PAGE_SIZE,
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
