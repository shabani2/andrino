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
        <Eyebrow>{c("Write to me")}</Eyebrow>
        <h2>{c(title)}</h2>
        <p>
          {c("Write to me about an article, a project or an idea you want to discuss.")}</p>
      </div>
      <div className="collaboration-actions">
        <ActionLink href={href} variant="peach">
          {c(label)}
        </ActionLink>
        <ArrowLink href="/about">{c("About my work")}</ArrowLink>
      </div>
    </div>
  );
}
