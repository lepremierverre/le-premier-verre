"use client";

import Link from "next/link";
import type { SearchResult } from "@/types/search";
import {
  buildSearchHref,
  getSearchTypeLabel,
  type SearchLocale,
} from "@/lib/search/search-utils";

export function SearchItem({
  result,
  onNavigate,
  locale = "fr",
}: {
  result: SearchResult;
  onNavigate?: () => void;
  locale?: SearchLocale;
}) {
  return (
    <Link
      href={buildSearchHref(result, locale)}
      onClick={onNavigate}
      className="group flex items-center justify-between gap-6 border-b border-[var(--lpv-line)] px-6 py-5 transition-opacity last:border-b-0 hover:opacity-55 md:px-8 md:py-6"
    >
      <div className="min-w-0">
        <h3 className="lpv-display text-[clamp(1.65rem,3vw,2.35rem)] leading-none tracking-[-0.02em]">
          {result.title}
        </h3>

        <p className="mt-2 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-[var(--lpv-muted)]">
          {getSearchTypeLabel(result._type, locale)}
        </p>
      </div>

      <span
        aria-hidden="true"
        className="shrink-0 text-sm transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
