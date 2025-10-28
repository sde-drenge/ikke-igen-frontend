"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, StarIcon } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import debounce from "lodash.debounce";
import axios from "axios";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

export default function SearchWorkplace() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Workplace[]>([]);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  const handleSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query) {
          setResults([]);
          return;
        }

        try {
          const response = await axios.get<WorkplacePagination>(
            `/api/search-workplace?search=${query}`
          );

          const results = response.data.results;
          console.log(results);
          setResults(results);

          if (results.length > 0) {
            return;
          }
        } catch (err) {
          console.log("error", err);
        }
      }, 250),
    []
  );

  const cleanDomain = (domain: string) => {
    return domain
      .replace(/(^\w+:|^)\/\//, "")
      .replace(/\/$/, "")
      .replace(/\/$/, "");
  };

  const starColors = (
    stars: number
  ): {
    star: string;
    background: string;
  } => {
    if (stars >= 4) {
      return { star: "bg-green-400", background: "bg-green-200" };
    }

    if (stars >= 3) {
      return { star: "bg-yellow-400", background: "bg-yellow-200" };
    }

    if (stars >= 2) {
      return { star: "bg-orange-400", background: "bg-orange-200" };
    }

    return { star: "bg-gray-400", background: "bg-gray-200" };
  };

  return (
    <div className="mx-13.5 mt-10 group">
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            handleSearch(e.target.value);
          }}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          placeholder="Søg efter en læreplads"
          className={cn(
            "pl-6 pr-15 h-16 bg-background shadow-lg rounded-4xl md:text-base transition-none ring-0! border-border!",
            results.length > 0 &&
              "group-hover:rounded-b-none group-hover:shadow-none",
            isInputFocused && results.length > 0 && "rounded-b-none shadow-none"
          )}
        />
        <Button
          variant="ghost"
          className="absolute size-11 top-1/2 -translate-y-1/2 right-3 rounded-full bg-primary hover:bg-primary/80 text-secondary-foreground!"
        >
          <SearchIcon />
        </Button>
      </div>

      {results.length > 0 && (
        <div
          className={cn(
            "pt-3 bg-background hidden border-x border-b group-hover:block rounded-b-4xl overflow-hidden pb-6",
            isInputFocused && "block"
          )}
        >
          <h4 className="px-6 py-2 text-xs">Lærepladser</h4>

          {results.map((workplace) => {
            const colors = starColors(Number(workplace.stars));

            return (
              <Link
                key={workplace.uuid}
                href={ROUTES.REVIEW(workplace.uuid)}
                className="px-6 py-3 hover:bg-primary/10 flex items-center h-16 justify-between"
              >
                <div>
                  <h4>{workplace.name}</h4>
                  {workplace.website && (
                    <div className="text-sm text-muted-foreground">
                      <span>{cleanDomain(workplace.website)}</span>
                      <span className="mx-1">•</span>
                      <span>{workplace.amountOfReviews} anmeldelser</span>
                    </div>
                  )}
                </div>

                <div
                  className={cn(
                    "p-1 gap-1 flex rounded-sm items-center",
                    colors.background
                  )}
                >
                  <div
                    className={cn(
                      "size-4 flex items-center justify-center",
                      colors.star
                    )}
                  >
                    <StarIcon color="white" fill="white" className="size-3" />
                  </div>

                  <h4 className="text-sm font-medium">{workplace.stars}</h4>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
