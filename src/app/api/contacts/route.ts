import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || !["ADMIN", "SUPER_ADMIN", "EDITOR", "MARKETING"].includes(payload.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const contacts = await prisma.contactMessage.findMany({
      where: status && status !== "ALL" ? { status } : {},
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("GET Contacts Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const { success } = await rateLimit(`contact_${ip}`, 5, 60 * 10);
    if (!success) return rateLimitResponse();

    const body = await req.json();
    const name = cleanString(body.name);
    const phone = cleanString(body.phone);
    const email = cleanString(body.email);
    const content = cleanString(body.content);
    const source = cleanString(body.source);

    if (!name || !content) {
      return NextResponse.json({ error: "Name and content are required" }, { status: 400 });
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name,
        phone: phone || null,
        email: email || null,
        content,
        source: source || "Website",
        status: "NEW",
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("POST Contact Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
