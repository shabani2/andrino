"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/actions/analytics";

export function PageViewTracker({ entryId }: { entryId?: string }) {
  const pathname = usePathname();
  const tracked = useRef(new Set<string>());

  useEffect(() => {
    if (!pathname) return;
    const isContentDetail = /^\/(fr|en)\/(writing|projects)\/[^/]+$/.test(pathname);
    if (!entryId && isContentDetail) return;

    const key = `${pathname}:${entryId ?? "site"}`;
    if (tracked.current.has(key)) return;
    tracked.current.add(key);
    void trackPageView(pathname, entryId);
  }, [entryId, pathname]);

  return null;
}
