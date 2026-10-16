import Link from "next/link";
import PartnerShareButton from "@/components/share/PartnerShareButton";
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
  _id?: string;
  name: string;
  slug?: string;
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
  secondaryImage?: SanityImageSource;
  secondaryImageCredit?: string;
  mediaCredit?: string;
  mediaPermissionStatus?: "none" | "provided_by_place" | "authorized_by_place" | "lpv_original" | "licensed";
  lpvPartner?: boolean;
  highlights?: string[];
  highlightsEn?: string[];
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

  const useSaucettePartnerLayout =
    place.lpvPartner === true && slug === "saucette";

  if (useSaucettePartnerLayout) {
    const saucetteHighlights = [
      {
        title: "A selection that keeps moving",
        text: "More than a hundred references, with new arrivals constantly changing what is on the shelves.",
      },
      {
        title: "Wine shop by day, wine bar by night",
        text: "Take a bottle home or stay for a few glasses with Marie-Ève’s plates.",
      },
      {
        title: "It comes down to taste",
        text: "The conversation starts with what you like, not with what you are supposed to know.",
      },
    ];

    return (
      <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
        <article className="lpv-container pb-24">

          <div className="flex items-center justify-between pt-8 md:block md:pt-10">
            <Link
              href="/en/places"
              className="inline-flex items-center gap-3 py-2.5 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-50"
            >
              <span aria-hidden="true">←</span>
              <span>Places</span>
            </Link>

            <PartnerShareButton
              name="Saucette"
              imageUrl="/images/lpv/bonnes%20adresses/saucette1.jpg"
              locale="en"
              profileUrl="/en/places/saucette"
              kind="place"
            />
          </div>

          {/* HERO */}
          <section className="pt-8 md:pt-10">
            <div className="grid gap-10 md:grid-cols-[0.41fr_0.59fr] md:items-center md:gap-14">
              <div className="md:flex md:min-h-[31rem] md:translate-x-8 md:flex-col md:justify-center md:pr-6">
                <h1 className="lpv-display max-w-[8ch] text-[clamp(5.6rem,7.6vw,8.4rem)] leading-[0.79] tracking-[-0.065em]">
                  Saucette
                </h1>

                <p className="mt-9 max-w-[29ch] text-[clamp(1.05rem,1.25vw,1.25rem)] leading-[1.42] tracking-[-0.02em]">
                  Wine, good food and plenty of reasons to stay.
                </p>

                <p className="mt-8 text-[0.6rem] uppercase tracking-[0.19em] text-[var(--lpv-muted)]">
                  Saint-Lambert, Quebec
                </p>
              </div>

              <figure>
                <div className="aspect-[1.48/1] overflow-hidden bg-[var(--lpv-paper-light)]">
                  <img
                    src="/images/lpv/bonnes%20adresses/saucette1.jpg"
                    alt="Saucette in Saint-Lambert"
                    className="h-full w-full object-cover"
                  />
                </div>

                <figcaption className="mt-3 text-right text-[0.6rem] text-[var(--lpv-muted)]">
                  © Saucette
                </figcaption>
              </figure>
            </div>
          </section>

          {/* THE PLACE */}
          <section className="pb-16 pt-8 md:pb-20 md:pt-10">
            <div className="grid gap-10 md:grid-cols-[570px_minmax(0,1fr)] md:gap-12">
              <figure className="hidden w-full md:block md:w-[570px]">
                <div className="h-[520px] w-full overflow-hidden bg-[var(--lpv-paper-light)]">
                  <img
                    src="/images/lpv/bonnes%20adresses/saucette2.jpg"
                    alt="Inside Saucette"
                    className="h-full w-full object-cover"
                  />
                </div>

                <figcaption className="mt-3 text-right text-[0.6rem] text-[var(--lpv-muted)]">
                  © Saucette
                </figcaption>
              </figure>

              <div className="flex items-center">
                <div className="mx-auto max-w-[39rem]">
                  <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                    The place
                  </p>

                  <div className="mt-8 space-y-5 text-[1.08rem] leading-8 md:text-[1.12rem] md:leading-9">
                    <p>
                      In Saint-Lambert, Saucette brings a wine shop and a
                      neighbourhood wine bar under one roof. Catherine Denault
                      and Marie-Ève Collin created a place where you can pick up
                      a bottle, have a glass or share a few plates, but above all
                      get some guidance without needing to know much about wine.
                    </p>

                    <p>
                      Hospitality is a big part of how they do things. You can
                      walk in without knowing what you want to drink and simply
                      let yourself be surprised. The selection brings together
                      more than a hundred wines from small producers and
                      artisans, with new arrivals constantly changing what is
                      on the shelves.
                    </p>
                  </div>
                </div>
              </div>

              <figure className="mt-10 md:hidden">
                <div className="h-[430px] w-full overflow-hidden bg-[var(--lpv-paper-light)]">
                  <img
                    src="/images/lpv/bonnes%20adresses/saucette2.jpg"
                    alt="Inside Saucette"
                    className="h-full w-full object-cover"
                  />
                </div>

                <figcaption className="mt-2 text-right text-[0.55rem] text-[var(--lpv-muted)]">
                  © Saucette
                </figcaption>
              </figure>
            </div>
          </section>

          {/* THREE THINGS */}
          <section className="pb-12 pt-2 md:pb-28 md:pt-14">
            <h2 className="lpv-display max-w-[12ch] text-[2.9rem] leading-[0.88] tracking-[-0.05em] md:max-w-[15ch] md:text-[clamp(3.2rem,4.4vw,4.9rem)] md:leading-[0.9]">
              Three things to know.
            </h2>

            <div className="mt-8 grid border-t border-[var(--lpv-line)] md:mt-14 md:grid-cols-3">
              {saucetteHighlights.map((item, index) => (
                <article
                  key={item.title}
                  className={`relative flex flex-col py-6 md:min-h-[355px] md:px-9 md:py-11 ${
                    index > 0
                      ? "border-t border-[var(--lpv-line)] md:border-l md:border-t-0"
                      : ""
                  }`}
                >
                  <p className="text-[0.58rem] tracking-[0.2em] text-[var(--lpv-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3 className="lpv-display mt-4 max-w-[13ch] text-[1.8rem] leading-[0.94] tracking-[-0.04em] md:mt-8 md:min-h-[5.3rem] md:max-w-[11ch] md:text-[clamp(2rem,2.6vw,2.8rem)]">
                    {item.title}
                  </h3>

                  <p className="max-w-sm pt-4 text-[0.88rem] leading-6 text-[var(--lpv-muted)] md:absolute md:left-9 md:right-9 md:top-[215px] md:pt-0 md:text-sm md:leading-7">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* WHY SAUCETTE */}
          <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[var(--lpv-cocoa)] text-[var(--lpv-paper)]">
            <div className="lpv-container py-16 md:py-20">
              <div className="grid gap-10 md:grid-cols-[0.38fr_0.62fr] md:items-center md:gap-16">
                <div>
                  <h2 className="lpv-display max-w-[8ch] text-[clamp(3.5rem,4.8vw,5.3rem)] leading-[0.87] tracking-[-0.055em]">
                    Why Saucette.
                  </h2>

                  <p className="mt-6 max-w-[28ch] text-[1rem] leading-[1.5] opacity-70">
                    A place here is earned. Here’s what won us over.
                  </p>
                </div>

                <p className="max-w-[42ch] text-[clamp(1.25rem,1.55vw,1.6rem)] leading-[1.3] tracking-[-0.025em]">
                  Because you can walk in without knowing the grape, the region
                  or the right way to talk about wine. Catherine and Marie-Ève
                  start with what you like, ask a few questions and take you
                  somewhere new. It is exactly the kind of place that makes wine
                  simpler, more human and much more fun to discover.
                </p>
              </div>
            </div>
          </section>

          {/* WINE AT SAUCETTE */}
          <section className="py-16 md:py-24">
            <div className="grid gap-7 md:grid-cols-[0.36fr_0.64fr] md:gap-20">
              <div className="md:pl-10">
                <h2 className="lpv-display max-w-[8ch] text-[clamp(3.7rem,5vw,5.6rem)] leading-[0.87] tracking-[-0.055em]">
                  Wine at Saucette.
                </h2>
              </div>

              <div className="max-w-2xl space-y-5 text-[1rem] leading-8 text-[var(--lpv-muted)]">
                <p>
                  Catherine and Marie-Ève taste and choose the wines together.
                  They look first for bottles that spark something, made by
                  artisans whose way of working they believe in. Organic,
                  biodynamic and low-intervention approaches come up often in
                  the selection without becoming boxes that need to be checked.
                </p>

                <p>
                  The way they talk about wine is just as simple. Price, label
                  and appellation do not decide whether a wine is good. Their
                  advice comes down to a few words. Like what you like.
                </p>
              </div>
            </div>
          </section>

          {/* THEIR BOTTLES */}
          {placeWines.length ? (
            <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
              <div className="lpv-container pb-16 pt-10 md:pb-20 md:pt-14">
                <div className="md:pl-10">
                  <h2 className="lpv-display text-[clamp(3.2rem,4.5vw,5rem)] leading-[0.9] tracking-[-0.05em]">
                    Their bottles.
                  </h2>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
                  {placeWines.slice(0, 5).map((wine) => (
                    <Link
                      key={wine._id}
                      href={`/en/wines/${wine.slug}`}
                      className="group relative flex min-h-[390px] flex-col bg-[var(--lpv-paper-light)] p-5 md:min-h-[450px] md:p-6"
                    >
                      <div className="flex h-[235px] items-center justify-center py-4 md:h-[285px]">
                        <BottleStage
                          image={wine.bottleImage}
                          alt={wine.name ?? "Wine bottle"}
                          color={wine.color ?? undefined}
                          variant="card"
                          className="h-full max-h-[255px] transition-transform duration-500 ease-out group-hover:-translate-y-1 md:max-h-[270px]"
                        />
                      </div>

                      <div className="mt-auto border-t border-[var(--lpv-line)] pt-4">
                        <p className="text-[0.52rem] uppercase tracking-[0.17em] text-[var(--lpv-muted)]">
                          {[formatColor(wine.color), wine.vintage]
                            .filter(Boolean)
                            .join(" · ") || "Wine"}
                        </p>

                        <h3 className="lpv-display mt-3 min-h-[3.4rem] text-[clamp(1.45rem,1.6vw,1.75rem)] leading-[0.94] tracking-[-0.035em]">
                          {wine.name}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <section className="pb-4 pt-3 md:pb-8 md:pt-5">
              <div>
                <div className="md:pl-10">
                  <h2 className="lpv-display text-[clamp(3.2rem,4.5vw,5rem)] leading-[0.9] tracking-[-0.05em]">
                    Their bottles.
                  </h2>
                </div>

                <div className="mt-8 flex min-h-[180px] items-center justify-center px-6 py-10 text-center md:mt-10 md:min-h-[210px] md:py-12">
                  <div>
                    <p className="lpv-display text-[clamp(1.9rem,2.7vw,3rem)] leading-[0.92] tracking-[-0.04em]">
                      We’re working on it ;)
                    </p>

                    <p className="mx-auto mt-5 max-w-[520px] text-[0.95rem] leading-7 text-[var(--lpv-muted)]">
                      Our selection of bottles to discover at Saucette is coming soon.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* VISIT */}
          <section className="pb-5 pt-9 md:pb-16 md:pt-20">
            <div className="grid gap-7 md:grid-cols-[0.36fr_0.64fr] md:gap-20">

              <div className="md:pl-10">
                <h2 className="lpv-display max-w-[9ch] text-[3.15rem] leading-[0.87] tracking-[-0.055em] md:max-w-[8ch] md:text-[clamp(3.7rem,5vw,5.6rem)]">
                  Stop by Saucette.
                </h2>

                {place.address ? (
                  <p className="mt-5 max-w-[29ch] text-[0.95rem] leading-6 text-[var(--lpv-ink)]/72 md:mt-8 md:text-[1.05rem] md:leading-7">
                    {place.address}
                  </p>
                ) : null}
              </div>

              <div className="border-t border-[var(--lpv-line)] pt-5 md:pt-7">
                <div className="grid gap-5 md:grid-cols-3 md:gap-8">

                  <div>
                    <p className="text-[0.5rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                      Type
                    </p>
                    <p className="mt-2 text-[0.9rem]">
                      Wine shop + wine bar
                    </p>
                  </div>

                  {place.website ? (
                    <div>
                      <p className="text-[0.5rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                        Website
                      </p>
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-[0.9rem] underline decoration-[0.05em] underline-offset-[4px] transition-opacity hover:opacity-55"
                      >
                        {place.website
                          .replace(/^https?:\/\//, "")
                          .replace(/^www\./, "")
                          .replace(/\/$/, "")}
                      </a>
                    </div>
                  ) : null}

                  {place.instagram ? (
                    <div>
                      <p className="text-[0.5rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                        Instagram
                      </p>
                      <a
                        href={place.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-[0.9rem] underline decoration-[0.05em] underline-offset-[4px] transition-opacity hover:opacity-55"
                      >
                        @saucettecaviste
                      </a>
                    </div>
                  ) : null}

                </div>
              </div>

            </div>
          </section>

        </article>
      </main>
    );
  }

  const useBeytPartnerLayout =
    place.lpvPartner === true && slug === "beyt";

  if (useBeytPartnerLayout) {
    const beytHighlights = [
      {
        title: "Beyt means home",
        text: "A nod to Anthony’s Lebanese roots and to the sense of hospitality at the heart of the project.",
      },
      {
        title: "A table made for sharing",
        text: "Lebanese and Mediterranean-inspired plates designed to make their way around the table.",
      },
      {
        title: "Wine belongs at the table",
        text: "A selection of small producers chosen for what their wines bring to the meal as much as for the stories behind them.",
      },
    ];

    return (
      <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
        <article className="lpv-container pb-24">

          <div className="flex items-center justify-between pt-8 md:block md:pt-10">
            <Link
              href="/en/places"
              className="inline-flex items-center gap-3 py-2.5 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-50"
            >
              <span aria-hidden="true">←</span>
              <span>Places</span>
            </Link>

            <PartnerShareButton
              name="Beyt"
              imageUrl="/images/lpv/bonnes%20adresses/beyt3.jpg"
              locale="en"
              profileUrl="/en/places/beyt"
              kind="place"
            />
          </div>

          {/* HERO */}
          <section className="pt-8 md:pt-10">
            <div className="grid gap-10 md:grid-cols-[0.41fr_0.59fr] md:items-center md:gap-14">
              <div className="md:flex md:min-h-[31rem] md:translate-x-8 md:flex-col md:justify-center md:pr-6">
                <h1 className="lpv-display max-w-[8ch] text-[clamp(5.6rem,7.6vw,8.4rem)] leading-[0.79] tracking-[-0.065em]">
                  Beyt
                </h1>

                <p className="mt-9 max-w-[29ch] text-[clamp(1.05rem,1.25vw,1.25rem)] leading-[1.42] tracking-[-0.02em]">
                  A wine bar and restaurant where hospitality comes first.
                </p>

                <p className="mt-8 text-[0.6rem] uppercase tracking-[0.19em] text-[var(--lpv-muted)]">
                  Montreal, Quebec
                </p>
              </div>

              <figure>
                <div className="aspect-[1.48/1] overflow-hidden bg-[var(--lpv-paper-light)]">
                  <img
                    src="/images/lpv/bonnes%20adresses/beyt3.jpg"
                    alt="Beyt in Montreal"
                    className="h-full w-full object-cover"
                  />
                </div>

                <figcaption className="mt-3 text-right text-[0.6rem] text-[var(--lpv-muted)]">
                  © Beyt
                </figcaption>
              </figure>
            </div>
          </section>

          {/* THE PLACE */}
          <section className="pb-16 pt-8 md:pb-20 md:pt-10">
            <div className="grid gap-10 md:grid-cols-[570px_minmax(0,1fr)] md:gap-12">
              <figure className="hidden w-full md:block md:w-[570px]">
                <div className="h-[520px] w-full overflow-hidden bg-[var(--lpv-paper-light)]">
                  <img
                    src="/images/lpv/bonnes%20adresses/beyt1.jpg"
                    alt="Inside Beyt"
                    className="h-full w-full object-cover"
                  />
                </div>

                <figcaption className="mt-3 text-right text-[0.6rem] text-[var(--lpv-muted)]">
                  © Beyt
                </figcaption>
              </figure>

              <div className="flex items-center">
                <div className="mx-auto max-w-[39rem]">
                  <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                    The place
                  </p>

                  <div className="mt-8 space-y-5 text-[1.08rem] leading-8 md:text-[1.12rem] md:leading-9">
                    <p>
                      Beyt means home in Arabic. The name says a lot about
                      this Montreal cave à manger imagined by Anthony Gebrayel
                      and Angélique Custeau. You come for a glass, share a few
                      plates and quickly find yourself wanting to stay.
                    </p>

                    <p>
                      The food draws from Lebanon and the Mediterranean and
                      is made for sharing. Wine follows the same spirit, with
                      a selection of small producers and bottles chosen to
                      complement both the table and the moment.
                    </p>
                  </div>
                </div>
              </div>

              <figure className="mt-10 md:hidden">
                              <div className="h-[430px] w-full overflow-hidden bg-[var(--lpv-paper-light)]">
                                <img
                                  src="/images/lpv/bonnes%20adresses/beyt1.jpg"
                                  alt="Inside Beyt"
                                  className="h-full w-full object-cover"
                                />
                              </div>

                              <figcaption className="mt-2 text-right text-[0.55rem] text-[var(--lpv-muted)]">
                                © Beyt
                              </figcaption>
                            </figure>
            </div>
          </section>

          {/* THREE THINGS */}
          <section className="pb-12 pt-2 md:pb-28 md:pt-14">
            <h2 className="lpv-display max-w-[12ch] text-[2.9rem] leading-[0.88] tracking-[-0.05em] md:max-w-[15ch] md:text-[clamp(3.2rem,4.4vw,4.9rem)] md:leading-[0.9]">
              Three things to know.
            </h2>

            <div className="mt-8 grid border-t border-[var(--lpv-line)] md:mt-14 md:grid-cols-3">
              {beytHighlights.map((item, index) => (
                <article
                  key={item.title}
                  className={`relative flex flex-col py-6 md:min-h-[355px] md:px-9 md:py-11 ${
                    index > 0
                      ? "border-t border-[var(--lpv-line)] md:border-l md:border-t-0"
                      : ""
                  }`}
                >
                  <p className="text-[0.58rem] tracking-[0.2em] text-[var(--lpv-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3 className="lpv-display mt-4 max-w-[13ch] text-[1.8rem] leading-[0.94] tracking-[-0.04em] md:mt-8 md:min-h-[5.3rem] md:max-w-[11ch] md:text-[clamp(2rem,2.6vw,2.8rem)]">
                    {item.title}
                  </h3>

                  <p className="max-w-sm pt-4 text-[0.88rem] leading-6 text-[var(--lpv-muted)] md:absolute md:left-9 md:right-9 md:top-[215px] md:pt-0 md:text-sm md:leading-7">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* WHY BEYT */}
          <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[var(--lpv-cocoa)] text-[var(--lpv-paper)]">
            <div className="lpv-container py-16 md:py-20">
              <div className="grid gap-10 md:grid-cols-[0.38fr_0.62fr] md:items-center md:gap-16">
                <div>
                  <h2 className="lpv-display max-w-[8ch] text-[clamp(3.5rem,4.8vw,5.3rem)] leading-[0.87] tracking-[-0.055em]">
                    Why Beyt.
                  </h2>

                  <p className="mt-6 max-w-[28ch] text-[1rem] leading-[1.5] opacity-70">
                    A place here is earned. Here’s what won us over.
                  </p>
                </div>

                <p className="max-w-[42ch] text-[clamp(1.25rem,1.55vw,1.6rem)] leading-[1.3] tracking-[-0.025em]">
                  Because wine does not live on its own here. It comes with
                  the plates, the spices, the conversations and that generous
                  way of welcoming people. Beyt makes discovery feel simple
                  and delicious. You come to eat, open a bottle and somewhere
                  between the two, you already want to stay.
                </p>
              </div>
            </div>
          </section>

          {/* WINE AT BEYT */}
          <section className="py-16 md:py-24">
            <div className="grid gap-7 md:grid-cols-[0.36fr_0.64fr] md:gap-20">
              <div className="md:pl-10">
                <h2 className="lpv-display max-w-[9ch] text-[3.15rem] leading-[0.87] tracking-[-0.055em] md:max-w-[8ch] md:text-[clamp(3.7rem,5vw,5.6rem)]">
                  Wine at Beyt.
                </h2>
              </div>

              <div className="max-w-2xl space-y-5 text-[1rem] leading-8 text-[var(--lpv-muted)]">
                <p>
                  The selection focuses on small producers and bottles that
                  naturally belong at the table. Wines that can sit alongside
                  spices, herbs, grilled dishes and plates made for sharing
                  without taking over.
                </p>

                <p>
                  The list changes with new arrivals and leaves plenty of room
                  for discovery. You can come in with something specific in
                  mind or simply choose your next glass based on what you are
                  eating.
                </p>
              </div>
            </div>
          </section>

          {/* THEIR BOTTLES */}
          {placeWines.length ? (
            <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
              <div className="lpv-container pb-16 pt-10 md:pb-20 md:pt-14">
                <div className="md:pl-10">
                  <h2 className="lpv-display text-[clamp(3.2rem,4.5vw,5rem)] leading-[0.9] tracking-[-0.05em]">
                    Their bottles.
                  </h2>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
                  {placeWines.slice(0, 5).map((wine) => (
                    <Link
                      key={wine._id}
                      href={`/en/wines/${wine.slug}`}
                      className="group relative flex min-h-[390px] flex-col bg-[var(--lpv-paper-light)] p-5 md:min-h-[450px] md:p-6"
                    >
                      <div className="flex h-[235px] items-center justify-center py-4 md:h-[285px]">
                        <BottleStage
                          image={wine.bottleImage}
                          alt={wine.name ?? "Wine bottle"}
                          color={wine.color ?? undefined}
                          variant="card"
                          className="h-full max-h-[255px] transition-transform duration-500 ease-out group-hover:-translate-y-1 md:max-h-[270px]"
                        />
                      </div>

                      <div className="mt-auto border-t border-[var(--lpv-line)] pt-4">
                        <p className="text-[0.52rem] uppercase tracking-[0.17em] text-[var(--lpv-muted)]">
                          {[formatColor(wine.color), wine.vintage]
                            .filter(Boolean)
                            .join(" · ") || "Wine"}
                        </p>

                        <h3 className="lpv-display mt-3 min-h-[3.4rem] text-[clamp(1.45rem,1.6vw,1.75rem)] leading-[0.94] tracking-[-0.035em]">
                          {wine.name}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <section className="pb-4 pt-3 md:pb-8 md:pt-5">
              <div>
                <div className="md:pl-10">
                  <h2 className="lpv-display text-[clamp(3.2rem,4.5vw,5rem)] leading-[0.9] tracking-[-0.05em]">
                    Their bottles.
                  </h2>
                </div>

                <div className="mt-8 flex min-h-[180px] items-center justify-center px-6 py-10 text-center md:mt-10 md:min-h-[210px] md:py-12">
                  <div>
                    <p className="lpv-display text-[clamp(1.9rem,2.7vw,3rem)] leading-[0.92] tracking-[-0.04em]">
                      We’re working on it ;)
                    </p>

                    <p className="mx-auto mt-5 max-w-[520px] text-[0.95rem] leading-7 text-[var(--lpv-muted)]">
                      Our selection of bottles to discover at Beyt is coming soon.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* VISIT */}
          <section className="pb-5 pt-9 md:pb-16 md:pt-20">
            <div className="grid gap-7 md:grid-cols-[0.36fr_0.64fr] md:gap-20">
              <div className="md:pl-10">
                <h2 className="lpv-display max-w-[9ch] text-[3.15rem] leading-[0.87] tracking-[-0.055em] md:max-w-[8ch] md:text-[clamp(3.7rem,5vw,5.6rem)]">
                  Stop by Beyt.
                </h2>

                {place.address ? (
                  <p className="mt-5 max-w-[29ch] text-[0.95rem] leading-6 text-[var(--lpv-ink)]/72 md:mt-8 md:text-[1.05rem] md:leading-7">
                    {place.address}
                  </p>
                ) : null}
              </div>

              <div className="border-t border-[var(--lpv-line)] pt-5 md:pt-7">
                <div className="grid gap-5 md:grid-cols-3 md:gap-8">
                  <div>
                    <p className="text-[0.5rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                      Type
                    </p>
                    <p className="mt-2 text-[0.9rem]">
                      Wine bar &amp; restaurant
                    </p>
                  </div>

                  {place.website ? (
                    <div>
                      <p className="text-[0.5rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                        Website
                      </p>
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-[0.9rem] underline decoration-[0.05em] underline-offset-[4px] transition-opacity hover:opacity-55"
                      >
                        {place.website
                          .replace(/^https?:\/\//, "")
                          .replace(/^www\./, "")
                          .replace(/\/$/, "")}
                      </a>
                    </div>
                  ) : null}

                  {place.instagram ? (
                    <div>
                      <p className="text-[0.5rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                        Instagram
                      </p>
                      <a
                        href={place.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-[0.9rem] underline decoration-[0.05em] underline-offset-[4px] transition-opacity hover:opacity-55"
                      >
                        @beytcaveamanger
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

        </article>
      </main>
    );
  }

  const usePastekPartnerLayout =
    place.lpvPartner === true && slug === "buvette-pastek";

  if (usePastekPartnerLayout) {
    const pastekHighlights = [
      {
        title: "In the heart of Old Montreal",
        text: "A wine bar on Saint-Paul where you can stop in for a glass, share a few plates and easily let the evening run a little longer.",
      },
      {
        title: "A list that keeps moving",
        text: "Natural wines, private imports and bottles chosen to make you want to discover something new.",
      },
      {
        title: "The food matters too",
        text: "Seasonal cooking made for sharing and designed to sit naturally alongside what is in your glass.",
      },
    ];

    return (
      <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
        <article className="lpv-container pb-24">

          <div className="flex items-center justify-between pt-8 md:block md:pt-10">
            <Link
              href="/en/places"
              className="inline-flex items-center gap-3 py-2.5 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-50"
            >
              <span aria-hidden="true">←</span>
              <span>Places</span>
            </Link>

            <PartnerShareButton
              name="Buvette Pastek"
              imageUrl="/images/lpv/bonnes%20adresses/pastek1.jpg"
              locale="en"
              profileUrl="/en/places/buvette-pastek"
              kind="place"
            />
          </div>

          {/* HERO */}
          <section className="pt-8 md:pt-10">
            <div className="grid gap-10 md:grid-cols-[0.41fr_0.59fr] md:items-center md:gap-14">
              <div className="md:flex md:min-h-[31rem] md:translate-x-8 md:flex-col md:justify-center md:pr-6">
                <h1 className="lpv-display max-w-[8ch] text-[clamp(5.6rem,7.6vw,8.4rem)] leading-[0.79] tracking-[-0.065em]">
                  Buvette Pastek
                </h1>

                <p className="mt-9 max-w-[29ch] text-[clamp(1.05rem,1.25vw,1.25rem)] leading-[1.42] tracking-[-0.02em]">
                  The kind of place where one glass often leads to another.
                </p>

                <p className="mt-8 text-[0.6rem] uppercase tracking-[0.19em] text-[var(--lpv-muted)]">
                  Montreal, Quebec
                </p>
              </div>

              <figure>
                <div className="aspect-[1.48/1] overflow-hidden bg-[var(--lpv-paper-light)]">
                  <img
                    src="/images/lpv/bonnes%20adresses/pastek1.jpg"
                    alt="Buvette Pastek in Montreal"
                    className="h-full w-full object-cover"
                  />
                </div>

                <figcaption className="mt-3 text-right text-[0.6rem] text-[var(--lpv-muted)]">
                  © Buvette Pastek
                </figcaption>
              </figure>
            </div>
          </section>

          {/* THE PLACE */}
          <section className="pb-16 pt-8 md:pb-20 md:pt-10">
            <div className="grid gap-10 md:grid-cols-[570px_minmax(0,1fr)] md:gap-12">
              <figure className="hidden w-full md:block md:w-[570px]">
                <div className="h-[520px] w-full overflow-hidden bg-[var(--lpv-paper-light)]">
                  <img
                    src="/images/lpv/bonnes%20adresses/pastek2.jpg"
                    alt="Inside Buvette Pastek"
                    className="h-full w-full object-cover"
                  />
                </div>

                <figcaption className="mt-3 text-right text-[0.6rem] text-[var(--lpv-muted)]">
                  © Buvette Pastek
                </figcaption>
              </figure>

              <div className="flex items-center">
                <div className="mx-auto max-w-[39rem]">
                  <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                    The place
                  </p>

                  <div className="mt-8 space-y-5 text-[1.08rem] leading-8 md:text-[1.12rem] md:leading-9">
                    <p>
                      On Saint-Paul Street, Buvette Pastek brings together
                      everything we like about a wine bar without making the
                      experience complicated. Stop in for a glass, discover a
                      bottle and share a few plates, then decide you might as
                      well stay.
                    </p>

                    <p>
                      The kitchen follows the seasons and wine has a real
                      place at the table. The selection leans toward natural
                      wines and private imports, with enough movement to
                      always leave something new to try.
                    </p>
                  </div>
                </div>
              </div>

              <figure className="mt-10 md:hidden">
                              <div className="h-[430px] w-full overflow-hidden bg-[var(--lpv-paper-light)]">
                                <img
                                  src="/images/lpv/bonnes%20adresses/pastek2.jpg"
                                  alt="Inside Buvette Pastek"
                                  className="h-full w-full object-cover"
                                />
                              </div>

                              <figcaption className="mt-2 text-right text-[0.55rem] text-[var(--lpv-muted)]">
                                © Buvette Pastek
                              </figcaption>
                            </figure>
            </div>
          </section>

          {/* THREE THINGS */}
          <section className="pb-12 pt-2 md:pb-28 md:pt-14">
            <h2 className="lpv-display max-w-[12ch] text-[2.9rem] leading-[0.88] tracking-[-0.05em] md:max-w-[15ch] md:text-[clamp(3.2rem,4.4vw,4.9rem)] md:leading-[0.9]">
              Three things to know.
            </h2>

            <div className="mt-8 grid border-t border-[var(--lpv-line)] md:mt-14 md:grid-cols-3">
              {pastekHighlights.map((item, index) => (
                <article
                  key={item.title}
                  className={`relative flex flex-col py-6 md:min-h-[355px] md:px-9 md:py-11 ${
                    index > 0
                      ? "border-t border-[var(--lpv-line)] md:border-l md:border-t-0"
                      : ""
                  }`}
                >
                  <p className="text-[0.58rem] tracking-[0.2em] text-[var(--lpv-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3 className="lpv-display mt-4 max-w-[13ch] text-[1.8rem] leading-[0.94] tracking-[-0.04em] md:mt-8 md:min-h-[5.3rem] md:max-w-[11ch] md:text-[clamp(2rem,2.6vw,2.8rem)]">
                    {item.title}
                  </h3>

                  <p className="max-w-sm pt-4 text-[0.88rem] leading-6 text-[var(--lpv-muted)] md:absolute md:left-9 md:right-9 md:top-[215px] md:pt-0 md:text-sm md:leading-7">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* WHY PASTEK */}
          <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[var(--lpv-cocoa)] text-[var(--lpv-paper)]">
            <div className="lpv-container py-16 md:py-20">
              <div className="grid gap-10 md:grid-cols-[0.38fr_0.62fr] md:items-center md:gap-16">
                <div>
                  <h2 className="lpv-display max-w-[8ch] text-[clamp(3.5rem,4.8vw,5.3rem)] leading-[0.87] tracking-[-0.055em]">
                    Why Pastek.
                  </h2>

                  <p className="mt-6 max-w-[28ch] text-[1rem] leading-[1.5] opacity-70">
                    A place here has to earn it. This is what won us over.
                  </p>
                </div>

                <p className="max-w-[42ch] text-[clamp(1.25rem,1.55vw,1.6rem)] leading-[1.3] tracking-[-0.025em]">
                  Pastek is one of those places where wine is taken seriously
                  without making the atmosphere serious. The selection makes
                  you want to try something new, the food follows naturally
                  and the advice stays approachable. Discovery happens
                  simply, around a good bottle and something to share.
                </p>
              </div>
            </div>
          </section>

          {/* WINE AT PASTEK */}
          <section className="py-16 md:py-24">
            <div className="grid gap-7 md:grid-cols-[0.36fr_0.64fr] md:gap-20">
              <div className="md:pl-10">
                <h2 className="lpv-display max-w-[9ch] text-[3.15rem] leading-[0.87] tracking-[-0.055em] md:max-w-[8ch] md:text-[clamp(3.7rem,5vw,5.6rem)]">
                  Wine at Pastek.
                </h2>
              </div>

              <div className="max-w-2xl space-y-5 text-[1rem] leading-8 text-[var(--lpv-muted)]">
                <p>
                  The list gives plenty of room to natural wines, private
                  imports and small producers. It changes with new arrivals,
                  with bottles chosen as much for their personality as for
                  the pleasure of drinking them at the table.
                </p>

                <p>
                  You do not need to know the producer or appellation before
                  ordering. Let the team guide you, try something new or
                  simply find the bottle that works with your meal.
                </p>
              </div>
            </div>
          </section>

          {/* THEIR BOTTLES */}
          {placeWines.length ? (
            <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
              <div className="lpv-container pb-16 pt-10 md:pb-20 md:pt-14">
                <div className="md:pl-10">
                  <h2 className="lpv-display text-[clamp(3.2rem,4.5vw,5rem)] leading-[0.9] tracking-[-0.05em]">
                    Their bottles.
                  </h2>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
                  {placeWines.slice(0, 5).map((wine) => (
                    <Link
                      key={wine._id}
                      href={`/en/wines/${wine.slug}`}
                      className="group relative flex min-h-[390px] flex-col bg-[var(--lpv-paper-light)] p-5 md:min-h-[450px] md:p-6"
                    >
                      <div className="flex h-[235px] items-center justify-center py-4 md:h-[285px]">
                        <BottleStage
                          image={wine.bottleImage}
                          alt={wine.name ?? "Wine bottle"}
                          color={wine.color ?? undefined}
                          variant="card"
                          className="h-full max-h-[255px] transition-transform duration-500 ease-out group-hover:-translate-y-1 md:max-h-[270px]"
                        />
                      </div>

                      <div className="mt-auto border-t border-[var(--lpv-line)] pt-4">
                        <p className="text-[0.52rem] uppercase tracking-[0.17em] text-[var(--lpv-muted)]">
                          {[formatColor(wine.color), wine.vintage]
                            .filter(Boolean)
                            .join(" · ") || "Wine"}
                        </p>

                        <h3 className="lpv-display mt-3 min-h-[3.4rem] text-[clamp(1.45rem,1.6vw,1.75rem)] leading-[0.94] tracking-[-0.035em]">
                          {wine.name}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <section className="pb-4 pt-3 md:pb-8 md:pt-5">
              <div>
                <div className="md:pl-10">
                  <h2 className="lpv-display text-[clamp(3.2rem,4.5vw,5rem)] leading-[0.9] tracking-[-0.05em]">
                    Their bottles.
                  </h2>
                </div>

                <div className="mt-8 flex min-h-[180px] items-center justify-center px-6 py-10 text-center md:mt-10 md:min-h-[210px] md:py-12">
                  <div>
                    <p className="lpv-display text-[clamp(1.9rem,2.7vw,3rem)] leading-[0.92] tracking-[-0.04em]">
                      We’re working on it ;)
                    </p>

                    <p className="mx-auto mt-5 max-w-[520px] text-[0.95rem] leading-7 text-[var(--lpv-muted)]">
                      Our selection of bottles to discover at Pastek is coming soon.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* VISIT PASTEK */}
          <section className="pb-5 pt-9 md:pb-16 md:pt-20">
            <div className="grid gap-7 md:grid-cols-[0.36fr_0.64fr] md:gap-20">
              <div className="md:pl-10">
                <h2 className="lpv-display max-w-[9ch] text-[3.15rem] leading-[0.87] tracking-[-0.055em] md:max-w-[8ch] md:text-[clamp(3.7rem,5vw,5.6rem)]">
                  Stop by Pastek.
                </h2>

                {place.address ? (
                  <p className="mt-5 max-w-[29ch] text-[0.95rem] leading-6 text-[var(--lpv-ink)]/72 md:mt-8 md:text-[1.05rem] md:leading-7">
                    {place.address}
                  </p>
                ) : null}
              </div>

              <div className="border-t border-[var(--lpv-line)] pt-5 md:pt-7">
                <div className="grid gap-5 md:grid-cols-3 md:gap-8">
                  <div>
                    <p className="text-[0.5rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                      Type
                    </p>
                    <p className="mt-2 text-[0.9rem]">
                      Wine bar
                    </p>
                  </div>

                  {place.website ? (
                    <div>
                      <p className="text-[0.5rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                        Website
                      </p>
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-[0.9rem] underline decoration-[0.05em] underline-offset-[4px] transition-opacity hover:opacity-55"
                      >
                        {place.website
                          .replace(/^https?:\/\//, "")
                          .replace(/^www\./, "")
                          .replace(/\/$/, "")}
                      </a>
                    </div>
                  ) : null}

                  {place.instagram ? (
                    <div>
                      <p className="text-[0.5rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                        Instagram
                      </p>
                      <a
                        href={place.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-[0.9rem] underline decoration-[0.05em] underline-offset-[4px] transition-opacity hover:opacity-55"
                      >
                        @buvettepastek
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

        </article>
      </main>
    );
  }

  const useCandidePartnerLayout =
    place.lpvPartner === true && slug === "candide";

  if (useCandidePartnerLayout) {
    const candideHighlights = [
      {
        title: "Inside a former presbytery",
        text: "Candide is set in a former presbytery in Petite-Bourgogne, a setting that gives the experience a character of its own.",
      },
      {
        title: "Quebec through the seasons",
        text: "The kitchen evolves with the seasons and new arrivals, with a strong focus on local producers and ingredients.",
      },
      {
        title: "Winemakers before labels",
        text: "The wine list puts the people who make the wine first, with particular attention to their work and the way they farm.",
      },
    ];

    return (
      <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
        <article className="lpv-container pb-24">

          <div className="flex items-center justify-between pt-8 md:block md:pt-10">
            <Link
              href="/en/places"
              className="inline-flex items-center gap-3 py-2.5 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-50"
            >
              <span aria-hidden="true">←</span>
              <span>Places</span>
            </Link>

            <PartnerShareButton
              name="Candide"
              imageUrl="/images/lpv/bonnes%20adresses/candide1.jpg"
              locale="en"
              profileUrl="/en/places/candide"
              kind="place"
            />
          </div>

          {/* HERO */}
          <section className="pt-8 md:pt-10">
            <div className="grid gap-10 md:grid-cols-[0.41fr_0.59fr] md:items-center md:gap-14">
              <div className="md:flex md:min-h-[31rem] md:translate-x-8 md:flex-col md:justify-center md:pr-6">
                <h1 className="lpv-display max-w-[8ch] text-[clamp(5.6rem,7.6vw,8.4rem)] leading-[0.79] tracking-[-0.065em]">
                  Candide
                </h1>

                <p className="mt-9 max-w-[29ch] text-[clamp(1.05rem,1.25vw,1.25rem)] leading-[1.42] tracking-[-0.02em]">
                  Local cooking, changing seasons and wines chosen with the same attention.
                </p>

                <p className="mt-8 text-[0.6rem] uppercase tracking-[0.19em] text-[var(--lpv-muted)]">
                  Montreal, Quebec
                </p>
              </div>

              <figure>
                <div className="aspect-[1.48/1] overflow-hidden bg-[var(--lpv-paper-light)]">
                  <img
                    src="/images/lpv/bonnes%20adresses/candide1.jpg"
                    alt="Restaurant Candide in Montreal"
                    className="h-full w-full object-cover"
                  />
                </div>

                <figcaption className="mt-3 text-right text-[0.6rem] text-[var(--lpv-muted)]">
                  © Candide
                </figcaption>
              </figure>
            </div>
          </section>

          {/* THE PLACE */}
          <section className="pb-16 pt-8 md:pb-20 md:pt-10">
            <div className="grid gap-10 md:grid-cols-[570px_minmax(0,1fr)] md:gap-12">
              <figure className="hidden w-full md:block md:w-[570px]">
                <div className="h-[520px] w-full overflow-hidden bg-[var(--lpv-paper-light)]">
                  <img
                    src="/images/lpv/bonnes%20adresses/candide2.jpg"
                    alt="At Candide in Montreal"
                    className="h-full w-full object-cover"
                  />
                </div>

                <figcaption className="mt-3 text-right text-[0.6rem] text-[var(--lpv-muted)]">
                  © Candide
                </figcaption>
              </figure>

              <div className="flex items-center">
                <div className="mx-auto max-w-[39rem]">
                  <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                    The place
                  </p>

                  <div className="mt-8 space-y-5 text-[1.08rem] leading-8 md:text-[1.12rem] md:leading-9">
                    <p>
                      Set in a former presbytery in Petite-Bourgogne, Candide
                      serves Quebec cuisine that evolves with the seasons and
                      new arrivals. The menu changes regularly, with particular
                      attention paid to local producers and ingredients.
                    </p>

                    <p>
                      Wine is an integral part of the experience. The list
                      looks closely at the winemakers behind the bottles and
                      leaves plenty of room for discovery, guidance and
                      conversation around wine.
                    </p>
                  </div>
                </div>
              </div>

              <figure className="mt-10 md:hidden">
                              <div className="h-[430px] w-full overflow-hidden bg-[var(--lpv-paper-light)]">
                                <img
                                  src="/images/lpv/bonnes%20adresses/candide2.jpg"
                                  alt="At Candide in Montreal"
                                  className="h-full w-full object-cover"
                                />
                              </div>

                              <figcaption className="mt-2 text-right text-[0.55rem] text-[var(--lpv-muted)]">
                                © Candide
                              </figcaption>
                            </figure>
            </div>
          </section>

          {/* THREE THINGS */}
          <section className="pb-12 pt-2 md:pb-28 md:pt-14">
            <h2 className="lpv-display max-w-[12ch] text-[2.9rem] leading-[0.88] tracking-[-0.05em] md:max-w-[15ch] md:text-[clamp(3.2rem,4.4vw,4.9rem)] md:leading-[0.9]">
              Three things to know.
            </h2>

            <div className="mt-8 grid border-t border-[var(--lpv-line)] md:mt-14 md:grid-cols-3">
              {candideHighlights.map((item, index) => (
                <article
                  key={item.title}
                  className={`relative flex flex-col py-6 md:min-h-[355px] md:px-9 md:py-11 ${
                    index > 0
                      ? "border-t border-[var(--lpv-line)] md:border-l md:border-t-0"
                      : ""
                  }`}
                >
                  <p className="text-[0.58rem] tracking-[0.2em] text-[var(--lpv-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3 className="lpv-display mt-4 max-w-[13ch] text-[1.8rem] leading-[0.94] tracking-[-0.04em] md:mt-8 md:min-h-[5.3rem] md:max-w-[11ch] md:text-[clamp(2rem,2.6vw,2.8rem)]">
                    {item.title}
                  </h3>

                  <p className="max-w-sm pt-4 text-[0.88rem] leading-6 text-[var(--lpv-muted)] md:absolute md:left-9 md:right-9 md:top-[215px] md:pt-0 md:text-sm md:leading-7">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* WHY CANDIDE */}
          <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[var(--lpv-cocoa)] text-[var(--lpv-paper)]">
            <div className="lpv-container py-16 md:py-20">
              <div className="grid gap-10 md:grid-cols-[0.38fr_0.62fr] md:items-center md:gap-16">
                <div>
                  <h2 className="lpv-display max-w-[8ch] text-[clamp(3.5rem,4.8vw,5.3rem)] leading-[0.87] tracking-[-0.055em]">
                    Why Candide.
                  </h2>

                  <p className="mt-6 max-w-[28ch] text-[1rem] leading-[1.5] opacity-70">
                    A place here has to earn it. This is what won us over.
                  </p>
                </div>

                <p className="max-w-[42ch] text-[clamp(1.25rem,1.55vw,1.6rem)] leading-[1.3] tracking-[-0.025em]">
                  Candide brings together two things we like to see side by
                  side. A kitchen deeply connected to its surroundings and a
                  wine list that cares as much about the people behind the
                  bottles as what is in the glass. The result is a thoughtful
                  experience where wine truly belongs at the table and
                  curiosity is always welcome.
                </p>
              </div>
            </div>
          </section>

          {/* WINE AT CANDIDE */}
          <section className="py-16 md:py-24">
            <div className="grid gap-7 md:grid-cols-[0.36fr_0.64fr] md:gap-20">
              <div className="md:pl-10">
                <h2 className="lpv-display max-w-[9ch] text-[3.15rem] leading-[0.87] tracking-[-0.055em] md:max-w-[8ch] md:text-[clamp(3.7rem,5vw,5.6rem)]">
                  Wine at Candide.
                </h2>
              </div>

              <div className="max-w-2xl space-y-5 text-[1rem] leading-8 text-[var(--lpv-muted)]">
                <p>
                  The list is built around the winemakers behind the bottles,
                  with particular attention paid to producers who approach
                  their farming and terroir with care.
                </p>

                <p>
                  Wine is considered alongside the food rather than separately
                  from it. Follow the pairings, explore the list or simply ask
                  for a recommendation. It is an approachable way to discover
                  new producers while learning a little more about what is in
                  your glass.
                </p>
              </div>
            </div>
          </section>

          {/* THEIR BOTTLES */}
          {placeWines.length ? (
            <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
              <div className="lpv-container pb-16 pt-10 md:pb-20 md:pt-14">
                <div className="md:pl-10">
                  <h2 className="lpv-display text-[clamp(3.2rem,4.5vw,5rem)] leading-[0.9] tracking-[-0.05em]">
                    Their bottles.
                  </h2>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
                  {placeWines.slice(0, 5).map((wine) => (
                    <Link
                      key={wine._id}
                      href={`/en/wines/${wine.slug}`}
                      className="group relative flex min-h-[390px] flex-col bg-[var(--lpv-paper-light)] p-5 md:min-h-[450px] md:p-6"
                    >
                      <div className="flex h-[235px] items-center justify-center py-4 md:h-[285px]">
                        <BottleStage
                          image={wine.bottleImage}
                          alt={wine.name ?? "Wine bottle"}
                          color={wine.color ?? undefined}
                          variant="card"
                          className="h-full max-h-[255px] transition-transform duration-500 ease-out group-hover:-translate-y-1 md:max-h-[270px]"
                        />
                      </div>

                      <div className="mt-auto border-t border-[var(--lpv-line)] pt-4">
                        <p className="text-[0.52rem] uppercase tracking-[0.17em] text-[var(--lpv-muted)]">
                          {[formatColor(wine.color), wine.vintage]
                            .filter(Boolean)
                            .join(" · ") || "Wine"}
                        </p>

                        <h3 className="lpv-display mt-3 min-h-[3.4rem] text-[clamp(1.45rem,1.6vw,1.75rem)] leading-[0.94] tracking-[-0.035em]">
                          {wine.name}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <section className="pb-4 pt-3 md:pb-8 md:pt-5">
              <div>
                <div className="md:pl-10">
                  <h2 className="lpv-display text-[clamp(3.2rem,4.5vw,5rem)] leading-[0.9] tracking-[-0.05em]">
                    Their bottles.
                  </h2>
                </div>

                <div className="mt-8 flex min-h-[180px] items-center justify-center px-6 py-10 text-center md:mt-10 md:min-h-[210px] md:py-12">
                  <div>
                    <p className="lpv-display text-[clamp(1.9rem,2.7vw,3rem)] leading-[0.92] tracking-[-0.04em]">
                      We’re working on it ;)
                    </p>

                    <p className="mx-auto mt-5 max-w-[520px] text-[0.95rem] leading-7 text-[var(--lpv-muted)]">
                      Our selection of bottles to discover at Candide is coming soon.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* VISIT CANDIDE */}
          <section className="pb-5 pt-9 md:pb-16 md:pt-20">
            <div className="grid gap-7 md:grid-cols-[0.36fr_0.64fr] md:gap-20">
              <div className="md:pl-10">
                <h2 className="lpv-display max-w-[9ch] text-[3.15rem] leading-[0.87] tracking-[-0.055em] md:max-w-[8ch] md:text-[clamp(3.7rem,5vw,5.6rem)]">
                  Stop by Candide.
                </h2>

                {place.address ? (
                  <p className="mt-5 max-w-[29ch] text-[0.95rem] leading-6 text-[var(--lpv-ink)]/72 md:mt-8 md:text-[1.05rem] md:leading-7">
                    {place.address}
                  </p>
                ) : null}
              </div>

              <div className="border-t border-[var(--lpv-line)] pt-5 md:pt-7">
                <div className="grid gap-5 md:grid-cols-3 md:gap-8">
                  <div>
                    <p className="text-[0.5rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                      Type
                    </p>
                    <p className="mt-2 text-[0.9rem]">
                      Restaurant
                    </p>
                  </div>

                  {place.website ? (
                    <div>
                      <p className="text-[0.5rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                        Website
                      </p>
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-[0.9rem] underline decoration-[0.05em] underline-offset-[4px] transition-opacity hover:opacity-55"
                      >
                        {place.website
                          .replace(/^https?:\/\//, "")
                          .replace(/^www\./, "")
                          .replace(/\/$/, "")}
                      </a>
                    </div>
                  ) : null}

                  {place.instagram ? (
                    <div>
                      <p className="text-[0.5rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                        Instagram
                      </p>
                      <a
                        href={place.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-[0.9rem] underline decoration-[0.05em] underline-offset-[4px] transition-opacity hover:opacity-55"
                      >
                        @restaurant_candide
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

        </article>
      </main>
    );
  }

  const useVinDansLesVoilesPartnerLayout =
    place.lpvPartner === true && slug === "le-vin-dans-les-voiles";

  if (useVinDansLesVoilesPartnerLayout) {
    const vinDansLesVoilesHighlights = [
      {
        title: "Since 2015",
        text: "Founded in Montreal by Julie Audette and Valériane Paré, the agency has been introducing Quebec to the wines and winemakers it represents since 2015.",
      },
      {
        title: "Nearly 60 winemakers",
        text: "The portfolio brings together nearly 60 winemakers selected for their work, their approach and the wines they want to make.",
      },
      {
        title: "Beyond importing",
        text: "Tastings, workshops and events offer another way to discover the wines and better understand what is in the glass.",
      },
    ];

    return (
      <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
        <article className="lpv-container pb-24">

          <div className="flex items-center justify-between pt-8 md:block md:pt-10">
            <Link
              href="/en/places"
              className="inline-flex items-center gap-3 py-2.5 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-50"
            >
              <span aria-hidden="true">←</span>
              <span>Places</span>
            </Link>

            <PartnerShareButton
              name="Le vin dans les voiles"
              imageUrl="/images/lpv/bonnes%20adresses/vindanslesvoiles1.jpg"
              locale="en"
              profileUrl="/en/places/le-vin-dans-les-voiles"
              kind="place"
            />
          </div>

          {/* HERO */}
          <section className="pt-8 md:pt-10">
            <div className="grid gap-10 md:grid-cols-[0.41fr_0.59fr] md:items-center md:gap-14">
              <div className="md:flex md:min-h-[31rem] md:translate-x-8 md:flex-col md:justify-center md:pr-6">
                <h1 className="lpv-display max-w-[9ch] text-[clamp(4.8rem,6.7vw,7.5rem)] leading-[0.79] tracking-[-0.065em]">
                  Le vin dans les voiles
                </h1>

                <p className="mt-9 max-w-[29ch] text-[clamp(1.05rem,1.25vw,1.25rem)] leading-[1.42] tracking-[-0.02em]">
                  Winemakers from elsewhere, bottles to discover here.
                </p>

                <p className="mt-8 text-[0.6rem] uppercase tracking-[0.19em] text-[var(--lpv-muted)]">
                  Montreal, Quebec
                </p>
              </div>

              <figure>
                <div className="aspect-[1.48/1] overflow-hidden bg-[var(--lpv-paper-light)]">
                  <img
                    src="/images/lpv/bonnes%20adresses/vindanslesvoiles1.jpg"
                    alt="Le vin dans les voiles"
                    className="h-full w-full object-cover"
                  />
                </div>

                <figcaption className="mt-3 text-right text-[0.6rem] text-[var(--lpv-muted)]">
                  © Le vin dans les voiles
                </figcaption>
              </figure>
            </div>
          </section>

          {/* THE AGENCY */}
          <section className="pb-16 pt-8 md:pb-20 md:pt-10">
            <div className="grid gap-10 md:grid-cols-[570px_minmax(0,1fr)] md:gap-12">
              <figure className="hidden w-full md:block md:w-[570px]">
                <div className="h-[520px] w-full overflow-hidden bg-[var(--lpv-paper-light)]">
                  <img
                    src="/images/lpv/bonnes%20adresses/vindanslesvoiles2.jpg"
                    alt="Wines represented by Le vin dans les voiles"
                    className="h-full w-full object-cover"
                  />
                </div>

                <figcaption className="mt-3 text-right text-[0.6rem] text-[var(--lpv-muted)]">
                  © Le vin dans les voiles
                </figcaption>
              </figure>

              <div className="flex items-center">
                <div className="mx-auto max-w-[39rem]">
                  <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                    The agency
                  </p>

                  <div className="mt-8 space-y-5 text-[1.08rem] leading-8 md:text-[1.12rem] md:leading-9">
                    <p>
                      Founded in Montreal in 2015 by Julie Audette and
                      Valériane Paré, Le vin dans les voiles is a private
                      import agency specializing in natural wines. Its
                      portfolio now brings together nearly 60 winemakers.
                    </p>

                    <p>
                      Their work goes beyond bringing bottles to Quebec. The
                      agency also organizes tastings, workshops and events
                      that create opportunities to discover the wines, the
                      people who make them and the stories behind them.
                    </p>
                  </div>
                </div>
              </div>

              <figure className="mt-10 md:hidden">
                              <div className="h-[430px] w-full overflow-hidden bg-[var(--lpv-paper-light)]">
                                <img
                                  src="/images/lpv/bonnes%20adresses/vindanslesvoiles2.jpg"
                                  alt="Wines represented by Le vin dans les voiles"
                                  className="h-full w-full object-cover"
                                />
                              </div>

                              <figcaption className="mt-2 text-right text-[0.55rem] text-[var(--lpv-muted)]">
                                © Le vin dans les voiles
                              </figcaption>
                            </figure>
            </div>
          </section>

          {/* THREE THINGS */}
          <section className="pb-12 pt-2 md:pb-28 md:pt-14">
            <h2 className="lpv-display max-w-[12ch] text-[2.9rem] leading-[0.88] tracking-[-0.05em] md:max-w-[15ch] md:text-[clamp(3.2rem,4.4vw,4.9rem)] md:leading-[0.9]">
              Three things to know.
            </h2>

            <div className="mt-8 grid border-t border-[var(--lpv-line)] md:mt-14 md:grid-cols-3">
              {vinDansLesVoilesHighlights.map((item, index) => (
                <article
                  key={item.title}
                  className={`relative flex flex-col py-6 md:min-h-[355px] md:px-9 md:py-11 ${
                    index > 0
                      ? "border-t border-[var(--lpv-line)] md:border-l md:border-t-0"
                      : ""
                  }`}
                >
                  <p className="text-[0.58rem] tracking-[0.2em] text-[var(--lpv-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3 className="lpv-display mt-4 max-w-[13ch] text-[1.8rem] leading-[0.94] tracking-[-0.04em] md:mt-8 md:min-h-[5.3rem] md:max-w-[11ch] md:text-[clamp(2rem,2.6vw,2.8rem)]">
                    {item.title}
                  </h3>

                  <p className="max-w-sm pt-4 text-[0.88rem] leading-6 text-[var(--lpv-muted)] md:absolute md:left-9 md:right-9 md:top-[215px] md:pt-0 md:text-sm md:leading-7">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* WHY */}
          <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[var(--lpv-cocoa)] text-[var(--lpv-paper)]">
            <div className="lpv-container py-16 md:py-20">
              <div className="grid gap-10 md:grid-cols-[0.38fr_0.62fr] md:items-center md:gap-16">
                <div>
                  <h2 className="lpv-display max-w-[9ch] text-[clamp(3.5rem,4.8vw,5.3rem)] leading-[0.87] tracking-[-0.055em]">
                    Why Le vin dans les voiles.
                  </h2>

                  <p className="mt-6 max-w-[28ch] text-[1rem] leading-[1.5] opacity-70">
                    A place here has to earn it. This is what won us over.
                  </p>
                </div>

                <p className="max-w-[42ch] text-[clamp(1.25rem,1.55vw,1.6rem)] leading-[1.3] tracking-[-0.025em]">
                  Because a bottle rarely arrives on its own. Behind it is a
                  winemaker, a place and a way of working. Le vin dans les
                  voiles creates the link between those producers and Quebec,
                  then gives people opportunities to discover them and better
                  understand what they are drinking.
                </p>
              </div>
            </div>
          </section>

          {/* THE WINE */}
          <section className="py-16 md:py-24">
            <div className="grid gap-7 md:grid-cols-[0.36fr_0.64fr] md:gap-20">
              <div className="md:pl-10">
                <h2 className="lpv-display max-w-[9ch] text-[3.15rem] leading-[0.87] tracking-[-0.055em] md:text-[clamp(3.7rem,5vw,5.6rem)]">
                  The wine in their sails.
                </h2>
              </div>

              <div className="max-w-2xl space-y-5 text-[1rem] leading-8 text-[var(--lpv-muted)]">
                <p>
                  The portfolio is dedicated to natural wines and brings
                  together nearly 60 winemakers. Each producer comes with a
                  place, grape varieties and a way of working, creating a
                  deliberately diverse selection.
                </p>

                <p>
                  Follow the agency’s new arrivals, join a tasting or workshop,
                  or order the wines currently available through private
                  import to discover the selection.
                </p>
              </div>
            </div>
          </section>

          {/* THEIR BOTTLES */}
          {placeWines.length ? (
            <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
              <div className="lpv-container pb-16 pt-10 md:pb-20 md:pt-14">
                <div className="md:pl-10">
                  <h2 className="lpv-display text-[clamp(3.2rem,4.5vw,5rem)] leading-[0.9] tracking-[-0.05em]">
                    Their bottles.
                  </h2>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
                  {placeWines.slice(0, 5).map((wine) => (
                    <Link
                      key={wine._id}
                      href={`/en/wines/${wine.slug}`}
                      className="group relative flex min-h-[390px] flex-col bg-[var(--lpv-paper-light)] p-5 md:min-h-[450px] md:p-6"
                    >
                      <div className="flex h-[235px] items-center justify-center py-4 md:h-[285px]">
                        <BottleStage
                          image={wine.bottleImage}
                          alt={wine.name ?? "Wine bottle"}
                          color={wine.color ?? undefined}
                          variant="card"
                          className="h-full max-h-[255px] transition-transform duration-500 ease-out group-hover:-translate-y-1 md:max-h-[270px]"
                        />
                      </div>

                      <div className="mt-auto border-t border-[var(--lpv-line)] pt-4">
                        <p className="text-[0.52rem] uppercase tracking-[0.17em] text-[var(--lpv-muted)]">
                          {[formatColor(wine.color), wine.vintage]
                            .filter(Boolean)
                            .join(" · ") || "Wine"}
                        </p>

                        <h3 className="lpv-display mt-3 min-h-[3.4rem] text-[clamp(1.45rem,1.6vw,1.75rem)] leading-[0.94] tracking-[-0.035em]">
                          {wine.name}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <section className="pb-4 pt-3 md:pb-8 md:pt-5">
              <div>
                <div className="md:pl-10">
                  <h2 className="lpv-display text-[clamp(3.2rem,4.5vw,5rem)] leading-[0.9] tracking-[-0.05em]">
                    Their bottles.
                  </h2>
                </div>

                <div className="mt-8 flex min-h-[180px] items-center justify-center px-6 py-10 text-center md:mt-10 md:min-h-[210px] md:py-12">
                  <div>
                    <p className="lpv-display text-[clamp(1.9rem,2.7vw,3rem)] leading-[0.92] tracking-[-0.04em]">
                      We’re working on it ;)
                    </p>

                    <p className="mx-auto mt-5 max-w-[520px] text-[0.95rem] leading-7 text-[var(--lpv-muted)]">
                      Our selection of bottles from Le vin dans les voiles is coming soon.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* DISCOVER */}
          <section className="pb-5 pt-9 md:pb-16 md:pt-20">
            <div className="grid gap-7 md:grid-cols-[0.36fr_0.64fr] md:gap-20">
              <div className="md:pl-10">
                <h2 className="lpv-display max-w-[9ch] text-[3.15rem] leading-[0.87] tracking-[-0.055em] md:text-[clamp(3.7rem,5vw,5.6rem)]">
                  Discover Le vin dans les voiles.
                </h2>
              </div>

              <div className="border-t border-[var(--lpv-line)] pt-5 md:pt-7">
                <div className="grid gap-5 md:grid-cols-3 md:gap-8">
                  <div>
                    <p className="text-[0.5rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                      Type
                    </p>
                    <p className="mt-2 text-[0.9rem]">
                      Private wine import agency
                    </p>
                  </div>

                  {place.website ? (
                    <div>
                      <p className="text-[0.5rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                        Website
                      </p>
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-[0.9rem] underline decoration-[0.05em] underline-offset-[4px] transition-opacity hover:opacity-55"
                      >
                        {place.website
                          .replace(/^https?:\/\//, "")
                          .replace(/^www\./, "")
                          .replace(/\/$/, "")}
                      </a>
                    </div>
                  ) : null}

                  {place.instagram ? (
                    <div>
                      <p className="text-[0.5rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                        Instagram
                      </p>
                      <a
                        href={place.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-[0.9rem] underline decoration-[0.05em] underline-offset-[4px] transition-opacity hover:opacity-55"
                      >
                        @levindanslesvoiles
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

        </article>
      </main>
    );
  }

  const usePolariPartnerLayout =
    place.lpvPartner === true && slug === "polari";

  if (usePolariPartnerLayout) {
    const polariHighlights = [
      {
        title: "A former garage",
        text: "In Villeray, Polari transformed a former garage into a small neighbourhood wine bar with a few counter seats and communal tables.",
      },
      {
        title: "A list that keeps moving",
        text: "The wines by the glass change regularly, with plenty of natural and organic wines from small producers here and abroad.",
      },
      {
        title: "Simply good",
        text: "Small plates built around Quebec ingredients go hand in hand with a relaxed approach to wine that never makes it feel complicated.",
      },
    ];

    return (
      <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
        <article className="lpv-container pb-24">

          <div className="flex items-center justify-between pt-8 md:block md:pt-10">
            <Link
              href="/en/places"
              className="inline-flex items-center gap-3 py-2.5 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-50"
            >
              <span aria-hidden="true">←</span>
              <span>Places</span>
            </Link>

            <PartnerShareButton
              name="Polari"
              imageUrl="/images/lpv/bonnes%20adresses/polari1.jpg"
              locale="en"
              profileUrl="/en/places/polari"
              kind="place"
            />
          </div>

          {/* HERO */}
          <section className="pt-8 md:pt-10">
            <div className="grid gap-10 md:grid-cols-[0.41fr_0.59fr] md:items-center md:gap-14">
              <div className="md:flex md:min-h-[31rem] md:translate-x-8 md:flex-col md:justify-center md:pr-6">
                <h1 className="lpv-display max-w-[8ch] text-[clamp(5.6rem,7.6vw,8.4rem)] leading-[0.79] tracking-[-0.065em]">
                  Polari
                </h1>

                <p className="mt-9 max-w-[29ch] text-[clamp(1.05rem,1.25vw,1.25rem)] leading-[1.42] tracking-[-0.02em]">
                  A neighbourhood wine bar for discovering something you have not tried before.
                </p>

                <p className="mt-8 text-[0.6rem] uppercase tracking-[0.19em] text-[var(--lpv-muted)]">
                  Villeray, Montreal
                </p>
              </div>

              <figure>
                <div className="aspect-[1.48/1] overflow-hidden bg-[var(--lpv-paper-light)]">
                  <img
                    src="/images/lpv/bonnes%20adresses/polari1.jpg"
                    alt="Polari in Montreal"
                    className="h-full w-full object-cover"
                  />
                </div>

                <figcaption className="mt-3 text-right text-[0.6rem] text-[var(--lpv-muted)]">
                  © Polari
                </figcaption>
              </figure>
            </div>
          </section>

          {/* THE PLACE */}
          <section className="pb-16 pt-8 md:pb-20 md:pt-10">
            <div className="grid gap-10 md:grid-cols-[570px_minmax(0,1fr)] md:gap-12">
              <figure className="hidden w-full md:block md:w-[570px]">
                <div className="h-[520px] w-full overflow-hidden bg-[var(--lpv-paper-light)]">
                  <img
                    src="/images/lpv/bonnes%20adresses/polari2.jpg"
                    alt="Inside Polari in Montreal"
                    className="h-full w-full object-cover"
                  />
                </div>

                <figcaption className="mt-3 text-right text-[0.6rem] text-[var(--lpv-muted)]">
                  © Polari
                </figcaption>
              </figure>

              <div className="flex items-center">
                <div className="mx-auto max-w-[39rem]">
                  <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                    The place
                  </p>

                  <div className="mt-8 space-y-5 text-[1.08rem] leading-8 md:text-[1.12rem] md:leading-9">
                    <p>
                      In Villeray, Polari occupies a former garage transformed
                      into a small neighbourhood wine bar. A few seats at the
                      counter, communal tables and intentionally simple service
                      give the place an intimate, relaxed atmosphere.
                    </p>

                    <p>
                      The list highlights natural and organic wines from small
                      producers here and abroad. The wines by the glass change
                      regularly, so there is always a good reason to try
                      something new.
                    </p>
                  </div>
                </div>
              </div>

              <figure className="mt-10 md:hidden">
                              <div className="h-[430px] w-full overflow-hidden bg-[var(--lpv-paper-light)]">
                                <img
                                  src="/images/lpv/bonnes%20adresses/polari2.jpg"
                                  alt="Inside Polari in Montreal"
                                  className="h-full w-full object-cover"
                                />
                              </div>

                              <figcaption className="mt-2 text-right text-[0.55rem] text-[var(--lpv-muted)]">
                                © Polari
                              </figcaption>
                            </figure>
            </div>
          </section>

          {/* THREE THINGS */}
          <section className="pb-12 pt-2 md:pb-28 md:pt-14">
            <h2 className="lpv-display max-w-[12ch] text-[2.9rem] leading-[0.88] tracking-[-0.05em] md:max-w-[15ch] md:text-[clamp(3.2rem,4.4vw,4.9rem)] md:leading-[0.9]">
              Three things to know.
            </h2>

            <div className="mt-8 grid border-t border-[var(--lpv-line)] md:mt-14 md:grid-cols-3">
              {polariHighlights.map((item, index) => (
                <article
                  key={item.title}
                  className={`relative flex flex-col py-6 md:min-h-[355px] md:px-9 md:py-11 ${
                    index > 0
                      ? "border-t border-[var(--lpv-line)] md:border-l md:border-t-0"
                      : ""
                  }`}
                >
                  <p className="text-[0.58rem] tracking-[0.2em] text-[var(--lpv-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3 className="lpv-display mt-4 max-w-[13ch] text-[1.8rem] leading-[0.94] tracking-[-0.04em] md:mt-8 md:min-h-[5.3rem] md:max-w-[11ch] md:text-[clamp(2rem,2.6vw,2.8rem)]">
                    {item.title}
                  </h3>

                  <p className="max-w-sm pt-4 text-[0.88rem] leading-6 text-[var(--lpv-muted)] md:absolute md:left-9 md:right-9 md:top-[215px] md:pt-0 md:text-sm md:leading-7">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* WHY POLARI */}
          <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[var(--lpv-cocoa)] text-[var(--lpv-paper)]">
            <div className="lpv-container py-16 md:py-20">
              <div className="grid gap-10 md:grid-cols-[0.38fr_0.62fr] md:items-center md:gap-16">
                <div>
                  <h2 className="lpv-display max-w-[8ch] text-[clamp(3.5rem,4.8vw,5.3rem)] leading-[0.87] tracking-[-0.055em]">
                    Why Polari.
                  </h2>

                  <p className="mt-6 max-w-[28ch] text-[1rem] leading-[1.5] opacity-70">
                    A place here has to earn it. This is what won us over.
                  </p>
                </div>

                <p className="max-w-[42ch] text-[clamp(1.25rem,1.55vw,1.6rem)] leading-[1.3] tracking-[-0.025em]">
                  Polari keeps things simple. A small room, a changing list,
                  producers worth discovering and a team that makes choosing
                  easy without expecting you to know all the codes of wine.
                  You can come in for a glass and leave knowing the name of a
                  winemaker you had never heard of an hour earlier.
                </p>
              </div>
            </div>
          </section>

          {/* WINE AT POLARI */}
          <section className="py-16 md:py-24">
            <div className="grid gap-7 md:grid-cols-[0.36fr_0.64fr] md:gap-20">
              <div className="md:pl-10">
                <h2 className="lpv-display max-w-[9ch] text-[3.15rem] leading-[0.87] tracking-[-0.055em] md:max-w-[8ch] md:text-[clamp(3.7rem,5vw,5.6rem)]">
                  Wine at Polari.
                </h2>
              </div>

              <div className="max-w-2xl space-y-5 text-[1rem] leading-8 text-[var(--lpv-muted)]">
                <p>
                  The selection gives plenty of room to natural and organic
                  wines from small local and international producers. The
                  by-the-glass options change regularly, making it easy to
                  taste something before committing to a full bottle.
                </p>

                <p>
                  The small plates follow the same spirit, with Quebec
                  ingredients and food made for sharing. Wine stays at the
                  centre of the experience without ever making things feel
                  complicated.
                </p>
              </div>
            </div>
          </section>

          {/* THEIR BOTTLES */}
          {placeWines.length ? (
            <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
              <div className="lpv-container pb-16 pt-10 md:pb-20 md:pt-14">
                <div className="md:pl-10">
                  <h2 className="lpv-display text-[clamp(3.2rem,4.5vw,5rem)] leading-[0.9] tracking-[-0.05em]">
                    Their bottles.
                  </h2>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
                  {placeWines.slice(0, 5).map((wine) => (
                    <Link
                      key={wine._id}
                      href={`/en/wines/${wine.slug}`}
                      className="group relative flex min-h-[390px] flex-col bg-[var(--lpv-paper-light)] p-5 md:min-h-[450px] md:p-6"
                    >
                      <div className="flex h-[235px] items-center justify-center py-4 md:h-[285px]">
                        <BottleStage
                          image={wine.bottleImage}
                          alt={wine.name ?? "Wine bottle"}
                          color={wine.color ?? undefined}
                          variant="card"
                          className="h-full max-h-[255px] transition-transform duration-500 ease-out group-hover:-translate-y-1 md:max-h-[270px]"
                        />
                      </div>

                      <div className="mt-auto border-t border-[var(--lpv-line)] pt-4">
                        <p className="text-[0.52rem] uppercase tracking-[0.17em] text-[var(--lpv-muted)]">
                          {[formatColor(wine.color), wine.vintage]
                            .filter(Boolean)
                            .join(" · ") || "Wine"}
                        </p>

                        <h3 className="lpv-display mt-3 min-h-[3.4rem] text-[clamp(1.45rem,1.6vw,1.75rem)] leading-[0.94] tracking-[-0.035em]">
                          {wine.name}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <section className="pb-4 pt-3 md:pb-8 md:pt-5">
              <div>
                <div className="md:pl-10">
                  <h2 className="lpv-display text-[clamp(3.2rem,4.5vw,5rem)] leading-[0.9] tracking-[-0.05em]">
                    Their bottles.
                  </h2>
                </div>

                <div className="mt-8 flex min-h-[180px] items-center justify-center px-6 py-10 text-center md:mt-10 md:min-h-[210px] md:py-12">
                  <div>
                    <p className="lpv-display text-[clamp(1.9rem,2.7vw,3rem)] leading-[0.92] tracking-[-0.04em]">
                      We’re working on it ;)
                    </p>

                    <p className="mx-auto mt-5 max-w-[520px] text-[0.95rem] leading-7 text-[var(--lpv-muted)]">
                      Our selection of bottles to discover at Polari is coming soon.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* STOP BY POLARI */}
          <section className="pb-5 pt-9 md:pb-16 md:pt-20">
            <div className="grid gap-7 md:grid-cols-[0.36fr_0.64fr] md:gap-20">
              <div className="md:pl-10">
                <h2 className="lpv-display max-w-[9ch] text-[3.15rem] leading-[0.87] tracking-[-0.055em] md:max-w-[8ch] md:text-[clamp(3.7rem,5vw,5.6rem)]">
                  Stop by Polari.
                </h2>

                {place.address ? (
                  <p className="mt-5 max-w-[29ch] text-[0.95rem] leading-6 text-[var(--lpv-ink)]/72 md:mt-8 md:text-[1.05rem] md:leading-7">
                    {place.address}
                  </p>
                ) : null}
              </div>

              <div className="border-t border-[var(--lpv-line)] pt-5 md:pt-7">
                <div className="grid gap-5 md:grid-cols-3 md:gap-8">
                  <div>
                    <p className="text-[0.5rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                      Type
                    </p>
                    <p className="mt-2 text-[0.9rem]">
                      Wine bar
                    </p>
                  </div>

                  {place.website ? (
                    <div>
                      <p className="text-[0.5rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                        Website
                      </p>
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-[0.9rem] underline decoration-[0.05em] underline-offset-[4px] transition-opacity hover:opacity-55"
                      >
                        {place.website
                          .replace(/^https?:\/\//, "")
                          .replace(/^www\./, "")
                          .replace(/\/$/, "")}
                      </a>
                    </div>
                  ) : null}

                  {place.instagram ? (
                    <div>
                      <p className="text-[0.5rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                        Instagram
                      </p>
                      <a
                        href={place.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-[0.9rem] underline decoration-[0.05em] underline-offset-[4px] transition-opacity hover:opacity-55"
                      >
                        @polari.vin
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

        </article>
      </main>
    );
  }

  const translateEnglishPlaceName = (value?: string | null) => {
    if (!value) return value;

    const normalized = value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

    const translations: Record<string, string> = {
      montreal: "Montreal",
      "cantons-de-l'est": "Eastern Townships",
      "cantons-de-l’est": "Eastern Townships",
      "cantons de l'est": "Eastern Townships",
      "cantons de l’est": "Eastern Townships",
    };

    return translations[normalized] ?? value;
  };

  const genericLocation = [place.city, place.region]
    .map(translateEnglishPlaceName)
    .filter((value, index, array) => value && array.indexOf(value) === index)
    .join(", ");

  const genericInstagramHandle = place.instagram
    ? `@${place.instagram
        .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
        .replace(/\/.*$/, "")
        .replace(/^@/, "")}`
    : null;

  const genericHighlights =
    place.highlightsEn?.length
      ? place.highlightsEn
      : place.highlights ?? [];

  const genericDescription =
    place.descriptionEn?.length
      ? place.descriptionEn
      : place.description ?? [];

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <article className="lpv-container pb-8 md:pb-10">

        {/* BACK */}
        <div className="pt-8 md:pt-10">
          <Link
            href="/en/places"
            className="inline-flex items-center gap-3 py-2.5 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-50"
          >
            <span aria-hidden="true">←</span>
            <span>Places</span>
          </Link>
        </div>

        {/* TYPOGRAPHIC HERO */}
        <section className="pb-6 pt-9 md:pb-24 md:pt-20">
          <h1
            className={`lpv-display tracking-[-0.065em] ${
              place.name.length > 20
                ? "max-w-[11ch] text-[3.85rem] leading-[0.84] md:text-[clamp(4.6rem,7.4vw,8rem)] md:leading-[0.82]"
                : "max-w-[11ch] text-[3.85rem] leading-[0.84] md:max-w-[10ch] md:text-[clamp(5.4rem,8.5vw,9.2rem)] md:leading-[0.78]"
            }`}
          >
            {place.name}
          </h1>

          <p className="mt-5 max-w-[29ch] text-[0.82rem] leading-5 text-[var(--lpv-muted)] md:mt-8 md:translate-x-[8px] md:text-[clamp(1.05rem,1.25vw,1.25rem)] md:leading-[1.42] md:tracking-[-0.02em] md:text-[var(--lpv-ink)]">
            {[formatType(place.type), genericLocation]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </section>

        {/* DESCRIPTION */}
        {genericDescription.length ? (
          <section className="border-t border-[var(--lpv-line)] py-6 md:py-20">
            <div className="grid gap-4 md:grid-cols-[0.27fr_0.73fr] md:gap-16">
              <div>
                <h2 className="lpv-display max-w-[9ch] text-[2.55rem] leading-[0.9] tracking-[-0.05em] md:max-w-[8ch] md:text-[clamp(3rem,4vw,4.4rem)]">
                  The place.
                </h2>
              </div>

              <div className="lpv-prose max-w-[47rem] text-[0.94rem] leading-7 text-[var(--lpv-ink)] md:max-w-[46rem] md:text-[1.16rem] md:leading-9">
                <PortableText value={genericDescription} />
              </div>
            </div>
          </section>
        ) : null}

        {/* HIGHLIGHTS */}
        {genericHighlights.length ? (
          <section className="border-t border-[var(--lpv-line)]">
            <div className="grid md:grid-cols-3">
              {genericHighlights.slice(0, 3).map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className={`flex min-h-0 items-center py-6 md:min-h-[175px] md:px-9 md:py-8 ${
                    index > 0
                      ? "border-t border-[var(--lpv-line)] md:border-l md:border-t-0"
                      : ""
                  }`}
                >
                  <div>
                    <p className="mb-3 text-[0.57rem] tracking-[0.21em] text-[var(--lpv-cocoa)] md:mb-5 md:text-[0.55rem] md:tracking-[0.2em] md:text-[var(--lpv-muted)]">
                      {String(index + 1).padStart(2, "0")}
                    </p>

                    <p className="lpv-display max-w-[15ch] text-[1.55rem] leading-[0.95] tracking-[-0.035em] md:max-w-[13ch] md:text-[clamp(1.65rem,2.15vw,2.25rem)]">
                      {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* THEIR BOTTLES */}
        <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
          <div className="lpv-container pb-10 pt-10 md:pb-14 md:pt-20">
            <div className="flex items-end justify-between gap-8">
              <h2 className="lpv-display text-[2.85rem] leading-[0.9] tracking-[-0.05em] md:text-[clamp(3.2rem,4.5vw,5rem)]">
                Their bottles.
              </h2>

              {placeWines.length ? (
                <Link
                  href="/en/wines"
                  className="hidden text-[0.6rem] uppercase tracking-[0.17em] md:inline-flex md:items-center md:gap-3"
                >
                  <span>All wines</span>
                  <span aria-hidden="true">→</span>
                </Link>
              ) : null}
            </div>

            {placeWines.length ? (
              <>
                <div className="mt-8 grid grid-cols-2 gap-2.5 md:mt-12 md:grid-cols-5 md:gap-4">
                  {placeWines.slice(0, 5).map((wine) => (
                    <Link
                      key={wine._id}
                      href={`/en/wines/${wine.slug}`}
                      className="group relative flex min-h-[300px] flex-col bg-[var(--lpv-paper-light)] p-3.5 md:min-h-[450px] md:p-6"
                    >
                      <div className="flex h-[235px] items-center justify-center py-4 md:h-[285px]">
                        <BottleStage
                          image={wine.bottleImage}
                          alt={wine.name ?? "Wine bottle"}
                          color={wine.color ?? undefined}
                          variant="card"
                          className="h-full max-h-[255px] transition-transform duration-500 ease-out group-hover:-translate-y-1 md:max-h-[270px]"
                        />
                      </div>

                      <div className="mt-auto border-t border-[var(--lpv-line)] pt-4">
                        <p className="text-[0.52rem] uppercase tracking-[0.17em] text-[var(--lpv-muted)]">
                          {[formatColor(wine.color), wine.vintage]
                            .filter(Boolean)
                            .join(" · ") || "Wine"}
                        </p>

                        <h3 className="lpv-display mt-2 min-h-[2.8rem] text-[1.25rem] leading-[0.94] tracking-[-0.035em] md:mt-3 md:min-h-[3.4rem] md:text-[clamp(1.45rem,1.6vw,1.75rem)]">
                          {wine.name}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>

                <Link
                  href="/en/wines"
                  className="mt-7 inline-flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.17em] md:hidden"
                >
                  <span>All wines</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </>
            ) : (
              <div className="mt-5 flex min-h-[100px] items-center justify-center px-4 py-5 text-center md:mt-8 md:min-h-[145px] md:px-6 md:py-6">
                <div>
                  <p className="lpv-display text-[clamp(1.9rem,2.7vw,3rem)] leading-[0.92] tracking-[-0.04em]">
                    We’re working on it ;)
                  </p>

                  <p className="mx-auto mt-5 max-w-[520px] text-[0.95rem] leading-7 text-[var(--lpv-muted)]">
                    Our selection of bottles is coming soon.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* STOP BY */}
        <section className="pb-7 pt-7 md:pb-16 md:pt-20">
          <div className="grid gap-8 md:grid-cols-[0.42fr_0.58fr] md:gap-20">
            <div>
              <h2 className="lpv-display max-w-[10ch] text-[3rem] leading-[0.87] tracking-[-0.055em] md:max-w-[9ch] md:text-[clamp(3.6rem,5vw,5.5rem)] md:leading-[0.88]">
                Stop by {place.name}.
              </h2>

              {place.address ? (
                <p className="mt-5 max-w-[29ch] text-[0.95rem] leading-6 text-[var(--lpv-ink)]/72 md:mt-8 md:text-[1rem] md:leading-7 md:text-[var(--lpv-muted)]">
                  {place.address}
                </p>
              ) : null}
            </div>

            <div className="grid gap-5 border-t border-[var(--lpv-line)] pt-6 md:block md:pt-0">
              <div>
                <p className="text-[0.5rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                  Type
                </p>

                <p className="mt-2 text-[0.9rem]">
                  {formatType(place.type)}
                </p>
              </div>

              {place.website ? (
                <div>
                  <p className="text-[0.5rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                    Website
                  </p>

                  <a
                    href={place.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-[0.9rem] underline decoration-[0.05em] underline-offset-[4px] transition-opacity hover:opacity-55"
                  >
                    {place.website
                      .replace(/^https?:\/\//, "")
                      .replace(/^www\./, "")
                      .replace(/\/$/, "")}
                  </a>
                </div>
              ) : null}

              {place.instagram && genericInstagramHandle ? (
                <div>
                  <p className="text-[0.5rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                    Instagram
                  </p>

                  <a
                    href={place.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-[0.9rem] underline decoration-[0.05em] underline-offset-[4px] transition-opacity hover:opacity-55"
                  >
                    {genericInstagramHandle}
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="mt-7 border-t border-[var(--lpv-line)] pb-2 pt-5 md:mt-0 md:border-t-0 md:pb-4 md:pt-5">
          <div className="flex justify-start md:justify-end">
            <p className="max-w-[31rem] text-[0.68rem] leading-[1.55] text-[var(--lpv-muted)] md:text-right md:text-[0.72rem] md:leading-5">
              Do you represent this place?
              <br />
              For an update or a collaboration,{" "}
              <Link
                href="/en/contact"
                className="whitespace-nowrap text-[var(--lpv-ink)] underline decoration-[0.05em] underline-offset-[3px] transition-opacity hover:opacity-55"
              >
                Write to us →
              </Link>
            </p>
          </div>
        </section>

      </article>
    </main>
  );
}
