import { createClient } from "@sanity/client";
import { rankFoodsForWine } from "./lib/pairing-engine.mjs";

const token =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_API_TOKEN;

if (!token) {
  throw new Error("SANITY_API_WRITE_TOKEN manquant.");
}

const WRITE = process.argv.includes("--write");

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

console.log(`Vins publiés : ${wines.length}`);
console.log(`Accords publiés : ${foods.length}`);
console.log(WRITE ? "MODE : ÉCRITURE" : "MODE : DRY-RUN");
console.log("");

let changed = 0;
let unchanged = 0;
let insufficient = 0;

const updates = [];

for (const wine of wines) {
  const ranked = rankFoodsForWine(wine, foods, 4);

  if (ranked.length < 4) {
    insufficient++;
    console.log(`⚠️ ${wine.name} : seulement ${ranked.length} accords`);
    continue;
  }

  const proposedIds = ranked.map((r) => r.food._id);
  const currentIds = (wine.foodPairings || []).map((f) => f._id);

  const same =
    currentIds.length === proposedIds.length &&
    currentIds.every((id, i) => id === proposedIds[i]);

  if (same) {
    unchanged++;
    continue;
  }

  changed++;

  console.log(`→ ${wine.name}`);
  console.log(
    `  ${ranked
      .map((r) => `${r.food.name} (${r.score})`)
      .join(" | ")}`
  );

  updates.push({
    id: wine._id,
    refs: proposedIds.map((id) => ({
      _type: "reference",
      _ref: id,
      _key: id,
    })),
  });
}

console.log("");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(`À modifier : ${changed}`);
console.log(`Déjà conformes : ${unchanged}`);
console.log(`Moins de 4 candidats : ${insufficient}`);

if (!WRITE) {
  console.log("");
  console.log("DRY-RUN terminé.");
  console.log("AUCUNE DONNÉE SANITY N'A ÉTÉ MODIFIÉE.");
  console.log("Utiliser --write seulement après validation.");
  process.exit(0);
}

if (insufficient > 0) {
  throw new Error(
    "Synchronisation annulée : au moins un vin possède moins de 4 accords."
  );
}

if (updates.length === 0) {
  console.log("Aucune modification nécessaire.");
  process.exit(0);
}

let tx = client.transaction();

for (const update of updates) {
  tx = tx.patch(update.id, {
    set: {
      foodPairings: update.refs,
    },
  });
}

const result = await tx.commit();

console.log("");
console.log("✅ SYNCHRONISATION TERMINÉE");
console.log(`✅ ${updates.length} vins mis à jour.`);
console.log(`Transaction Sanity : ${result.transactionId}`);
