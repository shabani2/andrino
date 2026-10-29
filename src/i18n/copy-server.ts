import { getTranslations } from "next-intl/server";
import keys from "./source-keys.json";

export async function getCopy() {
  const t = await getTranslations("copy");
  return function copy(value: string): string {
    const key = (keys as Record<string, string>)[value.trim()];
    if (!key) return value;
    return value.match(/^\s*/)?.[0] + t(key) + value.match(/\s*$/)?.[0];
  };
}
