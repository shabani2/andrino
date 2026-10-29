import { HeroSection } from "@/components/home/hero-section";
import { Introduction } from "@/components/home/introduction";
import { ServicesSection } from "@/components/home/services-section";
import { BeyondHeadlines } from "@/components/home/beyond-headlines";
import { FeaturedWork } from "@/components/home/featured-work";
import { LatestWriting } from "@/components/home/latest-writing";
import { ConnectSection } from "@/components/home/connect-section";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export async function generateMetadata() {
  return { ...await createMetadata(siteConfig.name, siteConfig.description, "/"), title: { absolute: siteConfig.name } };
}
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Introduction />
      <ServicesSection />
      <BeyondHeadlines />
      <FeaturedWork />
      <LatestWriting />
      <ConnectSection />
    </>
  );
}
