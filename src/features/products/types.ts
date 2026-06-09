import type { Prisma, ProductStatus } from "@prisma/client";

export type ProductListFilters = {
  featured?: boolean;
  category?: string | null;
  status?: ProductStatus | string | null;
};

export type ProductPayload = Partial<{
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  categoryLabel: string;
  price: string;
  priceRange: string | null;
  image: string;
  heroImage: string | null;
  featured: boolean;
  purchaseUrl: string;
  ingredients: string[];
  specs: Prisma.InputJsonValue | null;
  variants: Prisma.InputJsonValue | null;
  stats: Prisma.InputJsonValue | null;
  processSteps: Prisma.InputJsonValue | null;
  story: string;
  status: ProductStatus | string;
  sortOrder: number;
  shortDescription: string | null;
}>;
