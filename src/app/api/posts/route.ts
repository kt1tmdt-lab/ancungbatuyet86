import { NextRequest } from "next/server";
import { createPost } from "@/features/posts/mutations";
import { listPosts } from "@/features/posts/queries";
import { getErrorMessage, jsonError, jsonOk } from "@/lib/api-response";
import { getAuthErrorStatus, getRequestUser, requireRole } from "@/lib/authz";
import { logAudit } from "@/lib/audit";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const posts = await listPosts({
      status: searchParams.get("status"),
      categorySlug: searchParams.get("categorySlug"),
      categoryId: searchParams.get("categoryId"),
      authorId: searchParams.get("authorId"),
      search: searchParams.get("search"),
      viewer: getRequestUser(req),
    });

    return jsonOk(posts);
  } catch (error) {
    console.error("GET Posts Error:", error);
    return jsonError("Internal Server Error", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const viewer = requireRole(req, ["ADMIN", "EDITOR", "AUTHOR"]);
    const post = await createPost(await req.json(), viewer);

    await logAudit({
      userId: viewer.id,
      action: "CREATE_POST",
      entityType: "Post",
      entityId: post.id,
      details: { title: post.title, slug: post.slug }
    });

    return jsonOk(post, { status: 201 });
  } catch (error) {
    console.error("POST Post Error:", error);
    const message = getErrorMessage(error);

    if (message === "Unauthorized" || message === "Forbidden") {
      return jsonError(message, getAuthErrorStatus(error));
    }

    if (message.includes("required") || message.includes("exists")) {
      return jsonError(message, 400);
    }

    return jsonError("Internal Server Error", 500);
  }
}
