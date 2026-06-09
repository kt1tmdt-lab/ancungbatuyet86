const { PrismaClient } = require("@prisma/client");
const { locations, onlineChannels } = require("../src/data/locations");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding sales channels...");

  await prisma.location.deleteMany({});

  for (const [index, channel] of onlineChannels.entries()) {
    await prisma.onlineChannel.upsert({
      where: { name: channel.name },
      update: {
        ...channel,
        isActive: true,
        sortOrder: index + 1,
      },
      create: {
        ...channel,
        isActive: true,
        sortOrder: index + 1,
      },
    });
  }

  await prisma.location.createMany({
    data: locations.map((location: any, index: number) => ({
      ...location,
      sortOrder: index + 1,
    })),
  });

  console.log(`Seeded ${onlineChannels.length} online channels.`);
  console.log(`Seeded ${locations.length} locations.`);
}

main()
  .catch((error) => {
    console.error("Sales channel seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
