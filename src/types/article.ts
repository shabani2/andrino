export type Article = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  mediaUrl?: string | null;
  publishedAt?: string;
  category: string;
  coverImage: string;
  alt: string;
  tags: string[];
  status: "forthcoming" | "published";
};
