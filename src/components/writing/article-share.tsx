"use client";
import { useCopy } from "@/i18n/copy";
import { useState } from "react";
import { Copy } from "lucide-react";
export function ArticleShare() {
  const c = useCopy();

  const [message, setMessage] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage("Link copied.");
    } catch {
      setMessage("Copy the address from your browser to share this page.");
    }
  }
  return (
    <div className="mt-8">
      <button
        type="button"
        className="action-link action-outline"
        onClick={copy}
      >
        <Copy size={15} aria-hidden="true" />
        {c("Copy page link")}</button>
      <p role="status" className="mt-2 text-sm text-muted-foreground">
        {c(message)}
      </p>
    </div>
  );
}
