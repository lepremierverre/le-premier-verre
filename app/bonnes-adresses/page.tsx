import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { placesQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

type Place = {
  _id: string;
  name: string;
  slug: string;
  type?: "restaurant" | "wine-bar" | "caviste" | "shop" | "other";
  city?: string;
  region?: string;
  highlights?: string[];
  coverImage?: SanityImageSource;
  lpvPartner?: boolean;
  mediaPermissionStatus?:
    | "none"
    | "provided_by_place"
    | "authorized_by_place"
    | "lpv_original"
    | "licensed";
  mediaCredit?: string;
};

type PlacesPageProps = {
  searchParams?: Promise<{
    type?: string;
    page?: string;
  }>;
};

const PLACES_PER_PAGE = 12;

const AUTHORIZED_MEDIA_STATUSES = [
  "provided_by_place",
  "authorized_by_place",
  "lpv_original",
  "licensed",
];

const PLACE_FILTERS = [
  { value: "toutes", label: "Toutes" },
  { value: "restaurants", label: "Restaurants" },
  { value: "bars-a-vin", label: "Bars à vin" },
  { value: "cavistes", label: "Cavistes" },
  { value: "boutiques", label: "Boutiques" },
  { value: "autres", label: "Autres" },
] as const;

function getAuthorizedImage(place: Place) {
  const hasAuthorizedMedia = AUTHORIZED_MEDIA_STATUSES.includes(
    place.mediaPermissionStatus || ""
  );

  if (!hasAuthorizedMedia) return null;

  return place.coverImage || null;
}

function getLocation(place: Place) {
  return [
    place.city,
    place.region && place.region !== place.city ? place.region : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

function formatType(value?: Place["type"]) {
  const labels: Record<string, string> = {
    restaurant: "Restaurant",
    "wine-bar": "Bar à vin",
    caviste: "Caviste",
    shop: "Boutique",
    other: "Adresse",
  };

  return value ? labels[value] || "Adresse" : "Adresse";
}

function weeklyPlaceScore(id: string, week: number) {
  const input = `${week}:${id}`;
  let hash = 2166136261;

  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function weeklyPlaceOrder<T extends { _id: string }>(
  items: T[],
  week: number
) {
  return [...items].sort((a, b) => {
    const aScore = weeklyPlaceScore(a._id, week);
    const bScore = weeklyPlaceScore(b._id, week);

    return aScore === bScore
      ? a._id.localeCompare(b._id)
      : aScore - bScore;
  });
}

export default async function PlacesPage({
  searchParams,
}: PlacesPageProps) {
  const params = (await searchParams) || {};
  const places = await client.fetch<Place[]>(placesQuery);

  const participatingPlaces = places.filter(
    (place) => place.lpvPartner === true
  );

  const weekIndex = Math.floor(
    (Date.now() + 3 * 24 * 60 * 60 * 1000) /
      (7 * 24 * 60 * 60 * 1000)
  );

  const featuredPlaces = weeklyPlaceOrder(
    participatingPlaces,
    weekIndex
  );

  // Les partenaires restent également dans le répertoire général.
  const directoryPlaces = weeklyPlaceOrder(places, weekIndex);

  const allowedFilters = PLACE_FILTERS.map((filter) => filter.value);

  const placeFilter = allowedFilters.includes(
    params.type as (typeof PLACE_FILTERS)[number]["value"]
  )
    ? params.type || "toutes"
    : "toutes";

  const filteredDirectoryPlaces = directoryPlaces.filter((place) => {
    if (placeFilter === "restaurants") return place.type === "restaurant";
    if (placeFilter === "bars-a-vin") return place.type === "wine-bar";
    if (placeFilter === "cavistes") return place.type === "caviste";
    if (placeFilter === "boutiques") return place.type === "shop";
    if (placeFilter === "autres") return place.type === "other";
    return true;
  });

  const requestedPage = Number.parseInt(params.page || "1", 10);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDirectoryPlaces.length / PLACES_PER_PAGE)
  );

  const currentPage = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1;

  const startIndex = (currentPage - 1) * PLACES_PER_PAGE;

  const visibleDirectoryPlaces = filteredDirectoryPlaces.slice(
    startIndex,
    startIndex + PLACES_PER_PAGE
  );

  function buildDirectoryUrl({
    type = placeFilter,
    page = 1,
    anchor = "repertoire-desktop",
  }: {
    type?: string;
    page?: number;
    anchor?: string;
  } = {}) {
    const query = new URLSearchParams();

    if (type && type !== "toutes") query.set("type", type);
    if (page > 1) query.set("page", String(page));

    const queryString = query.toString();

    return `/bonnes-adresses${queryString ? `?${queryString}` : ""}${
      anchor ? `#${anchor}` : ""
    }`;
  }

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">

      {/* HERO */}
      <section className="border-b border-[var(--lpv-line)]">
        <div className="lpv-container grid gap-6 py-10 md:grid-cols-[0.68fr_0.32fr] md:items-end md:gap-10 md:py-24">
          <div>
            <p className="lpv-kicker hidden text-[var(--lpv-cocoa)] md:block">
              Répertoire
            </p>

            <h1 className="lpv-display max-w-5xl text-[clamp(4rem,16vw,5rem)] leading-[0.82] tracking-[-0.055em] md:mt-7 md:text-[clamp(4.8rem,10vw,10rem)]">
              Les bonnes
              <br />
              adresses.
            </h1>
          </div>

          <div className="pt-0 md:border-t-0 md:pb-2 md:pt-6">
            <p className="max-w-md text-[0.95rem] leading-7 text-[var(--lpv-muted)] md:text-base md:leading-8">
              Restaurants, bars à vin, cavistes et endroits où l’on aime
              revenir pour boire un bon verre.
            </p>

            <p className="mt-7 hidden text-xs uppercase tracking-[0.18em] text-[var(--lpv-cocoa)] md:block">
              {places.length} adresse{places.length !== 1 ? "s" : ""} à découvrir
            </p>
          </div>
        </div>
      </section>

      {/* AVEC NOUS */}
      {featuredPlaces.length > 0 ? (
        <>
          {/* MOBILE */}
          <section className="overflow-hidden bg-[var(--lpv-cocoa)] text-[var(--lpv-paper-light)] md:hidden">
            <div className="pb-5 pt-5">
              <div className="lpv-container">
                <p className="lpv-kicker text-white/50">
                  Avec nous
                </p>

                <h2 className="lpv-display mt-3 text-[3.5rem] leading-[0.84] tracking-[-0.05em]">
                  De plus près.
                </h2>

                <p className="mt-3 max-w-[300px] text-[0.7rem] leading-[1.45] text-white/55">
                  Des fiches réalisées avec les établissements et des
                  informations validées directement avec eux.
                </p>
              </div>

              <div className="mt-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex w-max snap-x snap-mandatory gap-3 px-4">
                  {featuredPlaces.map((place) => {
                    const authorizedImage = getAuthorizedImage(place);

                    const localPartnerImage =
                      place.slug === "saucette"
                        ? "/images/lpv/bonnes%20adresses/saucette1.jpg"
                        : place.slug === "beyt"
                          ? "/images/lpv/bonnes%20adresses/beyt3.jpg"
                          : place.slug === "buvette-pastek"
                            ? "/images/lpv/bonnes%20adresses/pastek1.jpg"
                            : place.slug === "candide"
                              ? "/images/lpv/bonnes%20adresses/candide1.jpg"
                              : place.slug === "le-vin-dans-les-voiles"
                                ? "/images/lpv/bonnes%20adresses/vindanslesvoiles1.jpg"
                                : place.slug === "polari"
                                  ? "/images/lpv/bonnes%20adresses/polari1.jpg"
                                  : null;

                    const imageSrc = localPartnerImage
                      ? localPartnerImage
                      : authorizedImage
                        ? urlFor(authorizedImage)
                            .width(800)
                            .height(600)
                            .fit("crop")
                            .url()
                        : null;

                    const location = getLocation(place);

                    return (
                      <article
                        key={place._id}
                        className="w-[62vw] max-w-[255px] shrink-0 snap-start bg-[var(--lpv-paper)] text-[var(--lpv-ink)]"
                      >
                        <Link
                          href={`/bonnes-adresses/${place.slug}`}
                          className="flex h-[340px] flex-col"
                        >
                          <div className="h-[185px] shrink-0 overflow-hidden bg-[var(--lpv-paper-light)]">
                            {imageSrc ? (
                              <img
                                src={imageSrc}
                                alt={place.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center px-7 text-center">
                                <span className="lpv-kicker text-[var(--lpv-muted)]/45">
                                  {place.name}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-4">
                            <p className="text-[0.48rem] font-semibold uppercase tracking-[0.17em] text-[var(--lpv-cocoa)]">
                              Avec nous
                            </p>

                            <h3 className="lpv-display mt-2 text-[1.65rem] leading-[0.92] tracking-[-0.035em]">
                              {place.name}
                            </h3>

                            {location ? (
                              <p className="mt-auto border-t border-[var(--lpv-line)] pt-2.5 text-[0.48rem] uppercase leading-4 tracking-[0.14em] text-[var(--lpv-muted)]">
                                {location}
                              </p>
                            ) : null}
                          </div>
                        </Link>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="lpv-container mt-4">
                <p className="text-right text-[0.55rem] uppercase tracking-[0.18em] text-white/35">
                  {featuredPlaces.length} avec nous
                </p>
              </div>
            </div>
          </section>

          {/* DESKTOP */}
          <section className="hidden overflow-hidden bg-[var(--lpv-cocoa)] text-[var(--lpv-paper-light)] md:block">
            <div className="lpv-container py-16 lg:py-18">
              <div className="flex items-end justify-between gap-12">
                <div>
                  <p className="lpv-kicker text-white/50">
                    Avec nous
                  </p>

                  <h2 className="lpv-display mt-4 text-[clamp(4.2rem,5.7vw,6.4rem)] leading-[0.86] tracking-[-0.045em]">
                    De plus près.
                  </h2>
                </div>

                <div className="max-w-sm pb-1">
                  <p className="text-sm leading-6 text-white/60">
                    Des fiches réalisées avec les établissements et des
                    informations validées directement avec eux.
                  </p>
                </div>
              </div>

              <div className="mt-9 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex w-max gap-4 pr-12">
                  {featuredPlaces.map((place) => {
                    const authorizedImage = getAuthorizedImage(place);

                    const localPartnerImage =
                      place.slug === "saucette"
                        ? "/images/lpv/bonnes%20adresses/saucette1.jpg"
                        : place.slug === "beyt"
                          ? "/images/lpv/bonnes%20adresses/beyt3.jpg"
                          : place.slug === "buvette-pastek"
                            ? "/images/lpv/bonnes%20adresses/pastek1.jpg"
                            : place.slug === "candide"
                              ? "/images/lpv/bonnes%20adresses/candide1.jpg"
                              : place.slug === "le-vin-dans-les-voiles"
                                ? "/images/lpv/bonnes%20adresses/vindanslesvoiles1.jpg"
                                : place.slug === "polari"
                                  ? "/images/lpv/bonnes%20adresses/polari1.jpg"
                                  : null;

                    const imageSrc = localPartnerImage
                      ? localPartnerImage
                      : authorizedImage
                        ? urlFor(authorizedImage)
                            .width(1000)
                            .height(760)
                            .fit("crop")
                            .url()
                        : null;

                    const location = getLocation(place);

                    return (
                      <article
                        key={place._id}
                        className="group w-[365px] shrink-0 bg-[var(--lpv-paper)] text-[var(--lpv-ink)]"
                      >
                        <Link
                          href={`/bonnes-adresses/${place.slug}`}
                          className="flex h-full flex-col"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden bg-[var(--lpv-paper-light)]">
                            {imageSrc ? (
                              <img
                                src={imageSrc}
                                alt={place.name}
                                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.012]"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center px-8 text-center">
                                <span className="lpv-kicker text-[var(--lpv-muted)]/45">
                                  {place.name}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex min-h-[180px] flex-col px-6 pb-6 pt-5">
                            <p className="text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[var(--lpv-cocoa)]">
                              Avec nous
                            </p>

                            <h3 className="lpv-display mt-3 text-[2.5rem] leading-[0.9] tracking-[-0.035em]">
                              {place.name}
                            </h3>

                            {location ? (
                              <p className="mt-auto translate-y-[-6px] border-t border-[var(--lpv-line)] pt-3 text-[0.58rem] uppercase tracking-[0.15em] text-[var(--lpv-muted)]">
                                {location}
                              </p>
                            ) : null}
                          </div>
                        </Link>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-[0.58rem] uppercase tracking-[0.18em] text-white/35">
                  {featuredPlaces.length} avec nous
                </p>

                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-white/55">
                  Glisser →
                </p>
              </div>
            </div>
          </section>
        </>
      ) : null}

      {/* MOBILE — RÉPERTOIRE */}
      {directoryPlaces.length > 0 ? (
        <section
          id="repertoire"
          className="scroll-mt-20 bg-[var(--lpv-paper)] md:hidden"
        >
          <div className="lpv-container pb-7 pt-8">
            <div className="flex items-end justify-between gap-5 pb-5">
              <div>
                <h2 className="lpv-display text-[3.35rem] leading-[0.86] tracking-[-0.05em]">
                  Le Québec,
                  <br />
                  adresse par adresse.
                </h2>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[var(--lpv-line)] py-4">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.17em] text-[var(--lpv-muted)]">
                {filteredDirectoryPlaces.length} adresse
                {filteredDirectoryPlaces.length !== 1 ? "s" : ""}
              </p>
            </div>

            <nav
              aria-label="Filtrer le répertoire mobile"
              className="flex gap-5 overflow-x-auto border-b border-[var(--lpv-line)] pb-5 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {PLACE_FILTERS.map((filter) => (
                <Link
                  key={filter.value}
                  href={buildDirectoryUrl({
                    type: filter.value,
                    page: 1,
                    anchor: "repertoire",
                  })}
                  className={`relative shrink-0 pb-1 text-[0.57rem] font-semibold uppercase tracking-[0.14em] ${
                    placeFilter === filter.value
                      ? "text-[var(--lpv-cocoa)]"
                      : "text-[var(--lpv-muted)]"
                  }`}
                >
                  {filter.label}

                  {placeFilter === filter.value ? (
                    <span className="absolute inset-x-0 -bottom-[2px] h-px bg-[var(--lpv-cocoa)]" />
                  ) : null}
                </Link>
              ))}
            </nav>

            {visibleDirectoryPlaces.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-2 pt-3">
                  {visibleDirectoryPlaces.map((place, index) => {
                    const location = getLocation(place);
                    const cardNumber = String(startIndex + index + 1).padStart(
                      2,
                      "0"
                    );

                    return (
                      <article key={place._id} className="h-full min-w-0">
                        <Link
                          href={`/bonnes-adresses/${place.slug}`}
                          className="flex h-full min-h-[230px] flex-col bg-[var(--lpv-paper-light)] px-4 pb-4 pt-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            {place.lpvPartner ? (
                              <p className="inline-flex items-center bg-[var(--lpv-cocoa)] px-2 py-1.5 text-[0.44rem] font-semibold uppercase tracking-[0.14em] text-[var(--lpv-paper-light)]">
                                Avec nous
                              </p>
                            ) : (
                              <p className="text-[0.48rem] font-semibold uppercase tracking-[0.14em] text-[var(--lpv-cocoa)]">
                                {formatType(place.type)}
                              </p>
                            )}

                            <span className="text-[0.5rem] tracking-[0.13em] text-[var(--lpv-muted)] opacity-55">
                              {cardNumber}
                            </span>
                          </div>

                          <div className="mt-auto grid h-[140px] grid-rows-[88px_1fr]">
                            <div className="flex items-end">
                              <h3 className="lpv-display max-w-full text-[1.8rem] leading-[0.91] tracking-[-0.04em]">
                                {place.name}
                              </h3>
                            </div>

                            <div className="mt-4 border-t border-[var(--lpv-line)] pt-3">
                              <p className="text-[0.48rem] uppercase leading-4 tracking-[0.12em] text-[var(--lpv-muted)]">
                                {location || formatType(place.type)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </article>
                    );
                  })}
                </div>

                {totalPages > 1 ? (
                  <nav
                    aria-label="Pagination des bonnes adresses mobile"
                    className="mt-6 flex items-center justify-between gap-2 border-t border-[var(--lpv-line)] pt-5"
                  >
                    <div>
                      {currentPage > 1 ? (
                        <Link
                          href={buildDirectoryUrl({
                            page: currentPage - 1,
                            anchor: "repertoire",
                          })}
                          className="text-[0.56rem] uppercase tracking-[0.12em] text-[var(--lpv-ink)] transition-opacity hover:opacity-50"
                        >
                          ← Précédent
                        </Link>
                      ) : (
                        <span className="text-[0.56rem] uppercase tracking-[0.12em] text-[var(--lpv-muted)]/40">
                          ← Précédent
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {Array.from(
                        { length: totalPages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <Link
                          key={page}
                          href={buildDirectoryUrl({
                            page,
                            anchor: "repertoire",
                          })}
                          aria-current={
                            page === currentPage ? "page" : undefined
                          }
                          className={`flex h-9 min-w-9 items-center justify-center border px-2 text-xs ${
                            page === currentPage
                              ? "border-[var(--lpv-ink)] text-[var(--lpv-ink)]"
                              : "border-[var(--lpv-line)] text-[var(--lpv-muted)]"
                          }`}
                        >
                          {page}
                        </Link>
                      ))}
                    </div>

                    <div>
                      {currentPage < totalPages ? (
                        <Link
                          href={buildDirectoryUrl({
                            page: currentPage + 1,
                            anchor: "repertoire",
                          })}
                          className="text-[0.56rem] uppercase tracking-[0.12em] text-[var(--lpv-ink)] transition-opacity hover:opacity-50"
                        >
                          Suivant →
                        </Link>
                      ) : (
                        <span className="text-[0.56rem] uppercase tracking-[0.12em] text-[var(--lpv-muted)]/40">
                          Suivant →
                        </span>
                      )}
                    </div>
                  </nav>
                ) : null}
              </>
            ) : (
              <div className="py-12">
                <p className="lpv-display text-[2.5rem] leading-[0.95]">
                  Aucune adresse dans cette sélection.
                </p>

                <Link
                  href="/bonnes-adresses#repertoire"
                  className="lpv-text-link mt-6"
                >
                  Voir toutes les adresses →
                </Link>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* DESKTOP — RÉPERTOIRE */}
      {directoryPlaces.length > 0 ? (
        <section
          id="repertoire-desktop"
          className="hidden scroll-mt-24 bg-[var(--lpv-paper)] md:block"
        >
          <div className="lpv-container pb-10 pt-20 lg:pt-24">
            <div className="grid grid-cols-[0.72fr_0.28fr] items-end gap-12 pb-9">
              <div>
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  Le répertoire
                </p>

                <h2 className="lpv-display mt-5 text-[clamp(4.1rem,6.4vw,7.1rem)] leading-[0.86] tracking-[-0.045em]">
                  Le Québec,
                  <br />
                  adresse par adresse.
                </h2>
              </div>

              <div className="justify-self-end pb-2">
                <p className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[var(--lpv-cocoa)]">
                  {filteredDirectoryPlaces.length} adresse
                  {filteredDirectoryPlaces.length !== 1 ? "s" : ""}
                </p>

                <p className="mt-4 max-w-xs text-sm leading-6 text-[var(--lpv-muted)]">
                  Restaurants, bars à vin, cavistes et autres endroits
                  où le vin vaut le détour.
                </p>
              </div>
            </div>

            <nav
              aria-label="Filtrer le répertoire"
              className="mb-8 flex items-center gap-7 border-t border-[var(--lpv-line)] pt-5"
            >
              <span className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-[var(--lpv-muted)]">
                Afficher
              </span>

              {PLACE_FILTERS.map((filter) => (
                <Link
                  key={filter.value}
                  href={buildDirectoryUrl({
                    type: filter.value,
                    page: 1,
                  })}
                  className={`relative pb-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] transition-opacity hover:opacity-55 ${
                    placeFilter === filter.value
                      ? "text-[var(--lpv-cocoa)]"
                      : "text-[var(--lpv-muted)]"
                  }`}
                >
                  {filter.label}

                  {placeFilter === filter.value ? (
                    <span className="absolute inset-x-0 -bottom-[2px] h-px bg-[var(--lpv-cocoa)]" />
                  ) : null}
                </Link>
              ))}
            </nav>

            {visibleDirectoryPlaces.length > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-[10px]">
                  {visibleDirectoryPlaces.map((place, index) => {
                    const location = getLocation(place);
                    const cardNumber = String(startIndex + index + 1).padStart(
                      2,
                      "0"
                    );

                    return (
                      <article
                        key={place._id}
                        className="group min-w-0"
                      >
                        <Link
                          href={`/bonnes-adresses/${place.slug}`}
                          className="relative flex min-h-[280px] flex-col overflow-hidden bg-[var(--lpv-paper-light)] px-8 pb-7 pt-7 transition-[transform,background-color] duration-300 hover:-translate-y-[2px]"
                        >
                          <div className="flex items-start justify-between gap-5">
                            <div>
                              {place.lpvPartner ? (
                                <p className="inline-flex items-center bg-[var(--lpv-cocoa)] px-2.5 py-1.5 text-[0.52rem] font-semibold uppercase tracking-[0.17em] text-[var(--lpv-paper-light)]">
                                  Avec nous
                                </p>
                              ) : (
                                <p className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-[var(--lpv-cocoa)]">
                                  {formatType(place.type)}
                                </p>
                              )}
                            </div>

                            <span className="text-[0.6rem] tracking-[0.16em] text-[var(--lpv-muted)] opacity-55">
                              {cardNumber}
                            </span>
                          </div>

                          <div className="mt-auto">
                            <h3 className="lpv-display max-w-[94%] text-[clamp(2.25rem,2.7vw,3.2rem)] leading-[0.9] tracking-[-0.04em]">
                              {place.name}
                            </h3>

                            <div className="mt-6 flex items-end justify-between gap-5 border-t border-[var(--lpv-line)] pt-4">
                              <p className="text-[0.56rem] uppercase leading-5 tracking-[0.15em] text-[var(--lpv-muted)]">
                                {location || formatType(place.type)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </article>
                    );
                  })}
                </div>

                {totalPages > 1 ? (
                  <nav
                    aria-label="Pagination des bonnes adresses"
                    className="mt-8 flex items-center justify-between gap-3 pt-2 md:mt-10 md:flex-wrap md:gap-6 md:pt-6"
                  >
                    <div>
                      {currentPage > 1 ? (
                        <Link
                          href={buildDirectoryUrl({
                            page: currentPage - 1,
                          })}
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
                      {Array.from(
                        { length: totalPages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <Link
                          key={page}
                          href={buildDirectoryUrl({ page })}
                          aria-current={
                            page === currentPage ? "page" : undefined
                          }
                          className={`flex h-10 min-w-10 items-center justify-center border px-3 text-sm transition-opacity hover:opacity-60 ${
                            page === currentPage
                              ? "border-[var(--lpv-ink)] text-[var(--lpv-ink)]"
                              : "border-[var(--lpv-line)] text-[var(--lpv-muted)]"
                          }`}
                        >
                          {page}
                        </Link>
                      ))}
                    </div>

                    <div>
                      {currentPage < totalPages ? (
                        <Link
                          href={buildDirectoryUrl({
                            page: currentPage + 1,
                          })}
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
              </>
            ) : (
              <div className="border-y border-[var(--lpv-line)] py-16">
                <p className="lpv-display text-4xl">
                  Aucune adresse dans cette sélection.
                </p>

                <Link
                  href="/bonnes-adresses#repertoire-desktop"
                  className="mt-5 inline-flex text-sm text-[var(--lpv-cocoa)]"
                >
                  Voir toutes les adresses →
                </Link>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {places.length === 0 ? (
        <section className="lpv-container py-24 text-center">
          <p className="lpv-kicker text-[var(--lpv-cocoa)]">
            Bientôt
          </p>

          <h2 className="lpv-display mt-6 text-5xl md:text-7xl">
            Les premières adresses arrivent.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[var(--lpv-muted)]">
            Le répertoire grandira au fil des tables, des comptoirs et des
            endroits que l’on aura envie de vous faire découvrir.
          </p>
        </section>
      ) : null}

    </main>
  );
}
