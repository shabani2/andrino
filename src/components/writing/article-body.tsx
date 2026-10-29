import type { ReactNode } from "react";

export function ArticleBody({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 max-w-3xl whitespace-pre-wrap leading-relaxed">
      {children}
    </div>
  );
}
