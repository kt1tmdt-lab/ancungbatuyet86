import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export type PressMetadata = {
  sourceName: string;
  title: string;
  description: string;
  imageUrl: string;
  publishDate: string;
  link: string;
};

function isPublicAddress(address: string) {
  if (address.includes(":")) {
    const lower = address.toLowerCase();
    if (lower.startsWith("::ffff:")) return isPublicAddress(lower.slice(7));
    return /^[23][0-9a-f]*:/.test(lower) && !lower.startsWith("2001:db8:");
  }
  const parts = address.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  const [a, b] = parts;
  return a !== 0 && a !== 10 && a !== 127 && a < 224
    && !(a === 100 && b >= 64 && b <= 127)
    && !(a === 169 && b === 254)
    && !(a === 172 && b >= 16 && b <= 31)
    && !(a === 192 && (b === 0 || b === 168))
    && !(a === 198 && (b === 18 || b === 19));
}

export async function validatePressUrl(value: string) {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || !url.hostname) {
    throw new Error("Link bài báo phải là địa chỉ http hoặc https công khai.");
  }
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
    throw new Error("Link bài báo phải là địa chỉ công khai.");
  }
  const addresses = isIP(host) ? [{ address: host }] : await lookup(host, { all: true });
  if (!addresses.length || addresses.some(({ address }) => !isPublicAddress(address))) {
    throw new Error("Link bài báo phải là địa chỉ công khai.");
  }
  return url;
}

function decodeHtml(value: string) {
  return value
    .replace(/&#(x[0-9a-f]+|\d+);?/gi, (_, entity: string) => {
      const number = entity[0].toLowerCase() === "x" ? Number.parseInt(entity.slice(1), 16) : Number.parseInt(entity, 10);
      return Number.isFinite(number) && number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : "";
    })
    .replace(/&(?:amp|quot|apos|lt|gt|nbsp);/gi, (entity) => ({
      "&amp;": "&", "&quot;": '"', "&apos;": "'", "&lt;": "<", "&gt;": ">", "&nbsp;": " ",
    })[entity.toLowerCase()] || entity)
    .replace(/\s+/g, " ")
    .trim();
}

function metaAttributes(tag: string) {
  const attributes: Record<string, string> = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    attributes[match[1].toLowerCase()] = decodeHtml(match[2] ?? match[3] ?? match[4] ?? "");
  }
  return attributes;
}

function readMetadata(html: string, pageUrl: URL): PressMetadata {
  const meta = new Map<string, string>();
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    const attributes = metaAttributes(tag);
    const key = (attributes.property || attributes.name || attributes.itemprop || "").toLowerCase();
    if (key && attributes.content && !meta.has(key)) meta.set(key, attributes.content);
  }
  const get = (...keys: string[]) => keys.map((key) => meta.get(key)).find(Boolean) || "";
  const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "";
  const title = get("og:title", "twitter:title", "headline") || decodeHtml(titleTag.replace(/<[^>]*>/g, ""));
  const rawImage = get("og:image", "twitter:image", "twitter:image:src", "image");
  let imageUrl = "";
  if (rawImage) {
    try {
      const image = new URL(rawImage, pageUrl);
      if (["http:", "https:"].includes(image.protocol)) imageUrl = image.toString();
    } catch { /* Ignore malformed image URLs. */ }
  }
  const rawDate = get("article:published_time", "datepublished", "pubdate", "date");
  const date = rawDate ? new Date(rawDate) : null;

  return {
    sourceName: get("og:site_name", "application-name") || pageUrl.hostname.replace(/^www\./, ""),
    title: title.slice(0, 240),
    description: get("og:description", "description", "twitter:description").slice(0, 500),
    imageUrl,
    publishDate: date && !Number.isNaN(date.getTime()) ? date.toISOString().slice(0, 10) : "",
    link: pageUrl.toString(),
  };
}

export async function fetchPressMetadata(value: string) {
  let url = await validatePressUrl(value);
  const signal = AbortSignal.timeout(10_000);

  for (let redirect = 0; redirect < 4; redirect += 1) {
    const response = await fetch(url, {
      redirect: "manual",
      signal,
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8",
      },
      cache: "no-store",
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error("Trang báo chuyển hướng không hợp lệ.");
      url = await validatePressUrl(new URL(location, url).toString());
      continue;
    }
    if (!response.ok) throw new Error("Không đọc được thông tin từ trang báo.");
    if (!(response.headers.get("content-type") || "").toLowerCase().includes("text/html")) {
      throw new Error("Đường dẫn này không phải trang bài viết HTML.");
    }
    if (Number(response.headers.get("content-length") || 0) > 2_000_000) {
      throw new Error("Trang báo quá lớn để xem trước.");
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("Không đọc được nội dung trang báo.");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 2_000_000) {
        await reader.cancel();
        throw new Error("Trang báo quá lớn để xem trước.");
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return readMetadata(new TextDecoder().decode(bytes), url);
  }
  throw new Error("Trang báo chuyển hướng quá nhiều lần.");
}
