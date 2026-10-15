import { createClient } from "@sanity/client";
import { rankFoodsForWine } from "./lib/pairing-engine.mjs";

const token =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_API_TOKEN;

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token,
});

const wines = await client.fetch(`
  *[
    _type == "wine" &&
    published == true &&
    !(_id in path("drafts.**"))
  ] | order(name asc) {
    _id,
    name,
    beverageType,
    color,
    body,
    acidity,
    tannins,
    sweetness,
    sugar,
    roundness,
    intensity,
    complexity,
    oakInfluence,
    fruitIntensity,
    minerality,
    savory,
    grapes[]->{_id},
    foodPairings[]->{_id, name}
  }
`);

const foods = await client.fetch(`
  *[
    _type == "food" &&
    published == true &&
    !(_id in path("drafts.**"))
  ] {
    _id,
    name,
    category,
    recommendedColors,
    bodyTarget,
    bodyTolerance,
    acidityTarget,
    acidityTolerance,
    sweetnessTarget,
    sweetnessTolerance,
    roundnessTarget,
    roundnessTolerance,
    tanninsMax,
    intensityTarget,
    intensityTolerance,
    oakInfluenceMax,
    fruitIntensityTarget,
    fruitIntensityTolerance,
    mineralityTarget,
    mineralityTolerance,
    complexityTarget,
    complexityTolerance,
    savoryTarget,
    savoryTolerance,
    preferredGrapes[]->{_id},
    wines[]->{_id}
  }
`);

console.log(`\nVins publiés : ${wines.length}`);
console.log(`Accords publiés : ${foods.length}\n`);

let changed = 0;
let insufficient = 0;

for (const wine of wines) {
  const ranked = rankFoodsForWine(wine, foods, 4);

  const current = (wine.foodPairings || []).map((f) => f.name);
  const proposed = ranked.map((r) => r.food.name);

  const same =
    current.length === proposed.length &&
    current.every((name, i) => name === proposed[i]);

  if (!same) changed++;

  if (ranked.length < 4) insufficient++;

  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`${wine.name}`);
  console.log(`Actuels  : ${current.join(" | ") || "—"}`);
  console.log(
    `Proposés : ${
      ranked
        .map(
          (r) =>
            `${r.food.name} (${r.score}${r.editorialBonus ? " ★" : ""})`
        )
        .join(" | ") || "—"
    }`
  );
}

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`RÉSUMÉ`);
console.log(`Vins analysés : ${wines.length}`);
console.log(`Accords disponibles : ${foods.length}`);
console.log(`Vins dont le top 4 changerait : ${changed}`);
console.log(`Vins avec moins de 4 candidats : ${insufficient}`);
console.log(`\nAUCUNE DONNÉE SANITY N'A ÉTÉ MODIFIÉE.\n`);
