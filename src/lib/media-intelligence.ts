export type IntelligenceSentiment = "positive" | "neutral" | "negative" | "mixed";
export type IntelligenceIntent = "awareness" | "consideration" | "purchase" | "complaint" | "support";
export type IntelligenceRisk = "low" | "medium" | "high";

export type MediaIntelligenceKeyword = {
  id: string;
  keyword: string;
  type: "brand" | "product" | "competitor" | "market";
  active: boolean;
};

export type MediaMention = {
  id: string;
  title: string;
  url: string;
  source: string;
  platform: string;
  snippet: string;
  content: string;
  keyword: string;
  topics: string[];
  sentiment: IntelligenceSentiment;
  intent: IntelligenceIntent;
  riskLevel: IntelligenceRisk;
  score: number;
  publishedAt: string | null;
  collectedAt: string;
};

export type MediaContentIdea = {
  id: string;
  title: string;
  objective: string;
  format: "article" | "video" | "carousel" | "faq";
  priority: IntelligenceRisk;
  recommendedAssets: string[];
};

export type MediaIntelligenceData = {
  keywords: MediaIntelligenceKeyword[];
  mentions: MediaMention[];
  ideas: MediaContentIdea[];
  updatedAt: string | null;
};

export const MEDIA_INTELLIGENCE_CONFIG_ID = "media_intelligence";

export const DEFAULT_MEDIA_KEYWORDS: MediaIntelligenceKeyword[] = [
  { id: "brand-acbt", keyword: "Ăn Cùng Bà Tuyết", type: "brand", active: true },
  { id: "brand-ba-tuyet", keyword: "Bà Tuyết đồ ăn vặt", type: "brand", active: true },
  { id: "product-chan-ga", keyword: "chân gà Bà Tuyết", type: "product", active: true },
  { id: "product-tam-cay", keyword: "tăm cay Bà Tuyết", type: "product", active: true },
  { id: "market-an-vat", keyword: "ăn vặt TikTok Shop", type: "market", active: true },
];

const POSITIVE_WORDS = [
  "ngon",
  "sạch",
  "uy tín",
  "thích",
  "mua lại",
  "đáng mua",
  "giòn",
  "xịn",
  "chất lượng",
  "giao nhanh",
  "đẹp",
];

const NEGATIVE_WORDS = [
  "bẩn",
  "đau bụng",
  "lừa",
  "giả",
  "kém",
  "hôi",
  "mốc",
  "hết hạn",
  "không giao",
  "chậm",
  "đắt",
  "nghi ngờ",
];

const TOPIC_RULES: Array<{ topic: string; words: string[] }> = [
  { topic: "hygiene", words: ["sạch", "bẩn", "vệ sinh", "an toàn", "đau bụng", "hết hạn"] },
  { topic: "certificate", words: ["giấy", "chứng nhận", "vsattp", "an toàn thực phẩm"] },
  { topic: "insurance", words: ["bảo hiểm", "pvi", "trách nhiệm"] },
  { topic: "factory", words: ["nhà máy", "xưởng", "sản xuất", "quy trình"] },
  { topic: "taste", words: ["ngon", "cay", "giòn", "vị", "ăn"] },
  { topic: "price", words: ["giá", "đắt", "rẻ", "combo", "khuyến mãi"] },
  { topic: "delivery", words: ["giao", "ship", "vận chuyển", "đóng gói"] },
  { topic: "brand_story", words: ["bà tuyết", "câu chuyện", "thương hiệu", "lịch sử"] },
  { topic: "achievement", words: ["cúp", "giải", "thành tích", "top"] },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function boolValue(value: unknown, fallback = true) {
  return typeof value === "boolean" ? value : fallback;
}

function stableId(prefix: string, value: string) {
  return `${prefix}-${Buffer.from(value).toString("base64url").slice(0, 24)}`;
}

export function analyzeMentionText(text: string) {
  const source = text.toLowerCase();
  const positiveHits = POSITIVE_WORDS.filter((word) => source.includes(word)).length;
  const negativeHits = NEGATIVE_WORDS.filter((word) => source.includes(word)).length;
  const topics = TOPIC_RULES.filter((rule) => rule.words.some((word) => source.includes(word))).map((rule) => rule.topic);

  let sentiment: IntelligenceSentiment = "neutral";
  if (positiveHits > 0 && negativeHits > 0) sentiment = "mixed";
  else if (positiveHits > negativeHits) sentiment = "positive";
  else if (negativeHits > positiveHits) sentiment = "negative";

  const intent: IntelligenceIntent = source.includes("mua") || source.includes("giá") || source.includes("shop")
    ? "purchase"
    : negativeHits > 0
      ? "complaint"
      : source.includes("hỏi") || source.includes("không biết")
        ? "consideration"
        : "awareness";

  const trustRiskTopics = ["hygiene", "certificate", "insurance"];
  const hasTrustRisk = topics.some((topic) => trustRiskTopics.includes(topic));
  const riskLevel: IntelligenceRisk =
    negativeHits >= 2 || (sentiment === "negative" && hasTrustRisk)
      ? "high"
      : negativeHits > 0 || hasTrustRisk
        ? "medium"
        : "low";

  const score = Math.max(0, Math.min(100, 55 + positiveHits * 12 - negativeHits * 18 + (sentiment === "mixed" ? -8 : 0)));

  return {
    topics: topics.length ? topics : ["general"],
    sentiment,
    intent,
    riskLevel,
    score,
  };
}

function normalizeKeywords(input: unknown): MediaIntelligenceKeyword[] {
  if (!Array.isArray(input)) return DEFAULT_MEDIA_KEYWORDS;

  const items = input
    .map((item) => {
      if (!isRecord(item)) return null;
      const keyword = stringValue(item.keyword);
      if (!keyword) return null;

      const type = ["brand", "product", "competitor", "market"].includes(String(item.type))
        ? (item.type as MediaIntelligenceKeyword["type"])
        : "brand";

      return {
        id: stringValue(item.id) || stableId("kw", keyword),
        keyword,
        type,
        active: boolValue(item.active),
      };
    })
    .filter((item): item is MediaIntelligenceKeyword => Boolean(item));

  return items.length ? items : DEFAULT_MEDIA_KEYWORDS;
}

function normalizeMention(input: unknown): MediaMention | null {
  if (!isRecord(input)) return null;
  const title = stringValue(input.title);
  const url = stringValue(input.url);
  if (!title || !url) return null;

  const text = [title, input.snippet, input.content].map(stringValue).join(" ");
  const analysis = analyzeMentionText(text);

  return {
    id: stringValue(input.id) || stableId("mention", url),
    title,
    url,
    source: stringValue(input.source) || "Unknown",
    platform: stringValue(input.platform) || "web",
    snippet: stringValue(input.snippet),
    content: stringValue(input.content),
    keyword: stringValue(input.keyword),
    topics: Array.isArray(input.topics) ? input.topics.map(stringValue).filter(Boolean) : analysis.topics,
    sentiment: ["positive", "neutral", "negative", "mixed"].includes(String(input.sentiment))
      ? (input.sentiment as IntelligenceSentiment)
      : analysis.sentiment,
    intent: ["awareness", "consideration", "purchase", "complaint", "support"].includes(String(input.intent))
      ? (input.intent as IntelligenceIntent)
      : analysis.intent,
    riskLevel: ["low", "medium", "high"].includes(String(input.riskLevel))
      ? (input.riskLevel as IntelligenceRisk)
      : analysis.riskLevel,
    score: Number(input.score) || analysis.score,
    publishedAt: stringValue(input.publishedAt) || null,
    collectedAt: stringValue(input.collectedAt) || new Date().toISOString(),
  };
}

function normalizeIdeas(input: unknown): MediaContentIdea[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((item) => {
      if (!isRecord(item)) return null;
      const title = stringValue(item.title);
      if (!title) return null;

      return {
        id: stringValue(item.id) || stableId("idea", title),
        title,
        objective: stringValue(item.objective),
        format: ["article", "video", "carousel", "faq"].includes(String(item.format))
          ? (item.format as MediaContentIdea["format"])
          : "article",
        priority: ["low", "medium", "high"].includes(String(item.priority))
          ? (item.priority as IntelligenceRisk)
          : "medium",
        recommendedAssets: Array.isArray(item.recommendedAssets)
          ? item.recommendedAssets.map(stringValue).filter(Boolean)
          : [],
      };
    })
    .filter((item): item is MediaContentIdea => Boolean(item));
}

export function normalizeMediaIntelligence(input: unknown): MediaIntelligenceData {
  const source = isRecord(input) ? input : {};

  return {
    keywords: normalizeKeywords(source.keywords),
    mentions: Array.isArray(source.mentions)
      ? source.mentions.map(normalizeMention).filter((item): item is MediaMention => Boolean(item)).slice(0, 500)
      : [],
    ideas: normalizeIdeas(source.ideas),
    updatedAt: stringValue(source.updatedAt) || null,
  };
}

export function buildMention(params: {
  title: string;
  url: string;
  source: string;
  platform: string;
  snippet?: string;
  content?: string;
  keyword?: string;
  publishedAt?: string | null;
}): MediaMention {
  const text = [params.title, params.snippet, params.content].filter(Boolean).join(" ");
  const analysis = analyzeMentionText(text);

  return {
    id: stableId("mention", params.url),
    title: params.title,
    url: params.url,
    source: params.source,
    platform: params.platform,
    snippet: params.snippet || "",
    content: params.content || "",
    keyword: params.keyword || "",
    ...analysis,
    publishedAt: params.publishedAt || null,
    collectedAt: new Date().toISOString(),
  };
}

export function buildContentIdeas(mentions: MediaMention[]): MediaContentIdea[] {
  const topicCount = mentions.reduce<Record<string, number>>((acc, mention) => {
    mention.topics.forEach((topic) => {
      acc[topic] = (acc[topic] || 0) + 1;
    });
    return acc;
  }, {});

  const ideas: MediaContentIdea[] = [];

  if ((topicCount.hygiene || 0) + (topicCount.certificate || 0) > 0) {
    ideas.push({
      id: "idea-food-safety-proof",
      title: "Bộ nội dung chứng minh an toàn thực phẩm",
      objective: "Giảm nghi ngờ về vệ sinh, nguồn gốc và giấy tờ sản phẩm.",
      format: "carousel",
      priority: "high",
      recommendedAssets: ["Giấy VSATTP", "Quy trình sản xuất", "Ảnh nhà máy"],
    });
  }

  if ((topicCount.insurance || 0) > 0) {
    ideas.push({
      id: "idea-pvi-responsibility",
      title: "Giải thích bảo hiểm PVI và trách nhiệm sản phẩm",
      objective: "Tăng cảm giác an tâm khi khách hàng mua đồ ăn vặt đóng gói.",
      format: "faq",
      priority: "medium",
      recommendedAssets: ["Bảo hiểm PVI", "Chính sách CSKH", "FAQ sản phẩm"],
    });
  }

  if ((topicCount.taste || 0) > 1) {
    ideas.push({
      id: "idea-product-reaction",
      title: "Chuỗi video reaction vị cay giòn của sản phẩm bán chạy",
      objective: "Biến các tín hiệu khen vị ngon thành nội dung bán hàng.",
      format: "video",
      priority: "medium",
      recommendedAssets: ["Feedback khách hàng", "Sản phẩm bán chạy", "TikTok Shop"],
    });
  }

  if ((topicCount.factory || 0) > 0) {
    ideas.push({
      id: "idea-factory-story",
      title: "Hậu trường quy trình sản xuất và đóng gói",
      objective: "Cho khách thấy quy trình thật, người thật và khu vực sản xuất thật.",
      format: "article",
      priority: "medium",
      recommendedAssets: ["Ảnh nhà máy", "Quy trình sản xuất", "Câu chuyện thương hiệu"],
    });
  }

  return ideas;
}

export function getIntelligenceSummary(mentions: MediaMention[]) {
  const total = mentions.length;
  const positive = mentions.filter((item) => item.sentiment === "positive").length;
  const neutral = mentions.filter((item) => item.sentiment === "neutral").length;
  const negative = mentions.filter((item) => item.sentiment === "negative").length;
  const mixed = mentions.filter((item) => item.sentiment === "mixed").length;
  const highRisk = mentions.filter((item) => item.riskLevel === "high").length;
  const mediumRisk = mentions.filter((item) => item.riskLevel === "medium").length;
  const avgScore = total ? Math.round(mentions.reduce((sum, item) => sum + item.score, 0) / total) : 0;

  const topicCount = mentions.reduce<Record<string, number>>((acc, mention) => {
    mention.topics.forEach((topic) => {
      acc[topic] = (acc[topic] || 0) + 1;
    });
    return acc;
  }, {});

  const topTopics = Object.entries(topicCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([topic, count]) => ({ topic, count }));

  const trustGap = (topicCount.hygiene || 0) + (topicCount.certificate || 0) + (topicCount.insurance || 0) + highRisk * 2;

  return {
    total,
    positive,
    neutral,
    negative,
    mixed,
    highRisk,
    mediumRisk,
    avgScore,
    trustGap,
    topTopics,
  };
}
