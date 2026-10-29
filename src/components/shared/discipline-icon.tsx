import {
  BookOpen,
  Layers,
  Lightbulb,
  Megaphone,
  Podcast,
  Feather,
  Users,
} from "lucide-react";
const icons = {
  campaign: Megaphone,
  media: Podcast,
  writing: Feather,
  ideas: Lightbulb,
  community: Users,
  context: Layers,
  book: BookOpen,
};
export function DisciplineIcon({
  name,
  size = 26,
}: {
  name: string;
  size?: number;
}) {
  const Icon = icons[name as keyof typeof icons] || Feather;
  return <Icon size={size} strokeWidth={1.4} aria-hidden="true" />;
}
