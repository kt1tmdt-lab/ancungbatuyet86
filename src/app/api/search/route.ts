import { NextRequest, NextResponse } from "next/server";
import { PageStatus, ProductStatus } from "@prisma/client";
import prisma from "@/lib/prisma";

type SearchResult = {
  title: string;
  description: string;
  href: string;
  type: "page" | "product" | "post" | "location" | "channel";
};

const STATIC_RESULTS: SearchResult[] = [
  {
    title: "Trang chủ",
    description: "Tổng quan thương hiệu, sản phẩm nổi bật và thông tin chính.",
    href: "/",
    type: "page",
  },
  {
    title: "Sản phẩm",
    description: "Danh sách sản phẩm ăn vặt của Ăn Cùng Bà Tuyết.",
    href: "/san-pham",
    type: "page",
  },
  {
    title: "Quy trình",
    description: "Quy trình sản xuất, đóng gói và kiểm soát chất lượng.",
    href: "/quy-trinh",
    type: "page",
  },
  {
    title: "Hệ thống bán",
    description: "Các điểm bán và kênh phân phối chính thức.",
    href: "/he-thong-ban",
    type: "page",
  },
  {
    title: "Giới thiệu",
    description: "Câu chuyện thương hiệu Ăn Cùng Bà Tuyết.",
    href: "/gioi-thieu",
    type: "page",
  },
  {
    title: "Tin tức",
    description: "Bài viết, cập nhật và nội dung truyền thông.",
    href: "/tin-tuc",
    type: "page",
  },
  {
    title: "Liên hệ",
    description: "Thông tin liên hệ và form gửi yêu cầu.",
    href: "/lien-he",
    type: "page",
  },
];

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function matchesQuery(result: SearchResult, normalizedQuery: string) {
  return normalizeText(`${result.title} ${result.description}`).includes(normalizedQuery);
}

function describePageContent(content: unknown) {
  if (!Array.isArray(content)) return "";

  return content
    .flatMap((block) => {
      if (!block || typeof block !== "object" || !("data" in block)) return [];
      const data = (block as { data?: unknown }).data;
      if (!data || typeof data !== "object") return [];

      return Object.values(data as Record<string, unknown>).filter(
        (value): value is string => typeof value === "string",
      );
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("q")?.trim() || "";
    const normalizedQuery = normalizeText(query);

    if (normalizedQuery.length < 2) {
      return NextResponse.json({ query, results: [] });
    }

    const [products, posts, pages, locations, channels] = await Promise.all([
      prisma.product.findMany({
        where: {
          status: ProductStatus.PUBLISHED,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { tagline: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { categoryLabel: { contains: query, mode: "insensitive" } },
            { shortDescription: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          name: true,
          slug: true,
          tagline: true,
          shortDescription: true,
          categoryLabel: true,
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        take: 8,
      }),
      prisma.post.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { excerpt: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          title: true,
          slug: true,
          excerpt: true,
          category: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.page.findMany({
        where: {
          status: PageStatus.PUBLISHED,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          title: true,
          slug: true,
          content: true,
        },
        orderBy: { updatedAt: "desc" },
        take: 6,
      }),
      prisma.location.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { address: { contains: query, mode: "insensitive" } },
            { province: { contains: query, mode: "insensitive" } },
            { type: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          name: true,
          address: true,
          province: true,
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        take: 5,
      }),
      prisma.onlineChannel.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          name: true,
          description: true,
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        take: 5,
      }),
    ]);

    const staticResults = STATIC_RESULTS.filter((result) =>
      matchesQuery(result, normalizedQuery),
    );

    const results: SearchResult[] = [
      ...staticResults,
      ...products.map((product) => ({
        title: product.name,
        description:
          product.shortDescription ||
          product.tagline ||
          product.categoryLabel ||
          "Sản phẩm Ăn Cùng Bà Tuyết",
        href: `/san-pham/${product.slug}`,
        type: "product" as const,
      })),
      ...posts.map((post) => ({
        title: post.title,
        description: post.excerpt || post.category?.name || "Bài viết tin tức",
        href: `/tin-tuc/${post.slug}`,
        type: "post" as const,
      })),
      ...pages.map((page) => ({
        title: page.title,
        description: describePageContent(page.content) || "Trang nội dung",
        href: `/trang/${page.slug}`,
        type: "page" as const,
      })),
      ...locations.map((location) => ({
        title: location.name,
        description: `${location.address}, ${location.province}`,
        href: "/he-thong-ban",
        type: "location" as const,
      })),
      ...channels.map((channel) => ({
        title: channel.name,
        description: channel.description,
        href: "/he-thong-ban",
        type: "channel" as const,
      })),
    ].slice(0, 24);

    return NextResponse.json({ query, results });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
