// lib/getUserFromRequest.ts
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "./auth";

const prisma = new PrismaClient();

export async function getUserFromRequest(req: Request | { headers?: Headers } | undefined) {
  // try Request-like object first
  const cookieHeader =
    typeof (req as Request | undefined)?.headers?.get === "function"
      ? (req as Request).headers.get("cookie") ?? ""
      : "";

  // fallback: attempt to read from global next/headers (only works in server components)
  // (not used here by default; prefer passing Request)
  const cookiesString = cookieHeader || "";

  if (!cookiesString) return null;

  // find token cookie
  const match = cookiesString.match(/(?:^|;\s*)token=([^;]+)/);
  if (!match) return null;
  const token = decodeURIComponent(match[1]);

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  return user ?? null;
}

