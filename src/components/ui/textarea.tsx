import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-base disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
