import { useCopy } from "@/i18n/copy";
import { ArrowLink, Eyebrow, ActionLink } from "./editorial";
export function CallToAction({
  title,
  href,
  label,
}: {
  title: string;
  href: string;
  label: string;
}) {
  const c = useCopy();

  return (
    <div className="collaboration-panel">
      <div>
        <Eyebrow>{c("COLLABORATION & INQUIRY")}</Eyebrow>
        <h2>{c(title)}</h2>
        <p>
          {c("Whether you are an editor, communications professional, fellow storyteller or someone with an interesting idea, I welcome conversations that can lead to meaningful work.")}</p>
      </div>
      <div className="collaboration-actions">
        <ActionLink href={href} variant="peach">
          {c(label)}
        </ActionLink>
        <ArrowLink href="/about">{c("About my practice")}</ArrowLink>
      </div>
    </div>
  );
}
