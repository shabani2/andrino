"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Feather,
  FileText,
  Folder,
  House,
  Layers3,
  LogOut,
  Mail,
  Menu,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { adminText, contentSections } from "@/lib/admin-sections";

type Item = { slug: string; label: string; icon: typeof House };

function navigationItems(locale: string, admin: boolean): Item[] {
  const label = (fr: string, en: string) => adminText(locale, fr, en);
  return [
    { slug: "", label: label("Vue d’ensemble", "Overview"), icon: House },
    { slug: "articles", label: label(contentSections.articles.fr, contentSections.articles.en), icon: FileText },
    { slug: "projets", label: label(contentSections.projets.fr, contentSections.projets.en), icon: Folder },
    { slug: "rubriques", label: label(contentSections.rubriques.fr, contentSections.rubriques.en), icon: Layers3 },
    { slug: "themes", label: label(contentSections.themes.fr, contentSections.themes.en), icon: Feather },
    { slug: "portfolio", label: label(contentSections.portfolio.fr, contentSections.portfolio.en), icon: BookOpen },
    { slug: "messages", label: label("Messages", "Messages"), icon: Mail },
    { slug: "profil", label: label("Mon profil", "My profile"), icon: UserRound },
    ...(admin ? [{ slug: "equipe", label: label("Équipe", "Team"), icon: UsersRound }] : []),
  ];
}

function Sidebar({ locale, items, pathname, account, email, role, signOutAction, onNavigate }: {
  locale: string;
  items: Item[];
  pathname: string;
  account: string;
  email: string;
  role: string;
  signOutAction: () => Promise<void>;
  onNavigate?: () => void;
}) {
  const base = `/${locale}/admin`;
  return (
    <div className="admin-sidebar-inner">
      <Link href={base} className="admin-brand" onClick={onNavigate} aria-label="Andrino Studio">
        <span className="admin-brand-name">ANDRINO</span>
        <span className="admin-brand-subtitle">Studio</span>
      </Link>

      <nav aria-label={adminText(locale, "Navigation admin", "Admin navigation")} className="admin-nav">
        {items.map(({ slug, label, icon: ItemIcon }) => {
          const href = `${base}${slug ? `/${slug}` : ""}`;
          const active = slug ? pathname === href || pathname.startsWith(`${href}/`) : pathname === base;
          return (
            <Link key={slug} href={href} onClick={onNavigate} aria-current={active ? "page" : undefined}
              className={`admin-nav-link${active ? " is-active" : ""}`}>
              <ItemIcon size={19} strokeWidth={1.8} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-foot">
        <div className="admin-account">
          <div className="admin-account-avatar" aria-hidden="true">{account.trim().charAt(0).toUpperCase() || "A"}</div>
          <div className="admin-account-copy">
            <strong>{account}</strong>
            <span>{email}</span>
            <small>{role === "admin" ? adminText(locale, "Administrateur", "Administrator") : adminText(locale, "Éditeur", "Editor")}</small>
          </div>
        </div>
        <Link href={`/${locale}`} className="admin-foot-link" onClick={onNavigate}>
          <ArrowUpRight size={18} strokeWidth={1.8} aria-hidden="true" />
          {adminText(locale, "Voir le site", "View site")}
        </Link>
        <form action={signOutAction}>
          <button type="submit" className="admin-foot-link">
            <LogOut size={18} strokeWidth={1.8} aria-hidden="true" />
            {adminText(locale, "Se déconnecter", "Sign out")}
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdminShell({ children, locale, email, displayName, role, signOutAction }: {
  children: ReactNode;
  locale: string;
  email: string;
  displayName: string | null;
  role: string;
  signOutAction: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const items = navigationItems(locale, role === "admin");
  const current = items.filter((item) => {
    const href = `/${locale}/admin${item.slug ? `/${item.slug}` : ""}`;
    return pathname === href || (item.slug && pathname.startsWith(`${href}/`));
  }).at(-1) ?? items[0];

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const menuButton = menuRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      menuButton?.focus();
    };
  }, [open]);

  const account = displayName || email.split("@")[0] || "Admin";
  const sidebarProps = { locale, items, pathname, account, email, role, signOutAction };
  const otherLocale = locale === "fr" ? "en" : "fr";
  const translatedPath = pathname.replace(/^\/(fr|en)/, `/${otherLocale}`);

  return (
    <div className="admin-shell">
      <aside className="admin-desktop-sidebar" aria-label={adminText(locale, "Espace admin", "Admin workspace")} inert={open}>
        <Sidebar {...sidebarProps} />
      </aside>

      <div className="admin-workspace" inert={open}>
        <header className="admin-topbar">
          <div className="admin-mobile-brand"><span>ANDRINO</span><small>Studio</small></div>
          <nav aria-label={adminText(locale, "Fil d’Ariane", "Breadcrumb")} className="admin-breadcrumb">
            <Link href={`/${locale}/admin`}>{adminText(locale, "Administration", "Administration")}</Link>
            <ChevronRight size={15} strokeWidth={1.8} aria-hidden="true" />
            <span>{current.label}</span>
          </nav>
          <div className="admin-topbar-actions">
            <nav className="admin-language" aria-label={adminText(locale, "Langue", "Language")}>
              <span aria-current="page">{locale.toUpperCase()}</span>
              <Link href={translatedPath} lang={otherLocale} hrefLang={otherLocale}>{otherLocale.toUpperCase()}</Link>
            </nav>
            <button ref={menuRef} type="button" className="admin-menu-trigger"
              aria-label={adminText(locale, "Ouvrir le menu", "Open menu")}
              aria-expanded={open} aria-controls="admin-mobile-navigation"
              onClick={() => setOpen(true)}>
              <Menu size={21} strokeWidth={1.8} aria-hidden="true" />
              <span>{adminText(locale, "Menu", "Menu")}</span>
            </button>
          </div>
        </header>

        <main id="main-content" className="admin-content" tabIndex={-1}>{children}</main>
      </div>

      {open && <div className="admin-mobile-overlay">
        <button type="button" className="admin-mobile-backdrop"
          aria-label={adminText(locale, "Fermer le menu", "Close menu")}
          onClick={() => setOpen(false)} />
        <aside id="admin-mobile-navigation" className="admin-mobile-drawer"
          aria-label={adminText(locale, "Espace admin", "Admin workspace")}>
          <button ref={closeRef} type="button" className="admin-mobile-close"
            aria-label={adminText(locale, "Fermer le menu", "Close menu")}
            onClick={() => setOpen(false)}>
            <X size={23} strokeWidth={1.8} aria-hidden="true" />
          </button>
          <Sidebar {...sidebarProps} onNavigate={() => setOpen(false)} />
        </aside>
      </div>}
    </div>
  );
}
