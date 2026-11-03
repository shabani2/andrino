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
    description: "Professional updates, ideas and collaborations.",
    external: true,
  },
  {
    label: "Published articles",
    href: "/writing",
    description: "Stories, observations and the subjects I am exploring.",
  },
  {
    label: "X",
    href: identity.social,
    description:
      "Selected work, perspectives and conversations across the web.",
    external: true,
  },
  {
    label: "Multimedia",
    href: "/portfolio?category=Multimedia",
    description: "Photography, video, audio and other storytelling formats.",
  },
  {
    label: "Projects and collaborations",
    href: "/projects",
    description: "Selected initiatives and ideas as they develop.",
  },
  {
    label: "Facebook",
    href: identity.facebook,
    description: "Selected work, perspectives and conversations across the web.",
    external: true,
  },
  {
    label: "Instagram",
    href: identity.instagram,
    description: "Photography, video, audio and other storytelling formats.",
    external: true,
  },
  {
    label: "YouTube",
    href: identity.youtube,
    description: "Photography, video, audio and other ways to bring stories to life.",
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
