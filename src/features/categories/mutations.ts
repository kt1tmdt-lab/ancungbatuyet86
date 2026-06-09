import prisma from "@/lib/prisma";
import { normalizeSlug } from "@/lib/slug";
import type { CategoryPayload } from "./types";
import { categorySlugExists, getCategoryById } from "./queries";

function normalizeCategoryInput(input: CategoryPayload) {
  if (!input.name || !input.slug) {
    throw new Error("Name and Slug are required");
  }

  return {
    name: input.name,
    slug: normalizeSlug(input.slug),
    description: input.description || null,
  };
}

export async function createCategory(input: CategoryPayload) {
  const data = normalizeCategoryInput(input);

  if (await categorySlugExists(data.slug)) {
    throw new Error("Category slug already exists");
  }

  return prisma.category.create({ data });
}

export async function updateCategory(id: string, input: CategoryPayload) {
  const existing = await getCategoryById(id);
  if (!existing) {
    throw new Error("Category not found");
  }

  const data = normalizeCategoryInput(input);
  if (await categorySlugExists(data.slug, id)) {
    throw new Error("Category slug already exists");
  }

  return prisma.category.update({
    where: { id },
    data,
  });
}

export async function deleteCategory(id: string) {
  const existing = await getCategoryById(id);
  if (!existing) {
    throw new Error("Category not found");
  }

  await prisma.category.delete({ where: { id } });
}
