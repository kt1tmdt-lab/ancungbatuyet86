import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import { normalizeMarketingConfig } from "@/lib/marketing-config";
import { normalizeSiteConfig } from "@/lib/site-config-defaults";

type HealthStatus = "ok" | "warning" | "danger";

function getStatus(count: number, dangerAt = Number.POSITIVE_INFINITY): HealthStatus {
  if (count <= 0) return "ok";
  return count >= dangerAt ? "danger" : "warning";
}

function configCompleteness(config: unknown) {
  const normalized = normalizeSiteConfig(config);
  const required = [
    normalized.seo.title,
    normalized.seo.description,
    normalized.footerContact.phone,
    normalized.footerContact.email,
    normalized.footerContact.address,
    normalized.heroBanner.title,
    normalized.heroBanner.subtitle,
  ];

  return {
    complete: required.every((item) => Boolean(item && item.trim())),
    missingCount: required.filter((item) => !item || !item.trim()).length,
  };
}

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const startedAt = Date.now();
    let databaseStatus: HealthStatus = "ok";
    let databaseLatencyMs = 0;

    try {
      const dbStartedAt = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      databaseLatencyMs = Date.now() - dbStartedAt;
    } catch {
      databaseStatus = "danger";
    }

    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      pendingPosts,
      scheduledPosts,
      totalProducts,
      publishedProducts,
      draftProducts,
      outOfStockProducts,
      productsMissingPurchaseUrl,
      totalPages,
      publishedPages,
      draftPages,
      totalMedia,
      mediaSize,
      totalUsers,
      adminUsers,
      newContacts,
      totalContacts,
      activeLocations,
      inactiveLocations,
      activeChannels,
      inactiveChannels,
      globalConfig,
      marketingConfig,
      recentLogs,
    ] = await Promise.all([
      prisma.post.count({ where: { NOT: { status: "DELETED" } } }),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.post.count({ where: { status: "DRAFT" } }),
      prisma.post.count({ where: { status: "PENDING_REVIEW" } }),
      prisma.post.count({ where: { status: "SCHEDULED" } }),
      prisma.product.count(),
      prisma.product.count({ where: { status: "PUBLISHED" } }),
      prisma.product.count({ where: { status: "DRAFT" } }),
      prisma.product.count({ where: { status: "OUT_OF_STOCK" } }),
      prisma.product.count({ where: { OR: [{ purchaseUrl: "" }, { purchaseUrl: { equals: "" } }] } }),
      prisma.page.count(),
      prisma.page.count({ where: { status: "PUBLISHED" } }),
      prisma.page.count({ where: { status: "DRAFT" } }),
      prisma.media.count(),
      prisma.media.aggregate({ _sum: { size: true } }),
      prisma.user.count(),
      prisma.user.count({ where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } } }),
      prisma.contactMessage.count({ where: { status: "NEW" } }),
      prisma.contactMessage.count(),
      prisma.location.count({ where: { isActive: true } }),
      prisma.location.count({ where: { isActive: false } }),
      prisma.onlineChannel.count({ where: { isActive: true } }),
      prisma.onlineChannel.count({ where: { isActive: false } }),
      prisma.siteConfig.findUnique({ where: { id: "global" } }),
      prisma.siteConfig.findUnique({ where: { id: "marketing_assets" } }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]);

    const userIds = Array.from(new Set(recentLogs.map((log) => log.userId).filter(Boolean))) as string[];
    const users = userIds.length
      ? await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, email: true, name: true, role: true },
        })
      : [];
    const userMap = new Map(users.map((user) => [user.id, user]));

    const siteConfigCheck = configCompleteness(globalConfig?.data);
    const marketing = normalizeMarketingConfig(marketingConfig?.data);
    const mediaTotalSize = mediaSize._sum.size || 0;
    const hasJwtSecret = Boolean(process.env.JWT_SECRET);
    const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
    const isProduction = process.env.NODE_ENV === "production";

    const checks = [
      {
        id: "database",
        label: "Kết nối database",
        status: databaseStatus,
        detail: databaseStatus === "ok" ? `Phản hồi ${databaseLatencyMs}ms` : "Không thể kiểm tra database",
        href: "/admin/system",
      },
      {
        id: "env",
        label: "Biến môi trường",
        status: !hasDatabaseUrl || (isProduction && !hasJwtSecret) ? "danger" : !hasJwtSecret ? "warning" : "ok",
        detail: hasJwtSecret ? "JWT_SECRET đã cấu hình" : "JWT_SECRET chưa có, đang dùng fallback local",
        href: "/admin/settings",
      },
      {
        id: "site-config",
        label: "Cấu hình web",
        status: siteConfigCheck.complete ? "ok" : "warning",
        detail: siteConfigCheck.complete
          ? "SEO, liên hệ và banner chính đã có dữ liệu"
          : `Thiếu ${siteConfigCheck.missingCount} trường cấu hình quan trọng`,
        href: "/admin/settings",
      },
      {
        id: "marketing-config",
        label: "Nội dung trang",
        status: marketing.pageAssets.length > 0 && marketing.historyMilestones.length > 0 && marketing.communityActivities.length > 0 ? "ok" : "warning",
        detail: `${marketing.pageAssets.length} ảnh/link, ${marketing.historyMilestones.length} cột mốc, ${marketing.trustSections.length} mục uy tín, ${marketing.communityActivities.length} hoạt động cộng đồng`,
        href: "/admin/marketing",
      },
      {
        id: "admin-users",
        label: "Tài khoản quản trị",
        status: adminUsers > 0 ? "ok" : "danger",
        detail: `${adminUsers} tài khoản ADMIN/SUPER_ADMIN`,
        href: "/admin/users",
      },
    ];

    const issues = [
      {
        id: "pending-posts",
        title: "Bài viết chờ duyệt",
        count: pendingPosts,
        status: getStatus(pendingPosts, 10),
        href: "/admin/posts/review",
      },
      {
        id: "new-contacts",
        title: "Liên hệ mới cần xử lý",
        count: newContacts,
        status: getStatus(newContacts, 20),
        href: "/admin/contacts",
      },
      {
        id: "draft-products",
        title: "Sản phẩm đang nháp",
        count: draftProducts,
        status: getStatus(draftProducts, 10),
        href: "/admin/products",
      },
      {
        id: "draft-pages",
        title: "Trang đang nháp",
        count: draftPages,
        status: getStatus(draftPages, 10),
        href: "/admin/pages",
      },
      {
        id: "missing-purchase-url",
        title: "Sản phẩm thiếu link mua",
        count: productsMissingPurchaseUrl,
        status: getStatus(productsMissingPurchaseUrl, 5),
        href: "/admin/products",
      },
      {
        id: "inactive-sales",
        title: "Điểm bán/kênh bán đang tắt",
        count: inactiveLocations + inactiveChannels,
        status: getStatus(inactiveLocations + inactiveChannels, 10),
        href: "/admin/sales-channels",
      },
    ];

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      responseMs: Date.now() - startedAt,
      environment: {
        nodeEnv: process.env.NODE_ENV || "development",
        hasDatabaseUrl,
        hasJwtSecret,
      },
      summary: {
        posts: {
          total: totalPosts,
          published: publishedPosts,
          draft: draftPosts,
          pending: pendingPosts,
          scheduled: scheduledPosts,
        },
        products: {
          total: totalProducts,
          published: publishedProducts,
          draft: draftProducts,
          outOfStock: outOfStockProducts,
          missingPurchaseUrl: productsMissingPurchaseUrl,
        },
        pages: {
          total: totalPages,
          published: publishedPages,
          draft: draftPages,
        },
        media: {
          total: totalMedia,
          totalSize: mediaTotalSize,
        },
        users: {
          total: totalUsers,
          admins: adminUsers,
        },
        contacts: {
          total: totalContacts,
          new: newContacts,
        },
        sales: {
          activeLocations,
          inactiveLocations,
          activeChannels,
          inactiveChannels,
        },
      },
      checks,
      issues,
      recentLogs: recentLogs.map((log) => ({
        id: log.id,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        createdAt: log.createdAt,
        user: log.userId ? userMap.get(log.userId) || null : null,
      })),
      quickLinks: [
        { href: "/admin/site-content?tab=trust", label: "Thành tựu & uy tín", group: "Nội dung trang" },
        { href: "/admin/site-content?tab=community", label: "Hoạt động cộng đồng", group: "Nội dung trang" },
        { href: "/admin/settings", label: "Cấu hình Web", group: "Hệ thống" },
        { href: "/admin/site-content?tab=history", label: "Lịch sử phát triển", group: "Nội dung trang" },
        { href: "/admin/site-content?tab=home", label: "Trang chủ", group: "Nội dung trang" },
        { href: "/admin/media", label: "Thư viện ảnh", group: "Media" },
        { href: "/admin/users", label: "Thành viên", group: "Bảo mật" },
        { href: "/admin/activity-logs", label: "Nhật ký hoạt động", group: "Giám sát" },
      ],
    });
  } catch (error) {
    console.error("GET Admin System Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
