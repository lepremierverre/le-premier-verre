import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { producersQuery } from "@/sanity/lib/queries";
import ProducerFilters from "@/components/producers/ProducerFilters";

export const revalidate = 60;

type Producer = {
  _id: string;
  name: string;
  slug: string;
  municipality?: string;
  oneLiner?: string;
  shortBio?: string;
  logo?: SanityImageSource;
  photo?: SanityImageSource;
  heroImage?: SanityImageSource;
  mediaPermissionStatus?:
    | "none"
    | "provided_by_producer"
    | "authorized_by_producer"
    | "lpv_original"
    | "licensed";
  mediaCredit?: string;
  country?: {
    name?: string;
    slug?: string;
  };
  region?: {
    name?: string;
    slug?: string;
  };
};

type ProducersPageProps = {
  searchParams?: Promise<{
    pays?: string;
    region?: string;
    page?: string;
  }>;
};

const PRODUCERS_PER_PAGE = 24;

const AUTHORIZED_MEDIA_STATUSES = [
  "provided_by_producer",
  "authorized_by_producer",
  "lpv_original",
  "licensed",
];

function getAuthorizedImage(producer: Producer) {
  const hasAuthorizedMedia = AUTHORIZED_MEDIA_STATUSES.includes(
    producer.mediaPermissionStatus || ""
  );

  if (!hasAuthorizedMedia) return null;

  return producer.heroImage || producer.photo || producer.logo || null;
}

function getLocation(producer: Producer) {
  return [
    producer.municipality,
    producer.region?.name,
    producer.country?.name,
  ]
    .filter(Boolean)
    .join(" · ");
}

export default async function ProducersPage({
  searchParams,
}: ProducersPageProps) {
  const params = (await searchParams) || {};
  const producers = await client.fetch<Producer[]>(producersQuery);

  const featuredProducers = producers.filter(
    (producer) => !!getAuthorizedImage(producer)
  );

  const directoryProducers = producers.filter(
    (producer) => !getAuthorizedImage(producer)
  );

  const countries = Array.from(
    new Map(
      directoryProducers
        .filter((producer) => producer.country?.slug && producer.country?.name)
        .map((producer) => [
          producer.country!.slug!,
          {
            slug: producer.country!.slug!,
            name: producer.country!.name!,
          },
        ])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name, "fr"));

  const regions = Array.from(
    new Map(
      directoryProducers
        .filter((producer) => producer.region?.slug && producer.region?.name)
        .map((producer) => [
          producer.region!.slug!,
          {
            slug: producer.region!.slug!,
            name: producer.region!.name!,
          },
        ])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name, "fr"));

  const selectedCountry = params.pays || "";
  const selectedRegion = params.region || "";

  const filteredDirectoryProducers = directoryProducers.filter((producer) => {
    const countryMatches =
      !selectedCountry || producer.country?.slug === selectedCountry;

    const regionMatches =
      !selectedRegion || producer.region?.slug === selectedRegion;

    return countryMatches && regionMatches;
  });

  const requestedPage = Number.parseInt(params.page || "1", 10);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredDirectoryProducers.length / PRODUCERS_PER_PAGE)
  );

  const currentPage = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1;

  const startIndex = (currentPage - 1) * PRODUCERS_PER_PAGE;

  const visibleDirectoryProducers = filteredDirectoryProducers.slice(
    startIndex,
    startIndex + PRODUCERS_PER_PAGE
  );

  function buildDirectoryUrl({
    pays = selectedCountry,
    region = selectedRegion,
    page = 1,
  }: {
    pays?: string;
    region?: string;
    page?: number;
  }) {
    const query = new URLSearchParams();

    if (pays) query.set("pays", pays);
    if (region) query.set("region", region);
    if (page > 1) query.set("page", String(page));

    const qs = query.toString();

    return qs ? `/producteurs?${qs}#repertoire` : "/producteurs#repertoire";
  }

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      {/* HERO */}
      <section className="border-b border-[var(--lpv-line)]">
        <div className="lpv-container grid gap-7 py-10 md:grid-cols-[0.68fr_0.32fr] md:items-end md:gap-10 md:py-24">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Répertoire
            </p>

            <h1 className="lpv-display mt-5 max-w-5xl text-[clamp(3.8rem,15vw,4.8rem)] leading-[0.84] md:mt-7 md:text-[clamp(4.8rem,10vw,10rem)] md:leading-[0.82]">
              Ceux qui
              <br />
              font le vin.
            </h1>
          </div>

          <div className="border-t border-[var(--lpv-line)] pt-5 md:border-t-0 md:pb-2 md:pt-6">
            <p className="max-w-md text-[0.95rem] leading-7 text-[var(--lpv-muted)] md:text-base md:leading-8">
              Des personnes, des gestes, des lieux et des façons de travailler
              qui donnent une identité aux bouteilles.
            </p>

            <p className="mt-5 text-[0.68rem] uppercase tracking-[0.18em] text-[var(--lpv-cocoa)] md:mt-7 md:text-xs">
              {producers.length} producteur
              {producers.length > 1 ? "s" : ""} dans la collection
            </p>
          </div>
        </div>
      </section>

      {/* À LA UNE */}
      {featuredProducers.length > 0 ? (
        <section className="lpv-container py-10 md:py-16">
          <div className="flex items-end justify-between border-b border-[var(--lpv-line)] pb-5 md:pb-6">
            <div>
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                Liens privilégiés
              </p>

              <h2 className="lpv-display mt-3 text-[2.8rem] leading-[0.95] md:mt-5 md:text-7xl md:leading-none">
                Ceux qu’on connaît de plus près.
              </h2>
            </div>

            <p className="hidden max-w-xs text-right text-sm leading-6 text-[var(--lpv-muted)] md:block">
              Des domaines avec qui Le Premier Verre échange directement,
              et qui nous ouvrent une fenêtre sur leur travail.
            </p>
          </div>

          <div className="grid gap-x-10 md:grid-cols-2">
            {featuredProducers.map((producer) => {
              const image = getAuthorizedImage(producer);

              const imageSrc = image
                ? urlFor(image)
                    .width(1600)
                    .height(1000)
                    .fit("crop")
                    .url()
                : null;

              const location = getLocation(producer);

              return (
                <article
                  key={producer._id}
                  className="group flex h-full flex-col border-b border-[var(--lpv-line)] py-7 md:py-10"
                >
                  <Link
                    href={`/producteurs/${producer.slug}`}
                    className="block"
                  >
                    {imageSrc ? (
                      <div className="h-[280px] overflow-hidden bg-[var(--lpv-paper-light)] sm:h-[340px] md:aspect-[16/10] md:h-auto">
                        <img
                          src={imageSrc}
                          alt={producer.name}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.015]"
                        />
                      </div>
                    ) : null}
                  </Link>

                  <div className="flex flex-1 flex-col pt-5 md:pt-6">
                    <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                      Producteur
                    </p>

                    <Link href={`/producteurs/${producer.slug}`}>
                      <h3 className="lpv-display mt-3 text-[clamp(2.65rem,11vw,3.4rem)] leading-[0.9] tracking-[-0.035em] transition-opacity group-hover:opacity-60 md:mt-5 md:text-[clamp(3.4rem,5.5vw,6rem)] md:leading-[0.88]">
                        {producer.name}
                      </h3>
                    </Link>

                    {location ? (
                      <p className="mt-3 text-[0.68rem] uppercase tracking-[0.14em] text-[var(--lpv-muted)] md:mt-5 md:text-xs">
                        {location}
                      </p>
                    ) : null}

                    {producer.oneLiner || producer.shortBio ? (
                      <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--lpv-muted)] md:mt-6 md:text-base md:leading-7">
                        {producer.oneLiner || producer.shortBio}
                      </p>
                    ) : null}

                    <div className="mt-auto flex items-end justify-between gap-4 pt-5 md:gap-6 md:pt-8">
                      <Link
                        href={`/producteurs/${producer.slug}`}
                        className="lpv-text-link"
                      >
                        Découvrir <span>→</span>
                      </Link>

                      {producer.mediaCredit ? (
                        <p className="text-[0.6rem] text-[var(--lpv-muted)]">
                          © {producer.mediaCredit}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* RÉPERTOIRE */}
      {directoryProducers.length > 0 ? (
        <section
          id="repertoire"
          className="scroll-mt-24 border-t border-[var(--lpv-line)]"
        >
          <div className="lpv-container py-10 md:py-24">
            <div className="grid gap-5 border-b border-[var(--lpv-line)] pb-6 md:grid-cols-[0.65fr_0.35fr] md:items-end md:gap-8 md:pb-8">
              <div>
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  Le répertoire
                </p>

                <h2 className="lpv-display mt-3 text-[clamp(3.1rem,13vw,4rem)] leading-[0.86] md:mt-5 md:text-[clamp(4rem,8vw,8rem)] md:leading-[0.84]">
                  Tous les
                  <br />
                  producteurs.
                </h2>
              </div>

              <p className="max-w-sm text-[0.95rem] leading-7 text-[var(--lpv-muted)] md:justify-self-end md:text-base md:leading-8">
                Des domaines d’ici et d’ailleurs à connaître, à suivre et à
                découvrir au fil des bouteilles.
              </p>
            </div>

            <div className="mt-8 md:mt-20">
              <ProducerFilters
                countries={countries}
                regions={regions}
                selectedCountry={selectedCountry}
                selectedRegion={selectedRegion}
              />
            </div>

            <div className="flex items-center justify-between border-b border-[var(--lpv-line)] py-4 md:py-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--lpv-muted)]">
                {filteredDirectoryProducers.length} producteur
                {filteredDirectoryProducers.length > 1 ? "s" : ""}
              </p>

              {totalPages > 1 ? (
                <p className="text-xs text-[var(--lpv-muted)]">
                  Page {currentPage} / {totalPages}
                </p>
              ) : null}
            </div>

            <div>
              {visibleDirectoryProducers.map((producer, index) => {
                const location = getLocation(producer);

                return (
                  <article
                    key={producer._id}
                    className="group border-b border-[var(--lpv-line)]"
                  >
                    <Link
                      href={`/producteurs/${producer.slug}`}
                      className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 py-4 transition-opacity group-hover:opacity-60 md:grid-cols-[3.25rem_minmax(0,0.9fr)_minmax(0,0.65fr)_2rem] md:items-center md:gap-8 md:py-7"
                    >
                      <span className="text-[0.6rem] tracking-[0.16em] text-[var(--lpv-muted)]">
                        {String(
                          featuredProducers.length +
                            startIndex +
                            index +
                            1
                        ).padStart(2, "0")}
                      </span>

                      <h3 className="lpv-display text-[clamp(1.8rem,7.5vw,2.2rem)] leading-[0.94] tracking-[-0.035em] md:text-[clamp(2rem,3vw,3.5rem)] md:leading-[0.92]">
                        {producer.name}
                      </h3>

                      <div>
                        {location ? (
                          <p className="text-[0.6rem] uppercase leading-5 tracking-[0.13em] text-[var(--lpv-muted)] md:text-[0.65rem]">
                            {location}
                          </p>
                        ) : null}

                        {producer.oneLiner || producer.shortBio ? (
                          <p className="mt-1 line-clamp-1 text-xs leading-5 text-[var(--lpv-muted)] md:mt-2 md:text-sm md:leading-6">
                            {producer.oneLiner || producer.shortBio}
                          </p>
                        ) : null}
                      </div>

                      <span
                        aria-hidden="true"
                        className="text-right text-lg transition-transform duration-300 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </Link>
                  </article>
                );
              })}
            </div>

            {filteredDirectoryProducers.length === 0 ? (
              <div className="border-b border-[var(--lpv-line)] py-16">
                <p className="lpv-display text-4xl md:text-5xl">
                  Aucun producteur pour ces filtres.
                </p>

                <Link
                  href="/producteurs#repertoire"
                  className="lpv-text-link mt-7"
                >
                  Voir tout le répertoire <span>→</span>
                </Link>
              </div>
            ) : null}

            {totalPages > 1 ? (
              <nav
                aria-label="Pagination des producteurs"
                className="mt-12 flex flex-wrap items-center justify-between gap-6 pt-8"
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
                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;

                    return (
                      <Link
                        key={pageNumber}
                        href={buildDirectoryUrl({
                          page: pageNumber,
                        })}
                        aria-current={
                          pageNumber === currentPage ? "page" : undefined
                        }
                        className={`flex h-10 min-w-10 items-center justify-center border px-3 text-sm transition-opacity hover:opacity-60 ${
                          pageNumber === currentPage
                            ? "border-[var(--lpv-ink)] text-[var(--lpv-ink)]"
                            : "border-[var(--lpv-line)] text-[var(--lpv-muted)]"
                        }`}
                      >
                        {pageNumber}
                      </Link>
                    );
                  })}
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
          </div>
        </section>
      ) : null}

      {producers.length === 0 ? (
        <section className="lpv-container py-24 text-center">
          <p className="lpv-kicker text-[var(--lpv-cocoa)]">
            Bientôt
          </p>

          <h2 className="lpv-display mt-6 text-5xl md:text-7xl">
            Les portraits arrivent.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[var(--lpv-muted)]">
            Les premiers producteurs seront ajoutés au fil des rencontres et
            des bouteilles découvertes.
          </p>

          <Link href="/vins" className="lpv-button mt-9">
            Explorer les vins
          </Link>
        </section>
      ) : null}
    </main>
  );
}
