import Link from "next/link";
import { notFound } from "next/navigation";
import type { SanityImageSource } from "@sanity/image-url";

import { client } from "@/sanity/lib/client";
import BottleStage from "@/components/wine/BottleStage";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import { VIBE_PROFILES } from "@/lib/vibes/profiles";
import {
  buildVibeCandidatePool,
  type VibeRecommendationWine,
  type VibeDimensionScore,
} from "@/lib/vibe-engine";

export const revalidate = 60;

type RecommendationWine = VibeRecommendationWine & {
  _id: string;
  slug: string;
  name: string;
  vintage?: number;
  beverageType?: "wine" | "cider";
  alcoholFree?: boolean;
  color?: string;
  style?: string;
  saqPrice?: number;
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
};

const winesQuery = `
  *[
    _type == "wine" &&
    published == true &&
    defined(slug.current) &&
    !(_id in path("drafts.**"))
  ] {
    _id,
    "slug": slug.current,
    name,
    vintage,
    beverageType,
    alcoholFree,
    color,
    style,
    alcohol,

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

    dnaMetadata
  }
`;

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

function dimensionReason(dimension: VibeDimensionScore): string | null {
  if (
    typeof dimension.value !== "number" ||
    typeof dimension.score !== "number" ||
    dimension.score < 0.8
  ) {
    return null;
  }

  const value = dimension.value;

  switch (dimension.dimension) {
    case "body":
      if (value <= 2) return "Un corps léger, sans lourdeur.";
      if (value >= 4) return "Plus de matière et de présence.";
      return "Un corps équilibré.";

    case "sweetness":
      if (value <= 2) return "Un profil sec et net.";
      if (value >= 4) return "Une douceur assumée.";
      return "Une légère rondeur.";

    case "roundness":
      if (value <= 2) return "Un profil vif et droit.";
      if (value >= 4) return "Une texture ronde et enveloppante.";
      return "Un équilibre entre tension et rondeur.";

    case "acidity":
      if (value >= 4) return "Une fraîcheur vive et nette.";
      if (value <= 2) return "Une acidité douce, plus posée.";
      return "Une fraîcheur bien intégrée.";

    case "tannins":
      if (value <= 2) return "Des tanins discrets.";
      if (value >= 4) return "Une structure tannique bien présente.";
      return "Des tanins présents sans dominer.";

    case "fruitIntensity":
      if (value >= 4) return "Le fruit est bien présent.";
      if (value <= 2) return "Le fruit reste en retrait.";
      return "Un fruit mesuré.";

    case "minerality":
      if (value >= 4) return "Une trame minérale nette.";
      if (value <= 2) return "La minéralité reste discrète.";
      return "La minéralité joue en soutien.";

    case "intensity":
      if (value <= 2) return "Une expression légère et facile.";
      if (value >= 4) return "Une expression aromatique soutenue.";
      return "Une intensité mesurée.";

    case "complexity":
      if (value >= 4) return "Assez de profondeur pour qu’on s’y attarde.";
      if (value <= 2) return "Une lecture simple et immédiate.";
      return "Une complexité juste assez présente.";

    case "oakInfluence":
      if (value <= 2) return "Le bois reste discret.";
      if (value >= 4) return "L’élevage boisé est bien présent.";
      return "Le bois est bien intégré.";

    case "savory":
      if (value >= 4) return "Un registre plus herbacé, épicé ou terreux.";
      if (value <= 2) return "Un profil surtout porté par le fruit.";
      return "Un peu de relief herbacé ou épicé.";

    default:
      return null;
  }
}

function reasonsForCandidate(
  dimensions: VibeDimensionScore[]
): string[] {
  return dimensions
    .filter(
      (dimension) =>
        typeof dimension.value === "number" &&
        typeof dimension.score === "number" &&
        dimension.score >= 0.8
    )
    .sort((a, b) => {
      const contributionA =
        (a.score ?? 0) * a.weight * a.confidence;

      const contributionB =
        (b.score ?? 0) * b.weight * b.confidence;

      return contributionB - contributionA;
    })
    .map(dimensionReason)
    .filter((reason): reason is string => Boolean(reason))
    .slice(0, 3);
}

export default async function AccordPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const vibe = VIBE_PROFILES.find(
    (candidate) => candidate.slug === slug
  );

  if (!vibe) {
    notFound();
  }

  const wines = await client.fetch<RecommendationWine[]>(
    winesQuery
  );

  const pool = buildVibeCandidatePool(wines, vibe);

  const recommendations = pool.eligible
    .slice(0, 4)
    .map((candidate) => ({
      ...candidate.wine,
      affinity: Math.round(candidate.adjustedScore * 100),
      reasons: reasonsForCandidate(candidate.dimensions),
    }));

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">

      {/* FIL D'ARIANE */}
      <section className="border-b border-[var(--lpv-line)]">
        <div className="lpv-container flex items-center py-5">
          <Link
            href="/accords"
            className="border-b border-[var(--lpv-ink)] pb-1 text-xs uppercase tracking-[0.16em] transition-opacity hover:opacity-50"
          >
            ← Tous les moments
          </Link>
        </div>
      </section>

      {/* HERO */}
      <section className="border-b border-[var(--lpv-line)]">
        <div className="lpv-container py-16 md:py-24">
          <div className="grid gap-12 md:grid-cols-[0.7fr_0.3fr] md:items-end">
            <div>
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                Le moment
              </p>

              <h1 className="lpv-display mt-7 max-w-[12ch] text-[clamp(5rem,10vw,10rem)] leading-[0.8] tracking-[-0.045em]">
                {vibe.title}
              </h1>
            </div>

            <div className="md:pb-2">
              {vibe.description ? (
                <p className="max-w-md text-lg leading-8 text-[var(--lpv-muted)] md:text-xl">
                  {vibe.description}
                </p>
              ) : null}

              <p className="mt-7 text-[0.65rem] uppercase tracking-[0.18em] text-[var(--lpv-cocoa)]">
                {pool.diagnostics.eligible} vins compatibles
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* RECOMMANDATIONS */}
      <section className="border-b border-[var(--lpv-line)]">
        <div className="lpv-container py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-[0.3fr_0.7fr] md:items-end">
            <div>
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                Les bouteilles
              </p>

              <h2 className="lpv-display mt-6 text-5xl leading-[0.92] md:text-7xl">
                On ouvre
                <br />
                quoi?
              </h2>
            </div>

            <p className="max-w-xl text-lg leading-8 text-[var(--lpv-muted)]">
              Quatre bouteilles qui passent réellement le test.
              Pas quatre bouteilles qu’on essaie de faire fitter.
            </p>
          </div>

          {recommendations.length ? (
            <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-8 md:gap-y-14">
              {recommendations.map((wine, index) => {
                const location = [
                  wine.region?.name,
                  wine.country?.name,
                ]
                  .filter(Boolean)
                  .join(" · ");

                return (
                  <article
                    key={wine._id}
                    className="group flex min-w-0 flex-col border-b border-[var(--lpv-line)] pt-2 pb-3 md:pt-3 md:pb-3"
                  >
                    <div className="relative">
                      <Link
                        href={`/vins/${wine.slug}`}
                        className="block w-full"
                      >
                        <BottleStage
                          image={wine.bottleImage}
                          alt={wine.name}
                          color={wine.color}
                          variant="card"
                          className="!h-[220px] [&>div]:!h-[190px] transition duration-700 group-hover:scale-[1.025] sm:!h-[250px] sm:[&>div]:!h-[220px] md:!h-[360px] md:[&>div]:!h-[300px]"
                        />
                      </Link>

                      <div className="absolute right-0 top-0 z-20">
                        <FavoriteButton
                          wineId={wine._id}
                          size="sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col pt-4 md:pt-7">
                      <div className="flex min-h-[16px] items-start justify-between gap-2 md:min-h-[18px] md:gap-6">
                        <p className="lpv-kicker min-w-0 text-[0.55rem] leading-4 tracking-[0.16em] text-[var(--lpv-cocoa)] md:text-[0.62rem] md:leading-normal md:tracking-[0.18em]">
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

                        <span className="shrink-0 text-[0.52rem] tracking-[0.12em] text-[var(--lpv-muted)] md:text-[0.6rem] md:tracking-[0.16em]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <Link
                        href={`/vins/${wine.slug}`}
                        className="mt-3 block md:mt-5 md:h-[8.3rem]"
                      >
                        <h3 className="lpv-display min-h-[2.73rem] text-[1.45rem] leading-[0.94] transition-opacity group-hover:opacity-60 md:text-5xl md:leading-[0.92]">
                          {wine.name}
                        </h3>
                      </Link>

                      <div className="min-h-[2.8rem] border-b border-[var(--lpv-line)] pt-3 md:min-h-[2.8rem] md:pt-4">
                        {wine.producer?.name ? (
                          wine.producer.slug ? (
                            <Link
                              href={`/producteurs/${wine.producer.slug}`}
                              className="block w-fit text-xs leading-5 text-[var(--lpv-muted)] transition-opacity hover:opacity-50 md:text-sm"
                            >
                              {wine.producer.name}
                            </Link>
                          ) : (
                            <p className="text-xs leading-5 text-[var(--lpv-muted)] md:text-sm">
                              {wine.producer.name}
                            </p>
                          )
                        ) : null}
                      </div>

                      <div className="mt-auto flex flex-col items-start justify-between gap-2 pt-2 md:flex-row md:items-end md:gap-6 md:pt-2">
                        <div className="min-w-0">
                          {location ? (
                            <p className="text-[0.68rem] leading-5 text-[var(--lpv-muted)] md:text-xs md:leading-6">
                              {location}
                            </p>
                          ) : null}

                          {wine.appellation?.name ? (
                            <p className="text-[0.68rem] leading-5 text-[var(--lpv-muted)] md:text-xs md:leading-6">
                              {wine.appellation.name}
                            </p>
                          ) : null}
                        </div>

                        {typeof wine.saqPrice === "number" ? (
                          <p className="shrink-0 text-sm md:text-base">
                            {wine.saqPrice.toFixed(2).replace(".", ",")} $
                          </p>
                        ) : null}
                      </div>


                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-14 border-t border-[var(--lpv-line)] py-14">
              <p className="lpv-display text-4xl">
                Rien qu’on veut forcer.
              </p>

              <p className="mt-5 max-w-xl text-[var(--lpv-muted)]">
                Aucun vin du répertoire ne passe actuellement cette grille
                avec assez de confiance.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* RETOUR */}
      <section>
        <div className="lpv-container py-12">
          <Link
            href="/accords"
            className="text-sm border-b border-[var(--lpv-ink)] pb-1 transition-opacity hover:opacity-50"
          >
            Voir les 50 moments →
          </Link>
        </div>
      </section>
    </main>
  );
}
