import prisma from "@/lib/prisma";
import { normalizeSiteConfig } from "@/lib/site-config-defaults";

export async function getSiteConfig() {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { id: "global" },
    });

    return normalizeSiteConfig(config?.data);
  } catch (error) {
    console.error("Failed to load site config", error);
    return normalizeSiteConfig(null);
  }
}
