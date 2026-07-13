import ConfigurableInfoPage from "@/components/pages/ConfigurableInfoPage";
import { getDefaultInfoPage } from "@/lib/default-info-pages";
import { notFound } from "next/navigation";

export default async function IntroSubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fallback = getDefaultInfoPage(`/gioi-thieu/${slug}`);

  if (!fallback) notFound();

  return <ConfigurableInfoPage fallback={fallback} />;
}
