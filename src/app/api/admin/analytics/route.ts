import { NextRequest, NextResponse } from "next/server";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import {
  getGoogleAnalyticsConfiguration,
  getGoogleAnalyticsReport,
} from "@/lib/google-analytics";

const ANALYTICS_ROLES = new Set(["SUPER_ADMIN", "ADMIN", "EDITOR", "MARKETING"]);
const ALLOWED_RANGES = new Set([7, 30, 90]);

export async function GET(req: NextRequest) {
  const token = getTokenFromReq(req);
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!ANALYTICS_ROLES.has(payload.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const configuration = getGoogleAnalyticsConfiguration();
  if (!configuration.configured) {
    return NextResponse.json({
      configured: false,
      measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-T551F0HFS0",
      missing: configuration.missing,
    });
  }

  const requestedDays = Number(req.nextUrl.searchParams.get("days") || 30);
  const days = ALLOWED_RANGES.has(requestedDays) ? requestedDays : 30;

  try {
    const report = await getGoogleAnalyticsReport(configuration.credentials, days);
    return NextResponse.json({ configured: true, ...report });
  } catch (error) {
    console.error("Google Analytics report error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Không thể tải dữ liệu Google Analytics.",
      },
      { status: 502 },
    );
  }
}
