import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";

const ANALYTICS_ROLES = new Set(["SUPER_ADMIN", "ADMIN", "EDITOR", "MARKETING"]);
const MONTH_PATTERN = /^(20\d{2}|2100)-(0[1-9]|1[0-2])$/;
const VIETNAM_OFFSET_MS = 7 * 60 * 60 * 1000;

function monthRange(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const start = new Date(Date.UTC(year, monthNumber - 1, 1) - VIETNAM_OFFSET_MS);
  const end = new Date(Date.UTC(year, monthNumber, 1) - VIETNAM_OFFSET_MS);
  const previousStart = new Date(Date.UTC(year, monthNumber - 2, 1) - VIETNAM_OFFSET_MS);
  return { year, monthNumber, start, end, previousStart };
}

function vietnamDateKey(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value || "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

function trafficSource(referrer: string | null) {
  const ref = (referrer || "").toLowerCase();
  if (!ref || ref.includes("acbt.vn") || ref.includes("ancungbatuyet")) return "Trực tiếp";
  if (ref.includes("facebook.com") || ref.includes("fb.com") || ref.includes("fb.me") || ref.includes("messenger.com")) return "Facebook";
  if (ref.includes("tiktok.com")) return "TikTok";
  if (ref.includes("google.")) return "Google";
  if (ref.includes("youtube.com") || ref.includes("youtu.be")) return "YouTube";
  return "Nguồn khác";
}

export async function GET(req: NextRequest) {
  const token = getTokenFromReq(req);
  const payload = token ? verifyToken(token) : null;

  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!ANALYTICS_ROLES.has(payload.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const nowInVietnam = new Date(Date.now() + VIETNAM_OFFSET_MS);
  const defaultMonth = `${nowInVietnam.getUTCFullYear()}-${String(nowInVietnam.getUTCMonth() + 1).padStart(2, "0")}`;
  const requestedMonth = req.nextUrl.searchParams.get("month") || defaultMonth;
  const month = MONTH_PATTERN.test(requestedMonth) ? requestedMonth : defaultMonth;
  const { year, monthNumber, start, end, previousStart } = monthRange(month);

  try {
    const [visits, previousPageViews, previousUniqueGroups] = await Promise.all([
      prisma.visit.findMany({
        where: { createdAt: { gte: start, lt: end } },
        select: { ipHash: true, ipMasked: true, path: true, referrer: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.visit.count({ where: { createdAt: { gte: previousStart, lt: start } } }),
      prisma.visit.groupBy({
        by: ["ipHash"],
        where: { createdAt: { gte: previousStart, lt: start } },
      }),
    ]);

    const uniqueVisitors = new Set(visits.map((visit) => visit.ipHash)).size;
    const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
    const visibleDays = month === defaultMonth ? nowInVietnam.getUTCDate() : daysInMonth;
    const dailyMap = new Map<string, { views: number; visitors: Set<string> }>();

    for (let day = 1; day <= visibleDays; day++) {
      const key = `${month}-${String(day).padStart(2, "0")}`;
      dailyMap.set(key, { views: 0, visitors: new Set() });
    }

    const pageMap = new Map<string, { views: number; visitors: Set<string> }>();
    const sourceMap = new Map<string, { views: number; visitors: Set<string> }>();
    const visitorMap = new Map<string, {
      visitorId: string;
      ipMasked: string | null;
      views: number;
      lastSeen: Date;
      lastPath: string;
      source: string;
    }>();

    for (const visit of visits) {
      const daily = dailyMap.get(vietnamDateKey(visit.createdAt));
      if (daily) {
        daily.views++;
        daily.visitors.add(visit.ipHash);
      }

      const path = visit.path.split("?")[0] || "/";
      const page = pageMap.get(path) || { views: 0, visitors: new Set<string>() };
      page.views++;
      page.visitors.add(visit.ipHash);
      pageMap.set(path, page);

      const sourceName = trafficSource(visit.referrer);
      const source = sourceMap.get(sourceName) || { views: 0, visitors: new Set<string>() };
      source.views++;
      source.visitors.add(visit.ipHash);
      sourceMap.set(sourceName, source);

      const visitor = visitorMap.get(visit.ipHash) || {
        visitorId: visit.ipHash.slice(0, 10).toUpperCase(),
        ipMasked: visit.ipMasked,
        views: 0,
        lastSeen: visit.createdAt,
        lastPath: path,
        source: sourceName,
      };
      visitor.views++;
      visitor.ipMasked = visit.ipMasked || visitor.ipMasked;
      visitor.lastSeen = visit.createdAt;
      visitor.lastPath = path;
      visitor.source = sourceName;
      visitorMap.set(visit.ipHash, visitor);
    }

    return NextResponse.json({
      source: "internal",
      month,
      generatedAt: new Date().toISOString(),
      totals: {
        pageViews: visits.length,
        uniqueVisitors,
        viewsPerVisitor: uniqueVisitors ? visits.length / uniqueVisitors : 0,
      },
      previous: {
        pageViews: previousPageViews,
        uniqueVisitors: previousUniqueGroups.length,
      },
      daily: Array.from(dailyMap, ([date, value]) => ({
        date,
        views: value.views,
        visitors: value.visitors.size,
      })),
      topPages: Array.from(pageMap, ([path, value]) => ({
        path,
        views: value.views,
        visitors: value.visitors.size,
      })).sort((a, b) => b.views - a.views).slice(0, 15),
      sources: Array.from(sourceMap, ([name, value]) => ({
        name,
        views: value.views,
        visitors: value.visitors.size,
      })).sort((a, b) => b.views - a.views),
      recentVisitors: Array.from(visitorMap.values())
        .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime())
        .slice(0, 200)
        .map((visitor) => ({
          ...visitor,
          lastSeen: visitor.lastSeen.toISOString(),
        })),
    });
  } catch (error) {
    console.error("Internal analytics report error:", error);
    return NextResponse.json({ error: "Không thể tải báo cáo truy cập." }, { status: 500 });
  }
}
