"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { search } from "@/lib/search/search";

export function useSearch(query: string, locale: "fr" | "en" = "fr") {
  const [debounced] = useDebounce(query, 250);

  return useQuery({
    queryKey: ["search", locale, debounced],
    queryFn: () => search(debounced, locale),
    enabled: debounced.length >= 2,
  });
}
