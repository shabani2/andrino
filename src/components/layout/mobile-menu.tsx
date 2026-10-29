"use client";
import { useCopy } from "@/i18n/copy";
import { useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";

import { Menu, X } from "lucide-react";
import { navigation } from "@/config/navigation";
export function MobileMenu() {
  const c = useCopy();

  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  function close() {
    setOpen(false);
    button.current?.focus();
  }
  return (
    <div
      className="mobile-navigation"
      onKeyDown={(event) => {
        if (event.key === "Escape") close();
      }}
    >
      <button
        ref={button}
        type="button"
        className="menu-button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={c(open ? "Close navigation" : "Open navigation")}
        onClick={() => setOpen(!open)}
      >
        {c(open ? (
          <X size={22} aria-hidden="true" />
        ) : (
          <Menu size={22} aria-hidden="true" />
        ))}
      </button>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-menu"
          aria-label={c("Mobile navigation")}
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {c(item.label)}
            </Link>
          ))}
          <p>{c("Stories and perspectives from Goma.")}</p>
        </nav>
      )}
    </div>
  );
}
