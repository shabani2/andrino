import { identity } from "./identity";
export type SocialLink = { label: string; href: string };
export const socialLinks: SocialLink[] = [
  { label: "LinkedIn", href: identity.linkedin },
  { label: "Facebook", href: identity.facebook },
  { label: "X", href: identity.social },
  { label: "Instagram", href: identity.instagram },
  { label: "YouTube", href: identity.youtube },
];
