import { ProductStatus, type Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { normalizeUploadPublicUrl } from "@/lib/upload-url";
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
  const products = await prisma.product.findMany({
    where: buildProductWhere(filters),
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "desc" }
    ],
  });

  return products.map(normalizeProductUrls);
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  return product ? normalizeProductUrls(product) : null;
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({ where: { slug } });
  return product ? normalizeProductUrls(product) : null;
}

function normalizeProductUrls<T extends { image: string; heroImage: string | null }>(product: T) {
  return {
    ...product,
    image: normalizeUploadPublicUrl(product.image),
    heroImage: product.heroImage ? normalizeUploadPublicUrl(product.heroImage) : product.heroImage,
  };
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
