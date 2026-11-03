import { useCopy } from "@/i18n/copy";
import { socialLinks } from "@/config/social";
import { PlatformIcon } from "./platform-icon";
export function SocialLinks() {
  const c = useCopy();

  return (
    <ul className="social-links" aria-label={c("Find Andrino online")}>
      {socialLinks.map((link) => (
        <li key={link.label}>
          <a href={link.href} target="_blank" rel="noopener noreferrer">
            <PlatformIcon name={link.label} />
            {c(link.label)}
            <span className="sr-only"> {c("(opens in a new tab)")}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
