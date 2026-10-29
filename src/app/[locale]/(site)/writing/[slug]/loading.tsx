import { useCopy } from "@/i18n/copy";

export default function Loading() {
  const c = useCopy();
  return (
    <p
      role="status"
      className="editorial-container py-20 text-muted-foreground"
    >
      {c("Opening the journal…")}
    </p>
  );
}
