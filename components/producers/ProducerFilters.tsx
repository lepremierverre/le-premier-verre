"use client";

import { useRouter } from "next/navigation";

type FilterOption = {
  name: string;
  slug: string;
};

type ProducerFiltersProps = {
  countries: FilterOption[];
  regions: FilterOption[];
  selectedCountry: string;
  selectedRegion: string;
  locale?: "fr" | "en";
};

export default function ProducerFilters({
  countries,
  regions,
  selectedCountry,
  selectedRegion,
  locale = "fr",
}: ProducerFiltersProps) {
  const router = useRouter();
  const isEnglish = locale === "en";

  function navigate(country: string, region: string) {
    const params = new URLSearchParams();

    if (country) {
      params.set(isEnglish ? "country" : "pays", country);
    }

    if (region) {
      params.set("region", region);
    }

    const query = params.toString();

    const basePath = isEnglish ? "/en/producers" : "/producteurs";
    const anchor = isEnglish ? "#directory" : "#repertoire";

    router.push(query ? `${basePath}?${query}${anchor}` : `${basePath}${anchor}`);
  }

  const hasFilters = selectedCountry || selectedRegion;

  return (
    <div className="border-y border-[var(--lpv-line)]">
      <div className="grid md:grid-cols-[1fr_auto_auto_auto] md:items-stretch">
        <div className="flex items-center py-5 md:pr-10">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--lpv-cocoa)]">
            {isEnglish ? "Refine the directory" : "Affiner le répertoire"}
          </p>
        </div>

        <label className="group flex min-w-[230px] items-center border-t border-[var(--lpv-line)] py-5 md:border-l md:border-t-0 md:px-7">
          <span className="mr-3 text-[0.58rem] uppercase tracking-[0.17em] text-[var(--lpv-muted)]">
            {isEnglish ? "Country" : "Pays"}
          </span>

          <div className="relative flex-1">
            <select
              value={selectedCountry}
              onChange={(event) =>
                navigate(event.target.value, selectedRegion)
              }
              className="w-full cursor-pointer appearance-none bg-transparent pr-7 text-sm outline-none"
            >
              <option value="">{isEnglish ? "All" : "Tous"}</option>

              {countries.map((country) => (
                <option key={country.slug} value={country.slug}>
                  {country.name}
                </option>
              ))}
            </select>

            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[0.65rem]"
            >
              ↓
            </span>
          </div>
        </label>

        <label className="group flex min-w-[250px] items-center border-t border-[var(--lpv-line)] py-5 md:border-l md:border-t-0 md:px-7">
          <span className="mr-3 text-[0.58rem] uppercase tracking-[0.17em] text-[var(--lpv-muted)]">
            {isEnglish ? "Region" : "Région"}
          </span>

          <div className="relative flex-1">
            <select
              value={selectedRegion}
              onChange={(event) =>
                navigate(selectedCountry, event.target.value)
              }
              className="w-full cursor-pointer appearance-none bg-transparent pr-7 text-sm outline-none"
            >
              <option value="">{isEnglish ? "All" : "Toutes"}</option>

              {regions.map((region) => (
                <option key={region.slug} value={region.slug}>
                  {region.name}
                </option>
              ))}
            </select>

            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[0.65rem]"
            >
              ↓
            </span>
          </div>
        </label>

        {hasFilters ? (
          <button
            type="button"
            onClick={() => navigate("", "")}
            className="border-t border-[var(--lpv-line)] py-5 text-left text-[0.6rem] uppercase tracking-[0.16em] text-[var(--lpv-muted)] transition-opacity hover:opacity-50 md:border-l md:border-t-0 md:px-7"
          >
            {isEnglish ? "Clear ×" : "Effacer ×"}
          </button>
        ) : (
          <div className="hidden md:block" />
        )}
      </div>
    </div>
  );
}
