import type { SearchResult } from "@/types/search";

export async function search(
  query: string,
  locale: "fr" | "en" = "fr"
): Promise<SearchResult[]> {
  if (query.trim().length < 2) return [];

  const response = await fetch(
    `/api/search?q=${encodeURIComponent(query)}&locale=${locale}`
  );

  if (!response.ok) {
    throw new Error("Search failed");
  }

  return response.json();
}
