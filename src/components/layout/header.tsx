import { useCopy } from "@/i18n/copy";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { identity } from "@/config/identity";
import { Container } from "./container";
import { Navbar } from "./navbar";
import { MobileMenu } from "./mobile-menu";
import { ReadingPreferences } from "./reading-preferences";
export function Header() {
  const c = useCopy();

  return (
    <header className="site-header">
      <Container className="header-inner">
        <Link href="/" className="brand" aria-label={c("Andrino home")}>
          <span className="wordmark">{c("ANDRINO")}</span>
          <span className="brand-name">{c(identity.fullName)}</span>
        </Link>
        <Navbar />
        <div className="header-actions">
          <Link href="/contact" className="header-cta">
            {c("Let’s talk")}</Link>
          <Image
            src="/images/home/home-1.webp"
            width={32}
            height={32}
            alt=""
            className="header-avatar"
          />
          <MobileMenu />
          <div className="header-preferences"><ReadingPreferences compact /></div>
        </div>
      </Container>
    </header>
  );
}
