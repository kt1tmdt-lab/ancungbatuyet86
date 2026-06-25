import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { sendTelegramNotification } from "@/lib/telegram";

export async function logAudit({
  userId,
  action,
  entityType,
  entityId,
  details,
}: {
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
}) {
  try {
    // 1. Ghi log vào cơ sở dữ liệu
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        ...(details === undefined ? {} : { details: details as Prisma.InputJsonValue }),
      },
    });

    // 2. Lấy thông tin tài khoản thực hiện hành động
    let actorName = "Hệ thống";
    if (userId) {
      const userObj = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true }
      });
      if (userObj) {
        actorName = `${userObj.name || "Không tên"} (${userObj.email})`;
      }
    }

    // 3. Việt hóa nhãn hành động hiển thị
    let actionLabel = action;
    if (action === "CREATE_PRODUCT") actionLabel = "🆕 Tạo sản phẩm mới";
    else if (action === "UPDATE_PRODUCT") actionLabel = "✏️ Cập nhật sản phẩm";
    else if (action === "DELETE_PRODUCT") actionLabel = "❌ Xóa sản phẩm";
    else if (action === "APPROVE_POST") actionLabel = "✅ Phê duyệt bài viết";
    else if (action === "REJECT_POST") actionLabel = "🚫 Từ chối bài viết";
    else if (action === "CREATE_USER") actionLabel = "👤 Tạo tài khoản thành viên";
    else if (action === "UPDATE_USER") actionLabel = "⚙️ Cập nhật tài khoản";
    else if (action === "DELETE_USER") actionLabel = "🗑️ Xóa tài khoản thành viên";
    else if (action === "LOGIN") actionLabel = "🔑 Đăng nhập hệ thống";

    // 4. Định dạng và gửi thông báo qua Telegram
    let msg = `⚙️ <b>NHẬT KÝ HOẠT ĐỘNG CMS</b>\n\n`;
    msg += `👤 <b>Người thực hiện:</b> ${actorName}\n`;
    msg += `🛠️ <b>Hành động:</b> ${actionLabel}\n`;
    msg += `📦 <b>Đối tượng:</b> ${entityType} (ID: <code>${entityId || "N/A"}</code>)\n`;
    
    if (details) {
      msg += `📝 <b>Chi tiết:</b>\n`;
      if (details.name || details.title) {
        msg += `  • Tên/Tiêu đề: <i>${details.name || details.title}</i>\n`;
      }
      if (details.slug) {
        msg += `  • Slug: <code>${details.slug}</code>\n`;
      }
      if (details.email) {
        msg += `  • Email: <code>${details.email}</code>\n`;
      }
      if (details.role) {
        msg += `  • Vai trò: <b>${details.role}</b>\n`;
      }
    }
    
    // Gọi gửi thông báo bất đồng bộ để không cản trở luồng chính
    void sendTelegramNotification(msg);
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}
