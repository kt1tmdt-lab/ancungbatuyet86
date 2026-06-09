import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET is not set in production. Please configure it in your environment.");
}
const SECRET = JWT_SECRET || "local-development-secret";
export type AuthRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "AUTHOR" | "MARKETING" | "SUPPORT" | "USER";

export type AuthPayload = {
  id: string;
  email?: string;
  name?: string | null;
  role: AuthRole;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export function getTokenFromReq(req: NextRequest | Request) {
  const auth = req.headers.get("authorization") || "";
  if (auth && auth.startsWith("Bearer ")) {
    const token = auth.split(" ")[1];
    if (token && token !== "null" && token !== "undefined" && token !== "cookie-auth") {
      const payload = verifyToken(token);
      if (payload) return token;
    }
  }

  // Safe check for NextRequest cookies
  try {
    if ("cookies" in req && typeof (req as any).cookies?.get === "function") {
      const cookie = (req as NextRequest).cookies.get("auth_token");
      if (cookie) return cookie.value;
    }
  } catch (e) {
    // Ignore error
  }

  // Safe manual cookies parsing
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").reduce((acc, c) => {
      const trimmed = c.trim();
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.substring(0, eqIdx);
        const val = trimmed.substring(eqIdx + 1);
        acc[key] = val;
      }
      return acc;
    }, {} as Record<string, string>);
    if (cookies.auth_token) return cookies.auth_token;
  }

  return null;
}
