"use client";

import React, { useMemo, useState } from "react";

import { Motion } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  FieldMapping,
  autoGenerateColumns,
} from "./components/auto-generate-columns";
import ErrorTable from "./components/error-table";
import LoadingTable from "./components/loading-table";
import { PaginationControls } from "./components/pagination-controls";

interface MassAction<Item> {
  label: string;
  action: (tabel: Item[]) => void;
}

export type TableProps<Item> = {
  data?: Item[];
  visibleProperties?: (keyof Item)[];
  fieldMapping: Partial<FieldMapping<Item>>;
  customColumns?: ColumnDef<Item>[];
  filterableColumns?: (keyof Item)[];
  filterPlaceholder?: string;
  pagination?: boolean;
  paginationOptions?: {
    pageSize: number;
    nextPage?: string;
    previousPage?: string;
  };
  massActions?: MassAction<Item>[];
  loading?: boolean;
  actions?: React.JSX.Element;
  rowCellClassName?: string;
  errorMessage?: string;
};

export function Table<Item>({
  data = [],
  visibleProperties,
  fieldMapping = {},
  customColumns = [],
  filterableColumns = [],
  filterPlaceholder = "Filter...",
  pagination = false,
  paginationOptions = { pageSize: 15 },
  massActions = [],
  loading = false,
  actions,
  rowCellClassName,
  errorMessage,
}: TableProps<Item>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [massAction, setMassAction] = useState<string | null>(null);

  const autoColumns = useMemo(() => {
    const baseColumns = autoGenerateColumns(
      data,
      visibleProperties,
      fieldMapping
    );

    if (massActions.length > 0) {
      const selectionColumn: ColumnDef<Item> = {
        accessorKey: "selection",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
      };

      return [selectionColumn, ...baseColumns];
    }

    return baseColumns;
  }, [data, visibleProperties, fieldMapping, massActions.length]);

  const columns = useMemo(
    () => (customColumns.length > 0 ? customColumns : autoColumns),
    [autoColumns, customColumns]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(pagination && {
      getPaginationRowModel: getPaginationRowModel(),
      initialState: { pagination: { pageSize: paginationOptions.pageSize } },
    }),
    globalFilterFn: (row, columnId, filterValue) => {
      if (filterableColumns.includes(columnId as keyof Item)) {
        const cellValue = row.getValue(columnId)?.toString()?.toLowerCase();
        return cellValue?.includes(filterValue.toLowerCase()) ?? false;
      }
      return false;
    },
  });

  const handleApplyMassAction = () => {
    if (!massAction) return;
    const action = massActions.find((action) => action.label === massAction);
    if (action) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);

      action.action(selectedRows);
    }
  };

  if (loading) {
    return (
      <LoadingTable
        usesMassActions={massActions.length > 0}
        pagination={pagination}
        visibleProperties={visibleProperties}
        fieldMapping={fieldMapping}
      />
    );
  }

  if (errorMessage) {
    return (
      <ErrorTable
        columns={columns}
        errorMessage={errorMessage}
        fieldMapping={fieldMapping}
        filterPlaceholder={filterPlaceholder}
        filterableColumns={filterableColumns}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        table={table}
      />
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        {filterableColumns.length > 0 && (
          <Input
            placeholder={filterPlaceholder}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        )}

        {actions ? actions : null}

        {massActions.length > 0 && (
          <div className="hidden gap-x-2 sm:flex">
            <div>
              <Select onValueChange={setMassAction}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Mass actions</SelectLabel>

                    {massActions &&
                      massActions.map((action, index) => (
                        <SelectItem key={index} value={action.label}>
                          {action.label.charAt(0).toUpperCase() +
                            action.label.slice(1)}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Motion whileTap={{ scale: 0.95 }}>
              <Button disabled={!massAction} onClick={handleApplyMassAction}>
                Apply
              </Button>
            </Motion>
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <TableComponent>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className={rowCellClassName}>
                  {row.getVisibleCells().map((cell) => {
                    const fieldConfig =
                      fieldMapping[cell.column.id as keyof Item] || {};
                    const className = fieldConfig.className || "";

                    return (
                      <TableCell key={cell.id} className={className}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  Ingen data tilgængelig
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableComponent>
      </div>

      {pagination && (
        <PaginationControls
          table={table}
          paginationOptions={paginationOptions}
        />
      )}
    </div>
  );
}
