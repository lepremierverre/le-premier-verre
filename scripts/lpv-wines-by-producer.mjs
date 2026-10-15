import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const wines = await client.fetch(`
  *[_type == "wine"] | order(producer->name asc, name asc) {
    _id,
    name,
    "slug": slug.current,
    vintage,
    beverageType,
    color,
    "producer": producer->name,
    "producerSlug": producer->slug.current,
    bottleImage,
    labelImage,
    oneLiner,
    oneLinerEn,
    tastingKeywords,
    tastingKeywordsEn,
    perfectFor,
    perfectForEn,
    body,
    sweetness,
    roundness,
    servingTemperature,
    decant,
    purchaseChannel,
    purchaseUrl,
    "grapes": grapes[]->name
  }
`);

const groups = new Map();

for (const wine of wines) {
  const producer = wine.producer || "⚠️ SANS PRODUCTEUR";
  if (!groups.has(producer)) groups.set(producer, []);
  groups.get(producer).push(wine);
}

console.log("\n===== INVENTAIRE VINS LPV PAR PRODUCTEUR =====\n");

let total = 0;

for (const [producer, items] of groups) {
  console.log(`\n🍷 ${producer} — ${items.length} vin${items.length > 1 ? "s" : ""}`);

  for (const wine of items) {
    total++;

    const missing = [];

    if (!wine.slug) missing.push("slug");
    if (!wine.oneLiner) missing.push("description FR");
    if (!wine.oneLinerEn) missing.push("description EN");
    if (!wine.tastingKeywords?.length) missing.push("dans le verre FR");
    if (!wine.tastingKeywordsEn?.length) missing.push("dans le verre EN");
    if (!wine.grapes?.length && wine.beverageType !== "cider") missing.push("cépages");
    if (wine.body == null) missing.push("corps");
    if (wine.sweetness == null) missing.push("sucre");
    if (wine.roundness == null) missing.push("texture");
    if (!wine.servingTemperature) missing.push("température");
    if (wine.decant == null) missing.push("carafe");
    if (!wine.perfectFor?.length) missing.push("pour l’apprécier FR");
    if (!wine.perfectForEn?.length) missing.push("how to enjoy EN");
    if (!wine.purchaseChannel) missing.push("disponibilité");
    if (!wine.bottleImage) missing.push("bottleImage");

    console.log(
      `   • ${wine.name}${wine.vintage ? ` ${wine.vintage}` : ""} — ${wine.slug || "SANS SLUG"}`
    );

    console.log(
      `     ${missing.length ? `⚠️ ${missing.join(" · ")}` : "✓ données complètes"}`
    );
  }
}

console.log(`\n===== TOTAL — ${total} VINS =====\n`);
