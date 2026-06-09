import type { NextRequest } from "next/server";
import { getTokenFromReq, verifyToken, type AuthPayload, type AuthRole } from "@/lib/auth";

export function getRequestUser(req: NextRequest): AuthPayload | null {
  const token = getTokenFromReq(req);
  return token ? verifyToken(token) : null;
}

export function requireUser(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export function requireRole(req: NextRequest, roles: AuthRole[]) {
  const user = requireUser(req);
  if (!roles.includes(user.role)) {
    throw new Error("Forbidden");
  }

  return user;
}

export function getAuthErrorStatus(error: unknown) {
  if (!(error instanceof Error)) return 500;
  if (error.message === "Unauthorized") return 401;
  if (error.message === "Forbidden") return 403;
  return 500;
}
