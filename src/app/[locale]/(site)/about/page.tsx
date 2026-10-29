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
  "Meet Andrino Akuda Kangela: communications professional, storyteller and writer based in Goma, Democratic Republic of the Congo.",
  "/about",
); }
export default function AboutPage() {
  const c = useCopy();

  return (
    <>
      <section className="section-padding about-hero">
        <Container>
          <div className="hero-folio">
            <Eyebrow>{c("About the person")}</Eyebrow>
            <span className="folio-number">{c("01 / Dossier")}</span>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <div>
                <h1>
                  {c("The person")}<br />
                  {c("behind the stories.")}</h1>
                <p className="hero-description">
                  {c("My name is")}{" "}
                  <strong className="font-medium text-primary">
                    {c("Andrino AKUDA KANGELA")}</strong>
                  {c(". I am a communications professional and storyteller from the Democratic Republic of the Congo, based in Goma.")}</p>
              </div>
              <div className="location-card">
                <MapPin size={24} strokeWidth={1.4} aria-hidden="true" />
                <div>
                  <Eyebrow>{c("Field dispatch base")}</Eyebrow>
                  <strong>{c("Goma, North Kivu · DRC")}</strong>
                  <div className="location-details">
                    <span>
                      {c("Coordinates")}<br />
                      {c("1°40′S 29°13′E")}</span>
                    <span>
                      {c("Focus area")}<br />
                      {c("Great Lakes storytelling")}</span>
                  </div>
                </div>
              </div>
            </div>
            <figure>
              <div className="editorial-image hero-portrait">
                <Image
                  src="/images/about/about-1.webp"
                  fill
                  preload
                  sizes="(max-width: 767px) 100vw, 45vw"
                  alt={c("Editorial portrait in the landscape of Goma and the Great Lakes")}
                  className="object-cover"
                />
                <span className="portrait-stamp">{c("Fig. 01 · Perspective")}</span>
                <div className="portrait-caption">
                  <div>
                    <p>{c("Andrino Akuda Kangela")}</p>
                    <span>{c("Communications · Storytelling · Writing")}</span>
                  </div>
                </div>
              </div>
              <figcaption className="image-caption">
                <span>{c("Goma, Democratic Republic of the Congo.")}</span>
                <span>{c("FIELD NOTES")}</span>
              </figcaption>
            </figure>
          </div>
          <div className="insight-strip about-traits">
            <div>
              <strong>{c("Communication")}</strong>
              <span>{c("Ideas, messages and audiences.")}</span>
            </div>
            <div>
              <strong>{c("Storytelling")}</strong>
              <span>{c("People beyond the statistics.")}</span>
            </div>
            <div>
              <strong>{c("Great Lakes")}</strong>
              <span>{c("A local point of view.")}</span>
            </div>
            <div>
              <strong>{c("Curiosity")}</strong>
              <span>{c("Always learning, always looking.")}</span>
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
