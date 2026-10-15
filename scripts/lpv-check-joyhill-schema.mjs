import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "czq6bjyu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
});

const grapes = await client.fetch(`
  *[_type == "grape"] | order(name asc) {
    _id,
    name,
    "slug": slug.current
  }
`);

console.log("\n===== CÉPAGES PERTINENTS =====");

const wanted = [
  "blau",
  "gruner",
  "gamay",
  "chardonnay",
  "seyval",
  "louise",
  "pepin",
  "vidal"
];

for (const g of grapes) {
  const n = (g.name || "").toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (wanted.some(x => n.includes(x))) {
    console.log(g);
  }
}

console.log("\n===== CHAMPS RÉELS D'UNE FICHE JOY HILL =====");

const wine = await client.getDocument("wine-joyhill-rayon-2025");

console.log(
  Object.keys(wine || {})
    .sort()
    .join("\n")
);
