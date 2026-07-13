"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import {
  AlertCircle,
  Crosshair,
  Edit3,
  ExternalLink,
  Loader,
  MapPin,
  Plus,
  Save,
  ShoppingBag,
  Trash,
  X,
} from "lucide-react";

type Location = {
  id: string;
  name: string;
  type: string;
  address: string;
  province: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
  isActive: boolean;
  sortOrder: number;
};

type OnlineChannel = {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  followers: string;
  color: string;
  isActive: boolean;
  sortOrder: number;
};

type MapPoint = {
  lat: number;
  lng: number;
};

const emptyLocation: Omit<Location, "id"> = {
  name: "",
  type: "dai-ly",
  address: "",
  province: "",
  phone: "",
  hours: "8:00 - 20:00",
  lat: 21.0285,
  lng: 105.8542,
  isActive: true,
  sortOrder: 0,
};

const emptyChannel: Omit<OnlineChannel, "id"> = {
  name: "",
  description: "",
  url: "",
  icon: "shop",
  followers: "",
  color: "#0F172A",
  isActive: true,
  sortOrder: 0,
};

function locationTypeLabel(type: string) {
  if (type === "chi-nhanh") return "Chi nhánh";
  if (type === "sieu-thi") return "Siêu thị";
  if (type === "online") return "Online";
  return "Đại lý";
}

function clampLat(lat: number) {
  return Math.min(85, Math.max(-85, lat));
}

function latLngToWorld(point: MapPoint, zoom: number) {
  const scale = 256 * 2 ** zoom;
  const sinLat = Math.sin((clampLat(point.lat) * Math.PI) / 180);

  return {
    x: ((point.lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale,
  };
}

function worldToLatLng(point: { x: number; y: number }, zoom: number): MapPoint {
  const scale = 256 * 2 ** zoom;
  const lng = (point.x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * point.y) / scale;
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));

  return { lat, lng };
}

function LocationMapPicker({
  value,
  onChange,
}: {
  value: Partial<MapPoint>;
  onChange: (point: MapPoint) => void;
}) {
  const [zoom, setZoom] = useState(13);
  const [locating, setLocating] = useState(false);

  const center = {
    lat: Number.isFinite(value.lat) ? Number(value.lat) : emptyLocation.lat,
    lng: Number.isFinite(value.lng) ? Number(value.lng) : emptyLocation.lng,
  };
  const centerWorld = latLngToWorld(center, zoom);
  const tileCount = 2 ** zoom;
  const tileRadius = 2;
  const centerTileX = Math.floor(centerWorld.x / 256);
  const centerTileY = Math.floor(centerWorld.y / 256);

  const tiles = [];
  for (let x = centerTileX - tileRadius; x <= centerTileX + tileRadius; x += 1) {
    for (let y = centerTileY - tileRadius; y <= centerTileY + tileRadius; y += 1) {
      if (y < 0 || y >= tileCount) continue;
      const wrappedX = ((x % tileCount) + tileCount) % tileCount;
      tiles.push({
        key: `${zoom}-${x}-${y}`,
        src: `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${y}.png`,
        left: `calc(50% + ${x * 256 - centerWorld.x}px)`,
        top: `calc(50% + ${y * 256 - centerWorld.y}px)`,
      });
    }
  }

  const handlePick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const point = worldToLatLng(
      {
        x: centerWorld.x + event.clientX - rect.left - rect.width / 2,
        y: centerWorld.y + event.clientY - rect.top - rect.height / 2,
      },
      zoom
    );

    onChange({
      lat: Number(point.lat.toFixed(6)),
      lng: Number(point.lng.toFixed(6)),
    });
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        onChange({
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6)),
        });
      },
      () => {
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">Chọn tọa độ trên bản đồ</p>
          <p className="mt-1 text-xs text-slate-400">Bấm vào bản đồ để cập nhật Latitude / Longitude.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locating}
            className="inline-flex items-center gap-1.5 border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            {locating ? <Loader size={13} className="animate-spin" /> : <Crosshair size={13} />}
            Vị trí hiện tại
          </button>
          <button
            type="button"
            onClick={() => setZoom((current) => Math.max(5, current - 1))}
            className="h-8 w-8 border border-slate-200 bg-white text-sm font-black text-slate-700 hover:bg-slate-50"
          >
            -
          </button>
          <button
            type="button"
            onClick={() => setZoom((current) => Math.min(18, current + 1))}
            className="h-8 w-8 border border-slate-200 bg-white text-sm font-black text-slate-700 hover:bg-slate-50"
          >
            +
          </button>
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={handlePick}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            onChange(center);
          }
        }}
        className="relative h-[280px] cursor-crosshair overflow-hidden border border-slate-200 bg-slate-100 outline-none ring-orange-200 transition focus:ring-4"
      >
        {tiles.map((tile) => (
          <img
            key={tile.key}
            src={tile.src}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute h-64 w-64 select-none"
            style={{ left: tile.left, top: tile.top }}
          />
        ))}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.08)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
          <MapPin className="fill-primary text-primary drop-shadow" size={36} />
          <span className="-mt-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-slate-700 shadow">
            {center.lat.toFixed(5)}, {center.lng.toFixed(5)}
          </span>
        </div>
        <div className="pointer-events-none absolute bottom-2 right-2 bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-500">
          OpenStreetMap
        </div>
      </div>

      <a
        href={`https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs font-bold text-primary-dark hover:underline"
      >
        Mở tọa độ này trên Google Maps <ExternalLink size={12} />
      </a>
    </div>
  );
}

export default function AdminSalesChannelsPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<"locations" | "channels">("locations");
  const [locations, setLocations] = useState<Location[]>([]);
  const [channels, setChannels] = useState<OnlineChannel[]>([]);
  const [locationForm, setLocationForm] = useState<Partial<Location>>(emptyLocation);
  const [channelForm, setChannelForm] = useState<Partial<OnlineChannel>>(emptyChannel);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [editingChannelId, setEditingChannelId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const fetchAll = useCallback(async () => {
    if (!token) return;

    await Promise.resolve();
    setLoading(true);
    setError("");
    try {
      const [locationRes, channelRes] = await Promise.all([
        fetch("/api/locations?includeInactive=true", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/online-channels", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (locationRes.ok) {
        const data = await locationRes.json();
        setLocations(Array.isArray(data.locations) ? data.locations : []);
      }

      if (channelRes.ok) {
        const data = await channelRes.json();
        setChannels(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu hệ thống bán.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchAll();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchAll]);

  const resetLocationForm = () => {
    setEditingLocationId(null);
    setLocationForm(emptyLocation);
  };

  const resetChannelForm = () => {
    setEditingChannelId(null);
    setChannelForm(emptyChannel);
  };

  const submitLocation = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(editingLocationId ? `/api/locations/${editingLocationId}` : "/api/locations", {
        method: editingLocationId ? "PUT" : "POST",
        headers,
        body: JSON.stringify(locationForm),
      });

      if (!res.ok) throw new Error("Không thể lưu điểm bán");
      resetLocationForm();
      await fetchAll();
    } catch (err) {
      console.error(err);
      setError("Không thể lưu điểm bán. Kiểm tra lại các trường bắt buộc.");
    } finally {
      setSaving(false);
    }
  };

  const submitChannel = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(editingChannelId ? `/api/online-channels/${editingChannelId}` : "/api/online-channels", {
        method: editingChannelId ? "PUT" : "POST",
        headers,
        body: JSON.stringify(channelForm),
      });

      if (!res.ok) throw new Error("Không thể lưu kênh online");
      resetChannelForm();
      await fetchAll();
    } catch (err) {
      console.error(err);
      setError("Không thể lưu kênh online. Tên kênh có thể đã tồn tại.");
    } finally {
      setSaving(false);
    }
  };

  const deleteLocation = async (id: string) => {
    if (!confirm("Xóa điểm bán này?")) return;
    await fetch(`/api/locations/${id}`, { method: "DELETE", headers });
    await fetchAll();
  };

  const deleteChannel = async (id: string) => {
    if (!confirm("Xóa kênh online này?")) return;
    await fetch(`/api/online-channels/${id}`, { method: "DELETE", headers });
    await fetchAll();
  };

  const toggleLocation = async (location: Location) => {
    await fetch(`/api/locations/${location.id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ isActive: !location.isActive }),
    });
    await fetchAll();
  };

  const toggleChannel = async (channel: OnlineChannel) => {
    await fetch(`/api/online-channels/${channel.id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ isActive: !channel.isActive }),
    });
    await fetchAll();
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "EDITOR"]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Quản lý hệ thống bán</h1>
            <p className="mt-1 text-sm text-slate-500">
              Cập nhật điểm bán offline và kênh online đang hiển thị ở trang Điểm bán / Liên hệ.
            </p>
          </div>
          <a
            href="/diem-ban"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
          >
            Xem trang public <ExternalLink size={14} />
          </a>
        </div>

        <div className="flex gap-2 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("locations")}
            className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-bold ${
              activeTab === "locations" ? "border-b-2 border-primary text-primary-dark" : "text-slate-500"
            }`}
          >
            <MapPin size={16} /> Điểm bán
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("channels")}
            className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-bold ${
              activeTab === "channels" ? "border-b-2 border-primary text-primary-dark" : "text-slate-500"
            }`}
          >
            <ShoppingBag size={16} /> Kênh online
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center bg-white">
            <Loader className="animate-spin text-primary-dark" size={36} />
          </div>
        ) : activeTab === "locations" ? (
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <form onSubmit={submitLocation} className="space-y-4 border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  {editingLocationId ? "Sửa điểm bán" : "Thêm điểm bán"}
                </h2>
                {editingLocationId && (
                  <button type="button" onClick={resetLocationForm} className="p-2 text-slate-400 hover:text-slate-900">
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <input required value={locationForm.name || ""} onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })} placeholder="Tên điểm bán" className="border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400" />
                <select value={locationForm.type || "dai-ly"} onChange={(e) => setLocationForm({ ...locationForm, type: e.target.value })} className="border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400">
                  <option value="chi-nhanh">Chi nhánh</option>
                  <option value="dai-ly">Đại lý</option>
                  <option value="sieu-thi">Siêu thị</option>
                  <option value="online">Online</option>
                </select>
                <input required value={locationForm.province || ""} onChange={(e) => setLocationForm({ ...locationForm, province: e.target.value })} placeholder="Tỉnh / Thành phố" className="border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400" />
                <input required value={locationForm.phone || ""} onChange={(e) => setLocationForm({ ...locationForm, phone: e.target.value })} placeholder="Số điện thoại" className="border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400" />
                <input required value={locationForm.hours || ""} onChange={(e) => setLocationForm({ ...locationForm, hours: e.target.value })} placeholder="Giờ mở cửa" className="border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400" />
                <input value={locationForm.sortOrder ?? 0} onChange={(e) => setLocationForm({ ...locationForm, sortOrder: Number(e.target.value) })} type="number" placeholder="Thứ tự" className="border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400" />
                <input value={locationForm.lat ?? ""} onChange={(e) => setLocationForm({ ...locationForm, lat: Number(e.target.value) })} type="number" step="any" placeholder="Latitude" className="border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400" />
                <input value={locationForm.lng ?? ""} onChange={(e) => setLocationForm({ ...locationForm, lng: Number(e.target.value) })} type="number" step="any" placeholder="Longitude" className="border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400" />
              </div>
              <LocationMapPicker
                value={{ lat: locationForm.lat, lng: locationForm.lng }}
                onChange={(point) => setLocationForm({ ...locationForm, lat: point.lat, lng: point.lng })}
              />
              <textarea required value={locationForm.address || ""} onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })} rows={3} placeholder="Địa chỉ" className="w-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400" />
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <input type="checkbox" checked={locationForm.isActive ?? true} onChange={(e) => setLocationForm({ ...locationForm, isActive: e.target.checked })} />
                Đang hiển thị public
              </label>
              <button disabled={saving} className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-60">
                {saving ? <Loader size={16} className="animate-spin" /> : editingLocationId ? <Save size={16} /> : <Plus size={16} />}
                {editingLocationId ? "Lưu điểm bán" : "Thêm điểm bán"}
              </button>
            </form>

            <div className="space-y-3">
              {locations.map((location) => (
                <div key={location.id} className="border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-slate-950">{location.name}</h3>
                        <span className="bg-orange-50 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-primary-dark">{locationTypeLabel(location.type)}</span>
                        <span className={location.isActive ? "text-xs font-bold text-green-600" : "text-xs font-bold text-slate-400"}>
                          {location.isActive ? "Đang hiển thị" : "Đang ẩn"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{location.address}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-400">
                        {location.province} · {location.phone} · {location.hours}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toggleLocation(location)} className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100">
                        {location.isActive ? "Ẩn" : "Hiện"}
                      </button>
                      <button onClick={() => { setEditingLocationId(location.id); setLocationForm(location); }} className="p-2 text-slate-500 hover:bg-slate-100 hover:text-primary-dark">
                        <Edit3 size={15} />
                      </button>
                      <button onClick={() => deleteLocation(location.id)} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
                        <Trash size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <form onSubmit={submitChannel} className="space-y-4 border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  {editingChannelId ? "Sửa kênh online" : "Thêm kênh online"}
                </h2>
                {editingChannelId && (
                  <button type="button" onClick={resetChannelForm} className="p-2 text-slate-400 hover:text-slate-900">
                    <X size={16} />
                  </button>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input required value={channelForm.name || ""} onChange={(e) => setChannelForm({ ...channelForm, name: e.target.value })} placeholder="Tên kênh" className="border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400" />
                <input required value={channelForm.url || ""} onChange={(e) => setChannelForm({ ...channelForm, url: e.target.value })} placeholder="URL" className="border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400" />
                <input value={channelForm.followers || ""} onChange={(e) => setChannelForm({ ...channelForm, followers: e.target.value })} placeholder="Followers / nhãn phụ" className="border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400" />
                <input value={channelForm.color || "#0F172A"} onChange={(e) => setChannelForm({ ...channelForm, color: e.target.value })} type="color" className="h-10 border border-slate-200 px-2 py-1" />
                <input value={channelForm.icon || ""} onChange={(e) => setChannelForm({ ...channelForm, icon: e.target.value })} placeholder="Icon key" className="border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400" />
                <input value={channelForm.sortOrder ?? 0} onChange={(e) => setChannelForm({ ...channelForm, sortOrder: Number(e.target.value) })} type="number" placeholder="Thứ tự" className="border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400" />
              </div>
              <textarea required value={channelForm.description || ""} onChange={(e) => setChannelForm({ ...channelForm, description: e.target.value })} rows={3} placeholder="Mô tả kênh" className="w-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400" />
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <input type="checkbox" checked={channelForm.isActive ?? true} onChange={(e) => setChannelForm({ ...channelForm, isActive: e.target.checked })} />
                Đang hiển thị public
              </label>
              <button disabled={saving} className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-60">
                {saving ? <Loader size={16} className="animate-spin" /> : editingChannelId ? <Save size={16} /> : <Plus size={16} />}
                {editingChannelId ? "Lưu kênh" : "Thêm kênh"}
              </button>
            </form>

            <div className="space-y-3">
              {channels.map((channel) => (
                <div key={channel.id} className="border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center text-sm font-black text-white" style={{ backgroundColor: channel.color }}>
                          {channel.name.charAt(0)}
                        </span>
                        <h3 className="font-black text-slate-950">{channel.name}</h3>
                        <span className={channel.isActive ? "text-xs font-bold text-green-600" : "text-xs font-bold text-slate-400"}>
                          {channel.isActive ? "Đang hiển thị" : "Đang ẩn"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{channel.description}</p>
                      <a href={channel.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-primary-dark hover:underline">
                        {channel.url} <ExternalLink size={12} />
                      </a>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toggleChannel(channel)} className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100">
                        {channel.isActive ? "Ẩn" : "Hiện"}
                      </button>
                      <button onClick={() => { setEditingChannelId(channel.id); setChannelForm(channel); }} className="p-2 text-slate-500 hover:bg-slate-100 hover:text-primary-dark">
                        <Edit3 size={15} />
                      </button>
                      <button onClick={() => deleteChannel(channel.id)} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
                        <Trash size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}


