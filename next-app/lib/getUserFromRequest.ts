// lib/getUserFromRequest.ts

import { verifyToken } from "./auth";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getUserFromRequest(
  req?: Request | { headers?: Headers }
) {
  try {
    // read cookie header
    const cookieHeader =
      typeof (req as Request | undefined)?.headers?.get === "function"
        ? (req as Request).headers.get("cookie") ?? ""
        : "";

    if (!cookieHeader) return null;

    // extract token
    const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
    if (!match) return null;

    const token = decodeURIComponent(match[1]);
    const payload = verifyToken(token);

    if (!payload || !payload.id) return null;

    // 🔥 FIRESTORE USER FETCH
    const userRef = doc(db, "users", String(payload.id));
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return null;

    return {
      id: userSnap.id,
      ...userSnap.data(),
    };
  } catch (error) {
    console.error("getUserFromRequest error:", error);
    return null;
  }
}
