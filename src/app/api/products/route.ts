import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const category = searchParams.get("category");

    const where: any = {};
    if (featured === "true") {
      where.featured = true;
    }
    if (category) {
      where.category = category;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("GET Products Error:", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      message: error?.message || String(error), 
      stack: error?.stack 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      tagline,
      description,
      category,
      categoryLabel,
      price,
      priceRange,
      image,
      heroImage,
      featured,
      purchaseUrl,
      ingredients,
      specs,
      variants,
      stats,
      processSteps,
      story,
    } = body;

    if (!name || !slug || !category || !image) {
      return NextResponse.json({ error: "Name, slug, category, and image are required" }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        tagline: tagline || "",
        description: description || "",
        category,
        categoryLabel: categoryLabel || category,
        price: price || "0đ",
        priceRange: priceRange || price || null,
        image,
        heroImage: heroImage || null,
        featured: !!featured,
        purchaseUrl: purchaseUrl || "",
        ingredients: Array.isArray(ingredients) ? ingredients : [],
        specs: specs || null,
        variants: variants || null,
        stats: stats || null,
        processSteps: processSteps || null,
        story: story || "",
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST Product Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
