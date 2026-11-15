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
import { socialLinks } from "@/config/social";
import { useTranslations } from "next-intl";
import { LocalTime } from "./local-time";
import { PlatformIcon } from "@/components/shared/platform-icon";
const ways = [
  {
    title: "Editorial writing & stories",
    text: "Articles, interviews and opinion pieces.",
    Icon: Feather,
  },
  {
    title: "Strategic communication",
    text: "Communication plans, messages and content.",
    Icon: Megaphone,
  },
  {
    title: "Humanitarian storytelling",
    text: "Stories about people involved in humanitarian programmes.",
    Icon: HeartHandshake,
  },
  {
    title: "Multimedia & creative work",
    text: "Videos from my work in Goma and beyond.",
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
            src="/images/andrino/conversation.webp"
            alt={c("Andrino sharing ideas during a session in Goma")}
            className="andrino-conversation"
          />
          <div className="station-photo-caption">
            <Eyebrow>{c("Let’s start a conversation")}</Eyebrow>
            <h2>{c("Andrino Akuda Kangela")}</h2>
          </div>
        </div>
        <div className="station-information">
          <div className="info-line">
            <MapPin size={20} aria-hidden="true" />
            <div>
              <Eyebrow>{c("Based in")}</Eyebrow>
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
        <h2 className="text-2xl!">{c("What you can write to me about")}</h2>
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
    </aside>
  );
}

export function ContactChannels() {
  const c = useCopy();
  const t = useTranslations("contactChannels");

  return (
    <section className="sidebar-panel contact-channels" aria-labelledby="contact-channels-title">
      <h2 id="contact-channels-title" className="eyebrow">{c("Write or call")}</h2>
      <div className="channel-list">
        <a className="channel-link" href={"mailto:" + identity.email}>
          <div className="channel-identity"><PlatformIcon name="Direct email" /><div>{c("Direct email")}<small>{identity.email}</small></div></div>
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
        <a className="channel-link" href={"tel:" + identity.phone}>
          <div className="channel-identity"><PlatformIcon name="Phone" /><div>{t("phone")}<small>{identity.phoneDisplay}</small></div></div>
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
        <a
          className="channel-link"
          href={identity.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="channel-identity"><PlatformIcon name="WhatsApp" /><div>WhatsApp<small>{identity.phoneDisplay}</small></div></div>
          <ArrowUpRight size={18} aria-hidden="true" />
          <span className="sr-only">{c("Opens in a new tab")}</span>
        </a>
        {socialLinks.map((link) => (
          <a key={link.label} className="channel-link" href={link.href} target="_blank" rel="noopener noreferrer">
            <div className="channel-identity"><PlatformIcon name={link.label} /><span>{link.label}</span></div>
            <ArrowUpRight size={18} aria-hidden="true" />
            <span className="sr-only">{c("Opens in a new tab")}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
