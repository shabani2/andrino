import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  type = "text",
  ...props
}: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full rounded-md border border-input bg-background px-3 text-base disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
