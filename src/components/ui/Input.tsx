import React from "react";
import { cn } from "./Button";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
};

export default function Input({
  label,
  error,
  leftIcon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || props.name;

  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-bold text-slate-800">
          {label}
        </span>
      )}
      <span className="relative block">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            "w-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400",
            "focus:border-primary focus:ring-4 focus:ring-primary/15",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
            Boolean(leftIcon) && "pl-10",
            error && "border-red-300 focus:border-red-500 focus:ring-red-500/15",
            className,
          )}
          {...props}
        />
      </span>
      {error && (
        <span className="mt-1.5 block text-xs font-semibold text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}
