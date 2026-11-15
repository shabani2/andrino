import { useCopy } from "@/i18n/copy";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { PlatformIcon } from "@/components/shared/platform-icon";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/shared/page-hero";
import { EditorialImage, Eyebrow } from "@/components/shared/editorial";
import { links } from "@/content/pages/links";
import { createMetadata } from "@/lib/seo";
export async function generateMetadata() { return createMetadata(
  "Links",
  "Find Andrino’s profiles, posts, videos and contact details.",
  "/links",
); }
export default function LinksPage() {
  const c = useCopy();

  return (
    <>
      <PageHero
        label={c("Social media")}
        title={c("Where to find me.")}
        description={c("My profiles, posts and videos are collected here.")}
      />
      <section className="section-padding pt-4!">
        <Container>
          <div className="links-layout">
            <aside className="links-sidebar">
              <EditorialImage
                src="/images/andrino/at-google-io.webp"
                alt={c("Andrino Akuda Kangela at Google I/O Extended in Goma")}
                className="andrino-links"
              />
              <div>
                <Eyebrow>{c("Andrino Akuda Kangela")}</Eyebrow>
                <p className="prose">
                  {c("Communications professional.")}<br />
                  {c("Storyteller. Writer.")}<br />
                  {c("Based in Goma, DR Congo.")}</p>
              </div>
            </aside>
            <div className="link-directory">
              {links.map((item, index) =>
                item.external ? (
                  <a
                    className="directory-item"
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <PlatformIcon name={item.label} size={22} />
                    <div>
                      <h2>{c(item.label)}</h2>
                      <p>{c(item.description)}</p>
                    </div>
                    <span>0{index + 1}</span>
                    <ArrowUpRight size={20} aria-hidden="true" />
                    <span className="sr-only">{c("Opens in a new tab")}</span>
                  </a>
                ) : (
                  <Link
                    className="directory-item"
                    href={item.href}
                    key={item.label}
                  >
                    <PlatformIcon name={item.label} size={22} />
                    <div>
                      <h2>{c(item.label)}</h2>
                      <p>{c(item.description)}</p>
                    </div>
                    <span>0{index + 1}</span>
                    <ArrowRight size={20} aria-hidden="true" />
                  </Link>
                ),
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
