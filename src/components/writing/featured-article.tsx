import { useCopy } from "@/i18n/copy";
import {
  EditorialImage,
  Eyebrow,
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
          <span>{c("Lead perspective")}</span>
          <span>{c("African narratives")}</span>
        </div>
        <h2>{c("Who gets to tell Africa’s stories?")}</h2>
        <p>
          {c("How Africa is represented in international media, who tells its stories, and how local perspectives can help create a more complete picture of the continent.")}</p>
        <blockquote>
          {c("“The purpose is not to have an opinion on everything. It is to explore the subjects I care about with curiosity, context and a willingness to think critically.”")}</blockquote>
        <div className="author-line">
          <span className="author-initial" aria-hidden="true">
            {c("A")}</span>
          <div>
            {c("Andrino AKUDA KANGELA")}<small>{c("Goma · Editorial focus")}</small>
          </div>
        </div>
        <Eyebrow>{c("Stories, essays and observations to come")}</Eyebrow>
        <ArrowLink href="/writing/african-narratives">
          {c("Explore this perspective")}</ArrowLink>
      </div>
    </div>
  );
}
