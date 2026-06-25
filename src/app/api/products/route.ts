import { NextRequest } from "next/server";
import { ProductStatus } from "@prisma/client";
import { createProduct } from "@/features/products/mutations";
import { listProducts } from "@/features/products/queries";
import { getErrorMessage, jsonError, jsonOk } from "@/lib/api-response";
import { getAuthErrorStatus, requireRole } from "@/lib/authz";
import { logAudit } from "@/lib/audit";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status");
    const isAdminList = statusParam === "ALL";

    if (isAdminList) {
      requireRole(req, ["ADMIN", "EDITOR"]);
    }
    
    const products = await listProducts({
      featured: searchParams.get("featured") === "true",
      category: searchParams.get("category"),
      status: isAdminList ? null : ProductStatus.PUBLISHED,
    });

    return jsonOk(products);
  } catch (error) {
    console.error("GET Products Error:", error);
    const message = getErrorMessage(error);

    if (message === "Unauthorized" || message === "Forbidden") {
      return jsonError(message, getAuthErrorStatus(error));
    }

    return jsonError("Internal Server Error", 500, message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const viewer = requireRole(req, ["ADMIN", "EDITOR"]);
    const product = await createProduct(await req.json());

    await logAudit({
      userId: viewer.id,
      action: "CREATE_PRODUCT",
      entityType: "Product",
      entityId: product.id,
      details: { name: product.name, slug: product.slug }
    });

    return jsonOk(product, { status: 201 });
  } catch (error) {
    console.error("POST Product Error:", error);
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
