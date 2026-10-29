import type { ReactNode } from "react";

export function ImageCaption({
  children,
  caption,
}: {
  children: ReactNode;
  caption?: string;
}) {
  return (
    <figure>
      {children}
      {caption && (
        <figcaption className="mt-2 text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
