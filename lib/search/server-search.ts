import { client } from "@/sanity/lib/client";
import type { SearchResult } from "@/types/search";

export type SearchLocale = "fr" | "en";

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

  return client.fetch<SearchResult[]>(
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
        _id,
        _type,
        "title": select(
          $locale == "en" => coalesce(titleEn, nameEn, title, name),
          coalesce(title, name)
        ),
        "slug": slug.current
      }
    `,
    {
      search: query,
      locale,
    }
  );
}
