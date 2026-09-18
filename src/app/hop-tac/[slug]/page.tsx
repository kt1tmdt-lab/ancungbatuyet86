import ConfigurableInfoPage from "@/components/pages/ConfigurableInfoPage";
import { getDefaultInfoPage } from "@/lib/default-info-pages";
import { normalizePartnershipConfig } from "@/lib/partnership-config";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PartnershipSubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fallback = getDefaultInfoPage(`/hop-tac/${slug}`);

  if (!fallback) notFound();

  let configuredFallback = fallback;

  if (fallback.routePath === "/hop-tac/dai-ly-nha-phan-phoi") {
    try {
      const storedConfig = await prisma.siteConfig.findUnique({
        where: { id: "partnership_page" },
      });
      const partnershipConfig = normalizePartnershipConfig(storedConfig?.data);
      configuredFallback = {
        ...fallback,
        blocks: fallback.blocks.map((block) =>
          block.type === "split" && block.id === "dealer-partner-split"
            ? {
                ...block,
                data: {
                  ...block.data,
                  imageUrl: partnershipConfig.dealerSectionImageUrl,
                },
              }
            : block.type === "hero"
            ? {
                ...block,
                data: {
                  ...block.data,
                  backgroundImage:
                    partnershipConfig.heroImages[0] || block.data.backgroundImage,
                  backgroundImages: partnershipConfig.heroImages,
                  backgroundImageInterval: partnershipConfig.heroInterval,
                  backgroundImageAutoRotate: partnershipConfig.heroAutoRotate,
                },
              }
            : block,
        ),
      };
    } catch (error) {
      console.error("Load distributor hero config error:", error);
    }
  }

  return <ConfigurableInfoPage fallback={configuredFallback} />;
}
