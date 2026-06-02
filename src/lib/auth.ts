import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: Record<string, any>) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as Record<string, any>;
  } catch (e) {
    return null;
  }
}

export function getTokenFromReq(req: NextRequest | Request) {
  const auth = req.headers.get("authorization") || "";
  if (!auth) return null;
  const parts = auth.split(" ");
  if (parts.length !== 2) return null;
  return parts[1];
}

