import QualityProofPage from "@/components/pages/QualityProofPage";
import { PageStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getDefaultInfoPage } from "@/lib/default-info-pages";
import { getSystemPageSeedContent } from "@/lib/system-page-seeds";
import { normalizePageContent } from "@/lib/pages";

export default async function QualityPage() {
  const cmsPage = await prisma.page.findUnique({
    where: { slug: "chat-luong" },
  });
  const fallback = getDefaultInfoPage("/chat-luong");
  const fallbackBlocks = fallback ? getSystemPageSeedContent(fallback) : [];
  const cmsBlocks =
    cmsPage?.status === PageStatus.PUBLISHED
      ? normalizePageContent(cmsPage.content)
      : [];

  return <QualityProofPage blocks={cmsBlocks.length ? cmsBlocks : fallbackBlocks} />;
}
