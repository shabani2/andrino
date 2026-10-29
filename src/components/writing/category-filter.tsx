"use client";
import { useCopy } from "@/i18n/copy";

import { Button } from "@/components/ui/button";

export function CategoryFilter({
  categories,
  value,
  onChange,
}: {
  categories: string[];
  value: string;
  onChange: (category: string) => void;
}) {
  const c = useCopy();
  return (
    <div
      role="group"
      aria-label={c("Filter writing themes")}
      className="mb-6 flex flex-wrap gap-2"
    >
      {categories.map((category) => (
        <Button
          key={category}
          type="button"
          variant={value === category ? "default" : "outline"}
          aria-pressed={value === category}
          onClick={() => onChange(category)}
        >
          {c(category)}
        </Button>
      ))}
    </div>
  );
}
