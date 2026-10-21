import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { buildTasteDna } from "@/lib/taste-dna";
import { getUserTasteDna } from "@/lib/user-taste-dna";
import {
  buildRecommendationPool,
  type FinalRecommendationCandidate,
  type RecommendationFood,
  type RecommendationWine,
} from "@/lib/recommendation-engine";

export type PairingAlcoholChoice = "with" | "without";

export type PairingRecommendationFood = RecommendationFood & {
  _id: string;
  name?: string;
  nameEn?: string;
  slug: string;
  category?: string;
};

export type PairingRecommendationWine = RecommendationWine & {
  slug: string;
  vintage?: number;
  beverageType?: "wine" | "cider";
  alcoholFree?: boolean;
  style?: string;
  saqPrice?: number;
  bottleImage?: unknown;

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

export const pairingRecommendationFoodQuery = `
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

    "editorialWineIds": wines[]._ref
  }
`;

export const pairingRecommendationWinesQuery = `
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

export async function getPairingRecommendations(
  slug: string,
  alcoholChoice: PairingAlcoholChoice
): Promise<{
  food: PairingRecommendationFood | null;
  candidates: FinalRecommendationCandidate<PairingRecommendationWine>[];
}> {
  const [food, wines] = await Promise.all([
    client.fetch<PairingRecommendationFood | null>(
      pairingRecommendationFoodQuery,
      { slug }
    ),
    client.fetch<PairingRecommendationWine[]>(
      pairingRecommendationWinesQuery
    ),
  ]);

  if (!food) {
    return {
      food: null,
      candidates: [],
    };
  }

  const eligibleWines = wines.filter((wine) =>
    alcoholChoice === "without"
      ? wine.alcoholFree === true
      : wine.alcoholFree !== true
  );

  const { userId } = await auth();

  const tasteDna = userId
    ? await getUserTasteDna(userId)
    : buildTasteDna({
        preferences: {},
        favorites: [],
        journal: [],
      });

  const recommendationPool = buildRecommendationPool(
    eligibleWines,
    food,
    tasteDna
  );

  return {
    food,
    candidates: recommendationPool.candidates,
  };
}
