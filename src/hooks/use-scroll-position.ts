"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

export function useScrollPosition() {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY,
    () => 0,
  );
}
