import ConfigurableInfoPage from "@/components/pages/ConfigurableInfoPage";
import { getDefaultInfoPage } from "@/lib/default-info-pages";
import { notFound } from "next/navigation";

export default function SalesPointPage() {
  const fallback = getDefaultInfoPage("/diem-ban");

  if (!fallback) notFound();

  return <ConfigurableInfoPage fallback={fallback} />;
}
