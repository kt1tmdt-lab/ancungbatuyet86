import { redirect } from "next/navigation";

export default async function SalesPointSubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "he-thong-diem-ban-offline") redirect("/diem-ban#offline");
  if (slug === "kenh-online-chinh-thuc") redirect("/diem-ban#online");
  if (slug === "nhan-dien-hang-chinh-hang") redirect("/diem-ban#authentic");
  redirect("/diem-ban");
}
