import "server-only";
import type { TimeFilterValue } from "@/components/admin/time-filter";

export function timeFilter(value: string | undefined): TimeFilterValue {
  return value === "day" || value === "week" || value === "month" || value === "older" ? value : "all";
}

function lagosMidnight() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts();
  const read = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  return new Date(Date.UTC(read("year"), read("month") - 1, read("day"), -1));
}

export function timeRange(value: TimeFilterValue) {
  if (value === "all") return {};
  if (value === "older") return { before: new Date(Date.now() - 30 * 86_400_000).toISOString() };
  const start = lagosMidnight();
  if (value === "week") start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7));
  if (value === "month") start.setUTCDate(1);
  return { after: start.toISOString() };
}
