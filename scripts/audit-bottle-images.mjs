import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const wines = await client.fetch(`
  *[_type == "wine"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    "imageRef": bottleImage.asset._ref
  }
`);

const parseDimensions = (ref = "") => {
  const match = ref.match(/-(\d+)x(\d+)-/);

  if (!match) return null;

  return {
    width: Number(match[1]),
    height: Number(match[2]),
  };
};

let standard = 0;
let toNormalize = 0;
let missing = 0;
let unknown = 0;

console.log("\n=== AUDIT IMAGES BOUTEILLES LPV ===\n");

for (const wine of wines) {
  if (!wine.imageRef) {
    missing++;
    console.log(`⚪ SANS IMAGE | ${wine.name}`);
    continue;
  }

  const dimensions = parseDimensions(wine.imageRef);

  if (!dimensions) {
    unknown++;
    console.log(`❓ DIMENSIONS INCONNUES | ${wine.name} | ${wine.imageRef}`);
    continue;
  }

  const isStandard =
    dimensions.width === 900 &&
    dimensions.height === 1260;

  if (isStandard) {
    standard++;
    console.log(`✅ STANDARD | ${wine.name} | 900x1260`);
  } else {
    toNormalize++;
    console.log(
      `🔧 À NORMALISER | ${wine.name} | ${dimensions.width}x${dimensions.height}`
    );
  }
}

console.log("\n=== RÉSUMÉ ===");
console.log(`Total vins/cidres : ${wines.length}`);
console.log(`Déjà standard LPV : ${standard}`);
console.log(`À normaliser      : ${toNormalize}`);
console.log(`Sans image        : ${missing}`);
console.log(`Dimensions inconnues : ${unknown}`);
console.log("\n🔒 AUDIT SEULEMENT — aucune modification Sanity.\n");
