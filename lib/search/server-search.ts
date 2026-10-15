import { client } from "@/sanity/lib/client";
import type { SearchResult } from "@/types/search";

export type SearchLocale = "fr" | "en";

function normalizeSearchValue(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function levenshteinDistance(a: string, b: string): number {
  const previous = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i++) {
    const current = [i];

    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }

    for (let j = 0; j < current.length; j++) {
      previous[j] = current[j];
    }
  }

  return previous[b.length];
}

function isFlexibleMatch(title: string, query: string): boolean {
  const normalizedTitle = normalizeSearchValue(title);
  const normalizedQuery = normalizeSearchValue(query);
  if (normalizedTitle.includes(normalizedQuery)) {
    return true;
  }

  if (normalizedQuery.length < 4) {
    return false;
  }

  const words = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

  const queryWords = query
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

  return queryWords.every((queryWord) =>
    words.some((titleWord) => {
      if (titleWord.includes(queryWord) || queryWord.includes(titleWord)) {
        return true;
      }

      const maxDistance =
        queryWord.length >= 8 ? 2 :
        queryWord.length >= 4 ? 1 :
        0;

      return levenshteinDistance(titleWord, queryWord) <= maxDistance;
    })
  );
}

export async function searchSanity(
  rawQuery: string,
  locale: SearchLocale = "fr",
  limit = 50
): Promise<SearchResult[]> {
  const query = rawQuery.trim();

  if (query.length < 2) {
    return [];
  }

  const safeLimit = Math.max(1, Math.min(Math.trunc(limit), 50));

  const languageMatch =
    locale === "en"
      ? `(
          name match $search + "*" ||
          title match $search + "*" ||
          nameEn match $search + "*" ||
          titleEn match $search + "*"
        )`
      : `(
          name match $search + "*" ||
          title match $search + "*"
        )`;

  const projection = `
    _id,
    _type,
    "title": select(
      $locale == "en" => coalesce(titleEn, nameEn, title, name),
      coalesce(title, name)
    ),
    "slug": slug.current
  `;

  const regularResults = await client.fetch<SearchResult[]>(
    `
      *[
        !(_id in path("drafts.**")) &&
        (
          _type == "wine" ||
          _type == "producer" ||
          _type == "country" ||
          _type == "region" ||
          (_type == "grape" && slug.current != "assemblage-cepages-hybrides") ||
          _type == "article" ||
          _type == "guide"
        ) &&
        ${languageMatch} &&
        (
          !defined(published) ||
          published == true
        )
      ][0...${safeLimit}] {
        ${projection}
      }
    `,
    {
      search: query,
      locale,
    }
  );

  const allCandidates = await client.fetch<SearchResult[]>(
    `
      *[
        !(_id in path("drafts.**")) &&
        (
          _type == "wine" ||
          _type == "producer" ||
          _type == "country" ||
          _type == "region" ||
          (_type == "grape" && slug.current != "assemblage-cepages-hybrides") ||
          _type == "article" ||
          _type == "guide"
        ) &&
        (
          !defined(published) ||
          published == true
        )
      ] {
        ${projection}
      }
    `,
    {
      locale,
    }
  );

  const normalizedQuery = normalizeSearchValue(query);

  const flexibleResults = allCandidates.filter((item) =>
    isFlexibleMatch(item.title || "", query)
  );

  const combined = [...regularResults];

  for (const item of flexibleResults) {
    if (!combined.some((existing) => existing._id === item._id)) {
      combined.push(item);
    }
  }

  return combined.slice(0, safeLimit);
}
