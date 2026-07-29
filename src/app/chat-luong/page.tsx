import QualityProofPage from "@/components/pages/QualityProofPage";
import prisma from "@/lib/prisma";
import { normalizeQualityConfig } from "@/lib/quality-config";

// Quality content is managed from Admin and should always be read at request time.
export const dynamic = "force-dynamic";

export default async function QualityPage() {
  const config = await prisma.siteConfig.findUnique({
    where: { id: "quality_page" },
  });

  return <QualityProofPage config={normalizeQualityConfig(config?.data)} />;
}
