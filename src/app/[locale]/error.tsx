"use client";
import { useCopy } from "@/i18n/copy";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const c = useCopy();

  return (
    <div role="alert" className="editorial-container py-24">
      <p className="eyebrow">{c("A brief interruption")}</p>
      <h1>{c("Let’s try that again.")}</h1>
      <p className="prose mb-8">
        {c("Something interrupted this page. You can try loading it again.")}</p>
      <button
        type="button"
        className="action-link action-primary"
        onClick={reset}
      >
        {c("Try again")}</button>
    </div>
  );
}
