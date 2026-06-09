import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";

function canManage(req: NextRequest) {
  const token = getTokenFromReq(req);
  if (!token) return false;
  const payload = verifyToken(token);
  return Boolean(payload && (payload.role === "ADMIN" || payload.role === "EDITOR"));
}

export async function GET(req: NextRequest) {
  try {
    if (!canManage(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const channels = await prisma.onlineChannel.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json(channels);
  } catch (error) {
    console.error("GET Online Channels Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!canManage(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, url, icon, followers, color, isActive, sortOrder } = body;

    if (!name || !description || !url) {
      return NextResponse.json({ error: "Name, description and URL are required" }, { status: 400 });
    }

    const channel = await prisma.onlineChannel.create({
      data: {
        name,
        description,
        url,
        icon: icon || name.toLowerCase(),
        followers: followers || "",
        color: color || "#0F172A",
        isActive: isActive === undefined ? true : !!isActive,
        sortOrder: Number.isNaN(Number(sortOrder)) ? 0 : Number(sortOrder),
      },
    });

    return NextResponse.json(channel, { status: 201 });
  } catch (error) {
    console.error("POST Online Channel Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
