"use client";

import { Control } from "@/plugins/form";
import AutocompleteControl, {
  AutocompleteControlOption,
} from "@/plugins/form/controls/auto-complete";
import axios from "axios";
import debounce from "lodash.debounce";
import { useMemo, useState } from "react";

type Option = AutocompleteControlOption<string>;

export default function SelectEducation() {
  const [results, setResults] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query) {
          setResults([]);
          setIsLoading(false);
          return;
        }

        try {
          const response = await axios.get<string[]>(
            `/api/search-education?search=${query}`
          );

          const data = response.data;

          const refinedData = data.map((result) => ({
            label: result,
            value: result,
            icon: false as const,
          }));

          console.log(refinedData);

          setResults(refinedData);

          if (refinedData.length > 0) {
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.log("error", err);
        }

        setIsLoading(false);
      }, 500),
    []
  );

  return (
    <Control
      input={AutocompleteControl}
      name="education"
      placeholder="Søg efter din uddanelse"
      emptyMessage="Ingen uddannelser fundet"
      options={results}
      label="Vælg uddannelse"
      onInputChange={handleSearch}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      wrapperClassName="flex-1"
    />
  );
}
