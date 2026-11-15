import { useCopy } from "@/i18n/copy";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/shared/editorial";
import { Biography } from "@/components/about/biography";
import { ValuesSection } from "@/components/about/values-section";
import { VisionSection } from "@/components/about/vision-section";
import { createMetadata } from "@/lib/seo";
export async function generateMetadata() { return createMetadata(
  "About",
  "Andrino Akuda Kangela writes and works in communications from Goma, DRC.",
  "/about",
); }
export default function AboutPage() {
  const c = useCopy();

  return (
    <>
      <section className="section-padding about-hero">
        <Container>
          <div className="hero-folio">
            <Eyebrow>{c("About me")}</Eyebrow>
            <span className="folio-number">{c("01 / About")}</span>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <div>
                <h1>{c("Andrino Akuda Kangela")}</h1>
                <p className="hero-description">
                  {c("I work in communications and write from Goma, in the Democratic Republic of the Congo.")}</p>
              </div>
              <div className="location-card">
                <MapPin size={24} strokeWidth={1.4} aria-hidden="true" />
                <div>
                  <Eyebrow>{c("Based in")}</Eyebrow>
                  <strong>{c("Goma, North Kivu · DRC")}</strong>
                  <div className="location-details">
                    <span>
                      {c("Coordinates")}<br />
                      {c("1°40′S 29°13′E")}</span>
                    <span>
                      {c("I write about")}<br />
                      {c("Goma and the wider region")}</span>
                  </div>
                </div>
              </div>
            </div>
            <figure>
              <div className="editorial-image hero-portrait">
                <Image
                  src="/images/andrino/portrait-profile.webp"
                  fill
                  preload
                  sizes="(max-width: 767px) 100vw, 45vw"
                  alt={c("Black-and-white profile portrait of Andrino Akuda Kangela")}
                  className="object-cover"
                />
                <span className="portrait-stamp">{c("Goma · Portrait")}</span>
                <div className="portrait-caption">
                  <div>
                    <p>{c("Andrino Akuda Kangela")}</p>
                    <span>{c("Communication · Articles · Images")}</span>
                  </div>
                </div>
              </div>
              <figcaption className="image-caption">
                <span>{c("Portrait of Andrino Akuda Kangela")}</span>
              </figcaption>
            </figure>
          </div>
          <div className="insight-strip about-traits">
            <div>
              <strong>{c("Communication")}</strong>
              <span>{c("Clear messages for real people.")}</span>
            </div>
            <div>
              <strong>{c("Storytelling")}</strong>
              <span>{c("People and their stories.")}</span>
            </div>
            <div>
              <strong>{c("Great Lakes")}</strong>
              <span>{c("I live and work here.")}</span>
            </div>
            <div>
              <strong>{c("Curiosity")}</strong>
              <span>{c("I keep learning.")}</span>
            </div>
          </div>
        </Container>
      </section>
      <Biography />
      <ValuesSection />
      <VisionSection />
    </>
  );
}
