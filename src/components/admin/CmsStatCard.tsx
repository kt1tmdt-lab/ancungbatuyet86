import React from "react";
import { cn } from "@/components/ui/Button";

type Tone = "slate" | "orange" | "green" | "red" | "blue" | "purple";

const tones: Record<Tone, string> = {
  slate: "border-slate-200 bg-white text-slate-900",
  orange: "border-orange-200 bg-orange-50/50 text-primary-dark",
  green: "border-emerald-200 bg-emerald-50/50 text-emerald-700",
  red: "border-red-200 bg-red-50/50 text-red-700",
  blue: "border-blue-200 bg-blue-50/50 text-blue-700",
  purple: "border-purple-200 bg-purple-50/50 text-purple-700",
};

type CmsStatCardProps = {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
  tone?: Tone;
  active?: boolean;
  onClick?: () => void;
};

export default function CmsStatCard({
  label,
  value,
  hint,
  icon,
  tone = "slate",
  active = false,
  onClick,
}: CmsStatCardProps) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "w-full border p-4 text-left shadow-sm transition",
        tones[tone],
        onClick && "cursor-pointer hover:-translate-y-0.5 hover:shadow-md",
        active && "ring-2 ring-primary/25",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
          {label}
        </p>
        {icon && <div className="text-current">{icon}</div>}
      </div>
      <div className="mt-3 text-2xl font-black tracking-[-0.03em] text-slate-950">
        {value}
      </div>
      {hint && <p className="mt-1 text-xs font-semibold text-slate-500">{hint}</p>}
    </Component>
  );
}
