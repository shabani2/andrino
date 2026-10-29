import { useCopy } from "@/i18n/copy";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "./editorial";
export function PageHero({
  title,
  description,
  label = "ANDRINO / FIELD NOTES",
  number,
}: {
  title: string;
  description?: string;
  label?: string;
  number?: string;
}) {
  const c = useCopy();

  return (
    <section className="page-hero">
      <Container>
        <div className="hero-folio">
          <Eyebrow>{c(label)}</Eyebrow>
          {number && <span className="folio-number">{c(number)} {c("/ SELECTION")}</span>}
        </div>
        <h1>{c(title)}</h1>
        {description && <p className="page-hero-description">{c(description)}</p>}
      </Container>
    </section>
  );
}
