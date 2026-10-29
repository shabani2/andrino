export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  publishedAt?: string;
  category: string;
  coverImage: string;
  alt: string;
  tags: string[];
  status: "forthcoming" | "published";
};
