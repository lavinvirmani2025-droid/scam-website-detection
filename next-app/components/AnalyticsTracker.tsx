"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Send a page_view event whenever the path changes
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "page_view",
        route: pathname,
      }),
    }).catch(() => {
      // ignore errors in tracking
    });
  }, [pathname]);

  return null;
}

