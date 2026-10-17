import Link from "next/link";
import { notFound } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/types";
import { PortableText } from "@portabletext/react";

import { WineJournalButton } from "@/components/journal/WineJournalButton";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import AnalyticsEvent from "@/components/analytics/AnalyticsEvent";
import PairingLink from "@/components/analytics/PairingLink";
import WineHero from "@/components/wine/WineHero";
import WineRatings from "@/components/wine/WineRatings";
import { client } from "@/sanity/lib/client";
import { wineBySlugQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { buildDynamicMetadata } from "@/lib/seo/dynamic-metadata";
import WhereToBuyLink from "@/components/analytics/WhereToBuyLink";

export const revalidate = 60;

type Wine = {
  _id: string;
  name: string;
  slug?: string;
  vintage?: number;
  beverageType?: "wine" | "cider";
  alcoholFree?: boolean;
  color?: string;
  appleVarieties?: string[];
  bottleImage?: any;
  editorialImage?: {
    asset?: any;
    hotspot?: any;
    crop?: any;
    alt?: string;
    credit?: string;
  };

  producer?: {
    _id?: string;
    name?: string;
    slug?: string;
  };

  country?: { name?: string };
  region?: { name?: string };
  appellation?: { name?: string };

  grapes?: {
    name?: string;
    slug?: string;
  }[];

  approxPrice?: number;
  purchaseChannel?: string;
  purchaseChannelDetails?: string;
  purchaseChannelDetailsEn?: string;
  purchaseUrl?: string;
  purchaseLastChecked?: string;

  oneLiner?: string;
  oneLinerEn?: string;
  tastingKeywords?: string[];
  tastingKeywordsEn?: string[];
  perfectFor?: string[];
  perfectForEn?: string[];
  whyWeRecommend?: string;
  whyWeRecommendEn?: string;

  body?: number;
  sweetness?: number;
  roundness?: number;
  acidity?: number;

  servingTemperature?: string;
  decant?: boolean;

  foodPairings?: {
    _id?: string;
    name?: string;
    nameEn?: string;
    slug?: string;
  }[];

  tastingNotes?: PortableTextBlock[];
  tastingNotesEn?: PortableTextBlock[];
  editorialNoteEn?: PortableTextBlock[];
};

function formatPurchaseChannel(value?: string) {
  const labels: Record<string, string> = {
    saq: "SAQ",
    SAQ: "SAQ",
    "private-import": "Private import",
    "Importation privée": "Private import",
    producer: "Producer",
    Producteur: "Producer",
    other: "Other",
    Autre: "Other",
  };

  return value ? labels[value] || value : null;
}

function formatDate(value?: string) {
  if (!value) return null;

  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return buildDynamicMetadata({
    entity: "wine",
    slug,
    locale: "en",
  });
}

export default async function WinePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const wine = await client.fetch<Wine | null>(wineBySlugQuery, {
    slug,
  });

  console.log("[LPV DEBUG]", {
    slug,
    beverageType: wine?.beverageType,
    name: wine?.name,
  });

  if (!wine) notFound();

  const purchaseLabel = formatPurchaseChannel(wine.purchaseChannel);
  const checkedDate = formatDate(wine.purchaseLastChecked);

  const hasEditorialImage = Boolean(wine.editorialImage?.asset);

  if (hasEditorialImage) {
    const wineBody = wine.body == null ? null : Math.max(1, Math.min(5, wine.body));
    const wineSweetness = wine.sweetness == null ? null : Math.max(1, Math.min(5, wine.sweetness));
    const wineRoundness = wine.roundness == null ? null : Math.max(1, Math.min(5, wine.roundness));
    const wineAcidity = wine.acidity == null ? null : Math.max(1, Math.min(5, wine.acidity));

    const DotScale = ({
      value,
      left,
      right,
    }: {
      value: number;
      left: string;
      right: string;
    }) => (
      <div>
        <div className="mb-3 flex items-center justify-between text-[0.7rem]">
          <span>{left}</span>
          <span>{right}</span>
        </div>

        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((step) => (
            <span
              key={step}
              className={`block h-2.5 w-2.5 rounded-full border border-[var(--lpv-ink)] ${
                step <= value ? "bg-[var(--lpv-ink)]" : "bg-transparent"
              }`}
            />
          ))}
        </div>
      </div>
    );

    return (
      <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
        <AnalyticsEvent
          eventName="product_view"
          data={{ contentId: wine._id }}
        />

        <article className="mx-auto max-w-[1500px] px-5 pb-0 pt-7 sm:px-8 md:px-10 lg:px-10">

          {/* NAVIGATION + ACTIONS */}
          <div className="mb-8 flex items-center justify-between gap-6 md:mb-14">
            <Link
              href="/en/wines"
              className="text-[0.65rem] uppercase tracking-[0.24em] transition-opacity hover:opacity-60"
            >
              ← Bottles
            </Link>

            <div className="flex items-center gap-2.5">
              <FavoriteButton
                wineId={wine._id}
                size="sm"
                variant="detail"
                locale="en"
                className=""
              />

              <span
                aria-hidden="true"
                className="text-[9px] font-light text-[var(--lpv-line)]"
              >
                |
              </span>

              <WineJournalButton
                wineId={wine._id}
                variant="detail"
                locale="en"
              />
            </div>
          </div>


          {/* HERO */}
          <section className="pb-8 md:pb-20">
            <div className="grid gap-7 md:grid-cols-[0.46fr_0.54fr] md:gap-14 lg:gap-20">

              {/* IDENTITÉ DU VIN */}
              <div className="flex md:pl-[58px]">

                <div className="flex w-full flex-col md:min-h-full">

                  <div className="md:pt-[calc(17%+10px)]">

                    <h1 className="lpv-display max-w-[620px] text-[4.25rem] leading-[0.84] tracking-[-0.05em] md:text-[clamp(5.5rem,7.8vw,8.2rem)]">
                      {wine.name}
                    </h1>

                    {wine.oneLinerEn ? (
                      <p className="mt-6 max-w-[485px] text-[1.08rem] leading-[1.5] md:ml-[36px] md:mt-[32px] md:text-[1.3rem] md:leading-[1.58]">
                        {wine.oneLinerEn}
                      </p>
                    ) : null}

                    <div className="mt-8 w-full max-w-full border-y border-[var(--lpv-line)] bg-transparent py-4 md:mt-[110px] md:w-fit md:border md:border-[var(--lpv-cocoa)]/20 md:px-7 md:py-[18px]">

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 md:gap-x-5">

                        <span className="lpv-display text-[0.95rem] leading-none md:text-[1.08rem]">
                          {wine.beverageType === "cider" ? (wine.alcoholFree ? "Alcohol-free cider" : "Cider") : wine.color === "white" ? "White" : wine.color === "red" ? "Red" : wine.color === "rose" ? "Rosé" : "Wine"}
                        </span>

                        {wine.vintage ? (
                          <>
                            <span className="text-[0.7rem] text-[var(--lpv-muted)]">·</span>
                            <span className="lpv-display text-[0.95rem] leading-none md:text-[1.08rem]">
                              {wine.vintage}
                            </span>
                          </>
                        ) : null}

                        {wine.appellation?.name || wine.country?.name ? (
                          <>
                            <span className="text-[0.7rem] text-[var(--lpv-muted)]">·</span>
                            <span className="lpv-display text-[0.95rem] leading-none md:text-[1.08rem]">
                              {wine.appellation?.name || wine.country?.name}
                            </span>
                          </>
                        ) : null}

                        {wine.region?.name ? (
                          <>
                            <span className="text-[0.7rem] text-[var(--lpv-muted)]">·</span>
                            <span className="lpv-display text-[0.95rem] leading-none md:text-[1.08rem]">
                              {wine.region.name}
                            </span>
                          </>
                        ) : null}

                      </div>

                    </div>


                  </div>


                  {/* PRODUCTEUR + DISPONIBILITÉ */}
                  <div className="mt-7 md:mt-[38px] md:pb-[4px]">

                    {wine.producer?.name ? (
                      <div>

                        <p className="mb-2 text-[0.56rem] uppercase tracking-[0.22em] text-[var(--lpv-muted)] md:mb-3 md:text-[0.62rem]">
                          Producer
                        </p>

                        {wine.producer?.slug ? (
                          <Link
                            href={`/en/producers/${wine.producer.slug}`}
                            className="lpv-display inline-flex items-baseline gap-3 text-[2.15rem] leading-[0.95] tracking-[-0.04em] transition-opacity hover:opacity-55 md:text-[clamp(2.6rem,3.4vw,3.5rem)]"
                          >
                            {wine.producer.name}
                          </Link>
                        ) : (
                          <p className="lpv-display text-[2.15rem] leading-[0.95] tracking-[-0.04em] md:text-[clamp(2.6rem,3.4vw,3.5rem)]">
                            {wine.producer.name}
                          </p>
                        )}

                      </div>
                    ) : null}


                    {/* DISPONIBILITÉ */}
                    <div className="mt-4 md:mt-5">

                      <p className="mb-1.5 text-[0.56rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)] md:mb-2 md:text-[0.68rem]">
                        Where to find it
                      </p>

                    {wine.purchaseUrl ? (
                      <WhereToBuyLink
                        href={wine.purchaseUrl}
                        wineId={wine._id}
                        locale="en"
                        target="_blank"
                        rel="noreferrer"
                        className="lpv-display inline-flex items-baseline gap-2 text-[1.12rem] leading-5 tracking-[-0.02em] transition-opacity hover:opacity-55 md:text-[1.28rem] md:leading-6"
                      >
                        {purchaseLabel || "View retailer"}
                      </WhereToBuyLink>
                    ) : purchaseLabel ? (
                      <p className="lpv-display text-[1.28rem] leading-6 tracking-[-0.02em]">
                        {purchaseLabel}
                      </p>
                    ) : (
                      <p className="text-[0.95rem] leading-6 text-[var(--lpv-muted)]">
                        Availability to be confirmed
                      </p>
                    )}

                    {wine.purchaseChannelDetailsEn ? (
                      <p className="mt-1 max-w-[420px] text-[0.85rem] leading-5 text-[var(--lpv-muted)]">
                        {wine.purchaseChannelDetailsEn}
                      </p>
                    ) : null}

                    </div>
                  </div>

                </div>
              </div>


              {/* PHOTO */}
              <div className="flex justify-end">
                <figure className="w-full max-w-[610px]">

                  <div
                    className={
                      wine.slug === "earl-gelin-domaine-des-nugues-beaujolais-villages-2024-2024"
                        ? "relative h-[560px] overflow-hidden bg-[#9A8778] md:h-[690px]"
                        : "overflow-hidden"
                    }
                  >
                    <img
                      src={urlFor(wine.editorialImage!)
                      .width(1600)
                      .fit("max")
                      .url()}
                      alt={
                    wine.editorialImage?.alt ||
                    `${wine.name}${wine.producer?.name ? ` · ${wine.producer.name}` : ""}`
                  }
                      className={
                        wine.slug === "earl-gelin-domaine-des-nugues-beaujolais-villages-2024-2024"
                          ? "absolute left-1/2 top-1/2 block h-auto w-[245%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain md:w-[225%]"
                          : "block h-auto w-full object-cover"
                      }
                    />
                  </div>

                  <figcaption className="mt-2 text-right text-[0.58rem] text-[var(--lpv-muted)]">
                    {wine.editorialImage?.credit ||
                  `${wine.name}${wine.producer?.name ? ` · ${wine.producer.name}` : ""}`}
                  </figcaption>

                </figure>
              </div>

            </div>
          </section>


        </article>


        <article className="mx-auto max-w-[1500px] px-5 pb-0 sm:px-8 md:px-10 lg:px-10">

          {/* REPÈRES */}
          <section className="pb-10 pt-6 md:pb-20 md:pt-4">

            <h2 className="lpv-display text-[2.55rem] leading-[0.92] tracking-[-0.04em] md:text-[clamp(2.9rem,4.3vw,4.3rem)] md:leading-none">
              {wine.beverageType === "cider" ? "Cider at a glance." : "A few things to know."}
            </h2>


            <div className="mt-7 grid border-t border-[var(--lpv-line)] md:mt-12 md:grid-cols-4">

              {/* 01 */}
              <div className="border-b border-[var(--lpv-line)] py-6 md:border-b-0 md:border-r md:px-8 md:py-8 md:first:pl-8">

                <h3 className="lpv-display text-[1.6rem] leading-none tracking-[-0.035em] md:text-[1.8rem]">
                  The profile
                </h3>

                <div className="mt-5 max-w-[290px] space-y-4 md:mt-9 md:space-y-5">

                  <div>
                    <p className="text-[0.64rem] uppercase tracking-[0.18em] text-[var(--lpv-ink)]/60">
                      On the palate
                    </p>
                    <p className="mt-1.5 text-[1.08rem] leading-6 text-[var(--lpv-ink)]">
                      {wineBody == null ? "—" : wineBody <= 2 ? "Light" : wineBody >= 4 ? "Full-bodied" : "Medium-bodied"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[0.64rem] uppercase tracking-[0.18em] text-[var(--lpv-ink)]/60">
                      Sweetness
                    </p>
                    <p className="mt-1.5 text-[1.08rem] leading-6 text-[var(--lpv-ink)]">
                      {wineSweetness == null ? "—" : wineSweetness <= 2 ? "Very low" : wineSweetness >= 4 ? "High" : "Moderate"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[0.64rem] uppercase tracking-[0.18em] text-[var(--lpv-ink)]/60">
                      Freshness
                    </p>
                    <p className="mt-1.5 text-[1.08rem] leading-6 text-[var(--lpv-ink)]">
                      {wineAcidity == null ? "—" : wineAcidity <= 2 ? "Gentle" : wineAcidity >= 4 ? "High" : "Moderate"}
                    </p>
                  </div>

                </div>
              </div>


              {/* 02 */}
              <div className="border-b border-[var(--lpv-line)] py-6 md:border-b-0 md:border-r md:px-8 md:py-8">

                <h3 className="lpv-display text-[1.6rem] leading-none tracking-[-0.035em] md:text-[1.8rem]">
                  In the glass
                </h3>

                <p className="mt-5 max-w-[260px] text-[0.95rem] leading-6 text-[var(--lpv-ink)] md:mt-9 md:text-[1.05rem] md:leading-7">
                  {wine.tastingKeywordsEn?.length
                    ? wine.tastingKeywordsEn.join(" · ")
                    : "—"}
                </p>

              </div>


              {/* 03 */}
              <div className="border-b border-[var(--lpv-line)] py-6 md:border-b-0 md:border-r md:px-8 md:py-8">

                <h3 className="lpv-display text-[1.6rem] leading-none tracking-[-0.035em] md:text-[1.8rem]">
                  {wine.beverageType === "cider" ? "Apple varieties" : "Grape varieties"}
                </h3>

                <p className="mt-5 max-w-[260px] text-[0.95rem] leading-6 text-[var(--lpv-ink)] md:mt-9 md:text-[1.05rem] md:leading-7">
                  {wine.beverageType === "cider"
                    ? (wine.appleVarieties?.length
                        ? wine.appleVarieties.join(" · ")
                        : "—")
                    : (wine.grapes?.length
                        ? wine.grapes
                            .map((grape) => grape.name)
                            .filter(Boolean)
                            .join(" · ")
                        : "—")}
                </p>

              </div>


              {/* 04 */}
              <div className="py-6 md:px-8 md:py-8">

                <h3 className="lpv-display text-[1.6rem] leading-none tracking-[-0.035em] md:text-[1.8rem]">
                  How to enjoy it
                </h3>

                <div className="mt-5 max-w-[280px] space-y-3 text-[0.95rem] leading-[1.5] text-[var(--lpv-ink)] md:mt-9 md:space-y-4 md:text-[1.05rem] md:leading-[1.55]">

                  {wine.servingTemperature ? (
                    <p>
                      Serve chilled at {wine.servingTemperature}.
                    </p>
                  ) : null}

                  <p>
                    {wine.decant
                      ? "Decanting will help it open up."
                      : "No need to decant."}
                  </p>

                  {wine.perfectForEn?.length ? (
                    <p>
                      Great with {wine.perfectForEn.join(", ")}.
                    </p>
                  ) : null}

                </div>

              </div>

            </div>
          </section>

        </article>




      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <article className="mx-auto max-w-[1500px] px-5 pb-24 pt-8 sm:px-8 md:px-12 lg:px-16">
        <div className="flex items-center justify-between gap-6 border-b border-[var(--lpv-line)] pb-5">
          <Link
            href="/en/wines"
            className="text-xs uppercase tracking-[0.22em] text-[var(--lpv-muted)] transition hover:text-[var(--lpv-ink)]"
          >
            ← Back to bottles
          </Link>

          <div className="flex items-center gap-2.5">
            <FavoriteButton wineId={wine._id} size="sm" locale="en" />
            <WineJournalButton wineId={wine._id} locale="en" />
          </div>
        </div>

        <WineHero
          name={wine.name}
          producer={wine.producer?.name}
          producerSlug={wine.producer?.slug}
          country={wine.country?.name}
          region={wine.region?.name}
          appellation={
            wine.beverageType === "cider"
              ? undefined
              : wine.appellation?.name
          }
          color={wine.beverageType === "cider" ? undefined : wine.color}
          vintage={wine.vintage}
          beverageType={wine.beverageType ?? "wine"}
          alcoholFree={wine.alcoholFree ?? false}
          bottleImage={wine.bottleImage}
          locale="en"
        />

        {wine.oneLinerEn ? (
          <section className="border-b border-[var(--lpv-line)] py-16 md:py-24">
            <div className="grid gap-10 md:grid-cols-[0.28fr_0.72fr]">
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                In one sentence
              </p>

              <p className="max-w-5xl text-[clamp(2.2rem,5vw,5rem)] font-medium leading-[1.06] tracking-[-0.035em]">
                {wine.oneLinerEn}
              </p>
            </div>
          </section>
        ) : null}

        <WineRatings
          body={wine.body}
          sweetness={wine.sweetness}
          roundness={wine.roundness}
          locale="en"
        />

        {(wine.tastingKeywordsEn?.length ||
          wine.perfectForEn?.length ||
          wine.grapes?.length ||
          wine.appleVarieties?.length) ? (
          <section className="border-b border-[var(--lpv-line)] py-16 md:py-24">
            <div className="grid gap-14 lg:grid-cols-3">
              <div>
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  What you’ll taste
                </p>

                <div className="mt-7 flex flex-wrap gap-x-3 gap-y-2">
                  {wine.tastingKeywordsEn?.map((item) => (
                    <span
                      key={item}
                      className="border-b border-[var(--lpv-line)] pb-1 text-xl"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  Perfect for
                </p>

                <div className="mt-7 space-y-3">
                  {wine.perfectForEn?.map((item) => (
                    <p
                      key={item}
                      className="border-t border-[var(--lpv-line)] pt-3 text-lg"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  {wine.beverageType === "cider"
                    ? "Apple varieties"
                    : "Grape or blend"}
                </p>

                <div className="mt-7 space-y-3">
                  {wine.beverageType === "cider"
                    ? wine.appleVarieties?.map((apple) => (
                        <p
                          key={apple}
                          className="border-t border-[var(--lpv-line)] pt-3 text-lg"
                        >
                          {apple}
                        </p>
                      ))
                    : wine.grapes?.map((grape) => (
                        <p
                          key={grape.name}
                          className="border-t border-[var(--lpv-line)] pt-3 text-lg"
                        >
                          {grape.name}
                        </p>
                      ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="border-b border-[var(--lpv-line)] py-16 md:py-24">
          <div className="grid gap-14 lg:grid-cols-[0.44fr_0.56fr]">
            <div>
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                Service
              </p>

              <h2 className="lpv-display mt-6 text-5xl leading-[0.9] md:text-6xl">
                At the table.
              </h2>
            </div>

            <div className="grid gap-0 sm:grid-cols-2">
              <div className="border-t border-[var(--lpv-line)] py-5 sm:pr-8">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                  Temperature
                </p>
                <p className="mt-3 text-xl">
                  {wine.servingTemperature || "To be added"}
                </p>
              </div>

              {wine.beverageType !== "cider" ? (
                <div className="border-t border-[var(--lpv-line)] py-5 sm:border-l sm:pl-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                    Decant
                  </p>
                  <p className="mt-3 text-xl">
                    {wine.decant ? "Yes" : "No"}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {(wine.approxPrice ||
          wine.purchaseChannel ||
          wine.purchaseUrl) ? (
          <section className="border-b border-[var(--lpv-line)] py-16 md:py-24">
            <div className="grid gap-14 lg:grid-cols-[0.44fr_0.56fr]">
              <div>
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  Where to find it
                </p>

                {typeof wine.approxPrice === "number" ? (
                  <p className="lpv-display mt-6 text-6xl leading-none md:text-7xl">
                    {wine.approxPrice.toLocaleString("en-CA", {
                      style: "currency",
                      currency: "CAD",
                    })}
                  </p>
                ) : null}

                <p className="mt-4 text-sm text-[var(--lpv-muted)]">
                  Approximate price
                </p>
              </div>

              <div>
                <div className="border-t border-[var(--lpv-line)] py-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                    Where to buy
                  </p>
                  <p className="mt-3 text-xl">
                    {purchaseLabel || "To be added"}
                  </p>

                  {wine.purchaseChannelDetailsEn ? (
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--lpv-muted)]">
                      {wine.purchaseChannelDetailsEn}
                    </p>
                  ) : null}
                </div>

                {checkedDate ? (
                  <div className="border-t border-[var(--lpv-line)] py-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                      Last checked
                    </p>
                    <p className="mt-3 text-base">{checkedDate}</p>
                  </div>
                ) : null}

                {wine.purchaseUrl ? (
                  <div className="border-t border-[var(--lpv-line)] pt-6">
                    <WhereToBuyLink
                      href={wine.purchaseUrl}
                      wineId={wine._id}
                      locale="en"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-3 rounded-full bg-[var(--lpv-ink)] px-7 py-4 text-xs font-medium uppercase tracking-[0.2em] !text-white transition hover:opacity-80"
                    >
                      Where to buy
                      <span>↗</span>
                    </WhereToBuyLink>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {wine.whyWeRecommendEn ? (
          <section className="border-b border-[var(--lpv-line)] py-16 md:py-24">
            <div className="grid gap-10 md:grid-cols-[0.3fr_0.7fr]">
              <div>
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  Why we love it
                </p>


              </div>

              <p className="max-w-4xl text-xl leading-9 md:text-2xl md:leading-10">
                {wine.whyWeRecommendEn}
              </p>
            </div>
          </section>
        ) : null}

        {wine.foodPairings?.length ? (
          <section className="border-b border-[var(--lpv-line)] py-16 md:py-24">
            <div className="grid gap-10 md:grid-cols-[0.3fr_0.7fr]">
              <div>
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  Pairings
                </p>

                <h2 className="lpv-display mt-6 text-5xl leading-[0.9] md:text-6xl">
                  What with?
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {wine.foodPairings.map((pairing) =>
                  pairing.slug && pairing._id ? (
                    <PairingLink
                      key={pairing._id}
                      href={`/en/pairings/${pairing.slug}`}
                      pairingId={pairing._id}
                      locale="en"
                      context="wine_detail"
                      sourceWineId={wine._id}
                      className="border-t border-[var(--lpv-line)] py-4 text-lg transition hover:pl-2"
                    >
                      {pairing.nameEn || pairing.name} →
                    </PairingLink>
                  ) : pairing.slug ? (
                    <Link
                      key={pairing.slug}
                      href={`/en/pairings/${pairing.slug}`}
                      className="border-t border-[var(--lpv-line)] py-4 text-lg transition hover:pl-2"
                    >
                      {pairing.nameEn || pairing.name} →
                    </Link>
                  ) : (
                    <p
                      key={pairing._id || pairing.name}
                      className="border-t border-[var(--lpv-line)] py-4 text-lg"
                    >
                      {pairing.nameEn || pairing.name}
                    </p>
                  )
                )}
              </div>
            </div>
          </section>
        ) : null}

        {wine.tastingNotesEn?.length ? (
          <section className="border-b border-[var(--lpv-line)] py-16 md:py-24">
            <div className="grid gap-10 md:grid-cols-[0.3fr_0.7fr]">
              <div>
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  Tasting
                </p>

                <h2 className="lpv-display mt-6 text-5xl leading-[0.9] md:text-6xl">
                  In detail.
                </h2>
              </div>

              <div className="prose prose-stone max-w-none">
                <PortableText value={wine.tastingNotesEn} />
              </div>
            </div>
          </section>
        ) : null}

        {wine.producer?.name ? (
          <section className="py-16 md:py-24">
            <div className="grid gap-10 md:grid-cols-[0.3fr_0.7fr]">
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                The producer
              </p>

              <div>
                <h2 className="lpv-display text-5xl leading-[0.9] md:text-7xl">
                  {wine.producer.name}
                </h2>

                {wine.producer.slug ? (
                  <Link
                    href={`/en/producers/${wine.producer.slug}`}
                    className="lpv-text-link mt-8 w-fit"
                  >
                    Discover the producer <span>→</span>
                  </Link>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}
      </article>
    </main>
  );
}
