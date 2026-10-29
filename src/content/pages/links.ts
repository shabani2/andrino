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
    label: "Social media",
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
    label: "The Dispatch / Substack",
    href: identity.substack,
    description: "A space for longer conversations and independent writing.",
    external: true,
  },
];
