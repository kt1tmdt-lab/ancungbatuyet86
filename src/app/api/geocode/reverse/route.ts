import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

type NominatimResponse = { display_name?: string };

const cache = new Map<string, string>();
let nextRequestAt = 0;

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function GET(req: NextRequest) {
  const lat = Number(req.nextUrl.searchParams.get("lat"));
  const lng = Number(req.nextUrl.searchParams.get("lng"));
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json({ error: "Tọa độ không hợp lệ." }, { status: 400 });
  }

  const ip = getClientIp(req);
  const limit = await rateLimit(`reverse_geocode_${ip}`, 20, 60);
  if (!limit.success) return rateLimitResponse(limit.retryAfter);

  const key = `${lat.toFixed(5)},${lng.toFixed(5)}`;
  const cachedAddress = cache.get(key);
  if (cachedAddress) return NextResponse.json({ address: cachedAddress, cached: true });

  try {
    const delay = Math.max(0, nextRequestAt - Date.now());
    if (delay) await wait(delay);
    nextRequestAt = Date.now() + 1_100;

    const baseUrl = process.env.NOMINATIM_BASE_URL || "https://nominatim.openstreetmap.org";
    const url = new URL("/reverse", baseUrl);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lng));
    url.searchParams.set("zoom", "18");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("accept-language", "vi");

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Accept-Language": "vi",
        "User-Agent": "ACBT-Web/1.0 (+https://acbt.vn; gdtruyenthong@acbt.vn)",
        Referer: "https://acbt.vn/",
      },
      next: { revalidate: 60 * 60 * 24 * 30 },
    });
    const payload = (await response.json()) as NominatimResponse;
    if (!response.ok || !payload.display_name) {
      return NextResponse.json({ error: "Không tìm thấy địa chỉ tại vị trí này." }, { status: 404 });
    }

    cache.set(key, payload.display_name);
    if (cache.size > 500) cache.delete(cache.keys().next().value || "");
    return NextResponse.json({ address: payload.display_name });
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return NextResponse.json({ error: "Không thể kết nối dịch vụ bản đồ." }, { status: 502 });
  }
}
