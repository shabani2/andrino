"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { DropdownMenu } from "radix-ui";
import { CalendarDays, ChevronDown } from "lucide-react";

export type TimeFilterValue = "all" | "day" | "week" | "month" | "older";
const labels: Record<TimeFilterValue, { fr: string; en: string }> = {
  all: { fr: "Toutes les dates", en: "All dates" }, day: { fr: "Aujourd’hui", en: "Today" },
  week: { fr: "Cette semaine", en: "This week" }, month: { fr: "Ce mois", en: "This month" },
  older: { fr: "Plus de 30 jours", en: "Over 30 days" },
};

export function TimeFilter({ locale, value }: { locale: string; value: TimeFilterValue }) {
  const fr = locale === "fr";
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<TimeFilterValue>(value);
  const hrefFor = (next: TimeFilterValue) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    if (next === "all") params.delete("periode"); else params.set("periode", next);
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };
  return <DropdownMenu.Root><DropdownMenu.Trigger className="admin-time-filter" aria-label={fr ? "Filtrer par période" : "Filter by period"}>
    <CalendarDays size={16} aria-hidden="true" /> {labels[selected][fr ? "fr" : "en"]}<ChevronDown size={15} aria-hidden="true" />
  </DropdownMenu.Trigger><DropdownMenu.Portal><DropdownMenu.Content className="admin-time-filter-menu" align="end" sideOffset={7}>
    {(Object.keys(labels) as TimeFilterValue[]).map((item) => <DropdownMenu.Item key={item} asChild><Link href={hrefFor(item)} onClick={() => setSelected(item)} className={`admin-time-filter-item${item === selected ? " is-active" : ""}`}>{labels[item][fr ? "fr" : "en"]}</Link></DropdownMenu.Item>)}
  </DropdownMenu.Content></DropdownMenu.Portal></DropdownMenu.Root>;
}
