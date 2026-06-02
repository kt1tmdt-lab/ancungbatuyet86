"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function LegacyPendingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/posts/review");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
      <Loader className="animate-spin text-orange-500" size={32} />
      <p className="text-sm font-semibold text-slate-500">Đang chuyển hướng sang trang duyệt bài mới...</p>
    </div>
  );
}
