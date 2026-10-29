import type { ReactNode } from "react";

export function EditorialQuote({
  children,
  author,
}: {
  children: ReactNode;
  author?: string;
}) {
  return (
    <blockquote className="my-8 border-l-2 pl-6">
      <p className="text-xl">{children}</p>
      {author && (
        <footer className="mt-2 text-sm text-muted-foreground">{author}</footer>
      )}
    </blockquote>
  );
}
