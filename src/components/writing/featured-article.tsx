import { useCopy } from "@/i18n/copy";
import {
  EditorialImage,
  ArrowLink,
} from "@/components/shared/editorial";
export function FeaturedArticle() {
  const c = useCopy();

  return (
    <div className="featured-article">
      <EditorialImage
        src="/images/articles/writing-1.webp"
        alt={c("A documentary view of daily life and local perspectives in the Great Lakes region")}
        priority
      />
      <div className="featured-article-copy">
        <div className="card-meta">
          <span>{c("Coming soon")}</span>
          <span>{c("African narratives")}</span>
        </div>
        <h2>{c("Who gets to tell Africa’s stories?")}</h2>
        <p>
          {c("Who describes Africa in international media? I want to hear more from people who live here.")}</p>
        <div className="author-line">
          <span className="author-initial" aria-hidden="true">
            {c("A")}</span>
          <div>
            {c("Andrino AKUDA KANGELA")}<small>{c("Goma · Article in preparation")}</small>
          </div>
        </div>
        <ArrowLink href="/writing/african-narratives">
          {c("See the topic")}</ArrowLink>
      </div>
    </div>
  );
}
