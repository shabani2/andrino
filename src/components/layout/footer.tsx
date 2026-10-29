import { useCopy } from "@/i18n/copy";
import { Link } from "@/i18n/navigation";
import { ArrowUp } from "lucide-react";
import { navigation } from "@/config/navigation";
import { identity } from "@/config/identity";
import { SocialLinks } from "@/components/shared/social-links";
import { Container } from "./container";
import { ReadingPreferences } from "./reading-preferences";
export function Footer() {
  const c = useCopy();

  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-grid">
          <div>
            <Link href="/" className="wordmark footer-wordmark">
              {c("ANDRINO")}</Link>
            <p className="footer-tagline">{c(identity.tagline)}</p>
            <p className="footer-description">
              {c("Communications · Storytelling · Writing · Ideas")}<br />
              {c("Goma, Democratic Republic of the Congo.")}</p>
          </div>
          <div className="footer-right">
            <ReadingPreferences />
            <nav aria-label={c("Footer navigation")}>
              {navigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  {c(item.label)}
                </Link>
              ))}
            </nav>
            <div className="footer-social">
              <SocialLinks />
              <a href="#top" className="text-link small">
                <ArrowUp size={14} aria-hidden="true" />
                {c("Back to top")}</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {c("Andrino. All rights reserved.")}</p>
          <p>
            {c("The views expressed in my personal writing are my own unless otherwise stated.")}</p>
        </div>
      </Container>
    </footer>
  );
}
