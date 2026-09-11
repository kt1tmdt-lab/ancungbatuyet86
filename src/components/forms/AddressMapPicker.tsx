"use client";

import { useState } from "react";
import { Crosshair, Loader, MapPin } from "lucide-react";

export type AddressMapPoint = { lat: number; lng: number };

const DEFAULT_POINT: AddressMapPoint = { lat: 21.0278, lng: 105.8342 };
const TILE_URL =
  process.env.NEXT_PUBLIC_MAP_TILE_URL ||
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

function latLngToWorld(point: AddressMapPoint, zoom: number) {
  const scale = 256 * 2 ** zoom;
  const sinLat = Math.sin((Math.max(-85.0511, Math.min(85.0511, point.lat)) * Math.PI) / 180);
  return {
    x: ((point.lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale,
  };
}

function worldToLatLng(point: { x: number; y: number }, zoom: number): AddressMapPoint {
  const scale = 256 * 2 ** zoom;
  const lng = (point.x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * point.y) / scale;
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return { lat, lng };
}

export default function AddressMapPicker({
  value,
  onChange,
}: {
  value: AddressMapPoint | null;
  onChange: (point: AddressMapPoint, address?: string) => void;
}) {
  const [zoom, setZoom] = useState(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const center = value || DEFAULT_POINT;
  const centerWorld = latLngToWorld(center, zoom);
  const tileCount = 2 ** zoom;
  const centerTileX = Math.floor(centerWorld.x / 256);
  const centerTileY = Math.floor(centerWorld.y / 256);
  const tiles: Array<{ key: string; src: string; left: string; top: string }> = [];

  for (let x = centerTileX - 2; x <= centerTileX + 2; x++) {
    for (let y = centerTileY - 2; y <= centerTileY + 2; y++) {
      if (y < 0 || y >= tileCount) continue;
      const wrappedX = ((x % tileCount) + tileCount) % tileCount;
      tiles.push({
        key: `${zoom}-${x}-${y}`,
        src: TILE_URL.replace("{z}", String(zoom))
          .replace("{x}", String(wrappedX))
          .replace("{y}", String(y)),
        left: `calc(50% + ${x * 256 - centerWorld.x}px)`,
        top: `calc(50% + ${y * 256 - centerWorld.y}px)`,
      });
    }
  }

  const selectPoint = async (point: AddressMapPoint) => {
    const rounded = {
      lat: Number(point.lat.toFixed(6)),
      lng: Number(point.lng.toFixed(6)),
    };
    onChange(rounded);
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/geocode/reverse?lat=${rounded.lat}&lng=${rounded.lng}`,
      );
      const payload = (await response.json()) as { address?: string; error?: string };
      if (!response.ok || !payload.address) {
        throw new Error(payload.error || "Không tìm thấy địa chỉ tại vị trí này.");
      }
      onChange(rounded, payload.address);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể lấy địa chỉ từ bản đồ.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const point = worldToLatLng(
      {
        x: centerWorld.x + event.clientX - rect.left - rect.width / 2,
        y: centerWorld.y + event.clientY - rect.top - rect.height / 2,
      },
      zoom,
    );
    void selectPoint(point);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ lấy vị trí hiện tại.");
      return;
    }
    setLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        void selectPoint({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setLoading(false);
        setError("Không lấy được vị trí. Vui lòng cho phép truy cập vị trí hoặc chọn trên bản đồ.");
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-bold text-slate-500">
          Chọn điểm trên bản đồ để tự điền địa chỉ
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={loading}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-black text-slate-700 hover:border-orange-300 hover:text-orange-600 disabled:opacity-50"
          >
            {loading ? <Loader size={12} className="animate-spin" /> : <Crosshair size={12} />}
            Vị trí của tôi
          </button>
          <button type="button" onClick={() => setZoom((current) => Math.max(5, current - 1))} className="h-8 w-8 rounded-lg border border-slate-200 bg-white text-sm font-black">−</button>
          <button type="button" onClick={() => setZoom((current) => Math.min(18, current + 1))} className="h-8 w-8 rounded-lg border border-slate-200 bg-white text-sm font-black">+</button>
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label="Chọn địa chỉ trên bản đồ"
        onClick={handlePick}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") void selectPoint(center);
        }}
        className="relative h-64 cursor-crosshair overflow-hidden rounded-xl border border-slate-200 bg-slate-100 outline-none ring-orange-200 focus:ring-4"
      >
        {tiles.map((tile) => (
          <img key={tile.key} src={tile.src} alt="" aria-hidden="true" draggable={false} className="absolute h-64 w-64 select-none" style={{ left: tile.left, top: tile.top }} />
        ))}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full text-orange-600 drop-shadow">
          <MapPin size={38} className="fill-orange-500 text-white" />
        </div>
        {loading ? <div className="pointer-events-none absolute inset-0 grid place-items-center bg-white/50"><Loader className="animate-spin text-orange-600" size={24} /></div> : null}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} className="absolute bottom-1 right-1 bg-white/90 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600">© OpenStreetMap contributors</a>
      </div>
      {value ? <p className="text-[10px] font-semibold text-slate-500">Tọa độ đã chọn: {value.lat.toFixed(6)}, {value.lng.toFixed(6)}</p> : null}
      {error ? <p className="text-[10px] font-semibold text-red-600">{error}</p> : null}
    </div>
  );
}
