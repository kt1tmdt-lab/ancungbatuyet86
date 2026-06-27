const DEFAULT_UPLOAD_PUBLIC_URL = "/uploads";

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function trimLeadingSlash(value: string) {
  return value.replace(/^\/+/, "");
}

export function getUploadPublicUrl() {
  return trimTrailingSlash(process.env.UPLOAD_PUBLIC_URL || DEFAULT_UPLOAD_PUBLIC_URL);
}

export function getUploadPublicPath() {
  const publicUrl = getUploadPublicUrl();

  try {
    return trimTrailingSlash(new URL(publicUrl).pathname || DEFAULT_UPLOAD_PUBLIC_URL);
  } catch {
    return trimTrailingSlash(publicUrl.startsWith("/") ? publicUrl : `/${publicUrl}`);
  }
}

export function buildUploadPublicUrl(key: string) {
  return `${getUploadPublicUrl()}/${trimLeadingSlash(key)}`;
}

export function getUploadKeyFromUrl(url: string) {
  const publicPath = getUploadPublicPath();
  let pathname = url;

  try {
    pathname = new URL(url).pathname;
  } catch {
    pathname = url.startsWith("/") ? url : `/${url}`;
  }

  const normalizedPath = pathname.replace(/\/+/g, "/");
  if (normalizedPath === publicPath) return "";
  if (!normalizedPath.startsWith(`${publicPath}/`)) return null;

  return decodeURIComponent(normalizedPath.slice(publicPath.length).replace(/^\/+/, ""));
}

export function normalizeUploadPublicUrl(url: string) {
  const key = getUploadKeyFromUrl(url);
  if (key === null) return url;

  return buildUploadPublicUrl(key);
}
