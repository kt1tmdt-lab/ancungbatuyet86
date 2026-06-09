const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  for (const u of users) {
    console.log("Email:", u.email);
    console.log("Role:", u.role);
    console.log("Hash:", u.password);
    const ok = await bcrypt.compare("123456", u.password);
    console.log("Matches '123456'?:", ok);
    console.log("--------------------");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
