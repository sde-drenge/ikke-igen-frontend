import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import TimeAgo from "@/lib/time-ago";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { BooleanCell } from "./cells/boolean";
import { IMenu, Menu } from "./cells/menu";
import { Uuid } from "./cells/uuid";

export type FieldConfig<Item> = {
  header?: string;
  type?: "uuid" | "menu" | "time-ago";
  visableCharacters?: number;
  headerClassName?: string;
  sortable?: boolean;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cell?: React.ComponentType<{ value: any; item: Item } & any>;
  customCellProps?: Record<string, unknown>;
  filterable?: {
    label: string;
    filterValue: string | number | boolean;
  }[];
};

export type FieldMapping<Item> = Record<keyof Item, FieldConfig<Item>>;

function OmitProperties<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

export function autoGenerateColumns<Item>(
  data: Item[],
  visibleProperties?: (keyof Item)[],
  fieldMapping: Partial<FieldMapping<Item>> = {}
): ColumnDef<Item>[] {
  if (!data || data.length === 0) return [];

  const firstRow = data[0];
  const keys =
    visibleProperties ||
    (firstRow ? (Object.keys(firstRow) as (keyof Item)[]) : []);

  return keys.map((key) => {
    const fieldConfig = fieldMapping[key] || {};
    const header =
      fieldConfig.header ||
      (key as string).charAt(0).toUpperCase() + (key as string).slice(1);

    const truncate = (value: string | number) => {
      if (typeof value === "string" && value.length > 50) {
        return `${value.slice(0, 50)}...`;
      } else {
        return value;
      }
    };

    return {
      accessorKey: key,
      header: ({ column, table }) => {
        const filterOptions = fieldConfig.filterable;

        if (filterOptions) {
          return (
            <Select
              value={
                (table.getColumn(key as string)?.getFilterValue() as string) ||
                ""
              }
              onValueChange={(value) => {
                table
                  .getColumn(key as string)
                  ?.setFilterValue(value === "all" ? undefined : value);
              }}
            >
              <SelectTrigger className="h-8 w-fit space-x-3">
                <SelectValue placeholder={header} />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">{header}</SelectItem>

                {filterOptions.map((opt, i) => (
                  <SelectItem key={i} value={String(opt.filterValue)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        } else if (fieldConfig.sortable) {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {header}

              <ArrowUpDown />
            </Button>
          );
        } else {
          return header;
        }
      },
      cell: ({ row }) => {
        const value = row.getValue(key as string);
        const item = OmitProperties(
          row.original as Item & { menu?: unknown; shortcuts?: unknown },
          ["menu", "shortcuts"]
        ) as Item;

        if (fieldConfig.cell) {
          const CustomCell = fieldConfig.cell;
          return (
            <CustomCell
              value={value}
              item={item}
              {...fieldConfig.customCellProps}
            />
          );
        }

        if (fieldConfig.type === "menu" && Array.isArray(value)) {
          return <Menu value={value as IMenu<Item>[]} item={item} />;
        }

        if (fieldConfig.type === "uuid") {
          return (
            <Uuid
              uuid={value as string}
              visableCharacters={fieldConfig.visableCharacters}
            />
          );
        }

        if (typeof value === "boolean") {
          return <BooleanCell value={value as boolean} />;
        }

        if (Array.isArray(value)) {
          return (
            <span>
              {value.length} {value.length === 1 ? "genstand" : "genstande"}
            </span>
          );
        }

        if (
          fieldConfig.type === "time-ago" &&
          new Date(value as string).toString() !== "Invalid Date"
        ) {
          const timeAgo = new TimeAgo("da-DK");
          return <span>{timeAgo.format(new Date(value as string))}</span>;
        }

        return <span>{truncate(value as string)}</span>;
      },

      filterFn: fieldConfig.filterable
        ? (row, columnId, filterValue) => {
            const cellValue = row.getValue(columnId);
            return String(cellValue) === filterValue;
          }
        : undefined,
    };
  });
}
