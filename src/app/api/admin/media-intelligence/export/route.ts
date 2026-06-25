import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthErrorStatus, requireRole } from "@/lib/authz";
import { getErrorMessage, jsonError } from "@/lib/api-response";
import {
  MEDIA_INTELLIGENCE_CONFIG_ID,
  normalizeMediaIntelligence,
} from "@/lib/media-intelligence";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR", "MARKETING"] as const;

function csvCell(value: unknown) {
  const text = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  try {
    requireRole(req, ALLOWED_ROLES as any);

    const config = await prisma.siteConfig.findUnique({
      where: { id: MEDIA_INTELLIGENCE_CONFIG_ID },
    });
    const data = normalizeMediaIntelligence(config?.data);
    const header = [
      "title",
      "url",
      "source",
      "platform",
      "keyword",
      "sentiment",
      "intent",
      "riskLevel",
      "score",
      "topics",
      "publishedAt",
      "collectedAt",
      "snippet",
    ];
    const rows = data.mentions.map((item) => [
      item.title,
      item.url,
      item.source,
      item.platform,
      item.keyword,
      item.sentiment,
      item.intent,
      item.riskLevel,
      item.score,
      item.topics,
      item.publishedAt,
      item.collectedAt,
      item.snippet,
    ]);
    const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");

    return new NextResponse(`\uFEFF${csv}`, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="media-intelligence-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    const message = getErrorMessage(error);
    if (message === "Unauthorized" || message === "Forbidden") {
      return jsonError(message, getAuthErrorStatus(error));
    }

    console.error("GET Media Intelligence Export Error:", error);
    return jsonError("Internal Server Error", 500, message);
  }
}
