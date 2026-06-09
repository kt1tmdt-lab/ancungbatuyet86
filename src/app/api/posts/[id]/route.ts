import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import { updatePost } from "@/features/posts/mutations";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true, role: true } },
        category: true,
        tags: { include: { tag: true } }
      }
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.status !== "PUBLISHED") {
      const token = getTokenFromReq(req);
      if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const payload = verifyToken(token);
      if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      if (payload.role !== "ADMIN" && payload.role !== "EDITOR" && post.authorId !== payload.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("GET Post ID Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Role-based authorization
    if (payload.role === "AUTHOR") {
      // Authors can only update their own posts
      if (existingPost.authorId !== payload.id) {
        return NextResponse.json({ error: "Forbidden: Not your post" }, { status: 403 });
      }
      // Authors can only update if post is in DRAFT or REJECTED status
      if (existingPost.status !== "DRAFT" && existingPost.status !== "REJECTED") {
        return NextResponse.json({
          error: "Forbidden: Cannot edit a post that is published or pending review"
        }, { status: 403 });
      }
    } else if (payload.role !== "ADMIN" && payload.role !== "EDITOR") {
      // USER or other roles cannot edit posts
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    try {
      const post = await updatePost(id, body, payload);
      
      await logAudit({
        userId: payload.id,
        action: "UPDATE_POST",
        entityType: "Post",
        entityId: post.id,
        details: { title: post.title, slug: post.slug }
      });

      return NextResponse.json(post);
    } catch (err: any) {
      if (err.message === "Post not found") return NextResponse.json({ error: "Post not found" }, { status: 404 });
      if (err.message === "Forbidden: Not your post" || err.message === "Authors cannot publish posts directly") {
        return NextResponse.json({ error: err.message }, { status: 403 });
      }
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  } catch (error) {
    console.error("PUT Post Error:", error);
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

    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Role check: AUTHOR can delete their own post if DRAFT or REJECTED. ADMIN/EDITOR can delete any.
    if (payload.role === "AUTHOR") {
      if (existingPost.authorId !== payload.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (existingPost.status !== "DRAFT" && existingPost.status !== "REJECTED") {
        return NextResponse.json({ error: "Cannot delete a published/pending post" }, { status: 403 });
      }
    } else if (payload.role !== "ADMIN" && payload.role !== "EDITOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Soft Delete post by setting status to DELETED
    await prisma.post.update({ 
      where: { id },
      data: { status: "DELETED" }
    });

    await logAudit({
      userId: payload.id,
      action: "DELETE_POST",
      entityType: "Post",
      entityId: id,
      details: { title: existingPost.title, slug: existingPost.slug }
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("DELETE Post Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
