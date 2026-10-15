"use client";

import { useRouter } from "next/navigation";

type FilterOption = {
  slug: string;
  name: string;
};

type InternationalProducerFiltersProps = {
  countries: FilterOption[];
  regions: FilterOption[];
  selectedCountry: string;
  selectedRegion: string;
  anchor?: string;
  mobile?: boolean;
  locale?: "fr" | "en";
};

export default function InternationalProducerFilters({
  countries,
  regions,
  selectedCountry,
  selectedRegion,
  anchor = "repertoire-desktop",
  locale = "fr",
}: InternationalProducerFiltersProps) {
  const router = useRouter();

  function go(country: string, region: string) {
    const query = new URLSearchParams();

    const isEnglish = locale === "en";

    query.set("origine", isEnglish ? "elsewhere" : "ailleurs");

    if (country) query.set("pays", country);
    if (region) query.set("region", region);

    const pathname = isEnglish ? "/en/producers" : "/producteurs";
    router.push(`${pathname}?${query.toString()}#${anchor}`);
  }

  const activeCountry =
    countries.find((country) => country.slug === selectedCountry)?.name;

  const activeRegion =
    regions.find((region) => region.slug === selectedRegion)?.name;

  return (
    <div className="flex items-center gap-7">
      {/* PAYS */}
      <label className="relative inline-flex items-center">
        <span
          className={`pointer-events-none text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-[var(--lpv-ink)] ${
            selectedCountry
              ? "border-b border-[var(--lpv-ink)] pb-1"
              : ""
          }`}
        >
          {activeCountry || (locale === "en" ? "Country" : "Pays")}
        </span>

        <select
          value={selectedCountry}
          onChange={(event) => go(event.target.value, "")}
          aria-label={locale === "en" ? "Filter by country" : "Filtrer par pays"}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
        >
          <option value="">{locale === "en" ? "All countries" : "Tous les pays"}</option>

          {countries.map((country) => (
            <option key={country.slug} value={country.slug}>
              {country.name}
            </option>
          ))}
        </select>
      </label>

      {/* RÉGION */}
      <label className="relative inline-flex items-center">
        <span
          className={`pointer-events-none text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-[var(--lpv-ink)] ${
            selectedRegion
              ? "border-b border-[var(--lpv-ink)] pb-1"
              : ""
          }`}
        >
          {activeRegion || (locale === "en" ? "Region" : "Région")}
        </span>

        <select
          value={selectedRegion}
          onChange={(event) => go(selectedCountry, event.target.value)}
          aria-label={locale === "en" ? "Filter by region" : "Filtrer par région"}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
        >
          <option value="">{locale === "en" ? "All regions" : "Toutes les régions"}</option>

          {regions.map((region) => (
            <option key={region.slug} value={region.slug}>
              {region.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
