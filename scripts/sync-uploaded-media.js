const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  try {
    // 1. Get the admin user to associate the files with
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!admin) {
      console.error("No ADMIN user found in database. Please run seed script first.");
      return;
    }

    console.log(`Associating media with ADMIN user: ${admin.email} (ID: ${admin.id})`);

    // 2. Scan public/uploads directory
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      console.log("No uploads directory found. Nothing to sync.");
      return;
    }

    const files = fs.readdirSync(uploadDir);
    console.log(`Found ${files.length} physical files in public/uploads.`);

    let syncedCount = 0;
    let skippedCount = 0;

    for (const file of files) {
      // Ignore hidden or temp files
      if (file.startsWith(".")) continue;

      const fileUrl = `/uploads/${file}`;
      const filePath = path.join(uploadDir, file);
      const stats = fs.statSync(filePath);

      // Check if this file is already in the Media database table
      const existingMedia = await prisma.media.findUnique({
        where: { url: fileUrl },
      });

      if (!existingMedia) {
        // Determine mimeType roughly based on extension
        let mimeType = "image/png";
        if (file.endsWith(".jpg") || file.endsWith(".jpeg")) {
          mimeType = "image/jpeg";
        } else if (file.endsWith(".gif")) {
          mimeType = "image/gif";
        } else if (file.endsWith(".webp")) {
          mimeType = "image/webp";
        }

        // Clean file name (remove timestamp prefix for display)
        const nameWithoutTimestamp = file.replace(/^\d+-/, "");

        await prisma.media.create({
          data: {
            fileName: nameWithoutTimestamp,
            url: fileUrl,
            size: stats.size,
            mimeType: mimeType,
            uploaderId: admin.id,
          },
        });
        console.log(`+ Registered media record for file: ${file}`);
        syncedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log(`\nSynchronization finished.`);
    console.log(`- Synced: ${syncedCount} new records`);
    console.log(`- Skipped: ${skippedCount} already existing records`);
  } catch (error) {
    console.error("Error during synchronization:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
