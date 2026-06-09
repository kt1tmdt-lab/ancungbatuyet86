const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Checking User count...");
    const users = await prisma.user.count();
    console.log("Users:", users);

    console.log("Checking Product count...");
    const products = await prisma.product.count();
    console.log("Products:", products);

    console.log("Checking Media count...");
    const media = await prisma.media.count();
    console.log("Media:", media);

    console.log("Checking all Media records:");
    const allMedia = await prisma.media.findMany();
    console.log(allMedia);
  } catch (error) {
    console.error("Database check failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
