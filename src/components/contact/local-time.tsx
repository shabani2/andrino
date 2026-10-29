"use client";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useCopy } from "@/i18n/copy";
export function LocalTime() {
  const c = useCopy();
  const locale = useLocale();
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat(locale, {
          timeZone: "Africa/Lubumbashi",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [locale]);
  return (
    <small>
      {time ? c("Current time:") + " " + time + " CAT" : c("Central Africa Time · UTC+2")}
    </small>
  );
}
