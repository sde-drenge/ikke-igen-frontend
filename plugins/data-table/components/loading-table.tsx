import React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TableProps } from "../table";

interface LoadingTableProps<Item> {
  usesMassActions: boolean;
  pagination: boolean;
  visibleProperties: TableProps<Item>["visibleProperties"];
  fieldMapping: TableProps<Item>["fieldMapping"];
}

export default function LoadingTable<Item>({
  usesMassActions,
  pagination,
  visibleProperties,
  fieldMapping,
}: LoadingTableProps<Item>) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Skeleton className="h-8 w-96 max-w-sm" />

        {usesMassActions && <Skeleton className="h-8 w-56" />}
      </div>

      <div className="rounded-md border">
        <TableComponent>
          <TableHeader>
            <TableRow>
              {visibleProperties?.map((visibleProperty, index) => {
                const fieldConfig = fieldMapping[visibleProperty] || {};

                const header =
                  fieldConfig.header ||
                  (visibleProperty as string).charAt(0).toUpperCase() +
                    (visibleProperty as string).slice(1);

                const className = fieldConfig.headerClassName || "";

                return (
                  <TableHead key={index} className={className}>
                    <span>{header}</span>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {[...Array(10)].map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {visibleProperties?.map((visibleproperty, cellIndex) => {
                  const fieldConfig = fieldMapping[visibleproperty] || {};
                  const className = fieldConfig.className || "";
                  return (
                    <TableCell key={cellIndex} className={className}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </TableComponent>
      </div>

      {pagination && <Skeleton className="mt-10 h-8 w-64 max-w-sm" />}
    </div>
  );
}
