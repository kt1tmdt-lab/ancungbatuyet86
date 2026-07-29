import { NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getAuthErrorStatus, requireRole } from "@/lib/authz";
import type { AuthRole } from "@/lib/auth";
import { getErrorMessage, jsonError, jsonOk } from "@/lib/api-response";
import {
  MEDIA_INTELLIGENCE_CONFIG_ID,
  getIntelligenceSummary,
  normalizeMediaIntelligence,
} from "@/lib/media-intelligence";

const ALLOWED_ROLES: AuthRole[] = ["SUPER_ADMIN", "ADMIN", "EDITOR", "MARKETING"];

export async function GET(req: NextRequest) {
  try {
    requireRole(req, ALLOWED_ROLES);

    const config = await prisma.siteConfig.findUnique({
      where: { id: MEDIA_INTELLIGENCE_CONFIG_ID },
    });
    const data = normalizeMediaIntelligence(config?.data);

    return jsonOk({
      data,
      summary: getIntelligenceSummary(data.mentions),
    });
  } catch (error) {
    const message = getErrorMessage(error);
    if (message === "Unauthorized" || message === "Forbidden") {
      return jsonError(message, getAuthErrorStatus(error));
    }

    console.error("GET Media Intelligence Error:", error);
    return jsonError("Internal Server Error", 500, message);
  }
}

export async function PUT(req: NextRequest) {
  try {
    requireRole(req, ALLOWED_ROLES);

    const body = await req.json();
    const current = await prisma.siteConfig.findUnique({
      where: { id: MEDIA_INTELLIGENCE_CONFIG_ID },
    });
    const existing = normalizeMediaIntelligence(current?.data);
    const incoming = normalizeMediaIntelligence({
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
    });

    const config = await prisma.siteConfig.upsert({
      where: { id: MEDIA_INTELLIGENCE_CONFIG_ID },
      update: { data: incoming as unknown as Prisma.InputJsonValue },
      create: {
        id: MEDIA_INTELLIGENCE_CONFIG_ID,
        data: incoming as unknown as Prisma.InputJsonValue,
      },
    });

    const data = normalizeMediaIntelligence(config.data);

    return jsonOk({
      data,
      summary: getIntelligenceSummary(data.mentions),
    });
  } catch (error) {
    const message = getErrorMessage(error);
    if (message === "Unauthorized" || message === "Forbidden") {
      return jsonError(message, getAuthErrorStatus(error));
    }

    console.error("PUT Media Intelligence Error:", error);
    return jsonError("Internal Server Error", 500, message);
  }
}
