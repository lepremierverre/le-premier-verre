export type WineCatalogLocale = "fr" | "en";

export type WineCatalogItem = {
  name: string;
  beverageType?: "wine" | "cider";
  alcoholFree?: boolean;
  color?: string;
  style?: string;
  appleVarieties?: string[];
  saqPrice?: number;
  producer?: {
    name?: string;
  };
  country?: {
    name?: string;
  };
  region?: {
    name?: string;
  };
  appellation?: {
    name?: string;
  };
};

export type WineCatalogFilters = {
  q?: string;
  type?: string;
  color?: string;
  country?: string;
  region?: string;
  price?: string;
};

export function normalizeCatalogQuery(
  value: string | undefined,
  locale: WineCatalogLocale
) {
  return (value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase(locale === "fr" ? "fr-CA" : "en-CA");
}

export function filterWineCatalog<T extends WineCatalogItem>(
  wines: T[],
  filters: WineCatalogFilters,
  locale: WineCatalogLocale
): T[] {
  const query = normalizeCatalogQuery(filters.q, locale);
  const selectedType = filters.type ?? "";
  const selectedColor = filters.color ?? "";
  const selectedCountry = filters.country ?? "";
  const selectedRegion = filters.region ?? "";
  const selectedPrice = filters.price ?? "";

  return wines.filter((wine) => {
    const searchableText = normalizeCatalogQuery(
      [
        wine.name,
        wine.producer?.name,
        wine.country?.name,
        wine.region?.name,
        wine.appellation?.name,
        wine.color,
        wine.style,
        ...(wine.appleVarieties ?? []),
        wine.beverageType === "cider"
          ? locale === "fr"
            ? "cidre"
            : "cider"
          : locale === "fr"
            ? "vin"
            : "wine",
        wine.alcoholFree
          ? locale === "fr"
            ? "sans alcool"
            : "alcohol free"
          : "",
      ]
        .filter(Boolean)
        .join(" "),
      locale
    );

    return (
      (!query || searchableText.includes(query)) &&
      (
        !selectedType ||
        (selectedType === "wine" &&
          (wine.beverageType ?? "wine") === "wine") ||
        (selectedType === "cider" && wine.beverageType === "cider") ||
        (selectedType === "alcohol-free" && wine.alcoholFree === true)
      ) &&
      (!selectedColor || wine.color === selectedColor) &&
      (!selectedCountry || wine.country?.name === selectedCountry) &&
      (!selectedRegion || wine.region?.name === selectedRegion) &&
      (
        !selectedPrice ||
        (
          typeof wine.saqPrice === "number" &&
          (
            (selectedPrice === "under-20" && wine.saqPrice < 20) ||
            (selectedPrice === "20-30" &&
              wine.saqPrice >= 20 &&
              wine.saqPrice < 30) ||
            (selectedPrice === "30-40" &&
              wine.saqPrice >= 30 &&
              wine.saqPrice < 40) ||
            (selectedPrice === "40-60" &&
              wine.saqPrice >= 40 &&
              wine.saqPrice < 60) ||
            (selectedPrice === "60-plus" && wine.saqPrice >= 60)
          )
        )
      )
    );
  });
}

export async function getFilteredWineCatalog(
  filters: WineCatalogFilters,
  locale: WineCatalogLocale
) {
  const [{ client }, { winesQuery }] = await Promise.all([
    import("@/sanity/lib/client"),
    import("@/sanity/lib/queries"),
  ]);

  const wines = await client.fetch<WineCatalogItem[]>(winesQuery);

  return filterWineCatalog(wines, filters, locale);
}
