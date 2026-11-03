import { Link2, Mail, Phone } from "lucide-react";

type Props = { name: string; size?: number; className?: string };

/** Monochrome platform marks, always paired with a visible text label. */
export function PlatformIcon({ name, size = 18, className }: Props) {
  const props = { width: size, height: size, className, "aria-hidden": true as const, focusable: false as const };
  if (name === "Direct email") return <Mail size={size} className={className} aria-hidden="true" />;
  if (name === "Phone") return <Phone size={size} className={className} aria-hidden="true" />;

  switch (name) {
    case "LinkedIn":
      return <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.46 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.29 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04c.39-.75 1.35-1.55 2.79-1.55 2.99 0 3.58 1.97 3.58 4.53v5.27Z" /></svg>;
    case "Facebook":
      return <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.62.77-1.62 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" /></svg>;
    case "X":
      return <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.42L5.55 22H2.4l8.2-9.37L.8 2h6.4l4.42 6.76L18.9 2Zm-1.1 18h1.73L6.26 3.9H4.4L17.8 20Z" /></svg>;
    case "Instagram":
      return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
    case "YouTube":
      return <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M21.58 6.25a2.7 2.7 0 0 0-1.9-1.9C18 3.9 12 3.9 12 3.9s-6 0-7.68.45a2.7 2.7 0 0 0-1.9 1.9A28 28 0 0 0 2 12a28 28 0 0 0 .42 5.75 2.7 2.7 0 0 0 1.9 1.9c1.68.45 7.68.45 7.68.45s6 0 7.68-.45a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.42-5.75ZM10 15.5v-7l6 3.5-6 3.5Z" /></svg>;
    case "WhatsApp":
      return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.7 7.4L3 20.5l1.6-4.8a8.5 8.5 0 1 1 15.9-4.2Z" /><path d="m8.3 7.3 1.5 2.4-1 1.2a7.5 7.5 0 0 0 3.7 3.7l1.2-1 2.4 1.5c-.3 1.5-1.3 2-2.5 1.7-3.7-.9-6.5-3.7-7.4-7.4-.3-1.2.2-2.2 2.1-2.1Z" /></svg>;
    default:
      return <Link2 size={size} className={className} aria-hidden="true" />;
  }
}
