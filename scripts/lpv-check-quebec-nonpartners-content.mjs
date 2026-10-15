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

const slugs = [
  "cidrerie-michel-jodoin",
  "cidrerie-milton",
  "cidrerie-du-minot",
  "domaine-lafrance",
  "domaine-saint-basile",
  "domaine-des-cotes-d-ardoise",
  "domaine-du-nival",
  "val-caudalies",
  "vignoble-de-l-orpailleur",
];

const producers = await client.fetch(
  `*[
    _type == "producer" &&
    slug.current in $slugs &&
    lpvPartner != true
  ] | order(name asc) {
    name,
    "slug": slug.current,
    shortBio,
    oneLiner,
    "hasBio": defined(bio) && count(bio) > 0,
    "grapes": signatureGrapes[]->name,
    instagram
  }`,
  { slugs }
);

console.log("\n===== CONTENU NON-PARTENAIRES QUÉBEC =====");

for (const p of producers) {
  console.log("\n--------------------------------");
  console.log("NOM :", p.name);
  console.log("SLUG :", p.slug);
  console.log("SHORT BIO :", p.shortBio || "ABSENTE");
  console.log("ONE LINER :", p.oneLiner || "ABSENT");
  console.log("BIO LONGUE :", p.hasBio ? "OUI" : "NON");
  console.log("CÉPAGES :", p.grapes?.join(" · ") || "AUCUN");
  console.log("INSTAGRAM :", p.instagram || "ABSENT");
}

console.log("\nTOTAL TROUVÉ :", producers.length, "/ 9");
