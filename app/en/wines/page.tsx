import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";

import FavoriteButton from "@/components/favorites/FavoriteButton";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { winesQuery } from "@/sanity/lib/queries";
import BottleStage from "@/components/wine/BottleStage";

export const revalidate = 60;

type WineCard = {
  _id: string;
  name: string;
  slug: string;
  vintage?: number;
  beverageType?: "wine" | "cider";
  alcoholFree?: boolean;
  color?: string;
  style?: string;
  appleVarieties?: string[];
  saqPrice?: number;
  bottleImage?: SanityImageSource;
  producer?: {
    name?: string;
    slug?: string;
  };
  country?: {
    name?: string;
    slug?: string;
  };
  region?: {
    name?: string;
    slug?: string;
  };
  appellation?: {
    name?: string;
    slug?: string;
  };
};

type SearchParams = Promise<{
  q?: string;
  type?: string;
  color?: string;
  country?: string;
  region?: string;
  price?: string;
  page?: string;
}>;

function normalize(value?: string) {
  return value?.trim().toLocaleLowerCase("en-CA") ?? "";
}

function formatLabel(value?: string) {
  if (!value) return null;

  const labels: Record<string, string> = {
    red: "Red",
    white: "White",
    rose: "Rosé",
    orange: "Orange",
    sparkling: "Sparkling",
    fortified: "Fortified",
    dry: "Dry",
    "off-dry": "Off-dry",
    sweet: "Sweet",
    natural: "Natural",
    classic: "Classic",
  };

  return labels[value] || value.replace(/[-_]/g, " ");
}

export default async function VinsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const wines = await client.fetch<WineCard[]>(winesQuery);

  const query = normalize(params.q);
  const selectedType = params.type ?? "";
  const selectedColor = params.color ?? "";
  const selectedCountry = params.country ?? "";
  const selectedRegion = params.region ?? "";
  const selectedPrice = params.price ?? "";

  const requestedPage = Math.max(
    1,
    Number.parseInt(params.page ?? "1", 10) || 1
  );

  const colors = [
    ...new Set(
      wines
        .map((wine) => wine.color)
        .filter((value): value is string => Boolean(value))
    ),
  ].sort();

  const countries = [
    ...new Set(
      wines
        .map((wine) => wine.country?.name)
        .filter((value): value is string => Boolean(value))
    ),
  ].sort();

  const regions = [
    ...new Set(
      wines
        .map((wine) => wine.region?.name)
        .filter((value): value is string => Boolean(value))
    ),
  ].sort();

  const filteredWines = wines.filter((wine) => {
    const searchableText = normalize(
      [
        wine.name,
        wine.producer?.name,
        wine.country?.name,
        wine.region?.name,
        wine.appellation?.name,
        wine.color,
        wine.style,
        ...(wine.appleVarieties ?? []),
        wine.beverageType === "cider" ? "cider" : "wine",
        wine.alcoholFree ? "alcohol free" : "",
      ]
        .filter(Boolean)
        .join(" ")
    );

    return (
      (!query || searchableText.includes(query)) &&
      (
        !selectedType ||
        (selectedType === "wine" && (wine.beverageType ?? "wine") === "wine") ||
        (selectedType === "cider" && wine.beverageType === "cider") ||
        (selectedType === "alcohol-free" && wine.alcoholFree === true)
      ) &&
      (!selectedColor || wine.color === selectedColor) &&
      (!selectedCountry || wine.country?.name === selectedCountry) &&
      (!selectedRegion || wine.region?.name === selectedRegion) &&
      (
        !selectedPrice ||
        (typeof wine.saqPrice === "number" &&
          (
            (selectedPrice === "under-20" && wine.saqPrice < 20) ||
            (selectedPrice === "20-30" && wine.saqPrice >= 20 && wine.saqPrice < 30) ||
            (selectedPrice === "30-40" && wine.saqPrice >= 30 && wine.saqPrice < 40) ||
            (selectedPrice === "40-60" && wine.saqPrice >= 40 && wine.saqPrice < 60) ||
            (selectedPrice === "60-plus" && wine.saqPrice >= 60)
          )
        )
      )
    );
  });

  const winesPerPage = 12;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredWines.length / winesPerPage)
  );

  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * winesPerPage;
  const paginatedWines = filteredWines.slice(
    startIndex,
    startIndex + winesPerPage
  );

  function pageHref(page: number) {
    const nextParams = new URLSearchParams();

    if (params.q) nextParams.set("q", params.q);
    if (selectedType) nextParams.set("type", selectedType);
    if (selectedColor) nextParams.set("color", selectedColor);
    if (selectedCountry) nextParams.set("country", selectedCountry);
    if (selectedRegion) nextParams.set("region", selectedRegion);
    if (selectedPrice) nextParams.set("price", selectedPrice);

    if (page > 1) {
      nextParams.set("page", String(page));
    }

    const queryString = nextParams.toString();

    return queryString ? `/en/wines?${queryString}` : "/en/wines";
  }

  const hasFilters = Boolean(
    query ||
      selectedType ||
      selectedColor ||
      selectedCountry ||
      selectedRegion ||
      selectedPrice
  );

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      {/* INTRO */}
      <section className="border-b border-[var(--lpv-line)]">
        <div className="lpv-container grid gap-7 py-10 md:grid-cols-[0.68fr_0.32fr] md:items-end md:gap-10 md:py-24">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Directory
            </p>

            <h1 className="lpv-display mt-5 max-w-5xl text-[clamp(3.5rem,14vw,4.5rem)] leading-[0.86] md:mt-7 md:text-[clamp(4.8rem,10vw,10rem)] md:leading-[0.82]">
              Bottles from
              <br />
              the library.
            </h1>
          </div>

          <div className="border-t border-[var(--lpv-line)] pt-5 md:border-t-0 md:pb-2 md:pt-6">
            <p className="max-w-md text-base leading-7 text-[var(--lpv-muted)] md:leading-8">
              A selection of bottles to discover, keep close
              and open at the right moment.
            </p>

            <p className="mt-5 text-xs uppercase tracking-[0.18em] text-[var(--lpv-cocoa)] md:mt-7">
              {wines.length} bottle{wines.length > 1 ? "s" : ""} in the collection
            </p>
          </div>
        </div>
      </section>

      {/* BOTTLE TYPES */}
      <section className="border-b border-[var(--lpv-line)]">
        <div className="lpv-container flex flex-wrap gap-x-5 gap-y-3 py-5 md:gap-x-8 md:py-6">
          {[
            { label: "All", value: "" },
            { label: "Wines", value: "wine" },
            { label: "Ciders", value: "cider" },
            { label: "Alcohol-free", value: "alcohol-free" },
          ].map((item) => {
            const href = item.value
              ? `/en/wines?type=${item.value}`
              : "/en/wines";
            const active = selectedType === item.value;

            return (
              <Link
                key={item.label}
                href={href}
                className={`text-[0.72rem] uppercase tracking-[0.14em] transition-opacity hover:opacity-50 md:text-sm md:tracking-[0.16em] ${
                  active
                    ? "text-[var(--lpv-ink)] underline underline-offset-8"
                    : "text-[var(--lpv-muted)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* FILTRES */}
      <section className="border-b border-[var(--lpv-line)]">
        <form
          method="GET"
          className="lpv-container py-5 md:py-10"
        >
          {selectedType ? (
            <input type="hidden" name="type" value={selectedType} />
          ) : null}

          <div className="grid gap-px bg-[var(--lpv-line)] md:grid-cols-2 xl:grid-cols-6">
            <label className="bg-[var(--lpv-paper)] px-3 py-3 md:col-span-2 md:p-4 xl:col-span-2">
              <span className="mb-2 block text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[var(--lpv-muted)] md:mb-3 md:text-[0.62rem]">
                Search
              </span>

              <input
                type="search"
                name="q"
                defaultValue={params.q ?? ""}
                placeholder="Bottle, producer, region…"
                className="w-full border-0 bg-transparent py-0.5 text-sm outline-none placeholder:text-[var(--lpv-muted)]/55 md:py-1 md:text-base"
              />
            </label>

            <label className="bg-[var(--lpv-paper)] px-3 py-3 md:p-4">
              <span className="mb-2 block text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[var(--lpv-muted)] md:mb-3 md:text-[0.62rem]">
                Colour
              </span>

              <select
                name="color"
                defaultValue={selectedColor}
                className="w-full appearance-none border-0 bg-transparent py-0.5 text-sm outline-none md:py-1 md:text-base"
              >
                <option value="">All</option>

                {colors.map((color) => (
                  <option key={color} value={color}>
                    {formatLabel(color)}
                  </option>
                ))}
              </select>
            </label>

            <label className="bg-[var(--lpv-paper)] px-3 py-3 md:p-4">
              <span className="mb-2 block text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[var(--lpv-muted)] md:mb-3 md:text-[0.62rem]">
                Country
              </span>

              <select
                name="country"
                defaultValue={selectedCountry}
                className="w-full appearance-none border-0 bg-transparent py-0.5 text-sm outline-none md:py-1 md:text-base"
              >
                <option value="">All</option>

                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </label>

            <label className="bg-[var(--lpv-paper)] px-3 py-3 md:p-4">
              <span className="mb-2 block text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[var(--lpv-muted)] md:mb-3 md:text-[0.62rem]">
                Region
              </span>

              <select
                name="region"
                defaultValue={selectedRegion}
                className="w-full appearance-none border-0 bg-transparent py-0.5 text-sm outline-none md:py-1 md:text-base"
              >
                <option value="">All</option>

                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </label>

            <label className="bg-[var(--lpv-paper)] px-3 py-3 md:p-4">
              <span className="mb-2 block text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[var(--lpv-muted)] md:mb-3 md:text-[0.62rem]">
                Price
              </span>

              <select
                name="price"
                defaultValue={selectedPrice}
                className="w-full appearance-none border-0 bg-transparent py-0.5 text-sm outline-none md:py-1 md:text-base"
              >
                <option value="">All prices</option>
                <option value="under-20">Under $20</option>
                <option value="20-30">$20 to $30</option>
                <option value="30-40">$30 to $40</option>
                <option value="40-60">$40 to $60</option>
                <option value="60-plus">$60+</option>
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 md:mt-5 md:gap-5">
            <button type="submit" className="lpv-button lpv-button-dark">
              Apply filters
            </button>

            {hasFilters ? (
              <Link href="/en/wines" className="lpv-text-link">
                Reset
              </Link>
            ) : null}
          </div>
        </form>
      </section>

      {/* CATALOGUE */}
      <section className="lpv-container py-10 md:py-24">
        <div className="flex flex-col gap-3 border-b border-[var(--lpv-line)] pb-5 sm:flex-row sm:items-end sm:justify-between md:gap-5 md:pb-6">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Catalogue
            </p>

            <h2 className="lpv-display mt-3 text-[2.8rem] leading-none md:mt-5 md:text-7xl">
              Worth opening.
            </h2>
          </div>

          <p className="text-xs uppercase tracking-[0.18em] text-[var(--lpv-muted)]">
            {filteredWines.length} result
            {filteredWines.length > 1 ? "s" : ""}
          </p>
        </div>

        {filteredWines.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-x-4 md:grid-cols-2 md:gap-x-8 xl:grid-cols-3 xl:gap-x-12">
              {paginatedWines.map((wine, index) => {
                const location = [
                  wine.region?.name,
                  wine.country?.name,
                ]
                  .filter(Boolean)
                  .join(" · ");

                return (
                  <article
                    key={wine._id}
                    className="group flex min-w-0 flex-col border-b border-[var(--lpv-line)] py-6 md:py-10"
                  >
                    <div className="relative">
                      <Link
                        href={`/en/wines/${wine.slug}`}
                        className="block w-full"
                      >
                        <BottleStage
                          image={wine.bottleImage}
                          alt={wine.name}
                          color={wine.color}
                          variant="card"
                          className="!h-[220px] [&>div]:!h-[190px] [&_img]:!max-w-[70%] transition duration-700 group-hover:scale-[1.025] sm:!h-[250px] sm:[&>div]:!h-[220px] md:!h-[360px] md:[&>div]:!h-[300px] md:[&_img]:!max-w-[58%]"
                        />
                      </Link>

                      <div className="absolute right-0 top-0 z-20">
                        <FavoriteButton
                          wineId={wine._id}
                          size="sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col pt-4 md:pt-7">
                      <div className="flex min-h-[16px] items-start justify-between gap-2 md:min-h-[18px] md:gap-6">
                        <p className="lpv-kicker min-w-0 text-[0.55rem] leading-4 tracking-[0.16em] text-[var(--lpv-cocoa)] md:text-[0.62rem] md:leading-normal md:tracking-[0.18em]">
                          {[
                            wine.beverageType === "cider"
                              ? "Cider"
                              : formatLabel(wine.color) || "Wine",
                            wine.alcoholFree ? "Alcohol-free" : null,
                            wine.vintage,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>

                        <span className="shrink-0 text-[0.52rem] tracking-[0.12em] text-[var(--lpv-muted)] md:text-[0.6rem] md:tracking-[0.16em]">
                          {String(startIndex + index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <Link
                        href={`/en/wines/${wine.slug}`}
                        className="mt-3 block md:mt-5"
                      >
                        <h3 className="lpv-display min-h-[3.6rem] text-[1.45rem] leading-[0.94] transition-opacity group-hover:opacity-60 md:min-h-[5.6rem] md:text-5xl md:leading-[0.92] xl:min-h-[6.6rem]">
                          {wine.name}
                        </h3>
                      </Link>

                      <div className="min-h-[2.8rem] pt-3 md:min-h-[3.75rem] md:pt-5">
                        {wine.producer?.name ? (
                          wine.producer.slug ? (
                            <Link
                              href={`/en/producers/${wine.producer.slug}`}
                              className="block w-fit text-xs leading-5 text-[var(--lpv-muted)] transition-opacity hover:opacity-50 md:text-sm"
                            >
                              {wine.producer.name}
                            </Link>
                          ) : (
                            <p className="text-xs leading-5 text-[var(--lpv-muted)] md:text-sm">
                              {wine.producer.name}
                            </p>
                          )
                        ) : null}
                      </div>

                      <div className="mt-auto flex min-h-[4.5rem] flex-col items-start justify-between gap-2 border-t border-[var(--lpv-line)] pt-3 md:min-h-[5.25rem] md:flex-row md:items-end md:gap-6 md:pt-5">
                        <div className="min-w-0">
                          {location ? (
                            <p className="text-[0.68rem] leading-5 text-[var(--lpv-muted)] md:text-xs md:leading-6">
                              {location}
                            </p>
                          ) : null}

                          {wine.appellation?.name ? (
                            <p className="text-[0.68rem] leading-5 text-[var(--lpv-muted)] md:text-xs md:leading-6">
                              {wine.appellation.name}
                            </p>
                          ) : null}
                        </div>

                        <Link
                          href={`/en/wines/${wine.slug}`}
                          className="lpv-text-link shrink-0 text-[0.68rem] md:text-sm"
                        >
                          View <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 ? (
              <nav
                aria-label="Bottle pagination"
                className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-[var(--lpv-line)] pt-8"
              >
                <div>
                  {currentPage > 1 ? (
                    <Link
                      href={pageHref(currentPage - 1)}
                      className="lpv-text-link"
                    >
                      ← Previous
                    </Link>
                  ) : (
                    <span className="text-sm text-[var(--lpv-muted)]/40">
                      ← Previous
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Link
                        key={page}
                        href={pageHref(page)}
                        aria-current={page === currentPage ? "page" : undefined}
                        className={`flex h-10 min-w-10 items-center justify-center border px-3 text-sm transition-opacity hover:opacity-60 ${
                          page === currentPage
                            ? "border-[var(--lpv-ink)] text-[var(--lpv-ink)]"
                            : "border-[var(--lpv-line)] text-[var(--lpv-muted)]"
                        }`}
                      >
                        {page}
                      </Link>
                    )
                  )}
                </div>

                <div>
                  {currentPage < totalPages ? (
                    <Link
                      href={pageHref(currentPage + 1)}
                      className="lpv-text-link"
                    >
                      Next →
                    </Link>
                  ) : (
                    <span className="text-sm text-[var(--lpv-muted)]/40">
                      Next →
                    </span>
                  )}
                </div>
              </nav>
            ) : null}
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              No results
            </p>

            <h2 className="lpv-display mt-6 text-5xl">
              Nothing here for now.
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-[var(--lpv-muted)]">
              Try another search or remove some filters.
            </p>

            <Link
              href="/en/wines"
              className="lpv-button mt-8"
            >
              View all bottles
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
