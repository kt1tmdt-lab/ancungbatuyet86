import { NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getAuthErrorStatus, requireRole } from "@/lib/authz";
import { getErrorMessage, jsonError, jsonOk } from "@/lib/api-response";
import {
  MEDIA_INTELLIGENCE_CONFIG_ID,
  buildContentIdeas,
  buildMention,
  getIntelligenceSummary,
  normalizeMediaIntelligence,
  type MediaMention,
} from "@/lib/media-intelligence";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR", "MARKETING"] as const;

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function stripHtml(value: string) {
  return decodeXml(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));
}

function extractTag(itemXml: string, tag: string) {
  const match = itemXml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXml(match[1]) : "";
}

function parseGoogleNewsRss(xml: string, keyword: string): MediaMention[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];

  return items.slice(0, 12).map((itemXml) => {
    const rawLink = extractTag(itemXml, "link");
    const source = extractTag(itemXml, "source") || "Google News";
    const title = stripHtml(extractTag(itemXml, "title"));
    const snippet = stripHtml(extractTag(itemXml, "description"));
    const publishedAt = extractTag(itemXml, "pubDate");

    return buildMention({
      title,
      url: rawLink || `https://news.google.com/search?q=${encodeURIComponent(keyword)}`,
      source,
      platform: "news",
      snippet,
      keyword,
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
    });
  });
}

async function crawlGoogleNews(keyword: string) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}&hl=vi&gl=VN&ceid=VN:vi`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "ACBT-Media-Intelligence/1.0",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Google News RSS failed for "${keyword}": ${res.status}`);
  }

  return parseGoogleNewsRss(await res.text(), keyword);
}

async function buildInternalContactMentions() {
  const contacts = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return contacts.map((contact) =>
    buildMention({
      title: `Liên hệ từ ${contact.name}`,
      url: `/admin/contacts#${contact.id}`,
      source: contact.source || "Website",
      platform: "internal",
      snippet: contact.content,
      content: [contact.phone, contact.email].filter(Boolean).join(" "),
      keyword: "contact",
      publishedAt: contact.createdAt.toISOString(),
    }),
  );
}

export async function POST(req: NextRequest) {
  try {
    requireRole(req, ALLOWED_ROLES as any);

    const config = await prisma.siteConfig.findUnique({
      where: { id: MEDIA_INTELLIGENCE_CONFIG_ID },
    });
    const current = normalizeMediaIntelligence(config?.data);
    const body = await req.json().catch(() => ({}));
    const includeInternal = body.includeInternal !== false;
    const activeKeywords = current.keywords.filter((item) => item.active).slice(0, 12);

    const crawlResults = await Promise.allSettled(
      activeKeywords.map((item) => crawlGoogleNews(item.keyword)),
    );

    const externalMentions = crawlResults.flatMap((result) =>
      result.status === "fulfilled" ? result.value : [],
    );
    const internalMentions = includeInternal ? await buildInternalContactMentions() : [];
    const mergedByUrl = new Map<string, MediaMention>();

    [...externalMentions, ...internalMentions, ...current.mentions].forEach((mention) => {
      if (!mergedByUrl.has(mention.url)) {
        mergedByUrl.set(mention.url, mention);
      }
    });

    const mentions = Array.from(mergedByUrl.values())
      .sort((a, b) => new Date(b.publishedAt || b.collectedAt).getTime() - new Date(a.publishedAt || a.collectedAt).getTime())
      .slice(0, 500);

    const nextData = normalizeMediaIntelligence({
      ...current,
      mentions,
      ideas: buildContentIdeas(mentions),
      updatedAt: new Date().toISOString(),
    });

    await prisma.siteConfig.upsert({
      where: { id: MEDIA_INTELLIGENCE_CONFIG_ID },
      update: { data: nextData as unknown as Prisma.InputJsonValue },
      create: {
        id: MEDIA_INTELLIGENCE_CONFIG_ID,
        data: nextData as unknown as Prisma.InputJsonValue,
      },
    });

    const failures = crawlResults
      .filter((result): result is PromiseRejectedResult => result.status === "rejected")
      .map((result) => getErrorMessage(result.reason));

    return jsonOk({
      data: nextData,
      summary: getIntelligenceSummary(nextData.mentions),
      crawled: externalMentions.length,
      internal: internalMentions.length,
      failures,
    });
  } catch (error) {
    const message = getErrorMessage(error);
    if (message === "Unauthorized" || message === "Forbidden") {
      return jsonError(message, getAuthErrorStatus(error));
    }

    console.error("POST Media Intelligence Crawl Error:", error);
    return jsonError("Internal Server Error", 500, message);
  }
}
