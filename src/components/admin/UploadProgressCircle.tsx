interface UploadProgressCircleProps {
  progress: number;
  size?: number;
}

export function UploadProgressCircle({ progress, size = 48 }: UploadProgressCircleProps) {
  const normalized = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div
      className="relative shrink-0 rounded-full"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={normalized}
      style={{
        width: size,
        height: size,
        background: `conic-gradient(var(--color-primary, #f97316) ${normalized * 3.6}deg, #e2e8f0 0deg)`,
      }}
    >
      <div className="absolute inset-[4px] rounded-full bg-white flex items-center justify-center">
        <span className="text-[10px] font-black text-slate-800">{normalized}%</span>
      </div>
    </div>
  );
}
