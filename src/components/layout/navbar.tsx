"use client";
import { useCopy } from "@/i18n/copy";
import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";

import { navigation } from "@/config/navigation";
export function Navbar() {
  const c = useCopy();

  const pathname = usePathname();
  return (
    <nav className="desktop-nav" aria-label={c("Main navigation")}>
      {navigation
        .filter((item) => item.href !== "/contact")
        .map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href + "/"))
                ? "page"
                : undefined
            }
          >
            {c(item.label)}
          </Link>
        ))}
    </nav>
  );
}
