import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { reviewPost } from "@/features/posts/mutations";
import { logAudit } from "@/lib/audit";

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

    try {
      const updatedPost = await reviewPost(postId, action, payload.id, note);

      await logAudit({
        userId: payload.id,
        action: action === "approve" ? "APPROVE_POST" : "REJECT_POST",
        entityType: "Post",
        entityId: postId,
        details: { title: updatedPost.title, slug: updatedPost.slug, note }
      });

      return NextResponse.json(updatedPost);
    } catch (err: any) {
      if (err.message === "Post not found") return NextResponse.json({ error: "Post not found" }, { status: 404 });
      if (err.message === "Rejection reason (note) is required") return NextResponse.json({ error: err.message }, { status: 400 });
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  } catch (error) {
    console.error("POST Review Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
