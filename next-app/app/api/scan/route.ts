// app/api/scan/route.ts
import { NextResponse } from "next/server";

/**
 * Simple stubbed scanner.
 * Replace with real checks (whois, URL patterns, reputation) later.
 */
export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

    // Very simple heuristic example:
    const lowered = url.toLowerCase();
    const suspiciousKeywords = ["free", "click", "login", "verify", "secure-login"];
    const suspicious = suspiciousKeywords.some(k => lowered.includes(k)) || lowered.includes("bit.ly");

    // You can expand this to third-party lookups later.
    const result = suspicious ? "suspicious" : "safe";

    return NextResponse.json({ ok: true, result, explanation: suspicious ? "simple keyword heuristic" : "no obvious patterns" });
  } catch (err) {
    console.error("SCAN ERROR", err);
    return NextResponse.json({ error: "Scan failed" }, { status: 500 });
  }
}

