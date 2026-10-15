import Link from "next/link";
import { notFound } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/types";
import { PortableText } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import BottleStage from "@/components/wine/BottleStage";
import RecommendationLink from "@/components/analytics/RecommendationLink";
import RecommendationImpression from "@/components/analytics/RecommendationImpression";
import {
  getPairingRecommendations,
  type PairingRecommendationWine,
} from "@/lib/recommendations/pairing-recommendations";
import { buildDynamicMetadata } from "@/lib/seo/dynamic-metadata";

export const revalidate = 60;

type FoodPage = {
  _id: string;
  name: string;
  nameEn?: string;
  slug: string;
  category?: string;
  image?: SanityImageSource;

  oneLiner?: string;
  oneLinerEn?: string;
  description?: PortableTextBlock[];
  descriptionEn?: PortableTextBlock[];
  lpvAdvice?: string;
  lpvAdviceEn?: string;
  wineStyles?: string[];
  wineStylesEn?: string[];
  avoid?: string;
  avoidEn?: string;
  servingTip?: string;
  servingTipEn?: string;

  recommendedColors?: string[];

  bodyTarget?: number;
  bodyTolerance?: number;

  sweetnessTarget?: number;
  sweetnessTolerance?: number;

  roundnessTarget?: number;
  roundnessTolerance?: number;

  acidityTarget?: number;
  acidityTolerance?: number;

  tanninsMax?: number;

  fruitIntensityTarget?: number;
  fruitIntensityTolerance?: number;

  mineralityTarget?: number;
  mineralityTolerance?: number;

  intensityTarget?: number;
  intensityTolerance?: number;

  complexityTarget?: number;
  complexityTolerance?: number;

  oakInfluenceMax?: number;

  savoryTarget?: number;
  savoryTolerance?: number;

  editorialWineIds?: string[];

  seoTitle?: string;
  seoTitleEn?: string;
  seoDescription?: string;
  seoDescriptionEn?: string;
};


const foodQuery = `
  *[
    _type == "food" &&
    slug.current == $slug &&
    published == true &&
    !(_id in path("drafts.**"))
  ][0] {
    _id,
    name,
    nameEn,
    "slug": slug.current,
    category,
    image,

    oneLiner,
    oneLinerEn,
    description,
    descriptionEn,
    lpvAdvice,
    lpvAdviceEn,
    wineStyles,
    wineStylesEn,
    avoid,
    avoidEn,
    servingTip,
    servingTipEn,

    recommendedColors,

    bodyTarget,
    bodyTolerance,

    sweetnessTarget,
    sweetnessTolerance,

    roundnessTarget,
    roundnessTolerance,

    acidityTarget,
    acidityTolerance,

    tanninsMax,

    fruitIntensityTarget,
    fruitIntensityTolerance,

    mineralityTarget,
    mineralityTolerance,

    intensityTarget,
    intensityTolerance,

    complexityTarget,
    complexityTolerance,

    oakInfluenceMax,

    savoryTarget,
    savoryTolerance,

    "editorialWineIds": wines[]._ref,

    seoTitle,
    seoTitleEn,
    seoDescription,
    seoDescriptionEn
  }
`;


function categoryLabel(category?: string) {
  const labels: Record<string, string> = {
    aperitif: "Aperitif",
    fish: "Fish",
    seafood: "Seafood",
    poultry: "Poultry",
    "red-meat": "Meat",
    charcuterie: "Charcuterie",
    cheese: "Cheese",
    vegetarian: "Vegetarian",
    dessert: "Dessert",
    other: "At the table",
  };

  return category ? labels[category] ?? category : "Pairing";
}

function colorLabel(color?: string | null) {
  const labels: Record<string, string> = {
    red: "Red",
    white: "White",
    rose: "Rosé",
    orange: "Orange",
    sparkling: "Sparkling",
    fortified: "Fortified",
  };

  return color ? labels[color] ?? color : "Wine";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return buildDynamicMetadata({
    entity: "food",
    slug,
    locale: "en",
  });
}

export default async function AccordPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ alcohol?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const alcoholChoice = query.alcohol === "without" ? "without" : "with";

  const [food, recommendationData] = await Promise.all([
    client.fetch<FoodPage | null>(foodQuery, { slug }),
    getPairingRecommendations(slug, alcoholChoice),
  ]);

  if (!food) {
    notFound();
  }

  const recommendations =
    recommendationData.candidates.slice(0, 4);

  const imageSrc = food.image
    ? urlFor(food.image)
        .width(1600)
        .height(1100)
        .fit("crop")
        .url()
    : null;

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      {/* FIL D'ARIANE */}
      <section className="border-b border-[var(--lpv-line)]">
        <div className="lpv-container flex items-center py-5">
          <Link
            href="/en/pairings"
            className="border-b border-[var(--lpv-ink)] pb-1 text-xs uppercase tracking-[0.16em] text-[var(--lpv-ink)] transition-opacity hover:opacity-50"
          >
            ← All pairings
          </Link>
        </div>
      </section>

      {/* HERO */}
      <section className="border-b border-[var(--lpv-line)]">
        {imageSrc ? (
          /* AVEC PHOTO */
          <div className="lpv-container grid lg:grid-cols-[0.58fr_0.42fr]">
            <div className="py-14 pr-0 lg:border-r lg:border-[var(--lpv-line)] lg:py-24 lg:pr-14">
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                {categoryLabel(food.category)}
              </p>

              <h1 className="lpv-display mt-7 max-w-4xl text-[clamp(4.8rem,9vw,9rem)] leading-[0.82]">
                {(food.nameEn || food.name)}
              </h1>

              {food.oneLinerEn ? (
                <p className="mt-10 max-w-2xl text-xl leading-9 text-[var(--lpv-muted)] md:text-2xl md:leading-10">
                  {food.oneLinerEn}
                </p>
              ) : null}
            </div>

            <div className="border-t border-[var(--lpv-line)] py-10 lg:border-t-0 lg:py-14 lg:pl-14">
              <div className="aspect-[4/5] overflow-hidden bg-[var(--lpv-paper-light)]">
                <img
                  src={imageSrc}
                  alt={(food.nameEn || food.name)}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        ) : (
          /* SANS PHOTO */
          <div className="lpv-container py-16 md:py-24">
            <div className="grid gap-10 md:grid-cols-[0.7fr_0.3fr] md:items-end">
              <div>
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  {categoryLabel(food.category)}
                </p>

                <h1 className="lpv-display mt-7 max-w-[10ch] text-[clamp(5.5rem,11vw,11rem)] leading-[0.8] tracking-[-0.045em]">
                  {(food.nameEn || food.name)}
                </h1>
              </div>

              {food.oneLinerEn ? (
                <div className="border-t border-[var(--lpv-line)] pt-6 md:border-t-0 md:pb-2">
                  <p className="max-w-md text-lg leading-8 text-[var(--lpv-muted)] md:text-xl md:leading-9">
                    {food.oneLinerEn}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </section>

      {/* EXPLICATION */}
      {(food.descriptionEn?.length || food.lpvAdviceEn) ? (
        <section className="border-b border-[var(--lpv-line)]">
          <div className="lpv-container grid lg:grid-cols-[0.34fr_0.66fr]">
            <div className="py-14 lg:py-20 lg:pr-12">
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                The pairing
              </p>

              <h2 className="lpv-display mt-6 text-5xl leading-[0.92] md:text-6xl">
                Why it
                <br />
                works.
              </h2>
            </div>

            <div className="border-t border-[var(--lpv-line)] py-14 lg:border-t-0 lg:py-20 lg:pl-14">
              {food.descriptionEn?.length ? (
                <div className="max-w-3xl space-y-6 text-base leading-8 text-[var(--lpv-muted)] [&_strong]:font-semibold [&_strong]:text-[var(--lpv-ink)]">
                  <PortableText value={food.descriptionEn} />
                </div>
              ) : null}

              {food.lpvAdviceEn ? (
                <div
                  className={`${food.descriptionEn?.length ? "mt-14 pt-8 border-t border-[var(--lpv-line)]" : ""}`}
                >
                  <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--lpv-muted)]">
                    In practice
                  </p>

                  <p className="mt-5 max-w-2xl text-2xl leading-[1.45] md:text-[1.7rem]">
                    {food.lpvAdviceEn}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* STYLES */}
      {food.wineStylesEn?.length ? (
        <section className="border-b border-[var(--lpv-line)]">
          <div className="lpv-container py-14 md:py-20">
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              In the glass
            </p>

            <div className="mt-6 grid gap-8 md:grid-cols-[0.4fr_0.6fr] md:items-start">
              <h2 className="lpv-display text-5xl leading-[0.92] md:text-7xl">
                What to
                <br />
                look for.
              </h2>

              <div className="border-t border-[var(--lpv-line)]">
                {food.wineStylesEn.map((style, index) => (
                  <div
                    key={`${style}-${index}`}
                    className="flex items-center justify-between gap-6 border-b border-[var(--lpv-line)] py-5"
                  >
                    <span className="text-lg">
                      {style}
                    </span>

                    <span className="text-xs tracking-[0.16em] text-[var(--lpv-muted)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* RECOMMANDATIONS */}
      <section className="border-b border-[var(--lpv-line)]">
        <div className="lpv-container py-16 md:py-24">
          <div className="flex flex-col gap-6 border-b border-[var(--lpv-line)] pb-7 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                The LPV selection
              </p>

              <h2 className="lpv-display mt-6 text-5xl leading-[0.92] md:text-7xl">
                Four bottles
                <br />
                for this dish.
              </h2>
            </div>

            <div className="max-w-sm">
              <p className="text-sm leading-7 text-[var(--lpv-muted)]">
                A selection chosen from our bottle library
                based on their profile and affinity with this dish.
              </p>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 border-t border-[var(--lpv-line)] pt-5">
                <Link
                  href={`/en/pairings/${slug}?alcohol=with`}
                  className={`text-xs uppercase tracking-[0.16em] transition-opacity hover:opacity-50 ${
                    alcoholChoice === "with"
                      ? "border-b border-[var(--lpv-ink)] pb-1 text-[var(--lpv-ink)]"
                      : "text-[var(--lpv-muted)]"
                  }`}
                >
                  With alcohol
                </Link>

                <Link
                  href={`/en/pairings/${slug}?alcohol=without`}
                  className={`text-xs uppercase tracking-[0.16em] transition-opacity hover:opacity-50 ${
                    alcoholChoice === "without"
                      ? "border-b border-[var(--lpv-ink)] pb-1 text-[var(--lpv-ink)]"
                      : "text-[var(--lpv-muted)]"
                  }`}
                >
                  Alcohol-free
                </Link>
              </div>
            </div>
          </div>

          {recommendations.length ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-4">
              {recommendations.map((candidate, index) => {
                const wine = candidate.wine;

                const location = [
                  wine.region?.name,
                  wine.country?.name,
                ]
                  .filter(Boolean)
                  .join(" · ");

                return (
                  <article
                    key={wine._id}
                    className="group py-9 md:px-5 xl:px-7 xl:first:pl-0 xl:last:pr-0"
                  >
                    <RecommendationImpression
                      recommendationId={wine._id}
                      pairingSlug={slug}
                      alcoholChoice={alcoholChoice}
                      locale="en"
                    />

                    <RecommendationLink
                      href={`/en/wines/${wine.slug}`}
                      recommendationId={wine._id}
                      pairingSlug={slug}
                      alcoholChoice={alcoholChoice}
                      locale="en"
                    >
                      <div className="relative">
                        <BottleStage
                          image={wine.bottleImage as SanityImageSource | undefined}
                          alt={wine.name ?? "Bottle"}
                          color={
                            wine.beverageType === "cider"
                              ? undefined
                              : wine.color ?? undefined
                          }
                          variant="card"
                          className="!h-[330px] transition duration-700 group-hover:scale-[1.025]"
                        />

                        <span className="absolute right-4 top-4 z-20 text-[0.6rem] tracking-[0.16em] text-[var(--lpv-muted)]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="flex min-h-[210px] flex-col pt-6">
                        <p className="lpv-kicker min-h-[1rem] text-[var(--lpv-cocoa)]">
                          {[
                            wine.beverageType === "cider"
                              ? "Cider"
                              : colorLabel(wine.color),
                            wine.alcoholFree ? "Alcohol-free" : null,
                            wine.vintage,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>

                        <h3 className="lpv-display mt-4 min-h-[3.6rem] text-3xl leading-[0.94] transition-opacity group-hover:opacity-60">
                          {wine.name}
                        </h3>

                        <div className="mt-4 min-h-[1.5rem]">
                          {wine.producer?.name ? (
                            <p className="text-sm text-[var(--lpv-muted)]">
                              {wine.producer.name}
                            </p>
                          ) : null}
                        </div>

                        <div className="mt-auto flex min-h-[3.5rem] items-end justify-between gap-4 border-t border-[var(--lpv-line)] pt-4">
                          <p className="text-xs leading-6 text-[var(--lpv-muted)]">
                            {location}
                          </p>

                          <span className="lpv-text-link shrink-0">
                            View →
                          </span>
                        </div>
                      </div>
                    </RecommendationLink>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="py-14">
              <p className="max-w-xl text-base leading-8 text-[var(--lpv-muted)]">
                {alcoholChoice === "without"
                  ? "We don’t have an alcohol-free bottle to recommend with this dish yet. Our selection is growing."
                  : "Our bottle library is growing. Bottles that pair well with this dish will be added here."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CONSEILS PRATIQUES */}
      {(food.avoidEn || food.servingTipEn) ? (
        <section className="border-b border-[var(--lpv-line)]">
          <div className="lpv-container grid md:grid-cols-2">
            {food.avoidEn ? (
              <div className="py-14 md:border-r md:border-[var(--lpv-line)] md:py-20 md:pr-16">
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  What to avoid
                </p>

                <p className="mt-6 max-w-xl text-xl leading-9">
                  {food.avoidEn}
                </p>
              </div>
            ) : null}

            {food.servingTipEn ? (
              <div className="py-14 md:py-20 md:pl-16">
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  When serving
                </p>

                <p className="mt-6 max-w-xl text-xl leading-9">
                  {food.servingTipEn}
                </p>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* SORTIE */}
      <section>
        <div className="lpv-container py-16 text-center md:py-24">
          <p className="lpv-kicker text-[var(--lpv-cocoa)]">
            Another dish?
          </p>

          <h2 className="lpv-display mx-auto mt-6 max-w-3xl text-5xl leading-[0.9] md:text-7xl">
            Start with
            <br />
            the plate.
          </h2>

          <Link
            href="/en/pairings"
            className="lpv-button lpv-button-dark mt-9"
          >
            View all pairings
          </Link>
        </div>
      </section>
    </main>
  );
}
