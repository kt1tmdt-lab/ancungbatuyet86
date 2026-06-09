import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { normalizeSlug } from "@/lib/slug";
import type { AuthPayload } from "@/lib/auth";
import type { PostPayload } from "./types";
import { postInclude, postSlugExists } from "./queries";
import { revalidatePath } from "next/cache";

function resolveCreateStatus(status: string | undefined, viewer: AuthPayload) {
  if (status === "PENDING_REVIEW") return "PENDING_REVIEW";
  if (status === "PUBLISHED" && (viewer.role === "ADMIN" || viewer.role === "EDITOR")) {
    return "PUBLISHED";
  }

  return "DRAFT";
}

async function buildTagRelations(tags: string | undefined) {
  const tagRelations: Array<{ tagId: string }> = [];
  if (!tags) return tagRelations;

  const tagNames = tags.split(",").map((tag) => tag.trim()).filter(Boolean);
  for (const tagName of tagNames) {
    const tagSlug = normalizeSlug(tagName).replace(/[^\w-]/g, "");
    if (!tagSlug) continue;

    const tag = await prisma.tag.upsert({
      where: { slug: tagSlug },
      update: { name: tagName },
      create: { name: tagName, slug: tagSlug },
    });
    tagRelations.push({ tagId: tag.id });
  }

  return tagRelations;
}

export async function createPost(input: PostPayload, viewer: AuthPayload) {
  if (!input.title || !input.slug) {
    throw new Error("Title and slug are required");
  }

  if (await postSlugExists(input.slug)) {
    throw new Error("Slug already exists");
  }

  const finalStatus = resolveCreateStatus(input.status, viewer);
  const tagRelations = await buildTagRelations(input.tags);

  const post = await prisma.post.create({
    data: {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt || null,
      content: input.content || null,
      coverImageUrl: input.coverImageUrl || null,
      status: finalStatus as Prisma.PostCreateInput["status"],
      authorId: viewer.id,
      categoryId: input.categoryId || null,
      seoTitle: input.seoTitle || null,
      seoDescription: input.seoDescription || null,
      seoKeywords: input.seoKeywords || null,
      publishedAt: finalStatus === "PUBLISHED" ? new Date() : null,
      tags: { create: tagRelations },
    },
    include: postInclude,
  });

  if (finalStatus === "PENDING_REVIEW") {
    await prisma.postReviewLog.create({
      data: {
        postId: post.id,
        reviewerId: viewer.id,
        action: "SUBMIT",
        note: "Gá»­i duyá»‡t bÃ i viáº¿t má»›i",
      },
    });
  }

  // Clear cache
  revalidatePath("/", "layout");

  return post;
}

export async function updatePost(postId: string, input: Partial<PostPayload>, viewer: AuthPayload) {
  const existingPost = await prisma.post.findUnique({ where: { id: postId } });
  if (!existingPost) throw new Error("Post not found");

  if (input.slug && input.slug !== existingPost.slug) {
    if (await postSlugExists(input.slug)) {
      throw new Error("Slug already exists");
    }
  }

  let finalStatus = existingPost.status;
  if (input.status) {
    if (viewer.role === "AUTHOR") {
      if (input.status === "DRAFT" || input.status === "PENDING_REVIEW") {
        finalStatus = input.status as any;
      } else if (input.status === "PUBLISHED") {
        throw new Error("Authors cannot publish posts directly");
      }
    } else {
      finalStatus = input.status as any;
    }
  }

  let tagRelations = undefined;
  if (input.tags !== undefined) {
    await prisma.postTag.deleteMany({ where: { postId } });
    const tagRel = await buildTagRelations(input.tags);
    tagRelations = { create: tagRel };
  }

  const updateData: any = {
    title: input.title !== undefined ? input.title : existingPost.title,
    slug: input.slug !== undefined ? input.slug : existingPost.slug,
    excerpt: input.excerpt !== undefined ? input.excerpt : existingPost.excerpt,
    content: input.content !== undefined ? input.content : existingPost.content,
    coverImageUrl: input.coverImageUrl !== undefined ? input.coverImageUrl : existingPost.coverImageUrl,
    status: finalStatus,
    categoryId: input.categoryId !== undefined ? input.categoryId : existingPost.categoryId,
    seoTitle: input.seoTitle !== undefined ? input.seoTitle : existingPost.seoTitle,
    seoDescription: input.seoDescription !== undefined ? input.seoDescription : existingPost.seoDescription,
    seoKeywords: input.seoKeywords !== undefined ? input.seoKeywords : existingPost.seoKeywords,
  };

  if (finalStatus === "PUBLISHED" && !existingPost.publishedAt) {
    updateData.publishedAt = new Date();
  }

  if (tagRelations) {
    updateData.tags = tagRelations;
  }

  const post = await prisma.post.update({
    where: { id: postId },
    data: updateData,
    include: postInclude,
  });

  if (finalStatus === "PENDING_REVIEW" && existingPost.status !== "PENDING_REVIEW") {
    await prisma.postReviewLog.create({
      data: {
        postId,
        reviewerId: viewer.id,
        action: "SUBMIT",
        note: "Gửi duyệt bài viết chỉnh sửa",
      }
    });
  }

  revalidatePath("/", "layout");
  return post;
}

export async function reviewPost(
  postId: string,
  action: "approve" | "reject",
  reviewerId: string,
  note?: string
) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error("Post not found");

  let updatedPost;
  if (action === "approve") {
    updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        status: "PUBLISHED",
        reviewerId,
        publishedAt: new Date(),
        rejectedReason: null,
      },
    });

    await prisma.postReviewLog.create({
      data: {
        postId,
        reviewerId,
        action: "APPROVE",
        note: note || "Duyệt bài viết xuất bản",
      },
    });
  } else if (action === "reject") {
    const rejectReason = note || "Bị từ chối bởi ban biên tập";
    updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        status: "REJECTED",
        reviewerId,
        rejectedReason: rejectReason,
      },
    });

    await prisma.postReviewLog.create({
      data: {
        postId,
        reviewerId,
        action: "REJECT",
        note: rejectReason,
      },
    });
  } else {
    throw new Error("Invalid action. Must be 'approve' or 'reject'");
  }

  revalidatePath("/", "layout");
  return updatedPost;
}
