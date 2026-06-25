"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Download,
  Eye,
  FileText,
  Lightbulb,
  Loader,
  Plus,
  Radar,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type {
  MediaContentIdea,
  MediaIntelligenceData,
  MediaIntelligenceKeyword,
  MediaMention,
} from "@/lib/media-intelligence";

type IntelligenceSummary = {
  total: number;
  positive: number;
  neutral: number;
  negative: number;
  mixed: number;
  highRisk: number;
  mediumRisk: number;
  avgScore: number;
  trustGap: number;
  topTopics: Array<{ topic: string; count: number }>;
};

const EMPTY_DATA: MediaIntelligenceData = {
  keywords: [],
  mentions: [],
  ideas: [],
  updatedAt: null,
};

const EMPTY_SUMMARY: IntelligenceSummary = {
  total: 0,
  positive: 0,
  neutral: 0,
  negative: 0,
  mixed: 0,
  highRisk: 0,
  mediumRisk: 0,
  avgScore: 0,
  trustGap: 0,
  topTopics: [],
};

const topicLabels: Record<string, string> = {
  hygiene: "Vệ sinh",
  certificate: "Giấy tờ",
  insurance: "Bảo hiểm",
  factory: "Nhà máy",
  taste: "Hương vị",
  price: "Giá",
  delivery: "Giao hàng",
  brand_story: "Câu chuyện",
  achievement: "Thành tích",
  general: "Chung",
};

const riskClasses = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-100",
  medium: "bg-amber-50 text-amber-700 border-amber-100",
  high: "bg-red-50 text-red-700 border-red-100",
};

const sentimentClasses = {
  positive: "bg-emerald-50 text-emerald-700",
  neutral: "bg-slate-100 text-slate-700",
  negative: "bg-red-50 text-red-700",
  mixed: "bg-amber-50 text-amber-700",
};

function percent(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function safeDate(value: string | null) {
  if (!value) return "Chưa rõ";
  return new Date(value).toLocaleDateString("vi-VN");
}

function StatCard({
  title,
  value,
  helper,
  icon,
}: {
  title: string;
  value: string | number;
  helper: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center bg-orange-50 text-orange-600">
          {icon}
        </div>
      </div>
      <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">{helper}</p>
    </div>
  );
}

function MentionRow({ mention }: { mention: MediaMention }) {
  return (
    <a
      href={mention.url}
      target={mention.url.startsWith("http") ? "_blank" : undefined}
      rel={mention.url.startsWith("http") ? "noopener noreferrer" : undefined}
      className="grid gap-4 border-b border-slate-100 bg-white p-4 transition hover:bg-orange-50/50 lg:grid-cols-[1fr_140px_120px_120px]"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-slate-950 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white">
            {mention.platform}
          </span>
          <span className="text-xs font-bold text-slate-500">{mention.source}</span>
          <span className="text-xs font-bold text-slate-400">{safeDate(mention.publishedAt)}</span>
        </div>
        <h3 className="mt-2 line-clamp-2 text-sm font-black leading-6 text-slate-950">
          {mention.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-slate-500">
          {mention.snippet || mention.content || "Không có mô tả ngắn."}
        </p>
      </div>
      <div className="flex flex-wrap items-start gap-1.5">
        {mention.topics.slice(0, 3).map((topic) => (
          <span key={topic} className="border border-orange-100 bg-orange-50 px-2 py-1 text-[10px] font-black uppercase text-orange-700">
            {topicLabels[topic] || topic}
          </span>
        ))}
      </div>
      <div>
        <span className={`inline-flex px-2 py-1 text-xs font-black uppercase ${sentimentClasses[mention.sentiment]}`}>
          {mention.sentiment}
        </span>
      </div>
      <div>
        <span className={`inline-flex border px-2 py-1 text-xs font-black uppercase ${riskClasses[mention.riskLevel]}`}>
          {mention.riskLevel}
        </span>
      </div>
    </a>
  );
}

export default function MediaIntelligencePage() {
  const { token } = useAuth();
  const [data, setData] = useState<MediaIntelligenceData>(EMPTY_DATA);
  const [summary, setSummary] = useState<IntelligenceSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [crawling, setCrawling] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [newKeywordType, setNewKeywordType] = useState<MediaIntelligenceKeyword["type"]>("brand");
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");

  const headers = useMemo<Record<string, string>>(
    () => {
      if (!token) return {} as Record<string, string>;
      return { Authorization: `Bearer ${token}` };
    },
    [token],
  );

  const fetchDashboard = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media-intelligence", { headers });
      if (!res.ok) throw new Error("Không thể tải radar truyền thông");
      const payload = await res.json();
      setData(payload.data || EMPTY_DATA);
      setSummary(payload.summary || EMPTY_SUMMARY);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải Radar Thương Hiệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [token]);

  const saveKeywords = async (keywords: MediaIntelligenceKeyword[]) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/media-intelligence", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify({ keywords }),
      });
      if (!res.ok) throw new Error("Save failed");
      const payload = await res.json();
      setData(payload.data);
      setSummary(payload.summary);
      toast.success("Đã lưu từ khóa theo dõi");
    } catch (error) {
      console.error(error);
      toast.error("Lưu từ khóa thất bại");
    } finally {
      setSaving(false);
    }
  };

  const addKeyword = () => {
    const keyword = newKeyword.trim();
    if (!keyword) return;
    const next = [
      ...data.keywords,
      {
        id: `kw-${Date.now()}`,
        keyword,
        type: newKeywordType,
        active: true,
      },
    ];
    setNewKeyword("");
    saveKeywords(next);
  };

  const toggleKeyword = (id: string) => {
    saveKeywords(data.keywords.map((item) => (item.id === id ? { ...item, active: !item.active } : item)));
  };

  const removeKeyword = (id: string) => {
    saveKeywords(data.keywords.filter((item) => item.id !== id));
  };

  const crawl = async () => {
    setCrawling(true);
    try {
      const res = await fetch("/api/admin/media-intelligence/crawl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify({ includeInternal: true }),
      });
      if (!res.ok) throw new Error("Crawl failed");
      const payload = await res.json();
      setData(payload.data);
      setSummary(payload.summary);
      toast.success(`Đã quét ${payload.crawled || 0} kết quả công khai và ${payload.internal || 0} tín hiệu nội bộ`);
      if (payload.failures?.length) {
        toast.error(`Có ${payload.failures.length} nguồn không lấy được`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Quét dữ liệu thất bại");
    } finally {
      setCrawling(false);
    }
  };

  const exportCsv = async () => {
    try {
      const res = await fetch("/api/admin/media-intelligence/export", { headers });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `media-intelligence-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("Xuất file thất bại");
    }
  };

  const filteredMentions = data.mentions.filter((mention) => {
    const text = `${mention.title} ${mention.snippet} ${mention.source} ${mention.keyword}`.toLowerCase();
    const matchesSearch = !search || text.includes(search.toLowerCase());
    const matchesRisk = riskFilter === "all" || mention.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const sentimentTotal = summary.positive + summary.neutral + summary.negative + summary.mixed;

  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "EDITOR", "MARKETING"]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 bg-orange-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-orange-700">
              <Radar size={15} />
              Radar Thương Hiệu
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Phân tích truyền thông & niềm tin thương hiệu
            </h1>
            <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-500">
              Quét dữ liệu công khai, tín hiệu khách hàng nội bộ, phân loại cảm xúc, rủi ro và gợi ý nội dung cần làm tiếp.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="adminSecondary" onClick={fetchDashboard} disabled={loading} leftIcon={<RefreshCw size={16} />}>
              Tải lại
            </Button>
            <Button variant="adminSecondary" onClick={exportCsv} leftIcon={<Download size={16} />}>
              Xuất CSV
            </Button>
            <Button variant="admin" onClick={crawl} loading={crawling} leftIcon={<Radar size={16} />}>
              Quét dữ liệu
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex h-80 items-center justify-center border border-slate-100 bg-white">
            <Loader className="animate-spin text-orange-500" size={28} />
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Brand mentions"
                value={summary.total}
                helper="Tổng tín hiệu đang lưu trong radar."
                icon={<Eye size={22} />}
              />
              <StatCard
                title="Brand score"
                value={`${summary.avgScore}/100`}
                helper="Điểm cảm xúc trung bình từ các mention."
                icon={<TrendingUp size={22} />}
              />
              <StatCard
                title="Trust gap"
                value={summary.trustGap}
                helper="Nỗi lo về vệ sinh, giấy tờ, bảo hiểm và rủi ro."
                icon={<ShieldCheck size={22} />}
              />
              <StatCard
                title="Rủi ro cao"
                value={summary.highRisk}
                helper="Mention cần đội marketing/CSKH kiểm tra trước."
                icon={<AlertTriangle size={22} />}
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
              <div className="border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-950">Cảm xúc truyền thông</h2>
                    <p className="mt-1 text-xs font-semibold text-slate-500">Tỷ lệ tích cực, trung lập, tiêu cực và hỗn hợp.</p>
                  </div>
                  <BarChart3 className="text-orange-500" size={24} />
                </div>
                {[
                  ["Tích cực", summary.positive, "bg-emerald-500"],
                  ["Trung lập", summary.neutral, "bg-slate-400"],
                  ["Tiêu cực", summary.negative, "bg-red-500"],
                  ["Hỗn hợp", summary.mixed, "bg-amber-500"],
                ].map(([label, value, color]) => (
                  <div key={String(label)} className="mb-4 last:mb-0">
                    <div className="mb-1 flex justify-between text-xs font-black uppercase text-slate-500">
                      <span>{label}</span>
                      <span>{value} ({percent(Number(value), sentimentTotal)}%)</span>
                    </div>
                    <div className="h-3 overflow-hidden bg-slate-100">
                      <div className={`h-full ${color}`} style={{ width: `${percent(Number(value), sentimentTotal)}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="border border-slate-100 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-black text-slate-950">Chủ đề đang nổi</h2>
                <div className="mt-4 space-y-3">
                  {summary.topTopics.length ? (
                    summary.topTopics.map((topic) => (
                      <div key={topic.topic} className="flex items-center justify-between border border-orange-100 bg-orange-50 px-4 py-3">
                        <span className="text-sm font-black text-slate-900">{topicLabels[topic.topic] || topic.topic}</span>
                        <span className="text-sm font-black text-orange-700">{topic.count}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm font-semibold text-slate-500">Chưa có dữ liệu chủ đề.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
              <div className="space-y-6">
                <div className="border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-black text-slate-950">Từ khóa theo dõi</h2>
                    {saving && <Loader className="animate-spin text-orange-500" size={18} />}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[1fr_130px_auto]">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="VD: chân gà Bà Tuyết"
                      leftIcon={<Search size={15} />}
                    />
                    <select
                      value={newKeywordType}
                      onChange={(e) => setNewKeywordType(e.target.value as MediaIntelligenceKeyword["type"])}
                      className="border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-900 outline-none"
                    >
                      <option value="brand">Brand</option>
                      <option value="product">Product</option>
                      <option value="competitor">Competitor</option>
                      <option value="market">Market</option>
                    </select>
                    <Button variant="admin" onClick={addKeyword} leftIcon={<Plus size={15} />}>
                      Thêm
                    </Button>
                  </div>

                  <div className="mt-5 space-y-2">
                    {data.keywords.map((keyword) => (
                      <div key={keyword.id} className="flex items-center justify-between gap-3 border border-slate-100 bg-slate-50 px-3 py-2">
                        <button
                          onClick={() => toggleKeyword(keyword.id)}
                          className={`text-left text-sm font-black ${keyword.active ? "text-slate-900" : "text-slate-400 line-through"}`}
                        >
                          {keyword.keyword}
                          <span className="ml-2 text-[10px] uppercase text-orange-600">{keyword.type}</span>
                        </button>
                        <button
                          onClick={() => removeKeyword(keyword.id)}
                          className="p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          aria-label="Xóa từ khóa"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <Lightbulb className="text-orange-500" size={20} />
                    <h2 className="text-lg font-black text-slate-950">Gợi ý nội dung</h2>
                  </div>
                  <div className="space-y-3">
                    {data.ideas.length ? (
                      data.ideas.map((idea: MediaContentIdea) => (
                        <div key={idea.id} className={`border p-4 ${riskClasses[idea.priority]}`}>
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="text-sm font-black">{idea.title}</h3>
                            <span className="text-[10px] font-black uppercase">{idea.format}</span>
                          </div>
                          <p className="mt-2 text-xs font-semibold leading-5">{idea.objective}</p>
                          {idea.recommendedAssets.length > 0 && (
                            <p className="mt-3 text-[11px] font-black uppercase">
                              Tài sản: {idea.recommendedAssets.join(", ")}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm font-semibold text-slate-500">
                        Chưa có gợi ý. Bấm “Quét dữ liệu” để hệ thống tạo brief.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border border-slate-100 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-lg font-black text-slate-950">Nguồn nhắc tới thương hiệu</h2>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        Dữ liệu công khai + tín hiệu nội bộ được phân loại tự động.
                      </p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-[220px_130px]">
                      <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm mention..."
                        leftIcon={<Search size={15} />}
                      />
                      <select
                        value={riskFilter}
                        onChange={(e) => setRiskFilter(e.target.value)}
                        className="border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-900 outline-none"
                      >
                        <option value="all">Mọi rủi ro</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="max-h-[760px] overflow-y-auto">
                  {filteredMentions.length ? (
                    filteredMentions.map((mention) => <MentionRow key={mention.id} mention={mention} />)
                  ) : (
                    <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
                      <FileText className="text-slate-300" size={42} />
                      <p className="mt-3 text-sm font-black text-slate-700">Chưa có mention phù hợp</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        Thêm từ khóa rồi bấm quét dữ liệu để bắt đầu.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
