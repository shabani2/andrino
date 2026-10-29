import { useCopy } from "@/i18n/copy";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, ArrowRight, Link2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/shared/page-hero";
import { EditorialImage, Eyebrow } from "@/components/shared/editorial";
import { links } from "@/content/pages/links";
import { createMetadata } from "@/lib/seo";
export async function generateMetadata() { return createMetadata(
  "Links",
  "Find Andrino's work, writing, projects and professional updates across the web.",
  "/links",
); }
export default function LinksPage() {
  const c = useCopy();

  return (
    <>
      <PageHero
        label={c("Across the web")}
        title={c("Find me across the web.")}
        description={c("This is the place to find my work, follow my professional journey and discover what I am publishing elsewhere.")}
      />
      <section className="section-padding pt-4!">
        <Container>
          <div className="links-layout">
            <aside className="links-sidebar">
              <EditorialImage
                src="/images/home/home-1.webp"
                alt={c("Editorial portrait with the Goma landscape in the background")}
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
                    <Link2 size={22} aria-hidden="true" />
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
                    <Link2 size={22} aria-hidden="true" />
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
