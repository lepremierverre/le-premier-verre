import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "czq6bjyu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
});

const producerNames = [
  "Cidrerie Milton",
  "Domaine Vineterra",
  "Domaine du Nival",
  "Domaine du Ridge",
  "Les Bacchantes",
  "Maison agricole Joy Hill",
  "Pinard et Filles",
  "Vignoble Pigeon Hill",
  "Vignoble de l'Orpailleur",
];

const wines = await client.fetch(`
  *[
    _type == "wine" &&
    published == true &&
    producer->name in $producerNames
  ] | order(producer->name asc, name asc) {
    _id,
    name,
    beverageType,
    style,
    alcoholFree,
    bottleSize,
    decant,
    foodPairings,
    country,
    region,
    "producerName": producer->name
  }
`, { producerNames });

const foods = await client.fetch(`
  *[
    _type in ["food", "foodPairing", "pairing"]
  ] | order(name asc) {
    _id,
    _type,
    name,
    title,
    "slug": slug.current
  }
`);

const countries = await client.fetch(`
  *[_type == "country"]{
    _id,
    name,
    "slug": slug.current
  }
`);

const regions = await client.fetch(`
  *[_type == "region"]{
    _id,
    name,
    "slug": slug.current
  }
`);

console.log("\n===== RÉFÉRENCES QUÉBEC =====");

console.log("\nPAYS :");
for (const x of countries.filter(x =>
  /québec|quebec|canada/i.test(`${x.name || ""} ${x.slug || ""}`)
)) {
  console.log(x);
}

console.log("\nRÉGIONS :");
for (const x of regions.filter(x =>
  /québec|quebec/i.test(`${x.name || ""} ${x.slug || ""}`)
)) {
  console.log(x);
}

console.log("\n===== JOY HILL — ACCORDS ACTUELS =====");

for (const w of wines.filter(x => x.producerName === "Maison agricole Joy Hill")) {
  console.log(`\n${w.name}`);
  console.dir({
    id: w._id,
    bottleSize: w.bottleSize,
    decant: w.decant,
    foodPairings: w.foodPairings
  }, { depth: null });
}

console.log("\n===== DOCUMENTS D'ACCORDS DISPONIBLES =====");

if (!foods.length) {
  console.log("Aucun document trouvé avec les types food / foodPairing / pairing.");
} else {
  for (const f of foods) console.log(f);
}

console.log("\n===== AUTRES 53 CORRECTIONS — ÉTAT ACTUEL =====");

for (const w of wines.filter(x => x.producerName !== "Maison agricole Joy Hill")) {
  const missing = [];

  if (!w.style) missing.push("style");
  if (w.alcoholFree === undefined || w.alcoholFree === null) missing.push("alcoholFree");
  if (!w.beverageType) missing.push("beverageType");
  if (!w.country?._ref) missing.push("country");
  if (!w.region?._ref) missing.push("region");

  if (missing.length) {
    console.log(
      `• ${w.producerName} → ${w.name} → ${missing.join(", ")}`
    );
  }
}

console.log("\n===== FIN PREFLIGHT =====\n");
