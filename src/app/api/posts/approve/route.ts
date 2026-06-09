import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import { reviewPost } from "@/features/posts/mutations";
import { logAudit } from "@/lib/audit";

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

    try {
      const post = await reviewPost(postId, action, payload.id, note);

      await logAudit({
        userId: payload.id,
        action: action === "approve" ? "APPROVE_POST" : "REJECT_POST",
        entityType: "Post",
        entityId: postId,
        details: { title: post.title, slug: post.slug, note }
      });

      return NextResponse.json(post);
    } catch (err: any) {
      if (err.message === "Post not found") return NextResponse.json({ error: "Post not found" }, { status: 404 });
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  } catch (error) {
    console.error("Approve API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
