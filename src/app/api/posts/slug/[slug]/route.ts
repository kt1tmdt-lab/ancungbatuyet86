import { NextRequest } from "next/server";
import { getPostWithRelatedBySlug } from "@/features/posts/queries";
import { jsonError, jsonOk } from "@/lib/api-response";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    return jsonOk(await getPostWithRelatedBySlug(slug));
  } catch (error) {
    console.error("GET Post by Slug Error:", error);
    return jsonError("Post not found or internal error", 404);
  }
}
