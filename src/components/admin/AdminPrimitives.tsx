"use client";

import type { ReactNode } from "react";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Inbox,
  LoaderCircle,
  Search,
  TriangleAlert,
  X,
} from "lucide-react";
import Button, { cn } from "@/components/ui/Button";

export function AdminToolbar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-slate-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AdminSearchInput({
  value,
  onChange,
  placeholder = "Tìm kiếm...",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={cn("relative block w-full sm:max-w-md", className)}>
      <span className="sr-only">{placeholder}</span>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        size={17}
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-11 w-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
      />
    </label>
  );
}

export function AdminSelect({
  label,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        className="min-h-11 w-full border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 sm:w-auto"
        {...props}
      />
    </label>
  );
}

type AdminStateProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
};

export function AdminLoadingState({
  title = "Đang tải dữ liệu",
  description = "Vui lòng chờ trong giây lát.",
  compact = false,
}: AdminStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-5 text-center",
        compact ? "min-h-40 py-8" : "min-h-72 py-14",
      )}
      role="status"
    >
      <LoaderCircle className="animate-spin text-orange-600" size={30} />
      <p className="mt-4 text-sm font-black text-slate-900">{title}</p>
      <p className="mt-1 text-xs font-medium text-slate-500">{description}</p>
    </div>
  );
}

export function AdminEmptyState({
  title = "Chưa có dữ liệu",
  description = "Dữ liệu mới sẽ xuất hiện tại đây.",
  action,
  compact = false,
}: AdminStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-5 text-center",
        compact ? "min-h-40 py-8" : "min-h-72 py-14",
      )}
    >
      <span className="grid h-12 w-12 place-items-center border border-slate-200 bg-slate-50 text-slate-400">
        <Inbox size={22} />
      </span>
      <p className="mt-4 text-sm font-black text-slate-900">{title}</p>
      <p className="mt-1 max-w-md text-xs font-medium leading-5 text-slate-500">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function AdminErrorState({
  title = "Không thể tải dữ liệu",
  description = "Đã có lỗi xảy ra. Vui lòng thử lại.",
  action,
  compact = false,
}: AdminStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-5 text-center",
        compact ? "min-h-40 py-8" : "min-h-72 py-14",
      )}
      role="alert"
    >
      <span className="grid h-12 w-12 place-items-center border border-red-200 bg-red-50 text-red-600">
        <AlertCircle size={22} />
      </span>
      <p className="mt-4 text-sm font-black text-slate-900">{title}</p>
      <p className="mt-1 max-w-md text-xs font-medium leading-5 text-slate-500">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function AdminModal({
  open,
  title,
  description,
  onClose,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  if (!open) return null;

  const widths = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <div
        className={cn(
          "flex max-h-[92vh] w-full flex-col border border-slate-200 bg-white shadow-2xl",
          widths[size],
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-black text-slate-950">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="acbt-icon-btn grid h-10 w-10 shrink-0 place-items-center text-slate-500 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            aria-label="Đóng hộp thoại"
          >
            <X size={19} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">{children}</div>
        {footer ? (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title = "Xác nhận thao tác",
  description,
  confirmLabel = "Xóa",
  cancelLabel = "Hủy",
  loading = false,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title?: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <AdminModal
      open={open}
      title={title}
      onClose={loading ? () => undefined : onClose}
      size="sm"
      footer={
        <>
          <Button variant="adminSecondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant="adminDanger"
            onClick={onConfirm}
            loading={loading}
            leftIcon={<TriangleAlert size={16} />}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-3 border border-red-100 bg-red-50 p-4">
        <TriangleAlert className="mt-0.5 shrink-0 text-red-600" size={20} />
        <p className="text-sm font-medium leading-6 text-red-800">{description}</p>
      </div>
    </AdminModal>
  );
}

export function AdminPagination({
  page,
  pageCount,
  totalItems,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
}) {
  const safePageCount = Math.max(pageCount, 1);
  const safePage = Math.min(Math.max(page, 1), safePageCount);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <span className="font-semibold">
        Trang {safePage}/{safePageCount}
        {typeof totalItems === "number" ? ` · ${totalItems} mục` : ""}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage <= 1}
          className="inline-flex min-h-9 items-center gap-1 border border-slate-200 px-3 font-bold text-slate-700 transition hover:border-orange-300 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={15} /> Trước
        </button>
        <button
          type="button"
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage >= safePageCount}
          className="inline-flex min-h-9 items-center gap-1 border border-slate-200 px-3 font-bold text-slate-700 transition hover:border-orange-300 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Sau <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

export function AdminFormField({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.08em] text-slate-700">
        {label}
        {required ? <span className="ml-1 text-red-600">*</span> : null}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-red-600">
          <AlertCircle size={13} /> {error}
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs leading-5 text-slate-500">{hint}</span>
      ) : null}
    </label>
  );
}
