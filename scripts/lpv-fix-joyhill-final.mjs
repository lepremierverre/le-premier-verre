import { createClient } from "@sanity/client";

const WRITE = process.argv.includes("--write");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "czq6bjyu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const grapeDefinitions = {
  "Blaufränkisch": {
    id: "grape-blaufrankisch",
    slug: "blaufrankisch",
  },
  "Grüner Veltliner": {
    id: "grape-gruner-veltliner",
  },
  "Gamay": {
    id: "grape-gamay",
  },
  "Chardonnay": {
    id: "grape-chardonnay",
  },
  "Seyval blanc": {
    id: "grape-seyval-blanc",
  },
  "Louise Swenson": {
    id: "grape-louise-swenson",
  },
  "Saint-Pépin": {
    id: "grape-saint-pepin",
  },
  "Vidal": {
    id: "grape-vidal",
  },
};

const wines = [
  {
    id: "wine-joyhill-rayon-2025",
    grapes: ["Blaufränkisch", "Grüner Veltliner"],
    style: "Rosé frais et épicé",
  },
  {
    id: "wine-joyhill-raisin-brin-2025",
    grapes: ["Gamay", "Blaufränkisch", "Chardonnay"],
    style: "Rouge léger et fruité",
  },
  {
    id: "wine-joyhill-pastoral-avant-les-lumieres-2025",
    grapes: ["Seyval blanc", "Louise Swenson", "Saint-Pépin", "Vidal"],
    style: "Blanc léger et frais",
  },
  {
    id: "wine-joyhill-la-butte-2024",
    grapes: ["Blaufränkisch"],
    style: "Rouge structuré et épicé",
  },
  {
    id: "wine-joyhill-le-gosier-2025",
    grapes: ["Chardonnay", "Gamay"],
    style: "Mousseux rosé",
  },
];

console.log("\n===== JOY HILL — CORRECTIF FINAL =====");
console.log("Mode :", WRITE ? "ÉCRITURE" : "SIMULATION");

// --------------------------------------------------
// 1. BLAUFRÄNKISCH
// --------------------------------------------------

let blau = await client.getDocument("grape-blaufrankisch");

if (!blau) {
  console.log("\n+ Cépage manquant : Blaufränkisch");

  if (WRITE) {
    await client.create({
      _id: "grape-blaufrankisch",
      _type: "grape",
      name: "Blaufränkisch",
      slug: {
        _type: "slug",
        current: "blaufrankisch",
      },
    });

    console.log("✓ Blaufränkisch créé");
  }
} else {
  console.log("\n✓ Blaufränkisch existe déjà");
}

// --------------------------------------------------
// 2. RÉPARATION DES 5 VINS
// --------------------------------------------------

for (const wine of wines) {
  const doc = await client.getDocument(wine.id);

  if (!doc) {
    console.log(`\n✗ Document absent : ${wine.id}`);
    continue;
  }

  console.log(`\n${doc.name}`);

  const refs = wine.grapes.map((name, i) => ({
    _type: "reference",
    _key: `grape-${i}`,
    _ref: grapeDefinitions[name].id,
  }));

  console.log("✓ Cépages :", wine.grapes.join(", "));
  console.log("✓ Style :", wine.style);
  console.log("✓ Canal d'achat : Producteur");
  console.log("✓ URL :", doc.purchaseUrl || "déjà absente");

  if (!WRITE) continue;

  await client
    .patch(wine.id)
    .set({
      grapes: refs,
      style: wine.style,
      purchaseChannel: "Producteur",
    })
    .commit();

  console.log("✓ Fiche corrigée");
}

console.log(
  WRITE
    ? "\n✓ JOY HILL 5/5 — CORRECTION TERMINÉE"
    : "\n✓ SIMULATION VALIDÉE — aucune modification"
);
