import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "czq6bjyu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
});

const producers = [
  "Cidrerie Milton",
  "Domaine du Nival",
  "Domaine du Ridge"
];

const docs = await client.fetch(`
  *[
    _type == "wine" &&
    published == true &&
    producer->name in $producers
  ] | order(producer->name asc, name asc) {
    _id,
    name,
    beverageType,
    style,
    color,
    alcohol,
    appleVarieties,
    servingTemperature,
    decant,
    tastingKeywords,
    tastingKeywordsEn,
    oneLiner,
    "producer": producer->name
  }
`, { producers });

let current = "";

for (const d of docs) {
  if (d.producer !== current) {
    current = d.producer;
    console.log(`\n\n===== ${current} =====`);
  }

  console.log(`\n${d.name}`);
  console.dir({
    id: d._id,
    beverageType: d.beverageType,
    style: d.style,
    color: d.color,
    alcohol: d.alcohol,
    appleVarieties: d.appleVarieties,
    servingTemperature: d.servingTemperature,
    decant: d.decant,
    tastingKeywords: d.tastingKeywords,
    oneLiner: d.oneLiner
  }, { depth: null });
}
