import { useTranslations } from "next-intl";
import keys from "./source-keys.json";

// Source text remains readable in components; stable IDs live in the catalogs.
// Preserve non-string React children, numbers and user-entered form values.
export function useCopy() {
  const t = useTranslations("copy");
  return function copy<T>(value: T): T {
    if (typeof value !== "string") return value;
    const key = (keys as Record<string, string>)[value.trim()];
    if (!key) return value;
    const translated = t(key);
    return (value.match(/^\s*/)?.[0] + translated + value.match(/\s*$/)?.[0]) as T;
  };
}
