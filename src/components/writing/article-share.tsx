"use client";

import { useState } from "react";
import { Copy, Share2 } from "lucide-react";

export function ArticleShare({ title, locale, url }: { title: string; locale: string; url: string }) {
  const [message, setMessage] = useState("");
  const fr = locale === "fr";

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setMessage(fr ? "Lien copié." : "Link copied.");
    } catch {
      setMessage(fr ? "Copie impossible. Utilisez l’adresse du navigateur." : "Copy failed. Use the browser address.");
    }
  }
  async function nativeShare() {
    if (navigator.share) {
      try { await navigator.share({ title, url }); return; } catch { /* cancelled or unavailable */ }
    }
    await copy();
  }
  const shareTargets = [
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { label: "X", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
  ];
  return <section className="post-share" aria-label={fr ? "Partager ce contenu" : "Share this content"}>
    <h2>{fr ? "Partager" : "Share"}</h2>
    <div className="post-share-actions">
      {shareTargets.map((target) => <a key={target.label} href={target.href}
        target="_blank" rel="noopener noreferrer">
        {fr ? "Partager sur " : "Share on "}{target.label}
      </a>)}
      <button type="button" onClick={nativeShare}><Share2 size={16} aria-hidden="true" />
        {fr ? "Partager via une application" : "Share with an app"}</button>
      <button type="button" onClick={copy}><Copy size={16} aria-hidden="true" />
        {fr ? "Copier le lien" : "Copy link"}</button>
    </div>
    {message && <p role="status" className="post-share-status">{message}</p>}
  </section>;
}
