import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Only ADMIN and EDITOR can review posts
    if (payload.role !== "ADMIN" && payload.role !== "EDITOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { postId, action, note } = body; // action: "approve" | "reject"

    if (!postId || !action) {
      return NextResponse.json({ error: "Post ID and action are required" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    let updatedPost;
    if (action === "approve") {
      updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          status: "PUBLISHED",
          reviewerId: payload.id,
          publishedAt: new Date(),
          rejectedReason: null, // Clear any previous rejection reason
        },
      });

      // Log review action
      await prisma.postReviewLog.create({
        data: {
          postId,
          reviewerId: payload.id,
          action: "APPROVE",
          note: note || "Duyệt bài viết xuất bản",
        },
      });
    } else if (action === "reject") {
      if (!note || note.trim() === "") {
        return NextResponse.json({ error: "Rejection reason (note) is required" }, { status: 400 });
      }

      updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          status: "REJECTED",
          reviewerId: payload.id,
          rejectedReason: note,
        },
      });

      // Log review action
      await prisma.postReviewLog.create({
        data: {
          postId,
          reviewerId: payload.id,
          action: "REJECT",
          note: note,
        },
      });
    } else {
      return NextResponse.json({ error: "Invalid action. Must be 'approve' or 'reject'" }, { status: 400 });
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("POST Review Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
