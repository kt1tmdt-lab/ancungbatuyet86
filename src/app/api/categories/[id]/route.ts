import { NextRequest } from "next/server";
import { deleteCategory, updateCategory } from "@/features/categories/mutations";
import { getErrorMessage, jsonError, jsonOk } from "@/lib/api-response";
import { getAuthErrorStatus, requireRole } from "@/lib/authz";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    requireRole(req, ["ADMIN", "EDITOR"]);
    const category = await updateCategory(id, await req.json());

    return jsonOk(category);
  } catch (error) {
    console.error("PUT Category Error:", error);
    const message = getErrorMessage(error);

    if (message === "Unauthorized" || message === "Forbidden") {
      return jsonError(message, getAuthErrorStatus(error));
    }

    if (message === "Category not found") {
      return jsonError(message, 404);
    }

    if (message.includes("required") || message.includes("exists")) {
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
    requireRole(req, ["ADMIN", "EDITOR"]);
    await deleteCategory(id);

    return jsonOk({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("DELETE Category Error:", error);
    const message = getErrorMessage(error);

    if (message === "Unauthorized" || message === "Forbidden") {
      return jsonError(message, getAuthErrorStatus(error));
    }

    if (message === "Category not found") {
      return jsonError(message, 404);
    }

    return jsonError("Internal Server Error", 500);
  }
}
