"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, StarIcon, XIcon } from "lucide-react";
import { useMemo, useState } from "react";
import debounce from "lodash.debounce";
import axios from "axios";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { starColors } from "@/utils/stars";

interface SearchWorkplaceProps {
  isMobile: boolean;
}

export default function SearchWorkplace({ isMobile }: SearchWorkplaceProps) {
  const [query, setQuery] = useState<string>("");
  const [mobileQuery, setMobileQuery] = useState<string>("");
  const [results, setResults] = useState<Workplace[]>([]);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [mobileInputFocused, setMobileInputFocused] = useState<boolean>(false);

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

  const handleOnFocus = () => {
    if (isMobile) {
      setMobileInputFocused(true);
      return;
    }

    setIsInputFocused(true);
  };

  const cleanDomain = (domain: string) => {
    return domain
      .replace(/(^\w+:|^)\/\//, "")
      .replace(/\/$/, "")
      .replace(/\/$/, "");
  };

  return (
    <div className="mx-13.5 mt-10 group relative">
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            handleSearch(e.target.value);
          }}
          onFocus={handleOnFocus}
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

      {isMobile && mobileInputFocused && (
        <>
          <div className="fixed inset-0 z-10 bg-black/50" />

          <div
            onClick={() => {
              if (!results.length) {
                setMobileInputFocused(false);
              }
            }}
            className="fixed inset-0 z-20"
          >
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => e.stopPropagation()}
                className="absolute top-1/2 left-3 -translate-y-1/2"
              >
                <SearchIcon className="text-primary size-5!" />
              </Button>

              <Input
                autoFocus
                value={mobileQuery}
                onChange={(e) => {
                  setMobileQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                placeholder="Søg efter en læreplads"
                className="pl-13 pr-15 h-20 bg-background rounded-none shadow-lg md:text-base transition-none ring-0! border-border!"
              />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileInputFocused(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <XIcon className="size-5!" />
              </Button>
            </div>

            {results.length > 0 && (
              <div className="h-full bg-background pt-3 pb-6 overflow-y-auto">
                <h4 className="px-6 py-2 text-xs">Lærepladser</h4>

                {results.map((workplace) => {
                  const colors = starColors(Number(workplace.stars));

                  return (
                    <Link
                      key={workplace.uuid}
                      href={ROUTES.REVIEW(workplace.uuid)}
                      className="px-6 py-3 hover:bg-primary/10 flex items-center h-16 justify-between"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <h4>{workplace.name}</h4>

                        {workplace.website && (
                          <div className="text-sm text-muted-foreground truncate">
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
                          <StarIcon
                            color="white"
                            fill="white"
                            className="size-3"
                          />
                        </div>

                        <h4 className="text-sm font-medium">
                          {workplace.stars}
                        </h4>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {!isMobile && results.length > 0 && (
        <div
          className={cn(
            "pt-3 bg-background hidden absolute top-16 left-0 w-full border-x border-b group-hover:block rounded-b-4xl overflow-hidden pb-6",
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
                <div className="flex-1 min-w-0 pr-2">
                  <h4>{workplace.name}</h4>

                  {workplace.website && (
                    <div className="text-sm text-muted-foreground truncate">
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
