"use client";

import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useState } from "react";
import { AdminEmptyState } from "./AdminPrimitives";
import { cn } from "@/components/ui/Button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
  emptyTitle = "Không có dữ liệu",
  emptyDescription = "Không có mục nào phù hợp với điều kiện hiện tại.",
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    autoResetPageIndex: true,
    state: { sorting },
    initialState: {
      pagination: { pageSize },
    },
  });

  if (data.length === 0) {
    return (
      <AdminEmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageCount = Math.max(table.getPageCount(), 1);

  return (
    <div className={cn("space-y-0", className)}>
      <div className="max-w-full overflow-x-auto border border-slate-200 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm text-slate-700">
          <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-[0.06em] text-slate-500">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  const sorted = header.column.getIsSorted();
                  const isLast = index === headerGroup.headers.length - 1;
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      className={cn(
                        "whitespace-nowrap px-4 py-3.5 sm:px-5",
                        isLast &&
                          "sticky right-0 z-20 border-l border-slate-100 bg-slate-50 text-right",
                      )}
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn(
                            "inline-flex items-center gap-1.5 transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
                            isLast && "ml-auto",
                          )}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {sorted === "asc" ? (
                            <ArrowUp size={13} />
                          ) : sorted === "desc" ? (
                            <ArrowDown size={13} />
                          ) : (
                            <ArrowUpDown size={13} className="opacity-45" />
                          )}
                        </button>
                      ) : (
                        <div className={cn(isLast && "text-right")}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="bg-white transition-colors hover:bg-orange-50/35"
              >
                {row.getVisibleCells().map((cell, index) => {
                  const isLast = index === row.getVisibleCells().length - 1;
                  return (
                    <td
                      key={cell.id}
                      className={cn(
                        "px-4 py-4 align-top sm:px-5",
                        isLast &&
                          "sticky right-0 z-[5] border-l border-slate-100 bg-inherit text-right shadow-[-8px_0_14px_-14px_rgba(15,23,42,0.35)]",
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-x border-b border-slate-200 bg-white px-4 py-3 text-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-slate-500">
          <span className="font-semibold">
            Trang {currentPage}/{pageCount} · {data.length} mục
          </span>
          <label className="hidden items-center gap-2 sm:flex">
            <span>Số dòng</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(event) => table.setPageSize(Number(event.target.value))}
              className="border border-slate-200 bg-white px-2 py-1 font-bold text-slate-700 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              aria-label="Số dòng mỗi trang"
            >
              {[10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-center gap-1.5">
          <PaginationButton
            label="Trang đầu"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(0)}
            className="hidden sm:grid"
          >
            <ChevronsLeft size={16} />
          </PaginationButton>
          <PaginationButton
            label="Trang trước"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft size={16} />
          </PaginationButton>
          <PaginationButton
            label="Trang sau"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <ChevronRight size={16} />
          </PaginationButton>
          <PaginationButton
            label="Trang cuối"
            disabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(pageCount - 1)}
            className="hidden sm:grid"
          >
            <ChevronsRight size={16} />
          </PaginationButton>
        </div>
      </div>
    </div>
  );
}

function PaginationButton({
  label,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "grid h-9 w-9 place-items-center border border-slate-200 text-slate-600 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-35",
        className,
      )}
      {...props}
    />
  );
}
