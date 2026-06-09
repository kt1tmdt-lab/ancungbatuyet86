import { NextRequest } from "next/server";
import { ProductStatus } from "@prisma/client";
import { deleteProduct, updateProduct } from "@/features/products/mutations";
import { getProductById } from "@/features/products/queries";
import { getErrorMessage, jsonError, jsonOk } from "@/lib/api-response";
import { getAuthErrorStatus, requireRole } from "@/lib/authz";
import { logAudit } from "@/lib/audit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return jsonError("Product not found", 404);
    }

    if (product.status !== ProductStatus.PUBLISHED) {
      requireRole(req, ["ADMIN", "EDITOR"]);
    }

    return jsonOk(product);
  } catch (error) {
    console.error("GET Product ID Error:", error);
    const message = getErrorMessage(error);

    if (message === "Unauthorized" || message === "Forbidden") {
      return jsonError(message, getAuthErrorStatus(error));
    }

    return jsonError("Internal Server Error", 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const viewer = requireRole(req, ["ADMIN", "EDITOR"]);
    const product = await updateProduct(id, await req.json());

    await logAudit({
      userId: viewer.id,
      action: "UPDATE_PRODUCT",
      entityType: "Product",
      entityId: product.id,
      details: { name: product.name, slug: product.slug }
    });

    return jsonOk(product);
  } catch (error) {
    console.error("PUT Product Error:", error);
    const message = getErrorMessage(error);

    if (message === "Unauthorized" || message === "Forbidden") {
      return jsonError(message, getAuthErrorStatus(error));
    }

    if (message === "Product not found") {
      return jsonError(message, 404);
    }

    if (message.includes("exists")) {
      return jsonError(message, 400);
    }

    return jsonError("Internal Server Error", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const viewer = requireRole(req, ["ADMIN", "EDITOR"]);
    const product = await getProductById(id);
    if (!product) {
      return jsonError("Product not found", 404);
    }

    await deleteProduct(id);

    await logAudit({
      userId: viewer.id,
      action: "DELETE_PRODUCT",
      entityType: "Product",
      entityId: id,
      details: { name: product.name, slug: product.slug }
    });

    return jsonOk({ success: true });
  } catch (error) {
    console.error("DELETE Product Error:", error);
    const message = getErrorMessage(error);

    if (message === "Unauthorized" || message === "Forbidden") {
      return jsonError(message, getAuthErrorStatus(error));
    }

    if (message === "Product not found") {
      return jsonError(message, 404);
    }

    return jsonError("Internal Server Error", 500);
  }
}
