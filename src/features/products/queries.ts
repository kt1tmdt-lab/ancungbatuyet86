import { ProductStatus, type Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import type { ProductListFilters } from "./types";

export function buildProductWhere(filters: ProductListFilters = {}) {
  const where: Prisma.ProductWhereInput = {};

  if (filters.featured) {
    where.featured = true;
  }

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.status && Object.values(ProductStatus).includes(filters.status as ProductStatus)) {
    where.status = filters.status as ProductStatus;
  }

  return where;
}

export async function listProducts(filters: ProductListFilters = {}) {
  return prisma.product.findMany({
    where: buildProductWhere(filters),
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "desc" }
    ],
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id } });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({ where: { slug } });
}

export async function productSlugExists(slug: string, exceptId?: string) {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      ...(exceptId ? { NOT: { id: exceptId } } : {}),
    },
    select: { id: true },
  });

  return Boolean(product);
}
