import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path } = body;

    if (!path) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 });
    }

    // Skip tracking for admin panel, API routes, or assets
    if (
      path.startsWith("/admin") ||
      path.startsWith("/api") ||
      path.includes(".") ||
      path.includes("_next")
    ) {
      return NextResponse.json({ skipped: true });
    }

    // Get client IP address
    const rawIp =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";
    
    // In case of multiple proxy IPs, take the first one
    const ip = rawIp.split(",")[0].trim();

    // Hash the IP address for GDPR compliance and user privacy
    const ipHash = crypto
      .createHash("sha256")
      .update(ip + "acbt-salt-2026")
      .digest("hex");

    // Log the visit to the database
    await prisma.visit.create({
      data: {
        ipHash,
        path,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
