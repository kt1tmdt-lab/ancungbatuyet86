import { NextRequest } from "next/server";
import { ProductStatus } from "@prisma/client";
import { getProductBySlug } from "@/features/products/queries";
import { jsonError, jsonOk } from "@/lib/api-response";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product || product.status !== ProductStatus.PUBLISHED) {
      return jsonError("Product not found", 404);
    }

    return jsonOk(product);
  } catch (error) {
    console.error("GET Product Slug Error:", error);
    return jsonError("Internal Server Error", 500);
  }
}
