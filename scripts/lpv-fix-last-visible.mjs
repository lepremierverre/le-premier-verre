import { createClient } from "@sanity/client";

const WRITE = process.argv.includes("--write");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "czq6bjyu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

if (WRITE && !process.env.SANITY_API_WRITE_TOKEN) {
  throw new Error("SANITY_API_WRITE_TOKEN absent.");
}

const fixes = [
  {
    id: "wine-cidrerie-milton-ami-imaginaire",
    set: {
      servingTemperature: "6–8 °C",
      decant: false,
    },
  },
  {
    id: "wine-cidrerie-milton-coccinelle-pomme",
    set: {
      servingTemperature: "6–8 °C",
      decant: false,
    },
  },
  {
    id: "wine-domaine-du-nival-un-de-ces-quatre-2025",
    set: {
      servingTemperature: "14–16 °C",
      decant: true,
    },
  },
  {
    id: "wine-domaine-du-ridge-les-petites-cuvees-pet-nat-orange",
    set: {
      servingTemperature: "6–8 °C",
      decant: false,
    },
  },
];

console.log("\n============================================");
console.log(" LPV — DERNIERS TROUS VISIBLES");
console.log("============================================");
console.log("Mode :", WRITE ? "ÉCRITURE" : "SIMULATION");

for (const fix of fixes) {
  const doc = await client.fetch(
    `*[_type == "wine" && _id == $id][0]{
      _id,
      name,
      servingTemperature,
      decant,
      appleVarieties,
      "producer": producer->name
    }`,
    { id: fix.id }
  );

  if (!doc) {
    console.log(`\n! INTROUVABLE : ${fix.id}`);
    continue;
  }

  console.log(`\n✓ ${doc.producer} → ${doc.name}`);
  console.log("  AVANT :", {
    servingTemperature: doc.servingTemperature,
    decant: doc.decant,
  });
  console.log("  APRÈS :", fix.set);

  if (WRITE) {
    await client.patch(fix.id).set(fix.set).commit();
  }
}

console.log("\n--------------------------------------------");
console.log("Ami Imaginaire → appleVarieties");
console.log("LAISSÉ VIDE volontairement : donnée inconnue.");
console.log("--------------------------------------------");

if (WRITE) {
  console.log("\n✓ Corrections écrites dans Sanity.");
} else {
  console.log("\n✓ SIMULATION seulement.");
  console.log("Pour écrire :");
  console.log("node scripts/lpv-fix-last-visible.mjs --write");
}

console.log("============================================\n");
