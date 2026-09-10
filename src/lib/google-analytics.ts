import jwt from "jsonwebtoken";

const ANALYTICS_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const DATA_API_URL = "https://analyticsdata.googleapis.com/v1beta";

type MetricValue = { value?: string };
type DimensionValue = { value?: string };

type ReportRow = {
  dimensionValues?: DimensionValue[];
  metricValues?: MetricValue[];
};

type RunReportResponse = {
  rows?: ReportRow[];
};

type AnalyticsCredentials = {
  propertyId: string;
  clientEmail: string;
  privateKey: string;
};

export type GoogleAnalyticsReport = {
  propertyId: string;
  measurementId: string;
  days: number;
  totals: {
    activeUsers: number;
    newUsers: number;
    sessions: number;
    views: number;
    engagementRate: number;
    engagementSecondsPerSession: number;
  };
  daily: Array<{
    date: string;
    activeUsers: number;
    sessions: number;
    views: number;
  }>;
  topPages: Array<{
    path: string;
    title: string;
    views: number;
    activeUsers: number;
  }>;
  sources: Array<{
    source: string;
    medium: string;
    sessions: number;
    activeUsers: number;
  }>;
};

export function getGoogleAnalyticsConfiguration() {
  const propertyId =
    process.env.GOOGLE_ANALYTICS_PROPERTY_ID?.trim() || "553496232";
  const clientEmail = process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL?.trim() || "";
  const privateKey = process.env.GOOGLE_ANALYTICS_PRIVATE_KEY?.replace(/\\n/g, "\n").trim() || "";
  const missing: string[] = [];

  if (!propertyId) missing.push("GOOGLE_ANALYTICS_PROPERTY_ID");
  if (!clientEmail) missing.push("GOOGLE_ANALYTICS_CLIENT_EMAIL");
  if (!privateKey) missing.push("GOOGLE_ANALYTICS_PRIVATE_KEY");

  return {
    configured: missing.length === 0,
    missing,
    credentials: { propertyId, clientEmail, privateKey },
  };
}

async function getAccessToken(credentials: AnalyticsCredentials) {
  const assertion = jwt.sign(
    {
      scope: ANALYTICS_SCOPE,
      aud: TOKEN_URL,
    },
    credentials.privateKey,
    {
      algorithm: "RS256",
      issuer: credentials.clientEmail,
      expiresIn: "1h",
    },
  );

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });
  const payload = (await response.json()) as {
    access_token?: string;
    error_description?: string;
  };

  if (!response.ok || !payload.access_token) {
    throw new Error(payload.error_description || "Không thể xác thực với Google.");
  }

  return payload.access_token;
}

async function runReport(
  propertyId: string,
  accessToken: string,
  body: Record<string, unknown>,
) {
  const response = await fetch(
    `${DATA_API_URL}/properties/${encodeURIComponent(propertyId)}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );
  const payload = (await response.json()) as RunReportResponse & {
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(payload.error?.message || "Google Analytics không trả về báo cáo.");
  }

  return payload;
}

function metric(row: ReportRow | undefined, index: number) {
  const value = Number(row?.metricValues?.[index]?.value || 0);
  return Number.isFinite(value) ? value : 0;
}

function dimension(row: ReportRow, index: number, fallback = "") {
  return row.dimensionValues?.[index]?.value || fallback;
}

export async function getGoogleAnalyticsReport(
  credentials: AnalyticsCredentials,
  days: number,
): Promise<GoogleAnalyticsReport> {
  const accessToken = await getAccessToken(credentials);
  const dateRanges = [{ startDate: `${days - 1}daysAgo`, endDate: "today" }];

  const [totalsReport, dailyReport, pagesReport, sourcesReport] = await Promise.all([
    runReport(credentials.propertyId, accessToken, {
      dateRanges,
      metrics: [
        { name: "activeUsers" },
        { name: "newUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "engagementRate" },
        { name: "userEngagementDuration" },
      ],
    }),
    runReport(credentials.propertyId, accessToken, {
      dateRanges,
      dimensions: [{ name: "date" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
      ],
      orderBys: [{ dimension: { dimensionName: "date" } }],
      limit: "100",
    }),
    runReport(credentials.propertyId, accessToken, {
      dateRanges,
      dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
      metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: "10",
    }),
    runReport(credentials.propertyId, accessToken, {
      dateRanges,
      dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }],
      metrics: [{ name: "sessions" }, { name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: "10",
    }),
  ]);

  const totalsRow = totalsReport.rows?.[0];
  const sessions = metric(totalsRow, 2);
  const engagementDuration = metric(totalsRow, 5);

  return {
    propertyId: credentials.propertyId,
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-T551F0HFS0",
    days,
    totals: {
      activeUsers: metric(totalsRow, 0),
      newUsers: metric(totalsRow, 1),
      sessions,
      views: metric(totalsRow, 3),
      engagementRate: metric(totalsRow, 4),
      engagementSecondsPerSession: sessions > 0 ? engagementDuration / sessions : 0,
    },
    daily: (dailyReport.rows || []).map((row) => ({
      date: dimension(row, 0),
      activeUsers: metric(row, 0),
      sessions: metric(row, 1),
      views: metric(row, 2),
    })),
    topPages: (pagesReport.rows || []).map((row) => ({
      path: dimension(row, 0, "/"),
      title: dimension(row, 1, "Không có tiêu đề"),
      views: metric(row, 0),
      activeUsers: metric(row, 1),
    })),
    sources: (sourcesReport.rows || []).map((row) => ({
      source: dimension(row, 0, "(direct)"),
      medium: dimension(row, 1, "(none)"),
      sessions: metric(row, 0),
      activeUsers: metric(row, 1),
    })),
  };
}
