"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export default function SearchWorkplace() {
  return (
    <div className="px-13.5 mt-10">
      <div className="relative">
        <Input
          placeholder="Søg efter en læreplads"
          className="pl-6 pr-15 h-16 bg-background shadow-lg rounded-4xl md:text-base"
        />
        <Button
          variant="ghost"
          className="absolute cursor-pointer size-11 top-1/2 -translate-y-1/2 right-3 rounded-full bg-secondary/70 hover:bg-secondary/60 text-secondary-foreground!"
        >
          <SearchIcon />
        </Button>
      </div>
    </div>
  );
}
