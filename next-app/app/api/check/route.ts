import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

/**
 * Normalize URL for matching
 */
function normalize(url: string) {
  return url
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}

/**
 * Extract domain
 */
function getDomain(url: string) {
  const clean = normalize(url);
  return clean.split("/")[0];
}

export async function POST(req: Request) {
  const { url } = await req.json();
  const normalized = normalize(url);
  const domain = getDomain(url);

  /* --------------------------------------------------
     1️⃣ CHECK TRAINED CSV DATA (EXACT URL MATCH)
  -------------------------------------------------- */
  const trainedQuery = query(
    collection(db, "training_data"),
    where("normalizedUrl", "==", normalized)
  );

  const trainedSnap = await getDocs(trainedQuery);

  if (!trainedSnap.empty) {
    return NextResponse.json({
      verdict: "Scam",
      confidence: 98,
      reason: "Matched with trained phishing dataset (CSV)",
    });
  }

  /* --------------------------------------------------
     2️⃣ DOMAIN-LEVEL MATCH (STRONG SIGNAL)
  -------------------------------------------------- */
  const domainQuery = query(
    collection(db, "training_data"),
    where("domain", "==", domain)
  );

  const domainSnap = await getDocs(domainQuery);

  if (!domainSnap.empty) {
    return NextResponse.json({
      verdict: "Scam",
      confidence: 92,
      reason: "Domain found in trained phishing dataset",
    });
  }

  /* --------------------------------------------------
     3️⃣ ADMIN-APPROVED REPORTS
  -------------------------------------------------- */
  const reportQuery = query(
    collection(db, "reports"),
    where("normalizedUrl", "==", normalized),
    where("status", "==", "approved")
  );

  const reportSnap = await getDocs(reportQuery);

  if (!reportSnap.empty) {
    return NextResponse.json({
      verdict: "Scam",
      confidence: 95,
      reason: "Matched with admin-approved phishing report",
    });
  }

  /* --------------------------------------------------
     4️⃣ FALLBACK HEURISTIC (LOW CONFIDENCE)
  -------------------------------------------------- */
  const suspiciousKeywords = [
    "login",
    "verify",
    "secure",
    "update",
    "free",
    "win",
    "account",
  ];

  const suspicious = suspiciousKeywords.some((k) =>
    normalized.includes(k)
  );

  return NextResponse.json({
    verdict: suspicious ? "Suspicious" : "Safe",
    confidence: suspicious ? 65 : 85,
    reason: suspicious
      ? "Suspicious URL patterns detected"
      : "No match found in trained data",
  });
}
