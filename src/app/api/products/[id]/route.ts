import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET Product ID Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check product existence
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // If slug changed, check uniqueness
    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.product.findUnique({ where: { slug } });
      if (slugExists) {
        return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existing.name,
        slug: slug !== undefined ? slug : existing.slug,
        tagline: tagline !== undefined ? tagline : existing.tagline,
        description: description !== undefined ? description : existing.description,
        category: category !== undefined ? category : existing.category,
        categoryLabel: categoryLabel !== undefined ? categoryLabel : existing.categoryLabel,
        price: price !== undefined ? price : existing.price,
        priceRange: priceRange !== undefined ? priceRange : existing.priceRange,
        image: image !== undefined ? image : existing.image,
        heroImage: heroImage !== undefined ? heroImage : existing.heroImage,
        featured: featured !== undefined ? !!featured : existing.featured,
        purchaseUrl: purchaseUrl !== undefined ? purchaseUrl : existing.purchaseUrl,
        ingredients: Array.isArray(ingredients) ? ingredients : existing.ingredients,
        specs: specs !== undefined ? specs : existing.specs,
        variants: variants !== undefined ? variants : existing.variants,
        stats: stats !== undefined ? stats : existing.stats,
        processSteps: processSteps !== undefined ? processSteps : existing.processSteps,
        story: story !== undefined ? story : existing.story,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT Product Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Product Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
