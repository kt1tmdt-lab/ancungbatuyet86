import { NextRequest, NextResponse } from "next/server";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import {
  getGoogleAnalyticsConfiguration,
  getGoogleAnalyticsRealtimeReport,
} from "@/lib/google-analytics";

export const dynamic = "force-dynamic";

const ANALYTICS_ROLES = new Set(["SUPER_ADMIN", "ADMIN", "EDITOR", "MARKETING"]);
const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-T551F0HFS0";

export async function GET(req: NextRequest) {
  const token = getTokenFromReq(req);
  const payload = token ? verifyToken(token) : null;

  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!ANALYTICS_ROLES.has(payload.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const configuration = getGoogleAnalyticsConfiguration();
  if (!configuration.configured) {
    return NextResponse.json({
      configured: false,
      propertyId: configuration.credentials.propertyId,
      measurementId: MEASUREMENT_ID,
      missing: configuration.missing,
    });
  }

  try {
    const report = await getGoogleAnalyticsRealtimeReport(configuration.credentials);
    return NextResponse.json({
      configured: true,
      propertyId: configuration.credentials.propertyId,
      measurementId: MEASUREMENT_ID,
      generatedAt: new Date().toISOString(),
      ...report,
    });
  } catch (error) {
    console.error("Google Analytics realtime report error:", error);
    return NextResponse.json(
      { error: "Không thể tải dữ liệu realtime từ Google Analytics." },
      { status: 502 },
    );
  }
}
