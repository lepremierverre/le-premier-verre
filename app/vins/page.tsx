import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";

import FavoriteButton from "@/components/favorites/FavoriteButton";
import AnalyticsEvent from "@/components/analytics/AnalyticsEvent";
import CatalogFilterAnalytics from "@/components/analytics/CatalogFilterAnalytics";
import CatalogTypeFilterLink from "@/components/analytics/CatalogTypeFilterLink";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { winesQuery } from "@/sanity/lib/queries";
import BottleStage from "@/components/wine/BottleStage";
import { filterWineCatalog, normalizeCatalogQuery } from "@/lib/catalog/wine-catalog";

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
  editorialImage?: SanityImageSource;
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
  producteur?: string;
  page?: string;
}>;

function formatLabel(value?: string) {
  if (!value) return null;

  const labels: Record<string, string> = {
    red: "Rouge",
    white: "Blanc",
    rose: "Rosé",
    orange: "Orange",
    sparkling: "Effervescent",
    fortified: "Fortifié",
    dry: "Sec",
    "off-dry": "Demi-sec",
    sweet: "Doux",
    natural: "Nature",
    classic: "Classique",
  };

  return labels[value] || value.replace(/[-_]/g, " ");
}


/**
 * Rotation éditoriale LPV.
 *
 * - stable pendant toute une semaine;
 * - change automatiquement le lundi;
 * - aucune dépendance à l'ordre alphabétique;
 * - chaque bouteille reçoit son propre score;
 * - aucun Math.random(), donc pagination stable.
 */
function getIsoWeekKey(date = new Date()) {
  const utc = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );

  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);

  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const week = Math.ceil(
    ((utc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );

  return `${utc.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function stableHash(value: string) {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function weeklyWineOrder(
  wines: WineCard[],
  weekKey: string,
  channel: string
) {
  return [...wines].sort((a, b) => {
    const scoreA = stableHash(`${channel}:${weekKey}:${a._id}`);
    const scoreB = stableHash(`${channel}:${weekKey}:${b._id}`);

    if (scoreA !== scoreB) {
      return scoreA - scoreB;
    }

    return a._id.localeCompare(b._id);
  });
}

function getPreviousIsoWeekKey() {
  const previousWeek = new Date();
  previousWeek.setUTCDate(previousWeek.getUTCDate() - 7);
  return getIsoWeekKey(previousWeek);
}

/**
 * Pour la sélection D'ici, on évite autant que possible
 * de reprendre immédiatement les vins mis de l'avant
 * la semaine précédente.
 */
function getWeeklyQuebecSelection(
  wines: WineCard[],
  weekKey: string,
  count = 6
) {
  const currentOrder = weeklyWineOrder(wines, weekKey, "quebec-featured");

  if (currentOrder.length <= count) {
    return currentOrder;
  }

  const previousOrder = weeklyWineOrder(
    wines,
    getPreviousIsoWeekKey(),
    "quebec-featured"
  );

  const previousFeaturedIds = new Set(
    previousOrder.slice(0, count).map((wine) => wine._id)
  );

  const fresh = currentOrder.filter(
    (wine) => !previousFeaturedIds.has(wine._id)
  );

  const repeated = currentOrder.filter(
    (wine) => previousFeaturedIds.has(wine._id)
  );

  return [...fresh, ...repeated].slice(0, count);
}

export default async function VinsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const wines = await client.fetch<WineCard[]>(winesQuery);
  const weekKey = getIsoWeekKey();

  const query = normalizeCatalogQuery(params.q, "fr");
  const selectedType = params.type ?? "";
  const selectedColor = params.color ?? "";
  const selectedCountry = params.country ?? "";
  const selectedRegion = params.region ?? "";
  const selectedPrice = params.price ?? "";
  const selectedProducer = params.producteur ?? "";

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

  const filteredWines = filterWineCatalog(
    wines,
    {
      q: params.q,
      type: selectedType,
      color: selectedColor,
      country: selectedCountry,
      region: selectedRegion,
      price: selectedPrice,
    },
    "fr"
  );

  const producerFilteredWines = selectedProducer
    ? filteredWines.filter(
        (wine) => wine.producer?.slug === selectedProducer
      )
    : filteredWines;

  const orderedWines = weeklyWineOrder(
    producerFilteredWines,
    weekKey,
    "catalog"
  );

  const winesPerPage = 12;
  const totalPages = Math.max(
    1,
    Math.ceil(orderedWines.length / winesPerPage)
  );

  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * winesPerPage;
  const paginatedWines = orderedWines.slice(
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
    if (selectedProducer) nextParams.set("producteur", selectedProducer);

    if (page > 1) {
      nextParams.set("page", String(page));
    }

    const queryString = nextParams.toString();

    return queryString ? `/vins?${queryString}` : "/vins";
  }

  const hasFilters = Boolean(
    query ||
      selectedType ||
      selectedColor ||
      selectedCountry ||
      selectedRegion ||
      selectedPrice
  );

  const quebecWines = wines.filter((wine) => {
    const country = wine.country?.name?.toLowerCase() ?? "";
    const region = wine.region?.name?.toLowerCase() ?? "";
    const appellation = wine.appellation?.name?.toLowerCase() ?? "";

    return (
      country.includes("canada") ||
      region.includes("québec") ||
      region.includes("quebec") ||
      appellation.includes("québec") ||
      appellation.includes("quebec")
    );
  });

  const featuredQuebecWines = getWeeklyQuebecSelection(
    quebecWines,
    weekKey,
    6
  );

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      {query.length >= 2 ? (
        <AnalyticsEvent
          eventName="search_performed"
          data={{
            searchQuery: params.q?.trim() ?? "",
            sourceType: "wine_catalog_fr",
            metadata: {
              type: selectedType || undefined,
              color: selectedColor || undefined,
              country: selectedCountry || undefined,
              region: selectedRegion || undefined,
              price: selectedPrice || undefined,
            },
          }}
        />
      ) : null}
      {/* INTRO */}
      <section className="border-b border-[var(--lpv-line)]">

        {/* MOBILE */}
        <div className="lpv-container py-10 md:hidden">
          <h1 className="lpv-display max-w-[520px] text-[4.15rem] leading-[0.84] tracking-[-0.055em]">
            Les bouteilles.
          </h1>

          <div className="mt-8 flex items-center justify-between  pt-4">
            <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[var(--lpv-muted)]">
              {wines.length} bouteilles
            </p>

            <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[var(--lpv-cocoa)]">
              Québec + ailleurs
            </p>
          </div>
        </div>

        {/* DESKTOP — conservé */}
        <div className="lpv-container hidden gap-6 py-9 md:grid md:grid-cols-[0.68fr_0.32fr] md:items-end md:gap-10 md:py-24">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Répertoire
            </p>

            <h1 className="lpv-display mt-7 max-w-5xl text-[clamp(4.8rem,10vw,10rem)] leading-[0.82]">
              Les bouteilles
              <br />
              de la bibliothèque.
            </h1>
          </div>

          <div className="pb-2 pt-6">
            <p className="max-w-md text-base leading-8 text-[var(--lpv-muted)]">
              Une sélection de bouteilles à découvrir, à garder sous la main
              et à ouvrir au bon moment.
            </p>

            <p className="lpv-kicker mt-7 text-[var(--lpv-cocoa)]">
              {wines.length} bouteilles dans la collection
            </p>
          </div>
        </div>
      </section>

      {/* BARRE DE CATALOGUE */}
      <section className="relative z-40 border-b border-[var(--lpv-line)] bg-[var(--lpv-paper)]">
        <div className="lpv-container">

          <div className="flex items-center justify-between gap-4 overflow-x-auto py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:min-h-[80px] md:flex-nowrap md:overflow-visible md:py-0">

            <div className="flex shrink-0 items-center gap-6 md:flex-wrap md:gap-x-8 md:gap-y-3">
              {[
                { label: "Tout", value: "" },
                { label: "Vins", value: "wine" },
                { label: "Cidres", value: "cider" },
                { label: "Sans alcool", value: "alcohol-free" },
              ].map((item) => {
                const href = item.value
                  ? `/vins?type=${item.value}`
                  : "/vins";

                const active = selectedType === item.value;

                return (
                  <CatalogTypeFilterLink
                    key={item.label}
                    href={href}
                    value={item.value}
                    locale="fr"
                    className={`text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-50 ${
                      active
                        ? "text-[var(--lpv-ink)] underline underline-offset-8"
                        : "text-[var(--lpv-muted)]"
                    }`}
                  >
                    {item.label}
                  </CatalogTypeFilterLink>
                );
              })}
            </div>

            <div className="flex shrink-0 items-center gap-5 md:gap-7">

              <form
                action="/vins"
                method="get"
                className="hidden items-center border-b border-[var(--lpv-line)] md:flex"
              >
                {selectedType ? (
                  <input
                    type="hidden"
                    name="type"
                    value={selectedType}
                  />
                ) : null}

                <input
                  type="search"
                  name="q"
                  defaultValue={params.q ?? ""}
                  placeholder="Rechercher"
                  aria-label="Rechercher une bouteille"
                  className="w-[155px] border-0 bg-transparent py-2 text-sm outline-none placeholder:text-[var(--lpv-muted)]"
                />

                <button
                  type="submit"
                  aria-label="Lancer la recherche"
                  className="pb-1 text-sm"
                >
                  →
                </button>
              </form>

              <details className="group relative">
                <summary className="flex cursor-pointer list-none items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] [&::-webkit-details-marker]:hidden">
                  Filtrer
                  <span className="text-base font-light transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>

                <div className="absolute right-0 top-[calc(100%+28px)] z-50 w-[700px] border border-[var(--lpv-line)] bg-[var(--lpv-paper)] p-7 shadow-[0_24px_60px_rgba(30,25,21,0.12)]">

                  <CatalogFilterAnalytics
                    locale="fr"
                    className="block"
                  >
                    {selectedType ? (
                      <input
                        type="hidden"
                        name="type"
                        value={selectedType}
                      />
                    ) : null}

                    <div className="grid grid-cols-2 gap-x-8 gap-y-7">

                      <label className="col-span-2 border-b border-[var(--lpv-line)] pb-3">
                        <span className="mb-2 block text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[var(--lpv-muted)]">
                          Rechercher
                        </span>

                        <input
                          type="search"
                          name="q"
                          defaultValue={params.q ?? ""}
                          placeholder="Bouteille, producteur, région…"
                          className="w-full border-0 bg-transparent text-base outline-none placeholder:text-[var(--lpv-muted)]/55"
                        />
                      </label>

                      <label className="border-b border-[var(--lpv-line)] pb-3">
                        <span className="mb-2 block text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[var(--lpv-muted)]">
                          Couleur
                        </span>

                        <select
                          name="color"
                          defaultValue={selectedColor}
                          className="w-full appearance-none border-0 bg-transparent text-sm outline-none"
                        >
                          <option value="">Toutes</option>
                          {colors.map((color) => (
                            <option key={color} value={color}>
                              {formatLabel(color)}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="border-b border-[var(--lpv-line)] pb-3">
                        <span className="mb-2 block text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[var(--lpv-muted)]">
                          Pays
                        </span>

                        <select
                          name="country"
                          defaultValue={selectedCountry}
                          className="w-full appearance-none border-0 bg-transparent text-sm outline-none"
                        >
                          <option value="">Tous</option>
                          {countries.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="border-b border-[var(--lpv-line)] pb-3">
                        <span className="mb-2 block text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[var(--lpv-muted)]">
                          Région
                        </span>

                        <select
                          name="region"
                          defaultValue={selectedRegion}
                          className="w-full appearance-none border-0 bg-transparent text-sm outline-none"
                        >
                          <option value="">Toutes</option>
                          {regions.map((region) => (
                            <option key={region} value={region}>
                              {region}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="border-b border-[var(--lpv-line)] pb-3">
                        <span className="mb-2 block text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[var(--lpv-muted)]">
                          Prix
                        </span>

                        <select
                          name="price"
                          defaultValue={selectedPrice}
                          className="w-full appearance-none border-0 bg-transparent text-sm outline-none"
                        >
                          <option value="">Tous les prix</option>
                          <option value="under-20">Moins de 20 $</option>
                          <option value="20-30">20 à 30 $</option>
                          <option value="30-40">30 à 40 $</option>
                          <option value="40-60">40 à 60 $</option>
                          <option value="60-plus">60 $ et +</option>
                        </select>
                      </label>

                    </div>

                    <div className="mt-7 flex items-center gap-5">
                      <button
                        type="submit"
                        className="lpv-button lpv-button-dark"
                      >
                        Appliquer
                      </button>

                      {hasFilters ? (
                        <Link
                          href="/vins"
                          className="lpv-text-link"
                        >
                          Réinitialiser
                        </Link>
                      ) : null}
                    </div>

                  </CatalogFilterAnalytics>

                </div>
              </details>

            </div>
          </div>
        </div>
      </section>

      {/* D'ICI — MOBILE */}
      {featuredQuebecWines.length > 0 ? (
        <section className="overflow-hidden bg-[var(--lpv-cocoa)] text-[var(--lpv-paper-light)] md:hidden">
          <div className="pb-10 pt-10">
            <div className="lpv-container">
              <p className="lpv-kicker text-white/45">
                Le Québec dans le verre
              </p>

              <div className="mt-3 flex items-end justify-between gap-5">
                <h2 className="lpv-display text-[4.65rem] leading-[0.82] tracking-[-0.055em]">
                  D’ici.
                </h2>

                <span className="lpv-kicker mb-1.5 shrink-0 text-white/45">
                  Glisser →
                </span>
              </div>
            </div>

            <div className="mt-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max snap-x snap-mandatory gap-3 px-4">
                {featuredQuebecWines.map((wine, index) => (
                  <article
                    key={wine._id}
                    className="relative flex h-[438px] w-[72vw] max-w-[315px] shrink-0 snap-start flex-col border border-black/10 bg-[var(--lpv-paper)] text-[var(--lpv-ink)] shadow-[0_14px_34px_rgba(24,18,14,0.10)]"
                  >
                    <Link
                      href={`/vins/${wine.slug}`}
                      className="flex h-full flex-col px-5 pb-5 pt-5"
                    >
                      <div className={
                          wine.slug === "earl-gelin-domaine-des-nugues-beaujolais-villages-2024-2024"
                            ? "relative flex h-[275px] w-full items-center justify-center overflow-hidden bg-[#A28F80]"
                            : "relative flex h-[275px] w-full items-center justify-center overflow-hidden"
                        }>
                        <BottleStage
                          image={wine.editorialImage ?? wine.bottleImage}
                          alt={wine.name}
                          color={wine.color}
                          variant="card"
                          imageFit={
                            wine.slug === "earl-gelin-domaine-des-nugues-beaujolais-villages-2024-2024"
                              ? "contain"
                              : wine.editorialImage
                                ? "cover"
                                : "contain"
                          }
                          className={
                            wine.slug === "earl-gelin-domaine-des-nugues-beaujolais-villages-2024-2024"
                              ? "!h-[275px] !w-full [&>div]:!h-[275px] [&>div]:!w-full [&_img]:!h-[360px] [&_img]:!w-auto [&_img]:!max-h-none [&_img]:!max-w-none [&_img]:rotate-[7deg] [&_img]:scale-[1.08] [&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:rotate-[8deg] group-hover:[&_img]:scale-[1.11]"
                              : wine.editorialImage
                                ? "!h-[275px] !w-full [&>div]:!h-[275px] [&>div]:!w-full [&_img]:!h-full [&_img]:!w-full [&_img]:!max-h-none [&_img]:!max-w-none"
                              : "!h-[275px] !w-full [&>div]:!h-[260px] [&_img]:!max-h-[250px] [&_img]:!max-w-[62%]"
                          }
                        />
                      </div>

                      <div className="mt-auto flex min-h-[125px] flex-col pt-4">
                        <p className="lpv-kicker text-[0.55rem] text-[var(--lpv-cocoa)]/65">
                          {[
                            wine.beverageType === "cider"
                              ? "Cidre"
                              : formatLabel(wine.color) || "Vin",
                            wine.alcoholFree ? "Sans alcool" : null,
                            wine.vintage,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>

                        <h3 className="lpv-display mt-3 text-[1.75rem] leading-[0.94] tracking-[-0.035em]">
                          {wine.name}
                        </h3>

                        {wine.producer?.name ? (
                          <p className="mt-auto pt-3 text-xs text-[var(--lpv-muted)]">
                            {wine.producer.name}
                          </p>
                        ) : null}
                      </div>
                    </Link>

                    <div className="absolute right-4 top-4 z-20">
                      <FavoriteButton wineId={wine._id} size="sm" variant="bare" />
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="lpv-container mt-8 flex justify-end">
              <Link
                href="/vins?country=Canada"
                className="inline-flex items-center gap-3 border-b border-white/35 pb-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white"
              >
                Tous les vins du Québec
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* D'ICI — DESKTOP */}
      {featuredQuebecWines.length > 0 ? (
        <section className="hidden overflow-hidden bg-[var(--lpv-cocoa)] text-[var(--lpv-paper-light)] md:block">
          <div className="lpv-container py-12 lg:py-14">

            <div className="flex items-end justify-between gap-10">
              <div>
                <p className="lpv-kicker text-white/42">
                  Le Québec dans le verre
                </p>

                <h2 className="lpv-display mt-3 text-[clamp(4.2rem,5.8vw,6.5rem)] leading-[0.84] tracking-[-0.05em]">
                  D’ici.
                </h2>
              </div>

              <Link
                href="/vins?country=Canada"
                className="group mb-2 inline-flex items-center gap-3 border-b border-white/35 pb-1 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-white"
              >
                Tous les vins du Québec
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            <div className="mt-8 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max gap-3 snap-x snap-mandatory">

                {featuredQuebecWines.map((wine, index) => (
                  <article
                    key={wine._id}
                    className="group relative flex h-[520px] w-[365px] shrink-0 snap-start flex-col border border-black/10 bg-[var(--lpv-paper)] text-[var(--lpv-ink)]"
                  >
                    <Link
                      href={`/vins/${wine.slug}`}
                      className="flex h-full flex-col px-6 pb-6 pt-6"
                    >
                      <div className={
                          wine.slug === "earl-gelin-domaine-des-nugues-beaujolais-villages-2024-2024"
                            ? "relative flex h-[330px] w-full items-center justify-center overflow-hidden bg-[#A28F80]"
                            : "relative flex h-[330px] w-full items-center justify-center overflow-hidden"
                        }>
                        <BottleStage
                          image={wine.editorialImage ?? wine.bottleImage}
                          alt={wine.name}
                          color={wine.color}
                          variant="card"
                          imageFit={
                            wine.slug === "earl-gelin-domaine-des-nugues-beaujolais-villages-2024-2024"
                              ? "contain"
                              : wine.editorialImage
                                ? "cover"
                                : "contain"
                          }
                          className={
                            wine.slug === "earl-gelin-domaine-des-nugues-beaujolais-villages-2024-2024"
                              ? "!h-[330px] !w-full [&>div]:!h-[330px] [&>div]:!w-full [&_img]:!h-[430px] [&_img]:!w-auto [&_img]:!max-h-none [&_img]:!max-w-none [&_img]:rotate-[7deg] [&_img]:scale-[1.08] [&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:rotate-[8deg] group-hover:[&_img]:scale-[1.11]"
                              : wine.editorialImage
                                ? "!h-[330px] !w-full [&>div]:!h-[330px] [&>div]:!w-full [&_img]:!h-full [&_img]:!w-full [&_img]:!max-h-none [&_img]:!max-w-none [&_img]:transition-transform [&_img]:duration-500 [&_img]:ease-out group-hover:[&_img]:scale-[1.02]"
                              : "!h-[330px] !w-full [&>div]:!h-[310px] [&_img]:!max-h-[300px] [&_img]:!max-w-[62%] [&_img]:transition-transform [&_img]:duration-500 [&_img]:ease-out group-hover:[&_img]:-translate-y-2 group-hover:[&_img]:rotate-[0.8deg] group-hover:[&_img]:scale-[1.025]"
                          }
                        />
                      </div>

                      <div className="mt-auto flex min-h-[150px] flex-col pt-4">
                        <p className="lpv-kicker text-[var(--lpv-cocoa)]/65">
                          {[
                            wine.beverageType === "cider"
                              ? "Cidre"
                              : formatLabel(wine.color) || "Vin",
                            wine.alcoholFree ? "Sans alcool" : null,
                            wine.vintage,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>

                        <h3 className="lpv-display mt-3 text-[1.8rem] leading-[0.94] tracking-[-0.035em] transition-opacity group-hover:opacity-65">
                          {wine.name}
                        </h3>

                        {wine.producer?.name ? (
                          <p className="mt-6 text-sm text-[var(--lpv-muted)]">
                            {wine.producer.name}
                          </p>
                        ) : null}
                      </div>
                    </Link>

                    <div className="absolute right-4 top-4 z-20 opacity-100 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100">
                      <FavoriteButton
                        wineId={wine._id}
                        size="sm"
                      />
                    </div>
                  </article>
                ))}

              </div>
            </div>

            {featuredQuebecWines.length > 3 ? (
              <div className="mt-2 flex justify-end">
                <span className="lpv-kicker text-white/38">
                  Glisser →
                </span>
              </div>
            ) : null}

          </div>
        </section>
      ) : null}

      {/* CATALOGUE */}



      <section className="lpv-container py-9 md:py-24">
        <div className="border-b border-[var(--lpv-line)] pb-7 md:flex md:items-end md:justify-between md:gap-5 md:pb-6">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Catalogue
            </p>

            <h2 className="lpv-display mt-4 text-[3.65rem] leading-[0.86] tracking-[-0.045em] md:mt-5 md:text-7xl md:leading-none">
              Et d’ailleurs.
            </h2>
          </div>

          <div className="mt-6 flex items-center gap-3 md:mt-0">
            <span className="h-px w-8 bg-[var(--lpv-cocoa)]/35 md:hidden" />
            <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[var(--lpv-muted)] md:text-xs">
              {producerFilteredWines.length} résultat
              {producerFilteredWines.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {producerFilteredWines.length > 0 ? (
          <>
            {/* MOBILE — CARTES RECTANGULAIRES LPV */}
            <div className="grid grid-cols-2 gap-3 pt-4 md:hidden">
              {paginatedWines.map((wine, index) => (
                <article
                  key={wine._id}
                  className="group relative min-w-0 border border-[var(--lpv-line)]"
                >
                  <div className="relative flex h-[470px] flex-col px-5 pb-5 pt-5">

                    <div className="absolute right-5 top-5 z-20">
                      <FavoriteButton
                        wineId={wine._id}
                        size="sm"
                        variant="bare"
                      />
                    </div>

                    <Link
                      href={`/vins/${wine.slug}`}
                      className="mt-5 block"
                    >
                      <BottleStage
                        image={wine.editorialImage ?? wine.bottleImage}
                        alt={wine.name}
                        color={
                          wine.beverageType === "cider"
                            ? undefined
                            : wine.color
                        }
                        variant="card"
                        imageFit={wine.editorialImage ? "cover" : "contain"}
                        className={
                          wine.editorialImage
                            ? "!h-[285px] !w-full [&>div]:!h-[265px] [&>div]:!w-full [&>div]:!overflow-hidden [&_img]:!h-[265px] [&_img]:!w-full [&_img]:!max-h-none [&_img]:!max-w-none [&_img]:!object-cover"
                            : "!h-[285px] !w-full [&>div]:!h-[265px] [&>div]:!w-full [&_img]:!max-h-[245px] [&_img]:!max-w-[72%] [&_img]:!object-contain"
                        }
                      />
                    </Link>

                    <div className="flex min-h-[125px] flex-1 flex-col pt-2">
                      <p className="lpv-kicker text-[0.55rem] leading-4 tracking-[0.16em] text-[var(--lpv-cocoa)]">
                        {[
                          wine.beverageType === "cider"
                            ? "Cidre"
                            : formatLabel(wine.color) || "Vin",
                          wine.alcoholFree ? "Sans alcool" : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>

                      <Link
                        href={`/vins/${wine.slug}`}
                        className="mt-3 block"
                      >
                        <h3 className="lpv-display text-[1.55rem] leading-[0.94]">
                          {wine.name}
                        </h3>
                      </Link>

                      {wine.producer?.name ? (
                        <p className="mt-auto pt-4 text-xs leading-5 text-[var(--lpv-muted)]">
                          {wine.producer.name}
                          {wine.vintage ? ` · ${wine.vintage}` : ""}
                        </p>
                      ) : null}
                    </div>

                  </div>
                </article>
              ))}
            </div>

            {/* DESKTOP — cartes éditoriales simplifiées */}
            <div className="hidden grid-cols-4 md:grid">
              {paginatedWines.map((wine, index) => (
                <article
                  key={wine._id}
                  className={`group relative flex min-w-0 flex-col border-b border-[var(--lpv-line)] px-6 pb-7 pt-6 ${
                    index % 4 !== 0
                      ? "border-l border-[var(--lpv-line)]"
                      : ""
                  }`}
                >
                  <div className="relative">
                    <Link
                      href={`/vins/${wine.slug}`}
                      className={
                        wine.slug === "earl-gelin-domaine-des-nugues-beaujolais-villages-2024-2024"
                          ? "relative block h-[350px] overflow-hidden bg-[#A28F80]"
                          : "relative block h-[350px]"
                      }
                    >
                      <BottleStage
                        image={wine.editorialImage ?? wine.bottleImage}
                        alt={wine.name}
                        color={wine.color}
                        variant="card"
                        imageFit={
                            wine.slug === "earl-gelin-domaine-des-nugues-beaujolais-villages-2024-2024"
                              ? "contain"
                              : wine.editorialImage
                                ? "cover"
                                : "contain"
                          }
                        className={
                          wine.slug === "earl-gelin-domaine-des-nugues-beaujolais-villages-2024-2024"
                            ? "!h-[350px] !w-full [&>div]:!h-[350px] [&>div]:!w-full [&_img]:!h-[455px] [&_img]:!w-auto [&_img]:!max-h-none [&_img]:!max-w-none [&_img]:rotate-[7deg] [&_img]:scale-[1.08] [&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:rotate-[8deg] group-hover:[&_img]:scale-[1.11]"
                            : wine.editorialImage
                              ? "!h-[350px] !w-full [&>div]:!h-[350px] [&>div]:!w-full [&_img]:!h-full [&_img]:!w-full [&_img]:!max-h-none [&_img]:!max-w-none [&_img]:transition-transform [&_img]:duration-500 [&_img]:ease-out group-hover:[&_img]:scale-[1.02]"
                            : "!h-[300px] [&>div]:!h-[280px] [&_img]:!max-h-[270px] [&_img]:!max-w-[64%] [&_img]:transition-transform [&_img]:duration-500 [&_img]:ease-out group-hover:[&_img]:-translate-y-2 group-hover:[&_img]:rotate-[0.7deg] group-hover:[&_img]:scale-[1.02]"
                        }
                      />
                    </Link>

                    <div className="absolute right-0 top-0 z-20 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
                      <FavoriteButton
                        wineId={wine._id}
                        size="sm"
                        variant="bare"
                      />
                    </div>
                  </div>

                  <Link
                    href={`/vins/${wine.slug}`}
                    className="block pt-5"
                  >
                    <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                      {[
                        wine.beverageType === "cider"
                          ? "Cidre"
                          : formatLabel(wine.color) || "Vin",
                        wine.alcoholFree ? "Sans alcool" : null,
                        wine.vintage,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>

                    <h3 className="lpv-display mt-3 min-h-[4rem] max-w-[360px] text-[2.15rem] leading-[0.94] tracking-[-0.035em] transition-opacity group-hover:opacity-60">
                      {wine.name}
                    </h3>

                    {wine.producer?.name ? (
                      <p className="mt-5 text-sm leading-5 text-[var(--lpv-muted)]">
                        {wine.producer.name}
                      </p>
                    ) : null}
                  </Link>
                </article>
              ))}
            </div>

            {totalPages > 1 ? (
              <nav
                aria-label="Pagination des bouteilles"
                className="mt-8 flex items-center justify-between gap-3 pt-2 md:mt-12 md:flex-wrap md:gap-6 md:pt-8"
              >
                <div>
                  {currentPage > 1 ? (
                    <Link
                      href={pageHref(currentPage - 1)}
                      className="lpv-text-link"
                    >
                      ← Précédent
                    </Link>
                  ) : (
                    <span className="text-sm text-[var(--lpv-muted)]/40">
                      ← Précédent
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      const nearCurrent = Math.abs(page - currentPage) <= 1;

                      return (
                        <Link
                          key={page}
                          href={pageHref(page)}
                          aria-current={page === currentPage ? "page" : undefined}
                          className={`h-9 min-w-9 items-center justify-center border px-2 text-xs transition-opacity hover:opacity-60 md:flex md:h-10 md:min-w-10 md:px-3 md:text-sm ${
                            nearCurrent ? "flex" : "hidden"
                          } ${
                            page === currentPage
                              ? "border-[var(--lpv-ink)] text-[var(--lpv-ink)]"
                              : "border-[var(--lpv-line)] text-[var(--lpv-muted)]"
                          }`}
                        >
                          {page}
                        </Link>
                      );
                    }
                  )}
                </div>

                <div>
                  {currentPage < totalPages ? (
                    <Link
                      href={pageHref(currentPage + 1)}
                      className="lpv-text-link"
                    >
                      Suivant →
                    </Link>
                  ) : (
                    <span className="text-sm text-[var(--lpv-muted)]/40">
                      Suivant →
                    </span>
                  )}
                </div>
              </nav>
            ) : null}

            {/* CTA — SUGGÉRER UNE BOUTEILLE */}
            <div className="mx-auto mt-10 max-w-xl border-t border-[var(--lpv-line)] pt-7 text-center md:mt-20 md:pt-12">
              <p className="lpv-display text-[1.25rem] leading-[1.15] tracking-[-0.025em] md:text-[2rem]">
                Ta bouteille préférée n’est pas dans notre répertoire?
              </p>

              <p className="mx-auto mt-3 max-w-md text-[0.72rem] leading-5 text-[var(--lpv-muted)] md:mt-4 md:text-sm md:leading-6">
                Envoie-nous les infos. On s’occupe de la suite.
              </p>

              <Link
                href="/contact"
                className="mt-3 inline-flex border-b border-[var(--lpv-ink)] pb-1 text-[0.58rem] uppercase tracking-[0.18em] transition-opacity hover:opacity-50 md:mt-5 md:text-[0.62rem]"
              >
                Nous écrire →
              </Link>
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Aucun résultat
            </p>

            <h2 className="lpv-display mt-6 text-5xl">
              Rien pour le moment.
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-[var(--lpv-muted)]">
              Essaie une autre recherche ou retire certains filtres.
            </p>

            <Link
              href="/vins"
              className="lpv-button mt-8"
            >
              Voir toutes les bouteilles
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
