"use client";

import { useMemo } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Image as ImageIcon,
  FileText,
  Link as LinkIcon,
  Type,
} from "lucide-react";

interface SeoScorePanelProps {
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  seoTitle: string;
  seoDescription: string;
}

interface CheckResult {
  label: string;
  status: "good" | "warning" | "bad";
  detail: string;
  icon: React.ReactNode;
}

function CharCounter({
  label,
  value,
  min,
  max,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
}) {
  const len = value.length;
  const percent = Math.min(100, (len / max) * 100);
  const status = len === 0 ? "empty" : len < min ? "short" : len > max ? "long" : "good";

  const colorMap = {
    empty: { bar: "bg-slate-200", text: "text-slate-400", label: "Chưa nhập" },
    short: { bar: "bg-amber-400", text: "text-amber-600", label: "Quá ngắn" },
    long: { bar: "bg-red-400", text: "text-red-600", label: "Quá dài" },
    good: { bar: "bg-green-500", text: "text-green-600", label: "Tốt" },
  };

  const c = colorMap[status];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-600">{label}</span>
        <span className={`text-[10px] font-bold ${c.text}`}>
          {len}/{max} ký tự · {c.label}
        </span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${c.bar}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function SeoScorePanel({
  title,
  slug,
  excerpt,
  coverImageUrl,
  seoTitle,
  seoDescription,
}: SeoScorePanelProps) {
  const effectiveTitle = seoTitle || title;
  const effectiveDesc = seoDescription || excerpt;

  const checks = useMemo<CheckResult[]>(() => {
    const results: CheckResult[] = [];

    // SEO Title check
    const titleLen = effectiveTitle.length;
    if (titleLen === 0) {
      results.push({
        label: "SEO Title",
        status: "bad",
        detail: "Chưa có tiêu đề SEO",
        icon: <Type size={13} />,
      });
    } else if (titleLen < 30) {
      results.push({
        label: "SEO Title",
        status: "warning",
        detail: `Quá ngắn (${titleLen} ký tự). Nên từ 50-60.`,
        icon: <Type size={13} />,
      });
    } else if (titleLen > 70) {
      results.push({
        label: "SEO Title",
        status: "warning",
        detail: `Quá dài (${titleLen} ký tự). Google cắt khoảng 60.`,
        icon: <Type size={13} />,
      });
    } else {
      results.push({
        label: "SEO Title",
        status: "good",
        detail: `${titleLen} ký tự — độ dài tối ưu.`,
        icon: <Type size={13} />,
      });
    }

    // SEO Description check
    const descLen = effectiveDesc.length;
    if (descLen === 0) {
      results.push({
        label: "Meta Description",
        status: "bad",
        detail: "Chưa có mô tả SEO",
        icon: <FileText size={13} />,
      });
    } else if (descLen < 70) {
      results.push({
        label: "Meta Description",
        status: "warning",
        detail: `Quá ngắn (${descLen} ký tự). Nên từ 140-160.`,
        icon: <FileText size={13} />,
      });
    } else if (descLen > 170) {
      results.push({
        label: "Meta Description",
        status: "warning",
        detail: `Quá dài (${descLen} ký tự). Google cắt khoảng 160.`,
        icon: <FileText size={13} />,
      });
    } else {
      results.push({
        label: "Meta Description",
        status: "good",
        detail: `${descLen} ký tự — độ dài tối ưu.`,
        icon: <FileText size={13} />,
      });
    }

    // Slug check
    const slugValid = /^[a-z0-9-]+$/.test(slug);
    if (!slug) {
      results.push({
        label: "Slug URL",
        status: "bad",
        detail: "Chưa có slug",
        icon: <LinkIcon size={13} />,
      });
    } else if (!slugValid) {
      results.push({
        label: "Slug URL",
        status: "warning",
        detail: "Slug chứa ký tự không hợp lệ",
        icon: <LinkIcon size={13} />,
      });
    } else {
      results.push({
        label: "Slug URL",
        status: "good",
        detail: "Slug hợp lệ, thân thiện SEO",
        icon: <LinkIcon size={13} />,
      });
    }

    // Cover image check
    if (!coverImageUrl) {
      results.push({
        label: "Ảnh bìa",
        status: "warning",
        detail: "Chưa đặt ảnh bìa (ảnh hưởng OpenGraph)",
        icon: <ImageIcon size={13} />,
      });
    } else {
      results.push({
        label: "Ảnh bìa",
        status: "good",
        detail: "Đã có ảnh bìa cho bài viết",
        icon: <ImageIcon size={13} />,
      });
    }

    // Excerpt check
    if (!excerpt.trim()) {
      results.push({
        label: "Tóm tắt (Excerpt)",
        status: "warning",
        detail: "Chưa có tóm tắt bài viết",
        icon: <FileText size={13} />,
      });
    } else {
      results.push({
        label: "Tóm tắt (Excerpt)",
        status: "good",
        detail: "Đã có tóm tắt bài viết",
        icon: <FileText size={13} />,
      });
    }

    return results;
  }, [effectiveTitle, effectiveDesc, slug, coverImageUrl, excerpt]);

  const score = useMemo(() => {
    let s = 0;
    checks.forEach((c) => {
      if (c.status === "good") s += 20;
      else if (c.status === "warning") s += 10;
    });
    return Math.min(100, s);
  }, [checks]);

  const scoreColor =
    score >= 80 ? "text-green-600" : score >= 50 ? "text-amber-500" : "text-red-500";
  const scoreLabel =
    score >= 80 ? "Tốt" : score >= 50 ? "Trung bình" : "Cần cải thiện";
  const scoreBg =
    score >= 80 ? "bg-green-50 border-green-200" : score >= 50 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";

  const statusIcon = (status: "good" | "warning" | "bad") => {
    if (status === "good") return <CheckCircle2 size={14} className="text-green-500 shrink-0" />;
    if (status === "warning") return <AlertTriangle size={14} className="text-amber-500 shrink-0" />;
    return <XCircle size={14} className="text-red-500 shrink-0" />;
  };

  // Google Search Preview
  const previewTitle = effectiveTitle || "Tiêu đề bài viết sẽ hiển thị ở đây";
  const previewDesc = effectiveDesc || "Mô tả bài viết sẽ hiển thị ở dòng này trên trang kết quả tìm kiếm Google...";
  const previewUrl = slug ? `ancungbatuyet.vn/tin-tuc/${slug}` : "ancungbatuyet.vn/tin-tuc/...";

  return (
    <div className="bg-white border border-slate-100 p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-md font-bold text-slate-900 flex items-center gap-2">
          <Search size={16} className="text-orange-500" />
          Phân tích SEO
        </h2>
        <div className={`px-3 py-1 border font-black text-sm ${scoreBg} ${scoreColor}`}>
          {score}/100
        </div>
      </div>

      {/* Score Badge */}
      <div className={`flex items-center gap-3 px-4 py-3 border ${scoreBg}`}>
        <div className={`text-3xl font-black ${scoreColor}`}>{score}</div>
        <div>
          <p className={`text-sm font-bold ${scoreColor}`}>{scoreLabel}</p>
          <p className="text-[10px] text-slate-500 font-semibold">Điểm tối ưu hóa SEO tổng hợp</p>
        </div>
      </div>

      {/* Character Counters */}
      <div className="space-y-3">
        <CharCounter label="SEO Title" value={effectiveTitle} min={50} max={60} />
        <CharCounter label="Meta Description" value={effectiveDesc} min={140} max={160} />
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Danh sách kiểm tra</p>
        {checks.map((check, i) => (
          <div key={i} className="flex items-start gap-2.5 py-1.5">
            {statusIcon(check.status)}
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800">{check.label}</p>
              <p className="text-[10px] text-slate-500 leading-relaxed">{check.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Google Search Preview */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Preview Google Search</p>
        <div className="bg-white border border-slate-200 p-4 space-y-1">
          <p className="text-[11px] text-green-700 font-medium truncate">{previewUrl}</p>
          <p className="text-blue-700 text-sm font-semibold leading-snug line-clamp-1 hover:underline cursor-default">
            {previewTitle.length > 60 ? previewTitle.substring(0, 60) + "..." : previewTitle}
          </p>
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
            {previewDesc.length > 160 ? previewDesc.substring(0, 160) + "..." : previewDesc}
          </p>
        </div>
      </div>
    </div>
  );
}
