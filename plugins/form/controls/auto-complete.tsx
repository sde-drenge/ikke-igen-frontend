"use client";

import { useMemo, useState } from "react";

import Image from "next/image";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";

import { Command as CommandPrimitive } from "cmdk";
import initials from "initials";
import { Check } from "lucide-react";

export type AutocompleteControlOption<T extends string> =
  | {
      value: T;
      label: string;
      icon: string | null;
      color: string;
    }
  | {
      value: T;
      label: string;
      icon: false;
    };

type AutocompleteControlProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  onInputChange?: (inputValue: string) => void;
  options: AutocompleteControlOption<T>[];
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
  emptyMessage?: string;
  placeholder?: string;
};

export default function AutocompleteControl<T extends string>({
  value,
  onChange,
  onInputChange,
  options,
  isLoading,
  setIsLoading,
  placeholder = "Search...",
  emptyMessage = "No items.",
}: AutocompleteControlProps<T>) {
  const [open, setOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(value || "");

  const labels = useMemo(
    () =>
      options.reduce((acc, option) => {
        acc[option.value] = option.label;
        return acc;
      }, {} as Record<string, string>),
    [options]
  );

  const onSelectItem = (selected: string) => {
    onChange(selected as T);
    setInputValue(labels[selected] || "");
    setOpen(false);
  };

  const handleInputValueChange = (val: string) => {
    if (val === inputValue) return;

    setIsLoading?.(true);

    setInputValue(val);
    setOpen(val.length > 0);

    if (onInputChange) {
      onInputChange(val);
    }
  };

  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false} className="overflow-visible">
          <PopoverAnchor asChild>
            <CommandPrimitive.Input
              asChild
              value={inputValue}
              onValueChange={(val) => handleInputValueChange(val)}
              onKeyDown={(e) => setOpen(e.key !== "Escape")}
              onMouseDown={() => setOpen((open) => !!inputValue || !open)}
              onFocus={() => setOpen(true)}
            >
              <Input placeholder={placeholder} />
            </CommandPrimitive.Input>
          </PopoverAnchor>

          {!open && <CommandList aria-hidden="true" className="hidden" />}

          <PopoverContent
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (
                e.target instanceof Element &&
                e.target.hasAttribute("cmdk-input")
              ) {
                e.preventDefault();
              }
            }}
            className="pointer-events-auto w-(--radix-popover-trigger-width) p-0"
          >
            {inputValue.length > 0 && (
              <CommandList>
                {isLoading && (
                  <CommandPrimitive.Loading>
                    <div className="p-1">
                      <Skeleton className="h-9 w-full" />
                    </div>
                  </CommandPrimitive.Loading>
                )}

                {options.length > 0 && !isLoading ? (
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onMouseDown={(e) => e.preventDefault()}
                        onSelect={onSelectItem}
                      >
                        {option.icon ? (
                          <Image
                            src={option.icon}
                            alt={option.label}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        ) : option.icon !== false ? (
                          <div
                            style={{ backgroundColor: option.color }}
                            className="flex size-6 items-center justify-center rounded-full"
                          >
                            <span className="text-primary-foreground text-xs">
                              {initials(option.label)}
                            </span>
                          </div>
                        ) : null}

                        {option.label}

                        <Check
                          className={cn(
                            "absolute right-2 mr-2 h-4 w-4",
                            value === option.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : null}

                {!isLoading ? (
                  <CommandEmpty className="py-3 text-center text-sm">
                    {emptyMessage}
                  </CommandEmpty>
                ) : null}
              </CommandList>
            )}
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}
