import { createClient } from "@sanity/client";
import fs from "node:fs";

const env = fs.readFileSync(".env.local", "utf8");

for (const line of env.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    process.env[match[1].trim()] =
      match[2].trim().replace(/^['"]|['"]$/g, "");
  }
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const producers = await client.fetch(`
  *[_type == "producer" && lpvPartner != true] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    municipality,
    "region": region->name,
    website,
    instagram,
    "grapes": signatureGrapes[]->name,
    lpvPartner
  }
`);

console.log("\n===== PRODUCTEURS NON-PARTENAIRES =====");
console.log("TOTAL :", producers.length);

for (const p of producers) {
  console.log("\n--------------------------------");
  console.log("NOM       :", p.name);
  console.log("SLUG      :", p.slug);
  console.log("VILLE     :", p.municipality || "ABSENTE");
  console.log("RÉGION    :", p.region || "ABSENTE");
  console.log("CÉPAGES   :", p.grapes?.join(" · ") || "ABSENTS");
  console.log("SITE      :", p.website || "ABSENT");
  console.log("INSTAGRAM :", p.instagram || "ABSENT");
}

console.log("\n===== FIN =====");
