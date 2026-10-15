import { createClient } from "@sanity/client";

const WRITE = process.argv.includes("--write");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "czq6bjyu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const COUNTRY_CANADA = "d9fc0ce6-5f30-4e00-8bc5-63146a0a6407";
const REGION_QUEBEC = "region-quebec";

const ref = (_ref) => ({ _type: "reference", _ref });

const patches = {
  // CIDRERIE MILTON
  "Ami Imaginaire": {
    style: "Cidre",
    whyWeRecommend:
      "Pour son profil accessible et sa façon de montrer toute la polyvalence du cidre québécois.",
    whyWeRecommendEn:
      "For its approachable profile and its ability to showcase the versatility of Québec cider.",
  },

  "Coccinelle Pomme": {
    style: "Cidre",
    whyWeRecommend:
      "Pour son expression franche de la pomme et son profil convivial, facile à découvrir.",
    whyWeRecommendEn:
      "For its pure apple expression and approachable, easy-to-discover profile.",
  },

  // VINETERRA
  "Cheval tout-blanc classique": {
    style: "Blanc sec",
  },

  "Croix sur la montagne": {
    style: "Vin rouge",
  },

  "Lac sans fond classique": {
    style: "Vin blanc",
  },

  "Magie des semis": {
    style: "Vin blanc",
  },

  "Patte de loup": {
    style: "Vin rouge",
  },

  // PINARD ET FILLES
  "Jane Doe": {
    style: "Vin",
    alcoholFree: false,
  },

  "John Doe": {
    style: "Vin",
    alcoholFree: false,
  },
};

const exactByProducer = [
  {
    producer: "Domaine du Nival",
    name: "Matière à discussion",
    set: { alcoholFree: false },
  },
  {
    producer: "Domaine du Ridge",
    name: "Le Litre du Ridge Rosé",
    set: { alcoholFree: false },
  },
  {
    producer: "Domaine du Ridge",
    name: "Les Petites Cuvées – Pet Nat Orange",
    set: {
      country: ref(COUNTRY_CANADA),
      region: ref(REGION_QUEBEC),
    },
  },

  // BACCHANTES
  ...["B1", "B4", "M1", "R2 – Enfin Pinot Noir", "R3"].map(name => ({
    producer: "Les Bacchantes",
    name,
    set: {
      country: ref(COUNTRY_CANADA),
      region: ref(REGION_QUEBEC),
    },
  })),

  // PIGEON HILL
  ...[
    "Champs Fleuris",
    "Clos Rousseau Marquette",
    "Le Pigeon",
    "Le Rosé",
    "Soir d’Été",
  ].map(name => ({
    producer: "Vignoble Pigeon Hill",
    name,
    set: {
      country: ref(COUNTRY_CANADA),
      region: ref(REGION_QUEBEC),
    },
  })),

  // ORPAILLEUR
  ...["L'Orpailleur Blanc", "L'Orpailleur Brut"].map(name => ({
    producer: "Vignoble de l'Orpailleur",
    name,
    set: {
      beverageType: "wine",
      alcoholFree: false,
    },
  })),
];

console.log("\n========================================");
console.log(" LPV — CORRECTIONS STRUCTURELLES FINALES");
console.log("========================================");
console.log("Mode :", WRITE ? "ÉCRITURE" : "SIMULATION");
console.log("Accords mets-vins : IGNORÉS\n");

if (WRITE && !process.env.SANITY_API_WRITE_TOKEN) {
  throw new Error("SANITY_API_WRITE_TOKEN absent.");
}

let count = 0;

// Corrections par nom
for (const [name, set] of Object.entries(patches)) {
  const docs = await client.fetch(`
    *[_type == "wine" && published == true && name == $name]{
      _id,
      name,
      "producer": producer->name
    }
  `, { name });

  if (!docs.length) {
    console.log(`! INTROUVABLE : ${name}`);
    continue;
  }

  for (const doc of docs) {
    console.log(`✓ ${doc.producer} → ${doc.name}`);
    console.log("  SET :", set);

    if (WRITE) {
      await client.patch(doc._id).set(set).commit();
    }

    count++;
  }
}

// Corrections producteur + nom exact
for (const item of exactByProducer) {
  const doc = await client.fetch(`
    *[
      _type == "wine" &&
      published == true &&
      name == $name &&
      producer->name == $producer
    ][0]{
      _id,
      name,
      "producer": producer->name
    }
  `, {
    name: item.name,
    producer: item.producer,
  });

  if (!doc) {
    console.log(`! INTROUVABLE : ${item.producer} → ${item.name}`);
    continue;
  }

  console.log(`✓ ${doc.producer} → ${doc.name}`);
  console.log("  SET :", item.set);

  if (WRITE) {
    await client.patch(doc._id).set(item.set).commit();
  }

  count++;
}

// JOY HILL : seulement bottleSize + decant
const joy = await client.fetch(`
  *[
    _type == "wine" &&
    published == true &&
    producer._ref == "producer-maison-agricole-joy-hill"
  ]{
    _id,
    name,
    bottleSize,
    decant
  }
`);

console.log("\n===== JOY HILL =====");

for (const doc of joy) {
  const set = {
    bottleSize: "750 ml",
    decant: false,
  };

  console.log(`✓ ${doc.name}`);
  console.log(`  bottleSize: ${JSON.stringify(doc.bottleSize)} → "750 ml"`);
  console.log(`  decant: ${JSON.stringify(doc.decant)} → false`);
  console.log("  foodPairings : laissé intact");

  if (WRITE) {
    await client.patch(doc._id).set(set).commit();
  }

  count++;
}

console.log("\n========================================");

if (WRITE) {
  console.log(`✓ ${count} fiches corrigées.`);
  console.log("✓ Aucun foodPairings modifié.");
} else {
  console.log(`✓ ${count} fiches seraient corrigées.`);
  console.log("✓ SIMULATION — aucune modification.");
  console.log("\nPour écrire :");
  console.log("node scripts/lpv-fix-final-structural.mjs --write");
}

console.log("========================================\n");
