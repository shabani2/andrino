import { useCopy } from "@/i18n/copy";
import {
  ArrowUpRight,
  Clock3,
  Languages,
  MapPin,
  Feather,
  Megaphone,
  HeartHandshake,
  Video,
} from "lucide-react";
import { EditorialImage, Eyebrow } from "@/components/shared/editorial";
import { identity } from "@/config/identity";
import { LocalTime } from "./local-time";
const ways = [
  {
    title: "Editorial writing & stories",
    text: "Stories, essays, opinions and observations that deserve attention.",
    Icon: Feather,
  },
  {
    title: "Strategic communication",
    text: "Clear messages, engaging content and communication planning.",
    Icon: Megaphone,
  },
  {
    title: "Humanitarian storytelling",
    text: "Connecting programme activities with lived human experiences.",
    Icon: HeartHandshake,
  },
  {
    title: "Multimedia & creative work",
    text: "Photography, video, audio and other ways to bring stories to life.",
    Icon: Video,
  },
];
export function ContactInformation() {
  const c = useCopy();

  return (
    <aside className="contact-sidebar" aria-label={c("Contact information")}>
      <section className="station-card">
        <div className="station-photo">
          <EditorialImage
            src="/images/home/home-2.webp"
            alt={c("Lake Kivu and the landscape of Goma at dusk")}
          />
          <div className="station-photo-caption">
            <Eyebrow>{c("Field post & home base")}</Eyebrow>
            <h2>{c("Goma, North Kivu")}</h2>
          </div>
        </div>
        <div className="station-information">
          <div className="info-line">
            <MapPin size={20} aria-hidden="true" />
            <div>
              <Eyebrow>{c("Base station")}</Eyebrow>
              <strong>
                {c("Goma, North Kivu · Democratic Republic of the Congo")}</strong>
            </div>
          </div>
          <div className="station-details">
            <div>
              <Eyebrow>{c("Timezone")}</Eyebrow>
              <div className="info-line">
                <Clock3 size={16} aria-hidden="true" />
                <span>{c("CAT (UTC+2)")}</span>
              </div>
              <LocalTime />
            </div>
            <div>
              <Eyebrow>{c("Languages")}</Eyebrow>
              <div className="info-line">
                <Languages size={16} aria-hidden="true" />
                <span>{c("FR · EN · SW")}</span>
              </div>
              <small>{c("French, English & Swahili")}</small>
            </div>
          </div>
        </div>
      </section>
      <section className="sidebar-panel">
        <h2 className="text-2xl!">{c("Ways we can work together")}</h2>
        <div className="cooperation-list">
          {ways.map(({ title, text, Icon }) => (
            <div className="cooperation-item" key={title}>
              <Icon size={19} strokeWidth={1.4} aria-hidden="true" />
              <div>
                <strong>{c(title)}</strong>
                <span>{c(text)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="sidebar-panel">
        <Eyebrow>{c("Direct channels")}</Eyebrow>
        <div className="channel-list">
          <a
            className="channel-link"
            href={identity.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div>
              {c("LinkedIn")}<small>{c("Professional updates and connections")}</small>
            </div>
            <ArrowUpRight size={18} aria-hidden="true" />
            <span className="sr-only">{c("Opens in a new tab")}</span>
          </a>
          <a
            className="channel-link"
            href={identity.substack}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div>
              {c("The Dispatch / Substack")}<small>{c("Writing and longer conversations")}</small>
            </div>
            <ArrowUpRight size={18} aria-hidden="true" />
            <span className="sr-only">{c("Opens in a new tab")}</span>
          </a>
          <a className="channel-link" href={"mailto:" + identity.email}>
            <div>
              {c("Direct email")}<small>{c(identity.email)}</small>
            </div>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>
      <blockquote className="sidebar-panel">
        <Eyebrow>{c("A shared curiosity")}</Eyebrow>
        <p className="font-serif text-xl! italic">
          {c("“I welcome conversations that can lead to meaningful work.”")}</p>
      </blockquote>
    </aside>
  );
}
