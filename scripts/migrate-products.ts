const { PrismaClient } = require("@prisma/client");
const { products, otherProducts } = require("../src/data/products");

const prisma = new PrismaClient();

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function main() {
  console.log("Migrating products to database...");

  // 1. Migrate main products
  for (const prod of products) {
    const purchaseUrl = prod.category === "chan-ga" 
      ? "https://shopee.vn/an-vat-ba-tuyet-chan-ga"
      : prod.category === "tam-cay"
      ? "https://shopee.vn/an-vat-ba-tuyet-tam-cay"
      : "https://shopee.vn/an-vat-ba-tuyet-banh-trang";

    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        tagline: prod.tagline,
        description: prod.description,
        category: prod.category,
        categoryLabel: prod.categoryLabel,
        price: prod.price,
        priceRange: prod.priceRange,
        image: prod.image,
        heroImage: prod.heroImage,
        featured: prod.featured,
        purchaseUrl: purchaseUrl,
        ingredients: prod.ingredients,
        specs: prod.specs,
        variants: prod.variants,
        stats: prod.stats,
        processSteps: prod.processSteps,
        story: prod.story || "",
      },
      create: {
        slug: prod.slug,
        name: prod.name,
        tagline: prod.tagline,
        description: prod.description,
        category: prod.category,
        categoryLabel: prod.categoryLabel,
        price: prod.price,
        priceRange: prod.priceRange,
        image: prod.image,
        heroImage: prod.heroImage,
        featured: prod.featured,
        purchaseUrl: purchaseUrl,
        ingredients: prod.ingredients,
        specs: prod.specs,
        variants: prod.variants,
        stats: prod.stats,
        processSteps: prod.processSteps,
        story: prod.story || "",
      },
    });
    console.log(`Migrated product: ${prod.name}`);
  }

  // 2. Migrate other products
  console.log("Migrating other products to database...");
  for (const prod of otherProducts) {
    const slug = generateSlug(prod.name);
    await prisma.product.upsert({
      where: { slug: slug },
      update: {
        name: prod.name,
        tagline: "Thơm ngon giòn rụm, ăn cùng Bà Tuyết.",
        description: "Sản phẩm ăn vặt thơm ngon nịnh miệng từ thương hiệu Ăn Cùng Bà Tuyết, chế biến sạch sẽ, đảm bảo vệ sinh an toàn thực phẩm.",
        category: "khac",
        categoryLabel: "Ăn Vặt Khác",
        price: prod.price,
        priceRange: prod.price,
        image: prod.image,
        heroImage: prod.image,
        featured: false,
        purchaseUrl: "https://shopee.vn/nmtvlog99",
        ingredients: [],
        specs: null,
        variants: null,
        stats: null,
        processSteps: null,
        story: "",
      },
      create: {
        slug: slug,
        name: prod.name,
        tagline: "Thơm ngon giòn rụm, ăn cùng Bà Tuyết.",
        description: "Sản phẩm ăn vặt thơm ngon nịnh miệng từ thương hiệu Ăn Cùng Bà Tuyết, chế biến sạch sẽ, đảm bảo vệ sinh an toàn thực phẩm.",
        category: "khac",
        categoryLabel: "Ăn Vặt Khác",
        price: prod.price,
        priceRange: prod.price,
        image: prod.image,
        heroImage: prod.image,
        featured: false,
        purchaseUrl: "https://shopee.vn/nmtvlog99",
        ingredients: [],
        specs: null,
        variants: null,
        stats: null,
        processSteps: null,
        story: "",
      },
    });
    console.log(`Migrated other product: ${prod.name}`);
  }

  console.log("Product migration completed successfully!");
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
