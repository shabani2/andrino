"use client";
import { useCopy } from "@/i18n/copy";

import { Button } from "@/components/ui/button";

export type PortfolioFiltersProps = {
  categories: string[];
  value: string;
  onChange: (category: string) => void;
};

export function PortfolioFilters({
  categories,
  value,
  onChange,
}: PortfolioFiltersProps) {
  const c = useCopy();
  return (
    <div
      role="group"
      aria-label={c("Filter portfolio")}
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
