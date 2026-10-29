import { identity } from "./identity";
export type SocialLink = { label: string; href: string };
export const socialLinks: SocialLink[] = [
  { label: "LinkedIn", href: identity.linkedin },
  { label: "Substack", href: identity.substack },
  { label: "X / Dispatch", href: identity.social },
];
