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
    published,
    "producer": producer->name
  }
`);

const visible = wines.filter((w) => w.published === true);
const hidden = wines.filter((w) => w.published !== true);

console.log("");
console.log("===== AUDIT PUBLICATION VINS =====");
console.log("TOTAL :", wines.length);
console.log("PUBLIÉS :", visible.length);
console.log("NON PUBLIÉS :", hidden.length);

console.log("");
console.log("===== NON PUBLIÉS =====");

for (const wine of hidden) {
  console.log(
    `${wine.producer || "SANS PRODUCTEUR"} | ${wine.name} | published=${String(wine.published)} | ${wine.slug}`
  );
}

console.log("");
console.log("===== PINARD ET FILLES =====");

for (const wine of wines.filter((w) => w.producer === "Pinard et Filles")) {
  console.log(
    `${wine.name} | published=${String(wine.published)} | ${wine.slug}`
  );
}
