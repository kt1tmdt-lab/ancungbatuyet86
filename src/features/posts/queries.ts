import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import type { PostListFilters } from "./types";

export const postInclude = {
  author: {
    select: { id: true, name: true, email: true, role: true },
  },
  category: true,
  tags: {
    include: { tag: true },
  },
} satisfies Prisma.PostInclude;

export function buildPostWhere(filters: PostListFilters = {}) {
  const where: Prisma.PostWhereInput = { NOT: { status: "DELETED" } };
  const viewer = filters.viewer;

  if (viewer) {
    if (viewer.role === "ADMIN" || viewer.role === "EDITOR") {
      if (filters.status) where.status = filters.status as Prisma.EnumPostStatusFilter["equals"];
    } else if (viewer.role === "AUTHOR") {
      if (filters.status) {
        if (filters.status === "PUBLISHED") {
          where.status = "PUBLISHED";
        } else {
          where.status = filters.status as Prisma.EnumPostStatusFilter["equals"];
          where.authorId = viewer.id;
        }
      } else {
        where.OR = [{ status: "PUBLISHED" }, { authorId: viewer.id }];
      }
    } else {
      where.status = "PUBLISHED";
    }
  } else {
    where.status = "PUBLISHED";
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  } else if (filters.categorySlug && filters.categorySlug !== "all") {
    where.category = { slug: filters.categorySlug };
  }

  if (filters.authorId) {
    where.authorId = filters.authorId;
  }

  if (filters.search) {
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : []),
      {
        OR: [
          { title: { contains: filters.search, mode: "insensitive" } },
          { excerpt: { contains: filters.search, mode: "insensitive" } },
          { content: { contains: filters.search, mode: "insensitive" } },
        ],
      },
    ];
  }

  return where;
}

export async function listPosts(filters: PostListFilters = {}) {
  return prisma.post.findMany({
    where: buildPostWhere(filters),
    include: postInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getPostBySlug(slug: string, options: { incrementView?: boolean } = {}) {
  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: postInclude,
  });

  if (!post) return null;

  if (options.incrementView) {
    return prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
      include: postInclude,
    }).catch(() => post);
  }

  return post;
}

export async function getRelatedPosts(postId: string, categoryId: string | null, take = 3) {
  if (!categoryId) return [];

  return prisma.post.findMany({
    where: {
      categoryId,
      status: "PUBLISHED",
      NOT: { id: postId },
    },
    include: {
      author: { select: { name: true } },
      category: true,
    },
    take,
    orderBy: { createdAt: "desc" },
  });
}

export async function getPostWithRelatedBySlug(slug: string) {
  const post = await getPostBySlug(slug, { incrementView: true });
  if (!post) {
    throw new Error("Post not found");
  }

  const relatedPosts = await getRelatedPosts(post.id, post.categoryId);

  return { post, relatedPosts };
}

export async function postSlugExists(slug: string, exceptId?: string) {
  const post = await prisma.post.findFirst({
    where: {
      slug,
      status: { not: "DELETED" },
      id: exceptId ? { not: exceptId } : undefined,
    },
    select: { id: true },
  });

  return Boolean(post);
}
