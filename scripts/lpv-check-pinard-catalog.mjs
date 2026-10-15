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
  *[_type == "wine" && published == true] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    vintage,
    beverageType,
    color,
    bottleImage,
    producer->{name, "slug": slug.current},
    country->{name, "slug": slug.current},
    region->{name, "slug": slug.current}
  }
`);

const pinard = wines.filter(
  (wine) =>
    wine.producer?.name?.toLowerCase().includes("pinard") ||
    wine.producer?.slug?.toLowerCase().includes("pinard")
);

console.log("");
console.log("===== CATALOGUE =====");
console.log("Vins reçus :", wines.length);

console.log("");
console.log("===== PINARD REÇUS PAR LE CATALOGUE =====");
console.dir(pinard, { depth: null });

console.log("");
console.log("Nombre de Pinard :", pinard.length);
