export function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <h2>{title}</h2>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
