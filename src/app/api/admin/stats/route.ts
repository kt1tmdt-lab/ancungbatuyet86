import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const isAuthor = payload.role === "AUTHOR";
    const where: any = {};

    // If author, restrict counts to their own posts
    if (isAuthor) {
      where.authorId = payload.id;
    }

    // Query DB counts
    const [total, published, pending, rejected, archived] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.count({ where: { ...where, status: "PUBLISHED" } }),
      prisma.post.count({ where: { ...where, status: "PENDING_REVIEW" } }),
      prisma.post.count({ where: { ...where, status: "REJECTED" } }),
      prisma.post.count({ where: { ...where, status: "ARCHIVED" } }),
    ]);

    // Query Views sum
    const viewsSum = await prisma.post.aggregate({
      where,
      _sum: {
        viewCount: true,
      },
    });

    const totalViews = viewsSum._sum.viewCount || 0;

    // Query global traffic analytics for ADMIN/EDITOR
    let pageViews = 0;
    let uniqueVisitors = 0;

    if (!isAuthor) {
      const [totalVisits, uniqueVisitsData] = await Promise.all([
        prisma.visit.count(),
        prisma.visit.findMany({
          select: { ipHash: true },
          distinct: ["ipHash"],
        }),
      ]);
      pageViews = totalVisits;
      uniqueVisitors = uniqueVisitsData.length;
    }

    return NextResponse.json({
      total,
      published,
      pending,
      rejected,
      archived,
      totalViews,
      pageViews,
      uniqueVisitors,
    });
  } catch (error) {
    console.error("GET Admin Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
