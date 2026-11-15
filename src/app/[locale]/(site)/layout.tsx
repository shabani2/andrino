import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PageViewTracker />
      <Header />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
