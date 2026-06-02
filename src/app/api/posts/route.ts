import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const categorySlug = searchParams.get("categorySlug");
    const categoryId = searchParams.get("categoryId");
    const authorId = searchParams.get("authorId");
    const search = searchParams.get("search");

    const token = getTokenFromReq(req);
    let payload = token ? verifyToken(token) : null;

    // Build the query where clause
    const where: any = {};

    // 1. Authorization & Status Filter
    if (payload) {
      if (payload.role === "ADMIN" || payload.role === "EDITOR") {
        // Admins/Editors can filter by any status
        if (status) {
          where.status = status;
        }
      } else if (payload.role === "AUTHOR") {
        // Authors see published posts or their own posts
        if (status) {
          if (status === "PUBLISHED") {
            where.status = "PUBLISHED";
          } else {
            // If they query draft, pending, etc., restrict to their own
            where.status = status;
            where.authorId = payload.id;
          }
        } else {
          where.OR = [
            { status: "PUBLISHED" },
            { authorId: payload.id }
          ];
        }
      } else {
        // User role: Only see published
        where.status = "PUBLISHED";
      }
    } else {
      // Public guest: Only see published
      where.status = "PUBLISHED";
    }

    // 2. Category Filter
    if (categoryId) {
      where.categoryId = categoryId;
    } else if (categorySlug && categorySlug !== "all") {
      where.category = { slug: categorySlug };
    }

    // 3. Author Filter
    if (authorId) {
      where.authorId = authorId;
    }

    // 4. Keyword Search
    if (search) {
      const searchLower = search.toLowerCase();
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { excerpt: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ]
        }
      ];
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true }
        },
        category: true,
        tags: {
          include: { tag: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET Posts Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Only Admin, Editor, Author can create posts
    if (payload.role !== "ADMIN" && payload.role !== "EDITOR" && payload.role !== "AUTHOR") {
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

    // Check slug uniqueness
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    // Role-based status limit
    let finalStatus = "DRAFT";
    if (status === "PENDING_REVIEW") {
      finalStatus = "PENDING_REVIEW";
    } else if (status === "PUBLISHED" && (payload.role === "ADMIN" || payload.role === "EDITOR")) {
      finalStatus = "PUBLISHED";
    }

    // Process tags
    const tagRelations = [];
    if (tags && typeof tags === "string") {
      const tagNames = tags.split(",").map(t => t.trim()).filter(Boolean);
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
          tagRelations.push({ tagId: tag.id });
        }
      }
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content: content || null,
        coverImageUrl: coverImageUrl || null,
        status: finalStatus as any,
        authorId: payload.id,
        categoryId: categoryId || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        seoKeywords: seoKeywords || null,
        publishedAt: finalStatus === "PUBLISHED" ? new Date() : null,
        tags: {
          create: tagRelations
        }
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
        tags: { include: { tag: true } }
      }
    });

    // If it was submitted immediately, log it
    if (finalStatus === "PENDING_REVIEW") {
      await prisma.postReviewLog.create({
        data: {
          postId: post.id,
          reviewerId: payload.id,
          action: "SUBMIT",
          note: "Gửi duyệt bài viết mới",
        }
      });
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("POST Post Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
