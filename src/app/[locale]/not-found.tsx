import { useCopy } from "@/i18n/copy";
import { Link } from "@/i18n/navigation";
export default function NotFound() {
  const c = useCopy();

  return (
    <main id="main-content" className="editorial-container py-32">
      <p className="eyebrow">{c("404 / A missing page")}</p>
      <h1>{c("This story isn’t here.")}</h1>
      <p className="prose mb-8">
        {c("The page may have moved, or this part of the story is still being written.")}</p>
      <Link href="/" className="action-link action-primary">
        {c("Back to Andrino")}</Link>
    </main>
  );
}
