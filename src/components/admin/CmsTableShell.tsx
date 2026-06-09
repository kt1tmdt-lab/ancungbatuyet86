import React from "react";
import { cn } from "@/components/ui/Button";

export function CmsTableShell({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("overflow-x-auto border border-slate-100 bg-white", className)}
      {...props}
    />
  );
}

export function CmsTable({
  className,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn("w-full text-left text-sm text-slate-700", className)}
      {...props}
    />
  );
}
