export type EmbeddedMedia = { src: string; platform: "YouTube" | "Instagram" | "TikTok" };

export function getEmbeddedMedia(value: string | null | undefined): EmbeddedMedia | null {
  if (!value) return null;
  let url: URL;
  try { url = new URL(value); } catch { return null; }
  if (url.protocol !== "https:") return null;
  const host = url.hostname.toLowerCase();
  if (["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(host)) {
    const id = host === "youtu.be" ? url.pathname.split("/")[1]
      : url.pathname.startsWith("/shorts/") ? url.pathname.split("/")[2]
      : url.pathname === "/watch" ? url.searchParams.get("v") : null;
    return id && /^[a-zA-Z0-9_-]{11}$/.test(id)
      ? { src: `https://www.youtube-nocookie.com/embed/${id}`, platform: "YouTube" } : null;
  }
  if (["instagram.com", "www.instagram.com"].includes(host)) {
    const match = url.pathname.match(/^\/(reel|p)\/([a-zA-Z0-9_-]+)\/?$/);
    return match ? { src: `https://www.instagram.com/${match[1]}/${match[2]}/embed`, platform: "Instagram" } : null;
  }
  if (["tiktok.com", "www.tiktok.com", "m.tiktok.com"].includes(host)) {
    const match = url.pathname.match(/\/video\/(\d+)/);
    return match ? { src: `https://www.tiktok.com/embed/v2/${match[1]}`, platform: "TikTok" } : null;
  }
  return null;
}
