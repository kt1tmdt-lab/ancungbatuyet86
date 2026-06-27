import { mkdir, unlink, writeFile } from "fs/promises";
import { dirname, extname, join, relative, resolve, sep } from "path";

const uploadDir = resolve(process.env.UPLOAD_DIR || join("public", "uploads"));
const publicUrl = (process.env.UPLOAD_PUBLIC_URL || "/uploads").replace(/\/+$/, "");

function trimLeadingSlash(value: string) {
  return value.replace(/^\/+/, "");
}

function isInsideDir(baseDir: string, targetPath: string) {
  const rel = relative(baseDir, targetPath);
  return rel && !rel.startsWith("..") && !rel.includes(`..${sep}`);
}

export function getUploadDir() {
  return uploadDir;
}

export function buildLocalPublicUrl(key: string) {
  return `${publicUrl}/${trimLeadingSlash(key)}`;
}

export function isLocalPublicUrl(url: string) {
  if (publicUrl.startsWith("http")) {
    return url.startsWith(`${publicUrl}/`);
  }

  return url.startsWith(`${publicUrl}/`);
}

export function getLocalKeyFromPublicUrl(url: string) {
  if (!isLocalPublicUrl(url)) return null;

  return decodeURIComponent(url.slice(publicUrl.length).replace(/^\/+/, ""));
}

export function getLocalPathFromPublicUrl(url: string) {
  const key = getLocalKeyFromPublicUrl(url);
  if (!key) return null;

  const targetPath = resolve(uploadDir, key);
  if (!isInsideDir(uploadDir, targetPath)) return null;

  return targetPath;
}

export function sanitizeFileBaseName(fileName: string) {
  const withoutExt = fileName.replace(extname(fileName), "") || "image";

  return (
    withoutExt
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\u0111\u0110]/g, "d")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "image"
  );
}

export async function saveLocalUpload(params: {
  key: string;
  body: Buffer;
}) {
  const targetPath = resolve(uploadDir, params.key);
  if (!isInsideDir(uploadDir, targetPath)) {
    throw new Error("Invalid upload path");
  }

  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, params.body);

  return buildLocalPublicUrl(params.key);
}

export async function deleteLocalUploadByUrl(url: string) {
  const targetPath = getLocalPathFromPublicUrl(url);
  if (!targetPath) return false;

  await unlink(targetPath);
  return true;
}
