import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { placeBySlugQuery } from "@/sanity/lib/queries";
import BottleStage from "@/components/wine/BottleStage";
import { buildDynamicMetadata } from "@/lib/seo/dynamic-metadata";

export const revalidate = 60;

type PlaceWine = {
  _id: string;
  name: string;
  slug: string;
  vintage?: number;
  color?: string;
  bottleImage?: SanityImageSource;
  approxPrice?: number;
  producer?: {
    _id?: string;
    name?: string;
    slug?: string;
  };
};

type Place = {
  name: string;
  type?: string;
  city?: string;
  region?: string;
  address?: string;
  website?: string;
  instagram?: string;
  instagramPosts?: {
    url: string;
  }[];
  coverImage?: SanityImageSource;
  description?: PortableTextBlock[];
  descriptionEn?: PortableTextBlock[];
  availableWines?: PlaceWine[];
  producerWines?: PlaceWine[];
};

function formatPrice(value?: number) {
  if (typeof value !== "number") return null;

  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(value);
}

function formatColor(value?: string) {
  if (!value) return null;

  const labels: Record<string, string> = {
    red: "Red",
    white: "White",
    rose: "Rosé",
    orange: "Orange",
    sparkling: "Sparkling",
    fortified: "Fortified",
  };

  return labels[value] || value;
}

function formatType(value?: string) {
  if (!value) return "Place";

  const labels: Record<string, string> = {
    restaurant: "Restaurant",
    "wine-bar": "Wine bar",
    caviste: "Wine shop",
    shop: "Shop",
    other: "Place",
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
    entity: "place",
    slug,
    locale: "en",
  });
}

export default async function PlacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const place = await client.fetch<Place | null>(
    placeBySlugQuery,
    { slug }
  );

  if (!place) notFound();

  const placeWines = Array.from(
    new Map(
      [
        ...(place.producerWines ?? []),
        ...(place.availableWines ?? []),
      ].map((wine) => [wine._id, wine])
    ).values()
  );

  const imageSrc = place.coverImage
    ? urlFor(place.coverImage)
        .width(1600)
        .height(1900)
        .fit("crop")
        .url()
    : null;

  const facts = [
    ["Type", formatType(place.type)],
    ["City", place.city],
    ["Region", place.region],
    ["Address", place.address],
      ["Website", place.website],
  ].filter(([, value]) => Boolean(value)) as [string, string][];

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <article className="lpv-container pb-24">
        <div className="pt-8 md:pt-10">
          <Link href="/en/places" className="lpv-text-link">
            <span>←</span> Back to places
          </Link>
        </div>

        <section className="border-b border-[var(--lpv-line)] pb-16 pt-10 md:pb-24 md:pt-16">
          {imageSrc && slug !== "le-tire-bouchon-vignoble-de-l-orpailleur" ? (
            <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr]">
              <div className="lg:sticky lg:top-24 lg:self-start">
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  {formatType(place.type)}
                </p>

                <h1 className="lpv-display mt-7 text-[clamp(4.5rem,8vw,8.5rem)] leading-[0.84]">
                  {place.name}
                </h1>

                <p className="mt-8 max-w-lg text-lg leading-8 text-[var(--lpv-muted)]">
                  {[place.city, place.region]
                    .filter(Boolean)
                    .join(" · ") || "A place to discover"}
                </p>

                {place.website ? (
                  <div className="mt-10 border-t border-[var(--lpv-line)] pt-7">
                    <a
                      href={place.website}
                      target="_blank"
                      rel="noreferrer"
                      className="lpv-text-link"
                    >
                      Website <span>↗</span>
                    </a>
                  </div>
                ) : null}
              </div>

              <div className="overflow-hidden bg-[var(--lpv-paper-light)]">
                <img
                  src={imageSrc}
                  alt={place.name}
                  className="min-h-[620px] w-full object-cover md:min-h-[780px]"
                />
              </div>
            </div>
          ) : (
            <div className="max-w-6xl">
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                {[
                  formatType(place.type),
                  place.city,
                ].filter(Boolean).join(" · ")}
              </p>

              <h1 className="lpv-display mt-7 max-w-7xl text-[clamp(4rem,8vw,8rem)] leading-[0.82] tracking-[-0.055em]">
                {place.name}
              </h1>

            </div>
          )}
        </section>

        {facts.length > 0 ? (
          <section className="grid gap-12 border-b border-[var(--lpv-line)] py-16 md:grid-cols-[0.36fr_0.64fr] md:py-20">
            <div>
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                Information
              </p>

              <h2 className="lpv-display mt-6 text-5xl leading-[0.9] md:text-6xl">
                At a glance.
              </h2>
            </div>

            <dl>
              {facts.map(([label, value], index) => (
                <div
                  key={label}
                  className={`grid gap-2 py-5 sm:grid-cols-[180px_1fr] ${
                    index === 0
                      ? ""
                      : "border-t border-[var(--lpv-line)]"
                  }`}
                >
                  <dt className="lpv-kicker text-[var(--lpv-muted)]">
                    {label}
                  </dt>

                  <dd className="text-lg leading-7 text-[var(--lpv-ink)]">
                    {label === "Website" ? (
                      <a
                        href={value}
                        target="_blank"
                        rel="noreferrer"
                        className="lpv-text-link"
                      >
                        Visit website <span>↗</span>
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {(place.descriptionEn || place.description)?.length ? (
          <section className="grid gap-10 py-16 md:grid-cols-[0.38fr_0.62fr] md:py-24">
            <div>
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                The place
              </p>

              <h2 className="lpv-display mt-6 text-5xl leading-[0.9] md:text-6xl">
                Why go.
              </h2>
            </div>

            <div className="lpv-prose max-w-2xl">
              <PortableText value={place.descriptionEn || place.description || []} />
            </div>
          </section>
        ) : null}

        {placeWines.length ? (
          <section className="border-b border-[var(--lpv-line)] py-16 md:py-24">
            <div className="flex items-end justify-between border-b border-[var(--lpv-line)] pb-7">
              <div>
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  Drink here
                </p>

                <h2 className="lpv-display mt-5 text-5xl leading-none md:text-7xl">
                  The wines.
                </h2>
              </div>

              <Link href="/en/wines" className="lpv-text-link hidden sm:inline-flex">
                All wines <span>→</span>
              </Link>
            </div>

            <div className="grid gap-x-8 md:grid-cols-2 xl:grid-cols-3 xl:gap-x-12">
              {placeWines.map((wine) => {
                const price = formatPrice(wine.approxPrice);

                return (
                  <article
                    key={wine._id}
                    className="group flex min-w-0 flex-col border-b border-[var(--lpv-line)] pt-10 pb-3"
                  >
                    <Link
                      href={`/en/wines/${wine.slug}`}
                      className="block w-full"
                    >
                      <BottleStage
                        image={wine.bottleImage}
                        alt={wine.name ?? "Wine bottle"}
                        color={wine.color ?? undefined}
                        variant="card"
                        className="transition duration-700 group-hover:scale-[1.025]"
                      />
                    </Link>

                    <div className="pt-7">
                      <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                        {[formatColor(wine.color), wine.vintage]
                          .filter(Boolean)
                          .join(" · ") || "Wine"}
                      </p>

                      <Link href={`/en/wines/${wine.slug}`}>
                        <h3 className="lpv-display mt-5 text-4xl leading-[0.92] transition-opacity group-hover:opacity-60 md:text-5xl">
                          {wine.name}
                        </h3>
                      </Link>

                      <div className="mt-7 flex items-end justify-between gap-6 border-t border-[var(--lpv-line)] pt-8 pb-1">
                        {price ? (
                          <p className="text-sm">{price}</p>
                        ) : (
                          <span />
                        )}

                        <Link
                          href={`/en/wines/${wine.slug}`}
                          className="lpv-text-link"
                        >
                          View <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}
      </article>
    </main>
  );
}
