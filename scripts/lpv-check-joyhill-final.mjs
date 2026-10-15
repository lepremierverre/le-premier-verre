import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "czq6bjyu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
});

const ids = [
  "wine-joyhill-rayon-2025",
  "wine-joyhill-raisin-brin-2025",
  "wine-joyhill-pastoral-avant-les-lumieres-2025",
  "wine-joyhill-la-butte-2024",
  "wine-joyhill-le-gosier-2025",
];

const wines = await client.fetch(`
  *[_id in $ids] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    published,
    beverageType,

    "producer": producer->name,

    "grapes": grapes[]->name,

    approxPrice,
    purchaseChannel,
    purchaseUrl,

    oneLiner,
    oneLinerEn,
    tastingKeywords,
    tastingKeywordsEn,
    perfectFor,
    perfectForEn,
    whyWeRecommend,
    whyWeRecommendEn,

    body,
    sweetness,
    roundness,

    servingTemperature,
    decant,
    foodPairings,

    style,
    cellaringPotential,
    alcohol,
    sugar,
    intensity,
    complexity,
    oakInfluence,
    aging,
    soil,
    harvestMethod,
    bottleSize,

    vinification,
    tastingNotes,

    "bottleImage": bottleImage.asset._ref,
    "editorialImage": editorialImage.asset._ref
  }
`, { ids });

console.log("\n===== JOY HILL — ÉTAT RÉEL DANS SANITY =====");

for (const wine of wines) {
  console.log("\n\n====================================");
  console.log(wine.name);
  console.log("====================================");

  const fields = [
    "producer",
    "published",
    "beverageType",
    "grapes",
    "approxPrice",
    "purchaseChannel",
    "purchaseUrl",
    "oneLiner",
    "oneLinerEn",
    "tastingKeywords",
    "tastingKeywordsEn",
    "perfectFor",
    "perfectForEn",
    "whyWeRecommend",
    "whyWeRecommendEn",
    "body",
    "sweetness",
    "roundness",
    "servingTemperature",
    "decant",
    "foodPairings",
    "style",
    "cellaringPotential",
    "alcohol",
    "sugar",
    "intensity",
    "complexity",
    "oakInfluence",
    "aging",
    "soil",
    "harvestMethod",
    "bottleSize",
    "vinification",
    "tastingNotes",
    "bottleImage",
    "editorialImage",
  ];

  for (const field of fields) {
    const value = wine[field];

    const empty =
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);

    console.log(
      empty
        ? `✗ ${field}: VIDE`
        : `✓ ${field}: ${JSON.stringify(value)}`
    );
  }
}

console.log(`\n\nDocuments trouvés : ${wines.length}/5`);
