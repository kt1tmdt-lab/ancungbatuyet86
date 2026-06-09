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
    const where: any = { NOT: { status: "DELETED" } };

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
    let totalProducts = 0;
    let newContacts = 0;
    let viewsByDay: any[] = [];
    let mostViewedPosts: any[] = [];
    let mostClickedProducts: any[] = [];
    let contactsOverTime: any[] = [];
    let trafficSources: any[] = [];

    // Helper for last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    }).reverse();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);

    if (!isAuthor) {
      const [
        productsCount,
        contactsCount,
        visitsCount,
        uniqueVisitorsCount,
        recentVisits,
        topPosts,
        productVisits,
        dbProducts,
        recentContacts
      ] = await Promise.all([
        prisma.product.count(),
        prisma.contactMessage.count({ where: { status: "NEW" } }),
        prisma.visit.count(),
        prisma.visit.groupBy({ by: ["ipHash"] }).then((groups) => groups.length),
        prisma.visit.findMany({
          where: { createdAt: { gte: startDate } },
          select: { createdAt: true, referrer: true } as any
        }),
        prisma.post.findMany({
          where: { status: "PUBLISHED" },
          orderBy: { viewCount: "desc" },
          take: 5,
          select: { id: true, title: true, viewCount: true }
        }),
        prisma.visit.findMany({
          where: { path: { startsWith: "/san-pham/" } },
          select: { path: true }
        }),
        prisma.product.findMany({
          select: { slug: true, name: true }
        }),
        prisma.contactMessage.findMany({
          where: { createdAt: { gte: startDate } },
          select: { createdAt: true }
        })
      ]);

      totalProducts = productsCount;
      newContacts = contactsCount;
      pageViews = visitsCount;
      uniqueVisitors = uniqueVisitorsCount;
      mostViewedPosts = topPosts;

      // Group visits by day and count traffic sources
      const viewsMap: Record<string, number> = {};
      last7Days.forEach(day => { viewsMap[day] = 0; });
      
      let fb = 0;
      let tt = 0;
      let gg = 0;
      let direct = 0;

      recentVisits.forEach((v: any) => {
        const day = v.createdAt.toISOString().split("T")[0];
        if (viewsMap[day] !== undefined) {
          viewsMap[day]++;
        }

        const ref = (v.referrer || "").toLowerCase();
        if (!ref || ref.includes("localhost") || ref.includes("ancungbatuyet") || ref.includes("acbt")) {
          direct++;
        } else if (ref.includes("facebook.com") || ref.includes("fb.me") || ref.includes("fb.com") || ref.includes("messenger.com")) {
          fb++;
        } else if (ref.includes("tiktok.com")) {
          tt++;
        } else if (ref.includes("google.")) {
          gg++;
        } else {
          direct++;
        }
      });
      viewsByDay = last7Days.map(day => ({ date: day, count: viewsMap[day] }));

      // Group contact messages by day
      const contactsMap: Record<string, number> = {};
      last7Days.forEach(day => { contactsMap[day] = 0; });
      recentContacts.forEach(c => {
        const day = c.createdAt.toISOString().split("T")[0];
        if (contactsMap[day] !== undefined) {
          contactsMap[day]++;
        }
      });
      contactsOverTime = last7Days.map(day => ({ date: day, count: contactsMap[day] }));

      // Map product clicks from visits
      const productClicksMap: Record<string, number> = {};
      productVisits.forEach(v => {
        const slug = v.path.replace("/san-pham/", "").split("?")[0];
        if (slug) {
          productClicksMap[slug] = (productClicksMap[slug] || 0) + 1;
        }
      });

      mostClickedProducts = dbProducts.map(p => ({
        name: p.name,
        clicks: productClicksMap[p.slug] || 0
      })).sort((a, b) => b.clicks - a.clicks).slice(0, 5);

      const totalSources = fb + tt + gg + direct;
      if (totalSources > 0) {
        trafficSources = [
          { source: "Facebook", percentage: Math.round((fb / totalSources) * 100) },
          { source: "TikTok", percentage: Math.round((tt / totalSources) * 100) },
          { source: "Google", percentage: Math.round((gg / totalSources) * 100) },
          { source: "Direct", percentage: Math.round((direct / totalSources) * 100) }
        ];
        
        const sum = trafficSources.reduce((s, t) => s + t.percentage, 0);
        if (sum !== 100 && sum > 0) {
          const maxIdx = trafficSources.reduce((maxI, t, i, arr) => t.percentage > arr[maxI].percentage ? i : maxI, 0);
          trafficSources[maxIdx].percentage += (100 - sum);
        }
      } else {
        trafficSources = [
          { source: "Facebook", percentage: 0 },
          { source: "TikTok", percentage: 0 },
          { source: "Google", percentage: 0 },
          { source: "Direct", percentage: 100 }
        ];
      }
    } else {
      // For authors, just load their posts views
      const topPosts = await prisma.post.findMany({
        where: { ...where, status: "PUBLISHED" },
        orderBy: { viewCount: "desc" },
        take: 5,
        select: { id: true, title: true, viewCount: true }
      });
      mostViewedPosts = topPosts;

      viewsByDay = last7Days.map(day => ({ date: day, count: 0 }));
      contactsOverTime = last7Days.map(day => ({ date: day, count: 0 }));
      mostClickedProducts = [];
      trafficSources = [];
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
      totalProducts,
      newContacts,
      viewsByDay,
      mostViewedPosts,
      mostClickedProducts,
      contactsOverTime,
      trafficSources
    });
  } catch (error) {
    console.error("GET Admin Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
