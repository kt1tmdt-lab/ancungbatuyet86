import { NextRequest } from "next/server";
import { createCategory } from "@/features/categories/mutations";
import { listCategories } from "@/features/categories/queries";
import { getErrorMessage, jsonError, jsonOk } from "@/lib/api-response";
import { getAuthErrorStatus, requireRole } from "@/lib/authz";

export async function GET() {
  try {
    return jsonOk(await listCategories());
  } catch (error) {
    console.error("GET Categories Error:", error);
    return jsonError("Internal Server Error", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    requireRole(req, ["ADMIN", "EDITOR"]);
    const category = await createCategory(await req.json());

    return jsonOk(category, { status: 201 });
  } catch (error) {
    console.error("POST Category Error:", error);
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
