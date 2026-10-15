import { createClient } from "@sanity/client";
import fs from "fs";

const env = fs.readFileSync(".env.local", "utf8");

for (const line of env.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const quebecSlugs = [
  "cidrerie-michel-jodoin",
  "cidrerie-milton",
  "cidrerie-du-minot",
  "domaine-lafrance",
  "domaine-saint-basile",
  "domaine-des-cotes-dardoise",
  "domaine-des-cotes-d-ardoise",
  "domaine-du-nival",
  "val-caudalies",
  "vignoble-de-l-orpailleur",
];

const producers = await client.fetch(`
  *[
    _type == "producer" &&
    lpvPartner != true &&
    !(slug.current in $quebecSlugs)
  ] | order(country->name asc, region->name asc, name asc) {
    name,
    "slug": slug.current,
    municipality,
    "country": country->name,
    "region": region->name,
    "appellation": appellation->name,
    oneLiner,
    shortBio,
    bio,
    "grapes": signatureGrapes[]->name,
    website
  }
`, { quebecSlugs });

function portableTextToText(blocks) {
  if (!Array.isArray(blocks)) return "";

  return blocks
    .filter(block => block?._type === "block")
    .map(block =>
      (block.children || [])
        .map(child => child.text || "")
        .join("")
    )
    .join("\n");
}

console.log(`\n===== BIOS FR — ${producers.length} PRODUCTEURS D'AILLEURS =====\n`);

for (const p of producers) {
  console.log("============================================================");
  console.log(`NOM | ${p.name}`);
  console.log(`SLUG | ${p.slug}`);
  console.log(`LIEU | ${[p.municipality, p.region, p.country].filter(Boolean).join(" · ")}`);
  console.log(`APPELLATION | ${p.appellation || ""}`);
  console.log(`CÉPAGES | ${(p.grapes || []).join(" · ")}`);
  console.log(`SITE | ${p.website || ""}`);
  console.log(`ONE LINER | ${p.oneLiner || ""}`);
  console.log(`SHORT BIO | ${p.shortBio || ""}`);
  console.log("BIO |");
  console.log(portableTextToText(p.bio));
  console.log("");
}

console.log("===== FIN =====");
