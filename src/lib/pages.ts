import type { AuthRole } from "@/lib/auth";

export const PAGE_MANAGER_ROLES: AuthRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "EDITOR",
  "MARKETING",
];

const PAGE_BLOCK_TYPES = ["hero", "text", "features", "split", "products"] as const;

export type PageBlockType = (typeof PAGE_BLOCK_TYPES)[number];

export type PageBlock = {
  id: string;
  type: PageBlockType;
  data: Record<string, unknown>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function canManagePages(role?: AuthRole | string | null) {
  return Boolean(role && PAGE_MANAGER_ROLES.includes(role as AuthRole));
}

export function normalizePageSlug(value: unknown) {
  if (typeof value !== "string") return "";

  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizePageContent(input: unknown): PageBlock[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((block, index) => {
      if (!isRecord(block)) return null;
      if (!PAGE_BLOCK_TYPES.includes(block.type as PageBlockType)) return null;

      const type = block.type as PageBlockType;
      const id =
        typeof block.id === "string" && block.id.trim()
          ? block.id.trim()
          : `${type}-${Date.now()}-${index}`;

      return {
        id,
        type,
        data: isRecord(block.data) ? block.data : {},
      };
    })
    .filter((block): block is PageBlock => Boolean(block));
}
