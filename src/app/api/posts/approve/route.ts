import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const token = getTokenFromReq(req as any);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Allow both ADMIN and EDITOR to approve/reject posts
    if (payload.role !== "ADMIN" && payload.role !== "EDITOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { postId, action, note } = body; // action: approve | reject
    if (!postId || !action) return NextResponse.json({ error: "Missing" }, { status: 400 });

    if (action === "approve") {
      const post = await prisma.post.update({
        where: { id: postId },
        data: {
          status: "PUBLISHED",
          reviewerId: payload.id,
          publishedAt: new Date(),
          rejectedReason: null,
        }
      });

      await prisma.postReviewLog.create({
        data: {
          postId,
          reviewerId: payload.id,
          action: "APPROVE",
          note: note || "Duyệt bài viết xuất bản",
        }
      });

      return NextResponse.json(post);
    } else if (action === "reject") {
      const rejectReason = note || "Bị từ chối bởi ban biên tập";
      const post = await prisma.post.update({
        where: { id: postId },
        data: {
          status: "REJECTED",
          reviewerId: payload.id,
          rejectedReason: rejectReason,
        }
      });

      await prisma.postReviewLog.create({
        data: {
          postId,
          reviewerId: payload.id,
          action: "REJECT",
          note: rejectReason,
        }
      });

      return NextResponse.json(post);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Approve API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
