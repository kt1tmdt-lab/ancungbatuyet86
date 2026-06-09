import { Prisma, ProductStatus, type Product } from "@prisma/client";
import prisma from "@/lib/prisma";
import type { ProductPayload } from "./types";
import { getProductById, productSlugExists } from "./queries";

type ProductWriteData = {
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
  specs: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
  variants: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
  stats: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
  processSteps: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
  story: string;
  status: ProductStatus;
  sortOrder: number;
  shortDescription: string | null;
};

function toPrismaJson(value: unknown) {
  return value === undefined || value === null
    ? Prisma.JsonNull
    : (value as Prisma.InputJsonValue);
}

function normalizeProductStatus(value: unknown, fallback: ProductStatus = ProductStatus.PUBLISHED) {
  if (typeof value !== "string") return fallback;
  return Object.values(ProductStatus).includes(value as ProductStatus)
    ? (value as ProductStatus)
    : fallback;
}

function normalizeProductCreate(input: ProductPayload): ProductWriteData {
  if (!input.name || !input.slug || !input.category || !input.image) {
    throw new Error("Name, slug, category, and image are required");
  }

  return {
    name: input.name,
    slug: input.slug,
    tagline: input.tagline || "",
    description: input.description || "",
    category: input.category,
    categoryLabel: input.categoryLabel || input.category,
    price: input.price || "0Ä‘",
    priceRange: input.priceRange || input.price || null,
    image: input.image,
    heroImage: input.heroImage || null,
    featured: Boolean(input.featured),
    purchaseUrl: input.purchaseUrl || "",
    ingredients: Array.isArray(input.ingredients) ? input.ingredients : [],
    specs: toPrismaJson(input.specs),
    variants: toPrismaJson(input.variants),
    stats: toPrismaJson(input.stats),
    processSteps: toPrismaJson(input.processSteps),
    story: input.story || "",
    status: normalizeProductStatus(input.status),
    sortOrder: input.sortOrder !== undefined ? Number(input.sortOrder) : 0,
    shortDescription: input.shortDescription || null,
  };
}

function normalizeProductUpdate(input: ProductPayload, existing: Product): ProductWriteData {
  return {
    name: input.name ?? existing.name,
    slug: input.slug ?? existing.slug,
    tagline: input.tagline ?? existing.tagline,
    description: input.description ?? existing.description,
    category: input.category ?? existing.category,
    categoryLabel: input.categoryLabel ?? existing.categoryLabel,
    price: input.price ?? existing.price,
    priceRange: input.priceRange === undefined ? existing.priceRange : input.priceRange,
    image: input.image ?? existing.image,
    heroImage: input.heroImage === undefined ? existing.heroImage : input.heroImage,
    featured: input.featured === undefined ? existing.featured : Boolean(input.featured),
    purchaseUrl: input.purchaseUrl ?? existing.purchaseUrl,
    ingredients: Array.isArray(input.ingredients) ? input.ingredients : existing.ingredients,
    specs: toPrismaJson(input.specs === undefined ? existing.specs : input.specs),
    variants: toPrismaJson(input.variants === undefined ? existing.variants : input.variants),
    stats: toPrismaJson(input.stats === undefined ? existing.stats : input.stats),
    processSteps: toPrismaJson(input.processSteps === undefined ? existing.processSteps : input.processSteps),
    story: input.story ?? existing.story,
    status: normalizeProductStatus(input.status, existing.status),
    sortOrder: input.sortOrder !== undefined ? Number(input.sortOrder) : existing.sortOrder,
    shortDescription: input.shortDescription === undefined ? existing.shortDescription : input.shortDescription,
  };
}

export async function createProduct(input: ProductPayload) {
  const data = normalizeProductCreate(input);

  if (await productSlugExists(data.slug)) {
    throw new Error("Slug already exists");
  }

  return prisma.product.create({ data });
}

export async function updateProduct(id: string, input: ProductPayload) {
  const existing = await getProductById(id);
  if (!existing) {
    throw new Error("Product not found");
  }

  const data = normalizeProductUpdate(input, existing);
  if (data.slug !== existing.slug && (await productSlugExists(data.slug, id))) {
    throw new Error("Slug already exists");
  }

  return prisma.product.update({
    where: { id },
    data,
  });
}

export async function deleteProduct(id: string) {
  const existing = await getProductById(id);
  if (!existing) {
    throw new Error("Product not found");
  }

  await prisma.product.delete({ where: { id } });
}
