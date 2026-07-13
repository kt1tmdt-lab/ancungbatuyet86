"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowDown, ArrowUp, Eye, ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { useAuth } from "@/lib/auth-context";
import { DEFAULT_QUALITY_CONFIG, type QualityPageConfig, type QualitySimpleItem } from "@/lib/quality-config";

type SectionKey = "hero" | "source" | "factory" | "documents" | "pvi" | "policy";
type PickerTarget =
  | { kind: "hero" | "source" | "factory" | "pvi" }
  | { kind: "factoryGallery"; index: number }
  | { kind: "document"; index: number };

const tabs: Array<{ key: SectionKey; label: string; note: string }> = [
  { key: "hero", label: "Hero", note: "Tiêu đề, mô tả, ảnh đầu trang" },
  { key: "source", label: "Nguồn nguyên liệu", note: "Ảnh + các điểm chứng minh" },
  { key: "factory", label: "Nhà máy & quy trình", note: "Gallery + 6 bước" },
  { key: "documents", label: "Hồ sơ pháp lý", note: "Card mở popup ngoài web" },
  { key: "pvi", label: "PVI", note: "Nội dung bảo hiểm" },
  { key: "policy", label: "Chính sách & FAQ", note: "Accordion cuối trang" },
];

function cloneDefault() {
  return JSON.parse(JSON.stringify(DEFAULT_QUALITY_CONFIG)) as QualityPageConfig;
}

function newItem(prefix: string): QualitySimpleItem {
  return {
    id: `${prefix}-${Date.now()}`,
    title: "Tiêu đề mới",
    description: "Nhập mô tả...",
    imageUrl: "",
  };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="w-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />;
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className="min-h-28 w-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold leading-7 text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />;
}

function ImageChooser({ value, onPick }: { value: string; onPick: () => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
      <button type="button" onClick={onPick} className="relative min-h-28 overflow-hidden border border-dashed border-orange-300 bg-orange-50 text-orange-700">
        {value ? <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <ImagePlus className="mx-auto" />}
      </button>
      <div className="space-y-2">
        <TextInput value={value} onChange={() => undefined} readOnly placeholder="/uploads/anh.jpg hoặc https://..." />
        <button type="button" onClick={onPick} className="inline-flex items-center gap-2 bg-orange-600 px-4 py-2 text-xs font-black uppercase tracking-wide text-white hover:bg-slate-950">
          <ImagePlus size={14} /> Chọn từ thư viện
        </button>
      </div>
    </div>
  );
}

function ItemEditor({
  item,
  index,
  showImage,
  onChange,
  onRemove,
  onMove,
  onPickImage,
}: {
  item: QualitySimpleItem;
  index: number;
  showImage?: boolean;
  onChange: (next: QualitySimpleItem) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
  onPickImage?: () => void;
}) {
  return (
    <div className="border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-black text-orange-600">#{String(index + 1).padStart(2, "0")}</span>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => onMove(-1)} className="grid h-8 w-8 place-items-center border border-slate-200 text-slate-500 hover:text-orange-600"><ArrowUp size={14} /></button>
          <button type="button" onClick={() => onMove(1)} className="grid h-8 w-8 place-items-center border border-slate-200 text-slate-500 hover:text-orange-600"><ArrowDown size={14} /></button>
          <button type="button" onClick={onRemove} className="grid h-8 w-8 place-items-center border border-red-200 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
        </div>
      </div>
      <div className="grid gap-4">
        <Field label="Tiêu đề">
          <TextInput value={item.title} onChange={(event) => onChange({ ...item, title: event.target.value })} />
        </Field>
        <Field label="Mô tả">
          <TextArea value={item.description} onChange={(event) => onChange({ ...item, description: event.target.value })} />
        </Field>
        {showImage ? (
          <Field label="Ảnh">
            <ImageChooser value={item.imageUrl || ""} onPick={onPickImage || (() => undefined)} />
          </Field>
        ) : null}
      </div>
    </div>
  );
}

export default function AdminQualityPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<SectionKey>("hero");
  const [config, setConfig] = useState<QualityPageConfig>(cloneDefault);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget | null>(null);

  useEffect(() => {
    fetch("/api/settings/quality")
      .then((res) => res.json())
      .then((data) => setConfig(data?.data || cloneDefault()))
      .catch(() => toast.error("Không tải được cấu hình Chất lượng"))
      .finally(() => setLoading(false));
  }, []);

  const patch = (next: Partial<QualityPageConfig>) => {
    setConfig((current) => ({ ...current, ...next }));
  };

  const updateList = (section: "source" | "factory" | "documents" | "policy" | "faq", key: "facts" | "gallery" | "steps" | "items", items: QualitySimpleItem[]) => {
    setConfig((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: items,
      },
    }));
  };

  const moveItem = (items: QualitySimpleItem[], index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return items;
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(nextIndex, 0, item);
    return next;
  };

  const onSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch("/api/settings/quality", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Đã lưu cấu hình trang Chất lượng");
    } catch {
      toast.error("Không lưu được cấu hình");
    } finally {
      setSaving(false);
    }
  };

  const setPickedImage = (url: string) => {
    if (!pickerTarget) return;
    if (pickerTarget.kind === "hero") patch({ hero: { ...config.hero, imageUrl: url } });
    if (pickerTarget.kind === "source") patch({ source: { ...config.source, imageUrl: url } });
    if (pickerTarget.kind === "factory") patch({ factory: { ...config.factory, imageUrl: url } });
    if (pickerTarget.kind === "pvi") patch({ pvi: { ...config.pvi, imageUrl: url } });
    if (pickerTarget.kind === "factoryGallery") {
      const gallery = [...config.factory.gallery];
      gallery[pickerTarget.index] = { ...gallery[pickerTarget.index], imageUrl: url };
      patch({ factory: { ...config.factory, gallery } });
    }
    if (pickerTarget.kind === "document") {
      const items = [...config.documents.items];
      items[pickerTarget.index] = { ...items[pickerTarget.index], imageUrl: url };
      patch({ documents: { ...config.documents, items } });
    }
    setPickerTarget(null);
  };

  const renderList = (
    items: QualitySimpleItem[],
    setItems: (items: QualitySimpleItem[]) => void,
    prefix: string,
    showImage = false,
    imageTarget?: (index: number) => PickerTarget,
  ) => (
    <div className="space-y-4">
      {items.map((item, index) => (
        <ItemEditor
          key={item.id}
          item={item}
          index={index}
          showImage={showImage}
          onChange={(nextItem) => setItems(items.map((entry, idx) => (idx === index ? nextItem : entry)))}
          onRemove={() => setItems(items.filter((_, idx) => idx !== index))}
          onMove={(direction) => setItems(moveItem(items, index, direction))}
          onPickImage={imageTarget ? () => setPickerTarget(imageTarget(index)) : undefined}
        />
      ))}
      <button type="button" onClick={() => setItems([...items, newItem(prefix)])} className="inline-flex items-center gap-2 border border-orange-200 bg-orange-50 px-4 py-3 text-xs font-black uppercase tracking-wide text-orange-700 hover:bg-orange-100">
        <Plus size={14} /> Thêm dòng
      </button>
    </div>
  );

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "MARKETING", "EDITOR"]}>
      <div className="mx-auto max-w-7xl space-y-6 pb-16">
        <header className="flex flex-col gap-4 border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">Cấu hình website</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Trang Chất lượng</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Màn này sửa đúng layout ngoài trang /chat-luong: chữ, ảnh, card, popup, quy trình, chính sách và FAQ.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/chat-luong" target="_blank" className="inline-flex items-center gap-2 border border-slate-300 px-4 py-3 text-xs font-black uppercase tracking-wide text-slate-700 hover:border-orange-500 hover:text-orange-600">
              <Eye size={15} /> Xem trang
            </Link>
            <button type="button" onClick={onSave} disabled={saving || loading} className="inline-flex items-center gap-2 bg-orange-600 px-5 py-3 text-xs font-black uppercase tracking-wide text-white shadow-lg shadow-orange-600/20 hover:bg-slate-950 disabled:opacity-60">
              <Save size={15} /> {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit border border-slate-200 bg-white p-3 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`block w-full border-l-4 p-4 text-left transition ${activeTab === tab.key ? "border-orange-600 bg-orange-50" : "border-transparent hover:bg-slate-50"}`}
              >
                <span className="block font-black text-slate-950">{tab.label}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">{tab.note}</span>
              </button>
            ))}
          </aside>

          <main className="border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            {loading ? (
              <p className="text-sm font-bold text-slate-500">Đang tải cấu hình...</p>
            ) : null}

            {activeTab === "hero" ? (
              <div className="grid gap-5">
                <Field label="Nhãn nhỏ"><TextInput value={config.hero.eyebrow} onChange={(e) => patch({ hero: { ...config.hero, eyebrow: e.target.value } })} /></Field>
                <Field label="Tiêu đề lớn"><TextArea value={config.hero.title} onChange={(e) => patch({ hero: { ...config.hero, title: e.target.value } })} /></Field>
                <Field label="Mô tả"><TextArea value={config.hero.subtitle} onChange={(e) => patch({ hero: { ...config.hero, subtitle: e.target.value } })} /></Field>
                <Field label="Ảnh hero"><ImageChooser value={config.hero.imageUrl} onPick={() => setPickerTarget({ kind: "hero" })} /></Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Nút chính"><TextInput value={config.hero.ctaText} onChange={(e) => patch({ hero: { ...config.hero, ctaText: e.target.value } })} /></Field>
                  <Field label="Link nút chính"><TextInput value={config.hero.ctaLink} onChange={(e) => patch({ hero: { ...config.hero, ctaLink: e.target.value } })} /></Field>
                  <Field label="Nút phụ"><TextInput value={config.hero.secondaryCtaText} onChange={(e) => patch({ hero: { ...config.hero, secondaryCtaText: e.target.value } })} /></Field>
                  <Field label="Link nút phụ"><TextInput value={config.hero.secondaryCtaLink} onChange={(e) => patch({ hero: { ...config.hero, secondaryCtaLink: e.target.value } })} /></Field>
                </div>
              </div>
            ) : null}

            {activeTab === "source" ? (
              <div className="grid gap-5">
                <Field label="Tiêu đề section"><TextArea value={config.source.title} onChange={(e) => patch({ source: { ...config.source, title: e.target.value } })} /></Field>
                <Field label="Mô tả section"><TextArea value={config.source.description} onChange={(e) => patch({ source: { ...config.source, description: e.target.value } })} /></Field>
                <Field label="Ảnh nguồn nguyên liệu"><ImageChooser value={config.source.imageUrl} onPick={() => setPickerTarget({ kind: "source" })} /></Field>
                <h2 className="text-lg font-black text-slate-950">Các điểm chứng minh</h2>
                {renderList(config.source.facts, (items) => patch({ source: { ...config.source, facts: items } }), "source")}
              </div>
            ) : null}

            {activeTab === "factory" ? (
              <div className="grid gap-6">
                <Field label="Tiêu đề nhà máy"><TextArea value={config.factory.title} onChange={(e) => patch({ factory: { ...config.factory, title: e.target.value } })} /></Field>
                <Field label="Mô tả nhà máy"><TextArea value={config.factory.description} onChange={(e) => patch({ factory: { ...config.factory, description: e.target.value } })} /></Field>
                <Field label="Ảnh chính nhà máy"><ImageChooser value={config.factory.imageUrl} onPick={() => setPickerTarget({ kind: "factory" })} /></Field>
                <h2 className="text-lg font-black text-slate-950">Gallery ảnh</h2>
                {renderList(config.factory.gallery, (items) => patch({ factory: { ...config.factory, gallery: items } }), "gallery", true, (index) => ({ kind: "factoryGallery", index }))}
                <h2 className="text-lg font-black text-slate-950">Quy trình các bước</h2>
                {renderList(config.factory.steps, (items) => patch({ factory: { ...config.factory, steps: items } }), "step")}
              </div>
            ) : null}

            {activeTab === "documents" ? (
              <div className="grid gap-5">
                <Field label="Tiêu đề hồ sơ"><TextArea value={config.documents.title} onChange={(e) => patch({ documents: { ...config.documents, title: e.target.value } })} /></Field>
                <Field label="Mô tả hồ sơ"><TextArea value={config.documents.subtitle} onChange={(e) => patch({ documents: { ...config.documents, subtitle: e.target.value } })} /></Field>
                {renderList(config.documents.items, (items) => patch({ documents: { ...config.documents, items } }), "document", true, (index) => ({ kind: "document", index }))}
              </div>
            ) : null}

            {activeTab === "pvi" ? (
              <div className="grid gap-5">
                <Field label="Tiêu đề PVI"><TextArea value={config.pvi.title} onChange={(e) => patch({ pvi: { ...config.pvi, title: e.target.value } })} /></Field>
                <Field label="Mô tả PVI"><TextArea value={config.pvi.description} onChange={(e) => patch({ pvi: { ...config.pvi, description: e.target.value } })} /></Field>
                <Field label="Ảnh/scan PVI"><ImageChooser value={config.pvi.imageUrl} onPick={() => setPickerTarget({ kind: "pvi" })} /></Field>
              </div>
            ) : null}

            {activeTab === "policy" ? (
              <div className="grid gap-6">
                <Field label="Tiêu đề chính sách"><TextArea value={config.policy.title} onChange={(e) => patch({ policy: { ...config.policy, title: e.target.value } })} /></Field>
                <h2 className="text-lg font-black text-slate-950">Chính sách khách hàng</h2>
                {renderList(config.policy.items, (items) => patch({ policy: { ...config.policy, items } }), "policy")}
                <Field label="Tiêu đề FAQ"><TextArea value={config.faq.title} onChange={(e) => patch({ faq: { ...config.faq, title: e.target.value } })} /></Field>
                <h2 className="text-lg font-black text-slate-950">FAQ</h2>
                {renderList(config.faq.items, (items) => patch({ faq: { ...config.faq, items } }), "faq")}
              </div>
            ) : null}
          </main>
        </div>

        <MediaPickerModal
          open={Boolean(pickerTarget)}
          onClose={() => setPickerTarget(null)}
          onSelect={setPickedImage}
        />
      </div>
    </ProtectedRoute>
  );
}
