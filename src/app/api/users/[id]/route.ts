import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken, hashPassword } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Only ADMIN can modify users
    if (payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { role, name, email, password } = body;

    const updateData: any = {};

    if (role) {
      const validRoles = ["ADMIN", "EDITOR", "AUTHOR", "USER", "SUPER_ADMIN", "MARKETING", "SUPPORT"];
      if (!validRoles.includes(role)) {
        return NextResponse.json({ error: "Vai trò không hợp lệ" }, { status: 400 });
      }

      // Prevent Admin from changing their own role
      if (payload.id === id && role !== payload.role) {
        return NextResponse.json({ error: "Bạn không thể tự thay đổi vai trò của chính mình" }, { status: 400 });
      }
      updateData.role = role;
    }

    if (name !== undefined) {
      updateData.name = name;
    }

    if (email) {
      // Prevent Admin from changing their own email
      if (payload.id === id && email !== payload.email) {
        return NextResponse.json({ error: "Bạn không thể tự thay đổi email của chính mình từ đây" }, { status: 400 });
      }

      // Check if email already exists for another user
      const existing = await prisma.user.findFirst({
        where: { email, NOT: { id } }
      });
      if (existing) {
        return NextResponse.json({ error: "Email này đã được sử dụng bởi người dùng khác" }, { status: 400 });
      }
      updateData.email = email;
    }

    if (password) {
      updateData.password = await hashPassword(password);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
        _count: {
          select: { posts: true }
        }
      }
    });

    // log user update action
    await logAudit({
      userId: payload.id,
      action: "UPDATE_USER",
      entityType: "User",
      entityId: user.id,
      details: { email: user.email, role: user.role, name: user.name }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("PUT User Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Only ADMIN can delete users
    if (payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Prevent Admin from deleting themselves
    if (payload.id === id) {
      return NextResponse.json({ error: "Bạn không thể tự xóa tài khoản của chính mình" }, { status: 400 });
    }

    // Find user details first
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { email: true, name: true, role: true }
    });

    // Delete user
    await prisma.user.delete({
      where: { id }
    });

    // log user delete action
    if (targetUser) {
      await logAudit({
        userId: payload.id,
        action: "DELETE_USER",
        entityType: "User",
        entityId: id,
        details: { email: targetUser.email, role: targetUser.role, name: targetUser.name }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE User Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
