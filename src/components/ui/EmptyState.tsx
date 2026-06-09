import React from "react";
import Button from "./Button";

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
};

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
      {icon && <div className="mx-auto mb-4 flex justify-center text-slate-300">{icon}</div>}
      <h3 className="text-sm font-black text-slate-900">{title}</h3>
      {description && (
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          {description}
        </p>
      )}
      {actionLabel && actionHref && (
        <Button href={actionHref} variant="admin" size="sm" className="mt-5">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
