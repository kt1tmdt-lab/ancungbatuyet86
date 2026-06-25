import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Restrict to admins/editors/marketing/support roles
    const allowedRoles = ["SUPER_ADMIN", "ADMIN", "EDITOR", "MARKETING", "SUPPORT"];
    if (!allowedRoles.includes(payload.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch latest 10 contacts and 15 audit logs
    const [contacts, logs] = await Promise.all([
      prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          content: true,
          source: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 15,
        select: {
          id: true,
          userId: true,
          action: true,
          entityType: true,
          entityId: true,
          details: true,
          createdAt: true,
        },
      }),
    ]);

    // Fetch user details for actor names in audit logs
    const userIds = Array.from(new Set(logs.map((log) => log.userId).filter(Boolean))) as string[];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    const notifications: any[] = [];

    // Format contact messages
    contacts.forEach((c) => {
      notifications.push({
        id: `contact-${c.id}`,
        type: "CONTACT",
        title: "📞 Yêu cầu liên hệ mới",
        description: `Khách hàng ${c.name} (${c.phone || c.email || "Không rõ liên hệ"}) vừa gửi yêu cầu qua ${c.source || "Website"}.`,
        link: "/admin/contacts",
        createdAt: c.createdAt.toISOString(),
      });
    });

    // Format audit logs
    logs.forEach((l) => {
      const userObj = l.userId ? userMap.get(l.userId) : null;
      const actor = userObj ? (userObj.name || userObj.email) : "Hệ thống";

      let title = l.action;
      let description = `${actor} đã thực hiện hành động trên ${l.entityType}.`;
      let link = "/admin/activity-logs";

      let detailsObj: any = {};
      if (l.details && typeof l.details === "object") {
        detailsObj = l.details;
      }

      if (l.action === "CREATE_PRODUCT") {
        title = "🆕 Tạo sản phẩm mới";
        description = `${actor} đã thêm sản phẩm mới: "${detailsObj.name || detailsObj.title || l.entityId || "N/A"}"`;
        link = "/admin/products";
      } else if (l.action === "UPDATE_PRODUCT") {
        title = "✏️ Cập nhật sản phẩm";
        description = `${actor} đã chỉnh sửa sản phẩm: "${detailsObj.name || detailsObj.title || l.entityId || "N/A"}"`;
        link = "/admin/products";
      } else if (l.action === "DELETE_PRODUCT") {
        title = "❌ Xóa sản phẩm";
        description = `${actor} đã xóa sản phẩm: "${detailsObj.name || detailsObj.title || l.entityId || "N/A"}"`;
        link = "/admin/products";
      } else if (l.action === "APPROVE_POST") {
        title = "✅ Duyệt bài viết";
        description = `${actor} đã phê duyệt bài viết: "${detailsObj.title || detailsObj.name || l.entityId || "N/A"}"`;
        link = "/admin/posts";
      } else if (l.action === "REJECT_POST") {
        title = "🚫 Từ chối bài viết";
        description = `${actor} đã từ chối bài viết: "${detailsObj.title || detailsObj.name || l.entityId || "N/A"}"`;
        link = "/admin/posts/review";
      } else if (l.action === "CREATE_USER") {
        title = "👤 Thêm thành viên mới";
        description = `${actor} đã tạo tài khoản thành viên: "${detailsObj.email || "N/A"}"`;
        link = "/admin/users";
      } else if (l.action === "UPDATE_USER") {
        title = "⚙️ Cập nhật thành viên";
        description = `${actor} đã sửa thông tin thành viên: "${detailsObj.email || "N/A"}"`;
        link = "/admin/users";
      } else if (l.action === "DELETE_USER") {
        title = "🗑️ Xóa thành viên";
        description = `${actor} đã xóa tài khoản thành viên: "${detailsObj.email || "N/A"}"`;
        link = "/admin/users";
      } else if (l.action === "LOGIN") {
        title = "🔑 Đăng nhập hệ thống";
        description = `${actor} vừa đăng nhập vào trang quản trị.`;
        link = "/admin/activity-logs";
      }

      notifications.push({
        id: `audit-${l.id}`,
        type: "AUDIT",
        title,
        description,
        link,
        createdAt: l.createdAt.toISOString(),
      });
    });

    // Sort combined list by date descending
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Limit to top 20
    const result = notifications.slice(0, 20);

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET Admin Notifications Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
