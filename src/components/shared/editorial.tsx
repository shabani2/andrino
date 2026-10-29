import { useCopy } from "@/i18n/copy";
import type { ReactNode } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const c = useCopy();

  return <p className={cn("eyebrow", className)}>{c(children)}</p>;
}
export function EditorialImage({
  src,
  alt,
  className,
  priority = false,
  sizes = "(max-width: 767px) 100vw, 50vw",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const c = useCopy();

  return (
    <div className={cn("editorial-image", className)}>
      <Image
        src={src}
        alt={c(alt)}
        fill
        sizes={sizes}
        preload={priority}
        className="object-cover"
      />
    </div>
  );
}
export function ArrowLink({
  href,
  children,
  className,
  external = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const c = useCopy();

  return external ? (
    <a
      href={href}
      className={cn("text-link", className)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {c(children)}
      <ArrowUpRight size={17} aria-hidden="true" />
      <span className="sr-only"> {c("(opens in a new tab)")}</span>
    </a>
  ) : (
    <Link href={href} className={cn("text-link", className)}>
      {c(children)}
      <ArrowRight size={17} aria-hidden="true" />
    </Link>
  );
}
export function ActionLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "peach" | "outline" | "light";
}) {
  const c = useCopy();

  return (
    <Link href={href} className={"action-link action-" + variant}>
      {c(children)}
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}
export function SectionIntro({
  number,
  label,
  title,
  children,
  action,
}: {
  number?: string;
  label: string;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  const c = useCopy();

  return (
    <div className="section-intro">
      <div>
        <Eyebrow>
          {number && number + " / "}
          {c(label)}
        </Eyebrow>
        <h2>{c(title)}</h2>
      </div>
      {children && <p className="section-description">{c(children)}</p>}
      {action}
    </div>
  );
}
