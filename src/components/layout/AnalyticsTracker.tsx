"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const trackVisit = async () => {
      try {
        await fetch("/api/analytics/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ path: pathname }),
        });
      } catch (err) {
        console.error("Failed to send analytics tracking event:", err);
      }
    };

    trackVisit();
  }, [pathname]);

  return null;
}
