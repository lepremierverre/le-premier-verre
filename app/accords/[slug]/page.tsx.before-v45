import Link from "next/link";
import { notFound } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/types";
import { PortableText } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { buildTasteDna } from "@/lib/taste-dna";
import BottleStage from "@/components/wine/BottleStage";
import {
  buildRecommendationPool,
  type RecommendationWine,
} from "@/lib/recommendation-engine";
import { buildDynamicMetadata } from "@/lib/seo/dynamic-metadata";

export const revalidate = 60;

type FoodPage = {
  _id: string;
  name: string;
  slug: string;
  category?: string;
  image?: SanityImageSource;

  oneLiner?: string;
  description?: PortableTextBlock[];
  lpvAdvice?: string;
  wineStyles?: string[];
  avoid?: string;
  servingTip?: string;

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
  seoDescription?: string;
};

type Wine = RecommendationWine & {
  slug: string;

  vintage?: number;
  beverageType?: "wine" | "cider";
  alcoholFree?: boolean;
  bottleImage?: SanityImageSource;

  producer?: {
    name?: string;
    slug?: string;
  };

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

  grapes?: Array<{
    _id?: string;
    name?: string;
    slug?: string;
  }>;
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
    "slug": slug.current,
    category,
    image,

    oneLiner,
    description,
    lpvAdvice,
    wineStyles,
    avoid,
    servingTip,

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
    seoDescription
  }
`;

const recommendationWinesQuery = `
  *[
    _type == "wine" &&
    published == true &&
    !(_id in path("drafts.**"))
  ] {
    _id,
    name,
    "slug": slug.current,

    vintage,
    beverageType,
    alcoholFree,
    color,
    style,
    saqPrice,
    bottleImage,

    producer->{
      name,
      "slug": slug.current
    },

    country->{
      name,
      "slug": slug.current
    },

    region->{
      name,
      "slug": slug.current
    },

    appellation->{
      name,
      "slug": slug.current
    },

    body,
    sweetness,
    roundness,
    acidity,
    tannins,
    fruitIntensity,
    minerality,
    intensity,
    complexity,
    oakInfluence,
    savory,

    dnaMetadata,

    grapes[]->{
      _id,
      name,
      "slug": slug.current
    }
  }
`;

function categoryLabel(category?: string) {
  const labels: Record<string, string> = {
    aperitif: "Apéritif",
    fish: "Poisson",
    seafood: "Fruits de mer",
    poultry: "Volaille",
    "red-meat": "Viande",
    charcuterie: "Charcuterie",
    cheese: "Fromage",
    vegetarian: "Végétarien",
    dessert: "Dessert",
    other: "À table",
  };

  return category ? labels[category] ?? category : "Accord";
}

function colorLabel(color?: string | null) {
  const labels: Record<string, string> = {
    red: "Rouge",
    white: "Blanc",
    rose: "Rosé",
    orange: "Orange",
    sparkling: "Effervescent",
    fortified: "Fortifié",
  };

  return color ? labels[color] ?? color : "Vin";
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
    locale: "fr",
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
  const queryParams = await searchParams;
  const alcoholChoice =
    queryParams.alcohol === "without" ? "without" : "with";

  const [food, wines] = await Promise.all([
    client.fetch<FoodPage | null>(foodQuery, { slug }),
    client.fetch<Wine[]>(recommendationWinesQuery),
  ]);

  if (!food) {
    notFound();
  }

  /*
   * Profil anonyme.
   *
   * À ce stade, aucune préférence personnelle n'est injectée.
   * Le classement repose donc essentiellement sur Food DNA,
   * avec les couches éditoriales prévues par le moteur.
   *
   * Plus tard, le Taste DNA réel de l'utilisateur connecté
   * pourra remplacer ce profil sans modifier cette page.
   */
  const anonymousTaste = buildTasteDna({
    preferences: {},
    favorites: [],
    journal: [],
  });

  const eligibleWines = wines.filter((wine) =>
    alcoholChoice === "without"
      ? wine.alcoholFree === true
      : wine.alcoholFree !== true
  );

  const recommendationPool = buildRecommendationPool(
    eligibleWines,
    food,
    anonymousTaste
  );

  const recommendations = recommendationPool.candidates.slice(0, 4);

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
            href="/accords"
            className="border-b border-[var(--lpv-ink)] pb-1 text-xs uppercase tracking-[0.16em] text-[var(--lpv-ink)] transition-opacity hover:opacity-50"
          >
            ← Tous les accords
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
                {food.name}
              </h1>

              {food.oneLiner ? (
                <p className="mt-10 max-w-2xl text-xl leading-9 text-[var(--lpv-muted)] md:text-2xl md:leading-10">
                  {food.oneLiner}
                </p>
              ) : null}
            </div>

            <div className="border-t border-[var(--lpv-line)] py-10 lg:border-t-0 lg:py-14 lg:pl-14">
              <div className="aspect-[4/5] overflow-hidden bg-[var(--lpv-paper-light)]">
                <img
                  src={imageSrc}
                  alt={food.name}
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
                  {food.name}
                </h1>
              </div>

              {food.oneLiner ? (
                <div className="border-t border-[var(--lpv-line)] pt-6 md:border-t-0 md:pb-2">
                  <p className="max-w-md text-lg leading-8 text-[var(--lpv-muted)] md:text-xl md:leading-9">
                    {food.oneLiner}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </section>

      {/* EXPLICATION */}
      {(food.description?.length || food.lpvAdvice) ? (
        <section className="border-b border-[var(--lpv-line)]">
          <div className="lpv-container grid lg:grid-cols-[0.34fr_0.66fr]">
            <div className="py-14 lg:py-20 lg:pr-12">
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                L’accord
              </p>

              <h2 className="lpv-display mt-6 text-5xl leading-[0.92] md:text-6xl">
                Pourquoi
                <br />
                ça marche.
              </h2>
            </div>

            <div className="border-t border-[var(--lpv-line)] py-14 lg:border-t-0 lg:py-20 lg:pl-14">
              {food.description?.length ? (
                <div className="max-w-3xl space-y-6 text-base leading-8 text-[var(--lpv-muted)] [&_strong]:font-semibold [&_strong]:text-[var(--lpv-ink)]">
                  <PortableText value={food.description} />
                </div>
              ) : null}

              {food.lpvAdvice ? (
                <div
                  className={`${food.description?.length ? "mt-14 pt-8 border-t border-[var(--lpv-line)]" : ""}`}
                >
                  <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--lpv-muted)]">
                    En pratique
                  </p>

                  <p className="mt-5 max-w-2xl text-2xl leading-[1.45] md:text-[1.7rem]">
                    {food.lpvAdvice}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* STYLES */}
      {food.wineStyles?.length ? (
        <section className="border-b border-[var(--lpv-line)]">
          <div className="lpv-container py-14 md:py-20">
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Dans le verre
            </p>

            <div className="mt-6 grid gap-8 md:grid-cols-[0.4fr_0.6fr] md:items-start">
              <h2 className="lpv-display text-5xl leading-[0.92] md:text-7xl">
                Ce qu’on
                <br />
                cherche.
              </h2>

              <div className="border-t border-[var(--lpv-line)]">
                {food.wineStyles.map((style, index) => (
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
                La sélection LPV
              </p>

              <h2 className="lpv-display mt-6 text-5xl leading-[0.92] md:text-7xl">
                Quatre bouteilles
                <br />
                pour ce plat.
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-[var(--lpv-muted)]">
              Une sélection choisie parmi les bouteilles de la bibliothèque
              selon leur profil et leur affinité avec ce plat.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 border-b border-[var(--lpv-line)] py-6">
            <Link
              href={`/accords/${slug}?alcohol=with`}
              className={`text-xs uppercase tracking-[0.16em] transition-opacity hover:opacity-50 ${
                alcoholChoice === "with"
                  ? "text-[var(--lpv-ink)] underline underline-offset-8"
                  : "text-[var(--lpv-muted)]"
              }`}
            >
              Avec alcool
            </Link>

            <Link
              href={`/accords/${slug}?alcohol=without`}
              className={`text-xs uppercase tracking-[0.16em] transition-opacity hover:opacity-50 ${
                alcoholChoice === "without"
                  ? "text-[var(--lpv-ink)] underline underline-offset-8"
                  : "text-[var(--lpv-muted)]"
              }`}
            >
              Sans alcool
            </Link>
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
                    <Link href={`/vins/${wine.slug}`}>
                      <div className="relative">
                        <BottleStage
                          image={wine.bottleImage}
                          alt={wine.name ?? "Bouteille"}
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
                              ? "Cidre"
                              : colorLabel(wine.color),
                            wine.alcoholFree ? "Sans alcool" : null,
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
                            Voir →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="py-14">
              <p className="max-w-xl text-base leading-8 text-[var(--lpv-muted)]">
                {alcoholChoice === "without"
                  ? "Aucune bouteille sans alcool ne correspond encore à cet accord. La sélection s’agrandit progressivement."
                  : "La bibliothèque s’agrandit. Les bouteilles correspondant à cet accord seront ajoutées ici."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CONSEILS PRATIQUES */}
      {(food.avoid || food.servingTip) ? (
        <section className="border-b border-[var(--lpv-line)]">
          <div className="lpv-container grid md:grid-cols-2">
            {food.avoid ? (
              <div className="py-14 md:border-r md:border-[var(--lpv-line)] md:py-20 md:pr-16">
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  À éviter
                </p>

                <p className="mt-6 max-w-xl text-xl leading-9">
                  {food.avoid}
                </p>
              </div>
            ) : null}

            {food.servingTip ? (
              <div className="py-14 md:py-20 md:pl-16">
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  Au moment de servir
                </p>

                <p className="mt-6 max-w-xl text-xl leading-9">
                  {food.servingTip}
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
            Un autre repas?
          </p>

          <h2 className="lpv-display mx-auto mt-6 max-w-3xl text-5xl leading-[0.9] md:text-7xl">
            On repart
            <br />
            de l’assiette.
          </h2>

          <Link
            href="/accords"
            className="lpv-button lpv-button-dark mt-9"
          >
            Voir tous les accords
          </Link>
        </div>
      </section>
    </main>
  );
}
