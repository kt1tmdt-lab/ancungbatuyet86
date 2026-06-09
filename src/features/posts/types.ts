import type { AuthPayload } from "@/lib/auth";

export type PostListFilters = {
  status?: string | null;
  categorySlug?: string | null;
  categoryId?: string | null;
  authorId?: string | null;
  search?: string | null;
  viewer?: AuthPayload | null;
};

export type PostPayload = Partial<{
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  coverImageUrl: string | null;
  categoryId: string | null;
  tags: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  status: string;
}>;
