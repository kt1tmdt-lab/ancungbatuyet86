import prisma from "@/lib/prisma";
import { normalizeSlug } from "@/lib/slug";

export async function listCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id } });
}

export async function categorySlugExists(slug: string, exceptId?: string) {
  const normalizedSlug = normalizeSlug(slug);
  const category = await prisma.category.findFirst({
    where: {
      slug: normalizedSlug,
      ...(exceptId ? { NOT: { id: exceptId } } : {}),
    },
    select: { id: true },
  });

  return Boolean(category);
}
