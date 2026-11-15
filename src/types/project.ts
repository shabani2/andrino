export type Project = {
  id?: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  mediaUrl?: string | null;
  images: string[];
  image: string;
  alt: string;
  paragraphs: string[];
  status: string;
  tags: string[];
  url?: string;
  featured?: boolean;
};
