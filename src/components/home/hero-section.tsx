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
                {c("Communication · Articles · Images")}</Eyebrow>
              <h1>{c("Hi, I’m Andrino.")}</h1>
              <p className="hero-tagline">
                {c("Articles, communication and projects from Goma.")}</p>
              <p className="hero-description">
                {c("I work in communications and write from Goma, in the Democratic Republic of the Congo.")}</p>
            </div>
            <div>
              <div className="actions-row">
                <ActionLink href="/portfolio">{c("Explore my work")}</ActionLink>
                <ActionLink href="/writing" variant="peach">
                  {c("Read my posts")}</ActionLink>
                <ArrowLink href="/contact">{c("Get in touch")}</ArrowLink>
              </div>
              <div className="hero-coordinate">
                <div>
                  <strong>{c("Coordinates")}</strong>{" "}{c("1°40′S 29°13′E · Lake Kivu Basin")}</div>
                <small>{c("From Goma · Looking beyond the headlines")}</small>
              </div>
            </div>
          </div>
          <figure>
            <div className="editorial-image hero-portrait">
              <Image
                src="/images/andrino/portrait.webp"
                alt={c("Portrait of Andrino Akuda Kangela")}
                fill
                sizes="(max-width: 767px) 100vw, 45vw"
                preload
                className="object-cover"
              />
              <div className="portrait-caption">
                <div>
                  <p>{c("Andrino AKUDA KANGELA")}</p>
                  <span>{c("Goma · Eastern DR Congo")}</span>
                </div>
              </div>
            </div>
            <figcaption className="image-caption">
              <span>
                {c("From Goma, with attention to life on the ground.")}</span>
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
