"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Loader, MapPin, Search, Store } from "lucide-react";

type DistributionPoint = [latitude: number, longitude: number, name: string, typeIndex: number];

type DistributionData = {
  count: number;
  skipped: number;
  types: Array<{ name: string; count: number }>;
  points: DistributionPoint[];
};

const PAGE_SIZE = 12;

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

export default function DistributionPointExplorer() {
  const [data, setData] = useState<DistributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [activeType, setActiveType] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedPoint, setSelectedPoint] = useState<DistributionPoint | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/data/distribution-points.json", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Không thể tải dữ liệu điểm phân phối");
        return response.json() as Promise<DistributionData>;
      })
      .then((payload) => {
        setData(payload);
        setSelectedPoint(payload.points[0] || null);
      })
      .catch((loadError) => {
        if (loadError instanceof Error && loadError.name === "AbortError") return;
        setError("Chưa thể tải danh sách điểm phân phối. Vui lòng thử lại sau.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const filteredPoints = useMemo(() => {
    if (!data) return [];
    const normalizedQuery = normalizeSearch(deferredQuery);
    const activeTypeIndex = activeType === "all" ? -1 : Number(activeType);

    return data.points.filter((point) => {
      if (activeTypeIndex >= 0 && point[3] !== activeTypeIndex) return false;
      if (normalizedQuery && !normalizeSearch(point[2]).includes(normalizedQuery)) return false;
      return true;
    });
  }, [activeType, data, deferredQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredPoints.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visiblePoints = filteredPoints.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const selectedType = selectedPoint && data ? data.types[selectedPoint[3]]?.name || "Điểm phân phối" : "";
  const mapSrc = selectedPoint
    ? `https://www.google.com/maps?q=${selectedPoint[0]},${selectedPoint[1]}&z=16&hl=vi&output=embed`
    : "";

  if (loading) {
    return (
      <div className="grid min-h-[420px] place-items-center border border-orange-200 bg-white">
        <div className="text-center">
          <Loader className="mx-auto animate-spin text-orange-600" size={34} />
          <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            Đang tải mạng lưới phân phối
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="border border-dashed border-orange-200 bg-white p-8 text-center text-sm font-bold text-slate-500">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4 border border-orange-200 bg-white p-4 shadow-[12px_12px_0_rgba(234,88,12,0.08)] sm:p-6 lg:grid-cols-[1fr_300px]">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-600" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo tên điểm phân phối..."
            className="h-13 w-full border border-slate-200 bg-[#fffaf3] pl-12 pr-4 text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500"
          />
        </label>

        <select
          value={activeType}
          onChange={(event) => {
            setActiveType(event.target.value);
            setPage(1);
          }}
          className="h-13 w-full border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 outline-none focus:border-orange-500"
          aria-label="Lọc theo loại khách hàng"
        >
          <option value="all">Tất cả loại khách hàng ({formatNumber(data.count)})</option>
          {data.types.map((type, index) => (
            <option key={type.name} value={String(index)}>
              {type.name} ({formatNumber(type.count)})
            </option>
          ))}
        </select>
      </div>

      <div id="offline-map" className="mt-8 grid scroll-mt-28 gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="overflow-hidden border border-orange-200 bg-white shadow-[16px_16px_0_rgba(234,88,12,0.08)]">
          {mapSrc ? (
            <iframe
              key={mapSrc}
              title={selectedPoint ? `Bản đồ ${selectedPoint[2]}` : "Bản đồ điểm phân phối"}
              src={mapSrc}
              className="h-[390px] w-full border-0 sm:h-[520px]"
              loading="lazy"
            />
          ) : (
            <div className="grid h-[390px] place-items-center bg-orange-50 sm:h-[520px]">
              <MapPin className="h-12 w-12 text-orange-500" />
            </div>
          )}
        </div>

        <div className="border border-orange-200 bg-white p-5 sm:p-7">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-600">
            Điểm đang chọn
          </p>
          {selectedPoint ? (
            <>
              <h3 className="mt-3 text-2xl font-black tracking-[-0.045em] text-slate-950 sm:text-3xl">
                {selectedPoint[2]}
              </h3>
              <p className="mt-3 inline-flex bg-orange-50 px-3 py-2 text-xs font-black text-orange-700">
                {selectedType}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="border border-slate-200 bg-[#fffaf3] p-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Vĩ độ</p>
                  <p className="mt-2 text-sm font-black text-slate-800">{selectedPoint[0]}</p>
                </div>
                <div className="border border-slate-200 bg-[#fffaf3] p-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Kinh độ</p>
                  <p className="mt-2 text-sm font-black text-slate-800">{selectedPoint[1]}</p>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedPoint[0]},${selectedPoint[1]}`}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 bg-orange-600 px-5 py-3.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-slate-950"
              >
                <MapPin size={15} />
                Mở trên Google Maps
              </a>
            </>
          ) : (
            <p className="mt-4 text-sm font-semibold text-slate-500">Chọn một điểm trong danh sách để xem bản đồ.</p>
          )}
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-600">Danh sách phân phối</p>
          <h3 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
            {formatNumber(filteredPoints.length)} điểm phù hợp
          </h3>
        </div>
        <p className="text-xs font-bold text-slate-500">
          Trang {safePage}/{totalPages}
        </p>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {visiblePoints.map((point, index) => {
          const type = data.types[point[3]]?.name || "Điểm phân phối";
          const isSelected = selectedPoint === point;
          return (
            <button
              key={`${point[0]}-${point[1]}-${point[2]}-${index}`}
              type="button"
              onClick={() => {
                setSelectedPoint(point);
                document.getElementById("offline-map")?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className={`group min-h-36 border p-5 text-left transition ${
                isSelected
                  ? "border-orange-500 bg-orange-50 shadow-[6px_6px_0_rgba(234,88,12,0.12)]"
                  : "border-orange-200 bg-white hover:-translate-y-0.5 hover:border-orange-400 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <Store className="h-6 w-6 shrink-0 text-orange-600" />
                <MapPin className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:text-orange-500" />
              </div>
              <h4 className="mt-4 line-clamp-2 text-base font-black leading-6 tracking-[-0.025em] text-slate-950">
                {point[2]}
              </h4>
              <p className="mt-2 text-xs font-bold text-slate-500">{type}</p>
            </button>
          );
        })}
      </div>

      {visiblePoints.length === 0 ? (
        <div className="mt-6 border border-dashed border-orange-200 bg-white p-8 text-center text-sm font-bold text-slate-500">
          Không tìm thấy điểm phân phối phù hợp.
        </div>
      ) : null}

      {totalPages > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="grid h-11 w-11 place-items-center border border-orange-200 bg-white text-orange-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Trang trước"
          >
            <ChevronLeft size={19} />
          </button>
          <span className="min-w-28 text-center text-xs font-black uppercase tracking-wider text-slate-600">
            {safePage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            className="grid h-11 w-11 place-items-center border border-orange-200 bg-white text-orange-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Trang sau"
          >
            <ChevronRight size={19} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
