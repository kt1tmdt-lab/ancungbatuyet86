import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";

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
    const {
      title,
      slug,
      excerpt,
      content,
      coverImageUrl,
      categoryId,
      tags,
      seoTitle,
      seoDescription,
      seoKeywords,
      status
    } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    // Check slug uniqueness (excluding current post)
    const duplicateSlug = await prisma.post.findFirst({
      where: {
        slug,
        NOT: { id }
      }
    });
    if (duplicateSlug) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    // Determine final status
    let finalStatus = existingPost.status;
    if (status) {
      if (payload.role === "AUTHOR") {
        // Author can transition to DRAFT or PENDING_REVIEW
        if (status === "DRAFT" || status === "PENDING_REVIEW") {
          finalStatus = status;
        } else if (status === "PUBLISHED") {
          return NextResponse.json({ error: "Authors cannot publish posts directly" }, { status: 403 });
        }
      } else {
        // ADMIN / EDITOR can set any status
        finalStatus = status;
      }
    }

    // Process tags (re-link tags)
    let tagRelations = undefined;
    if (tags !== undefined && typeof tags === "string") {
      // Delete existing relations
      await prisma.postTag.deleteMany({ where: { postId: id } });

      const tagNames = tags.split(",").map(t => t.trim()).filter(Boolean);
      const tempTagRelations = [];
      for (const tagName of tagNames) {
        const tagSlug = tagName
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "");
        if (tagSlug) {
          const tag = await prisma.tag.upsert({
            where: { slug: tagSlug },
            update: { name: tagName },
            create: { name: tagName, slug: tagSlug },
          });
          tempTagRelations.push({ tagId: tag.id });
        }
      }
      tagRelations = {
        create: tempTagRelations
      };
    }

    const updateData: any = {
      title,
      slug,
      excerpt: excerpt !== undefined ? excerpt : existingPost.excerpt,
      content: content !== undefined ? content : existingPost.content,
      coverImageUrl: coverImageUrl !== undefined ? coverImageUrl : existingPost.coverImageUrl,
      status: finalStatus as any,
      categoryId: categoryId !== undefined ? categoryId : existingPost.categoryId,
      seoTitle: seoTitle !== undefined ? seoTitle : existingPost.seoTitle,
      seoDescription: seoDescription !== undefined ? seoDescription : existingPost.seoDescription,
      seoKeywords: seoKeywords !== undefined ? seoKeywords : existingPost.seoKeywords,
    };

    if (finalStatus === "PUBLISHED" && !existingPost.publishedAt) {
      updateData.publishedAt = new Date();
    }

    if (tagRelations) {
      updateData.tags = tagRelations;
    }

    const post = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
        tags: { include: { tag: true } }
      }
    });

    // Log submitting for review if author changed status to PENDING_REVIEW
    if (finalStatus === "PENDING_REVIEW" && existingPost.status !== "PENDING_REVIEW") {
      await prisma.postReviewLog.create({
        data: {
          postId: id,
          reviewerId: payload.id,
          action: "SUBMIT",
          note: "Gửi duyệt bài viết chỉnh sửa",
        }
      });
    }

    return NextResponse.json(post);
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

    // Delete post (relations will cascade delete for PostTag and PostReviewLog in our schema)
    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("DELETE Post Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
