import { createClient } from "@sanity/client";

const WRITE = process.argv.includes("--write");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "czq6bjyu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const COUNTRY_QUEBEC = "d9fc0ce6-5f30-4e00-8bc5-63146a0a6407";
const REGION_QUEBEC = "55a9fe9a-b3fe-41d6-8145-6adca1a818a8";

const wines = [
  {
    id: "wine-joyhill-rayon-2025",
    color: "rose",
    vintage: 2025,
  },
  {
    id: "wine-joyhill-raisin-brin-2025",
    color: "red",
    vintage: 2025,
  },
  {
    id: "wine-joyhill-pastoral-avant-les-lumieres-2025",
    color: "white",
    vintage: 2025,
  },
  {
    id: "wine-joyhill-la-butte-2024",
    color: "red",
    vintage: 2024,
  },
  {
    id: "wine-joyhill-le-gosier-2025",
    color: "rose",
    vintage: 2025,
  },
];

console.log("\n===== JOY HILL — BANDES / MÉTADONNÉES =====");
console.log("Mode :", WRITE ? "ÉCRITURE" : "SIMULATION");

for (const wine of wines) {
  const doc = await client.getDocument(wine.id);

  if (!doc) {
    console.log(`\n✗ ABSENT : ${wine.id}`);
    continue;
  }

  const data = {
    color: wine.color,
    vintage: wine.vintage,
    country: {
      _type: "reference",
      _ref: COUNTRY_QUEBEC,
    },
    region: {
      _type: "reference",
      _ref: REGION_QUEBEC,
    },
  };

  console.log(`\n${doc.name}`);
  console.log(`✓ Type : Vin`);
  console.log(`✓ Couleur : ${wine.color}`);
  console.log(`✓ Millésime : ${wine.vintage}`);
  console.log(`✓ Pays : Québec`);
  console.log(`✓ Région : Québec`);
  console.log(
    `✓ Cépages : ${
      (doc.grapes || []).map(g => g._ref).join(", ") || "AUCUN"
    }`
  );

  if (WRITE) {
    await client.patch(wine.id).set(data).commit();
    console.log("✓ Métadonnées enregistrées");
  }
}

console.log(
  WRITE
    ? "\n✓ JOY HILL 5/5 — BANDES CORRIGÉES"
    : "\n✓ SIMULATION — aucune modification"
);
