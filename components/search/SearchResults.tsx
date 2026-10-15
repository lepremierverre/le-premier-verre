"use client";

import type { SearchResult } from "@/types/search";
import { SearchItem } from "./SearchItem";

export function SearchResults({
  results,
  onNavigate,
  locale = "fr",
}: {
  results?: SearchResult[];
  onNavigate?: () => void;
  locale?: "fr" | "en";
}) {
  const isEn = locale === "en";

  if (!results?.length) {
    return (
      <div className="px-6 py-10 md:px-8 md:py-12">
        <p className="text-sm text-[var(--lpv-muted)]">
          {isEn ? "No results." : "Aucun résultat."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {results.map((item) => (
        <SearchItem
          key={item._id}
          result={item}
          onNavigate={onNavigate}
          locale={locale}
        />
      ))}
    </div>
  );
}
