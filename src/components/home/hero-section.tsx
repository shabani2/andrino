import { useCopy } from "@/i18n/copy";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { ActionLink, ArrowLink, Eyebrow } from "@/components/shared/editorial";
export function HeroSection() {
  const c = useCopy();

  return (
    <section className="home-hero">
      <Container>
        <div className="hero-grid">
          <div className="hero-copy">
            <div>
              <Eyebrow>
                <span className="dot" />
                {c("Communications · Storytelling · Writing")}</Eyebrow>
              <h1>{c("Hi, I’m Andrino.")}</h1>
              <p className="hero-tagline">
                {c("My work. My stories. My point of view.")}</p>
              <p className="hero-description">
                {c("I’m a communications professional, storyteller and writer interested in the people, ideas and everyday realities shaping Africa. Based in Goma, Democratic Republic of the Congo.")}</p>
            </div>
            <div>
              <div className="actions-row">
                <ActionLink href="/portfolio">{c("Explore my work")}</ActionLink>
                <ActionLink href="/writing" variant="peach">
                  {c("Read my articles")}</ActionLink>
                <ArrowLink href="/contact">{c("Get in touch")}</ArrowLink>
              </div>
              <div className="hero-coordinate">
                <div>
                  <strong>{c("Coordinates")}</strong>{c("1°40′S 29°13′E · Lake Kivu Basin")}</div>
                <small>{c("From Goma · Looking beyond the headlines")}</small>
              </div>
            </div>
          </div>
          <figure>
            <div className="editorial-image hero-portrait">
              <Image
                src="/images/home/home-1.webp"
                alt={c("Editorial portrait overlooking the city and Lake Kivu")}
                fill
                sizes="(max-width: 767px) 100vw, 45vw"
                preload
                className="object-cover"
              />
              <span className="portrait-stamp">{c("Issue N° 01 · Goma, DRC")}</span>
              <div className="portrait-caption">
                <div>
                  <p>{c("Andrino AKUDA KANGELA")}</p>
                  <span>{c("Goma · Eastern DR Congo")}</span>
                </div>
                <small>{c("VOL. I / PERSPECTIVES")}</small>
              </div>
            </div>
            <figcaption className="image-caption">
              <span>
                {c("Stories grounded in lived context and local perspectives.")}</span>
              <span>{c("FIG. 01")}</span>
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
