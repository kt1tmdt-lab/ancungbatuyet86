import QualityProofPage from "@/components/pages/QualityProofPage";
import prisma from "@/lib/prisma";
import { normalizeQualityConfig } from "@/lib/quality-config";

export default async function QualityPage() {
  const config = await prisma.siteConfig.findUnique({
    where: { id: "quality_page" },
  });

  return <QualityProofPage config={normalizeQualityConfig(config?.data)} />;
}
