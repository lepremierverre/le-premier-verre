import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { regionBySlugQuery } from "@/sanity/lib/queries";

import BottleStage from "@/components/wine/BottleStage";
import { buildDynamicMetadata } from "@/lib/seo/dynamic-metadata";

export const revalidate = 60;

type RegionDetail = {
  _id: string;
  name: string;
  slug: string;

  country?: {
    name?: string;
    slug?: string;
  };

  parentRegion?: {
    name?: string;
    slug?: string;
  };

  introduction?: PortableTextBlock[];
  locationText?: string;
  climate?: string;

  signatureGrapes?: {
    _id?: string;
    name?: string;
    slug?: string;
  }[];

  characteristics?: {
    _key?: string;
    title?: string;
    text?: string;
  }[];

  producers?: {
    _id: string;
    name: string;
    slug: string;
    municipality?: string;
    oneLiner?: string;
  }[];

  wines?: {
    _id: string;
    name: string;
    slug: string;
    vintage?: number;
    color?: string;
    bottleImage?: SanityImageSource;
    approxPrice?: number;
    producer?: {
      name?: string;
      slug?: string;
    };
  }[];

  guides?: {
    _id: string;
    title: string;
    slug: string;
    excerpt?: string;
    coverImage?: SanityImageSource;
  }[];

  appellations?: {
    _id: string;
    name: string;
    slug: string;
  }[];

  soilTypes?: string[];
  mainWineStyles?: string[];
};

function formatPrice(value?: number) {
  if (typeof value !== "number") return null;

  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
  }).format(value);
}

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
    entity: "region",
    slug,
    locale: "fr",
  });
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const region = await client.fetch<RegionDetail | null>(
    regionBySlugQuery,
    { slug }
  );

  if (!region) notFound();

  const locationLabel = [
    region.parentRegion?.name,
    region.country?.name,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <article className="lpv-container pb-24">

        {/* RETOUR */}

        <div className="pt-8 md:pt-10">
          <Link href="/regions" className="lpv-text-link">
            <span>←</span> Retour aux régions
          </Link>
        </div>

        {/* HERO */}

        <section className="pb-16 pt-14 md:pb-24 md:pt-20">

          <div className="max-w-5xl">

            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              {locationLabel || "Région viticole"}
            </p>

            <h1 className="lpv-display mt-6 text-[clamp(4.5rem,10vw,10rem)] leading-[0.82] tracking-[-0.055em]">
              {region.name}
            </h1>

            {region.introduction?.length ? (
              <div className="lpv-prose mt-16 max-w-none text-lg leading-8 text-[var(--lpv-muted)] md:mt-20">
                <PortableText value={region.introduction} />
              </div>
            ) : null}

          </div>

        </section>

        {/* TERRITOIRE + CLIMAT */}

        {(region.locationText || region.climate) ? (
          <section className="border-t border-[var(--lpv-line)] py-16 md:py-24">

            <div className="grid gap-16 md:grid-cols-2 md:gap-20 lg:gap-28">

              {region.locationText ? (
                <div>
                  <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                    Le territoire
                  </p>

                  <h2 className="lpv-display mt-5 text-[clamp(3rem,4.7vw,4.8rem)] leading-[0.9]">
                    Où sommes-nous?
                  </h2>

                  <p className="mt-8 max-w-xl text-[clamp(1.05rem,1.25vw,1.25rem)] leading-[1.65] text-[var(--lpv-muted)]">
                    {region.locationText}
                  </p>
                </div>
              ) : null}

              {region.climate ? (
                <div>
                  <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                    Dans les vignes
                  </p>

                  <h2 className="lpv-display mt-5 text-[clamp(3rem,4.7vw,4.8rem)] leading-[0.9]">
                    Le climat.
                  </h2>

                  <p className="mt-8 max-w-xl text-[clamp(1.05rem,1.25vw,1.25rem)] leading-[1.65] text-[var(--lpv-muted)]">
                    {region.climate}
                  </p>
                </div>
              ) : null}

            </div>

          </section>
        ) : null}

        {/* CÉPAGES */}

        {region.signatureGrapes?.length ? (
          <section className="border-t border-[var(--lpv-line)] py-16 md:py-24">

            <div className="grid gap-12 md:grid-cols-[0.34fr_0.66fr] md:gap-16">

              <div>
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  À reconnaître
                </p>

                <h2 className="lpv-display mt-5 text-5xl leading-[0.9] md:text-6xl">
                  Les cépages.
                </h2>
              </div>

              <div>

                {region.signatureGrapes.map((grape, index) => (
                  <div
                    key={grape._id || grape.name}
                    className={index === 0 ? "" : "border-t border-[var(--lpv-line)]"}
                  >
                    {grape.slug ? (
                      <Link
                        href={`/cepages/${grape.slug}`}
                        className="group flex items-center justify-between gap-8 py-5 md:py-6"
                      >
                        <span className="text-xl md:text-2xl">
                          {grape.name}
                        </span>

                        <span className="lpv-text-link opacity-60 transition-opacity group-hover:opacity-100">
                          Voir <span>→</span>
                        </span>
                      </Link>
                    ) : (
                      <div className="py-5 text-xl md:py-6 md:text-2xl">
                        {grape.name}
                      </div>
                    )}
                  </div>
                ))}

              </div>

            </div>

          </section>
        ) : null}

        {/* CARACTÉRISTIQUES */}

        {region.characteristics?.length ? (
          <section className="border-t border-[var(--lpv-line)] py-16 md:py-24">

            <div>
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                En bref
              </p>

              <h2 className="lpv-display mt-5 text-5xl leading-[0.9] md:text-7xl">
                Ce qu’il faut savoir.
              </h2>
            </div>

            <div className="mt-10 grid border-t border-[var(--lpv-line)] md:grid-cols-3">

              {region.characteristics.slice(0, 3).map((item, index) => (
                <div
                  key={item._key || `${item.title}-${index}`}
                  className={`py-10 md:min-h-[285px] md:px-10 md:py-12 ${
                    index > 0
                      ? "border-t border-[var(--lpv-line)] md:border-l md:border-t-0"
                      : ""
                  }`}
                >
                  <span className="text-[0.62rem] tracking-[0.18em] text-[var(--lpv-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {item.title ? (
                    <h3 className="mt-7 text-lg font-medium leading-snug md:text-xl">
                      {item.title}
                    </h3>
                  ) : null}

                  {item.text ? (
                    <p className="mt-6 max-w-md text-sm leading-7 text-[var(--lpv-muted)]">
                      {item.text}
                    </p>
                  ) : null}
                </div>
              ))}

            </div>

          </section>
        ) : null}

        {/* PRODUCTEURS */}

        {region.producers?.length ? (
          <section className="border-t border-[var(--lpv-line)] py-16 md:py-24">

            <div className="flex flex-wrap items-end justify-between gap-8">

              <div>
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  Ceux qu’on suit
                </p>

                <h2 className="lpv-display mt-5 text-5xl leading-none md:text-7xl">
                  Les producteurs.
                </h2>
              </div>

              <Link
                href="/producteurs"
                className="lpv-text-link hidden sm:inline-flex"
              >
                Tous les producteurs <span>→</span>
              </Link>

            </div>

            <div className="mt-12">

              {region.producers.map((producer, index) => (
                <Link
                  key={producer._id}
                  href={`/producteurs/${producer.slug}`}
                  className="group grid gap-4 py-6 transition-opacity hover:opacity-55 md:grid-cols-[56px_1fr_auto] md:items-center"
                >
                  <span className="text-[0.62rem] tracking-[0.18em] text-[var(--lpv-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <h3 className="lpv-display text-3xl leading-none md:text-4xl">
                        {producer.name}
                      </h3>

                      {producer.municipality ? (
                        <span className="lpv-kicker text-[var(--lpv-cocoa)]">
                          {producer.municipality}
                        </span>
                      ) : null}
                    </div>

                    {producer.oneLiner ? (
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--lpv-muted)]">
                        {producer.oneLiner}
                      </p>
                    ) : null}
                  </div>

                  <span className="lpv-text-link justify-self-start md:justify-self-end">
                    Découvrir <span>→</span>
                  </span>
                </Link>
              ))}

            </div>

          </section>
        ) : null}

        {/* VINS */}

        {region.wines?.length ? (
          <section className="border-t border-[var(--lpv-line)] py-16 md:py-24">

            <div className="flex flex-wrap items-end justify-between gap-8">

              <div>
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  À boire
                </p>

                <h2 className="lpv-display mt-5 text-5xl leading-none md:text-7xl">
                  Les vins.
                </h2>
              </div>

              <Link
                href="/vins"
                className="lpv-text-link hidden sm:inline-flex"
              >
                Tous les vins <span>→</span>
              </Link>

            </div>

            <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {region.wines.map((wine) => {
                const price = formatPrice(wine.approxPrice);

                return (
                  <article
                    key={wine._id}
                    className="group flex min-w-0 h-full flex-col"
                  >

                    <Link
                      href={`/vins/${wine.slug}`}
                      className="block"
                    >
                      <BottleStage
                        image={wine.bottleImage}
                        alt={wine.name}
                        color={wine.color}
                        variant="card"
                        className="!h-[230px] md:!h-[250px] transition duration-700 group-hover:scale-[1.025]"
                      />
                    </Link>

                    <div className="pt-5">

                      <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                        {[formatColor(wine.color), wine.vintage]
                          .filter(Boolean)
                          .join(" · ") || "Vin"}
                      </p>

                      <Link href={`/vins/${wine.slug}`}>
                        <h3 className="lpv-display mt-3 min-h-[3.55rem] text-[1.85rem] leading-[0.96] transition-opacity group-hover:opacity-60">
                          {wine.name}
                        </h3>
                      </Link>

                      {wine.producer?.name ? (
                        <p className="mt-3 text-sm text-[var(--lpv-muted)]">
                          {wine.producer.name}
                        </p>
                      ) : null}

                      <div className="mt-auto flex items-center justify-between gap-5 pt-4">

                        {price ? (
                          <p className="text-sm">
                            {price}
                          </p>
                        ) : (
                          <span />
                        )}

                        <Link
                          href={`/vins/${wine.slug}`}
                          className="lpv-text-link"
                        >
                          Voir <span>→</span>
                        </Link>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>

          </section>
        ) : null}

        {/* GUIDES */}

        {region.guides?.length ? (
          <section className="border-t border-[var(--lpv-line)] py-16 md:py-24">

            <div>
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                Pour aller plus loin
              </p>

              <h2 className="lpv-display mt-5 text-5xl leading-none md:text-7xl">
                Les guides.
              </h2>
            </div>

            <div className="mt-12 grid gap-12 md:grid-cols-2">

              {region.guides.map((guide) => {
                const guideImageSrc = guide.coverImage
                  ? urlFor(guide.coverImage)
                      .width(1000)
                      .fit("max")
                      .url()
                  : null;

                return (
                  <Link
                    key={guide._id}
                    href={`/guides/${guide.slug}`}
                    className="group"
                  >
                    {guideImageSrc ? (
                      <div className="mb-7 overflow-hidden bg-[var(--lpv-paper-light)]">
                        <img
                          src={guideImageSrc}
                          alt={guide.title}
                          className="h-[280px] w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                        />
                      </div>
                    ) : null}

                    <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                      Guide
                    </p>

                    <h3 className="lpv-display mt-4 text-4xl leading-[0.92] md:text-5xl">
                      {guide.title}
                    </h3>

                    {guide.excerpt ? (
                      <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--lpv-muted)]">
                        {guide.excerpt}
                      </p>
                    ) : null}

                    <span className="lpv-text-link mt-6">
                      Lire <span>→</span>
                    </span>
                  </Link>
                );
              })}

            </div>

          </section>
        ) : null}

      </article>
    </main>
  );
}
