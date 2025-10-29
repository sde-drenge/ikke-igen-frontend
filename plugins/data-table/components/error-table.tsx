import React from "react";

import { Motion } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ColumnDef, Table, flexRender } from "@tanstack/react-table";
import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";

import { TableProps } from "../table";

interface ErrorTableProps<Item> {
  filterableColumns: TableProps<Item>["filterableColumns"];
  filterPlaceholder: TableProps<Item>["filterPlaceholder"];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  table: Table<Item>;
  fieldMapping: TableProps<Item>["fieldMapping"];
  columns: ColumnDef<Item>[];
  errorMessage: TableProps<Item>["errorMessage"];
}

export default function ErrorTable<Item>({
  filterableColumns,
  filterPlaceholder,
  globalFilter,
  setGlobalFilter,
  table,
  fieldMapping,
  columns,
  errorMessage,
}: ErrorTableProps<Item>) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        {filterableColumns!.length > 0 && (
          <Input
            placeholder={filterPlaceholder}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            disabled
            className="max-w-sm"
          />
        )}
      </div>

      <div className="border-destructive rounded-lg border">
        <TableComponent>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-destructive">
                {headerGroup.headers.map((header) => {
                  const fieldConfig =
                    fieldMapping[header.column.id as keyof Item] || {};
                  const className = fieldConfig.headerClassName || "";
                  return (
                    <TableHead key={header.id} className={className}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                <div className="text-destructive flex flex-col items-center justify-center gap-4 py-12">
                  <AlertCircleIcon className="size-7" />

                  <p>{errorMessage}</p>

                  <Motion whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => window.location.reload()}
                      variant="destructive"
                      className="mt-2 px-6 py-3"
                    >
                      <RefreshCwIcon className="mr-2 size-4" />
                      Genindlæs
                    </Button>
                  </Motion>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </TableComponent>
      </div>
    </div>
  );
}
