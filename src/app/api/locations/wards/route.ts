import { NextRequest, NextResponse } from "next/server";
import { VIETNAM_PROVINCES } from "@/lib/vietnam-provinces";

type ProvinceRecord = { name: string; code: number };
type WardRecord = { name: string };
type ProvinceDetail = { wards?: WardRecord[] };

const BASE_URL = "https://provinces.open-api.vn/api/v2";

function normalizeName(name: string) {
  return name
    .replace(/^(Tỉnh|Thành phố)\s+/i, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d");
}

export async function GET(req: NextRequest) {
  const province = req.nextUrl.searchParams.get("province") || "";
  if (!VIETNAM_PROVINCES.some((name) => name === province)) {
    return NextResponse.json({ error: "Tỉnh/thành phố không hợp lệ." }, { status: 400 });
  }

  try {
    const provincesResponse = await fetch(`${BASE_URL}/p/`, {
      next: { revalidate: 86_400 },
      signal: AbortSignal.timeout(8_000),
    });
    if (!provincesResponse.ok) throw new Error("Không tải được danh sách tỉnh/thành.");
    const provinces = (await provincesResponse.json()) as ProvinceRecord[];
    const matched = provinces.find((item) => normalizeName(item.name) === normalizeName(province));
    if (!matched || !Number.isInteger(matched.code)) {
      throw new Error(`Không tìm thấy mã tỉnh/thành: ${province}`);
    }

    const wardsResponse = await fetch(`${BASE_URL}/p/${matched.code}?depth=2`, {
      next: { revalidate: 86_400 },
      signal: AbortSignal.timeout(8_000),
    });
    if (!wardsResponse.ok) throw new Error("Không tải được danh sách xã/phường.");
    const detail = (await wardsResponse.json()) as ProvinceDetail;
    if (!Array.isArray(detail.wards) || detail.wards.length === 0) {
      throw new Error(`Không có dữ liệu xã/phường cho ${province}`);
    }

    const wards = [...new Set(
      detail.wards
        .map((ward) => ward.name)
        .filter((name): name is string => typeof name === "string" && name.length > 0),
    )].sort((left, right) => left.localeCompare(right, "vi"));
    return NextResponse.json({ wards });
  } catch (error) {
    console.error("Load Vietnam wards error:", error);
    return NextResponse.json(
      { error: "Chưa tải được danh sách xã/phường. Vui lòng nhập xã/phường thủ công." },
      { status: 502 },
    );
  }
}
