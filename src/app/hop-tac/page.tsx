import ConfigurableInfoPage from "@/components/pages/ConfigurableInfoPage";
import { getDefaultInfoPage } from "@/lib/default-info-pages";
import { notFound } from "next/navigation";

export default function PartnershipPage() {
  const fallback = getDefaultInfoPage("/hop-tac");

  if (!fallback) notFound();

  return <ConfigurableInfoPage fallback={fallback} />;
}
