import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    // 1. Fetch the post and increment its viewCount
    const post = await prisma.post.update({
      where: { slug },
      data: {
        viewCount: {
          increment: 1,
        },
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true }
        },
        category: true,
        tags: {
          include: { tag: true }
        }
      }
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // 2. Fetch up to 3 related posts in the same category (if category exists)
    let relatedPosts: any[] = [];
    if (post.categoryId) {
      relatedPosts = await prisma.post.findMany({
        where: {
          categoryId: post.categoryId,
          status: "PUBLISHED",
          NOT: {
            id: post.id
          }
        },
        include: {
          author: { select: { name: true } },
          category: true
        },
        take: 3,
        orderBy: { createdAt: "desc" }
      });
    }

    return NextResponse.json({ post, relatedPosts });
  } catch (error) {
    console.error("GET Post by Slug Error:", error);
    // If update fails because post does not exist, try to find it first (or just return 404)
    return NextResponse.json({ error: "Post not found or internal error" }, { status: 404 });
  }
}
