import { getEmbeddedMedia } from "@/lib/media";

export function MediaEmbed({ url, locale }: { url?: string | null; locale: string }) {
  const media = getEmbeddedMedia(url);
  if (!media) return null;
  return <div className={`post-media ${media.platform === "YouTube" ? "post-media-wide" : "post-media-vertical"}`}>
    <iframe src={media.src} title={`${locale === "fr" ? "Vidéo" : "Video"} ${media.platform}`}
      loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
  </div>;
}
