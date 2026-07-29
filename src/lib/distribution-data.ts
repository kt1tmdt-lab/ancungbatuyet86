import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

export type DistributionPoint = [
  latitude: number,
  longitude: number,
  name: string,
  typeIndex: number,
];

export type DistributionData = {
  count: number;
  skipped: number;
  types: Array<{ name: string; count: number }>;
  points: DistributionPoint[];
};

export const DISTRIBUTION_PAGE_SIZE = 12;

let distributionDataPromise: Promise<DistributionData> | null = null;

export function loadDistributionData() {
  if (!distributionDataPromise) {
    const dataPath = path.join(process.cwd(), "public", "data", "distribution-points.json");
    distributionDataPromise = readFile(dataPath, "utf8")
      .then((content) => JSON.parse(content) as DistributionData)
      .catch((error) => {
        distributionDataPromise = null;
        throw error;
      });
  }

  return distributionDataPromise;
}
