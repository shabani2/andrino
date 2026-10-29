import { identity } from "./identity";
export const siteConfig = {
  ...identity,
  description:
    "Communications professional, storyteller and writer. Work, stories and perspectives from Goma, Democratic Republic of the Congo.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locale: "en_GB",
};
