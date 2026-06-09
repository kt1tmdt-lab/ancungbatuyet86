import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const endpoint = process.env.R2_ENDPOINT_URL || "";
const accessKeyId = process.env.R2_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "";
const bucketName = process.env.R2_BUCKET_NAME || "";
const publicDomain = process.env.R2_PUBLIC_DOMAIN || "";

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function isR2Configured() {
  return Boolean(endpoint && accessKeyId && secretAccessKey && bucketName && publicDomain);
}

export function assertR2Configured() {
  if (!isR2Configured()) {
    throw new Error("Cloudflare R2 is not configured. Please set R2_ENDPOINT_URL, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_DOMAIN.");
  }
}

function getR2Client() {
  assertR2Configured();

  return new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export function buildR2PublicUrl(key: string) {
  assertR2Configured();
  return `${trimTrailingSlash(publicDomain)}/${key.replace(/^\/+/, "")}`;
}

export function isR2PublicUrl(url: string) {
  return Boolean(publicDomain && url.startsWith(trimTrailingSlash(publicDomain)));
}

export function getR2KeyFromPublicUrl(url: string) {
  if (!isR2PublicUrl(url)) return null;

  const base = trimTrailingSlash(publicDomain);
  return decodeURIComponent(url.slice(base.length).replace(/^\/+/, ""));
}

export async function uploadToR2(params: {
  key: string;
  body: Buffer;
  contentType: string;
}) {
  const client = getR2Client();

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return buildR2PublicUrl(params.key);
}

export async function deleteFromR2(key: string) {
  const client = getR2Client();

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    }),
  );
}
