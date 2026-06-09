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
    const includeInactive = req.nextUrl.searchParams.get("includeInactive") === "true";

    if (includeInactive && !canManage(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [locations, onlineChannels] = await Promise.all([
      prisma.location.findMany({
        where: includeInactive ? undefined : { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      }),
      prisma.onlineChannel.findMany({
        where: includeInactive ? undefined : { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      }),
    ]);

    const provinces = [...new Set(locations.map((location) => location.province))];

    return NextResponse.json({
      locations,
      onlineChannels,
      provinces,
    });
  } catch (error) {
    console.error("GET Locations Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, type, address, province, phone, hours, lat, lng, isActive, sortOrder } = body;
    const latitude = Number(lat);
    const longitude = Number(lng);

    if (!name || !type || !address || !province || !phone || !hours || Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return NextResponse.json({ error: "Missing or invalid location fields" }, { status: 400 });
    }

    const location = await prisma.location.create({
      data: {
        name,
        type,
        address,
        province,
        phone,
        hours,
        lat: latitude,
        lng: longitude,
        isActive: isActive === undefined ? true : !!isActive,
        sortOrder: Number.isNaN(Number(sortOrder)) ? 0 : Number(sortOrder),
      },
    });

    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    console.error("POST Location Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
