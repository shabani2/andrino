import { identity } from "@/config/identity";
export type PublicLink = {
  label: string;
  href: string;
  description: string;
  external?: boolean;
};
export const links: PublicLink[] = [
  {
    label: "LinkedIn",
    href: identity.linkedin,
    description: "My professional profile and recent posts.",
    external: true,
  },
  {
    label: "Published posts",
    href: "/writing",
    description: "Read my articles and opinion posts.",
  },
  {
    label: "X",
    href: identity.social,
    description:
      "Short updates and links to my work.",
    external: true,
  },
  {
    label: "Multimedia",
    href: "/portfolio?category=Multimedia",
    description: "Photos, videos and audio from my work.",
  },
  {
    label: "Projects and collaborations",
    href: "/projects",
    description: "See the projects I am working on.",
  },
  {
    label: "Facebook",
    href: identity.facebook,
    description: "Short updates and links to my work.",
    external: true,
  },
  {
    label: "Instagram",
    href: identity.instagram,
    description: "Photos, videos and audio from my work.",
    external: true,
  },
  {
    label: "YouTube",
    href: identity.youtube,
    description: "Videos from my work in Goma and beyond.",
    external: true,
  },
  {
    label: "WhatsApp",
    href: identity.whatsapp,
    description: identity.phoneDisplay,
    external: true,
  },
  {
    label: "Direct email",
    href: "mailto:" + identity.email,
    description: identity.email,
  },
];
