import ConfigurableInfoPage from "@/components/pages/ConfigurableInfoPage";
import { getDefaultInfoPage } from "@/lib/default-info-pages";
import { normalizePartnershipConfig } from "@/lib/partnership-config";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PartnershipPage() {
  const fallback = getDefaultInfoPage("/hop-tac");

  if (!fallback) notFound();

  let partnershipConfig = normalizePartnershipConfig(null);

  try {
    const storedConfig = await prisma.siteConfig.findUnique({
      where: { id: "partnership_page" },
    });
    partnershipConfig = normalizePartnershipConfig(storedConfig?.data);
  } catch (error) {
    console.error("Load partnership page config error:", error);
  }

  const configuredFallback = {
    ...fallback,
    title: partnershipConfig.title || fallback.title,
    blocks: fallback.blocks.map((block) =>
      block.type === "hero"
        ? {
            ...block,
            data: {
              ...block.data,
              label: partnershipConfig.label,
              title: partnershipConfig.title,
              subtitle: partnershipConfig.subtitle,
              backgroundImage: partnershipConfig.imageUrl,
              imageLabel: partnershipConfig.imageLabel,
              imageCaption: partnershipConfig.imageCaption,
              ctaText: partnershipConfig.ctaText || undefined,
              ctaLink: partnershipConfig.ctaLink || undefined,
            },
          }
        : block,
    ),
  };

  return <ConfigurableInfoPage fallback={configuredFallback} />;
}
