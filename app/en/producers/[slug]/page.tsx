import Link from "next/link";
import PartnerShareButton from "@/components/share/PartnerShareButton";
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
import { internationalProducerCopyEn } from "@/lib/internationalProducerCopyEn";

export const revalidate = 60;

type Producer = {
  lpvPartner?: boolean;
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
  secondaryImage?: SanityImageSource;
  secondaryImageCredit?: string;

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
  oneLinerEn?: string;
  shortBio?: string;
  shortBioEn?: string;
  bio?: PortableTextBlock[];
  bioEn?: PortableTextBlock[];

  approach?: {
    _key?: string;
    title?: string;
    text?: string;
  }[];

  approachEn?: {
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
  whyWeFollowEn?: string;

  openToVisitors?: boolean;
  visitDetails?: string;
  visitDetailsEn?: string;
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
    beverageType?: "wine" | "cider";
    alcoholFree?: boolean;
    color?: string;
    bottleImage?: SanityImageSource;
  editorialImage?: SanityImageSource;
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
    red: "Red",
    white: "White",
    rose: "Rosé",
    orange: "Orange",
    sparkling: "Sparkling",
    fortified: "Fortified",
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
    locale: "en",
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
    Boolean(producer.visitDetailsEn || producer.visitDetails) ||
    Boolean(producer.website) ||
    Boolean(producer.instagram);

  const hasActualVisitInformation =
    typeof producer.openToVisitors === "boolean" ||
    Boolean(producer.address) ||
    Boolean(producer.visitDetailsEn || producer.visitDetails);

  const selectedWines = producer.wines?.slice(0, 5) ?? [];
  const displayedApproach = producer.approachEn || producer.approach || [];

  const quebecVarieties: Record<string, { label: string; names: string[] }> = {
    "cidrerie-michel-jodoin": {
      label: "Apple varieties",
      names: ["Geneva", "McIntosh"],
    },
    "cidrerie-milton": {
      label: "Apple varieties",
      names: ["Cortland", "Spartan", "Empire", "McIntosh", "Lobo", "Paula Red"],
    },
    "cidrerie-du-minot": {
      label: "Apple varieties",
      names: ["McIntosh", "Lobo", "Cortland", "Empire", "Liberty", "Trent"],
    },
    "domaine-lafrance": {
      label: "Apple varieties",
      names: [
        "Jaune transparente", "Vista Bella", "Melba", "Sunrise",
        "Primegold", "Eden", "Diva", "Royal Gala", "Rosinette",
        "Golden Russet", "Fortune", "Passionata",
      ],
    },
    "domaine-saint-basile": {
      label: "Grape varieties",
      names: ["Frontenac noir", "Frontenac gris"],
    },
    "domaine-des-cotes-d-ardoise": {
      label: "Grape varieties",
      names: [
        "Gamay", "Riesling", "Chardonnay", "Gewurztraminer",
        "Maréchal Foch", "De Chaunac", "Chélois", "Lucy Kuhlmann",
        "Seyval blanc", "Aurore", "Acadie blanc",
        "Frontenac blanc", "Vidal",
      ],
    },
    "domaine-du-nival": {
      label: "Grape varieties",
      names: ["Pinot noir", "Gamaret", "Vidal", "Albariño"],
    },
    "val-caudalies": {
      label: "Grape varieties",
      names: [
        "Vidal", "Geisenheim", "Frontenac blanc",
        "Frontenac gris", "Frontenac noir", "Petite Perle",
        "Chambourcin", "De Chaunac", "Maréchal Foch",
        "Lucy Kuhlmann",
      ],
    },
    "vignoble-de-l-orpailleur": {
      label: "Grape varieties",
      names: [
        "Seyval blanc", "Vidal", "Frontenac noir",
        "Frontenac blanc", "Chardonnay", "Cabernet franc",
      ],
    },
  };

  const varieties = quebecVarieties[producer.slug];

  const quebecNonPartnerSlugs = new Set([
    "cidrerie-michel-jodoin",
    "cidrerie-milton",
    "cidrerie-du-minot",
    "domaine-lafrance",
    "domaine-saint-basile",
    "domaine-des-cotes-d-ardoise",
    "domaine-du-nival",
    "val-caudalies",
    "vignoble-de-l-orpailleur",
  ]);

  const useQuebecNonPartnerLayout =
    producer.lpvPartner !== true &&
    quebecNonPartnerSlugs.has(producer.slug);

  const internationalDescription =
    producer.slug ? internationalProducerCopyEn[producer.slug] : undefined;

  const useInternationalLayout =
    producer.lpvPartner !== true &&
    Boolean(internationalDescription);

  const internationalCiderySlugs = new Set([
    "aspall",
    "trabanco",
    "eric-bordelet",
  ]);

  const isInternationalCidery =
    internationalCiderySlugs.has(producer.slug);

  if (useInternationalLayout) {
    return (
      <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
        <AnalyticsEvent
          eventName="producer_view"
          data={{ producerId: producer._id }}
        />

        <article className="lpv-container pb-12 md:pb-16">
          <div className="pt-8 md:pt-10">
            <Link
              href="/en/producers?origine=elsewhere"
              className="inline-flex items-center gap-3 py-2.5 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-50"
            >
              <span aria-hidden="true">←</span>
              <span>Producers</span>
            </Link>
          </div>

          <section className="pb-10 pt-14 md:pb-14 md:pt-16">
            <h1 className="lpv-display max-w-[12ch] text-[clamp(4.6rem,7vw,7.6rem)] leading-[0.84] tracking-[-0.06em]">
              {producer.name}
            </h1>

            <p className="mt-4 translate-x-[6px] text-[0.95rem] leading-6">
              {[
                producer.municipality,
                producer.region?.name,
                producer.country?.name,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </section>

          <section className="border-t border-[var(--lpv-line)] py-12 md:py-16">
            <div className="grid gap-12 md:grid-cols-[minmax(0,1.75fr)_minmax(240px,0.75fr)] md:gap-20">
              <div>
                <p className="mb-6 text-[0.58rem] font-medium uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                  The house
                </p>

                <div className="max-w-[46rem] text-[1.08rem] leading-[1.8]">
                  <p>{internationalDescription}</p>
                </div>
              </div>

              <div className="border-t border-[var(--lpv-line)] pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
                {!isInternationalCidery && producer.signatureGrapes?.length ? (
                  <div>
                    <p className="mb-6 text-[0.58rem] font-medium uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                      Grape varieties
                    </p>

                    <div className="space-y-2 text-[0.95rem] leading-6">
                      {producer.signatureGrapes.map((grape) => (
                        <p key={grape._id}>{grape.name}</p>
                      ))}
                    </div>
                  </div>
                ) : null}

                {isInternationalCidery ? (
                  <div>
                    <p className="mb-6 text-[0.58rem] font-medium uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                      Apple varieties
                    </p>
                  </div>
                ) : null}

                {producer.website ? (
                  <div
                    className={
                      producer.signatureGrapes?.length || isInternationalCidery
                        ? "mt-12"
                        : ""
                    }
                  >
                    <p className="mb-3 text-[0.58rem] font-medium uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                      Official website
                    </p>

                    <ProducerWebsiteLink
                      producerId={producer._id}
                      locale="en"
                      href={producer.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[0.9rem] underline decoration-[0.05em] underline-offset-[4px] transition-opacity hover:opacity-55"
                    >
                      {producer.website
                        .replace(/^https?:\/\//, "")
                        .replace(/^www\./, "")
                        .replace(/\/$/, "")}
                    </ProducerWebsiteLink>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          {selectedWines.length ? (
            <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
              <div className="lpv-container pb-16 pt-10 md:pb-20 md:pt-14">
                <div className="flex items-end justify-between gap-8">
                  <h2 className="lpv-display text-[2.85rem] leading-[0.9] tracking-[-0.05em] md:text-[clamp(3.2rem,4.5vw,5rem)]">
                    Their bottles.
                  </h2>

                  <Link
                    href={`/en/wines?producer=${producer.slug}`}
                    className="hidden items-center gap-3 text-[0.6rem] uppercase tracking-[0.17em] md:inline-flex"
                  >
                    <span>See their bottles</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-2.5 md:mt-12 md:grid-cols-5 md:gap-4">
                  {selectedWines.map((wine) => (
                    <Link
                      key={wine._id}
                      href={`/en/wines/${wine.slug}`}
                      className="group relative flex min-h-[300px] flex-col bg-[var(--lpv-paper-light)] p-3.5 md:min-h-[450px] md:p-6"
                    >
                      <div className="flex h-[205px] w-full items-center justify-center overflow-hidden md:h-[330px]">
                        <BottleStage
                          image={wine.editorialImage ?? wine.bottleImage}
                          alt={wine.name ?? "Bottle"}
                          color={wine.color ?? undefined}
                          variant="card"
                          imageFit="cover"
                          className="h-full w-full transition-transform duration-500 ease-out group-hover:-translate-y-1"
                        />
                      </div>

                      <div className="mt-auto pt-3 md:pt-4">
                        <p className="text-[0.52rem] uppercase tracking-[0.17em] text-[var(--lpv-muted)]">
                          {[formatColor(wine.color), wine.vintage]
                            .filter(Boolean)
                            .join(" · ") || "Bottle"}
                        </p>

                        <h3 className="lpv-display mt-2 min-h-[2.8rem] text-[1.25rem] leading-[0.94] tracking-[-0.035em] md:mt-3 md:min-h-[3.4rem] md:text-[clamp(1.45rem,1.6vw,1.75rem)]">
                          {wine.name}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>

                <Link
                  href={`/en/wines?producer=${producer.slug}`}
                  className="mt-7 inline-flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.17em] md:hidden"
                >
                  <span>See their bottles</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </section>
          ) : null}
        </article>
      </main>
    );
  }

  if (useQuebecNonPartnerLayout) {
    return (
      <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
        <AnalyticsEvent
          eventName="producer_view"
          data={{ producerId: producer._id }}
        />

        <article className="lpv-container pb-5 md:pb-16">
          <div className="pt-8 md:pt-10">
            <Link
              href="/en/producers"
              className="inline-flex items-center gap-3 py-2.5 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-50"
            >
              <span aria-hidden="true">←</span>
              <span>Producers</span>
            </Link>
          </div>

          <section className="pb-6 pt-9 md:pb-12 md:pt-16">
            <h1 className="lpv-display max-w-[11ch] text-[3.85rem] leading-[0.84] tracking-[-0.06em] md:max-w-[12ch] md:text-[clamp(4.6rem,7vw,7.6rem)]">
              {producer.name}
            </h1>

            {producer.municipality || producer.region?.name ? (
              <p className="mt-3 text-[0.82rem] leading-5 text-[var(--lpv-muted)] md:translate-x-[6px] md:text-[0.95rem] md:leading-6 md:text-[var(--lpv-ink)]">
                {[producer.municipality, producer.region?.name]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            ) : null}

            <div className="mt-8 grid border-t border-[var(--lpv-line)] md:mt-12 md:grid-cols-[minmax(0,2.15fr)_minmax(260px,1fr)]">
              <div className="py-6 md:px-9 md:py-10">
                <p className="text-[0.57rem] uppercase tracking-[0.21em] text-[var(--lpv-cocoa)]">
                  The estate
                </p>

                {producer.bioEn?.length ? (
                  <div className="mt-4 max-w-[47rem] text-[0.94rem] leading-7 text-[var(--lpv-ink)] md:mt-6 md:text-[1rem] md:leading-8 [&_p]:mb-4 [&_p:last-child]:mb-0">
                    <PortableText value={producer.bioEn} />
                  </div>
                ) : producer.oneLinerEn ? (
                  <p className="mt-4 max-w-[47rem] text-[0.94rem] leading-7 text-[var(--lpv-ink)] md:mt-6 md:text-[1rem] md:leading-8">
                    {producer.oneLinerEn}
                  </p>
                ) : producer.bio?.length ? (
                  <div className="mt-4 max-w-[47rem] text-[0.94rem] leading-7 text-[var(--lpv-ink)] md:mt-6 md:text-[1rem] md:leading-8 [&_p]:mb-4 [&_p:last-child]:mb-0">
                    <PortableText value={producer.bio} />
                  </div>
                ) : producer.oneLiner ? (
                  <p className="mt-4 max-w-[47rem] text-[0.94rem] leading-7 text-[var(--lpv-ink)] md:mt-6 md:text-[1rem] md:leading-8">
                    {producer.oneLiner}
                  </p>
                ) : null}
              </div>

              {varieties?.names.length ? (
                <div className="border-t border-[var(--lpv-line)] py-6 md:border-l md:border-t-0 md:px-9 md:py-10">
                  <p className="text-[0.57rem] uppercase tracking-[0.21em] text-[var(--lpv-cocoa)]">
                    {varieties.label}
                  </p>
                  <p className="mt-4 text-[0.92rem] leading-7 md:mt-6 md:text-[1rem] md:leading-8">
                    {varieties.names.join(" · ")}
                  </p>
                </div>
              ) : null}
            </div>
          </section>

          {selectedWines.length ? (
            <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
              <div className="lpv-container pb-16 pt-10 md:pb-20 md:pt-14">
                <div className="flex items-end justify-between gap-8">
                  <h2 className="lpv-display text-[2.85rem] leading-[0.9] tracking-[-0.05em] md:text-[clamp(3.2rem,4.5vw,5rem)]">
                    Their bottles.
                  </h2>

                  <Link
                    href={`/en/wines?producer=${producer.slug}`}
                    className="hidden items-center gap-3 text-[0.6rem] uppercase tracking-[0.17em] md:inline-flex"
                  >
                    <span>See their bottles</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-2.5 md:mt-12 md:grid-cols-5 md:gap-4">
                  {selectedWines.map((wine) => (
                    <Link
                      key={wine._id}
                      href={`/en/wines/${wine.slug}`}
                      className="group relative flex min-h-[300px] flex-col bg-[var(--lpv-paper-light)] p-3.5 md:min-h-[450px] md:p-6"
                    >
                      <div className="flex h-[205px] w-full items-center justify-center overflow-hidden md:h-[330px]">
                        <BottleStage
                          image={wine.editorialImage ?? wine.bottleImage}
                          alt={wine.name ?? "Wine bottle"}
                          color={wine.color ?? undefined}
                          variant="card"
                          imageFit="cover"
                          className="h-full w-full transition-transform duration-500 ease-out group-hover:-translate-y-1"
                        />
                      </div>

                      <div className="mt-auto pt-3 md:pt-4">
                        <p className="text-[0.55rem] uppercase tracking-[0.16em] text-[var(--lpv-muted)]">
                          {wine.beverageType === "cider"
                            ? (wine.alcoholFree
                                ? "Cider · Alcohol-free"
                                : "Cider")
                            : ([formatColor(wine.color), wine.vintage]
                                .filter(Boolean)
                                .join(" · ") || "Wine")}
                        </p>
                        <h3 className="mt-2 text-[0.9rem] font-medium leading-snug">
                          {wine.name}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          {hasActualVisitInformation ? (
            <section className="pb-7 pt-7 md:pb-16 md:pt-16">
              <div className="grid gap-8 md:grid-cols-[0.36fr_0.64fr] md:gap-20">
                <div className="md:pl-10">
                  <h2 className="lpv-display max-w-[8ch] text-[clamp(3.2rem,4.5vw,5rem)] leading-[0.9] tracking-[-0.05em]">
                    Visit the estate.
                  </h2>

                  {producer.address ? (
                    <p className="mt-8 max-w-[18rem] text-[0.95rem] leading-7 text-[var(--lpv-muted)]">
                      {producer.address}
                    </p>
                  ) : producer.municipality ? (
                    <p className="mt-8 text-[0.95rem] leading-7 text-[var(--lpv-muted)]">
                      {producer.municipality}, Quebec
                    </p>
                  ) : null}
                </div>

                <div className="md:pt-1">
                  {producer.visitDetailsEn || producer.visitDetails ? (
                    <p className="mb-10 max-w-[48rem] text-[1rem] leading-8 text-[var(--lpv-muted)]">
                      {producer.visitDetailsEn || producer.visitDetails}
                    </p>
                  ) : null}

                  <div className="grid max-w-2xl gap-6 md:grid-cols-1 md:gap-9">
                    {typeof producer.openToVisitors === "boolean" ? (
                      <div>
                        <p className="mb-2 text-[0.55rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                          Estate visits
                        </p>
                        <p className="text-[0.95rem]">
                          {producer.openToVisitors
                            ? producer.reservationRequired
                              ? "By reservation"
                              : "No reservation required"
                            : "Not open to visitors"}
                        </p>
                      </div>
                    ) : null}

                    {producer.website ? (
                      <div>
                        <p className="mb-2 text-[0.55rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                          Official website
                        </p>
                        <ProducerWebsiteLink
                          producerId={producer._id}
                          locale="en"
                          href={producer.website}
                          className="text-[0.95rem] underline decoration-[0.06em] underline-offset-[4px] transition-opacity hover:opacity-55"
                        >
                          {producer.website
                            .replace(/^https?:\/\//, "")
                            .replace(/^www\./, "")
                            .replace(/\/$/, "")}
                        </ProducerWebsiteLink>
                      </div>
                    ) : null}

                    {producer.instagram ? (
                      <div>
                        <p className="mb-2 text-[0.55rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                          Instagram
                        </p>
                        <a
                          href={producer.instagram}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[0.95rem] underline decoration-[0.06em] underline-offset-[4px] transition-opacity hover:opacity-55"
                        >
                          @
                          {producer.instagram
                            .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
                            .replace(/\/$/, "")}
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          {!hasActualVisitInformation &&
          (producer.website || producer.instagram) ? (
            <section className="flex justify-end pb-5 pt-5 md:pb-10 md:pt-10">
              <div className="w-full max-w-[31rem] md:text-right">
                {producer.website ? (
                  <div>
                    <p className="mb-2 text-[0.55rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                      Official website
                    </p>
                    <ProducerWebsiteLink
                      producerId={producer._id}
                      locale="en"
                      href={producer.website}
                      className="text-[0.9rem] underline decoration-[0.05em] underline-offset-[4px] transition-opacity hover:opacity-55"
                    >
                      {producer.website
                        .replace(/^https?:\/\//, "")
                        .replace(/^www\./, "")
                        .replace(/\/$/, "")}
                    </ProducerWebsiteLink>
                  </div>
                ) : null}

                {producer.instagram ? (
                  <div className="mt-6">
                    <p className="mb-2 text-[0.55rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                      Instagram
                    </p>
                    <a
                      href={producer.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[0.9rem] underline decoration-[0.05em] underline-offset-[4px] transition-opacity hover:opacity-55"
                    >
                      @{producer.instagram
                        .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
                        .replace(/\/$/, "")}
                    </a>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          <section className="border-t border-[var(--lpv-line)] pb-2 pt-5 md:border-t-0 md:pb-4 md:pt-5">
            <div className="flex justify-start md:justify-end">
              <p className="max-w-[31rem] text-[0.68rem] leading-[1.55] text-[var(--lpv-muted)] md:text-right md:text-[0.72rem] md:leading-5">
                Do you represent this producer?
                <br />
                For an update or collaboration,{" "}
                <Link
                  href="/en/contact"
                  className="whitespace-nowrap text-[var(--lpv-ink)] underline decoration-[0.05em] underline-offset-[3px] transition-opacity hover:opacity-55"
                >
                  get in touch →
                </Link>
              </p>
            </div>
          </section>
        </article>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <AnalyticsEvent
        eventName="producer_view"
        data={{ producerId: producer._id }}
      />

      <article className="lpv-container pb-5 md:pb-24">
        <div className="flex items-center justify-between pt-8 md:block md:pt-10">
          <Link
            href="/en/producers"
            className="inline-flex items-center gap-3 py-2.5 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-50"
          >
            <span aria-hidden="true">←</span>
            <span>Producers</span>
          </Link>

          <PartnerShareButton
            name={producer.name}
            locale="en"
            profileUrl={`/en/producers/${producer.slug}`}
            kind="producer"
          />
        </div>

        {/* HERO */}
        <section className="pt-5 md:pt-10">
          <div className={`grid gap-7 md:items-center md:gap-14 ${
              producer.slug === "les-pervenches"
                ? "md:grid-cols-[minmax(0,0.41fr)_minmax(0,0.59fr)]"
                : "md:grid-cols-[0.41fr_0.59fr]"
            }`}>

            <div className="md:flex md:min-h-[31rem] md:translate-x-8 md:flex-col md:justify-center md:pr-6">
              <h1
                className={`lpv-display tracking-[-0.065em] ${
                  producer.slug === "les-pervenches"
                    ? "max-w-[8ch] text-[3.9rem] leading-[0.82] md:text-[clamp(4.8rem,6.4vw,7.1rem)] md:leading-[0.79]"
                    : producer.name.length > 18
                      ? `max-w-[9ch] text-[4rem] md:max-w-[8ch] md:text-[clamp(5.5rem,7.4vw,8.2rem)] ${
                          producer.slug === "ferme-cidricole-equinoxe"
                            ? "leading-[0.83]"
                            : producer.slug === "vignoble-de-la-bauge"
                              ? "leading-[0.88]"
                              : "leading-[0.79]"
                        }`
                      : "max-w-[9ch] text-[4.15rem] leading-[0.82] md:max-w-[8ch] md:text-[clamp(5.6rem,7.6vw,8.4rem)] md:leading-[0.79]"
                }`}
              >
                {producer.name}
              </h1>

              {producer.oneLinerEn || producer.oneLiner ? (
                <p className="mt-5 max-w-[30ch] text-[1.05rem] leading-[1.45] tracking-[-0.02em] md:mt-9 md:max-w-[29ch] md:text-[clamp(1.05rem,1.25vw,1.25rem)] md:leading-[1.42]">
                  {producer.oneLinerEn || producer.oneLiner}
                </p>
              ) : producer.shortBioEn || producer.shortBio ? (
                <p className="mt-5 max-w-[30ch] text-[1.05rem] leading-[1.45] md:mt-9 md:max-w-[29ch] md:text-lg md:leading-8">
                  {producer.shortBioEn || producer.shortBio}
                </p>
              ) : null}

              {producer.municipality || producer.region?.name ? (
                <p className="mt-5 text-[0.56rem] uppercase tracking-[0.19em] text-[var(--lpv-muted)] md:mt-8 md:text-[0.6rem]">
                  {producer.municipality
                    ? `${producer.municipality}, Quebec`
                    : producer.region?.name}
                </p>
              ) : null}
            </div>

            {authorizedImageSrc ? (
              <figure>
                <div className="h-[410px] overflow-hidden bg-[var(--lpv-paper-light)] md:h-auto md:aspect-[1.48/1]">
                  <img
                    src={authorizedImageSrc}
                    alt={producer.name}
                    className={`h-full w-full object-cover ${
                      producer.slug === "ferme-cidricole-equinoxe"
                        ? "object-[center_25%]"
                        : ""
                    }`}
                  />
                </div>

                <figcaption className="mt-2 text-right text-[0.55rem] text-[var(--lpv-muted)] md:mt-3 md:text-[0.6rem]">
                  © {producer.slug === "domaine-du-ridge"
                    ? "Le Premier Verre"
                    : producer.mediaCredit || "Emmanuelle Roberge"}
                </figcaption>
              </figure>
            ) : null}

          </div>
        </section>

        {/* LE DOMAINE */}
        {producer.bioEn?.length || producer.bio?.length ? (
          <section className="pb-10 pt-7 md:pb-20 md:pt-10">
            <div className={`grid gap-10 md:gap-12 ${
                ["vignoble-pigeon-hill", "ferme-cidricole-equinoxe"].includes(producer.slug)
                  ? "md:grid-cols-[520px_minmax(0,1fr)]"
                  : "md:grid-cols-[570px_minmax(0,1fr)]"
              }`}>

              <figure className={`hidden w-full md:block ${
                  ["vignoble-pigeon-hill", "ferme-cidricole-equinoxe"].includes(producer.slug)
                    ? "md:w-[520px]"
                    : "md:w-[570px]"
                }`}>
                <div className="h-[520px] w-full overflow-hidden bg-[var(--lpv-paper-light)]">
                  <img
                    src={
                      producer.secondaryImage
                        ? urlFor(producer.secondaryImage).width(1200).fit("max").url()
                        : producer.slug === "domaine-du-ridge"
                          ? "/images/lpv/producteurs/Fouloir%206%20copie.jpg"
                          : "/images/lpv/producteurs/bergeville%20image2.jpg"
                    }
                    alt={`${producer.name} at the estate`}
                    className="h-full w-full object-cover"
                  />
                </div>

              <figcaption className="mt-3 text-right text-[0.6rem] text-[var(--lpv-muted)]">
                    © {producer.secondaryImageCredit ||
                      (producer.slug === "domaine-du-ridge"
                        ? "Domaine du Ridge"
                        : producer.mediaCredit || "Emmanuelle Roberge")}
                  </figcaption>
                </figure>

              <div className="flex items-center pb-8 pt-1 md:pb-0 md:pt-0 md:pl-0">
                <div className="mx-auto max-w-[39rem]">
                  <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                    The estate
                  </p>

                  <div className="lpv-prose mt-5 text-[1rem] leading-[1.75] md:mt-8 md:text-[1.12rem] md:leading-9">
                    <PortableText value={producer.bioEn || producer.bio || []} />
                  </div>
                </div>
              </div>

            </div>

              {/* MOBILE — respiration photo après le texte */}
              <figure className="mt-2 md:hidden">
                <div className="h-[430px] w-full overflow-hidden bg-[var(--lpv-paper-light)]">
                  <img
                    src={
                      producer.secondaryImage
                        ? urlFor(producer.secondaryImage).width(900).fit("max").url()
                        : producer.slug === "domaine-du-ridge"
                          ? "/images/lpv/producteurs/Fouloir%206%20copie.jpg"
                          : "/images/lpv/producteurs/bergeville%20image2.jpg"
                    }
                    alt={`${producer.name} at the estate`}
                    className="h-full w-full object-cover"
                  />
                </div>

                <figcaption className="mt-2 text-right text-[0.55rem] text-[var(--lpv-muted)]">
                  © {producer.secondaryImageCredit ||
                    (producer.slug === "domaine-du-ridge"
                      ? "Domaine du Ridge"
                      : producer.mediaCredit || "Emmanuelle Roberge")}
                </figcaption>
              </figure>

          </section>
        ) : null}

        {/* TROIS CHOSES */}
        {displayedApproach.length ? (
          <section className="pb-12 pt-7 md:pb-28 md:pt-14">

            <h2 className="lpv-display max-w-[12ch] text-[2.9rem] leading-[0.88] tracking-[-0.05em] md:max-w-[15ch] md:text-[clamp(3.2rem,4.4vw,4.9rem)] md:leading-[0.9]">
              Four things to know.
            </h2>

            <div className="mt-8 grid border-t border-[var(--lpv-line)] md:mt-14 md:grid-cols-4">
              {displayedApproach.slice(0, 3).map((item, index) => (
                <article
                  key={item._key || `${item.title}-${index}`}
                  className={`relative flex flex-col py-6 md:min-h-[355px] md:px-9 md:py-11 ${
                    index > 0
                      ? "border-t border-[var(--lpv-line)] md:border-l md:border-t-0"
                      : ""
                  }`}
                >
                  <p className="text-[0.58rem] tracking-[0.2em] text-[var(--lpv-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  {item.title ? (
                    <h3 className="lpv-display mt-4 max-w-[13ch] text-[1.8rem] leading-[0.94] tracking-[-0.04em] md:mt-8 md:min-h-[5.3rem] md:max-w-[11ch] md:text-[clamp(2rem,2.6vw,2.8rem)]">
                      {item.title}
                    </h3>
                  ) : null}

                  {item.text ? (
                    <p className="max-w-sm pt-4 text-[0.88rem] leading-6 text-[var(--lpv-muted)] md:absolute md:left-9 md:right-9 md:top-[225px] md:pt-0">
                      {item.text}
                    </p>
                  ) : null}
                </article>
              ))}
              {producer.signatureGrapes?.length ? (
                <article className="relative flex flex-col border-t border-[var(--lpv-line)] py-6 md:min-h-[355px] md:border-l md:border-t-0 md:px-9 md:py-11">
                  <p className="text-[0.58rem] tracking-[0.2em] text-[var(--lpv-muted)]">
                    04
                  </p>

                  <h3 className="lpv-display mt-4 max-w-[13ch] text-[1.8rem] leading-[0.94] tracking-[-0.04em] md:mt-8 md:min-h-[5.3rem] md:max-w-[10ch] md:text-[clamp(2rem,2.6vw,2.8rem)]">
                    In the vineyard
                  </h3>

                  <p className="max-w-[28ch] pt-4 text-[0.88rem] leading-6 text-[var(--lpv-muted)] md:absolute md:left-9 md:right-9 md:top-[225px] md:pt-0">
                    {producer.signatureGrapes
                      .map((grape) =>
                        grape.name === "Saint-Pépin" ? "St. Pepin" : grape.name
                      )
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </article>
              ) : null}
            </div>

          </section>
        ) : null}

        {/* POURQUOI BERGEVILLE */}
        {producer.whyWeFollowEn || producer.whyWeFollow ? (
          <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[var(--lpv-cocoa)] text-[var(--lpv-paper)]">
            <div className="lpv-container py-10 md:py-20">

              <div className="grid gap-7 md:grid-cols-[0.38fr_0.62fr] md:items-center md:gap-16">

                <div>
                  <h2 className="lpv-display max-w-[9ch] text-[3rem] leading-[0.87] tracking-[-0.055em] md:mt-6 md:max-w-[8ch] md:text-[clamp(3.5rem,4.8vw,5.3rem)]">
                    Why {producer.name.replace(/^Domaine\\s+/i, "")}.
                  </h2>

                  <p className="mt-4 max-w-[30ch] text-[0.85rem] leading-[1.5] opacity-65 md:mt-6 md:max-w-[28ch] md:text-[1rem]">
                    A place here is earned. This is what convinced us.
                  </p>
                </div>

                <p className="max-w-[40ch] text-[1.12rem] leading-[1.4] tracking-[-0.025em] md:text-[clamp(1.55rem,2vw,2.15rem)] md:leading-[1.22] md:tracking-[-0.03em]">
                  {producer.whyWeFollowEn || producer.whyWeFollow}
                </p>

              </div>

            </div>
          </section>
        ) : null}

        {/* 5 BOUTEILLES — SÉLECTION */}
        {selectedWines.length ? (
          <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
            <div className="lpv-container pb-14 pt-10 md:pb-24 md:pt-16">

              <div className="flex items-end justify-between gap-8">
                <div>
                  <h2 className="lpv-display text-[2.85rem] leading-[0.9] tracking-[-0.05em] md:text-[clamp(3.2rem,4.5vw,5rem)]">
                    5 wines to know.
                  </h2>
                </div>

                <Link
                  href={`/en/wines?producer=${producer.slug}`}
                  className="hidden text-[0.6rem] uppercase tracking-[0.17em] md:inline-flex md:items-center md:gap-3"
                >
                  <span>All their bottles</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-2.5 md:mt-12 md:grid-cols-5 md:gap-4">
                {selectedWines.map((wine, index) => (
                  <Link
                    key={wine._id}
                    href={`/en/wines/${wine.slug}`}
                    className="group relative flex min-h-[300px] flex-col bg-[var(--lpv-paper-light)] p-3.5 md:min-h-[450px] md:p-6"
                  >
                    <div className="flex h-[205px] w-full items-center justify-center overflow-hidden md:h-[330px]">
                      <BottleStage
                        image={wine.editorialImage ?? wine.bottleImage}
                        alt={wine.name ?? "Wine bottle"}
                        color={wine.color ?? undefined}
                        variant="card"
                        imageFit="cover"
                        className="h-full w-full transition-transform duration-500 ease-out group-hover:-translate-y-1"
                      />
                    </div>

                    <div className="mt-auto pt-3 md:pt-4">
                      <p className="text-[0.52rem] uppercase tracking-[0.17em] text-[var(--lpv-muted)]">
                        {wine.beverageType === "cider"
                            ? (wine.alcoholFree
                                ? "Cider · Alcohol-free"
                                : "Cider")
                            : ([formatColor(wine.color), wine.vintage]
                                .filter(Boolean)
                                .join(" · ") || "Wine")}
                      </p>

                      <h3 className="lpv-display mt-2 min-h-[2.8rem] text-[1.25rem] leading-[0.94] tracking-[-0.035em] md:mt-3 md:min-h-[3.4rem] md:text-[clamp(1.45rem,1.6vw,1.75rem)]">
                        {wine.name}
                      </h3>
                    </div>
                  </Link>
                ))}

                {producer.slug === "domaine-bergeville" && selectedWines.length === 4 ? (
                  <div className="flex min-h-[190px] items-center px-2 md:min-h-[450px] md:px-8">
                    <div className="max-w-[18rem]">
                      <p className="lpv-display text-[clamp(1.8rem,2.2vw,2.45rem)] leading-[0.95] tracking-[-0.04em]">
                        The next one is coming soon ;)
                      </p>
                    </div>
                  </div>
                ) : null}

                {producer.slug === "pinard-et-filles" && selectedWines.length < 5 ? (
                  <div className="col-span-2 flex min-h-[190px] items-center px-2 md:min-h-[450px] md:px-12">
                    <div className="max-w-[22rem]">
                      <p className="lpv-display text-[clamp(1.8rem,2.2vw,2.45rem)] leading-[0.95] tracking-[-0.04em]">
                        More coming soon ;)
                      </p>
                      <p className="mt-4 max-w-[30ch] text-[0.9rem] leading-[1.5] text-[var(--lpv-muted)]">
                        We’re keeping two spots open. More Pinard et Filles wines will be joining our selection soon.
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              <Link
                href={`/en/wines?producer=${producer.slug}`}
                className="mt-7 inline-flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.17em] md:hidden"
              >
                <span>All their bottles</span>
                <span aria-hidden="true">→</span>
              </Link>

            </div>
          </section>
        ) : ["les-bacchantes", "vignoble-pigeon-hill", "ferme-cidricole-equinoxe"].includes(producer.slug) ? (
          <section className="pb-12 pt-12 md:pb-20 md:pt-20">
            <div>
              <h2 className="lpv-display text-[2.85rem] leading-[0.9] tracking-[-0.05em] md:text-[clamp(3.2rem,4.5vw,5rem)]">
                5 wines to know.
              </h2>

              <div className="mt-12 flex min-h-[280px] items-center justify-center px-6 py-14 text-center md:min-h-[330px]">
                <div>
                  <p className="lpv-display text-[clamp(1.9rem,2.7vw,3rem)] leading-[0.92] tracking-[-0.04em]">
                    We’re working on it ;)
                  </p>

                  <p className="mx-auto mt-5 max-w-[520px] text-[0.95rem] leading-7 text-[var(--lpv-muted)]">
                    Our selection of five {producer.slug === "vignoble-pigeon-hill"
                          ? "Pigeon Hill"
                          : producer.slug === "ferme-cidricole-equinoxe"
                            ? "Équinoxe"
                            : "Les Bacchantes"} cuvées is coming soon.
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* VISITER */}
        {hasVisitInformation ? (
          <section className="pb-5 pt-10 md:pb-16 md:pt-16">
            <div className="grid gap-8 md:grid-cols-[0.36fr_0.64fr] md:gap-20">

              <div className="md:pl-10">
<h2 className="lpv-display max-w-[10ch] text-[3rem] leading-[0.87] tracking-[-0.055em] md:max-w-[9ch] md:text-[clamp(3.7rem,5vw,5.6rem)]">
                  Visit {producer.slug === "domaine-du-ridge"
                      ? producer.name
                      : producer.name.replace(/^Domaine\s+/i, "")}.
                </h2>

                {producer.address ? (
                  <p className="mt-5 max-w-[29ch] text-[0.95rem] leading-6 text-[var(--lpv-ink)]/72 md:mt-8 md:text-[1.05rem] md:leading-7">
                    {producer.address}
                  </p>
                ) : producer.municipality ? (
                  <p className="mt-5 text-sm leading-6 text-[var(--lpv-muted)] md:mt-8">
                    {producer.municipality}, Quebec
                  </p>
                ) : null}
              </div>

              <div className="md:pt-1">

                {producer.visitDetailsEn || producer.visitDetails ? (
                  <p className="mb-7 max-w-2xl text-[0.92rem] leading-7 text-[var(--lpv-muted)] md:mb-12 md:text-[1rem] md:leading-8">
                    {producer.visitDetailsEn || producer.visitDetails}
                  </p>
                ) : null}

                <div className="grid max-w-2xl gap-6 md:grid-cols-1 md:gap-9">

                  {typeof producer.openToVisitors === "boolean" ? (
                    <div>
                      <p className="text-[0.58rem] uppercase tracking-[0.19em] text-[var(--lpv-muted)]">
                        Vineyard visits
                      </p>

                      <p className="mt-2 text-[1rem] tracking-[-0.015em]">
                        {producer.openToVisitors
                          ? producer.reservationRequired
                            ? "Reservation required"
                            : "No reservation required"
                          : "Not open to visitors"}
                      </p>
                    </div>
                  ) : null}

                  {producer.website ? (
                    <div>
                      <p className="text-[0.58rem] uppercase tracking-[0.19em] text-[var(--lpv-muted)]">
                        Official website
                      </p>

                      <ProducerWebsiteLink
                        href={producer.website}
                        producerId={producer._id}
                        locale="en"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-[1rem] tracking-[-0.015em] underline decoration-[0.06em] underline-offset-[5px] transition-opacity hover:opacity-55"
                      >
                        {producer.website
                          .replace(/^https?:\/\//, "")
                          .replace(/^www\./, "")
                          .replace(/\/$/, "")}
                      </ProducerWebsiteLink>
                    </div>
                  ) : null}

                  {producer.instagram ? (
                    <div>
                      <p className="text-[0.58rem] uppercase tracking-[0.19em] text-[var(--lpv-muted)]">
                        Instagram
                      </p>

                      <a
                        href={producer.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-[1rem] tracking-[-0.015em] underline decoration-[0.06em] underline-offset-[5px] transition-opacity hover:opacity-55"
                      >
                        @
                        {producer.instagram
                          .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
                          .replace(/^@/, "")
                          .replace(/\/.*$/, "")}
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
                Explore further
              </p>

              <h2 className="lpv-display mt-5 text-5xl leading-none md:text-7xl">
                Read more.
              </h2>
            </div>

            <div className="grid md:grid-cols-2">
              {producer.articles?.map((article, index) => (
                <Link
                  key={article._id}
                  href={`/en/journal/${article.slug}`}
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
                  href={`/en/guides/${guide.slug}`}
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
