import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Separator({ className, ...props }: ComponentProps<"hr">) {
  return (
    <hr
      data-slot="separator"
      className={cn("my-6 border-0 border-t", className)}
      {...props}
    />
  );
}
