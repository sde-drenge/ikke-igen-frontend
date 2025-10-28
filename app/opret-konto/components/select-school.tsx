"use client";

import { Control } from "@/plugins/form";
import AutocompleteControl, {
  AutocompleteControlOption,
} from "@/plugins/form/controls/auto-complete";
import axios from "axios";
import debounce from "lodash.debounce";
import { useMemo, useState } from "react";

type Option = AutocompleteControlOption<string>;

export default function SelectSchool() {
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
          const response = await axios.get<SchoolPagination>(
            `/api/search-school?search=${query}`
          );

          const data = response.data;

          const refinedData = data.results.map((result) => ({
            label: result.name,
            value: result.uuid,
            icon: false as const,
          }));

          setResults(refinedData);

          if (refinedData.length > 0) {
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.log("error", err);
        }

        setIsLoading(false);
      }, 250),
    []
  );

  return (
    <Control
      input={AutocompleteControl}
      name="schoolUuid"
      placeholder="Søg efter din skole"
      emptyMessage="Ingen skoler fundet"
      options={results}
      label="Vælg skole"
      onInputChange={handleSearch}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      wrapperClassName="flex-1"
    />
  );
}
