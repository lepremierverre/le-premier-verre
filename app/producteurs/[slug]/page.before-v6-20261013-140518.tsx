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
        <section className="border-b border-[var(--lpv-line)] pb-14 pt-12 md:pb-20 md:pt-16">
          <p className="lpv-kicker text-[var(--lpv-cocoa)]">
            Producteur · Avec nous
          </p>

          <div className="mt-9 grid gap-10 md:mt-12 md:grid-cols-[1.03fr_0.97fr] md:items-start md:gap-20">
            <div className="md:pt-5">
              <h1
                className={`lpv-display tracking-[-0.05em] ${
                  producer.name.length > 18
                    ? "max-w-[11ch] text-[clamp(3.8rem,5.6vw,5.9rem)] leading-[0.87]"
                    : "max-w-[11ch] text-[clamp(4rem,5.9vw,6.2rem)] leading-[0.86]"
                }`}
              >
                {producer.name}
              </h1>

              {producer.oneLiner ? (
                <p className="mt-8 max-w-[29ch] border-t border-[var(--lpv-line)] pt-7 text-[clamp(1.2rem,1.55vw,1.55rem)] font-medium leading-[1.18] tracking-[-0.025em]">
                  {producer.oneLiner}
                </p>
              ) : producer.shortBio ? (
                <p className="mt-8 max-w-xl border-t border-[var(--lpv-line)] pt-7 text-lg leading-8">
                  {producer.shortBio}
                </p>
              ) : null}

              {producer.municipality || producer.region?.name ? (
                <p className="mt-8 text-[0.64rem] uppercase tracking-[0.17em] text-[var(--lpv-muted)]">
                  {producer.municipality
                    ? `${producer.municipality}, Québec`
                    : producer.region?.name}
                </p>
              ) : null}
            </div>

            {authorizedImageSrc ? (
              <div className="md:mt-12">
                <div className="aspect-[4/3] overflow-hidden bg-[var(--lpv-paper-light)]">
                  <img
                    src={authorizedImageSrc}
                    alt={producer.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {producer.mediaCredit ? (
                  <p className="mt-3 text-right text-[0.62rem] text-[var(--lpv-muted)]">
                    © {producer.mediaCredit}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>

        {/* LE DOMAINE */}
        {producer.bio?.length ? (
          <section className="py-16 md:py-24">
            <div className="grid gap-10 md:grid-cols-[0.4fr_0.6fr] md:gap-20">
              <div>
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  Le domaine
                </p>

                <h2 className="lpv-display mt-6 max-w-[9ch] text-[clamp(3.1rem,4.4vw,4.9rem)] leading-[0.9] tracking-[-0.05em]">
                  Faire des bulles au Québec.
                </h2>
              </div>

              <div className="lpv-prose max-w-3xl text-lg leading-9 md:pt-8">
                <PortableText value={producer.bio} />
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
          <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[var(--lpv-cocoa)] text-[var(--lpv-paper)]">
            <div className="lpv-container py-16 md:py-24">
              <div className="grid gap-8 md:grid-cols-[0.28fr_0.72fr] md:gap-20">
                <div>
                  <p className="lpv-kicker text-[var(--lpv-paper)] opacity-60">
                    Le Premier Verre
                  </p>

                  <p className="mt-5 text-[0.62rem] uppercase tracking-[0.18em] opacity-75">
                    Pourquoi Bergeville
                  </p>
                </div>

                <p className="max-w-4xl text-[clamp(1.8rem,2.65vw,3rem)] leading-[1.08] tracking-[-0.04em]">
                  {producer.whyWeFollow}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {/* 5 BOUTEILLES — TOUTES VISIBLES SUR DESKTOP */}
        {selectedWines.length ? (
          <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[var(--lpv-cocoa)] text-[var(--lpv-paper)]">
            <div className="lpv-container pb-20 pt-4 md:pb-24 md:pt-6">
              <div className="border-t border-[rgba(255,255,255,0.22)] pt-10">
                <div className="flex items-end justify-between gap-8">
                  <div>
                    <p className="lpv-kicker text-[var(--lpv-paper)] opacity-60">
                      À découvrir
                    </p>

                    <h2 className="lpv-display mt-5 text-[clamp(3.2rem,4.5vw,5rem)] leading-[0.9] tracking-[-0.05em]">
                      5 bouteilles à connaître.
                    </h2>
                  </div>

                  <Link
                    href="/vins"
                    className="hidden border-b border-[var(--lpv-paper)] pb-1 text-[0.6rem] uppercase tracking-[0.16em] md:inline-flex"
                  >
                    Tous leurs vins <span className="ml-2">→</span>
                  </Link>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-2 md:grid-cols-5 md:gap-3">
                  {selectedWines.map((wine, index) => (
                    <Link
                      key={wine._id}
                      href={`/vins/${wine.slug}`}
                      className="group flex min-h-[390px] flex-col bg-[var(--lpv-paper)] p-4 text-[var(--lpv-ink)] md:min-h-[455px] md:p-5"
                    >
                      <p className="lpv-display text-[1.35rem] text-[var(--lpv-muted)] opacity-55">
                        {String(index + 1).padStart(2, "0")}
                      </p>

                      <div className="flex min-h-0 flex-1 items-center justify-center py-4">
                        <BottleStage
                          image={wine.bottleImage}
                          alt={wine.name ?? "Bouteille de vin"}
                          color={wine.color ?? undefined}
                          variant="card"
                          className="h-full max-h-[245px] transition-transform duration-500 group-hover:scale-[1.015]"
                        />
                      </div>

                      <div className="border-t border-[var(--lpv-line)] pt-4">
                        <p className="min-h-[1rem] text-[0.52rem] uppercase tracking-[0.16em] text-[var(--lpv-muted)]">
                          {[formatColor(wine.color), wine.vintage]
                            .filter(Boolean)
                            .join(" · ") || "Vin"}
                        </p>

                        <h3 className="lpv-display mt-3 min-h-[3.8rem] text-[clamp(1.35rem,1.65vw,1.8rem)] leading-[0.95] tracking-[-0.035em]">
                          {wine.name}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>

                <Link
                  href="/vins"
                  className="mt-7 inline-flex border-b border-[var(--lpv-paper)] pb-1 text-[0.6rem] uppercase tracking-[0.16em] md:hidden"
                >
                  Tous leurs vins →
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        {/* VISITER */}
        {hasVisitInformation ? (
          <section className="py-16 md:py-24">
            <div className="grid gap-10 md:grid-cols-[0.36fr_0.64fr] md:gap-20">
              <div>
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  Sur place
                </p>

                <h2 className="lpv-display mt-6 max-w-[8ch] text-[clamp(3.3rem,4.8vw,5.3rem)] leading-[0.88] tracking-[-0.05em]">
                  Visiter {producer.name.replace(/^Domaine\s+/i, "")}.
                </h2>
              </div>

              <div className="md:pt-8">
                {producer.address ? (
                  <p className="lpv-display max-w-[20ch] text-[clamp(1.9rem,2.8vw,3.1rem)] leading-[1] tracking-[-0.04em]">
                    {producer.address}
                  </p>
                ) : producer.municipality ? (
                  <p className="lpv-display text-[clamp(1.9rem,2.8vw,3.1rem)] leading-[1] tracking-[-0.04em]">
                    {producer.municipality}, Québec
                  </p>
                ) : null}

                {producer.visitDetails ? (
                  <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--lpv-muted)]">
                    {producer.visitDetails}
                  </p>
                ) : null}

                <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4">
                  {typeof producer.openToVisitors === "boolean" ? (
                    <span className="text-[0.62rem] uppercase tracking-[0.16em]">
                      {producer.openToVisitors
                        ? "Visites au domaine"
                        : "Pas de visites"}
                    </span>
                  ) : null}

                  {producer.openToVisitors ? (
                    <span className="text-[0.62rem] uppercase tracking-[0.16em] text-[var(--lpv-muted)]">
                      {producer.reservationRequired
                        ? "Sur réservation"
                        : "Sans réservation"}
                    </span>
                  ) : null}
                </div>

                {producer.website || producer.instagram ? (
                  <div className="mt-10 flex flex-wrap items-center gap-x-9 gap-y-5">
                    {producer.website ? (
                      <ProducerWebsiteLink
                        href={producer.website}
                        producerId={producer._id}
                        locale="fr"
                        target="_blank"
                        rel="noreferrer"
                        className="lpv-text-link"
                      >
                        Site officiel <span>↗</span>
                      </ProducerWebsiteLink>
                    ) : null}

                    {producer.instagram ? (
                      <a
                        href={producer.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="lpv-text-link"
                      >
                        Instagram <span>↗</span>
                      </a>
                    ) : null}
                  </div>
                ) : null}
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
