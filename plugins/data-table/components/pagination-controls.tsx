import { cn } from "@/lib/utils";

import { Table } from "@tanstack/react-table";

import { TableProps } from "../table";
import Link from "next/link";

interface PaginationControlsProps<I> {
  table: Table<I>;
  paginationOptions: TableProps<I>["paginationOptions"];
}

export const PaginationControls = <I,>({
  table,
  paginationOptions,
}: PaginationControlsProps<I>) => {
  return (
    <div className="mt-10 flex items-center">
      <div className="space-x-2">
        <Link
          href={
            paginationOptions?.previousPage
              ? paginationOptions.previousPage
              : "#"
          }
          className={cn(
            "focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium whitespace-nowrap shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-hidden",
            !paginationOptions?.previousPage && "pointer-events-none opacity-50"
          )}
        >
          Sidste
        </Link>

        <Link
          href={paginationOptions?.nextPage ? paginationOptions.nextPage : "#"}
          className={cn(
            "focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium whitespace-nowrap shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-hidden",
            !paginationOptions?.nextPage && "pointer-events-none opacity-50"
          )}
        >
          Næste
        </Link>
      </div>

      <div className="ml-6 text-sm">
        Viser {table.getState().pagination.pageIndex + 1} af{" "}
        {table.getPageCount() || 1}
      </div>
    </div>
  );
};
