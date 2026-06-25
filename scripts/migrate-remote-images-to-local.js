const { PrismaClient } = require("@prisma/client");
const fs = require("fs/promises");
const path = require("path");

const prisma = new PrismaClient();

const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");
const publicUrl = (process.env.UPLOAD_PUBLIC_URL || "/uploads").replace(/\/+$/, "");
const importedDir = "imported";
const downloaded = new Map();

function isRemoteUrl(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

function looksLikeImageUrl(value) {
  return /\.(avif|gif|jpe?g|png|webp)(\?|#|$)/i.test(value);
}

function extensionFromContentType(contentType) {
  if (!contentType) return null;
  if (contentType.includes("image/avif")) return "avif";
  if (contentType.includes("image/gif")) return "gif";
  if (contentType.includes("image/jpeg")) return "jpg";
  if (contentType.includes("image/png")) return "png";
  if (contentType.includes("image/webp")) return "webp";
  return null;
}

function extensionFromUrl(url) {
  const pathname = new URL(url).pathname;
  const ext = path.extname(pathname).replace(/^\./, "").toLowerCase();
  return ext || null;
}

function sanitizeFileBaseName(value) {
  const parsed = new URL(value);
  const base = path.basename(parsed.pathname, path.extname(parsed.pathname)) || "image";

  return (
    base
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "image"
  );
}

function buildPublicUrl(key) {
  return `${publicUrl}/${key.replace(/^\/+/, "")}`;
}

async function downloadImage(url) {
  if (!isRemoteUrl(url)) return url;
  if (downloaded.has(url)) return downloaded.get(url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Skip ${url}: HTTP ${response.status}`);
      downloaded.set(url, url);
      return url;
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/") && !looksLikeImageUrl(url)) {
      console.warn(`Skip ${url}: not an image`);
      downloaded.set(url, url);
      return url;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const ext = extensionFromContentType(contentType) || extensionFromUrl(url) || "jpg";
    const key = `${importedDir}/${Date.now()}-${sanitizeFileBaseName(url)}.${ext}`;
    const targetPath = path.join(uploadDir, key);

    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, buffer);

    const localUrl = buildPublicUrl(key);
    downloaded.set(url, localUrl);
    console.log(`Downloaded ${url} -> ${localUrl}`);
    return localUrl;
  } catch (error) {
    console.warn(`Skip ${url}: ${error.message}`);
    downloaded.set(url, url);
    return url;
  }
}

async function replaceRemoteImages(value) {
  if (Array.isArray(value)) {
    let changed = false;
    const next = [];

    for (const item of value) {
      const replaced = await replaceRemoteImages(item);
      next.push(replaced.value);
      changed = changed || replaced.changed;
    }

    return { value: next, changed };
  }

  if (value && typeof value === "object") {
    let changed = false;
    const next = {};

    for (const [key, item] of Object.entries(value)) {
      const replaced = await replaceRemoteImages(item);
      next[key] = replaced.value;
      changed = changed || replaced.changed;
    }

    return { value: next, changed };
  }

  if (isRemoteUrl(value) && looksLikeImageUrl(value)) {
    const localUrl = await downloadImage(value);
    return { value: localUrl, changed: localUrl !== value };
  }

  return { value, changed: false };
}

async function migrateMedia() {
  const items = await prisma.media.findMany({
    where: { url: { startsWith: "http" } },
  });

  for (const item of items) {
    const localUrl = await downloadImage(item.url);
    if (localUrl !== item.url) {
      await prisma.media.update({
        where: { id: item.id },
        data: { url: localUrl },
      });
    }
  }

  return items.length;
}

async function migratePosts() {
  const posts = await prisma.post.findMany({
    where: { coverImageUrl: { startsWith: "http" } },
    select: { id: true, coverImageUrl: true },
  });

  for (const post of posts) {
    const localUrl = await downloadImage(post.coverImageUrl);
    if (localUrl !== post.coverImageUrl) {
      await prisma.post.update({
        where: { id: post.id },
        data: { coverImageUrl: localUrl },
      });
    }
  }

  return posts.length;
}

async function migrateProducts() {
  const products = await prisma.product.findMany({
    select: { id: true, image: true, heroImage: true },
  });

  let checked = 0;
  for (const product of products) {
    const data = {};

    if (isRemoteUrl(product.image)) {
      checked++;
      const localUrl = await downloadImage(product.image);
      if (localUrl !== product.image) data.image = localUrl;
    }

    if (isRemoteUrl(product.heroImage)) {
      checked++;
      const localUrl = await downloadImage(product.heroImage);
      if (localUrl !== product.heroImage) data.heroImage = localUrl;
    }

    if (Object.keys(data).length) {
      await prisma.product.update({ where: { id: product.id }, data });
    }
  }

  return checked;
}

async function migratePages() {
  const pages = await prisma.page.findMany({
    select: { id: true, content: true },
  });

  let checked = 0;
  for (const page of pages) {
    const replaced = await replaceRemoteImages(page.content);
    if (replaced.changed) {
      checked++;
      await prisma.page.update({
        where: { id: page.id },
        data: { content: replaced.value },
      });
    }
  }

  return checked;
}

async function migrateSiteConfig() {
  const config = await prisma.siteConfig.findUnique({ where: { id: "global" } });
  if (!config) return 0;

  const replaced = await replaceRemoteImages(config.data);
  if (!replaced.changed) return 0;

  await prisma.siteConfig.update({
    where: { id: config.id },
    data: { data: replaced.value },
  });

  return 1;
}

async function main() {
  console.log(`Local upload dir: ${uploadDir}`);
  console.log(`Public URL base: ${publicUrl}`);

  const media = await migrateMedia();
  const posts = await migratePosts();
  const products = await migrateProducts();
  const pages = await migratePages();
  const siteConfig = await migrateSiteConfig();

  console.log("\nMigration finished.");
  console.log(`- Remote media records checked: ${media}`);
  console.log(`- Remote post images checked: ${posts}`);
  console.log(`- Remote product images checked: ${products}`);
  console.log(`- Page records updated: ${pages}`);
  console.log(`- Site config updated: ${siteConfig}`);
  console.log(`- Unique images downloaded: ${[...downloaded.values()].filter((url) => url.startsWith(publicUrl)).length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
