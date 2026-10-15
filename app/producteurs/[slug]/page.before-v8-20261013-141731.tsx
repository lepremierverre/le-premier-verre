import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { producerBySlugQuery } from "@/sanity/lib/queries";
import BottleStage from "@/components/wine/BottleStage";
import { buildDynamicMetadata } from "@/lib/seo/dynamic-metadata";
import AnalyticsEvent from "@/components/analytics/AnalyticsEvent";
import ProducerWebsiteLink from "@/components/analytics/ProducerWebsiteLink";

export const revalidate = 60;

type Producer = {
  _id: string;
  name: string;
  slug: string;

  municipality?: string;

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
  mediaPermissionDate?: string;
  mediaPermissionNote?: string;

  oneLiner?: string;
  shortBio?: string;
  bio?: PortableTextBlock[];

  approach?: {
    _key?: string;
    title?: string;
    text?: string;
  }[];

  signatureGrapes?: {
    _id?: string;
    name?: string;
    slug?: string;
  }[];

  whyWeFollow?: string;

  openToVisitors?: boolean;
  visitDetails?: string;
  address?: string;
  reservationRequired?: boolean;
  website?: string;

  instagram?: string;
  facebook?: string;

  wines?: {
    _id: string;
    name: string;
    slug: string;
    vintage?: number;
    color?: string;
    bottleImage?: SanityImageSource;
    approxPrice?: number;
  }[];

  articles?: {
    _id: string;
    title: string;
    slug: string;
    excerpt?: string;
  }[];

  guides?: {
    _id: string;
    title: string;
    slug: string;
    excerpt?: string;
  }[];
};

function formatColor(value?: string) {
  if (!value) return null;

  const labels: Record<string, string> = {
    red: "Rouge",
    white: "Blanc",
    rose: "Rosé",
    orange: "Orange",
    sparkling: "Effervescent",
    fortified: "Fortifié",
  };

  return labels[value] || value;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return buildDynamicMetadata({
    entity: "producer",
    slug,
    locale: "fr",
  });
}

export default async function ProducerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const producer = await client.fetch<Producer | null>(
    producerBySlugQuery,
    { slug }
  );

  if (!producer) notFound();

  const authorizedMediaStatuses = new Set([
    "provided_by_producer",
    "authorized_by_producer",
    "lpv_original",
    "licensed",
  ]);

  const hasAuthorizedMedia =
    !!producer.mediaPermissionStatus &&
    authorizedMediaStatuses.has(producer.mediaPermissionStatus);

  const authorizedImage = hasAuthorizedMedia
    ? producer.heroImage || producer.photo || producer.logo
    : null;

  const authorizedImageSrc = authorizedImage
    ? urlFor(authorizedImage).width(1600).fit("max").url()
    : null;

  const hasVisitInformation =
    producer.openToVisitors !== undefined ||
    Boolean(producer.address) ||
    Boolean(producer.visitDetails) ||
    Boolean(producer.website) ||
    Boolean(producer.instagram);

  const selectedWines = producer.wines?.slice(0, 5) ?? [];

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <AnalyticsEvent
        eventName="producer_view"
        data={{ producerId: producer._id }}
      />

      <article className="lpv-container pb-24">
        <div className="pt-8 md:pt-10">
          <Link href="/producteurs" className="lpv-text-link">
            <span>←</span> Retour aux producteurs
          </Link>
        </div>

        {/* HERO */}
        <section className="pb-14 pt-12 md:pb-20 md:pt-16">
          <div className="grid gap-10 md:grid-cols-[0.39fr_0.61fr] md:items-start md:gap-16">

            <div className="md:pt-10">
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                Producteur · Avec nous
              </p>

              <h1
                className={`lpv-display mt-12 tracking-[-0.055em] ${
                  producer.name.length > 18
                    ? "max-w-[9ch] text-[clamp(4rem,5vw,5.6rem)] leading-[0.86]"
                    : "max-w-[9ch] text-[clamp(4.2rem,5.3vw,5.9rem)] leading-[0.85]"
                }`}
              >
                {producer.name}
              </h1>

              {producer.oneLiner ? (
                <p className="mt-8 max-w-[31ch] text-[clamp(1.05rem,1.25vw,1.28rem)] leading-[1.38] tracking-[-0.018em]">
                  {producer.oneLiner}
                </p>
              ) : producer.shortBio ? (
                <p className="mt-8 max-w-[31ch] text-lg leading-8">
                  {producer.shortBio}
                </p>
              ) : null}

              {producer.municipality || producer.region?.name ? (
                <p className="mt-8 text-[0.6rem] uppercase tracking-[0.19em] text-[var(--lpv-muted)]">
                  {producer.municipality
                    ? `${producer.municipality}, Québec`
                    : producer.region?.name}
                </p>
              ) : null}
            </div>

            {authorizedImageSrc ? (
              <figure className="md:mt-16">
                <div className="aspect-[1.42/1] overflow-hidden bg-[var(--lpv-paper-light)]">
                  <img
                    src={authorizedImageSrc}
                    alt={producer.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {producer.mediaCredit ? (
                  <figcaption className="mt-3 text-right text-[0.6rem] text-[var(--lpv-muted)]">
                    © {producer.mediaCredit}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}

          </div>
        </section>

        {/* LE DOMAINE */}
        {producer.bio?.length ? (
          <section className="pb-16 pt-8 md:pb-24 md:pt-14">
            <div className="grid gap-12 md:grid-cols-[0.39fr_0.61fr] md:gap-16">

              <div>
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  Le domaine
                </p>

                <p className="lpv-display mt-7 max-w-[10ch] text-[clamp(3.6rem,5.15vw,5.7rem)] leading-[0.86] tracking-[-0.055em]">
                  La nordicité, sans compromis.
                </p>
              </div>

              <div className="max-w-3xl md:pt-8">
                <div className="lpv-prose text-[1.05rem] leading-8 md:text-[1.08rem] md:leading-9">
                  <PortableText value={producer.bio} />
                </div>
              </div>

            </div>
          </section>
        ) : null}

        {/* TROIS CHOSES */}
        {producer.approach?.length ? (
          <section className="pb-16 md:pb-24">
            <div className="mb-9 flex items-end justify-between">
              <div>
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  À savoir
                </p>

                <h2 className="lpv-display mt-5 text-[clamp(3rem,4.2vw,4.7rem)] leading-[0.9] tracking-[-0.05em]">
                  Trois choses.
                </h2>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {producer.approach.slice(0, 3).map((item, index) => (
                <article
                  key={item._key || `${item.title}-${index}`}
                  className="flex min-h-[310px] flex-col bg-[var(--lpv-cocoa)] p-7 text-[var(--lpv-paper)] md:min-h-[350px] md:p-9"
                >
                  <p className="text-[0.58rem] tracking-[0.2em] opacity-55">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  {item.title ? (
                    <h3 className="lpv-display mt-10 max-w-[10ch] text-[clamp(2rem,2.7vw,3rem)] leading-[0.94] tracking-[-0.04em]">
                      {item.title}
                    </h3>
                  ) : null}

                  {item.text ? (
                    <p className="mt-auto max-w-sm pt-10 text-sm leading-7 opacity-70">
                      {item.text}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {/* CÉPAGES — volontairement non cliquables au lancement */}
        {producer.signatureGrapes?.length ? (
          <section className="border-y border-[var(--lpv-line)] py-10 md:py-12">
            <div className="grid gap-5 md:grid-cols-[0.23fr_0.77fr] md:items-baseline">
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                Dans les vignes
              </p>

              <p className="lpv-display max-w-5xl text-[clamp(1.7rem,2.4vw,2.65rem)] leading-[1.05] tracking-[-0.035em]">
                {producer.signatureGrapes
                  .map((grape) => grape.name)
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </section>
        ) : null}

        {/* POURQUOI BERGEVILLE */}
        {producer.whyWeFollow ? (
          <section className="py-16 md:py-24">
            <div className="grid gap-10 md:grid-cols-[0.28fr_0.72fr] md:gap-20">

              <div>
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  Le Premier Verre
                </p>

                <p className="mt-5 text-[0.61rem] uppercase tracking-[0.18em] text-[var(--lpv-muted)]">
                  Pourquoi {producer.name.replace(/^Domaine\s+/i, "")}
                </p>
              </div>

              <p className="max-w-[22ch] text-[clamp(2.6rem,3.7vw,4.15rem)] font-medium leading-[0.98] tracking-[-0.05em]">
                {producer.whyWeFollow}
              </p>

            </div>
          </section>
        ) : null}

        {/* 5 BOUTEILLES — SÉLECTION */}
        {selectedWines.length ? (
          <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
            <div className="lpv-container pb-20 pt-12 md:pb-24 md:pt-16">

              <div className="flex items-end justify-between gap-8">
                <div>
                  <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                    À découvrir
                  </p>

                  <h2 className="lpv-display mt-5 text-[clamp(3.2rem,4.5vw,5rem)] leading-[0.9] tracking-[-0.05em]">
                    5 bouteilles à connaître.
                  </h2>
                </div>

                <Link
                  href="/vins"
                  className="hidden text-[0.6rem] uppercase tracking-[0.17em] md:inline-flex md:items-center md:gap-3"
                >
                  <span>Tous leurs vins</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
                {selectedWines.map((wine, index) => (
                  <Link
                    key={wine._id}
                    href={`/vins/${wine.slug}`}
                    className="group flex min-h-[430px] flex-col border border-[var(--lpv-line)] bg-[var(--lpv-paper)] p-4 md:min-h-[500px] md:p-5"
                  >
                    <div className="flex items-start justify-between">
                      <span className="lpv-display text-[1.25rem] text-[var(--lpv-muted)] opacity-65">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="flex h-[250px] items-center justify-center py-5 md:h-[310px]">
                      <BottleStage
                        image={wine.bottleImage}
                        alt={wine.name ?? "Bouteille de vin"}
                        color={wine.color ?? undefined}
                        variant="card"
                        className="h-full max-h-[270px] transition-transform duration-500 group-hover:scale-[1.015]"
                      />
                    </div>

                    <div className="mt-auto border-t border-[var(--lpv-line)] pt-4">
                      <p className="text-[0.52rem] uppercase tracking-[0.17em] text-[var(--lpv-muted)]">
                        {[formatColor(wine.color), wine.vintage]
                          .filter(Boolean)
                          .join(" · ") || "Vin"}
                      </p>

                      <h3 className="lpv-display mt-3 min-h-[3.4rem] text-[clamp(1.45rem,1.6vw,1.75rem)] leading-[0.94] tracking-[-0.035em]">
                        {wine.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                href="/vins"
                className="mt-7 inline-flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.17em] md:hidden"
              >
                <span>Tous leurs vins</span>
                <span aria-hidden="true">→</span>
              </Link>

            </div>
          </section>
        ) : null}

        {/* VISITER */}
        {hasVisitInformation ? (
          <section className="pb-20 pt-8 md:pb-28 md:pt-12">
            <div className="grid gap-12 md:grid-cols-[0.36fr_0.64fr] md:gap-20">

              <div>
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  Sur place
                </p>

                <h2 className="lpv-display mt-6 max-w-[9ch] text-[clamp(3.2rem,4.5vw,5rem)] leading-[0.88] tracking-[-0.05em]">
                  Venir chez {producer.name.replace(/^Domaine\s+/i, "")}.
                </h2>

                {producer.address ? (
                  <p className="mt-8 max-w-[29ch] text-sm leading-6 text-[var(--lpv-muted)]">
                    {producer.address}
                  </p>
                ) : producer.municipality ? (
                  <p className="mt-8 text-sm leading-6 text-[var(--lpv-muted)]">
                    {producer.municipality}, Québec
                  </p>
                ) : null}
              </div>

              <div className="md:pt-8">

                {producer.visitDetails ? (
                  <p className="mb-10 max-w-2xl text-[1rem] leading-8 text-[var(--lpv-muted)]">
                    {producer.visitDetails}
                  </p>
                ) : null}

                <div className="max-w-2xl">

                  {typeof producer.openToVisitors === "boolean" ? (
                    <div className="grid grid-cols-[150px_24px_1fr] items-baseline gap-3 border-b border-[var(--lpv-line)] py-5 md:grid-cols-[190px_35px_1fr]">
                      <span className="text-[0.61rem] uppercase tracking-[0.17em] text-[var(--lpv-muted)]">
                        Visites au domaine
                      </span>

                      <span className="text-[var(--lpv-muted)]">→</span>

                      <span className="text-[0.78rem] uppercase tracking-[0.12em]">
                        {producer.openToVisitors
                          ? producer.reservationRequired
                            ? "Sur réservation"
                            : "Sans réservation"
                          : "Non"}
                      </span>
                    </div>
                  ) : null}

                  {producer.website ? (
                    <div className="grid grid-cols-[150px_24px_1fr] items-baseline gap-3 border-b border-[var(--lpv-line)] py-5 md:grid-cols-[190px_35px_1fr]">
                      <span className="text-[0.61rem] uppercase tracking-[0.17em] text-[var(--lpv-muted)]">
                        Site officiel
                      </span>

                      <span className="text-[var(--lpv-muted)]">→</span>

                      <ProducerWebsiteLink
                        href={producer.website}
                        producerId={producer._id}
                        locale="fr"
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex w-fit items-center gap-2 text-[0.78rem] tracking-[-0.01em]"
                      >
                        <span>
                          {producer.website
                            .replace(/^https?:\/\//, "")
                            .replace(/^www\./, "")
                            .replace(/\/$/, "")}
                        </span>
                        <span
                          aria-hidden="true"
                          className="text-[0.65rem] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        >
                          ↗
                        </span>
                      </ProducerWebsiteLink>
                    </div>
                  ) : null}

                  {producer.instagram ? (
                    <div className="grid grid-cols-[150px_24px_1fr] items-baseline gap-3 py-5 md:grid-cols-[190px_35px_1fr]">
                      <span className="text-[0.61rem] uppercase tracking-[0.17em] text-[var(--lpv-muted)]">
                        Instagram
                      </span>

                      <span className="text-[var(--lpv-muted)]">→</span>

                      <a
                        href={producer.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex w-fit items-center gap-2 text-[0.78rem] tracking-[-0.01em]"
                      >
                        <span>
                          @
                          {producer.instagram
                            .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
                            .replace(/^@/, "")
                            .replace(/\/.*$/, "")}
                        </span>

                        <span
                          aria-hidden="true"
                          className="text-[0.65rem] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        >
                          ↗
                        </span>
                      </a>
                    </div>
                  ) : null}

                </div>
              </div>

            </div>
          </section>
        ) : null}

        {/* CONTENU ASSOCIÉ */}
        {producer.articles?.length || producer.guides?.length ? (
          <section className="border-t border-[var(--lpv-line)] py-16 md:py-24">
            <div className="border-b border-[var(--lpv-line)] pb-6">
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                Pour aller plus loin
              </p>

              <h2 className="lpv-display mt-5 text-5xl leading-none md:text-7xl">
                À lire.
              </h2>
            </div>

            <div className="grid md:grid-cols-2">
              {producer.articles?.map((article, index) => (
                <Link
                  key={article._id}
                  href={`/blog/${article.slug}`}
                  className={`group border-b border-[var(--lpv-line)] py-10 ${
                    index % 2 === 0
                      ? "md:border-r md:pr-10"
                      : "md:pl-10"
                  }`}
                >
                  <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                    Article
                  </p>

                  <h3 className="lpv-display mt-5 text-4xl leading-[0.92]">
                    {article.title}
                  </h3>

                  {article.excerpt ? (
                    <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--lpv-muted)]">
                      {article.excerpt}
                    </p>
                  ) : null}

                  <span className="lpv-text-link mt-7">
                    Lire <span>→</span>
                  </span>
                </Link>
              ))}

              {producer.guides?.map((guide, index) => (
                <Link
                  key={guide._id}
                  href={`/guides/${guide.slug}`}
                  className={`group border-b border-[var(--lpv-line)] py-10 ${
                    index % 2 === 0
                      ? "md:border-r md:pr-10"
                      : "md:pl-10"
                  }`}
                >
                  <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                    Guide
                  </p>

                  <h3 className="lpv-display mt-5 text-4xl leading-[0.92]">
                    {guide.title}
                  </h3>

                  <span className="lpv-text-link mt-7">
                    Lire <span>→</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </main>
  );
}
